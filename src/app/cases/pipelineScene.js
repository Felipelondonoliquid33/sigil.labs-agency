import { C, FLAT, rand, iso, createStoryScene } from "./sceneKit";

/* NEXUS: the pipeline is the protagonist. Rows go through an API portal and
   come out as users, pages and an audit you can read at a glance. Demo shapes
   only: nothing here comes from a real record. */

const N = 240;
const Y45 = Math.PI / 4;

/* Real counts from one read-only course extraction: 82 snippets by type. */
const TYPES = [60, 7, 6, 2, 2, 1, 1, 1, 1, 1];
const AUDIT = TYPES.flatMap((n, type) => Array.from({ length: n }, (_, k) => ({ type, k })));

function formation(chapter, i, t) {
  if (chapter === "manual") {
    // A queue of rows handled one at a time; one is moving, the rest wait.
    const col = i % 6;
    const row = Math.floor(i / 6);
    const current = i === Math.floor(t * 1.2) % 36;
    return {
      p: iso(-1.9 + col * 0.34 + (rand(i, 1) - 0.5) * 0.12, 0.07 + row * 0.085, (rand(i, 2) - 0.5) * 0.35 + (current ? 0.9 : 0)),
      r: [0, Y45 + (rand(i, 3) - 0.5) * 0.35, 0],
      s: current ? 1.2 : 1,
      color: current ? C.volt : row % 5 === 0 ? C.steel : C.porcelain,
    };
  }
  if (chapter === "bridge") {
    // A stream through the portal: tumbling on the way in, in lanes on the way out.
    const u = (i / N + t * 0.07) % 1;
    const x = -3.9 + u * 7.8;
    const out = x > 0;
    const loose = out ? 0 : Math.min(1, -x / 2.2);
    return {
      p: [x, 1.55 + (out ? ((i % 3) - 1) * 0.34 : (rand(i, 4) - 0.5) * 2.4 * loose), out ? ((i % 4) - 1.5) * 0.36 : (rand(i, 5) - 0.5) * 2.4 * loose],
      r: out ? [0, 0, 0] : [rand(i, 6) * 3 * loose, rand(i, 8) * 3 * loose, rand(i, 7) * 3 * loose],
      s: Math.abs(x) < 0.3 ? 1.15 : 0.85,
      color: Math.abs(x) < 0.3 ? C.cyan : out ? C.volt : C.steel,
      snap: true,
      k: 9,
    };
  }
  if (chapter === "bulk") {
    // Batch operations: blocks of users, confirmed in a wave.
    const x = i % 16;
    const z = Math.floor(i / 16);
    const gx = (x - 7.5) * 0.31 + (x > 7 ? 0.3 : -0.3);
    const gz = (z - 7) * 0.31 + (z > 7 ? 0.3 : -0.3);
    const done = x + z < ((t * 9) % 44) - 2;
    return { p: [gx, 0.13 + (done ? 0.14 : 0), gz], r: FLAT, s: 1, color: done ? C.volt : C.porcelain };
  }
  if (chapter === "publish") {
    // Pages assembling themselves out of components.
    const page = Math.floor(i / 80);
    const k = i % 80;
    const x = k % 5;
    const y = Math.floor(k / 5);
    const head = y > 13;
    const built = k < ((t * 26 + page * 20) % 120);
    return {
      p: iso((page - 1) * 2.15 + (x - 2) * 0.3, 0.2 + y * 0.2, built ? 0 : 1.1),
      r: [0, Y45, 0],
      s: built ? 1 : 0.4,
      h: 0.62,
      color: head ? C.ink : y % 5 === 3 ? C.volt : C.porcelain,
    };
  }
  if (chapter === "audit") {
    // One tower per component type, as tall as its real count.
    const a = AUDIT[i];
    if (!a) return { p: [(rand(i, 8) - 0.5) * 7, -0.6, (rand(i, 9) - 0.5) * 7], r: FLAT, s: 0.001, color: C.steel };
    // The 60 "component" snippets stand as a 4-wide block so it stays in frame.
    const wide = a.type === 0;
    const r = wide ? -2.9 + (a.k % 4) * 0.27 : -1.45 + (a.type - 1) * 0.5;
    const y = wide ? Math.floor(a.k / 4) : a.k;
    return {
      p: iso(r, 0.15 + y * 0.245, 0),
      r: [0, Y45, 0],
      s: 1,
      color: a.type === 9 ? C.ink : wide ? C.porcelain : a.type % 2 ? C.volt : C.steel,
    };
  }
  // select: ~40 audited, 20 chosen to refine, 17 published.
  const k = i;
  if (k >= 40) return { p: iso((rand(i, 10) - 0.5) * 6, -0.7, (rand(i, 11) - 0.5) * 4), r: FLAT, s: 0.001, color: C.steel };
  const col = k % 10;
  const row = Math.floor(k / 10);
  const chosen = k < 20;
  const published = k < 17;
  return {
    p: iso((col - 4.5) * 0.52, 0.2 + (published ? 1.5 : chosen ? 0.8 : 0), (row - 1.5) * 0.62),
    r: [0, Y45, 0],
    s: 1.65,
    h: chosen ? 1 : 0.5,
    color: published ? C.volt : chosen ? C.ink : C.steel,
  };
}

