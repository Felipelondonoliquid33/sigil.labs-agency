import { C, rand, iso, clamp01, createStoryScene } from "@/app/cases/sceneKit";
import { TESTS, GREEN_AT, pairPhase } from "./methodPhases";

/* ────────────────────────────────────────────────────────────────────────────
   The method, acted out. The protagonist is the work itself: 240 blocks.
     backlog  one solid mass is cut into vertical stories, each through every layer
     story    one story steps forward and gets its Given / When / Then
     pair     the agent builds one tested step at a time while a person navigates
     check    a second agent inspects what the first one built
     stop     everything freezes behind a barrier until a person decides
   ──────────────────────────────────────────────────────────────────────────── */

const N = 240;
const Y45 = Math.PI / 4;
const RED = 0xff4d4d; // only ever used for a failing test or a stop
const STORIES = 12;
const PER_STORY = N / STORIES;
const LAYERS = [C.ink, C.steel, C.paper, C.porcelain, C.porcelain];

const ease = (v) => {
  const x = clamp01(v);
  return x * x * (3 - 2 * x);
};

/* The finished build: five floors of 48, one floor per test. */
/* A point on screen (r across, d toward the viewer) plus a world offset, so
   a group keeps its corner toward the camera and reads as a solid. */
const at = (r, y, d, dx = 0, dz = 0) => {
  const [x, , z] = iso(r, 0, d);
  return [x + dx, y, z + dz];
};

function floorCell(i) {
  const floor = Math.floor(i / 48);
  const k = i % 48;
  return { floor, x: k % 8, z: Math.floor(k / 8) };
}

function formation(chapter, i, t) {
  const story = Math.floor(i / PER_STORY);
  const k = i % PER_STORY; // 2 × 2 footprint, 5 layers
  const cx = k % 2;
  const cz = Math.floor(k / 2) % 2;
  const layer = Math.floor(k / 4);

  if (chapter === "backlog") {
    // Mass → cut. Twelve stories, two shelves of six, each through every layer.
    const u = (t % 7) / 7;
    const cut = ease((u - 0.18) / 0.22) * (1 - ease((u - 0.9) / 0.08));
    const col = story % 6;
    const shelf = Math.floor(story / 6);
    const dx = (cx - 0.5) * 0.25;
    const dz = (cz - 0.5) * 0.25;
    const tight = at((col - 2.5) * 0.5, 0.16 + layer * 0.26 + shelf * 1.3, 0, dx, dz);
    const apart = at((col - 2.5) * 0.98, 0.16 + layer * 0.26 + shelf * 1.95 + (story === 0 ? 0.22 : 0), 0, dx, dz);
    return {
      p: tight.map((v, a) => v + (apart[a] - v) * cut),
      r: [0, 0, 0],
      s: 1,
      color: cut > 0.6 && story === 0 && layer === 4 ? C.volt : LAYERS[layer],
    };
  }
  if (chapter === "story") {
    if (story === 0) {
      // The chosen slice, large and in front.
      return {
        p: at(-1.2, 0.34 + layer * 0.52 + Math.sin(t * 1.4) * 0.04, 0.5, (cx - 0.5) * 0.52, (cz - 0.5) * 0.52),
        r: [0, 0, 0],
        s: 2.05,
        color: layer === 4 ? C.volt : LAYERS[layer],
      };
    }
    // The rest wait their turn at the back.
    const n = story - 1;
    return {
      p: at((n - 5) * 0.52, 0.1 + layer * 0.15, -2.2, (cx - 0.5) * 0.15, (cz - 0.5) * 0.15),
      r: [0, 0, 0],
      s: 0.6,
      color: C.steel,
    };
  }

  const { floor, x, z } = floorCell(i);
  const home = [(x - 3.5) * 0.265 - 0.1, 0.14 + floor * 0.34, (z - 2.5) * 0.265 + 0.1];

  if (chapter === "pair") {
    const { index, f, green } = pairPhase(t);
    if (floor > index) {
      // Not asked for yet: it does not exist.
      return { p: [home[0], home[1] + 2.4, home[2]], r: [0, 0, 0], s: 0.001, color: C.porcelain, snap: true };
    }
    if (floor === index) {
      // The minimum that makes the test pass drops in, block by block.
      const arrive = ease((f - 0.2 - (i % 48) * 0.004) / 0.16);
      return {
        p: [home[0], home[1] + (1 - arrive) * 2.1, home[2]],
        r: [0, 0, 0],
        s: arrive < 0.02 ? 0.001 : 1,
        color: green ? C.volt : C.porcelain,
        k: 14,
      };
    }
    return { p: home, r: [0, 0, 0], s: 1, color: floor % 2 ? C.paper : C.porcelain };
  }
  if (chapter === "check") {
    const scanY = 0.1 + ((Math.sin(t * 1.1) + 1) / 2) * 1.8;
    const hit = Math.abs(home[1] - scanY) < 0.19;
    return { p: home, r: [0, 0, 0], s: hit ? 1.12 : 1, color: hit ? C.cyan : floor === 4 ? C.volt : C.porcelain };
  }
  // stop: lifted apart and held still.
  const lift = floor * 0.1;
  return { p: [home[0], home[1] + lift, home[2]], r: [0, 0, 0], s: 0.9, color: floor === 2 && (x + z) % 3 === 0 ? RED : C.steel, k: 8 };
}

