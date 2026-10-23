// "Recht gehangen" generator, a one-on-one email translation of the artifact board "Recht gehangen (klikbaar)"
// (WaterpasMail.dc.html, the hero of 700 x 680 under the 80px header) and "De momenten, techniek en gewicht"
// (WaterpasInfo.dc.html). Token-driven: `node gen_rek.js` writes the repo block with default tokens and slot names;
// build(T) is reused by build_mail.js for the Coram mail with the artifact's values and copy.
//   node gen_rek.js      (then run assemble.ps1 in HTML/ to rebuild the all-blocks file)
const fs = require('fs'), path = require('path');
const NAME = 'hotspot_1_col_subtitle_title_txt_icon_btn';
// build/ -> concept_3_recht_gehangen -> coram -> interactive_artifact -> HTML
const OUT = path.resolve(__dirname, '../../../../blocks/hotspot', `${NAME}.html`);

// default tokens (README token table); geometry, font sizes and the animation are the artifact's own
const DEFAULT = {
  font: 'Roboto,Arial,Helvetica,Verdana,sans-serif',
  c: {
    wall: '#efefef', wallLine: 'rgba(68,68,68,0.25)', ink: '#050033', grey: '#4d4d4d', blue: '#9980FF', blueRing: 'rgba(153,128,255,0.18)',
    blueLine: 'rgba(153,128,255,0.45)', btnBg: 'rgba(255,255,255,0.75)', white: '#ffffff', black: '#050033',
    rackShadow: 'rgba(5,0,51,0.3)', level: '#9E9E9E', vial: '#ffffff', vialLine: '#444444', vialMark: '#050033',
    towel: '#e3fc5e', towelTxt: '#050033', towelLine: 'rgba(5,0,51,0.5)', towelShadow: 'rgba(5,0,51,0.25)',
  },
};

// the rack area: percentages of 520 x 380 (the rotating group is 520 x 340 at y 40; its parts in % of 520 x 340)
const pa = (v, of) => +(v / of * 100).toFixed(4) + '%';
const gx = v => pa(v, 520), gy = v => pa(v, 340);
const gbox = (l, t, w, h) => `left: ${gx(l)}; top: ${gy(t)}; width: ${gx(w)}; height: ${gy(h)};`;

