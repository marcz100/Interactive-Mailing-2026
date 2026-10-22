// Builds ../colbe_eindejaarsmail_2026_concept_1.html: a one-on-one email translation of the artifact board
// "A · Zes wensen: de mail" (Colbe eindejaarsmail concepten). Values (colours, sizes, spacing, copy, behaviour) come
// from the board's markup and its DCLogic script, line heights the board leaves at `normal` as measured in Chrome
// (Albert Sans: about 1.2x). Shell: head from shell_head.html, then header, hero, the wish block, letter, photo band,
// unsubscribe and footer, all from the board. No block in blocks/ yet (only the mail was asked for).
// Also builds ../colbe_eindejaarsmail_2026_concept_1_v2.html, the same mail with two additions on top of the board:
// an open light can be turned off again, and with all six on the lights spiral into the middle (faster and faster)
// and merge into one big ball with "6/6 alles samen" and the Verbinding sentence. make(V2) keeps both from one source.
//   node build_mail.js
const fs = require('fs'), path = require('path');
const OUT = path.resolve(__dirname, '../colbe_eindejaarsmail_2026_concept_1.html');
const OUT2 = path.resolve(__dirname, '../colbe_eindejaarsmail_2026_concept_1_v2.html');
const HEAD = path.resolve(__dirname, 'shell_head.html');

// values taken 1:1 from the board; approximations of the Colbe house style, to confirm with the brand guide
const F = "'Albert Sans',Aptos,'Trebuchet MS',sans-serif";   // Lota Grotesque approximated with Albert Sans
const C = {
  cream: '#F9F7F4', ink: '#292828', coral: '#FF6748', white: '#FFFFFF', grey: '#8C8A8A', soft: '#6E6B6B',
  line: '#CFC9C0', heroSub: '#D8D4CE', heroTxt: '#E9E6E1', photo: '#FFD9CF', photoTxt: '#7A2C17',
};
const WIDTH = 640;   // the board's mail width
const LINK = 'https://100procent.nl/';
const SUBJECT = 'Dit jaar kwam veel samen';
const PREHEADER = 'Daarom hebben we zes wensen voor je klaargezet.';

// the six wishes, in the board's order (DCLogic `data`); position on the circle with the board's own formula
const WISHES = [
  ['Rust', 'Rust: tijd om op te laden, zonder dat het moet.'],
  ['Groei', 'Groei: werk dat je uitdaagt en waarin je verder komt.'],
  ['Verbinding', 'Verbinding: mensen om je heen die je zien en steunen.'],
  ['Balans', 'Balans: ruimte voor je werk en voor alles daarbuiten.'],
  ['Plezier', 'Plezier: dagen waar je met een glimlach op terugkijkt.'],
  ['Betekenis', 'Betekenis: het gevoel dat wat je doet ertoe doet.'],
].map(([word, line], i) => {
  const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
  return { n: i + 1, word, line, x: Math.round(210 + 150 * Math.cos(a) - 46), y: Math.round(210 + 150 * Math.sin(a) - 46) };
});
const N = WISHES.map(w => w.n);
// geometry in % of the board's 420 x 420 circle box, so the circle scales with the mail
const pct = v => `${+(v / 420 * 100).toFixed(3)}%`;
// all six open (the inputs are siblings in this order, before the interactive div)
const ALL = N.map(n => `.zw-c${n}:checked`).join(' ~ ');
const ANY = sel => N.map(n => `   .zw-c${n}:checked ~ .zw-interactive ${sel}`).join(',\n');
const FS = (size, lh, extra = '') => `font-family: ${F}; font-size: ${size}px; line-height: ${lh};${extra}`;
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const ind = (s, n) => s.split('\n').map(l => l ? ' '.repeat(n) + l : l).join('\n');

const COPY = {
  salutation: 'Beste [meneer/mevrouw] [Achternaam],',
  title: 'Dit jaar kwam<br>veel samen.',
  intro: 'Daarom hebben we zes wensen voor je klaargezet.', tap: ' Tik op de lichtjes en ontdek ze één voor één.',
  start: 'Begin waar je wilt.', open: 'wensen open', all: 'alles samen',
  placeholder: 'Open alle zes de lichtjes.<br>Dan komt hier je nieuwjaarsgroet tevoorschijn.',
  finLabel: 'Alles komt samen', finTitle: 'Fijne feestdagen en een betekenisvol 2027',
  finTxt: 'Rust, groei, verbinding, balans, plezier en betekenis. Samen vormen ze werk dat je beweegt.',
  letter: 'Bedankt voor je vertrouwen in het afgelopen jaar. 2026 was ons eerste jaar als Colbe, het netwerk waar werk en welzijn samenkomen. Ook in 2027 bouwen we graag samen aan werk dat betekenisvol is en blijft.',
  sign: 'Met hartelijke groet,<br>[Naam], [functie] Colbe', cta: 'Ontdek wat Colbe voor je kan doen',
  photos: ['[Foto: mensen aan het werk]', '[Foto: moment van rust]', '[Foto: samen onderweg]'],
  unsubTxt: 'Wij houden je graag op de hoogte met relevante updates, maar wil je liever geen nieuws meer ontvangen?',
  unsubBtn: 'Meld je hier af',
  // v2: the sentence in the big ball
  merged: 'Verbinding: mensen om je heen die je zien en steunen.',
};

