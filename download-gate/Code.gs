/**
 * 일신오토클레이브 자료 다운로드 — 고객정보 수집 백엔드 (Google Apps Script)
 *
 * 이 스크립트는 구글 시트에 "확장 프로그램 > Apps Script"로 붙여서 사용합니다.
 * 설치 방법은 SETUP.md 참고.
 *
 * 시트 구성 (setup() 실행 시 자동 생성)
 *   - 리드        : 고객 1명당 1행. 재방문 토큰, 동의 여부, 마지막 다운로드일
 *   - 다운로드기록 : 다운로드 1회당 1행
 *   - 파일목록    : 사이트 버튼의 파일키 ↔ 구글 드라이브 파일 연결
 */

// ───────────────────────── 설정 ─────────────────────────
var CONFIG = {
  // 새 고객이 등록되면 알림 메일을 받을 주소 (여러 명은 쉼표로). 비워두면 알림 안 보냄.
  NOTIFY_EMAIL: '',
  // 개인정보 보유 기간(일). 마지막 다운로드일로부터 이 기간이 지나면 자동 삭제.
  RETENTION_DAYS: 365,
  // 같은 이메일로 1분 안에 보낼 수 있는 최대 요청 수 (도배 방지)
  RATE_LIMIT_PER_MIN: 10
};

var SHEET_LEADS = '리드';
var SHEET_LOG = '다운로드기록';
var SHEET_FILES = '파일목록';

var LEAD_HEADERS = ['토큰', '등록일시', '구분', '회사·기관명', '담당자명', '이메일', '휴대전화번호',
                    '개인정보 동의(필수)', '마케팅 수신 동의(선택)', '마지막 다운로드', '다운로드 횟수'];
var LOG_HEADERS = ['일시', '회사·기관명', '담당자명', '이메일', '파일키', '파일명', '요청 페이지', '토큰'];
var FILE_HEADERS = ['파일키', '파일명', '드라이브 파일 ID 또는 URL', '사용(Y/N)'];

// ───────────────────────── 최초 1회 실행 ─────────────────────────
/** Apps Script 편집기에서 이 함수를 한 번 실행하세요. 시트와 자동 삭제 트리거를 만듭니다. */
function setup() {
  var ss = SpreadsheetApp.getActive();
  ensureSheet_(ss, SHEET_LEADS, LEAD_HEADERS);
  ensureSheet_(ss, SHEET_LOG, LOG_HEADERS);
  var files = ensureSheet_(ss, SHEET_FILES, FILE_HEADERS);
  if (files.getLastRow() === 1) {
    // 사이트 다운로드 페이지(docs/download/index.md)의 data-gate-file 값과 같아야 합니다.
    // C열에 드라이브 파일 ID를 넣기 전까지는 '자료 요청'으로 접수됩니다.
    var seed = [
      ['manual-a', 'ISA-W70-6000 운전 매뉴얼 (A형)'],
      ['manual-b', 'ISA-W70-6000 운전 매뉴얼 (B형)'],
      ['manual-indicator-b', '압력 지시계 취급설명서 (B형)'],
      ['drawing-layout', 'Layout Drawing'],
      ['drawing-pfd', 'Process Flow Diagram'],
      ['drawing-pid', 'P&ID'],
      ['drawing-electric', 'Electric Drawing'],
      ['report-pressure-test', 'Pressure Test Report'],
      ['certificate', '인증서 (CE / KCs 등)'],
      ['parts-list', 'Parts List'],
      ['catalogues', 'Catalogues'],
      ['form-daily-check', '일상 점검표'],
      ['form-consumables', '소모품 교체 이력']
    ];
    files.getRange(2, 1, seed.length, 4).setValues(seed.map(function (r) { return [r[0], r[1], '', 'Y']; }));
    files.autoResizeColumns(1, 4);
  }
  // 매일 새벽 3시 보유기간 지난 개인정보 삭제
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'purgeExpired') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('purgeExpired').timeBased().everyDays(1).atHour(3).create();
}

function ensureSheet_(ss, name, headers) {
  var sh = ss.getSheetByName(name) || ss.insertSheet(name);
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, headers.length).setValues([headers])
      .setFontWeight('bold').setBackground('#eef1f8');
    sh.setFrozenRows(1);
    sh.autoResizeColumns(1, headers.length);
  }
  return sh;
}

// ───────────────────────── 웹 요청 처리 ─────────────────────────
function doGet() {
  return json_({ ok: true, service: 'download-gate' });
}

function doPost(e) {
  try {
    var req = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (req.action === 'register') return json_(handleRegister_(req));
    if (req.action === 'download') return json_(handleDownload_(req));
    return json_({ ok: false, code: 'BAD_ACTION', message: '잘못된 요청입니다.' });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, code: 'SERVER_ERROR', message: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' });
  }
}

