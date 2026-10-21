// "De lift" generator: a one-on-one email translation of the artifact board "Main.dc.html" (700 x 4600) with the
// cabin from "Scrollmomenten.dc.html" / "Lagen.dc.html".
// Interactive (WebKit + :checked): a scroll window (700 x 900, proportional) over the building (700 x 4200, in % so the
// landings stay exact at every width); the cabin is a fixed layer above the window (stage y 520). The lobby entrance
// is a front layer, so at the end of the scroll it slides over the cabin with its doors open.
// Fallback: the same cross-section built in tables, with the lift in the lobby.
//   node gen_lift.js      (writes the block with the default tokens; then run assemble.ps1 in HTML/)
const fs = require('fs'), path = require('path');
const NAME = 'para_1_col_row_1_title_txt_row_2_subtitle_title_txt_x4_img_x2_btn_row_3_title_txt_btn_x2';
// build/ -> concept_1_de_lift -> westcord -> interactive_artifact -> HTML
const OUT = path.resolve(__dirname, '../../../../blocks/para', `${NAME}.html`);

// default tokens (README token table, default scope)
const DEFAULT = {
  font: 'Roboto,Arial,Helvetica,Verdana,sans-serif', fontH: 'Roboto Slab,Arial,Helvetica,Verdana,sans-serif',
  outerClass: 'pml16 pmr16', outerPad: '0 24px 32px 24px', width: 600,
  c: {
    sky: '#050033', star: '#ffffff', fw1: '#9980FF', fw2: '#e3fc5e', logo: '#ffffff', hero: '#ffffff', heroSub: '#e6e6e6', hint: '#9980FF',
    lights: '#e3fc5e', plant: '#4d4d4d', bench: '#9E9E9E', railing: '#9980FF', roofCap: '#e6e6e6', roofHouse: '#efefef', roofLabel: '#050033',
    door: '#444444', roofEdge: '#e6e6e6', facade: '#efefef', shaft: '#444444', shaftLine: '#4d4d4d', num: '#9980FF', numLit: '#e3fc5e', numGlow: 'rgba(227,252,94,0.7)', numCore: '#FFFFFF', numHalo: 'rgba(227,252,94,0.45)', numHalo0: 'rgba(227,252,94,0)', slab: '#e6e6e6',
    plate: '#ffffff', shadow: 'rgba(5,0,51,0.18)', badgeDark: '#050033', badgeDarkTxt: '#ffffff', badgeLight: '#efefef', badgeLightTxt: '#050033',
    accent: '#9980FF', txt: '#050033', soft: '#444444', winFrame: '#e6e6e6', winLit: '#e3fc5e', winDark: '#444444',
    lobby: '#e6e6e6', lobbyShaft: '#4d4d4d', lobbyCard: '#fefefe', lampCord: '#9980FF', lamp: '#9E9E9E', keyBoard: '#efefef', keyFrame: '#9E9E9E',
    key: '#9980FF', deskTop: '#9E9E9E', desk: '#050033', bottles: ['#4d4d4d', '#9980FF', '#9E9E9E', '#050033'], shelf: '#444444', stool: '#050033',
    liftBadge: '#9E9E9E', photoBg: '#efefef', sign: '#050033', signTxt: '#ffffff', frame: '#4d4d4d', inside: '#fefefe', insideLine: '#9E9E9E', doorPanel: '#efefef',
    pavement: '#9E9E9E', curb: '#4d4d4d', mat: '#050033', uspBg: '#efefef', uspTxt: '#444444', check: '#9980FF', ctaBg: '#ffffff',
    btn: '#e3fc5e', btnTxt: '#050033', btn2: '#050033', cabin: '#efefef', cabinLine: '#9E9E9E', cabinGlow: 'rgba(227,252,94,0.35)', seam: '#9E9E9E',
  },
};

// artifact canvas -> % : x of 700, y of the 4200 building, window y of 900
const px = v => +(v / 700 * 100).toFixed(4) + '%';
const py = v => +(v / 4200 * 100).toFixed(4) + '%';
const pw = v => +(v / 900 * 100).toFixed(4) + '%';
const box = (x, y, w, h) => `left:${px(x)};top:${py(y)};width:${px(w)};${h == null ? '' : `height:${py(h)};`}`;
const ind = (s, n) => s.split('\n').map(l => l ? ' '.repeat(n) + l : l).join('\n');

