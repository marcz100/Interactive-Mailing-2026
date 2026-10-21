// Unpacks a downloaded Claude Design artifact (the single .html file "Download" gives you) into readable files, so the
// boards can be read like the files the Artifact tool returns. The download is a bundle: a loader script plus
// <script type="__bundler/..."> tags holding a manifest of gzipped, base64 resources and a page template. Every
// board is itself a nested bundle; this script unpacks those too.
//   node unbundle_artifact.js "<download>.html" <out dir>
// Output per level: _template.html (the page; for a board this is the board markup with its DCLogic script),
// pageN_<uuid>.html (the boards, in canvas order) and res_<uuid>.<ext> (scripts, fonts). Boards get their own folder
// pageN/ with the unpacked board. Open a pageN_<uuid>.html in Chrome to see the board rendered (it unpacks itself).
const fs = require('fs'), zlib = require('zlib'), path = require('path');

function unbundle(src, out, depth = 0) {
  const s = fs.readFileSync(src, 'utf8');
  const get = t => { const a = s.indexOf(`<script type="__bundler/${t}">`); if (a < 0) return null; return s.slice(s.indexOf('>', a) + 1, s.indexOf('</script>', a)); };
  const man = get('manifest'), tpl = get('template');
  if (!man || !tpl) return false;
  fs.mkdirSync(out, { recursive: true });
  const order = JSON.parse(get('page_order') || '[]');
  fs.writeFileSync(path.join(out, '_template.html'), JSON.parse(tpl));
  const title = (JSON.parse(tpl).match(/<title>([^<]*)/) || [])[1] || '';
  console.log(`${'  '.repeat(depth)}${path.basename(src)}: ${title}`);
  for (const [id, e] of Object.entries(JSON.parse(man))) {
    let buf = Buffer.from(e.data, 'base64');
    if (e.compressed) buf = zlib.gunzipSync(buf);
    const ext = ((e.mime || '').split('/')[1] || 'bin').replace(/[^a-z0-9]/gi, '');
    const page = order.indexOf(id);
    const file = path.join(out, (page >= 0 ? `page${page}_` : 'res_') + id + '.' + ext);
    fs.writeFileSync(file, buf);
    if (page >= 0) unbundle(file, path.join(out, `page${page}`), depth + 1);
  }
  return true;
}

const [src, out] = process.argv.slice(2);
if (!src || !out) { console.error('usage: node unbundle_artifact.js "<download>.html" <out dir>'); process.exit(1); }
if (!unbundle(path.resolve(src), path.resolve(out))) { console.error('not a Claude Design bundle'); process.exit(1); }