function build(T) {
const C = T.c, F = T.font;

const css = `<style type="text/css">
   /* Recht gehangen (artifact "Recht gehangen"): a towel rail that hangs a little crooked. The first arrow (label of
      .cw-c1) swings it too far (8 degrees), the second (label of .cw-c2, only then shown) sets it level: the bubble in
      the middle and a towel with "Handdoek en bedankt". "Nog een keer" resets the form. Order: inputs, fallback,
      interactive. Interactive only in WebKit clients that support :checked (pre-checked .cw-detect); everything else
      keeps the fallback: the level rail with the towel, built in tables. */
   @media screen and (-webkit-min-device-pixel-ratio: 0) {
      .cw-detect:checked ~ .cw-fallback {
         display: none !important;
         max-height: 0 !important;
         overflow: hidden !important;
      }

      .cw-detect:checked ~ .cw-interactive {
         display: block !important;
         max-height: none !important;
         overflow: visible !important;
      }
   }

   /* hero: 680 high, the tile wall (100px grid) */
   .cw-interactive .cw-hero {
      min-height: 680px;
      padding: 56px 60px 0 60px;
      overflow: hidden;
      box-sizing: border-box;
      background-color: ${C.wall};
      background-image: repeating-linear-gradient(0deg, ${C.wallLine} 0 1px, transparent 1px 100px), repeating-linear-gradient(90deg, ${C.wallLine} 0 1px, transparent 1px 100px);
      text-align: center;
   }

   /* the three texts (scheef, oeps, recht) share one grid cell, so the rail below doesn't move between the states */
   .cw-interactive .cw-texts {
      display: -ms-grid;
      display: grid;
      min-height: 150px;
   }

   .cw-interactive .cw-t {
      grid-area: 1 / 1;
      visibility: hidden;
   }

   .cw-interactive .cw-t0 {
      visibility: visible;
   }

   .cw-c1:checked ~ .cw-interactive .cw-t0 {
      visibility: hidden;
   }

   .cw-c1:checked ~ .cw-interactive .cw-t1 {
      visibility: visible;
   }

   .cw-c1:checked ~ .cw-c2:checked ~ .cw-interactive .cw-t1 {
      visibility: hidden;
   }

   .cw-c1:checked ~ .cw-c2:checked ~ .cw-interactive .cw-t2 {
      visibility: visible;
   }

   .cw-interactive .cw-kicker {
      margin: 0;
      font-family: ${F};
      font-size: 13px;
      line-height: 19px;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: ${C.grey};
   }

   .cw-interactive .cw-h1 {
      margin: 12px 0 0 0;
      font-family: ${F};
      font-size: 42px;
      line-height: 48.3px;
      font-weight: 300;
      color: ${C.ink};
   }

   .cw-interactive .cw-hint {
      margin: 12px 0 0 0;
      font-family: ${F};
      font-size: 17px;
      line-height: 25px;
      font-weight: 300;
      color: ${C.grey};
   }

   /* the rack area: 520 x 380 (73.0769% = 380 / 520), 16 + 10 under the texts */
   .cw-interactive .cw-stage {
      position: relative;
      width: 100%;
      max-width: 520px;
      height: 0;
      margin: 26px auto 0 auto;
      padding-bottom: 73.0769%;
   }

   .cw-interactive .cw-a {
      position: absolute;
      display: block;
      box-sizing: border-box;
   }

   /* the rotating group (520 x 340 at y 40), turning around the bar (y 92); -6 / 8 / 0 degrees */
   .cw-interactive .cw-rack {
      left: 0;
      top: ${pa(40, 380)};
      width: 100%;
      height: ${pa(340, 380)};
      -webkit-transform-origin: 50% ${gy(92)};
      transform-origin: 50% ${gy(92)};
      -webkit-transform: rotate(-6deg);
      transform: rotate(-6deg);
      -webkit-transition: -webkit-transform 0.9s cubic-bezier(0.3, 1.5, 0.5, 1);
      transition: transform 0.9s cubic-bezier(0.3, 1.5, 0.5, 1);
   }

   .cw-c1:checked ~ .cw-interactive .cw-rack {
      -webkit-transform: rotate(8deg);
      transform: rotate(8deg);
   }

   .cw-c1:checked ~ .cw-c2:checked ~ .cw-interactive .cw-rack {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
   }

   .cw-interactive .cw-bracket-l,
   .cw-interactive .cw-bracket-r {
      border-radius: 8px;
      background-color: ${C.black};
      box-shadow: 0 6px 12px ${C.rackShadow};
   }

   .cw-interactive .cw-bracket-l {
      ${gbox(20, 70, 44, 44)}
   }

   .cw-interactive .cw-bracket-r {
      ${gbox(456, 70, 44, 44)}
   }

   .cw-interactive .cw-bar {
      ${gbox(42, 84, 436, 16)}
      border-radius: 8px;
      background-color: ${C.black};
   }

   /* the spirit level (240 x 40) with its black ends and the vial (96 x 20) */
   .cw-interactive .cw-level {
      ${gbox(140, 44, 240, 40)}
      border-radius: 4px;
      background-color: ${C.level};
      box-shadow: inset 0 2px 0 rgba(255,255,255,0.6), 0 4px 8px rgba(0,0,0,0.25);
   }

   .cw-interactive .cw-end-l,
   .cw-interactive .cw-end-r {
      top: 0;
      width: 8.3333%;
      height: 100%;
      background-color: ${C.black};
   }

   .cw-interactive .cw-end-l {
      left: 0;
      border-radius: 4px 0 0 4px;
   }

   .cw-interactive .cw-end-r {
      right: 0;
      border-radius: 0 4px 4px 0;
   }

   .cw-interactive .cw-vial {
      left: 30%;
      top: 25%;
      width: 40%;
      height: 50%;
      border-radius: 10px;
      background-color: ${C.vial};
      box-shadow: inset 0 0 0 2px ${C.vialLine};
   }

   .cw-interactive .cw-mark-1,
   .cw-interactive .cw-mark-2 {
      top: 0;
      width: 2px;
      height: 100%;
      background-color: ${C.vialMark};
   }

   .cw-interactive .cw-mark-1 {
      left: 35.4167%;
   }

   .cw-interactive .cw-mark-2 {
      left: 62.5%;
   }

   /* the bubble: x 68 / 6 / 37 of the 96 vial */
   .cw-interactive .cw-bubble {
      left: 70.8333%;
      top: 15%;
      width: 22.9167%;
      height: 70%;
      border-radius: 7px;
      background-color: ${C.white};
      box-shadow: inset 0 0 0 1px rgba(0,0,0,0.15);
      -webkit-transition: left 0.9s ease;
      transition: left 0.9s ease;
   }

   .cw-c1:checked ~ .cw-interactive .cw-bubble {
      left: 6.25%;
   }

   .cw-c1:checked ~ .cw-c2:checked ~ .cw-interactive .cw-bubble {
      left: 38.5417%;
   }

   /* the towel, only when level */
   .cw-interactive .cw-towel {
      display: none;
      ${gbox(160, 92, 200, 240)}
      padding: 0 18px 34px 18px;
      border-radius: 0 0 6px 6px;
      background-color: ${C.towel};
      background-image: repeating-linear-gradient(90deg, rgba(255,255,255,0.12) 0 2px, transparent 2px 7px);
      box-shadow: 0 14px 24px ${C.towelShadow};
   }

   .cw-c1:checked ~ .cw-c2:checked ~ .cw-interactive .cw-towel {
      display: -webkit-flex;
      display: flex;
      -webkit-align-items: flex-end;
      align-items: flex-end;
   }

   .cw-interactive .cw-towel-txt {
      width: 100%;
      margin: 0;
      padding-top: 14px;
      border-top: 2px solid ${C.towelLine};
      font-family: ${F};
      font-size: 24px;
      line-height: 28.8px;
      font-weight: 500;
      text-align: center;
      color: ${C.towelTxt};
   }

   /* the arrows: labels, centred on the board's buttons (1: 448,150 60 x 60; 2: 6,0 56 x 56 of the 520 x 380 area) */
   .cw-interactive .cw-btn {
      display: none;
      -webkit-align-items: center;
      align-items: center;
      -webkit-justify-content: center;
      justify-content: center;
      border-radius: 50%;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
   }

   .cw-interactive .cw-btn1 {
      display: -webkit-flex;
      display: flex;
      left: ${pa(478, 520)};
      top: ${pa(180, 380)};
      width: 60px;
      height: 60px;
      margin: -30px 0 0 -30px;
      background-color: ${C.blue};
      box-shadow: 0 0 0 8px ${C.blueRing};
   }

   .cw-interactive .cw-btn2 {
      left: ${pa(34, 520)};
      top: ${pa(28, 380)};
      width: 56px;
      height: 56px;
      margin: -28px 0 0 -28px;
      border: 2px solid ${C.blueLine};
      background-color: ${C.btnBg};
   }

   .cw-c1:checked ~ .cw-interactive .cw-btn1 {
      display: none;
   }

   .cw-c1:checked ~ .cw-interactive .cw-btn2 {
      display: -webkit-flex;
      display: flex;
   }

   .cw-c1:checked ~ .cw-c2:checked ~ .cw-interactive .cw-btn2 {
      display: none;
   }

   /* "Nog een keer": the form's reset button, only when level */
   .cw-interactive .cw-reset {
      display: none;
      height: 44px;
      margin: 16px auto 0 auto;
      padding: 0 20px;
      border: 0;
      background-color: transparent;
      font-family: ${F};
      font-size: 15px;
      line-height: 22px;
      text-decoration: underline;
      color: ${C.grey};
      cursor: pointer;
      -webkit-appearance: none;
   }

   .cw-c1:checked ~ .cw-c2:checked ~ .cw-interactive .cw-reset {
      display: block;
   }

   @media only screen and (max-width: 600px) {
      .cw-interactive .cw-hero {
         min-height: 0 !important;
         padding: 40px 16px 24px 16px !important;
      }

      .cw-interactive .cw-texts {
         min-height: 0 !important;
      }

      .cw-h1 {
         font-size: 30px !important;
         line-height: 35px !important;
      }

      .cw-hint {
         font-size: 15px !important;
         line-height: 22px !important;
      }

      .cw-interactive .cw-stage {
         margin-top: 16px !important;
      }

      .cw-interactive .cw-towel {
         padding: 0 10px 16px 10px !important;
      }

      .cw-towel-txt {
         padding-top: 8px !important;
         font-size: 16px !important;
         line-height: 19px !important;
      }

      .cw-interactive .cw-btn1 {
         width: 48px !important;
         height: 48px !important;
         margin: -24px 0 0 -24px !important;
         box-shadow: 0 0 0 6px ${C.blueRing} !important;
      }

      .cw-interactive .cw-btn2 {
         width: 44px !important;
         height: 44px !important;
         margin: -22px 0 0 -22px !important;
      }

      .cw-interactive .cw-btn svg {
         width: 22px !important;
         height: 22px !important;
      }

      .cw-interactive .cw-bracket-l,
      .cw-interactive .cw-bracket-r {
         border-radius: 6px !important;
      }

      /* fallback: the hero padding and the towel text */
      .cw-fb-hero {
         padding: 40px 16px 24px 16px !important;
      }
   }

   @media only screen and (max-width: 400px) {
      .cw-h1 {
         font-size: 26px !important;
         line-height: 31px !important;
      }

      .cw-towel-txt {
         font-size: 14px !important;
         line-height: 17px !important;
      }
   }

   /* Outlook.com / new Outlook: class names get an x_ prefix */
   [class~="x_cw-interactive"],
   [class~="x_cw-detect"]:checked ~ [class~="x_cw-interactive"] {
      display: none !important;
      max-height: 0 !important;
      overflow: hidden !important;
   }

   [class~="x_cw-fallback"],
   [class~="x_cw-detect"]:checked ~ [class~="x_cw-fallback"] {
      display: block !important;
      max-height: none !important;
      overflow: visible !important;
   }

   /* Samsung Mail: the message is wrapped in #MessageViewBody (the id outranks the activation selector) */
   #MessageViewBody .cw-interactive {
      display: none !important;
      max-height: 0 !important;
      overflow: hidden !important;
   }

   #MessageViewBody .cw-fallback {
      display: block !important;
      max-height: none !important;
      overflow: visible !important;
   }
</style>
<style type="text/css">
   /* Outlook apps: back to the fallback (separate style tag: the \\0 hack breaks the rest of a style tag) */
   .cw-interactive\\0,
   .cw-detect:checked ~ .cw-interactive\\0 {
      display: none !important;
      max-height: 0 !important;
      overflow: hidden !important;
   }

   .cw-fallback\\0,
   .cw-detect:checked ~ .cw-fallback\\0 {
      display: block !important;
      max-height: none !important;
      overflow: visible !important;
   }
</style>`;

// ---------------- markup ----------------
const ind = (s, n) => s.split('\n').map(l => l ? ' '.repeat(n) + l : l).join('\n');
const f = (size, lh, extra = '') => `font-family: ${F}; font-size: ${size}px; line-height: ${lh}px;${extra}`;
const iconTurn = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${C.white}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12a8 8 0 1 1-2.3-5.6"></path><path d="M20 4v5h-5"></path></svg>`;
const iconBack = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="${C.blue}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 1 0 2.3-5.6"></path><path d="M4 4v5h5"></path></svg>`;

// fallback: the level rail with the towel in tables. Columns of the 520 area: 20 margin, 44 bracket, 76, 240 level,
// 76, 44 bracket, 20 margin; rows from y 44 (the level's top): 26, 14 (bracket from 70), 16 (bar 84-100), 14 (to 114)
const cols = [20, 44, 76, 240, 76, 44, 20].map(w => pa(w, 520));
const td = (w, extra = '') => `<td width="${w}" style="width: ${w}; font-size: 0; line-height: 0;${extra}">&nbsp;</td>`;
const blk = `background-color: ${C.black};`;
const vial = `<table role="presentation" width="96" border="0" cellspacing="0" cellpadding="0" align="center" bgcolor="${C.vial}" style="width: 96px; border-radius: 10px; border-collapse: separate; border: 2px solid ${C.vialLine};">
   <tr>
      <td width="32" height="16" style="width: 32px; height: 16px; font-size: 0; line-height: 0;">&nbsp;</td>
      <td width="2" bgcolor="${C.vialMark}" style="width: 2px; font-size: 0; line-height: 0;">&nbsp;</td>
      <td width="24" align="center" valign="middle" style="width: 24px; font-size: 0; line-height: 0;"><span style="display: inline-block; width: 22px; height: 12px; border-radius: 7px; background-color: ${C.white};">&nbsp;</span></td>
      <td width="2" bgcolor="${C.vialMark}" style="width: 2px; font-size: 0; line-height: 0;">&nbsp;</td>
      <td width="32" style="width: 32px; font-size: 0; line-height: 0;">&nbsp;</td>
   </tr>
</table>`;
const level = `<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="${C.level}" style="border-radius: 4px; border-collapse: separate;">
   <tr>
      <td width="8%" height="40" bgcolor="${C.black}" style="width: 8%; height: 40px; border-radius: 4px 0 0 4px; font-size: 0; line-height: 0;">&nbsp;</td>
      <td align="center" valign="middle" style="font-size: 0; line-height: 0;">
${ind(vial, 9)}
      </td>
      <td width="8%" bgcolor="${C.black}" style="width: 8%; border-radius: 0 4px 4px 0; font-size: 0; line-height: 0;">&nbsp;</td>
   </tr>
</table>`;
const towel = (h, inner) => `<table role="presentation" width="51.0204%" border="0" cellspacing="0" cellpadding="0" align="center" bgcolor="${C.towel}" style="width: 51.0204%;${inner ? ' border-radius: 0 0 6px 6px; border-collapse: separate;' : ''}">
   <tr>
      <td height="${h}" valign="bottom" align="center" class="${inner ? 'cw-fb-towel' : ''}" style="height: ${h}px; padding: ${inner ? '0 18px 34px 18px' : '0'}; font-size: ${inner ? '16px' : '0'}; line-height: ${inner ? '19px' : '0'};">${inner || '&nbsp;'}</td>
   </tr>
</table>`;
const rackTable = `<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" align="center" style="max-width: 520px; table-layout: fixed;">
   <tr>
      ${td(cols[0], ' height: 26px;')}${td(cols[1])}${td(cols[2])}
      <td width="${cols[3]}" rowspan="2" valign="top" style="width: ${cols[3]};">
${ind(level, 9)}
      </td>
      ${td(cols[4])}${td(cols[5])}${td(cols[6])}
   </tr>
   <tr>
      ${td(cols[0], ' height: 14px;')}
      <td width="${cols[1]}" rowspan="3" height="44" bgcolor="${C.black}" style="width: ${cols[1]}; height: 44px; border-radius: 8px; font-size: 0; line-height: 0;">&nbsp;</td>
      ${td(cols[2])}${td(cols[4])}
      <td width="${cols[5]}" rowspan="3" bgcolor="${C.black}" style="width: ${cols[5]}; border-radius: 8px; font-size: 0; line-height: 0;">&nbsp;</td>
      ${td(cols[6])}
   </tr>
   <tr>
      ${td(cols[0], ' height: 16px;')}
      <td colspan="3" height="16" bgcolor="${C.black}" style="height: 16px; font-size: 0; line-height: 0;">&nbsp;</td>
      ${td(cols[6])}
   </tr>
   <tr>
      ${td(cols[0], ' height: 14px;')}
      <td colspan="3" style="font-size: 0; line-height: 0;">
${ind(towel(14, ''), 9)}
      </td>
      ${td(cols[6])}
   </tr>
   <tr>
      <!-- the rest of the towel, in the same three middle columns as its top, so both parts are equally wide -->
      ${td(cols[0])}${td(cols[1])}
      <td colspan="3" style="font-size: 0; line-height: 0;">
${ind(towel(218, `<p style="margin: 0; padding-top: 14px; border-top: 2px solid ${C.towelLine}; ${f(24, 29, ' font-weight: 500;')} color: ${C.towelTxt};" class="cw-towel-txt">label_1</p>`), 9)}
      </td>
      ${td(cols[5])}${td(cols[6])}
   </tr>
</table>`;

const fallback = `<!-- 76 = 680 hero - 56 - 128 - 132 - 288 rail and towel -->
<!-- fallback: the artifact's end state (the rail level, the towel), built in tables; the same texts as step 3
     (artifact: "de rest ziet direct het rechte rek met de handdoek en de tekst") -->
<div class="cw-fallback">
   <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="${C.wall}">
      <tr>
         <td align="center" valign="top" class="cw-fb-hero" style="padding: 56px 60px 76px 60px; background-color: ${C.wall}; background-image: repeating-linear-gradient(0deg, ${C.wallLine} 0 1px, transparent 1px 100px), repeating-linear-gradient(90deg, ${C.wallLine} 0 1px, transparent 1px 100px); word-wrap: break-word; overflow-wrap: break-word;">
            <p style="margin: 0; ${f(13, 19, ' letter-spacing: 0.3em; text-transform: uppercase;')} color: ${C.grey};">subtitle_3</p>
            <h1 class="cw-h1" style="margin: 12px 0 0 0; ${f(42, 48, ' font-weight: 300;')} color: ${C.ink};">title_3</h1>
            <!-- 132 = the board's 150 text block - 128 (kicker 19 + 12 + two heading lines 97) + 26 + 40 + 44 to the level's top -->
            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td height="132" style="height: 132px; font-size: 0; line-height: 0;">&nbsp;</td></tr></table>
${ind(rackTable, 12)}
         </td>
      </tr>
   </table>
</div>`;

const texts = [['subtitle_1', 'title_1', 'txt_1'], ['subtitle_2', 'title_2', 'txt_2'], ['subtitle_3', 'title_3', '']].map(([k, h, t], i) =>
  `<div class="cw-t cw-t${i}">
   <p class="cw-kicker">${k}</p>
   <h1 class="cw-h1">${h}</h1>${t ? `\n   <p class="cw-hint">${t}</p>` : ''}
</div>`).join('\n');

const interactive = `<!--[if !mso]><!-->
<div class="cw-interactive" style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">
   <div class="cw-hero">
      <div class="cw-texts">
${ind(texts, 9)}
      </div>
      <div class="cw-stage">
         <div class="cw-a cw-rack">
            <div class="cw-a cw-bracket-l"></div>
            <div class="cw-a cw-bracket-r"></div>
            <div class="cw-a cw-bar"></div>
            <div class="cw-a cw-level">
               <div class="cw-a cw-end-l"></div>
               <div class="cw-a cw-end-r"></div>
               <div class="cw-a cw-vial">
                  <div class="cw-a cw-mark-1"></div>
                  <div class="cw-a cw-mark-2"></div>
                  <div class="cw-a cw-bubble"></div>
               </div>
            </div>
            <div class="cw-a cw-towel"><p class="cw-towel-txt">label_1</p></div>
         </div>
         <label for="cw-c1" class="cw-a cw-btn cw-btn1" title="Draai het rek recht">${iconTurn}</label>
         <label for="cw-c2" class="cw-a cw-btn cw-btn2" title="Nog een tikje terug">${iconBack}</label>
      </div>
      <input type="reset" class="cw-reset" value="label_2">
   </div>
</div>
<!--<![endif]-->`;

const body = `<!-- start ${NAME} -->
<!-- "Recht gehangen" (Claude Design artifact "Coram eindejaarsmail", concept 3): a towel rail that hangs a little
     crooked. Two checkboxes in a row: the first arrow swings it too far, the second sets it level and a towel appears
     ("Handdoek en bedankt"); "Nog een keer" resets. Fallback (Gmail, Outlook, Samsung): the level rail with the towel
     in tables and the end texts.
     Geometry, font sizes and the animation are the artifact's; colours and fonts are token values here (the Coram
     mail uses the artifact's). Built with interactive_artifact/coram/concept_3_recht_gehangen/build/gen_rek.js: change
     the generator, not this file. -->
@@CSS@@
<!-- the form makes "Nog een keer" (input type=reset) work: it sets the inputs back to their defaults -->
<form action="#" style="margin: 0;">
   <!--[if !mso]><!-->
   <input type="checkbox" class="cw-detect" checked style="display: none !important; mso-hide: all;">
   <input type="checkbox" id="cw-c1" class="cw-c1" style="display: none !important; mso-hide: all;">
   <input type="checkbox" id="cw-c2" class="cw-c2" style="display: none !important; mso-hide: all;">
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
