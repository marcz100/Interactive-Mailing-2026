// "Van boorgat tot badkamer" generator, a one-on-one email translation of the artifact board "Van boorgat tot badkamer
// (klikbaar)" (Main.dc.html, 700 x 1000) and "De momenten, techniek en gewicht" (WrappedInfo.dc.html). Token-driven:
// `node gen_badkamer.js` writes the repo block with default tokens and slot names; build(T) is reused by
// build_mail.js for the Coram mail with the artifact's values and copy.
//   node gen_badkamer.js      (then run assemble.ps1 in HTML/ to rebuild the all-blocks file)
const fs = require('fs'), path = require('path');
const NAME = 'hotspot_1_col_row_1_icon_badge_row_2_subtitle_title_row_3_icon_x5_row_4_subtitle_txt_btn';
// build/ -> concept_1_van_boorgat_tot_badkamer -> coram -> interactive_artifact -> HTML
const OUT = path.resolve(__dirname, '../../../../blocks/hotspot', `${NAME}.html`);

// default tokens (README token table); geometry and font sizes are the artifact's own
const DEFAULT = {
  font: 'Roboto,Arial,Helvetica,Verdana,sans-serif',
  c: {
    bg: '#ffffff', ink: '#050033', grey: '#4d4d4d', pill: '#050033', pillTxt: '#ffffff', wall: '#efefef', wallLine: 'rgba(68,68,68,0.25)',
    hole: '#444444', blue: '#9980FF', blueRing: 'rgba(153,128,255,0.18)', white: '#ffffff', black: '#050033', black2: '#444444',
    basin: '#fefefe', mirror: '#9E9E9E', shelf: 'rgba(230,230,230,0.95)', towel: '#e3fc5e', panel: '#050033', panelTxt: '#ffffff',
    panelSoft: '#e6e6e6', photo: '#e6e6e6', photoTxt: '#444444',
  },
};

// the scene: percentages of 620 x 470
const pa = (v, of) => +(v / of * 100).toFixed(4) + '%';
const sx = v => pa(v, 620), sy = v => pa(v, 470);
const sbox = (l, t, w, h) => `left: ${sx(l)}; top: ${sy(t)}; width: ${sx(w)}; height: ${sy(h)};`;

// the five products: key, holes [x, y], the plus button's centre (board: left/top + 24)
const P = [
  { k: 'haak', holes: [[76, 70]], btn: [79, 106] },
  { k: 'plank', holes: [[52, 232], [162, 232]], btn: [110, 235] },
  { k: 'spiegel', holes: [[296, 70], [318, 70]], btn: [310, 175] },
  { k: 'zeep', holes: [[455, 252]], btn: [458, 290] },
  { k: 'rek', holes: [[504, 122], [590, 122]], btn: [550, 125] },
];
const N = [1, 2, 3, 4, 5];
const ALL = N.map(n => `.cb-c${n}:checked`).join(' ~ ');
const ANY = sel => N.map(n => `   .cb-c${n}:checked ~ .cb-interactive ${sel}`).join(',\n');