/** 처음 다운로드: 고객정보 등록 + 파일 링크 반환 */
function handleRegister_(req) {
  // 허니팟: 사람에게는 안 보이는 칸. 채워져 있으면 봇으로 보고 조용히 무시
  if (req.website) return { ok: false, code: 'REJECTED', message: '요청을 처리할 수 없습니다.' };

  var lead = req.lead || {};
  var v = {
    type: clean_(lead.type, 10),
    company: clean_(lead.company, 100),
    name: clean_(lead.name, 50),
    email: clean_(lead.email, 120).toLowerCase(),
    phone: clean_(lead.phone, 30).replace(/[^0-9+\-\s]/g, ''),
    consentRequired: lead.consentRequired === true,
    consentMarketing: lead.consentMarketing === true
  };

  var errors = [];
  if (v.type !== '기업' && v.type !== '개인') errors.push('구분');
  if (v.type === '기업' && !v.company) errors.push('회사·기관명');
  if (!v.name) errors.push('담당자명');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email)) errors.push('이메일');
  if (v.phone.replace(/\D/g, '').length < 9) errors.push('휴대전화번호');
  if (!v.consentRequired) errors.push('개인정보 수집·이용 동의');
  if (errors.length) return { ok: false, code: 'INVALID', fields: errors, message: '입력값을 확인해 주세요: ' + errors.join(', ') };

  if (!rateOk_(v.email)) return { ok: false, code: 'RATE_LIMIT', message: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.' };

  var file = findFile_(req.fileKey);
  if (!file) return { ok: false, code: 'NO_FILE', message: '자료를 찾을 수 없습니다. 관리자에게 문의해 주세요.' };

  var now = new Date();
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  var token, existing;
  try {
    var sh = SpreadsheetApp.getActive().getSheetByName(SHEET_LEADS);
    existing = findLeadByEmail_(sh, v.email);
    if (existing) {
      // 같은 이메일로 다시 등록하면 정보 갱신 후 기존 토큰 재사용
      token = existing.token;
      sh.getRange(existing.row, 3, 1, 9).setValues([[
        v.type, safe_(v.company), safe_(v.name), safe_(v.email), safe_(v.phone),
        'Y ' + fmt_(now), v.consentMarketing ? 'Y ' + fmt_(now) : 'N',
        now, (Number(existing.count) || 0) + 1
      ]]);
    } else {
      token = Utilities.getUuid();
      sh.appendRow([token, now, v.type, safe_(v.company), safe_(v.name), safe_(v.email), safe_(v.phone),
                    'Y ' + fmt_(now), v.consentMarketing ? 'Y ' + fmt_(now) : 'N', now, 1]);
    }
    log_(now, v, file, req.page, token);
  } finally {
    lock.releaseLock();
  }

  if (CONFIG.NOTIFY_EMAIL && (!existing || file.pending)) notify_(v, file);
  return result_(file, { token: token, name: v.name });
}

/** 파일이 등록돼 있으면 링크, 아직 없으면 '요청 접수' 응답 */
function result_(file, extra) {
  var out = { ok: true, fileName: file.name };
  if (file.pending) out.pending = true; else out.url = file.url;
  for (var k in extra) out[k] = extra[k];
  return out;
}

/** 재방문 다운로드: 저장된 토큰 확인 후 파일 링크 반환 */
function handleDownload_(req) {
  var token = clean_(req.token, 60);
  if (!token) return { ok: false, code: 'NEED_FORM' };

  var file = findFile_(req.fileKey);
  if (!file) return { ok: false, code: 'NO_FILE', message: '자료를 찾을 수 없습니다. 관리자에게 문의해 주세요.' };

  var now = new Date();
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sh = SpreadsheetApp.getActive().getSheetByName(SHEET_LEADS);
    var lead = findLeadByToken_(sh, token);
    // 토큰이 없거나(삭제됨) 보유기간이 지났으면 다시 입력받기
    if (!lead || daysSince_(lead.last, now) > CONFIG.RETENTION_DAYS) return { ok: false, code: 'NEED_FORM' };
    if (!rateOk_(lead.email)) return { ok: false, code: 'RATE_LIMIT', message: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.' };
    sh.getRange(lead.row, 10, 1, 2).setValues([[now, (Number(lead.count) || 0) + 1]]);
    log_(now, lead, file, req.page, token);
  } finally {
    lock.releaseLock();
  }
  if (CONFIG.NOTIFY_EMAIL && file.pending) notify_(lead, file);
  return result_(file, { name: lead.name });
}

