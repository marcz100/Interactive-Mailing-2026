// Builds ../coram_eindejaarsmail_2026_concept_1.html: the Coram shell (footer; the board has its own CORAM logo, so no
// header bar) + the bathroom block generated with the artifact's values + the artifact's copy.
//   node build_mail.js
const path = require('path');
const { build, DEFAULT } = require('./gen_badkamer.js');
const { F, C, fill, ind, page, write } = require('../../shell/shell.js');
const OUT = path.resolve(__dirname, '../coram_eindejaarsmail_2026_concept_1.html');

// values taken 1:1 from the artifact board "Van boorgat tot badkamer (klikbaar)" (Main.dc.html)
const CB = {
  ...DEFAULT,
  font: F,
  c: {
    bg: C.white, ink: C.ink, grey: C.grey, pill: C.ink, pillTxt: C.white, wall: C.wall, wallLine: 'rgba(120,110,100,0.25)',
    hole: C.grey, blue: C.blue, blueRing: 'rgba(37,37,176,0.18)', white: C.white, black: C.black, black2: '#2A2A2A',
    basin: '#FAF9F7', mirror: '#8E969D', shelf: 'rgba(205,214,218,0.95)', towel: C.pink, panel: C.ink, panelTxt: C.white,
    panelSoft: C.sand, photo: C.wall, photoTxt: C.grey,
  },
};

// copy 1:1 from the artifact (DCLogic "lines", kicker/text, headline); personal fields stay the artifact's [placeholders]
const COPY = {
  label_1: 'CORAM', txt_1: 'van 5 gemonteerd',
  subtitle_1: 'Bedankt voor het vakwerk',
  title_1: 'Zonder jullie blijft het bij boorgaten.', title_2: 'Met jullie wordt het een badkamer.',
  subtitle_2: 'Het haakje', txt_2: 'Het kleinste product in de badkamer. En toch moet het precies goed hangen.',
  subtitle_3: 'Het planchet', txt_3: 'Jullie monteerden dit jaar [X] Coram producten. Elk op precies de goede hoogte.',
  subtitle_4: 'De spiegel', txt_4: 'Op de millimeter waterpas. Daar herkennen we jullie werk aan.',
  subtitle_5: 'De zeepdispenser', txt_5: 'Jullie favoriete merk dit jaar: [Merknaam]. Daar greep [Bedrijfsnaam] het vaakst naar.',
  subtitle_6: 'Het handdoekrek', txt_6: 'Twee gaten, twee pluggen, geen tegel gesneuveld. Vakwerk.',
  subtitle_7: 'Tik op een plus', txt_7: 'Vijf boorgaten, vijf ontwerpen. Monteer de badkamer en zie wat jullie dit jaar voor ons betekenden.',
  subtitle_8: 'Perfect eindresultaat', txt_8: 'Jullie maken van onze ontwerpen een perfect eindresultaat. Bedankt voor elke strakke montage dit jaar.',
  txt_9: 'Fijne feestdagen, [Voornaam]. Het team van Coram', label_2: 'Opnieuw',
  label_3: 'Monteer het haakje', label_4: 'Monteer het planchet', label_5: 'Monteer de spiegel',
  label_6: 'Monteer de zeepdispenser', label_7: 'Monteer het handdoekrek',
  img_alt_1: '[afbeelding: de complete badkamer met de vijf Coram producten]',
};
// the board has no subject or preheader: the board's title and its opening line
const TITLE = 'Van boorgat tot badkamer';
const PREHEADER = 'Zonder jullie blijft het bij boorgaten.';

const NOTE = `<!-- Coram eindejaarsmail 2026: concept 1 "Van boorgat tot badkamer" (artifact boards "Van boorgat tot badkamer
     (klikbaar)" en "De momenten, techniek en gewicht").
     Een kale tegelwand met vijf boorgaten. Elke plus is het label van een eigen checkbox: aantikken monteert een
     Coram ontwerp (haakje, planchet, spiegel, zeepdispenser, handdoekrek) en toont in het paneel eronder een bedankje
     of een persoonlijk feitje (het nieuwste bovenop). De teller telt mee ("n van 5 gemonteerd", CSS counter). Hangt
     alles, dan wisselt de kop en toont het paneel de boodschap met "Opnieuw" (reset van het formulier).
     Kleuren, fonts, maten, posities en teksten 1:1 uit het artifact; de wand in procenten van 620 x 470.
     Fallback (Gmail, Outlook, Samsung): de complete badkamer (placeholder voor het beeld met echte Coram
     productfoto's) met alle teksten eronder.
     Mobiel (het artifact heeft geen mobiel ontwerp): de wand schaalt mee, de plussen blijven 36px om te tikken.
     Gebouwd met build/gen_badkamer.js + build/build_mail.js; wijzig de generator, niet de HTML.
     Persoonlijke velden ([Voornaam], [X], [Merknaam], [Bedrijfsnaam]) zijn placeholders; zonder data vallen die
     twee hotspots terug op een bedankzin (artifact, tekst nog van Coram). Teksten af te stemmen met Coram.
     Bron: Claude Design concept "Coram eindejaarsmail: bedankt voor het vakwerk", concept 1. -->`;

const hs = build(CB);
const html = page({ note: NOTE, title: TITLE, preheader: PREHEADER, header: false, block: { name: hs.name, css: fill(hs.css, COPY) },
  body: ind(fill(hs.bodyWithoutCss, COPY), 15) + '\n' });
write(OUT, html, '<div class="cb-fallback">');
