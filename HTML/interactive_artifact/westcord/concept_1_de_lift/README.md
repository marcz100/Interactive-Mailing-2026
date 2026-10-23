# Concept 1 · De lift

Mail: [westcord_eindejaarsmail_2026_concept_1.html](westcord_eindejaarsmail_2026_concept_1.html)
Block: `blocks/para/para_1_col_row_1_title_txt_row_2_subtitle_title_txt_x4_img_x2_btn_row_3_title_txt_btn_x2.html`
Artifact boards: `Main.dc.html` (the full mail, 700 × 4600), `Scrollmomenten.dc.html` (3 moments + the cabin),
`Lagen.dc.html` (3 layers).
Rules: [../README.md](../README.md) (WestCord), [../../README.md](../../README.md) (all artifact concepts).
**Status:** CURRENT · copy-safe technique: YES · real devices: NOT TESTED (vocabulary: [../../README.md](../../README.md), "Status of a concept")

## What it does

The mail opens on the roof terrace under a night sky ("Stap in onze lift."). The lift cabin stands still in the view
while the hotel scrolls past behind it: four floors, each with an info plate (your nights, your last stay, our year in
figures, outlook 2027), down to the lobby. There the lift stops exactly in the entrance between reception and bar, with
its doors open. Below the scroll area: three USPs and "Tot snel bij WestCord" with two buttons.

## How it works (no clicks, no state)

- **One input:** the pre-checked `plx-detect` checkbox, only to switch the interactive layer on (email_rules 4.1).
- **Scroll window** `.plx-window`: a box with the artifact's proportions (`padding-bottom: 128.5714%` = 900 / 700).
  Inside it, `.plx-scroll` (`overflow-y: auto`) holds the **building** `.plx-building` (`padding-bottom: 600%` = 4200 /
  700). Every element is positioned in % of 700 × 4200, so the landings stay exact at every width.
- **Cabin** `.plx-cabin`: a separate layer above the scroll window (z-index 2, `pointer-events: none` so you can scroll
  through it), at window position x 285, y 520, 130 × 220 — exactly the artifact's cabin.
- **Start:** at scroll 0 the cabin covers the lift-house door on the roof (285, 520).
- **End:** the lobby entrance (frame, open doors, sign, "L") is a **front layer** (z-index 3). At the end of the scroll
  (3300 of 4200) it lands exactly on the cabin, so the doors look open — CSS can't detect the end of a scroll, the
  geometry does it. The artifact describes the same trick ("schuift voor of achter de lift langs").
- **Welcome card:** the "Welkom beneden." card in the lobby is a front layer too, so the cabin slides behind it on the
  way to the entrance (requested on top of the artifact).
- **No scrollbar** in the window: a scrollbar makes the building narrower than the window and shifts it against the
  cabin (measured on desktop). The scene has its own "Scroll omlaag" hint, as in the artifact.

## Scroll-driven extras (requested on top of the artifact)

Built with **scroll-driven animations** (`animation-timeline` on a named scroll timeline `--plx-scroll` of the window),
inside `@supports (animation-timeline: scroll())`. Supported in WebKit since Safari 26 (Apple Mail on iOS/iPadOS/macOS
26) and Chrome 115+. Clients without support keep the artifact's behaviour: the doors already open in the lobby, the
floor numbers unlit.

1. **Doors open only when the lift is down.** The lobby door panels stay closed (they meet in the middle, the cabin's
   look) and slide open over the last 3% of the scroll, as the entrance lands on the cabin.
2. **The floor number lights up while you pass the floor.** Each number glows warm (`#F2C66D`, the string lights'
   colour) with a light effect: a white-hot core and a wide glow (layered `text-shadow`) plus a radial-gradient
   halo behind the number that grows from the centre (animated `background-size`), while the cabin's centre (window y 630) is within that floor's band, and dims when it
   leaves. Ranges from the artifact geometry: floor 4 at 4.24–23.03% of the scroll, floor 3 at 23.64–42.42%, floor 2 at
   43.03–61.82%, floor 1 at 62.42–81.21% (1% fade at both ends).
3. **The "L" above the entrance lights up when the lift lands**, with the doors (last 3% of the scroll): the same
   yellow and glow as the lit floor numbers.

## Fallback (Gmail, Outlook, Samsung)

The artifact says: "Mailprogramma's zonder ondersteuning tonen dezelfde doorsnede als statisch beeld met de lift in de
lobby". We have no image, so the same cross-section is built in tables: sky with logo and title, the roof lift house,
four floors (plate, windows, shaft with the floor number), the lobby with reception, the entrance with the lift and the
bar, the pavement. Simplified compared to the interactive scene: no stars, fireworks, string lights, plants, benches,
lamps or counters, and the shaft lines only run around the floor number.

