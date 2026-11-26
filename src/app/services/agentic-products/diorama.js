import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import {
  TOP,
  labelHeight,
  AUDIT_SCALE,
  stageLayout,
  auditStepProgress,
  auditScanCoordinate,
  along,
} from "./stageStates";

/* ────────────────────────────────────────────────────────────────────────────
   The diorama — a porcelain model of the work an agent takes over.

   Four platforms, one per place to start, each carrying the objects that tell
   its case: a phone filling with replies, a shelf of manuals feeding a desk, a
   belt turning data into documents, three desks wired to one hub. A single
   agent hops to whichever case the reader is on. The same four platforms then
   regroup into the three ways of working, and finally line up under a scanner
   for the audit.

   Look: matcaps painted at runtime (no textures to fetch, no lights to tune),
   rounded boxes for a bevelled, built feel, contact shadows to sit it on the
   page. Ink and porcelain only; volt marks what is active, cyan is the signal
   moving through the system. It is the site's palette, made physical.

   Framework-free on purpose: React mounts it, this file only knows three.js.
   ──────────────────────────────────────────────────────────────────────────── */

const C = {
  porcelain: 0xf5f7f9,
  paper: 0xdde2e8,
  steel: 0xa9b4c2,
  idle: 0xb9c2cd,
  volt: 0xccff00,
  cyan: 0x00f0ff,
};

