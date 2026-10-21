// Builds ../westcord_eindejaarsmail_2026_concept_1.html: the WestCord shell (head, "Bekijk online", footer, from the
// concept 2 mail) + the lift block generated with the artifact's own values + the artifact's copy in the slots.
//   node build_mail.js
const fs = require('fs'), path = require('path');
const { build, DEFAULT } = require('./gen_lift.js');
const DIR = path.resolve(__dirname, '../..') + '/';   // the westcord folder
const SRC = DIR + 'concept_2_wrapped_lift/westcord_eindejaarsmail_2026_concept_2.html';
const OUT = DIR + 'concept_1_de_lift/westcord_eindejaarsmail_2026_concept_1.html';

// values taken 1:1 from the artifact board "Main.dc.html" (and the cabin from "Scrollmomenten.dc.html")
const WC = {
  ...DEFAULT,
  font: 'Hind,Helvetica Neue,Arial,Helvetica,sans-serif', fontH: 'EB Garamond,Georgia,Times New Roman,serif',
  outerClass: '', outerPad: '0',
  width: 700,   // the artifact canvas width: the scene is one-on-one at 700px
  c: {
    sky: '#012D59', star: '#F4EBDD', fw1: '#9FC1DA', fw2: '#E8D3A6', logo: '#FFFFFF', hero: '#FFFFFF', heroSub: '#D8DEE8', hint: '#9FC1DA',
    lights: '#F2C66D', plant: '#3F5A45', bench: '#8C7A62', railing: '#9FC1DA', roofCap: '#B3CDE0', roofHouse: '#DCE8F1', roofLabel: '#012D59',
    door: '#1F2530', roofEdge: '#B3CDE0', facade: '#DCE8F1', shaft: '#1F2530', shaftLine: '#3A4150', num: '#9FC1DA', numLit: '#F2C66D', numGlow: 'rgba(242,198,109,0.7)', numCore: '#FFF6DE', numHalo: 'rgba(242,198,109,0.45)', numHalo0: 'rgba(242,198,109,0)', slab: '#B3CDE0',
    plate: '#FFFDF8', shadow: 'rgba(14,26,43,0.18)', badgeDark: '#012D59', badgeDarkTxt: '#FFFDF8', badgeLight: '#DCE8F1', badgeLightTxt: '#012D59',
    accent: '#C8106E', txt: '#012D59', soft: '#2F5F8F', winFrame: '#B3CDE0', winLit: '#F2D9A0', winDark: '#243247',
    lobby: '#F3E6CC', lobbyShaft: '#2A2F38', lobbyCard: '#FAF1DF', lampCord: '#C8106E', lamp: '#9FC1DA', keyBoard: '#E3D3B3', keyFrame: '#9FC1DA',
    key: '#C8106E', deskTop: '#9FC1DA', desk: '#1D2B40', bottles: ['#3F5A45', '#7A2E2E', '#9FC1DA', '#243247'], shelf: '#5A3E2B', stool: '#1D2B40',
    liftBadge: '#9FC1DA', photoBg: '#DCE8F1', sign: '#012D59', signTxt: '#FFFFFF', frame: '#2A2F38', inside: '#F6E7C8', insideLine: '#9FC1DA', doorPanel: '#DCE8F1',
    pavement: '#9A9184', curb: '#7C7468', mat: '#012D59', uspBg: '#DCE8F1', uspTxt: '#2F5F8F', check: '#3AAA35', ctaBg: '#FFFFFF',
    btn: '#E2127A', btnTxt: '#FFFFFF', btn2: '#012D59', cabin: '#DCE8F1', cabinLine: '#9FC1DA', cabinGlow: 'rgba(242,198,109,0.35)', seam: '#6F93B5',
  },
};

