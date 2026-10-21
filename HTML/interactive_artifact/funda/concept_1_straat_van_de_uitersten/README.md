# Concept B2C 1 · De straat van de uitersten

Mail: [funda_eindejaarsmail_2026_concept_1.html](funda_eindejaarsmail_2026_concept_1.html)
Block: `blocks/hotspot/hotspot_1_col_row_1_subtitle_title_txt_row_2_icon_x7_row_3_img_badge_subtitle_title_txt_x6_txt_row_4_subtitle_title_txt_btn.html`
Artifact board: "B2C 1 · De straat van de uitersten" (page 0 of the downloaded "Funda eindejaarsmails 2026", see
[../README.md](../README.md)).
Rules: [../README.md](../README.md) (Funda), [../../README.md](../../README.md) (all artifact concepts).

## What it does

A Christmas street as an advent calendar. Seven houses, doors 18 to 24. Tapping a house opens its door, turns its
light on and shows its record of 2026 (most expensive, largest, smallest, most expensive region, most viewed, most
saved). Under the card: "Nog [n] deuren te gaan voor nummer 24." Door 24 is locked until the six others are open;
then its Christmas lights go on, the text says "Alle deuren zijn open. Klik nu op nummer 24." and door 24 opens the
finale: "Fijne feestdagen" with the CTA "Bekijk wat er nu te koop staat".

## How it works

- **Inputs:** a pre-checked `fd-detect` checkbox (switches the interactive layer on, email_rules 4.1) and one checkbox
  per door (`fd-c18` … `fd-c24`), as the artifact's technique note says ("checkboxes per deur").
- **Houses** are the labels of the checkboxes (the whole house is clickable, advice from the developers).
- **An open door stays open:** a checked door's house gets `pointer-events: none` (in the artifact a door can't be
  closed either). Tapping an open door again does nothing; in the artifact it shows that door's card again (CSS can't
  bring an older card back to the top).
- **Newest card on top:** all cards sit in one grid cell on an opaque background; every card starts the `fd-stack`
  animation (z-index counting down) when its door opens, so the newest is on top (technique from the turndown
  concept). Without animation support the highest door number shows.
- **Progress text:** a CSS counter (`counter-reset: fd-left 6`, every open door `counter-increment: fd-left -1`)
  writes the number; one selector per door instead of 64 combinations of `:checked` / `:not(:checked)`. With all six
  open (a chain `.fd-c18:checked ~ … ~ .fd-c23:checked ~`) the "Alle deuren …" text replaces it.
- **Door 24:** `pointer-events: none` and the locked colour `#B98A80` until the chain of six is checked; then white
  with the lights `#FFD27A`; once open `#FFE7A3` and the finale shows below the card.
- **Client fallbacks:** Outlook.com (`[class~="x_fd-…"]`, also chained), Samsung (`#MessageViewBody`), Outlook apps
  (`\0`, separate `<style>`). No id selectors (Gmail drops them).

## Fallback (Gmail, Outlook, Samsung)

As the artifact says: "alle zes records als kaartjes onder elkaar, de straat als statische illustratie met open
deuren", plus the finale with the same CTA (VML button for Outlook). The intro has its own text, because there is
nothing to click: "Achter elke voordeur woont een record van dit jaar. En achter nummer 24 een wens van ons." (built
from the preheader). The street illustration is a placeholder box until the image arrives (568 wide).

## Values (one-on-one with the board)

- Colours, sizes and copy are taken literally from the board's markup and its DCLogic script (`H` = the six houses).
- Measured in Chrome against the rendered board (positions within 1px): header, hero, houses (76 wide, 6 apart; house
  24 84 wide), pavement (inside the 36px padding), card (photo box 244 wide = 220 + 2× 12, content-box), finale (244
  high).
- Unset line heights in the board are `normal` (about 1.2x): badge 14, record title 17, value 32, place 18, hint 18,
  progress 15, finale label 15, finale title 34, finale button 16px/19 + 12px padding, Index button 14px/17.
- Logo, photos ("[foto woning]") and the street illustration are the artifact's placeholders.
- **Deviation:** all open cards are as high as the tallest card (they share one grid cell, so the card on top always
  covers the others). The board sizes each card to its own text; here the card area is up to 33px taller.

## Mobile (own interpretation: the board has no mobile design)

- The houses step down at ≤ 600px and ≤ 400px (walls 70%, smaller roofs, doors, windows) so all seven fit side by
  side at 360px; the pavement keeps 16px side margins.
- Cards: photo box (116 high) on top, text below. Font steps for the title, intro, values and the finale.
- Open: the developers suggested showing fewer houses on mobile; all seven fit, so not done yet.

## Size

85,714 bytes (83.7 KiB), under the 90 KB preference. The fallback starts at 47.5 KiB, the unsubscribe link at 83.0 KiB.

## How it is built

Scripts in [build/](build/) (Node 22+): change the generator, not the HTML.

| Script | What it does |
|---|---|
| `node gen_straat.js` | Writes the block `blocks/hotspot/…` with the default tokens and slot names. Then run `assemble.ps1` in `HTML/`. |
| `node build_mail.js` | Writes this mail: the Funda shell (`shell_head.html`, header, Index card, footer) + the block with the artifact's values + the copy. A new line in the copy becomes `<br>`. |
| `node test_clicks.js` | Click tests over the Chrome DevTools Protocol at 760px, 390px and 360px with real mouse clicks; screenshots in the system temp folder. `ARTIFACT=<unpacked board .html>` also renders the board in the same states. |

## Tests done (Chrome over the DevTools Protocol)

At 760, 390 and 360px: no horizontal overflow; interactive on, fallback off; start: hint, no card, door 24 locked;
door 24 can't be opened early; door 18 opens with its light and card and the "Nog …" text; door 18 again stays open;
20 then 19: card 19 on top; open cards share one box and the text fits; all six: "Alle deuren …", lights on, door 24
unlocked; door 24: finale, and it stays open; fallback when detection fails. Side-by-side screenshots and
measurements against the board (start, cards, all open, finale).

## Tests folder

[tests/funda_eindejaarsmail_2026_concept_1_emailonacid_test.html](tests/) is the earlier version sent to Email on
Acid, kept unchanged as a reference (rule: test mails never change HTML). It differs from the concept mail: radio
group (one door at a time, "Volgende deur" links, door 24 always open), no street image, no photos and no record
values; the record lines (`title_n`, `place_n`, `txt_n`) were removed.

## Open items

1. Real devices: Apple Mail iOS/iPadOS/macOS (light/dark) — clicks, `pointer-events` on labels, the CSS counter and
   the grid stack; Gmail, Outlook, Samsung should show the fallback.
2. Funda: the record figures, photos, street illustration, logo, links; copy to be agreed.
3. Fewer houses on mobile (developer advice), if wanted.
