import { C, FLAT, rand, createStoryScene } from "./sceneKit";

/* The archive is the protagonist: article cards that reorganise per chapter. */

const CARDS = 240;
const BAD = 52; // cards that carried the injected code or spam
const MISSING = 9; // illustrative share that was never captured

const isBad = (i) => rand(i, 41) < BAD / CARDS;
const isMissing = (i) => !isBad(i) && rand(i, 53) < MISSING / CARDS;

/* → { p:[x,y,z], r:[x,y,z], s, color } */
function formation(chapter, i, t) {
  const col = isMissing(i) ? C.steel : C.porcelain;
  const flat = [-Math.PI / 2, 0, 0];

  if (chapter === "loss") {
    // Scattered where they fell around the dead server.
    const a = rand(i, 1) * Math.PI * 2;
    const d = 1.3 + Math.sqrt(rand(i, 2)) * 3.1;
    return {
      p: [Math.cos(a) * d, 0.02 + rand(i, 3) * 0.12, Math.sin(a) * d],
      r: [-Math.PI / 2 + (rand(i, 4) - 0.5) * 0.7, (rand(i, 5) - 0.5) * 0.7, rand(i, 6) * 6.3],
      s: 0.85,
      color: isBad(i) ? C.ink : C.steel,
    };
  }
  if (chapter === "evidence") {
    // Rising in an inventory spiral toward the scanner.
    const k = i / CARDS;
    const a = k * Math.PI * 9 + t * 0.12;
    const d = 1.15 + k * 1.5;
    return {
      p: [Math.cos(a) * d, 0.15 + k * 3.4, Math.sin(a) * d],
      r: [0, -a + Math.PI / 2, 0],
      s: 0.8,
      color: isBad(i) ? C.ink : C.porcelain,
    };
  }
  if (chapter === "separate") {
    // Clean cards form ordered stacks; infected ones drop into quarantine.
    if (isBad(i)) {
      const n = Math.floor(rand(i, 7) * 9);
      return {
        p: [2.25 + (n % 3) * 0.36 - 0.36, 0.14 + rand(i, 8) * 0.75, -1.55 + Math.floor(n / 3) * 0.4 - 0.4],
        r: [-Math.PI / 2 + (rand(i, 9) - 0.5) * 0.8, 0, rand(i, 10) * 3],
        s: 0.8,
        color: C.ink,
      };
    }
    const n = i % 20;
    return {
      p: [-2.35 + (n % 5) * 0.52, 0.04 + Math.floor(i / 20) * 0.085, 0.15 + Math.floor(n / 5) * 0.55],
      r: flat,
      s: 1,
      color: col,
    };
  }
  if (chapter === "address") {
    // Back on a street grid: every card returns to its own address.
    const x = i % 20;
    const z = Math.floor(i / 20);
    return { p: [(x - 9.5) * 0.34, 0.05, (z - 5.5) * 0.5], r: flat, s: 0.95, color: i % 20 === Math.floor(t * 6) % 20 ? C.cyan : col };
  }
  if (chapter === "library") {
    // A curved wall of shelves: browsable by year and format.
    const x = i % 30;
    const y = Math.floor(i / 30);
    const a = (x / 29 - 0.5) * 2.2 - Math.PI / 4;
    const d = 3.1;
    const pulled = (x + y * 7) % 31 === Math.floor(t * 1.3) % 31;
    const dd = pulled ? d - 0.45 : d;
    return {
      p: [Math.sin(a) * dd + 0.6, 0.3 + y * 0.4, -Math.cos(a) * dd + 1.4],
      r: [0, -a, 0],
      s: pulled ? 1.15 : 0.95,
      color: pulled ? C.volt : y % 3 === 0 ? C.steel : col,
    };
  }
  // absence + result: one wall, the gaps left visible on purpose.
  const x = i % 20;
  const y = Math.floor(i / 20);
  const wall = {
    p: [(x - 9.5) * 0.25 + (y % 2) * 0.01, 0.28 + y * 0.31, -(x - 9.5) * 0.25],
    r: [0, Math.PI / 4, 0],
    s: 0.98,
    color: C.porcelain,
  };
  if (chapter === "absence" && isMissing(i)) {
    wall.p = [wall.p[0] + 0.28, wall.p[1], wall.p[2] + 0.28];
    wall.color = C.volt;
  }
  if (chapter === "result") {
    if (isMissing(i)) wall.color = C.steel;
    // A band of light sweeps the restored wall.
    else if (Math.abs(x + y - ((t * 9) % 40)) < 1.2) wall.color = C.volt;
  }
  return wall;
}

