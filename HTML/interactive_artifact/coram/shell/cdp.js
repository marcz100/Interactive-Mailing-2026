// Shared test plumbing for the Coram concept tests: headless Chrome over the DevTools Protocol with device emulation,
// real mouse clicks at an element's position (so pointer-events and hidden labels are really tested), evaluation,
// screenshots and a pass/fail list. Needs Node 22+ (built-in fetch and WebSocket) and Chrome.
const fs = require('fs'), os = require('os'), path = require('path'), { spawn } = require('child_process');
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function session(name, port) {
  const dir = path.join(os.tmpdir(), name) + '/';
  fs.mkdirSync(dir, { recursive: true });
  const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', `--remote-debugging-port=${port}`, `--user-data-dir=${dir}profile`, 'about:blank'], { stdio: 'ignore' });
  let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); } catch {} }
  const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r, { once: true }));
  let id = 0; const pending = new Map();
  ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
  const send = (method, params = {}) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async expr => (await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true })).result.result.value;
  const out = []; let failures = 0;
  const t = {
    dir, send, ev, sleep,
    check(label, ok, detail = '') { if (!ok) failures++; out.push(`  ${ok ? 'OK  ' : 'FAIL'} ${label}${detail ? '  (' + detail + ')' : ''}`); },
    log(s) { out.push(s); },
    async open(url, width, mobile, height = 1400) {
      await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile });
      await send('Page.navigate', { url: url.startsWith('file:') ? url : 'file:///' + url.replace(/\\/g, '/') });
      await sleep(2500);
    },
    // a real click in the middle of an element (scrolled into view first); returns false when it isn't visible
    async click(sel, wait = 900) {
      const p = await ev(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e) return null; e.scrollIntoView({ block: 'center' }); const b = e.getBoundingClientRect(); return b.width && b.height ? { x: b.left + b.width / 2, y: b.top + b.height / 2 } : null; })()`);
      if (!p) return false;
      for (const type of ['mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x: p.x, y: p.y, button: 'left', clickCount: 1 });
      await sleep(wait);
      return true;
    },
    async shot(sel, png) {
      const r = await ev(`(() => { const b = document.querySelector(${JSON.stringify(sel)}).getBoundingClientRect(); return { x: b.left + scrollX, y: b.top + scrollY, w: b.width, h: b.height }; })()`);
      const res = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: r.x, y: r.y, width: r.w, height: r.h, scale: 1 } });
      fs.writeFileSync(dir + png, Buffer.from(res.result.data, 'base64'));
    },
    async noOverflow(width) {
      t.check('no horizontal overflow', await ev(`document.documentElement.scrollWidth <= ${width}`), `page ${await ev('document.documentElement.scrollWidth')} / viewport ${width}`);
    },
    async layer(prefix) {
      t.check('interactive layer shown, fallback hidden', await ev(`getComputedStyle(document.querySelector('.${prefix}-interactive')).display === 'block' && getComputedStyle(document.querySelector('.${prefix}-fallback')).display === 'none'`));
    },
    async fallback(prefix, width) {
      await ev(`document.querySelector('.${prefix}-detect').checked = false`);
      await sleep(300);
      t.check('fallback shown when detection fails', await ev(`getComputedStyle(document.querySelector('.${prefix}-fallback')).display === 'block' && getComputedStyle(document.querySelector('.${prefix}-interactive')).display === 'none'`));
      await t.shot(`.${prefix}-fallback`, `${prefix}_${width}_fallback.png`);
    },
    finish() {
      ws.close(); chrome.kill();
      console.log(out.join('\n'));
      console.log(`\n${failures ? failures + ' FAILED' : 'all checks passed'} — screenshots in ${dir}`);
      process.exit(failures ? 1 : 0);
    },
    kill() { try { ws.close(); } catch {} chrome.kill(); },
  };
  return t;
}

module.exports = { session, sleep };
