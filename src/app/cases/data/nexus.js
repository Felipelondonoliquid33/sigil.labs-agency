/* NEXUS. Built by Felipe Londoño Humar in a previous in-house role. No company
   name, branding, internal content or user data appears here; the 3D shapes are
   illustrative. Extraction counts come from one read-only audit report; the
   40 / 20 / 17 figures come from his professional record. */
export const nexus = {
  slug: "nexus",
  scene: "pipeline",
  card: "A Python API bridge for LMS operations, and an AI pipeline that audits courses for instructional quality.",
  seoTitle: "Case Study: LMS API Automation & AI Course Audit | SIGIL LABS",
  seoDescription:
    "An LMS API bridge for bulk users, courses and publishing, plus an AI agent pipeline that audited around 40 courses for instructional design quality.",
  eyebrow: "Case study / LMS automation / AI course audit",
  client: "NEXUS",
  title: "Stop clicking. Start auditing.",
  lead: "Inside an enterprise EdTech enablement team, course operations were manual and course quality was judged by hand. Nexus put an API between the team and the LMS, and agents on top of the content.",
  facts: [
    { k: "Context", v: "Prior in-house role of SIGIL's founder" },
    { k: "Stack", v: "Python, Flask, LMS REST API, AI agents" },
    { k: "Role", v: "Design and build" },
  ],
  chapters: [
    { id: "manual", label: "The friction", title: "Operations moved one row at a time.", body: "Enrolments, course lookups and course creation for the sales team's training environment depended on repetitive work in the admin interface.", metrics: [{ value: 3, label: "repetitive jobs: enrolment, course search, course creation", plain: true }] },
    { id: "bridge", label: "The bridge", title: "An API between the team and the LMS.", body: "A Python and Flask app talks to the LMS REST API and streams progress back while it works, so a long operation is visible instead of a spinner.", metrics: [{ value: 1, label: "interface for the whole workflow", plain: true }] },
    { id: "bulk", label: "In bulk", title: "Users handled in batches, not tickets.", body: "Search, creation and removal of users from a spreadsheet, with downloadable results, plus enrolment reports and an enablement dashboard.", metrics: [{ value: 3, label: "batch operations: search, create, delete", plain: true }] },
    { id: "publish", label: "Publishing", title: "Courses and pages created from code.", body: "The app creates courses and publishes documents with HTML components straight into them. A companion tool turns a Word document into ready-to-paste course components.", metrics: [{ value: 2, label: "content paths: API publishing and Word-to-component", plain: true }] },
    { id: "audit", label: "Audit", title: "See what a course is really made of.", body: "A read-only extraction walks a course through the API, downloads each HTML component and sorts it by type, without changing anything in the live course. The towers are one real course: each is as tall as its count.", metrics: [{ value: 33, label: "content nodes walked in one course" }, { value: 82, label: "components extracted and classified" }, { value: 81, label: "downloaded; 1 flagged as a missing upload" }], note: "One read-only extraction report. Component towers: 60, 7, 6, 2, 2, 1, 1, 1, 1, 1." },
    { id: "select", label: "Outcome", title: "From an audit to published courses.", body: "An AI agent pipeline audited the catalogue for instructional design quality. A selection was refined with product experts into interactive material and published.", metrics: [{ value: 40, prefix: "~", label: "courses audited for instructional quality" }, { value: 20, label: "selected for refinement with product experts" }, { value: 17, label: "training plans and courses co-created and published" }] },
  ],
  method: {
    eyebrow: "How it was built",
    title: "Read first. Change only on purpose.",
    body: "The system was built around one rule: an agent can look at everything it is allowed to read, and a person decides what changes.",
    steps: [
      { t: "Extract without touching", b: "Audits run read-only against the API and leave the live course exactly as it was." },
      { t: "Write the rules down", b: "Component and brand rules are locked in documents the agents must follow, so output stays consistent between sessions." },
      { t: "Refine with experts", b: "The pipeline finds and sorts. Product experts decide what is right and what gets rebuilt." },
      { t: "Publish on approval", b: "Nothing reaches a live course until the change is reviewed and approved." },
    ],
  },
  next: { href: "/cases/agents", label: "Next case: SIGIL agents" },
};
