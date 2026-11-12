---
id: endovascular-thrombectomy-for-stroke
title: "Endovascular thrombectomy for stroke"
subtitle: "Clot retrieval for large vessel occlusion: sedation or general anaesthesia without delay and without a fall in blood pressure"
aka: ["EVT", "clot retrieval", "mechanical thrombectomy", "ECR", "endovascular clot retrieval", "stroke thrombectomy", "large vessel occlusion", "LVO", "stent retriever", "basilar thrombectomy"]
pain:
  score: 1
  trajectory: [1, 1, 0, 0, 0]
  mechanism: skin-soft-tissue
  mechanism_text: "A femoral or radial arterial puncture under local anaesthetic. During the procedure, traction on the intracranial artery as a stent retriever is withdrawn causes a brief deep headache in the awake patient; afterwards there is a sore groin and nothing else from the procedure"
  rebound_risk: low
block:
  primary: "Local anaesthetic infiltration at the arterial puncture site by the interventionalist; paracetamol afterwards. No opioid is needed for the procedure's own pain"
  family: local-infiltration
  catheter: "no"
  catheter_text: "Not applicable"
  alternatives: ["Small remifentanil or fentanyl doses during retriever pulls in the sedated patient", "General anaesthesia where movement or the airway makes sedation unsafe"]
  neuraxial: "no"
position: supine
position_text: "Supine on the biplane angiography table with the head in a radiolucent cradle and lightly taped, arms by the sides, the anaesthetic machine at the feet or left side and every line on long extensions; a hemiplegic arm is secured so it does not fall"
tourniquet: "no"
tourniquet_text: ""
cement: "no"
cement_text: ""
blood_loss: "Minimal; the bleeding that matters is intracranial (vessel perforation or haemorrhagic transformation) or at the groin in a thrombolysed patient"
duration: "30-90 min from puncture; a clean first pass can reopen the vessel in 20 min"
los: "Stroke unit or neurocritical care; length of stay is set by the stroke"
day_case: "no"
extras:
  - label: "Airway"
    value: "Native airway with oxygen and capnography under minimal sedation, or rapid sequence induction and a tracheal tube; nothing through the nose in a thrombolysed patient"
  - label: "Lines and monitoring"
    value: "Non-invasive pressure at 1-2 min intervals to start; do not delay groin puncture for an arterial line, and transduce the side arm of the femoral sheath once it is in; one good cannula, a second if general anaesthesia"
  - label: "Blood pressure target"
    value: "Before reperfusion: systolic 140-180 mmHg, mean never under 70 mmHg, and under 185/110 mmHg if thrombolysed. After reperfusion: allow it to settle, treat above 180 mmHg, and do not drive systolic below 140 mmHg"
  - label: "Ventilation"
    value: "Oxygen saturation above 94% without hyperoxia, end-tidal carbon dioxide 35-40 mmHg; hypocapnia constricts the collaterals feeding the penumbra"
  - label: "Remote site"
    value: "Angiography suite, often out of hours, with a team that is moving fast; drugs and airway equipment prepared before the patient arrives"
  - label: "Critical care"
    value: "Extubate in the suite whenever possible for a neurological examination; intensive care for posterior circulation strokes, a low conscious level, aspiration or a complication"
drugs:
  antibiotic: "None"
  txa: "Contraindicated in practice: the patient has an arterial thrombus and may have had thrombolysis"
  vte: "Intermittent calf compression on the stroke unit; antithrombotic drugs by the stroke team after a 24 h scan"
  antiemetic: "Ondansetron 4 mg IV; vomiting on a flat table with an unprotected airway and dysphagia is an aspiration"
