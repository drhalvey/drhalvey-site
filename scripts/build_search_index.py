#!/usr/bin/env python3
# Run from the repo root after any page change: python3 scripts/build_search_index.py .
"""Rebuild assets/search-index.js from the live pages.
Adds static ids to h2/h3 that lack them (markup only, no wording change),
keeps the old hand-written synonym keywords, and adds a real quoted snippet (d)
plus a short body-text field (b) for each entry."""
import json, re, os, sys
from bs4 import BeautifulSoup, NavigableString, Tag

ROOT = sys.argv[1] if len(sys.argv) > 1 else '.'
os.chdir(ROOT)
SKIP = {'404.html', 'clinicians.html', 'index.html'}
old_s = open('assets/search-index.js').read()
OLD = json.loads(old_s[old_s.index('['):old_s.rindex(']') + 1])

def norm(t):
    return re.sub(r'[^a-z0-9 ]', '', re.sub(r'\s+', ' ', (t or '').lower())).strip()

old_k = {}
for e in OLD:
    old_k[(e['p'], norm(e['t']))] = e.get('k', '')
    if '#' in e['u']:
        old_k[(e['p'], e['u'].split('#')[1])] = e.get('k', '')

def slug(t):
    s = re.sub(r'[^a-z0-9]+', '-', t.lower()).strip('-')
    return s[:60].strip('-') or 'section'

def dedupe(t):
    seen = set(); out = []
    for w in t.split():
        if w not in seen:
            seen.add(w); out.append(w)
    return ' '.join(out)

def clean(t):
    t = re.sub(r'\s+', ' ', t).strip()
    t = re.sub(r' ([,.;:?!)])', r'\1', t).replace('( ', '(')
    return t

def snippet(t, n=210):
    t = clean(t)
    if len(t) <= n:
        return t
    cut = t[:n]
    # end on a sentence if one finishes reasonably late, else on a word
    m = max(cut.rfind('. '), cut.rfind('? '))
    if m > n * 0.55:
        return cut[:m + 1]
    return cut[:cut.rfind(' ')].rstrip(',;:') + '…'

def section_text(h, main=None):
    lvl = int(h.name[1])
    out = []
    for sib in h.next_elements:
        if sib is h:
            continue
        if isinstance(sib, Tag) and re.fullmatch(r'h[1-6]', sib.name or '') and int(sib.name[1]) <= lvl and sib is not h:
            break
        if main is not None and isinstance(sib, Tag) and main not in sib.parents:
            break
        if isinstance(sib, NavigableString):
            p = sib.parent
            if p and p.name in ('script', 'style', 'noscript', 'button', 'select', 'option', 'label'):
                continue
            if any(a.name and re.fullmatch(r'h[1-6]', a.name) for a in sib.parents):
                continue
            out.append(str(sib))
        if sum(len(x) for x in out) > 1600:
            break
    return clean(' '.join(out))

entries = []
pages = sorted(f for f in os.listdir('.') if f.endswith('.html') and f not in SKIP)
for p in pages:
    raw = open(p, encoding='utf-8').read()
    soup = BeautifulSoup(raw, 'html.parser')
    robots = soup.find('meta', attrs={'name': 'robots'})
    if robots and 'noindex' in (robots.get('content') or ''):
        continue
    h1 = soup.find('h1')
    title = clean(h1.get_text(' ')) if h1 else clean(soup.title.get_text()).split(' | ')[0]
    lead = soup.select_one('.lf-lead')
    desc = soup.find('meta', attrs={'name': 'description'})
    leadt = clean(lead.get_text(' ')) if lead else (desc.get('content', '') if desc else '')
    main = soup.select_one('.lf-main') or soup.find('main') or soup.body
    pk = old_k.get((p, norm(title)), '') or next((e['k'] for e in OLD if e['u'] == p), '')
    entries.append({'t': title, 's': '', 'p': p, 'u': p, 'd': snippet(leadt),
                    'k': dedupe(clean((pk + ' ' + title + ' ' + leadt).lower()))[:400],
                    'b': clean(leadt.lower())[:300]})
    # headings: add static ids where missing, matching leaflet.js's runtime ids for h2
    changed = False
    used = set(x.get('id') for x in soup.find_all(id=True))
    h2s = [h for h in main.find_all('h2') if not h.find_parent(class_=re.compile('lf-acc'))]
    for i, h in enumerate(h2s):
        if not h.get('id'):
            nid = slug(h.get_text(' '))
            while nid in used:
                nid += '-x'
            used.add(nid); h['id'] = nid; changed = True
    for h in main.find_all('h3'):
        if not h.get('id'):
            nid = slug(h.get_text(' '))
            while nid in used:
                nid += '-x'
            used.add(nid); h['id'] = nid; changed = True
    cur_h2 = ''
    for h in main.find_all(['h2', 'h3']):
        ht = clean(h.get_text(' '))
        if not ht or h.get('id') == 'watch' or h.find_parent(class_=re.compile('lf-foot|lf-aside')):
            continue
        if h.name == 'h2':
            cur_h2 = ht
        body = section_text(h, main if main.name != 'body' else None)
        k = old_k.get((p, h['id']), '') or old_k.get((p, norm(ht)), '')
        entries.append({'t': ht, 's': title if h.name == 'h2' or not cur_h2 else title + ' › ' + cur_h2,
                        'p': p, 'u': p + '#' + h['id'], 'd': snippet(body),
                        'k': dedupe(clean((k + ' ' + ht + ' ' + title).lower()))[:400],
                        'b': clean(body.lower())[:320]})
    if changed:
        # write ids back with minimal edits: replace only the opening heading tags
        new = raw
        for h in main.find_all(['h2', 'h3']):
            pass
        # targeted regex rewrite, in document order, of headings without id
        ids = iter([h['id'] for h in main.find_all(['h2', 'h3'])])
        def repl(m):
            try:
                nid = next(ids)
            except StopIteration:
                return m.group(0)
            tag = m.group(0)
            if 'id=' in tag:
                return tag
            return tag[:-1] + f' id="{nid}">'
        # only rewrite inside lf-main
        start = raw.find('class="lf-main')
        if start < 0:
            start = raw.find('<main')
        if start < 0:
            start = raw.find('<body')
        head, tail = raw[:start], raw[start:]
        tail = re.sub(r'<h[23](\s[^>]*)?>', repl, tail)
        open(p, 'w', encoding='utf-8').write(head + tail)

open('assets/search-index.js', 'w', encoding='utf-8').write(
    '/* Built from the pages by buildindex.py. t title, s parent, u link, d quoted snippet, k keywords, b body text. */\n'
    'window.SEARCH_INDEX=' + json.dumps(entries, ensure_ascii=False) + ';\n')
print(len(entries), 'entries;', sum(1 for e in entries if e['d']), 'with snippets')
