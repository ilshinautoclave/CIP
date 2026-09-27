/**
 * 사이트 입장 코드 (구매 고객 전용)
 *
 * - 코드는 저장소에 넣지 않습니다. GitHub 저장소 Settings → Secrets and variables → Actions 의
 *   `SITE_ACCESS_CODE` 값이 빌드할 때 SHA-256 해시로만 바뀌어 사이트에 들어갑니다.
 * - 코드를 바꾸면(Secret 수정 후 다시 배포) 기존 방문자도 새 코드를 다시 입력해야 합니다.
 * - 대소문자·앞뒤 공백은 구분하지 않습니다.
 *
 * ⚠️ 간단한 입장 제한입니다. 브라우저에서 확인하므로 개발 지식이 있으면 우회할 수 있고,
 *    공개 저장소의 원본 파일은 GitHub에서 볼 수 있습니다. (download-gate/SETUP.md 참고)
 */
import { createHash } from 'node:crypto'
import type { HeadConfig } from 'vitepress'

const SALT = 'ilshin-cip-gate:'

export function normalizeCode(code: string) {
  return code.trim().toUpperCase()
}

export function hashAccessCode(code: string) {
  return createHash('sha256').update(SALT + normalizeCode(code), 'utf8').digest('hex')
}

/** SITE_ACCESS_CODE 가 없으면(로컬 미리보기 등) 입장 화면 없이 빌드합니다. */
export function accessGateHead(code: string | undefined, opts: { base: string; contactUrl: string }): HeadConfig[] {
  if (!code || !code.trim()) return []
  const hash = hashAccessCode(code)
  const cfg = JSON.stringify({ hash, salt: SALT, base: opts.base, contact: opts.contactUrl })

  return [
    ['meta', { name: 'robots', content: 'noindex, nofollow' }],
    ['style', {}, CSS],
    ['script', {}, SCRIPT.replace('__CFG__', cfg)]
  ]
}

const CSS = `
html.cip-locked body{overflow:hidden}
html.cip-locked #app{visibility:hidden}
#cip-gate{position:fixed;inset:0;z-index:2147483600;display:flex;align-items:center;justify-content:center;padding:16px;
  background:linear-gradient(135deg,#f3f6fc 0%,#e6ecf8 100%);font-family:'Pretendard',-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo','Malgun Gothic','Noto Sans KR',sans-serif;color:#1c2130}
html.dark #cip-gate{background:linear-gradient(135deg,#15171e 0%,#1b1f2b 100%);color:#e4e6ee}
#cip-gate .g-card{box-sizing:border-box;width:100%;max-width:400px;background:#fff;border-radius:16px;padding:36px 32px 28px;box-shadow:0 18px 50px rgba(11,63,168,.14);text-align:center}
html.dark #cip-gate .g-card{background:#1e2029;box-shadow:0 18px 50px rgba(0,0,0,.5)}
#cip-gate img{height:34px;width:auto;margin:0 auto 22px;display:block}
#cip-gate .g-logo-dark{display:none}
html.dark #cip-gate .g-logo-light{display:none}
html.dark #cip-gate .g-logo-dark{display:block}
#cip-gate h1{margin:0 0 8px;font-size:20px;font-weight:700;letter-spacing:-.01em}
#cip-gate p{margin:0 0 22px;font-size:14px;line-height:1.6;color:#5b6275}
html.dark #cip-gate p{color:#a3a8b8}
#cip-gate form{display:flex;flex-direction:column;gap:10px}
#cip-gate input{box-sizing:border-box;width:100%;padding:13px 14px;border:1px solid #d6dae4;border-radius:10px;font:inherit;font-size:16px;text-align:center;letter-spacing:.08em;color:inherit;background:#fff}
html.dark #cip-gate input{background:#15171e;border-color:#3a3e4c}
#cip-gate input:focus{outline:none;border-color:#0b3fa8;box-shadow:0 0 0 3px rgba(11,63,168,.16)}
html.dark #cip-gate input:focus{border-color:#6fa4ff;box-shadow:0 0 0 3px rgba(111,164,255,.2)}
#cip-gate input[aria-invalid=true]{border-color:#d23c3c}
#cip-gate button{padding:13px;border:0;border-radius:10px;background:#0b3fa8;color:#fff;font:inherit;font-size:15.5px;font-weight:700;cursor:pointer}
#cip-gate button:hover{background:#1150c9}
#cip-gate .g-err{min-height:20px;margin-top:2px;font-size:13px;color:#d23c3c}
#cip-gate .g-foot{margin-top:18px;padding-top:16px;border-top:1px solid #eceef3;font-size:12.5px;color:#8a90a0}
html.dark #cip-gate .g-foot{border-color:#2c2f3a}
#cip-gate .g-foot a{color:#0b3fa8;text-decoration:none;font-weight:600}
html.dark #cip-gate .g-foot a{color:#6fa4ff}
@media (max-width:480px){#cip-gate .g-card{padding:30px 22px 24px}}
`