const VIEW_H = 10;
const CAM_DIR = new THREE.Vector3(1, 0.92, 1).normalize();
const FACE = Math.PI / 4; // rotation that turns a prop's front (+z) toward the camera

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeOut = (t) => 1 - Math.pow(1 - clamp01(t), 3);
const easeInOut = (t) => {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
const backOut = (t) => {
  const x = clamp01(t);
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};
/* A block falling onto a stack: drops, lands, settles. */
const drop = (t) => {
  const x = clamp01(t);
  if (x < 0.7) return 1 - Math.pow(x / 0.7, 2);
  return Math.sin(((x - 0.7) / 0.3) * Math.PI) * 0.06;
};
function rand(i, salt) {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/* ── Runtime matcaps ─────────────────────────────────────────────────────── */
export function paintMatcap(stops, rim) {
  const size = 256;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d");
  g.fillStyle = stops[stops.length - 1][1];
  g.fillRect(0, 0, size, size);
  const grad = g.createRadialGradient(size * 0.4, size * 0.34, 0, size * 0.46, size * 0.44, size * 0.62);
  stops.forEach(([at, col]) => grad.addColorStop(at, col));
  g.fillStyle = grad;
  g.beginPath();
  g.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  g.fill();
  const rimGrad = g.createRadialGradient(size / 2, size / 2, size * 0.38, size / 2, size / 2, size / 2);
  rimGrad.addColorStop(0, "rgba(255,255,255,0)");
  rimGrad.addColorStop(0.8, "rgba(255,255,255,0)");
  rimGrad.addColorStop(0.94, rim);
  rimGrad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = rimGrad;
  g.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function paintShadow() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(4,5,7,0.34)");
  grad.addColorStop(0.55, "rgba(4,5,7,0.14)");
  grad.addColorStop(1, "rgba(4,5,7,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createDiorama(canvas, { reduced = false } = {}) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);

  const textures = [];
  const materials = [];
  const geometries = new Map();

  const neutralTex = paintMatcap(
    [[0, "#ffffff"], [0.28, "#f2f4f7"], [0.62, "#cdd3db"], [1, "#8b95a2"]],
    "rgba(255,255,255,0.4)"
  );
  const inkTex = paintMatcap(
    [[0, "#76808c"], [0.2, "#2c3139"], [0.6, "#121519"], [1, "#040507"]],
    "rgba(148,163,184,0.28)"
  );
  const shadowTex = paintShadow();
  textures.push(neutralTex, inkTex, shadowTex);

  const matcap = (color, tex = neutralTex) => {
    const m = new THREE.MeshMatcapMaterial({ matcap: tex, color });
    materials.push(m);
    return m;
  };
  const M = {
    porcelain: matcap(C.porcelain),
    paper: matcap(C.paper),
    steel: matcap(C.steel),
    ink: matcap(0xffffff, inkTex),
    volt: matcap(C.volt),
    cyan: (() => {
      const m = new THREE.MeshBasicMaterial({ color: C.cyan });
      materials.push(m);
      return m;
    })(),
    lens: (() => {
      const m = new THREE.MeshBasicMaterial({ color: C.cyan, transparent: true, opacity: 0.22, depthWrite: false });
      materials.push(m);
      return m;
    })(),
  };
  const idleColor = new THREE.Color(C.idle);
  const voltColor = new THREE.Color(C.volt);
  const accentMaterial = () => matcap(C.idle);

  /* Geometry is cached by shape, so forty books cost a handful of buffers. */
  const geo = (key, make) => {
    if (!geometries.has(key)) geometries.set(key, make());
    return geometries.get(key);
  };
  const rbox = (w, h, d, r = 0.04) =>
    geo(`b${w}|${h}|${d}|${r}`, () => new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2, h / 2, d / 2)));
  const cyl = (rt, rb, h, seg = 28) => geo(`c${rt}|${rb}|${h}|${seg}`, () => new THREE.CylinderGeometry(rt, rb, h, seg));
  const sph = (r) => geo(`s${r}`, () => new THREE.SphereGeometry(r, 22, 16));
  const torus = (r, t) => geo(`t${r}|${t}`, () => new THREE.TorusGeometry(r, t, 12, 48));
  /* Unit bar whose origin is at one end, so scale.x draws it along its length. */
  const unitBar = () =>
    geo("unitbar", () => new RoundedBoxGeometry(1, 0.03, 0.04, 2, 0.012).translate(0.5, 0, 0));

  const mesh = (g, m, x = 0, y = 0, z = 0) => {
    const o = new THREE.Mesh(g, m);
    o.position.set(x, y, z);
    return o;
  };

  const pawn = (bodyMat, headMat, s = 1) => {
    const g = new THREE.Group();
    g.add(mesh(cyl(0.1 * s, 0.14 * s, 0.34 * s), bodyMat, 0, 0.17 * s, 0));
    const head = mesh(sph(0.095 * s), headMat, 0, 0.44 * s, 0);
    g.add(head);
    g.userData.head = head;
    return g;
  };

  const phase = (t, period, offset = 0) => (reduced ? 0.999 : (((t / period + offset) % 1) + 1) % 1);

  /* ── Place props ───────────────────────────────────────────────────────── */

  // 01 Sell more — the lead arrives, the phone answers, the call gets booked.
  function sellProps(accent) {
    const g = new THREE.Group();
    const phone = new THREE.Group();
    phone.position.set(-0.45, TOP, -0.45);
    phone.rotation.y = FACE;
    phone.add(mesh(rbox(0.46, 0.07, 0.3, 0.03), M.ink, 0, 0.035, 0));
    const body = new THREE.Group();
    body.position.set(0, 0.62, 0);
    body.rotation.x = -0.1;
    body.add(mesh(rbox(0.62, 1.1, 0.1, 0.07), M.ink));
    body.add(mesh(rbox(0.52, 0.96, 0.02, 0.035), M.porcelain, 0, 0, 0.051));
    const bubbles = [
      mesh(rbox(0.34, 0.13, 0.035, 0.05), M.steel, -0.07, 0.27, 0.072),
      mesh(rbox(0.34, 0.13, 0.035, 0.05), accent, 0.07, 0.07, 0.072),
      mesh(rbox(0.3, 0.13, 0.035, 0.05), M.steel, -0.08, -0.13, 0.072),
    ];
    bubbles.forEach((b) => body.add(b));
    phone.add(body);
    g.add(phone);

    const cal = new THREE.Group();
    cal.position.set(-0.55, TOP, 0.55);
    cal.rotation.y = FACE;
    cal.add(mesh(rbox(0.46, 0.42, 0.1, 0.04), M.porcelain, 0, 0.21, 0));
    cal.add(mesh(rbox(0.46, 0.1, 0.11, 0.03), M.ink, 0, 0.37, 0));
    const check = new THREE.Group();
    check.position.set(0, 0.18, 0.07);
    const s1 = mesh(rbox(0.05, 0.13, 0.02, 0.01), accent, -0.06, -0.01, 0);
    s1.rotation.z = 0.75;
    const s2 = mesh(rbox(0.05, 0.25, 0.02, 0.01), accent, 0.05, 0.03, 0);
    s2.rotation.z = -0.62;
    check.add(s1, s2);
    cal.add(check);
    g.add(cal);

    const from = new THREE.Vector3(1.1, TOP + 0.2, 1.1);
    const to = new THREE.Vector3(-0.42, TOP + 0.85, -0.42);
    const envelopes = [0, 1].map(() => {
      const e = mesh(rbox(0.22, 0.03, 0.15, 0.012), M.porcelain);
      e.rotation.y = FACE;
      g.add(e);
      return e;
    });

    return {
      group: g,
      update(t, act) {
        const p = phase(t, 3.2);
        bubbles.forEach((b, k) => {
          const s = backOut((p - 0.12 - k * 0.2) / 0.16);
          b.scale.setScalar(THREE.MathUtils.lerp(1, Math.max(0.001, s), act));
        });
        const booked = backOut((p - 0.7) / 0.15);
        check.scale.setScalar(THREE.MathUtils.lerp(1, Math.max(0.001, booked), act));
        envelopes.forEach((e, k) => {
          const q = clamp01((phase(t, 3.2, k * 0.5) - 0.0) / 0.42);
          const live = act > 0.5 && q > 0 && q < 1;
          e.visible = live;
          if (!live) return;
          const k2 = easeInOut(q);
          e.position.lerpVectors(from, to, k2);
          e.position.y += Math.sin(k2 * Math.PI) * 0.55;
          e.scale.setScalar(1 - Math.max(0, q - 0.85) * 6);
        });
      },
    };
  }

  // 02 Serve better — the answer travels from your own manuals to the customer.
  function serveProps(accent) {
    const g = new THREE.Group();
    const shelf = new THREE.Group();
    shelf.position.set(-0.55, TOP, -0.55);
    shelf.rotation.y = FACE;
    [-0.52, 0.52].forEach((x) => shelf.add(mesh(rbox(0.05, 1.12, 0.34, 0.02), M.ink, x, 0.56, 0)));
    [0.025, 0.39, 0.75, 1.115].forEach((y) => shelf.add(mesh(rbox(1.09, 0.05, 0.34, 0.015), M.ink, 0, y, 0)));
    const bookMats = [M.porcelain, M.steel, M.paper, M.ink, M.porcelain, M.steel];
    [0.05, 0.415, 0.775].forEach((y, row) => {
      let x = -0.46;
      let n = 0;
      while (x < 0.42) {
        const w = 0.06 + rand(n + row * 20, 1) * 0.05;
        const h = 0.2 + rand(n + row * 20, 2) * 0.11;
        if (rand(n + row * 20, 3) > 0.86) {
          x += 0.08;
        } else {
          shelf.add(mesh(rbox(+w.toFixed(3), +h.toFixed(3), 0.24, 0.012), bookMats[(n + row) % bookMats.length], x + w / 2, y + h / 2, 0));
          x += w + 0.008;
        }
        n++;
      }
    });
    g.add(shelf);

    const desk = new THREE.Group();
    desk.position.set(0.28, TOP, 0.28);
    desk.rotation.y = FACE;
    desk.add(mesh(rbox(0.86, 0.4, 0.36, 0.04), M.porcelain, 0, 0.2, 0));
    desk.add(mesh(rbox(0.92, 0.045, 0.42, 0.02), M.ink, 0, 0.42, 0));
    g.add(desk);

    const visitor = pawn(M.porcelain, M.steel);
    visitor.position.set(0.86, TOP, 0.86);
    g.add(visitor);

    const bubble = new THREE.Group();
    bubble.position.set(0.86, TOP + 0.98, 0.86);
    bubble.rotation.y = FACE;
    bubble.add(mesh(rbox(0.42, 0.24, 0.06, 0.06), accent));
    const tail = mesh(rbox(0.09, 0.09, 0.06, 0.02), accent, -0.09, -0.12, 0);
    tail.rotation.z = Math.PI / 4;
    bubble.add(tail);
    g.add(bubble);

    const a = new THREE.Vector3(-0.55, TOP + 0.95, -0.55);
    const b = new THREE.Vector3(0.15, TOP + 1.8, 0.15);
    const c = new THREE.Vector3(0.86, TOP + 1.0, 0.86);
    const curve = new THREE.QuadraticBezierCurve3(a, b, c);
    const pulses = [0, 1, 2, 3].map(() => {
      const p = mesh(sph(0.045), M.cyan);
      g.add(p);
      return p;
    });

    return {
      group: g,
      update(t, act) {
        bubble.position.y = TOP + 0.98 + (reduced ? 0 : Math.sin(t * 2.1) * 0.035 * act);
        pulses.forEach((p, k) => {
          const q = phase(t, 2.2, k / 4);
          p.visible = act > 0.5 && !reduced;
          if (!p.visible) return;
          curve.getPoint(q, p.position);
          p.scale.setScalar(act * (0.6 + Math.sin(q * Math.PI) * 0.6));
        });
      },
    };
  }

  // 03 Operate without friction — data in, documents out, the report builds itself.
  function operateProps(accent) {
    const g = new THREE.Group();
    const z = 0.45;
    g.add(mesh(rbox(1.4, 0.09, 0.42, 0.03), M.steel, -0.2, TOP + 0.34, z));
    [[-0.82, z - 0.15], [-0.82, z + 0.15], [0.42, z - 0.15], [0.42, z + 0.15]].forEach(([x, zz]) =>
      g.add(mesh(cyl(0.03, 0.03, 0.3, 12), M.ink, x, TOP + 0.15, zz))
    );
    const rollers = [];
    for (let i = 0; i < 7; i++) {
      const r = mesh(cyl(0.042, 0.042, 0.44, 14), M.ink, -0.8 + i * 0.2, TOP + 0.405, z);
      r.rotation.x = Math.PI / 2;
      rollers.push(r);
      g.add(r);
    }
    const printer = new THREE.Group();
    printer.position.set(0.72, TOP, z);
    printer.add(mesh(rbox(0.5, 0.64, 0.52, 0.06), M.porcelain, 0, 0.32, 0));
    printer.add(mesh(rbox(0.03, 0.05, 0.34, 0.01), M.ink, -0.25, 0.45, 0));
    printer.add(mesh(rbox(0.12, 0.04, 0.12, 0.015), accent, 0.12, 0.65, 0.12));
    g.add(printer);

    const sheets = [0, 1, 2, 3].map(() => {
      const s = mesh(rbox(0.28, 0.014, 0.34, 0.006), M.porcelain);
      g.add(s);
      return s;
    });

    g.add(mesh(rbox(0.86, 0.05, 0.38, 0.02), M.paper, 0.15, TOP + 0.025, -0.55));
    const heights = [0.32, 0.5, 0.4, 0.86];
    const bars = heights.map((h, k) => {
      const bar = mesh(rbox(0.13, 1, 0.13, 0.03), k === 3 ? accent : M.ink, 0.15 + (k - 1.5) * 0.18, 0, -0.55);
      g.add(bar);
      return bar;
    });

    return {
      group: g,
      update(t, act) {
        sheets.forEach((s, k) => {
          const q = act > 0.5 ? phase(t, 2.4, k / 4) : 0.15 + k * 0.22;
          const x = -0.85 + q * 1.3;
          s.position.set(x, TOP + 0.452, z);
          s.visible = x < 0.44;
          s.scale.setScalar(Math.min(1, q * 8));
        });
        if (act > 0.5 && !reduced) rollers.forEach((r) => (r.rotation.y = t * 6));
        bars.forEach((bar, k) => {
          const wobble = reduced ? 0 : Math.sin(t * 2 + k * 1.3) * 0.1 * act;
          const alert = k === 3 && !reduced ? Math.max(0, Math.sin(t * 3)) * 0.12 * act : 0;
          const h = heights[k] * (1 + wobble + alert);
          bar.scale.y = h;
          bar.position.y = TOP + 0.05 + h / 2;
        });
      },
    };
  }

  // 04 Create faster — three desks, one shared system, the same capability.
  function createProps(accent) {
    const g = new THREE.Group();
    g.add(mesh(cyl(0.34, 0.4, 0.36, 36), M.ink, 0, TOP + 0.18, 0));
    const ring = mesh(torus(0.33, 0.035), accent, 0, TOP + 0.4, 0);
    ring.rotation.x = Math.PI / 2;
    g.add(ring);
    g.add(mesh(sph(0.15), M.porcelain, 0, TOP + 0.5, 0));

    const angles = [Math.PI * 0.25 - Math.PI, -0.35, Math.PI * 0.25 + 0.6 + Math.PI / 2];
    const traces = [];
    angles.forEach((ang) => {
      const dx = Math.cos(ang);
      const dz = Math.sin(ang);
      const desk = mesh(rbox(0.4, 0.22, 0.28, 0.03), M.porcelain, dx * 0.66, TOP + 0.11, dz * 0.66);
      desk.rotation.y = -ang + Math.PI / 2;
      g.add(desk);
      const person = pawn(M.steel, accent, 0.85);
      person.position.set(dx * 0.95, TOP, dz * 0.95);
      g.add(person);
      const trace = mesh(unitBar(), M.steel, dx * 0.38, TOP + 0.012, dz * 0.38);
      trace.scale.x = 0.66;
      trace.rotation.y = -ang;
      g.add(trace);
      traces.push([dx, dz]);
    });
    const pulses = traces.map(() => {
      const p = mesh(sph(0.04), M.cyan);
      g.add(p);
      return p;
    });

    return {
      group: g,
      update(t, act, dt) {
        if (!reduced) ring.rotation.z += dt * (0.3 + act * 1.6);
        pulses.forEach((p, k) => {
          const q = phase(t, 1.6, k / 3);
          p.visible = act > 0.5 && !reduced;
          if (!p.visible) return;
          const r = 1.02 - q * 0.62;
          p.position.set(traces[k][0] * r, TOP + 0.06, traces[k][1] * r);
        });
      },
    };
  }

  /* ── Way props ─────────────────────────────────────────────────────────── */

  const stack = (g, x, z, mats, w, h) =>
    mats.map((m, k) => {
      const b = mesh(rbox(w, h, w, 0.045), m, x, TOP + h / 2 + k * (h + 0.01), z);
      b.userData.rest = b.position.y;
      g.add(b);
      return b;
    });
  const animateStack = (blocks, p, act, start, step) =>
    blocks.forEach((b, k) => {
      const local = (p - start - k * step) / 0.16;
      const arrived = local >= 0;
      const off = arrived ? drop(local) * 1.3 : 1.3;
      b.position.y = b.userData.rest + off * act;
      b.visible = act < 0.5 || arrived;
    });

  // Build — we put the blocks in place, next to your team.
  function buildProps(accent) {
    const g = new THREE.Group();
    const blocks = stack(g, -0.2, -0.2, [M.steel, M.porcelain, M.ink, accent], 0.6, 0.24);
    const client = pawn(M.porcelain, M.ink);
    client.position.set(0.7, TOP, 0.6);
    g.add(client);
    return { group: g, update: (t, act) => animateStack(blocks, phase(t, 4), act, 0.08, 0.17) };
  }

  // Enable — the first system is ours, the second one is built by your team.
  function enableProps(accent) {
    const g = new THREE.Group();
    stack(g, -0.5, -0.45, [M.steel, M.porcelain, M.ink], 0.44, 0.2);
    const theirs = stack(g, 0.4, 0.32, [M.steel, M.porcelain, accent], 0.44, 0.2);
    const person = pawn(M.steel, accent);
    person.position.set(0.95, TOP, -0.12);
    g.add(person);
    const token = mesh(rbox(0.16, 0.16, 0.16, 0.04), accent);
    g.add(token);
    const a = new THREE.Vector3(-0.5, TOP + 0.85, -0.45);
    const c = new THREE.Vector3(0.95, TOP + 0.75, -0.12);
    return {
      group: g,
      update(t, act) {
        const p = phase(t, 4);
        const q = clamp01(p / 0.28);
        token.visible = act > 0.5 && q > 0 && q < 1 && !reduced;
        if (token.visible) {
          token.position.lerpVectors(a, c, easeInOut(q));
          token.position.y += Math.sin(q * Math.PI) * 0.5;
          token.rotation.y = q * Math.PI;
        }
        animateStack(theirs, p, act, 0.32, 0.17);
      },
    };
  }

  // Audit — the lens passes over what you already run.
  function auditWayProps(accent) {
    const g = new THREE.Group();
    const heights = [0.42, 0.72, 0.3, 0.56];
    const xs = [-0.54, -0.18, 0.18, 0.54];
    const bars = heights.map((h, k) => {
      const b = mesh(rbox(0.18, h, 0.18, 0.035), M.ink, xs[k], TOP + h / 2, -0.15);
      g.add(b);
      return b;
    });
    const lens = new THREE.Group();
    lens.add(mesh(torus(0.27, 0.04), M.ink));
    const glass = mesh(cyl(0.25, 0.25, 0.015, 36), M.lens);
    glass.rotation.x = Math.PI / 2;
    lens.add(glass);
    const handle = mesh(cyl(0.035, 0.035, 0.42, 12), M.ink, 0.27, -0.27, 0);
    handle.rotation.z = Math.PI / 4;
    lens.add(handle);
    lens.rotation.set(-0.35, FACE, 0);
    g.add(lens);
    return {
      group: g,
      update(t, act) {
        const sweep = reduced ? 0.25 : Math.sin(t * 1.1) * 0.55;
        lens.position.set(sweep, TOP + 1.2 + (reduced ? 0 : Math.sin(t * 2.3) * 0.04), 0.12);
        let nearest = 0;
        xs.forEach((x, k) => {
          if (Math.abs(x - sweep) < Math.abs(xs[nearest] - sweep)) nearest = k;
        });
        bars.forEach((b, k) => (b.material = act > 0.5 && k === nearest ? accent : M.ink));
      },
    };
  }

  /* ── Audit props (driven by the scan, not by time) ─────────────────────── */

  // 01 Process map — the map draws itself as the scan crosses it.
  function mapProps(accent) {
    const g = new THREE.Group();
    const pts = [[-0.72, -0.55], [-0.22, -0.62], [0.12, -0.12], [0.62, 0.02], [0.45, 0.6], [-0.38, 0.48]];
    pts.forEach(([x, z], k) => {
      if (k !== 3) g.add(mesh(cyl(0.09, 0.09, 0.07, 20), M.ink, x, TOP + 0.035, z));
    });
    const hot = mesh(cyl(0.17, 0.17, 0.12, 28), accent, pts[3][0], TOP + 0.06, pts[3][1]);
    g.add(hot);
    const links = pts.slice(0, -1).map(([x, z], k) => {
      const [nx, nz] = pts[k + 1];
      const len = Math.hypot(nx - x, nz - z);
      const bar = mesh(unitBar(), M.steel, x, TOP + 0.03, z);
      bar.rotation.y = -Math.atan2(nz - z, nx - x);
      bar.userData.len = len;
      g.add(bar);
      return bar;
    });
    return {
      group: g,
      update(sp) {
        links.forEach((bar, k) => {
          const v = clamp01(sp * links.length - k);
          bar.scale.x = Math.max(0.001, bar.userData.len * v);
        });
        hot.scale.setScalar(0.4 + 0.6 * backOut(sp));
      },
    };
  }

  // 02 Agent candidates — some flows rise, the rest flatten into noise.
  function candidateProps(accent) {
    const g = new THREE.Group();
    const chosen = [0, 4, 2];
    const boxes = [];
    [-0.3, 0.3].forEach((z, row) =>
      [-0.45, 0, 0.45].forEach((x, col) => {
        const i = row * 3 + col;
        const b = mesh(rbox(0.32, 0.32, 0.32, 0.05), chosen.includes(i) ? accent : M.porcelain, x, TOP + 0.16, z);
        b.userData.chosen = chosen.includes(i);
        g.add(b);
        boxes.push(b);
      })
    );
    return {
      group: g,
      update(sp) {
        const e = easeOut(sp);
        boxes.forEach((b) => {
          if (b.userData.chosen) {
            b.position.y = TOP + 0.16 + e * 0.2;
            b.scale.y = 1;
          } else {
            b.scale.y = 1 - e * 0.6;
            b.position.y = TOP + 0.16 * b.scale.y;
          }
        });
      },
    };
  }

  // 03 Cost and return — what it costs to run against what it gives back.
  function costProps(accent) {
    const g = new THREE.Group();
    const cost = mesh(rbox(0.42, 1, 0.42, 0.05), M.ink, -0.32, 0, 0.12);
    const ret = mesh(rbox(0.42, 1, 0.42, 0.05), accent, 0.32, 0, -0.12);
    g.add(cost, ret);
    g.add(mesh(rbox(1.3, 0.04, 0.9, 0.02), M.paper, 0, TOP + 0.02, 0));
    return {
      group: g,
      update(sp) {
        const ch = 0.56;
        cost.scale.y = ch;
        cost.position.y = TOP + 0.04 + ch / 2;
        const rh = 0.14 + easeOut(sp) * 1.0;
        ret.scale.y = rh;
        ret.position.y = TOP + 0.04 + rh / 2;
      },
    };
  }

  // 04 Prioritised plan — first, then, later.
  function planProps(accent) {
    const g = new THREE.Group();
    const heights = [0.7, 0.46, 0.24];
    const mats = [accent, M.porcelain, M.steel];
    const steps = heights.map((h, k) => {
      const b = mesh(rbox(0.44, 1, 0.44, 0.05), mats[k], (k - 1) * 0.5, 0, (k - 1) * -0.18);
      b.userData.h = h;
      g.add(b);
      return b;
    });
    return {
      group: g,
      update(sp) {
        steps.forEach((b, k) => {
          const v = easeOut(clamp01(sp * 1.6 - k * 0.3));
          const h = Math.max(0.06, b.userData.h * v);
          b.scale.y = h;
          b.position.y = TOP + h / 2;
        });
      },
    };
  }

  /* ── Platforms ─────────────────────────────────────────────────────────── */
  const world = new THREE.Group();
  scene.add(world);

  const shadowGeo = new THREE.PlaneGeometry(1, 1);
  geometries.set("shadow", shadowGeo);
  const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false });
  materials.push(shadowMat);

  const placeBuilders = [sellProps, serveProps, operateProps, createProps];
  const wayBuilders = [buildProps, enableProps, auditWayProps];
  const auditBuilders = [mapProps, candidateProps, costProps, planProps];

  const platforms = [0, 1, 2, 3].map((i) => {
    const group = new THREE.Group();
    group.add(mesh(rbox(2.4, 0.32, 2.4, 0.09), M.porcelain));
    group.add(mesh(rbox(2.14, 0.03, 2.14, 0.012), M.paper, 0, 0.165, 0));
    const accent = accentMaterial();
    group.add(mesh(rbox(0.46, 0.07, 0.04, 0.02), accent, 0.62, 0, 1.2));
    const side = mesh(rbox(0.04, 0.07, 0.46, 0.02), accent, 1.2, 0, 0.62);
    group.add(side);

    const sets = {
      place: placeBuilders[i](accent),
      way: wayBuilders[i] ? wayBuilders[i](accent) : null,
      audit: auditBuilders[i](accent),
    };
    Object.values(sets).forEach((s) => s && group.add(s.group));

    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    world.add(shadow);
    world.add(group);

    return {
      group,
      accent,
      sets,
      shadow,
      vis: { place: 1, way: 0, audit: 0 },
      act: { place: 0, way: 0 },
      lit: 0,
      target: new THREE.Vector3(),
      scale: 1,
      targetScale: 1,
    };
  });

  /* ── The agent ─────────────────────────────────────────────────────────── */
  const robot = new THREE.Group();
  const robotBody = new THREE.Group();
  robotBody.rotation.y = FACE;
  robotBody.add(mesh(rbox(0.44, 0.42, 0.38, 0.12), M.porcelain));
  robotBody.add(mesh(rbox(0.34, 0.15, 0.04, 0.05), M.ink, 0, 0.04, 0.19));
  [-0.08, 0.08].forEach((x) => robotBody.add(mesh(rbox(0.06, 0.06, 0.02, 0.02), M.volt, x, 0.04, 0.215)));
  [-0.26, 0.26].forEach((x) => robotBody.add(mesh(rbox(0.08, 0.18, 0.14, 0.03), M.steel, x, -0.04, 0)));
  robotBody.add(mesh(cyl(0.015, 0.015, 0.18, 8), M.ink, 0, 0.3, 0));
  robotBody.add(mesh(sph(0.045), M.volt, 0, 0.41, 0));
  robot.add(robotBody);
  world.add(robot);
  const robotShadow = new THREE.Mesh(shadowGeo, shadowMat);
  robotShadow.rotation.x = -Math.PI / 2;
  world.add(robotShadow);

  /* ── The scanner ───────────────────────────────────────────────────────── */
  const scanner = new THREE.Group();
  const gate = new THREE.Group();
  gate.rotation.y = FACE; // local z runs along the tiles' depth
  gate.add(mesh(rbox(0.07, 0.02, 2.9, 0.01), M.cyan, 0, 0.15, 0));
  gate.add(mesh(rbox(0.05, 0.05, 2.9, 0.02), M.cyan, 0, 1.65, 0));
  [-1.45, 1.45].forEach((z) => gate.add(mesh(cyl(0.035, 0.035, 1.6, 12), M.ink, 0, 0.85, z)));
  scanner.add(gate);
  scanner.scale.setScalar(0.001);
  world.add(scanner);

  /* ── State ─────────────────────────────────────────────────────────────── */
  const camTarget = new THREE.Vector3(0, 0.35, 0);
  const camGoal = new THREE.Vector3(0, 0.35, 0);
  let zoom = 1;
  let zoomGoal = 1;
  let scanShown = 0;
  let scannerVis = 0;
  let lastKey = "";
  const hop = { from: new THREE.Vector3(0, 1.25, 0), start: -10, dur: 0.95 };
  const robotPos = new THREE.Vector3(0, 1.25, 0);
  const robotGoal = new THREE.Vector3();
  const tmp = new THREE.Vector3();
  let layout = stageLayout("overview", -1);
  let width = 1;
  let height = 1;

  const damp = (dt, speed) => (reduced ? 1 : 1 - Math.exp(-dt * speed));

  function setSize(w, h) {
    width = Math.max(1, w);
    height = Math.max(1, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(width, height, false);
    const aspect = width / height;
    camera.left = (-VIEW_H * aspect) / 2;
    camera.right = (VIEW_H * aspect) / 2;
    camera.top = VIEW_H / 2;
    camera.bottom = -VIEW_H / 2;
    camera.updateProjectionMatrix();
  }

  function frame(dt, t, { chapter, index, scan }) {
    const key = `${chapter}-${index}`;
    if (key !== lastKey) {
      const prevChapter = lastKey.split("-")[0];
      layout = stageLayout(chapter, index);
      hop.from.copy(robotPos);
      hop.start = t;
      // Long jumps between chapters take a little longer than hops inside one.
      hop.dur = prevChapter && prevChapter !== chapter ? 1.25 : 0.9;
      lastKey = key;
    }

    const scanP = reduced ? 1 : scan;
    scanShown += (scanP - scanShown) * damp(dt, 6);

    // Platforms: position, scale, which prop set is showing, how lit they are.
    platforms.forEach((pl, i) => {
      const L = layout.platforms[i];
      const bob = reduced ? 0 : Math.sin(t * 0.8 + i * 1.7) * 0.03;
      pl.target.set(L.pos[0], L.pos[1] + bob, L.pos[2]);
      pl.group.position.lerp(pl.target, damp(dt, 3.2));
      pl.scale += (L.scale - pl.scale) * damp(dt, 3.2);
      pl.group.scale.setScalar(Math.max(0.001, pl.scale));
      pl.group.visible = pl.scale > 0.01;

      ["place", "way", "audit"].forEach((name) => {
        const set = pl.sets[name];
        if (!set) return;
        const goal = layout.show[name] ? 1 : 0;
        pl.vis[name] += (goal - pl.vis[name]) * damp(dt, 5);
        const v = pl.vis[name];
        set.group.visible = v > 0.01;
        set.group.scale.setScalar(Math.max(0.001, easeOut(v)));
      });

      const sp = layout.show.audit ? auditStepProgress(scanShown, i) : 0;
      const litGoal = L.active ? 1 : layout.show.audit && sp >= 1 ? 1 : 0;
      pl.lit += (litGoal - pl.lit) * damp(dt, 5);
      pl.accent.color.lerpColors(idleColor, voltColor, pl.lit);

      const actGoal = L.active ? 1 : 0;
      pl.act.place += ((layout.show.place ? actGoal : 0) - pl.act.place) * damp(dt, 4);
      pl.act.way += ((layout.show.way ? actGoal : 0) - pl.act.way) * damp(dt, 4);

      if (pl.sets.place.group.visible) pl.sets.place.update(t, pl.act.place, dt);
      if (pl.sets.way && pl.sets.way.group.visible) pl.sets.way.update(t, pl.act.way, dt);
      if (pl.sets.audit.group.visible) pl.sets.audit.update(reduced ? 1 : sp);

      const p = pl.group.position;
      pl.shadow.position.set(p.x, -0.22, p.z);
      pl.shadow.scale.setScalar(3.7 * pl.scale);
      pl.shadow.visible = pl.group.visible;
    });

    // Scanner sweeps the row in step with the readouts in the DOM.
    scannerVis += ((layout.scanner ? 1 : 0) - scannerVis) * damp(dt, 4);
    scanner.visible = scannerVis > 0.01;
    scanner.scale.setScalar(Math.max(0.001, easeOut(scannerVis)));
    const scanR = auditScanCoordinate(scanShown);
    const [sx, , sz] = along(scanR);
    scanner.position.set(sx, 0, sz);

    // The agent: walk to its spot, with an arc when the spot changes.
    if (layout.robot.platform !== undefined) {
      const pl = platforms[layout.robot.platform];
      const [ox, oy, oz] = layout.robot.offset;
      tmp.set(ox, TOP + oy, oz).multiplyScalar(pl.scale);
      robotGoal.copy(pl.group.position).add(tmp);
      robotGoal.y += 0.34 * pl.scale;
    } else if (layout.scanner) {
      robotGoal.set(sx, 2.05, sz);
    } else {
      robotGoal.set(...layout.robot.world);
    }
    const h = reduced ? 1 : clamp01((t - hop.start) / hop.dur);
    const k = easeInOut(h);
    robotPos.lerpVectors(hop.from, robotGoal, k);
    const arc = Math.sin(k * Math.PI) * (hop.dur > 1 ? 1.6 : 1.0);
    const hover = reduced ? 0 : Math.sin(t * 2.4) * 0.05;
    robot.position.set(robotPos.x, robotPos.y + arc + hover, robotPos.z);
    robot.rotation.z = reduced ? 0 : Math.sin(k * Math.PI) * 0.18;
    const floorY = robotGoal.y - 0.34;
    robotShadow.position.set(robot.position.x, floorY + 0.005, robot.position.z);
    const lift = robot.position.y - robotGoal.y;
    robotShadow.scale.setScalar(Math.max(0.2, 0.75 - lift * 0.25));

    // Camera: frame the step being read.
    camGoal.set(...layout.camera.target);
    zoomGoal = layout.camera.zoom;
    camTarget.lerp(camGoal, damp(dt, 2.6));
    zoom += (zoomGoal - zoom) * damp(dt, 2.6);
    camera.position.copy(camTarget).addScaledVector(CAM_DIR, 30);
    camera.lookAt(camTarget);
    camera.zoom = zoom;
    camera.updateProjectionMatrix();

    renderer.render(scene, camera);
  }

  /* Label anchors in CSS pixels, one per platform. */
  function labels(chapter) {
    return platforms.map((pl, i) => {
      tmp.copy(pl.group.position);
      tmp.y += labelHeight(chapter, i) * pl.scale;
      tmp.project(camera);
      const x = ((tmp.x + 1) / 2) * width;
      const y = ((1 - tmp.y) / 2) * height;
      // A label that would be cut by the stage edge is hidden, not cropped.
      const inside = x > 90 && x < width - 90 && y > 40 && y < height - 40;
      return {
        x,
        y,
        visible: pl.scale > 0.4 && pl.group.visible && inside,
        lit: pl.lit > 0.5,
      };
    });
  }

  function dispose() {
    geometries.forEach((g) => g.dispose());
    materials.forEach((m) => m.dispose());
    textures.forEach((t) => t.dispose());
    renderer.dispose();
  }

  return { setSize, frame, labels, dispose, auditScale: AUDIT_SCALE };
}
