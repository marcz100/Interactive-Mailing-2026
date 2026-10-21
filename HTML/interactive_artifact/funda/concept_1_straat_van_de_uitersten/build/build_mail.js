// Builds ../funda_eindejaarsmail_2026_concept_1.html: the Funda shell (head from shell_head.html, header, the
// "Meer cijfers?" block and the footer from the artifact) + the street block generated with the artifact's own values
// + the artifact's copy in the slots.
//   node build_mail.js
const fs = require('fs'), path = require('path');
const { build, DEFAULT } = require('./gen_straat.js');
const OUT = path.resolve(__dirname, '../funda_eindejaarsmail_2026_concept_1.html');
const HEAD = path.resolve(__dirname, 'shell_head.html');

// values taken 1:1 from the artifact board "B2C 1 · De straat van de uitersten"
const FD = {
  ...DEFAULT,
  font: 'Figtree,Helvetica Neue,Arial,Helvetica,sans-serif',
  pageBg: '#FFFFFF', cardBg: '#FFFFFF',
  c: {
    sky: '#E3F2FB', sub: '#0071B3', ink: '#2A2A2A', intro: '#3A3A3A', ground: '#3E9B6E',
    houses: [['#F7A100', '#D98A00', '#2A2A2A'], ['#F1E2CF', '#D8C3A8', '#2A2A2A'], ['#0071B3', '#00548A', '#FFFFFF'],
             ['#FFC94D', '#E0A92A', '#2A2A2A'], ['#3E9B6E', '#2E7A55', '#FFFFFF'], ['#E8A0A0', '#C97C7C', '#2A2A2A']],
    h24: '#6B2A1F', roof24: '#4A1D15', wreath: '#3E9B6E', lightsOff: '#8A4A3E', lightsOn: '#FFD27A',
    win: '#24456B', winLit: '#FFD966', winFrame: '#FFFFFF', door: '#FFFFFF', doorOpen: '#FFE7A3', doorLocked: '#B98A80', doorTxt: '#2A2A2A',
    hintLine: '#C9D3DC', hint: '#5A5A5A', cardLine: '#E1E6EB', photo: '#D9E4EC', photoTxt: '#4A5A68',
    rec: '#5A5A5A', value: '#2A2A2A', place: '#0071B3', line: '#3A3A3A', progress: '#5A5A5A',
    finale: '#6B2A1F', finaleLabel: '#FFD27A', finaleTxt: '#FFFFFF', btn: '#FFFFFF', btnTxt: '#6B2A1F',
  },
};

