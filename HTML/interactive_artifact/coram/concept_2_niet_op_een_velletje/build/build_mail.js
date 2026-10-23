// Builds ../coram_eindejaarsmail_2026_concept_2.html: the Coram shell (header bar, footer) + the roll block generated
// with the artifact's values + the artifact's copy.
//   node build_mail.js
const path = require('path');
const { build, DEFAULT } = require('./gen_rol.js');
const { F, C, fill, ind, page, write } = require('../../shell/shell.js');
const OUT = path.resolve(__dirname, '../coram_eindejaarsmail_2026_concept_2.html');

// values taken 1:1 from the artifact board "De volledige mail" (RolMail.dc.html)
const CR = {
  ...DEFAULT,
  font: F,
  c: {
    wall: C.wallDark, wallLine: 'rgba(255,255,255,0.10)', heroTxt: C.white, paper: C.white, paperShadow: 'rgba(20,15,10,0.35)',
    ink: C.ink, accent: C.blue, perforation: '#C9C3BB', holder: C.black, roll: '#F7F5F2', rollShadow: 'rgba(20,15,10,0.35)',
  },
};

// copy 1:1 from the artifact; personal fields stay the artifact's [placeholders]
const COPY = {
  subtitle_1: 'Bedankt voor het vakwerk', title_1: 'Dit bedankje past niet op één velletje.', txt_1: 'Scroll maar, [Voornaam].',
  txt_2: 'Beste [Voornaam],',
  txt_3: 'Wat een jaar. Badkamer na badkamer, toilet na toilet kwamen onze ontwerpen in jullie handen.',
  title_2: 'Jullie maken van onze ontwerpen een perfect eindresultaat.',
  title_3: '[X]', txt_4: 'Coram producten gingen dit jaar door de handen van [Bedrijfsnaam].',
  title_4: 'Bedankt voor elke strakke montage dit jaar.',
  txt_5: 'Fijne feestdagen en tot in 2027.', txt_6: 'Het team van Coram',
};
// the board has no subject or preheader: its heading and the lead
const TITLE = 'Dit bedankje past niet op één velletje.';
const PREHEADER = 'Scroll maar, [Voornaam].';

const NOTE = `<!-- Coram eindejaarsmail 2026: concept 2 "Dit bedankje past niet op één velletje" (artifact boards "De volledige
     mail" en "Zo rolt het af, techniek en gewicht").
     Een matzwarte rolhouder staat vast onderin beeld. Tijdens het scrollen rolt het bedankje als papier omhoog,
     velletje voor velletje: een scrollvenster op de tegelwand met de hero en de papierstrook als live tekst, de
     rolhouder als vaste laag onderin. Het scrollgebied eindigt op de middellijn van de rol, zodat het papier uit de rol
     komt en er nooit onder zichtbaar is; de tegelwand staat stil. Aan het eind staat het laatste velletje met de wens
     en de ondertekening boven de rol. Geen klik nodig: alleen een detectie-checkbox.
     Kleuren, fonts, maten en teksten 1:1 uit het artifact.
     Fallback (Gmail, Outlook, Samsung): dezelfde papierstrook statisch onder elkaar, met de rol eronder (vereenvoudigd
     in tabellen; het artifact bedoelt de rolhouder als afbeelding).
     Mobiel (het artifact heeft geen mobiel ontwerp, wel een telefoonschets): venster in de verhouding van de schets,
     bredere strook met kleinere letters.
     Gebouwd met build/gen_rol.js + build/build_mail.js; wijzig de generator, niet de HTML.
     Persoonlijke velden ([Voornaam], [X], [Bedrijfsnaam]) zijn placeholders. Toon: graag een bewuste keuze van Coram
     (artifact: "het onderwerp blijft een toiletrol"). Teksten af te stemmen met Coram.
     Bron: Claude Design concept "Coram eindejaarsmail: bedankt voor het vakwerk", concept 2. -->`;

const hs = build(CR);
const html = page({ note: NOTE, title: TITLE, preheader: PREHEADER, header: true, block: { name: hs.name, css: fill(hs.css, COPY) },
  body: ind(fill(hs.bodyWithoutCss, COPY), 15) + '\n' });
write(OUT, html, '<div class="cr-fallback">');
