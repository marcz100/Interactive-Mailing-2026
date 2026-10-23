// "De lijn van het jaar" generator, a one-on-one email translation of the artifact boards "De lijn van het jaar
// (klikbaar)" (LeidingMail.dc.html, 700 x 3100) and "De momenten, techniek en gewicht" (LeidingInfo.dc.html).
// Token-driven: `node gen_leiding.js` writes the repo block with default tokens and slot names; build(T) is reused by
// build_mail.js for the Coram mail with the artifact's values and copy.
//   node gen_leiding.js      (then run assemble.ps1 in HTML/ to rebuild the all-blocks file)
const fs = require('fs'), path = require('path');
const NAME = 'hotspot_1_col_row_1_subtitle_title_txt_btn_row_2_subtitle_title_txt_x4_btn_x3_row_3_icon_row_4_subtitle_title_txt_x2';
// build/ -> concept_4_lijn_van_het_jaar -> coram -> interactive_artifact -> HTML
const OUT = path.resolve(__dirname, '../../../../blocks/hotspot', `${NAME}.html`);

// default tokens (README token table); geometry and font sizes are the artifact's own
const DEFAULT = {
  font: 'Roboto,Arial,Helvetica,Verdana,sans-serif',
  c: {
    wall: '#efefef', wallLine: 'rgba(68,68,68,0.18)', ink: '#050033', grey: '#4d4d4d', soft: '#e6e6e6', card: '#ffffff',
    dark: '#050033', darkTxt: '#ffffff', blue: '#9980FF', blueRing: 'rgba(153,128,255,0.18)', pipe: '#9E9E9E',
    black: '#050033', clog: '#444444', line: '#e6e6e6', rim: '#efefef', bath: '#fefefe', white: '#ffffff',
  },
};

const pa = (v, of) => +(v / of * 100).toFixed(4) + '%';
const X = v => pa(v, 700);
const Y0 = 80;   // the board's header bar: block y = board y - 80
// desktop: left/width in % of 700, top/height in px (the board's y minus the 80px header)
const at = (l, t, w, h) => `left: ${X(l)}; top: ${t - Y0}px;${w != null ? ` width: ${X(w)};` : ''}${h != null ? ` height: ${h}px;` : ''}`;
// the pipe, per stretch (lc0 blue once the tap is open, lc1-lc3 once clog 1-3 is gone): [kind, x, y, w, h]
// kind: v/h straight, bl/tr/br/tl elbows (two 8px borders and a 40px radius on that corner)
const PIPE = [
  [['v', 136, 420, 8, 300], ['bl', 136, 712, 60, 56], ['h', 194, 760, 322, 8], ['tr', 512, 760, 56, 60], ['v', 560, 818, 8, 240]],
  [['v', 560, 1100, 8, 230], ['br', 512, 1324, 56, 64], ['h', 370, 1380, 146, 8]],
  [['h', 190, 1380, 140, 8], ['tl', 136, 1380, 56, 60], ['v', 136, 1438, 8, 510], ['bl', 136, 1944, 56, 64], ['h', 190, 2000, 50, 8]],
  [['h', 280, 2000, 56, 8], ['tr', 332, 2000, 56, 60], ['v', 380, 2058, 8, 60]],
];
// where a clog sat: a piece of pipe that turns blue once that clog is gone (the board leaves a gap there)
const GAPS = [['v', 560, 1058, 8, 42], ['h', 330, 1380, 40, 8], ['h', 240, 2000, 40, 8]];
const CLOGS = [[548, 1056, 32, 46], [328, 1368, 44, 32], [238, 1988, 44, 32]];
const BTNS = [[584, 1056], [286, 1404], [196, 2026]];
const S = [1, 2, 3, 4];
const upTo = n => S.slice(0, n).map(i => `.cl-s${i}:checked`).join(' ~ ');   // the chain of the first n steps
const bath = v => pa(v, 360), bathY = v => pa(v, 264);
const bbox = (l, t, w, h) => `left: ${bath(l)}; top: ${bathY(t)}; width: ${bath(w)}; height: ${bathY(h)};`;

