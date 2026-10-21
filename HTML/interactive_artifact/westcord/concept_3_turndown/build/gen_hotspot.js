// Hotspot "turndown" generator, a one-on-one email translation of the artifact board "Het kussenchocolaatje".
// Geometry comes from the artifact canvas (700 x 1000; the pillow stage is the 700 x 680 area under the 190px band)
// and is written as percentages, so the stage scales with the mail width. Token-driven: `node gen_hotspot.js` writes
// the repo block with default tokens; build(T) is reused for the WestCord campaign mail with the artifact's values.
//   node gen_hotspot.js      (then run assemble.ps1 in HTML/ to rebuild the all-blocks file)
const fs = require('fs'), path = require('path');
const NAME = 'hotspot_1_col_row_1_title_txt_row_2_subtitle_txt_x4_txt_title_row_3_btn_x2';
// build/ -> concept_3_turndown -> westcord -> interactive_artifact -> HTML
const OUT = path.resolve(__dirname, '../../../../blocks/hotspot', `${NAME}.html`);

// default tokens (README token table, default scope); geometry radii use spacing tokens
const DEFAULT = {
  font: 'Roboto,Arial,Helvetica,Verdana,sans-serif', fontH: 'Roboto Slab,Arial,Helvetica,Verdana,sans-serif',
  outerClass: 'pml16 pmr16', outerPad: '0 24px 32px 24px', headerPad: '48px 48px 32px 48px',
  headerBg: '#050033', title: '#ffffff', intro: '#ffffff', stageBg: '#efefef', pillowBg: '#ffffff',
  pillowShadow: 'none', pillowLine: '#e6e6e6', pillowRadius: ['48px', '24px'], lineRadius: ['24px', '16px'],
  chocBg: '#050033', chocLine: '#444444', chocRadius: '4px',
  flaps: ['#9980FF', '#4d4d4d', '#9E9E9E', '#444444'], foldTB: '#e6e6e6', foldLR: '#efefef',
  sealBg: '#e3fc5e', sealBorder: '#ffffff', sealTxt: '#050033',
  accent: '#9980FF', txt: '#050033', wishLabel: '#e6e6e6', wishTxt: '#ffffff', wishYear: '#e3fc5e', status: '#050033',
  btnBg: '#e3fc5e', btnTxt: '#050033', resetLine: '#050033', radius: '4px',
  fs: { title: ['24px', '28px', '700'], intro: ['16px', '22px'], label: ['12px', '16px'], fact: ['16px', '22px'], factSide: ['16px', '22px'],
        wishLabel: ['12px', '16px'], wishTxt: ['16px', '22px'], year: ['24px', '28px', '700'], seal: '20px', status: ['16px', '22px'],
        btn: ['20px', '700', 48, 240], mTitle: ['22px', '26px'], mYear: ['20px', '24px'], sYear: ['18px', '22px'] },
};

// artifact canvas -> percentages of the 700 x 680 stage
const px = v => +(v / 700 * 100).toFixed(4) + '%';
const py = v => +(v / 680 * 100).toFixed(4) + '%';
const box = (l, t, w, h) => `left: ${px(l)}; top: ${py(t)}; width: ${px(w)}; height: ${py(h)};`;