patient_line: "We will keep you still and comfortable while the clot is pulled out through a tube from the artery at the top of the leg; you may feel a brief headache as it comes out."
trap: "Every minute of delay and every minute of low blood pressure costs brain: the penumbra is being kept alive by collateral flow that is entirely pressure-dependent, so the anaesthetic must add no delay to groin puncture and no hypotension at induction"
sources:
  - title: "Goyal M, Menon BK, van Zwam WH, et al. Endovascular thrombectomy after large-vessel ischaemic stroke: a meta-analysis of individual patient data from five randomised trials. Lancet 2016;387:1723-1731"
    url: "https://doi.org/10.1016/s0140-6736(16)00163-x"
    note: "HERMES: thrombectomy reduced disability at 90 days across subgroups, including patients aged 80 and over, those treated more than 300 min from onset and those ineligible for alteplase, with no increase in mortality or symptomatic haemorrhage"
  - title: "Schönenberger S, Hendén PL, Simonsen CZ, et al. Association of general anesthesia vs procedural sedation with functional outcome among patients with acute ischemic stroke undergoing thrombectomy: a systematic review and meta-analysis. JAMA 2019;322:1283-1293"
    url: "https://doi.org/10.1001/jama.2019.11455"
    note: "Individual data from three single-centre trials, 368 patients: protocol-based general anaesthesia associated with less disability at 3 months (common odds ratio 1.58); hypotension (a fall in systolic of more than 20%) in 80.8% under general anaesthesia against 53.1% under sedation"
  - title: "Maurice A, Eugène F, Ronzière T, et al. General anesthesia versus sedation, both with hemodynamic control, during intraarterial treatment for stroke: the GASS randomized trial. Anesthesiology 2022;136:567-576"
    url: "https://doi.org/10.1097/aln.0000000000004142"
    note: "345 patients, blood pressure standardised in both arms: functional independence 36% with sedation and 40% with general anaesthesia (relative risk 0.91, 95% CI 0.69-1.19); successful recanalisation 85% under general anaesthesia against 75%; arrival to puncture 9 min longer with general anaesthesia"
  - title: "Chabanne R, Geeraerts T, Begard M, et al. Outcomes after endovascular therapy with procedural sedation vs general anesthesia in patients with acute ischemic stroke: the AMETIS randomized clinical trial. JAMA Neurol 2023;80:474-483"
    url: "https://doi.org/10.1001/jamaneurol.2023.0413"
    note: "273 patients, multicentre: functional independence at 90 days 33.3% with general anaesthesia and 39.1% with sedation (relative risk 1.18, 95% CI 0.86-1.61); major complications similar"
  - title: "Rasmussen M, Schönenberger S, Hendén PL, et al. Blood pressure thresholds and neurologic outcomes after endovascular therapy for acute ischemic stroke: an analysis of individual patient data from 3 randomized clinical trials. JAMA Neurol 2020;77:622-631"
    url: "https://doi.org/10.1001/jamaneurol.2019.4838"
    note: "365 patients: a cumulative 10 min with mean arterial pressure under 70 mmHg (adjusted odds ratio 1.51) and a cumulative 45 min above 90 mmHg (1.49) were each associated with worse 90-day outcome, number needed to harm 10"
  - title: "Yang P, Song L, Zhang Y, et al. Intensive blood pressure control after endovascular thrombectomy for acute ischaemic stroke (ENCHANTED2/MT): a multicentre, open-label, blinded-endpoint, randomised controlled trial. Lancet 2022;400:1585-1596"
    url: "https://doi.org/10.1016/s0140-6736(22)01882-7"
    note: "After successful reperfusion, a systolic target under 120 mmHg gave more early neurological deterioration (odds ratio 1.53) and more major disability at 90 days (2.07) than a target of 140-180 mmHg, with no reduction in symptomatic haemorrhage"
  - title: "Nam HS, Kim YD, Heo J, et al. Intensive vs conventional blood pressure lowering after endovascular thrombectomy in acute ischemic stroke: the OPTIMAL-BP randomized clinical trial. JAMA 2023;330:832-842"
    url: "https://doi.org/10.1001/jama.2023.14590"
    note: "Intensive lowering for 24 h after successful reperfusion reduced functional independence at 3 months (risk difference -15.1%, adjusted odds ratio 0.56) against conventional management (54.4% independent); symptomatic haemorrhage similar"
  - title: "Mazighi M, Richard S, Lapergue B, et al. Safety and efficacy of intensive blood pressure lowering after successful endovascular therapy in acute ischaemic stroke (BP-TARGET): a multicentre, open-label, randomised controlled trial. Lancet Neurol 2021;20:265-274"
    url: "https://doi.org/10.1016/s1474-4422(20)30483-x"
    note: "A systolic target of 100-129 mmHg did not reduce radiographic intraparenchymal haemorrhage at 24-36 h compared with 130-185 mmHg (42% against 43%)"
  - title: "Talke PO, Sharma D, Heyer EJ, et al. Society for Neuroscience in Anesthesiology and Critical Care expert consensus statement: anesthetic management of endovascular treatment for acute ischemic stroke. Stroke 2014;45:e138-e150"
    url: "https://doi.org/10.1161/strokeaha.113.003412"
    note: "Expert consensus across 12 topics of anaesthetic management, written before the randomised trials of technique; seen as an abstract, so thresholds in this card are attributed to the later trials or stated as consensus"
---

## What the surgeon is doing and why

