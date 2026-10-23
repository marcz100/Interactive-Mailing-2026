// Click tests for "De lijn van het jaar" over the Chrome DevTools Protocol at 760px (desktop), 390px and 360px
// (mobile): the four steps with real clicks (and a click on a button before its turn), the pipe colour per stretch, the
// gaps where the clogs were, the stream and the end texts; desktop positions against the board; on mobile the tap, the
// clogs and the bath tap lined up with the pipe on the left. Reads the mail, never writes it; screenshots go to the
// system temp folder (coram-c4-test).
//   node test_clicks.js                (CHROME=<path to chrome.exe> to override the Chrome location)
const path = require('path');
const { session } = require('../../shell/cdp.js');
const MAIL = path.resolve(__dirname, '../coram_eindejaarsmail_2026_concept_4.html');
const BLUE = 'rgb(37, 37, 176)';
// desktop: board positions relative to the scene (board y - 80): [selector, x, y, w]
const BOARD = [['.cl-card1', 200, 390, 440], ['.cl-card2', 60, 770, 460], ['.cl-group3', 200, 1390, 440], ['.cl-msg', 70, 2330, 560],
  ['.cl-clog1', 548, 976, 32], ['.cl-tap', 110, 210, 60], ['.cl-bath', 290, 2028, 360], ['.cl-hero', 230, 70, 410]];

(async () => {
  const t = await session('coram-c4-test', 9354);
  try {
    const state = () => t.ev(`(() => {
      const q = s => document.querySelector(s), cs = s => getComputedStyle(q(s));
      const vis = s => { const e = q(s); return getComputedStyle(e).display !== 'none' && getComputedStyle(e).visibility !== 'hidden' && e.getBoundingClientRect().height > 0; };
      const mobile = innerWidth <= 600;
      const colour = n => mobile ? cs('.cl-sec' + n).borderLeftColor : (() => { const e = q('.cl-lc' + n); const c = getComputedStyle(e); return c.backgroundColor !== 'rgba(0, 0, 0, 0)' ? c.backgroundColor : c.borderTopColor || c.borderLeftColor; })();
      const m = cs('.cl-handle').transform, ang = m === 'none' ? 0 : Math.round(Math.atan2(+m.split(',')[1], +m.split('(')[1].split(',')[0]) * 180 / Math.PI);
      return { steps: [1, 2, 3, 4].filter(n => q('.cl-s' + n).checked), blue: [0, 1, 2, 3].filter(n => colour(n) === '${BLUE}'),
        clogs: [1, 2, 3].filter(n => vis('.cl-clog' + n)), fix: [1, 2, 3].filter(n => vis('.cl-fix' + n)), tapBtn: vis('.cl-tap-btn'),
        gaps: mobile ? [] : [1, 2, 3].filter(n => vis('.cl-gap' + n)), stream: vis('.cl-stream'), open: vis('.cl-open'), handle: ang,
        endKicker: cs('.cl-mk-end').visibility === 'visible' };
    })()`);
    for (const [width, mobile] of [[760, false], [390, true], [360, true]]) {
      t.log(`== ${width}px ${mobile ? '(mobile)' : '(desktop)'}`);
      await t.open(MAIL, width, mobile, 1600);
      await t.noOverflow(width);
      await t.layer('cl');
      let s = await state();
      t.check('start: tap closed, pipe grey, three clogs, no fix buttons, no stream', s.steps.length === 0 && s.blue.length === 0 && s.clogs.length === 3 && s.fix.length === 0 && s.tapBtn && !s.stream && !s.open && s.handle === 0,
        `blue ${s.blue}, clogs ${s.clogs}`);
      if (!mobile) {
        const pos = await t.ev(`(() => { const sc = document.querySelector('.cl-scene').getBoundingClientRect(), k = sc.width / 700;
          return ${JSON.stringify(BOARD)}.map(([sel, x, y, w]) => { const r = document.querySelector(sel).getBoundingClientRect(); return [sel, Math.round((r.left - sc.left) / k * 10) / 10, Math.round((r.top - sc.top) * 10) / 10, Math.round(r.width / k * 10) / 10, x, y, w]; }); })()`);
        const off = pos.filter(([, x, y, w, bx, by, bw]) => Math.abs(x - bx) > 0.5 || Math.abs(y - by) > 0.5 || Math.abs(w - bw) > 0.5);
        t.check('desktop: cards, tap, clog, bath, message and hero at the board\'s positions', off.length === 0, off.map(o => `${o[0]} ${o.slice(1, 4)} vs ${o.slice(4)}`).join('; ') || 'all match');
      } else {
        const line = await t.ev(`(() => { const r = s => document.querySelector(s).getBoundingClientRect(), c = b => b.left + b.width / 2;
          const sec = r('.cl-sec0'), pipe = sec.left + 4;
          return { pipe: Math.round(pipe), spout: Math.round(c(r('.cl-spout'))), clog: Math.round(c(r('.cl-clog1'))), sec3end: Math.round(r('.cl-sec3').right), btap: Math.round(r('.cl-btap').left),
            inside: [...document.querySelectorAll('.cl-card, .cl-msg, .cl-bath')].every(e => { const b = e.getBoundingClientRect(); return b.left >= 0 && b.right <= innerWidth; }) }; })()`);
        t.check('mobile: the tap\'s spout and the clogs sit on the pipe, the last bend ends in the bath tap', Math.abs(line.spout - line.pipe) <= 1 && Math.abs(line.clog - line.pipe) <= 1 && line.sec3end - line.btap >= 0 && line.sec3end - line.btap <= 8 && line.inside,
          `pipe ${line.pipe}, spout ${line.spout}, clog ${line.clog}, bend end ${line.sec3end} / bath tap ${line.btap}`);
      }
      await t.shot('.cl-scene', `cl_${width}_1_start.png`);
      t.check('a fix button before its turn can\'t be clicked', !(await t.click('.cl-fix2', 300)) && (await state()).steps.length === 0);
      await t.click('.cl-tap-btn', 900); s = await state();
      t.check('tap open: handle 70 degrees, first stretch blue, open text, first fix button', s.steps.join() === '1' && s.handle === 70 && s.blue.join() === '0' && s.open && !s.tapBtn && s.fix.join() === '1',
        `handle ${s.handle}, blue ${s.blue}, fix ${s.fix}`);
      await t.click('.cl-fix1'); s = await state();
      t.check('clog 1 gone: second stretch blue, the gap filled, next button', s.steps.join() === '1,2' && s.blue.join() === '0,1' && s.clogs.join() === '2,3' && s.fix.join() === '2' && (mobile || s.gaps.join() === '1'),
        `blue ${s.blue}, gaps ${s.gaps}, fix ${s.fix}`);
      await t.shot('.cl-scene', `cl_${width}_2_clog1.png`);
      await t.click('.cl-fix2'); await t.click('.cl-fix3'); s = await state();
      t.check('all clogs gone: the whole pipe blue, the stream in the bath, the end kicker', s.steps.join() === '1,2,3,4' && s.blue.join() === '0,1,2,3' && s.clogs.length === 0 && s.fix.length === 0 && s.stream && s.endKicker && (mobile || s.gaps.join() === '1,2,3'),
        `blue ${s.blue}, stream ${s.stream}`);
      await t.shot('.cl-scene', `cl_${width}_3_bath.png`);
      await t.fallback('cl', width);
      if (!mobile) await t.shot('body', `cl_${width}_mail_fallback.png`);
    }
  } catch (e) { console.error(e); t.kill(); process.exit(1); }
  t.finish();
})();
