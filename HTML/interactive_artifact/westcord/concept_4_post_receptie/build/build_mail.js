// Builds ../westcord_eindejaarsmail_2026_concept_4.html: the WestCord shell (head, "Bekijk online", footer, from the
// concept 2 mail) + the post block generated with the artifact's own values + the artifact's copy in the slots.
//   node build_mail.js
const fs = require('fs'), path = require('path');
const { build, DEFAULT } = require('./gen_post.js');
const DIR = path.resolve(__dirname, '../..') + '/';   // the westcord folder
const SRC = DIR + 'concept_2_wrapped_lift/westcord_eindejaarsmail_2026_concept_2.html';
const OUT = DIR + 'concept_4_post_receptie/westcord_eindejaarsmail_2026_concept_4.html';

// values taken 1:1 from the artifact board "De volledige kerstbrief" (PostReceptie.dc.html)
const WC = {
  ...DEFAULT,
  font: 'Hind,Helvetica Neue,Arial,Helvetica,sans-serif', fontH: 'EB Garamond,Georgia,Times New Roman,serif',
  fontS: 'Caveat,Segoe Script,Bradley Hand,cursive',
  width: 700,   // the artifact canvas width
  c: {
    hero: '#012D59', heroTxt: '#FFFFFF', heroSub: '#F5A6CC', heroP: '#DCE8F1', bg: '#DCE8F1',
    paper: '#FFFFFF', paperShadow: 'rgba(1,45,89,0.14)', ink: '#012D59', soft: '#2F5F8F',
    stripe: ['#2F6FA6', '#FFFFFF', '#012D59'], box: '#F4F6F8', label: '#C8106E',
    card: '#E2127A', btn: '#E2127A', btnTxt: '#FFFFFF',
    envelope: '#FFFFFF', flapSide: '#F1F5F8', flapBottom: '#E6EEF4', envShadow: 'rgba(1,45,89,0.28)',
    stamp: '#2F6FA6', stampTxt: '#FFFFFF', counter: '#012D59', counterEdge: '#2F6FA6',
    leaf1: '#2E7D32', leaf2: '#3AAA35', berry1: '#E2127A', berry2: '#C8106E', bell: '#9FC1DA', bellBase: '#6F93B5',
    // version 2: the closed flap in the envelope's flap colour, the seal as concept 3's (pink, white border)
    flapTop: '#E6EEF4', seal: '#E2127A', sealTxt: '#FFFFFF',
  },
};