A large vessel occlusion is a clot lodged in the terminal internal carotid, the first or second segment of the middle cerebral artery, or the basilar artery. Downstream of it are two zones. The core has no flow and is dead within minutes. Around it the penumbra is electrically silent but alive, fed by leptomeningeal collaterals from neighbouring territories at a pressure well below normal. The penumbra is what the patient's deficit is made of, and it dies outward from the core at a rate that depends on the collaterals and on the pressure driving them. Reopen the artery in time and it recovers.

The interventional neuroradiologist punctures the femoral or radial artery, places a guide catheter in the carotid or vertebral artery, and navigates a microcatheter through the clot. The clot is then removed with a stent retriever (a self-expanding mesh that is opened inside the thrombus, left for a few minutes to engage, and pulled back), with direct aspiration through a large-bore catheter held against the face of the clot, or both together, often with a balloon inflated in the neck to arrest flow during the pull. One pass may be enough; several may be needed. The result is graded on the angiogram, and the aim is complete or near-complete reperfusion of the territory.

The pooled trials established that this reduces disability across a wide range of patients, including those over 80 and those who could not receive thrombolysis. They also established that the benefit decays with time. The operation is therefore run against the clock, and the measures the team is judged by, arrival to puncture and puncture to reperfusion, include the time you take.

What the interventionalist needs from you is short: a patient who is still enough for roadmap navigation in arteries 2-3 mm across, a blood pressure that keeps the collaterals open until the vessel is, and no delay. What the patient brings makes that harder: a stroke severe enough to cause dysphasia, neglect, agitation or a reduced conscious level; an unfasted stomach and an impaired swallow; atrial fibrillation, heart failure and hypertension; and frequently a thrombolytic given in the last hour.

Two questions have been tested in randomised trials and both answers shape this card. Sedation or general anaesthesia: with blood pressure controlled, outcomes are similar, so the technique should be whichever can be delivered fastest and most stably for this patient by this team. Blood pressure after reperfusion: aggressive lowering causes harm.

The pain logic is brief. The procedure is an arterial puncture. The only procedural pain is a deep headache as the retriever drags on the artery, lasting a minute. This is the one card in the neurosurgical group where analgesia is nearly irrelevant and haemodynamics are everything.

## Steps

### 1. The call and the two-minute assessment
**Why:** The stroke team has imaging showing an occlusion and salvageable brain, and is moving the patient straight from the scanner to the angiography suite.
**Anaesthesia:** Be in the suite before the patient, with drugs drawn up for both sedation and rapid sequence induction, a vasopressor infusion ready and suction working: see [remote site anaesthesia](../a/a12-remote-site-sedation.html). The assessment happens during the transfer on to the table. You need the stroke severity and side, the conscious level and whether the patient can follow a command to lie still, whether they are protecting the airway and have vomited, the baseline pressure, whether thrombolysis has been given and when, anticoagulants, and the major comorbidities. Consent is the stroke team's. Nothing else, including fasting status, blood results or an ECG review, justifies waiting.

### 2. Choosing sedation or general anaesthesia
**Why:** The interventionalist will accept either provided the head is still and the start is immediate.
**Anaesthesia:** The randomised evidence is balanced. Pooled single-centre trials favoured protocol-based general anaesthesia (less disability at three months), while hypotension occurred in 80.8% under general anaesthesia against 53.1% under sedation. The two multicentre trials with standardised pressure control found no difference in functional independence: 40% against 36% in GASS, and 33.3% against 39.1% in AMETIS. GASS found better recanalisation under general anaesthesia (85% against 75%) and a nine-minute longer arrival-to-puncture time. The defensible default, as author's judgement: minimal sedation for the cooperative patient with a protected airway and an anterior circulation stroke, particularly on the non-dominant side; general anaesthesia from the start for a Glasgow Coma Score under about 9, vomiting or an unprotected airway, severe agitation, dense dysphasia with inability to follow commands, respiratory compromise lying flat, and most basilar occlusions. A planned general anaesthetic is safer than an emergency conversion with a catheter in the middle cerebral artery.

### 3. Sedation technique
**Why:** The patient must lie flat and still with the head taped, for 30-60 minutes, without understanding why.
**Anaesthesia:** Less is better. Many patients need only explanation, a hand to hold and oxygen. Where a drug is needed, a low-dose remifentanil infusion (0.02-0.05 micrograms/kg/min), small increments of fentanyl 25 micrograms IV, a low-rate propofol infusion or dexmedetomidine are all used; none has been shown superior. The patient should stay rousable to voice. Monitor capnography, because hypoventilation raises carbon dioxide, and airway obstruction in a flat, dysphagic patient is the route to aspiration. A bladder scan or catheter can settle an agitated patient better than a sedative. Decide early if it is failing: repeated movement that forces the interventionalist to redo roadmaps costs more time than an anaesthetic.

