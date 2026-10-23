// Builds ../coram_eindejaarsmail_2026_concept_3.html: the Coram shell (header bar, footer) + the rail block generated
// with the artifact's values + the board's message and "Jullie jaar in vakwerk" sections + the artifact's copy.
//   node build_mail.js
const path = require('path');
const { build, DEFAULT } = require('./gen_rek.js');
const { F, C, fill, ind, page, write } = require('../../shell/shell.js');
const OUT = path.resolve(__dirname, '../coram_eindejaarsmail_2026_concept_3.html');

// values taken 1:1 from the artifact board "Recht gehangen (klikbaar)" (WaterpasMail.dc.html)
const CW = {
  ...DEFAULT,
  font: F,
  c: {
    wall: C.wall, wallLine: 'rgba(120,110,100,0.25)', ink: C.ink, grey: C.grey, blue: C.blue, blueRing: 'rgba(37,37,176,0.18)',
    blueLine: 'rgba(37,37,176,0.45)', btnBg: 'rgba(255,255,255,0.75)', white: C.white, black: C.black,
    rackShadow: 'rgba(40,30,20,0.3)', level: '#B9BEC3', vial: '#E9EDD8', vialLine: '#7D8288', vialMark: C.grey,
    towel: C.pink, towelTxt: C.white, towelLine: 'rgba(255,255,255,0.7)', towelShadow: 'rgba(40,30,20,0.25)',
  },
};

// copy 1:1 from the artifact (DCLogic "copy" per step); personal fields stay the artifact's [placeholders]
const COPY = {
  subtitle_1: 'Nog één klusje voor 2026', title_1: 'Hang jij hem even recht, [Voornaam]?', txt_1: 'Tik op het pijltje rechtsonder.',
  subtitle_2: 'Oeps', title_2: 'Net iets te enthousiast.', txt_2: 'Nog één tikje, linksboven.',
  subtitle_3: 'Bedankt voor het vakwerk', title_3: 'Strak. Zoals elke montage van jullie dit jaar.',
  label_1: 'Handdoek en bedankt', label_2: 'Nog een keer',
};
// the board has no subject or preheader: the board's title and its opening line
const TITLE = 'Recht gehangen';
const PREHEADER = 'Hang jij hem even recht, [Voornaam]?';

const NOTE = `<!-- Coram eindejaarsmail 2026: concept 3 "Recht gehangen" (artifact boards "Recht gehangen (klikbaar)" en
     "De momenten, techniek en gewicht").
     Een matzwart handdoekrek hangt net niet recht. Twee checkboxes na elkaar: het eerste pijltje draait het rek te
     ver door, het tweede zet het waterpas en er hangt een handdoek aan: "Handdoek en bedankt". "Nog een keer" zet het
     terug. Daarna een rustige, gewone mail: de boodschap en "Jullie jaar in vakwerk".
     Kleuren, fonts, maten, teksten en de animatie 1:1 uit het artifact; het rek in procenten van 520 x 380.
     Fallback (Gmail, Outlook, Samsung): het rechte rek met de handdoek in tabellen en de teksten van stap 3.
     Mobiel (het artifact heeft geen mobiel ontwerp): het rek schaalt mee, de knoppen blijven groot genoeg om te tikken.
     Gebouwd met build/gen_rek.js + build/build_mail.js; wijzig de generator, niet de HTML.
     Persoonlijke velden ([Voornaam], [X], [Merknaam]) zijn placeholders; zonder data valt "Jullie jaar in vakwerk"
     terug op algemene Coram cijfers (artifact). Teksten uit het concept, af te stemmen met Coram.
     Bron: Claude Design concept "Coram eindejaarsmail: bedankt voor het vakwerk", concept 3. -->`;