// copy 1:1 from the artifact; personal fields stay as the artifact's [placeholders]
const COPY = {
  label_1: 'WestCord', label_2: 'Hotels',
  subtitle_1: 'Kerstavond 2026', title_1: 'Er ligt post voor je, [Voornaam].',
  txt_1: 'Hij ligt klaar bij de receptie. Scroll maar, dan halen we hem voor je uit de envelop.',
  label_3: 'WestCord', label_4: 'Hotels', txt_2: 'Familiebedrijf sinds 1968', txt_3: 'Vlieland, 24 december 2026',
  title_2: 'Lieve [Voornaam],',
  txt_4: 'Het is kerstavond. In onze lobby\'s branden de lichtjes, de bar loopt gezellig vol en overal wordt nog snel een laatste cadeautje ingepakt. Een mooi moment om je even te schrijven.',
  txt_5: 'Dit jaar sliep je [X] nachten bij ons, het vaakst in [Hotelnaam]. Dank je wel dat je ons daarvoor koos.',
  subtitle_2: 'Jouw 2026 bij WestCord',
  txt_6: 'Nachten', txt_7: '[X]', txt_8: 'Favoriete hotel', txt_9: '[Hotelnaam]', txt_10: 'Laatste verblijf', txt_11: '[Maand]',
  txt_12: 'In 1968 begon het allemaal met één hotel op Vlieland. Inmiddels zijn het er vijftien, maar het gevoel is hetzelfde gebleven: bij ons ben je altijd welkom.',
  subtitle_3: 'Een klein cadeautje voor 2027', title_3: '[Aanbieding voor 2027]', btn_txt_1: 'Boek je volgende verblijf',
  txt_13: 'We wensen je hele fijne feestdagen en een gezond, warm 2027.',
  txt_14: 'Hartelijke groet,', title_4: 'Familie Westers', txt_15: 'en al onze collega\'s van WestCord Hotels',
  txt_16: 'P.S. De koffie staat klaar als je weer langskomt.',
  title_5: 'Voor [Voornaam]', label_5: 'WC', label_6: '2026',
  // version 2 (click to open): the hero lead asks for a click (own text, built from the artifact's lead; to agree with
  // WestCord) and the seal on the closed flap carries the W (as the seal in concept 3)
  txt_17: 'Hij ligt klaar bij de receptie. Klik op de envelop, dan halen we hem er voor je uit.', label_7: 'W',
};
const PREHEADER = 'Hij ligt klaar bij de receptie.';
const FONTS = '<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&amp;family=Hind:wght@400;500;600&amp;family=Caveat:wght@500;700&amp;display=swap" rel="stylesheet" type="text/css">';
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const SLOT = /\b(?:[a-z]+_)*(?:title|subtitle|txt|alt|label|badge)_\d+\b/g;
const fill = html => html.split(/(<!--(?![\[<>])[\s\S]*?-->)/).map((part, i) => i % 2 ? part : part.replace(SLOT, t => {
  if (!(t in COPY)) throw new Error('no copy for slot ' + t);
  return esc(COPY[t]);
})).join('');
// formatting only: 1 space per nesting level instead of 3 for the block in this mail (Gmail ~102 KB clipping, email_rules
// section 5); the block file in blocks/ keeps its normal indentation
const compact = s => s.split('\n').map(l => { const n = l.match(/^ */)[0].length; return ' '.repeat(Math.round(n / 3)) + l.slice(n); }).join('\n');

const src = fs.readFileSync(SRC, 'utf8').replace(/\r\n/g, '\n');
// version 1 (scroll) and version 2 (click to open, then scroll)
for (const click of [false, true]) {
const OUTV = click ? OUT.replace('.html', '_v2.html') : OUT;
const hs = build(WC, { click });
const NOTE = `<!-- WestCord eindejaarsmail 2026: concept 4 "Post bij de receptie" (artifact boards "De volledige kerstbrief",
     "Zo komt de brief tevoorschijn", "Techniek en inhoud").
     Een kerstbrief van de familie Westers die tijdens het scrollen uit een envelop op de balie schuift. Scrollvenster
     700 x 1000 met de hero en de brief als live tekst; de balie met de envelop (700 x 280) staat vast onderin het
     venster, de brief scrolt erachter weg. Aan het eind van het scrollen ligt de onderkant van de brief achter de
     balie, zoals in het artifact. ${click ? `Versie 2: de envelop ligt eerst dicht (klep met zegel); een klik op de
     envelop opent de klep en het eerste deel van de brief schuift er vanzelf uit, daarna scroll je zoals in versie 1.
     Eigen invulling op verzoek, niet in het artifact.` : 'Geen klik, geen state: alleen een detectie-checkbox.'}
     Kleuren, fonts, maten en teksten 1:1 uit het artifact.
     Fallback (Gmail, Outlook, Samsung): "de brief als gewone mail, met de envelop eronder" (envelop vereenvoudigd in
     tabellen; het artifact bedoelt de balie met envelop als afbeelding).
     Mobiel (het artifact heeft geen mobiel ontwerp): hoger venster (1200 van 700), brede brief met leesbare tekst.
     Gebouwd met build/gen_post.js + build/build_mail.js; wijzig de generator, niet de HTML.
     Persoonlijke velden ([Voornaam], [X], [Hotelnaam], [Maand]) zijn placeholders. Zonder verblijfsdata vervalt het
     blokje "Jouw 2026" en blijft de brief staan (artifact); de zin met [X] nachten heeft dan ook tekst nodig van de
     klant. Wie tekent (familie Westers) en de aanbieding voor 2027: af te stemmen met WestCord.
     Bron: Claude Design concept "WestCord eindejaarsmail: de lift", concept 4. -->`;

// head: everything up to the concept 2 block's head CSS, with the concept 2 note and the font link replaced
let head = src.slice(0, src.indexOf('      <!-- car_1_col_subtitle_title_txt_x6_img_btn_x2 -->'));
head = head.replace(/<!-- WestCord eindejaarsmail 2026: concept 2[\s\S]*?-->/, NOTE);
const oldFonts = head.match(/<link href="https:\/\/fonts\.googleapis\.com[^>]*>/);
if (!oldFonts) throw new Error('font link not found');
head = head.replace(oldFonts[0], FONTS);
const css = `      <!-- ${hs.name} -->\n${compact(hs.css)}\n      <!-- // ${hs.name} -->\n   </head>\n`;

// body: <body> up to the WestCord header, then only its "Bekijk online" row (the logo is part of the artifact's hero),
// then the block, then the rest of concept 2 after its block (closing table + footer)
const bodyStart = src.indexOf('   <body');
const headerStart = src.indexOf('               <!-- header_westcord_wordmark -->');
const endMarker = '<!-- end car_1_col_subtitle_title_txt_x6_img_btn_x2 -->';
const tail = src.slice(src.indexOf('\n', src.indexOf(endMarker)) + 1);
const viewOnline = `               <!-- header_westcord_view_online: the WestCord logo is part of the hero in the module below -->
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
fs.mkdirSync(path.dirname(OUTV), { recursive: true });
fs.writeFileSync(OUTV, out);
const at = s => (Buffer.byteLength(out.slice(0, out.indexOf(s))) / 1024).toFixed(1);
console.log('written', OUTV, Buffer.byteLength(out), 'bytes', (Buffer.byteLength(out) / 1024).toFixed(1), 'KiB',
  '| fallback at', at(`<div class="${click ? 'pk' : 'po'}-fallback">`), 'KiB | unsubscribe at', at('<!-- unsubscribe link -->'), 'KiB');
}
