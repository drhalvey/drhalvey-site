#!/usr/bin/env python3
"""Build Orthopaedic Anaesthesia: Surgery First from ortho/src into static HTML under ortho/.

Usage
  python3 ortho/build.py                 build everything
  python3 ortho/build.py --check PATH    validate one or more source files and exit non-zero on problems
  python3 ortho/build.py --local DIR     also encrypt the plaintext local layer found in DIR (default
                                         $ORTHO_LOCAL_DIR or ../ortho-local relative to the repo root);
                                         the passphrase is read from DIR/PASSPHRASE.txt

Source files are Markdown with YAML front matter (see src/STYLE.md). Nothing in src/local/ or in the
local directory is ever written to the repository in plain text.
"""
import base64, html, json, os, re, secrets, sys
from pathlib import Path

import markdown
import yaml

HERE = Path(__file__).resolve().parent          # ortho/
ROOT = HERE.parent                               # repo root
SRC = HERE / 'src'
MANIFEST = yaml.safe_load((SRC / 'manifest.yaml').read_text())

REGIONS = ['Shoulder', 'Elbow', 'Wrist and hand', 'Hip', 'Knee', 'Foot and ankle', 'Trauma', 'Spine', 'Tumour', 'Paediatric']
GROUPS = ['Upper limb', 'Hip and knee', 'Foot and ankle', 'Trauma', 'Spine', 'Tumour', 'Paediatric']
BLOCK_FAMILIES = ['interscalene', 'brachial-plexus-distal', 'peripheral-upper-limb', 'lumbar-plexus-femoral',
                  'adductor-canal', 'sciatic-popliteal', 'ipack-genicular', 'neuraxial', 'fascial-plane',
                  'local-infiltration', 'none']
CATHETER = ['routine', 'selective', 'rarely', 'no']
YES_OPTION_NO = ['yes', 'option', 'no']
POSITIONS = ['beach-chair', 'lateral', 'supine', 'supine-arm-table', 'prone', 'traction-table', 'supine-bump', 'lithotomy']
YES_NO_SOMETIMES = ['yes', 'no', 'sometimes']
DAY_CASE = ['yes', 'selected', 'no']
MECHANISMS = ['bone', 'tendon-tension', 'retension', 'capsule', 'muscle', 'periosteum', 'nerve', 'tourniquet', 'surface', 'visceral']
REBOUND = ['low', 'moderate', 'high']

BLOCK_FAMILY_LABEL = {
    'interscalene': 'Interscalene / superior trunk', 'brachial-plexus-distal': 'Supraclavicular, infraclavicular, axillary',
    'peripheral-upper-limb': 'Distal upper limb or WALANT', 'lumbar-plexus-femoral': 'Femoral, fascia iliaca, PENG, lumbar plexus',
    'adductor-canal': 'Adductor canal', 'sciatic-popliteal': 'Sciatic / popliteal', 'ipack-genicular': 'IPACK / genicular',
    'neuraxial': 'Neuraxial', 'fascial-plane': 'Fascial plane (ESP, QL, TAP)', 'local-infiltration': 'Local infiltration only', 'none': 'No block',
}
POSITION_LABEL = {
    'beach-chair': 'Beach chair', 'lateral': 'Lateral', 'supine': 'Supine', 'supine-arm-table': 'Supine, arm table',
    'prone': 'Prone', 'traction-table': 'Traction table', 'supine-bump': 'Supine with bump', 'lithotomy': 'Lithotomy',
}
MECHANISM_LABEL = {
    'bone': 'Bone', 'tendon-tension': 'Tendon under tension', 'retension': 'Joint re-tensioned', 'capsule': 'Capsule',
    'muscle': 'Muscle', 'periosteum': 'Periosteum', 'nerve': 'Nerve', 'tourniquet': 'Tourniquet', 'surface': 'Arthroscopic surface', 'visceral': 'Visceral',
}
PAIN_LABEL = {1: 'Minimal', 2: 'Mild to moderate', 3: 'Moderate', 4: 'Severe', 5: 'Severe and prolonged'}

EM_DASH = '—'
problems = []


def problem(path, msg):
    problems.append(f'{path}: {msg}')


# ----------------------------------------------------------------- parsing

def split_front_matter(text, path):
    m = re.match(r'^---\n(.*?)\n---\n(.*)$', text, re.S)
    if not m:
        problem(path, 'missing YAML front matter block')
        return {}, text
    try:
        fm = yaml.safe_load(m.group(1)) or {}
    except yaml.YAMLError as e:
        problem(path, f'YAML error: {e}')
        return {}, m.group(2)
    return fm, m.group(2)


def walk_strings(obj, path, where='front matter'):
    """Apply the writing rules to every string in the front matter."""
    if isinstance(obj, dict):
        for k, v in obj.items():
            walk_strings(v, path, f'{where}.{k}')
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            walk_strings(v, path, f'{where}[{i}]')
    elif isinstance(obj, str):
        if EM_DASH in obj:
            problem(path, f'em dash in {where}')
        if '?' in obj and not (where.endswith('.url') or re.search(r'sources\[\d+\]\.title$', where)):
            problem(path, f'question mark used as content in {where}')
        if re.search(r'\b(TODO|TBD|confirm with|ask the surgeon|check this)\b', obj, re.I):
            problem(path, f'note to the author in {where}: "{obj[:60]}"')


