# Brief for the independent clinical reviewer

You have not seen these cards being written. Your job is to find what is wrong with them, not to admire them.
The book is "Orthopaedic Anaesthesia: Surgery First", a clinician reference for a consultant anaesthetist
(read `ortho/src/STYLE.md` first, especially sections 2, 3 and 8, and `ortho/src/chapters/b01-why-operations-hurt.md`
for the pain model every card must obey).

For each file assigned to you, read the whole file and report findings under these headings. Only report
things you are confident are wrong or inconsistent; a finding you are unsure of is reported as "possible" with
the reason.

1. Clinical errors. A dose, route, interval, incidence, anatomical statement or mechanism that is wrong. Quote the
   sentence. Say what is right, and give a source you have actually seen (PubMed MCP tools: load with ToolSearch
   `select:mcp__PubMed__search_articles,mcp__PubMed__get_article_metadata`) or say it is textbook consensus.
2. Unsafe advice. Anything a consultant could act on and harm a patient: a block recommended where it is
   contraindicated, a cement step without precautions, a missed airway issue, an anticoagulant timing error.
3. Internal inconsistency. The summary box disagreeing with the body (pain score versus the trajectory versus the
   pain plan text; the catheter field versus the pain plan; the tourniquet or cement field versus the steps).
4. Pain model violations. A score that does not fit the STYLE.md scale table, a trajectory that does not fit the
   score, a mechanism tag that does not match the operation, or a catheter recommendation that does not follow
   from the stated mechanism.
5. Source problems. A sourced-tier claim (a number, an effect size, a guideline recommendation) with no matching
   entry in the front matter sources; a source note that overstates what the paper found; a source cited for
   something it is not about. You do not need to re-verify DOIs; a separate script does that.
6. Style violations. Em dashes, question marks used as content, notes to the author, surgeon or hospital names,
   American spelling, hedging padding, praise, a sentence addressed to a patient, a step without both a Why and
   an Anaesthesia paragraph.

Do not edit any file. Do not run the build. Report in this exact shape, under 150 words per card unless there is
a clinical error, and never more than 40 findings in total:

```
## <card id>
- [clinical] <quote> -> <correction> (<source or consensus>)
- [unsafe] ...
- [inconsistent] ...
- [model] ...
- [source] ...
- [style] ...
- OK: no findings in <headings>
```
