/*!
 * download-gate.js — 자료 다운로드 전 고객정보 입력 폼
 *
 * 사용법 (HTML):
 *   <script>
 *     window.DOWNLOAD_GATE = {
 *       endpoint: 'https://script.google.com/macros/s/배포ID/exec',  // Apps Script 웹 앱 URL
 *       privacyUrl: '/privacy.html',                                // 개인정보처리방침 (선택)
 *       contactUrl: '/contact'                                      // 자료 요청 접수 화면의 문의 링크 (선택)
 *     };
 *   </script>
 *   <script src="download-gate.js" defer></script>
 *
 *   <a href="#" data-gate-file="wip-postech">매뉴얼 다운로드</a>
 *
 * data-gate-file 값은 구글 시트 '파일목록' 탭의 파일키와 같아야 합니다.
 * 처음 한 번 입력하면 이 브라우저에서는 다음부터 폼 없이 바로 받습니다.
 */
(function () {
  'use strict';

  var cfg = window.DOWNLOAD_GATE || {};
  var TOKEN_KEY = 'dg_token_v1';
  var NAME_KEY = 'dg_name_v1';
  var RETENTION_TEXT = cfg.retentionText || '마지막 다운로드일로부터 1년 (다운로드가 없으면 동의일로부터 1년)';

  // ── 저장소 (사생활 보호 모드 등에서 실패해도 동작하도록) ──
  function store(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} }
  function load(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  // ── 스타일 ──
  var CSS = [
    '.dg-overlay{position:fixed;inset:0;z-index:2147483000;background:rgba(15,20,40,.55);display:flex;align-items:center;justify-content:center;padding:16px;opacity:0;transition:opacity .18s}',
    '.dg-overlay.dg-open{opacity:1}',
    '.dg-modal{--dg-accent:' + (cfg.accent || '#2f3fb5') + ';box-sizing:border-box;background:#fff;color:#1c2130;width:100%;max-width:480px;max-height:calc(100vh - 32px);overflow:auto;border-radius:14px;box-shadow:0 20px 60px rgba(0,0,0,.25);font:15px/1.5 -apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Malgun Gothic","Noto Sans KR",sans-serif;transform:translateY(8px);transition:transform .18s}',
    '.dg-open .dg-modal{transform:none}',
    '.dg-modal *{box-sizing:border-box}',
    '.dg-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:22px 24px 6px}',
    '.dg-title{margin:0;font-size:19px;font-weight:700;letter-spacing:-.01em}',
    '.dg-sub{margin:4px 0 0;color:#5b6275;font-size:14px}',
    '.dg-file{color:var(--dg-accent);font-weight:600}',
    '.dg-x{flex:none;border:0;background:none;font-size:26px;line-height:1;color:#8a90a0;cursor:pointer;padding:0 2px;margin-top:-2px}',
    '.dg-x:hover{color:#1c2130}',
    '.dg-body{padding:12px 24px 24px}',
    '.dg-seg{display:flex;gap:8px;margin-bottom:14px}',
    '.dg-seg label{flex:1;position:relative;cursor:pointer}',
    '.dg-seg input{position:absolute;opacity:0;pointer-events:none}',
    '.dg-seg span{display:block;text-align:center;padding:9px 0;border:1px solid #d6dae4;border-radius:8px;font-size:14px;color:#5b6275}',
    '.dg-seg input:checked+span{border-color:var(--dg-accent);color:var(--dg-accent);font-weight:600;background:color-mix(in srgb,var(--dg-accent) 7%,transparent)}',
    '.dg-seg input:focus-visible+span{outline:2px solid var(--dg-accent);outline-offset:2px}',
    '.dg-field{margin-bottom:12px}',
    '.dg-field label{display:block;font-size:13px;font-weight:600;margin-bottom:5px;color:#3a4052}',
    '.dg-req{color:#d23c3c;margin-left:2px}',
    '.dg-field input{width:100%;padding:11px 12px;border:1px solid #d6dae4;border-radius:8px;font:inherit;color:inherit;background:#fff}',
    '.dg-field input:focus{outline:none;border-color:var(--dg-accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--dg-accent) 18%,transparent)}',
    '.dg-field input[aria-invalid=true]{border-color:#d23c3c}',
    '.dg-err{display:none;color:#d23c3c;font-size:12.5px;margin-top:4px}',
    '.dg-field input[aria-invalid=true]~.dg-err{display:block}',
    '.dg-hp{position:absolute!important;left:-9999px!important;width:1px;height:1px;overflow:hidden}',
    '.dg-notice{margin:16px 0 12px;padding:14px 16px;background:#f5f6fa;border-radius:10px;font-size:13px;color:#3a4052}',
    '.dg-notice h4{margin:0 0 8px;font-size:13.5px}',
    '.dg-notice dl{margin:0;display:grid;grid-template-columns:auto 1fr;gap:4px 12px}',
    '.dg-notice dt{font-weight:600;color:#5b6275;white-space:nowrap}',
    '.dg-notice dd{margin:0}',
    '.dg-notice p{margin:8px 0 0;color:#5b6275;font-size:12.5px}',
    '.dg-notice a{color:var(--dg-accent)}',
    '.dg-check{display:flex;gap:8px;align-items:flex-start;margin:8px 0;font-size:14px;cursor:pointer}',
    '.dg-check input{margin:3px 0 0;width:17px;height:17px;flex:none;accent-color:var(--dg-accent)}',
    '.dg-check.dg-bad{color:#d23c3c}',
    '.dg-btn{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;margin-top:16px;padding:13px;border:0;border-radius:9px;background:var(--dg-accent);color:#fff;font:inherit;font-weight:700;font-size:15.5px;cursor:pointer;text-decoration:none}',
    '.dg-btn:hover{filter:brightness(1.08)}',
    '.dg-btn[disabled]{opacity:.6;cursor:wait}',
    '.dg-alert{display:none;margin-top:12px;padding:10px 12px;border-radius:8px;background:#fdecec;color:#b42323;font-size:13.5px}',
    '.dg-alert.dg-show{display:block}',
    '.dg-done{text-align:center}',
    '.dg-done-icon{width:52px;height:52px;margin:6px auto 12px;border-radius:50%;background:color-mix(in srgb,var(--dg-accent) 12%,transparent);color:var(--dg-accent);display:flex;align-items:center;justify-content:center;font-size:26px}',
    '.dg-done p{margin:4px 0;color:#5b6275;font-size:14px}',
    '.dg-link{background:none;border:0;padding:0;margin-top:14px;color:#8a90a0;font:inherit;font-size:12.5px;text-decoration:underline;cursor:pointer}',
    '.dg-spin{width:16px;height:16px;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:dg-r .7s linear infinite}',
    '@keyframes dg-r{to{transform:rotate(360deg)}}',
    '.dg-busy{cursor:progress!important;opacity:.7}',
    '@media (max-width:520px){.dg-overlay{align-items:flex-end;padding:0}.dg-modal{max-width:none;border-radius:16px 16px 0 0;max-height:92vh}.dg-head{padding:20px 18px 4px}.dg-body{padding:10px 18px 22px}}',
    // VitePress 등 html.dark 다크 모드 대응
    'html.dark .dg-modal{--dg-accent-text:' + (cfg.accentDark || '#6fa4ff') + '}',
    'html.dark .dg-file,html.dark .dg-seg input:checked+span,html.dark .dg-notice a,html.dark .dg-done-icon{color:var(--dg-accent-text)}',
    'html.dark .dg-seg input:checked+span{border-color:var(--dg-accent-text);background:color-mix(in srgb,var(--dg-accent-text) 12%,transparent)}',
    'html.dark .dg-field input:focus{border-color:var(--dg-accent-text);box-shadow:0 0 0 3px color-mix(in srgb,var(--dg-accent-text) 22%,transparent)}',
    'html.dark .dg-modal{background:#1e2029;color:#e4e6ee;box-shadow:0 20px 60px rgba(0,0,0,.6)}',
    'html.dark .dg-sub,html.dark .dg-done p,html.dark .dg-notice p,html.dark .dg-notice dt,html.dark .dg-seg span{color:#a3a8b8}',
    'html.dark .dg-field label{color:#c9ccd8}',
    'html.dark .dg-field input{background:#15171e;border-color:#3a3e4c;color:#e4e6ee}',
    'html.dark .dg-seg span{border-color:#3a3e4c}',
    'html.dark .dg-notice{background:#262935;color:#c9ccd8}',
    'html.dark .dg-alert{background:rgba(210,60,60,.18);color:#ffb4b4}',
    'html.dark .dg-x:hover{color:#fff}',
    '.dg-info{margin:12px 0 0;padding:12px 14px;border-radius:10px;background:#f5f6fa;color:#3a4052;font-size:13.5px;text-align:left}',
    'html.dark .dg-info{background:#262935;color:#c9ccd8}',
    '@media (prefers-reduced-motion:reduce){.dg-overlay,.dg-modal{transition:none}}'
  ].join('\n');

  function injectCss() {
    if (document.getElementById('dg-style')) return;
    var s = document.createElement('style');
    s.id = 'dg-style';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // ── 서버 통신 (text/plain 으로 보내면 CORS 사전요청 없이 Apps Script 호출 가능) ──
  function call(payload) {
    if (!cfg.endpoint) return Promise.reject(new Error('다운로드 서비스를 준비 중입니다. 자료가 필요하시면 문의하기로 요청해 주세요.'));
    payload.page = location.href;
    return fetch(cfg.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow'
    }).then(function (r) { return r.json(); });
  }

  function startDownload(url) {
    // 구글 드라이브 다운로드 링크는 첨부파일로 내려오므로 현재 페이지에서 바로 받기
    if (/export=download|download=|\.(pdf|zip|dwg|step|stp)(\?|$)/i.test(url)) {
      var a = document.createElement('a');
      a.href = url;
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  }

  // ── 모달 ──
  var overlay, lastFocus, currentKey, currentLabel, currentTrigger;

  function close() {
    if (!overlay) return;
    var o = overlay;
    overlay = null;
    o.classList.remove('dg-open');
    document.removeEventListener('keydown', onKey, true);
    document.body.style.overflow = '';
    setTimeout(function () { o.remove(); }, 180);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function onKey(e) {
    if (!overlay) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key === 'Tab') {
      var f = overlay.querySelectorAll('button,input:not([tabindex="-1"]),a[href]');
      f = Array.prototype.filter.call(f, function (el) { return el.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  function open(html) {
    injectCss();
    lastFocus = (currentTrigger && currentTrigger.isConnected) ? currentTrigger : document.activeElement;
    overlay = document.createElement('div');
    overlay.className = 'dg-overlay';
    overlay.innerHTML = '<div class="dg-modal" role="dialog" aria-modal="true" aria-labelledby="dg-title">' + html + '</div>';
    overlay.addEventListener('mousedown', function (e) { if (e.target === overlay) close(); });
    overlay.querySelector('.dg-x').addEventListener('click', close);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey, true);
    requestAnimationFrame(function () { overlay && overlay.classList.add('dg-open'); });
  }

  function head(title, sub) {
    return '<div class="dg-head"><div><h2 class="dg-title" id="dg-title">' + title + '</h2>' +
      (sub ? '<p class="dg-sub">' + sub + '</p>' : '') +
      '</div><button type="button" class="dg-x" aria-label="닫기">&times;</button></div>';
  }

  function showForm() {
    var fileLine = currentLabel ? '<span class="dg-file">' + esc(currentLabel) + '</span> 자료를 받기 전에<br>' : '';
    var privacy = cfg.privacyUrl ? ' <a href="' + esc(cfg.privacyUrl) + '" target="_blank" rel="noopener">개인정보처리방침</a>' : '';
    open(
      head('자료 다운로드', fileLine + '아래 정보를 한 번만 입력해 주세요.') +
      '<form class="dg-body" novalidate>' +
        '<div class="dg-seg" role="radiogroup" aria-label="구분">' +
          '<label><input type="radio" name="type" value="기업" checked><span>기업·기관</span></label>' +
          '<label><input type="radio" name="type" value="개인"><span>개인</span></label>' +
        '</div>' +
        field('company', '회사·기관명', 'text', 'organization', '예) 일신오토클레이브') +
        field('name', '담당자명', 'text', 'name', '') +
        field('email', '이메일', 'email', 'email', 'name@company.com') +
        field('phone', '휴대전화번호', 'tel', 'tel', '010-0000-0000') +
        '<div class="dg-hp" aria-hidden="true"><label>Website <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>' +
        '<div class="dg-notice">' +
          '<h4>개인정보 수집·이용 안내</h4>' +
          '<dl>' +
            '<dt>수집 목적</dt><dd>자료 제공, 반복 입력 방지 및 다운로드 이력 관리</dd>' +
            '<dt>수집 항목</dt><dd>구분(기업/개인), 회사·기관명, 담당자명, 이메일, 휴대전화번호</dd>' +
            '<dt>보유 기간</dt><dd>' + esc(RETENTION_TEXT) + '</dd>' +
          '</dl>' +
          '<p>동의를 거부할 수 있으나, 미동의 시 자료 다운로드가 제한됩니다.' + privacy + '</p>' +
        '</div>' +
        '<label class="dg-check" data-req><input type="checkbox" name="consentRequired"> <span>위 개인정보 수집·이용에 동의합니다. <b>(필수)</b></span></label>' +
        '<label class="dg-check"><input type="checkbox" name="consentMarketing"> <span>신제품·기술자료 등 소식을 이메일/문자로 받겠습니다. (선택)</span></label>' +
        '<div class="dg-alert" role="alert"></div>' +
        '<button type="submit" class="dg-btn">동의하고 다운로드</button>' +
      '</form>'
    );

    var form = overlay.querySelector('form');
    var companyField = form.querySelector('[data-field=company]');
    form.addEventListener('change', function (e) {
      if (e.target.name === 'type') {
        var personal = form.type.value === '개인';
        companyField.style.display = personal ? 'none' : '';
      }
      if (e.target.name === 'consentRequired') form.querySelector('[data-req]').classList.remove('dg-bad');
    });
    form.addEventListener('input', function (e) { e.target.removeAttribute('aria-invalid'); });
    form.addEventListener('submit', function (e) { e.preventDefault(); submit(form); });
    setTimeout(function () { form.company && form.company.focus(); }, 60);
  }

  function field(name, label, type, ac, ph) {
    var id = 'dg-' + name;
    return '<div class="dg-field" data-field="' + name + '"><label for="' + id + '">' + label + '<span class="dg-req">*</span></label>' +
      '<input id="' + id + '" name="' + name + '" type="' + type + '" autocomplete="' + ac + '"' +
      (ph ? ' placeholder="' + ph + '"' : '') + (type === 'tel' ? ' inputmode="tel"' : '') + ' aria-describedby="' + id + '-err">' +
      '<div class="dg-err" id="' + id + '-err">' + label + '을(를) 확인해 주세요.</div></div>';
  }

  function validate(form) {
    var bad = [];
    var personal = form.type.value === '개인';
    function mark(el, ok) { if (!ok) { el.setAttribute('aria-invalid', 'true'); bad.push(el); } }
    if (!personal) mark(form.company, form.company.value.trim().length > 0);
    mark(form.name, form.name.value.trim().length > 0);
    mark(form.email, /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.value.trim()));
    mark(form.phone, form.phone.value.replace(/\D/g, '').length >= 9);
    var consentOk = form.consentRequired.checked;
    form.querySelector('[data-req]').classList.toggle('dg-bad', !consentOk);
    if (bad.length) bad[0].focus();
    else if (!consentOk) form.consentRequired.focus();
    return !bad.length && consentOk;
  }

  function submit(form) {
    var alertBox = form.querySelector('.dg-alert');
    alertBox.classList.remove('dg-show');
    if (!validate(form)) return;

    var btn = form.querySelector('.dg-btn');
    btn.disabled = true;
    btn.innerHTML = '<span class="dg-spin"></span> 확인 중…';

    var personal = form.type.value === '개인';
    call({
      action: 'register',
      fileKey: currentKey,
      website: form.website.value,
      lead: {
        type: form.type.value,
        company: personal ? '' : form.company.value.trim(),
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        consentRequired: form.consentRequired.checked,
        consentMarketing: form.consentMarketing.checked
      }
    }).then(function (res) {
      if (!res || !res.ok) throw new Error((res && res.message) || '처리하지 못했습니다.');
      store(TOKEN_KEY, res.token);
      store(NAME_KEY, res.name || '');
      showDone(res, true);
    }).catch(function (err) {
      if (!overlay) return;
      alertBox.textContent = err && err.message && !/fetch|network|JSON/i.test(err.message)
        ? err.message : '연결에 실패했습니다. 잠시 후 다시 시도해 주세요.';
      alertBox.classList.add('dg-show');
      btn.disabled = false;
      btn.textContent = '동의하고 다운로드';
    });
  }

  function showDone(res, fresh) {
    if (overlay) { overlay.remove(); overlay = null; document.removeEventListener('keydown', onKey, true); }
    var title = esc(res.fileName || currentLabel || '자료');
    var resetBtn = fresh ? '' : '<button type="button" class="dg-link" data-reset>' +
      (res.name ? esc(res.name) + '님이 아니신가요? ' : '') + '다른 정보로 입력하기</button>';

    if (res.pending || !res.url) {
      // 파일이 아직 등록되지 않은 자료: 요청 접수 안내
      open(
        head('자료 요청 접수', '') +
        '<div class="dg-body dg-done">' +
          '<div class="dg-done-icon" aria-hidden="true">&#10003;</div>' +
          '<p><b>' + title + '</b></p>' +
          '<p class="dg-info">이 자료는 온라인 파일을 준비 중입니다. 요청이 접수되었으며, 담당자가 확인 후 입력하신 이메일로 보내드립니다.</p>' +
          (cfg.contactUrl ? '<a class="dg-btn" href="' + esc(cfg.contactUrl) + '">문의하기</a>' :
            '<button type="button" class="dg-btn" data-close>확인</button>') +
          resetBtn +
        '</div>'
      );
    } else {
      open(
        head('다운로드', '') +
        '<div class="dg-body dg-done">' +
          '<div class="dg-done-icon" aria-hidden="true">&#8595;</div>' +
          '<p><b>' + title + '</b></p>' +
          '<p>' + (fresh ? '입력해 주셔서 감사합니다. ' : '') + '다운로드가 시작되지 않으면 아래 버튼을 눌러 주세요.</p>' +
          '<a class="dg-btn" href="' + esc(res.url) + '" target="_blank" rel="noopener">파일 받기</a>' +
          resetBtn +
        '</div>'
      );
      startDownload(res.url);
    }
    var reset = overlay.querySelector('[data-reset]');
    if (reset) reset.addEventListener('click', function () { forget(); close(); setTimeout(showForm, 200); });
    var btn = overlay.querySelector('.dg-btn');
    btn.addEventListener('click', function () { setTimeout(close, btn.hasAttribute('data-close') ? 0 : 300); });
    btn.focus();
  }

  function forget() { store(TOKEN_KEY, null); store(NAME_KEY, null); }

  // ── 버튼 클릭 처리 ──
  function handle(trigger) {
    currentTrigger = trigger;
    currentKey = trigger.getAttribute('data-gate-file');
    currentLabel = trigger.getAttribute('data-gate-label') || '';
    var token = load(TOKEN_KEY);
    if (!token) { showForm(); return; }

    trigger.classList.add('dg-busy');
    call({ action: 'download', token: token, fileKey: currentKey })
      .then(function (res) {
        if (res && res.ok) { showDone(res, false); return; }
        if (res && res.code === 'NEED_FORM') { forget(); showForm(); return; }
        throw new Error((res && res.message) || '처리하지 못했습니다.');
      })
      .catch(function (err) {
        injectCss();
        open(head('다운로드', '') + '<div class="dg-body"><div class="dg-alert dg-show" role="alert">' +
          esc(err && err.message && !/fetch|network|JSON/i.test(err.message) ? err.message : '연결에 실패했습니다. 잠시 후 다시 시도해 주세요.') +
          '</div></div>');
      })
      .then(function () { trigger.classList.remove('dg-busy'); });
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-gate-file]');
    if (!t) return;
    e.preventDefault();
    if (t.classList.contains('dg-busy')) return;
    handle(t);
  });

  // 외부에서 쓸 수 있게 노출 (예: 로그아웃 버튼에서 DownloadGate.reset())
  window.DownloadGate = { open: function (key, label) {
    var fake = document.createElement('span');
    fake.setAttribute('data-gate-file', key);
    if (label) fake.setAttribute('data-gate-label', label);
    handle(fake);
  }, reset: forget };
})();