def check_body(body, path):
    if EM_DASH in body:
        line = body.count('\n', 0, body.find(EM_DASH)) + 1
        problem(path, f'em dash in body near line {line}')
    for m in re.finditer(r'\b(TODO|TBD)\b', body):
        problem(path, f'{m.group(0)} in body')
    if re.search(r"\b(Why|Check|Confirm)\?", body):
        problem(path, 'rhetorical question used as content in body')


def require(fm, keys, path, where=''):
    ok = True
    for k in keys:
        if k not in fm or fm[k] in (None, ''):
            problem(path, f'missing field {where}{k}')
            ok = False
    return ok


def check_vocab(value, allowed, path, where):
    if value not in allowed:
        problem(path, f'{where} is "{value}", must be one of {allowed}')


def parse_card(path):
    text = path.read_text(encoding='utf-8')
    fm, body = split_front_matter(text, path)
    if not fm:
        return None
    walk_strings(fm, path)
    check_body(body, path)
    require(fm, ['id', 'title', 'aka', 'pain', 'block', 'position', 'position_text', 'tourniquet', 'cement', 'blood_loss',
                 'duration', 'los', 'day_case', 'drugs', 'patient_line', 'trap', 'sources'], path)
    if fm.get('id') != path.stem:
        problem(path, f'id "{fm.get("id")}" does not match file name')
    pain = fm.get('pain') or {}
    if require(pain, ['score', 'trajectory', 'mechanism', 'mechanism_text', 'rebound_risk'], path, 'pain.'):
        if pain['score'] not in (1, 2, 3, 4, 5):
            problem(path, 'pain.score must be a whole number 1-5')
        tr = pain['trajectory']
        if not (isinstance(tr, list) and len(tr) == 5 and all(isinstance(x, int) and 0 <= x <= 10 for x in tr)):
            problem(path, 'pain.trajectory must be five whole numbers 0-10 (day 0, 1, 2, 3, 7)')
        check_vocab(pain['mechanism'], MECHANISMS, path, 'pain.mechanism')
        check_vocab(pain['rebound_risk'], REBOUND, path, 'pain.rebound_risk')
    block = fm.get('block') or {}
    if require(block, ['primary', 'family', 'catheter', 'catheter_text', 'alternatives', 'neuraxial'], path, 'block.'):
        check_vocab(block['family'], BLOCK_FAMILIES, path, 'block.family')
        check_vocab(block['catheter'], CATHETER, path, 'block.catheter')
        check_vocab(str(block['neuraxial']).lower() if not isinstance(block['neuraxial'], bool) else ('yes' if block['neuraxial'] else 'no'),
                    YES_OPTION_NO, path, 'block.neuraxial')
    check_vocab(fm.get('position'), POSITIONS, path, 'position')
    check_vocab(_yn(fm.get('tourniquet')), YES_NO_SOMETIMES, path, 'tourniquet')
    check_vocab(_yn(fm.get('cement')), YES_NO_SOMETIMES, path, 'cement')
    check_vocab(_yn(fm.get('day_case')), DAY_CASE, path, 'day_case')
    drugs = fm.get('drugs') or {}
    require(drugs, ['antibiotic', 'txa', 'vte', 'antiemetic'], path, 'drugs.')
    for i, s in enumerate(fm.get('sources') or []):
        if not isinstance(s, dict) or not s.get('title') or not s.get('url'):
            problem(path, f'sources[{i}] needs title and url')
    sections = split_sections(body)
    for h in ['What the surgeon is doing and why', 'Steps', 'Pain plan', 'Pitfalls and variants']:
        if h not in sections:
            problem(path, f'missing section "## {h}"')
    steps = parse_steps(sections.get('Steps', ''), path)
    if steps and not (6 <= len(steps) <= 14):
        problem(path, f'{len(steps)} steps; the schema asks for 6 to 14')
    words = len(re.findall(r'\w+', body))
    if words < 900:
        problem(path, f'body is {words} words; the schema asks for 1,500 to 3,500')
    manifest_entry = next((c for c in MANIFEST['cards'] if c['id'] == path.stem), None)
    if manifest_entry is None:
        problem(path, 'id is not in src/manifest.yaml')
    return {'fm': fm, 'body': body, 'sections': sections, 'steps': steps, 'manifest': manifest_entry or {}, 'path': path, 'words': words}


def _yn(v):
    """YAML turns a bare yes/no into a bool; normalise back to the vocabulary strings."""
    if isinstance(v, bool):
        return 'yes' if v else 'no'
    return str(v).lower() if v is not None else v


def split_sections(body):
    """Split the body on '## ' headings. Returns {heading: markdown}."""
    parts = re.split(r'^## +(.+?)\s*$', body, flags=re.M)
    out = {}
    for i in range(1, len(parts), 2):
        out[parts[i].strip()] = parts[i + 1]
    return out


def parse_steps(md, path):
    steps = []
    chunks = re.split(r'^### +(.+?)\s*$', md, flags=re.M)
    for i in range(1, len(chunks), 2):
        title = re.sub(r'^\d+\.\s*', '', chunks[i].strip())
        text = chunks[i + 1]
        why = re.search(r'\*\*Why:\*\*\s*(.*?)(?=\n\*\*Anaesthesia:\*\*|\Z)', text, re.S)
        an = re.search(r'\*\*Anaesthesia:\*\*\s*(.*)', text, re.S)
        if not why or not an:
            problem(path, f'step "{title}" needs both a **Why:** and an **Anaesthesia:** paragraph')
        steps.append({'title': title, 'why': (why.group(1).strip() if why else ''), 'anaesthesia': (an.group(1).strip() if an else '')})
    return steps