function build(T) {
const C = T.c, F = T.font, FH = T.fontH;
const A = (cls, x, y, w, h, extra = '', inner = '') => `<div class="plx-a${cls ? ' ' + cls : ''}" style="${box(x, y, w, h)}${extra}">${inner}</div>`;

// ---------------- CSS ----------------
const css = `<style type="text/css">
   /* De lift (artifact "Main" + "Lagen" + "Scrollmomenten"): the cabin stays still, the hotel scrolls past from the
      roof terrace to the lobby. Interactive only in WebKit clients with working :checked (pre-checked .plx-detect);
      everything else keeps the fallback (the same cross-section in tables, lift in the lobby).
      Window 700 x 900 and building 700 x 4200 in %, so the cabin lands exactly in the roof house (scroll 0) and in the
      entrance (scroll end) at every width. The entrance is a front layer (z-index 3) above the cabin (2). */
   @media screen and (-webkit-min-device-pixel-ratio: 0) {
      .plx-detect:checked ~ .plx-fallback {
         display: none !important;
         max-height: 0 !important;
         overflow: hidden !important;
      }

      .plx-detect:checked ~ .plx-interactive {
         display: block !important;
         max-height: none !important;
         overflow: visible !important;
      }
   }

   /* 128.5714% = 900 / 700: the window keeps the artifact's proportions */
   .plx-interactive .plx-window {
      position: relative;
      height: 0;
      padding-bottom: 128.5714%;
      background-color: ${C.facade};
   }

   .plx-interactive .plx-scroll {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      overflow-x: hidden;
      overflow-y: auto;
      scrollbar-width: none;
      /* named scroll timeline for the scroll-driven extras (doors, floor numbers); a name, because the building
         itself (overflow: hidden) would otherwise be the nearest scroll container */
      scroll-timeline: --plx-scroll block;
   }

   /* no scrollbar: it would make the building narrower than the window and shift it against the cabin
      (the scene has its own "scroll down" hint, as in the artifact) */
   .plx-interactive .plx-scroll::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
   }

   /* mobile only: extra pavement below the building (300 of 700 wide), see the max-width 600px rules */
   .plx-interactive .plx-ground-pad {
      display: none;
      height: 0;
      padding-bottom: ${+(300 / 700 * 100).toFixed(4)}%;
      background-color: ${C.pavement};
   }

   /* 600% = 4200 / 700 */
   .plx-interactive .plx-building {
      position: relative;
      height: 0;
      padding-bottom: 600%;
      overflow: hidden;
   }

   .plx-interactive .plx-a {
      position: absolute;
      display: block;
      box-sizing: border-box;
   }

   .plx-interactive .plx-front {
      z-index: 3;
   }

   /* the cabin: stage x 285, window y 520, 130 x 220; door seam at x 349 */
   .plx-interactive .plx-cabin {
      position: absolute;
      left: ${px(285)};
      top: ${pw(520)};
      width: ${px(130)};
      height: ${pw(220)};
      z-index: 2;
      background-color: ${C.cabin};
      box-shadow: inset 0 0 0 4px ${C.cabinLine}, 0 0 40px ${C.cabinGlow};
      pointer-events: none;
   }

   .plx-interactive .plx-seam {
      position: absolute;
      left: 49.2308%;
      top: 1.8182%;
      width: 2px;
      height: 98.1818%;
      background-color: ${C.seam};
   }

   .plx-interactive .plx-star {
      border-radius: 50%;
      background-color: ${C.star};
   }

   .plx-interactive .plx-logo {
      display: block;
      font-family: ${FH};
      font-size: 40px;
      line-height: 40px;
      color: ${C.logo};
   }

   .plx-interactive .plx-hotels {
      display: block;
      margin: 2px 0 0 0;
      padding-left: 0.5em;
      font-family: ${F};
      font-size: 11px;
      line-height: 16px;
      letter-spacing: 0.5em;
      text-transform: uppercase;
      color: ${C.logo};
   }

   .plx-interactive .plx-h1 {
      margin: 0 0 18px 0;
      font-family: ${FH};
      font-size: 60px;
      line-height: 63px;
      font-weight: 500;
      color: ${C.hero};
   }

   .plx-interactive .plx-sub {
      margin: 0;
      font-family: ${F};
      font-size: 20px;
      line-height: 29px;
      color: ${C.heroSub};
   }

   .plx-interactive .plx-hint {
      display: block;
      font-family: ${F};
      font-size: 13px;
      line-height: 18px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: ${C.hint};
   }

   .plx-interactive .plx-roof-label {
      font-family: ${F};
      font-size: 11px;
      line-height: 16px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      text-align: center;
      color: ${C.roofLabel};
   }

   .plx-interactive .plx-num {
      font-family: ${FH};
      font-size: 56px;
      line-height: 64px;
      text-align: center;
      color: ${C.num};
      /* the halo of a lit number: a radial gradient that grows from the centre (size 0 = off) */
      background-image: radial-gradient(ellipse closest-side, ${C.numHalo}, ${C.numHalo0});
      background-repeat: no-repeat;
      background-position: 50% 50%;
      background-size: 0% 0%;
   }

   .plx-interactive .plx-slab {
      background-color: ${C.slab};
   }

   .plx-interactive .plx-win {
      border: 6px solid ${C.winFrame};
   }

   .plx-interactive .plx-lit {
      background-color: ${C.winLit};
   }

   .plx-interactive .plx-dark {
      background-color: ${C.winDark};
   }

   /* info plates (the top layer) */
   .plx-interactive .plx-plate {
      padding: 24px;
      text-align: left;
      border-radius: 4px;
      background-color: ${C.plate};
      box-shadow: 0 8px 24px ${C.shadow};
      font-family: ${F};
      color: ${C.txt};
   }

   .plx-interactive .plx-badge {
      display: inline-block;
      margin: 0 0 12px 0;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 11px;
      line-height: 14px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
   }

   .plx-interactive .plx-badge-dark {
      background-color: ${C.badgeDark};
      color: ${C.badgeDarkTxt};
   }

   .plx-interactive .plx-badge-light {
      background-color: ${C.badgeLight};
      color: ${C.badgeLightTxt};
   }

   .plx-interactive .plx-label {
      display: block;
      margin: 0 0 12px 0;
      font-size: 12px;
      line-height: 16px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: ${C.accent};
   }

   .plx-interactive .plx-h2 {
      margin: 0 0 12px 0;
      font-family: ${FH};
      font-size: 26px;
      line-height: 30px;
      font-weight: 500;
      color: ${C.txt};
   }

   .plx-interactive .plx-big {
      display: block;
      margin: 0 0 12px 0;
      font-family: ${FH};
      font-size: 64px;
      line-height: 64px;
      color: ${C.txt};
   }

   .plx-interactive .plx-p {
      margin: 0;
      font-size: 15px;
      line-height: 22px;
      color: ${C.soft};
   }

   /* photo placeholder exactly as in the artifact (a box with a label); replace by an image tag when the photo arrives */
   .plx-interactive .plx-photo {
      display: -webkit-flex;
      display: flex;
      -webkit-align-items: center;
      align-items: center;
      -webkit-justify-content: center;
      justify-content: center;
      width: 100%;
      height: 120px;
      margin: 0 0 12px 0;
      border-radius: 3px;
      background-color: ${C.photoBg};
      font-size: 13px;
      line-height: 18px;
      color: ${C.soft};
   }

   .plx-interactive .plx-photo-2 {
      height: 110px;
   }

   .plx-interactive .plx-strong {
      display: block;
      font-size: 16px;
      line-height: 22px;
      font-weight: 600;
      color: ${C.txt};
   }

   .plx-interactive .plx-stat {
      display: block;
      font-family: ${FH};
      font-size: 32px;
      line-height: 38px;
      color: ${C.txt};
   }

   .plx-interactive .plx-stat-sm {
      font-size: 20px;
      line-height: 26px;
   }

   .plx-interactive .plx-stat-label {
      display: block;
      margin: 0 0 10px 0;
      font-size: 14px;
      line-height: 20px;
      color: ${C.soft};
   }

   .plx-interactive .plx-more {
      display: inline-block;
      margin: 12px 0 0 0;
      font-size: 15px;
      line-height: 22px;
      font-weight: 600;
      text-decoration: underline;
      color: ${C.txt};
   }

   /* lobby */
   .plx-interactive .plx-lobby-card {
      padding: 24px;
      border-radius: 4px;
      background-color: ${C.lobbyCard};
      text-align: center;
      font-family: ${F};
   }

   .plx-interactive .plx-lobby-h2 {
      margin: 0 0 8px 0;
      font-family: ${FH};
      font-size: 44px;
      line-height: 48px;
      font-weight: 500;
      color: ${C.txt};
   }

   .plx-interactive .plx-lobby-p {
      margin: 0;
      font-size: 18px;
      line-height: 26px;
      color: ${C.soft};
   }

   .plx-interactive .plx-room {
      font-family: ${FH};
      font-size: 26px;
      line-height: 32px;
      text-align: center;
      color: ${C.txt};
   }

   /* key board: 2 rows of 4 keys, as the artifact's grid (4 columns, gap 14px) */
   .plx-interactive .plx-keys {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 14px;
      justify-items: center;
      padding: 16px;
      border: 4px solid ${C.keyFrame};
      background-color: ${C.keyBoard};
   }

   .plx-interactive .plx-key {
      display: block;
      width: 8px;
      height: 16px;
      border-radius: 2px;
      background-color: ${C.key};
   }

   .plx-interactive .plx-shelf {
      display: -webkit-flex;
      display: flex;
      -webkit-align-items: flex-end;
      align-items: flex-end;
   }

   .plx-interactive .plx-bottle {
      display: block;
      width: 12px;
      margin: 0 12px 0 0;
      border-radius: 3px 3px 0 0;
   }

   .plx-interactive .plx-lift-badge {
      display: -webkit-flex;
      display: flex;
      -webkit-align-items: center;
      align-items: center;
      -webkit-justify-content: center;
      justify-content: center;
      border-radius: 50%;
      background-color: ${C.liftBadge};
      font-family: ${F};
      font-size: 13px;
      font-weight: 600;
      color: ${C.txt};
   }

   .plx-interactive .plx-sign {
      display: -webkit-flex;
      display: flex;
      -webkit-align-items: center;
      align-items: center;
      -webkit-justify-content: center;
      justify-content: center;
      background-color: ${C.sign};
      font-family: ${F};
      font-size: 11px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: ${C.signTxt};
   }

   /* Scroll-driven extras (not in the artifact's static boards; requested on top of it). Only in clients that support
      scroll-driven animations (WebKit / Safari 26+, Chrome 115+); others keep the doors open in the lobby and the
      floor numbers unlit, as in the artifact.
      - The lobby doors stay closed (the cabin's look) and open over the last 3% of the scroll, as the lift lands.
      - A floor number lights up while the cabin passes that floor: cabin centre (window y 630) within the floor's
        band in the building; progress = scrollTop / 3300.
      - The "L" above the entrance lights up like the numbers as the lift lands (with the doors). */
   @supports (animation-timeline: scroll()) {
      .plx-interactive .plx-door-l,
      .plx-interactive .plx-door-r,
      .plx-interactive .plx-lift-badge,
${[4, 3, 2, 1].map(n => `      .plx-interactive .plx-num-${n}`).join(',\n')} {
         animation-duration: auto;
         animation-timing-function: linear;
         animation-fill-mode: both;
         animation-timeline: --plx-scroll;
      }

      .plx-interactive .plx-door-l {
         animation-name: plx-door-l;
      }

      .plx-interactive .plx-lift-badge {
         animation-name: plx-lobby;
      }

      .plx-interactive .plx-door-r {
         animation-name: plx-door-r;
      }

${[4, 3, 2, 1].map(n => `      .plx-interactive .plx-num-${n} {
         animation-name: plx-floor-${n};
      }`).join('\n\n')}
   }

   /* closed: the two panels meet in the middle (289-350 and 350-411); open: the artifact's 40px panels */
   @keyframes plx-door-l {
      0%, 97% {
         width: ${px(61)};
      }

      100% {
         width: ${px(40)};
      }
   }

   /* the "L" lights up with the landing, in the lit floor numbers' colours */
   @keyframes plx-lobby {
      0%, 97% {
         background-color: ${C.liftBadge};
         box-shadow: none;
      }

      100% {
         background-color: ${C.numLit};
         box-shadow: 0 0 4px ${C.numCore}, 0 0 18px ${C.numGlow}, 0 0 42px ${C.numGlow};
      }
   }

   @keyframes plx-door-r {
      0%, 97% {
         left: ${px(350)};
         width: ${px(61)};
      }

      100% {
         left: ${px(369)};
         width: ${px(40)};
      }
   }

${[[4, 770, 1390], [3, 1410, 2030], [2, 2050, 2670], [1, 2690, 3310]].map(([n, top, bottom]) => {
  // the cabin centre (window y 630) is inside this floor's band while scrollTop runs from top-630 to bottom-630
  const a = +((top - 630) / 3300 * 100).toFixed(2), b = +((bottom - 630) / 3300 * 100).toFixed(2);
  return `   /* floor ${n}: building y ${top}-${bottom} -> scroll ${a}%-${b}% */
   @keyframes plx-floor-${n} {
      0%, ${a}%, ${b}%, 100% {
         color: ${C.num};
         text-shadow: none;
         background-size: 0% 0%;
      }

      ${+(a + 1).toFixed(2)}%, ${+(b - 1).toFixed(2)}% {
         color: ${C.numLit};
         text-shadow: 0 0 4px ${C.numCore}, 0 0 18px ${C.numGlow}, 0 0 42px ${C.numGlow};
         background-size: 100% 100%;
      }
   }`;
}).join('\n\n')}

   /* dark mode: the head turns every link white; navy links on light backgrounds keep their colour */
   @media (prefers-color-scheme: dark) {
      .plx-dl {
         color: ${C.txt} !important;
      }
   }

   [data-ogsc] .plx-dl {
      color: ${C.txt} !important;
   }

   @media only screen and (max-width: 600px) {
      /* mobile: a taller window, 1200 of 700 (just under 2 floors of 640) instead of 900.
         The cabin stays at the artifact's window y 520, so the start is exact (roof door at 520) and you see more
         floors below it. Landing stays exact: 300 extra pavement below the building makes the content 4500, the
         end scroll 4500 - 1200 = 3300, and the entrance (3820) lands at window y 520.
         The scroll distance stays 3300, so the scroll-driven ranges are unchanged. */
      .plx-interactive .plx-window {
         padding-bottom: ${+(1200 / 700 * 100).toFixed(4)}% !important;
      }

      .plx-interactive .plx-ground-pad {
         display: block !important;
      }

      .plx-interactive .plx-cabin {
         top: ${+(520 / 1200 * 100).toFixed(4)}% !important;
         height: ${+(220 / 1200 * 100).toFixed(4)}% !important;
      }

      .plx-interactive .plx-logo {
         font-size: 28px !important;
         line-height: 28px !important;
      }

      .plx-interactive .plx-hotels {
         font-size: 9px !important;
      }

      .plx-interactive .plx-h1 {
         margin: 0 0 10px 0 !important;
         font-size: 30px !important;
         line-height: 34px !important;
      }

      .plx-interactive .plx-sub {
         font-size: 15px !important;
         line-height: 21px !important;
      }

      .plx-interactive .plx-hint {
         font-size: 10px !important;
      }

      /* the scene shrinks but an svg keeps its size: a smaller arrow so it stays clear of the lift house */
      .plx-interactive .plx-chev {
         width: 14px !important;
         height: 14px !important;
         margin-top: 2px !important;
      }

      .plx-interactive .plx-roof-label {
         font-size: 8px !important;
         letter-spacing: 0.1em !important;
      }

      .plx-interactive .plx-num {
         font-size: 30px !important;
         line-height: 36px !important;
      }

      /* mobile: the plates become wide cards in front of the cabin, with readable type; they start 30 higher
         (just under the floor number) so they fit within their floor */
      .plx-interactive .plx-plate {
         left: 6% !important;
         width: 88% !important;
         z-index: 3;
         padding: 16px !important;
      }

      .plx-interactive .plx-plate-1 {
         top: ${py(870)} !important;
      }

      .plx-interactive .plx-plate-2 {
         top: ${py(1510)} !important;
      }

      .plx-interactive .plx-plate-3 {
         top: ${py(2150)} !important;
      }

      .plx-interactive .plx-plate-4 {
         top: ${py(2790)} !important;
      }

      .plx-interactive .plx-badge,
      .plx-interactive .plx-label,
      .plx-interactive .plx-h2,
      .plx-interactive .plx-big,
      .plx-interactive .plx-photo {
         margin-bottom: 8px !important;
      }

      .plx-interactive .plx-h2 {
         font-size: 22px !important;
         line-height: 26px !important;
      }

      .plx-interactive .plx-big {
         font-size: 44px !important;
         line-height: 44px !important;
      }

      .plx-interactive .plx-p {
         font-size: 14px !important;
         line-height: 20px !important;
      }

      .plx-interactive .plx-photo {
         height: 80px !important;
      }

      .plx-interactive .plx-stat {
         font-size: 26px !important;
         line-height: 30px !important;
      }

      .plx-interactive .plx-stat-sm {
         font-size: 18px !important;
         line-height: 22px !important;
      }

      .plx-interactive .plx-stat-label {
         margin-bottom: 6px !important;
      }

      .plx-interactive .plx-lobby-card {
         padding: 12px !important;
      }

      .plx-interactive .plx-lobby-h2 {
         font-size: 26px !important;
         line-height: 30px !important;
      }

      .plx-interactive .plx-lobby-p {
         font-size: 14px !important;
         line-height: 19px !important;
      }

      .plx-interactive .plx-room {
         font-size: 16px !important;
         line-height: 20px !important;
      }

      .plx-interactive .plx-keys {
         padding: 6px 2px !important;
         border-width: 2px !important;
      }

      .plx-interactive .plx-key {
         width: 4px !important;
         height: 9px !important;
         margin-bottom: 6px !important;
      }

      .plx-interactive .plx-bottle {
         width: 7px !important;
         margin-right: 6px !important;
      }

      .plx-interactive .plx-lift-badge {
         font-size: 8px !important;
      }

      .plx-interactive .plx-sign {
         font-size: 7px !important;
         letter-spacing: 0.08em !important;
      }

      .plx-cta-title,
      .plx-fb-lobby {
         font-size: 30px !important;
         line-height: 34px !important;
      }

      .plx-fb-h1 {
         margin-top: 40px !important;
         font-size: 36px !important;
         line-height: 40px !important;
      }

      /* mobile: the buttons stacked, full width */
      .plx-btn {
         display: block !important;
         width: 100% !important;
         margin: 0 0 12px 0 !important;
         padding: 0 8px !important;
         box-sizing: border-box !important;
         text-align: center !important;
      }

      .plx-usp {
         display: block !important;
         padding: 4px 0 !important;
      }
   }

   @media only screen and (max-width: 400px) {
      .plx-interactive .plx-h1 {
         font-size: 26px !important;
         line-height: 30px !important;
      }

      .plx-interactive .plx-h2 {
         font-size: 20px !important;
         line-height: 24px !important;
      }

      /* small phones: a more compact plate so it still fits within its floor */
      .plx-interactive .plx-plate {
         padding: 14px !important;
      }

      .plx-interactive .plx-badge,
      .plx-interactive .plx-label,
      .plx-interactive .plx-h2,
      .plx-interactive .plx-big,
      .plx-interactive .plx-photo {
         margin-bottom: 6px !important;
      }

      .plx-interactive .plx-big {
         font-size: 38px !important;
         line-height: 38px !important;
      }

      .plx-interactive .plx-stat {
         font-size: 22px !important;
         line-height: 26px !important;
      }

      .plx-interactive .plx-stat-sm {
         font-size: 17px !important;
         line-height: 21px !important;
      }

      .plx-interactive .plx-stat-label {
         margin-bottom: 4px !important;
         font-size: 13px !important;
         line-height: 18px !important;
      }

      .plx-interactive .plx-photo {
         height: 70px !important;
      }
   }
</style>
<style type="text/css">
   /* Back to the fallback. Every override also exists as a variant at least as specific as the activation selector
      (.plx-detect:checked ~ ...), because !important rules are decided by specificity before source order. */
   /* Outlook.com / new Outlook: class names get an x_ prefix */
   [class~="x_plx-interactive"],
   [class~="x_plx-detect"]:checked ~ [class~="x_plx-interactive"] {
      display: none !important;
      max-height: 0 !important;
      overflow: hidden !important;
   }

   [class~="x_plx-fallback"],
   [class~="x_plx-detect"]:checked ~ [class~="x_plx-fallback"] {
      display: block !important;
      max-height: none !important;
      overflow: visible !important;
   }

   /* Samsung Mail: the message is wrapped in #MessageViewBody (the id outranks the activation selector) */
   #MessageViewBody .plx-interactive {
      display: none !important;
      max-height: 0 !important;
      overflow: hidden !important;
   }

   #MessageViewBody .plx-fallback {
      display: block !important;
      max-height: none !important;
      overflow: visible !important;
   }
</style>
<style type="text/css">
   /* Outlook apps: \\0 hack in its own style tag (it breaks the rest of a style tag in other clients) */
   .plx-interactive\\0 {
      display: none !important;
      max-height: 0 !important;
      overflow: hidden !important;
   }

   .plx-detect:checked ~ .plx-interactive\\0 {
      display: none !important;
      max-height: 0 !important;
      overflow: hidden !important;
   }

   .plx-fallback\\0 {
      display: block !important;
      max-height: none !important;
      overflow: visible !important;
   }

   .plx-detect:checked ~ .plx-fallback\\0 {
      display: block !important;
      max-height: none !important;
      overflow: visible !important;
   }
</style>`;

// ---------------- interactive: the building (all coordinates from Main.dc.html) ----------------
const stars = [[60, 70, 3], [150, 250, 2], [230, 110, 3], [470, 60, 2], [610, 230, 3], [660, 380, 2], [40, 420, 2], [520, 440, 3], [330, 460, 2]]
  .map(([x, y, s]) => `<div class="plx-a plx-star" style="left:${px(x)};top:${py(y)};width:${s}px;height:${s}px;"></div>`);
const burst = (x, y, size, color, r1, r2, d1, d2) => `<svg class="plx-a" style="left:${px(x)};top:${py(y)};width:${px(size)};" viewBox="0 0 100 100" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round"><line x1="50" y1="${r1}" x2="50" y2="${r2}"/><line x1="50" y1="${100 - r1}" x2="50" y2="${100 - r2}"/><line x1="${r1}" y1="50" x2="${r2}" y2="50"/><line x1="${100 - r1}" y1="50" x2="${100 - r2}" y2="50"/><line x1="${d1}" y1="${d1}" x2="${d2}" y2="${d2}"/><line x1="${100 - d1}" y1="${100 - d1}" x2="${100 - d2}" y2="${100 - d2}"/><line x1="${100 - d1}" y1="${d1}" x2="${100 - d2}" y2="${d2}"/><line x1="${d1}" y1="${100 - d1}" x2="${d2}" y2="${100 - d2}"/></svg>`;
const win4 = (x, y, fills) => fills.map((f, i) => A(`plx-win ${f ? 'plx-lit' : 'plx-dark'}`, x + (i % 2) * 114, y + Math.floor(i / 2) * 164, 90, 140)).join('\n');

const plateHead = (n, badgeCls) => `<span class="plx-badge ${badgeCls}">badge_${n}</span>
<span class="plx-label">subtitle_${n}</span>`;
const plates = [
  // floor 4: personal, nights
  A('plx-plate plx-plate-1', 30, 900, 230, null, '', `
${plateHead(1, 'plx-badge-dark')}
<h2 class="plx-h2">title_2</h2>
<span class="plx-big">title_3</span>
<p class="plx-p">txt_2</p>
`),
  // floor 3: personal, last stay
  A('plx-plate plx-plate-2', 440, 1540, 230, null, '', `
${plateHead(2, 'plx-badge-dark')}
<h2 class="plx-h2">title_4</h2>
<span class="plx-photo">img_alt_1</span>
<span class="plx-strong">txt_3</span>
<span class="plx-stat-label" style="margin:0;font-size:15px;">txt_4</span>
`),
  // floor 2: general, figures
  A('plx-plate plx-plate-3', 30, 2180, 230, null, '', `
${plateHead(3, 'plx-badge-light')}
<h2 class="plx-h2">title_5</h2>
<span class="plx-stat">title_6</span><span class="plx-stat-label">txt_5</span>
<span class="plx-stat">title_7</span><span class="plx-stat-label">txt_6</span>
<span class="plx-stat plx-stat-sm">title_8</span><span class="plx-stat-label" style="margin:0;">txt_7</span>
`),
  // floor 1: outlook 2027
  A('plx-plate plx-plate-4', 440, 2820, 230, null, '', `
${plateHead(4, 'plx-badge-light')}
<h2 class="plx-h2">title_9</h2>
<span class="plx-photo plx-photo-2">img_alt_2</span>
<p class="plx-p">txt_8</p>
<a class="plx-more plx-dl" href="https://100procent.nl/" target="_blank">link_txt_1</a>
`),
].map(s => s.replace(/>\n/, '>\n').replace(/\n<\/div>$/, '\n</div>'));

const bottles = (heights, colorIdx) => heights.map((h, i) => `<span class="plx-bottle" style="height:${h}px;background-color:${C.bottles[colorIdx[i]]};"></span>`).join('');
const building = [
  '<!-- sky -->',
  A('', 0, 0, 700, 770, `background-color:${C.sky};`),
  ...stars,
  burst(50, 120, 100, C.fw1, 30, 8, 36, 20),
  burst(540, 80, 120, C.fw2, 32, 6, 37, 18),
  A('', 0, 36, 700, null, 'text-align:center;', `<span class="plx-logo">label_7</span><span class="plx-hotels">label_8</span>`),
  A('', 100, 170, 500, null, 'text-align:center;', `<h1 class="plx-h1">title_1</h1><p class="plx-sub">txt_1</p>`),
  A('', 0, 400, 700, null, 'text-align:center;', `<span class="plx-hint">label_1</span><svg class="plx-chev" style="display:block;margin:6px auto 0 auto;" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${C.hint}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`),
  '<!-- roof terrace -->',
  A('', 20, 580, 240, 10, `background:radial-gradient(circle, ${C.lights} 3px, transparent 4px) 0 0 / 30px 10px repeat-x;`),
  A('', 440, 580, 240, 10, `background:radial-gradient(circle, ${C.lights} 3px, transparent 4px) 0 0 / 30px 10px repeat-x;`),
  A('', 30, 624, 64, 64, `border-radius:50%;background-color:${C.plant};`),
  A('', 606, 624, 64, 64, `border-radius:50%;background-color:${C.plant};`),
  A('', 130, 668, 80, 8, `border-radius:4px;background-color:${C.bench};`),
  A('', 490, 668, 80, 8, `border-radius:4px;background-color:${C.bench};`),
  A('', 20, 690, 250, 50, `border-top:3px solid ${C.railing};background:repeating-linear-gradient(90deg, ${C.railing} 0 2px, transparent 2px 36px);`),
  A('', 430, 690, 250, 50, `border-top:3px solid ${C.railing};background:repeating-linear-gradient(90deg, ${C.railing} 0 2px, transparent 2px 36px);`),
  A('', 255, 468, 190, 14, `background-color:${C.roofCap};`),
  A('', 265, 482, 170, 258, `background-color:${C.roofHouse};`),
  A('plx-roof-label', 265, 494, 170, null, '', 'label_2'),
  A('', 285, 520, 130, 220, `background-color:${C.door};`),
  A('', 0, 740, 700, 30, `background-color:${C.roofEdge};`),
  '<!-- facade and shaft -->',
  A('', 0, 770, 700, 2560, `background-color:${C.facade};`),
  A('', 285, 770, 130, 3010, `background-color:${C.shaft};`),
  A('', 300, 770, 2, 3010, `background-color:${C.shaftLine};`),
  A('', 398, 770, 2, 3010, `background-color:${C.shaftLine};`),
  '<!-- floor 4 -->',
  A('plx-num plx-num-4', 285, 800, 130, null, '', '4'),
  win4(460, 930, [1, 0, 0, 1]),
  A('plx-slab', 0, 1390, 700, 20),
  '<!-- floor 3 -->',
  A('plx-num plx-num-3', 285, 1440, 130, null, '', '3'),
  win4(36, 1570, [0, 1, 1, 1]),
  A('plx-slab', 0, 2030, 700, 20),
  '<!-- floor 2 -->',
  A('plx-num plx-num-2', 285, 2080, 130, null, '', '2'),
  win4(460, 2210, [1, 1, 0, 1]),
  A('plx-slab', 0, 2670, 700, 20),
  '<!-- floor 1 -->',
  A('plx-num plx-num-1', 285, 2720, 130, null, '', '1'),
  win4(36, 2850, [1, 0, 1, 0]),
  A('plx-slab', 0, 3310, 700, 20),
  '<!-- info plates (top layer) -->',
  ...plates,
  '<!-- lobby -->',
  A('', 0, 3330, 700, 710, `background-color:${C.lobby};`),
  A('', 285, 3330, 130, 460, `background-color:${C.lobbyShaft};`),
  A('plx-front plx-lobby-card', 40, 3362, 620, null, '', `<h2 class="plx-lobby-h2">title_10</h2><p class="plx-lobby-p">txt_9</p>`),
  A('', 134, 3500, 2, 40, `background-color:${C.lampCord};`),
  A('', 110, 3540, 50, 26, `border-radius:26px 26px 0 0;background-color:${C.lamp};`),
  A('', 584, 3500, 2, 40, `background-color:${C.lampCord};`),
  A('', 560, 3540, 50, 26, `border-radius:26px 26px 0 0;background-color:${C.lamp};`),
  A('plx-room', 40, 3630, 200, null, '', 'label_3'),
  A('plx-keys', 70, 3690, 140, null, '', Array(8).fill('<span class="plx-key"></span>').join('')),
  A('', 190, 3876, 22, 14, `border-radius:11px 11px 0 0;background-color:${C.deskTop};`),
  A('', 30, 3890, 220, 12, `background-color:${C.deskTop};`),
  A('', 40, 3902, 200, 138, `background-color:${C.desk};`),
  A('plx-room', 460, 3630, 200, null, '', 'label_4'),
  A('plx-shelf', 480, 3700, 170, 50, '', bottles([42, 34, 48, 38, 44, 30, 46], [0, 1, 2, 3, 0, 1, 2])),
  A('', 470, 3750, 180, 6, `background-color:${C.shelf};`),
  A('plx-shelf', 480, 3770, 170, 50, '', bottles([36, 46, 32, 44, 40, 48, 34], [2, 3, 0, 1, 2, 3, 0])),
  A('', 470, 3820, 180, 6, `background-color:${C.shelf};`),
  A('', 450, 3890, 220, 12, `background-color:${C.deskTop};`),
  A('', 460, 3902, 200, 138, `background-color:${C.shelf};`),
  A('', 488, 3944, 40, 10, `border-radius:5px;background-color:${C.stool};`),
  A('', 506, 3954, 4, 86, `background-color:${C.stool};`),
  A('', 588, 3944, 40, 10, `border-radius:5px;background-color:${C.stool};`),
  A('', 606, 3954, 4, 86, `background-color:${C.stool};`),
  '<!-- entrance with the lift: front layer, slides over the cabin and lands on it with the doors open -->',
  A('plx-front plx-lift-badge', 336, 3748, 28, 28, '', 'label_5'),
  A('plx-front plx-sign', 255, 3785, 190, 28, '', 'label_6'),
  A('plx-front', 278, 3813, 144, 227, `border:7px solid ${C.frame};border-bottom:0;`),
  A('plx-front', 285, 3820, 130, 220, `background-color:${C.inside};box-shadow:inset 0 0 0 4px ${C.insideLine};`),
  A('plx-front plx-door-l', 289, 3824, 40, 216, `background-color:${C.doorPanel};border-right:2px solid ${C.insideLine};`),
  A('plx-front plx-door-r', 369, 3824, 40, 216, `background-color:${C.doorPanel};border-left:2px solid ${C.insideLine};`),
  '<!-- pavement -->',
  A('', 0, 4040, 700, 160, `background-color:${C.pavement};`),
  A('', 0, 4040, 700, 10, `background-color:${C.curb};`),
  A('', 290, 4040, 120, 10, `background-color:${C.mat};`),
].join('\n');

const interactive = `<!--[if !mso]><!-->
<div class="plx-interactive" style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">
   <div class="plx-window">
      <div class="plx-scroll">
         <div class="plx-building">
${ind(building, 12)}
         </div>
         <div class="plx-ground-pad"></div>
      </div>
      <!-- the cabin: stays still above the scrolling building -->
      <div class="plx-cabin"><div class="plx-seam"></div></div>
   </div>
</div>
<!--<![endif]-->`;

// ---------------- fallback: the same cross-section in tables, lift in the lobby ----------------
const tbl = (inner, attrs = '') => `<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0"${attrs}>
${inner}
</table>`;
const row = (h, color) => `<tr>
   <td height="${h}" bgcolor="${color}" style="height: ${h}px; font-size: 0; line-height: 0;">&nbsp;</td>
</tr>`;
const fbWin = fills => `<table role="presentation" width="204" align="center" border="0" cellspacing="0" cellpadding="0" style="width: 204px;">
   <tr>
      <td width="90" height="140" bgcolor="${fills[0] ? C.winLit : C.winDark}" style="width: 90px; height: 140px; border: 6px solid ${C.winFrame};">&nbsp;</td>
      <td width="24" style="width: 24px; font-size: 0;">&nbsp;</td>
      <td width="90" height="140" bgcolor="${fills[1] ? C.winLit : C.winDark}" style="width: 90px; height: 140px; border: 6px solid ${C.winFrame};">&nbsp;</td>
   </tr>
   <tr>
      <td colspan="3" height="24" style="height: 24px; font-size: 0; line-height: 0;">&nbsp;</td>
   </tr>
   <tr>
      <td width="90" height="140" bgcolor="${fills[2] ? C.winLit : C.winDark}" style="width: 90px; height: 140px; border: 6px solid ${C.winFrame};">&nbsp;</td>
      <td width="24" style="width: 24px; font-size: 0;">&nbsp;</td>
      <td width="90" height="140" bgcolor="${fills[3] ? C.winLit : C.winDark}" style="width: 90px; height: 140px; border: 6px solid ${C.winFrame};">&nbsp;</td>
   </tr>
</table>`;
const fbBadge = (n, dark) => `<span style="display: inline-block; padding: 4px 10px; border-radius: 999px; background-color: ${dark ? C.badgeDark : C.badgeLight}; color: ${dark ? C.badgeDarkTxt : C.badgeLightTxt}; font-family: ${F}; font-size: 11px; line-height: 14px; letter-spacing: 0.08em; text-transform: uppercase;">badge_${n}</span>`;
const fbP = (txt, size, lh, color, extra = '') => `<p style="margin: 0; font-family: ${F}; font-size: ${size}; line-height: ${lh}; color: ${color};${extra}">${txt}</p>`;
const fbH = (txt, size, lh, extra = '') => `<p style="margin: 0; font-family: ${FH}; font-size: ${size}; line-height: ${lh}; font-weight: 500; color: ${C.txt};${extra}">${txt}</p>`;
const fbPlate = (inner) => `<table role="presentation" width="230" align="center" border="0" cellspacing="0" cellpadding="0" bgcolor="${C.plate}" class="col-sm-12" style="width: 230px; border-radius: 4px; border-collapse: separate;">
   <tr>
      <td align="left" style="padding: 24px; font-family: ${F}; color: ${C.txt};">
${ind(inner, 9)}
      </td>
   </tr>
</table>`;
const sp = h => `<div style="height: ${h}px; line-height: ${h}px; font-size: 0;">&nbsp;</div>`;
// photo placeholder as in the artifact (a box with a label); replace by an image tag when the photo arrives
const fbPhoto = (label, h) => `<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
   <tr>
      <td align="center" valign="middle" height="${h}" bgcolor="${C.photoBg}" style="height: ${h}px; border-radius: 3px; font-family: ${F}; font-size: 13px; line-height: 18px; color: ${C.soft};">${label}</td>
   </tr>
</table>`;
const fbPlates = [
  `${fbBadge(1, true)}
${sp(12)}
${fbP('subtitle_1', '12px', '16px', C.accent, ' letter-spacing: 0.1em; text-transform: uppercase;')}
${sp(12)}
${fbH('title_2', '26px', '30px')}
${sp(12)}
${fbH('title_3', '64px', '64px', ' font-weight: 400;')}
${sp(12)}
${fbP('txt_2', '15px', '22px', C.soft)}`,
  `${fbBadge(2, true)}
${sp(12)}
${fbP('subtitle_2', '12px', '16px', C.accent, ' letter-spacing: 0.1em; text-transform: uppercase;')}
${sp(12)}
${fbH('title_4', '26px', '30px')}
${sp(12)}
${fbPhoto('img_alt_1', 120)}
${sp(12)}
${fbP('txt_3', '16px', '22px', C.txt, ' font-weight: 600;')}
${fbP('txt_4', '15px', '22px', C.soft)}`,
  `${fbBadge(3, false)}
${sp(12)}
${fbP('subtitle_3', '12px', '16px', C.accent, ' letter-spacing: 0.1em; text-transform: uppercase;')}
${sp(12)}
${fbH('title_5', '26px', '30px')}
${sp(12)}
${fbH('title_6', '32px', '38px', ' font-weight: 400;')}
${fbP('txt_5', '14px', '20px', C.soft)}
${sp(10)}
${fbH('title_7', '32px', '38px', ' font-weight: 400;')}
${fbP('txt_6', '14px', '20px', C.soft)}
${sp(10)}
${fbH('title_8', '20px', '26px', ' font-weight: 400;')}
${fbP('txt_7', '14px', '20px', C.soft)}`,
  `${fbBadge(4, false)}
${sp(12)}
${fbP('subtitle_4', '12px', '16px', C.accent, ' letter-spacing: 0.1em; text-transform: uppercase;')}
${sp(12)}
${fbH('title_9', '26px', '30px')}
${sp(12)}
${fbPhoto('img_alt_2', 110)}
${sp(12)}
${fbP('txt_8', '15px', '22px', C.soft)}
${sp(12)}
<a class="plx-dl" href="https://100procent.nl/" target="_blank" style="font-family: ${F}; font-size: 15px; line-height: 22px; font-weight: 600; color: ${C.txt}; text-decoration: underline;">link_txt_1</a>`,
];
// one floor: plate left or right, windows on the other side, the shaft with the floor number in the middle
// The HTML order is always windows, shaft, plate, so on mobile (stacked, windows hidden) the floor number comes right
// before its plate. Floors with the plate on the left use dir="rtl" on the table to show it left on desktop.
const fbFloor = (num, plateLeft, plate, fills) => {
  const side = (content, cls) => `<th class="col-sm-12${cls}" dir="ltr" width="${(T.width - 130) / 2}" align="center" valign="top" style="vertical-align: top; font-weight: normal; padding: ${content.startsWith('<table role="presentation" width="230"') ? '120px 0 40px 0' : '150px 0 40px 0'};">
${ind(content, 3)}
</th>`;
  const plateSide = side(fbPlate(plate), ' pmt24 pmb24 pml16 pmr16');
  const winSide = side(fbWin(fills), ' hide_on_mobile');
  return tbl(`   <tr>
${ind(winSide, 6)}
      <th class="col-sm-12" dir="ltr" width="130" height="100%" valign="top" bgcolor="${C.shaft}" style="vertical-align: top; height: 100%; font-weight: normal; padding: 0 13px;">
         <table role="presentation" width="100%" height="100%" border="0" cellspacing="0" cellpadding="0" style="height: 100%; border-left: 2px solid ${C.shaftLine}; border-right: 2px solid ${C.shaftLine};">
            <tr>
               <td align="center" valign="top" style="vertical-align: top; padding: 30px 0; font-family: ${FH}; font-size: 56px; line-height: 64px; color: ${C.num};">${num}</td>
            </tr>
         </table>
      </th>
${ind(plateSide, 6)}
   </tr>`, ` bgcolor="${C.facade}"${plateLeft ? ' dir="rtl"' : ''}`) + '\n' + tbl(row(20, C.slab));
};
const fbLobbyRoom = (label, content) => `<p style="margin: 0 0 16px 0; font-family: ${FH}; font-size: 26px; line-height: 32px; color: ${C.txt}; text-align: center;">${label}</p>
${content}`;
const fbKeys = `<table role="presentation" width="140" align="center" border="0" cellspacing="0" cellpadding="0" bgcolor="${C.keyBoard}" style="width: 140px; border: 4px solid ${C.keyFrame};">
${[0, 1].map(() => `   <tr>
${[0, 1, 2, 3].map(() => `      <td align="center" style="padding: 8px 0;"><div style="width: 8px; height: 16px; border-radius: 2px; background-color: ${C.key}; font-size: 0; line-height: 0;">&nbsp;</div></td>`).join('\n')}
   </tr>`).join('\n')}
</table>`;
const fbShelf = (heights, colorIdx) => `<table role="presentation" align="center" border="0" cellspacing="0" cellpadding="0" style="border-bottom: 6px solid ${C.shelf};">
   <tr>
${heights.map((h, i) => `      <td valign="bottom" style="padding: 0 6px; vertical-align: bottom;"><div style="width: 12px; height: ${h}px; border-radius: 3px 3px 0 0; background-color: ${C.bottles[colorIdx[i]]}; font-size: 0; line-height: 0;">&nbsp;</div></td>`).join('\n')}
   </tr>
</table>`;
const fbEntrance = `<table role="presentation" width="190" align="center" border="0" cellspacing="0" cellpadding="0" style="width: 190px;">
   <tr>
      <td align="center" style="padding: 0 0 9px 0;">
         <div style="width: 28px; height: 28px; border-radius: 50%; background-color: ${C.liftBadge}; font-family: ${F}; font-size: 13px; line-height: 28px; font-weight: 600; color: ${C.txt}; text-align: center;">label_5</div>
      </td>
   </tr>
   <tr>
      <td align="center" height="28" bgcolor="${C.sign}" style="height: 28px; font-family: ${F}; font-size: 11px; line-height: 28px; letter-spacing: 0.16em; text-transform: uppercase; color: ${C.signTxt};">label_6</td>
   </tr>
   <tr>
      <td align="center">
         <table role="presentation" width="144" border="0" cellspacing="0" cellpadding="0" style="width: 144px; border: 7px solid ${C.frame}; border-bottom: 0;">
            <tr>
               <td width="40" height="216" bgcolor="${C.doorPanel}" style="width: 40px; height: 216px; border-right: 2px solid ${C.insideLine};">&nbsp;</td>
               <td bgcolor="${C.inside}" style="font-size: 0;">&nbsp;</td>
               <td width="40" height="216" bgcolor="${C.doorPanel}" style="width: 40px; height: 216px; border-left: 2px solid ${C.insideLine};">&nbsp;</td>
            </tr>
         </table>
      </td>
   </tr>
</table>`;
const fallback = `<div class="plx-fallback">
${ind(tbl(`   <tr>
      <td align="center" class="pml16 pmr16" style="padding: 36px 60px 40px 60px;">
         <p style="margin: 0; font-family: ${FH}; font-size: 40px; line-height: 40px; color: ${C.logo};">label_7</p>
         <p style="margin: 2px 0 0 0; padding-left: 0.5em; font-family: ${F}; font-size: 11px; line-height: 16px; letter-spacing: 0.5em; text-transform: uppercase; color: ${C.logo};">label_8</p>
         <h1 class="plx-fb-h1" style="margin: 72px 0 18px 0; font-family: ${FH}; font-size: 60px; line-height: 63px; font-weight: 500; color: ${C.hero};">title_1</h1>
         <p style="margin: 0; font-family: ${F}; font-size: 20px; line-height: 29px; color: ${C.heroSub};">txt_1</p>
      </td>
   </tr>
   <tr>
      <td align="center" style="padding: 40px 0 0 0;">
         <table role="presentation" width="190" align="center" border="0" cellspacing="0" cellpadding="0" style="width: 190px;">
            <tr>
               <td height="14" bgcolor="${C.roofCap}" style="height: 14px; font-size: 0; line-height: 0;">&nbsp;</td>
            </tr>
            <tr>
               <td align="center" bgcolor="${C.roofHouse}" style="padding: 12px 20px 0 20px; font-family: ${F}; font-size: 11px; line-height: 14px; letter-spacing: 0.16em; text-transform: uppercase; color: ${C.roofLabel};">
                  label_2
                  <div style="height: 12px; line-height: 12px; font-size: 0;">&nbsp;</div>
                  <div style="height: 220px; line-height: 220px; font-size: 0; background-color: ${C.door};">&nbsp;</div>
               </td>
            </tr>
         </table>
      </td>
   </tr>
${row(30, C.roofEdge)}`, ` bgcolor="${C.sky}"`), 3)}
${ind(fbFloor('4', true, fbPlates[0], [1, 0, 0, 1]), 3)}
${ind(fbFloor('3', false, fbPlates[1], [0, 1, 1, 1]), 3)}
${ind(fbFloor('2', true, fbPlates[2], [1, 1, 0, 1]), 3)}
${ind(fbFloor('1', false, fbPlates[3], [1, 0, 1, 0]), 3)}
${ind(tbl(`   <tr>
      <td class="pml16 pmr16" style="padding: 32px 40px 0 40px;">
         <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="${C.lobbyCard}" style="border-radius: 4px; border-collapse: separate;">
            <tr>
               <td align="center" style="padding: 24px;">
                  <h2 class="plx-fb-lobby" style="margin: 0 0 8px 0; font-family: ${FH}; font-size: 44px; line-height: 48px; font-weight: 500; color: ${C.txt};">title_10</h2>
                  <p style="margin: 0; font-family: ${F}; font-size: 18px; line-height: 26px; color: ${C.soft};">txt_9</p>
               </td>
            </tr>
         </table>
      </td>
   </tr>
   <tr>
      <td style="padding: 40px 20px 0 20px;">
         <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
               <th class="col-sm-12" width="34%" valign="bottom" style="vertical-align: bottom; font-weight: normal; padding: 0 0 0 0;">
${ind(fbLobbyRoom('label_3', fbKeys), 18)}
                  <div style="height: 40px; line-height: 40px; font-size: 0;">&nbsp;</div>
               </th>
               <th class="col-sm-12 pmt24" width="32%" valign="bottom" style="vertical-align: bottom; font-weight: normal;">
${ind(fbEntrance, 18)}
               </th>
               <th class="col-sm-12 pmt24" width="34%" valign="bottom" style="vertical-align: bottom; font-weight: normal;">
${ind(fbLobbyRoom('label_4', fbShelf([42, 34, 48, 38, 44, 30, 46], [0, 1, 2, 3, 0, 1, 2]) + '\n<div style="height: 14px; line-height: 14px; font-size: 0;">&nbsp;</div>\n' + fbShelf([36, 46, 32, 44, 40, 48, 34], [2, 3, 0, 1, 2, 3, 0])), 18)}
                  <div style="height: 40px; line-height: 40px; font-size: 0;">&nbsp;</div>
               </th>
            </tr>
         </table>
      </td>
   </tr>`, ` bgcolor="${C.lobby}"`), 3)}
${ind(tbl(row(10, C.curb) + '\n' + row(30, C.pavement)), 3)}
</div>`;

// ---------------- shared: below the scroll area (USP bar + CTA) ----------------
const usp = n => `<span class="plx-usp" style="display: inline-block; padding: 0 11px; font-family: ${F}; font-size: 13px; line-height: 20px; color: ${C.uspTxt};"><span style="color: ${C.check}; font-weight: 700;">&#10003;</span>&nbsp;txt_${n}</span>`;
const btns = `<!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://100procent.nl/" style="height:48px;v-text-anchor:middle;width:200px;" arcsize="8%" strokecolor="${C.btn}" fillcolor="${C.btn}">
   <w:anchorlock/>
   <center style="color:${C.btnTxt};font-family:${F};font-size:16px;font-weight:bold;">btn_txt_1</center>
</v:roundrect>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://100procent.nl/" style="height:48px;v-text-anchor:middle;width:220px;" arcsize="8%" strokecolor="${C.btn2}" strokeweight="2px" filled="f">
   <w:anchorlock/>
   <center style="color:${C.btn2};font-family:${F};font-size:16px;font-weight:bold;">btn_txt_2</center>
</v:roundrect>
<![endif]-->
<a class="plx-btn" href="https://100procent.nl/" target="_blank" style="display: inline-block; margin: 0 8px; padding: 0 26px; border-radius: 4px; background-color: ${C.btn}; color: ${C.btnTxt}; font-family: ${F}; font-size: 16px; line-height: 48px; font-weight: 600; text-decoration: none; -webkit-text-size-adjust: none; mso-hide: all;">btn_txt_1</a>
<a class="plx-btn plx-dl" href="https://100procent.nl/" target="_blank" style="display: inline-block; margin: 0 8px; padding: 0 24px; border-radius: 4px; border: 2px solid ${C.btn2}; color: ${C.btn2}; font-family: ${F}; font-size: 16px; line-height: 44px; font-weight: 600; text-decoration: none; -webkit-text-size-adjust: none; mso-hide: all;">btn_txt_2</a>`;
const shared = tbl(`   <tr>
      <td align="center" bgcolor="${C.uspBg}" class="pml16 pmr16" style="padding: 12px 24px;">
         ${usp(10)}${usp(11)}${usp(12)}
      </td>
   </tr>
   <tr>
      <td align="center" bgcolor="${C.ctaBg}" class="pml16 pmr16" style="padding: 48px 60px;">
         <h2 class="plx-cta-title" style="margin: 0 0 18px 0; font-family: ${FH}; font-size: 38px; line-height: 44px; font-weight: 500; color: ${C.txt};">title_11</h2>
         <p style="margin: 0 0 26px 0; font-family: ${F}; font-size: 16px; line-height: 24px; color: ${C.soft};">txt_13</p>
${ind(btns, 9)}
      </td>
   </tr>`);

const inputs = `<!--[if !mso]><!-->
<input type="checkbox" id="plx-detect" class="plx-detect" checked style="display: none !important; mso-hide: all;">
<!--<![endif]-->`;

const body = `<!-- start ${NAME} -->
@@CSS@@
<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
   <tr>
      <td${T.outerClass ? ` class="${T.outerClass}"` : ''} style="padding: ${T.outerPad};" align="center">
         <!-- state input: detection only (pre-checked); the movement is native scrolling -->
${ind(inputs, 9)}
         <!-- fallback: the cross-section in tables, the lift in the lobby -->
${ind(fallback, 9)}
         <!-- interactive: scroll window, building and the still cabin -->
${ind(interactive, 9)}
         <!-- below the scroll area: shared by fallback and interactive -->
${ind(shared, 9)}
      </td>
   </tr>
</table>
<!-- end ${NAME} -->
`;
return { name: NAME, css, block: body.replace('@@CSS@@', css), bodyWithoutCss: body.replace('@@CSS@@\n', '') };
}

module.exports = { build, DEFAULT, NAME };

if (require.main === module) {
  const out = build(DEFAULT).block.replace(/\r?\n/g, '\r\n');
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, out);
  console.log('written', OUT, Buffer.byteLength(out), 'bytes');
}
