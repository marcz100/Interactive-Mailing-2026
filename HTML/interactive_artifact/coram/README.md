# Coram

Rules and facts for every Coram concept. General rules: [../README.md](../README.md) and
[docs/email_rules.md](../../docs/email_rules.md).

## Source

- Artifact: https://claude.ai/artifact/ShJAwZQSX3sU7bwPxYzXXD — "Coram eindejaarsmail: bedankt voor het vakwerk".
  The boards are read with the Artifact tool (`project/canvas.json`, `project/*.dc.html`). Its `support.js` can't be
  read, so the boards are rendered per state with [tools/render_board.js](../tools/render_board.js).
- Boards per concept (from `project/canvas.json`):

| Concept | Boards | Status |
|---|---|---|
| 1 · Van boorgat tot badkamer (5 hotspots: mount the bathroom) | `Main.dc.html` (clickable, 700 × 1000), `WrappedInfo.dc.html` | built: [concept_1_van_boorgat_tot_badkamer](concept_1_van_boorgat_tot_badkamer/) |
| 2 · Dit bedankje past niet op één velletje (paper rolls out of a fixed roll holder) | `RolMail.dc.html` (700 × 2800), `RolInfo.dc.html` | built: [concept_2_niet_op_een_velletje](concept_2_niet_op_een_velletje/) |
| 3 · Recht gehangen (2 steps: hang the towel rail level) | `WaterpasMail.dc.html` (clickable, 700 × 2100), `WaterpasInfo.dc.html` | built: [concept_3_recht_gehangen](concept_3_recht_gehangen/) |
| 4 · De lijn van het jaar (open the tap, clear three clogs, fill the bath) | `LeidingMail.dc.html` (clickable, 700 × 3100), `LeidingInfo.dc.html` | built: [concept_4_lijn_van_het_jaar](concept_4_lijn_van_het_jaar/) |

## Brand values (from the artifact; approximations, to confirm with the Coram brand guide)

| Use | Value |
|---|---|
| Ink (text, dark bands, header, footer) | `#1A1A1A`; matte black products `#1C1C1C` |
| Accent blue (plus buttons, figures, water, CTAs) | `#2525B0` |
| Sand (tile wall, soft text on dark) | `#D9D4CD`; light wall `#E4E0DA`; dark wall `#776E65` |
| Grey text | `#3D3935` |
| Light band | `#F4F2EF` (also the page background around the mail: own choice) |
| Towel pink | `#E3B5AE` |
| Font | Jost 300/400/500/600 (`Jost,Helvetica Neue,Arial,Helvetica,sans-serif`); unset line heights render `normal`, about 1.445× (13→19, 14→20, 22→32, 24→35, 26→38px) |
| Fonts loaded via | `<link href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&display=swap">` inside `<!--[if !mso]><!-->` |

- These values are **concept-only**: blocks in `blocks/` keep the default tokens.

## Mail shell (shared by every Coram concept mail)

Built by [shell/shell.js](shell/shell.js); every concept's `build_mail.js` uses it.

1. **Head:** the template head with Coram values ([shell/shell_head.html](shell/shell_head.html): Jost, Coram
   dark-mode colours), then the concept's CSS between `<!-- block_name -->` markers.
2. **Header:** the board's black bar (80px) with the CORAM wordmark as text (never redraw the logo). Concept 1 has
   no bar: its board has the wordmark in the module itself.
3. **Footer:** the boards' black footer: CORAM, the brands line, `[Adres Coram] · [Telefoon]`, and "Bekijk online"
   (`<!-- view online link -->`), "Voorkeuren" (`<!-- preferences link -->`), "Afmelden" (`<!-- unsubscribe link -->`),
   as in the artifact (it has no separate "Bekijk online" at the top). Bottom padding 48 (the boards' footer height
   is canvas filler).
4. **Width:** 700px, the artifact canvas width.
5. **Subject and preheader:** the boards have none; each mail uses its board's title and opening line (documented
   per concept).
6. **Links:** all `https://100procent.nl/` for now.

## Shared tests

[shell/cdp.js](shell/cdp.js): headless Chrome over the DevTools Protocol for every concept's test (device emulation,
real mouse clicks, screenshots, pass/fail list).

## Data and copy

- Personal fields: `[Voornaam]`, `[X]` (products), `[Bedrijfsnaam]`, `[Merknaam]`, `[Product 1-3]`. Concept mails show
  them (email_rules 2.4); the no-data versions are open items (the artifact: "zonder data vallen ze terug op een
  bedankzin" / "algemene Coram cijfers").
- From Coram: a real "Wist je dat?" fact (concept 4), product photos (concept 1), the address and phone line.
- Artifact copy is the default text, to be agreed with Coram. Concept 2 needs a conscious choice by Coram (the
  artifact: "het onderwerp blijft een toiletrol"). Never mention other clients in anything Coram sees.

## Open items (all concepts)

- Brand guide, product photos, the roll holder and bathroom images (concepts 1 and 2 intend images), real links.
- No-data copy; the sending platform (the artifact mentions feedback clicks written back to the ESP).
- Real-device tests (see the concept READMEs).
