// "Post bij de receptie" generator, a one-on-one email translation of the artifact boards "De volledige kerstbrief"
// (PostReceptie.dc.html, 700 x 2200), "Zo komt de brief tevoorschijn" (PostMomenten) and "Techniek en inhoud"
// (PostTechniek). A scroll window (700 x 1000) holds the hero and the letter as live text; the counter with the
// envelope (700 x 280) is a fixed layer at the bottom of the window, so the letter seems to slide out of the envelope
// while you scroll. Token-driven: `node gen_post.js` writes the repo block with default tokens and slot names;
// build(T) is reused by build_mail.js for the WestCord mail with the artifact's values and copy.
//   node gen_post.js      (then run assemble.ps1 in HTML/ to rebuild the all-blocks file)
const fs = require('fs'), path = require('path');
const NAME = 'para_1_col_row_1_subtitle_title_txt_row_2_title_txt_x4_subtitle_txt_x6_subtitle_title_btn_title_txt_x4_row_3_title_icon';
// build/ -> concept_4_post_receptie -> westcord -> interactive_artifact -> HTML
// version 2: the envelope is closed; a click opens it and the letter's first part slides out by itself
const NAME_CLICK = NAME + '_click';
const OUT = name => path.resolve(__dirname, '../../../../blocks/para', `${name}.html`);

// default tokens (README token table); geometry and font sizes are the artifact's own
const DEFAULT = {
  font: 'Roboto,Arial,Helvetica,Verdana,sans-serif', fontH: 'Roboto Slab,Arial,Helvetica,Verdana,sans-serif',
  fontS: 'Roboto Slab,Arial,Helvetica,Verdana,sans-serif',   // the handwriting font in the artifact
  width: 600,
  c: {
    hero: '#050033', heroTxt: '#ffffff', heroSub: '#e3fc5e', heroP: '#efefef', bg: '#efefef',
    paper: '#ffffff', paperShadow: 'rgba(5,0,51,0.14)', ink: '#050033', soft: '#4d4d4d',
    stripe: ['#9980FF', '#ffffff', '#050033'], box: '#efefef', label: '#9980FF',
    card: '#9980FF', btn: '#9980FF', btnTxt: '#ffffff',
    envelope: '#ffffff', flapSide: '#efefef', flapBottom: '#e6e6e6', envShadow: 'rgba(5,0,51,0.28)',
    stamp: '#9980FF', stampTxt: '#ffffff', counter: '#050033', counterEdge: '#9980FF',
    leaf1: '#444444', leaf2: '#9E9E9E', berry1: '#9980FF', berry2: '#050033', bell: '#e6e6e6', bellBase: '#9E9E9E',
    flapTop: '#e6e6e6', seal: '#9980FF', sealTxt: '#ffffff',   // version 2 (click to open)
  },
};

// the counter scene: percentages of 700 x 280 (its top is y 1800 in the artifact)
const px = v => +(v / 700 * 100).toFixed(4) + '%';
const py = v => +(v / 280 * 100).toFixed(4) + '%';
const box = (l, t, w, h) => `left: ${px(l)}; top: ${py(t)}; width: ${px(w)}; height: ${py(h)};`;

