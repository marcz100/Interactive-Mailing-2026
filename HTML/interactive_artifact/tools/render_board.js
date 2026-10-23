// Renders a Claude Design board (.dc.html) as static HTML in a given state, so a mail can be compared with the board
// side by side even when the board's runtime (support.js) isn't available. It runs the board's DCLogic class with the
// state you pass, then resolves the template: <sc-if value="{{x}}">, <sc-for list="{{x}}" as="m">, and {{path}}
// values (also inside attributes). Event handlers are dropped. Good enough for the static look of each state; it is not
// the real runtime (no transitions).
//   node render_board.js <board.dc.html> <out.html> ['{"state":"json"}']
const fs = require('fs');
const [src, out, stateJson] = process.argv.slice(2);
if (!src || !out) { console.error('usage: node render_board.js <board.dc.html> <out.html> [state json]'); process.exit(1); }
const s = fs.readFileSync(src, 'utf8');
const helmet = (s.match(/<helmet>([\s\S]*?)<\/helmet>/) || ['', ''])[1];
let body = s.slice(s.indexOf('</helmet>') + 9, s.indexOf('</x-dc>'));
const script = (s.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/) || ['', ''])[1];

// run the board's logic with the given state
class DCLogic { constructor(props) { this.props = props || {}; } setState(o) { this.state = { ...this.state, ...o }; } }
let vals = {};
if (script.trim()) {
  const Component = new Function('DCLogic', script + '\nreturn Component;')(DCLogic);
  const c = new Component({});
  c.state = { ...(c.state || {}), ...(stateJson ? JSON.parse(stateJson) : {}) };
  vals = c.renderVals() || {};
}
const get = (scope, path) => path.trim().split('.').reduce((o, k) => (o == null ? undefined : o[k]), scope);
const val = (scope, path) => { const v = get(scope, path); return typeof v === 'function' || v == null ? '' : String(v); };

const render = (html, scope) => {
  html = html.replace(/\s(?:on[A-Z]\w*|sc-camel-on-\w+)="\{\{[^}]*\}\}"/g, '');
  // sc-for (innermost first)
  for (let guard = 0; guard < 50; guard++) {
    const m = html.match(/<sc-for list="\{\{([^}]+)\}\}" as="(\w+)"[^>]*>((?:(?!<sc-for)[\s\S])*?)<\/sc-for>/);
    if (!m) break;
    const list = get(scope, m[1]) || [];
    html = html.replace(m[0], list.map(item => render(m[3], { ...scope, [m[2]]: item })).join(''));
  }
  // sc-if (innermost first)
  for (let guard = 0; guard < 200; guard++) {
    const m = html.match(/<sc-if value="\{\{([^}]+)\}\}"[^>]*>((?:(?!<sc-if)[\s\S])*?)<\/sc-if>/);
    if (!m) break;
    html = html.replace(m[0], get(scope, m[1]) ? m[2] : '');
  }
  return html.replace(/\{\{([^}]+)\}\}/g, (_, p) => val(scope, p));
};

fs.writeFileSync(out, `<!doctype html><html lang="nl"><head><meta charset="utf-8">${helmet}</head><body>${render(body, vals)}</body></html>`);
console.log('written', out);
