#!/usr/bin/env python3
"""Cross-card consistency report for the atlas. Mechanical checks only; the clinical audit is a separate read.

  python3 ortho/audit.py            prints the report
"""
import re, sys
from collections import defaultdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import build  # noqa: E402

cards = []
for p in sorted((build.SRC / 'cards').glob('*.md')):
    c = build.parse_card(p)
    if c:
        cards.append(c)
chapters = [build.parse_chapter(p) for p in sorted((build.SRC / 'chapters').glob('*.md'))]
if build.problems:
    print('BUILD PROBLEMS FIRST:')
    print('\n'.join(build.problems))
    print()

findings = []

# 1. pain score versus trajectory shape
LIMITS = {1: (3, 2), 2: (5, 3), 3: (6, 4), 4: (8, 6), 5: (9, 9)}  # (max any day, max day 7)
for c in cards:
    fm = c['fm']
    s, tr = fm['pain']['score'], fm['pain']['trajectory']
    mx, d7 = LIMITS[s]
    if max(tr) > mx:
        findings.append(f'{fm["id"]}: score {s} but trajectory peaks at {max(tr)} (expected at most {mx})')
    if s <= 3 and tr[4] >= 4:
        findings.append(f'{fm["id"]}: score {s} but day 7 pain is {tr[4]}; a bone-type score should have fallen by day 7')
    if s == 5 and tr[3] < 3:
        findings.append(f'{fm["id"]}: score 5 (severe and prolonged) but day 3 pain is only {tr[3]}')
    if s >= 4 and max(tr) < 5:
        findings.append(f'{fm["id"]}: score {s} but the trajectory never reaches 5')
    if fm['pain']['mechanism'] in ('tendon-tension', 'retension') and fm['block']['catheter'] == 'no':
        findings.append(f'{fm["id"]}: mechanism {fm["pain"]["mechanism"]} but catheter "no"; the model says the catheter has a claim here')
    if fm['pain']['mechanism'] == 'surface' and fm['block']['catheter'] in ('routine', 'selective'):
        findings.append(f'{fm["id"]}: mechanism surface but catheter {fm["block"]["catheter"]}')
    if s == 1 and fm['block']['catheter'] != 'no':
        findings.append(f'{fm["id"]}: score 1 but catheter {fm["block"]["catheter"]}')

# 2. same source cited with different URLs or titles across cards
by_key = defaultdict(set)
for c in cards + chapters:
    for s in (c['fm'].get('sources') or []):
        t = s.get('title', '')
        m = re.match(r'\s*([A-Z][\w\'-]+)\b.*?\b((?:19|20)\d\d)\b', t)
        key = (m.group(1).lower(), m.group(2)) if m else (t[:30].lower(), '')
        by_key[key].add((s.get('url', ''), c['fm']['id']))
for key, uses in sorted(by_key.items()):
    urls = {u for u, _ in uses}
    if len(urls) > 1:
        findings.append(f'source {key[0]} {key[1]} cited with {len(urls)} different URLs: ' + '; '.join(f'{u} ({i})' for u, i in sorted(uses)))

# 3. dead cross-links between cards and chapters
ids = {c['fm']['id'] for c in cards} | {ch['fm']['id'] for ch in chapters}
manifest_ids = {c['id'] for c in build.MANIFEST['cards']} | {c['id'] for c in build.MANIFEST['chapters_a']} | {c['id'] for c in build.MANIFEST['chapters_b']}
for c in cards + chapters:
    for m in re.finditer(r'\]\((?:\.\./[abc]/)?([a-z0-9-]+)\.html\)', c['body']):
        target = m.group(1)
        if target not in manifest_ids:
            findings.append(f'{c["fm"]["id"]}: links to unknown id "{target}"')
        elif target not in ids:
            findings.append(f'{c["fm"]["id"]}: links to "{target}", which is in the manifest but not yet written')

# 4. American spellings and banned words
BANNED = [(r'\banesthe', 'anesthe (US spelling)'), (r'\bcenter\b', 'center'), (r'\bhemorrhag', 'hemorrhag'), (r'\bedema\b', 'edema'), (r'\bpediatric', 'pediatric'),
          (r'\bliter\b', 'liter'), (r'\bfiber', 'fiber'), (r'\bcatheteriz', 'catheteriz'), (r'\boptimiz', 'optimiz'), (r'\bminimiz', 'minimiz'), (r'\bgenuinely\b', 'genuinely'),
          (r'\bhonestly\b', 'honestly'), (r'\bstraightforward\b', 'straightforward'), (r'\bIt is important to note', 'padding phrase'), (r'\bTODO\b', 'TODO')]
for c in cards + chapters:
    text = c['body'] + ' ' + str(c['fm'])
    for rx, label in BANNED:
        hits = [m.start() for m in re.finditer(rx, text, re.I)]
        # allow US spelling inside quoted source titles
        hits = [h for h in hits if not re.search(r'title', text[max(0, h - 200):h])]
        if hits:
            findings.append(f'{c["fm"]["id"]}: {label} x{len(hits)}')

# 5. summary table
print(f'{len(cards)} cards, {len(chapters)} chapters\n')
print(f'{"n":>3} {"id":40} {"pain":>4} {"mech":16} {"cath":9} {"fam":22} {"words":>6} {"steps":>5}')
order = {c['id']: c['number'] for c in build.MANIFEST['cards']}
for c in sorted(cards, key=lambda c: order.get(c['fm']['id'], 999)):
    fm = c['fm']
    print(f'{order.get(fm["id"], 0):>3} {fm["id"]:40} {fm["pain"]["score"]:>4} {fm["pain"]["mechanism"]:16} {fm["block"]["catheter"]:9} {fm["block"]["family"]:22} {c["words"]:>6} {len(c["steps"]):>5}')
print()
for ch in chapters:
    print(f'    {ch["fm"]["id"]:40} {ch["words"]:>6} words')
print()
if findings:
    print(f'{len(findings)} finding(s):')
    print('\n'.join(' - ' + f for f in findings))
else:
    print('no findings')
