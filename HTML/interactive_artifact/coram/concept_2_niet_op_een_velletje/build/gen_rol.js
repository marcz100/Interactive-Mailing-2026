// "Dit bedankje past niet op één velletje" generator, a one-on-one email translation of the artifact boards "De volledige
// mail" (RolMail.dc.html, 700 x 2800) and "Zo rolt het af, techniek en gewicht" (RolInfo.dc.html). A scroll window on
// the tiled wall holds the hero and the paper strip as live text; the toilet-roll holder is a fixed layer at the bottom
// of the window, so the thank-you rolls up out of it while you scroll. Token-driven: `node gen_rol.js` writes the repo
// block with default tokens and slot names; build(T) is reused by build_mail.js for the Coram mail.
//   node gen_rol.js      (then run assemble.ps1 in HTML/ to rebuild the all-blocks file)
const fs = require('fs'), path = require('path');
const NAME = 'para_1_col_row_1_subtitle_title_txt_row_2_txt_x6_row_3_icon';
// build/ -> concept_2_niet_op_een_velletje -> coram -> interactive_artifact -> HTML
const OUT = path.resolve(__dirname, '../../../../blocks/para', `${NAME}.html`);

// default tokens (README token table); geometry and font sizes are the artifact's own
const DEFAULT = {
  font: 'Roboto,Arial,Helvetica,Verdana,sans-serif',
  c: {
    wall: '#444444', wallLine: 'rgba(255,255,255,0.10)', heroTxt: '#ffffff', paper: '#ffffff', paperShadow: 'rgba(5,0,51,0.35)',
    ink: '#050033', accent: '#9980FF', perforation: '#e6e6e6', holder: '#050033', roll: '#efefef', rollShadow: 'rgba(5,0,51,0.35)',
  },
};

// window: desktop 700 x 730 (about 150 of paper above the roll at the start, as "het eerste puntje papier steekt
// omhoog"), mobile 700 x 1268 (the phone proportion of the technique board, 234 x 424). The roll layer is the board's
// 700 x 220 from the roll's top (y 2240) to the end of the wall (y 2460); the scroll area ends at the roll's middle
// line (60 under its top), so the paper disappears into the roll and never shows under it.
const WIN = { desk: 730, mob: 1268 };
const LAYER = 220, CUT = 60;
const pa = (v, of) => +(v / of * 100).toFixed(4) + '%';
const lx = v => pa(v, 700), ly = v => pa(v, LAYER);
const lbox = (l, t, w, h) => `left: ${lx(l)}; top: ${ly(t)}; width: ${lx(w)}; height: ${ly(h)};`;

