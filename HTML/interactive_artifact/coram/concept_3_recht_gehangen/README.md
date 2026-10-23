# Concept 3 · Recht gehangen

Mail: [coram_eindejaarsmail_2026_concept_3.html](coram_eindejaarsmail_2026_concept_3.html)
Block: `blocks/hotspot/hotspot_1_col_subtitle_title_txt_icon_btn.html`
Artifact boards: `WaterpasMail.dc.html` ("Recht gehangen (klikbaar)", 700 × 2100), `WaterpasInfo.dc.html` ("De
momenten, techniek en gewicht").
Rules: [../README.md](../README.md) (Coram), [../../README.md](../../README.md) (all artifact concepts).
**Status:** CURRENT · copy-safe technique: YES · real devices: NOT TESTED (vocabulary: [../../README.md](../../README.md), "Status of a concept")

## What it does

"Hang jij hem even recht, [Voornaam]?" A matte black towel rail with a spirit level hangs a little crooked (−6°). The
first tap swings it too far (8°): "Oeps. Net iets te enthousiast." The second, light arrow sets it level (0°): the
bubble in the middle, a towel "Handdoek en bedankt" and "Strak. Zoals elke montage van jullie dit jaar." "Nog een keer"
starts over. Then a calm, normal mail: the message and "Jullie jaar in vakwerk".

## How it works

- **Inputs:** a pre-checked `cw-detect` and two checkboxes in a row (`cw-c1`, `cw-c2`), as the technique board says
  ("Twee checkboxes na elkaar"), inside a `<form>` for "Nog een keer" (`<input type="reset">`).
- **Arrows:** labels. The first (bottom right) shows at the start; the second (top left, light) only after the first
  step. Both are centred on the board's buttons and keep a fixed size (60 / 56px; 48 / 44px on mobile).
- **The rail** turns around the bar (`transform-origin` at y 92 of the group): −6 / 8 / 0 degrees with the board's
  `transition: transform 0.9s cubic-bezier(.3,1.5,.5,1)` (the overshoot); the bubble moves 68 / 6 / 37 with `left 0.9s`.
  The towel shows at level.
- **The three texts** (scheef, oeps, recht) share one grid cell, so the rail doesn't move between the states.
  **Deviation:** in the board the rail moves about 15px down when the text has three lines.
- **Client fallbacks:** Outlook.com (`[class~="x_cw-…"]`, also chained), Samsung (`#MessageViewBody`), Outlook apps
  (`\0`, separate `<style>`). No id selectors.

## Fallback (Gmail, Outlook, Samsung)

"De rest ziet direct het rechte rek met de handdoek en de tekst" (artifact): the step 3 texts and the level rail with
the towel built **in tables** (brackets, bar, spirit level with the vial and the bubble in the middle, towel with
"Handdoek en bedankt"), at the board's positions (spacer and padding formulas in the code). No image needed.

## Values (one-on-one with the board)

- Colours, sizes, positions, the animation and copy from the board and its DCLogic script; the rack in % of 520 × 380.
- The message (560 high, content centred) and "Jullie jaar in vakwerk" (three white cards) are static sections of the
  mail, built by `build_mail.js` with the board's values.
- The board has no subject or preheader: its title and the start headline.

## Mobile (own interpretation)

The rack scales; the arrows stay tappable; the headline 30 / 26px; the towel text 16 / 14px; the three cards stack.

## Size

50,306 bytes (49.1 KiB). The fallback starts at 29.8 KiB, the unsubscribe link at 48.6 KiB.

## How it is built

| Script | What it does |
|---|---|
| `node build/gen_rek.js` | Writes the block with the default tokens and slot names. Then run `assemble.ps1` in `HTML/`. |
| `node build/build_mail.js` | Writes this mail: the Coram shell (header bar, footer) + the block + the message and "Jullie jaar in vakwerk" + the copy. |
| `node build/test_clicks.js` | Click tests at 760, 390 and 360px; screenshots in the temp folder (`coram-c3-test`). |

## Tests done (Chrome over the DevTools Protocol)

At 760, 390 and 360px: no overflow; layer on; start: −6°, bubble at 68, first text, first arrow; arrow 1: 8°, bubble at
6, "Oeps", second arrow; arrow 2: 0°, bubble at 37, end text, towel, "Nog een keer"; reset back to the start with the
detection still on; fallback without detection. Side by side with the board rendered in the three states.

## Open items

1. Real devices: Apple Mail (the rotation transition, the reset button); the others should show the fallback.
2. Coram: copy to agree; without data "Jullie jaar in vakwerk" falls back on general Coram figures (artifact).
