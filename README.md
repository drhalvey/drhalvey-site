# drhalvey.com.au

Patient information website for Dr Ed Halvey, specialist anaesthetist, Perth WA.
Static HTML, no build step, no database, no patient data. Served by GitHub Pages from `main`;
a commit is live in about a minute.

## Layout

| Path | What it is |
| --- | --- |
| `index.html` | Home (v2 layout, photo hero, site search) |
| `pre-op-guidance.html`, `day-of-surgery.html`, `fasting.html`, `arrival-time.html`, `consent-and-assessment.html` | Before surgery guides |
| `medicines-before-surgery.html`, `glp1-before-surgery.html`, `medicine-timing.html` | Medicines guides and the planner |
| `procedures.html` + one page per procedure | Procedure guides |
| `animations/*-journey.html` | Four "watch your journey" players (Claude Design exports, slimmed) |
| `tools/pain-relief.html` | Code-gated pain relief plans. Display only. `noindex`, and blocked in `robots.txt` |
| `clinicians.html` | Clinician reference behind a soft PIN (not private) |
| `about`, `services`, `hospitals`, `fees`, `contact`, `clinical-research`, `glossary` | Practice pages |
| `downloads/` | Patient PDFs (not linked from any page) |
| `print/qr-card.html` | Printable QR card pointing to drhalvey.com.au |
| `rally/`, `deuce/`, `billing-sheet/` | Privacy policy and terms pages for Ed's iOS apps |
| `assets/` | `style.css`, fonts, images (JPEG originals plus WebP sizes), search and feedback scripts |
| `404.html`, `sitemap.xml`, `robots.txt`, `CNAME`, `.nojekyll` | Site plumbing |

## Automatic check

`.github/workflows/site-check.yml` runs `.github/scripts/site-check.py` after every push. It never stops
the site going live. A problem gives the commit a red cross and GitHub emails the owner. It checks:

- `robots.txt` still allows the site and blocks `/tools/` (in the repo and on the live site)
- the pain relief tool keeps its `noindex` tag
- internal links, images and sitemap entries point at files that exist
- copy rules: no em dashes, tools never called "exact", no testimonials, no "pain team reviews everyone daily"
- warnings only: specific clinical timeframes and superlatives, for Ed to judge

Run it locally with `python3 .github/scripts/site-check.py`.

## Re-exported animations

After exporting a journey animation from Claude Design:

1. Re-apply the head fixes: page title, `<link rel="icon" href="../favicon.svg">`, CSS hiding the Export video button.
2. Slim it: `npm install esbuild` once, then `node .github/scripts/slim-animation.mjs animations/<name>-journey.html`.
   This pre-compiles the scripts so the 3 MB in-browser compiler is not shipped, and removes duplicate fonts
   (about 1.6 MB down to 0.33 MB). Words and motion are unchanged.

## Images

Photos keep the JPEG original as a fallback, with WebP copies at 800, 1200 and 1600 px wide served through
`<picture>`. `picture{display:contents}` in `style.css` keeps layout identical.

## Rules

Clinical wording is only published after Ed's explicit yes. No testimonials, patient stories or outcome claims (AHPRA).
Plain English, UK spelling, sentence case, no em dashes. Rollback: open the commit on GitHub, then Revert.