function build(T) {
const F = T.fs, C = [1, 2, 3, 4];
const ALL = '.hs-c1:checked ~ .hs-c2:checked ~ .hs-c3:checked ~ .hs-c4:checked ~ .hs-interactive';
const statusRules = [0, 1, 2, 3, 4].map(k => {
  const sels = [];
  for (let mask = 0; mask < 16; mask++) {
    const bits = C.map((c, i) => (mask >> i) & 1);
    if (bits.reduce((a, b) => a + b, 0) !== k) continue;
    sels.push('   ' + C.map((c, i) => `.hs-c${c}:${bits[i] ? 'checked' : 'not(:checked)'}`).join(' ~ ') + ` ~ .hs-interactive .hs-st-${k}`);
  }
  return sels.join(',\n') + ' {\n      display: block;\n   }';
}).join('\n\n');

// closed flaps cover the chocolate (220,210 260x260); open folds sit outside it; facts around it
const flapClip = ['polygon(0 0, 100% 0, 50% 50%)', 'polygon(100% 0, 100% 100%, 50% 50%)', 'polygon(0 100%, 100% 100%, 50% 50%)', 'polygon(0 0, 50% 50%, 0 100%)'];
const fold = [[220, 160, 260, 50, 'polygon(0 100%, 100% 100%, 50% 0)', T.foldTB], [480, 210, 50, 260, 'polygon(0 0, 100% 50%, 0 100%)', T.foldLR],
              [220, 470, 260, 50, 'polygon(0 0, 100% 0, 50% 100%)', T.foldTB], [170, 210, 50, 260, 'polygon(100% 0, 0 50%, 100% 100%)', T.foldLR]];
// facts keep >= 16px from the pillow line (40..660 x 44..644) and >= 12px from the folds (tips at x 170 / 530)
const fact = [[170, 72, 360, 'center', F.fact], [542, 260, 102, 'left', F.factSide], [170, 530, 360, 'center', F.fact], [56, 260, 102, 'right', F.factSide]];

const css = `<style type="text/css">
   /* Turndown hotspot (artifact "Het kussenchocolaatje"): a chocolate on a pillow with four flaps. Each flap is a label
      for its own checkbox; tapping it folds the corner open and shows its text. When all four are open the wish
      appears on the chocolate with the buttons; "reset" wraps it up again. Order: inputs, fallback, interactive.
      Interactive only in WebKit clients that support :checked (pre-checked .hs-detect); everything else keeps the
      fallback (the all-open state, built in tables). Stage geometry = artifact canvas in % of 700 x 680. */
   @media screen and (-webkit-min-device-pixel-ratio: 0) {
      .hs-detect:checked ~ .hs-fallback {
         display: none !important;
         max-height: 0 !important;
         overflow: hidden !important;
      }

      .hs-detect:checked ~ .hs-interactive {
         display: block !important;
         max-height: none !important;
         overflow: visible !important;
      }
   }

   .hs-interactive .hs-stage {
      position: relative;
      background-color: ${T.stageBg};
   }

   /* 97.1429% = 680 / 700: the stage keeps the artifact's proportions at every width */
   .hs-interactive .hs-box {
      position: relative;
      height: 0;
      padding-bottom: 97.1429%;
   }

   .hs-interactive .hs-abs {
      position: absolute;
      box-sizing: border-box;
   }

   .hs-interactive .hs-pillow {
      ${box(20, 24, 660, 640)}
      border-radius: ${T.pillowRadius[0]};
      background-color: ${T.pillowBg};
      box-shadow: ${T.pillowShadow};
   }

   .hs-interactive .hs-pillow-line {
      ${box(40, 44, 620, 600)}
      border-radius: ${T.lineRadius[0]};
      border: 2px solid ${T.pillowLine};
   }

   .hs-interactive .hs-choc {
      ${box(220, 210, 260, 260)}
      border-radius: ${T.chocRadius};
      background-color: ${T.chocBg};
   }

   .hs-interactive .hs-choc-line {
      ${box(236, 226, 228, 228)}
      border: 2px solid ${T.chocLine};
   }

   /* the wish on the chocolate: only when all four flaps are open */
   .hs-interactive .hs-wish {
      ${box(220, 210, 260, 260)}
      display: none;
      -webkit-flex-direction: column;
      flex-direction: column;
      -webkit-align-items: center;
      align-items: center;
      -webkit-justify-content: center;
      justify-content: center;
      text-align: center;
   }

   .hs-interactive .hs-wish-label {
      display: block;
      margin: 0 0 4px 0;
      font-family: ${T.font};
      font-size: ${F.wishLabel[0]};
      line-height: ${F.wishLabel[1]};
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: ${T.wishLabel};
   }

   .hs-interactive .hs-wish-txt {
      display: block;
      max-width: 50%;
      margin: 0 auto 4px auto;
      font-family: ${T.font};
      font-size: ${F.wishTxt[0]};
      line-height: ${F.wishTxt[1]};
      color: ${T.wishTxt};
   }

   .hs-interactive .hs-wish-year {
      display: block;
      font-family: ${T.fontH};
      font-size: ${F.year[0]};
      line-height: ${F.year[1]};
      font-weight: ${F.year[2]};
      color: ${T.wishYear};
   }

   /* closed flaps: four triangles over the chocolate, each a label for its checkbox */
   .hs-interactive .hs-flap {
      ${box(220, 210, 260, 260)}
      display: block;
      cursor: pointer;
   }

${C.map(c => `   .hs-interactive .hs-flap-${c} {
      background-color: ${T.flaps[c - 1]};
      -webkit-clip-path: ${flapClip[c - 1]};
      clip-path: ${flapClip[c - 1]};
   }`).join('\n\n')}

   /* open flaps: folded back outside the chocolate; tapping them folds the corner shut again */
   .hs-interactive .hs-fold {
      display: none;
      cursor: pointer;
   }

${fold.map(([l, t, w, h, clip, bg], i) => `   .hs-interactive .hs-fold-${i + 1} {
      ${box(l, t, w, h)}
      background-color: ${bg};
      -webkit-clip-path: ${clip};
      clip-path: ${clip};
   }`).join('\n\n')}

   /* seal: visible until all four flaps are open */
   .hs-interactive .hs-seal {
      ${box(326, 316, 48, 48)}
      display: -webkit-flex;
      display: flex;
      -webkit-align-items: center;
      align-items: center;
      -webkit-justify-content: center;
      justify-content: center;
      border-radius: 50%;
      border: 3px solid ${T.sealBorder};
      background-color: ${T.sealBg};
      color: ${T.sealTxt};
      font-family: ${T.fontH};
      font-size: ${F.seal};
      pointer-events: none;
   }

   /* facts around the chocolate (desktop); below the stage on mobile */
   .hs-interactive .hs-fact {
      display: none;
      position: absolute;
   }

${fact.map(([l, t, w, align], i) => `   .hs-interactive .hs-fact-${i + 1} {
      left: ${px(l)};
      top: ${py(t)};
      width: ${px(w)};
      text-align: ${align};
   }`).join('\n\n')}

   .hs-interactive .hs-fact-label {
      display: block;
      margin: 0 0 4px 0;
      font-family: ${T.font};
      font-size: ${F.label[0]};
      line-height: ${F.label[1]};
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: ${T.accent};
   }

   .hs-interactive .hs-fact-txt {
      display: block;
      font-family: ${T.font};
      font-size: ${F.fact[0]};
      line-height: ${F.fact[1]};
      color: ${T.txt};
   }

   .hs-interactive .hs-fact-2 .hs-fact-txt,
   .hs-interactive .hs-fact-4 .hs-fact-txt {
      font-size: ${F.factSide[0]};
      line-height: ${F.factSide[1]};
   }

${C.map(c => `   .hs-c${c}:checked ~ .hs-interactive .hs-flap-${c} {
      display: none;
   }

   .hs-c${c}:checked ~ .hs-interactive .hs-fold-${c},
   .hs-c${c}:checked ~ .hs-interactive .hs-fact-${c} {
      display: block;
   }`).join('\n\n')}

   /* status line: one text per number of open flaps (16 combinations of 4 checkboxes) */
   .hs-interactive .hs-status {
      margin: 0;
      font-family: ${T.font};
      font-size: ${F.status[0]};
      line-height: ${F.status[1]};
      color: ${T.status};
      text-align: center;
   }

   .hs-interactive .hs-st {
      display: none;
   }

${statusRules}

   /* buttons: only when all four flaps are open */
   .hs-interactive .hs-done {
      display: none;
      padding: 14px 0 0 0;
   }

   .hs-interactive .hs-reset {
      display: inline-block;
      height: ${F.btn[2]}px;
      margin: 0 0 0 12px;
      padding: 0 20px;
      border: 2px solid ${T.resetLine};
      border-radius: ${T.radius};
      background-color: transparent;
      color: ${T.resetLine};
      font-family: ${T.font};
      font-size: ${F.btn[0]};
      font-weight: ${F.btn[1]};
      cursor: pointer;
      -webkit-appearance: none;
      appearance: none;
   }

   /* mobile summary under the pillow: hidden on desktop (the facts sit around the chocolate there) */
   .hs-interactive .hs-list {
      display: none;
   }

   .hs-interactive .hs-li {
      display: none;
      padding: 0 24px 16px 24px;
      text-align: center;
   }

   .hs-interactive .hs-li-label {
      display: block;
      margin: 0 0 4px 0;
      font-family: ${T.font};
      font-size: ${F.label[0]};
      line-height: ${F.label[1]};
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: ${T.accent};
   }

   .hs-interactive .hs-li-txt {
      display: block;
      font-family: ${T.font};
      font-size: ${F.fact[0]};
      line-height: ${F.fact[1]};
      color: ${T.txt};
   }

${C.map(c => `   .hs-c${c}:checked ~ .hs-interactive .hs-li-${c}`).join(',\n')} {
      display: block;
   }

   /* newest-on-top for the mobile text spot (only used in the max-width 600px rules below) */
   @-webkit-keyframes hs-stack {
      from {
         z-index: 10000000;
      }

      to {
         z-index: 1;
      }
   }

   @keyframes hs-stack {
      from {
         z-index: 10000000;
      }

      to {
         z-index: 1;
      }
   }

   ${ALL} .hs-wish {
      display: -webkit-flex;
      display: flex;
   }

   ${ALL} .hs-seal {
      display: none;
   }

   ${ALL} .hs-done {
      display: block;
   }

   @media only screen and (max-width: 600px) {
      .hs-title {
         font-size: ${F.mTitle[0]} !important;
         line-height: ${F.mTitle[1]} !important;
      }

      .hs-interactive .hs-pillow {
         border-radius: ${T.pillowRadius[1]} !important;
      }

      .hs-interactive .hs-pillow-line {
         border-radius: ${T.lineRadius[1]} !important;
      }

      .hs-interactive .hs-wish-year {
         font-size: ${F.mYear[0]} !important;
         line-height: ${F.mYear[1]} !important;
      }

      .hs-interactive .hs-wish-txt {
         font-size: 12px !important;
         line-height: 15px !important;
      }

      .hs-interactive .hs-wish-label {
         font-size: 9px !important;
         line-height: 12px !important;
      }

      .hs-interactive .hs-seal {
         border-width: 2px !important;
         font-size: 14px !important;
      }

      /* mobile: one text spot above the chocolate, the same fixed box for every fact (y 60 = 16 under the pillow
         line, to y 155 = just above the top fold). All open facts sit in that box on an opaque background, so the
         one on top always covers the others completely, whatever their length. The newest is on top because every
         fact starts the hs-stack animation (z-index counting down 100 per second, so taps a split second apart
         still differ) when it appears. Without animation support the highest corner number shows. */
      .hs-interactive .hs-fact {
         left: ${px(90)} !important;
         top: ${py(60)} !important;
         bottom: ${py(525)} !important;
         width: ${px(520)} !important;
         text-align: center !important;
         background-color: ${T.pillowBg};
         -webkit-animation: hs-stack 100000s linear forwards;
         animation: hs-stack 100000s linear forwards;
      }

      .hs-interactive .hs-fact-label {
         font-size: 10px !important;
         line-height: 13px !important;
      }

      .hs-interactive .hs-fact-txt,
      .hs-interactive .hs-fact-2 .hs-fact-txt,
      .hs-interactive .hs-fact-4 .hs-fact-txt {
         font-size: 13px !important;
         line-height: 17px !important;
      }

      /* the summary of opened corners under the pillow (in addition to the text spot above the chocolate) */
      .hs-interactive .hs-list {
         display: block !important;
         padding: 8px 0 0 0 !important;
      }

      .hs-interactive .hs-reset {
         margin: 12px 0 0 0 !important;
      }
   }

   @media only screen and (max-width: 400px) {
      .hs-interactive .hs-wish-year {
         font-size: ${F.sYear[0]} !important;
         line-height: ${F.sYear[1]} !important;
      }

      .hs-interactive .hs-wish-txt {
         font-size: 11px !important;
         line-height: 14px !important;
      }

      /* small phones: the text spot above the chocolate stays clear of the pillow line */
      .hs-interactive .hs-fact-txt,
      .hs-interactive .hs-fact-2 .hs-fact-txt,
      .hs-interactive .hs-fact-4 .hs-fact-txt {
         font-size: 12px !important;
         line-height: 15px !important;
      }
   }
</style>
<style type="text/css">
   /* Back to the fallback. Every override also exists as a variant at least as specific as the activation selector
      (.hs-detect:checked ~ ...), because !important rules are decided by specificity before source order. */
   /* Outlook.com / new Outlook: class names get an x_ prefix */
   [class~="x_hs-interactive"],
   [class~="x_hs-detect"]:checked ~ [class~="x_hs-interactive"] {
      display: none !important;
      max-height: 0 !important;
      overflow: hidden !important;
   }

   [class~="x_hs-fallback"],
   [class~="x_hs-detect"]:checked ~ [class~="x_hs-fallback"] {
      display: block !important;
      max-height: none !important;
      overflow: visible !important;
   }

   /* Samsung Mail: the message is wrapped in #MessageViewBody (the id outranks the activation selector) */
   #MessageViewBody .hs-interactive {
      display: none !important;
      max-height: 0 !important;
      overflow: hidden !important;
   }

   #MessageViewBody .hs-fallback {
      display: block !important;
      max-height: none !important;
      overflow: visible !important;
   }
</style>
<style type="text/css">
   /* Outlook apps: \\0 hack in its own style tag (it breaks the rest of a style tag in other clients) */
   .hs-interactive\\0 {
      display: none !important;
      max-height: 0 !important;
      overflow: hidden !important;
   }

   .hs-detect:checked ~ .hs-interactive\\0 {
      display: none !important;
      max-height: 0 !important;
      overflow: hidden !important;
   }

   .hs-fallback\\0 {
      display: block !important;
      max-height: none !important;
      overflow: visible !important;
   }

   .hs-detect:checked ~ .hs-fallback\\0 {
      display: block !important;
      max-height: none !important;
      overflow: visible !important;
   }
</style>`;

const ind = (s, n) => s.split('\n').map(l => l ? ' '.repeat(n) + l : l).join('\n');
const table = (inner, attrs = '') => `<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0"${attrs}>
${inner}
</table>`;
const [bSize, bWeight, bHeight, bWidth] = F.btn;
const btnA = `<a href="https://100procent.nl/" target="_blank"
   style="background-color:${T.btnBg};border:1px solid ${T.btnBg};border-radius:${T.radius};color:${T.btnTxt};display:inline-block;font-family: ${T.font};font-size: ${bSize};font-weight:${bWeight};line-height:${bHeight}px;padding:0 24px;text-align:center;text-decoration:none;-webkit-text-size-adjust:none;mso-hide:all;">btn_txt_1</a>`;
const btnVml = `<!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://100procent.nl/" style="height:${bHeight}px;v-text-anchor:middle;width:${bWidth}px;" arcsize="8%" strokecolor="${T.btnBg}" fillcolor="${T.btnBg}">
   <w:anchorlock/>
   <center style="color:${T.btnTxt};font-family: ${T.font};font-size:${bSize};font-weight:bold;">btn_txt_1</center>
</v:roundrect>
<![endif]-->`;

// header band (shared by fallback and interactive)
const header = table(`   <tr>
      <td align="center" class="pml24 pmr24" style="padding: ${T.headerPad}; font-family: ${T.font};">
         <h1 class="hs-title" style="margin: 0 0 10px 0; font-family: ${T.fontH}; font-size: ${F.title[0]}; line-height: ${F.title[1]}; font-weight: ${F.title[2]}; color: ${T.title};">title_1</h1>
         <p style="margin: 0; font-size: ${F.intro[0]}; line-height: ${F.intro[1]}; color: ${T.intro};">txt_1</p>
      </td>
   </tr>`, ` bgcolor="${T.headerBg}"`);

// ---------- fallback: the all-open state in tables (inline styles, Outlook-safe) ----------
// side facts get .txt-center (head class, !important) so they centre when the columns stack on mobile
const fbFact = (n, align, size, cls = '') => `<p${cls} style="margin: 0 0 4px 0; font-family: ${T.font}; font-size: ${F.label[0]}; line-height: ${F.label[1]}; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.accent}; text-align: ${align};">subtitle_${n}</p>
<p${cls} style="margin: 0; font-family: ${T.font}; font-size: ${size[0]}; line-height: ${size[1]}; color: ${T.txt}; text-align: ${align};">txt_${n + 1}</p>`;
const fbChoc = `<table role="presentation" width="260" align="center" border="0" cellspacing="0" cellpadding="0" bgcolor="${T.chocBg}" style="width: 260px; border-radius: ${T.chocRadius}; border-collapse: separate;">
   <tr>
      <td style="padding: 16px;">
         <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border: 2px solid ${T.chocLine};">
            <tr>
               <td height="224" align="center" valign="middle" style="height: 224px; padding: 0 16px; text-align: center;">
                  <p style="margin: 0 0 4px 0; font-family: ${T.font}; font-size: ${F.wishLabel[0]}; line-height: ${F.wishLabel[1]}; letter-spacing: 0.2em; text-transform: uppercase; color: ${T.wishLabel};">label_1</p>
                  <p style="margin: 0 auto 4px auto; max-width: 130px; font-family: ${T.font}; font-size: ${F.wishTxt[0]}; line-height: ${F.wishTxt[1]}; color: ${T.wishTxt};">txt_11</p>
                  <p style="margin: 0; font-family: ${T.fontH}; font-size: ${F.year[0]}; line-height: ${F.year[1]}; font-weight: ${F.year[2]}; color: ${T.wishYear};">title_2</p>
               </td>
            </tr>
         </table>
      </td>
   </tr>
</table>`;
const fbSpacer = h => table(`   <tr>
      <td height="${h}" style="height: ${h}px; font-size: 0; line-height: 0;">&nbsp;</td>
   </tr>`);
const fbCentered = n => `<table role="presentation" width="360" align="center" border="0" cellspacing="0" cellpadding="0" class="col-sm-12" style="width: 360px;">
   <tr>
      <td align="center">
${ind(fbFact(n, 'center', F.fact), 9)}
      </td>
   </tr>
</table>`;
const fbRow = `<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
   <tr>
      <th class="col-sm-12" width="112" align="right" valign="middle" style="vertical-align: middle; font-weight: normal; text-align: right;">
${ind(fbFact(4, 'right', F.factSide, ' class="txt-center"'), 9)}
      </th>
      <th class="col-sm-12" width="16" height="16" aria-hidden="true" style="font-size: 0; line-height: 16px;">&nbsp;</th>
      <th class="col-sm-12" width="260" align="center" valign="middle" style="vertical-align: middle; font-weight: normal;">
${ind(fbChoc, 9)}
      </th>
      <th class="col-sm-12" width="16" height="16" aria-hidden="true" style="font-size: 0; line-height: 16px;">&nbsp;</th>
      <th class="col-sm-12" width="112" align="left" valign="middle" style="vertical-align: middle; font-weight: normal; text-align: left;">
${ind(fbFact(2, 'left', F.factSide, ' class="txt-center"'), 9)}
      </th>
   </tr>
</table>`;
const fallback = `<div class="hs-fallback">
${ind(table(`   <tr>
      <td class="pml16 pmr16" style="padding: 24px 20px 0 20px;">
${ind(table(`   <tr>
      <td style="padding: 20px;">
${ind(table(`   <tr>
      <td align="center" class="pml16 pmr16" style="padding: 32px 20px;">
${ind(fbCentered(1), 9)}
${ind(fbSpacer(24), 9)}
${ind(fbRow, 9)}
${ind(fbSpacer(24), 9)}
${ind(fbCentered(3), 9)}
      </td>
   </tr>`, ` style="border: 2px solid ${T.pillowLine}; border-radius: ${T.lineRadius[0]}; border-collapse: separate;"`), 9)}
      </td>
   </tr>`, ` bgcolor="${T.pillowBg}" style="border-radius: ${T.pillowRadius[0]}; border-collapse: separate;"`), 9)}
      </td>
   </tr>
   <tr>
      <td align="center" style="padding: 32px 24px 40px 24px;">
${ind(btnVml, 9)}
${ind(btnA, 9)}
      </td>
   </tr>`, ` bgcolor="${T.stageBg}"`), 3)}
</div>`;

// ---------- interactive: the artifact stage ----------
const abs = (cls, extra = '') => `<div class="hs-abs ${cls}"${extra}></div>`;
const stage = `<div class="hs-stage">
   <div class="hs-box">
      ${abs('hs-pillow')}
      ${abs('hs-pillow-line')}
      ${abs('hs-choc')}
      ${abs('hs-choc-line')}
      <div class="hs-abs hs-wish">
         <span class="hs-wish-label">label_1</span>
         <span class="hs-wish-txt">txt_11</span>
         <span class="hs-wish-year">title_2</span>
      </div>
${C.map(c => `      <label for="hs-c${c}" class="hs-abs hs-flap hs-flap-${c}" title="subtitle_${c}"></label>`).join('\n')}
${C.map(c => `      <label for="hs-c${c}" class="hs-abs hs-fold hs-fold-${c}" title="subtitle_${c}"></label>`).join('\n')}
      <div class="hs-abs hs-seal">label_2</div>
      <!-- facts inside the box: their % positions refer to the fixed-proportion box, not to the growing stage -->
${C.map(c => `      <div class="hs-fact hs-fact-${c}">
         <span class="hs-fact-label">subtitle_${c}</span>
         <span class="hs-fact-txt">txt_${c + 1}</span>
      </div>`).join('\n')}
   </div>
   <!-- mobile only: summary of every opened corner, in corner order, under the pillow -->
   <div class="hs-list">
${C.map(c => `      <div class="hs-li hs-li-${c}">
         <span class="hs-li-label">subtitle_${c}</span>
         <span class="hs-li-txt">txt_${c + 1}</span>
      </div>`).join('\n')}
   </div>
</div>`;
const after = table(`   <tr>
      <td align="center" style="padding: 8px 24px 40px 24px;">
         <p class="hs-status">
            <span class="hs-st hs-st-0">txt_6</span>
            <span class="hs-st hs-st-1">txt_7</span>
            <span class="hs-st hs-st-2">txt_8</span>
            <span class="hs-st hs-st-3">txt_9</span>
            <span class="hs-st hs-st-4">txt_10</span>
         </p>
         <div class="hs-done">
${ind(btnA, 12)}
            <input type="reset" class="hs-reset" value="btn_txt_2">
         </div>
      </td>
   </tr>`, ` bgcolor="${T.stageBg}"`);
const interactive = `<!--[if !mso]><!-->
<div class="hs-interactive" style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">
${ind(stage, 3)}
${ind(after, 3)}
</div>
<!--<![endif]-->`;

const inputs = `<!--[if !mso]><!-->
<form class="hs-form" style="margin: 0;">
<input type="checkbox" id="hs-detect" class="hs-detect" checked style="display: none !important; mso-hide: all;">
${C.map(c => `<input type="checkbox" id="hs-c${c}" class="hs-c${c}" style="display: none !important; mso-hide: all;">`).join('\n')}
<!--<![endif]-->`;
const formEnd = `<!--[if !mso]><!-->
</form>
<!--<![endif]-->`;

const body = `<!-- start ${NAME} -->
@@CSS@@
<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
   <tr>
      <td${T.outerClass ? ` class="${T.outerClass}"` : ''} style="padding: ${T.outerPad};" align="center">
         <!-- header band: shared by fallback and interactive -->
${ind(header, 9)}
         <!-- state inputs (in a form, so "reset" can wrap the chocolate up again): detection (pre-checked) +
              one checkbox per flap, in this order (the "all open" selector chains them) -->
${ind(inputs, 9)}
         <!-- fallback: the all-open state (artifact step 4), in tables -->
${ind(fallback, 9)}
         <!-- interactive: the artifact stage, status line, buttons after all four flaps -->
${ind(interactive, 9)}
${ind(formEnd, 9)}
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
  fs.mkdirSync(require('path').dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, out);
  console.log('written', OUT, Buffer.byteLength(out), 'bytes');
}