### 4. General anaesthesia without hypotension
**Why:** Induction is the single most likely moment for the penumbra to lose its perfusion pressure.
**Anaesthesia:** Start the vasopressor before the induction agent, not after the pressure falls: a noradrenaline or metaraminol infusion running, or a bolus given with the induction dose. Rapid sequence induction with a reduced dose of propofol or with ketamine, a small opioid dose, and rocuronium 1-1.2 mg/kg IV or suxamethonium; videolaryngoscope first, because airway trauma bleeds after thrombolysis and nothing is passed through the nose. Cycle the cuff every minute through induction. Maintain with a low concentration of volatile or a propofol infusion, with minimal opioid, so that the patient can be woken at the end. Ventilate to an end-tidal carbon dioxide of 35-40 mmHg: hypocapnia constricts the collateral vessels the penumbra depends on. In the pooled analysis of the three single-centre trials, as little as ten cumulative minutes with a mean pressure under 70 mmHg was associated with worse outcome.

### 5. Arterial access and pressure monitoring
**Why:** The interventionalist places an 8 French femoral sheath or a radial sheath under ultrasound and local anaesthetic, usually while you are still settling the patient.
**Anaesthesia:** Do not hold the puncture for a radial arterial line. Ask for the side arm of the femoral sheath to be connected to a transducer, which gives a usable waveform within minutes (it under-reads systolic slightly when a catheter fills the lumen). Place a radial line during the procedure if general anaesthesia is prolonged or the pressure is labile. Work to a systolic pressure of 140-180 mmHg and a mean above 70 mmHg until the vessel is open; if alteplase or tenecteplase has been given, the ceiling is 185/110 mmHg. Treat lows at once with vasopressor. Treat highs above the ceiling gently with labetalol 5-10 mg IV, since hypertension before reperfusion is partly the brain's own response to the occlusion.

### 6. Crossing the clot and the retrieval pass
**Why:** The microcatheter and wire cross the thrombus blind, the stent retriever is deployed and left to integrate, the neck balloon is inflated and the device is withdrawn under aspiration.
**Anaesthesia:** These are the moments when movement matters most and when the awake patient feels pain: warn them that a headache is coming and will pass, and give a small opioid dose beforehand if previous pulls were distressing. Under general anaesthesia keep the patient paralysed and monitored. Bradycardia can accompany traction on the carotid siphon. Each further pass repeats the cycle. Keep a running note of time from puncture, because the interventionalist will decide when to stop partly on it.

### 7. Complications in the suite
**Why:** The wire or device can perforate the artery, the vessel can dissect or go into spasm, and fragments of clot can embolise to new territory.
**Anaesthesia:** Perforation shows as contrast outside the vessel with a sudden rise in pressure and a fall in heart rate or conscious level. Reverse any heparin with protamine, lower systolic pressure to about 140 mmHg, secure the airway if not already done, and prepare for an external ventricular drain or transfer to theatre; thrombolysis cannot be reversed quickly, and the stroke team may give cryoprecipitate or fibrinogen concentrate. Vasospasm is treated by the interventionalist with intra-arterial nimodipine or verapamil, which drops systemic pressure: have the vasopressor rate turned up as it goes in. A tandem carotid stenosis may be stented during the same procedure, bringing balloon-induced bradycardia (glycopyrronium 200 micrograms or atropine 300-600 micrograms IV ready) and an intravenous antiplatelet load, as in the stenting variant of [carotid endarterectomy](carotid-endarterectomy.html).

### 8. Reperfusion: the target changes
**Why:** Once the artery is open the territory receives full systemic pressure through vessels that have lost autoregulation, and the infarcted core can bleed.
**Anaesthesia:** Ask for the reperfusion grade and say the new target aloud. The instinct is to lower pressure hard, and three randomised trials argue against it. A systolic target under 120 mmHg produced more early deterioration and more disability than 140-180 mmHg in ENCHANTED2/MT. Intensive lowering for 24 hours reduced functional independence in OPTIMAL-BP. A target of 100-129 mmHg did not reduce haemorrhage in BP-TARGET. The working rule: let the pressure fall naturally, which it usually does, treat systolic above 180 mmHg (or the lower ceiling the stroke team sets after thrombolysis), and do not push it under 140 mmHg with drugs. If reperfusion failed, the pre-reperfusion targets continue.

