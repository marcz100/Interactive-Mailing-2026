# Interactive artifact concepts

How we turn a Claude Design artifact (an interactive email concept on a canvas) into working email HTML. These rules
come on top of [docs/email_rules.md](../docs/email_rules.md) and are based on what we learned building the WestCord
concepts. It's a living document: add a rule when we learn something, and write down **why**.

## Folder structure

```
interactive_artifact/
  README.md                      <- this file: rules for every artifact concept
  tools/                         <- shared tooling (unbundle_artifact.js)
  <client>/
    README.md                    <- client rules: brand values, mail shell, data, open items, concept overview
    concept_<n>_<name>/
      README.md                  <- concept rules: what it does, states, geometry, decisions, tests, open items
      <client>_<campaign>_<year>_concept_<n>.html
      build/                     <- generator (block + mail), mail builder, tests
      tests/                     <- test sends kept as reference, unchanged (optional)
```

The reusable block for a concept lives in `blocks/<prefix>/` (default tokens, slot names). The concept mail in this
folder is the same structure with the client's values and copy.

## 1. Reading the artifact

1. **Rule: read the files, not the page.** Use the Artifact tool, action `read` with `paths`: `project/canvas.json` and
   the `project/*.dc.html` boards. The page itself only shows "Loading…".
2. **Rule: read the board's code, not just its text.** Positions, sizes, colours, fonts, `clip-path`s and the state
   logic (`DCLogic` / `renderVals`) are in the markup and the script. Take values literally.
   - *Why:* the first turndown version was built from the text only and looked nothing like the artifact.
3. **Rule: map the canvas first.** `canvas.json` tells which boards belong to which concept (titles, x positions,
   `is_interactive`). Typical boards per concept: the full mail, the clickable version, the steps/moments, technique.
4. **Rule: the artifact is a design reference, not email code.** Never copy its HTML/CSS/JS into a mail.
5. **Rule: a downloaded artifact is a bundle; unpack it** with `node tools/unbundle_artifact.js "<file>.html" <out>`.
   The download (one large .html) holds gzipped, base64 resources and every board is a nested bundle; the script
   writes each board's `_template.html` (markup + DCLogic script). Open the board's page file in Chrome to see it
   rendered and to measure it.
   - *Lesson:* the Funda artifact was only available as a download ("Funda eindejaarsmails 2026.html").
6. **Rule: measure the rendered board** (Chrome over the DevTools Protocol: font size, line height, position, size of
   every text element) and compare the mail with the same script. Where the board sets no `line-height` it renders
   `normal` (about 1.2x for most webfonts), not the canvas page's base.
   - *Lesson:* Funda B2C 1 used 1.4 by guess; the finale and the cards were 30px taller than the board.

## 2. One-on-one

1. **Rule: the concept mail looks and works one-on-one like the artifact**: layout, colours, fonts, font sizes,
   radii, shadows, copy and interaction. No generic interpretation in repo tokens.
   - *Why:* "this looks completely different!" on the first turndown build.
2. **Rule: geometry as percentages of the artifact canvas.** Absolute positions become `left/width` in % of the
   canvas width and `top/height` in % of the canvas height, inside a box with a fixed aspect ratio
   (`height: 0; padding-bottom: <h/w>%`). The scene then scales with the mail width and on phones.
3. **Check: the containing block.** Absolutely positioned elements must sit inside that fixed-proportion box, not in a
   container that can grow.
   - *Lesson:* the turndown texts were in the growing stage; when the mobile summary was added below, their
     % positions slid down and covered a folded flap.
4. **Rule: copy stays literal**, including the artifact's personal placeholders (`[Voornaam]`, `[X]`, `[Hotelnaam]`).
   Never invent data or copy.
5. **Rule: where the artifact has no answer** (mobile, Outlook, dark mode) we make our own interpretation and say so,
   in the concept README and in the report.

## 3. Structure of an interactive concept

1. **Rule: inputs → fallback → interactive**, see email_rules 4.1. Inputs and interactive inside
   `<!--[if !mso]><!-->`, fallback outside it.
2. **Rule: a pre-checked detection input** (`xx-detect`) gates the interactive layer:
   `@media screen and (-webkit-min-device-pixel-ratio: 0) { .xx-detect:checked ~ .xx-interactive {...} }`.
   - *Why:* WebKit alone doesn't mean `:checked` works (Gmail apps).
