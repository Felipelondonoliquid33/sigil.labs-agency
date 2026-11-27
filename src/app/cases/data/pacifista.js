/* PACIFISTA story. Every figure comes from the project's source of truth; the
   two measurement dates are kept apart on purpose. */
export const pacifista = {
  slug: "pacifista",
  scene: "archive",
  card: "A decade of peace journalism recovered after its server and backups were lost, with every historical address kept.",
  seoTitle: "Case Study: Rebuilding a Lost News Archive | SIGIL LABS",
  seoDescription:
    "How SIGIL LABS recovered a Colombian peace-journalism archive after its server and backups were lost: 4,229 publications live, historical URLs preserved.",
  eyebrow: "Case study / Editorial systems / Digital preservation",
  client: "PACIFISTA",
  title: "The archive was not lost. It was disconnected.",
  lead: "A decade of Colombian peace journalism went offline with its server and its local backups. We rebuilt the house without changing the address.",
  facts: [
    { k: "Period recovered", v: "2014–2025" },
    { k: "Role", v: "Recovery architecture to newsroom training" },
    { k: "Built in", v: "Aug–Oct 2026" },
  ],
  chapters: [
    {
      id: "loss",
      label: "The loss",
      title: "The site went down. So did the backups.",
      body: "A server incident took the publication offline and the local backups were wiped. The old domain fell with it, putting years of academic citations, press references and shared links at risk. What remained were captures in the Internet Archive.",
      metrics: [{ value: 2014, to: "–2025", label: "years of journalism at risk", plain: true }],
    },
    {
      id: "evidence",
      label: "Evidence",
      title: "The first job was not design. It was evidence.",
      body: "We inventoried the historical URLs through the Internet Archive CDX API, picked the best capture available for each article, extracted the HTML into structured JSON and mapped images, audio and video.",
      metrics: [
        { value: 4175, label: "unique recoverable articles" },
        { value: 9479, label: "images downloaded from captures" },
        { value: 79, label: "author profiles reconstructed" },
      ],
      note: "Extraction pipeline, closed August 18, 2026.",
    },
    {
      id: "separate",
      label: "Sanitation",
      title: "We separated the journalism from the attack.",
      body: "The captures carried injected redirect code hidden from readers, plus casino spam in Russian mixed into the editorial content. It was removed during extraction, not cleaned on the surface afterwards, and checked through more than one path.",
      metrics: [
        { value: 2705, label: "articles stripped of injected redirect code" },
        { value: 19, label: "Cyrillic spam tags isolated and excluded" },
        { value: 0, label: "traces of the redirector in the verified corpus" },
      ],
    },
    {
      id: "address",
      label: "Permalinks",
      title: "Every historical address stayed intact.",
      body: "The slug is part of the heritage. Post names, dates, authors and section routes were kept, including /notas/%postname%/, so the redesign would not break search results, citations or years of backlinks.",
      metrics: [{ value: 4173, label: "items in the WordPress import file" }],
    },
    {
      id: "library",
      label: "Knowledge base",
      title: "An archive you can research, not just read.",
      body: "A Memory Center turns the recovered archive into a consultable collection: search and filters by format, year and topic, formal citations, RIS export for Zotero, Mendeley and EndNote, a CSV dataset, a PDF per piece, and Dublin Core and Highwire Press metadata.",
      metrics: [
        { value: 48, label: "audio and video pieces, none broken" },
        { value: 11, label: "video and PDF tutorials for the newsroom" },
      ],
    },
    {
      id: "absence",
      label: "Honesty",
      title: "What survives is published. What does not is declared.",
      body: "Some images were never captured. Instead of inventing a photo or leaving a broken box, the reader sees a quiet editorial statement: archive not preserved. Substitutes would have falsified the record.",
      metrics: [{ value: 91, to: "%", label: "of the graphic archive visible on the site" }],
    },
    {
      id: "result",
      label: "Result",
      title: "A clean archive the newsroom can run again.",
      body: "The publication has a clean, searchable system with its history back at its original addresses, and a team trained to publish, correct, schedule and manage it on its own.",
      metrics: [
        { value: 4229, label: "publications loaded and working" },
        { value: 10436, label: "images visible on the site" },
        { value: 0, label: "broken images inside article bodies" },
      ],
      note: "Measured on the development site, September 5, 2026.",
    },
  ],
  method: {
    eyebrow: "How it was built",
    title: "AI does the volume. A person signs off.",
    body: "SIGIL builds on an agentic workflow: plan, implement, review, with human approval gates. Claude, GPT and DeepSeek agents split code generation, platform control and verification.",
    steps: [
      { t: "Plan against evidence", b: "The scope is written from what the captures actually contain, before any code. Decisions such as keeping every permalink are fixed here as rules." },
      { t: "Implement in small passes", b: "Agents write the extraction, cleaning and WordPress layers. Lower-cost models take repetitive work; stronger ones take architecture and review." },
      { t: "Verify through a second path", b: "Results are checked against recorded content, stored files and samples from the loaded system, never only against the tool that produced them." },
      { t: "Human gate", b: "Nothing is published on an agent's word. Recording the newsroom tutorials surfaced four real editorial-mode bugs that static previews had missed, and they were fixed." },
    ],
  },
  next: { href: "/cases/praxuz", label: "Next case: PRAXUZ" },
  work: { href: "/work/pacifista", label: "Watch the project showcase" },
};