// ---------------- v2: the merge ----------------
// Timeline after the sixth light (seconds): the lights orbit and spiral in (0 - 3), the ring fades (2.4), the middle
// grows to the ring's size, 300 of 420 (2.7 - 3.4), the sentence appears (3.2), the greeting card (3.4).
const SPIN = 3, TURNS = 2, STOPS = 12;
// a light sits on a wrapper at the middle (164, 164); rotate(a) translateY(-r) rotate(-a) puts it on the circle at
// angle a (clockwise from the top) and keeps its word upright. 150 / 92 = 163.043% of its own size.
const orbit = (a, r) => `rotate(${+a.toFixed(2)}deg) translateY(-${+(163.043 * r).toFixed(3)}%) rotate(-${+a.toFixed(2)}deg)`;
// per light: the angle speeds up (t squared), the radius holds for the first 30% and then closes in on the middle;
// the light fades into the middle at the very end
const spiral = n => {
  const a0 = (n - 1) * 60;
  return `   @keyframes zw-spiral-${n} {
${[...Array(STOPS + 1).keys()].map(k => {
  const t = k / STOPS, r = t < 0.3 ? 1 : 1 - Math.pow((t - 0.3) / 0.7, 1.6);
  return `      ${+(t * 100).toFixed(2)}% {
         transform: ${orbit(a0 + 360 * TURNS * t * t, r)};${t > 0.9 ? `
         opacity: ${+((1 - t) * 10).toFixed(2)};` : ''}
      }`;
}).join('\n\n')}
   }`;
};