3. **Rule: client overrides at least as specific as the activation selector.** `.xx-detect:checked ~ .xx-interactive`
   is (0,3,0); a single-class override with `!important` loses to it. So every override also exists as a chained
   variant:
   - Outlook.com / new Outlook: `[class~="x_xx-interactive"]` and `[class~="x_xx-detect"]:checked ~ [class~="x_xx-interactive"]`
   - Samsung Mail: `#MessageViewBody .xx-interactive` (an id outranks it)
   - Outlook apps: `.xx-interactive\0` and `.xx-detect:checked ~ .xx-interactive\0`, in a separate `<style>`
4. **Rule: selectors use classes, not ids** (Gmail drops id selectors). Ids exist only for `label for=`.
5. **Rule: one prefix per block** (`hs-`, `lift-`, …) for every class, id and keyframe name.
6. **Rule: the fallback is the artifact's end state** (everything revealed), built in tables with inline styles and a
   VML button. It must tell the whole story with the same CTA.
7. **Rule: the interactive layer is styled with scoped classes** (`.xx-interactive .xx-…`). Only the default hiding of
   the container is inline. Absolute positioning, flexbox and `clip-path` are fine here: only WebKit clients with
   working `:checked` ever show this layer.

## 4. Interaction techniques (proven in Chrome, to confirm on devices)

| Need | Technique | Where used |
|---|---|---|
| Independent toggles | one checkbox per item, the item is a `label for=` | turndown corners |
| One state at a time | radios with one `name` | lift floors |
| "All done" state | chain the inputs: `.c1:checked ~ .c2:checked ~ .c3:checked ~ .c4:checked ~ .xx-interactive .finale` (inputs in this order, as siblings) | turndown wish + buttons |
| Status text per count ("Nog 2 te gaan") | one text per count, shown by every combination of `:checked` / `:not(:checked)` (16 selectors for 4 inputs, generated) | turndown status |
| Direction / previous state | encode it in the state: a radio per direction, highlight fixed per state | lift arrows |
| Undo all | inputs inside a `<form>`, `<input type="reset">` (resets to the `checked` defaults) | "Opnieuw inpakken" |
| Show the **newest** of several open items in one spot | all items in the same fixed box with an opaque background; each starts a `z-index` countdown animation when it appears (`10000000 → 1` over `100000s`, 100 per second), so the newest is on top. Without animation support the last one in the DOM shows. | turndown mobile text spot |
| Triangles / flaps | `clip-path: polygon()` (interactive layer only) or border triangles | turndown flaps |
| Object stands still while a scene scrolls past (parallax) | a scroll window (`overflow-y: auto`, fixed proportions) with the scene inside, and the object as a separate layer above the window (`pointer-events: none` so you can scroll through it) | lift cabin |
| Something "happens" at the end of a scroll | make the end state part of the scene as a **front layer** (higher z-index) that lands exactly on the still object | lift entrance in the lobby |
| Change something **during** a scroll (open at the end, light up while passing) | **scroll-driven animations**: a named `scroll-timeline` on the scroll window, `animation-timeline` + keyframes in % of the scroll, inside `@supports (animation-timeline: scroll())`; WebKit since Safari 26 / Apple Mail 26. Name the timeline: an `overflow: hidden` element in between is otherwise the nearest scroll container. Without support the static state stays. | lift doors open only at the landing, floor numbers light up |
| Scene scales but text must stay readable | percent geometry for the drawing; on mobile, move text blocks out of the scaled drawing or make them wide cards in front of it | lift plates |
| Different column order on mobile than on desktop | keep the mobile order in the HTML; on desktop flip the row with `dir="rtl"` on the table and `dir="ltr"` on every cell | lift fallback floors |
| Something that can't be undone (a door stays open) | `pointer-events: none` on the label of a checked input (`.c1:checked ~ .xx-interactive .label-1`) | Funda doors |
| Locked until the others are done | the label starts with `pointer-events: none`; the chain of all inputs (`.c1:checked ~ … ~ .c6:checked ~ .xx-interactive`) sets `pointer-events: auto`. A rule for the next state must contain the chain too, or it loses on specificity | Funda door 24 |
| Count text ("Nog 3 deuren te gaan") with many inputs | a CSS counter: `counter-reset: n 6` on the text, an empty span per input with `counter-increment: n -1` when checked, `content: counter(n)` in a span between the copy. One selector per input instead of 2^n combinations | Funda progress |
| Newest of several cards in one spot, without fixed heights | all cards in one CSS grid cell (`grid-area: 1 / 1`), unopened ones `visibility: hidden` (they still size the cell), z-index countdown animation as above | Funda record cards |