function plaque(kit, text, { bg = "#f5f7f9", fg = "#040507", w = 1.5, h = 0.46 } = {}) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = Math.round((512 * h) / w);
  const g = canvas.getContext("2d");
  const draw = () => {
    g.fillStyle = bg;
    g.fillRect(0, 0, canvas.width, canvas.height);
    g.strokeStyle = "#040507";
    g.lineWidth = 10;
    g.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);
    g.fillStyle = fg;
    g.font = `900 ${Math.round(canvas.height * 0.56)}px "Big Shoulders Display", "Barlow Condensed", sans-serif`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(text, canvas.width / 2, canvas.height / 2 + canvas.height * 0.04);
  };
  draw();
  const map = kit.texture(new kit.THREE.CanvasTexture(canvas));
  map.colorSpace = kit.THREE.SRGBColorSpace;
  // Web fonts may arrive after the first paint.
  document.fonts?.ready.then(() => {
    draw();
    map.needsUpdate = true;
  });
  const front = kit.keep(new kit.THREE.MeshBasicMaterial({ map }));
  const mesh = kit.mesh(kit.geo(new kit.THREE.PlaneGeometry(w, h)), front);
  mesh.rotation.set(0, Y45, 0);
  return mesh;
}

/* The person in the loop: always ink and volt, never confused with the agent. */
function person(kit, body = C.ink) {
  const g = new kit.THREE.Group();
  g.add(kit.cyl(0.2, 0.6, kit.mat(body), 0, 0.3, 0), kit.sph(0.19, kit.mat(C.volt), 0, 0.82, 0));
  const arm = new kit.THREE.Group();
  arm.position.set(0, 0.52, 0);
  arm.add(kit.box(0.09, 0.42, 0.09, 0.04, kit.mat(body), 0, -0.19, 0));
  g.add(arm);
  g.userData.arm = arm;
  return g;
}

