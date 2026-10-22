# Colbe

Rules and facts for every Colbe concept. General rules: [../README.md](../README.md) and
[docs/email_rules.md](../../docs/email_rules.md).

## Source

- Artifact: "Colbe eindejaarsmail concepten" (Claude Design canvas), worked from the **downloaded file**
  [eoy_concepts/artefact_links/html_design/Colbe eindejaarsmail concepten.html](../../eoy_concepts/artefact_links/html_design/).
  Unpack it with [tools/unbundle_artifact.js](../tools/unbundle_artifact.js) to read the boards (markup + DCLogic
  script). If the download is replaced by a newer version, unpack it again and compare.
- Boards on the canvas (in order) and status:

| Board | Page | Status |
|---|---|---|
| Brief, huisstijl en ideeën | page 0 | reference (brief, data, house style, six ideas, open questions) |
| A · Zes wensen: de mail | page 1 | built: [concept_1_zes_wensen](concept_1_zes_wensen/) |
| A · Momenten, techniek en gewicht | page 2 | reference for A |
| B · Even ademhalen: de mail | page 3 | not built |
| B · Momenten, techniek en gewicht | page 4 | reference for B |
| C · Wat neem je mee naar 2027: de mail | page 5 | not built |
| C · Momenten, techniek en gewicht | page 6 | reference for C |

## Brief (from board page 0)

- Audience: consumers. Goal: engagement, thank them for the year and start the new year together.
- Recipients may have met Colbe in a vulnerable period: **never refer to their trajectory, absence or health.** The
  wishes are for everyone.
- Little data per recipient, so the interaction makes the mail personal, not figures.

## Brand values (from the artifact; approximations from the current Colbe mail, to confirm with the brand guide)

| Use | Value |
|---|---|
| Cream (background) | `#F9F7F4` |
| Antraciet (text, dark bands) | `#292828` |
| Koraal (accent) | `#FF6748` |
| Grey (details, top links) | `#8C8A8A`; soft text `#6E6B6B`; lines `#CFC9C0` |
| Hero texts | `#D8D4CE` (salutation), `#E9E6E1` (intro) |
| Photo placeholders | `#FFD9CF` with `#7A2C17` text |
| Font | Lota Grotesque, approximated with **Albert Sans** 400/600; stack `'Albert Sans',Aptos,'Trebuchet MS',sans-serif` |
| Fonts loaded via | `<link href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@400;600&display=swap">` inside `<!--[if !mso]><!-->` |
| Elements | rounded outline buttons with an arrow, dark and coral bands, photos of people at work, logo with a coloured star (real file from the designer) |

## Mail shell (shared by every Colbe concept mail)

1. **Head:** the template head with Colbe values ([concept_1 build/shell_head.html](concept_1_zes_wensen/build/shell_head.html)):
   Albert Sans, `color-scheme: light only` (the design has its own dark bands; see the concept README), then the
   concept's CSS between `<!-- block_name -->` markers.
2. **Header:** "webversie | afmelden" (`<!-- view online link -->`, `<!-- unsubscribe link -->`) and the dashed
   "[Logo Colbe]" box as in the artifact (never redraw the logo).
3. **Letter, photo band, unsubscribe paragraph with "Meld je hier af" (`<!-- unsubscribe link -->`), dark footer**
   with "[Logo Colbe, wit]" and the SNEL NAAR / CONTACT columns.
4. **Width:** 640px, the artifact's mail width.
5. **Links:** all `https://100procent.nl/` for now.

## Data and copy

- Salutation: `Beste [meneer/mevrouw] [Achternaam],` with "je" in the text. Without gender: `Beste [Voornaam]
  [Achternaam],`, without names: `Beste lezer,`. Built as the ESP's merge fields once the platform is known.
- Signature `[Naam], [functie] Colbe` and the photos are placeholders. Artifact copy is the default text, still to be
  agreed with Colbe. Never mention other clients in anything Colbe sees.

## Open items (all concepts, from the brief board)

1. Send date (before or after Christmas sets the tone).
2. Sending platform and the values of the gender field.
3. Client mix of the list (Apple Mail, Gmail, Outlook).
4. Who signs the mail.
5. Brand guide, logo files and photos; links.
6. Concept C: may choices be stored in the profile.
