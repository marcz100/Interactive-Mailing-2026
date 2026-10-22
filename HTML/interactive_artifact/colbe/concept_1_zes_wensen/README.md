# Concept A · Zes wensen

Mail: [colbe_eindejaarsmail_2026_concept_1.html](colbe_eindejaarsmail_2026_concept_1.html)
Block: none yet in `blocks/` (only the mail was asked for; the generator can be split into a block generator later,
like the Funda and WestCord concepts).
Artifact boards: "A · Zes wensen: de mail" (page 1, 640 × 2150) and "A · Momenten, techniek en gewicht" (page 2) of
the downloaded "Colbe eindejaarsmail concepten", see [../README.md](../README.md).
Rules: [../README.md](../README.md) (Colbe), [../../README.md](../../README.md) (all artifact concepts).

## What it does

A dark hero ("Dit jaar kwam veel samen."), then six coral-ringed lights on a dashed circle with a counter in the
middle. Tapping a light turns it coral, shows its word (Rust, Groei, Verbinding, Balans, Plezier, Betekenis) and its
wish line under the circle; the counter goes from 0/6 to 6/6. Until all six are open a dashed box says "Open alle zes
de lichtjes. …"; with all six open the middle turns coral ("alles samen") and the greeting card "Fijne feestdagen en
een betekenisvol 2027" slides in. Then the letter with the CTA, the photo band, the unsubscribe paragraph and the
footer.

## How it works

- **Inputs:** a pre-checked `zw-detect` checkbox (switches the interactive layer on, email_rules 4.1) and one checkbox
  per wish (`zw-c1` … `zw-c6`), as the technique board says ("onthullen in stappen met zes checkboxes").
- **Order:** inputs → hero → fallback → interactive. The hero is a sibling of the inputs, so its tap instruction
  ("Tik op de lichtjes en ontdek ze één voor één.") is shown only in the interactive version
  (`.zw-detect:checked ~ .zw-hero .zw-tap`); the fallback hero ends at "… klaargezet." (nothing to tap there).
- **Circle:** a box with fixed proportions (420 × 420, `padding-bottom: 100%`); ring, middle and lights are
  positioned in % of it at the board's positions (the board's own formula: `210 + 150·cos/sin(i/6·2π − π/2) − 46`).
- **Lights** are the labels of the checkboxes. An open light stays open (`pointer-events: none`), as in the board.
  Hover `scale(1.05)` and the .35s colour transition are kept.
- **Counter:** a CSS counter (`counter-increment` per checked input) writes the number before "/6".
- **Wish line:** all seven lines ("Begin waar je wilt." + six) in one grid cell on the cream background; every line
  starts the `zw-stack` z-index countdown when its wish opens, so the newest is on top (Funda/turndown technique).
- **All six open:** the chain `.zw-c1:checked ~ … ~ .zw-c6:checked ~ .zw-interactive` turns the middle coral, swaps
  "wensen open" for "alles samen", hides the dashed box and shows the finale with the board's `verschijn` animation
  (.6s fade + 12px rise).
- **Client fallbacks:** Outlook.com (`[class~="x_zw-…"]`, also chained, also for the tap instruction), Samsung
  (`#MessageViewBody`), Outlook apps (`\0`, separate `<style>`). No id selectors.

## Version 2 (additions on top of the board)

Mail: [colbe_eindejaarsmail_2026_concept_1_v2.html](colbe_eindejaarsmail_2026_concept_1_v2.html), built by the same
generator (`make(V2)`), so everything else stays identical to version 1 (version 1 is byte-for-byte unchanged).

- **Lights turn off again:** no `pointer-events: none` on open lights. Tapping an open light unchecks it: white with
  "+", the counter goes down, and the line of the newest light still on comes back on top ("Begin waar je wilt." when
  none is on).