function build(T) {
const C = T.c, F = T.font;

const css = `<style type="text/css">
   /* Van boorgat tot badkamer (artifact "Van boorgat tot badkamer"): a bare tiled wall with five drill holes. Each
      plus is the label of its own checkbox: tapping it mounts a Coram product there and shows its thank-you or fact in
      the panel below (the newest on top). With all five mounted the headline changes and the panel shows the finale
      with "Opnieuw" (the form's reset). Order: inputs, fallback, interactive. Interactive only in WebKit clients that
      support :checked (pre-checked .cb-detect); everything else keeps the fallback: the complete bathroom with all the
      texts below it. */
   @media screen and (-webkit-min-device-pixel-ratio: 0) {
      .cb-detect:checked ~ .cb-fallback {
         display: none !important;
         max-height: 0 !important;
         overflow: hidden !important;
      }

      .cb-detect:checked ~ .cb-interactive {
         display: block !important;
         max-height: none !important;
         overflow: visible !important;
      }
   }

   /* the board: 700 x 1000, padding 32 40 40, rows 20 apart */
   .cb-interactive .cb-wrap {
      padding: 32px 40px 40px 40px;
      background-color: ${C.bg};
      text-align: left;
   }

   .cb-interactive .cb-top {
      display: -webkit-flex;
      display: flex;
      -webkit-justify-content: space-between;
      justify-content: space-between;
      -webkit-align-items: center;
      align-items: center;
   }

   .cb-interactive .cb-logo {
      font-family: ${F};
      font-size: 24px;
      line-height: 35px;
      font-weight: 600;
      letter-spacing: 0.38em;
      color: ${C.ink};
   }

   /* the counter pill: "n van 5 gemonteerd", n from a CSS counter (one empty span per product) */
   .cb-interactive .cb-pill {
      padding: 8px 16px;
      border-radius: 999px;
      background-color: ${C.pill};
      counter-reset: cb-n 0;
      font-family: ${F};
      font-size: 15px;
      line-height: 22px;
      white-space: nowrap;
      color: ${C.pillTxt};
   }

${N.map(n => `   .cb-c${n}:checked ~ .cb-interactive .cb-k${n}`).join(',\n')} {
      counter-increment: cb-n 1;
   }

   .cb-interactive .cb-count:before {
      content: counter(cb-n);
   }

   .cb-interactive .cb-kicker {
      margin: 20px 0 0 0;
      font-family: ${F};
      font-size: 13px;
      line-height: 19px;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: ${C.grey};
   }

   /* the two headlines share one grid cell; the second shows when all five hang */
   .cb-interactive .cb-heads {
      display: -ms-grid;
      display: grid;
      margin: 8px 0 0 0;
   }

   .cb-interactive .cb-h1 {
      grid-area: 1 / 1;
      margin: 0;
      font-family: ${F};
      font-size: 36px;
      line-height: 41.4px;
      font-weight: 300;
      color: ${C.ink};
   }

   .cb-interactive .cb-h1-done,
   ${ALL} ~ .cb-interactive .cb-h1-start {
      visibility: hidden;
   }

   ${ALL} ~ .cb-interactive .cb-h1-done {
      visibility: visible;
   }

   /* the scene: 620 x 470 (75.8065% = 470 / 620), the tiled wall with 78px tiles */
   .cb-interactive .cb-scene {
      position: relative;
      height: 0;
      margin: 20px 0 0 0;
      padding-bottom: 75.8065%;
      overflow: hidden;
      background-color: ${C.wall};
      background-image: repeating-linear-gradient(0deg, ${C.wallLine} 0 1px, transparent 1px 78px), repeating-linear-gradient(90deg, ${C.wallLine} 0 1px, transparent 1px 78px);
   }

   .cb-interactive .cb-a {
      position: absolute;
      display: block;
      box-sizing: border-box;
   }

   /* furniture and basin are there already */
   .cb-interactive .cb-cabinet {
      ${sbox(130, 400, 360, 70)}
      background-color: ${C.black};
   }

   .cb-interactive .cb-basin {
      ${sbox(210, 354, 200, 48)}
      border-radius: 8px 8px 4px 4px;
      background-color: ${C.basin};
      box-shadow: inset 0 -10px 14px rgba(0,0,0,0.08), 0 6px 10px rgba(0,0,0,0.15);
   }

   /* the drill holes (6px) and the plus buttons (48px, centred on the board's buttons) */
   .cb-interactive .cb-hole {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: ${C.hole};
   }

   .cb-interactive .cb-plus {
      display: -webkit-flex;
      display: flex;
      -webkit-align-items: center;
      align-items: center;
      -webkit-justify-content: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      margin: -24px 0 0 -24px;
      border: 2px solid ${C.blue};
      border-radius: 50%;
      background-color: ${C.white};
      box-shadow: 0 0 0 7px ${C.blueRing};
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
   }

   /* the products, hidden until mounted */
   .cb-interactive .cb-on {
      display: none;
   }

${N.map(n => `   .cb-c${n}:checked ~ .cb-interactive .cb-on${n}`).join(',\n')} {
      display: block;
   }

${N.map(n => `   .cb-c${n}:checked ~ .cb-interactive .cb-off${n}`).join(',\n')} {
      display: none;
   }

   .cb-interactive .cb-dark {
      background-color: ${C.black};
   }

   /* 1 haakje */
   .cb-interactive .cb-haak-1 { ${sbox(68, 62, 22, 22)} border-radius: 4px; }
   .cb-interactive .cb-haak-2 { ${sbox(76, 76, 6, 26)} border-radius: 3px; }
   .cb-interactive .cb-haak-3 { ${sbox(76, 96, 16, 6)} border-radius: 3px; }

   /* 2 planchet */
   .cb-interactive .cb-plank-1 { ${sbox(66, 196, 20, 40)} border-radius: 4px; }
   .cb-interactive .cb-plank-2 {
      ${sbox(132, 206, 14, 30)}
      border-radius: 7px 7px 3px 3px;
      background-color: ${C.basin};
      box-shadow: inset 0 0 0 1px rgba(0,0,0,0.12);
   }
   .cb-interactive .cb-plank-3 {
      ${sbox(44, 236, 132, 8)}
      border-radius: 2px;
      background-color: ${C.shelf};
      box-shadow: 0 3px 6px rgba(0,0,0,0.15);
   }
   .cb-interactive .cb-plank-4 { ${sbox(46, 244, 10, 10)} }
   .cb-interactive .cb-plank-5 { ${sbox(164, 244, 10, 10)} }

   /* 3 spiegel: 160 x 240 frame, 8px padding, the glass 144 x 224 with two light streaks */
   .cb-interactive .cb-spiegel {
      ${sbox(230, 50, 160, 240)}
      padding: 1.2903%;
      border-radius: 20px;
      background-color: ${C.black};
      box-shadow: 0 14px 24px rgba(40,30,20,0.3);
   }

   .cb-interactive .cb-glass {
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: 13px;
      overflow: hidden;
      background-color: ${C.mirror};
   }

   .cb-interactive .cb-streak-1,
   .cb-interactive .cb-streak-2 {
      top: -8.9286%;
      height: 142.8571%;
      -webkit-transform: rotate(25deg);
      transform: rotate(25deg);
   }

   .cb-interactive .cb-streak-1 {
      left: -20.8333%;
      width: 34.7222%;
      background-color: rgba(255,255,255,0.14);
   }

   .cb-interactive .cb-streak-2 {
      left: 34.7222%;
      width: 12.5%;
      background-color: rgba(255,255,255,0.10);
   }

   /* 4 zeepdispenser */
   .cb-interactive .cb-zeep-1 { ${sbox(446, 244, 26, 16)} border-radius: 3px; }
   .cb-interactive .cb-zeep-2 { ${sbox(452, 258, 14, 10)} }
   .cb-interactive .cb-zeep-3 {
      ${sbox(442, 266, 34, 64)}
      border-radius: 8px;
      background-color: ${C.black2};
      box-shadow: inset 4px 0 0 rgba(255,255,255,0.08), 0 6px 10px rgba(0,0,0,0.2);
   }

   /* 5 handdoekrek */
   .cb-interactive .cb-rek-1 { ${sbox(496, 114, 22, 22)} border-radius: 4px; }
   .cb-interactive .cb-rek-2 { ${sbox(582, 114, 22, 22)} border-radius: 4px; }
   .cb-interactive .cb-rek-3 { ${sbox(506, 120, 88, 10)} border-radius: 5px; }
   .cb-interactive .cb-rek-4 {
      ${sbox(516, 128, 68, 130)}
      border-radius: 0 0 4px 4px;
      background-color: ${C.towel};
      background-image: repeating-linear-gradient(90deg, rgba(255,255,255,0.12) 0 2px, transparent 2px 6px);
      box-shadow: 0 10px 16px rgba(40,30,20,0.2);
   }

   /* the panel: 292 high (1000 - 32 - 40 - the rows above), padding 24 28. Its texts share one grid cell on the
      panel's background: the start text, one per product (the newest on top: each starts the cb-stack z-index
      countdown when mounted) and the finale (above everything when all five hang). */
   .cb-interactive .cb-panel {
      min-height: 292px;
      margin: 20px 0 0 0;
      padding: 24px 28px;
      box-sizing: border-box;
      background-color: ${C.panel};
   }

   .cb-interactive .cb-msgs {
      display: -ms-grid;
      display: grid;
   }

   .cb-interactive .cb-msg {
      position: relative;
      grid-area: 1 / 1;
      visibility: hidden;
      background-color: ${C.panel};
   }

   .cb-interactive .cb-msg0 {
      visibility: visible;
   }

${ANY('.cb-msg0')} {
      visibility: hidden;
   }

${N.map(n => `   .cb-c${n}:checked ~ .cb-interactive .cb-msg${n}`).join(',\n')} {
      visibility: visible;
      -webkit-animation: cb-stack 100000s linear forwards;
      animation: cb-stack 100000s linear forwards;
   }

   ${ALL} ~ .cb-interactive .cb-msg6 {
      visibility: visible;
      z-index: 20000000;
   }

   @-webkit-keyframes cb-stack {
      from {
         z-index: 10000000;
      }

      to {
         z-index: 1;
      }
   }

   @keyframes cb-stack {
      from {
         z-index: 10000000;
      }

      to {
         z-index: 1;
      }
   }

   .cb-interactive .cb-msg-k {
      margin: 0;
      font-family: ${F};
      font-size: 13px;
      line-height: 19px;
      letter-spacing: 0.24em;
      text-transform: uppercase;
      color: ${C.panelSoft};
   }

   .cb-interactive .cb-msg-t {
      margin: 10px 0 0 0;
      font-family: ${F};
      font-size: 20px;
      line-height: 29px;
      font-weight: 300;
      color: ${C.panelTxt};
   }

   /* the signature and "Opnieuw", only when all five hang */
   .cb-interactive .cb-done {
      display: none;
      -webkit-justify-content: space-between;
      justify-content: space-between;
      -webkit-align-items: center;
      align-items: center;
      margin: 10px 0 0 0;
   }

   ${ALL} ~ .cb-interactive .cb-done {
      display: -webkit-flex;
      display: flex;
   }

   .cb-interactive .cb-sign {
      margin: 0 16px 0 0;
      font-family: ${F};
      font-size: 16px;
      line-height: 23px;
      font-weight: 300;
      color: ${C.panelSoft};
   }

   .cb-interactive .cb-reset {
      height: 44px;
      padding: 0;
      border: 0;
      background-color: transparent;
      font-family: ${F};
      font-size: 15px;
      line-height: 22px;
      text-decoration: underline;
      color: ${C.panelTxt};
      cursor: pointer;
      -webkit-appearance: none;
   }

   @media only screen and (max-width: 600px) {
      .cb-interactive .cb-wrap {
         padding: 24px 16px 24px 16px !important;
      }

      .cb-interactive .cb-logo {
         font-size: 20px !important;
         line-height: 29px !important;
      }

      .cb-interactive .cb-pill {
         padding: 6px 12px !important;
         font-size: 13px !important;
         line-height: 19px !important;
      }

      .cb-h1 {
         font-size: 28px !important;
         line-height: 33px !important;
      }

      .cb-interactive .cb-plus {
         width: 36px !important;
         height: 36px !important;
         margin: -18px 0 0 -18px !important;
         box-shadow: 0 0 0 5px ${C.blueRing} !important;
      }

      .cb-interactive .cb-plus svg {
         width: 16px !important;
         height: 16px !important;
      }

      .cb-interactive .cb-spiegel {
         border-radius: 12px !important;
      }

      .cb-interactive .cb-glass {
         border-radius: 8px !important;
      }

      .cb-interactive .cb-panel {
         min-height: 0 !important;
         padding: 20px !important;
      }

      .cb-msg-t {
         font-size: 17px !important;
         line-height: 25px !important;
      }

      .cb-interactive .cb-done {
         -webkit-flex-direction: column !important;
         flex-direction: column !important;
         -webkit-align-items: flex-start !important;
         align-items: flex-start !important;
      }

      .cb-fb-wrap {
         padding: 24px 16px !important;
      }

      .cb-fb-panel {
         padding: 20px !important;
      }
   }

   @media only screen and (max-width: 400px) {
      .cb-h1 {
         font-size: 24px !important;
         line-height: 29px !important;
      }

      .cb-interactive .cb-logo {
         font-size: 18px !important;
         line-height: 26px !important;
      }
   }

   /* Outlook.com / new Outlook: class names get an x_ prefix */
   [class~="x_cb-interactive"],
   [class~="x_cb-detect"]:checked ~ [class~="x_cb-interactive"] {
      display: none !important;
      max-height: 0 !important;
      overflow: hidden !important;
   }

   [class~="x_cb-fallback"],
   [class~="x_cb-detect"]:checked ~ [class~="x_cb-fallback"] {
      display: block !important;
      max-height: none !important;
      overflow: visible !important;
   }

   /* Samsung Mail: the message is wrapped in #MessageViewBody (the id outranks the activation selector) */
   #MessageViewBody .cb-interactive {
      display: none !important;
      max-height: 0 !important;
      overflow: hidden !important;
   }

   #MessageViewBody .cb-fallback {
      display: block !important;
      max-height: none !important;
      overflow: visible !important;
   }
</style>
<style type="text/css">
   /* Outlook apps: back to the fallback (separate style tag: the \\0 hack breaks the rest of a style tag) */
   .cb-interactive\\0,
   .cb-detect:checked ~ .cb-interactive\\0 {
      display: none !important;
      max-height: 0 !important;
      overflow: hidden !important;
   }

   .cb-fallback\\0,
   .cb-detect:checked ~ .cb-fallback\\0 {
      display: block !important;
      max-height: none !important;
      overflow: visible !important;
   }
</style>`;

// ---------------- markup ----------------
const ind = (s, n) => s.split('\n').map(l => l ? ' '.repeat(n) + l : l).join('\n');
const f = (size, lh, extra = '') => `font-family: ${F}; font-size: ${size}px; line-height: ${lh}px;${extra}`;
const plusIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${C.blue}" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"></path></svg>`;
const div = cls => `<div class="cb-a ${cls}"></div>`;
const products = {
  haak: [div('cb-dark cb-haak-1'), div('cb-dark cb-haak-2'), div('cb-dark cb-haak-3')],
  plank: [div('cb-dark cb-plank-1'), div('cb-plank-2'), div('cb-plank-3'), div('cb-dark cb-plank-4'), div('cb-dark cb-plank-5')],
  spiegel: [`<div class="cb-a cb-spiegel"><div class="cb-glass"><div class="cb-a cb-streak-1"></div><div class="cb-a cb-streak-2"></div></div></div>`],
  zeep: [div('cb-dark cb-zeep-1'), div('cb-dark cb-zeep-2'), div('cb-zeep-3')],
  rek: [div('cb-dark cb-rek-1'), div('cb-dark cb-rek-2'), div('cb-dark cb-rek-3'), div('cb-rek-4')],
};
const scene = P.map((p, i) => {
  const n = i + 1;
  const holes = p.holes.map(([x, y]) => `<div class="cb-a cb-hole" style="left: ${sx(x)}; top: ${sy(y)};"></div>`).join('\n');
  return `<!-- ${n} ${p.k}: holes and plus until mounted, then the product -->
<div class="cb-off${n}">
${ind(holes, 3)}
   <label for="cb-c${n}" class="cb-a cb-plus" style="left: ${sx(p.btn[0])}; top: ${sy(p.btn[1])};" title="label_${n + 2}">${plusIcon}</label>
</div>
<div class="cb-on cb-on${n}">
${ind(products[p.k].join('\n'), 3)}
</div>`;
}).join('\n');

// the panel's texts: start (0), one per product (1-5, subtitle_n+1 / txt_n+1), finale (6)
const msgs = [['subtitle_7', 'txt_7'], ...N.map(n => [`subtitle_${n + 1}`, `txt_${n + 1}`]), ['subtitle_8', 'txt_8']]
  .map(([k, t], i) => `<div class="cb-msg cb-msg${i}">
   <p class="cb-msg-k">${k}</p>
   <p class="cb-msg-t">${t}</p>
</div>`).join('\n');

const interactive = `<!--[if !mso]><!-->
<div class="cb-interactive" style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">
   <div class="cb-wrap">
      <div class="cb-top">
         <span class="cb-logo">label_1</span>
         <span class="cb-pill">${N.map(n => `<span class="cb-k${n}"></span>`).join('')}<span class="cb-count"></span> txt_1</span>
      </div>
      <p class="cb-kicker">subtitle_1</p>
      <div class="cb-heads">
         <h1 class="cb-h1 cb-h1-start">title_1</h1>
         <h1 class="cb-h1 cb-h1-done">title_2</h1>
      </div>
      <div class="cb-scene">
         <div class="cb-a cb-cabinet"></div>
         <div class="cb-a cb-basin"></div>
${ind(scene, 9)}
      </div>
      <div class="cb-panel">
         <div class="cb-msgs">
${ind(msgs, 12)}
         </div>
         <div class="cb-done">
            <p class="cb-sign">txt_9</p>
            <input type="reset" class="cb-reset" value="label_2">
         </div>
      </div>
   </div>
</div>
<!--<![endif]-->`;

// fallback: the complete bathroom (an image: the artifact wants real Coram product photos) and every text below it
const fbMsg = (k, t, first) => `<p style="margin: ${first ? '0' : '24px 0 0 0'}; ${f(13, 19, ' letter-spacing: 0.24em; text-transform: uppercase;')} color: ${C.panelSoft};">${k}</p>
<p style="margin: 10px 0 0 0; ${f(20, 29, ' font-weight: 300;')} color: ${C.panelTxt};" class="cb-msg-t">${t}</p>`;
const fallback = `<!-- fallback: "Gmail en Outlook zien de complete badkamer met alle teksten eronder" (artifact): the complete
     bathroom, the five texts and the finale -->
<div class="cb-fallback">
   <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="${C.bg}">
      <tr>
         <td align="left" class="cb-fb-wrap" style="padding: 32px 40px 40px 40px; word-wrap: break-word; overflow-wrap: break-word;">
            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
               <tr>
                  <td align="left" valign="middle" style="${f(24, 35, ' font-weight: 600; letter-spacing: 0.38em;')} color: ${C.ink};" class="cb-logo">label_1</td>
                  <td align="right" valign="middle">
                     <span style="display: inline-block; padding: 8px 16px; border-radius: 999px; background-color: ${C.pill}; ${f(15, 22)} white-space: nowrap; color: ${C.pillTxt};">5 txt_1</span>
                  </td>
               </tr>
            </table>
            <p style="margin: 20px 0 0 0; ${f(13, 19, ' letter-spacing: 0.3em; text-transform: uppercase;')} color: ${C.grey};">subtitle_1</p>
            <h1 class="cb-h1" style="margin: 8px 0 0 0; ${f(36, 41, ' font-weight: 300;')} color: ${C.ink};">title_2</h1>
            <!-- the complete bathroom: placeholder until the image (620 x 470, Coram product photos) arrives; replace by
                 <img width="620" style="display: block; width: 100%; max-width: 620px; height: auto;" alt="..."> -->
            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 20px 0 0 0;">
               <tr>
                  <td align="center" valign="middle" height="300" bgcolor="${C.photo}" style="height: 300px; padding: 12px; ${f(15, 22)} color: ${C.photoTxt};">img_alt_1</td>
               </tr>
            </table>
            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="${C.panel}" style="margin: 20px 0 0 0;">
               <tr>
                  <td align="left" class="cb-fb-panel" style="padding: 24px 28px;">
${ind(N.map(n => fbMsg(`subtitle_${n + 1}`, `txt_${n + 1}`, n === 1)).join('\n') + '\n' + fbMsg('subtitle_8', 'txt_8') +
  `\n<p style="margin: 16px 0 0 0; ${f(16, 23, ' font-weight: 300;')} color: ${C.panelSoft};">txt_9</p>`, 21)}
                  </td>
               </tr>
            </table>
         </td>
      </tr>
   </table>
</div>`;

const body = `<!-- start ${NAME} -->
<!-- "Van boorgat tot badkamer" (Claude Design artifact "Coram eindejaarsmail", concept 1): a bare tiled wall with five
     drill holes. Each plus mounts a product (checkbox per product) and shows its thank-you or fact; with all five the
     headline and the finale change. Fallback (Gmail, Outlook, Samsung): the complete bathroom and all texts.
     Geometry and font sizes are the artifact's; colours and fonts are token values here (the Coram mail uses the
     artifact's). Built with interactive_artifact/coram/concept_1_van_boorgat_tot_badkamer/build/gen_badkamer.js:
     change the generator, not this file. -->
@@CSS@@
<!-- the form makes "Opnieuw" (input type=reset) work -->
<form action="#" style="margin: 0;">
   <!--[if !mso]><!-->
   <input type="checkbox" class="cb-detect" checked style="display: none !important; mso-hide: all;">
${N.map(n => `   <input type="checkbox" id="cb-c${n}" class="cb-c${n}" style="display: none !important; mso-hide: all;">`).join('\n')}
   <!--<![endif]-->
${ind(fallback, 3)}
${ind(interactive, 3)}
</form>
<!-- end ${NAME} -->
`;

return { name: NAME, css, block: body.replace('@@CSS@@', css), bodyWithoutCss: body.replace('@@CSS@@\n', '') };
}

module.exports = { build, DEFAULT, NAME };

if (require.main === module) {
  const { block } = build(DEFAULT);
  fs.writeFileSync(OUT, block.replace(/\n/g, '\r\n'));
  console.log('written', OUT, Buffer.byteLength(block), 'bytes');
}
