# Email rules

Rules for building email in this repo, with extra attention for interactive email. This is a living document: add a
rule when we learn something, and write down **why**, so the rule can be judged later.

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
5. **Rule: keep copies in sync.** When a block also lives inside a campaign mail (`interactive_artifact/`,
   `eoy_concepts/`), change both. Concepts from Claude Design artifacts follow the extra rules in
   [interactive_artifact/README.md](../interactive_artifact/README.md).
6. **Rule: only token values** (README token table) for colors, fonts, sizes and paddings. Client styling that is
   deliberately hardcoded (e.g. the Funda and WestCord car blocks) says so in a comment at the top of the block.

## 2. Content and placeholders

1. **Rule: placeholder text = the slot name**: `title_1`, `txt_1`, `btn_txt_1`, `alt="img_alt_1"`, `badge_1`,
   `preheader`. Always with the `_N` suffix (lesson: a bare `badge` was missed by tooling).
2. **Rule: render every element the block name promises** (all `_1.._n` slots).
3. **Rule: links** point to `https://100procent.nl/` until there is a real destination. `mailto:` and `tel:` stay
   as they are. Links an ESP fills in later get a comment: `<!-- view online link -->`, `<!-- unsubscribe link -->`.
4. **Rule: never invent data.** Personal values ([X], [Hotelnaam]) stay placeholders. Default to the version
   **without** recipient data, so a mail never shows `[X]`, `0` or an empty heading; describe the with-data
   variant in a comment.
5. **Rule: logos in concepts are a text version** until the designer delivers the real logo. Never redraw a logo.
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
5. **Rule: force the fallback back** in clients that half-support it:
   - Outlook.com / Office 365: `[class="x_name-interactive"]` → hide, `[class="x_name-fallback"]` → show.
     That is why the interactive and fallback divs have **exactly one class**.
   - Samsung Mail: `meta* .name-interactive`.
   - Outlook apps: `.name-interactive\0` in a **separate** `<style>` (the `\0` hack breaks the rest of a style tag).
6. **Rule: CSS can't remember where you came from.** If something depends on the previous state (direction,
   previous/next), use a radio per direction and a panel per state, with the highlight fixed in the HTML.
7. **Rule: unique ids and radio names per block** and scoped generic selectors (e.g. everything under
   `.car1-wrap`), so two interactive blocks in one mail don't break each other. **Check** duplicate ids after assembling.
8. **Rule: repeated styles as classes, not inline per panel.** Inside the interactive part, write repeated
   styles as `.name-interactive .name-sN` (two classes):
   - *Why two classes:* that has the same priority as inline: it beats single-class rules and loses to
     `!important` (mobile overrides, dark mode), exactly as the inline style did.
   - The fallback keeps its inline styles (Gmail and Outlook need them).
9. **Rule: content per screen is the same** in the interactive part and the fallback, including the CTAs.

## 5. Size (Gmail clipping)

1. **Check: total size under ~102 KB**, and the fallback plus the footer/unsubscribe link before that point.
   - *Why:* Gmail hides everything after ~102 KB behind "[Message clipped]", including the unsubscribe link.
2. **Rule: keep margin.** An ESP adds bytes (tracking URLs, its own code); aim for ≤ ~95 KB in this repo.
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
