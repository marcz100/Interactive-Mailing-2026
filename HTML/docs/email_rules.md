# Email rules

Rules for building email in this repo, with extra attention for interactive email. This is a living document: add a
rule when we learn something, and write down **why**, so the rule can be judged later.

This file is **authoritative** for HTML/CSS, email-client, interactive and size rules. Other documents refer to it
instead of repeating its rules; when they differ, this file wins.

Status per rule: **Rule** = always do this. **Check** = verify every time. **Lesson** = learned the hard way, the
reason is in the text.

---

## 1. Source and structure

1. **Rule: plain HTML only.** No ESP syntax in this folder: no `{{ }}`, `{% %}`, `*|MERGE|*`, tracking URLs or
   ESP-specific comments. ESP-specific work happens later, outside this folder.
2. **Rule: one block per file** in `blocks/<prefix>/`, wrapped in `<!-- start name -->` … `<!-- end name -->`, named
   by `naming_convention_blocks.md`. A different number of items is a new block, not a loop.
3. **Rule: block CSS lives in the block**, as the first `<style>` inside the start/end comments. Never put
   block-specific CSS in `_head/basic/basic_head.html` or the template head.
4. **Rule: the all-blocks file is generated.** After any block change run
   `powershell -ExecutionPolicy Bypass -File assemble.ps1`. Never edit `whole_code/2026_plain_email_all_blocks.html` by hand.
5. **Rule: keep copies in sync.** When a block also lives inside a campaign mail (`interactive_artifact/`), change
   both; concepts built with a generator get both from the same generator. Concepts from Claude Design artifacts follow
   the extra rules in [interactive_artifact/README.md](../interactive_artifact/README.md).
6. **Rule: blocks use token values, concept mails use the client's values.**
   - Blocks in `blocks/`: colours and fonts are token values (README token table); sizes, paddings and widths too
     where the table has one. A block generated from an artifact may keep the artifact's geometry and type sizes
     literally and names them in its top comment.
   - Concept mails in `interactive_artifact/<client>/`: the artifact's and client's literal values; approximations
     are listed in the client README.
   - A generator builds both from one structure: `build(DEFAULT)` gives the block, `build(client values)` the mail
     ([interactive_artifact/README.md](../interactive_artifact/README.md) section 6).

## 2. Content and placeholders

1. **Rule: placeholder text = the slot name**: `title_1`, `txt_1`, `btn_txt_1`, `alt="img_alt_1"`, `badge_1`,
   `preheader`. Always with the `_N` suffix (lesson: a bare `badge` was missed by tooling).
2. **Rule: render every element the block name promises** (all `_1.._n` slots).
3. **Rule: links** point to `https://100procent.nl/` until there is a real destination. `mailto:` and `tel:` stay
   as they are. Links an ESP fills in later get a comment: `<!-- view online link -->`, `<!-- unsubscribe link -->`.
4. **Rule: never invent data.** Personal values ([X], [Hotelnaam]) stay placeholders.
   - **Blocks and ESP-ready mails** default to the version **without** recipient data, so they never show `[X]`,
     `0` or an empty heading; describe the with-data variant in a comment.
   - **Concept mails for client review** (`interactive_artifact/`) may show the artifact's own placeholders
     (`[Voornaam]`, `[X]`), so the client sees which data is needed. Until the client supplies the no-data copy, it
     is an open item in the concept README.
5. **Rule: logos in concepts are a text placeholder** (a text version, or the artifact's own placeholder box such
   as a dashed "[logo funda]") until the designer delivers the real logo. Never redraw a logo.
   - *Why:* a redrawn logo (HTML/CSS/SVG) is never exactly right and looks careless to the client; the logo is the
     client's trademark and must come from their official files; a text version is clearly a placeholder, so it
     can't slip into the final mail by accident; and Gmail/Outlook don't show SVG, so the real image file is
     needed anyway.
6. **Rule: computed numbers keep their formula** in a comment, e.g. `<!-- 358 = 420 height - 2x 28 padding - 6 border -->`.

## 3. Email-client basics

1. **Rule: tables for layout**, with `role="presentation" border="0" cellspacing="0" cellpadding="0"`.
2. **Rule: Outlook buttons** are VML `v:roundrect` in `<!--[if mso]>`, with `href` on the `v:roundrect`; the HTML
   button gets `mso-hide: all`.
3. **Check: conditional comments, exact syntax** (lesson: `<!--[endif]-->` was used as a closer in four blocks;
   Outlook may then hide everything up to the next real `<![endif]-->`):
   - Outlook only: `<!--[if mso]>` … `<![endif]-->`
   - Everything except Outlook: `<!--[if !mso]><!-->` … `<!--<![endif]-->`
   - Every `<!--[if` has exactly one closer.
4. **Rule: images** have `alt`, `display: block`, and a `width` attribute (Outlook ignores CSS width). Exception:
   images inside an interactive part, which Outlook never shows.
