// Click tests for "Van boorgat tot badkamer" over the Chrome DevTools Protocol at 760px (desktop), 390px and 360px
// (mobile): real clicks on the pluses in a mixed order, the newest text on top, the products at the board's positions,
// the finale, "Opnieuw" and the fallback. Reads the mail, never writes it; screenshots go to the system temp folder
// (coram-c1-test).
//   node test_clicks.js                (CHROME=<path to chrome.exe> to override the Chrome location)
const path = require('path');
const { session } = require('../../shell/cdp.js');
const MAIL = path.resolve(__dirname, '../coram_eindejaarsmail_2026_concept_1.html');

// products at the board's coordinates in the 620 x 470 scene (Main.dc.html)
const BOARD = { '.cb-spiegel': [230, 50, 160, 240], '.cb-rek-4': [516, 128, 68, 130], '.cb-zeep-3': [442, 266, 34, 64], '.cb-plank-3': [44, 236, 132, 8], '.cb-haak-1': [68, 62, 22, 22] };

(async () => {
  const t = await session('coram-c1-test', 9352);
  try {
    const state = () => t.ev(`(() => {
      const q = s => document.querySelector(s), vis = e => e && getComputedStyle(e).display !== 'none' && getComputedStyle(e).visibility !== 'hidden' && e.getBoundingClientRect().height > 0;
      const msgs = [...document.querySelectorAll('.cb-msg')].filter(vis).map(m => ({ n: +m.className.match(/cb-msg(\\d)/)[1], z: +getComputedStyle(m).zIndex || 0 }));
      const top = msgs.sort((a, b) => b.z - a.z)[0];
      const plus = [...document.querySelectorAll('.cb-plus')].filter(vis).map(p => p.getBoundingClientRect());
      const apart = plus.every((a, i) => plus.every((b, j) => i === j || Math.hypot(a.left - b.left, a.top - b.top) >= a.width));
      return { checked: [1, 2, 3, 4, 5].filter(n => q('.cb-c' + n).checked), on: [1, 2, 3, 4, 5].filter(n => getComputedStyle(q('.cb-on' + n)).display !== 'none'), plus: plus.length, apart,
        inside: plus.every(r => r.left >= 0 && r.right <= innerWidth), top: top ? top.n : -1, done: vis(q('.cb-done')),
        head: vis(q('.cb-h1-done')) ? 'done' : 'start' };
    })()`);
    for (const [width, mobile] of [[760, false], [390, true], [360, true]]) {
      t.log(`== ${width}px ${mobile ? '(mobile)' : '(desktop)'}`);
      await t.open(MAIL, width, mobile);
      await t.noOverflow(width);
      await t.layer('cb');
      let s = await state();
      t.check('start: 5 pluses (apart, inside), no product, start text, start headline', s.plus === 5 && s.apart && s.inside && s.on.length === 0 && s.top === 0 && s.head === 'start' && !s.done,
        `pluses ${s.plus}, top text ${s.top}`);
      await t.shot('.cb-wrap', `cb_${width}_1_start.png`);
      await t.click('label[for="cb-c3"]'); await t.click('label[for="cb-c1"]'); s = await state();
      t.check('mirror then hook: both mounted, their pluses gone, the hook\'s text on top', s.on.join() === '1,3' && s.plus === 3 && s.top === 1, `on ${s.on}, top ${s.top}`);
      await t.shot('.cb-wrap', `cb_${width}_2_two.png`);
      if (!mobile) {
        const pos = await t.ev(`(() => { const sc = document.querySelector('.cb-scene').getBoundingClientRect(), k = sc.width / 620;
          return Object.fromEntries(${JSON.stringify(Object.keys(BOARD))}.map(sel => { const r = document.querySelector(sel).getBoundingClientRect(); return [sel, [(r.left - sc.left) / k, (r.top - sc.top) / k, r.width / k, r.height / k].map(v => Math.round(v * 10) / 10)]; })); })()`);
        const offAll = Object.entries(BOARD).filter(([sel, b]) => b.some((v, i) => Math.abs(v - pos[sel][i]) > 0.5));
        t.check('products at the board\'s positions (within 0.5px, mounted ones)', offAll.filter(([sel]) => sel === '.cb-spiegel' || sel === '.cb-haak-1').length === 0,
          offAll.map(([sel]) => `${sel} ${pos[sel]}`).join('; ') || 'all match');
      }
      for (const n of [2, 4, 5]) await t.click(`label[for="cb-c${n}"]`);
      s = await state();
      t.check('all five: every product, no pluses, finale text on top, done headline, signature and "Opnieuw"', s.on.length === 5 && s.plus === 0 && s.top === 6 && s.head === 'done' && s.done,
        `on ${s.on}, top ${s.top}, head ${s.head}`);
      if (!mobile) {
        const pos = await t.ev(`(() => { const sc = document.querySelector('.cb-scene').getBoundingClientRect(), k = sc.width / 620;
          return Object.fromEntries(${JSON.stringify(Object.keys(BOARD))}.map(sel => { const r = document.querySelector(sel).getBoundingClientRect(); return [sel, [(r.left - sc.left) / k, (r.top - sc.top) / k, r.width / k, r.height / k].map(v => Math.round(v * 10) / 10)]; })); })()`);
        const off = Object.entries(BOARD).filter(([sel, b]) => b.some((v, i) => Math.abs(v - pos[sel][i]) > 0.5));
        t.check('all products at the board\'s positions (within 0.5px)', off.length === 0, off.map(([sel]) => `${sel} ${pos[sel]}`).join('; ') || 'all match');
      }
      await t.shot('.cb-wrap', `cb_${width}_3_done.png`);
      await t.click('.cb-reset'); s = await state();
      t.check('"Opnieuw": back to the start', s.on.length === 0 && s.plus === 5 && s.top === 0 && s.head === 'start', `on ${s.on}`);
      await t.fallback('cb', width);
      if (!mobile) await t.shot('body', `cb_${width}_mail_fallback.png`);
    }
  } catch (e) { console.error(e); t.kill(); process.exit(1); }
  t.finish();
})();