function make(V2) {
// ---------------- block CSS ----------------
const css = `<style type="text/css">
   /* "Zes wensen" (artifact board "A · Zes wensen: de mail"): six lights on a dashed circle. Each light is the label of
      its own checkbox: tapping it turns it coral, shows its word and its wish line, and the counter in the middle goes
      up. A light that is open stays open. With all six open the middle turns coral ("alles samen") and the greeting
      card appears. Order: inputs, hero, fallback, interactive. Interactive only in WebKit clients that support
      :checked (pre-checked .zw-detect); everything else keeps the fallback (the circle with all six open, the six
      wishes as a list and the greeting). */
   @media screen and (-webkit-min-device-pixel-ratio: 0) {
      .zw-detect:checked ~ .zw-fallback {
         display: none !important;
         max-height: 0 !important;
         overflow: hidden !important;
      }

      .zw-detect:checked ~ .zw-interactive {
         display: block !important;
         max-height: none !important;
         overflow: visible !important;
      }

      /* the hero's tap instruction only where there is something to tap */
      .zw-detect:checked ~ .zw-hero .zw-tap {
         display: inline !important;
      }
   }

   .zw-interactive .zw-section {
      padding: 40px 0 24px 0;
   }

   /* the circle: a 420 x 420 box (fixed proportions), everything inside positioned in % of it */
   .zw-interactive .zw-box {
      max-width: 420px;
      margin: 0 auto;
   }

   .zw-interactive .zw-scene {
      position: relative;
      height: 0;
      padding-bottom: 100%;
   }

   .zw-interactive .zw-ring {
      position: absolute;
      left: ${pct(60)};
      top: ${pct(60)};
      width: ${pct(300)};
      height: ${pct(300)};
      border: 1.5px dashed ${C.line};
      border-radius: 50%;
      box-sizing: content-box;
   }

   .zw-interactive .zw-center {
      position: absolute;
      left: ${pct(140)};
      top: ${pct(140)};
      width: ${pct(140)};
      height: ${pct(140)};
      display: -webkit-flex;
      display: flex;
      -webkit-flex-direction: column;
      flex-direction: column;
      -webkit-align-items: center;
      align-items: center;
      -webkit-justify-content: center;
      justify-content: center;
      border-radius: 50%;
      background-color: ${C.white};
      color: ${C.ink};
      text-align: center;
      -webkit-transition: background-color 0.4s ease, color 0.4s ease;
      transition: background-color 0.4s ease, color 0.4s ease;
   }

   /* the counter "n/6": a CSS counter, one increment per open wish */
   .zw-interactive .zw-count {
      margin: 0;
      counter-reset: zw-n;
      ${FS(30, 1, ' font-weight: 600;')}
   }

${N.map(n => `   .zw-c${n}:checked ~ .zw-interactive .zw-k${n}`).join(',\n')} {
      counter-increment: zw-n;
   }

   .zw-interactive .zw-n:before {
      content: counter(zw-n);
   }

   .zw-interactive .zw-clabel {
      margin: 6px 0 0 0;
      padding: 0 12px;
      ${FS(13, 1.3)}
   }

   .zw-interactive .zw-all-txt {
      display: none;
   }

   /* the lights: 92 x 92 at the board's positions; "+" until opened, then coral with the word */
${V2 ? `   /* v2: each light fills its orbit wrapper; the wrapper sits on the middle and is turned out to the light's place */
   .zw-interactive .zw-orb {
      position: absolute;
      left: ${pct(164)};
      top: ${pct(164)};
      width: ${pct(92)};
      height: ${pct(92)};
   }

${WISHES.map(w => `   .zw-interactive .zw-o${w.n} {
      transform: ${orbit((w.n - 1) * 60, 1)};
   }`).join('\n\n')}

` : ''}   .zw-interactive .zw-wish {
      position: absolute;
${V2 ? `      left: 0;
      top: 0;
      width: 100%;
      height: 100%;` : `      width: ${pct(92)};
      height: ${pct(92)};`}
      display: -webkit-flex;
      display: flex;
      -webkit-align-items: center;
      align-items: center;
      -webkit-justify-content: center;
      justify-content: center;
      border: 2px solid ${C.coral};
      border-radius: 50%;
      background-color: ${C.white};
      color: ${C.coral};
      ${FS(15, 'normal', ' font-weight: 600;')}
      text-align: center;
      cursor: pointer;
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
      -webkit-transition: background-color 0.35s ease, color 0.35s ease, -webkit-transform 0.35s ease;
      transition: background-color 0.35s ease, color 0.35s ease, transform 0.35s ease;
   }

   .zw-interactive .zw-wish:hover {
      -webkit-transform: scale(1.05);
      transform: scale(1.05);
   }

${V2 ? '' : `${WISHES.map(w => `   .zw-interactive .zw-w${w.n} {
      left: ${pct(w.x)};
      top: ${pct(w.y)};
   }`).join('\n\n')}

`}   .zw-interactive .zw-word {
      display: none;
   }

${V2 ? `   /* an open wish: coral with its word; tapping it again turns it off (v2) */
${N.map(n => `   .zw-c${n}:checked ~ .zw-interactive .zw-w${n}`).join(',\n')} {
      background-color: ${C.coral};
      color: ${C.white};
   }` : `   /* an open wish stays open (as in the board): coral, its word, no longer clickable */
${N.map(n => `   .zw-c${n}:checked ~ .zw-interactive .zw-w${n}`).join(',\n')} {
      background-color: ${C.coral};
      color: ${C.white};
      pointer-events: none;
      cursor: default;
   }`}

${N.map(n => `   .zw-c${n}:checked ~ .zw-interactive .zw-w${n} .zw-plus`).join(',\n')} {
      display: none;
   }

${N.map(n => `   .zw-c${n}:checked ~ .zw-interactive .zw-w${n} .zw-word`).join(',\n')} {
      display: inline;
   }

   /* the wish line under the circle: all lines in one grid cell on the cream background. The newest is on top:
      every line starts the zw-stack animation (z-index counting down 100 per second) when its wish opens. Without
      animation support the last wish in the circle shows. */
   .zw-interactive .zw-lines {
      display: -ms-grid;
      display: grid;
      max-width: 460px;
      min-height: 56px;
      margin: 20px auto 0 auto;
   }

   .zw-interactive .zw-line {
      position: relative;
      grid-area: 1 / 1;
      margin: 0;
      visibility: hidden;
      background-color: ${C.cream};
      ${FS(18, 1.5)}
      text-align: center;
      color: ${C.ink};
      word-wrap: break-word;
      overflow-wrap: break-word;
   }

   .zw-interactive .zw-l0 {
      visibility: visible;
   }

${ANY('.zw-l0')} {
      visibility: hidden;
   }

${N.map(n => `   .zw-c${n}:checked ~ .zw-interactive .zw-l${n}`).join(',\n')} {
      visibility: visible;
      -webkit-animation: zw-stack 100000s linear forwards;
      animation: zw-stack 100000s linear forwards;
   }

   @-webkit-keyframes zw-stack {
      from {
         z-index: 10000000;
      }

      to {
         z-index: 1;
      }
   }

   @keyframes zw-stack {
      from {
         z-index: 10000000;
      }

      to {
         z-index: 1;
      }
   }

   /* until all six are open: the dashed placeholder */
   .zw-interactive .zw-ph {
      margin: 0 40px;
      padding: 34px 44px;
      border: 1.5px dashed ${C.line};
      border-radius: 20px;
      ${FS(16, 1.5)}
      text-align: center;
      color: ${C.soft};
   }

   .zw-interactive .zw-finale {
      display: none;
      margin: 0 40px;
      padding: 40px 44px;
      border-radius: 20px;
      background-color: ${C.coral};
      text-align: center;
      color: ${C.white};
   }

   .zw-interactive .zw-fin-label {
      margin: 0;
      ${FS(14, 'normal', ' letter-spacing: 0.12em; text-transform: uppercase;')}
   }

   .zw-interactive .zw-fin-title {
      margin: 14px 0 0 0;
      ${FS(32, 1.15, ' font-weight: 600;')}
   }

   .zw-interactive .zw-fin-txt {
      margin: 14px 0 0 0;
      ${FS(17, 1.55)}
   }

   /* all six open: coral middle "alles samen", the greeting card appears */
   ${ALL} ~ .zw-interactive .zw-center {
      background-color: ${C.coral};
      color: ${C.white};
   }

   ${ALL} ~ .zw-interactive .zw-open-txt {
      display: none;
   }

   ${ALL} ~ .zw-interactive .zw-all-txt {
      display: inline;
   }

   ${ALL} ~ .zw-interactive .zw-ph {
      display: none;
   }

   ${ALL} ~ .zw-interactive .zw-finale {
      display: block;
      -webkit-animation: zw-verschijn 0.6s ease ${V2 ? '3.4s ' : ''}both;
      animation: zw-verschijn 0.6s ease ${V2 ? '3.4s ' : ''}both;
   }

   @-webkit-keyframes zw-verschijn {
      from {
         opacity: 0;
         -webkit-transform: translateY(12px);
      }

      to {
         opacity: 1;
         -webkit-transform: none;
      }
   }

   @keyframes zw-verschijn {
      from {
         opacity: 0;
         transform: translateY(12px);
      }

      to {
         opacity: 1;
         transform: none;
      }
   }
${V2 ? `
   /* v2: all six on. The lights orbit and spiral into the middle, faster and faster, and fade into it; the ring and
      the wish line fade; the middle grows to the ring's size (300 of 420) and shows the sentence. The lights can't be
      tapped any more (they are inside the big ball). Without animation support the six lights stay on the circle
      with the coral "6/6 alles samen" middle, as in the board. */
   .zw-interactive .zw-sentence {
      max-height: 0;
      margin: 0;
      padding: 0 36px;
      overflow: hidden;
      opacity: 0;
      ${FS(16, 1.4)}
   }

${N.map(n => `   ${ALL} ~ .zw-interactive .zw-o${n} {
      animation: zw-spiral-${n} ${SPIN}s linear both;
   }`).join('\n\n')}

   ${ALL} ~ .zw-interactive .zw-orb,
   ${ALL} ~ .zw-interactive .zw-wish {
      pointer-events: none;
      cursor: default;
   }

   /* the lights glow as soon as they start spinning, brighter as they speed up */
   ${ALL} ~ .zw-interactive .zw-wish {
      animation: zw-glow ${SPIN}s linear both;
   }

   ${ALL} ~ .zw-interactive .zw-ring {
      -webkit-animation: zw-fade 0.4s ease 2.4s both;
      animation: zw-fade 0.4s ease 2.4s both;
   }

   /* the wish line takes no space any more (the sentence is in the ball) */
   ${ALL} ~ .zw-interactive .zw-lines {
      display: none;
   }

   /* the greeting card takes no space until the ball has formed; then its wrapper opens while the card fades in.
      The wrapper has no padding, so the card's own (mobile !important) padding can't leave an empty block. */
   .zw-interactive .zw-fin-wrap {
      overflow: hidden;
   }

   ${ALL} ~ .zw-interactive .zw-fin-wrap {
      -webkit-animation: zw-open 0.6s ease-out 3.4s both;
      animation: zw-open 0.6s ease-out 3.4s both;
   }

   /* the middle in front: the lights disappear into it instead of piling up over "6/6" */
   ${ALL} ~ .zw-interactive .zw-center {
      z-index: 2;
      -webkit-animation: zw-grow 0.7s ease-out 2.7s both;
      animation: zw-grow 0.7s ease-out 2.7s both;
   }

   ${ALL} ~ .zw-interactive .zw-sentence {
      -webkit-animation: zw-show 0.5s ease 3.2s both;
      animation: zw-show 0.5s ease 3.2s both;
   }

${N.map(spiral).join('\n\n')}

   @keyframes zw-fade {
      from {
         opacity: 1;
      }

      to {
         opacity: 0;
      }
   }

   @keyframes zw-glow {
      from {
         box-shadow: 0 0 0 0 rgba(255, 103, 72, 0), 0 0 0 0 rgba(255, 222, 210, 0);
      }

      15% {
         box-shadow: 0 0 22px 6px rgba(255, 103, 72, 0.45), 0 0 6px 2px rgba(255, 222, 210, 0.7);
      }

      to {
         box-shadow: 0 0 34px 10px rgba(255, 103, 72, 0.6), 0 0 10px 3px rgba(255, 222, 210, 0.9);
      }
   }

   @keyframes zw-open {
      from {
         max-height: 0;
      }

      to {
         max-height: 600px;
      }
   }

   @keyframes zw-grow {
      from {
         left: ${pct(140)};
         top: ${pct(140)};
         width: ${pct(140)};
         height: ${pct(140)};
      }

      to {
         left: ${pct(60)};
         top: ${pct(60)};
         width: ${pct(300)};
         height: ${pct(300)};
      }
   }

   @keyframes zw-show {
      from {
         max-height: 0;
         margin-top: 0;
         opacity: 0;
      }

      to {
         max-height: 120px;
         margin-top: 12px;
         opacity: 1;
      }
   }

   /* reduced motion: straight to the end state */
   @media (prefers-reduced-motion: reduce) {
${['.zw-orb', '.zw-wish', '.zw-ring', '.zw-center', '.zw-sentence', '.zw-fin-wrap', '.zw-finale'].map(s => `      ${ALL} ~ .zw-interactive ${s}`).join(',\n')} {
         -webkit-animation-duration: 0.01s !important;
         animation-duration: 0.01s !important;
         -webkit-animation-delay: 0s !important;
         animation-delay: 0s !important;
      }
   }
` : ''}
   /* links on coloured bands keep their colour */
   .zw-a-ink {
      color: ${C.ink} !important;
   }

   .zw-a-grey {
      color: ${C.grey} !important;
   }

   .zw-a-white {
      color: ${C.white} !important;
   }

   /* mobile (own interpretation: the board has no mobile design). The circle scales; the words in the lights step
      down so "Verbinding" fits at 360px */
   @media only screen and (max-width: 600px) {
      .zw-hero-td {
         padding: 40px 24px 44px 24px !important;
      }

      .zw-h1 {
         font-size: 34px !important;
         line-height: 37px !important;
      }

      .zw-big {
         font-size: 16px !important;
      }

      .zw-interactive .zw-section,
      .zw-fb-section {
         padding: 32px 16px 24px 16px !important;
      }

      .zw-interactive .zw-wish {
         font-size: 13px !important;
      }
${V2 ? `
      .zw-interactive .zw-sentence {
         padding: 0 26px !important;
         font-size: 14px !important;
      }
` : ''}
      .zw-interactive .zw-line,
      .zw-fb-line {
         font-size: 17px !important;
         line-height: 26px !important;
      }

      .zw-interactive .zw-ph,
      .zw-interactive .zw-finale {
         margin: 0 16px !important;
         padding: 28px 24px !important;
      }

      .zw-fb-pad {
         padding: 0 16px !important;
      }

      .zw-fb-finale {
         padding: 28px 24px !important;
      }

      .zw-fin-title {
         font-size: 26px !important;
         line-height: 30px !important;
      }

      .zw-letter {
         padding: 40px 24px 32px 24px !important;
      }

      .zw-letter-p {
         font-size: 16px !important;
         line-height: 26px !important;
      }

      .zw-photos {
         padding: 20px 16px !important;
      }

      .zw-photo {
         height: 100px !important;
         font-size: 12px !important;
      }

      .zw-unsub {
         padding: 32px 24px !important;
      }

      .zw-footer {
         padding: 32px 24px 40px 24px !important;
      }
   }

   @media only screen and (max-width: 400px) {
      .zw-h1 {
         font-size: 30px !important;
         line-height: 33px !important;
      }

      .zw-interactive .zw-wish {
         font-size: 12px !important;
      }
${V2 ? `
      .zw-interactive .zw-sentence {
         padding: 0 22px !important;
         font-size: 13px !important;
      }
` : ''}
      .zw-interactive .zw-count {
         font-size: 26px !important;
      }

      .zw-interactive .zw-clabel {
         font-size: 12px !important;
      }

      .zw-fb-disc {
         width: 120px !important;
         height: 120px !important;
      }

      .zw-fb-disc-n {
         font-size: 26px !important;
      }
   }

   /* Outlook.com / new Outlook: class names get an x_ prefix */
   [class~="x_zw-interactive"],
   [class~="x_zw-detect"]:checked ~ [class~="x_zw-interactive"],
   [class~="x_zw-tap"],
   [class~="x_zw-detect"]:checked ~ [class~="x_zw-hero"] [class~="x_zw-tap"] {
      display: none !important;
      max-height: 0 !important;
      overflow: hidden !important;
   }

   [class~="x_zw-fallback"],
   [class~="x_zw-detect"]:checked ~ [class~="x_zw-fallback"] {
      display: block !important;
      max-height: none !important;
      overflow: visible !important;
   }

   /* Samsung Mail: the message is wrapped in #MessageViewBody (the id outranks the activation selector) */
   #MessageViewBody .zw-interactive,
   #MessageViewBody .zw-tap {
      display: none !important;
      max-height: 0 !important;
      overflow: hidden !important;
   }

   #MessageViewBody .zw-fallback {
      display: block !important;
      max-height: none !important;
      overflow: visible !important;
   }
</style>
<style type="text/css">
   /* Outlook apps: back to the fallback (separate style tag: the \\0 hack breaks the rest of a style tag) */
   .zw-interactive\\0,
   .zw-detect:checked ~ .zw-interactive\\0,
   .zw-tap\\0,
   .zw-detect:checked ~ .zw-hero .zw-tap\\0 {
      display: none !important;
      max-height: 0 !important;
      overflow: hidden !important;
   }

   .zw-fallback\\0,
   .zw-detect:checked ~ .zw-fallback\\0 {
      display: block !important;
      max-height: none !important;
      overflow: visible !important;
   }
</style>`;

// ---------------- markup ----------------
const spacer = h => `<tr><td height="${h}" style="height: ${h}px; font-size: 0; line-height: 0;">&nbsp;</td></tr>`;
// outline pill with an arrow (the board's svg arrow becomes a text arrow: svg is not email-safe); VML for Outlook
const pill = (txt, { size, lh, pad, gap, arrow, w, h }) => `<!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${LINK}" style="height:${h}px;v-text-anchor:middle;width:${w}px;" arcsize="50%" strokecolor="${C.ink}" strokeweight="1.5px" filled="f">
   <w:anchorlock/>
   <center style="color:${C.ink};font-family:${F};font-size:${size}px;">${txt} &rarr;</center>
</v:roundrect>
<![endif]-->
<a class="zw-a-ink" href="${LINK}" target="_blank" style="display: inline-block; padding: ${pad}; border: 1.5px solid ${C.ink}; border-radius: 24px; color: ${C.ink}; ${FS(size, `${lh}px`)} text-decoration: none; -webkit-text-size-adjust: none; mso-hide: all;">${txt}<span style="display: inline-block; vertical-align: top; padding-left: ${gap}px; font-family: Arial, Helvetica, sans-serif; font-size: ${arrow}px; line-height: ${lh}px;">&rarr;</span></a>`;
// logo placeholder as in the board: the real logo comes from the designer, never redraw it
const logo = (txt, color, border) => `<div style="display: inline-block; padding: 8px 18px; border: 1.5px dashed ${border}; border-radius: 8px; ${FS(13, '15px')} color: ${color};">${txt}</div>`;

// fallback circle (the board's end state): three columns of 126 / 168 / 126 (x 0-126, 126-294, 294-420), the circles
// at the board's y positions with spacer rows; VML ovals keep them round in Outlook
const circle = (txt, size, cls = '', inner = FS(15, 'normal', ' font-weight: 600;')) => `<!--[if mso]>
<v:oval xmlns:v="urn:schemas-microsoft-com:vml" style="width:${size}px;height:${size}px;v-text-anchor:middle;" fillcolor="${C.coral}" stroked="f">
   <v:textbox inset="0,0,0,0"><center style="color:${C.white};${inner.replace(/; /g, ';')}">${txt}</center></v:textbox>
</v:oval>
<![endif]-->
<!--[if !mso]><!-->
<table role="presentation" border="0" cellspacing="0" cellpadding="0">
   <tr>
      <td${cls ? ` class="${cls}"` : ''} width="${size}" height="${size}" align="center" valign="middle" bgcolor="${C.coral}" style="width: ${size}px; height: ${size}px; border-radius: 50%; ${inner} color: ${C.white};">${txt}</td>
   </tr>
</table>
<!--<![endif]-->`;
const col = (align, items) => `<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
${items.map(it => typeof it === 'number' ? '   ' + spacer(it) : `   <tr>
      <td align="${align}">
${ind(it, 9)}
      </td>
   </tr>`).join('\n')}
</table>`;
const W = n => circle(WISHES[n - 1].word, 92);
const disc = circle(`<span class="zw-fb-disc-n" style="${FS(30, '30px', ' font-weight: 600;')}">6/6</span><br><span style="${FS(13, '17px')}">${COPY.all}</span>`, 140, 'zw-fb-disc', FS(13, '17px'));
const fbCircle = `<table role="presentation" width="420" border="0" cellspacing="0" cellpadding="0" align="center" style="width: 100%; max-width: 420px; table-layout: fixed;">
   <tr>
      <td width="30%" valign="top" style="width: 30%;">
${ind(col('right', [89, W(6), 58, W(5), 89]), 9)}
      </td>
      <td width="40%" valign="top" style="width: 40%;">
${ind(col('center', [14, W(1), 34, disc, 34, W(4), 14]), 9)}
      </td>
      <td width="30%" valign="top" style="width: 30%;">
${ind(col('left', [89, W(2), 58, W(3), 89]), 9)}
      </td>
   </tr>
</table>`;
const fbLines = WISHES.map((w, i) => `<p class="zw-fb-line" style="margin: ${i ? '10px' : '0'} auto 0 auto; max-width: 460px; ${FS(18, '27px')} color: ${C.ink}; word-wrap: break-word; overflow-wrap: break-word;">${esc(w.line)}</p>`).join('\n');
const fallback = `<!-- fallback (Gmail, Outlook, Samsung): the board's end state. The circle with all six wishes open, the six wishes
     as a list and the greeting (technique board: "de zes wensen als nette lijst rond dezelfde cirkel, met de
     nieuwjaarsgroet eronder") -->
<div class="zw-fallback">
   <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
         <td align="center" class="zw-fb-section" style="padding: 40px 0 24px 0;">
${ind(fbCircle, 12)}
            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout: fixed;">
               <tr>
                  <td align="center" class="zw-fb-pad" style="padding: 20px 40px 0 40px;">
${ind(fbLines, 21)}
                  </td>
               </tr>
            </table>
         </td>
      </tr>
      <tr>
         <td class="zw-fb-pad" style="padding: 0 40px;">
            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="${C.coral}" style="table-layout: fixed; border-radius: 20px; border-collapse: separate;">
               <tr>
                  <td align="center" class="zw-fb-finale" style="padding: 40px 44px; word-wrap: break-word; overflow-wrap: break-word;">
                     <p style="margin: 0; ${FS(14, '17px', ' letter-spacing: 0.12em; text-transform: uppercase;')} color: ${C.white};">${COPY.finLabel}</p>
                     <p class="zw-fin-title" style="margin: 14px 0 0 0; ${FS(32, '36.8px', ' font-weight: 600;')} color: ${C.white};">${COPY.finTitle}</p>
                     <p style="margin: 14px 0 0 0; ${FS(17, '26.35px')} color: ${C.white};">${COPY.finTxt}</p>
                  </td>
               </tr>
            </table>
         </td>
      </tr>
   </table>
</div>`;

const interactive = `<!--[if !mso]><!-->
<div class="zw-interactive" style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">
   <div class="zw-section">
      <div class="zw-box">
         <div class="zw-scene">
            <div class="zw-ring"></div>
            <div class="zw-center">
               <p class="zw-count">${N.map(n => `<span class="zw-k${n}"></span>`).join('')}<span class="zw-n"></span>/6</p>
               <p class="zw-clabel"><span class="zw-open-txt">${COPY.open}</span><span class="zw-all-txt">${COPY.all}</span></p>${V2 ? `
               <p class="zw-sentence">${esc(COPY.merged)}</p>` : ''}
            </div>
            <!-- the lights: each is the label of its wish's checkbox${V2 ? ', in an orbit wrapper' : ''} -->
${WISHES.map(w => {
  const label = `<label for="zw-c${w.n}" class="zw-wish zw-w${w.n}" title="Open wens ${w.n}"><span class="zw-plus">+</span><span class="zw-word">${w.word}</span></label>`;
  return V2 ? `            <div class="zw-orb zw-o${w.n}">${label}</div>` : `            ${label}`;
}).join('\n')}
         </div>
      </div>
      <div class="zw-lines">
         <p class="zw-line zw-l0">${COPY.start}</p>
${WISHES.map(w => `         <p class="zw-line zw-l${w.n}">${esc(w.line)}</p>`).join('\n')}
      </div>
   </div>
   <div class="zw-ph">${COPY.placeholder}</div>
${V2 ? '   <div class="zw-fin-wrap">\n' : ''}${ind(`<div class="zw-finale">
   <p class="zw-fin-label">${COPY.finLabel}</p>
   <p class="zw-fin-title">${COPY.finTitle}</p>
   <p class="zw-fin-txt">${COPY.finTxt}</p>
</div>`, V2 ? 6 : 3)}${V2 ? '\n   </div>' : ''}
</div>
<!--<![endif]-->`;

const inputs = [`<input type="checkbox" class="zw-detect" checked style="display: none !important; mso-hide: all;">`,
  ...N.map(n => `<input type="checkbox" id="zw-c${n}" class="zw-c${n}" style="display: none !important; mso-hide: all;">`)].join('\n');

// hero: shared by both versions; a sibling of the inputs, so the tap instruction shows only in the interactive version
const hero = `<!-- hero -->
<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="${C.ink}" class="zw-hero">
   <tr>
      <td align="center" class="zw-hero-td" style="padding: 56px 56px 60px 56px; word-wrap: break-word; overflow-wrap: break-word;">
         <!-- salutation: [meneer/mevrouw] [Achternaam] from the platform. Without gender: Beste [Voornaam] [Achternaam],
              without names: Beste lezer, -->
         <p class="zw-big" style="margin: 0; ${FS(17, '20px')} color: ${C.heroSub};">${COPY.salutation}</p>
         <h1 class="zw-h1" style="margin: 18px 0 0 0; ${FS(42, '46.2px', ' font-weight: 600;')} color: ${C.white};">${COPY.title}</h1>
         <p class="zw-big" style="margin: 18px 0 0 0; ${FS(17, '26.35px')} color: ${C.heroTxt};">${COPY.intro}<span class="zw-tap" style="display: none; mso-hide: all;">${COPY.tap}</span></p>
      </td>
   </tr>
</table>`;

const block = `<!-- start zes_wensen -->
<!-- "Zes wensen" (Claude Design artifact "Colbe eindejaarsmail concepten", board "A · Zes wensen: de mail"): six
     lights on a circle are labels of checkboxes. Every light you open stays open, turns coral, shows its word and its
     wish line (the newest on top); the counter goes 0/6 to 6/6. With all six open the middle turns coral and the
     greeting appears. Fallback (Gmail, Outlook, Samsung): the circle with all six open, the wishes as a list and the
     greeting. Built with build/build_mail.js: change the generator, not this file.${V2 ? `
     v2: a light can be turned off again; with all six on the lights spiral into the middle and merge into one big
     ball with "6/6 alles samen" and the Verbinding sentence.` : ''} -->
<!--[if !mso]><!-->
${inputs}
<!--<![endif]-->
${hero}
${fallback}
${interactive}
<!-- end zes_wensen -->`;

const NOTE = `<!-- Colbe eindejaarsmail 2026: concept A "Zes wensen" (artifact "Colbe eindejaarsmail concepten", board
     "A · Zes wensen: de mail"). Zes lichtjes rond een cirkel, elk een label voor een eigen checkbox: een lichtje dat je
     opent blijft open, kleurt koraal en toont zijn wens; de teller loopt van 0/6 naar 6/6. Zijn alle zes open, dan
     wordt het midden koraal en verschijnt de nieuwjaarsgroet. Kleuren, fonts, maten en teksten 1:1 uit het artifact.
     Fallback (Gmail, Outlook, Samsung): de cirkel met alle zes wensen open, de wensen als lijst en de groet.
     Gebouwd met build/build_mail.js; wijzig de generator, niet de HTML.
     Aanhef, [Naam] en [functie] zijn placeholders. Logo en foto's zijn placeholders.
     Huisstijl: waarden uit het artifact (benaderingen uit de huidige Colbe mail), te bevestigen met de brandguide;
     Lota Grotesque is benaderd met Albert Sans.${V2 ? `
     Versie 2 (aanvullingen op het artifact): een lichtje kan ook weer uit; zijn alle zes aan, dan draaien ze steeds
     sneller rond en de cirkel in, en smelten ze samen tot één grote bal met "6/6 alles samen" en de zin over
     verbinding. Daarna verschijnt de nieuwjaarsgroet.` : ''} -->`;

let head = fs.readFileSync(HEAD, 'utf8').replace(/\r\n/g, '\n').replace('@@NOTE@@', NOTE).replace('<title>colbe</title>', `<title>${esc(SUBJECT)}</title>`);
const headCss = `      <!-- zes_wensen -->
${ind(css, 6)}
      <!-- // zes_wensen -->
   </head>
`;

// 3 x 184 with 20 between (in % of 592, so they scale); the cell height includes its 8px padding (168 + 2x 8)
const photoCell = (txt, last) => `<td class="zw-photo" width="31.081%" height="184" align="center" valign="middle" bgcolor="${C.photo}" style="width: 31.081%; height: 184px; padding: 8px; border-radius: 4px; ${FS(13, '16px')} color: ${C.photoTxt};">${txt}</td>${last ? '' : `
<td width="3.378%" style="width: 3.378%; font-size: 0; line-height: 0;">&nbsp;</td>`}`;

const body = `
   <body id="body" class="body" width="100%" style="margin: 0; padding: 0 !important; background-color: ${C.cream};">
      <!--[if !mso & !IE]><!-->
      <div style="display: none; max-height: 0px; overflow: hidden;">${esc(PREHEADER)}</div>
      <div style="display: none; max-height: 0px; overflow: hidden;">
         ${'&#8199;&#65279;&#847;'.repeat(28)}
      </div>
      <!--<![endif]-->

      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" align="center" bgcolor="${C.cream}">
         <tr>
            <td style="background-color: ${C.cream};"></td>
            <td style="text-align: center; width: ${WIDTH}px; max-width: ${WIDTH}px; font-family: ${F}; color: ${C.ink};" align="center">
               <!-- header_colbe_logo_placeholder -->
               <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="${C.cream}">
                  <tr>
                     <td align="center" style="padding: 14px 0 0 0; ${FS(12, '14px')} color: ${C.grey};">
                        <!-- view online link -->
                        <a href="${LINK}" title="Online versie" target="_blank" class="zw-a-grey" style="color: ${C.grey}; text-decoration: underline;">webversie</a> | <!-- unsubscribe link --><a href="${LINK}" target="_blank" class="zw-a-grey" style="color: ${C.grey}; text-decoration: underline;">afmelden</a>
                     </td>
                  </tr>
                  <tr>
                     <td align="center" style="padding: 18px 0 26px 0;">
                        ${logo('[Logo Colbe]', C.soft, C.grey)}
                     </td>
                  </tr>
               </table>
               <!-- end header_colbe_logo_placeholder -->
${ind(block, 15)}
               <!-- 1_col_txt_btn_colbe_letter -->
               <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout: fixed;">
                  <tr>
                     <td align="center" class="zw-letter" style="padding: 48px 64px 40px 64px; word-wrap: break-word; overflow-wrap: break-word;">
                        <p class="zw-letter-p" style="margin: 0; ${FS(17, '27.2px')} color: ${C.ink};">${COPY.letter}</p>
                        <p class="zw-letter-p" style="margin: 18px 0 0 0; ${FS(17, '27.2px')} color: ${C.ink};">${COPY.sign}</p>
                        <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center">
                           <tr>
                              <td align="center" style="padding: 26px 0 0 0;">
${ind(pill(COPY.cta, { size: 17, lh: 27.2, pad: '12px 22px', gap: 14, arrow: 22, w: 358, h: 53 }), 32)}
                              </td>
                           </tr>
                        </table>
                     </td>
                  </tr>
               </table>
               <!-- end 1_col_txt_btn_colbe_letter -->
               <!-- 3_col_img_colbe_photos (placeholders: replace each cell's text by <img width="168" style="display: block; width: 100%; height: auto; border-radius: 4px;" alt="..."> when the photos arrive) -->
               <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="${C.coral}">
                  <tr>
                     <td class="zw-photos" style="padding: 28px 24px;">
                        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout: fixed;">
                           <tr>
${ind(COPY.photos.map((p, i) => photoCell(p, i === 2)).join('\n'), 30)}
                           </tr>
                        </table>
                     </td>
                  </tr>
               </table>
               <!-- end 3_col_img_colbe_photos -->
               <!-- 1_col_txt_btn_colbe_unsubscribe -->
               <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout: fixed;">
                  <tr>
                     <td align="center" class="zw-unsub" style="padding: 36px 56px; word-wrap: break-word; overflow-wrap: break-word;">
                        <p style="margin: 0; ${FS(15, '22.5px')} color: ${C.ink};">${COPY.unsubTxt}</p>
                        <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center">
                           <tr>
                              <td align="center" style="padding: 16px 0 0 0;">
                                 <!-- unsubscribe link -->
${ind(pill(COPY.unsubBtn, { size: 15, lh: 22.5, pad: '10px 20px', gap: 12, arrow: 20, w: 172, h: 45 }), 33)}
                              </td>
                           </tr>
                        </table>
                     </td>
                  </tr>
               </table>
               <!-- end 1_col_txt_btn_colbe_unsubscribe -->
               <!-- footer_colbe -->
               <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="${C.ink}" style="table-layout: fixed;">
                  <tr>
                     <td align="left" class="zw-footer" style="padding: 36px 40px 48px 40px; text-align: left;">
                        ${logo('[Logo Colbe, wit]', C.heroSub, C.grey)}
                        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout: fixed;">
                           <tr>
${ind([['SNEL NAAR', ['Onze website', 'Careers']], ['CONTACT', ['Neem contact op', 'LinkedIn']]].map(([h, links], i) => `<td width="50%" valign="top" style="width: 50%; padding: 24px ${i ? '0 0 12px' : '12px 0 0'}; ${FS(15, '28.5px')} color: ${C.white};">
   <p style="margin: 0; ${FS(12, '22.8px', ' letter-spacing: 0.08em;')} color: ${C.white};">${h}</p>
   ${links.map(l => `<a href="${LINK}" target="_blank" class="zw-a-white" style="color: ${C.white}; text-decoration: none;">${l}</a>`).join('<br>\n   ')}
</td>`).join('\n'), 30)}
                           </tr>
                        </table>
                     </td>
                  </tr>
               </table>
               <!-- end footer_colbe -->
            </td>
            <td style="background-color: ${C.cream};"></td>
         </tr>
      </table>
   </body>

</html>
`;

return (head + headCss + body).replace(/\n/g, '\r\n');
}

for (const [file, V2] of [[OUT, false], [OUT2, true]]) {
  const out = make(V2);
  fs.writeFileSync(file, out);
  const at = s => (Buffer.byteLength(out.slice(0, out.indexOf(s))) / 1024).toFixed(1);
  console.log('written', file, Buffer.byteLength(out), 'bytes', (Buffer.byteLength(out) / 1024).toFixed(1), 'KiB',
    '| fallback at', at('<div class="zw-fallback">'), 'KiB | last unsubscribe at', at('<!-- end 1_col_txt_btn_colbe_unsubscribe -->'), 'KiB');
}