// ───────────────────────── 개인정보 자동 삭제 ─────────────────────────
/** 마지막 다운로드일로부터 보유기간이 지난 고객정보와 다운로드 기록을 삭제 */
function purgeExpired() {
  var ss = SpreadsheetApp.getActive();
  var now = new Date();
  var leads = ss.getSheetByName(SHEET_LEADS);
  var expiredTokens = {};
  var data = leads.getDataRange().getValues();
  for (var i = data.length - 1; i >= 1; i--) {
    var last = data[i][9] || data[i][1];
    if (daysSince_(last, now) > CONFIG.RETENTION_DAYS) {
      expiredTokens[data[i][0]] = true;
      leads.deleteRow(i + 1);
    }
  }
  var log = ss.getSheetByName(SHEET_LOG);
  var rows = log.getDataRange().getValues();
  for (var j = rows.length - 1; j >= 1; j--) {
    if (expiredTokens[rows[j][7]] || daysSince_(rows[j][0], now) > CONFIG.RETENTION_DAYS) log.deleteRow(j + 1);
  }
}

// ───────────────────────── 내부 함수 ─────────────────────────
function findFile_(key) {
  key = clean_(key, 80);
  if (!key) return null;
  var rows = SpreadsheetApp.getActive().getSheetByName(SHEET_FILES).getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).trim() === key && String(rows[i][3]).trim().toUpperCase() !== 'N') {
      var name = String(rows[i][1]) || key;
      var src = String(rows[i][2]).trim();
      // 파일이 아직 없으면 '자료 요청'으로 접수 (고객정보는 저장, 담당자에게 알림)
      if (!src || src.indexOf('여기에') === 0) return { key: key, name: name, pending: true };
      var url = /^https?:\/\//.test(src) ? src : 'https://drive.google.com/uc?export=download&id=' + encodeURIComponent(src);
      return { key: key, name: name, url: url };
    }
  }
  return null;
}

function findLeadByToken_(sh, token) { return findLead_(sh, 0, token); }
function findLeadByEmail_(sh, email) { return findLead_(sh, 5, email); }
function findLead_(sh, col, value) {
  var rows = sh.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][col]).toLowerCase() === String(value).toLowerCase()) {
      return { row: i + 1, token: rows[i][0], type: rows[i][2], company: rows[i][3], name: rows[i][4],
               email: rows[i][5], phone: rows[i][6], consentMarketing: String(rows[i][8]).charAt(0) === 'Y',
               last: rows[i][9] || rows[i][1], count: rows[i][10] };
    }
  }
  return null;
}

function log_(now, who, file, page, token) {
  SpreadsheetApp.getActive().getSheetByName(SHEET_LOG).appendRow([
    now, safe_(who.company), safe_(who.name), safe_(who.email), file.key,
    file.pending ? file.name + ' (파일 미등록·요청 접수)' : file.name, safe_(clean_(page, 300)), token
  ]);
}

function notify_(v, file) {
  try {
    MailApp.sendEmail({
      to: CONFIG.NOTIFY_EMAIL,
      subject: file.pending
        ? '[자료 요청] ' + file.name + ' — ' + (v.company || v.name)
        : '[자료 다운로드] 신규 고객: ' + (v.company || v.name),
      body: (file.pending
        ? '아직 파일이 등록되지 않은 자료를 요청했습니다. 고객에게 자료를 보내주시고, 시트 파일목록에 드라이브 파일 ID를 등록해 주세요.\n\n'
        : '새 고객이 자료를 다운로드했습니다.\n\n') +
            '구분: ' + v.type + '\n회사·기관명: ' + (v.company || '-') + '\n담당자명: ' + v.name +
            '\n이메일: ' + v.email + '\n휴대전화: ' + v.phone +
            '\n마케팅 수신 동의: ' + (v.consentMarketing ? '예' : '아니오') +
            '\n자료: ' + file.name + '\n\n전체 목록: ' + SpreadsheetApp.getActive().getUrl()
    });
  } catch (err) { console.error('알림 메일 실패', err); }
}

function rateOk_(email) {
  var cache = CacheService.getScriptCache();
  var k = 'rl_' + Utilities.base64EncodeWebSafe(email).slice(0, 200);
  var n = Number(cache.get(k) || 0) + 1;
  cache.put(k, String(n), 60);
  return n <= CONFIG.RATE_LIMIT_PER_MIN;
}

function clean_(s, max) { return String(s == null ? '' : s).replace(/[\u0000-\u001f]/g, '').trim().slice(0, max); }
/** 시트 수식 주입 방지: =, +, -, @ 로 시작하면 앞에 ' 를 붙임 */
function safe_(s) { s = String(s == null ? '' : s); return /^[=+\-@]/.test(s) ? "'" + s : s; }
function fmt_(d) { return Utilities.formatDate(d, 'Asia/Seoul', 'yyyy-MM-dd'); }
function daysSince_(d, now) { var t = new Date(d).getTime(); return isNaN(t) ? 0 : (now.getTime() - t) / 86400000; }
function json_(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
