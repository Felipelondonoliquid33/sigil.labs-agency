/* SIGIL's own agents: Apex (prospecting) and the remote operator. Internal
   products. Server details are deliberately left out. */
export const agents = {
  slug: "agents",
  scene: "radar",
  card: "Our own agents: a local prospecting system that never contacts anyone without approval, run from a phone.",
  seoTitle: "Case Study: AI Prospecting Agent with Human Approval | SIGIL LABS",
  seoDescription:
    "How SIGIL LABS built its own agents: local business prospecting with deduplication, drafted outreach that waits for human approval, and remote operation by phone.",
  eyebrow: "Case study / Agentic systems / Internal product",
  client: "SIGIL AGENTS",
  title: "Agents that wait for a yes.",
  lead: "We run our own agents before we sell them. One finds and prepares local business opportunities. Another lets us operate from a phone. Neither speaks to a stranger on its own.",
  facts: [
    { k: "Type", v: "Internal SIGIL product" },
    { k: "Stack", v: "Python, Playwright, SQLite, Telegram, LLMs" },
    { k: "Rule", v: "Sending requires explicit approval" },
  ],
  chapters: [
    { id: "city", label: "The problem", title: "The next client is a few streets away.", body: "Finding local businesses worth talking to, checking how to reach them and writing something relevant is repetitive work that comes before any real conversation.", metrics: [{ value: 10, label: "contactable prospects targeted per day" }] },
    { id: "radius", label: "Search", title: "A radius that widens only when needed.", body: "A structured business data source goes first, with map search as the fallback. The search starts close and expands only if there are not enough valid prospects. Public contact details are enriched from each business website; no address is ever invented.", metrics: [{ value: 10, to: " km", label: "outer limit: 3, then 5, then 10", plain: true }] },
    { id: "memory", label: "Memory", title: "It never knocks on the same door twice.", body: "A local database remembers every business seen. Repeats are turned away, and candidates without a contact are kept for a second review instead of being thrown out.", metrics: [{ value: 79, label: "businesses on record" }], note: "Database snapshot, September 1, 2026." },
    { id: "draft", label: "Drafts", title: "Every message is prepared, not sent.", body: "For each prospect the system matches a real SIGIL showcase, writes consultative copy and builds a spreadsheet with ready-to-open message links, then sends the morning summary to Telegram.", metrics: [{ value: 12, label: "businesses contacted from that record" }], note: "Database snapshot, September 1, 2026." },
    { id: "gate", label: "Approval", title: "Nothing leaves without a person.", body: "Searching, listing and preparing never contact anyone. A message goes out only after an explicit approval such as: approve the first five. Live sending is off by default.", metrics: [{ value: 1, label: "explicit approval required before any send", plain: true }] },
    { id: "layers", label: "Operator", title: "Command, memory, models and machines apart.", body: "A persistent agent takes orders from Telegram, Android or desktop. It keeps memory, picks a low-cost model by default and a stronger one on demand, and runs work on remote machines, where edits wait for a go-ahead.", metrics: [{ value: 4, label: "decoupled layers: command, orchestrator, cognition, execution", plain: true }] },
  ],
  method: {
    eyebrow: "How it was built",
    title: "One pipeline. Several doors. One gate.",
    body: "The design principle is that autonomy grows where an action can be undone, and stops where it reaches another person.",
    steps: [
      { t: "One central task", b: "The scheduler, the chat bot and the desktop agent all start the same pipeline, so there is no second behaviour to keep in sync." },
      { t: "Cheap by default", b: "Routine work runs on low-cost models; the copy engine can run offline with no API spend." },
      { t: "Approval is structural", b: "A send needs a pending plan and an explicit yes. It is part of the code path, not a setting someone remembers." },
      { t: "State the limits", b: "A share of businesses has no usable phone, so they are never messaged. The system records that instead of guessing." },
    ],
  },
  next: { href: "/cases/pacifista", label: "Next case: PACIFISTA" },
  work: { href: "/services/agentic-products", label: "Agentic Products" },
};