// <head> 안에서 본문보다 먼저 실행 → 잠금 상태면 내용이 잠깐이라도 보이지 않음
const SCRIPT = `(function(){
  var C = __CFG__, KEY = 'cip_access_v1', ok = false;
  try { ok = localStorage.getItem(KEY) === C.hash; } catch (e) {}
  if (ok) return;
  var html = document.documentElement;
  html.classList.add('cip-locked');

  function sha256(text) {
    var data = new TextEncoder().encode(text);
    return crypto.subtle.digest('SHA-256', data).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
    });
  }

  function build() {
    if (document.getElementById('cip-gate')) return;
    var g = document.createElement('div');
    g.id = 'cip-gate';
    g.setAttribute('role', 'dialog');
    g.setAttribute('aria-modal', 'true');
    g.setAttribute('aria-labelledby', 'cip-gate-title');
    g.innerHTML =
      '<div class="g-card">' +
        '<img class="g-logo-light" src="' + C.base + 'logo.png" alt="일신오토클레이브">' +
        '<img class="g-logo-dark" src="' + C.base + 'logo-dark.png" alt="">' +
        '<h1 id="cip-gate-title">고객 전용 기술자료</h1>' +
        '<p>제품을 구매하셨거나 도입을 검토 중인 고객께 제공되는 자료입니다.<br>담당자에게 받으신 <b>접속 코드</b>를 입력해 주세요.</p>' +
        '<form novalidate>' +
          '<input type="password" name="code" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="접속 코드" aria-label="접속 코드" aria-describedby="cip-gate-err">' +
          '<button type="submit">입장하기</button>' +
          '<div class="g-err" id="cip-gate-err" role="alert"></div>' +
        '</form>' +
        '<div class="g-foot">접속 코드가 없으신가요? <a href="' + C.contact + '" target="_blank" rel="noopener">담당자에게 문의</a></div>' +
      '</div>';
    document.body.appendChild(g);
    var form = g.querySelector('form'), input = form.code, err = g.querySelector('.g-err');
    input.addEventListener('input', function () { input.removeAttribute('aria-invalid'); err.textContent = ''; });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = input.value.trim().toUpperCase();
      if (!v) { input.setAttribute('aria-invalid', 'true'); err.textContent = '접속 코드를 입력해 주세요.'; input.focus(); return; }
      if (!window.crypto || !crypto.subtle) { err.textContent = '이 브라우저에서는 확인할 수 없습니다. 최신 브라우저를 이용해 주세요.'; return; }
      sha256(C.salt + v).then(function (h) {
        if (h === C.hash) {
          try { localStorage.setItem(KEY, h); } catch (e2) {}
          g.remove();
          html.classList.remove('cip-locked');
        } else {
          input.setAttribute('aria-invalid', 'true');
          err.textContent = '접속 코드가 올바르지 않습니다.';
          input.select();
        }
      });
    });
    setTimeout(function () { input.focus(); }, 30);
  }

  if (document.body) build();
  else document.addEventListener('DOMContentLoaded', build);
})();`