const ROBOT_SPOT = {
  loss: [1.5, 0, 1.5],
  evidence: [2.4, 0, 1.2],
  separate: [0.55, 0, -0.35],
  address: [2.7, 0.1, 2.2],
  library: [0.2, 0, 0.6],
  absence: [1.9, 0, 2.2],
  result: [2.0, 0, 2.0],
};

const VIEW = {
  loss: { y: 0.6, zoom: 1.0 },
  evidence: { y: 1.7, zoom: 1.0 },
  separate: { y: 0.7, zoom: 1.05 },
  address: { y: 0.3, zoom: 1.0 },
  library: { y: 1.3, zoom: 1.02 },
  absence: { y: 1.8, zoom: 1.02 },
  result: { y: 1.8, zoom: 1.04 },
};

function setup(kit) {
  const server = kit.prop(["loss"]);
  [0, 1, 2].forEach((k) => {
    const unit = kit.box(1.15, 0.42, 0.9, 0.06, kit.mat(C.ink), k === 2 ? 0.28 : 0, 0.24 + k * 0.47, 0);
    unit.rotation.z = k === 2 ? -0.28 : 0;
    server.add(unit);
    [-0.3, -0.16].forEach((x) => server.add(kit.box(0.07, 0.07, 0.03, 0.02, kit.mat(C.steel), x, 0.24 + k * 0.47, 0.47)));
  });
  server.rotation.y = Math.PI / 4;

  const cyan = kit.glow(C.cyan);
  const scanner = kit.prop(["evidence"], kit.ring(2.85, 0.025, cyan));

  const rim = kit.mat(C.ink);
  const bin = kit.prop(["separate"], kit.box(1.55, 0.08, 1.55, 0.03, kit.mat(C.porcelain), 0, 0.04, 0));
  [[0, -0.75, 1.55, 0.08], [0, 0.75, 1.55, 0.08], [-0.75, 0, 0.08, 1.55], [0.75, 0, 0.08, 1.55]].forEach(([x, z, w, d]) =>
    bin.add(kit.box(w, 0.2, d, 0.03, rim, x, 0.1, z))
  );
  bin.position.set(2.25, 0, -1.55);

  const gate = kit.prop(["separate"], kit.box(0.07, 0.07, 3.4, 0.02, cyan, 0, 1.25, 0));
  [-1.7, 1.7].forEach((z) => gate.add(kit.box(0.09, 1.3, 0.09, 0.03, rim, 0, 0.65, z)));

  const streets = kit.prop(["address"]);
  for (let k = 0; k <= 12; k++) streets.add(kit.box(7.0, 0.012, 0.02, 0.005, kit.mat(C.steel), 0, 0.01, (k - 6) * 0.5));

  const exports = kit.prop(["library"]);
  const tokens = [0, 1, 2].map((k) => {
    const token = kit.box(0.5, 0.5, 0.5, 0.1, kit.mat(k === 1 ? C.volt : C.ink));
    exports.add(token);
    return token;
  });

  return (chapter, time) => {
    scanner.position.y = kit.reduced ? 2 : 0.3 + ((Math.sin(time * 1.1) + 1) / 2) * 3.4;
    gate.position.set(0.55 + (kit.reduced ? 0 : Math.sin(time * 0.9) * 0.18), 0, 0.2);
    tokens.forEach((token, k) => {
      token.position.set(-1.1 + k * 0.75, 0.75 + Math.sin(time * 1.6 + k * 1.4) * 0.14, 2.35 - k * 0.45);
      token.rotation.set(0, time * 0.4 + k, 0);
    });
  };
}

export function createArchiveScene(canvas, options) {
  return createStoryScene(canvas, options, {
    count: CARDS,
    piece: [0.22, 0.28, 0.035, 0.012],
    formation,
    spots: ROBOT_SPOT,
    views: VIEW,
    setup,
    pose: (chapter) => ({
      yaw: chapter === "result" ? Math.PI / 4 : -Math.PI * 0.62,
      pitch: chapter === "evidence" ? -0.35 : 0.12,
      cheer: chapter === "result",
    }),
  });
}