// copy 1:1 from the artifact; the record values stay the artifact's [placeholders] (Funda-wide figures, no
// recipient data)
const COPY = {
  // a new line in the copy becomes <br> (the artifact breaks the title after "straat")
  subtitle_1: 'Funda in 2026', title_1: 'Welkom in de straat\nvan de uitersten',
  txt_1: 'Achter elke voordeur woont een record van dit jaar. Klik op de deuren 18 tot en met 23. Nummer 24 bewaren we voor het laatst.',
  // fallback intro (own text: the fallback has nothing to click; built from the artifact's preheader)
  txt_2: 'Achter elke voordeur woont een record van dit jaar. En achter nummer 24 een wens van ons.',
  txt_3: 'Klik op een voordeur in de straat',
  label_1: '18', label_2: '19', label_3: '20', label_4: '21', label_5: '22', label_6: '23', label_7: '24',
  badge_1: 'Nummer 18', subtitle_2: 'Het duurste huis van 2026', title_2: '€ [vraagprijs]', txt_4: '[Adres], [Plaats]',
  txt_5: 'Stond [X] dagen op Funda en werd [X] keer bekeken.',
  badge_2: 'Nummer 19', subtitle_3: 'Het grootste huis', title_3: '[X] m² woonoppervlakte', txt_6: '[Adres], [Plaats]', txt_7: 'Goed voor [X] kamers.',
  badge_3: 'Nummer 20', subtitle_4: 'Het kleinste huis', title_4: '[X] m²', txt_8: '[Adres], [Plaats]', txt_9: 'Klein, maar [X] keer bewaard als favoriet.',
  badge_4: 'Nummer 21', subtitle_5: 'De duurste regio', title_5: '[Regio]', txt_10: 'Gemiddelde vraagprijs € [bedrag]', txt_11: 'Gevolgd door [Regio 2] en [Regio 3].',
  badge_5: 'Nummer 22', subtitle_6: 'Het meest bekeken huis', title_6: '[X] keer bekeken', txt_12: '[Adres], [Plaats]', txt_13: 'Op [dag] alleen al [X] keer.',
  badge_6: 'Nummer 23', subtitle_7: 'Het meest bewaarde huis', title_7: '[X] keer bewaard', txt_14: '[Adres], [Plaats]', txt_15: 'Het droomhuis van heel veel Nederlanders.',
  img_alt_1: '[foto woning]', img_alt_2: '[foto woning]', img_alt_3: '[foto woning]', img_alt_4: '[foto woning]', img_alt_5: '[foto woning]', img_alt_6: '[foto woning]',
  img_alt_7: '[illustratie: de straat met alle deuren open]',
  txt_16: 'Nog', txt_18: 'deuren te gaan voor nummer 24.', txt_19: 'Alle deuren zijn open. Klik nu op nummer 24.',
  subtitle_8: 'Nummer 24', title_8: 'Fijne feestdagen',
  txt_17: 'Welk huis je volgend jaar ook zoekt, de grootste of juist de knusste: we hopen dat jouw deur in 2027 opengaat.',
  btn_txt_1: 'Bekijk wat er nu te koop staat',
};
const SUBJECT = 'Achter elke deur woont een record';
const PREHEADER = 'De uitersten van 2026, en achter nummer 24 een wens van ons';
const WIDTH = 640;   // the artifact's mail width
const F = FD.font;
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const SLOT = /\b(?:[a-z]+_)*(?:title|subtitle|txt|alt|label|badge)_\d+\b/g;
const fill = html => html.split(/(<!--(?![\[<>])[\s\S]*?-->)/).map((part, i) => i % 2 ? part : part.replace(SLOT, t => {
  if (!(t in COPY)) throw new Error('no copy for slot ' + t);
  return esc(COPY[t]).replace(/\n/g, '<br>');
})).join('');
const ind = (s, n) => s.split('\n').map(l => l ? ' '.repeat(n) + l : l).join('\n');

const NOTE = `<!-- Funda eindejaarsmail 2026: concept B2C 1 "De straat van de uitersten" (artifact "Funda eindejaarsmails 2026",
     board B2C 1). Een kerststraat als adventskalender. Elk huis is een label voor een eigen checkbox: een deur die je
     opent blijft open, het licht gaat aan en de recordkaart verschijnt (de nieuwste bovenop). Deur 24 gaat pas open
     als de andere zes open zijn: de kerstwens en de CTA. Kleuren, fonts, maten en teksten 1:1 uit het artifact.
     Fallback (Gmail, Outlook, Samsung): de straat als statische illustratie, alle zes kaarten onder elkaar en de
     finale ("alle zes records als kaartjes onder elkaar, de straat als statische illustratie met open deuren").
     Gebouwd met build/gen_straat.js + build/build_mail.js; wijzig de generator, niet de HTML.
     Recordwaarden ([vraagprijs], [X], [Adres], [Plaats], [Regio], [bedrag], [dag]) zijn placeholders: Funda-brede
     cijfers, geen data per ontvanger. Foto's, straatillustratie en logo zijn placeholders.
     Huisstijl: waarden uit het artifact, te bevestigen met de Funda brandguide.
     Bron: Claude Design concept "Funda eindejaarsmails 2026", B2C 1. -->`;

const hs = build(FD);
let head = fs.readFileSync(HEAD, 'utf8').replace(/\r\n/g, '\n').replace('@@NOTE@@', NOTE).replace('<title>funda</title>', `<title>${esc(SUBJECT)}</title>`);
const css = `      <!-- funda_mail -->
      <style type="text/css">
         /* links on coloured bands keep their colour, also in dark mode (the head turns every link white) */
         .fd-a-ink {
            color: #2A2A2A !important;
         }

         .fd-a-blue {
            color: #0071B3 !important;
         }

         @media only screen and (max-width: 600px) {
            .fd-index-btn {
               padding: 0 24px 22px 24px !important;
               text-align: left !important;
            }
         }
      </style>
      <!-- // funda_mail -->
      <!-- ${hs.name} -->
${ind(hs.css, 6)}
      <!-- // ${hs.name} -->
   </head>
`;

const body = `
   <body id="body" class="darkmode body" width="100%" style="margin: 0; padding: 0 !important;">
      <!--[if !mso & !IE]><!-->
      <div style="display: none; max-height: 0px; overflow: hidden;">${esc(PREHEADER)}</div>
      <div style="display: none; max-height: 0px; overflow: hidden;">
         ${'&#8199;&#65279;&#847;'.repeat(28)}
      </div>
      <!--<![endif]-->

      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" align="center" bgcolor="#EEF1F4" class="darkmode">
         <tr>
            <td class="darkmode_side_td" style="background-color: #EEF1F4"></td>
            <td class="darkmode" style="text-align: center; font-size: 0; width: ${WIDTH}px; max-width: ${WIDTH}px;" align="center">
               <!-- header_funda_logo_placeholder -->
               <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#F7A100" style="table-layout: fixed;">
                  <tr>
                     <td align="left" valign="middle" class="pml16" style="padding: 14px 28px;">
                        <!-- logo placeholder as in the artifact: the real funda logo comes from the designer, never redraw it -->
                        <a href="https://100procent.nl/" target="_blank" class="fd-a-ink" style="display: inline-block; padding: 3px 10px; border: 2px dashed #2A2A2A; font-family: ${F}; font-size: 13px; line-height: 15px; font-weight: 800; color: #2A2A2A; text-decoration: none;">[logo funda]</a>
                     </td>
                     <td align="right" valign="middle" class="pmr16" style="padding: 14px 28px; font-family: ${F}; font-size: 12px; line-height: 14px;">
                        <!-- view online link -->
                        <a href="https://100procent.nl/" title="Online versie" target="_blank" class="fd-a-ink" style="color: #2A2A2A; text-decoration: underline;">Bekijk online</a>
                     </td>
                  </tr>
               </table>
               <!-- end header_funda_logo_placeholder -->
${ind(fill(hs.bodyWithoutCss).replace(/\n$/, ''), 15)}
               <!-- 1_col_title_txt_btn_funda_index -->
               <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF">
                  <tr>
                     <td class="pml16 pmr16" style="padding: 0 36px 32px 36px;">
                        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#FBF1E6" style="table-layout: fixed; border-radius: 8px; border-collapse: separate;">
                           <tr>
                              <td class="fd-stack" align="left" valign="middle" style="padding: 22px 16px 22px 24px; font-family: ${F}; font-size: 15px; line-height: 22px; color: #2A2A2A; word-wrap: break-word; overflow-wrap: break-word;">
                                 <strong>Meer cijfers?</strong> De Funda Index laat zien hoe de markt in jouw regio beweegt.
                              </td>
                              <td class="fd-stack fd-index-btn" width="200" align="right" valign="middle" style="width: 200px; padding: 22px 24px 22px 0; font-size: 0; line-height: 0;">
                                 <!--[if mso]>
                                 <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://100procent.nl/" style="height:39px;v-text-anchor:middle;width:176px;" arcsize="10%" strokecolor="#0071B3" filled="f">
                                    <w:anchorlock/>
                                    <center style="color:#0071B3;font-family:${F};font-size:14px;font-weight:bold;">Naar de Funda Index</center>
                                 </v:roundrect>
                                 <![endif]-->
                                 <a class="fd-a-blue" href="https://100procent.nl/" target="_blank" style="display: inline-block; padding: 10px 14px; border: 1px solid #0071B3; border-radius: 4px; color: #0071B3; font-family: ${F}; font-size: 14px; font-weight: 600; line-height: 17px; text-decoration: none; -webkit-text-size-adjust: none; mso-hide: all;">Naar de Funda Index</a>
                              </td>
                           </tr>
                        </table>
                     </td>
                  </tr>
               </table>
               <!-- end 1_col_title_txt_btn_funda_index -->
               <!-- footer_funda -->
               <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#F4F5F6">
                  <tr>
                     <td align="left" class="pml16 pmr16" style="padding: 20px 36px; font-family: ${F}; font-size: 12px; line-height: 19px; color: #5A5A5A;">
                        Je ontvangt deze mail omdat je je hebt aangemeld voor mails van funda.
                        <!-- unsubscribe link -->
                        <a href="https://100procent.nl/" target="_blank" class="fd-a-blue" style="color: #0071B3; text-decoration: underline;">Afmelden</a> &middot;
                        <!-- preferences link -->
                        <a href="https://100procent.nl/" target="_blank" class="fd-a-blue" style="color: #0071B3; text-decoration: underline;">Voorkeuren</a>
                     </td>
                  </tr>
               </table>
               <!-- end footer_funda -->
            </td>
            <td class="darkmode_side_td" style="background-color: #EEF1F4"></td>
         </tr>
      </table>
   </body>

</html>
`;

const out = (head + fill(css) + body).replace(/\n/g, '\r\n');
fs.writeFileSync(OUT, out);
const at = s => (Buffer.byteLength(out.slice(0, out.indexOf(s))) / 1024).toFixed(1);
console.log('written', OUT, Buffer.byteLength(out), 'bytes', (Buffer.byteLength(out) / 1024).toFixed(1), 'KiB',
  '| fallback at', at('<div class="fd-fallback">'), 'KiB | unsubscribe at', at('<!-- unsubscribe link -->'), 'KiB');
