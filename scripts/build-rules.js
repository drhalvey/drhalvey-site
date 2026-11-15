#!/usr/bin/env node
/* Builds assets/periop-rules.json from the RULES, MEDS, doacDays, INS and INS_TIMED blocks in
   medicine-timing.html. medicine-timing.html stays the single master copy: edit the rules there,
   then run `node scripts/build-rules.js`. SIOP and the site's mini planner read the JSON.
   Run with --check to fail (exit 1) when the JSON is out of date. */
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const root = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'medicine-timing.html'), 'utf8');
function slice(start, end) {
  const i = src.indexOf(start); if (i < 0) throw new Error('not found: ' + start);
  const j = src.indexOf(end, i); if (j < 0) throw new Error('no end for: ' + start);
  return src.slice(i, j + end.length);
}
const code = [
  slice('var RULES={', '\n};'),
  slice('function doacDays(', '\n}'),
  slice('var INS={', '\n};'),
  slice('var INS_TIMED={', '\n};'),
  'var INS_T1_NOTE=' + /var INS_T1_NOTE=("(?:[^"\\]|\\.)*");/.exec(src)[1] + ';',
  slice('function M(g,b,r,sub)', ';}'),
  slice('var MEDS=[', '\n];'),
  'module.exports={RULES,MEDS,doacDays,INS,INS_TIMED,INS_T1_NOTE};'
].join('\n');
const m = { exports: {} };
new Function('module', code)(m);
const { RULES, MEDS, doacDays, INS, INS_TIMED, INS_T1_NOTE } = m.exports;
const plain = s => (s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const rules = {};
for (const [k, r] of Object.entries(RULES)) {
  rules[k] = { kind: r.cls || 'continue', text: plain(r.instr), html: r.instr || '',
               lastDoseDaysBefore: r.dateDays ?? null, dateLabel: r.dateLabel ?? null };
}
const body = {
  rules,
  medicines: MEDS.map(x => ({ generic: x.g, brands: x.b, rule: x.r, ...(x.sub ? { sub: x.sub } : {}) })),
  doac: { lastDoseDaysBefore: { dabigatran: { normalKidneys: doacDays('DAB', 'no'), reducedKidneys: doacDays('DAB', 'yes') },
                                apixabanRivaroxabanEdoxaban: { normalKidneys: doacDays('AR', 'no'), reducedKidneys: doacDays('AR', 'yes') } } },
  insulin: { byType: INS, basalOrIntermediateByTiming: INS_TIMED, type1Note: plain(INS_T1_NOTE) },
  fasting: { foodHoursBeforeArrival: 6, clearFluidHoursBeforeArrival: 2 }
};
const hash = crypto.createHash('sha256').update(JSON.stringify(body)).digest('hex').slice(0, 12);
const out = { about: 'General peri-operative medicine and fasting rules from drhalvey.com.au/medicine-timing.html. A general guide; the hospital\'s times come first. Built by scripts/build-rules.js; do not edit by hand.',
              version: hash, source: 'medicine-timing.html', ...body };
const file = path.join(root, 'assets', 'periop-rules.json');
const json = JSON.stringify(out, null, 1) + '\n';
if (process.argv.includes('--check')) {
  const cur = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  if (cur !== json) { console.error('assets/periop-rules.json is out of date: run node scripts/build-rules.js'); process.exit(1); }
  console.log('periop-rules.json up to date (' + hash + ')'); process.exit(0);
}
fs.writeFileSync(file, json);
console.log('wrote assets/periop-rules.json: ' + Object.keys(rules).length + ' rules, ' + MEDS.length + ' medicines, version ' + hash);
