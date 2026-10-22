# Orthopaedic Anaesthesia: Surgery First. Writing guide and schema

This is the rulebook for every file under `ortho/src/`. The build (`ortho/build.py`) renders the
cards and chapters into static HTML. Anything that breaks the schema breaks the build, and anything
that breaks the writing rules gets rejected at audit.

## 1. What the book is

A surgery-first reference for a consultant anaesthetist. Each procedure card explains what the
surgeon is trying to achieve, what that does to tissue, and therefore what it predicts about pain,
position, blood loss, duration and the traps. The reader is an experienced anaesthetist ("you").
The book does not teach how to do a block or how to intubate; it tells you which block, why, and
what will go wrong at step 7 if you have not planned for it.

The angle that makes it different from existing texts: every anaesthetic statement is tied to a
surgical reason. "Rotator cuff repair hurts because a retracted, degenerate tendon has been pulled
back onto a bleeding bony footprint under tension and will be loaded by every movement" is the
standard. "Rotator cuff repair is painful" is not.

## 2. Writing rules (all mandatory)

1. UK English: anaesthesia, orthopaedic, paediatric, haemorrhage, oedema, litre, metre, programme.
2. No em dashes anywhere, in any file, in any field. Use a comma, a colon, brackets or a full stop.
   The site check fails the commit on an em dash. En dashes in number ranges are also avoided:
   write "90-150 min" with a plain hyphen.
3. Never write a question as content. No "Why?", no "Check?", no stray question marks in fields.
   If something is unknown write "not known" or "not recorded". Questions for the author go in
   the chat, never in the file.
4. No notes to the author inside content. No "confirm with", "ask the surgeon", "TODO", "check
   this". State what is known; omit what is not.
5. No flattery, no hedging padding, no "it is important to note". State the mechanism and move on.
6. Causal chains, not assertions. Every "do X" carries its "because Y". Prefer the shape
   "The surgeon does A to achieve B. That means C for the tissue, so expect D and plan E."
7. Drug names: Australian approved names (adrenaline, noradrenaline, lidocaine is written
   lignocaine only when quoting a label; use lidocaine). Doses with units and route: "TXA 1 g IV",
   "dexamethasone 8 mg IV", "ropivacaine 0.5% 15 mL". Times in minutes or hours, not fractions.
8. Units: SI, metric. Pressures in mmHg. Volumes in mL and L. Money in AUD (local layer only).
9. Predictions are allowed here: this is a clinician reference, not patient copy. "Expect worst
   pain on day 1 and 2" is correct usage. Rules in the patient-site checker about timeframes do
   not apply to `ortho/`.
10. Evidence claims must be sourced or hedged. Three tiers of statement:
    - sourced: a specific claim (effect size, incidence, guideline recommendation) carries a source
      in the `sources` list and is written "PROSPECT recommends..." or "in the 179-procedure cohort...".
    - consensus: standard textbook physiology or widely practised technique needs no source.
    - author's judgement: an opinion on the best block or catheter decision is written as
      "the defensible default is..." or "the author's practice is..." and is never dressed up
      as evidence.
11. Never invent a source. A source goes in the list only if you have seen it in a web search
    result or a fetched page during drafting. Record the DOI or PubMed URL, the first author,
    journal and year, and one line on what it actually says. If you cannot find a source for a
    claim you believe is true, keep the claim as author's judgement and leave it unsourced.
12. Keep surgeon names, hospital names and Ed's own regimens OUT of core files. Those belong in
    the local layer (`src/local/`, never committed in plain text). A core card says "surgeons vary:
    some cement the glenoid, some do not"; it never says "Mr X cements".
13. Length: a card body of 1,500 to 3,500 words. Steps: 6 to 14. Part A chapters: 1,500 to
    3,500 words. Dense beats long.
14. Diagrams: an ASCII diagram inside a fenced code block is welcome where a picture of a flow,
    a force or a position helps. Keep it under 20 lines wide and 80 characters. Schematic SVG
    diagrams are added later by the editor; do not attempt SVG in source files.
15. Headings in sentence case. No bold runs longer than a few words. No emoji.
16. Numbers: "2 g", "20-30 cm", "1 in 1,000", "15%". Spell out one to nine in prose except with
    units.

## 3. The pain scale (Part B defines it; every card uses it)

`pain.score` is a whole number 1 to 5. It describes the pain the operation produces when the
recommended plan on the card is in place, not pain with no analgesia.

