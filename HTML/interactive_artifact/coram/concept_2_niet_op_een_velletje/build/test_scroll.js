// Scroll tests for "Dit bedankje past niet op één velletje" over the Chrome DevTools Protocol at 760px (desktop),
// 390px and 360px (mobile): the window proportions, the roll standing still, the paper tip at the start, the paper
// always narrower than the roll and never under it, and the end (the last sheet above the roll, the paper 40 into it).
// Reads the mail, never writes it; screenshots go to the system temp folder (coram-c2-test).
//   node test_scroll.js                (CHROME=<path to chrome.exe> to override the Chrome location)
const path = require('path');
const { session } = require('../../shell/cdp.js');
const { WIN, LAYER, CUT } = require('./gen_rol.js');
const MAIL = path.resolve(__dirname, '../coram_eindejaarsmail_2026_concept_2.html');

(async () => {
  const t = await session('coram-c2-test', 9353);
  try {
    const at = pos => t.ev(`(() => {
      const win = document.querySelector('.cr-window'), sc = document.querySelector('.cr-scroll');
      sc.scrollTop = ${pos === 'end' ? 'sc.scrollHeight' : pos};
      const W = win.getBoundingClientRect(), rel = s => { const b = document.querySelector(s).getBoundingClientRect(); return { top: b.top - W.top, bottom: b.bottom - W.top, left: b.left - W.left, right: b.right - W.left }; };
      return { w: W.width, h: W.height, scroll: Math.round(sc.scrollTop), max: Math.round(sc.scrollHeight - sc.clientHeight),
        desk: rel('.cr-desk'), roll: rel('.cr-roll'), area: rel('.cr-scroll'), paper: rel('.cr-paper'), sign: rel('.cr-s-sign'), hero: rel('.cr-interactive .cr-h1') };
    })()`);
    for (const [width, mobile] of [[760, false], [390, true], [360, true]]) {
      t.log(`== ${width}px ${mobile ? '(mobile)' : '(desktop)'}`);
      await t.open(MAIL, width, mobile);
      await t.noOverflow(width);
      await t.layer('cr');
      const a = await at(0), k = a.w / 700, H = (mobile ? WIN.mob : WIN.desk) * k;
      t.check(`window ${mobile ? WIN.mob : WIN.desk} of 700, the roll layer ${LAYER} high at the bottom`, Math.abs(a.h - H) < 1 && Math.abs(a.desk.bottom - a.h) < 1 && Math.abs(a.desk.bottom - a.desk.top - LAYER * k) < 1,
        `window ${Math.round(a.h)}, layer ${Math.round(a.desk.bottom - a.desk.top)}`);
      t.check('the scroll area ends on the roll\'s middle line', Math.abs(a.area.bottom - (a.roll.top + CUT * k)) < 1, `${Math.round(a.area.bottom)} vs ${Math.round(a.roll.top + CUT * k)}`);
      t.check('the paper is narrower than the roll', a.paper.left > a.roll.left && a.paper.right < a.roll.right, `paper ${Math.round(a.paper.left)}-${Math.round(a.paper.right)}, roll ${Math.round(a.roll.left)}-${Math.round(a.roll.right)}`);
      const tip = a.roll.top - a.paper.top;
      t.check('start: the heading shows and a tip of the paper sticks out above the roll', a.hero.top > 0 && tip > 40 && tip < (mobile ? 0.35 * a.w : 200), `tip ${Math.round(tip)}px`);
      if (!mobile) t.check('start: the paper starts 360 under the wall\'s top (board)', Math.abs(a.paper.top - 360) < 1.5, `${Math.round(a.paper.top)}`);
      await t.sleep(300); await t.shot('.cr-window', `cr_${width}_1_start.png`);
      const m = await at(Math.round(900 * k));
      t.check('the roll stays still while scrolling', JSON.stringify(m.roll) === JSON.stringify(a.roll));
      await t.sleep(300); await t.shot('.cr-window', `cr_${width}_2_middle.png`);
      const e = await at('end');
      t.check('end: scrolled to the bottom', Math.abs(e.scroll - e.max) <= 1, `${e.scroll} of ${e.max}`);
      t.check('end: the signature stands above the roll, the paper ends 40 into it', e.sign.bottom < e.roll.top && Math.abs(e.paper.bottom - (e.roll.top + 40 * k)) < 1.5,
        `signature ${Math.round(e.sign.bottom)}, roll ${Math.round(e.roll.top)}, paper end ${Math.round(e.paper.bottom)}`);
      await t.sleep(300); await t.shot('.cr-window', `cr_${width}_3_end.png`);
      await t.fallback('cr', width);
      if (!mobile) await t.shot('body', `cr_${width}_mail_fallback.png`);
    }
  } catch (e) { console.error(e); t.kill(); process.exit(1); }
  t.finish();
})();
