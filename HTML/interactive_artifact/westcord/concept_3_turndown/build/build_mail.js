// Builds ../westcord_eindejaarsmail_2026_concept_3.html: WestCord head/header/footer (from the concept 2 mail) + the
// hotspot block generated with the artifact's own values + the artifact's copy in the slots.
//   node build_mail.js
const fs = require('fs'), path = require('path');
const { build, DEFAULT } = require('./gen_hotspot.js');
const DIR = path.resolve(__dirname, '../..') + '/';   // the westcord folder
const SRC = DIR + 'concept_2_wrapped_lift/westcord_eindejaarsmail_2026_concept_2.html';
const OUT = DIR + 'concept_3_turndown/westcord_eindejaarsmail_2026_concept_3.html';

// values taken 1:1 from the artifact board "Het kussenchocolaatje" (Kussenchocolaatje.dc.html)
const WC = {
  ...DEFAULT,
  font: 'Hind,Helvetica Neue,Arial,Helvetica,sans-serif', fontH: 'EB Garamond,Georgia,Times New Roman,serif',
  outerClass: '', outerPad: '0', headerPad: '12px 60px 44px 60px',  // 12px: the WestCord header above already has 28px
  headerBg: '#012D59', title: '#FFFFFF', intro: '#D8DEE8', stageBg: '#DCE8F1', pillowBg: '#FFFFFF',
  pillowShadow: '0 20px 50px rgba(14,26,43,0.15)', pillowLine: '#F1EBE0', pillowRadius: ['56px', '32px'], lineRadius: ['42px', '24px'],
  chocBg: '#3B2418', chocLine: '#5A3A28', chocRadius: '4px',
  flaps: ['#012D59', '#1D4B7A', '#2F6FA6', '#174170'], foldTB: '#DCE8F1', foldLR: '#CFDFEC',
  sealBg: '#E2127A', sealBorder: '#FFFFFF', sealTxt: '#FFFFFF',
  accent: '#C8106E', txt: '#012D59', wishLabel: '#B3CDE0', wishTxt: '#F4EBDD', wishYear: '#FFFFFF', status: '#2F5F8F',
  btnBg: '#E2127A', btnTxt: '#FFFFFF', resetLine: '#012D59', radius: '4px',
  fs: { title: ['40px', '46px', '500'], intro: ['17px', '25px'], label: ['11px', '15px'], fact: ['16px', '22px'], factSide: ['15px', '21px'],
        wishLabel: ['12px', '16px'], wishTxt: ['17px', '22px'], year: ['60px', '60px', '500'], seal: '20px', status: ['15px', '21px'],
        btn: ['16px', '600', 48, 240], mTitle: ['30px', '34px'], mYear: ['34px', '34px'], sYear: ['28px', '28px'] },
};

