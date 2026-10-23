# Email Blocks

* Use lowercase only.
* Use letters, numbers, and underscores (`_`) only.
* Do not use spaces, hyphens, camelCase, or other special characters.
* Name blocks following the visual order of the content.
* Use the same naming pattern consistently throughout the project.

## Formula (standard — no row)
Use this when each column's content simply stacks top to bottom in order, with no need to call out separate horizontal groupings.

[prefix_]{col_count}_col_[width_1_width_2..]_{position}_{content...}_[responsive]

## Formula (with row)
Use `row_{n}` only when a single column contains more than one distinct horizontal grouping of content. For example a logo and 3 text links on same row.

[prefix_]{col_count}_col_[width_1_width_2..]_{position}_row_{n}_{content...}[_x{count}]_row_{n+1}_{content...}_[responsive]

* `col_count` — number of columns (1, 2, 3…)
* `width_*` — needed whenever col_count > 1
* `position` — `left`, `right`, `center`, or `all`; only needed when col_count > 1
  * use `all` + one shared content block when every column has the same content
  * use explicit `left_..._center_..._right_...` (each with its own content)
* `content` — one or more element codes in visual order (`img_title_txt_btn`)
* `_x{count}` — appended to a content code when that element repeats identically on the same line (e.g. `txt_x4` = 4 identical text/link items in a row)
* `row_{n}` — marks a distinct horizontal content grouping within a column; increments per grouping
* `responsive` — only stated when not stacking on mobile and col_count > 1; use `scale` when columns shrink instead

## Examples — generic blocks
1_col_img_title_txt_btn

2_col_50_50_left_img_right_title_txt_btn

2_col_75_25_left_img_right_title_txt_btn_scale

3_col_33_33_33_all_img_title_txt_btn

## Examples — with row
header_1_col_row_1_img_txt_x4

header_1_col_row_1_img_txt_x4_row_2_img_x2

close_alert_1_col_row_1_title_row_2_img_x2

## Elements
| Code | Meaning     |
|------|-------------|
| col  | column      |
| img  | image       |
| icon | logo, non responsive image, small image |
| title  | title      |
| subtitle | subtitle |
| txt  | text   |
| btn  | button      |
| vid  | video       |
| input | text input field |
| badge | badge or promotion label |
| border | the columns share one bordered box |
| smiley, rating | rating scale (close_alert) |
| days_hours_minutes_seconds | countdown units |

## Responsive / Modifiers
| Code | Meaning |
|------|---------|
| scale | columns shrink instead of stacking on mobile |
| mob_hide | hide on mobile |
| click | the interaction starts with a click (e.g. a closed envelope that opens) before the rest of the block works |

## Prefix — specific blocks
| Code | Meaning |
|------|---------|
| bg_img | background-image |
| header | header |
| footer | footer |
| spacer | spacer |
| close_alert | closer alert |
| car | carousel |
| ham | hamburger |
| hotspot | hotspot |
| dropdown | dropdown |
| para | parallax |
| divider | divider / spacer between content |
| countdown | countdown timer |
| feedback | sentiment/rating feedback (e.g. thumbs up/down) |
| accordion | accordion (expand/collapse) |
| absolute_bg | absolutely positioned background image |
| input | form input block |

The block's folder is its prefix (or `{n}_col` without one): `car/car_...`, `1_col/1_col_...`. Add a new prefix to the
table above before you use it.