# Funda

Rules and facts for every Funda concept. General rules: [../README.md](../README.md) and
[docs/email_rules.md](../../docs/email_rules.md).

## Source

- Artifact: "Funda eindejaarsmails 2026" (Claude Design canvas). Not shared with us on claude.ai; we work from the
  **downloaded file** [eoy_concepts/artefact_links/html_design/Funda eindejaarsmails 2026.html](../../eoy_concepts/artefact_links/html_design/).
  Unpack it with [tools/unbundle_artifact.js](../tools/unbundle_artifact.js) to read the boards (markup + DCLogic
  script). If the download is replaced by a newer version, unpack it again and compare.
- Boards on the canvas (in order) and status:

| Concept | Board | Status |
|---|---|---|
| B2C 1 · De straat van de uitersten (advent street, checkbox per door) | page 0 | built: [concept_1_straat_van_de_uitersten](concept_1_straat_van_de_uitersten/) |
| B2C 2 · Hoger of lager? | page 1 | not built |
| B2C 3 · Funda Wrapped: Nederland | page 2 | not built |
| B2C 4 · Post door de brievenbus | page 3 | not built |
| B2B 1 · Jouw jaar op Funda | page 4 | not built |
| B2B 2 · Het sleutelkastje | page 5 | not built |
| B2B 3 · De Funda Awards | page 6 | not built |
| B2B 4 · Bedankt-strook over het bord | page 7 | not built |

- Developer advice per B2C concept (from [eoy_concepts/advies/funda.html](../../eoy_concepts/advies/funda.html)):
  - B2C 1: clicking works; make the **whole house** clickable instead of only the door (done); maybe show fewer houses
    on mobile (open); fallback as an image of the houses with the info below in separate elements (done).
  - B2C 2: technically fine; watch the weight with many items.
  - B2C 3: simple, should work.
  - B2C 4: simple parallax; keep the values short. "Parallax altijd hoofdpijn."
  - Email on Acid overview test: https://app.emailonacid.com/shared-preview/W0UD6Bjzgq (made with the earlier B2C 1
    version, see the concept README).

## Brand values (from the artifact; approximations, to confirm with the Funda brand guide)

| Use | Value |
|---|---|
| Header orange | `#F7A100` |
| Blue (links, eyebrows, Index button) | `#0071B3`; dark `#00548A` |
| Light blue band | `#E3F2FB` |
| Text | `#2A2A2A`; soft `#3A3A3A`, `#5A5A5A` |
| Page background | `#EEF1F4`; footer `#F4F5F6`; Index card `#FBF1E6` |
| Green (pavement, wreath) | `#3E9B6E` |
| Christmas brown (house 24, finale) | `#6B2A1F`; roof `#4A1D15`; gold `#FFD27A` |
| Font | Figtree 400–800 (`Figtree,Helvetica Neue,Arial,Helvetica,sans-serif`) |
| Fonts loaded via | `<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;600;700;800&display=swap">` inside `<!--[if !mso]><!-->` |

- These values are **concept-only**: blocks in `blocks/` keep the default tokens.
- **Lesson:** where the artifact sets no `line-height`, the board renders `normal` (about 1.2x the font size for
  Figtree), not the canvas' 1.4. Measure the board in Chrome instead of guessing (the B2C 1 concept README lists
  the values).

## Mail shell (shared by every Funda concept mail)

1. **Head:** the template head with Funda values ([concept_1 build/shell_head.html](concept_1_straat_van_de_uitersten/build/shell_head.html)),
   the Figtree link, then the concept's block CSS between `<!-- block_name -->` markers.
2. **Header:** orange band, the logo placeholder as in the artifact (dashed box "[logo funda]", never redraw the
   logo) and "Bekijk online" (`<!-- view online link -->`).
3. **"Meer cijfers?"** card with the Funda Index button, then the **footer** with "Afmelden" (`<!-- unsubscribe link -->`)
   and "Voorkeuren" (`<!-- preferences link -->`).
4. **Width:** 640px, the artifact's mail width.
5. **Links:** all `https://100procent.nl/` for now.

## Data and copy

- B2C 1 needs no recipient data: the records are Funda-wide figures. They stay the artifact's placeholders
  (`€ [vraagprijs]`, `[X] m²`, `[Adres], [Plaats]`, `[Regio]`, …) until Funda supplies them; never invent figures.
- Artifact copy is the default text, still to be agreed with Funda. Never mention other clients in anything Funda sees.

## Open items (all concepts)

- Brand guide, real logo, photos and the street illustration, real links, the record figures.
- Real-device tests (see the concept READMEs).
