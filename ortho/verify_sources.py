#!/usr/bin/env python3
"""Verify every source in the atlas against Crossref (for DOIs) or a HEAD request (for other URLs).

  python3 ortho/verify_sources.py            all cards and chapters
  python3 ortho/verify_sources.py <id>...    only those ids

For each doi.org source: fetch Crossref metadata, compare the first author's surname, the year and a
fuzzy title match against the citation text, and print MISMATCH lines. For other URLs: HEAD request,
print DEAD lines for 4xx/5xx or no response. Results are cached in ortho/data/.source-cache.json
(not committed) so re-runs are cheap.
"""
import json, re, sys, time, urllib.parse, urllib.request
from difflib import SequenceMatcher
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import build  # noqa: E402

CACHE = build.HERE / 'data' / '.source-cache.json'
cache = json.loads(CACHE.read_text()) if CACHE.exists() else {}
UA = {'User-Agent': 'ortho-textbook-source-check/1.0'}


def crossref(doi):
    if doi in cache:
        return cache[doi]
    url = 'https://api.crossref.org/works/' + urllib.parse.quote(doi, safe='')
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as r:
            m = json.load(r)['message']
        out = {'title': (m.get('title') or [''])[0], 'year': (m.get('issued', {}).get('date-parts') or [[None]])[0][0],
               'first': ((m.get('author') or [{}])[0].get('family') or ''), 'journal': (m.get('container-title') or [''])[0], 'ok': True}
    except Exception as e:  # noqa: BLE001
        out = {'ok': False, 'error': str(e)[:80]}
    cache[doi] = out
    time.sleep(0.3)
    return out


def head(url):
    if url in cache:
        return cache[url]
    try:
        req = urllib.request.Request(url, headers=UA, method='HEAD')
        with urllib.request.urlopen(req, timeout=30) as r:
            out = {'ok': True, 'status': r.status}
    except urllib.error.HTTPError as e:
        if e.code in (403, 405):  # many publishers refuse HEAD or bots; count as reachable
            out = {'ok': True, 'status': e.code}
        else:
            out = {'ok': False, 'status': e.code}
    except Exception as e:  # noqa: BLE001
        out = {'ok': False, 'status': str(e)[:60]}
    cache[url] = out
    return out


def norm(s):
    return re.sub(r'[^a-z0-9 ]+', ' ', (s or '').lower())


def check(entry, label):
    issues = []
    for i, s in enumerate(entry['fm'].get('sources') or []):
        url, title = s.get('url', ''), s.get('title', '')
        m = re.search(r'doi\.org/(10\.\S+)', url)
        if m:
            doi = m.group(1).rstrip('.')
            r = crossref(doi)
            if not r.get('ok'):
                issues.append(f'{label} [{i}] DOI not found on Crossref: {doi}')
                continue
            cited_first = re.match(r'\s*([A-Z][\w\'\-]+)', title)
            cited_first = cited_first.group(1).lower() if cited_first else ''
            years = re.findall(r'(?<![\d\-/.])((?:19|20)\d\d)(?![\d\-])', title)
            cited_year = int(years[-1]) if years else None
            # title similarity: compare the longest run of the citation between the author list and the journal
            tsim = max(SequenceMatcher(None, norm(r['title']), norm(chunk)).ratio() for chunk in re.split(r'[.;]', title) if len(chunk) > 15) if r['title'] else 0
            probs = []
            cf, rf = re.sub(r"[^a-z]", '', cited_first), re.sub(r"[^a-z]", '', r['first'].lower())
            if cf and rf and cf != rf and cf not in rf and rf not in cf:
                probs.append(f'first author cited "{cited_first}" vs Crossref "{r["first"]}"')
            if cited_year and r['year'] and abs(cited_year - r['year']) > 1:
                probs.append(f'year cited {cited_year} vs Crossref {r["year"]}')
            if tsim < 0.55:
                probs.append(f'title similarity {tsim:.2f}; Crossref: "{r["title"][:90]}"')
            if probs:
                issues.append(f'{label} [{i}] {doi}: ' + '; '.join(probs))
        elif url.startswith('http'):
            r = head(url)
            if not r.get('ok'):
                issues.append(f'{label} [{i}] DEAD {r.get("status")}: {url}')
        else:
            issues.append(f'{label} [{i}] no URL')
    return issues


def main(ids):
    entries = []
    for p in sorted((build.SRC / 'cards').glob('*.md')):
        if not ids or p.stem in ids:
            c = build.parse_card(p)
            if c:
                entries.append((c, p.stem))
    for p in sorted((build.SRC / 'chapters').glob('*.md')):
        if not ids or p.stem in ids:
            entries.append((build.parse_chapter(p), p.stem))
    total = sum(len(e['fm'].get('sources') or []) for e, _ in entries)
    issues = []
    for e, label in entries:
        issues += check(e, label)
        CACHE.write_text(json.dumps(cache))
    print(f'{len(entries)} files, {total} sources checked, {len(issues)} issue(s)')
    print('\n'.join(issues))


if __name__ == '__main__':
    main(set(sys.argv[1:]))
