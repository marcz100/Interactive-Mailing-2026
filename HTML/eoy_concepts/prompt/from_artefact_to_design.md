Ik wil een concept uit een Claude Design artifact omzetten naar werkende plain HTML-e-mail in deze repo.

ARTIFACT: [plak de claude.ai/artifact/... link, of noem het gedownloade .html-bestand in eoy_concepts/artefact_links/html_design/]
CONCEPT: [welk concept / welk board, bijv. "Concept 2 · Wrapped in de lift"]
KLANT: [klantnaam, in kleine letters, bijv. westcord]
DATA PER ONTVANGER: [welke velden er later komen, of "volgt later"]

Werk in plan mode: eerst onderzoeken en een plan, pas bouwen na mijn akkoord.

Lees eerst CLAUDE.md in de root van de repo (leesvolgorde en wat voorgaat) en volg docs/email_rules.md en
interactive_artifact/README.md. Deze prompt beschrijft alleen de werkwijze en wat je oplevert; de technische regels
staan in die documenten en nergens anders.

1. ARTIFACT LEZEN
- Link: lees het artifact met de Artifact tool (action "read" + paths: project/canvas.json en de project/*.dc.html
  boards van het gekozen concept), niet via een browser of WebFetch.
- Gedownload bestand: pak het uit met interactive_artifact/tools/unbundle_artifact.js.
- De boards zijn Claude Design prototypes (x-dc, sc-for, DCLogic JavaScript), geen e-mailcode. Het techniekboard
  beschrijft hoe het in e-mail gebouwd moet worden. Alle persoonlijke waarden ([X], [Hotelnaam]) zijn placeholders:
  verzin geen data.
- Neem als voorbeeld een concept met status REFERENCE of CURRENT (zie CLAUDE.md). Neem geen techniek over uit
  concepten of blokken met status LEGACY.

2. VRAGEN VOOR HET PLAN (alleen wat je niet zelf kunt afleiden, met klikbare opties)
- Welk concept eerst, als het artifact er meerdere heeft.
- Welke data er later komt.

3. OPLEVEREN
- Een generator in interactive_artifact/<klant>/concept_<n>_<naam>/build/ die uit één structuur twee dingen maakt
  (interactive_artifact/README.md, sectie 6):
  - het herbruikbare blok in blocks/<prefix>/ met de standaard tokens en slotnamen (email_rules 1.6 en de naming
    conventions in docs/);
  - de conceptmail <klant>_<campagne>_<jaar>_concept_<n>.html met de waarden en teksten van het artifact, in de
    mail-shell van de klant (klant-README, "Mail shell").
- Een testscript (Chrome via het DevTools Protocol) voor de interactie, mobiel en de fallback.
- Een README.md in de conceptmap: wat het doet, states, geometrie, beslissingen, afwijkingen, tests en open punten,
  met bovenaan de statusregel (interactive_artifact/README.md, "Status of a concept").
- Nieuwe klantregels in interactive_artifact/<klant>/README.md; nieuwe lessen in het juiste regeldocument.

4. CONTROLE EN AFRONDING
- Draai de generator, assemble.ps1 en het testscript, en vergelijk de mail naast het artifact
  (interactive_artifact/README.md, sectie 7).
- Meld: wat er gebouwd is, de bestandsgrootte en de positie van de fallback en de afmeldlink (email_rules 5), wat
  nog van de klant nodig is (brandguide, logo, beelden, links, data-velden) en wat niet getest is.
- Niet committen zonder mijn vraag.
