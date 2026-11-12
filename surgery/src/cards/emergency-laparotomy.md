---
id: emergency-laparotomy
title: "Emergency laparotomy"
subtitle: "Perforation, obstruction, ischaemia, bleeding and anastomotic leak: source control, resection, stoma, damage control and the open abdomen"
aka: ["EL", "emergency midline laparotomy", "perforated viscus", "perforated ulcer", "Hartmann's procedure", "bowel obstruction", "ischaemic bowel", "faecal peritonitis", "anastomotic leak", "damage control laparotomy", "relook", "NELA", "ANZELA"]
pain:
  score: 4
  trajectory: [5, 6, 5, 4, 3]
  mechanism: abdominal-wall
  mechanism_text: "A full-length midline incision through the linea alba, closed under tension over oedematous bowel and loaded by every cough and every move up the bed; beneath it inflamed peritoneum, handled bowel, drains and often a stoma through rectus"
  rebound_risk: moderate
block:
  primary: "Bilateral rectus sheath catheters (surgeon-placed at closure or ultrasound-guided) with paracetamol and opioid PCA; thoracic epidural for the haemodynamically stable, non-coagulopathic patient with poor respiratory reserve. The block is one part of a strategy that is decided at the end of the case, not the start"
  family: fascial-plane
  catheter: routine
  catheter_text: "A midline wound hurts on movement for five days or more, so a continuous technique is the default: rectus sheath catheters when sepsis, coagulopathy or vasopressors rule out an epidural, which is most of the time"
  alternatives: ["Thoracic epidural T8-T10 (stable, clotting normal, no vasopressor requirement)", "Single-shot rectus sheath or subcostal TAP blocks when catheters are not available", "Intravenous lidocaine or low-dose ketamine infusion with PCA where no regional technique is possible", "Intrathecal morphine before induction in the stable patient with obstruction (author's judgement, limited evidence)"]
  neuraxial: option
position: supine
position_text: "Supine, arms out on boards with access to both; Lloyd-Davies when the left colon or rectum is the likely source or a stapled anastomosis from below is possible"
tourniquet: "no"
tourniquet_text: ""
cement: "no"
cement_text: ""
blood_loss: "200-500 mL in most; litres in haemorrhage, ischaemic bowel resection, dense adhesiolysis or re-operation. Third-space and septic vasodilatory losses usually exceed the blood loss"
duration: "90-240 min; a damage-control laparotomy is deliberately under 90 min"
los: "7-14 days; far longer for the frail, for stomas and for the open abdomen"
day_case: "no"
drugs:
  antibiotic: "Broad-spectrum cover within 60 min of recognising sepsis and before incision, to local protocol for intra-abdominal infection (for example piperacillin-tazobactam 4.5 g IV, or amoxicillin, gentamicin and metronidazole); re-dose in long cases and after major blood loss"
  txa: "TXA 1 g IV for major haemorrhage; not routine"
  vte: "Intermittent pneumatic compression in theatre; low molecular weight heparin once haemostasis is secure and timed around any epidural; extended prophylaxis for cancer resections"
  antiemetic: "Ondansetron 4 mg IV; the nasogastric tube on free drainage is the main antiemetic. Dexamethasone at the anaesthetist's discretion: stress-dose hydrocortisone 100 mg IV instead if the patient takes long-term steroid"
extras:
  - label: "Risk and escalation"
    value: "Calculate a mortality risk (NELA or equivalent) and a Clinical Frailty Scale before theatre. Predicted mortality of 5% or more: consultant surgeon and anaesthetist present, arterial line, and a critical care bed"
  - label: "Fasting and aspiration risk"
    value: "Always a full stomach. Aspirate the nasogastric tube and leave it on free drainage before a rapid sequence induction"
  - label: "Lines and monitoring"
    value: "Arterial line before induction in the septic or unstable patient; two large cannulae; central line when a vasopressor infusion is likely to continue; cardiac output monitoring by preference; urinary catheter; temperature"
  - label: "Blood products"
    value: "Group and screen for all; crossmatch and a major haemorrhage plan for bleeding, ischaemia and re-operation. Check lactate, haemoglobin and clotting on arrival and hourly"
  - label: "Ventilation"
    value: "Lung protective: 6-8 mL/kg predicted body weight, PEEP 5-10 cmH2O. A distended abdomen splints the diaphragm until it is opened"
  - label: "Critical care"
    value: "Decide extubation at the end of the case from lactate trend, vasopressor dose, temperature and gas exchange. Leave intubated for an open abdomen, a rising noradrenaline requirement or a planned relook"
