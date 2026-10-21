// Click tests for "De straat van de uitersten" over the Chrome DevTools Protocol: device emulation, real mouse clicks
// at the houses' positions (so pointer-events: none on locked and opened doors is really tested), measurements and
// screenshots. Also renders the artifact board in the same states for a side-by-side check (ARTIFACT=<path to the
// unpacked board html>, optional). Reads the mail, never writes it; screenshots go to the system temp folder.
// Needs Node 22+ (built-in fetch and WebSocket) and Chrome.
//   node test_clicks.js                (CHROME=<path to chrome.exe> to override the Chrome location)
const fs = require('fs'), os = require('os'), path = require('path'), { spawn } = require('child_process');
const S = path.join(os.tmpdir(), 'straat-test') + '/';
fs.mkdirSync(S, { recursive: true });
const MAIL = path.resolve(__dirname, '../funda_eindejaarsmail_2026_concept_1.html').replace(/\\/g, '/');
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9335;
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', `--remote-debugging-port=${PORT}`, `--user-data-dir=${S}profile`, 'about:blank'], { stdio: 'ignore' });
  const out = [];
  let failures = 0;
  const check = (label, ok, detail = '') => { if (!ok) failures++; out.push(`  ${ok ? 'OK  ' : 'FAIL'} ${label}${detail ? '  (' + detail + ')' : ''}`); };
  try {
    let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); } catch {} }
    const ws = new WebSocket(list.find(t => t.type === 'page').webSocketDebuggerUrl);
    await new Promise(r => ws.addEventListener('open', r, { once: true }));
    let id = 0; const pending = new Map();
    ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
    const send = (method, params = {}) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
    const ev = async expr => (await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true })).result.result.value;
    const shotEl = async (sel, png) => {
      const r = await ev(`(() => { const b = document.querySelector('${sel}').getBoundingClientRect(); return { x: b.left + scrollX, y: b.top + scrollY, w: b.width, h: b.height }; })()`);
      const res = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: r.x, y: r.y, width: r.w, height: r.h, scale: 1 } });
      fs.writeFileSync(S + png, Buffer.from(res.result.data, 'base64'));
    };
    // a real click in the middle of an element (scrolled into view first)
    const click = async sel => {
      const p = await ev(`(() => { const e = document.querySelector('${sel}'); e.scrollIntoView({ block: 'center' }); const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`);
      for (const type of ['mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x: p.x, y: p.y, button: 'left', clickCount: 1 });
      await sleep(700);
    };
    const state = () => ev(`(() => {
      const vis = e => e && getComputedStyle(e).display !== 'none' && getComputedStyle(e).visibility !== 'hidden' && e.getBoundingClientRect().height > 0;
      const checked = [18, 19, 20, 21, 22, 23, 24].filter(d => document.querySelector('.fd-c' + d).checked);
      const cards = [...document.querySelectorAll('.fd-card')].filter(vis).map(c => ({ n: +c.className.match(/fd-card-(\\d)/)[1], z: +getComputedStyle(c).zIndex, r: c.getBoundingClientRect(),
        textBottom: Math.max(...[...c.querySelectorAll('p, span')].map(t => t.getBoundingClientRect().bottom)), textRight: Math.max(...[...c.querySelectorAll('p, span')].map(t => t.getBoundingClientRect().right)) }));
      const top = cards.slice().sort((a, b) => b.z - a.z)[0];
      const same = cards.every(c => ['left', 'top', 'width', 'height'].every(k => Math.abs(c.r[k] - cards[0].r[k]) < 0.5));
      const fits = cards.every(c => c.textBottom <= c.r.bottom + 0.5 && c.textRight <= c.r.right + 0.5);
      const prog = document.querySelector('.fd-progress');
      const lt = document.querySelector('.fd-left-txt'), at = document.querySelector('.fd-all-txt');
      const door24 = getComputedStyle(document.querySelector('.fd-h24 .fd-door')).backgroundColor;
      const lights = getComputedStyle(document.querySelector('.fd-lights')).borderTopColor;
      const houses = [...document.querySelectorAll('.fd-house')].map(h => h.getBoundingClientRect());
      return { checked, hint: vis(document.querySelector('.fd-hint')), top: top ? top.n : 0, n: cards.length, same, fits,
        progress: vis(prog) ? (vis(lt) ? 'left' : vis(at) ? 'all' : '?') : 'hidden', finale: vis(document.querySelector('.fd-finale')), door24, lights,
        housesIn: houses.every(r => r.left >= 0 && r.right <= innerWidth), lit: [18, 19, 20, 21, 22, 23].filter(d => getComputedStyle(document.querySelector('.fd-h' + d + ' .fd-win')).backgroundColor === 'rgb(255, 217, 102)') };
    })()`);

    for (const [width, mobile] of [[760, false], [390, true], [360, true]]) {
      out.push(`== ${width}px ${mobile ? '(mobile)' : '(desktop)'}`);
      await send('Emulation.setDeviceMetricsOverride', { width, height: 1300, deviceScaleFactor: 1, mobile });
      await send('Page.navigate', { url: 'file:///' + MAIL });
      await sleep(2500);
      check('no horizontal overflow', await ev(`document.documentElement.scrollWidth <= innerWidth`), `page ${await ev('document.documentElement.scrollWidth')} / viewport ${width}`);
      check('interactive layer shown, fallback hidden', await ev(`getComputedStyle(document.querySelector('.fd-interactive')).display === 'block' && getComputedStyle(document.querySelector('.fd-fallback')).display === 'none'`));
      let st = await state();
      check('start: hint shown, no card, no progress, door 24 locked', st.hint && st.n === 0 && st.progress === 'hidden' && st.door24 === 'rgb(185, 138, 128)' && !st.finale, `door 24 ${st.door24}`);
      check('start: all seven houses inside the viewport', st.housesIn);
      await shotEl('.fd-interactive', `straat_${width}_1_start.png`);
      await click('.fd-h24'); st = await state();
      check('door 24 cannot be opened before the others', !st.checked.includes(24), `checked ${st.checked}`);
      await click('.fd-h18'); st = await state();
      check('door 18: open, light on, its card, "Nog .." progress', st.checked.join() === '18' && st.lit.join() === '18' && st.top === 1 && !st.hint && st.progress === 'left', `checked ${st.checked}, lit ${st.lit}, top card ${st.top}`);
      await click('.fd-h18'); st = await state();
      check('door 18 again: stays open', st.checked.join() === '18');
      await click('.fd-h20'); await click('.fd-h19'); st = await state();
      check('doors 20 then 19: the newest card (19) is on top', st.top === 2 && st.n === 3, `top card ${st.top}, ${st.n} cards open`);
      check('open cards share one box and the text fits in it', st.same && st.fits);
      await shotEl('.fd-interactive', `straat_${width}_2_cards.png`);
      for (const d of [21, 22, 23]) await click('.fd-h' + d);
      st = await state();
      check('all six open: "Alle deuren .." text, lights on, door 24 unlocked', st.progress === 'all' && st.lights === 'rgb(255, 210, 122)' && st.door24 === 'rgb(255, 255, 255)' && st.top === 6, `progress ${st.progress}, lights ${st.lights}, door 24 ${st.door24}`);
      await shotEl('.fd-interactive', `straat_${width}_3_all_open.png`);
      await click('.fd-h24'); st = await state();
      check('door 24: finale shown, door open', st.checked.includes(24) && st.finale && st.door24 === 'rgb(255, 231, 163)');
      await click('.fd-h24'); st = await state();
      check('door 24 again: stays open', st.checked.includes(24) && st.finale);
      await shotEl('.fd-interactive', `straat_${width}_4_finale.png`);
      await ev(`document.querySelector('.fd-detect').checked = false`);
      await sleep(300);
      check('fallback shown when detection fails', await ev(`getComputedStyle(document.querySelector('.fd-fallback')).display === 'block' && getComputedStyle(document.querySelector('.fd-interactive')).display === 'none'`));
      await shotEl('.fd-fallback', `straat_${width}_fallback.png`);
      if (!mobile) await shotEl('body', `straat_${width}_mail_fallback.png`);
    }

    // the artifact board in the same states (its own runtime renders the board; the mail column is x 40, 640 wide)
    if (process.env.ARTIFACT) {
      await send('Emulation.setDeviceMetricsOverride', { width: 1200, height: 1900, deviceScaleFactor: 1, mobile: false });
      await send('Page.navigate', { url: 'file:///' + process.env.ARTIFACT.replace(/\\/g, '/') });
      await sleep(5000);
      const art = async png => { const res = await send('Page.captureScreenshot', { format: 'png', clip: { x: 40, y: 40, width: 640, height: 1400, scale: 1 } }); fs.writeFileSync(S + png, Buffer.from(res.result.data, 'base64')); };
      const press = n => ev(`(() => { const b = [...document.querySelectorAll('button')].find(b => b.getAttribute('aria-label') === 'Open deur ${n}'); if (b) b.click(); return !!b; })()`);
      await art('artifact_1_start.png');
      await press(18); await press(20); await press(19); await sleep(800); await art('artifact_2_cards.png');
      for (const d of [21, 22, 23]) await press(d);
      await sleep(800); await art('artifact_3_all_open.png');
      await press(24); await sleep(800); await art('artifact_4_finale.png');
    }
    ws.close();
  } finally { chrome.kill(); }
  console.log(out.join('\n'));
  console.log(`\n${failures ? failures + ' FAILED' : 'all checks passed'} — screenshots in ${S}`);
  process.exit(failures ? 1 : 0);
}
main().catch(e => { console.error(e); process.exit(1); });
