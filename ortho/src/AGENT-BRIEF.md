# Brief for drafting agents

You are drafting content for "Orthopaedic Anaesthesia: Surgery First", a clinician reference written for
one consultant anaesthetist (Dr Ed Halvey, Perth) and published on a hidden page of his website. The book's
angle: every anaesthetic statement is tied to what the surgeon is doing and why. Read these before writing
anything, in this order:

1. `ortho/src/STYLE.md`: the writing rules, the pain scale, the filter vocabulary and the file schema. Every rule
   is mandatory. Em dashes break the site's commit check; question marks and notes to the author break the audit.
2. `ortho/src/cards/anatomic-tsa.md` and `ortho/src/cards/rotator-cuff-repair.md`: the two exemplar cards.
   Match their depth, their causal "the surgeon does A to achieve B, so expect C" shape, and their honesty about
   where the evidence runs out. Do not copy their sentences.
3. `ortho/src/manifest.yaml`: the only valid card ids, titles, groups and regions. Use the id as the file name
   and the title exactly as given. Cross-link other cards only by their manifest id (`<id>.html`, relative,
   same folder) and chapters as `../a/<id>.html` or `../b/<id>.html`.

## Research

Search the web for each procedure before writing. Priorities, in order: a PROSPECT procedure-specific
guideline (esraeurope.org hosts the summaries; PROSPECT guidelines exist for total hip arthroplasty, total knee
arthroplasty, hip fracture, rotator cuff repair, complex spine surgery, and others), the Gerbershagen 2013
179-procedure pain cohort (Anesthesiology 2013;118:934-944, doi 10.1097/ALN.0b013e31828866b3, which ranked open
calcaneal reduction, spinal fusion and scoliosis surgery, foot arthrodesis, metacarpophalangeal arthrodesis and
open knee ligament reconstruction among the most painful of all operations), the major randomised trials and
meta-analyses for the block and catheter decision, and surgical technique references for the steps.

Fetching is unreliable: pubmed.ncbi.nlm.nih.gov, pmc.ncbi.nlm.nih.gov and sciencedirect.com usually block the
fetch tool. What works: doi.org links that resolve to Wiley, Springer or BMJ pages; esraeurope.org; apsf.org;
orthobullets.com evidence pages; the Europe PMC REST API, one fetch at a time and never two in quick succession:
`https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:<pmid>%20AND%20SRC:MED&resultType=core&format=json`
(or `query=DOI:<doi>` or a title in quotes). A search result that shows the title, authors and a usable snippet
counts as "seen" for the source rule; a half-remembered citation does not. Never invent a DOI, a page number or
an effect size. If a number cannot be verified, write the claim without the number or drop it. Keep to about six
searches and three fetches per card; the aim is a sound card, not a systematic review.

## Writing

Write each card straight into `ortho/src/cards/<id>.md`. Then run
`python3 ortho/build.py --check ortho/src/cards/<id>.md` from the repository root (`/home/claude/drhalvey-site`)
and fix every reported problem until it prints `ok`. Do not edit any other file, do not run the full build,
do not run git, and do not create files outside `ortho/src/cards/`.

Calibrate pain scores against the STYLE.md table and the two exemplars (anatomic TSA is a 3, rotator cuff repair
is a 5 because of duration and movement-evoked pain rather than peak intensity). The trajectory is worst pain
0-10 on day 0 (evening, block working), 1, 2, 3 and 7 with the card's recommended plan in place. Make the block
and catheter recommendation follow from the stated mechanism, and say when it is author's judgement rather than
evidence. The reader is a consultant: no explanations of what a tourniquet is, no teaching of block technique.

Nothing local goes in a card: no surgeon names, no hospital names, no specific charted regimens. Say "surgeons
vary" and describe the variants.

## Report

When all cards in your batch pass the check, report: for each card, the word count, number of steps, pain score,
mechanism tag, catheter decision, and any claim you believed but could not source (so it stayed unsourced or was
dropped). Keep the report under 400 words.
