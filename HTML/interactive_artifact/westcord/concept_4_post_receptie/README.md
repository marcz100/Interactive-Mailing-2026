# Concept 4 · Post bij de receptie

Mail: [westcord_eindejaarsmail_2026_concept_4.html](westcord_eindejaarsmail_2026_concept_4.html)
Version 2 (click to open): [westcord_eindejaarsmail_2026_concept_4_v2.html](westcord_eindejaarsmail_2026_concept_4_v2.html), block `…_row_3_title_icon_click.html`
Block: `blocks/para/para_1_col_row_1_subtitle_title_txt_row_2_title_txt_x4_subtitle_txt_x6_subtitle_title_btn_title_txt_x4_row_3_title_icon.html`
Artifact boards: `PostReceptie.dc.html` ("De volledige kerstbrief", 700 × 2200), `PostMomenten.dc.html` ("Zo komt de
brief tevoorschijn", 3 moments), `PostTechniek.dc.html` ("Techniek en inhoud").
Rules: [../README.md](../README.md) (WestCord), [../../README.md](../../README.md) (all artifact concepts).
**Status:** CURRENT · copy-safe technique: YES · real devices: NOT TESTED (vocabulary: [../../README.md](../../README.md), "Status of a concept"). Version 2 and the open envelope are
own interpretation (documented below).

## What it does

"Er ligt post voor je, [Voornaam]." On the reception desk at the bottom of the view lies an envelope with your name;
the letterhead of a Christmas letter already sticks out. While you scroll, the letter slides out of the envelope:
a letter from the Westers family from Vlieland, with "Jouw 2026 bij WestCord" (nights, favourite hotel, last stay), a
dashed gift card with the offer for 2027 and the booking button, the family's greeting and a P.S.

## How it works (no clicks, no state)

- **One input:** the pre-checked `po-detect` checkbox, only to switch the interactive layer on (email_rules 4.1).
- **Scroll window** `.po-window` with the artifact's proportions (700 × 1000, `padding-bottom: 142.8571%`). Inside,
  `.po-scroll` (`overflow-y: auto`, no scrollbar) holds the hero and the letter as **normal flowing text**, not as
  fixed geometry: on a phone the text wraps longer, so the letter must be allowed to grow.
- **Counter with the envelope** `.po-desk`: a fixed layer over the bottom of the window (280 of 700, `padding-bottom:
  40%`, z-index 2, `pointer-events: none` so you can scroll through it and click the button). Its parts (counter,
  envelope with three flaps, "Voor [Voornaam]", stamp, plant, bell) are positioned in % of 700 × 280, so it scales.
- **Start:** hero 0–360, the letter from 420; the counter covers the window from 720, so the letterhead and the
  salutation show above the envelope (artifact moment 1).
- **Open envelope** (feedback, in both versions; a deviation from the artifact): the counter layer has no background
  band, and the envelope's back is transparent, so the letter goes straight into the envelope and its text shows in the
  opening between the side flaps and above the bottom flap. Only the strips beside the letter are the white back
  (desktop 100–130 and 570–600; mobile 3–8% and 92–97%, the letter is 84% wide), so the envelope doesn't look
  see-through.
- **Stamp on the flap** (feedback): the stamp sits in a box the size of the envelope, clipped to the right flap's
  shape, so the part above the flap's edge is cut off and the letter shows there. Its position is in % of the envelope,
  so it follows the larger envelope on mobile. In version 2 the stamp is whole while the envelope is closed.
- **End:** the scroll ends where the content ends. The content is hero + letter + a 156 tail, so at the end the letter
  ends 124 under the counter layer's top: 110 into the envelope, below the tip of the bottom flap (102), so the paper's
  bottom edge never shows in the opening. (The artifact ends it 60 under; with its opaque counter band that didn't
  show.) This holds for any text length, because the end of a scroll always
  puts the content's bottom at the window's bottom.
- **Letter values:** 440 wide (62.8571%), padding 0 40 198 (1440 high on desktop, as in the artifact), EB Garamond
  19/29.45, Caveat for the salutation, the family name and the P.S.; letterhead stripe as a repeating gradient; gift
  card turned 1.5°.
- **Lesson:** the head sets `p { font-size: 16px }`, so letter paragraphs get their own class (`.po-p`) with the size;
  inheriting from the letter is not enough.

## Version 2: click to open (own interpretation, requested on top of the artifact)

The first action is a click: the envelope lies closed on the counter, the letter is inside. A click opens it, the
first part of the letter slides out by itself, and from there it works exactly like version 1.

- **Closed:** a top flap (`#E6EEF4`, the envelope's flap colour) points down to the middle of the envelope, with a
  pink seal "W" on its tip (as the seal in concept 3) that pulses gently. The window doesn't scroll
  (`overflow-y: hidden`) and the letter waits just under the envelope top (`translateY(330px)` on desktop,
  `calc(120vw - 230px)` on mobile; checked from 320 to 600px wide).
- **Click:** the whole counter layer is the label of the `po-open` checkbox. Checked: the flap folds up
  (`scaleY(0)`, 0.5s), the seal fades, then the letter slides up to its normal start position (1.4s, after 0.45s),
  the window scrolls and the label is gone (the envelope can't be closed again).
- **Hero text:** "Hij ligt klaar bij de receptie. Klik op de envelop, dan halen we hem er voor je uit." (own text,
  built from the artifact's lead; to agree with WestCord). The fallback keeps the artifact's text, because it has no
  click.
- **Without transition support** the envelope still opens and the letter is in place at once.
- Block and mail come from the same generator (`build(T, { click: true })`); version 1 is byte-for-byte unchanged.
- Size: 60,232 bytes (58.8 KiB); the fallback starts at 43.3 KiB, the unsubscribe link at 58.4 KiB.
- Closed, the envelope's back is white (nothing shows through); it opens up together with the flap.
- Own class prefix `pk-` (version 1: `po-`), so both blocks can sit in one mail without sharing classes, ids or
  keyframes (email_rules 4.7); the test swaps the prefix when `VARIANT=v2`.
- Tests: `VARIANT=v2 node test_scroll.js` checks the closed state (no scrolling, letter in the envelope, flap and seal
  showing), does a real mouse click on the envelope, checks the open state (flap folded, seal gone, window scrolls,
  letter at its start position) and then runs all version 1 checks. All pass at 760, 390 and 360px.

## Fallback (Gmail, Outlook, Samsung)

As the artifact says: "de brief als gewone mail, met de envelop eronder". Hero, the letter in tables (stripe colour
where gradients don't work, gift card not turned, VML button), then the envelope with the stamp and "Voor [Voornaam]"
and the counter edge. The envelope is simplified (no flaps, plant or bell): the artifact intends the counter with the
envelope as **one image** ("alleen de balie met envelop is een afbeelding"); replace it when that image exists.

## Width

700px, the artifact canvas width (shell rule 6), like concept 1. The block in `blocks/` uses the normal 600px content
width. The WestCord logo is part of the hero, so the shell only has the "Bekijk online" row (shell rule 7).

## Mobile (own interpretation: the artifact has no mobile design)

- The window is taller: 1200 of 700 (669px at 390px), so more letter shows above the counter.
- The letter is 84% wide (86% at ≤ 400px) with 17px text; the hero, salutation, family name, offer and P.S. step down
  (at ≤ 400px the hero is a little tighter, so the letterhead still shows above the envelope at the start).
- **Own counter layout** (feedback: the letter didn't seem to come out of the envelope, the envelope was too small):
  no plant and bell; the envelope is 94% wide and starts right at the top of the layer, without the band of counter
  background above it, so the letter goes straight into it; the layer is 48% of the width high with no background
  (the letter, narrower than the envelope, goes into the open envelope). Name (25px, 23px at
  ≤ 400px) and stamp keep their place on the envelope.
- At the end the letter ends 21.6% of the width under the envelope top (45% of the layer, below the bottom flap's tip
  at 34.5%; tail 26.4% = 48% - 21.6%). More white paper under the P.S. (120px, 104px at ≤ 400px), so the P.S. stays
  above the envelope.

## Size

54,844 bytes (53.6 KiB), light as the artifact promises ("Licht"). The fallback starts at 38.3 KiB, the unsubscribe link
at 53.2 KiB. The block's indentation is compacted in the mail (1 space per level), as in concept 1.

## How it is built

Scripts in [build/](build/) (Node 22+): change the generator, not the HTML.

| Script | What it does |
|---|---|
| `node gen_post.js` | Writes both blocks `blocks/para/…` (version 1 and `…_click`) with the default tokens and slot names. Then run `assemble.ps1` in `HTML/`. |
| `node build_mail.js` | Writes both mails (version 1 and `_v2`): the WestCord shell ("Bekijk online", footer; font link with Caveat and EB Garamond italic) + the block with the artifact's values + the copy. |
| `node test_scroll.js` | Scroll tests over the Chrome DevTools Protocol at 760px, 390px and 360px; screenshots in the system temp folder. `VARIANT=v2` tests version 2 (closed envelope, real click, then the same checks). |

## Tests done (Chrome over the DevTools Protocol)

At 760, 390 and 360px: no horizontal overflow; interactive on, fallback off; window 1000 (mobile 1200) of 700 with the
counter 280 of 700 at the bottom; start: letterhead above the counter, letter at y 420 (desktop); the counter stays
still while scrolling; the gift card button can be clicked through the counter layer; end: scrolled to the bottom,
P.S. above the counter, letter ending 124 (of 700; mobile 21.6% of the width) under the counter top and below the tip of the bottom flap; the white back strips meet the letter's sides; letter text fits its paper; mobile text
17px; mobile: the letter is narrower than the envelope, the envelope starts at the top of the layer; fallback when
detection fails. Side by side with the artifact's three moments rendered at full scale: moment 1
and 3 match.

## Open items

1. Real devices: Apple Mail iOS/iPadOS/macOS (light/dark) — scrolling inside the mail and the fixed counter; Gmail,
   Outlook, Samsung should show the fallback.
2. The counter with the envelope as an image (artifact), for the fallback at least.
3. WestCord: no-data copy (without stay data the "Jouw 2026" box drops out, but the sentence with [X] nights also
   needs a version), the offer for 2027, who signs (Familie Westers), links.