function build(T) {
const C = T.c, F = T.font;
const grid = `repeating-linear-gradient(0deg, ${C.wallLine} 0 1px, transparent 1px 100px), repeating-linear-gradient(90deg, ${C.wallLine} 0 1px, transparent 1px 100px)`;
const pipeCss = (sel, kind, color) => {
  const b = { v: `background-color: ${color};`, h: `background-color: ${color};`, bl: `border-left-color: ${color}; border-bottom-color: ${color};`,
    tr: `border-top-color: ${color}; border-right-color: ${color};`, br: `border-right-color: ${color}; border-bottom-color: ${color};`,
    tl: `border-top-color: ${color}; border-left-color: ${color};` }[kind];
  return `${sel} { ${b} }`;
};

const css = `<style type="text/css">
   /* De lijn van het jaar (artifact "De lijn van het jaar"): a matte black wall tap at the top. Opening it (label of
      .cl-s1) sends the water down the pipe along the year's cards until it gets stuck; three clogs on the way are
      cleared by the installer (labels of .cl-s2-.cl-s4, each button only shows when the water reaches it). After the
      last one a blue stream runs from the bath tap into the bath. Desktop: the board's drawing, absolutely positioned;
      mobile: the same elements in flow, the pipe as the left edge of four sections ("Mobiel krijgt een eenvoudiger
      leiding langs de linkerkant"). Order: inputs, fallback, interactive. Interactive only in WebKit clients that
      support :checked (pre-checked .cl-detect); everything else keeps the fallback: the pipe blue, no clogs, the
      stream in the bath. */
   @media screen and (-webkit-min-device-pixel-ratio: 0) {
      .cl-detect:checked ~ .cl-fallback {
         display: none !important;
         max-height: 0 !important;
         overflow: hidden !important;
      }

      .cl-detect:checked ~ .cl-interactive {
         display: block !important;
         max-height: none !important;
         overflow: visible !important;
      }
   }

   /* the scene: the board from under its header (y 80) to under the message (y 2775) */
   .cl-interactive .cl-scene {
      position: relative;
      min-height: ${2775 - Y0}px;
      background-color: ${C.wall};
      background-image: ${grid};
      text-align: left;
   }

   .cl-interactive .cl-a {
      position: absolute;
      display: block;
      box-sizing: border-box;
   }

   /* ---- the tap (60 x 134 at x 110, y 290): handle, body, spout; the handle turns 70 degrees when open ---- */
   .cl-interactive .cl-tap {
      position: absolute;
      ${at(110, 290)}
      width: 60px;
      height: 134px;
   }

   .cl-interactive .cl-handle {
      left: 22px;
      top: 0;
      width: 16px;
      height: 44px;
      border-radius: 8px;
      background-color: ${C.black};
      -webkit-transform-origin: 50% 100%;
      transform-origin: 50% 100%;
      -webkit-transition: -webkit-transform 0.5s ease;
      transition: transform 0.5s ease;
   }

   .cl-s1:checked ~ .cl-interactive .cl-handle {
      -webkit-transform: rotate(70deg);
      transform: rotate(70deg);
   }

   .cl-interactive .cl-body {
      left: 0;
      top: 40px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: ${C.black};
      box-shadow: 0 6px 12px rgba(40,30,20,0.3);
   }

   .cl-interactive .cl-spout {
      left: 20px;
      top: 90px;
      width: 20px;
      height: 44px;
      border-radius: 0 0 8px 8px;
      background-color: ${C.black};
   }

   /* ---- the hero text (410 at x 230, y 150): closed and open state ---- */
   .cl-interactive .cl-hero {
      position: absolute;
      ${at(230, 150, 410)}
   }

   .cl-interactive .cl-kicker {
      margin: 0;
      font-family: ${F};
      font-size: 13px;
      line-height: 19px;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: ${C.grey};
   }

   .cl-interactive .cl-h1 {
      margin: 16px 0 0 0;
      font-family: ${F};
      font-size: 40px;
      line-height: 46px;
      font-weight: 300;
      color: ${C.ink};
   }

   .cl-interactive .cl-lead {
      margin: 18px 0 0 0;
      font-family: ${F};
      font-size: 17px;
      line-height: 25.5px;
      font-weight: 300;
      color: ${C.grey};
   }

   .cl-interactive .cl-open,
   .cl-s1:checked ~ .cl-interactive .cl-closed {
      display: none;
   }

   .cl-s1:checked ~ .cl-interactive .cl-open {
      display: block;
   }

   .cl-interactive .cl-tap-btn {
      display: inline-block;
      margin: 18px 0 0 0;
      padding: 0 28px;
      background-color: ${C.blue};
      font-family: ${F};
      font-size: 17px;
      line-height: 52px;
      font-weight: 500;
      color: ${C.white};
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
   }

   /* ---- the pipe (desktop): grey, blue per stretch once the water is there ---- */
   .cl-interactive .cl-pv,
   .cl-interactive .cl-ph {
      background-color: ${C.pipe};
   }

   .cl-interactive .cl-pbl,
   .cl-interactive .cl-ptr,
   .cl-interactive .cl-pbr,
   .cl-interactive .cl-ptl {
      border: 0 solid ${C.pipe};
   }

   .cl-interactive .cl-pbl { border-left-width: 8px; border-bottom-width: 8px; border-bottom-left-radius: 40px; }
   .cl-interactive .cl-ptr { border-top-width: 8px; border-right-width: 8px; border-top-right-radius: 40px; }
   .cl-interactive .cl-pbr { border-right-width: 8px; border-bottom-width: 8px; border-bottom-right-radius: 40px; }
   .cl-interactive .cl-ptl { border-top-width: 8px; border-left-width: 8px; border-top-left-radius: 40px; }

${S.map(n => ['v', 'h', 'bl', 'tr', 'br', 'tl'].map(k => pipeCss(`   ${upTo(n)} ~ .cl-interactive .cl-lc${n - 1}.cl-p${k}`, k, C.blue)).join('\n')).join('\n')}

   /* where a clog sat: hidden until it is gone, then blue (the board leaves a gap there) */
   .cl-interactive .cl-gap {
      display: none;
      background-color: ${C.blue};
   }

${[1, 2, 3].map(g => `   ${upTo(g + 1)} ~ .cl-interactive .cl-gap${g}`).join(',\n')} {
      display: block;
   }

   /* ---- the clogs and their buttons ---- */
   .cl-interactive .cl-clog {
      position: absolute;
      border-radius: 12px;
      background-color: ${C.clog};
      box-shadow: inset 6px 6px 0 rgba(255,255,255,0.10), inset -6px -4px 0 rgba(0,0,0,0.18), 0 4px 8px rgba(0,0,0,0.25);
   }

${CLOGS.map(([l, t, w, h], i) => `   .cl-interactive .cl-clog${i + 1} { ${at(l, t)} width: ${w}px; height: ${h}px; }`).join('\n')}

${[1, 2, 3].map(g => `   ${upTo(g + 1)} ~ .cl-interactive .cl-clog${g}`).join(',\n')} {
      display: none;
   }

   .cl-interactive .cl-fix {
      position: absolute;
      display: none;
      -webkit-align-items: center;
      align-items: center;
      height: 44px;
      padding: 0 16px;
      box-sizing: border-box;
      border-radius: 22px;
      background-color: ${C.blue};
      box-shadow: 0 0 0 7px ${C.blueRing};
      font-family: ${F};
      font-size: 15px;
      line-height: 22px;
      font-weight: 500;
      white-space: nowrap;
      color: ${C.white};
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
   }

   .cl-interactive .cl-fix svg {
      margin-right: 8px;
   }

${BTNS.map(([l, t], i) => `   .cl-interactive .cl-fix${i + 1} { ${at(l, t)} }`).join('\n')}

   /* a button shows only when the water reaches it, and goes when its clog is gone */
${[1, 2, 3].map(g => `   ${upTo(g)} ~ .cl-interactive .cl-fix${g} {
      display: -webkit-flex;
      display: flex;
   }

   ${upTo(g + 1)} ~ .cl-interactive .cl-fix${g} {
      display: none;
   }`).join('\n\n')}

   /* ---- the cards ---- */
   .cl-interactive .cl-card {
      position: absolute;
      padding: 32px;
      box-sizing: border-box;
      background-color: ${C.card};
   }

   .cl-interactive .cl-card1 { ${at(200, 470, 440)} }
   .cl-interactive .cl-card2 { ${at(60, 850, 460)} }
   .cl-interactive .cl-group3 { position: absolute; ${at(200, 1470, 440)} }

   .cl-interactive .cl-group3 .cl-card {
      position: static;
   }

   .cl-interactive .cl-card-dark {
      background-color: ${C.dark};
   }

   /* the two cards of group 3, 20 apart */
   .cl-interactive .cl-group3 .cl-card + .cl-card {
      margin-top: 20px;
   }

   .cl-interactive .cl-ck {
      margin: 0;
      font-family: ${F};
      font-size: 13px;
      line-height: 19px;
      letter-spacing: 0.24em;
      text-transform: uppercase;
      color: ${C.grey};
   }

   .cl-interactive .cl-card-dark .cl-ck {
      color: ${C.soft};
   }

   .cl-interactive .cl-big {
      margin: 8px 0 0 0;
      font-family: ${F};
      font-size: 72px;
      line-height: 72px;
      font-weight: 300;
      color: ${C.blue};
   }

   .cl-interactive .cl-big-ink {
      font-size: 64px;
      line-height: 64px;
      color: ${C.ink};
   }

   .cl-interactive .cl-brand {
      margin: 6px 0 0 0;
      font-family: ${F};
      font-size: 38px;
      line-height: 41.8px;
      font-weight: 300;
      color: ${C.blue};
   }

   .cl-interactive .cl-txt {
      margin: 8px 0 0 0;
      font-family: ${F};
      font-size: 18px;
      line-height: 26.1px;
      font-weight: 300;
      color: ${C.ink};
   }

   .cl-interactive .cl-fact {
      margin: 10px 0 0 0;
      font-family: ${F};
      font-size: 19px;
      line-height: 28.5px;
      font-weight: 300;
      color: ${C.darkTxt};
   }

   .cl-interactive .cl-top3 {
      margin: 18px 0 0 0;
      padding: 18px 0 0 0;
      border-top: 1px solid ${C.line};
   }

   .cl-interactive .cl-item {
      display: -webkit-flex;
      display: flex;
      -webkit-align-items: center;
      align-items: center;
      margin: 12px 0 0 0;
      font-family: ${F};
      font-size: 18px;
      line-height: 26px;
      font-weight: 300;
      color: ${C.ink};
   }

   .cl-interactive .cl-nr {
      display: -webkit-flex;
      display: flex;
      -webkit-flex: none;
      flex: none;
      -webkit-align-items: center;
      align-items: center;
      -webkit-justify-content: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      margin: 0 16px 0 0;
      border-radius: 50%;
      background-color: ${C.dark};
      font-size: 16px;
      line-height: 23px;
      font-weight: 400;
      color: ${C.darkTxt};
   }

   /* ---- the bath (360 x 264 at x 290, y 2108): tap, stream, rim, tub, feet ---- */
   .cl-interactive .cl-bath {
      position: absolute;
      ${at(290, 2108, 360)}
   }

   .cl-interactive .cl-bath-box {
      position: relative;
      height: 0;
      padding-bottom: ${pa(264, 360)};
   }

   .cl-interactive .cl-btap { ${bbox(78, 0, 112, 20)} border-radius: 10px; background-color: ${C.black}; box-shadow: 0 4px 8px rgba(40,30,20,0.3); }
   .cl-interactive .cl-bspout { ${bbox(172, 0, 18, 36)} border-radius: 0 0 9px 9px; background-color: ${C.black}; }
   .cl-interactive .cl-stream { display: none; ${bbox(177, 36, 8, 110)} border-radius: 4px; background-color: ${C.blue}; opacity: 0.85; }
   .cl-interactive .cl-rim { ${bbox(0, 118, 360, 18)} border-radius: 9px; background-color: ${C.rim}; box-shadow: inset 0 4px 6px rgba(0,0,0,0.12); }
   .cl-interactive .cl-tub { ${bbox(6, 128, 348, 120)} border-radius: 6px 6px 70px 70px; background-color: ${C.bath}; box-shadow: inset 0 -14px 20px rgba(0,0,0,0.07), 0 14px 24px rgba(40,30,20,0.22); }
   .cl-interactive .cl-foot1 { ${bbox(50, 242, 20, 22)} border-radius: 0 0 6px 6px; background-color: ${C.black}; }
   .cl-interactive .cl-foot2 { ${bbox(290, 242, 20, 22)} border-radius: 0 0 6px 6px; background-color: ${C.black}; }

   ${upTo(4)} ~ .cl-interactive .cl-stream {
      display: block;
   }

   /* ---- the message by the bath (560 at x 70, y 2410) ---- */
   .cl-interactive .cl-msg {
      position: absolute;
      ${at(70, 2410, 560)}
      padding: 44px 40px;
      box-sizing: border-box;
      background-color: ${C.card};
      text-align: center;
   }

   .cl-interactive .cl-mk {
      display: -ms-grid;
      display: grid;
   }

   .cl-interactive .cl-mk .cl-ck {
      grid-area: 1 / 1;
   }

   .cl-interactive .cl-mk-end,
   ${upTo(4)} ~ .cl-interactive .cl-mk-start {
      visibility: hidden;
   }

   ${upTo(4)} ~ .cl-interactive .cl-mk-end {
      visibility: visible;
   }

   .cl-interactive .cl-h2 {
      margin: 18px 0 0 0;
      font-family: ${F};
      font-size: 32px;
      line-height: 40px;
      font-weight: 300;
      color: ${C.ink};
   }

   .cl-interactive .cl-thanks {
      margin: 18px 0 0 0;
      font-family: ${F};
      font-size: 20px;
      line-height: 30px;
      font-weight: 500;
      color: ${C.ink};
   }

   .cl-interactive .cl-wish {
      margin: 18px 0 0 0;
      font-family: ${F};
      font-size: 17px;
      line-height: 27.2px;
      font-weight: 300;
      color: ${C.ink};
   }

   /* the sections and clog rows only carry the pipe on mobile */
   .cl-interactive .cl-sec3 {
      display: none;
   }

   @media only screen and (max-width: 600px) {
      /* mobile: one column in flow; the pipe is the left edge of four sections (x 14-22 of the content), grey and blue
         per stretch; the clogs sit on it, their buttons next to them; the last section bends into the bath tap */
      .cl-interactive .cl-scene {
         min-height: 0 !important;
         padding: 32px 16px 40px 16px !important;
      }

      .cl-interactive .cl-p,
      .cl-interactive .cl-gap {
         display: none !important;
      }

      .cl-interactive .cl-hero,
      .cl-interactive .cl-tap,
      .cl-interactive .cl-card,
      .cl-interactive .cl-group3,
      .cl-interactive .cl-bath,
      .cl-interactive .cl-msg,
      .cl-interactive .cl-clog,
      .cl-interactive .cl-fix {
         position: relative !important;
         left: auto !important;
         top: auto !important;
      }

      .cl-interactive .cl-hero,
      .cl-interactive .cl-card,
      .cl-interactive .cl-group3,
      .cl-interactive .cl-msg {
         width: auto !important;
      }

      .cl-h1 {
         font-size: 30px !important;
         line-height: 35px !important;
      }

      /* the tap: its spout (x 30) over the pipe (x 18) */
      .cl-interactive .cl-tap {
         margin: 24px 0 0 -12px !important;
      }

      .cl-interactive .cl-sec {
         margin: 0 0 0 14px;
         padding: 20px 0 20px 20px;
         border-left: 8px solid ${C.pipe};
      }

${S.map(n => `      ${upTo(n)} ~ .cl-interactive .cl-sec${n - 1}`).join(',\n')} {
         border-left-color: ${C.blue} !important;
      }

      .cl-interactive .cl-card,
      .cl-interactive .cl-group3 {
         margin: 0 0 16px 0 !important;
         padding: 24px !important;
      }

      .cl-interactive .cl-group3 {
         padding: 0 !important;
      }

      .cl-big {
         font-size: 56px !important;
         line-height: 56px !important;
      }

      .cl-brand {
         font-size: 30px !important;
         line-height: 34px !important;
      }

      /* a clog row: the clog (28 x 20) centred on the pipe (x 18; the row starts at x 42), the button next to it */
      .cl-interactive .cl-row {
         display: -webkit-flex;
         display: flex;
         -webkit-align-items: center;
         align-items: center;
      }

      .cl-interactive .cl-clog {
         width: 28px !important;
         height: 20px !important;
         margin: 0 14px 0 -38px !important;
         border-radius: 8px !important;
      }

      /* the last stretch: down from the pipe and right into the bath tap (the tap's left end at 65 of the 300 bath) */
      .cl-interactive .cl-sec3 {
         display: block !important;
         width: 55px;
         height: 40px;
         padding: 0 !important;
         box-sizing: border-box;
         border-bottom: 8px solid ${C.pipe};
         border-bottom-left-radius: 20px;
      }

      ${upTo(4)} ~ .cl-interactive .cl-sec3 {
         border-bottom-color: ${C.blue} !important;
      }

      .cl-interactive .cl-bath {
         width: 300px !important;
         max-width: 100% !important;
         margin: -12px 0 0 0 !important;
      }

      .cl-interactive .cl-msg {
         margin: 24px 0 0 0 !important;
         padding: 32px 20px !important;
      }

      .cl-h2 {
         font-size: 26px !important;
         line-height: 33px !important;
      }

      .cl-fb-pad {
         padding-left: 16px !important;
         padding-right: 16px !important;
      }

      .cl-fb-card {
         padding: 24px !important;
      }
   }

   @media only screen and (max-width: 400px) {
      .cl-h1 {
         font-size: 26px !important;
         line-height: 31px !important;
      }

      .cl-interactive .cl-fix {
         padding: 0 12px !important;
         font-size: 14px !important;
      }
   }

   /* Outlook.com / new Outlook: class names get an x_ prefix */
   [class~="x_cl-interactive"],
   [class~="x_cl-detect"]:checked ~ [class~="x_cl-interactive"] {
      display: none !important;
      max-height: 0 !important;
      overflow: hidden !important;
   }

   [class~="x_cl-fallback"],
   [class~="x_cl-detect"]:checked ~ [class~="x_cl-fallback"] {
      display: block !important;
      max-height: none !important;
      overflow: visible !important;
   }

   /* Samsung Mail: the message is wrapped in #MessageViewBody (the id outranks the activation selector) */
   #MessageViewBody .cl-interactive {
      display: none !important;
      max-height: 0 !important;
      overflow: hidden !important;
   }

   #MessageViewBody .cl-fallback {
      display: block !important;
      max-height: none !important;
      overflow: visible !important;
   }
</style>
<style type="text/css">
   /* Outlook apps: back to the fallback (separate style tag: the \\0 hack breaks the rest of a style tag) */
   .cl-interactive\\0,
   .cl-detect:checked ~ .cl-interactive\\0 {
      display: none !important;
      max-height: 0 !important;
      overflow: hidden !important;
   }

   .cl-fallback\\0,
   .cl-detect:checked ~ .cl-fallback\\0 {
      display: block !important;
      max-height: none !important;
      overflow: visible !important;
   }
</style>`;

// ---------------- markup ----------------
const ind = (s, n) => s.split('\n').map(l => l ? ' '.repeat(n) + l : l).join('\n');
const f = (size, lh, extra = '') => `font-family: ${F}; font-size: ${size}px; line-height: ${lh}px;${extra}`;
const wrench = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${C.white}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"></path></svg>`;
const pipeEl = (cls, [k, l, t, w, h]) => `<div class="cl-a cl-p cl-p${k} ${cls}" style="${at(l, t, w, h)}"></div>`;
const pipes = PIPE.map((stretch, i) => stretch.map(p => pipeEl(`cl-lc${i}`, p)).join('\n')).join('\n');
const gaps = GAPS.map(([k, l, t, w, h], i) => `<div class="cl-a cl-gap cl-gap${i + 1}" style="${at(l, t, w, h)}"></div>`).join('\n');
const row = g => `<div class="cl-row cl-row${g}">
   <div class="cl-clog cl-clog${g}"></div>
   <label for="cl-s${g + 1}" class="cl-fix cl-fix${g}" title="Ontstop de leiding">${wrench}btn_txt_${g + 1}</label>
</div>`;

const interactive = `<!--[if !mso]><!-->
<div class="cl-interactive" style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">
   <div class="cl-scene">
      <!-- the pipe on desktop: four stretches, grey until the water gets there -->
${ind(pipes, 6)}
${ind(gaps, 6)}
      <div class="cl-hero">
         <p class="cl-kicker">subtitle_1</p>
         <div class="cl-closed">
            <h1 class="cl-h1">title_1</h1>
            <p class="cl-lead">txt_1</p>
            <label for="cl-s1" class="cl-tap-btn">btn_txt_1</label>
         </div>
         <div class="cl-open">
            <h1 class="cl-h1">title_2</h1>
            <p class="cl-lead">txt_2</p>
         </div>
      </div>
      <div class="cl-tap">
         <div class="cl-a cl-handle"></div>
         <div class="cl-a cl-body"></div>
         <div class="cl-a cl-spout"></div>
      </div>
      <div class="cl-sec cl-sec0">
         <div class="cl-card cl-card1">
            <p class="cl-ck">subtitle_2</p>
            <p class="cl-big">title_3</p>
            <p class="cl-txt">txt_3</p>
         </div>
         <div class="cl-card cl-card2">
            <p class="cl-ck">subtitle_3</p>
            <p class="cl-brand">title_4</p>
            <div class="cl-top3">
               <p class="cl-ck">subtitle_4</p>
${[1, 2, 3].map(n => `               <div class="cl-item"><span class="cl-nr">${n}</span><span>txt_${n + 3}</span></div>`).join('\n')}
            </div>
         </div>
${ind(row(1), 9)}
      </div>
      <div class="cl-sec cl-sec1">
${ind(row(2), 9)}
      </div>
      <div class="cl-sec cl-sec2">
         <div class="cl-group3">
            <div class="cl-card cl-card-dark">
               <p class="cl-ck">subtitle_5</p>
               <p class="cl-fact">txt_7</p>
            </div>
            <div class="cl-card">
               <p class="cl-ck">subtitle_6</p>
               <p class="cl-big cl-big-ink">title_5</p>
               <p class="cl-txt">txt_8</p>
            </div>
         </div>
${ind(row(3), 9)}
      </div>
      <div class="cl-sec cl-sec3"></div>
      <div class="cl-bath">
         <div class="cl-bath-box">
            <div class="cl-a cl-btap"></div>
            <div class="cl-a cl-bspout"></div>
            <div class="cl-a cl-stream"></div>
            <div class="cl-a cl-rim"></div>
            <div class="cl-a cl-tub"></div>
            <div class="cl-a cl-foot1"></div>
            <div class="cl-a cl-foot2"></div>
         </div>
      </div>
      <div class="cl-msg">
         <div class="cl-mk">
            <p class="cl-ck cl-mk-start">subtitle_7</p>
            <p class="cl-ck cl-mk-end">subtitle_8</p>
         </div>
         <h2 class="cl-h2">title_6</h2>
         <p class="cl-thanks">txt_9</p>
         <p class="cl-wish">txt_10</p>
      </div>
   </div>
</div>
<!--<![endif]-->`;

// fallback: the end state as the technique board says ("Gmail en Outlook zien de leiding direct blauw, zonder
// verstoppingen, met de straal in het bad"), in the simple layout: the pipe as a blue column on the left
const fbCard = (inner, dark) => `<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="${dark ? C.dark : C.card}" style="margin: 0 0 20px 0;">
   <tr>
      <td align="left" class="cl-fb-card" style="padding: 32px; word-wrap: break-word; overflow-wrap: break-word;">
${ind(inner, 9)}
      </td>
   </tr>
</table>`;
const ck = (t, dark) => `<p style="margin: 0; ${f(13, 19, ' letter-spacing: 0.24em; text-transform: uppercase;')} color: ${dark ? C.soft : C.grey};">${t}</p>`;
const fbItem = n => `<table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin: 12px 0 0 0;"><tr>
   <td width="36" height="36" align="center" valign="middle" bgcolor="${C.dark}" style="width: 36px; height: 36px; border-radius: 18px; ${f(16, 23)} color: ${C.darkTxt};">${n}</td>
   <td style="padding: 0 0 0 16px; ${f(18, 26, ' font-weight: 300;')} color: ${C.ink};">txt_${n + 3}</td>
</tr></table>`;
const fbCards = [
  fbCard(`${ck('subtitle_2')}\n<p style="margin: 8px 0 0 0; ${f(72, 72, ' font-weight: 300;')} color: ${C.blue};" class="cl-big">title_3</p>\n<p style="margin: 8px 0 0 0; ${f(18, 26, ' font-weight: 300;')} color: ${C.ink};">txt_3</p>`),
  fbCard(`${ck('subtitle_3')}\n<p style="margin: 6px 0 0 0; ${f(38, 42, ' font-weight: 300;')} color: ${C.blue};" class="cl-brand">title_4</p>\n<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 18px 0 0 0;"><tr><td style="padding: 18px 0 0 0; border-top: 1px solid ${C.line};">\n${ind(ck('subtitle_4') + '\n' + [1, 2, 3].map(fbItem).join('\n'), 3)}\n</td></tr></table>`),
  fbCard(`${ck('subtitle_5', true)}\n<p style="margin: 10px 0 0 0; ${f(19, 28.5, ' font-weight: 300;')} color: ${C.darkTxt};">txt_7</p>`, true),
  fbCard(`${ck('subtitle_6')}\n<p style="margin: 8px 0 0 0; ${f(64, 64, ' font-weight: 300;')} color: ${C.ink};" class="cl-big">title_5</p>\n<p style="margin: 8px 0 0 0; ${f(18, 26, ' font-weight: 300;')} color: ${C.ink};">txt_8</p>`),
].join('\n');
const fallback = `<!-- fallback: the pipe blue, no clogs, the stream in the bath (artifact), in the simple layout with the pipe on the left;
     the hero shows the open state, the message the end kicker -->
<div class="cl-fallback">
   <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="${C.wall}">
      <tr>
         <td align="left" class="cl-fb-pad" style="padding: 56px 60px 0 60px; background-color: ${C.wall}; background-image: ${grid}; word-wrap: break-word; overflow-wrap: break-word;">
            <p style="margin: 0; ${f(13, 19, ' letter-spacing: 0.3em; text-transform: uppercase;')} color: ${C.grey};">subtitle_1</p>
            <h1 class="cl-h1" style="margin: 16px 0 0 0; ${f(40, 46, ' font-weight: 300;')} color: ${C.ink};">title_2</h1>
            <p style="margin: 18px 0 0 0; ${f(17, 25.5, ' font-weight: 300;')} color: ${C.grey};">txt_2</p>
            <!-- the tap and the blue pipe down the left, the cards next to it -->
            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 32px 0 0 0;">
               <tr>
                  <td colspan="3" width="40" valign="top" style="width: 40px; font-size: 0; line-height: 0;">
                     <table role="presentation" width="40" border="0" cellspacing="0" cellpadding="0" bgcolor="${C.black}" style="width: 40px; border-radius: 20px;"><tr><td height="40" style="height: 40px; font-size: 0; line-height: 0;">&nbsp;</td></tr></table>
                  </td>
                  <td>&nbsp;</td>
               </tr>
               <tr>
                  <!-- the pipe: three cells in this row, so the blue one is as tall as the cards next to it -->
                  <td width="16" style="width: 16px; font-size: 0; line-height: 0;">&nbsp;</td>
                  <td width="8" bgcolor="${C.blue}" style="width: 8px; background-color: ${C.blue}; font-size: 0; line-height: 0;">&nbsp;</td>
                  <td width="16" style="width: 16px; font-size: 0; line-height: 0;">&nbsp;</td>
                  <td valign="top" style="padding: 20px 0 0 16px;">
${ind(fbCards, 21)}
                  </td>
               </tr>
            </table>
            <!-- the bath with the stream -->
            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 8px 0 0 0;">
               <tr>
                  <td align="center" style="font-size: 0; line-height: 0;">
                     <table role="presentation" width="112" border="0" cellspacing="0" cellpadding="0" bgcolor="${C.black}" style="width: 112px; border-radius: 10px;"><tr><td height="20" style="height: 20px; font-size: 0; line-height: 0;">&nbsp;</td></tr></table>
                     <table role="presentation" width="8" border="0" cellspacing="0" cellpadding="0" bgcolor="${C.blue}" style="width: 8px;"><tr><td height="80" style="height: 80px; font-size: 0; line-height: 0;">&nbsp;</td></tr></table>
                     <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="${C.bath}" style="max-width: 348px; border-radius: 6px 6px 70px 70px; border-top: 18px solid ${C.rim};"><tr><td height="102" style="height: 102px; font-size: 0; line-height: 0;">&nbsp;</td></tr></table>
                  </td>
               </tr>
            </table>
            <!-- the message -->
            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="${C.card}" style="margin: 40px 0 0 0;">
               <tr>
                  <td align="center" class="cl-fb-card" style="padding: 44px 40px; word-wrap: break-word; overflow-wrap: break-word;">
                     ${ck('subtitle_8')}
                     <h2 class="cl-h2" style="margin: 18px 0 0 0; ${f(32, 40, ' font-weight: 300;')} color: ${C.ink};">title_6</h2>
                     <p style="margin: 18px 0 0 0; ${f(20, 30, ' font-weight: 500;')} color: ${C.ink};">txt_9</p>
                     <p style="margin: 18px 0 0 0; ${f(17, 27.2, ' font-weight: 300;')} color: ${C.ink};">txt_10</p>
                  </td>
               </tr>
            </table>
            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td height="40" style="height: 40px; font-size: 0; line-height: 0;">&nbsp;</td></tr></table>
         </td>
      </tr>
   </table>
</div>`;

const body = `<!-- start ${NAME} -->
<!-- "De lijn van het jaar" (Claude Design artifact "Coram eindejaarsmail", concept 4): open the tap and follow the water
     down the pipe past the year's cards; three clogs to clear on the way (four checkboxes in a row), then the stream
     runs into the bath. Desktop: the board's drawing; mobile: a simpler pipe along the left. Fallback (Gmail, Outlook,
     Samsung): the pipe blue, no clogs, the stream in the bath.
     Geometry and font sizes are the artifact's; colours and fonts are token values here (the Coram mail uses the
     artifact's). Built with interactive_artifact/coram/concept_4_lijn_van_het_jaar/build/gen_leiding.js: change the
     generator, not this file. -->
@@CSS@@
<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" align="center" bgcolor="${C.wall}">
   <tr>
      <td align="center" style="padding: 0;">
         <!--[if !mso]><!-->
         <input type="checkbox" class="cl-detect" checked style="display: none !important; mso-hide: all;">
${S.map(n => `         <input type="checkbox" id="cl-s${n}" class="cl-s${n}" style="display: none !important; mso-hide: all;">`).join('\n')}
         <!--<![endif]-->
${ind(fallback, 9)}
${ind(interactive, 9)}
      </td>
   </tr>
</table>
<!-- end ${NAME} -->
`;

return { name: NAME, css, block: body.replace('@@CSS@@', css), bodyWithoutCss: body.replace('@@CSS@@\n', '') };
}

module.exports = { build, DEFAULT, NAME, PIPE, GAPS, CLOGS };

if (require.main === module) {
  const { block } = build(DEFAULT);
  fs.writeFileSync(OUT, block.replace(/\n/g, '\r\n'));
  console.log('written', OUT, Buffer.byteLength(block), 'bytes');
}