function setup(kit) {
  // story: the three criteria and the approval.
  const criteria = kit.prop(["story"]);
  const plates = ["GIVEN", "WHEN", "THEN"].map((word, n) => {
    const m = plaque(kit, word);
    m.position.set(...iso(0.75, 2.5 - n * 0.68, 0.7));
    criteria.add(m);
    return m;
  });
  const approved = plaque(kit, "APPROVED ✓", { bg: "#ccff00", w: 1.9, h: 0.56 });
  criteria.add(approved);
  const signer = person(kit);
  signer.position.set(...iso(2.55, 0, 0.9));
  criteria.add(signer);

  // pair: one lamp per agreed test, and the navigator.
  const bench = kit.prop(["pair"]);
  const lampOff = kit.mat(C.steel);
  const lampRed = kit.glow(RED);
  const lampGreen = kit.glow(C.volt);
  const lamps = TESTS.map((_, n) => {
    const post = iso(1.75, 0, 0);
    bench.add(kit.box(0.34, 0.1, 0.34, 0.04, kit.mat(C.ink), post[0], 0.2 + n * 0.34, post[2]));
    const lamp = kit.sph(0.13, lampOff, post[0], 0.36 + n * 0.34, post[2]);
    bench.add(lamp);
    return lamp;
  });
  const navigator = person(kit);
  navigator.position.set(...iso(-2.35, 0, 0.8));
  bench.add(navigator);

  // check: a second agent with fresh eyes, a scanner and the sign-off.
  const review = kit.prop(["check"]);
  const scan = kit.box(3.3, 0.025, 0.05, 0.01, kit.glow(C.cyan));
  scan.rotation.y = Y45;
  review.add(scan);
  const inspector = kit.robot();
  inspector.shadow.visible = false;
  inspector.root.position.set(...iso(-2.45, 0.38, 0.7));
  inspector.root.scale.setScalar(1.05);
  review.add(inspector.root);
  const lens = new kit.THREE.Group();
  lens.add(kit.ring(0.26, 0.04, kit.mat(C.ink)));
  lens.children[0].rotation.set(0, Y45, 0);
  const glass = kit.mesh(kit.geo(new kit.THREE.CircleGeometry(0.24, 36)), kit.glow(C.cyan, 0.25));
  glass.rotation.y = Y45;
  lens.add(glass);
  review.add(lens);
  const owner = person(kit);
  owner.position.set(...iso(2.35, 0, 0.6));
  review.add(owner);
  const shipped = plaque(kit, "SIGNED OFF ✓", { bg: "#ccff00", w: 2.1, h: 0.56 });
  review.add(shipped);

  // stop: a barrier, five lamps and the person who decides.
  const halt = kit.prop(["stop"]);
  const ink = kit.mat(C.porcelain);
  halt.add(kit.box(0.14, 1.9, 0.14, 0.05, ink, ...iso(-1.85, 0.95, 1.15)), kit.box(0.14, 1.9, 0.14, 0.05, ink, ...iso(1.45, 0.95, 1.15)));
  const bar = kit.box(3.4, 0.16, 0.1, 0.04, kit.glow(RED));
  bar.rotation.y = Y45;
  halt.add(bar);
  const alarms = [0, 1, 2, 3, 4].map((n) => {
    const lamp = kit.sph(0.12, lampOff, ...iso(-1.4 + n * 0.62, 2.75, 0));
    halt.add(lamp);
    return lamp;
  });
  // On the ink stage the person is porcelain, so they read.
  const decider = person(kit, C.porcelain);
  decider.position.set(...iso(2.45, 0, 1.3));
  halt.add(decider);
  const hold = plaque(kit, "YOUR CALL", { bg: "#040507", fg: "#ccff00", w: 1.6, h: 0.5 });
  // On an ink stage the plate needs a light edge to read.
  hold.add(kit.mesh(kit.geo(new kit.THREE.PlaneGeometry(1.68, 0.58)), kit.glow(C.volt), 0, 0, -0.01));
  halt.add(hold);

  return (chapter, t, age) => {
    plates.forEach((m, n) => {
      const v = kit.reduced ? 1 : ease((age - 0.5 - n * 0.45) / 0.4);
      m.scale.setScalar(Math.max(0.001, v));
      m.position.y = 2.5 - n * 0.68 + Math.sin(t * 1.6 + n) * 0.03;
    });
    const stamp = kit.reduced ? 1 : ease((age - 2.3) / 0.25);
    approved.position.set(...iso(0.9, 0.42, 1.2));
    approved.scale.setScalar(Math.max(0.001, stamp * (1.6 - 0.6 * ease((age - 2.3) / 0.45))));
    signer.userData.arm.rotation.z = -2.4 * ease((age - 1.9) / 0.4);

    const { index, green } = pairPhase(t);
    lamps.forEach((lamp, n) => {
      const on = n < index || (n === index && green);
      lamp.material = on ? lampGreen : n === index ? lampRed : lampOff;
      lamp.scale.setScalar(n === index ? 1.25 + Math.sin(t * 9) * 0.08 : 1);
    });
    navigator.userData.arm.rotation.z = green ? -2.5 : -1.1;

    scan.position.y = kit.reduced ? 1 : 0.1 + ((Math.sin(t * 1.1) + 1) / 2) * 1.8;
    lens.position.set(...iso(-1.65, 1.15 + Math.sin(t * 1.1) * 0.55, 0.85));
    inspector.head.rotation.set(-Math.sin(t * 1.1) * 0.25, 0.7, 0);
    const done = kit.reduced ? 1 : ease((age - 3) / 0.3);
    shipped.position.set(...iso(0, 2.55, 0.6));
    shipped.scale.setScalar(Math.max(0.001, done));
    owner.userData.arm.rotation.z = -2.5 * ease((age - 2.6) / 0.4);

    const drop = kit.reduced ? 1 : ease(age / 0.55);
    bar.position.set(...iso(-0.2, 2.35 - drop * 1.45 + Math.sin(drop * Math.PI) * -0.1, 1.15));
    alarms.forEach((lamp, n) => {
      lamp.material = kit.reduced || (t * 1.6) % 6 > n ? lampRed : lampOff;
    });
    hold.position.set(...iso(2.35, 1.55 + Math.sin(t * 2) * 0.05, 1.3));
  };
}

const spots = {
  backlog: [...iso(0, 0, 2.35)],
  story: [...iso(-2.55, 0, 1.15)],
  pair: [...iso(-1.15, 0, 1.75)],
  check: [...iso(0.35, 0, 2.05)],
  stop: [...iso(-2.5, 0, 1.35)],
};
const views = {
  backlog: { y: 1.55, zoom: 1.24 },
  story: { y: 1.35, zoom: 1.36 },
  pair: { y: 1.2, zoom: 1.42 },
  check: { y: 1.4, zoom: 1.4 },
  stop: { y: 1.4, zoom: 1.34 },
};

export function createMethodScene(canvas, options) {
  return createStoryScene(canvas, options, {
    count: N,
    piece: [0.23, 0.23, 0.23, 0.045],
    formation,
    spots,
    views,
    setup,
    pose: (c, t) => {
      const working = c === "pair" && pairPhase(t).f > 0.15 && pairPhase(t).f < GREEN_AT;
      return {
        yaw: Math.PI / 4,
        pitch: c === "backlog" ? -0.25 : c === "stop" ? -0.2 : 0.08,
        reach: working ? 1.3 + Math.sin(t * 14) * 0.35 : c === "stop" ? 2.7 : 0,
        cheer: c === "check" && Math.floor(t / 4) % 2 === 1,
      };
    },
  });
}
