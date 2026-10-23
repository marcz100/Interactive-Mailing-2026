// Scroll tests for "Post bij de receptie" over the Chrome DevTools Protocol (real device emulation, real scrolling,
// measurements, screenshots). Reads the mail, never writes it; screenshots go to the system temp folder.
// Needs Node 22+ (built-in fetch and WebSocket) and Chrome.
//   node test_scroll.js                (CHROME=<path to chrome.exe> to override the Chrome location)
//   VARIANT=v2 node test_scroll.js     version 2: first the closed envelope and a real click on it, then the same checks
const fs = require('fs'), os = require('os'), path = require('path'), { spawn } = require('child_process');
const S = path.join(os.tmpdir(), 'post-test') + '/';
fs.mkdirSync(S, { recursive: true });
const V2 = process.env.VARIANT === 'v2';
const MAIL = path.resolve(__dirname, `../westcord_eindejaarsmail_2026_concept_4${V2 ? '_v2' : ''}.html`).replace(/\\/g, '/');
const TAG = V2 ? 'v2_' : '';
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9336;
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
    // version 2 uses the class prefix pk- instead of po-
    const ev = async expr => (await send('Runtime.evaluate', { expression: V2 ? expr.replace(/\.po-/g, '.pk-') : expr, returnByValue: true, awaitPromise: true })).result.result.value;
    const shotEl = async (sel, png) => {
      const r = await ev(`(() => { const b = document.querySelector('${sel}').getBoundingClientRect(); return { x: b.left + scrollX, y: b.top + scrollY, w: b.width, h: b.height }; })()`);
      const res = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: r.x, y: r.y, width: r.w, height: r.h, scale: 1 } });
      fs.writeFileSync(S + png, Buffer.from(res.result.data, 'base64'));
    };
    // scroll the window to a position (px, or 'end') and measure everything in window coordinates
    const at = pos => ev(`(() => {
      const win = document.querySelector('.po-window'), sc = document.querySelector('.po-scroll');
      sc.scrollTop = ${pos === 'end' ? 'sc.scrollHeight' : pos};
      const W = win.getBoundingClientRect(), rel = e => { const b = e.getBoundingClientRect(); return { top: b.top - W.top, bottom: b.bottom - W.top, left: b.left - W.left, right: b.right - W.left }; };
      const desk = rel(document.querySelector('.po-desk')), letter = rel(document.querySelector('.po-letter'));
      return { w: W.width, h: W.height, scroll: Math.round(sc.scrollTop), max: Math.round(sc.scrollHeight - sc.clientHeight), desk, letter,
        head: rel(document.querySelector('.po-head')), env: rel(document.querySelector('.po-env')), backL: rel(document.querySelector('.po-back-l')), backR: rel(document.querySelector('.po-back-r')), ps: rel(document.querySelector('.po-ps')), btn: rel(document.querySelector('.po-btn')) };
    })()`);

    for (const [width, mobile] of [[760, false], [390, true], [360, true]]) {
      out.push(`== ${width}px ${mobile ? '(mobile)' : '(desktop)'}`);
      await send('Emulation.setDeviceMetricsOverride', { width, height: 1400, deviceScaleFactor: 1, mobile });
      await send('Page.navigate', { url: 'file:///' + MAIL });
      await sleep(3000);
      check('no horizontal overflow', await ev(`document.documentElement.scrollWidth <= innerWidth`), `page ${await ev('document.documentElement.scrollWidth')} / viewport ${width}`);
      check('interactive layer shown, fallback hidden', await ev(`getComputedStyle(document.querySelector('.po-interactive')).display === 'block' && getComputedStyle(document.querySelector('.po-fallback')).display === 'none'`));
      if (V2) {
        const closed = await ev(`(() => { const sc = document.querySelector('.po-scroll'), W = document.querySelector('.po-window').getBoundingClientRect();
          return { overflow: getComputedStyle(sc).overflowY, letterTop: document.querySelector('.po-letter').getBoundingClientRect().top - W.top,
            deskTop: document.querySelector('.po-desk').getBoundingClientRect().top - W.top, flap: getComputedStyle(document.querySelector('.po-flap-t')).transform,
            seal: getComputedStyle(document.querySelector('.po-seal')).opacity, label: getComputedStyle(document.querySelector('.po-open-label')).display }; })()`);
        check('closed: no scrolling, the letter waits inside the envelope', closed.overflow === 'hidden' && closed.letterTop >= closed.deskTop, `overflow ${closed.overflow}, letter top ${Math.round(closed.letterTop)}, counter top ${Math.round(closed.deskTop)}`);
        check('closed: the flap and the seal show, the envelope is clickable', closed.flap === 'none' && closed.seal === '1' && closed.label === 'block', `flap ${closed.flap}, seal ${closed.seal}`);
        await sleep(300); await shotEl('.po-window', `post_${TAG}${width}_0_closed.png`);
        // a real click in the middle of the envelope
        const p = await ev(`(() => { document.querySelector('.po-window').scrollIntoView({ block: 'end' }); const b = document.querySelector('.po-env').getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height * 0.75 }; })()`);
        for (const type of ['mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x: p.x, y: p.y, button: 'left', clickCount: 1 });
        await sleep(1000); await shotEl('.po-window', `post_${TAG}${width}_0_opening.png`);
        await sleep(2000);
        const open = await ev(`(() => ({ checked: document.querySelector('.po-open').checked, overflow: getComputedStyle(document.querySelector('.po-scroll')).overflowY,
          flap: getComputedStyle(document.querySelector('.po-flap-t')).transform, seal: getComputedStyle(document.querySelector('.po-seal')).opacity,
          label: getComputedStyle(document.querySelector('.po-open-label')).display }))()`);
        check('click: the envelope opens (flap folded, seal gone), the window scrolls', open.checked && open.overflow === 'auto' && open.flap.startsWith('matrix(1, 0, 0, 0,') && open.seal === '0' && open.label === 'none', `flap ${open.flap}`);
      }
      const a = await at(0), k = a.w / 700;
      check(`window ${mobile ? '1200' : '1000'} of 700, counter layer ${mobile ? '48% of the width' : '280 of 700'} at the bottom`, Math.abs(a.h - (mobile ? 1200 : 1000) * k) < 1 && Math.abs(a.desk.bottom - a.h) < 1 && Math.abs(a.desk.bottom - a.desk.top - (mobile ? 0.48 * a.w : 280 * k)) < 1,
        `window ${Math.round(a.h)}, counter ${Math.round(a.desk.bottom - a.desk.top)}`);
      check('start: the letterhead shows above the counter', a.head.bottom < a.desk.top && a.letter.top > 0, `letter top ${Math.round(a.letter.top)}, letterhead bottom ${Math.round(a.head.bottom)}, counter top ${Math.round(a.desk.top)}`);
      if (!mobile) check('start: the letter starts at y 420 (artifact)', Math.abs(a.letter.top - 420 * k) < 1.5, `${Math.round(a.letter.top)}`);
      await sleep(300); await shotEl('.po-window', `post_${TAG}${width}_1_start.png`);
      const m = await at(Math.round(600 * k));
      check('the counter stays still while scrolling', JSON.stringify(m.desk) === JSON.stringify(a.desk));
      await sleep(300); await shotEl('.po-window', `post_${TAG}${width}_2_middle.png`);
      // the button: scroll it to the middle of the free area and hit-test it (the counter has pointer-events: none)
      const hit = await ev(`(() => {
        const sc = document.querySelector('.po-scroll'), b = document.querySelector('.po-btn');
        sc.scrollTop += b.getBoundingClientRect().top - document.querySelector('.po-window').getBoundingClientRect().top - 200;
        const r = b.getBoundingClientRect(); const e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        return e === b || b.contains(e);
      })()`);
      check('the gift card button can be clicked', hit);
      const e = await at('end');
      check('end: scrolled to the bottom', Math.abs(e.scroll - e.max) <= 1, `${e.scroll} of ${e.max}`);
      check('end: the P.S. is above the counter, the letter ends behind it', e.ps.bottom < e.desk.top && e.letter.bottom > e.desk.top,
        `P.S. bottom ${Math.round(e.ps.bottom)}, counter top ${Math.round(e.desk.top)}, letter bottom ${Math.round(e.letter.bottom)}`);
      check(mobile ? 'end: the letter ends 21.6% of the width under the envelope top' : 'end: the letter ends 124 (of 700) under the counter top', Math.abs(e.letter.bottom - e.desk.top - (mobile ? 0.216 * e.w : 124 * k)) < 1.5, `${Math.round(e.letter.bottom - e.desk.top)}`);
      // the envelope is open at the back: the paper's bottom edge must stay below the tip of the bottom flap (42% of
      // the envelope), and the white back strips must meet the letter's sides exactly
      check('end: the letter\'s bottom edge stays hidden below the tip of the bottom flap', e.letter.bottom > e.env.top + 0.42 * (e.env.bottom - e.env.top) + 4,
        `letter bottom ${Math.round(e.letter.bottom)}, flap tip ${Math.round(e.env.top + 0.42 * (e.env.bottom - e.env.top))}`);
      check('the white back beside the letter meets its sides', Math.abs(e.backL.right - e.letter.left) < 1.5 && Math.abs(e.backR.left - e.letter.right) < 1.5 && Math.abs(e.backL.left - e.env.left) < 1 && Math.abs(e.backR.right - e.env.right) < 1,
        `back ${Math.round(e.backL.left)}-${Math.round(e.backL.right)} / ${Math.round(e.backR.left)}-${Math.round(e.backR.right)}, letter ${Math.round(e.letter.left)}-${Math.round(e.letter.right)}`);
      if (mobile) check('mobile: the letter is narrower than the envelope and starts at its top', e.letter.left > e.env.left && e.letter.right < e.env.right && Math.abs(e.env.top - e.desk.top) < 1, `letter ${Math.round(e.letter.left)}-${Math.round(e.letter.right)}, envelope ${Math.round(e.env.left)}-${Math.round(e.env.right)}`);
      check('the letter text fits its paper', await ev(`(() => { const l = document.querySelector('.po-letter'); return [...l.querySelectorAll('p, span, a')].every(t => t.getBoundingClientRect().right <= l.getBoundingClientRect().right + 0.5); })()`));
      if (mobile) {
        const fsz = await ev(`Math.min(...[...document.querySelectorAll('.po-letter .po-p')].map(p => parseFloat(getComputedStyle(p).fontSize)))`);
        check('mobile: letter text readable', fsz >= 16, `${fsz}px`);
      }
      await sleep(300); await shotEl('.po-window', `post_${TAG}${width}_3_end.png`);
      await ev(`document.querySelector('.po-detect').checked = false`);
      await sleep(300);
      check('fallback shown when detection fails', await ev(`getComputedStyle(document.querySelector('.po-fallback')).display === 'block' && getComputedStyle(document.querySelector('.po-interactive')).display === 'none'`));
      await shotEl('.po-fallback', `post_${TAG}${width}_fallback.png`);
    }
    ws.close();
  } finally { chrome.kill(); }
  console.log(out.join('\n'));
  console.log(`\n${failures ? failures + ' FAILED' : 'all checks passed'} — screenshots in ${S}`);
  process.exit(failures ? 1 : 0);
}
main().catch(e => { console.error(e); process.exit(1); });
