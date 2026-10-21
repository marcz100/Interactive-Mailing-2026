// Hotspot "De straat van de uitersten" generator, a one-on-one email translation of the artifact board
// "B2C 1 · De straat van de uitersten" (Funda eindejaarsmails 2026). Values (sizes, spacing, behaviour) come from the
// board's markup and its DCLogic script. Token-driven: `node gen_straat.js` writes the repo block with default tokens
// and slot names; build(T) is reused by build_mail.js for the Funda mail with the artifact's colours and copy.
//   node gen_straat.js      (then run assemble.ps1 in HTML/ to rebuild the all-blocks file)
const fs = require('fs'), path = require('path');
const NAME = 'hotspot_1_col_row_1_subtitle_title_txt_row_2_icon_x7_row_3_img_badge_subtitle_title_txt_x6_txt_row_4_subtitle_title_txt_btn';
// build/ -> concept_1_straat_van_de_uitersten -> funda -> interactive_artifact -> HTML
const OUT = path.resolve(__dirname, '../../../../blocks/hotspot', `${NAME}.html`);

// default tokens (README token table); geometry and font sizes are the artifact's own
const DEFAULT = {
  font: 'Roboto,Arial,Helvetica,Verdana,sans-serif',
  outerClass: 'pml16 pmr16', outerPad: '0 24px 32px 24px', pageBg: '#fefefe', cardBg: '#ffffff',
  c: {
    sky: '#efefef', sub: '#9980FF', ink: '#050033', intro: '#444444', ground: '#444444',
    // the six houses: wall, roof, badge text
    houses: [['#9980FF', '#050033', '#ffffff'], ['#e6e6e6', '#9E9E9E', '#050033'], ['#050033', '#444444', '#ffffff'],
             ['#e3fc5e', '#9E9E9E', '#050033'], ['#9E9E9E', '#444444', '#ffffff'], ['#efefef', '#9E9E9E', '#050033']],
    h24: '#4d4d4d', roof24: '#050033', wreath: '#9980FF', lightsOff: '#9E9E9E', lightsOn: '#e3fc5e',
    win: '#050033', winLit: '#e3fc5e', winFrame: '#ffffff', door: '#ffffff', doorOpen: '#e3fc5e', doorLocked: '#9E9E9E', doorTxt: '#050033',
    hintLine: '#e6e6e6', hint: '#4d4d4d', cardLine: '#e6e6e6', photo: '#efefef', photoTxt: '#444444',
    rec: '#4d4d4d', value: '#050033', place: '#9980FF', line: '#444444', progress: '#4d4d4d',
    finale: '#050033', finaleLabel: '#e3fc5e', finaleTxt: '#ffffff', btn: '#e3fc5e', btnTxt: '#050033',
  },
};

const DOORS = [18, 19, 20, 21, 22, 23];
const CARDS = [1, 2, 3, 4, 5, 6];   // card i belongs to door DOORS[i-1]
// all six doors open (the inputs are siblings in this order, before the interactive div)
const ALL = DOORS.map(d => `.fd-c${d}:checked`).join(' ~ ');
const ANY = sel => DOORS.map(d => `   .fd-c${d}:checked ~ .fd-interactive ${sel}`).join(',\n');
// slot names per card: badge_i, subtitle_(i+1), title_(i+1), txt_(2i+2) place, txt_(2i+3) line, img_alt_i
const slot = i => ({ badge: `badge_${i}`, rec: `subtitle_${i + 1}`, value: `title_${i + 1}`, place: `txt_${2 * i + 2}`, line: `txt_${2 * i + 3}`, alt: `img_alt_${i}` });
// house heights from the artifact (walls in px; desktop, <= 600px, <= 400px share the same rounded proportions)
const HEIGHT = [150, 176, 128, 162, 144, 168];