patient_line: "This is a major emergency operation through a long cut down the middle of the abdomen; you will wake with tubes and drips, the wound hurts most on moving and coughing for about a week, and most people need one to two weeks in hospital, sometimes starting in intensive care."
trap: "The patient is at their worst at induction: hypovolaemic, vasodilated and full of bowel content, so the arterial line, the vasopressor and the resuscitation go in before the propofol, and the dose of everything is smaller than habit suggests"
sources:
  - title: "Peden CJ, Aggarwal G, Aitken RJ, et al. Guidelines for perioperative care for emergency laparotomy Enhanced Recovery After Surgery (ERAS) Society recommendations: Part 1, preoperative: diagnosis, rapid assessment and optimization. World J Surg 2021;45:1272-1290"
    url: "https://doi.org/10.1007/s00268-021-05994-9"
    note: "Consensus guideline, twelve preoperative components: early identification of physiological derangement and sepsis, risk scoring, early imaging, antibiotics and source control, frailty assessment in older patients"
  - title: "Scott MJ, Aggarwal G, Aitken RJ, et al. Consensus guidelines for perioperative care for emergency laparotomy Enhanced Recovery After Surgery (ERAS) Society recommendations Part 2: emergency laparotomy, intra- and postoperative care. World J Surg 2023;47:1850-1880"
    url: "https://doi.org/10.1007/s00268-023-07020-6"
    note: "Twenty-three intraoperative and postoperative components by modified Delphi; notes that much of the evidence is extrapolated from elective surgery or emergency general surgery and not specific to laparotomy"
  - title: "Peden CJ, Stephens T, Martin G, et al. Effectiveness of a national quality improvement programme to improve survival after emergency abdominal surgery (EPOCH): a stepped-wedge cluster-randomised trial. Lancet 2019;393:2213-2221"
    url: "https://doi.org/10.1016/s0140-6736(18)32521-2"
    note: "Nearly 16,000 patients in UK hospitals: 90-day mortality 16% in both the quality improvement and usual care groups (HR 1.11, 0.96-1.28); a care pathway on paper did not improve survival without the time and resources to deliver it"
  - title: "Parmar KL, Law J, Carter B, et al. Frailty in older patients undergoing emergency laparotomy: results from the UK observational Emergency Laparotomy and Frailty (ELF) study. Ann Surg 2021;273:709-718"
    url: "https://doi.org/10.1097/sla.0000000000003402"
    note: "A fifth of adults over 65 having emergency laparotomy were frail; mortality rose with each frailty grade independent of age (Clinical Frailty Scale 6-7 adjusted OR 6.10 versus scale 1), as did complications and length of stay"
  - title: "Passi NN, Gupta A, Lusby E, et al. Analgesia for emergency laparotomy: a systematic review. Br J Hosp Med (Lond) 2024;85(6):1-9"
    url: "https://doi.org/10.12968/hmed.2023.0409"
    note: "1,147 papers screened and none eligible: there is no comparative evidence base for analgesic strategies in emergency laparotomy; practice is extrapolated from elective surgery"
---

## What the surgeon is doing and why

Emergency laparotomy is not one operation. It is a midline incision made for one of five reasons, and the reason sets the physiology you will be managing.

```
 Problem          What the surgeon does            What it means for you
 ---------------  -------------------------------  ---------------------------
 Perforation      washout, patch or resect, stoma  sepsis, vasodilation
 Obstruction      adhesiolysis, resect dead bowel  dry, alkalotic or acidotic,
                                                   massive aspiration risk
 Ischaemia        resect, relook at 24-48 h        lactate, reperfusion, AF
 Bleeding         find and stop it                 haemorrhage protocol
 Leak, collection washout, defunction, drain       sick, malnourished redo
```

In every case the aim is source control: stop the contamination, remove what is dead, relieve what is obstructed, stop what is bleeding. Reconstruction is secondary and is often deferred. That is the logic behind the Hartmann's procedure (resect the perforated sigmoid, bring out an end colostomy, do not join bowel in a septic field) and behind damage-control surgery, in which the surgeon in a patient who is cold, acidotic and coagulopathic staples off the bowel ends, packs, leaves the abdomen open under a negative-pressure dressing and comes back in 24-48 hours when the physiology has been repaired in intensive care. A surgeon who chooses damage control is responding to your numbers, so tell them the numbers.