// copy 1:1 from the artifact; personal fields stay as the artifact's [placeholders]
const COPY = {
  label_7: 'WestCord', label_8: 'Hotels',
  title_1: 'Stap in onze lift.', txt_1: 'We gaan naar beneden, door jouw jaar bij WestCord.', label_1: 'Scroll omlaag', label_2: 'Dakterras',
  badge_1: 'Persoonlijk', subtitle_1: 'Verdieping 4', title_2: 'Jouw jaar bij ons', title_3: '[X]', txt_2: 'nachten sliep je dit jaar bij WestCord',
  badge_2: 'Persoonlijk', subtitle_2: 'Verdieping 3', title_4: 'Jouw laatste verblijf', img_alt_1: '[Foto hotel]', txt_3: '[Hotelnaam]', txt_4: '[Plaats]',
  badge_3: 'Algemeen', subtitle_3: 'Verdieping 2', title_5: 'Ons jaar in cijfers', title_6: '[Aantal]', txt_5: 'gasten', title_7: '[Aantal]',
  txt_6: 'ontbijten geserveerd', title_8: '[Hoogtepunt]', txt_7: 'van dit jaar',
  badge_4: 'Vooruitblik', subtitle_4: 'Verdieping 1', title_9: 'Alvast in 2027', img_alt_2: '[Beeld arrangement]',
  txt_8: '[Nieuw hotel, vernieuwing of arrangement]', link_txt_1: 'Bekijk',
  title_10: 'Welkom beneden.', txt_9: 'De lift stopt in de lobby. Stap uit en kom weer langs.', label_3: 'Receptie', label_4: 'Bar',
  label_5: 'L', label_6: 'WestCord Hotels',
  txt_10: '15 unieke hotels in Nederland', txt_11: 'Sinds 1968', txt_12: 'Nederlands familiebedrijf',
  title_11: 'Tot snel bij WestCord', txt_13: '[Korte uitnodiging om te boeken of een cadeaubon te geven]',
  btn_txt_1: 'Boek je verblijf', btn_txt_2: 'Geef een cadeaubon',
};
const PREHEADER = 'We gaan naar beneden, door jouw jaar bij WestCord.';
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const SLOT = /\b(?:[a-z]+_)*(?:title|subtitle|txt|alt|label|badge)_\d+\b/g;
const fill = html => html.split(/(<!--(?![\[<>])[\s\S]*?-->)/).map((part, i) => i % 2 ? part : part.replace(SLOT, t => {
  if (!(t in COPY)) throw new Error('no copy for slot ' + t);
  return esc(COPY[t]);
})).join('');
const ind = (s, n) => s.split('\n').map(l => l ? ' '.repeat(n) + l : l).join('\n');
// formatting only: 1 space per nesting level instead of 3 for the block in this mail (Gmail ~102 KB clipping, email_rules
// section 5); the block file in blocks/ keeps its normal indentation
const compact = s => s.split('\n').map(l => { const n = l.match(/^ */)[0].length; return ' '.repeat(Math.round(n / 3)) + l.slice(n); }).join('\n');

const src = fs.readFileSync(SRC, 'utf8').replace(/\r\n/g, '\n');
const hs = build(WC);
const NOTE = `<!-- WestCord eindejaarsmail 2026: concept 1 "De lift" (artifact boards "Main", "Lagen", "Scrollmomenten").
     De liftcabine staat stil in beeld; het hotel schuift eronderdoor, van het dakterras via vier verdiepingen naar de
     lobby. Scrollvenster 700 x 900 en gebouw 700 x 4200 in procenten, zodat de cabine op elke breedte precies in het
     lifthuis op het dak begint en precies in de ingang tussen receptie en bar landt. De ingang is een voorlaag: hij
     schuift over de cabine en landt erop met open deuren. Geen klik, geen state: alleen een detectie-checkbox.
     Kleuren, fonts, maten en posities 1:1 uit het artifact.
     Fallback (Gmail, Outlook, Samsung): dezelfde doorsnede in tabellen, met de lift in de lobby (artifact "Lagen":
     "Mailprogramma's zonder ondersteuning tonen dezelfde doorsnede als statisch beeld met de lift in de lobby").
     Mobiel (het artifact heeft geen mobiel ontwerp): het gebouw schaalt mee, de platen worden brede kaarten voor de
     cabine met leesbare tekst.
     Gebouwd met build/gen_lift.js + build/build_mail.js; wijzig de generator, niet de HTML.
     Persoonlijke velden ([X], [Hotelnaam], [Plaats], [Aantal], [Hoogtepunt]) zijn placeholders; nog nodig van de klant:
     tekst voor ontvangers zonder verblijfsdata (artifact: "zonder data valt een plaat terug op algemene content").
     Beelden zijn placeholders. Teksten uit het concept, nog af te stemmen met WestCord.
     Bron: Claude Design concept "WestCord eindejaarsmail: de lift", concept 1. -->`;

// head: everything up to the lift block's head CSS, with the concept 2 note replaced
let head = src.slice(0, src.indexOf('      <!-- car_1_col_subtitle_title_txt_x6_img_btn_x2 -->'));
head = head.replace(/<!-- WestCord eindejaarsmail 2026: concept 2[\s\S]*?-->/, NOTE);
// the block's CSS and markup go in without extra indentation: this module is large and indentation counts towards
// Gmail's ~102 KB clipping limit (email_rules section 5); the start/end markers keep it easy to find
const css = `      <!-- ${hs.name} -->\n${compact(hs.css)}\n      <!-- // ${hs.name} -->\n   </head>\n`;

// body: <body> up to the WestCord header, then only its "Bekijk online" row (the logo is part of the artifact's sky),
// then the block, then the rest of concept 2 after the lift block (closing table + footer)
const bodyStart = src.indexOf('   <body');
const headerStart = src.indexOf('               <!-- header_westcord_wordmark -->');
const liftEndMarker = '<!-- end car_1_col_subtitle_title_txt_x6_img_btn_x2 -->';
const tail = src.slice(src.indexOf('\n', src.indexOf(liftEndMarker)) + 1);
const viewOnline = `               <!-- header_westcord_view_online: the WestCord logo is part of the sky in the module below -->
               <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#012D59">
                  <tr>
                     <td align="right" class="pmr16" style="padding: 12px 24px 0 24px; font-family: Hind,Helvetica Neue,Arial,Helvetica,sans-serif; font-size: 13px; line-height: 18px; font-weight: 400;">
                        <!-- view online link -->
                        <a href="https://100procent.nl/" title="Online versie" target="_blank" style="color: #FFFFFF; text-decoration: underline;">Bekijk online</a>
                     </td>
                  </tr>
               </table>
               <!-- end header_westcord_view_online -->
`;
let body = src.slice(bodyStart, headerStart).replace(/(<div style="display: none; max-height: 0px; overflow: hidden;">)preheader(<\/div>)/, `$1${esc(PREHEADER)}$2`);
// this mail is as wide as the artifact canvas (700) instead of the WestCord shell's 648
const shellWidth = 'width: 648px; max-width: 648px;';
if (!body.includes(shellWidth)) throw new Error('shell width not found');
body = body.replace(shellWidth, `width: ${WC.width}px; max-width: ${WC.width}px;`);
body += viewOnline + compact(fill(hs.bodyWithoutCss).replace(/\n$/, '')) + '\n' + tail;

const out = (head + fill(css) + '\n' + body).replace(/\n/g, '\r\n');
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, out);
console.log('written', OUT, Buffer.byteLength(out), 'bytes', (Buffer.byteLength(out) / 1024).toFixed(1), 'KiB');