- **Mobile fallback:** the columns stack; the windows are hidden. The HTML order is always windows, shaft, plate, so the
  floor number comes right before its plate on every floor; floors with the plate on the left use `dir="rtl"` on the
  table (and `dir="ltr"` on every cell) to keep the desktop layout.

## Width

This mail is **700px wide**, the artifact canvas width (the other WestCord mails use 648px). *Why:* positions scale
with the width but font sizes don't; at 648px the plates were narrower than in the artifact and headings wrapped
("Ons jaar in cijfers"). The block in `blocks/` uses the normal 600px content width.

## Mobile (own interpretation: the artifact has no mobile design)

- The whole scene scales. The window is **taller on mobile: 1200 of 700** (just under 2 floors of 640 in view; 669px
  tall at 390px) instead of the artifact's 900. To keep both landings exact:
  - start: the cabin stays at the artifact's window y **520**, on the roof door; below it you already see floor 4
    (no extra sky above the roof: the user wants floors in view, not sky);
  - landing: **300 extra pavement** below the building makes the content 4500 high, so the end scroll is
    4500 − 1200 = 3300 and the entrance (3820) lands at window y 520 too. At the landing the lower part of the window
    shows that pavement;
  - the scroll distance stays 3300, so the door and floor-number timings are unchanged.
- The plates would be 8px text if they scaled, so on ≤ 600px they become wide cards (88% of the width) **in front of
  the cabin** (z-index 3) with readable type, starting 30 higher (just under the floor number) so they fit in their
  floor. An extra compact step at ≤ 400px.
- Font steps for the hero, logo, hint, floor numbers, lobby, sign and the key board; a smaller "scroll" arrow (an svg
  doesn't scale with the scene).
- The two buttons under the scroll area are stacked and full width, with 8px padding left and right.

## Values

All colours, fonts, sizes and positions come literally from `Main.dc.html`; the cabin from `Scrollmomenten.dc.html`
(`#DCE8F1`, inset 4px `#9FC1DA`, glow `0 0 40px rgba(242,198,109,0.35)`, seam 2px `#6F93B5` at x 349). The palette is in
`build/build_mail.js` (`WC.c`). Photos are the artifact's placeholder boxes ("[Foto hotel]", "[Beeld arrangement]");
replace them by image tags when the photos arrive.

## Size

90,901 bytes (88.8 KiB), under the 90 KB preference. The unsubscribe link sits at
88.6 KiB. In the mail the block's indentation is 1 space per level instead of 3 (formatting only, verified identical
apart from leading whitespace); the block file in `blocks/` keeps its normal indentation. If an ESP adds much markup,
slim the fallback first (it is the largest part, about 35 KB).

## How it is built

Scripts in [build/](build/) (Node 22+): change the generator, not the HTML.

| Script | What it does |
|---|---|
| `node gen_lift.js` | Writes the block `blocks/para/…` with the default tokens and slot names. Then run `assemble.ps1` in `HTML/`. |
| `node build_mail.js` | Writes this mail: the WestCord shell (head, "Bekijk online", footer) + the block with the artifact's values + the copy. |
| `node test_scroll.js` | Scroll tests over the Chrome DevTools Protocol at 760px (desktop), 390px and 360px (mobile); screenshots in the system temp folder. |

## Tests done (Chrome over the DevTools Protocol)

At 760, 390 and 360px: no horizontal overflow; interactive layer on, fallback off; **top**: cabin exactly on the roof
door and nothing in front of it; **floors**: nothing in front of the cabin on desktop, only plates on mobile (by
design); **lobby**: the cabin passes behind the welcome card; **end**: scrolled to the bottom, the entrance lands exactly on the cabin and is in front of it; **mobile**: every
plate fits in its floor, smallest font 11px, buttons stacked and full width; fallback shown when detection fails.
Scroll-driven extras: doors closed at the top, in every floor and just before landing, open at the end; at each
floor's centre exactly that floor's number is lit, none on the roof or in the lobby. Side-by-side screenshots of the
three artifact moments matched (roof, floors, lobby).

## Open items

1. Real devices: Apple Mail iOS/iPadOS/macOS (light/dark) — scrolling inside the mail, the cabin staying still, the
   landing, and whether Apple Mail runs the scroll-driven animations (doors, floor numbers; tested in Chrome only);
   Gmail, Outlook, Samsung should show the fallback; Outlook Mac unknown.
2. At the end a soft glow of the cabin shows around the entrance (the cabin is still behind it).
3. No-data copy (artifact: "zonder data valt een plaat terug op algemene content"), real photos, links (WestCord).
4. The `[Hoogtepunt]`, `[Aantal]` figures and the invitation text are still placeholders.