The incision is long because the diagnosis is uncertain and all four quadrants must be reached and washed. The linea alba is opened from xiphisternum to pubis, the bowel is run from the duodenojejunal flexure to the rectum, and at the end the fascia is closed with a continuous mass suture over bowel that is now oedematous. A stoma is brought out through the rectus muscle. Drains are left.

What makes this operation dangerous is the patient. In the EPOCH trial of nearly 16,000 UK patients, 90-day mortality was 16%, and a national quality improvement programme did not change it. The patients are older than an elective population and a fifth of those over 65 are frail, with mortality rising steeply with each frailty grade independent of age. The care bundle that the ERAS Society guidelines and the national audits (NELA in the UK, ANZELA in Australia and New Zealand) converge on is not a drug: it is early antibiotics, early imaging, a documented risk score, prompt theatre, consultant presence for high-risk cases, goal-directed haemodynamic management, and critical care afterwards.

The pain logic: the dominant mechanism is abdominal wall. A midline fascial closure under tension is loaded by coughing, deep breathing and sitting up, which are precisely the things the patient must do to avoid pneumonia, so movement-evoked pain for five to seven days is the feature that matters. Under it lie inflamed peritoneum, handled and distended bowel (visceral, colicky, opioid-responsive and opioid-worsened through ileus) and the stoma and drain sites. The score is 4 and not 5 because the wound, once closed, heals on an ordinary timetable; the upper abdominal extension and the frail chest are what push individual patients higher.

## Steps

### 1. Assessment, risk score and the conversation
**Why:** The surgeon has a CT, a diagnosis and a wish to operate within the window the urgency category allows: immediately for bleeding, within two to six hours for perforation and ischaemia with sepsis, within 18-24 hours for obstruction that is not settling.
**Anaesthesia:** Calculate the predicted mortality and a frailty score and write them down; they determine who must be in the room and where the patient goes afterwards. Read the lactate, the creatinine and the ECG. For the frail patient with predicted mortality in the tens of percent, the conversation about what the operation can and cannot achieve, a stoma, intensive care and ceilings of treatment belongs before induction and includes the family; palliation is a legitimate outcome of that conversation. Do not delay source control for prolonged optimisation: resuscitation happens on the way and continues on the table.

### 2. Resuscitation before induction
**Why:** Nothing surgical; this is the step that decides whether induction is survivable.
**Anaesthesia:** Arterial line awake under local in anyone septic, hypotensive, elderly or with a high risk score. Two large cannulae. Balanced crystalloid in 250-500 mL boluses against a response; noradrenaline started peripherally at low dose if the pressure is fluid-unresponsive, with a central line placed after induction. Antibiotics given and timed. Correct potassium and magnesium in the obstructed patient who has been vomiting for days. Pass or aspirate the nasogastric tube: an obstructed stomach can hold litres.

### 3. Rapid sequence induction
**Why:** The gut is obstructed or paralysed and the stomach is full whatever the fasting time.
**Anaesthesia:** Head up, nasogastric tube aspirated and left on free drainage, suction on. Ketamine 1-1.5 mg/kg IV or a heavily reduced propofol dose, with rocuronium 1.2 mg/kg IV or suxamethonium 1.5 mg/kg IV, and the vasopressor running or in the hand. The fall in pressure at induction in a septic patient is the sum of lost sympathetic tone, positive pressure ventilation and whatever induction agent was given, and it is the commonest time for a cardiac arrest in this operation. Videolaryngoscope first, because the second attempt happens over a rising tide.

### 4. Lines, monitoring and the plan for analgesia
**Why:** The surgeon preps while you finish.
**Anaesthesia:** Central line if not placed, urinary catheter, temperature probe, forced-air warmer on the chest and legs, fluid warmer, cardiac output monitor if used. Send a baseline gas. Decide now which analgesic route is open: an epidural needs a patient who is not on a vasopressor, not coagulopathic, not bacteraemic to the point of rigors, and can be positioned; in practice that is the stable obstruction or the early perforation. For the rest, plan rectus sheath catheters at closure.

### 5. Incision and opening the peritoneum
**Why:** A full midline incision gives access to everything; opening the peritoneum releases gas, pus, blood or litres of obstructed fluid.
**Anaesthesia:** Releasing a tense abdomen drops intra-abdominal pressure at once: ventilation becomes easier, but splanchnic vessels refill and any tamponade of bleeding is lost, so the pressure can fall sharply. In haemoperitoneum the surgeon will pack four quadrants and wait for you to catch up; say when you are ready.

