// Click tests for "Zes wensen" over the Chrome DevTools Protocol: device emulation, real mouse clicks at the lights'
// positions (so pointer-events: none on opened lights is really tested), measurements and screenshots. With
// ARTIFACT=<path to the unpacked board html> it also renders the board in the same states and compares every text
// element (position and size, relative to the 640px mail column) with the mail at desktop width. Reads the mail,
// never writes it; screenshots go to the system temp folder. Needs Node 22+ (built-in fetch and WebSocket) and Chrome.
// With "v2" it tests colbe_eindejaarsmail_2026_concept_1_v2.html: lights turn off again, and with all six on they
// spiral into the middle and merge into the big ball (screenshots during the animation; the board comparison then only
// covers the start state, as the end state is new).
//   node test_clicks.js [v2]           (CHROME=<path to chrome.exe> to override the Chrome location)
const fs = require('fs'), os = require('os'), path = require('path'), { spawn } = require('child_process');
const V2 = process.argv[2] === 'v2';
const S = path.join(os.tmpdir(), V2 ? 'zes-wensen-test-v2' : 'zes-wensen-test') + '/';
fs.mkdirSync(S, { recursive: true });
const MAIL = path.resolve(__dirname, `../colbe_eindejaarsmail_2026_concept_1${V2 ? '_v2' : ''}.html`).replace(/\\/g, '/');
const ARTIFACT = process.env.ARTIFACT ? path.resolve(process.env.ARTIFACT).replace(/\\/g, '/') : null;
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9337;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const CORAL = 'rgb(255, 103, 72)', WHITE = 'rgb(255, 255, 255)';
// text elements compared with the board (the first characters of their text), per state
const KEYS_START = ['webversie', '[Logo Colbe]', 'Beste [meneer', 'Dit jaar kwam', 'Daarom hebben', 'wensen open', 'Begin waar je wilt.',
  'Open alle zes', 'Bedankt voor je vertrouwen', 'Met hartelijke groet', 'Ontdek wat Colbe', '[Foto: mensen', '[Foto: samen',
  'Wij houden je', 'Meld je hier af', '[Logo Colbe, wit]', 'SNEL NAAR', 'CONTACT', 'Onze website', 'LinkedIn'];
