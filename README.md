# drhalvey.com.au - static site (rebuild)

A static, no-CMS, no-database website for Dr Ed Halvey. No patient data is ever stored on the
web host. Built to be staged on a preview URL and cut over to the existing `drhalvey.com.au`
domain only once approved.

## What's in here

```
drhalvey-site/
  index.html            Home
  about.html            About / bio / qualifications  (placeholder content - needs Ed's text)
  services.html         Anaesthetic services          (placeholder list - needs confirming)
  hospitals.html        SCGH (public) + Hollywood Private
  pre-op-guidance.html  Pre-op hub - links to fasting/consent docs + the pain relief tool
  contact.html          Enquiries via Microsoft Forms (link to be pasted by Ed)
  tools/
    pain-relief-acl.html  The gated, display-only pain relief tool (ACL plan loaded)
  assets/style.css      Shared stylesheet (brand built from scratch)
  robots.txt            Set to block ALL indexing while staging
```

Everything is plain HTML/CSS with a tiny bit of vanilla JavaScript. No build step, no dependencies.

## The domain - important

Ed **already owns `drhalvey.com.au`** (currently a Squarespace site). **No new domain is being
bought.** The plan:

1. Stage this site on a preview address - either the free hosting preview URL (e.g.
   `username.github.io/...` or `project.pages.dev`) or a subdomain like `new.drhalvey.com.au`.
2. Ed reviews it there.
3. When approved, point `drhalvey.com.au` at the new host - **one domain, one cutover.** The old
   Squarespace site is replaced at that moment.

## Hosting / deploy (free static hosting)

Either option works; both are free and match the model used for the ghgames site.

**GitHub Pages**
1. Create a repo, commit the contents of `drhalvey-site/` to it.
2. Settings → Pages → deploy from branch (root). You get a `*.github.io` preview URL.
3. For a custom subdomain later, add a `CNAME` file + DNS record.

**Cloudflare Pages**
1. Connect the repo (or drag-and-drop the `drhalvey-site/` folder).
2. No build command needed; output dir is the folder root. You get a `*.pages.dev` preview URL.
3. Custom domain/subdomain is added in the Pages dashboard + DNS.

While staging, `robots.txt` blocks all search engines. At go-live, swap it to allow the public
pages **but keep `/tools/` disallowed** - the tool also carries its own `noindex` tag as a backstop.

## Contact + feedback = Microsoft Forms only

No form on this site writes data anywhere. Enquiry/feedback is handled entirely by Microsoft Forms
in Ed's own Microsoft tenant (Australian Privacy Principles compliant). Ed creates each form and
pastes the link into `contact.html` (and anywhere else needed). Patients should not be asked to put
clinical detail into these forms.

## The pain relief tool - BLOCKING checks before it goes public

The tool is **display-only**: it shows a fixed plan Ed set in advance, selected from a list. It never
calculates, individualises, or recommends doses, and nothing a patient enters changes what is shown.
This is deliberate - it keeps the tool inside the TGA carve-out for digitising paper-based clinical
rules and out of medical-device territory. It is access-gated (code + confirmation) and `noindex`.

**Before the tool is made public, these two checks are Ed's to complete (not the builder's):**

1. Run the TGA's own online **"Is my software regulated?"** self-assessment for the tool.
2. Send a one-paragraph description to the medical indemnity insurer (Avant / MDA National / MIPS)
   and get sign-off.

Until both are done, keep the tool behind the gate / off the public site.

## AHPRA guardrails already applied

- Only the title "Specialist Anaesthetist" is used - no "expert / leader / best" language.
- **No testimonials or reviews anywhere** (prohibited under s133 of the National Law).
- No guarantees of outcomes, no comparative or misleading claims.
- All factual claims about Ed (bio, qualifications, services, hospital details) are left as marked
  placeholders for Ed to confirm - nothing invented.

## What Ed still needs to supply

- [ ] Bio + qualifications text (exact wording / titles he's entitled to use) → `about.html`
- [ ] Confirm/adjust the services list → `services.html`
- [ ] Hospital details (addresses/parking) if wanted → `hospitals.html`
- [ ] Rooms phone + enquiry method → `contact.html` + footers
- [ ] Microsoft Form link(s) for enquiries/feedback → `contact.html`
- [ ] Fasting / consent / day-of-surgery PDFs to add to the pre-op hub
- [ ] The other operation schedules (Week 1-8 series, ibuprofen + pantoprazole variant, etc.) when
      ready to expand the tool beyond ACL
