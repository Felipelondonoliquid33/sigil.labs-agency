import { C, FLAT, rand, iso, clamp01, createStoryScene } from "./sceneKit";

/* Agents: a city under radar. Blocks light up as the search radius widens,
   become records, then messages that stop at a gate until a person approves. */

const N = 240;
const Y45 = Math.PI / 4;
const RADII = [1.15, 2.05, 3.35]; // stand-ins for 3, 5 and 10 km

function block(i) {
  const x = (i % 16) - 7.5;
  const z = Math.floor(i / 16) - 7;
  const px = x * 0.4 + (x > 0 ? 0.08 : -0.08);
  const pz = z * 0.4;
  const h = 0.5 + rand(i, 1) * rand(i, 2) * 3.4;
  return { px, pz, h, d: Math.hypot(px, pz) };
}
const isLead = (i) => rand(i, 12) < 0.17;

/* Twelve envelopes, four across and three down, facing the reader. */
const envelopeSlot = (n) => [((n % 4) - 1.5) * 1.35 + 0.35, 2.75 - Math.floor(n / 4) * 0.95];

function formation(chapter, i, t) {
  const b = block(i);
  const tower = (color, lift = 0) => ({ p: [b.px, 0.1 * b.h + lift, b.pz], r: [0, 0, 0], s: 1, h: b.h, color });

  if (chapter === "city") return tower(i % 13 === 0 ? C.steel : C.porcelain);
  if (chapter === "radius") {
    const phase = (t * 0.22) % 1;
    const stage = Math.floor(phase * 3);
    const reach = (stage ? RADII[stage - 1] : 0) + clamp01((phase * 3 - stage) * 1.6) * (RADII[stage] - (stage ? RADII[stage - 1] : 0));
    const inside = b.d < reach;
    const lead = inside && isLead(i);
    return tower(lead ? C.volt : inside ? C.porcelain : C.steel, lead ? 0.28 : 0);
  }
  if (chapter === "memory") {
    // Records stack into a memory drum; repeats are turned away.
    const repeat = i % 6 === 0;
    if (repeat) {
      const u = (t * 0.35 + rand(i, 3)) % 1;
      const a = rand(i, 4) * Math.PI * 2;
      const d = 1.35 + (u < 0.5 ? (0.5 - u) * 4 : (u - 0.5) * 4);
      return { p: [Math.cos(a) * d, 0.4 + rand(i, 5) * 2.4, Math.sin(a) * d], r: [u * 3, a, 0], s: 0.9, h: 0.5, color: C.ink, snap: true };
    }
    const k = i - Math.floor(i / 6) - 1;
    const a = ((k % 22) / 22) * Math.PI * 2 + t * 0.15;
    const lvl = Math.floor(k / 22);
    return { p: [Math.cos(a) * 1.15, 0.2 + lvl * 0.26, Math.sin(a) * 1.15], r: [0, -a, 0], s: 0.9, h: 1, color: lvl % 3 === 2 ? C.steel : C.porcelain };
  }
  if (chapter === "draft") {
    // Words streaming from the records into the envelope being written.
    const slot = Math.floor(t * 1.4) % 12;
    const [r, y] = envelopeSlot(slot);
    const u = (i / N + t * 0.5) % 1;
    const live = i < 70;
    if (!live) return { p: [(rand(i, 13) - 0.5) * 6, -0.8, (rand(i, 14) - 0.5) * 4], r: [0, 0, 0], s: 0.001, h: 1, color: C.steel };
    const from = iso(-4.2, 0.4 + rand(i, 15) * 3, 0.9);
    const to = iso(r, y, 0.2);
    return {
      p: from.map((v, k) => v + (to[k] - v) * u + (k === 1 ? Math.sin(u * Math.PI) * 0.7 : 0)),
      r: [u * 4, Y45, u * 2],
      s: 0.42 * (1 - u * 0.5),
      h: 0.5,
      color: i % 6 === 0 ? C.volt : C.steel,
      snap: true,
      k: 12,
    };
  }
  if (chapter === "gate") {
    // Flow runs along x toward the barrier. An approval lets five through.
    const lane = i % 5;
    const k = Math.floor(i / 5);
    const z = (lane - 2) * 0.46;
    if (k < 2) {
      const u = (t * 0.28 + k * 0.07) % 1;
      const x = u < 0.4 ? -0.5 : -0.5 + ((u - 0.4) / 0.6) * 3.9;
      return { p: [x, 0.3, z], r: [0, 0, 0], s: 1.35, h: 0.45, color: u < 0.4 ? C.porcelain : C.volt, snap: true, k: 9 };
    }
    const q = k - 2;
    return { p: [-1.05 - (q % 8) * 0.38, 0.1 + Math.floor(q / 8) * 0.12, z], r: [0, 0, 0], s: 1.2, h: 0.45, color: q % 7 === 0 ? C.steel : C.porcelain };
  }
  // layers: command, orchestrator, cognition, execution.
  const layer = Math.floor(i / 60);
  const k = i % 60;
  const x = k % 10;
  const z = Math.floor(k / 10);
  const pulse = Math.abs(layer - (3 - Math.floor((t * 2.2) % 4))) === 0 && (x + z + Math.floor(t * 6)) % 7 === 0;
  return {
    p: [(x - 4.5) * 0.3, 0.2 + layer * 1.05, (z - 2.5) * 0.3],
    r: FLAT,
    s: pulse ? 1.2 : 1,
    h: 1,
    color: pulse ? C.volt : [C.ink, C.steel, C.porcelain, C.paper][layer],
  };
}

