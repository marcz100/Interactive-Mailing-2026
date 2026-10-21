# Concept 2 · WestCord Wrapped in de lift

Mail: [westcord_eindejaarsmail_2026_concept_2.html](westcord_eindejaarsmail_2026_concept_2.html)
Block: `blocks/car/car_1_col_subtitle_title_txt_x6_img_btn_x2.html`
Artifact boards: `WrappedLift.dc.html` (clickable), `WrappedVerdiepingen.dc.html` (all floors), `TechniekConcepten.dc.html`.
Rules: [../README.md](../README.md) (WestCord), [../../README.md](../../README.md) (all artifact concepts).

## What it does

A lift with six floors (L, 1–5), each a chapter of the year: lobby, your nights, your hotel, top 3 at the bar, our year,
roof terrace with two CTAs ("Boek je verblijf", "Geef een cadeaubon"). The lift buttons are labels; arrows go one floor
up or down; the arrow of the travel direction lights up.

## State model

- **11 radios, one `name`:** `lift-1-s` (start in the lobby, no arrow lit), `lift-N-u` (arrived going up, N = 2–6),
  `lift-N-d` (arrived going down, N = 1–5).
- *Why 11 and not 6:* the lit arrow depends on where you came from; CSS can't remember that, so the direction is part of
  the state (email_rules 4.6).
- **Panels:** currently 11 (one per state). Approved but **not built yet**: 6 panels (one per floor) with the arrow
  highlight in CSS per radio — about 25 KB lighter.
- **Fallback:** all floors stacked from lobby to roof, same CTAs.

## Values in this mail

- Floor colours: L `#012D59`, 1 `#2F6FA6`, 2 `#B01063`, 3 `#1D4B7A`, 4 `#1F5F6B`, 5 `#012D59`; active button/arrow `#E2127A`.
- Cabin 520px high, inside 458px (= 520 − 2×28 padding − 6 border); mobile 360 / 314.
- Big titles: `lift-big` (84px) for ≤ 6 characters, otherwise `lift-mid` (40px).
- Floors 1 and 2 show the **no-data** version ("Welkom", "Jouw volgende hotel"); with data the title becomes the
  number of nights / hotel name (see the comment at the top of the mail).

## History and decisions

- Rendered from the old Deployteq Smarty template into plain HTML (scope 'westcord'), so it is **not** generated
  together with the block: the block uses the default tokens and a 420px cabin.
- Fallback moved before the interactive part (Gmail clipping).
- Slimmed down from 164 KB to 89 KB: repeated inline styles of the interactive panels became `.lift-interactive .lift-sN`
  classes, identical comments kept once, indentation of the panels reduced. Rendering verified identical after
  re-inlining.

## Open items

1. **Compare one-on-one with `WrappedLift.dc.html`** (new rule since concept 3); this mail predates that rule.
2. Build the 6-panel version, ideally block and mail from one generator (like concept 3).
3. Client overrides are weaker than the activation selector (exact `[class="x_…"]`, `meta*`); bring them in line with
   the turndown block (`[class~=…]` + chained variants, `#MessageViewBody`).
4. No-data copy, real data fields, hotel photo, links (WestCord).
5. Real-device tests.