def parse_chapter(path):
    text = path.read_text(encoding='utf-8')
    fm, body = split_front_matter(text, path)
    walk_strings(fm, path)
    check_body(body, path)
    require(fm, ['id', 'title', 'summary'], path)
    if fm.get('id') != path.stem:
        problem(path, f'id "{fm.get("id")}" does not match file name')
    words = len(re.findall(r'\w+', body))
    if words < 1000:
        problem(path, f'body is {words} words; the schema asks for 1,500 to 3,500')
    return {'fm': fm, 'body': body, 'path': path, 'words': words}


# ----------------------------------------------------------------- rendering

MD = markdown.Markdown(extensions=['extra', 'sane_lists', 'smarty'], extension_configs={'smarty': {'smart_dashes': False}})


def md(text):
    MD.reset()
    return MD.convert(text or '')


def esc(s):
    return html.escape(str(s if s is not None else ''), quote=True)


def page(title, body, depth, extra_head='', body_class=''):
    rel = '../' * depth
    return f'''<!DOCTYPE html>
<html lang="en-AU">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow, noarchive">
<title>{esc(title)}</title>
<link rel="icon" href="{rel}favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="{rel}assets/fonts.css">
<link rel="stylesheet" href="{rel}ortho/ortho.css">
{extra_head}
</head>
<body class="{body_class}">
<header class="ob-head">
  <a class="ob-brand" href="{rel}ortho/index.html"><span class="ob-brand-title">{esc(MANIFEST['title'])}</span><span class="ob-brand-sub">{esc(MANIFEST['subtitle'])}</span></a>
  <nav class="ob-nav" aria-label="Book">
    <a href="{rel}ortho/index.html">Atlas</a>
    <a href="{rel}ortho/index.html#part-a">Principles</a>
    <a href="{rel}ortho/b/b01-why-operations-hurt.html">Pain model</a>
    <a href="{rel}ortho/judge.html">Judge my practice</a>
    <button type="button" class="ob-unlock" id="ob-unlock" hidden>My practice</button>
  </nav>
</header>
<main class="ob-main" id="main">
{body}
</main>
<footer class="ob-foot">
  <p>{esc(MANIFEST['author'])}. A clinician reference, not patient information. Not linked from the public site and not indexed.</p>
</footer>
<script src="{rel}ortho/ortho.js"></script>
</body>
</html>
'''



def load_figures():
    f = HERE / 'img' / 'figures.yaml'
    if not f.exists():
        return {}
    out = {}
    for fig in (yaml.safe_load(f.read_text()) or []):
        if not (HERE / 'img' / fig['file']).exists():
            problem(f, f'figure file missing: {fig["file"]}')
            continue
        for tid in fig.get('targets', []):
            out.setdefault(tid, []).append(fig)
    return out


FIGURES = {}


def figures_html(tid, book=False):
    rel = 'img/' if book else '../img/'
    return ''.join(f'<figure class="ob-figure"><img src="{rel}{esc(f["file"])}" alt="{esc(f.get("alt", f["caption"]))}" loading="lazy"><figcaption>{esc(f["caption"])}</figcaption></figure>' for f in FIGURES.get(tid, []))

def sparkline(tr):
    """Five bars for day 0, 1, 2, 3, 7 expected worst pain."""
    labels = ['D0', 'D1', 'D2', 'D3', 'D7']
    w, h, gap = 22, 44, 6
    parts = []
    for i, v in enumerate(tr):
        x = i * (w + gap)
        bh = max(2, round(v / 10 * h))
        parts.append(f'<rect x="{x}" y="{h - bh}" width="{w}" height="{bh}" rx="2" class="ob-bar ob-bar-{v}"></rect>')
        parts.append(f'<text x="{x + w / 2}" y="{h + 12}" text-anchor="middle" class="ob-bar-label">{labels[i]}</text>')
        parts.append(f'<text x="{x + w / 2}" y="{h - bh - 3}" text-anchor="middle" class="ob-bar-value">{v}</text>')
    total_w = 5 * w + 4 * gap
    return f'<svg class="ob-spark" viewBox="-2 -12 {total_w + 4} {h + 28}" width="{total_w + 4}" height="{h + 28}" role="img" aria-label="Expected worst pain, 0 to 10, on day 0, 1, 2, 3 and 7: {", ".join(map(str, tr))}">{"".join(parts)}</svg>'


def field(label, value, cls=''):
    return f'<div class="ob-field {cls}"><dt>{esc(label)}</dt><dd>{value}</dd></div>'


def render_card(card, prev_card, next_card):
    return page(f'{card["fm"]["title"]} | {MANIFEST["title"]}', card_body(card, prev_card, next_card), 2, body_class='ob-card-page')


