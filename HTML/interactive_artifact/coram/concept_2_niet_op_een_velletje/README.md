# Concept 2 · Dit bedankje past niet op één velletje

Mail: [coram_eindejaarsmail_2026_concept_2.html](coram_eindejaarsmail_2026_concept_2.html)
Block: `blocks/para/para_1_col_row_1_subtitle_title_txt_row_2_txt_x6_row_3_icon.html`
Artifact boards: `RolMail.dc.html` ("De volledige mail", 700 × 2800), `RolInfo.dc.html` ("Zo rolt het af, techniek en
gewicht", three phone moments).
Rules: [../README.md](../README.md) (Coram), [../../README.md](../../README.md) (all artifact concepts).
**Status:** CURRENT · copy-safe technique: YES · real devices: NOT TESTED (vocabulary: [../../README.md](../../README.md), "Status of a concept")

## What it does

"Dit bedankje past niet op één velletje. Scroll maar, [Voornaam]." A matte black toilet-roll holder stands still at
the bottom of the view; while you scroll the thank-you rolls up out of it, sheet by sheet: "Beste [Voornaam],", the
year, "Jullie maken van onze ontwerpen een perfect eindresultaat.", "[X] Coram producten…", "Bedankt voor elke strakke
montage dit jaar." and the wish with "Het team van Coram". No click needed.

## How it works

- **One input:** the pre-checked `cr-detect`, only to switch the layer on.
- **Scroll window** `.cr-window` (700 × 730 on desktop; mobile 700 × 1268, the technique board's phone proportion):
  the tiled wall is the window's own background, so it **stays still** while the paper moves (as a real wall).
- **Scroll area** `.cr-scroll`: hero and paper strip as live text. It **ends at the roll's middle line** (60 under the
  roll's top), so the paper comes out of the roll and never shows under it, without an opaque band.
- **Roll layer** `.cr-desk`: the board's 700 × 220 from the roll's top to the end of the wall (holder, bar, roll with
  three lines, knob), fixed over the bottom of the window, `pointer-events: none`.
- **Start:** about 150px of paper sticks out above the roll on desktop (the paper starts 360 under the wall's top, as
  in the board): "het eerste puntje papier steekt omhoog". On mobile about a quarter of the width
  (`margin-top: calc(124.7vw - 240px)`, the window's height follows the width there).
- **End:** a 20 tail under the paper: the last sheet with the wish and the signature stands above the roll and the
  paper ends 40 into the roll, exactly as in the board (paper to 2280, roll from 2240).
- **Paper always narrower than the roll:** desktop 380 in 400 (as the board); on mobile the paper is 72% wide, so the
  roll gets 78% (holder, bar, lines and knob move along).

## Fallback (Gmail, Outlook, Samsung)

"Gmail, Outlook en desktop zien de fallback: dezelfde papierstrook statisch onder elkaar, met de rol eronder"
(artifact): hero, the six sheets in a table with dotted perforations, the roll below (simplified in tables: the holder
and the roll; the artifact intends the holder as one image).

## Values (one-on-one with the board)

- Colours, sizes, sheet heights (300, the last 340), fonts and copy from the board. Roll geometry in % of 700 × 220.
- **Deviation:** the window size is ours (the board is the full static mail; the moments board is a phone sketch).
- The board has no subject or preheader: its heading and lead.

## Mobile (own interpretation)

The window's phone proportion, a wider strip (72%) with lower sheets (220 / 240) and smaller type, the wider roll.

## Size

43,180 bytes (42.2 KiB). The fallback starts at 29.1 KiB, the unsubscribe link at 41.7 KiB.

## How it is built

| Script | What it does |
|---|---|
| `node build/gen_rol.js` | Writes the block with the default tokens and slot names. Then run `assemble.ps1` in `HTML/`. |
| `node build/build_mail.js` | Writes this mail: the Coram shell (header bar, footer) + the block with the artifact's values + the copy. |
| `node build/test_scroll.js` | Scroll tests at 760, 390 and 360px; screenshots in the temp folder (`coram-c2-test`). |

## Tests done (Chrome over the DevTools Protocol)

At 760, 390 and 360px: no overflow; layer on; window and roll layer proportions; the scroll area ends on the roll's
middle line; the paper narrower than the roll; start: heading shown, a paper tip above the roll (desktop: paper at
360 as in the board); the roll stays still while scrolling; end: scrolled to the bottom, the signature above the roll,
the paper 40 into it; fallback without detection.

## Open items

1. Real devices: Apple Mail iOS/iPadOS (scrolling inside the mail, the fixed roll); the others should show the fallback.
2. Coram: a conscious choice for the toilet-roll theme (artifact), the roll holder image, copy to agree.
