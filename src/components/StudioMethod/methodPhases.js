/* Timing shared by the 3D stage and its live readout, so the message on screen
   and the lamps in the scene can never disagree. Pure, no imports. */

export const TESTS = [
  "a customer sees the price",
  "an empty form is rejected",
  "the quote adds up",
  "a person receives the handover",
  "the report names its sources",
];

export const PAIR_SECONDS = 2.4;
/* How far into a test's slot it turns green. */
export const GREEN_AT = 0.5;

export function pairPhase(t) {
  const slot = t / PAIR_SECONDS;
  const index = Math.floor(slot) % TESTS.length;
  const f = slot % 1;
  return { index, f, green: f >= GREEN_AT };
}
