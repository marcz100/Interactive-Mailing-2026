// Scroll tests for "De lift" over the Chrome DevTools Protocol (real device emulation, real scrolling, measurements,
// screenshots). Reads the mail, never writes it; screenshots and the Chrome profile go to the system temp folder.
// Needs Node 22+ (built-in fetch and WebSocket) and Chrome.
//   node test_scroll.js                (CHROME=<path to chrome.exe> to override the Chrome location)
const fs = require('fs'), os = require('os'), path = require('path'), { spawn } = require('child_process');
const S = path.join(os.tmpdir(), 'lift-test') + '/';
fs.mkdirSync(S, { recursive: true });
const MAIL = path.resolve(__dirname, '../westcord_eindejaarsmail_2026_concept_1.html').replace(/\\/g, '/');
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9334;
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

    for (const [width, mobile] of [[760, false], [390, true], [360, true]]) {
      out.push(`== ${width}px ${mobile ? '(mobile)' : '(desktop)'}`);
      await send('Emulation.setDeviceMetricsOverride', { width, height: 1400, deviceScaleFactor: 1, mobile });
      await send('Page.navigate', { url: 'file:///' + MAIL });
      await sleep(3000);
      check('no horizontal overflow', await ev(`document.documentElement.scrollWidth <= innerWidth`), `page ${await ev('document.documentElement.scrollWidth')} / viewport ${width}`);
      check('interactive layer shown, fallback hidden', await ev(`getComputedStyle(document.querySelector('.plx-interactive')).display === 'block' && getComputedStyle(document.querySelector('.plx-fallback')).display === 'none'`));
      // scroll to the artifact's three moments: 0, 1700 and the end (3300) of the 4200 building
      for (const [name, artY] of [['1_roof', 0], ['2_floors', 1700], ['2b_welcome', 2800], ['3_lobby', 3300]]) {
        const info = await ev(`(() => {
          const sc = document.querySelector('.plx-scroll'), k = sc.querySelector('.plx-building').getBoundingClientRect().width / 700;
          sc.scrollTop = ${artY} * k;
          const cab = document.querySelector('.plx-cabin').getBoundingClientRect();
          const near = (a, b) => Math.abs(a.left - b.left) < 1.5 && Math.abs(a.top - b.top) < 1.5 && Math.abs(a.width - b.width) < 1.5 && Math.abs(a.height - b.height) < 1.5;
          const els = [...sc.querySelectorAll('.plx-a')];
          const door = els.find(e => e.style.top === '${+(520 / 4200 * 100).toFixed(4)}%' && e.style.left === '${+(285 / 700 * 100).toFixed(4)}%');
          const inside = els.find(e => e.classList.contains('plx-front') && e.style.top === '${+(3820 / 4200 * 100).toFixed(4)}%');
          // the cabin has pointer-events: none, so hit-testing can't see it: check the stacking geometrically instead.
          // "in front" = visible element inside the window with a computed z-index above the cabin's, overlapping it
          const win = document.querySelector('.plx-window').getBoundingClientRect(), cabZ = +getComputedStyle(document.querySelector('.plx-cabin')).zIndex;
          const overlap = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom, win.bottom) - Math.max(a.top, b.top, win.top));
          const front = [...sc.querySelectorAll('*')].filter(e => { const cs = getComputedStyle(e); return cs.display !== 'none' && cs.position !== 'static' && +cs.zIndex > cabZ && overlap(e.getBoundingClientRect(), cab) > 4; })
            .map(e => e.classList.contains('plx-plate') ? 'plate' : e.classList.contains('plx-lobby-card') ? 'welcome' : e.classList.contains('plx-front') ? 'entrance' : e.className);
          return { scrollTop: Math.round(sc.scrollTop), max: Math.round(sc.scrollHeight - sc.clientHeight),
            onDoor: near(cab, door.getBoundingClientRect()), onEntrance: near(cab, inside.getBoundingClientRect()),
            front: [...new Set(front)], cab: [Math.round(cab.width), Math.round(cab.height)] };
        })()`);
        if (name === '1_roof') {
          check('top: cabin exactly on the roof-house door', info.onDoor, `cabin ${info.cab.join('x')}`);
          check('top: nothing in front of the cabin', info.front.length === 0, `in front: ${info.front.join(', ') || 'none'}`);
        }
        if (name === '2_floors') check(mobile ? 'floors: only plates pass in front of the cabin (mobile design)' : 'floors: nothing in front of the cabin',
          mobile ? info.front.every(f => f === 'plate') : info.front.length === 0, `in front: ${info.front.join(', ') || 'none'}`);
        if (name === '2b_welcome') check('lobby: the cabin passes behind the welcome card', info.front.includes('welcome'), `in front: ${info.front.join(', ') || 'none'}`);
        if (name === '3_lobby') {
          check('end: scrolled to the bottom', Math.abs(info.scrollTop - info.max) <= 1, `${info.scrollTop} of ${info.max}`);
          check('end: the entrance lands exactly on the cabin', info.onEntrance);
          check('end: the entrance is in front of the cabin (doors open)', info.front.includes('entrance'), `in front: ${info.front.join(', ') || 'none'}`);
        }
        await sleep(300);
        await shotEl('.plx-window', `lift_${width}_${name}.png`);
      }
      // scroll-driven extras: doors closed until the landing, the floor number lit while the cabin passes the floor
      const state = async artY => ev(`(() => {
        const sc = document.querySelector('.plx-scroll'), W = sc.querySelector('.plx-building').getBoundingClientRect().width;
        sc.scrollTop = ${artY} * W / 700;
        return new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => {
          const door = Math.round(document.querySelector('.plx-door-l').getBoundingClientRect().width / W * 700);
          const lit = [4, 3, 2, 1].filter(n => getComputedStyle(document.querySelector('.plx-num-' + n)).textShadow !== 'none');
          const L = getComputedStyle(document.querySelector('.plx-lift-badge')).boxShadow !== 'none';
          r({ door, lit, L });
        })));
      })()`);
      for (const [label, artY, expDoor, expLit] of [['top (roof)', 0, 61, []], ['floor 4', 1080 - 630, 61, [4]], ['floor 3', 1720 - 630, 61, [3]],
        ['floor 2', 2360 - 630, 61, [2]], ['floor 1', 3000 - 630, 61, [1]], ['just before landing', 3150, 61, []], ['landed (end)', 3300, 40, []]]) {
        const st = await state(artY);
        check(`${label}: doors ${expDoor === 61 ? 'closed, L off' : 'open, L lit'}, lit floor ${expLit.join(',') || 'none'}`,
          Math.abs(st.door - expDoor) <= 1 && JSON.stringify(st.lit) === JSON.stringify(expLit) && st.L === (expDoor === 40), `door panel ${st.door}/700, lit ${st.lit.join(',') || 'none'}, L ${st.L ? 'lit' : 'off'}`);
        if (label === 'floor 3' || label === 'landed (end)') await shotEl('.plx-window', `lift_${width}_${label.replace(/\W+/g, '_')}.png`);
      }
      if (mobile) {
        const btns = await ev(`[...document.querySelectorAll('.plx-btn')].map(b => { const r = b.getBoundingClientRect(), p = b.parentElement.getBoundingClientRect(); return { w: Math.round(r.width), pw: Math.round(p.width - parseFloat(getComputedStyle(b.parentElement).paddingLeft) - parseFloat(getComputedStyle(b.parentElement).paddingRight)), top: Math.round(r.top) }; })`);
        check('buttons stacked and full width', btns.length === 2 && btns[1].top > btns[0].top && btns.every(b => Math.abs(b.w - b.pw) <= 1), btns.map(b => `${b.w}/${b.pw}`).join(', '));
        const plates = await ev(`(() => {
          const slabs = [...document.querySelectorAll('.plx-slab')].map(s => s.getBoundingClientRect().top);
          return [...document.querySelectorAll('.plx-plate')].map((p, i) => {
            const r = p.getBoundingClientRect(), fs = Math.min(...[...p.querySelectorAll('p, span')].map(e => parseFloat(getComputedStyle(e).fontSize)));
            const floorEnd = slabs[i];   // plate i belongs to floor 4-i, whose slab is slabs[i]
            return { i: i + 1, bottom: Math.round(r.bottom), floorEnd: Math.round(floorEnd), minFont: fs, z: getComputedStyle(p).zIndex };
          });
        })()`);
        for (const p of plates) check(`plate ${p.i} fits in its floor and is readable`, p.bottom <= p.floorEnd && p.minFont >= 10 && p.z === '3', `bottom ${p.bottom} / slab ${p.floorEnd}, smallest font ${p.minFont}px, z ${p.z}`);
      }
      // fallback
      await ev(`document.querySelector('.plx-detect').checked = false`);
      await sleep(300);
      check('fallback shown when detection fails', await ev(`getComputedStyle(document.querySelector('.plx-fallback')).display === 'block' && getComputedStyle(document.querySelector('.plx-interactive')).display === 'none'`));
      await shotEl('.plx-fallback', `lift_${width}_fallback.png`);
    }
    ws.close();
  } finally { chrome.kill(); }
  console.log(out.join('\n'));
  console.log(`\n${failures ? failures + ' FAILED' : 'all checks passed'} — screenshots in ${S}`);
  process.exit(failures ? 1 : 0);
}
main().catch(e => { console.error(e); process.exit(1); });