const KEYS_ALL = ['Rust', 'Groei', 'Verbinding', 'Balans', 'Plezier', 'Betekenis', 'alles samen', 'Alles komt samen', 'Fijne feestdagen',
  'Rust, groei', 'Bedankt voor je vertrouwen', 'Ontdek wat Colbe', 'LinkedIn'];

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
    const ev = async expr => { const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }); if (r.result.exceptionDetails) throw new Error(r.result.exceptionDetails.exception.description); return r.result.result.value; };
    const shot = async (png, sel) => {
      const r = sel ? await ev(`(() => { const b = document.querySelector('${sel}').getBoundingClientRect(); return { x: b.left + scrollX, y: b.top + scrollY, w: b.width, h: b.height }; })()`)
        : await ev(`({ x: 0, y: 0, w: innerWidth, h: document.documentElement.scrollHeight })`);
      const res = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: r.x, y: r.y, width: r.w, height: r.h, scale: 1 } });
      fs.writeFileSync(S + png, Buffer.from(res.result.data, 'base64'));
    };
    // a real click in the middle of an element (scrolled into view first)
    const click = async (sel, wait = 600) => {
      const p = await ev(`(() => { const e = document.querySelector('${sel}'); e.scrollIntoView({ block: 'center' }); const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`);
      for (const type of ['mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x: p.x, y: p.y, button: 'left', clickCount: 1 });
      await sleep(wait);
    };
    // the counter is generated content (::before), so read it from the accessibility tree
    const counter = async () => {
      const { result: { root } } = await send('DOM.getDocument', { depth: 0 });
      const { result: { nodeId } } = await send('DOM.querySelector', { nodeId: root.nodeId, selector: '.zw-count' });
      const { result } = await send('Accessibility.getPartialAXTree', { nodeId, fetchRelatives: false });
      const ax = (await send('Accessibility.getFullAXTree')).result.nodes;
      const byId = new Map(ax.map(n => [n.nodeId, n]));
      const txt = n => n.role && n.role.value === 'StaticText' ? n.name.value : (n.childIds || []).map(c => byId.get(c)).filter(Boolean).map(txt).join('');
      return txt(byId.get(result.nodes[0].nodeId) || result.nodes[0]);
    };
    const state = () => ev(`(() => {
      const vis = e => !!e && e.checkVisibility({ visibilityProperty: true }) && e.getBoundingClientRect().height > 0;
      const ia = document.querySelector('.zw-interactive');
      const checked = [1, 2, 3, 4, 5, 6].filter(n => document.querySelector('.zw-c' + n).checked);
      const wishes = [1, 2, 3, 4, 5, 6].map(n => { const w = ia.querySelector('.zw-w' + n), cs = getComputedStyle(w), r = w.getBoundingClientRect();
        const word = w.querySelector(vis(w.querySelector('.zw-word')) ? '.zw-word' : '.zw-plus').getBoundingClientRect();
        // the text fits inside the circle: its box within the circle's inner square-ish area (2px border + 2px air)
        return { n, bg: cs.backgroundColor, word: vis(w.querySelector('.zw-word')), fits: word.left >= r.left + 4 && word.right <= r.right - 4, fs: parseFloat(cs.fontSize), r }; });
      const lines = [...ia.querySelectorAll('.zw-line')].filter(vis).map(l => ({ n: +l.className.match(/zw-l(\\d)/)[1], z: +getComputedStyle(l).zIndex || 0, r: l.getBoundingClientRect(), sh: l.scrollHeight, ch: l.clientHeight }));
      const top = lines.slice().sort((a, b) => b.z - a.z)[0];
      const same = lines.every(l => ['left', 'top', 'width', 'height'].every(k => Math.abs(l.r[k] - lines[0].r[k]) < 0.5));
      const fits = lines.every(l => l.sh <= l.ch + 1);
      const center = getComputedStyle(ia.querySelector('.zw-center')).backgroundColor;
      // nothing covers the closed lights: hit-test their centres
      const free = wishes.filter(w => !w.word).every(w => { const e = document.elementFromPoint(w.r.left + w.r.width / 2, w.r.top + w.r.height / 2); return !!e && !!e.closest('.zw-w' + w.n); });
      const minFs = Math.min(...[...ia.querySelectorAll('p, span, label, div')].filter(e => vis(e) && [...e.childNodes].some(c => c.nodeType === 3 && c.textContent.trim())).map(e => parseFloat(getComputedStyle(e).fontSize)));
      return { checked, wishes: wishes.map(w => ({ n: w.n, coral: w.bg === '${CORAL}', word: w.word, fits: w.fits, fs: w.fs })), top: top ? top.n : -1, nLines: lines.length, same, fits, center,
        label: vis(ia.querySelector('.zw-all-txt')) ? 'alles samen' : vis(ia.querySelector('.zw-open-txt')) ? 'wensen open' : '?', ph: vis(ia.querySelector('.zw-ph')), finale: vis(ia.querySelector('.zw-finale')),
        tap: vis(document.querySelector('.zw-tap')), free, minFs, sceneIn: ia.querySelector('.zw-scene').getBoundingClientRect().right <= innerWidth };
    })()`);
    // text elements of the current page relative to the mail column (mail) or the board root (board)
    const boxes = keys => ev(`(async () => {
      await document.fonts.ready;
      const root = document.querySelector('.zw-hero') ? document.querySelector('.zw-hero').parentElement.getBoundingClientRect()
        : [...document.querySelectorAll('div')].find(d => d.getBoundingClientRect().width === 640).getBoundingClientRect();
      const all = [...document.querySelectorAll('body *')].filter(e => e.checkVisibility({ visibilityProperty: true }) && e.getBoundingClientRect().height > 0 && !['SCRIPT', 'STYLE', 'TABLE', 'TBODY', 'TR'].includes(e.tagName));
      const res = {};
      for (const k of ${JSON.stringify(keys)}) {
        const hits = all.filter(e => e.textContent.trim().replace(/\\s+/g, ' ').startsWith(k));
        // the innermost element holding the text
        const el = hits.find(e => !hits.some(o => o !== e && e.contains(o)));
        if (!el) { res[k] = null; continue; }
        // the text itself (a range), so padding of a cell doesn't count; a button (link) by its box, as the arrow is
        // an svg in the board and a text glyph in the mail
        const rg = document.createRange(); rg.selectNodeContents(el); const b = el.tagName === 'A' && el.style.border ? el.getBoundingClientRect() : rg.getBoundingClientRect();
        res[k] = { x: Math.round((b.left - root.left) * 10) / 10, y: Math.round((b.top - root.top) * 10) / 10, w: Math.round(b.width * 10) / 10, h: Math.round(b.height * 10) / 10, fs: getComputedStyle(el).fontSize };
      }
      return res; })()`);

    const viewports = [[760, false], [390, true], [360, true]];
    const mailBoxes = {};
    for (const [width, mobile] of viewports) {
      out.push(`== ${width}px ${mobile ? '(mobile)' : '(desktop)'}`);
      await send('Emulation.setDeviceMetricsOverride', { width, height: 1200, deviceScaleFactor: 1, mobile });
      await send('Page.navigate', { url: 'file:///' + MAIL });
      await sleep(2500);
      check('no horizontal overflow', await ev(`document.documentElement.scrollWidth <= innerWidth`), `page ${await ev('document.documentElement.scrollWidth')} / viewport ${width}`);
      check('interactive layer shown, fallback hidden', await ev(`getComputedStyle(document.querySelector('.zw-interactive')).display === 'block' && getComputedStyle(document.querySelector('.zw-fallback')).display === 'none'`));
      if (width === 760) mailBoxes.start = await boxes(KEYS_START);
      let st = await state();
      check('start: all "+", 0/6, "wensen open", "Begin waar je wilt.", placeholder, tap instruction', st.wishes.every(w => !w.coral && !w.word) && (await counter()) === '0/6'
        && st.label === 'wensen open' && st.top === 0 && st.ph && !st.finale && st.tap, `counter ${await counter()}, line ${st.top}`);
      check('start: the circle fits, nothing covers the lights', st.sceneIn && st.free);
      check('start: "+" fits in every light, smallest font >= 12px', st.wishes.every(w => w.fits) && st.minFs >= 12, `min ${st.minFs}px`);
      await shot(`wensen_${width}_0_start.png`);
      await click('.zw-w1'); st = await state();
      check('wish 1: coral with its word, 1/6, its line', st.checked.join() === '1' && st.wishes[0].coral && st.wishes[0].word && (await counter()) === '1/6' && st.top === 1, `checked ${st.checked}, line ${st.top}`);
      await click('.zw-w1'); st = await state();
      if (V2) {
        check('wish 1 again: turns off, 0/6, "Begin waar je wilt." again', !st.checked.length && !st.wishes[0].coral && !st.wishes[0].word && (await counter()) === '0/6' && st.top === 0,
          `checked ${st.checked}, counter ${await counter()}, line ${st.top}`);
        await click('.zw-w1'); st = await state();
        check('wish 1 a third time: on again, 1/6, its line', st.checked.join() === '1' && st.wishes[0].coral && (await counter()) === '1/6' && st.top === 1);
      } else check('wish 1 again: stays open', st.checked.join() === '1' && st.wishes[0].coral);
      await click('.zw-w3'); await click('.zw-w2'); st = await state();
      check('wishes 3 then 2: line 2 on top, 3/6', st.top === 2 && (await counter()) === '3/6', `line ${st.top}, counter ${await counter()}`);
      check('open lines share one box and the text fits in it', st.same && st.fits);
      check('open words fit in their lights', st.wishes.filter(w => w.word).every(w => w.fits), st.wishes.filter(w => !w.fits).map(w => w.n).join());
      check('the closed lights are not covered', st.free);
      await shot(`wensen_${width}_1_three.png`, '.zw-interactive');
      if (V2) {
        // v2: turn 2 off and on again on the way, then the sixth light starts the merge
        await click('.zw-w2'); st = await state();
        check('wish 2 off again: 2/6, line 3 back on top', (await counter()) === '2/6' && !st.wishes[1].coral && st.top === 3, `counter ${await counter()}, line ${st.top}`);
        for (const n of [2, 4, 5]) await click('.zw-w' + n);
        await click('.zw-w6', 0);
        const t0 = Date.now();
        const during = {};
        for (const at of [700, 1500, 2300, 2900, 3300]) {
          await sleep(at - (Date.now() - t0));
          during[at] = await ev(`(() => { const ia = document.querySelector('.zw-interactive');
            return { glow: getComputedStyle(ia.querySelector('.zw-w1')).boxShadow, lines: getComputedStyle(ia.querySelector('.zw-lines')).display,
              ph: getComputedStyle(ia.querySelector('.zw-ph')).display, wrap: ia.querySelector('.zw-fin-wrap').getBoundingClientRect().height }; })()`);
          await shot(`wensen_${width}_merge_${at}.png`, '.zw-interactive');
        }
        check('merge: the lights glow while they spin', during[1500].glow !== 'none' && /rgba\(255, 103, 72/.test(during[1500].glow), during[1500].glow);
        check('merge: wish line and placeholder take no space, no blank space for the card before it appears',
          [700, 1500, 2300, 2900, 3300].every(at => during[at].lines === 'none' && during[at].ph === 'none' && during[at].wrap === 0), JSON.stringify(during[2900]));
        await sleep(4600 - (Date.now() - t0));
        const m = await ev(`(() => { const ia = document.querySelector('.zw-interactive'), sc = ia.querySelector('.zw-scene').getBoundingClientRect();
          const cx = sc.left + sc.width / 2, cy = sc.top + sc.height / 2;
          const orbs = [...ia.querySelectorAll('.zw-orb')].map(o => { const b = o.getBoundingClientRect(); return { d: Math.hypot(b.left + b.width / 2 - cx, b.top + b.height / 2 - cy), op: +getComputedStyle(o).opacity }; });
          const c = ia.querySelector('.zw-center').getBoundingClientRect(), r = c.width / 2;
          const s = ia.querySelector('.zw-sentence'), rg = document.createRange(); rg.selectNodeContents(s);
          // every line box of the sentence and the counter inside the ball, with 6px air
          const inside = [...rg.getClientRects(), ...[...ia.querySelectorAll('.zw-count, .zw-clabel')].map(e => e.getBoundingClientRect())].every(b =>
            [[b.left, b.top], [b.right, b.top], [b.left, b.bottom], [b.right, b.bottom]].every(([x, y]) => Math.hypot(x - (c.left + r), y - (c.top + r)) <= r - 6));
          return { orbs, ball: c.width / sc.width, round: Math.abs(c.width - c.height) < 1, centred: Math.hypot(c.left + r - cx, c.top + r - cy) < 1, inside,
            sentence: +getComputedStyle(s).opacity, text: s.textContent, lines: +getComputedStyle(ia.querySelector('.zw-lines')).opacity,
            ring: +getComputedStyle(ia.querySelector('.zw-ring')).opacity, finale: +getComputedStyle(ia.querySelector('.zw-finale')).opacity,
            // the card fully open: its wrapper as high as the card
            open: ia.querySelector('.zw-fin-wrap').getBoundingClientRect().height >= ia.querySelector('.zw-finale').getBoundingClientRect().height - 0.5 }; })()`);
        check('merge: all six lights end in the middle and fade into it', m.orbs.every(o => o.d < 1.5 && o.op === 0), m.orbs.map(o => o.d.toFixed(1) + '/' + o.op).join(' '));
        check('merge: one big round ball, the ring\'s size (300 of 420), centred', Math.abs(m.ball - 300 / 420) < 0.005 && m.round && m.centred, `ball ${(m.ball * 420).toFixed(1)} of 420`);
        check('merge: "6/6 alles samen" and the sentence inside the ball', m.sentence === 1 && m.inside && m.text === 'Verbinding: mensen om je heen die je zien en steunen.', JSON.stringify({ inside: m.inside, op: m.sentence }));
        check('merge: ring faded, greeting card shown and fully open', m.ring === 0 && m.finale === 1 && m.open);
        await click('.zw-center'); st = await state();
        check('merge: tapping the ball changes nothing', st.checked.length === 6, `checked ${st.checked}`);
        await shot(`wensen_${width}_merge_end.png`, '.zw-interactive');
      } else {
        for (const n of [4, 5, 6]) await click('.zw-w' + n);
        await sleep(800);
      }
      st = await state();
      check('all six: 6/6, coral middle "alles samen", finale, no placeholder', (await counter()) === '6/6' && st.center === CORAL && st.label === 'alles samen' && st.finale && !st.ph,
        `counter ${await counter()}, centre ${st.center}, label ${st.label}`);
      if (!V2) check('all six: every word fits in its light, line 6 on top', st.wishes.every(w => w.fits && w.word) && st.top === 6, st.wishes.filter(w => !w.fits).map(w => w.n).join());
      check('all six: no horizontal overflow', await ev(`document.documentElement.scrollWidth <= innerWidth`));
      if (width === 760) mailBoxes.all = await boxes(KEYS_ALL);
      await shot(`wensen_${width}_2_all.png`);
      // fallback: what Gmail, Outlook and Samsung get (detection off)
      await ev(`document.querySelector('.zw-detect').checked = false`); await sleep(300);
      const fb = await ev(`(() => { const f = document.querySelector('.zw-fallback'), r = f.getBoundingClientRect();
        const circles = [...f.querySelectorAll('td[bgcolor="#FF6748"]')].filter(td => td.style.borderRadius === '50%').map(td => td.getBoundingClientRect());
        return { shown: getComputedStyle(f).display === 'block' && getComputedStyle(document.querySelector('.zw-interactive')).display === 'none',
          tap: getComputedStyle(document.querySelector('.zw-tap')).display, n: circles.length, round: circles.every(c => Math.abs(c.width - c.height) < 1),
          inside: circles.every(c => c.left >= r.left && c.right <= r.right), overlap: circles.some((a, i) => circles.some((b, j) => i < j && a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom)),
          overflow: document.documentElement.scrollWidth > innerWidth }; })()`);
      check('fallback: shown without detection, no tap instruction', fb.shown && fb.tap === 'none');
      check('fallback: 7 round circles (6 wishes + middle), inside the mail, not overlapping', fb.n === 7 && fb.round && fb.inside && !fb.overlap && !fb.overflow, JSON.stringify(fb));
      await shot(`wensen_${width}_3_fallback.png`);
    }

    // side by side with the board (desktop): screenshots in the same states and the text elements compared
    if (ARTIFACT) {
      out.push('== artifact board (640px)');
      await send('Emulation.setDeviceMetricsOverride', { width: 640, height: 2300, deviceScaleFactor: 1, mobile: false });
      await send('Page.navigate', { url: 'file:///' + ARTIFACT });
      await sleep(5000);
      const board = { start: await boxes(KEYS_START) };
      await shot('board_0_start.png');
      const wish = n => ev(`document.querySelectorAll('.wens')[${n}].click()`);
      for (const n of [0, 2, 1]) { await wish(n); await sleep(400); }
      await shot('board_1_three.png');
      for (const n of [3, 4, 5]) { await wish(n); await sleep(400); }
      await sleep(900);
      board.all = await boxes(KEYS_ALL);
      await shot('board_2_all.png');
      for (const st of V2 ? ['start'] : ['start', 'all']) for (const k of Object.keys(board[st])) {
        const a = board[st][k], m = mailBoxes[st][k];
        if (!a || !m) { check(`${st}: "${k}" found in both`, false, `board ${!!a}, mail ${!!m}`); continue; }
        const d = ['x', 'y', 'w', 'h'].map(p => Math.abs(a[p] - m[p]));
        check(`${st}: "${k}" matches the board within 2px`, Math.max(...d) <= 2, `board ${a.x},${a.y} ${a.w}x${a.h} ${a.fs} | mail ${m.x},${m.y} ${m.w}x${m.h} ${m.fs}`);
      }
    }
  } finally {
    chrome.kill();
  }
  console.log(out.join('\n'));
  console.log(`\n${failures ? failures + ' FAILED' : 'all passed'}; screenshots in ${S}`);
  process.exitCode = failures ? 1 : 0;
}
main().catch(e => { console.error(e); process.exit(1); });
