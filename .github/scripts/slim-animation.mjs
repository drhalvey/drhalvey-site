// Slim a Claude Design "journey" animation export for phones.
// 1. Pre-compiles the .jsx modules to plain JS, so the ~3 MB in-browser Babel compiler is not shipped.
// 2. De-duplicates identical embedded font files.
// Page text, scenes and motion are untouched. Safe to re-run on a fresh export.
// Setup once: npm install esbuild
// Usage: node .github/scripts/slim-animation.mjs animations/knee-replacement-journey.html [more files]
import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import { transformSync } from 'esbuild';

const BABEL = 'https://unpkg.com/@babel/standalone';
const grab = (s, type) => {
  const re = new RegExp(`(<script type="__bundler/${type}">)([\\s\\S]*?)(</script>)`);
  const m = s.match(re);
  if (!m) throw new Error('missing ' + type);
  return { m, json: JSON.parse(m[2]) };
};
const put = (s, m, value) => s.replace(m[0], () => m[1] + JSON.stringify(value).replace(/<\//g, '<\\u002F') + m[3]);

for (const file of process.argv.slice(2)) {
  let s = fs.readFileSync(file, 'utf8');
  const before = s.length;
  const man = grab(s, 'manifest');
  const ext = grab(s, 'ext_resources');
  const tpl = grab(s, 'template');
  const manifest = man.json;
  let template = tpl.json;
  const decode = (e) => { const b = Buffer.from(e.data, 'base64'); return e.compressed ? zlib.gunzipSync(b) : b; };

  // 1. Compile jsx imports referenced as <uuid>#/name.jsx
  let compiled = 0;
  template = template.replace(/([0-9a-f-]{36})#\/([\w.-]+)\.(jsx|tsx)/g, (all, uuid, name, kind) => {
    const e = manifest[uuid];
    const src = decode(e).toString('utf8');
    const out = transformSync(src, { loader: kind === 'tsx' ? 'tsx' : 'jsx', jsx: 'transform', jsxFactory: 'React.createElement', jsxFragment: 'React.Fragment', target: 'es2019', minify: true, legalComments: 'none' }).code;
    manifest[uuid] = { mime: 'text/javascript', compressed: true, data: zlib.gzipSync(out, { level: 9 }).toString('base64') };
    compiled++;
    return `${uuid}#/${name}.js`;
  });
  if (/#\/[\w.-]+\.(jsx|tsx)/.test(template)) throw new Error(file + ': jsx import left over');

  // 2. Drop Babel if nothing needs it
  const babel = ext.json.filter((r) => r.id.startsWith(BABEL));
  for (const r of babel) delete manifest[r.uuid];
  const extOut = ext.json.filter((r) => !r.id.startsWith(BABEL));

  // 3. De-duplicate identical fonts
  const seen = new Map();
  let fontsDropped = 0;
  for (const [uuid, e] of Object.entries(manifest)) {
    if (!e.mime.startsWith('font/')) continue;
    const h = crypto.createHash('sha256').update(e.data).digest('hex');
    if (seen.has(h)) { template = template.split(uuid).join(seen.get(h)); delete manifest[uuid]; fontsDropped++; }
    else seen.set(h, uuid);
  }

  s = put(s, man.m, manifest);
  s = put(s, ext.m, extOut);
  s = put(s, tpl.m, template);
  fs.writeFileSync(file, s);
  console.log(`${file}: ${(before / 1e6).toFixed(2)} MB -> ${(s.length / 1e6).toFixed(2)} MB (jsx compiled: ${compiled}, babel removed: ${babel.length}, duplicate fonts removed: ${fontsDropped})`);
}