function build(T, opts = {}) {
const CLICK = !!opts.click, NM = CLICK ? NAME_CLICK : NAME;
const C = T.c, F = T.font, FH = T.fontH, FS = T.fontS;
const stripe = `repeating-linear-gradient(90deg, ${C.stripe[0]} 0 14px, ${C.stripe[1]} 14px 18px, ${C.stripe[2]} 18px 32px, ${C.stripe[1]} 32px 36px)`;

// version 2: closed envelope (top flap + seal) over the counter; the whole counter layer is the label of .po-open.
// Closed: the window doesn't scroll and the letter waits inside the envelope (moved down out of view, behind the
// counter). Open: the flap folds up, the seal fades, then the letter slides up to its normal start position.
const clickCss = !CLICK ? '' : `   /* version 2, click to open: closed envelope, the counter layer is the label of .po-open */
   .po-interactive .po-scroll {
      overflow-y: hidden;
   }

   .po-open:checked ~ .po-interactive .po-scroll {
      overflow-y: auto;
   }

   /* the letter waits in the envelope: moved down just under the envelope top (desktop: letter 420 -> 750, the
      envelope starts at 734), so it comes out right away when the envelope opens */
   .po-interactive .po-letter {
      -webkit-transform: translateY(330px);
      transform: translateY(330px);
   }

   .po-open:checked ~ .po-interactive .po-letter {
      -webkit-transform: translateY(0);
      transform: translateY(0);
      -webkit-transition: -webkit-transform 1.4s cubic-bezier(0.25, 0.8, 0.3, 1) 0.45s;
      transition: transform 1.4s cubic-bezier(0.25, 0.8, 0.3, 1) 0.45s;
   }

   .po-interactive .po-open-label {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 5;
      display: block;
      cursor: pointer;
      pointer-events: auto;
      -webkit-tap-highlight-color: transparent;
   }

   .po-open:checked ~ .po-interactive .po-open-label {
      display: none;
   }

   /* the top flap: closed it points down to the middle of the envelope; opening folds it up */
   .po-interactive .po-flap-t {
      ${box(100, 14, 500, 210)}
      background-color: ${C.flapTop};
      -webkit-clip-path: polygon(0 0, 100% 0, 50% 50%);
      clip-path: polygon(0 0, 100% 0, 50% 50%);
      -webkit-transform-origin: 50% 0;
      transform-origin: 50% 0;
   }

   .po-open:checked ~ .po-interactive .po-flap-t {
      -webkit-transform: scaleY(0);
      transform: scaleY(0);
      -webkit-transition: -webkit-transform 0.5s ease-in;
      transition: transform 0.5s ease-in;
   }

   /* closed, the envelope's back is white (nothing shows through); it opens up together with the flap */
   .po-interactive .po-env {
      background-color: ${C.envelope};
   }

   /* closed, the stamp is whole (the top flap covers the opening); open, it is cut along the right flap like version 1 */
   .po-interactive .po-stamp-clip {
      -webkit-clip-path: none;
      clip-path: none;
   }

   .po-open:checked ~ .po-interactive .po-stamp-clip {
      -webkit-clip-path: polygon(100% 0, 52% 58%, 100% 100%);
      clip-path: polygon(100% 0, 52% 58%, 100% 100%);
   }

   .po-open:checked ~ .po-interactive .po-env {
      background-color: transparent;
      -webkit-transition: background-color 0.3s 0.3s;
      transition: background-color 0.3s 0.3s;
   }

   /* the seal on the tip of the flap (x 350, y 119), pulsing until it is clicked */
   .po-interactive .po-seal {
      display: -webkit-flex;
      display: flex;
      -webkit-align-items: center;
      align-items: center;
      -webkit-justify-content: center;
      justify-content: center;
      ${box(328, 97, 44, 44)}
      border: 2px solid ${C.sealTxt};
      border-radius: 50%;
      background-color: ${C.seal};
      font-family: ${FH};
      font-size: 20px;
      line-height: 20px;
      color: ${C.sealTxt};
      -webkit-animation: po-pulse 1.4s ease-in-out infinite;
      animation: po-pulse 1.4s ease-in-out infinite;
   }

   .po-open:checked ~ .po-interactive .po-seal {
      opacity: 0;
      -webkit-animation: none;
      animation: none;
      -webkit-transition: opacity 0.2s;
      transition: opacity 0.2s;
   }

   @-webkit-keyframes po-pulse {
      0%, 100% {
         -webkit-transform: scale(1);
      }

      50% {
         -webkit-transform: scale(1.12);
      }
   }

   @keyframes po-pulse {
      0%, 100% {
         transform: scale(1);
      }

      50% {
         transform: scale(1.12);
      }
   }

   @media only screen and (max-width: 600px) {
      /* mobile: the envelope top sits at about 123% of the width in the window, the letter starts under the hero
         (about 300px); 120vw - 230px keeps the letter just inside the envelope from 320 to 600px wide */
      .po-interactive .po-letter {
         -webkit-transform: translateY(calc(120vw - 230px));
         transform: translateY(calc(120vw - 230px));
      }

      .po-open:checked ~ .po-interactive .po-letter {
         -webkit-transform: translateY(0);
         transform: translateY(0);
      }

      /* the mobile envelope (3%, 0, 94% x 82.25% of the layer); the flap tip at 41.1%, the seal 9% of the width */
      .po-interactive .po-flap-t {
         left: 3% !important;
         top: 0 !important;
         width: 94% !important;
         height: 82.25% !important;
      }

      .po-interactive .po-seal {
         left: 45.5% !important;
         top: 31.7% !important;
         width: 9% !important;
         height: 18.75% !important;
         font-size: 16px !important;
         line-height: 16px !important;
      }
   }

`;
const css = `<style type="text/css">
   /* Post bij de receptie (artifact "De volledige kerstbrief"): a scroll window (700 x 1000) with the hero and the
      letter as live text, and the counter with the envelope (700 x 280) as a fixed layer over the bottom of the
      window. The letter scrolls behind the counter, so it seems to slide out of the envelope. At the end of the
      scroll the content's bottom meets the window's bottom: the letter's last 60 (and the 220 tail) sit behind the
      counter, exactly where the artifact puts the letter (1860) against the counter (1800-2080).
      Order: input, fallback, interactive. Interactive only in WebKit clients that support :checked (pre-checked
      .po-detect); everything else keeps the fallback: the letter as a normal mail with the envelope below. */
   @media screen and (-webkit-min-device-pixel-ratio: 0) {
      .po-detect:checked ~ .po-fallback {
         display: none !important;
         max-height: 0 !important;
         overflow: hidden !important;
      }

      .po-detect:checked ~ .po-interactive {
         display: block !important;
         max-height: none !important;
         overflow: visible !important;
      }
   }

   /* 142.8571% = 1000 / 700 */
   .po-interactive .po-window {
      position: relative;
      height: 0;
      padding-bottom: 142.8571%;
      overflow: hidden;
      background-color: ${C.bg};
   }

   .po-interactive .po-scroll {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      overflow-x: hidden;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
   }

   /* no scrollbar: it would make the content narrower than the counter layer (the hero says "Scroll maar") */
   .po-interactive .po-scroll::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
   }

   /* hero: 360 high, navy (artifact 0-360) */
   .po-interactive .po-hero {
      min-height: 360px;
      padding: 36px 70px 5px 70px;
      box-sizing: border-box;
      background-color: ${C.hero};
      text-align: center;
      color: ${C.heroTxt};
   }

   .po-interactive .po-logo {
      margin: 0;
      font-family: ${FH};
      font-size: 40px;
      line-height: 40px;
      color: ${C.heroTxt};
   }

   .po-interactive .po-logo-sub {
      margin: 2px 0 0 0;
      padding-left: 0.5em;
      font-family: ${F};
      font-size: 11px;
      line-height: 18px;
      letter-spacing: 0.5em;
      text-transform: uppercase;
      color: ${C.heroTxt};
   }

   .po-interactive .po-kicker {
      margin: 44px 0 0 0;
      font-family: ${F};
      font-size: 14px;
      line-height: 23px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: ${C.heroSub};
   }

   .po-interactive .po-h1 {
      margin: 14px 0 0 0;
      font-family: ${FH};
      font-size: 52px;
      line-height: 54.6px;
      font-weight: 500;
      color: ${C.heroTxt};
   }

   .po-interactive .po-lead {
      margin: 14px 0 0 0;
      font-family: ${F};
      font-size: 19px;
      line-height: 27.55px;
      color: ${C.heroP};
   }

   /* the letter: 440 wide (artifact x 130-570), 60 under the hero, 1440 high on desktop (content + white paper) */
   .po-interactive .po-letter {
      width: 62.8571%;
      margin: 60px auto 0 auto;
      padding: 0 40px 198px 40px;
      box-sizing: border-box;
      background-color: ${C.paper};
      box-shadow: 0 10px 30px ${C.paperShadow};
      font-family: ${FH};
      font-size: 19px;
      line-height: 29.45px;
      text-align: left;
      color: ${C.ink};
   }

   /* the tail under the letter: at the end of the scroll the letter ends 124 under the counter layer's top (110 into
      the envelope), below the tip of the bottom flap (14 + 42% of 210 = 102), so the paper's bottom edge never shows
      in the open envelope. 22.2857% = (280 - 124) / 700. (The artifact ends it 60 under: with its opaque counter band
      that didn't show; here the envelope is open, see below.) */
   .po-interactive .po-tail {
      height: 0;
      padding-bottom: 22.2857%;
   }

   .po-interactive .po-stripe {
      height: 10px;
      margin: 0 -40px;
      background-color: ${C.stripe[0]};
      background-image: ${stripe};
   }

   .po-interactive .po-head {
      padding: 34px 0 0 0;
      text-align: center;
   }

   .po-interactive .po-head-logo {
      margin: 0;
      font-family: ${FH};
      font-size: 32px;
      line-height: 32px;
      color: ${C.ink};
   }

   .po-interactive .po-head-sub {
      margin: 2px 0 0 0;
      padding-left: 0.5em;
      font-family: ${F};
      font-size: 10px;
      line-height: 16px;
      letter-spacing: 0.5em;
      text-transform: uppercase;
      color: ${C.ink};
   }

   .po-interactive .po-since {
      margin: 6px 0 0 0;
      font-family: ${FH};
      font-size: 15px;
      line-height: 23px;
      font-style: italic;
      color: ${C.soft};
   }

   .po-interactive .po-date {
      margin: 20px 0 0 0;
      font-family: ${FH};
      font-size: 16px;
      line-height: 25px;
      font-style: italic;
      text-align: right;
      color: ${C.soft};
   }

   .po-interactive .po-hello {
      margin: 20px 0 0 0;
      font-family: ${FS};
      font-size: 34px;
      line-height: 37px;
      color: ${C.ink};
   }

   /* letter paragraphs need their own size: the head sets p to 16px */
   .po-interactive .po-p {
      margin: 20px 0 0 0;
      font-family: ${FH};
      font-size: 19px;
      line-height: 29.45px;
      color: ${C.ink};
   }

   .po-interactive .po-sign .po-p {
      margin: 0;
   }

   .po-interactive .po-box {
      margin: 20px 0 0 0;
      padding: 18px 20px;
      border-radius: 4px;
      background-color: ${C.box};
      font-family: ${F};
      font-size: 15px;
      line-height: 21px;
   }

   .po-interactive .po-label {
      margin: 0;
      font-family: ${F};
      font-size: 11px;
      line-height: 15px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: ${C.label};
   }

   .po-interactive .po-row {
      display: -webkit-flex;
      display: flex;
      -webkit-justify-content: space-between;
      justify-content: space-between;
      margin: 8px 0 0 0;
   }

   .po-interactive .po-val {
      padding-left: 12px;
      font-weight: 600;
      text-align: right;
   }

   /* the gift card: dashed, turned 1.5 degrees */
   .po-interactive .po-card {
      margin: 20px 0 0 0;
      padding: 22px;
      border: 2px dashed ${C.card};
      border-radius: 6px;
      text-align: center;
      -webkit-transform: rotate(-1.5deg);
      transform: rotate(-1.5deg);
   }

   .po-interactive .po-card .po-label {
      line-height: 17px;
   }

   .po-interactive .po-offer {
      margin: 12px 0 0 0;
      font-family: ${FH};
      font-size: 26px;
      line-height: 30px;
      color: ${C.ink};
   }

   .po-interactive .po-btn {
      display: inline-block;
      margin: 12px 0 0 0;
      padding: 11px 20px;
      border-radius: 4px;
      background-color: ${C.btn};
      font-family: ${F};
      font-size: 16px;
      line-height: 24px;
      font-weight: 600;
      text-decoration: none;
      color: ${C.btnTxt};
   }

   .po-interactive .po-sign {
      margin: 20px 0 0 0;
   }

   .po-interactive .po-family {
      margin: 2px 0 0 0;
      font-family: ${FS};
      font-size: 44px;
      line-height: 48px;
      color: ${C.ink};
   }

   .po-interactive .po-team {
      margin: 2px 0 0 0;
      font-family: ${FH};
      font-size: 16px;
      line-height: 25px;
      font-style: italic;
      color: ${C.soft};
   }

   .po-interactive .po-ps {
      margin: 20px 0 0 0;
      font-family: ${FS};
      font-size: 26px;
      line-height: 31px;
      color: ${C.ink};
   }

   /* the counter with the envelope: fixed over the bottom of the window (40% = 280 / 700), above the scrolling letter;
      pointer-events: none so you can scroll through it */
   .po-interactive .po-desk {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 2;
      height: 0;
      padding-bottom: 40%;
      pointer-events: none;
   }

   .po-interactive .po-a {
      position: absolute;
      display: block;
      box-sizing: border-box;
   }

   .po-interactive .po-counter {
      ${box(0, 206, 700, 74)}
      background-color: ${C.counter};
      box-shadow: inset 0 4px 0 ${C.counterEdge};
   }

   /* the envelope is open at the back (feedback): the layer has no background band and the envelope's back is
      transparent, so the letter shows in the opening between the side flaps and above the bottom flap, and goes
      straight into the envelope. Only the strips beside the letter (desktop: 100-130 and 570-600) are the white back,
      so the envelope doesn't look see-through. The shadow stays (an outer shadow isn't painted under the box). */
   .po-interactive .po-env {
      ${box(100, 14, 500, 210)}
      border-radius: 4px;
      background-color: transparent;
      box-shadow: 0 12px 26px ${C.envShadow};
   }

   .po-interactive .po-back-l {
      ${box(100, 14, 30, 210)}
      border-radius: 4px 0 0 4px;
      background-color: ${C.envelope};
   }

   .po-interactive .po-back-r {
      ${box(570, 14, 30, 210)}
      border-radius: 0 4px 4px 0;
      background-color: ${C.envelope};
   }

   .po-interactive .po-flap-l,
   .po-interactive .po-flap-r,
   .po-interactive .po-flap-b {
      ${box(100, 14, 500, 210)}
      background-color: ${C.flapSide};
   }

   .po-interactive .po-flap-l {
      -webkit-clip-path: polygon(0 0, 48% 58%, 0 100%);
      clip-path: polygon(0 0, 48% 58%, 0 100%);
   }

   .po-interactive .po-flap-r {
      -webkit-clip-path: polygon(100% 0, 52% 58%, 100% 100%);
      clip-path: polygon(100% 0, 52% 58%, 100% 100%);
   }

   .po-interactive .po-flap-b {
      border-radius: 0 0 4px 4px;
      background-color: ${C.flapBottom};
      -webkit-clip-path: polygon(0 100%, 50% 42%, 100% 100%);
      clip-path: polygon(0 100%, 50% 42%, 100% 100%);
   }

   .po-interactive .po-to {
      left: ${px(100)};
      top: ${py(150)};
      width: ${px(500)};
      font-family: ${FS};
      font-size: 34px;
      line-height: 43px;
      text-align: center;
      color: ${C.ink};
   }

   /* the stamp sits on the right flap (feedback): a box the size of the envelope, clipped to the right flap's shape, so
      the part of the stamp above the flap's edge is gone (the letter shows there in the open envelope) */
   .po-interactive .po-stamp-clip {
      ${box(100, 14, 500, 210)}
      -webkit-clip-path: polygon(100% 0, 52% 58%, 100% 100%);
      clip-path: polygon(100% 0, 52% 58%, 100% 100%);
   }

   /* in % of the envelope: x 518-100 = 418 of 500, y 40-14 = 26 of 210, 56 x 68 */
   .po-interactive .po-stamp {
      display: -webkit-flex;
      display: flex;
      -webkit-flex-direction: column;
      flex-direction: column;
      -webkit-align-items: center;
      align-items: center;
      -webkit-justify-content: center;
      justify-content: center;
      left: 83.6%;
      top: 12.381%;
      width: 11.2%;
      height: 32.381%;
      border: 3px dashed ${C.stampTxt};
      outline: 2px solid ${C.stamp};
      background-color: ${C.stamp};
      color: ${C.stampTxt};
   }

   .po-interactive .po-stamp-wc {
      font-family: ${FH};
      font-size: 18px;
      line-height: 18px;
   }

   .po-interactive .po-stamp-year {
      font-family: ${F};
      font-size: 11px;
      line-height: 16px;
   }

   /* plant and bell on the counter (decoration, as in the artifact) */
   .po-interactive .po-leaf-1 {
      ${box(22, 160, 34, 20)}
      border-radius: 50%;
      background-color: ${C.leaf1};
      -webkit-transform: rotate(-30deg);
      transform: rotate(-30deg);
   }

   .po-interactive .po-leaf-2 {
      ${box(50, 156, 34, 20)}
      border-radius: 50%;
      background-color: ${C.leaf2};
      -webkit-transform: rotate(25deg);
      transform: rotate(25deg);
   }

   .po-interactive .po-berry-1 {
      ${box(44, 176, 12, 12)}
      border-radius: 50%;
      background-color: ${C.berry1};
   }

   .po-interactive .po-berry-2 {
      ${box(56, 182, 12, 12)}
      border-radius: 50%;
      background-color: ${C.berry2};
   }

   .po-interactive .po-bell {
      ${box(626, 172, 44, 24)}
      border-radius: 22px 22px 0 0;
      background-color: ${C.bell};
   }

   .po-interactive .po-bell-base {
      ${box(618, 196, 60, 8)}
      border-radius: 3px;
      background-color: ${C.bellBase};
   }

   .po-interactive .po-bell-top {
      ${box(644, 164, 8, 8)}
      border-radius: 50%;
      background-color: ${C.bellBase};
   }

   /* dark mode: the button keeps its own colour (the head turns every link white) */
   @media (prefers-color-scheme: dark) {
      .po-btn-link {
         color: ${C.btnTxt} !important;
      }
   }

   [data-ogsc] .po-btn-link {
      color: ${C.btnTxt} !important;
   }

   @media only screen and (max-width: 600px) {
      /* mobile: a taller window, 1200 of 700 (171.4286%), so more of the letter is in view above the counter */
      .po-interactive .po-window {
         padding-bottom: 171.4286% !important;
      }

      .po-interactive .po-hero {
         min-height: 0 !important;
         padding: 28px 24px 32px 24px !important;
      }

      .po-interactive .po-logo {
         font-size: 32px !important;
         line-height: 32px !important;
      }

      .po-interactive .po-kicker {
         margin-top: 28px !important;
         font-size: 12px !important;
         line-height: 18px !important;
      }

      .po-h1 {
         font-size: 34px !important;
         line-height: 38px !important;
      }

      .po-lead {
         font-size: 16px !important;
         line-height: 24px !important;
      }

      /* the letter: wide paper with readable type, but narrower than the envelope (94%); less white paper under the P.S. */
      .po-interactive .po-letter {
         width: 84% !important;
         margin-top: 32px !important;
         padding: 0 20px 120px 20px !important;
      }

      .po-interactive .po-p {
         font-size: 17px !important;
         line-height: 26px !important;
      }

      .po-interactive .po-stripe {
         margin: 0 -20px !important;
      }

      .po-interactive .po-p,
      .po-interactive .po-hello,
      .po-interactive .po-box,
      .po-interactive .po-card,
      .po-interactive .po-sign,
      .po-interactive .po-ps,
      .po-interactive .po-date {
         margin-top: 16px !important;
      }

      .po-interactive .po-hello,
      .po-fb-hello {
         font-size: 30px !important;
         line-height: 33px !important;
      }

      .po-interactive .po-box {
         padding: 14px 16px !important;
      }

      .po-interactive .po-card {
         padding: 18px 14px !important;
      }

      .po-offer {
         font-size: 22px !important;
         line-height: 26px !important;
      }

      .po-interactive .po-family,
      .po-fb-family {
         font-size: 36px !important;
         line-height: 40px !important;
      }

      .po-interactive .po-ps,
      .po-fb-ps {
         font-size: 22px !important;
         line-height: 27px !important;
      }

      /* mobile counter scene (own layout): no plant and bell, the envelope 94% wide right at the top of the layer (no
         band above it, so the letter goes straight into the envelope), the counter under it. The layer is 48% of the
         width high (envelope 94% x 500:210 = 39.48%, 82.25% of the layer); the layer has no background, the letter
         (84% wide, narrower than the envelope) disappears behind the envelope and the counter. */
      .po-interactive .po-desk {
         padding-bottom: 48% !important;
         background-color: transparent !important;
      }

      .po-interactive .po-leaf-1,
      .po-interactive .po-leaf-2,
      .po-interactive .po-berry-1,
      .po-interactive .po-berry-2,
      .po-interactive .po-bell,
      .po-interactive .po-bell-base,
      .po-interactive .po-bell-top {
         display: none !important;
      }

      .po-interactive .po-counter {
         top: 76% !important;
         height: 24% !important;
      }

      .po-interactive .po-env,
      .po-interactive .po-flap-l,
      .po-interactive .po-flap-r,
      .po-interactive .po-flap-b,
      .po-interactive .po-stamp-clip {
         left: 3% !important;
         top: 0 !important;
         width: 94% !important;
         height: 82.25% !important;
      }

      /* the name keeps its place on the envelope: 64.8% down (150-14 of 210); the stamp is in % of the envelope already */
      .po-interactive .po-to {
         left: 3% !important;
         top: 53.3% !important;
         width: 94% !important;
         font-size: 25px !important;
         line-height: 30px !important;
      }

      .po-interactive .po-stamp {
         border-width: 2px !important;
         outline-width: 1px !important;
      }

      .po-interactive .po-stamp-wc {
         font-size: 13px !important;
         line-height: 13px !important;
      }

      .po-interactive .po-stamp-year {
         font-size: 9px !important;
         line-height: 11px !important;
      }

      /* the white back beside the letter (letter 84% = 8-92%, envelope 3-97%) */
      .po-interactive .po-back-l,
      .po-interactive .po-back-r {
         top: 0 !important;
         width: 5% !important;
         height: 82.25% !important;
      }

      .po-interactive .po-back-l {
         left: 3% !important;
      }

      .po-interactive .po-back-r {
         left: 92% !important;
      }

      /* the tail: the letter ends 21.6% of the width (45% of the layer) under the envelope top, below the tip of the
         bottom flap (42% of the envelope = 34.5% of the layer) (48% - 21.6% = 26.4%) */
      .po-interactive .po-tail {
         padding-bottom: 26.4% !important;
      }

      /* fallback letter: full width */
      .po-fb-pad {
         padding: 32px 16px 0 16px !important;
      }

      .po-fb-paper {
         padding: 0 20px 32px 20px !important;
      }

      .po-fb-env {
         padding: 14px 16px 0 16px !important;
      }
   }

   @media only screen and (max-width: 400px) {
      .po-h1 {
         font-size: 30px !important;
         line-height: 34px !important;
      }

      /* a tighter hero, so the letterhead still shows above the envelope at the start */
      .po-interactive .po-hero {
         padding: 24px 20px 24px 20px !important;
      }

      .po-interactive .po-kicker {
         margin-top: 20px !important;
      }

      .po-interactive .po-letter {
         width: 84% !important;
         margin-top: 20px !important;
         padding: 0 16px 104px 16px !important;
      }

      .po-interactive .po-stripe {
         margin: 0 -16px !important;
      }

      .po-interactive .po-to {
         font-size: 23px !important;
         line-height: 28px !important;
      }

      .po-interactive .po-stamp-wc {
         font-size: 12px !important;
         line-height: 12px !important;
      }

      .po-interactive .po-stamp-year {
         font-size: 8px !important;
         line-height: 10px !important;
      }
   }

${CLICK ? clickCss : ''}   /* Outlook.com / new Outlook: class names get an x_ prefix */
   [class~="x_po-interactive"],
   [class~="x_po-detect"]:checked ~ [class~="x_po-interactive"] {
      display: none !important;
      max-height: 0 !important;
      overflow: hidden !important;
   }

   [class~="x_po-fallback"],
   [class~="x_po-detect"]:checked ~ [class~="x_po-fallback"] {
      display: block !important;
      max-height: none !important;
      overflow: visible !important;
   }

   /* Samsung Mail: the message is wrapped in #MessageViewBody (the id outranks the activation selector) */
   #MessageViewBody .po-interactive {
      display: none !important;
      max-height: 0 !important;
      overflow: hidden !important;
   }

   #MessageViewBody .po-fallback {
      display: block !important;
      max-height: none !important;
      overflow: visible !important;
   }
</style>
<style type="text/css">
   /* Outlook apps: back to the fallback (separate style tag: the \\0 hack breaks the rest of a style tag) */
   .po-interactive\\0,
   .po-detect:checked ~ .po-interactive\\0 {
      display: none !important;
      max-height: 0 !important;
      overflow: hidden !important;
   }

   .po-fallback\\0,
   .po-detect:checked ~ .po-fallback\\0 {
      display: block !important;
      max-height: none !important;
      overflow: visible !important;
   }
</style>`;

// ---------------- markup ----------------
const ind = (s, n) => s.split('\n').map(l => l ? ' '.repeat(n) + l : l).join('\n');
const f = (fam, size, lh, extra = '') => `font-family: ${fam}; font-size: ${size}px; line-height: ${lh}px;${extra}`;
const rows = [['txt_6', 'txt_7'], ['txt_8', 'txt_9'], ['txt_10', 'txt_11']];

// fallback: tables with inline styles (Gmail and Outlook need them)
const fbP = (txt, extra = '') => `<p style="margin: 20px 0 0 0; ${f(FH, 19, 29.45)} color: ${C.ink};${extra}">${txt}</p>`;
const fallback = `<!-- fallback: the letter as a normal mail with the envelope below (artifact: "Andere mailprogramma's krijgen de
     brief als gewone mail, met de envelop eronder") -->
<div class="po-fallback">
   <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="${C.hero}">
      <tr>
         <td align="center" class="pml16 pmr16" style="padding: 36px 70px 40px 70px; word-wrap: break-word; overflow-wrap: break-word;">
            <p style="margin: 0; ${f(FH, 40, 40)} color: ${C.heroTxt};">label_1</p>
            <p style="margin: 2px 0 0 0; padding-left: 0.5em; ${f(F, 11, 18, ' letter-spacing: 0.5em; text-transform: uppercase;')} color: ${C.heroTxt};">label_2</p>
            <p style="margin: 44px 0 0 0; ${f(F, 14, 23, ' letter-spacing: 0.14em; text-transform: uppercase;')} color: ${C.heroSub};">subtitle_1</p>
            <h1 class="po-h1" style="margin: 14px 0 0 0; ${f(FH, 52, 54.6, ' font-weight: 500;')} color: ${C.heroTxt};">title_1</h1>
            <p class="po-lead" style="margin: 14px 0 0 0; ${f(F, 19, 27.55)} color: ${C.heroP};">txt_1</p>
         </td>
      </tr>
   </table>
   <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="${C.bg}">
      <tr>
         <td align="center" class="po-fb-pad" style="padding: 60px 130px 0 130px;">
            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="${C.paper}" style="max-width: 440px; table-layout: fixed;">
               <tr>
                  <!-- the letterhead stripe (the gradient shows where supported, the stripe colour elsewhere) -->
                  <td height="10" bgcolor="${C.stripe[0]}" style="height: 10px; font-size: 0; line-height: 0; background-color: ${C.stripe[0]}; background-image: ${stripe};">&nbsp;</td>
               </tr>
               <tr>
                  <td align="left" class="po-fb-paper" style="padding: 0 40px 40px 40px; word-wrap: break-word; overflow-wrap: break-word;">
                     <p style="margin: 0; padding-top: 34px; ${f(FH, 32, 32)} text-align: center; color: ${C.ink};">label_3</p>
                     <p style="margin: 2px 0 0 0; padding-left: 0.5em; ${f(F, 10, 16, ' letter-spacing: 0.5em; text-transform: uppercase;')} text-align: center; color: ${C.ink};">label_4</p>
                     <p style="margin: 6px 0 0 0; ${f(FH, 15, 23, ' font-style: italic;')} text-align: center; color: ${C.soft};">txt_2</p>
                     <p style="margin: 20px 0 0 0; ${f(FH, 16, 25, ' font-style: italic;')} text-align: right; color: ${C.soft};">txt_3</p>
                     <p class="po-fb-hello" style="margin: 20px 0 0 0; ${f(FS, 34, 37)} color: ${C.ink};">title_2</p>
                     ${fbP('txt_4')}
                     ${fbP('txt_5')}
                     <!-- "Jouw 2026": without stay data this box is left out and the letter stays (artifact) -->
                     <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="${C.box}" style="margin: 20px 0 0 0; border-radius: 4px; border-collapse: separate;">
                        <tr>
                           <td colspan="2" style="padding: 18px 20px 0 20px; ${f(F, 11, 15, ' letter-spacing: 0.14em; text-transform: uppercase;')} color: ${C.label};">subtitle_2</td>
                        </tr>
${rows.map(([k, v], i) => `                        <tr>
                           <td align="left" style="padding: 8px 0 ${i === 2 ? 18 : 0}px 20px; ${f(F, 15, 21)} color: ${C.ink};">${k}</td>
                           <td align="right" style="padding: 8px 20px ${i === 2 ? 18 : 0}px 12px; ${f(F, 15, 21, ' font-weight: 600;')} color: ${C.ink};">${v}</td>
                        </tr>`).join('\n')}
                     </table>
                     ${fbP('txt_12')}
                     <!-- the gift card -->
                     <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 20px 0 0 0; border: 2px dashed ${C.card}; border-radius: 6px; border-collapse: separate;">
                        <tr>
                           <td align="center" style="padding: 22px;">
                              <p style="margin: 0; ${f(F, 11, 17, ' letter-spacing: 0.14em; text-transform: uppercase;')} color: ${C.label};">subtitle_3</p>
                              <p class="po-offer" style="margin: 12px 0 0 0; ${f(FH, 26, 30)} color: ${C.ink};">title_3</p>
                              <div style="padding: 12px 0 0 0;">
                                 <!--[if mso]>
                                 <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://100procent.nl/" style="height:46px;v-text-anchor:middle;width:240px;" arcsize="9%" strokecolor="${C.btn}" fillcolor="${C.btn}">
                                    <w:anchorlock/>
                                    <center style="color:${C.btnTxt};font-family:${F};font-size:16px;font-weight:bold;">btn_txt_1</center>
                                 </v:roundrect>
                                 <![endif]-->
                                 <a class="po-btn-link" href="https://100procent.nl/" target="_blank" style="display: inline-block; padding: 11px 20px; border-radius: 4px; background-color: ${C.btn}; color: ${C.btnTxt}; ${f(F, 16, 24, ' font-weight: 600;')} text-decoration: none; -webkit-text-size-adjust: none; mso-hide: all;">btn_txt_1</a>
                              </div>
                           </td>
                        </tr>
                     </table>
                     ${fbP('txt_13')}
                     ${fbP('txt_14')}
                     <p class="po-fb-family" style="margin: 2px 0 0 0; ${f(FS, 44, 48)} color: ${C.ink};">title_4</p>
                     <p style="margin: 2px 0 0 0; ${f(FH, 16, 25, ' font-style: italic;')} color: ${C.soft};">txt_15</p>
                     <p class="po-fb-ps" style="margin: 20px 0 0 0; ${f(FS, 26, 31)} color: ${C.ink};">txt_16</p>
                  </td>
               </tr>
            </table>
         </td>
      </tr>
      <!-- the counter with the envelope (simplified in tables: no flaps, plant or bell; the artifact intends this as
           one image, "alleen de balie met envelop is een afbeelding") -->
      <tr>
         <td align="center" class="po-fb-env" style="padding: 14px 100px 0 100px;">
            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="${C.envelope}" style="max-width: 500px; border-radius: 4px; border-collapse: separate;">
               <tr>
                  <td align="right" valign="top" style="padding: 26px 26px 0 0;">
                     <table role="presentation" border="0" cellspacing="0" cellpadding="0" bgcolor="${C.stamp}">
                        <tr>
                           <td align="center" width="50" style="width: 50px; padding: 12px 0; border: 3px dashed ${C.stampTxt}; ${f(FH, 18, 18)} color: ${C.stampTxt};">label_5<br><span style="${f(F, 11, 16)}">label_6</span></td>
                        </tr>
                     </table>
                  </td>
               </tr>
               <tr>
                  <td align="center" style="padding: 32px 16px 30px 16px; ${f(FS, 34, 43)} color: ${C.ink};">title_5</td>
               </tr>
            </table>
         </td>
      </tr>
      <tr>
         <td height="56" bgcolor="${C.counter}" style="height: 56px; border-top: 4px solid ${C.counterEdge}; font-size: 0; line-height: 0;">&nbsp;</td>
      </tr>
   </table>
</div>`;

const interactive = `<!--[if !mso]><!-->
<div class="po-interactive" style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">
   <div class="po-window">
      <div class="po-scroll">
         <div class="po-hero">
            <p class="po-logo">label_1</p>
            <p class="po-logo-sub">label_2</p>
            <p class="po-kicker">subtitle_1</p>
            <h1 class="po-h1">title_1</h1>
            <p class="po-lead">${CLICK ? 'txt_17' : 'txt_1'}</p>
         </div>
         <div class="po-letter">
            <div class="po-stripe"></div>
            <div class="po-head">
               <p class="po-head-logo">label_3</p>
               <p class="po-head-sub">label_4</p>
               <p class="po-since">txt_2</p>
            </div>
            <p class="po-date">txt_3</p>
            <p class="po-hello">title_2</p>
            <p class="po-p">txt_4</p>
            <p class="po-p">txt_5</p>
            <!-- "Jouw 2026": without stay data this box is left out and the letter stays (artifact) -->
            <div class="po-box">
               <p class="po-label">subtitle_2</p>
${rows.map(([k, v]) => `               <div class="po-row"><span>${k}</span><span class="po-val">${v}</span></div>`).join('\n')}
            </div>
            <p class="po-p">txt_12</p>
            <div class="po-card">
               <p class="po-label">subtitle_3</p>
               <p class="po-offer">title_3</p>
               <a class="po-btn po-btn-link" href="https://100procent.nl/" target="_blank">btn_txt_1</a>
            </div>
            <p class="po-p">txt_13</p>
            <div class="po-sign">
               <p class="po-p">txt_14</p>
               <p class="po-family">title_4</p>
               <p class="po-team">txt_15</p>
            </div>
            <p class="po-ps">txt_16</p>
         </div>
         <div class="po-tail"></div>
      </div>
      <!-- the counter with the envelope: stays still over the bottom of the window -->
      <div class="po-desk">
         <div class="po-a po-counter"></div>
         <div class="po-a po-leaf-1"></div>
         <div class="po-a po-leaf-2"></div>
         <div class="po-a po-berry-1"></div>
         <div class="po-a po-berry-2"></div>
         <div class="po-a po-bell"></div>
         <div class="po-a po-bell-base"></div>
         <div class="po-a po-bell-top"></div>
         <div class="po-a po-env"></div>
         <div class="po-a po-back-l"></div>
         <div class="po-a po-back-r"></div>
         <div class="po-a po-flap-l"></div>
         <div class="po-a po-flap-r"></div>
         <div class="po-a po-flap-b"></div>${CLICK ? `
         <!-- version 2: the closed flap (under the name and the stamp) -->
         <div class="po-a po-flap-t"></div>` : ''}
         <div class="po-a po-to">title_5</div>
         <div class="po-a po-stamp-clip"><div class="po-a po-stamp"><span class="po-stamp-wc">label_5</span><span class="po-stamp-year">label_6</span></div></div>${CLICK ? `
         <!-- version 2: the seal on the flap's tip; the whole counter layer opens the envelope -->
         <div class="po-a po-seal">label_7</div>
         <label for="po-open" class="po-open-label" title="Open de envelop"></label>` : ''}
      </div>
   </div>
</div>
<!--<![endif]-->`;

const body = `<!-- start ${NM} -->
<!-- "Post bij de receptie" (Claude Design artifact "WestCord eindejaarsmail: de lift", concept 4): a Christmas letter
     that slides out of an envelope on the reception desk while you scroll. Scroll window with the hero and the letter
     as live text; the counter with the envelope is a fixed layer over the bottom of the window. Fallback (Gmail,
     Outlook, Samsung): the letter as a normal mail with the envelope below.
     Geometry and font sizes are the artifact's; colours and fonts are token values here (the WestCord mail uses the
     artifact's). Built with interactive_artifact/westcord/concept_4_post_receptie/build/gen_post.js: change the
     generator, not this file.${CLICK ? `
     Version 2 (click): the envelope starts closed; a click on it opens the flap and the first part of the letter
     slides out by itself, then you scroll as in version 1.` : ''} -->
@@CSS@@
<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" align="center" bgcolor="${C.bg}">
   <tr>
      <td align="center" style="padding: 0;">
         <!--[if !mso]><!-->
         <input type="checkbox" class="po-detect" checked style="display: none !important; mso-hide: all;">
${CLICK ? '         <input type="checkbox" id="po-open" class="po-open" style="display: none !important; mso-hide: all;">\n' : ''}         <!--<![endif]-->
${ind(fallback, 9)}
${ind(interactive, 9)}
      </td>
   </tr>
</table>
<!-- end ${NM} -->
`;

// version 2 gets its own prefix (pk-), so both blocks can sit in one mail (the all-blocks file) without sharing
// classes, ids or keyframes (email_rules 4.7)
const pre = s => CLICK ? s.replace(/(^|[^a-z])po-/g, '$1pk-') : s;
return { name: NM, css: pre(css), block: pre(body.replace('@@CSS@@', css)), bodyWithoutCss: pre(body.replace('@@CSS@@\n', '')) };
}

module.exports = { build, DEFAULT, NAME, NAME_CLICK };

if (require.main === module) {
  for (const click of [false, true]) {
    const { name, block } = build(DEFAULT, { click });
    fs.writeFileSync(OUT(name), block.replace(/\n/g, '\r\n'));
    console.log('written', OUT(name), Buffer.byteLength(block), 'bytes');
  }
}