### 6. Finding the problem and controlling the source
**Why:** The bowel is run, the lesion found, and contamination or bleeding stopped with clamps, staples, sutures or packs.
**Anaesthesia:** Bowel handling and mesenteric traction cause vasodilation, flushing and hypotension in the first 20-30 minutes; evisceration loses heat and water from a surface of square metres. Manipulating an abscess or necrotic bowel showers the circulation with bacteria and mediators: expect the noradrenaline requirement to climb before it falls. Titrate fluid to stroke volume or to pulse pressure variation, not to a formula; both under-resuscitation and several litres of excess crystalloid harm an anastomosis and a lung.

### 7. Resection, and the decision to join, divert or leave
**Why:** Dead or perforated bowel is resected. The surgeon then chooses between a primary anastomosis, an anastomosis with a covering stoma, an end stoma, or stapled ends left in discontinuity for a relook.
**Anaesthesia:** That choice turns on perfusion, contamination and physiology, and the surgeon needs your half of it stated plainly: the noradrenaline dose and its trend, the lactate and base deficit, the temperature, the clotting. A rising vasopressor requirement, a lactate that is not clearing, a temperature under 35 degrees and a coagulopathy are the triggers for damage control. Vasopressors do not by themselves forbid an anastomosis, but a bowel end that is dusky on a high dose will not heal.

### 8. Washout and drains
**Why:** Litres of warm saline are used to dilute contamination; drains are placed in the pelvis and beside any repair.
**Anaesthesia:** Insist the wash is warm. This is a natural pause for a repeat gas, a recheck of haemoglobin and clotting, antibiotic re-dosing if more than two half-lives have passed or blood loss is over 1.5 L, and the decision about where the patient is going.

### 9. Stoma formation
**Why:** Bowel is brought through a disc excised from the abdominal wall and the rectus muscle and sutured to skin after the main wound is closed and covered.
**Anaesthesia:** Fifteen to twenty minutes with little stimulus followed by a brief sharp one. Maintain neuromuscular block until the fascia is closed: a tight abdominal wall at this stage is a request for relaxant, or a warning that the abdomen will not close safely.

### 10. Fascial closure, or the open abdomen
**Why:** The linea alba is closed with a continuous suture in small bites. If the bowel is too swollen to close without tension, or a relook is planned, a negative-pressure dressing is applied instead.
**Anaesthesia:** Watch the peak airway pressure as the fascia comes together. A rise of more than about 10 cmH2O with a falling urine output and rising vasopressor need is abdominal compartment syndrome in the making, and saying so now saves a return to theatre. Before or just after closure the rectus sheath catheters go in: placed by the surgeon under direct vision into the posterior sheath on each side, or by ultrasound at the end, each loaded with 20 mL of ropivacaine 0.2-0.375% within the weight limit and connected to intermittent boluses or an infusion.

### 11. Extubation decision and handover
**Why:** The operation is finished; the illness is not.
**Anaesthesia:** Extubate in theatre if the patient is warm, the lactate is falling, the vasopressor is low and stable, gas exchange is good and the block is fully reversed. Leave intubated for an open abdomen, an escalating noradrenaline dose, a temperature under 35.5 degrees, massive transfusion or a relook within 24 hours. Either way the high-risk patient goes to critical care. Hand over the risk score, the fluid balance, the drug doses and times, the analgesic plan and what was agreed about limits of treatment.

### 12. The first week
**Why:** The surgeon is watching for leak, collection, ileus, wound dehiscence and a stoma that works.
**Anaesthesia:** Pain on movement governs the chest. Regular IV paracetamol, the catheters or epidural, and a PCA; NSAIDs are withheld in most of these patients for the first days because of kidney injury, sepsis and anastomotic concerns. Ileus makes oral drugs unreliable for several days. Delirium is common in the older patient: minimise opioid through the regional technique, avoid sedatives, and restore glasses, hearing aids and daylight.

## Pain plan