### 9. Emergence and examination
**Why:** The stroke team wants a neurological score as soon as possible to compare with the one at arrival.
**Anaesthesia:** Extubate in the suite if the patient was protecting the airway beforehand, the procedure was uncomplicated, and they are awake and obeying; reverse neuromuscular block fully and avoid coughing against a fresh groin puncture. Keep ventilated those who were obtunded before, have a posterior circulation stroke with bulbar signs, aspirated, or had a perforation. Dysphagia is assumed until tested: nil by mouth. The groin is closed with a device or manual pressure and the leg kept straight.

### 10. The first 24 hours
**Why:** Haemorrhagic transformation, re-occlusion and swelling of a large infarct are the surgeon's and stroke physician's concerns; a scan at 24 hours guides antithrombotic treatment.
**Anaesthesia:** A fall in conscious level or a new headache with a pressure rise is intracranial haemorrhage until scanned. Tongue and lip swelling after alteplase is orolingual angioedema, commoner in patients on ACE inhibitors, and can threaten the airway. Groin or flank pain with hypotension is a retroperitoneal haematoma. A large middle cerebral infarct that swells over two to four days may return for decompressive hemicraniectomy, with the considerations in the [traumatic brain injury](traumatic-brain-injury.html) card.

## Pain plan

The mechanism is an arterial puncture, so the analgesic strategy is local anaesthetic at the access site and paracetamol, and the plan's real content is what to avoid. The interventionalist infiltrates the groin or wrist. Retriever-pull headache in the awake patient is handled with warning and, if needed, a small fentanyl or remifentanil dose timed to the pull. Under general anaesthesia opioid is kept to the minimum that covers intubation, because the end of the case is a neurological examination.

Afterwards, regular paracetamol covers the groin. Opioids are rarely needed and are unhelpful: they sedate a patient whose conscious level is being scored hourly and depress a swallow that is already unsafe. NSAIDs are not given, since the patient has a fresh infarct, may have had thrombolysis and will start antiplatelet or anticoagulant treatment after the 24-hour scan. There is no block decision and no rebound.

Escalation is diagnostic. New headache means haemorrhage or reperfusion injury and is imaged. Shoulder pain on the hemiplegic side in the following days is a positioning and handling injury and is prevented by supporting the arm from the moment the patient reaches the table.

## Pitfalls and variants

- Delay. Lines, a formal pre-assessment and a search for the notes each cost minutes. Prepare before arrival and assess during transfer.
- Induction hypotension. The commonest avoidable harm of general anaesthesia here, and the reason the vasopressor is started first.
- Emergency conversion from sedation. The head is in the gantry, the catheter is intracranial and the patient is vomiting or thrashing. Agree the trigger and the drill with the interventionalist at the start: catheters pulled back, C-arms parked, table levelled, then induce.
- Basilar occlusion. Reduced consciousness, bulbar failure and apnoea are part of the presentation; general anaesthesia from the start and intensive care afterwards.
- The thrombolysed patient. Bleeding from gums, nose, cannula sites and the airway. No nasal airway, nasogastric tube or central line in a non-compressible site, and gentle laryngoscopy.
- Anticoagulated patients. Thrombectomy proceeds on warfarin or a direct oral anticoagulant where thrombolysis could not; access-site bleeding is more likely.
- Agitation. Often a full bladder, dysphasia and fear. Escalating sedation in a patient who cannot understand instructions usually ends in conversion; convert early.
- Hyperglycaemia and fever both worsen infarct outcome and are corrected.
- In-hospital stroke after surgery. The same procedure in a patient with a fresh wound; thrombolysis is contraindicated and thrombectomy is the treatment.
- Radiation and contrast. Lead, distance from the tubes, and attention to renal function afterwards.
- The physiology of collateral flow and autoregulation is in [neuroanaesthesia essentials](../a/a08-neuroanaesthesia-essentials.html); aneurysm work in the same suite is covered in [aneurysm clipping and endovascular coiling](aneurysm-clipping-and-endovascular-coiling.html).

## Key sources

Thrombectomy itself has individual patient data from five randomised trials. The anaesthetic technique has five randomised trials in total: three small single-centre trials whose pooled result favoured general anaesthesia, and two multicentre trials with standardised blood pressure control that found no difference. The reasonable reading is equivalence when pressure is controlled, and the selection rule in this card is the author's judgement. The intra-procedural pressure thresholds come from a secondary analysis of trial data and are associations. The post-reperfusion advice is supported by three randomised trials that agree intensive lowering does not help and two that show harm. The pre-reperfusion systolic range and the ceiling after thrombolysis are consensus guideline figures.