def card_body(card, prev_card=None, next_card=None, book=False):
    fm, s = card['fm'], card['sections']
    pain, block, drugs = fm['pain'], fm['block'], fm['drugs']
    m = card['manifest']
    score = pain['score']
    catheter = block['catheter']
    tourniquet, cement, day_case = _yn(fm['tourniquet']), _yn(fm['cement']), _yn(fm['day_case'])

    block_html = f'<strong>{esc(block["primary"])}</strong>'
    block_html += f'<br><span class="ob-cath ob-cath-{catheter}">Catheter: {esc(catheter)}</span> {esc(block["catheter_text"])}'
    if block.get('alternatives'):
        block_html += '<br><span class="ob-muted">Alternatives: ' + '; '.join(esc(a) for a in block['alternatives']) + '</span>'

    def yn_text(flag, text):
        t = esc(flag.capitalize())
        return t + (f'. {esc(text)}' if text else '')

    summary = f'''
<section class="ob-summary" aria-label="Summary box">
  <div class="ob-summary-head">
    <div class="ob-pain ob-pain-{score}" title="Pain score {score} of 5 on the Part B scale">
      <span class="ob-pain-num">{score}</span><span class="ob-pain-lab">{esc(PAIN_LABEL[score])}</span>
    </div>
    <div class="ob-pain-detail">
      {sparkline(pain['trajectory'])}
      <p><strong>Dominant mechanism: {esc(MECHANISM_LABEL[pain['mechanism']])}.</strong> {esc(pain['mechanism_text'])}</p>
      <p class="ob-muted">Rebound risk when a single-shot block wears off: {esc(pain['rebound_risk'])}.</p>
    </div>
  </div>
  <dl class="ob-fields">
    {field('Block', block_html, 'ob-field-wide')}
    {field('Position', esc(fm['position_text']) if fm.get('position_text') else esc(POSITION_LABEL[fm['position']]))}
    {field('Tourniquet', yn_text(tourniquet, fm.get('tourniquet_text')))}
    {field('Cement', yn_text(cement, fm.get('cement_text')))}
    {field('Blood loss', esc(fm['blood_loss']))}
    {field('Duration', esc(fm['duration']))}
    {field('Length of stay', esc(fm['los']) + f'. Day case: {esc(day_case)}')}
    {field('Antibiotic', esc(drugs['antibiotic']))}
    {field('Tranexamic acid', esc(drugs['txa']))}
    {field('VTE', esc(drugs['vte']))}
    {field('Antiemetic', esc(drugs['antiemetic']))}
    {field('Tell the patient', esc(fm['patient_line']), 'ob-field-wide')}
    {field('The trap', esc(fm['trap']), 'ob-field-wide ob-field-trap')}
  </dl>
  <div class="ob-local" id="ob-local" data-card="{esc(fm['id'])}" hidden></div>
</section>'''

    steps_html = ''.join(
        f'<li class="ob-step"><h3><span class="ob-step-n">{i + 1}</span> {esc(st["title"])}</h3>'
        f'<div class="ob-step-cols"><div class="ob-step-why"><h4>What the surgeon is doing and why</h4>{md(st["why"])}</div>'
        f'<div class="ob-step-an"><h4>What it means for anaesthesia</h4>{md(st["anaesthesia"])}</div></div></li>'
        for i, st in enumerate(card['steps']))

    sources_html = ''.join(
        f'<li><a href="{esc(src["url"])}" rel="noopener">{esc(src["title"])}</a>'
        + (f'<br><span class="ob-muted">{esc(src["note"])}</span>' if src.get('note') else '') + '</li>'
        for src in fm['sources'])

    def details(heading, inner, open_=False):
        return f'<details class="ob-section"{" open" if open_ else ""}><summary><h2>{esc(heading)}</h2></summary><div class="ob-section-body">{inner}</div></details>'

    nav = '<nav class="ob-prevnext" aria-label="Previous and next">'
    nav += f'<a href="{prev_card["fm"]["id"]}.html">&larr; {esc(prev_card["fm"]["title"])}</a>' if prev_card else '<span></span>'
    nav += f'<a href="{next_card["fm"]["id"]}.html">{esc(next_card["fm"]["title"])} &rarr;</a>' if next_card else '<span></span>'
    nav += '</nav>'
    if book:
        nav = ''
        summary = summary.replace(' id="ob-local"', '')
        crumb = f'<p class="ob-crumb">{esc(m.get("group", ""))} &rsaquo; {esc(m.get("region", ""))}</p>'
    else:
        crumb = f'<p class="ob-crumb"><a href="../index.html">Atlas</a> &rsaquo; {esc(m.get("group", ""))} &rsaquo; {esc(m.get("region", ""))}</p>'

    body = f'''
{crumb}
<h1 class="ob-title" id="{esc(fm['id'])}"><span class="ob-num">{m.get('number', '')}</span> {esc(fm['title'])}</h1>
{('<p class="ob-subtitle">' + esc(fm['subtitle']) + '</p>') if fm.get('subtitle') else ''}
{summary}
<div class="ob-toolbar"><button type="button" class="ob-expand" data-expand>Expand all</button><button type="button" class="ob-expand" data-collapse>Collapse all</button><button type="button" class="ob-expand" onclick="window.print()">Print</button></div>
{details('What the surgeon is doing and why', figures_html(fm['id'], book) + md(s.get('What the surgeon is doing and why', '')), True)}
{details('Steps: what happens and what it means for you', '<ol class="ob-steps">' + steps_html + '</ol>', True)}
{details('Pain plan', md(s.get('Pain plan', '')))}
{details('Pitfalls and variants', md(s.get('Pitfalls and variants', '')))}
{details('Key sources', md(s.get('Key sources', '')) + '<ol class="ob-sources">' + sources_html + '</ol>', book)}
{nav}
'''
    if book:
        body = body.replace('<details class="ob-section"', '<details class="ob-section" open').replace('<details class="ob-section" open open', '<details class="ob-section" open')
        body = re.sub(r'<div class="ob-toolbar">.*?</div>\n', '', body, flags=re.S)
    return body


