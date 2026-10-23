# Concept 4 · De lijn van het jaar

Mail: [coram_eindejaarsmail_2026_concept_4.html](coram_eindejaarsmail_2026_concept_4.html)
Block: `blocks/hotspot/hotspot_1_col_row_1_subtitle_title_txt_btn_row_2_subtitle_title_txt_x4_btn_x3_row_3_icon_row_4_subtitle_title_txt_x2.html`
Artifact boards: `LeidingMail.dc.html` ("De lijn van het jaar (klikbaar)", 700 × 3100), `LeidingInfo.dc.html` ("De
momenten, techniek en gewicht").
Rules: [../README.md](../README.md) (Coram), [../../README.md](../../README.md) (all artifact concepts).
**Status:** CURRENT · copy-safe technique: YES · real devices: NOT TESTED (vocabulary: [../../README.md](../../README.md), "Status of a concept")

## What it does

"Draai de kraan open, [Voornaam]." A matte black wall tap at the top. "Kraan open" turns its handle and the water runs
blue down the pipe, past "Jullie jaar" ([X] products) and "Jullie favoriete merk" with the top 3, until it gets stuck:
"Het loopt. Of toch niet helemaal?" Three clogs on the way, each cleared with its own button ("Ontstop", "Ontstop",
"Laatste klusje"), each shown only when the water reaches it. Past "Wist je dat?" and "50+ landen", after the last
clog a blue stream runs from the bath tap into the bath, and the message's kicker becomes "Het bad loopt. Dankzij
jullie." Under the message: "Wat vond je van deze mail?" with two faces.

## How it works

- **Inputs:** a pre-checked `cl-detect` and four checkboxes in a row (`cl-s1` tap, `cl-s2`-`cl-s4` clogs), as the
  technique board says ("Vier checkboxes in volgorde").
- **Buttons** are labels: the tap button in the hero; each fix button shows from the chain of the steps before it and
  goes when its own step is checked. Nothing can be undone (as in the board).
- **The pipe** (desktop): the board's 14 parts (straights and elbows with an 8px border and a 40px radius) in four
  stretches; a stretch turns blue when the chain of steps up to it is checked (`.cl-s1:checked ~ … ~ .cl-interactive
  .cl-lcN`). The tap's handle turns 70° (0.5s, as the board).
- **Desktop and mobile share the same HTML.** Desktop: everything absolutely positioned at the board's coordinates
  (left/width in % of 700, top in px). Mobile: the same elements in flow, grouped in four sections whose **left border
  is the pipe** (grey, blue per stretch); the clogs sit on that line, their buttons next to them; the last section
  bends into the bath tap ("Mobiel krijgt een eenvoudiger leiding langs de linkerkant", artifact).
- **Client fallbacks:** Outlook.com (`[class~="x_cl-…"]`, also chained), Samsung (`#MessageViewBody`), Outlook apps
  (`\0`, separate `<style>`). No id selectors.

## Fallback (Gmail, Outlook, Samsung)

"Gmail en Outlook zien de leiding direct blauw, zonder verstoppingen, met de straal in het bad" (artifact), in the
simple layout: the hero (open state), the tap and a blue pipe down the left with the cards next to it, the bath tap
with the stream into the bath, the message with the end kicker.

## Values (one-on-one with the board)

- Colours, sizes, positions and copy from the board and its DCLogic script; the test compares the cards, tap, clog,
  bath, message and hero with the board's positions: all within 0.5px.
- **Deviations:**
  - where a clog sat, a piece of blue pipe appears once it is cleared (the board leaves a gap there);
  - the feedback question sits under the message (in the board it overlaps the message card);
  - the faces are text characters (☺ / ☹) in white circles: the board's SVG isn't email-safe.
- The board has no subject or preheader: its title and the closed headline.

## Mobile (own interpretation, guided by the artifact)

The simpler pipe along the left (see above); the cards full width; headline 30 / 26px; the bath 300px wide.

## Size

69,042 bytes (67.4 KiB). The fallback starts at 39.6 KiB, the unsubscribe link at 66.9 KiB.

## How it is built

| Script | What it does |
|---|---|
| `node build/gen_leiding.js` | Writes the block with the default tokens and slot names. Then run `assemble.ps1` in `HTML/`. |
| `node build/build_mail.js` | Writes this mail: the Coram shell (header bar, footer) + the block + the feedback question + the copy. |
| `node build/test_clicks.js` | Click tests at 760, 390 and 360px; screenshots in the temp folder (`coram-c4-test`). |

## Tests done (Chrome over the DevTools Protocol)

At 760, 390 and 360px: no overflow; layer on; start: tap closed, pipe grey, three clogs, no fix buttons, no stream;
desktop positions against the board; mobile: the spout, the clogs and the bend into the bath tap on the pipe line;
a fix button can't be clicked before its turn; tap open (handle 70°, first stretch blue, open text, first button);
clog 1 gone (second stretch blue, the gap filled, next button); all clogs gone (pipe blue, stream, end kicker);
fallback without detection.

## Open items

1. Real devices: Apple Mail (taps, the chained colours, the handle transition); the others should show the fallback.
2. Coram: the "Wist je dat?" fact, the top 3 products, copy to agree; feedback clicks to be connected in the ESP.
