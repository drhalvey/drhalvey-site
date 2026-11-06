# Build status: paused on Ed's instruction, 5 November 2026 (16:27)

Paused a third time to save Ed's allowance. Resume only when he says so. Nothing is live: `main` is untouched.

## Done
- Scaffold, schema (STYLE.md), agent brief, review brief, manifest, build.py (with the whole-book page
  book.html), audit.py, verify_sources.py, ortho.css, ortho.js, robots and site-check exclusions, README.
- Part B written. 48 of 60 procedure cards drafted and passing the check.
- Part A chapters drafted: a01-tourniquet, a02-cement-bcis, a03-fat-embolism, a08-neuraxial-vs-ga, a09-eras-day-case, a10-the-orthopaedic-patient.
- Source verification run over everything drafted to 5 Nov 10:00; real problems fixed.
- Independent clinical review batch 1 (23 cards plus b01, a01, a02) done and all 35 findings applied
  (commit "apply independent review, batch 1"). Batch 2 (the other 23 cards plus a08-a10) was stopped before
  it reported: those files are NOT yet reviewed.
- Anatomic versus reverse pain reconciled with Jones JSES 2025.
- Local layer: 1 JSON files in /home/claude/ortho-local (general).

## Not done
- Cards still to write (12):
20  hand-trauma
33  multiligament-knee
34  hto-dfo
38  periprosthetic-fracture
43  pelvic-acetabular-fixation
44  humeral-shaft-fixation
46  compartment-syndrome-fasciotomy
49  removal-of-metalwork
50  polytrauma-sequencing
56  adult-deformity-scoliosis
57  spinal-fracture-fixation
60  si-joint-fusion-coccygectomy
- Part A chapters still to write (8): a04-blood-management-txa, a05-vte, a06-positioning, a07-block-menu, a11-nerve-injury-compartment, a12-opioid-tolerant, a13-antibiotics-infection, a14-spine-essentials
- Independent review of: periacetabular-osteotomy, periprosthetic-joint-infection, posterior-cervical-fusion,
  posterior-lumbar-fusion, primary-tka, proximal-humerus-fracture, quads-patellar-tendon-repair, reverse-tsa,
  revision-tha, revision-tka, rotator-cuff-repair, scs-intrathecal-pump, shoulder-arthroscopy-debridement,
  shoulder-stabilisation, slap-repair-biceps-tenodesis, spinal-metastasis-vertebroplasty,
  subacromial-decompression-acj, tha-anterior-lateral, tha-posterior, tibial-nailing-plateau,
  total-elbow-radial-head, unicompartmental-knee, wrist-arthroscopy-scaphoid, a08, a09, a10, plus every file
  written after 5 Nov 10:00 and the remaining local layer.
- verify_sources.py and audit.py on the files written after 5 Nov 10:00.

## To resume (cheapest order)
1. Local layer (one agent, same prompt as before; it reads skills, little web).
2. Remaining cards and chapters, two agents at a time (AGENT-BRIEF.md).
3. `python3 ortho/verify_sources.py`; `python3 ortho/audit.py`; fix.
4. Review batch 2 and a batch 3 for the new files (REVIEW-BRIEF.md); apply.
5. `python3 ortho/build.py --local /home/claude/ortho-local`, republish the preview, then Ed's word before
   fast-forwarding `main`.
