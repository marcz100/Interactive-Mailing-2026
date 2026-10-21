# Concept 3 · Turndown service

Mail: [westcord_eindejaarsmail_2026_concept_3.html](westcord_eindejaarsmail_2026_concept_3.html) — approved ("this file is good").
Block: `blocks/hotspot/hotspot_1_col_row_1_title_txt_row_2_subtitle_txt_x4_txt_title_row_3_btn_x2.html`
Artifact boards: `Kussenchocolaatje.dc.html` (clickable), `KussenStappen.dc.html` (4 steps), `TechniekConcepten.dc.html`.
Rules: [../README.md](../README.md) (WestCord), [../../README.md](../../README.md) (all artifact concepts).

## What it does

A wrapped chocolate on a pillow. Four flaps; tapping one folds that corner open (the flap folds back outside the
chocolate) and shows its text. When all four are open the wish appears on the chocolate ("WestCord wenst je een
geweldig 2027") with "Boek je volgende nacht" and "Opnieuw inpakken". A status line counts down ("Nog 2 hoekjes te gaan.").

## State model

- **5 checkboxes:** `hs-detect` (pre-checked, no label, switches the layer on) and `hs-c1`–`hs-c4` (top, right,
  bottom, left), in this order.
- Each corner has two labels for its checkbox: the closed flap (over the chocolate) and the open fold (outside it);
  tapping the fold folds the corner shut again.
- "All open": `.hs-c1:checked ~ .hs-c2:checked ~ .hs-c3:checked ~ .hs-c4:checked ~ .hs-interactive …` shows the wish
  and the buttons and hides the "W" seal.
- Status line: 5 texts, 16 generated selectors.
- "Opnieuw inpakken": `<input type="reset">`; the inputs, fallback and interactive part sit in a `<form>`.
- **Fallback:** the artifact's end state (step 4) in tables — pillow, chocolate with the wish, the four texts around
  it, the button. No shadow, no folds.

## Geometry (artifact canvas 700 × 1000; the stage is the 700 × 680 area under the 190px band)

| Element | Artifact (x, y, w, h) | Notes |
|---|---|---|
| Pillow | 20, 24, 660, 640, radius 56, shadow `0 20px 50px rgba(14,26,43,0.15)` | mobile radius 32 |
| Pillow line | 40, 44, 620, 600, radius 42, 2px `#F1EBE0` | mobile radius 24 |
| Chocolate | 220, 210, 260, 260, `#3B2418`, inner line 236, 226, 228, 228, 2px `#5A3A28` | |
| Flaps (closed) | over the chocolate, `clip-path` triangles; top `#012D59`, right `#1D4B7A`, bottom `#2F6FA6`, left `#174170` | |
| Folds (open) | top 220,160,260,50 · right 480,210,50,260 · bottom 220,470,260,50 · left 170,210,50,260 | `#DCE8F1` / `#CFDFEC` |
| Seal "W" | 326, 316, 48, 48, `#E2127A`, 3px white border | hidden when all open |
| Texts (desktop) | top 170,72,360 · right 542,260,102 · bottom 170,530,360 · left 56,260,102 | moved inward: ≥16px from the pillow line, ≥12px from the folds |

Fonts (desktop): title 40/46 EB Garamond 500, intro 17/25, labels 11px tracking 0.14em `#C8106E`, texts 16/22 (sides
15/21), wish label 12px tracking 0.2em `#B3CDE0`, wish text 17/22 `#F4EBDD`, year 60px EB Garamond, status 15px
`#2F5F8F`.

## Mobile (own interpretation: the artifact has no mobile design)

- The scene scales with the width.
- **Above the chocolate:** one text spot for the **newest** opened corner; a newer one replaces the older one, folding
  the newest shut shows the previous one again. All texts share one fixed box (stage y 60–155) with a white background,
  so the top one covers the others completely; newest on top through the `z-index` countdown animation.
- **Under the pillow, above the status and buttons:** a summary of every opened corner, in corner order.
- Font steps: ≤ 600px title 30/34, texts 13/17, year 34px; ≤ 400px texts 12/15, year 28px.
- Fallback on mobile: the columns stack (order 1, 4, chocolate, 2, 3).

## Decisions from the review rounds

1. Rebuilt one-on-one from the board code after the first version (a generic 2×2 grid) was rejected.
2. More space between texts and the pillow line; logo → salutation gap reduced to about 40px (`headerPad 12px`).
3. Mobile: text above the chocolate (newest replaces older) **and** the summary below.
4. Fixed box for the mobile text spot ("Hoekje 1 blijft staan"), facts inside the fixed-proportion box (summary pushed
   them down).

## Tests done (Chrome over the DevTools Protocol, 390px and 360px with mobile emulation, and desktop 700px)

| Taps | Expected on mobile | Result |
|---|---|---|
| 3, then 1 | Hoekje 1 on top, summary 1, 3 | ✓ |
| 1, then 3 | Hoekje 3 on top | ✓ |
| 1, 3, fold 3 shut | Hoekje 1 on top, summary 1 | ✓ |
| 2, 4, 1 | Hoekje 1 on top, summary 1, 2, 4 | ✓ |
| 4, then 2 within 0.3s | Hoekje 2 on top | ✓ |
| 1, then 2 (the reported case) | only Hoekje 2 visible | ✓ |
| all four, then "Opnieuw inpakken" | start state, empty summary | ✓ |
| desktop, all four | 4 texts around the chocolate, no summary | ✓ |

Also checked in every scenario: the top text fully covers the others, the folded top flap stays visible, the text box
keeps its size. Side-by-side screenshots with the artifact matched in all states.

## How it is built

Scripts in [build/](build/) (Node 22+):

| Script | What it does |
|---|---|
| `node gen_hotspot.js` | Writes the block `blocks/hotspot/…` with the default tokens and slot names. Then run `assemble.ps1` in `HTML/`. |
| `node build_mail.js` | Writes this mail: the WestCord shell from the concept 2 mail + the block with the artifact's values + the copy. |
| `node test_clicks.js` | Click tests over the Chrome DevTools Protocol (390/360px mobile emulation and desktop 700px); screenshots go to the system temp folder. `CHROME=<path>` overrides the Chrome location. |

- **Change the generator, not the HTML.** The block and the mail come from the same code; the mail's block section
  differs from the block only in the full-width outer cell. After a change: run both scripts, `assemble.ps1`, and
  `test_clicks.js`.

## Open items

1. Real devices: Apple Mail iOS/iPadOS/macOS (light/dark) — taps on the `clip-path` flaps, the `z-index` animation, the
   reset button; Gmail, Outlook, Samsung should show the fallback; Outlook Mac unknown.
2. No-data copy for `[X]`, `[Hotelnaam]`, `[Aantal]`, `[Voornaam]` (WestCord).
3. Copy to be agreed with WestCord; real logo; real links.