const spots = {
  manual: [...iso(0.9, 0, 0.8)],
  bridge: [0.2, 0, 2.5],
  bulk: [...iso(0, 0, 3.3)],
  publish: [...iso(0.2, 0, 1.8)],
  audit: [...iso(2.4, 0, 1.2)],
  select: [...iso(0, 0, 2.2)],
};
const views = {
  manual: { y: 1.5, zoom: 1.04 },
  bridge: { y: 1.4, zoom: 1.06 },
  bulk: { y: 0.4, zoom: 1.0 },
  publish: { y: 1.7, zoom: 1.02 },
  audit: { y: 1.7, zoom: 1.0 },
  select: { y: 1.2, zoom: 1.06 },
};

function setup(kit) {
  const ink = kit.mat(C.ink);
  const person = kit.prop(["manual"], kit.cyl(0.22, 0.6, kit.mat(C.steel), 0, 0.3, 0), kit.sph(0.19, kit.mat(C.porcelain), 0, 0.82, 0), kit.box(1.0, 0.45, 0.55, 0.06, ink, -0.1, 0.22, 0.55));
  person.position.set(...iso(0.9, 0, -0.5));

  // The API portal.
  const portal = kit.prop(["bridge"]);
  const outer = kit.ring(1.5, 0.12, ink);
  const inner = kit.ring(1.3, 0.035, kit.glow(C.cyan));
  [outer, inner].forEach((o) => o.rotation.set(0, Math.PI / 2, 0));
  portal.add(outer, inner, kit.box(0.5, 0.2, 1.3, 0.06, ink, 0, -1.55, 0));
  portal.position.y = 1.6;

  const scan = kit.prop(["audit"], kit.box(6.4, 0.025, 0.06, 0.01, kit.glow(C.cyan)));
  scan.rotation.y = Math.PI / 4;
  kit.prop(["select"], kit.box(5.7, 0.1, 2.9, 0.05, kit.mat(C.porcelain), 0, 0, 0)).rotation.y = Math.PI / 4;

  return (chapter, t) => {
    inner.rotation.z = t * 1.4;
    inner.scale.setScalar(1 + Math.sin(t * 3) * 0.03);
    scan.position.y = kit.reduced ? 2 : 0.2 + ((Math.sin(t * 0.9) + 1) / 2) * 3.7;
  };
}

export function createPipelineScene(canvas, options) {
  return createStoryScene(canvas, options, {
    count: N,
    piece: [0.25, 0.22, 0.19, 0.035],
    formation,
    spots,
    views,
    setup,
    pose: (c) => ({ yaw: c === "audit" ? -Math.PI * 0.2 : Math.PI / 4, pitch: c === "audit" ? -0.3 : 0.08, cheer: c === "select" }),
  });
}