- **Check: stacked layers need identical boxes.** A shorter text on top doesn't cover a longer one below.
  - *Lesson:* "Hoekje 1 blijft staan" — the boxes now have a fixed top and bottom.
  - Consequence: stacked cards are as high as the tallest one, where the artifact may size each to its text. Say so
    in the concept README as a deviation.
- **Check: click tests use real mouse clicks** (`Input.dispatchMouseEvent` at the element's position), not
  `element.click()`: the latter ignores `pointer-events: none`, so locked or finished labels look clickable.
- **Rule: text keeps ≥ 16px from borders and lines** of the drawn shapes, also on mobile and on small phones.
  - *Lesson:* corner texts touched the pillow line.
- **Rule: no scrollbar in a scroll window** whose content must line up with a layer outside it
  (`scrollbar-width: none` and `::-webkit-scrollbar { display: none }`).
  - *Lesson:* on desktop the scrollbar made the lift building 15px narrower than the window, so the cabin missed the
    roof door. Give the scene its own "scroll" hint instead.
- **Rule: a drawn scene is as wide as its artifact canvas** (up to 700px) when text and drawing must keep their
  proportions: positions scale with the width, font sizes don't.
  - *Lesson:* at 648px the lift plates were narrower than in the artifact and headings wrapped.

## 5. Mobile

1. **Rule: the scene scales** (percent geometry). Fonts step down at `max-width: 600px` and `400px`, not with `vw`.
2. **Rule: texts that are too small inside a scaled scene move out of it** or get their own mobile spot; decide per
   concept and write it down.
3. **Check at 390px and 360px**, not only at 600px.

## 6. Block and mail from one generator

1. **Rule: build the block and the concept mail from the same generator**, so they can't drift apart. The block gets the
   default tokens and slot names, the mail gets the client's values and copy.
2. **Check after every change:** with the default tokens the block comes out as intended, and the mail's block section
   differs from the block only where intended (e.g. the full-width outer cell). Compare tag skeleton and CSS selectors.

## 7. Testing (until we have real devices)

1. **Rule: compare with the artifact side by side.** Render the artifact board statically per state (resolve its
   `sc-if` conditions per state) and the mail in the same states, and look at both before reporting.
2. **Rule: drive Chrome over the DevTools Protocol** for interaction tests: device emulation (`mobile: true`, real
   390/360px viewport), real clicks with real waits, computed-style measurements, screenshots.
3. **Rule: test what the user sees, not only the state.** For example, that the top layer fully covers the layers below
   and that nothing covers the interactive elements (`elementFromPoint`).
4. **Lessons (tooling):**
   - Headless Chrome windows have a minimum width (~485px): `--window-size=390` silently lays out at 485px. Use
     device emulation or an iframe.
   - `--virtual-time-budget` can hang on long-running CSS animations; use the DevTools Protocol with real time.
   - Webfonts need time: wait before screenshots, or fonts fall back to Georgia/Arial.
   - Stop only headless Chrome processes (`--headless` in the command line), never the user's own browser.
   - Git Bash eats backslashes in inline `node -e` scripts and heredocs; write scripts to files.
   - Hit-testing (`elementFromPoint`) ignores elements with `pointer-events: none` (like the lift cabin): check
     stacking geometrically (overlap + computed z-index) instead.
   - Compare desktop at a viewport wider than the mail (e.g. 760px for a 700px mail): the page's own scrollbar takes
     15px of a 700px viewport.
5. **Still needed:** real Apple Mail (iOS, iPadOS, macOS, light and dark), Gmail, Outlook (classic, new, .com, apps),
   Samsung Mail.

## 8. Size

- ≤ 90 KB preferred, 95 KB hard limit, ~102 KB is where Gmail clips (email_rules section 5). Measure the byte offset of
  the fallback and the unsubscribe link, not only the total.
- **Rule: insert a large generated block into the mail without re-indenting it.**
  - *Lesson:* shifting the lift block 15 spaces to the mail's nesting added about 11 KB (the mail went from 90 KB to
    101 KB).
- **Rule: if still too heavy, compact the block's indentation in the mail** to 1 space per level (formatting only;
  verify the mail is identical apart from leading whitespace). The block file in `blocks/` keeps normal indentation.
  - *Lesson:* the lift mail went from 97 KB to 86.5 KB this way after adding the scroll-driven extras.
