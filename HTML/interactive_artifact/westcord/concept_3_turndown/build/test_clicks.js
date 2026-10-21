// Drives headless Chrome over the DevTools Protocol: real device emulation, real clicks with real waits,
// computed-style measurements and screenshots. Reads the mail, never writes it; screenshots and the Chrome profile go
// to the system temp folder. Needs Node 22+ (built-in fetch and WebSocket) and Chrome.
//   node test_clicks.js                (CHROME=<path to chrome.exe> to override the Chrome location)
const fs = require('fs'), os = require('os'), path = require('path'), { spawn } = require('child_process');
const S = path.join(os.tmpdir(), 'turndown-test') + '/';
const P = S + 'preview/';
fs.mkdirSync(P, { recursive: true });
const MAIL = path.resolve(__dirname, '../westcord_eindejaarsmail_2026_concept_3.html').replace(/\\/g, '/');
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9333;
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${S}chrome-profile-cdp`, 'about:blank'], { stdio: 'ignore' });
  try {
    let list; for (let i = 0; i < 40 && !list; i++) { await sleep(250); try { list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); } catch {} }
    const page = list.find(t => t.type === 'page');
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise(r => ws.addEventListener('open', r, { once: true }));
    let id = 0; const pending = new Map();
    ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
    const send = (method, params = {}) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
    const evaluate = async expr => (await send('Runtime.evaluate', { expression: expr, returnByValue: true })).result.result.value;
    const shot = async (png, h) => { const r = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: (await evaluate('innerWidth')), height: h, scale: 1 } });
      fs.writeFileSync(P + png, Buffer.from(r.result.data, 'base64')); };

    const scenarios = [
      ['A_3then1', [['f', 3], ['f', 1]], 'Hoekje 1'],
      ['B_1then3', [['f', 1], ['f', 3]], 'Hoekje 3'],
      ['C_1then3_close3', [['f', 1], ['f', 3], ['o', 3]], 'Hoekje 1'],
      ['E_2_4_1', [['f', 2], ['f', 4], ['f', 1]], 'Hoekje 1'],
      ['F_quick_4then2', [['f', 4, 300], ['f', 2]], 'Hoekje 2'],
      ['G_1then2_reported', [['f', 1], ['f', 2]], 'Hoekje 2'],
      ['D_all_reset', [['f', 1], ['f', 2], ['f', 3], ['f', 4], ['r']], '(none, start state)'],
    ];
    const results = [];
    for (const [width, mobile] of [[390, true], [360, true], [700, false]]) {
      await send('Emulation.setDeviceMetricsOverride', { width, height: 1200, deviceScaleFactor: 1, mobile });
      for (const [name, steps, expected] of (mobile ? scenarios : [['desktop_all', [['f', 1], ['f', 2], ['f', 3], ['f', 4]], '4 facts around']])) {
        await send('Page.navigate', { url: 'file:///' + MAIL });
        await sleep(2500);                                   // load + webfonts
        for (const [kind, n, wait] of steps) {
          await evaluate(kind === 'r' ? `document.querySelector('.hs-reset').click()` : `document.querySelector('.hs-${kind === 'f' ? 'flap' : 'fold'}-${n}').click()`);
          await sleep(wait || 1300);                         // real time between clicks
        }
        const info = await evaluate(`(() => {
          const facts = [...document.querySelectorAll('.hs-fact')].map(f => ({ el: f, n: f.className.match(/hs-fact-(\\d)/)[1], cs: getComputedStyle(f) }))
            .filter(x => x.cs.display !== 'none').map(x => ({ n: x.n, z: +x.cs.zIndex, anim: x.cs.animationName, r: x.el.getBoundingClientRect(),
              textBottom: Math.max(...[...x.el.children].map(c => c.getBoundingClientRect().bottom)) }));
          const top = facts.slice().sort((a, b) => b.z - a.z)[0];
          // mobile: every fact under the top one must lie fully inside the top one's box (no text peeking out),
          // and the top one's own text must fit inside its box
          const inside = (a, b) => a.left >= b.left - 0.5 && a.right <= b.right + 0.5 && a.top >= b.top - 0.5 && a.bottom <= b.bottom + 0.5;
          const covered = top && top.anim !== 'none' ? facts.filter(f => f !== top).every(f => inside(f.r, top.r)) && facts.every(f => f.textBottom <= f.r.bottom + 0.5) : null;
          const st = [...document.querySelectorAll('.hs-st')].find(s => getComputedStyle(s).display !== 'none');
          const list = [...document.querySelectorAll('.hs-li')].filter(l => getComputedStyle(l).display !== 'none' && l.getBoundingClientRect().height > 0)
            .map(l => +l.className.match(/hs-li-(\\d)/)[1]);
          return { vw: innerWidth, visible: facts.map(f => ({ n: f.n, z: f.z, h: Math.round(f.r.height) })), topmost: top ? 'Hoekje ' + top.n : '(none)', covered, list, status: st ? st.textContent : '' };
        })()`);
        // expected summary: the open corners in corner order on mobile, nothing on desktop
        const open = new Set(); for (const [kind, n] of steps) { if (kind === 'r') open.clear(); else if (kind === 'f') open.add(n); else open.delete(n); }
        const expList = mobile ? [...open].sort() : [];
        const listOk = JSON.stringify(info.list) === JSON.stringify(expList);
        results.push(`${name} [${width}px]: expected ${expected} | got ${info.topmost} | fully covered: ${info.covered} | summary ${JSON.stringify(info.list)} ${listOk ? 'OK' : 'WRONG, expected ' + JSON.stringify(expList)} | status "${info.status}"`);
        await shot(`cdp_${name}_${width}.png`, mobile ? 1000 : 1150);
      }
    }
    console.log(results.join('\n'));
    ws.close();
  } finally { chrome.kill(); }
}
main().catch(e => { console.error(e); process.exit(1); });