5. **Rule: every `<a>` has an `href`** (lesson: the footer logo had none and wasn't clickable).
6. **Rule: dark mode** through the `darkmode_*`, `light-img` / `dark-img` classes from the head; links on colored
   bands get their own class with `!important` (the head turns all links white in dark mode).
7. **Rule: mobile** through the head classes (`col-sm-12`, `pml16 pmr16`, `pmt0 pmr24 pmb24 pml24`).

## 4. Interactive email

1. **Rule: fallback first.** Order in the HTML: toggle inputs → **fallback** → interactive part.
   - *Why:* Gmail shows the fallback and clips at ~102 KB. With the fallback high in the code it is always complete,
     even if the interactive part gets clipped.
   - Inputs and the interactive part sit in `<!--[if !mso]><!-->` … `<!--<![endif]-->`; the fallback sits
     **outside** that conditional, so Outlook shows it.
2. **Rule: inputs are siblings before both divs** (`display: none !important; mso-hide: all`), so
   `.radio:checked ~ .interactive` and `~ .fallback` both work.
3. **Check: `~` versus `+`.** `~` doesn't care about order; `+` does. With `+`, write the chain in the HTML order:
   `input:checked + div.fallback + div.interactive` (lesson: the image carousel had to be flipped when the fallback moved up).
4. **Rule: switch on only in WebKit**: `@media screen and (-webkit-min-device-pixel-ratio: 0)` (Apple Mail
   iOS/iPadOS/macOS). Everything else sees the fallback.
5. **Rule: force the fallback back** in clients that half-support it, **at least as specific as the activation
   selector** (`.name-detect:checked ~ .name-interactive` is (0,3,0); a single-class override with `!important`
   loses to it), so every override also exists as a chained variant:
   - Outlook.com / new Outlook: `[class~="x_name-interactive"]` and `[class~="x_name-detect"]:checked ~ [class~="x_name-interactive"]`
     → hide; the same for `x_name-fallback` → show. Keep the interactive and fallback divs to one class each.
   - Samsung Mail: `#MessageViewBody .name-interactive` (the id outranks the activation selector).
   - Outlook apps: `.name-interactive\0` and `.name-detect:checked ~ .name-interactive\0` in a **separate**
     `<style>` (the `\0` hack breaks the rest of a style tag).
6. **Rule: CSS can't remember where you came from.** If something depends on the previous state (direction,
   previous/next), use a radio per direction and a panel per state, with the highlight fixed in the HTML.
7. **Rule: selectors use classes, not ids** (Gmail drops rules with id selectors); ids exist only for `label for=`.
   **Unique ids and radio names per block** and scoped generic selectors (e.g. everything under
   `.car1-wrap`), so two interactive blocks in one mail don't break each other. **Check** duplicate ids after assembling.
8. **Rule: repeated styles as classes, not inline per panel.** Inside the interactive part, write repeated
   styles as `.name-interactive .name-sN` (two classes):
   - *Why two classes:* `.name-interactive .name-sN` is (0,2,0). It beats the block's single-class rules and loses
     to `!important` overrides (mobile, dark mode, state rules), which is the precedence the inline style had in
     practice. It is **not** equal to inline: a non-`!important` rule of (0,2,0) or higher on the same element now
     wins where the inline style used to. Check for such rules before moving inline styles to classes.
   - The fallback keeps its inline styles (Gmail and Outlook need them).
9. **Rule: content per screen is the same** in the interactive part and the fallback, including the CTAs.

## 5. Size (Gmail clipping)

1. **Check: total size under ~102 KB**, and the fallback plus the footer/unsubscribe link before that point.
   - *Why:* Gmail hides everything after ~102 KB behind "[Message clipped]", including the unsubscribe link.
2. **Rule: keep margin.** An ESP adds bytes (tracking URLs, its own code): **≤ 90 KB preferred, 95 KB hard limit**
   in this repo. Measure the byte offset of the fallback and the unsubscribe link too, not only the total.
3. **Ways to slim down, in order of preference:** repeated styles → classes; identical comments once; less
   indentation in repeated panels; fewer panels (e.g. one per floor with the highlight in CSS) — the last one
   changes the design, so decide it together.

## 6. Layout and mobile (interactive blocks)

1. **Rule: `table-layout: fixed`** on tables with percentage columns, so long words don't stretch columns.
2. **Rule: `word-wrap` / `overflow-wrap: break-word`** on headings and text.
3. **Rule: scale fonts in two steps** with classes and media queries (`max-width: 600px` and `400px`), not with `vw`.
4. **Rule: fixed heights** with `valign` in table rows instead of margins. Inner height = outer height − 2× padding −
   border (`box-sizing: border-box`), in the mobile override too.

## 7. Working method

1. **Rule: test mails never change the HTML.** Only placeholder text is replaced; mistakes found while testing are
   **reported, not fixed**, unless asked.
2. **Rule: snapshot before bulk changes** and verify afterwards with a script (e.g. markup identical apart from
   the intended change).
3. **Rule: keep line endings** as the file has them (most files CRLF, some LF).
4. **Lesson (tooling):** in Git Bash, inline `node -e` scripts and heredocs can lose backslashes, and `sed -i` can
   turn CRLF into LF. Put scripts in a file and edit with exact replacements.
5. **Rule: don't commit** without being asked.

## 8. Testing

1. Live Server: `whole_code/2026_plain_email_all_blocks.html` at desktop width, ≤ 480px, dark mode, interaction.
2. Test sends: iPhone/iPad/macOS Apple Mail (light/dark), Gmail web/iOS/Android, Outlook Windows/new/.com/apps,
   Samsung Mail.
3. Report the file size and what has **not** been tested.
