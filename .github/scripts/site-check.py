#!/usr/bin/env python3
"""drhalvey.com.au safety and copy check.

Runs on every push (see .github/workflows/site-check.yml). It never blocks the site going live:
GitHub Pages publishes regardless. A failure shows a red cross on the commit and GitHub emails Ed.

Checks
  1. robots.txt still allows the site and still blocks /tools/
  2. the pain relief tool keeps its noindex tag and code gate
  3. every internal link and image points at a file that exists
  4. copy rules on patient-visible text: no em dashes, tools never described as exact,
     no specific clinical timeframes promised, no superlatives or testimonials
Run locally: python3 .github/scripts/site-check.py
"""
import html, json, os, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
errors, warnings = [], []

def err(path, msg, line=None):
    errors.append((str(path), line, msg))

def warn(path, msg, line=None):
    warnings.append((str(path), line, msg))

# Pages that are not patient copy (internal reference, app legal pages, generated players)
COPY_SKIP_DIRS = {'.github', 'node_modules'}

# ---------- 1. robots.txt ----------
robots = (ROOT / 'robots.txt').read_text() if (ROOT / 'robots.txt').exists() else ''
lines = [l.strip() for l in robots.splitlines() if l.strip() and not l.strip().startswith('#')]
if 'Disallow: /tools/' not in lines:
    err('robots.txt', 'must contain "Disallow: /tools/" so the pain relief tool is never indexed')
if 'Disallow: /' in lines:
    err('robots.txt', 'contains "Disallow: /" which removes the whole site from Google (staging version uploaded by mistake?)')
if not any(l.lower().startswith('sitemap:') for l in lines):
    warn('robots.txt', 'sitemap line missing')

# ---------- 2. pain relief tool ----------
tool = ROOT / 'tools' / 'pain-relief.html'
if tool.exists():
    t = tool.read_text()
    if not re.search(r'<meta[^>]+name=["\']robots["\'][^>]+noindex', t, re.I):
        err('tools/pain-relief.html', 'noindex meta tag is missing')
    if 'ACL-PAEDS-TRAM' not in t:
        warn('tools/pain-relief.html', 'known plan code ACL-PAEDS-TRAM not found; is this an old export?')
else:
    err('tools/pain-relief.html', 'file missing')

# ---------- helpers ----------
def html_files():
    for p in sorted(ROOT.rglob('*.html')):
        if any(part in COPY_SKIP_DIRS for part in p.relative_to(ROOT).parts):
            continue
        yield p

def visible_text(src, path):
    """Text a patient can read. Animation players keep their words in window.OM_JOURNEY."""
    if '__bundler/manifest' in src:
        m = re.search(r'<script type="__bundler/template">(.*?)</script>', src, re.S)
        tpl = json.loads(m.group(1)) if m else ''
        parts = []
        for name in ('OM_JOURNEY', 'OM_SCENES'):
            mm = re.search(r"window\.%s = '(.*?)';</script>" % name, tpl, re.S)
            if mm:
                parts.append(mm.group(1))
        return '\n'.join(parts)
    s = re.sub(r'<(script|style|noscript)\b.*?</\1>', ' ', src, flags=re.S | re.I)
    s = re.sub(r'<!--.*?-->', ' ', s, flags=re.S)
    s = re.sub(r'<[^>]+>', ' ', s)
    return html.unescape(s)

def line_of(src, needle):
    i = src.find(needle)
    return src.count('\n', 0, i) + 1 if i >= 0 else None

# ---------- 3. internal links ----------
for p in html_files():
    src = p.read_text(errors='replace')
    if '__bundler/manifest' in src:
        continue
    rel = p.relative_to(ROOT)
    for m in re.finditer(r'\b(?:href|src)=["\']([^"\']+)["\']', src):
        url = m.group(1).strip()
        if re.match(r'^(https?:|mailto:|tel:|sms:|data:|javascript:|#|//|\$\{|\{)', url) or not url:
            continue
        target = url.split('#')[0].split('?')[0]
        if not target:
            continue
        dest = (ROOT / target.lstrip('/')) if target.startswith('/') else (p.parent / target)
        if target.endswith('/'):
            dest = dest / 'index.html'
        if not dest.exists():
            err(rel, f'broken link: {url}', src.count('\n', 0, m.start()) + 1)
    # images below the first screen should lazy-load (warning only)

