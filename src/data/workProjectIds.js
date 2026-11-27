/* Every /work/[slug] page that is built. Keep an id here even after it leaves
   the listing, so a URL search engines already know keeps answering. */
export const workProjectIds = [
  "pacifista",
  "gsap-motion-vault",
  "li4uid",
  "puente-de-equidad",
  "yen-galindo-photography",
  "empanadas",
  "el-susurro-del-tiempo",
  "li4uid-core-web",
  "internal-r-and-d",
  "la-mar",
  "arcade-portfolio",
  "praxuz",
];

/* Built but no longer shown or listed in the sitemap: "li4uid" is the earlier
   edition of LI4UID CORE WEB, and Puente de Equidad is out of the portfolio. */
export const unlistedWorkIds = ["li4uid", "puente-de-equidad"];

/* What /work shows, in order. A string is a /work project; { story } is a
   3D case study under /cases, with covers captured from its own scene. */
export const workListing = [
  "pacifista",
  { story: "agents", name: "SIGIL AGENTS" },
  "praxuz",
  { story: "nexus", name: "NEXUS" },
  "li4uid-core-web",
  "gsap-motion-vault",
  "el-susurro-del-tiempo",
  "yen-galindo-photography",
  "empanadas",
  "la-mar",
  "internal-r-and-d",
  "arcade-portfolio",
];