| Score | Label | What it means for the plan | Anchors |
| --- | --- | --- | --- |
| 1 | Minimal | Simple analgesia only. Day case. Any block is for the anaesthetic, not for pain. | carpal tunnel release, knee arthroscopy (meniscectomy), minor removal of metalwork |
| 2 | Mild to moderate | Regular paracetamol and NSAID; a few opioid doses on day 0-1; a single-shot block helps but the patient copes without a catheter. | subacromial decompression, distal radius ORIF, hip arthroscopy, primary THA with spinal and infiltration, lumbar microdiscectomy |
| 3 | Moderate | A block or neuraxial technique is expected; opioids needed day 0-2; worst pain day 1-2, then a quick fall because the mechanism is bone. | anatomic TSA, ACL reconstruction, hip hemiarthroplasty, ankle ORIF, ACDF, elbow fracture fixation |
| 4 | Severe | Catheter or a robust multimodal plan; opioids day 0-3; rebound pain when a single-shot block wears off is a real problem; movement-evoked pain limits physiotherapy. | primary TKA, reverse TSA, Latarjet, high tibial osteotomy, posterior lumbar fusion |
| 5 | Severe and prolonged | Catheter has the strongest claim; pain persists beyond 72 h and is re-provoked by movement for weeks; the dominant mechanism is tissue under tension or a bone that keeps being loaded. The early peak need not be higher than a 3 or 4; the shape of the curve afterwards is what earns the 5. | rotator cuff repair, multiligament knee reconstruction, periacetabular osteotomy, scoliosis correction, amputation |

`pain.trajectory` is a list of five whole numbers: the expected worst pain (0-10 numeric rating)
on the evening of surgery, day 1, day 2, day 3 and day 7, with the recommended plan in place.
The day 0 figure assumes the block is working, so a well-blocked shoulder is 1-2 on day 0 and the
rebound shows on day 1.

`pain.mechanism` is one tag from this list (the dominant driver; name others in `mechanism_text`):

| tag | meaning |
| --- | --- |
| bone | osteotomy, reaming, broaching, drilling, cement interface: moderate, short, NSAID-responsive |
| tendon-tension | a tendon or ligament repaired or reattached under tension and loaded by movement: severe, prolonged |
| retension | the joint has been re-tensioned or the limb lengthened (reverse TSA, TKA balancing, osteotomy correction): deep ache and stiffness pain |
| capsule | capsular release, distension, labral work, synovectomy: sharp with movement, settles in days |
| muscle | muscle split, release or lengthening, or a large soft-tissue dissection: aching, position-dependent |
| periosteum | subperiosteal stripping or plating along a long bone: raw, incisional and deep |
| nerve | nerve handling, traction or decompression: neuropathic flavour, dysaesthesia |
| tourniquet | ischaemia-reperfusion and cuff-site pain after a long tourniquet |
| surface | arthroscopic portals and irrigation only: minimal |
| visceral | retroperitoneal or anterior approaches where the pain is wall-and-viscera rather than bone |

`pain.rebound_risk` is `low`, `moderate` or `high`: how badly things go when a single-shot block
wears off at 2 am.

## 4. Index filter vocabulary (exact strings)

- `group`: `Upper limb`, `Hip and knee`, `Trauma`, `Spine` (from the manifest; do not change)
- `region`: `Shoulder`, `Elbow`, `Wrist and hand`, `Hip`, `Knee`, `Trauma`, `Spine`
- `block.family`: `interscalene`, `brachial-plexus-distal` (supraclavicular, infraclavicular,
  axillary), `peripheral-upper-limb` (wrist blocks, WALANT, distal nerve blocks),
  `lumbar-plexus-femoral` (femoral, fascia iliaca, PENG, lumbar plexus), `adductor-canal`,
  `sciatic-popliteal`, `ipack-genicular`, `neuraxial`, `fascial-plane` (ESP, QL, TAP),
  `local-infiltration` (surgeon LIA only), `none`
- `block.catheter`: `routine`, `selective`, `rarely`, `no`
- `block.neuraxial`: `yes` (usual technique), `option`, `no`
- `position`: `beach-chair`, `lateral`, `supine`, `supine-arm-table`, `prone`, `traction-table`,
  `supine-bump`, `lithotomy`
- `tourniquet`: `yes`, `no`, `sometimes`
- `cement`: `yes`, `no`, `sometimes`
- `day_case`: `yes`, `selected`, `no`

## 5. Card schema (src/cards/<id>.md)

YAML front matter between `---` lines, then Markdown body with the fixed section headings below.
Quote any YAML string that contains a colon, a hash, a quote or starts with a special character.
Use `>` folded scalars for long text.

