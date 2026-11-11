# Build status: complete draft, 11 November 2026

All 60 cards, Part B and all 14 Part A chapters are written, pass the build check and are on branch
`ortho-textbook`. `main` is untouched: nothing is live until Ed says so.

- Sources: verify_sources.py run over all 746 citations; residual flags are diacritics, truncated Crossref
  titles and three author-order mismatches (acl-reconstruction [3], amputation [10],
  osteomyelitis-septic-arthritis [7]) where Crossref and the citation disagree on the first author.
- Independent clinical review: three batches covering all 60 cards and chapters b01, a01-a11; findings applied.
  NOT reviewed: a12-opioid-tolerant, a13-antibiotics-infection, a14-spine-essentials.
- Left as the author's call: si-joint-fusion-coccygectomy scored 3 (reviewer suggested 2);
  slap-repair-biceps-tenodesis tagged tendon-tension with catheter "no".
- Local layer: 60 files in the session workspace (/home/claude/ortho-local, not in the repo), encrypted into
  ortho/data/local.enc.json. Surgeon preferences beyond Duff and Collopy are "not recorded".
- To go live: fast-forward `main` to `ortho-textbook` and verify robots.txt, noindex and the search index.