function build(T) {
const C = T.c, F = T.font;
const grid = `repeating-linear-gradient(0deg, ${C.wallLine} 0 1px, transparent 1px 100px), repeating-linear-gradient(90deg, ${C.wallLine} 0 1px, transparent 1px 100px)`;

const css = `<style type="text/css">
   /* Dit bedankje past niet op één velletje (artifact "De volledige mail" + "Zo rolt het af"): a scroll window on the
      tiled wall holds the hero and the paper strip as live text; the toilet-roll holder is a fixed layer over the
      bottom of the window. The scroll area ends at the roll's middle line, so the paper rolls up out of the roll and
      never shows under it; the wall is the window's own background, so it stays still while the paper moves. At the
      end the last sheet (the wish and the signature) stands above the roll and the paper ends 40 into it, as in the
      board. Order: input, fallback, interactive. Interactive only in WebKit clients that support :checked
      (pre-checked .cr-detect); everything else keeps the fallback: the paper strip stacked, the roll below. */
   @media screen and (-webkit-min-device-pixel-ratio: 0) {
      .cr-detect:checked ~ .cr-fallback {
         display: none !important;
         max-height: 0 !important;
         overflow: hidden !important;
      }

      .cr-detect:checked ~ .cr-interactive {
         display: block !important;
         max-height: none !important;
         overflow: visible !important;
      }
   }

   /* ${pa(WIN.desk, 700)} = ${WIN.desk} / 700 */
   .cr-interactive .cr-window {
      position: relative;
      height: 0;
      padding-bottom: ${pa(WIN.desk, 700)};
      overflow: hidden;
      background-color: ${C.wall};
      background-image: ${grid};
   }

   /* the scroll area ends ${LAYER - CUT} above the window's bottom (the roll's middle line): ${pa(LAYER - CUT, WIN.desk)} of ${WIN.desk} */
   .cr-interactive .cr-scroll {
      position: absolute;
      top: 0;
      right: 0;
      bottom: ${pa(LAYER - CUT, WIN.desk)};
      left: 0;
      overflow-x: hidden;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
   }

   /* no scrollbar: it would make the paper narrower than the roll layer (the hero says "Scroll maar") */
   .cr-interactive .cr-scroll::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
   }

   /* hero: the board's 560 column at y 150 (70 under the wall's top), items 18 apart */
   .cr-interactive .cr-hero {
      padding: 70px 70px 0 70px;
      text-align: center;
   }

   .cr-interactive .cr-kicker {
      margin: 0;
      font-family: ${F};
      font-size: 13px;
      line-height: 19px;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: ${C.heroTxt};
   }

   .cr-interactive .cr-h1 {
      margin: 18px 0 0 0;
      font-family: ${F};
      font-size: 46px;
      line-height: 51.5px;
      font-weight: 300;
      color: ${C.heroTxt};
   }

   .cr-interactive .cr-lead {
      margin: 18px 0 0 0;
      font-family: ${F};
      font-size: 19px;
      line-height: 27px;
      font-weight: 300;
      color: ${C.heroTxt};
   }

   .cr-interactive .cr-arrow {
      display: block;
      margin: 18px auto 0 auto;
   }

   /* the paper strip: 380 wide (54.2857%), its top 360 under the wall's top (59 under the hero) */
   .cr-interactive .cr-paper {
      width: 54.2857%;
      margin: 59px auto 0 auto;
      background-color: ${C.paper};
      box-shadow: 0 10px 30px ${C.paperShadow};
   }

   .cr-interactive .cr-sheet {
      display: -webkit-flex;
      display: flex;
      -webkit-flex-direction: column;
      flex-direction: column;
      -webkit-align-items: center;
      align-items: center;
      -webkit-justify-content: center;
      justify-content: center;
      height: 300px;
      padding: 40px;
      box-sizing: border-box;
      border-top: 2px dotted ${C.perforation};
      text-align: center;
   }

   .cr-interactive .cr-sheet-1 {
      border-top: 0;
   }

   .cr-interactive .cr-sheet-6 {
      height: 340px;
   }

   .cr-interactive .cr-s-hello {
      margin: 0;
      font-family: ${F};
      font-size: 30px;
      line-height: 43px;
      font-weight: 300;
      color: ${C.ink};
   }

   .cr-interactive .cr-s-txt {
      margin: 0;
      font-family: ${F};
      font-size: 21px;
      line-height: 31.5px;
      font-weight: 300;
      color: ${C.ink};
   }

   .cr-interactive .cr-s-big {
      margin: 0;
      font-family: ${F};
      font-size: 26px;
      line-height: 35.1px;
      font-weight: 400;
      color: ${C.ink};
   }

   .cr-interactive .cr-s-num {
      margin: 0;
      font-family: ${F};
      font-size: 64px;
      line-height: 64px;
      font-weight: 300;
      color: ${C.accent};
   }

   .cr-interactive .cr-s-fact {
      margin: 8px 0 0 0;
      font-family: ${F};
      font-size: 19px;
      line-height: 27.55px;
      font-weight: 300;
      color: ${C.ink};
   }

   .cr-interactive .cr-s-wish {
      margin: 0;
      font-family: ${F};
      font-size: 20px;
      line-height: 30px;
      font-weight: 300;
      color: ${C.ink};
   }

   .cr-interactive .cr-s-sign {
      margin: 14px 0 0 0;
      font-family: ${F};
      font-size: 17px;
      line-height: 25px;
      font-weight: 500;
      color: ${C.ink};
   }

   /* the tail: the paper ends 40 into the roll at the end of the scroll, 20 above the scroll area's bottom */
   .cr-interactive .cr-tail {
      height: 0;
      padding-bottom: ${pa(CUT - 40, 700)};
   }

   /* the roll layer: the board's 700 x 220 from the roll's top; over the bottom of the window, pointer-events: none so
      you can scroll through it */
   .cr-interactive .cr-desk {
      position: absolute;
      top: ${pa(WIN.desk - LAYER, WIN.desk)};
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 2;
      pointer-events: none;
   }

   .cr-interactive .cr-a {
      position: absolute;
      display: block;
      box-sizing: border-box;
   }

   .cr-interactive .cr-holder {
      ${lbox(90, 22, 78, 78)}
      border-radius: 12px;
      background-color: ${C.holder};
      box-shadow: 0 6px 14px rgba(0,0,0,0.35);
   }

   .cr-interactive .cr-bar {
      ${lbox(150, 52, 440, 18)}
      border-radius: 9px;
      background-color: ${C.holder};
   }

   .cr-interactive .cr-roll {
      ${lbox(150, 0, 400, 120)}
      border-radius: 22px;
      background-color: ${C.roll};
      box-shadow: inset 0 -16px 22px rgba(0,0,0,0.10), inset 0 10px 14px rgba(255,255,255,0.8), 0 12px 24px ${C.rollShadow};
   }

   .cr-interactive .cr-line-1,
   .cr-interactive .cr-line-2,
   .cr-interactive .cr-line-3 {
      left: ${lx(160)};
      width: ${lx(380)};
      height: 1px;
   }

   .cr-interactive .cr-line-1 {
      top: ${ly(12)};
      background-color: rgba(0,0,0,0.06);
   }

   .cr-interactive .cr-line-2 {
      top: ${ly(35)};
      background-color: rgba(0,0,0,0.05);
   }

   .cr-interactive .cr-line-3 {
      top: ${ly(85)};
      background-color: rgba(0,0,0,0.05);
   }

   .cr-interactive .cr-knob {
      ${lbox(548, 50, 22, 22)}
      border-radius: 50%;
      background-color: ${C.holder};
   }

   @media only screen and (max-width: 600px) {
      /* mobile: the window gets the phone proportion (${WIN.mob} of 700); the scroll area and the roll layer in % of it */
      .cr-interactive .cr-window {
         padding-bottom: ${pa(WIN.mob, 700)} !important;
      }

      .cr-interactive .cr-scroll {
         bottom: ${pa(LAYER - CUT, WIN.mob)} !important;
      }

      .cr-interactive .cr-desk {
         top: ${pa(WIN.mob - LAYER, WIN.mob)} !important;
      }

      .cr-interactive .cr-hero {
         padding: 40px 20px 0 20px !important;
      }

      .cr-h1 {
         font-size: 32px !important;
         line-height: 37px !important;
      }

      .cr-lead {
         font-size: 17px !important;
         line-height: 25px !important;
      }

      /* the paper: wider, lower sheets, smaller type */
      /* the paper tip at the start: the roll's top is at (1268 - 220) / 700 = 149.7% of the width; the paper starts
         about 25% of the width above it under a hero of about 240px: 149.7 - 25 = 124.7vw - 240px (on mobile the mail is
         as wide as the screen) */
      .cr-interactive .cr-paper {
         width: 72% !important;
         margin-top: calc(124.7vw - 240px) !important;
      }

      .cr-interactive .cr-sheet {
         height: 220px !important;
         padding: 20px !important;
      }

      .cr-interactive .cr-sheet-6 {
         height: 240px !important;
      }

      .cr-s-hello {
         font-size: 24px !important;
         line-height: 34px !important;
      }

      .cr-s-txt {
         font-size: 17px !important;
         line-height: 25px !important;
      }

      .cr-s-big {
         font-size: 20px !important;
         line-height: 27px !important;
      }

      .cr-s-num {
         font-size: 48px !important;
         line-height: 48px !important;
      }

      .cr-s-fact,
      .cr-s-wish {
         font-size: 16px !important;
         line-height: 23px !important;
      }

      .cr-s-sign {
         font-size: 15px !important;
         line-height: 22px !important;
      }

      /* the paper is wider on mobile (72%), so the roll is too (78%, 11-89%): the paper must always be narrower than
         the roll it comes out of. Holder, bar, lines and knob move along (same offsets as the board, in 700ths) */
      .cr-interactive .cr-roll {
         left: 11% !important;
         width: 78% !important;
         border-radius: 12px !important;
      }

      .cr-interactive .cr-holder {
         left: ${pa(0.11 * 700 - 60, 700)} !important;
         border-radius: 7px !important;
      }

      .cr-interactive .cr-bar {
         left: 11% !important;
         width: ${pa(0.78 * 700 + 40, 700)} !important;
      }

      .cr-interactive .cr-line-1,
      .cr-interactive .cr-line-2,
      .cr-interactive .cr-line-3 {
         left: ${pa(0.11 * 700 + 10, 700)} !important;
         width: ${pa(0.78 * 700 - 20, 700)} !important;
      }

      .cr-interactive .cr-knob {
         left: ${pa(0.89 * 700 - 2, 700)} !important;
      }

      .cr-fb-hero {
         padding: 40px 20px 32px 20px !important;
      }

      .cr-fb-paper-pad {
         padding: 0 16px !important;
      }

      .cr-fb-sheet {
         height: auto !important;
         padding: 32px 20px !important;
      }
   }

   @media only screen and (max-width: 400px) {
      .cr-h1 {
         font-size: 28px !important;
         line-height: 33px !important;
      }
   }

   /* Outlook.com / new Outlook: class names get an x_ prefix */
   [class~="x_cr-interactive"],
   [class~="x_cr-detect"]:checked ~ [class~="x_cr-interactive"] {
      display: none !important;
      max-height: 0 !important;
      overflow: hidden !important;
   }

   [class~="x_cr-fallback"],
   [class~="x_cr-detect"]:checked ~ [class~="x_cr-fallback"] {
      display: block !important;
      max-height: none !important;
      overflow: visible !important;
   }

   /* Samsung Mail: the message is wrapped in #MessageViewBody (the id outranks the activation selector) */
   #MessageViewBody .cr-interactive {
      display: none !important;
      max-height: 0 !important;
      overflow: hidden !important;
   }

   #MessageViewBody .cr-fallback {
      display: block !important;
      max-height: none !important;
      overflow: visible !important;
   }
</style>
<style type="text/css">
   /* Outlook apps: back to the fallback (separate style tag: the \\0 hack breaks the rest of a style tag) */
   .cr-interactive\\0,
   .cr-detect:checked ~ .cr-interactive\\0 {
      display: none !important;
      max-height: 0 !important;
      overflow: hidden !important;
   }

   .cr-fallback\\0,
   .cr-detect:checked ~ .cr-fallback\\0 {
      display: block !important;
      max-height: none !important;
      overflow: visible !important;
   }
</style>`;

// ---------------- markup ----------------
const ind = (s, n) => s.split('\n').map(l => l ? ' '.repeat(n) + l : l).join('\n');
const f = (size, lh, extra = '') => `font-family: ${F}; font-size: ${size}px; line-height: ${lh}px;${extra}`;
// the six sheets: [class, content] (the board's sheets, 300 high, the last 340)
const sheets = [
  [`<p class="cr-s-hello">txt_2</p>`],
  [`<p class="cr-s-txt">txt_3</p>`],
  [`<p class="cr-s-big">title_2</p>`],
  [`<p class="cr-s-num">title_3</p>`, `<p class="cr-s-fact">txt_4</p>`],
  [`<p class="cr-s-big">title_4</p>`],
  [`<p class="cr-s-wish">txt_5</p>`, `<p class="cr-s-sign">txt_6</p>`],
];
const arrow = `<svg class="cr-arrow" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${C.heroTxt}" stroke-width="1.5" stroke-linecap="round"><path d="M12 4v16M6 14l6 6 6-6"></path></svg>`;

const interactive = `<!--[if !mso]><!-->
<div class="cr-interactive" style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">
   <div class="cr-window">
      <div class="cr-scroll">
         <div class="cr-hero">
            <p class="cr-kicker">subtitle_1</p>
            <h1 class="cr-h1">title_1</h1>
            <p class="cr-lead">txt_1</p>
            ${arrow}
         </div>
         <div class="cr-paper">
${ind(sheets.map((s, i) => `<div class="cr-sheet cr-sheet-${i + 1}">\n${ind(s.join('\n'), 3)}\n</div>`).join('\n'), 12)}
         </div>
         <div class="cr-tail"></div>
      </div>
      <!-- the roll holder: stays still over the bottom of the window -->
      <div class="cr-desk">
         <div class="cr-a cr-holder"></div>
         <div class="cr-a cr-bar"></div>
         <div class="cr-a cr-roll"></div>
         <div class="cr-a cr-line-1"></div>
         <div class="cr-a cr-line-2"></div>
         <div class="cr-a cr-line-3"></div>
         <div class="cr-a cr-knob"></div>
      </div>
   </div>
</div>
<!--<![endif]-->`;

// fallback: "dezelfde papierstrook statisch onder elkaar, met de rol eronder" (artifact), in tables
const fbSheets = [
  [`<p style="margin: 0; ${f(30, 43, ' font-weight: 300;')} color: ${C.ink};">txt_2</p>`],
  [`<p style="margin: 0; ${f(21, 31.5, ' font-weight: 300;')} color: ${C.ink};" class="cr-s-txt">txt_3</p>`],
  [`<p style="margin: 0; ${f(26, 35, ' font-weight: 400;')} color: ${C.ink};" class="cr-s-big">title_2</p>`],
  [`<p style="margin: 0; ${f(64, 64, ' font-weight: 300;')} color: ${C.accent};">title_3</p>`, `<p style="margin: 8px 0 0 0; ${f(19, 27.5, ' font-weight: 300;')} color: ${C.ink};" class="cr-s-fact">txt_4</p>`],
  [`<p style="margin: 0; ${f(26, 35, ' font-weight: 400;')} color: ${C.ink};" class="cr-s-big">title_4</p>`],
  [`<p style="margin: 0; ${f(20, 30, ' font-weight: 300;')} color: ${C.ink};" class="cr-s-wish">txt_5</p>`, `<p style="margin: 14px 0 0 0; ${f(17, 25, ' font-weight: 500;')} color: ${C.ink};">txt_6</p>`],
];
const fallback = `<!-- fallback: "Gmail, Outlook en desktop zien de fallback: dezelfde papierstrook statisch onder elkaar, met de rol
     eronder" (artifact), in tables on the wall colour -->
<div class="cr-fallback">
   <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="${C.wall}">
      <tr>
         <td align="center" class="cr-fb-hero" style="padding: 70px 70px 59px 70px; background-color: ${C.wall}; background-image: ${grid}; word-wrap: break-word; overflow-wrap: break-word;">
            <p style="margin: 0; ${f(13, 19, ' letter-spacing: 0.3em; text-transform: uppercase;')} color: ${C.heroTxt};">subtitle_1</p>
            <h1 class="cr-h1" style="margin: 18px 0 0 0; ${f(46, 51.5, ' font-weight: 300;')} color: ${C.heroTxt};">title_1</h1>
            <p class="cr-lead" style="margin: 18px 0 0 0; ${f(19, 27, ' font-weight: 300;')} color: ${C.heroTxt};">txt_1</p>
         </td>
      </tr>
      <tr>
         <td align="center" class="cr-fb-paper-pad" style="padding: 0 160px; background-color: ${C.wall};">
            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="${C.paper}" style="max-width: 380px;">
${ind(fbSheets.map((s, i) => `<tr>
   <td align="center" valign="middle" height="${i === 5 ? 340 : 300}" class="cr-fb-sheet" style="height: ${i === 5 ? 340 : 300}px; padding: 40px;${i ? ` border-top: 2px dotted ${C.perforation};` : ''} word-wrap: break-word; overflow-wrap: break-word;">
${ind(s.join('\n'), 6)}
   </td>
</tr>`).join('\n'), 15)}
            </table>
         </td>
      </tr>
      <!-- the roll under the strip (simplified in tables: the holder and the roll; the artifact intends the holder as one
           image) -->
      <tr>
         <td align="center" style="padding: 24px 20px 100px 20px; background-color: ${C.wall};">
            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 460px;">
               <tr>
                  <td width="60" valign="middle" style="width: 60px; font-size: 0; line-height: 0;">
                     <table role="presentation" width="60" border="0" cellspacing="0" cellpadding="0" bgcolor="${C.holder}" style="width: 60px; border-radius: 12px 0 0 12px; border-collapse: separate;"><tr><td height="78" style="height: 78px; font-size: 0; line-height: 0;">&nbsp;</td></tr></table>
                  </td>
                  <td height="120" bgcolor="${C.roll}" style="height: 120px; border-radius: 22px; font-size: 0; line-height: 0;">&nbsp;</td>
               </tr>
            </table>
         </td>
      </tr>
   </table>
</div>`;

const body = `<!-- start ${NAME} -->
<!-- "Dit bedankje past niet op één velletje" (Claude Design artifact "Coram eindejaarsmail", concept 2): the thank-you
     rolls up out of a matte black toilet-roll holder while you scroll, sheet by sheet. Scroll window with the hero and
     the paper as live text; the holder is a fixed layer at the bottom of the window. Fallback (Gmail, Outlook,
     Samsung): the paper strip stacked with the roll below.
     Geometry and font sizes are the artifact's; colours and fonts are token values here (the Coram mail uses the
     artifact's). Built with interactive_artifact/coram/concept_2_niet_op_een_velletje/build/gen_rol.js: change the
     generator, not this file. -->
@@CSS@@
<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" align="center" bgcolor="${C.wall}">
   <tr>
      <td align="center" style="padding: 0;">
         <!--[if !mso]><!-->
         <input type="checkbox" class="cr-detect" checked style="display: none !important; mso-hide: all;">
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

module.exports = { build, DEFAULT, NAME, WIN, LAYER, CUT };

if (require.main === module) {
  const { block } = build(DEFAULT);
  fs.writeFileSync(OUT, block.replace(/\n/g, '\r\n'));
  console.log('written', OUT, Buffer.byteLength(block), 'bytes');
}
