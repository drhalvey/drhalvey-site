#!/usr/bin/env python3
"""Make redirect pages for old addresses from the previous site (10/10/2026).

GitHub Pages cannot send server redirects. A folder with an index.html that refreshes at once
(plus a canonical link) is what search engines treat as a permanent move, and it serves both
/old-address and /old-address/.

Targets come from the ALIASES block in assets/not-found.js, so the 404 page and these files agree.
Only the addresses in STUBS get a folder: the ones Google Analytics showed patients landing on.
The rest of the aliases are handled by the 404 page alone.

Run from the repo root:  python3 .github/scripts/make-redirects.py
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
STUBS = [
    'procedures-1',
    'information-for-patients',
    'anaesthesia-for-infusaport-insertion',
    'acl-reconstructive-surgery',
    'pain-medications-after-caesarean-section',
    'caesarean-birth',
    'home',
]

src = (ROOT / 'assets/not-found.js').read_text()
m = re.search(r'/\* ALIASES-START \*/\s*var ALIASES\s*=\s*(\{.*?\});\s*/\* ALIASES-END \*/', src, re.S)
if not m:
    sys.exit('ALIASES block not found in assets/not-found.js')
aliases = json.loads(m.group(1))

TEMPLATE = """<!DOCTYPE html>
<html lang="en-AU">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Moved - Dr Ed Halvey</title>
<link rel="canonical" href="https://drhalvey.com.au/{target}">
<meta http-equiv="refresh" content="0; url=/{target}">
<script>location.replace('/{target}'+({has_hash}?'':location.hash));</script>
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
</head>
<body style="font-family:system-ui,sans-serif;background:#fbf6ef;color:#241a18;padding:24px;font-size:17px">
<p>This page has moved. <a href="/{target}" style="color:#4e1d24">Go to the new page</a>.</p>
</body>
</html>
"""

made = []
for slug in STUBS:
    target = aliases.get(slug)
    if not target:
        sys.exit(f'{slug} has no target in ALIASES')
    page = target.split('#')[0]
    if not (ROOT / page).exists():
        sys.exit(f'{slug} points at a page that does not exist: {page}')
    if (ROOT / f'{slug}.html').exists():
        sys.exit(f'{slug}.html already exists; a folder of the same name would clash')
    out = ROOT / slug / 'index.html'
    out.parent.mkdir(exist_ok=True)
    out.write_text(TEMPLATE.format(target=target, has_hash='true' if '#' in target else 'false'))
    made.append(f'/{slug} -> /{target}')
print('\n'.join(made))
