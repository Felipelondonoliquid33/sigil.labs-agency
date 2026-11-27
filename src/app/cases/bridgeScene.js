import { C, FLAT, rand, iso, createStoryScene } from "./sceneKit";

/* PRAXUZ: the bridge is the protagonist. Loose messages and files become a
   storefront and a campus joined by a bridge, then the campus itself. */

const N = 240;
const Y45 = Math.PI / 4;

/* Pieces 0-75 store island, 76-151 campus island, 152-239 the bridge deck. */
function formation(chapter, i, t) {
  if (chapter === "manual") {
    // Chats, files and links orbiting one overloaded person.
    const layer = rand(i, 1);
    const a = rand(i, 2) * Math.PI * 2 + t * (0.25 + layer * 0.5) * (i % 2 ? 1 : -1);
    const d = 0.9 + rand(i, 3) * 2.6;
    return {
      p: [Math.cos(a) * d, 0.3 + layer * 3.1 + Math.sin(t * 1.7 + i) * 0.12, Math.sin(a) * d],
      r: [rand(i, 4) * 3 + t * 0.4, a, rand(i, 5) * 3],
      s: 0.8 + rand(i, 6) * 0.5,
      color: i % 9 === 0 ? C.ink : i % 4 === 0 ? C.steel : C.porcelain,
    };
  }
  if (chapter === "bridge" || chapter === "theme") {
    const dark = chapter === "theme";
    if (i < 152) {
      const campus = i >= 76;
      const k = i % 76;
      const col = k % 5;
      const row = Math.floor(k / 5) % 5;
      const lvl = Math.floor(k / 25);
      const tall = campus ? 1 : 0;
      // The dark-mode sweep rolls across the campus and back.
      const swept = dark && campus && (col + row + lvl * 2) < ((t * 5) % 22) - 4;
      return {
        p: iso((campus ? 2.55 : -2.55) + (col - 2) * 0.27, 0.12 + lvl * (0.27 + tall * 0.12), (row - 2) * 0.27),
        r: [0, Y45, 0],
        s: lvl === 3 ? 0.001 : 1,
        color: swept ? C.ink : campus && lvl === 2 ? C.volt : lvl === 0 ? C.steel : C.porcelain,
      };
    }
    const k = i - 152;
    const along = Math.floor(k / 4) / 21; // 0..1 across the gap
    const lane = (k % 4) - 1.5;
    const crossing = Math.abs(along - ((t * 0.45) % 1)) < 0.05 && (k % 4 === 1 || k % 4 === 2);
    return {
      p: iso(-1.75 + along * 3.5, 0.22 + Math.sin(along * Math.PI) * 0.85 + (crossing ? 0.12 : 0), lane * 0.2),
      r: [0, Y45, 0],
      s: 0.72,
      h: 0.4,
      color: crossing ? C.cyan : C.paper,
    };
  }
  if (chapter === "speed") {
    // Two lanes of the same distance.
    const lane = i % 2;
    const k = Math.floor(i / 2);
    const x = k % 40;
    const z = Math.floor(k / 40);
    return {
      p: iso(-3.4 + x * 0.175, 0.08, (lane ? 0.85 : -0.85) + (z - 1) * 0.2),
      r: [0, Y45, 0],
      s: 0.68,
      h: 0.35,
      color: lane ? C.porcelain : C.steel,
    };
  }
  if (chapter === "control") {
    // A sphere of functions around the agent.
    const y = 1 - (i / (N - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const a = i * 2.39996 + t * 0.18;
    const called = i % 24 === Math.floor(t * 7) % 24;
    const R = called ? 2.95 : 2.65;
    return {
      p: [Math.cos(a) * rad * R, 2.15 + y * R * 0.82, Math.sin(a) * rad * R],
      r: [0, -a + Math.PI / 2, 0],
      s: called ? 1.25 : 0.62,
      color: called ? C.volt : i % 11 === 0 ? C.ink : C.porcelain,
    };
  }
  // delivery: three instances side by side.
  const tower = Math.floor(i / 80);
  const k = i % 80;
  const col = k % 4;
  const row = Math.floor(k / 4) % 4;
  const lvl = Math.floor(k / 16);
  return {
    p: iso((tower - 1) * 2.35 + (col - 1.5) * 0.28, 0.14 + lvl * 0.3, (row - 1.5) * 0.28),
    r: [0, Y45, 0],
    s: 1,
    color: lvl === 4 ? [C.volt, C.ink, C.steel][tower] : C.porcelain,
  };
}

const spots = {
  manual: [0, 0, 0],
  bridge: [...iso(0, 1.2, 0)],
  theme: [...iso(1.2, 0, 1.5)],
  speed: [...iso(-3.0, 0, 2.6)],
  control: [0, 1.5, 0],
  delivery: [...iso(0, 0, 1.9)],
};
const views = {
  manual: { y: 1.7, zoom: 1.02 },
  bridge: { y: 0.9, zoom: 1.04 },
  theme: { y: 0.9, zoom: 1.04 },
  speed: { y: 0.6, zoom: 1.04 },
  control: { y: 2.1, zoom: 1.0 },
  delivery: { y: 1.1, zoom: 1.04 },
};

function setup(kit) {
  const base = kit.mat(C.ink);
  const slab = kit.mat(C.porcelain);
  [-2.55, 2.55].forEach((r) => {
    const g = kit.prop(["bridge", "theme"], kit.box(1.9, 0.14, 1.9, 0.06, slab, 0, -0.04, 0));
    g.position.set(...iso(r, 0, 0));
    g.rotation.y = Y45;
  });
  const platforms = [-1, 0, 1].map((k) => {
    const g = kit.prop(["delivery"], kit.box(1.55, 0.14, 1.55, 0.06, base, 0, -0.04, 0));
    g.position.set(...iso(k * 2.35, 0, 0));
    g.rotation.y = Y45;
    return g;
  });
  // Racers: the same page, before and after.
  const slow = kit.sph(0.25, kit.mat(C.ink));
  const fast = kit.sph(0.25, kit.glow(C.volt));
  const trail = kit.box(1, 0.05, 0.12, 0.02, kit.glow(C.volt, 0.45));
  trail.rotation.y = Y45;
  kit.prop(["speed"], slow, fast, trail);
  const core = kit.prop(["control"]);
  const rings = [1.0, 1.3].map((r, k) => {
    const o = kit.ring(r, 0.016, kit.glow(k ? C.cyan : C.volt));
    core.add(o);
    return o;
  });
  core.position.y = 2.15;
  const person = kit.prop(["manual"], kit.cyl(0.2, 0.55, kit.mat(C.steel), 0.75, 0.3, 0.75), kit.sph(0.18, kit.mat(C.porcelain), 0.75, 0.76, 0.75));

  return (chapter, t) => {
    const lap = kit.reduced ? 0.5 : t;
    const s = (lap / 7.8) % 1;
    const f = (lap / 0.75) % 1;
    slow.position.set(...iso(-3.4 + s * 6.8, 0.42, -0.85));
    fast.position.set(...iso(-3.4 + f * 6.8, 0.42, 0.85));
    const len = Math.max(0.05, Math.min(f * 6.8, 2.2));
    trail.scale.x = len;
    trail.position.set(...iso(-3.4 + f * 6.8 - len / 2, 0.42, 0.85));
    rings[0].rotation.set(Math.PI / 2 + Math.sin(t * 0.7) * 0.5, t * 0.6, 0);
    rings[1].rotation.set(Math.PI / 2 - Math.sin(t * 0.5) * 0.6, -t * 0.45, 0);
    person.position.y = Math.sin(t * 6) * 0.02;
    platforms.forEach((g, k) => (g.position.y = Math.sin(t * 1.2 + k * 2) * 0.05));
  };
}

export function createBridgeScene(canvas, options) {
  return createStoryScene(canvas, options, {
    count: N,
    piece: [0.23, 0.23, 0.23, 0.045],
    formation,
    spots,
    views,
    setup,
    pose: (c, t) => ({
      yaw: c === "control" ? Math.PI / 4 + t * 0.5 : Math.PI / 4,
      pitch: c === "manual" ? -0.4 : 0.1,
      cheer: c === "delivery",
    }),
  });
}