# ---------- 4. copy rules ----------
EXACT_OK = [
    r'follow (the|those) exact', r'exact (fasting )?times your hospital', r'your hospital will give you exact',
    r'exact arrival', r"hospital's exact", r'exactly as prescribed', r'exact combination', r'exact thresholds',
    r'exact timing instructions given',
]
NUM = r'(\d+|one|two|three|four|five|six|seven|eight|nine|ten|fifteen|twenty|thirty|sixty)'
TIMEFRAME = re.compile(r'\b(?:(?:within|in about|about|around|by about|after about|usually)\s+' + NUM + r'|' + NUM + r'\s+to\s+' + NUM + r')\s+(minutes?|hours?|days?|weeks?)\b(?!\s+(before|of your|after your last|prior))', re.I)
SUPERLATIVE = re.compile(r"\b(the best (anaesthetist|care|outcomes?|results?)|leading (anaesthetist|specialist|expert)|world[- ]class|finest|top[- ]rated|most experienced|highly experienced|renowned|unrivalled|pain[- ]free|guarantee[sd]?)\b", re.I)
TESTIMONIAL = re.compile(r'\b(testimonials?|patient stories|what our patients say|five[- ]star|5[- ]star)\b', re.I)
PAIN_TEAM_DAILY = re.compile(r'pain (team|service)[^.]{0,60}\b(every day|daily|each day)\b', re.I)

INTERNAL = ('clinicians.html', 'tools/pain-relief.html')  # clinician reference and approved plans, not general copy  # clinician reference, not patient copy

for p in html_files():
    rel = p.relative_to(ROOT)
    src = p.read_text(errors='replace')
    text = visible_text(src, rel)
    if not text.strip():
        continue
    for m in re.finditer('—', text):
        ctx = text[max(0, m.start() - 40):m.end() + 40].replace('\n', ' ')
        err(rel, f'em dash in visible text: "...{ctx.strip()}..."')
    if str(rel) in INTERNAL:
        continue
    for m in re.finditer(r'\bexact(ly)?\b', text, re.I):
        ctx = text[max(0, m.start() - 60):m.end() + 60].replace('\n', ' ')
        if not any(re.search(ok, ctx, re.I) for ok in EXACT_OK):
            err(rel, f'"exact" used about the site or a tool (describe tools as a general guide): "...{" ".join(ctx.split())}..."')
    for rx, label, fn in ((TIMEFRAME, 'specific clinical timeframe', warn), (SUPERLATIVE, 'superlative or outcome claim (AHPRA)', warn),
                          (TESTIMONIAL, 'testimonial wording (AHPRA)', err), (PAIN_TEAM_DAILY, 'says the pain team reviews everyone daily', err)):
        for m in rx.finditer(text):
            ctx = text[max(0, m.start() - 60):m.end() + 60]
            fn(rel, f'{label}: "...{" ".join(ctx.split())}..."')

# ---------- sitemap ----------
sm = ROOT / 'sitemap.xml'
if sm.exists():
    for loc in re.findall(r'<loc>https://drhalvey\.com\.au/?([^<]*)</loc>', sm.read_text()):
        f = ROOT / (loc or 'index.html')
        if loc.endswith('/'):
            f = ROOT / loc / 'index.html'
        if not f.exists():
            err('sitemap.xml', f'lists a page that does not exist: /{loc}')

# ---------- report ----------
gh = os.environ.get('GITHUB_ACTIONS') == 'true'
for kind, items in (('error', errors), ('warning', warnings)):
    for path, line, msg in items:
        if gh:
            loc = f' file={path}' + (f',line={line}' if line else '')
            print(f'::{kind}{loc}::{msg}')
        else:
            print(f'{kind.upper():7} {path}{":" + str(line) if line else ""}  {msg}')
print(f'\n{len(errors)} problem(s), {len(warnings)} warning(s)')
sys.exit(1 if errors else 0)
