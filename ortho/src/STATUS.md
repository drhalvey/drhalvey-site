# Build status: paused on Ed's instruction, 22 October 2026

Paused because the drafting runs were consuming Ed's session allowance. Resume when Ed says so (he said
next week). Nothing here is live: `main` is untouched and GitHub Pages serves only `main`.

## Done
- Scaffold, schema (STYLE.md), agent brief, manifest, build.py, audit.py, ortho.css, ortho.js, robots and
  site-check exclusions, README notes. All committed on branch `ortho-textbook`.
- Part B (b01-why-operations-hurt) written and checked.
- 34 of 60 procedure cards drafted (see the files in src/cards). Cards failing the check at the
  time of the pause, which means an agent was interrupted mid-write: none.
- Part A chapters drafted: a01-tourniquet, a08-neuraxial-vs-ga, a09-eras-day-case, a10-the-orthopaedic-patient.
- Preview artifact published (private) with the first six cards and Part B; it needs republishing after
  the next build. Passphrase for the local layer lives in /home/claude/ortho-local/PASSPHRASE.txt in the
  session workspace; the local layer itself has no content yet, so a fresh passphrase can be generated.

## Still to do
Cards (26):
10  shoulder-arthroscopy-debridement
18  wrist-arthroscopy-scaphoid
19  trapeziectomy-wrist-fusion
20  hand-trauma
26  periacetabular-osteotomy
31  knee-arthroscopy
32  acl-reconstruction
33  multiligament-knee
34  hto-dfo
35  knee-mua-arthrolysis
36  quads-patellar-tendon-repair
37  periprosthetic-joint-infection
38  periprosthetic-fracture
43  pelvic-acetabular-fixation
44  humeral-shaft-fixation
45  open-fractures-damage-control
46  compartment-syndrome-fasciotomy
47  amputation
48  osteomyelitis-septic-arthritis
49  removal-of-metalwork
50  polytrauma-sequencing
56  adult-deformity-scoliosis
57  spinal-fracture-fixation
58  spinal-metastasis-vertebroplasty
59  scs-intrathecal-pump
60  si-joint-fusion-coccygectomy

Part A chapters (10): a02-cement-bcis, a03-fat-embolism, a04-blood-management-txa, a05-vte, a06-positioning, a07-block-menu, a11-nerve-injury-compartment, a12-opioid-tolerant, a13-antibiotics-infection, a14-spine-essentials

Local layer: nothing written yet (the agent read the MBS and Duff skills and was interrupted before writing).

## To resume
1. Re-read ortho/src/AGENT-BRIEF.md and STYLE.md. Launch one agent per remaining batch with the same
   prompts as before, listing only the ids above; fix or delete any card that fails
   `python3 ortho/build.py --check`.
2. Then the audit pass: `python3 ortho/audit.py`, resolve the cross-card notes (reverse versus anatomic
   pain ordering per Jones JSES 2025; standardise the Barry, Rhyner and Kang citations; reword the one
   "honestly" in b01), an independent reviewer agent over every card, rebuild with
   `python3 ortho/build.py --local <plaintext local dir>`, republish the preview, then wait for Ed's word
   before fast-forwarding `main`.