def render_chapter(ch, part, prev_ch, next_ch):
    return page(f'{ch["fm"]["title"]} | {MANIFEST["title"]}', chapter_body(ch, part, prev_ch, next_ch), 2)


def chapter_body(ch, part, prev_ch=None, next_ch=None, book=False):
    fm = ch['fm']
    nav = '<nav class="ob-prevnext" aria-label="Previous and next">'
    nav += f'<a href="{prev_ch["fm"]["id"]}.html">&larr; {esc(prev_ch["fm"]["title"])}</a>' if prev_ch else '<span></span>'
    nav += f'<a href="{next_ch["fm"]["id"]}.html">{esc(next_ch["fm"]["title"])} &rarr;</a>' if next_ch else '<span></span>'
    nav += '</nav>'
    sources = ''.join(
        f'<li><a href="{esc(src["url"])}" rel="noopener">{esc(src["title"])}</a>'
        + (f'<br><span class="ob-muted">{esc(src["note"])}</span>' if src.get('note') else '') + '</li>'
        for src in (fm.get('sources') or []))
    if book:
        nav = ''
        crumb = f'<p class="ob-crumb">Part {part}</p>'
    else:
        crumb = f'<p class="ob-crumb"><a href="../index.html">Atlas</a> &rsaquo; Part {part}</p>'
    body = f'''
{crumb}
<h1 class="ob-title" id="{esc(fm['id'])}">{esc(fm['title'])}</h1>
<section class="ob-summary ob-summary-chapter" aria-label="Summary box"><p>{esc(fm['summary'])}</p></section>
<article class="ob-prose">{figures_html(fm['id'], book)}{md(ch['body'])}</article>
{('<section class="ob-section-body"><h2>Key sources</h2><ol class="ob-sources">' + sources + '</ol></section>') if sources else ''}
{nav}
'''
    return body


def render_book(cards, chapters_a, chapters_b):
    """The whole book on one page, every section open, for reading end to end or printing to PDF."""
    toc = '<nav class="ob-toc" aria-label="Contents"><h2>Contents</h2>'
    toc += '<h3>Part A. Principles</h3><ol>' + ''.join(f'<li><a href="#{esc(ch["fm"]["id"])}">{esc(ch["fm"]["title"])}</a></li>' for ch in chapters_a) + '</ol>'
    toc += '<h3>Part B. Why operations hurt</h3><ol>' + ''.join(f'<li><a href="#{esc(ch["fm"]["id"])}">{esc(ch["fm"]["title"])}</a></li>' for ch in chapters_b) + '</ol>'
    toc += '<h3>Part C. The procedure atlas</h3><ol>' + ''.join(f'<li value="{c["manifest"].get("number", 0)}"><a href="#{esc(c["fm"]["id"])}">{esc(c["fm"]["title"])}</a></li>' for c in cards) + '</ol></nav>'
    parts = [f'<h1 class="ob-title">{esc(MANIFEST["title"])}</h1><p class="ob-subtitle">{esc(MANIFEST["subtitle"])}. {esc(MANIFEST["author"])}.</p>', toc]
    parts.append('<h1 class="ob-part-title">Part A. Principles</h1>')
    parts += [f'<section class="ob-book-item">{chapter_body(ch, "A", book=True)}</section>' for ch in chapters_a]
    parts.append('<h1 class="ob-part-title">Part B. Why operations hurt</h1>')
    parts += [f'<section class="ob-book-item">{chapter_body(ch, "B", book=True)}</section>' for ch in chapters_b]
    parts.append('<h1 class="ob-part-title">Part C. The procedure atlas</h1>')
    parts += [f'<section class="ob-book-item">{card_body(c, book=True)}</section>' for c in cards]
    # links written for the per-card pages point at sibling files; on the book page they become anchors
    html_body = '\n'.join(parts)
    html_body = re.sub(r'href="(?:\.\./[abc]/)?([a-z0-9-]+)\.html"', r'href="#\1"', html_body)
    return page(f'Whole book | {MANIFEST["title"]}', html_body, 1, body_class='ob-book-page')


