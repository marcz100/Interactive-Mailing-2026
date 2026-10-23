// The Coram mail shell, shared by every Coram concept mail: the template head with Coram values (shell_head.html:
// Jost, Coram dark-mode colours), the CORAM header bar and the footer, both one-on-one from the artifact boards
// (RolMail, WaterpasMail, LeidingMail), plus the helpers every build_mail.js uses.
const fs = require('fs'), path = require('path');

const F = 'Jost,Helvetica Neue,Arial,Helvetica,sans-serif';
// Coram values from the artifact "Coram eindejaarsmail: bedankt voor het vakwerk"
const C = {
  ink: '#1A1A1A', black: '#1C1C1C', blue: '#2525B0', sand: '#D9D4CD', grey: '#3D3935', light: '#F4F2EF',
  white: '#FFFFFF', wall: '#D9D4CD', wallDark: '#776E65', wallLight: '#E4E0DA', pink: '#E3B5AE', page: '#F4F2EF',
};
const WIDTH = 700;   // the artifact canvas width

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const SLOT = /\b(?:[a-z]+_)*(?:title|subtitle|txt|alt|label|badge)_\d+\b/g;
// fills slot names with copy (not inside comments); a new line in the copy becomes <br>
const fill = (html, COPY) => html.split(/(<!--(?![\[<>])[\s\S]*?-->)/).map((part, i) => i % 2 ? part : part.replace(SLOT, t => {
  if (!(t in COPY)) throw new Error('no copy for slot ' + t);
  return esc(COPY[t]).replace(/\n/g, '<br>');
})).join('');
const ind = (s, n) => s.split('\n').map(l => l ? ' '.repeat(n) + l : l).join('\n');
// formatting only: 1 space per nesting level instead of 3 for a block inside a mail (email_rules 5)
const compact = s => s.split('\n').map(l => { const n = l.match(/^ */)[0].length; return ' '.repeat(Math.round(n / 3)) + l.slice(n); }).join('\n');

// the CORAM wordmark is a text placeholder (email_rules 2.5); 0.38em tracking, centred with the same padding-left
const header = `<!-- header_coram: the CORAM wordmark as text, as in the artifact -->
<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="${C.ink}">
   <tr>
      <td align="center" valign="middle" height="80" style="height: 80px; padding: 0 20px;">
         <a href="https://100procent.nl/" target="_blank" class="cor-a-white" style="display: inline-block; padding-left: 0.38em; font-family: ${F}; font-size: 24px; line-height: 35px; font-weight: 600; letter-spacing: 0.38em; color: ${C.white}; text-decoration: none;">CORAM</a>
      </td>
   </tr>
</table>
<!-- end header_coram -->`;

const footer = `<!-- footer_coram -->
<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="${C.ink}">
   <tr>
      <td align="center" class="pml16 pmr16" style="padding: 48px 70px; word-wrap: break-word; overflow-wrap: break-word;">
         <p style="margin: 0; padding-left: 0.38em; font-family: ${F}; font-size: 22px; line-height: 32px; font-weight: 600; letter-spacing: 0.38em; color: ${C.white};">CORAM</p>
         <p style="margin: 18px 0 0 0; font-family: ${F}; font-size: 14px; line-height: 24px; font-weight: 300; color: ${C.sand};">Tiger &middot; Sealskin &middot; Geesa &middot; Impey &middot; Coram Showers &middot; Esbada</p>
         <p style="margin: 18px 0 0 0; font-family: ${F}; font-size: 14px; line-height: 24px; font-weight: 300; color: ${C.sand};">[Adres Coram] &middot; [Telefoon]</p>
         <p style="margin: 18px 0 0 0; font-family: ${F}; font-size: 14px; line-height: 20px; color: ${C.white};">
            <!-- view online link -->
            <a href="https://100procent.nl/" target="_blank" class="cor-a-white" style="color: ${C.white}; text-decoration: underline;">Bekijk online</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <!-- preferences link -->
            <a href="https://100procent.nl/" target="_blank" class="cor-a-white" style="color: ${C.white}; text-decoration: underline;">Voorkeuren</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <!-- unsubscribe link -->
            <a href="https://100procent.nl/" target="_blank" class="cor-a-white" style="color: ${C.white}; text-decoration: underline;">Afmelden</a>
         </p>
      </td>
   </tr>
</table>
<!-- end footer_coram -->`;

// links on the dark bands stay white, also in dark mode (the head turns every link white anyway, this keeps it in
// [data-ogsc] too)
const shellCss = `<!-- coram_mail -->
<style type="text/css">
   .cor-a-white {
      color: ${C.white} !important;
   }
</style>
<!-- // coram_mail -->`;

/** Builds a whole Coram mail.
 * note: the comment at the top; title: the subject; preheader; header: with the CORAM bar or not;
 * block: { name, css } from the generator; body: the mail's content between header and footer (already filled);
 * extraCss: the mail's own CSS for its static sections (a <style> wrapped in name markers). */
function page({ note, title, preheader, header: withHeader, block, body, extraCss = '' }) {
  const head = fs.readFileSync(path.join(__dirname, 'shell_head.html'), 'utf8').replace(/\r\n/g, '\n')
    .replace('@@NOTE@@', note).replace('@@TITLE@@', esc(title));
  const css = `${ind(shellCss, 6)}
${extraCss ? ind(extraCss, 6) + '\n' : ''}      <!-- ${block.name} -->
${compact(block.css)}
      <!-- // ${block.name} -->
   </head>
`;
  const bodyHtml = `
   <body id="body" class="darkmode body" width="100%" style="margin: 0; padding: 0 !important;">
      <!--[if !mso & !IE]><!-->
      <div style="display: none; max-height: 0px; overflow: hidden;">${esc(preheader)}</div>
      <div style="display: none; max-height: 0px; overflow: hidden;">
         ${'&#8199;&#65279;&#847;'.repeat(28)}
      </div>
      <!--<![endif]-->

      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" align="center" bgcolor="${C.page}" class="darkmode">
         <tr>
            <td class="darkmode_side_td" style="background-color: ${C.page}"></td>
            <td class="darkmode" bgcolor="${C.white}" style="text-align: center; font-size: 0; width: ${WIDTH}px; max-width: ${WIDTH}px; background-color: ${C.white};" align="center">
${withHeader ? ind(header, 15) + '\n' : ''}${body.replace(/\n$/, '')}
${ind(footer, 15)}
            </td>
            <td class="darkmode_side_td" style="background-color: ${C.page}"></td>
         </tr>
      </table>
   </body>

</html>
`;
  return head + css + bodyHtml;
}

/** Writes the mail with CRLF line endings and reports its size and the byte offsets of the fallback and the
 * unsubscribe link (email_rules 5). */
function write(out, html, fallbackMarker) {
  const s = html.replace(/\n/g, '\r\n');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, s);
  const at = m => { const i = s.indexOf(m); return i < 0 ? 'n/a' : (Buffer.byteLength(s.slice(0, i)) / 1024).toFixed(1); };
  console.log('written', out, Buffer.byteLength(s), 'bytes', (Buffer.byteLength(s) / 1024).toFixed(1), 'KiB',
    '| fallback at', at(fallbackMarker), 'KiB | unsubscribe at', at('<!-- unsubscribe link -->'), 'KiB');
}

module.exports = { F, C, WIDTH, esc, fill, ind, compact, header, footer, page, write };