// copy 1:1 from the artifact; personal fields stay as the artifact's [placeholders]
const COPY = {
  title_1: 'Welterusten, [Voornaam].',
  txt_1: 'We hebben iets op je kussen gelegd. Vouw de vier hoekjes open.',
  subtitle_1: 'Hoekje 1', subtitle_2: 'Hoekje 2', subtitle_3: 'Hoekje 3', subtitle_4: 'Hoekje 4',
  txt_2: 'Je sliep dit jaar [X] nachten bij ons. Hopelijk allemaal even goed.',
  txt_3: '[Hotelnaam] was jouw favoriet.',
  txt_4: 'Samen dronken we [Aantal] kopjes koffie bij het ontbijt.',
  txt_5: 'Fijn dat je er was, [Voornaam].',
  txt_6: 'Klik op een hoekje om het open te vouwen.',
  txt_7: 'Nog 3 hoekjes te gaan.', txt_8: 'Nog 2 hoekjes te gaan.', txt_9: 'Nog 1 hoekje te gaan.',
  txt_10: 'Alle hoekjes open. Welterusten!',
  label_1: 'WestCord', txt_11: 'wenst je een geweldig', title_2: '2027', label_2: 'W',
  btn_txt_1: 'Boek je volgende nacht', btn_txt_2: 'Opnieuw inpakken',
};
const PREHEADER = 'We hebben iets op je kussen gelegd.';
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const SLOT = /\b(?:[a-z]+_)*(?:title|subtitle|txt|alt|label)_\d+\b/g;
const fill = html => html.split(/(<!--(?![\[<>])[\s\S]*?-->)/).map((part, i) => i % 2 ? part : part.replace(SLOT, t => {
  if (!(t in COPY)) throw new Error('no copy for slot ' + t);
  return esc(COPY[t]);
})).join('');
const ind = (s, n) => s.split('\n').map(l => l ? ' '.repeat(n) + l : l).join('\n');

const src = fs.readFileSync(SRC, 'utf8').replace(/\r\n/g, '\n');
const hs = build(WC);
const NOTE = `<!-- WestCord eindejaarsmail 2026: concept 3 "Turndown service" (artifact board "Het kussenchocolaatje").
     Een ingepakt chocolaatje op het kussen met vier flapjes. Elk flapje is een label voor een eigen checkbox: tikken
     vouwt het hoekje open en toont het feitje; zijn alle vier open, dan staat de wens op het chocolaatje en
     verschijnen de knoppen. "Opnieuw inpakken" is een reset-knop (daarvoor staan de inputs in een <form>).
     Kleuren, fonts, maten en posities 1:1 uit het artifact; de posities staan als percentage van het artifact-canvas
     (700 x 680), zodat het geheel meeschaalt met de mailbreedte.
     Fallback (Gmail, Outlook, Samsung): de eindstand uit het artifact (alle hoekjes open, stap 4) in tabellen.
     Mobiel (het artifact heeft geen mobiel ontwerp): het kussen schaalt mee, het feitje van het laatst geopende
     hoekje staat boven het chocolaatje en vervangt het vorige (z-index animatie: de nieuwste ligt bovenop).
     Gebouwd uit blocks/hotspot/hotspot_1_col_row_1_title_txt_row_2_subtitle_txt_x4_txt_title_row_3_btn_x2.html
     met de artifact-waarden; wijzigingen in het blok ook hier doorvoeren.
     Persoonlijke velden ([Voornaam], [X], [Hotelnaam], [Aantal]) zijn placeholders. Nog nodig van de klant: tekst
     voor ontvangers zonder verblijfsdata, zodat er nooit "[X]" of "0" in de mail staat. Logo is een tekstversie.
     Teksten uit het concept, nog af te stemmen met WestCord.
     Bron: Claude Design concept "WestCord eindejaarsmail: de lift", concept 3. -->`;

// head: everything up to the lift block's head CSS, with the concept 2 note replaced
let head = src.slice(0, src.indexOf('      <!-- car_1_col_subtitle_title_txt_x6_img_btn_x2 -->'));
head = head.replace(/<!-- WestCord eindejaarsmail 2026: concept 2[\s\S]*?-->/, NOTE);
const css = `      <!-- ${hs.name} -->\n${ind(hs.css, 6)}\n      <!-- // ${hs.name} -->\n   </head>\n`;

// body: <body> through the WestCord header (no spacer: the header and the artifact's navy band form one band),
// then the block, then the rest of concept 2 after the lift block (closing table + footer)
const bodyStart = src.indexOf('   <body');
const headerEnd = src.indexOf('\n', src.indexOf('<!-- end header_westcord_wordmark -->')) + 1;
const liftEndMarker = '<!-- end car_1_col_subtitle_title_txt_x6_img_btn_x2 -->';
const tail = src.slice(src.indexOf('\n', src.indexOf(liftEndMarker)) + 1);
let body = src.slice(bodyStart, headerEnd).replace(/(<div style="display: none; max-height: 0px; overflow: hidden;">)preheader(<\/div>)/, `$1${esc(PREHEADER)}$2`);
body += ind(fill(hs.bodyWithoutCss).replace(/\n$/, ''), 15) + '\n' + tail;

const out = (head + fill(css) + '\n' + body).replace(/\n/g, '\r\n');
fs.writeFileSync(OUT, out);
console.log('written', OUT, Buffer.byteLength(out), 'bytes', (Buffer.byteLength(out) / 1024).toFixed(1), 'KiB');
