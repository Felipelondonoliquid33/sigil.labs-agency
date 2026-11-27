/* Cuts at a word boundary so a description fits a search result. */
export function clipDescription(text, max = 155) {
  if (!text || text.length <= max) return text;
  return `${text.slice(0, max - 1).replace(/\s+\S*$/, "").replace(/[,;:.]$/, "")}…`;
}
