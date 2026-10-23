// Builds ../coram_eindejaarsmail_2026_concept_4.html: the Coram shell (header bar, footer) + the pipe block generated
// with the artifact's values + the feedback question under the message + the artifact's copy.
//   node build_mail.js
const path = require('path');
const { build, DEFAULT } = require('./gen_leiding.js');
const { F, C, fill, ind, page, write } = require('../../shell/shell.js');
const OUT = path.resolve(__dirname, '../coram_eindejaarsmail_2026_concept_4.html');

// values taken 1:1 from the artifact board "De lijn van het jaar (klikbaar)" (LeidingMail.dc.html)
const CL = {
  ...DEFAULT,
  font: F,
  c: {
    wall: C.wallLight, wallLine: 'rgba(120,110,100,0.18)', ink: C.ink, grey: C.grey, soft: C.sand, card: C.white,
    dark: C.ink, darkTxt: C.white, blue: C.blue, blueRing: 'rgba(37,37,176,0.18)', pipe: '#B3ACA3',
    black: C.black, clog: '#5E5248', line: C.sand, rim: '#EDEBE7', bath: '#FAF9F7', white: C.white,
  },
};

// copy 1:1 from the artifact; personal fields and Coram's input stay the artifact's [placeholders]
const COPY = {
  subtitle_1: 'De lijn van 2026',
  title_1: 'Draai de kraan open, [Voornaam].', txt_1: 'Dan volgen we samen de leiding door jullie jaar.', btn_txt_1: 'Kraan open',
  title_2: 'Het loopt. Of toch niet helemaal?', txt_2: 'Scroll mee langs de leiding. Een vakman ziet het meteen, [Voornaam].',
  subtitle_2: 'Jullie jaar', title_3: '[X]', txt_3: 'Coram producten gemonteerd door [Bedrijfsnaam].',
  subtitle_3: 'Jullie favoriete merk', title_4: '[Merknaam]', subtitle_4: 'Jullie top 3',
  txt_4: '[Product 1]', txt_5: '[Product 2]', txt_6: '[Product 3]',
  subtitle_5: 'Wist je dat?', txt_7: '[Weetje over een Coram product, de ontwerpstudio of de productie, aan te leveren door Coram]',
  subtitle_6: 'Ons jaar samen', title_5: '50+', txt_8: 'landen waar onze ontwerpen naartoe gaan. En overal staat er een vakman tussen ontwerp en eindresultaat.',
  btn_txt_2: 'Ontstop', btn_txt_3: 'Ontstop', btn_txt_4: 'Laatste klusje',
  subtitle_7: 'Bedankt voor het vakwerk', subtitle_8: 'Het bad loopt. Dankzij jullie.',
  title_6: 'Jullie maken van onze ontwerpen een perfect eindresultaat.',
  txt_9: 'Bedankt voor elke strakke montage dit jaar.', txt_10: 'Fijne feestdagen en tot in 2027.\nHet team van Coram',
};
// the board has no subject or preheader: the board's title and its closed headline
const TITLE = 'De lijn van het jaar';
const PREHEADER = 'Draai de kraan open, [Voornaam].';

const NOTE = `<!-- Coram eindejaarsmail 2026: concept 4 "De lijn van het jaar" (artifact boards "De lijn van het jaar (klikbaar)"
     en "De momenten, techniek en gewicht").
     Een matzwarte wandkraan bovenin. Wie hem opendraait, ziet het water door de leiding lopen, langs de kaarten van
     het jaar, tot het vastloopt. Onderweg zitten drie verstoppingen die de installateur zelf weghaalt (vier
     checkboxes na elkaar; elke ontstopknop verschijnt pas als het water hem bereikt). Na de laatste loopt een blauwe
     straal uit de badkraan het bad in en wisselt de kop van de boodschap.
     Kleuren, fonts, maten, posities en teksten 1:1 uit het artifact.
     Afwijkingen: waar een verstopping zat, wordt de leiding blauw doorgetrokken (het artifact laat daar een gat); de
     feedbackvraag staat onder de boodschap (in het artifact valt hij erover); de smileys zijn tekens in plaats van SVG.
     Mobiel: een eenvoudiger leiding langs de linkerkant (artifact), de kaarten onder elkaar.
     Fallback (Gmail, Outlook, Samsung): de leiding direct blauw, zonder verstoppingen, met de straal in het bad.
     Gebouwd met build/gen_leiding.js + build/build_mail.js; wijzig de generator, niet de HTML.
     Persoonlijke velden ([Voornaam], [X], [Bedrijfsnaam], [Merknaam], [Product 1-3]) zijn placeholders; het weetje
     levert Coram aan. Teksten af te stemmen met Coram.
     Bron: Claude Design concept "Coram eindejaarsmail: bedankt voor het vakwerk", concept 4. -->`;

const f = (size, lh, extra = '') => `font-family: ${F}; font-size: ${size}px; line-height: ${lh}px;${extra}`;
// the feedback question (board y 2690, on the wall): two white 52px circles; the board's SVG faces become ☺ / ☹
const face = (ch, label) => `<td width="52" height="52" align="center" valign="middle" bgcolor="${C.white}" style="width: 52px; height: 52px; border-radius: 26px;">
   <!-- feedback link: ${label} -->
   <a href="https://100procent.nl/" target="_blank" title="${label}" style="display: block; font-family: Arial, Helvetica, sans-serif; font-size: 28px; line-height: 52px; color: ${C.ink}; text-decoration: none;">${ch}</a>
</td>`;
const feedback = `<!-- 1_col_txt_icon_x2_coram_feedback -->
<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="${C.wallLight}">
   <tr>
      <td align="center" style="padding: 0 20px 44px 20px; background-color: ${C.wallLight};">
         <p style="margin: 0; ${f(16, 23)} color: ${C.grey};">Wat vond je van deze mail?</p>
         <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center" style="margin: 14px auto 0 auto;">
            <tr>
${ind(face('&#9786;', 'Leuk') + `\n<td width="18" style="width: 18px; font-size: 0; line-height: 0;">&nbsp;</td>\n` + face('&#9785;', 'Niet leuk'), 15)}
            </tr>
         </table>
      </td>
   </tr>
</table>
<!-- end 1_col_txt_icon_x2_coram_feedback -->`;

const hs = build(CL);
const html = page({ note: NOTE, title: TITLE, preheader: PREHEADER, header: true, block: { name: hs.name, css: fill(hs.css, COPY) },
  body: ind(fill(hs.bodyWithoutCss, COPY), 15) + '\n' + ind(feedback, 15) + '\n' });
write(OUT, html, '<div class="cl-fallback">');
