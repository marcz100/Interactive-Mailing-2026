# HTML — plain email source

Plain, ESP-agnostic email HTML: no template language, no merge tags, no tracking links. Every new design is built here
first; anything ESP-specific is added later, outside this folder.

All values are the default values from the token table below.

## Structure

| Path | What it is |
|---|---|
| `_head/basic/basic_head.html` | The shared `<head>`: meta, MSO settings, resets, typography, mobile utility classes (`col-sm-12`, `pm{n}`), dark mode, `@font-face`. Contains **only shared CSS**. |
| `blocks/<category>/<block_name>.html` | One block per file. It is **just the block** (no `<html>`/`<head>`/`<body>`), wrapped in `<!-- start block_name -->` … `<!-- end block_name -->`. |
| `whole_code/2026_plain_template.html` | Empty email: shared head + body shell, with `<!-- slot: content -->` and `<!-- slot: footer -->` where blocks go. |
| `whole_code/2026_plain_email_all_blocks.html` | **Generated** test file with every block pasted into the template. Don't edit it by hand. |
| `assemble.ps1` | Rebuilds the all-blocks file. Block files are found automatically; their order comes from `blocks.order.txt`. |
| `interactive_artifact/` | Interactive concepts built from Claude Design artifacts, per client and per concept, each with a README holding the rules for that level. |
| `eoy_concepts/` | Other campaign emails (end-of-year concepts), plus notes, links and the artifact prompt. |
| `docs/` | Naming conventions for blocks, images and variables, and `email_rules.md`: the rules for building (interactive) email. |

Block folders and file names follow the naming convention in `docs/naming_convention_blocks.md`.

## Rules for a plain block

- **Self-contained.** If a block needs extra CSS (interactive `:checked` tricks, keyframes, block-specific media
  queries — `car_*`, `ham_*`, `accordion_*`, `bg_img_*`, `absolute_bg_*`, input, countdown, …), put a `<style>` as
  the first thing inside the block's start/end comments. Never add block CSS to `basic_head.html` or the template head.
- **Hardcoded values, but only token values.** Colors, fonts, sizes, paddings and widths should be values from the
  token table. If a design needs a new value, add it to the table rather than inventing a one-off.
- **Keep the email-client support**: MSO conditional comments + VML buttons/backgrounds, `darkmode_*` /
  `light-img` / `dark-img` classes, the mobile classes (`pml16 pmr16`, `pmt0 pmr24 pmb24 pml24`, `col-sm-12`).
- **Fallback first.** In an interactive block the fallback comes directly after the toggle inputs, before the
  interactive part, so Gmail (which gets the fallback) still has it when it clips a mail at ~102 KB. Inputs and the
  interactive part sit in `<!--[if !mso]><!-->` … `<!--<![endif]-->`; the fallback stays outside it for Outlook.
  Use `~` (or a `+` chain in that order) in the CSS so the order input, fallback, interactive works.
- **Render every element the block name promises** (all `_1.._n` slots).
- **Placeholder text = the variable name that fills it** (naming convention in `docs/`): a title reads `title_1`,
  body copy `txt_1`, a button label `btn_txt_1`, an image `alt="img_alt_1"`, the preheader `preheader`. This shows
  which slot is which. Images use the repo's CDN placeholder images (or `https://placehold.co/{w}x{h}`).
- **Links are real `href`s.** For now every link points to `https://100procent.nl/`. `mailto:` / `tel:` as-is. On
  Outlook VML buttons, use `href="..."` on `v:roundrect`. Links an ESP fills in later (view online, unsubscribe)
  get a short comment above them: `<!-- view online link -->`, `<!-- unsubscribe link -->`.
- **Computed numbers keep their formula** in a comment, e.g.
  `<!-- 464 = bg_img_height 464 - overlay_top 120 - overlay_content_height ... -->`, so they stay easy to change.
- **No loops.** Repeated items are written out (fixed count per file).
- **No template syntax** anywhere in this folder: no `{{ }}`, `{% %}`, `*|MERGE|*` or tracking URLs.

## Testing

Run `powershell -ExecutionPolicy Bypass -File assemble.ps1` to rebuild `whole_code/2026_plain_email_all_blocks.html`.
Then open it with Live Server and check desktop width, <= 480px (stacking, mobile paddings), dark mode, and the
interactive blocks.

## Token table (`scope`)

The default values every block uses. Edit this table when a value changes or a new one is needed.

