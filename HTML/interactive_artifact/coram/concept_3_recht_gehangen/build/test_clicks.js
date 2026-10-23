// Click tests for "Recht gehangen" over the Chrome DevTools Protocol at 760px (desktop), 390px and 360px (mobile):
// real clicks on the arrows, the rail's rotation, the bubble, the texts, the towel, the reset, and the fallback.
// Reads the mail, never writes it; screenshots go to the system temp folder (coram-c3-test).
//   node test_clicks.js                (CHROME=<path to chrome.exe> to override the Chrome location)
const path = require('path');
const { session } = require('../../shell/cdp.js');
const MAIL = path.resolve(__dirname, '../coram_eindejaarsmail_2026_concept_3.html');

(async () => {
  const t = await session('coram-c3-test', 9351);
  try {
    // the rail's angle (from its computed matrix), the bubble's left in % of the vial, what shows
    const state = () => t.ev(`(() => {
      const q = s => document.querySelector(s), cs = s => getComputedStyle(q(s));
      const m = cs('.cw-rack').transform, a = m === 'none' ? 0 : Math.round(Math.atan2(+m.split(',')[1], +m.split('(')[1].split(',')[0]) * 180 / Math.PI);
      const vis = s => { const e = q(s); return cs(s).display !== 'none' && cs(s).visibility !== 'hidden' && e.getBoundingClientRect().height > 0; };
      const v = q('.cw-vial').getBoundingClientRect(), b = q('.cw-bubble').getBoundingClientRect();
      const text = [0, 1, 2].filter(i => vis('.cw-t' + i));
      return { angle: a, bubble: Math.round((b.left - v.left) / v.width * 96), text, btn1: vis('.cw-btn1'), btn2: vis('.cw-btn2'), towel: vis('.cw-towel'), reset: vis('.cw-reset'),
        c1: q('.cw-c1').checked, c2: q('.cw-c2').checked, detect: q('.cw-detect').checked,
        inside: [...document.querySelectorAll('.cw-btn')].filter(e => getComputedStyle(e).display !== 'none').every(e => { const r = e.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth; }) };
    })()`);

    for (const [width, mobile] of [[760, false], [390, true], [360, true]]) {
      t.log(`== ${width}px ${mobile ? '(mobile)' : '(desktop)'}`);
      await t.open(MAIL, width, mobile);
      await t.noOverflow(width);
      await t.layer('cw');
      let s = await state();
      t.check('start: crooked (-6 degrees), bubble right (68), first text, first arrow, no towel', s.angle === -6 && Math.abs(s.bubble - 68) <= 1 && s.text.join() === '0' && s.btn1 && !s.btn2 && !s.towel && !s.reset && s.inside,
        `angle ${s.angle}, bubble ${s.bubble}, text ${s.text}`);
      await t.shot('.cw-hero', `cw_${width}_1_start.png`);
      await t.click('.cw-btn1', 1300); s = await state();
      t.check('arrow 1: too far (8 degrees), bubble left (6), "Oeps", second arrow', s.c1 && s.angle === 8 && Math.abs(s.bubble - 6) <= 1 && s.text.join() === '1' && !s.btn1 && s.btn2 && !s.towel && s.inside,
        `angle ${s.angle}, bubble ${s.bubble}, text ${s.text}`);
      await t.shot('.cw-hero', `cw_${width}_2_oeps.png`);
      await t.click('.cw-btn2', 1300); s = await state();
      t.check('arrow 2: level (0), bubble in the middle (37), end text, towel, "Nog een keer"', s.c2 && s.angle === 0 && Math.abs(s.bubble - 37) <= 1 && s.text.join() === '2' && !s.btn1 && !s.btn2 && s.towel && s.reset,
        `angle ${s.angle}, bubble ${s.bubble}, text ${s.text}`);
      await t.shot('.cw-hero', `cw_${width}_3_level.png`);
      await t.click('.cw-reset', 1300); s = await state();
      t.check('"Nog een keer": back to the start, the detection stays on', !s.c1 && !s.c2 && s.detect && s.angle === -6 && s.text.join() === '0' && s.btn1, `angle ${s.angle}`);
      await t.fallback('cw', width);
      if (!mobile) await t.shot('body', `cw_${width}_mail_fallback.png`);
    }
  } catch (e) { console.error(e); t.kill(); process.exit(1); }
  t.finish();
})();
