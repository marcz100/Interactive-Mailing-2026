# Concept 1 · Van boorgat tot badkamer

Mail: [coram_eindejaarsmail_2026_concept_1.html](coram_eindejaarsmail_2026_concept_1.html)
Block: `blocks/hotspot/hotspot_1_col_row_1_icon_badge_row_2_subtitle_title_row_3_icon_x5_row_4_subtitle_txt_btn.html`
Artifact boards: `Main.dc.html` ("Van boorgat tot badkamer (klikbaar)", 700 × 1000), `WrappedInfo.dc.html` ("De
momenten, techniek en gewicht").
Rules: [../README.md](../README.md) (Coram), [../../README.md](../../README.md) (all artifact concepts).
**Status:** CURRENT · copy-safe technique: YES · real devices: NOT TESTED (vocabulary: [../../README.md](../../README.md), "Status of a concept")

## What it does

"Zonder jullie blijft het bij boorgaten." A bare tiled wall with a cabinet, a basin and five drill holes with a blue
plus each. Every plus mounts a Coram design on its holes (hook, shelf, mirror, soap dispenser, towel rail) and the
dark panel below shows that product's thank-you or personal fact. The pill counts "n van 5 gemonteerd". With all five
the headline becomes "Met jullie wordt het een badkamer." and the panel shows the finale with "Fijne feestdagen,
[Voornaam]. Het team van Coram" and "Opnieuw".

## How it works

- **Inputs:** a pre-checked `cb-detect` (switches the layer on) and one checkbox per product (`cb-c1` … `cb-c5`), as
  the technique board says ("Hotspots met vijf checkboxes, zoals bij een adventskalender"). All inside a `<form>`, so
  "Opnieuw" is an `<input type="reset">`.
- **Pluses** are the labels. Mounting hides the holes and the plus (a mounted product can't be taken off, as in the
  board) and shows the product, drawn from the board's shapes in % of the 620 × 470 scene.
- **Counter:** a CSS counter (`counter-increment` per checked input) before " van 5 gemonteerd".
- **Panel:** start text, one text per product and the finale share one grid cell on the panel's background; every
  product text starts the `cb-stack` z-index countdown when mounted, so the newest is on top; the finale sits above
  all when the chain of five is checked. Headline: two `h1`s in one grid cell, swapped by the chain.
- **Client fallbacks:** Outlook.com (`[class~="x_cb-…"]`, also chained), Samsung (`#MessageViewBody`), Outlook apps
  (`\0`, separate `<style>`). No id selectors.

## Fallback (Gmail, Outlook, Samsung)

"Gmail en Outlook zien de complete badkamer met alle teksten eronder" (artifact): the header row with "5 van 5
gemonteerd", the done headline, the complete bathroom as an **image placeholder** (the artifact wants real Coram
product photos: "Eén kale wand plus vijf losse productbeelden") and the dark panel with all five texts, the finale and
the signature.

## Values (one-on-one with the board)

- Colours, sizes, positions and copy from the board's markup and DCLogic script. The test measures five mounted
  products against the board's coordinates: all within 0.5px.
- **Deviation:** none in the interactive version on desktop.
- The board has no subject or preheader: the mail uses its title and the start headline.

## Mobile (own interpretation: the artifact has no mobile design)

- The scene scales with the width; the pluses stay 36px (tappable) and centred on their holes; the counter pill and
  the logo step down; the headline 28 / 24px; the panel's signature and "Opnieuw" stack.

## Size

50,906 bytes (49.7 KiB). The fallback starts at 32.2 KiB, the unsubscribe link at 49.2 KiB.

## How it is built

| Script | What it does |
|---|---|
| `node build/gen_badkamer.js` | Writes the block with the default tokens and slot names. Then run `assemble.ps1` in `HTML/`. |
| `node build/build_mail.js` | Writes this mail: the Coram shell (footer) + the block with the artifact's values + the copy. |
| `node build/test_clicks.js` | Click tests at 760, 390 and 360px; screenshots in the temp folder (`coram-c1-test`). |

## Tests done (Chrome over the DevTools Protocol)

At 760, 390 and 360px: no overflow; layer on; start: five pluses inside the screen and apart, no product, start text
and headline; mirror then hook: both mounted, their pluses gone, the hook's text on top; desktop: products at the
board's positions; all five: no pluses, finale on top, done headline, signature and "Opnieuw"; "Opnieuw" back to the
start; fallback without detection. Side by side with the board rendered in the start and end state.

## Open items

1. Real devices: Apple Mail (taps, the counter, the grid stack); Gmail, Outlook, Samsung should show the fallback.
2. Coram: the bathroom image with real product photos, no-data copy for the two data hotspots, copy to agree.