```
---
id: anatomic-tsa
title: "Anatomic total shoulder arthroplasty"
subtitle: "Stemmed, stemless, hemiarthroplasty and humeral head resurfacing"
aka: ["TSA", "aTSA", "total shoulder replacement", "hemiarthroplasty", "stemless"]
pain:
  score: 3
  trajectory: [2, 5, 4, 3, 2]
  mechanism: bone
  mechanism_text: "Humeral head osteotomy and glenoid reaming; subscapularis repair; cuff and capsule left at native tension"
  rebound_risk: moderate
block:
  primary: "Interscalene brachial plexus block, single shot, with dexamethasone"
  family: interscalene
  catheter: selective
  catheter_text: "Reserve for opioid-tolerant, revision or prior painful shoulder surgery"
  alternatives: ["Superior trunk block (phrenic sparing)", "Suprascapular plus axillary nerve blocks"]
  neuraxial: no
position: beach-chair
position_text: "Beach chair, head fixed, arm free on a support"
tourniquet: no
tourniquet_text: ""
cement: sometimes
cement_text: "Glenoid component usually cemented; humeral component usually press-fit"
blood_loss: "200-400 mL; transfusion uncommon"
duration: "90-150 min"
los: "1-2 nights"
day_case: selected
drugs:
  antibiotic: "Cefazolin 2 g IV at induction"
  txa: "TXA 1 g IV at induction"
  vte: "Mechanical; chemoprophylaxis only for high-risk patients"
  antiemetic: "Dexamethasone 8 mg IV and ondansetron 4 mg IV"
patient_line: "One sentence you could say to the patient about what to expect"
trap: "The single most important thing to get right, in one sentence"
sources:
  - title: "Toma O, et al. PROSPECT guideline for rotator cuff repair surgery. Anaesthesia 2019;74:1320-31"
    url: "https://doi.org/10.1111/anae.14796"
    note: "Recommends interscalene or suprascapular block, paracetamol, NSAID, dexamethasone"
---

## What the surgeon is doing and why
Markdown prose. First principles: the disease, the mechanical problem, the surgical solution,
what has to be cut, moved, tensioned or implanted to deliver it, and what is deliberately left
alone. End with the pain logic: which mechanisms from the Part B table apply and why.

## Steps
### 1. Step title
**Why:** what the surgeon is doing here and the reason.
**Anaesthesia:** what it means for you at this step: physiology, position, bleeding, timing,
the drug to have drawn up, the thing that goes wrong.

(repeat for each step; 6 to 14 steps)

## Pain plan
The recommended plan and why it fits the mechanism. Block choice and the catheter decision with
the reasoning. Adjuncts. The oral regimen shape (not Ed's doses: those are local layer).
Escalation triggers and what rebound looks like for this operation.

## Pitfalls and variants
Surgeon-to-surgeon and technique variants that change your plan. Complications that present to
you first. The patient phenotypes that break the standard plan.

## Key sources
Optional prose on how strong the evidence is. The links themselves live in the front matter.
```

The build reads `## Steps` and turns each `### n. Title` with its `**Why:**` and `**Anaesthesia:**`
paragraphs into a three-column row. Keep exactly those two labels, bold, at the start of their
paragraphs. A step may carry more than one paragraph under each label.

## 6. Chapter schema (src/chapters/<id>.md)

```
---
id: a01-tourniquet
title: "The tourniquet"
summary: "Three to five sentences: the chapter's bottom line, for the summary box"
sources: [ {title: "...", url: "...", note: "..."} ]
---
Markdown body. Open with the mechanism, then the practical rules, then the edge cases.
Cross-reference cards with a relative link: [reverse TSA](../c/reverse-tsa.html).
```

## 7. Local layer (src/local/<id>.json, NEVER committed in plain text)

```
{
  "mbs": [
    {"item": "20600", "label": "Initiation of management of anaesthesia for shoulder arthroplasty",
     "units": 12, "pick": true, "note": "why this item over the alternatives"}
  ],
  "regimen": "Ed's standard charted plan for this operation, as free text",
  "surgeons": [
    {"name": "Surgeon name", "notes": "what this surgeon does differently"}
  ],
  "notes": "anything else local"
}
```

The build encrypts the whole local folder into `ortho/data/local.enc.json`. Only the ciphertext is
committed. The plaintext source lives outside the repository on Ed's machine.

## 8. Audit checklist (what the reviewer rejects a card for)

- any em dash, any question mark used as content, any note to the author, any "TODO"
- a surgeon, hospital or named regimen in a core file
- a `pain.score` that disagrees with the scale table, or a trajectory that does not fit the score
- a block recommendation that does not follow from the stated mechanism
- a sourced-tier claim with no source, or a source not seen during drafting
- a step without both a Why and an Anaesthesia paragraph
- American spelling, missing units, a dose without a route
- padding, hedging, praise, or a sentence that would read as a statement to a patient