const spots = {
  city: [...iso(0, 0, 3.7)],
  radius: [...iso(0, 0, 3.7)],
  memory: [0, 0, 0],
  draft: [...iso(0.3, 0, 2.2)],
  gate: [0.15, 0, 2.15],
  layers: [...iso(2.55, 0, 0.6)],
};
const views = {
  city: { y: 0.7, zoom: 0.98 },
  radius: { y: 0.5, zoom: 0.98 },
  memory: { y: 1.55, zoom: 1.02 },
  draft: { y: 1.5, zoom: 1.04 },
  gate: { y: 0.8, zoom: 1.04 },
  layers: { y: 1.95, zoom: 0.98 },
};

function setup(kit) {
  const cyan = kit.glow(C.cyan);
  const ink = kit.mat(C.ink);
  const rings = RADII.map((r) => {
    const o = kit.ring(r, 0.022, cyan);
    kit.prop(["radius"], o).position.y = 0.04;
    return o;
  });
  const sweep = kit.box(3.35, 0.02, 0.05, 0.01, cyan, 1.675, 0, 0);
  const arm = kit.prop(["radius"], sweep);
  arm.position.y = 1.5;
  kit.prop(["radius", "city"], kit.cyl(0.05, 1.5, ink, 0, 0.75, 0));

  const drum = kit.prop(["memory"], kit.ring(1.42, 0.03, cyan), kit.cyl(1.0, 0.12, kit.mat(C.porcelain), 0, -0.1, 0));
  const gate = kit.prop(["gate"], kit.box(0.2, 1.1, 0.2, 0.05, ink, 0, 0.55, -1.35), kit.box(0.2, 1.1, 0.2, 0.05, ink, 0, 0.55, 1.35));
  const barrier = kit.box(0.1, 0.1, 2.7, 0.03, kit.glow(C.volt), 0, 0, 0);
  gate.add(barrier);
  const paper = kit.mat(C.porcelain);
  const done = kit.mat(C.volt);
  const letters = kit.prop(["draft"]);
  const envelopes = Array.from({ length: 12 }, (_, n) => {
    const env = new kit.THREE.Group();
    const body = kit.box(1.08, 0.68, 0.09, 0.04, paper);
    env.add(body);
    // The flap: two ink strokes meeting in the middle.
    [-1, 1].forEach((side) => {
      const stroke = kit.box(0.62, 0.035, 0.02, 0.008, ink, side * 0.255, 0.13, 0.06);
      stroke.rotation.z = side * 0.5;
      env.add(stroke);
    });
    const [r, y] = envelopeSlot(n);
    env.position.set(...iso(r, y, 0));
    env.rotation.y = Math.PI / 4;
    letters.add(env);
    return { env, body, y };
  });
  const slabs = kit.prop(["layers"]);
  [0, 1, 2, 3].forEach((l) => slabs.add(kit.box(3.3, 0.04, 2.1, 0.02, kit.glow(C.steel, 0.28), 0, 0.06 + l * 1.05, 0)));
  const bead = kit.sph(0.13, cyan);
  slabs.add(bead, kit.cyl(0.015, 3.4, cyan, 1.75, 1.75, 0, 8));

  return (chapter, t) => {
    arm.rotation.y = -t * 1.6;
    rings.forEach((o, k) => o.scale.setScalar(1 + Math.sin(t * 2.4 - k) * 0.012));
    drum.children[0].position.y = 0.2 + ((t * 0.8) % 3);
    const u = (t * 0.28) % 1;
    const open = kit.reduced ? 0 : clamp01((u - 0.3) * 10) * (1 - clamp01((u - 0.86) * 10));
    barrier.position.y = 0.55 + open * 0.75;
    bead.position.set(1.75, 3.35 - ((t * 0.55) % 1) * 3.2, 0);
    const writing = Math.floor(t * 1.4) % 12;
    envelopes.forEach((e, n) => {
      // Written ones turn volt: ready to review, not sent.
      const ready = kit.reduced || n < writing;
      e.body.material = ready ? done : paper;
      e.env.scale.setScalar(n === writing ? 1.16 : 1);
      e.env.position.y = e.y + Math.sin(t * 1.8 + n) * 0.03;
    });
  };
}

export function createRadarScene(canvas, options) {
  return createStoryScene(canvas, options, {
    count: N,
    piece: [0.26, 0.2, 0.26, 0.035],
    formation,
    spots,
    views,
    setup,
    pose: (c, t) => {
      const approving = c === "gate" && ((t * 0.28) % 1) > 0.28 && ((t * 0.28) % 1) < 0.6;
      return { yaw: Math.PI / 4, pitch: c === "memory" ? -0.35 : 0.12, reach: approving ? 1.7 : 0, cheer: false };
    },
  });
}
