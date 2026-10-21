# WestCord

Rules and facts for every WestCord concept. General rules: [../README.md](../README.md) and
[docs/email_rules.md](../../docs/email_rules.md).

## Source

- Artifact: https://claude.ai/artifact/Ej4uChNZKy5bW8gR6fp9q2 — "WestCord eindejaarsmail: de lift" (Claude Design canvas).
- Boards per concept (from `project/canvas.json`):

| Concept | Boards | Status |
|---|---|---|
| 1 · De lift (scroll parallax, cabin stays still, hotel scrolls past) | `Main.dc.html`, `Scrollmomenten.dc.html`, `Lagen.dc.html` | built: [concept_1_de_lift](concept_1_de_lift/) |
| 2 · WestCord Wrapped in de lift (radio carousel, 6 floors) | `WrappedLift.dc.html`, `WrappedVerdiepingen.dc.html`, `TechniekConcepten.dc.html` | built: [concept_2_wrapped_lift](concept_2_wrapped_lift/) |
| 3 · Turndown service (4 checkboxes, chocolate on a pillow) | `Kussenchocolaatje.dc.html`, `KussenStappen.dc.html`, `TechniekConcepten.dc.html` | built: [concept_3_turndown](concept_3_turndown/) |
| 4 · Post bij de receptie (letter scrolls out of a fixed envelope) | `PostReceptie.dc.html`, `PostMomenten.dc.html`, `PostTechniek.dc.html` | not built |

## Brand values (from the artifact; approximations, to confirm with the WestCord brand guide)

| Use | Value |
|---|---|
| Navy (bands, header, footer, text) | `#012D59` |
| CTA pink | `#E2127A` |
| Accent pink (labels, eyebrows) | `#C8106E` |
| Light blue background | `#DCE8F1`; second tint `#CFDFEC` |
| Blue shades (lift floors, flaps) | `#1D4B7A`, `#2F6FA6`, `#174170`, `#2F5F8F` (status text) |
| Soft text on navy | `#D8DEE8`; pale blue `#B3CDE0` |
| Page background | `#F4F6F8` |
| Headings | EB Garamond, weight 500 (`EB Garamond,Georgia,Times New Roman,serif`) |
| Body | Hind 400/600 (`Hind,Helvetica Neue,Arial,Helvetica,sans-serif`) |
| Fonts loaded via | `<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500&family=Hind:wght@400;600&display=swap">` inside `<!--[if !mso]><!-->` |
| Button | 16px, weight 600, 48px high, radius 4px, padding 0 24px |

- These values are **concept-only**: blocks in `blocks/` keep the default tokens (decision: option (a)).

## Mail shell (shared by every WestCord concept mail)

1. **Head:** the template head with WestCord values (from the concept 2 mail), plus the font link, plus the concept's
   block CSS between `<!-- block_name -->` markers.
2. **Header:** navy band with "Bekijk online" top right (`<!-- view online link -->`) and the logo as a **text
   version** ("WestCord" + "HOTELS"); the real logo comes from the designer.
3. **Module directly under the header** when it starts with its own navy band (one continuous band, no spacer);
   about 40px between the logo and the salutation.
4. **Footer:** navy, "WestCord Hotels", `[Contactgegevens WestCord]`, "Afmelden voor deze e-mails" (`<!-- unsubscribe link -->`).
5. **Links:** all `https://100procent.nl/` for now.
6. **Width:** 648px, unless the scene is an illustration where text and drawing must keep the artifact's proportions;
   then the mail is as wide as the artifact canvas (concept 1: 700px).
7. **Logo:** when the artifact's module contains the WestCord logo itself (concept 1, in the sky), the shell only gets
   the "Bekijk online" row, no second logo.

## Data and copy

- Personal fields in the artifact: `[Voornaam]`, `[X]` (nights), `[Hotelnaam]`, `[Plaats]`, `[Aantal]`, `[Maand]`. They
  stay placeholders until WestCord confirms which fields exist.
- **Rule: never show `[X]`, `0` or an empty heading.** Every personal text needs a version for recipients without
  stay data. WestCord has to supply that copy; we don't invent it. (Concept 2 already renders the no-data version.)
- Artifact copy is used as default text, still to be agreed with WestCord. Signatory of the letter (concept 4,
  "Familie Westers") to be agreed with the client.
- Never mention other clients in anything WestCord sees.

## Open items (all concepts)

- Brand guide, real logo, images (pillow, hotel photos), real links, the actual data fields, no-data copy.
- Real-device tests (see the concept READMEs).
