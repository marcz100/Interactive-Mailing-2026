Ik wil een concept uit een Claude artifact omzetten naar werkende plain HTML-e-mail in deze repo.

ARTIFACT: [plak de claude.ai/artifact/... link]
CONCEPT: [welk concept / welk board, bijv. "Concept 2 · Wrapped in de lift"]
KLANT: [klantnaam, in kleine letters, bijv. westcord]
DATA PER ONTVANGER: [welke velden er later komen, of "volgt later"]

Werk in plan mode: eerst onderzoeken en een plan, pas bouwen na mijn akkoord.

1. ARTIFACT LEZEN
- Lees het artifact met de Artifact tool (action "read"), niet via een browser of WebFetch. Haal de bestanden op met
  action "read" + paths: project/canvas.json en de project/*.dc.html boards van het gekozen concept
  (de volledige mail, de klikbare versie, het "alle schermen"-board en het techniek-board).
- Let op: de boards zijn Claude Design prototypes (x-dc, sc-for, DCLogic JavaScript), geen e-mailcode. De
  interactie in het board is JavaScript en werkt niet in e-mail. Het techniek-board beschrijft hoe het wél
  gebouwd moet worden (radio's, checkboxes, scrollvenster). Alle persoonlijke waarden ([X], [Hotelnaam]) zijn
  placeholders: verzin geen data.
- Laad de skill "interactieve-email-concepten" en gebruik references/technieken.md, references/clientsupport.md
  en de templates als basis voor de techniek en de fallbacks.
- Lees README.md, docs/ (naming conventions) en een bestaand blok als voorbeeld van de anatomie
  (blocks/1_col/1_col_img_title_txt_btn.html en voor interactie de car_ blokken).

2. VRAGEN VOOR HET PLAN (alleen wat je niet zelf kunt afleiden, met klikbare opties)
- Welk concept eerst, als het artifact er meerdere heeft.
- Welke data er later komt.

3. HUISSTIJL
- Neem kleuren en fonts uit het artifact over als vaste waarden in het blok. Zet in een comment bovenaan welke
  waarden benaderingen zijn ("te bevestigen met de brandguide") en dat het logo een placeholder is.

4. HET BLOK
- Nieuw bestand in blocks/<prefix>/, naam volgens docs/naming_convention_blocks.md (bijv. car_ voor
  radio-verdiepingen/stories). Vaste aantallen per bestand; ander aantal = nieuw blok.
- Anatomie: <!-- start blocknaam -->, eventueel een <style> als eerste element, tabellen, MSO/VML voor knoppen,
  afsluiten met <!-- end blocknaam -->.
- Placeholdertekst = de variabelenaam (title_1, txt_1, btn_txt_1, alt="img_alt_1"); links naar https://100procent.nl/.
- Persoonlijke data: schrijf voorlopig de versie zonder data uit, zodat er nooit [X], 0 of een lege kop verschijnt.
  Zet in een comment wat er met data verandert.
- Houd de inhoud per scherm gelijk tussen de interactieve versie en de fallback.

5. INTERACTIE (de lessen uit het WestCord blok)
- Inputs (radio/checkbox) met display:none !important; mso-hide:all, vóór en als sibling van
  div.interactive én div.fallback. Beide divs hebben precies één class (nodig voor de Outlook.com selector).
- Interactief alleen aan binnen @media screen and (-webkit-min-device-pixel-ratio:0) via
  .radio:checked ~ .interactive; fallback daar uit.
- Terug naar fallback: [class="x_..."] voor Outlook.com/O365, meta* .x voor Samsung, en .x\0 voor Outlook apps
  in een aparte <style>. Interactieve laag binnen <!--[if !mso]><!-->.
- CSS kan niet onthouden waar je vandaan komt. Als iets afhangt van de vorige stand (rijrichting, vorige/volgende),
  maak dan per richting een eigen radio en per stand een eigen paneel met de highlight vast in de HTML.
  Eén CSS-regel per stand.
- Herhaalde stijlen (knoppen, pijltjes, actieve staat) als classes in de <style>, niet inline per paneel:
  dat scheelt veel gewicht.
- Fallback: alle schermen onder elkaar met dezelfde CTA's; dit zien Gmail, Outlook en Samsung.

6. LAYOUT EN MOBIEL
- table-layout: fixed op tabellen met procentuele kolommen, zodat lange woorden of grote titels kolommen niet
  oprekken (anders verschillen de breedtes per scherm op mobiel).
- word-wrap/overflow-wrap: break-word op titels en tekst.
- Lettergroottes schalen met classes en media queries in twee stappen (max-width 600px en 400px), niet met vw.
- Verticale afstand in een vaste ruimte met valign (top/middle) in tabelrijen in plaats van marges. Vaste
  binnenhoogte = buitenhoogte - 2x padding - rand (box-sizing: border-box), ook in de mobiele override.

7. DE CAMPAGNEMAIL
- Lees eerst interactive_artifact/README.md en interactive_artifact/<klant>/README.md (regels voor alle concepten en
  voor de klant). De mail moet 1:1 op het artifact lijken en werken.
- Nieuw bestand in interactive_artifact/<klant>/concept_<n>_<naam>/<klant>_<naam>_<jaar>_concept_<n>.html, met een
  README.md in die map (wat het doet, states, geometrie, beslissingen, tests, open punten), opgebouwd uit de head van
  whole_code/2026_plain_template.html (zonder de styles van andere blokken), de fonts van de klant via een
  <link> binnen <!--[if !mso]>, en de <style> van het blok in de <head> tussen <!-- blocknaam --> markers.
- Header met tekstversie van het logo (nooit een logo natekenen) en rechtsboven een "Bekijk online" link
  (<!-- view online link -->). Footer met afmeldlink (<!-- unsubscribe link -->).
- Houd het blokbestand en de campagnemail gelijk bij elke wijziging.
- Blijf ruim onder ~102 KB (Gmail clipping); minify bij het versturen als dat nodig is.

8. CONTROLE EN OPLEVERING
- Voer assemble.ps1 uit en open de mail met Live Server: desktop, <= 480px, donkere modus, en de interactie.
  Test daarna via testmails: iPhone/iPad/macOS Apple Mail (licht/donker), Gmail web/iOS/Android, Outlook
  Windows/nieuw/.com/apps, Samsung.
- Meld de bestandsgrootte.
- Sluit af met: wat er gebouwd is, wat nog van de klant nodig is (brandguide, logo, beelden, links, data-velden),
  en wat niet getest is. Niet committen zonder mijn vraag.
