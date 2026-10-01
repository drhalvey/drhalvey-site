#!/usr/bin/env python3
"""Pre-publish copy check for drhalvey.com.au.

Run from the repo root:  python3 scripts/check_copy.py [files...]
With no files it checks every public page. Exit code 1 = a hard rule is broken (do not publish).
Warnings are for a human to read: a timeframe may be a rule (fasting, 24 hours, stop days) or a
prediction (block lasts 12-24 hours), and only a person can tell which.

Hard rules (from the project instructions):
  em dashes; "very safe"; "extremely rare/uncommon"; the pain team "reviews daily"; timing tools called
  "exact"; robots.txt must allow the site and disallow /tools/; tools/pain-relief.html must stay noindex.
"""
import os, re, sys
from html.parser import HTMLParser

SKIP = {'404.html', 'clinicians.html'}
HARD = [
    (r'—', 'em dash'),
    (r'\bvery safe\b', '"very safe" (superlative)'),
    (r'\bextremely (rare|uncommon|unlikely|low)\b', '"extremely ..." (superlative)'),
    (r'\bvery low risk\b', '"very low risk" (superlative)'),
    (r'\breview\w* (you |your \w+ )?(daily|every day)\b', 'pain team reviews daily'),
    (r'\b(planner|calculator|tool)\b[^.]{0,60}\bexact\w*', 'timing tool called exact'),
    (r'\bexact\w*\b[^.]{0,40}\b(planner|calculator)\b', 'timing tool called exact'),
    (r'\b(world.class|guarantee\w*)\b', 'superlative or guarantee'),
    (r'\b(testimonial|five.star|patients say)\b', 'testimonial (AHPRA)'),
]
SOFT = re.compile(r'\b(the best|best chance|safest)\b', re.I)
DUR = re.compile(r'\b(?:about |around |within |for |usually |typically )?(?:\d+(?:\.\d+)?\s*(?:-|to|–)\s*)?\d+(?:\.\d+)?\s*(minutes?|mins?|hours?|hrs?|days?|weeks?|months?)\b|\bwithin (?:a few|a couple of) (minutes|hours|days|weeks)\b', re.I)
# timeframes that are rules or plans, not predictions
ALLOW = re.compile(r'(\b6 hours\b|\b2 hours\b|\b1 hour\b|\b3 hours\b|\b4 hours\b|24 hours|200 ?ml|\bdays? before\b|\bweeks? before\b|before (surgery|your|the|anaesthe|admission|bed)|'
                   r'\bfor \d+ (days|weeks)\b[^.]{0,30}(taken|regular|prescri|course|tablet)|(taken|regular|prescri|course)[^.]{0,40}\bfor \d+|after (the )?(first|last) dose|hours? an hour|per hour|'
                   r'\b(every|each) \d+ hours\b|\d+ ?hourly|in 24 hours|over 6 weeks in patients)', re.I)

class Text(HTMLParser):
    def __init__(self):
        super().__init__(); self.out = []; self.skip = 0; self.robots = ''
    def handle_starttag(self, t, a):
        if t in ('script', 'style', 'noscript'): self.skip += 1
        if t == 'meta' and dict(a).get('name') == 'robots': self.robots = dict(a).get('content', '')
        if t in ('p', 'li', 'td', 'th', 'h1', 'h2', 'h3', 'h4', 'div', 'br', 'tr'): self.out.append('\n')
    def handle_endtag(self, t):
        if t in ('script', 'style', 'noscript'): self.skip -= 1
    def handle_data(self, d):
        if not self.skip: self.out.append(d)

def sentences(text):
    for block in text.split('\n'):
        block = re.sub(r'\s+', ' ', block).strip()
        if block:
            for s in re.split(r'(?<=[.!?])\s+', block):
                yield s

def check_file(path):
    hard, warn = [], []
    raw = open(path, encoding='utf-8').read()
    p = Text(); p.feed(raw)
    if 'noindex' in p.robots and not path.startswith('tools/'):
        warn.append(('noindex', 'page is hidden from Google (draft?)'))
    for s in sentences(''.join(p.out)):
        for rx, why in HARD:
            if re.search(rx, s, re.I): hard.append((why, s[:200]))
        if SOFT.search(s): warn.append(('superlative', s[:200]))
        for m in DUR.finditer(s):
            if not ALLOW.search(s):
                warn.append(('timeframe', s[:200])); break
    return hard, warn

def main(argv):
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); os.chdir(root)
    files = argv or sorted(f for f in os.listdir('.') if f.endswith('.html') and f not in SKIP) + \
        sorted('animations/' + f for f in os.listdir('animations') if f.endswith('.html'))
    nh = nw = 0
    for f in files:
        hard, warn = check_file(f)
        for why, s in hard: print(f'HARD  {f}: {why}: {s}'); nh += 1
        for why, s in warn: print(f'warn  {f}: {why}: {s}'); nw += 1
    # site-wide rules
    rb = open('robots.txt').read()
    if not re.search(r'(?m)^Disallow:\s*/tools/', rb) or re.search(r'(?m)^Disallow:\s*/\s*$', rb):
        print('HARD  robots.txt: must allow the site and disallow /tools/ only'); nh += 1
    if 'noindex' not in open('tools/pain-relief.html').read():
        print('HARD  tools/pain-relief.html: noindex missing'); nh += 1
    print(f'\n{nh} hard problem(s), {nw} warning(s) to read.')
    return 1 if nh else 0

if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