- **The merge (all six on):**
  - **Lights:** each sits in an orbit wrapper on the middle, placed with
    `rotate(a) translateY(-163.043%) rotate(-a)` (150 / 92). The counter-rotation keeps the words upright, and the
    start positions are exactly the board's.
  - **0–3s:** per-light keyframes (`zw-spiral-1` … `-6`, 13 stops). The angle speeds up (t², two turns). The radius
    holds for the first 30%, then closes into the middle. The lights fade over the last 10%.
  - **During the spiral:** the middle is in front (`z-index: 2`), so the lights disappear into it instead of
    piling up over "6/6".
  - **From the sixth tap:** the wish line and the dashed placeholder are `display: none`, so they take no space.
  - **0–3s:** the lights glow while they spin (`zw-glow`: a coral and a warm white `box-shadow`). It is clearly
    visible within 0.45s and grows as they speed up.
  - **2.4s:** the ring fades.
  - **2.7–3.4s:** the middle grows from 140 to 300 (the ring's size).
  - **3.2s:** the sentence "Verbinding: mensen om je heen die je zien en steunen." appears under "6/6 alles samen"
    (16px; 14px at ≤ 600px, 13px at ≤ 400px).
  - **3.4s:** the greeting card. Until then it takes no space. Its wrapper `.zw-fin-wrap` (no padding, so the card's
    mobile `!important` padding can't leave an empty block) opens from `max-height: 0`, while the card fades in.
- **After the merge** the lights can't be tapped any more (they are inside the ball); the end state is final.
- **Reduced motion** (`prefers-reduced-motion: reduce`): straight to the end state.
- **Without animation support** the lights stay on the circle with the coral "6/6 alles samen" middle (version 1's
  end state).
- **Fallback:** unchanged (the circle with all six, the list and the greeting): it tells the six wishes, which the
  merged ball no longer shows.
- **Size:** 85,814 bytes (83.8 KiB). The fallback starts at 52.9 KiB, the last unsubscribe link at 81.1 KiB. The
  spiral keyframes add about 16 KB (unprefixed `@keyframes` only; WebKit has supported them since Safari 9).
- **Tests:** `node test_clicks.js v2` at 760, 390 and 360px:
  - **toggling:** a light turns off (0/6 and the start line again) and on again; another light off brings the
    previous line back on top;
  - **the merge:** the lights glow while spinning; the line, placeholder and card take no space before the card appears; all six lights end in the exact middle with opacity 0; one round, centred ball of 300/420;
    "6/6 alles samen" and the sentence inside the circle; ring faded; greeting shown and fully open; tapping the ball
    changes nothing;
  - **fallback, and the board comparison of the start state:** both pass;
  - **screenshots:** taken at 0.7, 1.5, 2.3, 2.9 and 3.3s and at the end (`zes-wensen-test-v2` in the temp folder).
- **Open:** real Apple Mail — the smoothness of the spiral (13 stops, linear in between) and of the growing middle
  (animates left/top/width/height).

## Fallback (Gmail, Outlook, Samsung)

The board's end state, as the technique board says ("de zes wensen als nette lijst rond dezelfde cirkel, met de
nieuwjaarsgroet eronder"): the circle with all six lights open and "6/6 alles samen" in the middle, built in tables
(three columns 126 / 168 / 126 with spacer rows at the board's y positions, so the circles land exactly where the
board has them); the six wish lines as a list; the coral greeting card. Outlook classic gets VML ovals, so the circles
stay round. **Deviation:** no dashed ring in the fallback (a ring behind table cells needs an image).

## Values (one-on-one with the board)

- Colours, sizes, copy and behaviour from the board's markup and DCLogic script; the board's line heights are used
  exactly (17 × 1.6 = 27.2px, 15 × 1.5 = 22.5px, …); where the board leaves `normal`, the measured Albert Sans value
  (about 1.2×: 12→14, 13→15/16, 14→17, 15→18, 17→20px).
- Measured against the rendered board at 640px (test below): every compared text element is within 0.5px in position
  and size, in the start state and with all six open.
- **Deviation:** the board's SVG arrows in the outline buttons are a text arrow (`&rarr;`, Arial) — SVG isn't
  email-safe. The button boxes match the board exactly (358 × 53.2 and 171.8 × 44.5).
- **Deviation:** tapping an open light in the board shows its line again; here it is locked (CSS can't bring an older
  line back to the top). The board can't close a light either.
- "Schets opnieuw bekijken" (the board's prototype reset) is left out on purpose.

## Mobile (own interpretation: the board has no mobile design)

- The circle scales with the width (up to 420px), with 16px side margins. The words in the lights step down 15 → 13 →
  12px (≤ 600 / ≤ 400px) so "Verbinding" fits at 360px; the counter 30 → 26px at ≤ 400px.
- Hero, letter, finale, placeholder, unsubscribe and footer get smaller padding; the H1 steps 42 → 34 → 30px.
- Photo band stays three across (100px high on mobile). Fallback: the middle disc becomes 120px at ≤ 400px so it fits
  its column.

## Dark mode

The head sets `color-scheme: light only`: the design already has dark bands (hero, footer) and should look the same
in Apple Mail dark mode. Gmail and Outlook may still apply their own colour inversion; check on devices.

## Size

67,091 bytes (65.5 KiB), well under the 90 KB preference. The fallback starts at 35.1 KiB, the last unsubscribe link
at 62.9 KiB (the first one is in the header).

## How it is built

Scripts in [build/](build/) (Node 22+): change the generator, not the HTML.

| Script | What it does |
|---|---|
| `node build_mail.js` | Writes both mails (version 1 and version 2): the Colbe shell (`shell_head.html`, header, letter, photo band, unsubscribe, footer) + the wish block with the board's values and copy. Prints size and byte offsets. |
| `node test_clicks.js [v2]` | Click tests (version 2 with `v2`) over the Chrome DevTools Protocol at 760px, 390px and 360px with real mouse clicks; screenshots in the system temp folder (`zes-wensen-test`). `ARTIFACT=<unpacked board .html>` also renders the board in the same states and compares every text element with the mail. |

## Tests done (Chrome over the DevTools Protocol)

At 760, 390 and 360px: no horizontal overflow; interactive on, fallback off; start: all "+", "0/6", "wensen open",
"Begin waar je wilt.", the dashed box, the tap instruction; nothing covers the lights; every word fits inside its
light; smallest font 12px; wish 1: coral with its word, 1/6 and its line; wish 1 again stays open; 3 then 2: line 2
on top, 3/6, lines share one box; all six: 6/6, coral middle "alles samen", finale, no dashed box, line 6 on top;
fallback without detection: shown, no tap instruction, 7 round circles inside the mail, not overlapping.
Static: unique ids, no id selectors (besides the intended `#MessageViewBody`), balanced conditional comments and VML.
Side by side with the board (start, three open, all open): 33 text elements within 0.5px.

## Open items

1. Real devices: Apple Mail iOS/iPadOS/macOS (light/dark) — taps, `pointer-events` on labels, the CSS counter, the grid
   stack and the finale animation; Gmail, Outlook (classic: VML circles and buttons), Outlook.com/new, Samsung should
   show the fallback. Suggest an Email on Acid run.
2. Colbe: are these six words right (or the core values / services of the network)? Logo, photos, signatory,
   salutation merge fields, links, brand font.
3. A reusable block in `blocks/` (new prefix, to add to the naming table) when wanted.