The mechanism is a long midline wound loaded by breathing and coughing, in a patient whose lungs and kidneys are already at risk, so the plan must control movement-evoked pain for about a week while sparing opioid. A continuous regional technique is the logical default. Which one is a question that evidence does not answer: a 2024 systematic review screened over a thousand papers and found no eligible comparative study of analgesic strategies in emergency laparotomy. The ERAS Society guideline acknowledges that its analgesic recommendations are extrapolated from elective surgery. Everything below is therefore reasoned practice, not trial result.

Thoracic epidural remains the most effective technique for a midline incision where it can be used, and is the author's choice for the stable patient with significant lung disease. It is unusable or unwise in most emergency laparotomies: sepsis with vasopressor dependence, coagulopathy or thrombocytopenia, the need for early anticoagulation, and the hypotension that an epidural adds to a vasodilated circulation. A catheter placed in haste before induction in an unstable patient then sits unused for a day.

Rectus sheath catheters are the defensible default. They cover the somatic midline wound from T7 to T11, do not cause hypotension or motor block, are safe with deranged clotting when surgeon-placed under vision, and survive the transfer to critical care. They do nothing for visceral pain, so they sit on top of regular IV paracetamol and an opioid PCA (fentanyl or oxycodone where the kidneys are injured). Low-dose ketamine infusion at 0.1-0.2 mg/kg/h IV or an IV lidocaine infusion are reasonable additions for the opioid-tolerant patient, the latter never concurrently with local anaesthetic catheters because the doses add. A stoma or a transverse extension lies outside the rectus sheath field and needs separate infiltration.

Intrathecal morphine 100-200 micrograms before induction is used in some units for the stable obstructed patient; it gives 18-24 hours of visceral and somatic cover with one needle. The evidence is elective and the respiratory monitoring requirement is real. NSAIDs are best treated as contraindicated until the creatinine, the urine output and the anastomosis are secure, typically day 2 or 3.

Rebound is moderate: single-shot blocks at the end of the case wear off overnight on day 0 into a wound that hurts most on day 1, which is the argument for catheters. Escalation triggers: pain out of proportion on day 2-5, particularly with tachycardia, a rising lactate or new atrial fibrillation, is a leak, ischaemia or collection, not an analgesic failure; a patient who cannot cough because of pain is on the way to pneumonia and needs the regional technique fixed that day.

## Pitfalls and variants

- Laparoscopic emergency surgery. Perforated ulcer repair, adhesiolysis and some Hartmann's procedures are done laparoscopically in selected stable patients. The risk profile of the patient is unchanged; the wound pain is far less. Pneumoperitoneum in a septic, hypovolaemic circulation needs the same lines.
- Bowel obstruction. Days of vomiting produce hypokalaemic, hypochloraemic alkalosis and a contracted volume; a closed-loop or strangulated obstruction adds lactate. The aspiration risk at induction is the highest in anaesthesia. Nitrous oxide is avoided.
- Mesenteric ischaemia. Atrial fibrillation, vasculopaths, anticoagulation decisions, reperfusion with hyperkalaemia and acidosis on unclamping or after resection, a planned relook, and the highest mortality of the group.
- Upper gastrointestinal bleeding. Blood in the stomach, haemorrhage protocol, and a surgeon who may only need 40 minutes to under-run a vessel.
- Anastomotic leak and re-laparotomy. A malnourished patient a week after elective surgery, with an epidural possibly still in, hostile adhesions and bleeding on entry.
- The open abdomen. Sedated, ventilated, large fluid and protein losses through the dressing, and a return to theatre every 24-48 hours until closure.
- The frail older patient. Reduce every dose, expect delirium, involve a geriatrician early, and be explicit about outcomes: many who survive do not return to their previous level of independence.
- Steroid-dependent and immunosuppressed patients. Blunted signs before, vasopressor-resistant hypotension during: hydrocortisone 100 mg IV at induction and 50 mg IV six-hourly.
- Abdominal compartment syndrome. Before or after: high airway pressures, oliguria, a tense abdomen. Decompression is the treatment and the haemodynamic effect is abrupt.
- Paediatric and obstetric laparotomy are outside this card.

## Key sources

The organisational evidence is large and humbling: national audits have described the population in detail, and EPOCH showed that distributing a care pathway does not by itself lower a 16% 90-day mortality. The ERAS Society guidelines are consensus built by Delphi and say openly that much is extrapolated from elective surgery. For analgesia there is no comparative evidence in this operation at all, so the rectus sheath catheter default, the criteria for an epidural and the use of intrathecal morphine are author's judgement. The triggers for damage control and for delayed extubation are standard teaching and are unsourced.