def render_judge(cards):
    opts = ''.join(f'<option value="{esc(c["fm"]["id"])}">{c["manifest"].get("number", "")}. {esc(c["fm"]["title"])}</option>' for c in cards)
    def sel(i, label, options):
        return f'<label for="{i}">{label}</label><select id="{i}">' + ''.join(f'<option>{esc(o)}</option>' for o in options) + '</select>'
    def txt(i, label, ph, rows=2):
        return f'<label for="{i}">{label}</label><textarea id="{i}" rows="{rows}" placeholder="{esc(ph)}"></textarea>'
    body = f"""
<h1 class="ob-title">Judge my practice</h1>
<p class="ob-subtitle">Enter the operation and the anaesthetic you gave or plan to give. The AI reads this book's card for that operation and gives its opinion.</p>
<section class="ob-summary ob-judge-note"><p><strong>No patient names, dates of birth or record numbers.</strong> What you type is sent to the AI relay to produce the opinion. The opinion is an AI's reading of your plan against this book, not a guideline and not peer review. Check any dose it suggests yourself.</p></section>
<form id="jf" class="ob-judge">
  <fieldset><legend>Case</legend>
    <label for="j-op">Operation</label><select id="j-op"><option value="">Choose an operation</option>{opts}</select>
    <div class="ob-judge-row">
      <div><label for="j-age">Age</label><input id="j-age" type="number" min="1" max="110" inputmode="numeric"></div>
      <div><label for="j-wt">Weight (kg)</label><input id="j-wt" type="number" min="10" max="300" inputmode="numeric"></div>
      <div>{sel('j-asa', 'ASA', ['', '1', '2', '3', '4'])}</div>
    </div>
    {txt('j-hx', 'Relevant history', 'e.g. OSA on CPAP, eGFR 40, apixaban stopped 3 days, opioid tolerant on 40 mg oxycodone daily')}
    {txt('j-var', 'Surgical details', 'e.g. cemented, tourniquet 70 min, posterior approach, day case')}
  </fieldset>
  <fieldset><legend>Anaesthetic</legend>
    <div class="ob-judge-row">
      <div>{sel('j-tech', 'Technique', ['', 'Spinal', 'Spinal with sedation', 'General anaesthetic', 'Spinal and general', 'Block with sedation', 'Block alone', 'Epidural', 'Combined spinal epidural'])}</div>
      <div>{sel('j-airway', 'Airway', ['', 'Not applicable', 'Supraglottic airway', 'Tracheal tube', 'Face mask or nasal oxygen'])}</div>
    </div>
    {txt('j-neuraxial', 'Neuraxial drugs and doses', 'e.g. bupivacaine 0.5% heavy 2.4 mL, fentanyl 15 micrograms, no intrathecal morphine')}
    {txt('j-block', 'Blocks: which, drug, concentration, volume, catheter or single shot', 'e.g. adductor canal single shot ropivacaine 0.5% 20 mL; surgeon infiltration ropivacaine 0.2% 150 mL')}
    {txt('j-drugs', 'Other drugs with doses', 'e.g. TXA 1 g at induction, cefazolin 2 g, dexamethasone 8 mg, parecoxib 40 mg, ketamine 20 mg, hydromorphone 0.4 mg, ondansetron 4 mg, metaraminol infusion', 3)}
    {txt('j-post', 'Post-operative plan', 'e.g. paracetamol 1 g qid, celecoxib 200 mg bd, tapentadol SR 50 mg bd, oxycodone 5 mg PRN, enoxaparin 40 mg from next morning', 3)}
  </fieldset>
  <button type="submit" class="ob-judge-go" id="j-go">Judge it</button>
  <button type="button" class="ob-expand" id="j-clear">Clear</button>
  <p class="ob-muted" id="j-status" role="status"></p>
</form>
<section id="j-out" class="ob-judge-out" hidden></section>
"""
    return page(f'Judge my practice | {MANIFEST["title"]}', body, 1, extra_head='<script src="data/atlas.js"></script><script src="judge.js" defer></script>', body_class='ob-judge-page')


