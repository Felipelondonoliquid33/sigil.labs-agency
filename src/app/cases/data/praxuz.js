/* PRAXUZ. Figures from the project notes. Performance was measured on the
   development environment, and the copy says so. */
export const praxuz = {
  slug: "praxuz",
  scene: "bridge",
  card: "A manual sales and delivery process rebuilt as a storefront bridged to a Moodle campus.",
  seoTitle: "Case Study: Moodle Campus + WooCommerce Store | SIGIL LABS",
  seoDescription:
    "How SIGIL LABS replaced selling courses through chats and shared folders with a WooCommerce store bridged to a custom Moodle 5.2 campus with AI-agent control.",
  eyebrow: "Case study / LMS architecture / Agentic operations",
  client: "PRAXUZ",
  title: "From chat threads to a campus.",
  lead: "A sports science education center was selling and delivering through social messages, shared folders and video calls. We designed the store, the campus and the bridge between them.",
  facts: [
    { k: "Sector", v: "Sports science education, Latin America" },
    { k: "Stack", v: "WordPress, WooCommerce, Moodle 5.2, React 19" },
    { k: "Started", v: "Sep 2026" },
  ],
  chapters: [
    { id: "manual", label: "The mess", title: "Every sale lived in a chat.", body: "Instagram to be found, WhatsApp to sell, Drive to deliver and video calls to teach. Each enrolment depended on someone remembering the next step.", metrics: [{ value: 4, label: "disconnected tools carrying one sale", plain: true }] },
    { id: "bridge", label: "The bridge", title: "One store. One campus. One bridge.", body: "A WordPress and WooCommerce storefront does the selling. A Moodle 5.2 campus does the teaching. Edwiser Bridge and single sign-on connect them on a Linux server, so a purchase can become access.", metrics: [{ value: 2, label: "platforms with one job each", plain: true }] },
    { id: "theme", label: "The campus", title: "A Moodle that does not look like Moodle.", body: "A custom Boost child theme in SCSS and Mustache: app shell, branded login, course heroes with progress rings, a real dark mode and React 19 islands through Moodle's official toolchain.", metrics: [{ value: 26, label: "pages audited in light and dark" }, { value: 0, label: "WCAG AA contrast issues across them" }] },
    { id: "speed", label: "Performance", title: "From 7.8 seconds to 0.03.", body: "The slowness was not the platform. Theme designer mode had disabled the cache and the code sat on a Windows file system mounted into Docker. Moving the stack onto the Linux file system removed both.", metrics: [{ value: 220, to: "×", label: "faster page loads: 7.8 s down to 0.03 s", prefix: "~" }], note: "Measured on the development environment." },
    { id: "control", label: "Agent control", title: "AI agents that operate the campus.", body: "An MCP server exposes Moodle's web services to AI agents, so courses, users and configuration are created programmatically instead of click by click.", metrics: [{ value: 748, label: "web-service functions available to agents" }] },
    { id: "delivery", label: "Delivery", title: "Three instances to show the difference.", body: "A client instance, a studio template and a vanilla Moodle side by side, with H5P, custom certificates, the tiles course format and gamification. An integrity audit fixed what it found without touching the core.", metrics: [{ value: 3, label: "instances in the sales demo", plain: true }, { value: 7, label: "bugs fixed by the integrity audit", plain: true }, { value: 0, label: "Moodle core files modified" }] },
  ],
  method: {
    eyebrow: "How it was built",
    title: "Agents operate. Code stays versioned.",
    body: "SIGIL builds on an agentic workflow: plan, implement, review, with human approval gates. Different agents take code generation, platform control and verification.",
    steps: [
      { t: "A fast environment first", b: "A reproducible Docker stack on the Linux file system, close to the server it ships to, so every iteration is cheap." },
      { t: "Split the work by agent", b: "One agent holds platform control through MCP and verifies. Others write theme and React code from self-contained handoff briefs." },
      { t: "Never edit the core", b: "Only the theme and own plugins change, kept in a versioned repository with install, backup and migration scripts." },
      { t: "Verify in the real browser", b: "Layouts, dark mode and contrast are checked on live pages, and load times are measured, not assumed." },
    ],
  },
  next: { href: "/cases/nexus", label: "Next case: Nexus" },
  work: { href: "/work/praxuz", label: "Watch the project showcase" },
};
