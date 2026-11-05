# Build status: paused on Ed's instruction, 5 November 2026

Paused a second time to save Ed's allowance. Resume when he says so. Nothing is live: `main` is untouched.

## Done
- Scaffold, schema (STYLE.md), agent brief, review brief, manifest, build.py, audit.py, verify_sources.py,
  ortho.css, ortho.js, robots and site-check exclusions, README notes. All on branch `ortho-textbook`.
- Part B written. 46 of 60 procedure cards drafted and passing the check. Part A chapters drafted:
  a01-tourniquet, a02-cement-bcis, a08-neuraxial-vs-ga, a09-eras-day-case, a10-the-orthopaedic-patient.
- Source verification (verify_sources.py, Crossref and PubMed) run over everything drafted up to 5 Nov; the
  real problems found were fixed. The remaining flagged lines are false positives (truncated Crossref titles,
  group authors) plus `amputation` source [10] (cited Hsu, Crossref says Cohen) which still needs a look.
- Anatomic versus reverse pain reconciled with Jones JSES 2025 (anatomic moved to score 4; reverse trajectory
  matched; b01 and STYLE anchors updated).
- Preview artifact republished with the 46 cards and 6 chapters (private).

## Not done
- Independent clinical review (REVIEW-BRIEF.md): two reviewer runs were started and stopped before reporting;
  no card has been reviewed yet.
- Local layer: nothing written; /home/claude/ortho-local holds only PASSPHRASE.txt.
- Cards still to write (14):
19  trapeziectomy-wrist-fusion
20  hand-trauma
33  multiligament-knee
34  hto-dfo
38  periprosthetic-fracture
43  pelvic-acetabular-fixation
44  humeral-shaft-fixation
45  open-fractures-damage-control
46  compartment-syndrome-fasciotomy
49  removal-of-metalwork
50  polytrauma-sequencing
56  adult-deformity-scoliosis
57  spinal-fracture-fixation
60  si-joint-fusion-coccygectomy
- Part A chapters still to write (9): a03-fat-embolism, a04-blood-management-txa, a05-vte, a06-positioning, a07-block-menu, a11-nerve-injury-compartment, a12-opioid-tolerant, a13-antibiotics-infection, a14-spine-essentials

## To resume (cheapest order)
1. Local layer first (one agent; it needs no web research beyond MBS item lookups).
2. Remaining cards and chapters, two or three agents at a time, same prompts as before (AGENT-BRIEF.md).
3. `python3 ortho/verify_sources.py` on the new files; `python3 ortho/audit.py` for cross-card consistency.
4. Independent review, two agents at a time over REVIEW-BRIEF.md; apply the findings.
5. Rebuild with `--local`, republish the preview, then wait for Ed's word before fast-forwarding `main`.