def render_index(cards, chapters_a, chapters_b):
    atlas = []
    for c in cards:
        fm, m = c['fm'], c['manifest']
        atlas.append({
            'id': fm['id'], 'n': m.get('number'), 'title': fm['title'], 'subtitle': fm.get('subtitle', ''),
            'aka': fm.get('aka', []), 'group': m.get('group'), 'region': m.get('region'),
            'pain': fm['pain']['score'], 'mechanism': fm['pain']['mechanism'], 'rebound': fm['pain']['rebound_risk'],
            'family': fm['block']['family'], 'catheter': fm['block']['catheter'], 'neuraxial': _yn(fm['block']['neuraxial']),
            'position': fm['position'], 'tourniquet': _yn(fm['tourniquet']), 'cement': _yn(fm['cement']), 'day_case': _yn(fm['day_case']),
            'block': fm['block']['primary'], 'duration': fm['duration'], 'los': fm['los'], 'trap': fm['trap'],
            'text': ' '.join([fm['title'], fm.get('subtitle', ''), ' '.join(fm.get('aka', [])), fm['pain']['mechanism_text'],
                              fm['block']['primary'], fm['trap']]).lower(),
        })
    (HERE / 'data').mkdir(exist_ok=True)
    (HERE / 'data' / 'atlas.js').write_text('window.ORTHO_ATLAS=' + json.dumps({
        'cards': atlas,
        'chapters_a': [{'id': ch['fm']['id'], 'title': ch['fm']['title'], 'summary': ch['fm']['summary']} for ch in chapters_a],
        'chapters_b': [{'id': ch['fm']['id'], 'title': ch['fm']['title'], 'summary': ch['fm']['summary']} for ch in chapters_b],
        'labels': {'family': BLOCK_FAMILY_LABEL, 'position': POSITION_LABEL, 'mechanism': MECHANISM_LABEL, 'pain': PAIN_LABEL},
    }, ensure_ascii=False) + ';\n', encoding='utf-8')

    def chip_group(name, label, options):
        return (f'<fieldset class="ob-filter"><legend>{esc(label)}</legend>' +
                ''.join(f'<label><input type="checkbox" name="{name}" value="{esc(v)}"> {esc(l)}</label>' for v, l in options) +
                '</fieldset>')

    filters = ''.join([
        chip_group('group', 'Area', [(g, g) for g in GROUPS]),
        chip_group('region', 'Region', [(r, r) for r in REGIONS]),
        chip_group('pain', 'Pain score', [(str(i), f'{i} {PAIN_LABEL[i]}') for i in range(1, 6)]),
        chip_group('family', 'Block', [(k, v) for k, v in BLOCK_FAMILY_LABEL.items()]),
        chip_group('catheter', 'Catheter', [(c, c) for c in CATHETER]),
        chip_group('neuraxial', 'Neuraxial', [('yes', 'usual'), ('option', 'option'), ('no', 'no')]),
        chip_group('position', 'Position', [(k, v) for k, v in POSITION_LABEL.items()]),
        chip_group('tourniquet', 'Tourniquet', [(c, c) for c in YES_NO_SOMETIMES]),
        chip_group('cement', 'Cement', [(c, c) for c in YES_NO_SOMETIMES]),
        chip_group('day_case', 'Day case', [(c, c) for c in DAY_CASE]),
    ])

    part_a = ''.join(f'<li><a href="a/{esc(ch["fm"]["id"])}.html">{esc(ch["fm"]["title"])}</a><p class="ob-muted">{esc(ch["fm"]["summary"])}</p></li>' for ch in chapters_a)
    part_b = ''.join(f'<li><a href="b/{esc(ch["fm"]["id"])}.html">{esc(ch["fm"]["title"])}</a><p class="ob-muted">{esc(ch["fm"]["summary"])}</p></li>' for ch in chapters_b)
    missing = [c for c in MANIFEST['cards'] if c['id'] not in {x['fm']['id'] for x in cards}]
    missing_html = ''
    if missing:
        missing_html = '<details class="ob-section"><summary><h2>Not yet written</h2></summary><div class="ob-section-body"><ol>' + ''.join(
            f'<li value="{c["number"]}">{esc(c["title"])}</li>' for c in missing) + '</ol></div></details>'

    body = f'''
<h1 class="ob-title">{esc(MANIFEST['title'])}</h1>
<p class="ob-subtitle">{esc(MANIFEST['subtitle'])}. {len(cards)} of {len(MANIFEST['cards'])} procedure cards written.</p>
<p class="ob-muted"><a href="book.html">Whole book on one page</a> (for reading end to end, or printing to PDF).</p>
<section class="ob-search" aria-label="Search the atlas">
  <label class="ob-search-label" for="ob-q">Find an operation</label>
  <input id="ob-q" type="search" placeholder="Ask a question or type an operation, e.g. which block for a Latarjet, or prone cases with big blood loss" autocomplete="off">
  <details class="ob-filters"><summary>Filters</summary><form id="ob-filters">{filters}<button type="reset" class="ob-expand">Clear filters</button></form></details>
  <p class="ob-muted" id="ob-count"></p>
  <ol class="ob-results" id="ob-results"></ol>
</section>
<section id="part-c" class="ob-part">
  <h2>Part C. The procedure atlas</h2>
  <div id="ob-atlas"></div>
  {missing_html}
</section>
<section id="part-a" class="ob-part">
  <h2>Part A. Principles</h2>
  <ol class="ob-chapters">{part_a or '<li class="ob-muted">Not yet written.</li>'}</ol>
</section>
<section id="part-b" class="ob-part">
  <h2>Part B. Why operations hurt</h2>
  <ol class="ob-chapters">{part_b or '<li class="ob-muted">Not yet written.</li>'}</ol>
</section>
'''
    return page(MANIFEST['title'], body, 1, extra_head='<script src="data/atlas.js"></script>', body_class='ob-index-page')


# ----------------------------------------------------------------- local layer

WORDS = ("acorn amber anchor apple apron arrow aspen badge bagel bamboo banjo barley basil beacon beetle berry birch bishop blanket "
         "bluff bonnet bottle bramble breeze brick bridge broom bucket budgie bugle bumble butter cabin cactus camel candle canoe canvas "
         "canyon carbon cargo carrot castle cedar cellar chalk cherry chess chimney cider cinder citrus clover cobalt cocoa comet copper "
         "coral cotton cradle crane cricket crumb crystal cuckoo cutlet daisy dapple dingo dolphin domino donkey dragon drift drizzle "
         "dune eagle easel ember emerald engine falcon feather fennel ferry fiddle fig finch flint fossil fountain foxglove frost "
         "galaxy garlic gecko ginger glacier goblet goose granite gravel groove guitar gull hammock harbour harvest hazel heron hinge "
         "honey hornet hummock icicle ingot iris ivory jacket jaguar jasmine jelly jigsaw jumble juniper kettle kiosk kiwi koala ladder "
         "lagoon lantern lemon lilac limpet linen lizard lobster locket lotus magnet magpie mango maple marble meadow melon meteor mint "
         "mirror moss mulberry muffin mustard nectar needle nettle noodle nugget nutmeg oasis ocean olive onyx orbit orchid otter oyster "
         "paddle pansy parcel parrot pebble pelican pepper petal pickle pigeon pillow pinecone piston plank plume pocket pollen poppy "
         "possum pretzel puffin pumpkin puzzle quartz quill quokka rabbit radish raven ribbon river robin rocket rosemary rudder saddle "
         "saffron salmon sandal satchel scarf seagull shadow shutter silver sketch sleigh slipper snorkel sorrel sparrow spindle sponge "
         "spruce squid stamp starling stirrup stone summit sundial swallow tadpole tangle teapot thimble thistle thunder timber toffee "
         "tortoise trellis trumpet tulip tundra turnip twine umbrella urchin velvet violet walnut walrus wattle whistle willow wombat "
         "yarrow zebra zephyr").split()


