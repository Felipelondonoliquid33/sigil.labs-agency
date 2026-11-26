/* Pure data and functions shared by the section (DOM) and the 3D stage.

   Nothing here touches three.js, React or the browser, so the section can
   import it without pulling the 3D bundle into the route, and it can be ported
   to TypeScript as-is (see the shapes documented on each export).

   Coordinates are three.js world units. The stage camera looks from +x +y +z,
   so the screen's horizontal axis is the world direction (1, 0, -1). `along(r)`
   turns a horizontal screen coordinate into a world point on the floor. */

export const PLACE_COUNT = 4;
export const WAY_COUNT = 3;
export const AUDIT_COUNT = 4;

/* Height of a platform's walkable top, relative to its centre. */
export const TOP = 0.185;

/* The audit scan is driven by one scroll range, read by both the readouts in
   the DOM and the scanner in the scene, so the two can never drift apart. */
export const AUDIT_SCAN = { start: "top 62%", end: "bottom 62%" };

/* 0..1 for how far the scan has crossed step `index`. Each step owns an equal
   slice of the scroll range; the scene spaces the four tiles to match. */
export function auditStepProgress(progress, index, count = AUDIT_COUNT) {
  const v = progress * count - index;
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

/* "place-2" → { chapter: "place", index: 2 }; "overview" → index -1. */
export function parseStageKey(key) {
  const [chapter, n] = String(key || "overview").split("-");
  return { chapter, index: n === undefined ? -1 : Number(n) };
}

const SQ = Math.SQRT1_2;
export function along(r, y = 0) {
  return [r * SQ, y, -r * SQ];
}

/* Four places sit as a diamond read left → top → bottom → right, which is the
   closest an isometric 2×2 gets to reading order. */
const PLACE_POS = [
  [-1.55, 0, 1.55],
  [-1.55, 0, -1.55],
  [1.55, 0, 1.55],
  [1.55, 0, -1.55],
];

export const WAY_SCALE = 0.8;
export const AUDIT_SCALE = 0.72;
/* One audit slice of the scroll range = one tile pitch on screen. */
export const AUDIT_PITCH = 2.6;

export function auditScanCoordinate(progress) {
  const half = (AUDIT_PITCH * AUDIT_COUNT) / 2;
  return -half + progress * half * 2;
}

/* Where the agent stands on each platform, in platform-local units, chosen so
   it never sits inside a prop and always faces the reader. */
export const ROBOT_SPOTS = {
  place: [
    [0.5, 0, -0.55],
    [0.82, 0, -0.32],
    [-0.72, 0, -0.25],
    [0, 0.72, 0],
  ],
  way: [
    [0.62, 0, -0.55],
    [0.35, 0, -0.62],
    [-0.7, 0, 0.62],
  ],
};

/* Label anchors float above each platform, by chapter. The front platform of
   the diamond (index 2) sits lower on screen than the one behind it, so its
   label hangs closer to its own props instead of over its neighbour's. */
const LABEL_HEIGHT = { overview: 2.0, place: 2.0, way: 2.3, audit: 1.5 };
export function labelHeight(chapter, index) {
  if ((chapter === "place" || chapter === "overview") && index === 2) return 1.05;
  return LABEL_HEIGHT[chapter] ?? 2;
}

/* The whole stage, described as data for one chapter step.
   Shape:
   {
     platforms: Array<{ pos: [x, y, z], scale: number, active: boolean }>,
     show: { place: boolean, way: boolean, audit: boolean },
     camera: { target: [x, y, z], zoom: number },
     robot: { platform: number, offset: [x, y, z] } | { world: [x, y, z] },
     scanner: boolean,
     tone: "light" | "dark"
   } */
export function stageLayout(chapter, index) {
  if (chapter === "way") {
    const platforms = [0, 1, 2, 3].map((i) => {
      if (i === 3) return { pos: [0, -3.5, 0], scale: 0.001, active: false };
      const [x, , z] = along((i - 1) * 2.75);
      const active = i === index;
      return { pos: [x, active ? 0.2 : -0.05, z], scale: WAY_SCALE, active };
    });
    const focus = platforms[Math.max(0, index)].pos;
    return {
      platforms,
      show: { place: false, way: true, audit: false },
      camera: { target: [focus[0] * 0.12, 0.55, focus[2] * 0.12], zoom: 1.02 },
      robot: { platform: Math.max(0, index), offset: ROBOT_SPOTS.way[Math.max(0, index)] },
      scanner: false,
      tone: "light",
    };
  }

  if (chapter === "audit") {
    const platforms = [0, 1, 2, 3].map((i) => {
      const [x, , z] = along((i - 1.5) * AUDIT_PITCH);
      return { pos: [x, 0, z], scale: AUDIT_SCALE, active: false };
    });
    return {
      platforms,
      show: { place: false, way: false, audit: true },
      camera: { target: [0, 0.45, 0], zoom: 0.96 },
      robot: { world: null },
      scanner: true,
      tone: "dark",
    };
  }

  // overview + place
  const focused = chapter === "place" && index >= 0;
  const platforms = PLACE_POS.map((pos, i) => {
    const active = focused && i === index;
    const lift = active ? 0.22 : focused ? -0.06 : 0;
    return { pos: [pos[0], lift, pos[2]], scale: 1, active };
  });
  const camera = focused
    ? { target: [PLACE_POS[index][0] * 0.62, 0.7, PLACE_POS[index][2] * 0.62], zoom: 1.42 }
    : { target: [0, 0.35, 0], zoom: 1.0 };
  return {
    platforms,
    show: { place: true, way: false, audit: false },
    camera,
    robot: focused
      ? { platform: index, offset: ROBOT_SPOTS.place[index] }
      : { world: [0, 1.25, 0] },
    scanner: false,
    tone: "light",
  };
}