const f = (size, lh, extra = '') => `font-family: ${F}; font-size: ${size}px; line-height: ${lh}px;${extra}`;
// the board's message section: 560 high, content (338) centred with padding 80 90 -> 111 top and bottom
const message = `<!-- 1_col_title_txt_x3_coram_message -->
<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="${C.white}">
   <tr>
      <td align="center" class="cr3-msg" style="padding: 111px 90px; word-wrap: break-word; overflow-wrap: break-word;">
         <h2 class="cr3-h2" style="margin: 0; ${f(34, 42.5, ' font-weight: 300;')} color: ${C.ink};">Jullie maken van onze ontwerpen een perfect eindresultaat.</h2>
         <p style="margin: 24px 0 0 0; ${f(18, 29.7, ' font-weight: 300;')} color: ${C.grey};">Beste [Voornaam], wij tekenen een handdoekrek, een spiegel, een douchewand. Maar pas als jullie hem monteren, klopt het. Recht, stevig en precies op de goede plek.</p>
         <p style="margin: 24px 0 0 0; ${f(20, 30, ' font-weight: 500;')} color: ${C.ink};">Bedankt voor elke strakke montage dit jaar.</p>
         <p style="margin: 32px 0 0 0; ${f(17, 27.2, ' font-weight: 300;')} color: ${C.ink};">Fijne feestdagen en tot in 2027.<br>Het team van Coram</p>
      </td>
   </tr>
</table>
<!-- end 1_col_title_txt_x3_coram_message -->`;

// "Jullie jaar in vakwerk": three white cards (180 wide, 20 apart) on the light band; stacked on mobile
const card = (big, bigStyle, label) => `<td class="cr3-col" width="180" valign="top" bgcolor="${C.white}" style="width: 180px; padding: 30px 18px; text-align: center; background-color: ${C.white};">
   <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
         <td height="46" align="center" valign="middle" style="height: 46px; ${bigStyle} color: ${C.blue};">${big}</td>
      </tr>
   </table>
   <p style="margin: 10px 0 0 0; ${f(15, 21)} color: ${C.grey};">${label}</p>
</td>`;
const gap = `<td class="cr3-gap" width="20" style="width: 20px; font-size: 0; line-height: 0;">&nbsp;</td>`;
const year = `<!-- 3_col_title_txt_coram_year: falls back on general Coram figures without data (artifact) -->
<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="${C.light}">
   <tr>
      <td align="center" class="cr3-year" style="padding: 64px 60px 82px 60px;">
         <h3 style="margin: 0; ${f(26, 38, ' font-weight: 400;')} color: ${C.ink};">Jullie jaar in vakwerk</h3>
         <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 36px 0 0 0; table-layout: fixed;">
            <tr>
${ind([card('[X]', f(46, 46, ' font-weight: 300;'), 'Coram producten gemonteerd'), gap,
       card('[Merknaam]', f(28, 34, ' font-weight: 300;'), 'jullie favoriete merk'), gap,
       card('50+', f(46, 46, ' font-weight: 300;'), 'landen waar onze ontwerpen naartoe gaan')].join('\n'), 15)}
            </tr>
         </table>
      </td>
   </tr>
</table>
<!-- end 3_col_title_txt_coram_year -->`;

const extraCss = `<!-- coram_concept_3 -->
<style type="text/css">
   @media only screen and (max-width: 600px) {
      .cr3-msg {
         padding: 56px 16px !important;
      }

      .cr3-h2 {
         font-size: 26px !important;
         line-height: 33px !important;
      }

      .cr3-year {
         padding: 48px 16px !important;
      }

      .cr3-col {
         display: block !important;
         width: 100% !important;
         margin: 0 0 12px 0 !important;
         box-sizing: border-box !important;
      }

      .cr3-gap {
         display: none !important;
      }
   }
</style>
<!-- // coram_concept_3 -->`;

const hs = build(CW);
const html = page({ note: NOTE, title: TITLE, preheader: PREHEADER, header: true, block: { name: hs.name, css: fill(hs.css, COPY) },
  body: ind(fill(hs.bodyWithoutCss, COPY), 15) + '\n' + ind(message, 15) + '\n' + ind(year, 15) + '\n', extraCss });
write(OUT, html, '<div class="cw-fallback">');