def encrypt_local(local_dir):
    """AES-GCM encrypt every JSON in local_dir into data/local.enc.json. Key: PBKDF2-SHA256 over the passphrase."""
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM
    from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
    from cryptography.hazmat.primitives import hashes
    local_dir = Path(local_dir)
    pass_file = local_dir / 'PASSPHRASE.txt'
    if not pass_file.exists():
        local_dir.mkdir(parents=True, exist_ok=True)
        phrase = ' '.join(secrets.choice(WORDS) for _ in range(5))
        pass_file.write_text(phrase + '\n')
        print(f'generated a new passphrase in {pass_file}')
    phrase = pass_file.read_text().strip()
    payload = {'cards': {}, 'general': {}}
    for p in sorted(local_dir.glob('*.json')):
        data = json.loads(p.read_text(encoding='utf-8'))
        if p.stem == 'general':
            payload['general'] = data
        else:
            payload['cards'][p.stem] = data
    salt, iv = secrets.token_bytes(16), secrets.token_bytes(12)
    iterations = 310000
    key = PBKDF2HMAC(algorithm=hashes.SHA256(), length=32, salt=salt, iterations=iterations).derive(phrase.encode('utf-8'))
    ct = AESGCM(key).encrypt(iv, json.dumps(payload, ensure_ascii=False).encode('utf-8'), None)
    b64 = lambda b: base64.b64encode(b).decode('ascii')
    (HERE / 'data').mkdir(exist_ok=True)
    (HERE / 'data' / 'local.enc.json').write_text(json.dumps({
        'v': 1, 'kdf': 'PBKDF2-SHA256', 'iter': iterations, 'salt': b64(salt), 'iv': b64(iv), 'ct': b64(ct),
        'cards': sorted(payload['cards'].keys()),
    }) + '\n')
    print(f'local layer: {len(payload["cards"])} card entries encrypted')


# ----------------------------------------------------------------- main

def build(local_dir=None):
    cards_by_id = {}
    for p in sorted((SRC / 'cards').glob('*.md')):
        c = parse_card(p)
        if c:
            cards_by_id[c['fm']['id']] = c
    order = [c['id'] for c in MANIFEST['cards']]
    cards = [cards_by_id[i] for i in order if i in cards_by_id]
    chapters = {}
    for p in sorted((SRC / 'chapters').glob('*.md')):
        ch = parse_chapter(p)
        chapters[ch['fm']['id']] = ch
    chapters_a = [chapters[c['id']] for c in MANIFEST['chapters_a'] if c['id'] in chapters]
    chapters_b = [chapters[c['id']] for c in MANIFEST['chapters_b'] if c['id'] in chapters]
    FIGURES.update(load_figures())
    if problems:
        print('\n'.join(problems))
        print(f'\n{len(problems)} problem(s); not building')
        return 1
    for d in ('c', 'a', 'b', 'data'):
        (HERE / d).mkdir(exist_ok=True)
    for i, c in enumerate(cards):
        (HERE / 'c' / f'{c["fm"]["id"]}.html').write_text(render_card(c, cards[i - 1] if i else None, cards[i + 1] if i + 1 < len(cards) else None), encoding='utf-8')
    for part, chs in (('A', chapters_a), ('B', chapters_b)):
        for i, ch in enumerate(chs):
            (HERE / part.lower() / f'{ch["fm"]["id"]}.html').write_text(render_chapter(ch, part, chs[i - 1] if i else None, chs[i + 1] if i + 1 < len(chs) else None), encoding='utf-8')
    (HERE / 'index.html').write_text(render_index(cards, chapters_a, chapters_b), encoding='utf-8')
    (HERE / 'book.html').write_text(render_book(cards, chapters_a, chapters_b), encoding='utf-8')
    (HERE / 'judge.html').write_text(render_judge(cards), encoding='utf-8')
    if local_dir:
        encrypt_local(local_dir)
    print(f'built {len(cards)} cards, {len(chapters_a)} Part A chapters, {len(chapters_b)} Part B chapters')
    return 0


def check(paths):
    for p in paths:
        p = Path(p)
        if 'cards' in p.parts:
            c = parse_card(p)
            if c:
                print(f'{p.name}: {c["words"]} words, {len(c["steps"])} steps')
        else:
            ch = parse_chapter(p)
            print(f'{p.name}: {ch["words"]} words')
    if problems:
        print('\n'.join(problems))
        print(f'\n{len(problems)} problem(s)')
        return 1
    print('ok')
    return 0


if __name__ == '__main__':
    args = sys.argv[1:]
    if args and args[0] == '--check':
        sys.exit(check(args[1:]))
    local = None
    if '--local' in args:
        i = args.index('--local')
        local = args[i + 1] if i + 1 < len(args) else os.environ.get('ORTHO_LOCAL_DIR', str(ROOT.parent / 'ortho-local'))
    sys.exit(build(local))