function build(T) {
const C = T.c, F = T.font;
const H = DOORS.map((d, i) => ({ d, i: i + 1, wall: C.houses[i][0], roof: C.houses[i][1], ink: C.houses[i][2], h: HEIGHT[i] }));

const css = `<style type="text/css">
   /* "De straat van de uitersten" (artifact board B2C 1): a Christmas street as an advent calendar. Each house is a
      label for its own checkbox: tapping it opens the door, turns the light on and shows its record card. Opened
      doors stay open. Door 24 is locked until the six others are open; then its Christmas lights go on and it opens
      the finale with the wish and the CTA. Order: inputs, fallback, interactive. Interactive only in WebKit clients
      that support :checked (pre-checked .fd-detect); everything else keeps the fallback (all six cards and the
      finale, stacked). */
   @media screen and (-webkit-min-device-pixel-ratio: 0) {
      .fd-detect:checked ~ .fd-fallback {
         display: none !important;
         max-height: 0 !important;
         overflow: hidden !important;
      }

      .fd-detect:checked ~ .fd-interactive {
         display: block !important;
         max-height: none !important;
         overflow: visible !important;
      }
   }

   /* the street: 6 houses of 76 + house 24 of 84, 6px apart (576 wide), bottoms on the pavement */
   .fd-interactive .fd-street {
      display: -webkit-flex;
      display: flex;
      -webkit-justify-content: center;
      justify-content: center;
      -webkit-align-items: flex-end;
      align-items: flex-end;
      margin: 32px 0 0 0;
   }

   .fd-interactive .fd-house {
      display: block;
      margin: 0 3px;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
   }

   /* roof: a triangle made with borders (76 wide, 30 high) */
   .fd-interactive .fd-roof {
      width: 0;
      height: 0;
      margin: 0 auto;
      border-left: 38px solid transparent;
      border-right: 38px solid transparent;
      border-bottom: 30px solid ${C.roof24};
   }

   .fd-interactive .fd-wall {
      position: relative;
      width: 76px;
      margin: 0 auto;
      padding-top: 14px;
      box-sizing: border-box;
   }

   .fd-interactive .fd-win {
      width: 34px;
      height: 26px;
      margin: 0 auto;
      border: 3px solid ${C.winFrame};
      background-color: ${C.win};
      box-sizing: border-box;
      -webkit-transition: background-color 0.4s;
      transition: background-color 0.4s;
   }

   .fd-interactive .fd-door {
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 40px;
      height: 58px;
      margin-left: -20px;
      border-radius: 20px 20px 0 0;
      background-color: ${C.door};
      color: ${C.doorTxt};
      font-family: ${F};
      font-size: 15px;
      line-height: 58px;
      font-weight: 800;
      text-align: center;
      -webkit-transition: background-color 0.3s;
      transition: background-color 0.3s;
   }

${H.map(h => `   .fd-interactive .fd-h${h.d} .fd-roof {
      border-bottom-color: ${h.roof};
   }

   .fd-interactive .fd-h${h.d} .fd-wall {
      height: ${h.h}px;
      background-color: ${h.wall};
   }`).join('\n\n')}

   /* house 24: wider, Christmas lights and a wreath; locked until the six others are open */
   .fd-interactive .fd-h24 {
      pointer-events: none;
      cursor: default;
   }

   .fd-interactive .fd-h24 .fd-roof {
      border-left-width: 42px;
      border-right-width: 42px;
      border-bottom-width: 34px;
   }

   .fd-interactive .fd-h24 .fd-wall {
      width: 84px;
      height: 170px;
      background-color: ${C.h24};
   }

   .fd-interactive .fd-h24 .fd-door {
      width: 44px;
      height: 62px;
      margin-left: -22px;
      border-radius: 22px 22px 0 0;
      background-color: ${C.doorLocked};
      font-size: 16px;
      line-height: 62px;
   }

   .fd-interactive .fd-lights {
      width: 50px;
      height: 8px;
      margin: 0 auto;
      border-top: 3px dotted ${C.lightsOff};
   }

   .fd-interactive .fd-wreath {
      width: 38px;
      height: 38px;
      margin: 6px auto 0 auto;
      border: 6px solid ${C.wreath};
      border-radius: 50%;
      box-sizing: border-box;
   }

   /* the pavement runs inside the hero's 36px side padding (the houses may stick out over it, as in the artifact) */
   .fd-interactive .fd-ground {
      height: 22px;
      margin: 0 36px;
      background-color: ${C.ground};
   }

   /* an open door stays open: the house is no longer clickable, its light is on */
${DOORS.map(d => `   .fd-c${d}:checked ~ .fd-interactive .fd-h${d} {
      pointer-events: none;
      cursor: default;
   }

   .fd-c${d}:checked ~ .fd-interactive .fd-h${d} .fd-win {
      background-color: ${C.winLit};
   }

   .fd-c${d}:checked ~ .fd-interactive .fd-h${d} .fd-door {
      background-color: ${C.doorOpen};
   }`).join('\n\n')}

   /* all six open: the lights on 24 go on and door 24 can be opened */
   ${ALL} ~ .fd-interactive .fd-h24 {
      pointer-events: auto;
      cursor: pointer;
   }

   ${ALL} ~ .fd-interactive .fd-h24 .fd-door {
      background-color: ${C.door};
   }

   ${ALL} ~ .fd-interactive .fd-lights {
      border-top-color: ${C.lightsOn};
   }

   /* door 24 open: the finale (door 24 stays open) */
   ${ALL} ~ .fd-c24:checked ~ .fd-interactive .fd-h24 {
      pointer-events: none;
      cursor: default;
   }

   ${ALL} ~ .fd-c24:checked ~ .fd-interactive .fd-h24 .fd-door {
      background-color: ${C.doorOpen};
   }

   ${ALL} ~ .fd-c24:checked ~ .fd-interactive .fd-finale {
      display: block;
   }

   /* card area: 240 high at least (28 + 184 + 28) */
   .fd-interactive .fd-area {
      min-height: 184px;
   }

   .fd-interactive .fd-hint {
      padding: 36px;
      border: 2px dashed ${C.hintLine};
      border-radius: 8px;
      font-family: ${F};
      font-size: 15px;
      line-height: 18px;
      text-align: center;
      color: ${C.hint};
   }

   /* the record cards: all in one grid cell, so the box is as high as the tallest card and the card on top always
      covers the others. The newest is on top: every card starts the fd-stack animation (z-index counting down 100
      per second) when its door opens. Without animation support the highest door number shows. */
   .fd-interactive .fd-cards {
      display: none;
   }

${ANY('.fd-hint')} {
      display: none;
   }

${ANY('.fd-cards')} {
      display: -ms-grid;
      display: grid;
   }

   .fd-interactive .fd-card {
      position: relative;
      grid-area: 1 / 1;
      display: -webkit-flex;
      display: flex;
      visibility: hidden;
      border: 1px solid ${C.cardLine};
      border-radius: 8px;
      overflow: hidden;
      background-color: ${T.cardBg};
   }

${DOORS.map((d, i) => `   .fd-c${d}:checked ~ .fd-interactive .fd-card-${i + 1}`).join(',\n')} {
      visibility: visible;
      -webkit-animation: fd-stack 100000s linear forwards;
      animation: fd-stack 100000s linear forwards;
   }

   @-webkit-keyframes fd-stack {
      from {
         z-index: 10000000;
      }

      to {
         z-index: 1;
      }
   }

   @keyframes fd-stack {
      from {
         z-index: 10000000;
      }

      to {
         z-index: 1;
      }
   }

   .fd-interactive .fd-photo {
      display: -webkit-flex;
      display: flex;
      -webkit-flex: none;
      flex: none;
      -webkit-align-items: center;
      align-items: center;
      -webkit-justify-content: center;
      justify-content: center;
      /* 220 + 2x 12 padding = 244 wide, as in the artifact (content-box) */
      width: 220px;
      padding: 12px;
      box-sizing: content-box;
      background-color: ${C.photo};
      font-family: ${F};
      font-size: 13px;
      line-height: 18px;
      text-align: center;
      color: ${C.photoTxt};
   }

   .fd-interactive .fd-ctxt {
      padding: 20px;
      text-align: left;
      word-wrap: break-word;
      overflow-wrap: break-word;
   }

   .fd-interactive .fd-badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 3px;
      font-family: ${F};
      font-size: 12px;
      line-height: 14px;
      font-weight: 700;
   }

   .fd-interactive .fd-rec {
      margin: 10px 0 0 0;
      font-family: ${F};
      font-size: 14px;
      line-height: 17px;
      color: ${C.rec};
   }

   .fd-interactive .fd-value {
      margin: 2px 0 0 0;
      font-family: ${F};
      font-size: 26px;
      line-height: 32px;
      font-weight: 800;
      color: ${C.value};
   }

   .fd-interactive .fd-place {
      margin: 6px 0 0 0;
      font-family: ${F};
      font-size: 15px;
      line-height: 18px;
      color: ${C.place};
   }

   .fd-interactive .fd-line {
      margin: 10px 0 0 0;
      font-family: ${F};
      font-size: 14px;
      line-height: 21px;
      color: ${C.line};
   }

   /* progress: "Nog [n] deuren te gaan voor nummer 24." counts down with a CSS counter (6 minus the open doors);
      with all six open the other text shows */
   .fd-interactive .fd-progress {
      display: none;
      margin: 14px 0 0 0;
      counter-reset: fd-left 6;
      font-family: ${F};
      font-size: 13px;
      line-height: 15px;
      text-align: left;
      color: ${C.progress};
   }

${ANY('.fd-progress')} {
      display: block;
   }

${DOORS.map(d => `   .fd-c${d}:checked ~ .fd-interactive .fd-k${d}`).join(',\n')} {
      counter-increment: fd-left -1;
   }

   .fd-interactive .fd-left:before {
      content: counter(fd-left);
   }

   .fd-interactive .fd-all-txt {
      display: none;
   }

   ${ALL} ~ .fd-interactive .fd-left-txt {
      display: none;
   }

   ${ALL} ~ .fd-interactive .fd-all-txt {
      display: inline;
   }

   .fd-interactive .fd-finale {
      display: none;
      margin: 20px 0 0 0;
      padding: 32px;
      border-radius: 8px;
      background-color: ${C.finale};
      text-align: center;
   }

   .fd-interactive .fd-fin-label {
      margin: 0;
      font-family: ${F};
      font-size: 13px;
      line-height: 15px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: ${C.finaleLabel};
   }

   .fd-interactive .fd-fin-title {
      margin: 8px 0 0 0;
      font-family: ${F};
      font-size: 28px;
      line-height: 34px;
      font-weight: 800;
      color: ${C.finaleTxt};
   }

   .fd-interactive .fd-fin-txt {
      max-width: 420px;
      margin: 10px auto 22px auto;
      font-family: ${F};
      font-size: 16px;
      line-height: 24px;
      color: ${C.finaleTxt};
   }

   .fd-interactive .fd-fin-btn {
      display: inline-block;
      padding: 12px 22px;
      border-radius: 4px;
      background-color: ${C.btn};
      font-family: ${F};
      font-size: 16px;
      line-height: 19px;
      font-weight: 700;
      text-decoration: none;
      color: ${C.btnTxt};
   }

   /* dark mode: the finale button keeps its own colour (the head turns every link white) */
   @media (prefers-color-scheme: dark) {
      .fd-btn {
         color: ${C.btnTxt} !important;
      }
   }

   [data-ogsc] .fd-btn {
      color: ${C.btnTxt} !important;
   }

   @media only screen and (max-width: 600px) {
      .fd-h1 {
         font-size: 28px !important;
         line-height: 32px !important;
      }

      .fd-intro {
         font-size: 15px !important;
         line-height: 22px !important;
      }

      .fd-value {
         font-size: 22px !important;
         line-height: 28px !important;
      }

      .fd-fin-title {
         font-size: 24px !important;
         line-height: 30px !important;
      }

      /* record card: photo on top, text below (interactive and fallback) */
      .fd-interactive .fd-card {
         -webkit-flex-direction: column !important;
         flex-direction: column !important;
      }

      .fd-interactive .fd-photo {
         width: auto !important;
         height: 116px !important;
      }

      .fd-interactive .fd-ground {
         margin: 0 16px !important;
      }

      .fd-stack {
         display: block !important;
         width: 100% !important;
         max-width: 100% !important;
      }

      .fd-photo-fb {
         height: 140px !important;
      }

      .fd-interactive .fd-ctxt,
      .fd-cardtxt {
         padding: 16px !important;
      }

      .fd-interactive .fd-finale,
      .fd-finale-fb {
         padding: 24px !important;
      }

      /* the street: 7 houses side by side in about 340px */
      .fd-interactive .fd-house {
         margin: 0 2px !important;
      }

      .fd-interactive .fd-roof {
         border-left-width: 22px !important;
         border-right-width: 22px !important;
         border-bottom-width: 18px !important;
      }

      .fd-interactive .fd-wall {
         width: 44px !important;
         padding-top: 8px !important;
      }

      .fd-interactive .fd-win {
         width: 22px !important;
         height: 17px !important;
         border-width: 2px !important;
      }

      .fd-interactive .fd-door {
         width: 26px !important;
         height: 38px !important;
         margin-left: -13px !important;
         border-radius: 13px 13px 0 0 !important;
         font-size: 11px !important;
         line-height: 38px !important;
      }

${H.map(h => `      .fd-interactive .fd-h${h.d} .fd-wall {
         height: ${Math.round(h.h * 0.7)}px !important;
      }`).join('\n\n')}

      .fd-interactive .fd-h24 .fd-roof {
         border-left-width: 24px !important;
         border-right-width: 24px !important;
         border-bottom-width: 20px !important;
      }

      .fd-interactive .fd-h24 .fd-wall {
         width: 48px !important;
         height: 119px !important;
      }

      .fd-interactive .fd-h24 .fd-door {
         width: 28px !important;
         height: 40px !important;
         margin-left: -14px !important;
         border-radius: 14px 14px 0 0 !important;
         line-height: 40px !important;
      }

      .fd-interactive .fd-lights {
         width: 30px !important;
      }

      .fd-interactive .fd-wreath {
         width: 22px !important;
         height: 22px !important;
         margin-top: 4px !important;
         border-width: 4px !important;
      }
   }

   /* small phones (iPhone SE etc.): one step smaller */
   @media only screen and (max-width: 400px) {
      .fd-h1 {
         font-size: 24px !important;
         line-height: 28px !important;
      }

      .fd-value {
         font-size: 20px !important;
         line-height: 26px !important;
      }

      .fd-interactive .fd-house {
         margin: 0 1px !important;
      }

      .fd-interactive .fd-roof {
         border-left-width: 18px !important;
         border-right-width: 18px !important;
         border-bottom-width: 15px !important;
      }

      .fd-interactive .fd-wall {
         width: 36px !important;
      }

      .fd-interactive .fd-win {
         width: 18px !important;
         height: 14px !important;
      }

      .fd-interactive .fd-door {
         width: 22px !important;
         height: 32px !important;
         margin-left: -11px !important;
         border-radius: 11px 11px 0 0 !important;
         font-size: 10px !important;
         line-height: 32px !important;
      }

      .fd-interactive .fd-h24 .fd-roof {
         border-left-width: 20px !important;
         border-right-width: 20px !important;
         border-bottom-width: 17px !important;
      }

      .fd-interactive .fd-h24 .fd-wall {
         width: 40px !important;
      }

      .fd-interactive .fd-h24 .fd-door {
         width: 24px !important;
         height: 34px !important;
         margin-left: -12px !important;
         border-radius: 12px 12px 0 0 !important;
         line-height: 34px !important;
      }

      .fd-interactive .fd-lights {
         width: 24px !important;
      }

      .fd-interactive .fd-wreath {
         width: 18px !important;
         height: 18px !important;
         border-width: 3px !important;
      }
   }

   /* Outlook.com / new Outlook: class names get an x_ prefix */
   [class~="x_fd-interactive"],
   [class~="x_fd-detect"]:checked ~ [class~="x_fd-interactive"] {
      display: none !important;
      max-height: 0 !important;
      overflow: hidden !important;
   }

   [class~="x_fd-fallback"],
   [class~="x_fd-detect"]:checked ~ [class~="x_fd-fallback"] {
      display: block !important;
      max-height: none !important;
      overflow: visible !important;
   }

   /* Samsung Mail: the message is wrapped in #MessageViewBody (the id outranks the activation selector) */
   #MessageViewBody .fd-interactive {
      display: none !important;
      max-height: 0 !important;
      overflow: hidden !important;
   }

   #MessageViewBody .fd-fallback {
      display: block !important;
      max-height: none !important;
      overflow: visible !important;
   }
</style>
<style type="text/css">
   /* Outlook apps: back to the fallback (separate style tag: the \\0 hack breaks the rest of a style tag) */
   .fd-interactive\\0,
   .fd-detect:checked ~ .fd-interactive\\0 {
      display: none !important;
      max-height: 0 !important;
      overflow: hidden !important;
   }

   .fd-fallback\\0,
   .fd-detect:checked ~ .fd-fallback\\0 {
      display: block !important;
      max-height: none !important;
      overflow: visible !important;
   }
</style>`;

// ---------------- markup ----------------
const p = (style, txt, cls = '') => `<p${cls ? ` class="${cls}"` : ''} style="${style}">${txt}</p>`;
const FS = (size, lh, extra = '') => `font-family: ${F}; font-size: ${size}px; line-height: ${lh}px;${extra}`;

// fallback card: tables with inline styles (Gmail and Outlook need them)
const fbCard = (h, n) => {
  const s = slot(n);
  return `<!-- record card door ${h.d} (slot ${n}) -->
<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="${T.cardBg}" style="table-layout: fixed; border: 1px solid ${C.cardLine}; border-radius: 8px; border-collapse: separate; overflow: hidden;">
   <tr>
      <!-- photo placeholder: replace by <img width="220" style="display: block; width: 100%; height: auto;" alt="..."> when the photo arrives -->
      <!-- 244 = 220 + 2x 12 padding, as the artifact's photo box -->
      <td class="fd-stack fd-photo-fb" width="244" align="center" valign="middle" bgcolor="${C.photo}" style="width: 244px; padding: 12px; ${FS(13, 18)} color: ${C.photoTxt};">${s.alt}</td>
      <td class="fd-stack fd-cardtxt" align="left" valign="middle" style="padding: 20px; word-wrap: break-word; overflow-wrap: break-word;">
         <span style="display: inline-block; padding: 3px 8px; border-radius: 3px; background-color: ${h.wall}; color: ${h.ink}; ${FS(12, 14, ' font-weight: 700;')}">${s.badge}</span>
         ${p(`margin: 10px 0 0 0; ${FS(14, 17)} color: ${C.rec};`, s.rec)}
         ${p(`margin: 2px 0 0 0; ${FS(26, 32, ' font-weight: 800;')} color: ${C.value};`, s.value, 'fd-value')}
         ${p(`margin: 6px 0 0 0; ${FS(15, 18)} color: ${C.place};`, s.place)}
         ${p(`margin: 10px 0 0 0; ${FS(14, 21)} color: ${C.line};`, s.line)}
      </td>
   </tr>
</table>`;
};
const spacer = h => `<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td height="${h}" style="height: ${h}px; font-size: 0; line-height: 0;">&nbsp;</td></tr></table>`;

const fbFinale = `<!-- finale: door 24 -->
<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="${C.finale}" style="border-radius: 8px; border-collapse: separate;">
   <tr>
      <td align="center" class="fd-finale-fb" style="padding: 32px; word-wrap: break-word; overflow-wrap: break-word;">
         ${p(`margin: 0; ${FS(13, 15, ' font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;')} color: ${C.finaleLabel};`, 'subtitle_8')}
         ${p(`margin: 8px 0 0 0; ${FS(28, 34, ' font-weight: 800;')} color: ${C.finaleTxt};`, 'title_8', 'fd-fin-title')}
         ${p(`margin: 10px auto 22px auto; max-width: 420px; ${FS(16, 24)} color: ${C.finaleTxt};`, 'txt_17')}
         <!--[if mso]>
         <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://100procent.nl/" style="height:43px;v-text-anchor:middle;width:280px;" arcsize="9%" strokecolor="${C.btn}" fillcolor="${C.btn}">
            <w:anchorlock/>
            <center style="color:${C.btnTxt};font-family:${F};font-size:16px;font-weight:bold;">btn_txt_1</center>
         </v:roundrect>
         <![endif]-->
         <a class="fd-btn" href="https://100procent.nl/" target="_blank" style="display: inline-block; padding: 12px 22px; border-radius: 4px; background-color: ${C.btn}; color: ${C.btnTxt}; ${FS(16, 19, ' font-weight: 700;')} text-decoration: none; -webkit-text-size-adjust: none; mso-hide: all;">btn_txt_1</a>
      </td>
   </tr>
</table>`;

// interactive card: classes (two-class rules, email_rules 4.8)
const iaCard = (h, n) => {
  const s = slot(n);
  return `<div class="fd-card fd-card-${n}">
   <div class="fd-photo">${s.alt}</div>
   <div class="fd-ctxt">
      <span class="fd-badge" style="background-color: ${h.wall}; color: ${h.ink};">${s.badge}</span>
      <p class="fd-rec">${s.rec}</p>
      <p class="fd-value">${s.value}</p>
      <p class="fd-place">${s.place}</p>
      <p class="fd-line">${s.line}</p>
   </div>
</div>`;
};
const house = (d, label, inner) => `<label for="fd-c${d}" class="fd-house fd-h${d}" title="Open deur ${label}">
   <div class="fd-roof"></div>
   <div class="fd-wall">
${inner.map(l => '      ' + l).join('\n')}
   </div>
</label>`;
const ind = (s, n) => s.split('\n').map(l => l ? ' '.repeat(n) + l : l).join('\n');

const inputs = [`<input type="checkbox" class="fd-detect" checked style="display: none !important; mso-hide: all;">`,
  ...[...DOORS, 24].map(d => `<input type="checkbox" id="fd-c${d}" class="fd-c${d}" style="display: none !important; mso-hide: all;">`)].join('\n');

const intro = (txt, extraClass = '') => `<tr>
   <td align="center" class="pml16 pmr16${extraClass}" style="padding: 10px 36px 0 36px;">
      ${p(`margin: 0 auto; max-width: 440px; ${FS(16, 24)} color: ${C.intro};`, txt, 'fd-intro')}
   </td>
</tr>`;

const fallback = `<!-- fallback: the street as a static illustration with all doors open, all six cards stacked and the finale
     with the same CTA (artifact: "alle zes records als kaartjes onder elkaar, de straat als statische illustratie
     met open deuren") -->
<div class="fd-fallback">
   <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="${C.sky}">
${ind(intro('txt_2'), 6)}
      <tr>
         <td align="center" class="pml16 pmr16" style="padding: 32px 36px 0 36px;">
            <!-- street illustration placeholder: replace by <img width="568" style="display: block; width: 100%; max-width: 568px; height: auto;" alt="..."> when the illustration arrives -->
            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
               <tr>
                  <td align="center" valign="middle" height="200" bgcolor="${C.photo}" style="height: 200px; padding: 12px; ${FS(13, 18)} color: ${C.photoTxt};">img_alt_7</td>
               </tr>
            </table>
         </td>
      </tr>
      <tr>
         <td class="pml16 pmr16" style="padding: 0 36px;">
            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
               <tr>
                  <td height="22" bgcolor="${C.ground}" style="height: 22px; font-size: 0; line-height: 0;">&nbsp;</td>
               </tr>
            </table>
         </td>
      </tr>
   </table>
   <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
         <td align="left" class="pml16 pmr16" style="padding: 28px 36px;">
${ind(H.map((h, i) => fbCard(h, i + 1)).join('\n' + spacer(16) + '\n') + '\n' + spacer(20) + '\n' + fbFinale, 12)}
         </td>
      </tr>
   </table>
</div>`;

const street = [...H.map((h, i) => house(h.d, `label_${i + 1}`, ['<div class="fd-win"></div>', `<div class="fd-door">label_${i + 1}</div>`])),
  house(24, 'label_7', ['<div class="fd-lights"></div>', '<div class="fd-wreath"></div>', '<div class="fd-door">label_7</div>'])].join('\n');

const interactive = `<!--[if !mso]><!-->
<div class="fd-interactive" style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">
   <div style="background-color: ${C.sky};">
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
${ind(intro('txt_1'), 9)}
      </table>
      <!-- the street: each house is the label of its door's checkbox -->
      <div class="fd-street">
${ind(street, 9)}
      </div>
      <div class="fd-ground"></div>
   </div>
   <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
         <td align="left" valign="top" class="pml16 pmr16" style="padding: 28px 36px;">
            <div class="fd-area">
               <div class="fd-hint">txt_3</div>
               <div class="fd-cards">
${ind(H.map((h, i) => iaCard(h, i + 1)).join('\n'), 18)}
               </div>
               <p class="fd-progress">${DOORS.map(d => `<span class="fd-k${d}"></span>`).join('')}<span class="fd-left-txt">txt_16 <span class="fd-left"></span> txt_18</span><span class="fd-all-txt">txt_19</span></p>
               <div class="fd-finale">
                  <p class="fd-fin-label">subtitle_8</p>
                  <p class="fd-fin-title">title_8</p>
                  <p class="fd-fin-txt">txt_17</p>
                  <a class="fd-btn fd-fin-btn" href="https://100procent.nl/" target="_blank">btn_txt_1</a>
               </div>
            </div>
         </td>
      </tr>
   </table>
</div>
<!--<![endif]-->`;

const body = `<!-- start ${NAME} -->
<!-- "De straat van de uitersten" (Claude Design artifact "Funda eindejaarsmails 2026", board B2C 1): a Christmas
     street as an advent calendar. Seven houses are labels of checkboxes: every door you open stays open, turns its
     light on and shows its record card (the newest on top). Door 24 opens only when the six others are open: the
     finale with the wish and the CTA. Fallback (Gmail, Outlook, Samsung): the street as a static illustration, all
     six cards stacked and the finale.
     Geometry and font sizes are the artifact's; colours are token values here (the Funda mail uses Funda's).
     Built with interactive_artifact/funda/concept_1_straat_van_de_uitersten/build/gen_straat.js: change the
     generator, not this file. -->
@@CSS@@
<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" align="center" bgcolor="${T.pageBg}">
   <tr>
      <td align="center" style="padding: 0;">
         <!-- intro: subtitle and title shared by interactive and fallback -->
         <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="${C.sky}">
            <tr>
               <td align="center" class="pml16 pmr16 pmt24" style="padding: 40px 36px 0 36px; word-wrap: break-word; overflow-wrap: break-word;">
                  ${p(`margin: 0; ${FS(13, 15, ' font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;')} color: ${C.sub};`, 'subtitle_1')}
                  <h1 class="fd-h1" style="margin: 10px 0 0 0; ${FS(34, 39, ' font-weight: 800;')} color: ${C.ink};">title_1</h1>
               </td>
            </tr>
         </table>
         <!--[if !mso]><!-->
${ind(inputs, 9)}
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

module.exports = { build, DEFAULT, NAME };

if (require.main === module) {
  const { block } = build(DEFAULT);
  fs.writeFileSync(OUT, block.replace(/\n/g, '\r\n'));
  console.log('written', OUT, Buffer.byteLength(block), 'bytes');
}