| Token | Value |
|---|---|
| `template_max_width` | `648px` |
| `content_width` | `600` |
| `block_col_gap` | `24` |
| `content_width_half` | `300` |
| `col_width_2` | `288` |
| `col_width_3_1` | `184` |
| `col_width_3_2` | `184` |
| `col_width_3_3` | `184` |
| `col_width_4_1` | `150` |
| `col_width_4_3` | `448` |
| `img_width_inset_half` | `276` |
| `img_width_inset_icon` | `126` |
| `bg_color` | `#fefefe` |
| `td_side_color` | `#efefef` |
| `block_bg_color` | `#9980FF` |
| `block_border_color` | `#050033` |
| `block_border_width` | `1px` |
| `block_radius` | `4px` |
| `block_padding` | `0 24px 32px 24px` |
| `block_padding_var_top` | `32px` |
| `block_inner_padding` | `24px` |
| `block_inner_padding_wide` | `48px` |
| `block_content_padding` | `0 24px 24px 24px` |
| `block_txt_gap_small` | `8px` |
| `block_txt_gap_big` | `16px` |
| `block_img_gap_small` | `8px` |
| `block_img_gap_big` | `16px` |
| `mobile_outer_classes` | `pml16 pmr16` |
| `mobile_column_class` | `col-sm-12` |
| `mobile_content_classes` | `pmt0 pmr24 pmb24 pml24` |
| `txt_color` | `#050033` |
| `txt_color_inverse` | `#ffffff` |
| `header_link_color` | `#9E9E9E` |
| `header_link_font_size` | `16px` |
| `header_link_line_height` | `24px` |
| `header_link_font_weight` | `400` |
| `font_family` | `Roboto,Arial,Helvetica,Verdana,sans-serif` |
| `font_family_heading` | `Roboto Slab,Arial,Helvetica,Verdana,sans-serif` |
| `p_font_size` | `16px` |
| `p_line_height` | `22px` |
| `p_font_weight` | `400` |
| `h1_font_size` | `24px` |
| `h1_line_height` | `28px` |
| `h1_font_weight` | `700` |
| `h2_font_size` | `24px` |
| `h2_line_height` | `28px` |
| `h2_font_weight` | `700` |
| `h3_font_size` | `20px` |
| `h3_line_height` | `26px` |
| `h3_font_weight` | `700` |
| `nav_font_size` | `16px` |
| `nav_line_height` | `22px` |
| `overlay_font_size` | `22px` |
| `overlay_line_height` | `28px` |
| `overlay_bg_color` | `#010000` |
| `btn_bg_color` | `#e3fc5e` |
| `btn_txt_color` | `#050033` |
| `btn_border_color` | `#e3fc5e` |
| `btn_border_width` | `1px` |
| `btn_radius` | `4px` |
| `btn_font_size` | `20px` |
| `btn_line_height` | `40px` |
| `btn_font_weight` | `700` |
| `badge_spacer_width` | `16` |
| `badge_radius` | `4px` |
| `badge_font_size` | `22px` |
| `badge_line_height` | `28px` |
| `badge_padding` | `6px 10px` |
| `badge_font_weight` | `bold` |
| `carousel_bg_color` | `#efefef` |
| `carousel_arrow_color` | `#ffffff` |
| `ham_icon_color` | `#4d4d4d` |
| `ham_icon_font_size` | `30px` |
| `ham_label_font_size` | `12px` |
| `ham_label_font_weight` | `700` |
| `footer_bg_color` | `#e6e6e6` |
| `footer_td_color` | `#e6e6e6` |
| `footer_fg_color` | `#050033` |
| `footer_padding` | `32px` |
| `footer_divider_color` | `#444444` |
| `footer_icon_width` | `20` |
| `feedback_icon_width` | `24` |
| `logo_light_url` | `https://cdn.msdp1.com/public/100procentemail/47f9309745e03a8eeb95fdf5d7d26b93/100_logo_light_300_117.png` |
| `logo_dark_url` | `https://cdn.msdp1.com/public/100procentemail/47f9309745e03a8eeb95fdf5d7d26b93/100_logo_dark_300_117_2.png` |
| `logo_width` | `150` |
| `darkmode_side_bg_color` | `#c0c0c0` |
| `darkmode_bg_color` | `#1e1e1e` |
| `darkmode_body_bg_color` | `#303030` |
| `darkmode_cta_bg_color` | `#747474` |
| `darkmode_txt_color` | `#ffffff` |
| `block_padding_var_bottom` | `0` |
| `carousel_active_color` | `#050033` |
| `company_name` | `100procent` |
