# Start here

Plain, ESP-agnostic email HTML for 100procent (`HTML/`), plus interactive concept mails built from Claude Design
artifacts (`HTML/interactive_artifact/`). This file only routes: the rules live in the files below.

## Read order

1. `HTML/README.md`: structure, token table.
2. `HTML/docs/email_rules.md`: HTML/CSS, email-client, interactive and size rules (authoritative).
3. `HTML/docs/naming_convention_*.md`: block, image and variable names.
4. When working from a Claude Design artifact: `HTML/eoy_concepts/prompt/from_artefact_to_design.md` (workflow) and
   `HTML/interactive_artifact/README.md` (artifact rules, techniques, testing).
5. The client's `HTML/interactive_artifact/<client>/README.md`.
6. The concept's `README.md`, then its `build/` (generator and tests).

## What wins

- The rule documents are the specification. Existing code is evidence, not specification: when code conflicts with a
  rule, follow the rule and don't copy the old code.
- A client or concept README may narrow a general rule only where it says so explicitly (a documented exception or
  deviation). Where it is silent, the general rule applies.
- A concept's status line says whether its technique is safe to copy (vocabulary in
  `HTML/interactive_artifact/README.md`, "Status of a concept").

## Status of existing work

| Work | Status | Copy its technique? |
|---|---|---|
| WestCord concept 3 Turndown | REFERENCE (approved) | yes |
| WestCord concepts 1 De lift and 4 Post bij de receptie | CURRENT | yes |
| Funda B2C 1 De straat van de uitersten | CURRENT | yes |
| Colbe concept A Zes wensen | CURRENT, no block yet (per its README) | partly |
| Coram concepts 1–4 (boorgat, velletje, recht gehangen, lijn van het jaar) | CURRENT | yes |
| WestCord concept 2 Wrapped in de lift and `HTML/blocks/car/car_1_col_subtitle_title_txt_x6_img_btn_x2.html` | LEGACY | no: id selectors, old client overrides |
| `HTML/test_mails/`, `HTML/interactive_artifact/funda/concept_1_straat_van_de_uitersten/tests/` | snapshots | no |
| `HTML/blocks/accordion/`, `HTML/blocks/ham/`, `HTML/blocks/car/car_1_col_img_title_txt_btn.html` | older generic blocks, not checked against email_rules section 4 | check first |

## Working rules

- Never edit generated files by hand: change the generator (`build/`), then run it, `HTML/assemble.ps1` and the
  concept's test script.
- Keep line endings as the file has them.
- Don't commit unless asked.
