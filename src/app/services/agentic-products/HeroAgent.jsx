"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { paintMatcap, paintShadow } from "./diorama";
import styles from "./agentic-products.module.css";

/* ────────────────────────────────────────────────────────────────────────────
   Hero agent — the same little agent that works in the diorama, met first.

   It sits in the hero, follows the cursor with its head and eyes, blinks,
   breathes, and gets a bit excited when the cursor comes close. As the reader
   scrolls it rolls down beside "We start from the task", then looks down and
   drops out of view just before the diorama, where the same agent is already
   waiting. One character carries the reader from the promise to the work.

   Motion is springs, not tweens: every angle chases its target with a little
   overshoot, which is what makes it read as soft and alive instead of rigged.

   The canvas is fixed to the viewport (pointer-events: none) so the agent can
   travel between sections; it is painted under every later section, so the
   use-case chapter scrolling up simply covers it.
   ──────────────────────────────────────────────────────────────────────────── */

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const clamp01 = (v) => clamp(v, 0, 1);
const smooth = (t) => {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
};

/* Critically-damped-ish spring: z < 1 overshoots a little, on purpose. */
export function makeSpring(v = 0) {
  return { v, vel: 0 };
}
export function stepSpring(s, target, dt, k = 70, z = 0.62) {
  const c = 2 * Math.sqrt(k) * z;
  const a = k * (target - s.v) - c * s.vel;
  s.vel += a * dt;
  s.v += s.vel * dt;
  return s.v;
}

export function buildRobot(track) {
  const neutral = paintMatcap(
    [[0, "#ffffff"], [0.28, "#f2f4f7"], [0.62, "#cdd3db"], [1, "#8b95a2"]],
    "rgba(255,255,255,0.4)"
  );
  const ink = paintMatcap(
    [[0, "#76808c"], [0.2, "#2c3139"], [0.6, "#121519"], [1, "#040507"]],
    "rgba(148,163,184,0.28)"
  );
  const shadowTex = paintShadow();
  track.textures.push(neutral, ink, shadowTex);

  const mat = (color, tex = neutral) => {
    const m = new THREE.MeshMatcapMaterial({ matcap: tex, color });
    track.materials.push(m);
    return m;
  };
  const M = {
    porcelain: mat(0xf5f7f9),
    steel: mat(0xa9b4c2),
    ink: mat(0xffffff, ink),
    volt: mat(0xccff00),
  };
  const geo = (g) => {
    track.geometries.push(g);
    return g;
  };
  const box = (w, h, d, r) => geo(new RoundedBoxGeometry(w, h, d, 3, r));
  const mesh = (g, m, x = 0, y = 0, z = 0) => {
    const o = new THREE.Mesh(g, m);
    o.position.set(x, y, z);
    return o;
  };

  const root = new THREE.Group();

  const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false });
  track.materials.push(shadowMat);
  const shadow = new THREE.Mesh(geo(new THREE.PlaneGeometry(1, 1)), shadowMat);
  shadow.position.set(0, -0.34, -0.3);
  shadow.scale.set(0.95, 0.22, 1);
  root.add(shadow);

  const pose = new THREE.Group(); // turns toward the reader / leans when rolling
  root.add(pose);

  // Treads.
  const treads = [-0.17, 0.17].map((x) => {
    const tr = mesh(box(0.15, 0.13, 0.44, 0.05), M.ink, x, -0.26, 0);
    pose.add(tr);
    return tr;
  });

  const body = new THREE.Group();
  pose.add(body);
  body.add(mesh(box(0.46, 0.36, 0.4, 0.12), M.porcelain));
  const chest = mesh(box(0.12, 0.05, 0.02, 0.02), M.volt, 0, -0.04, 0.2);
  body.add(chest);
  const arms = [-1, 1].map((side) => {
    const arm = new THREE.Group();
    arm.position.set(side * 0.27, 0.06, 0);
    arm.add(mesh(box(0.08, 0.2, 0.15, 0.035), M.steel, 0, -0.08, 0));
    body.add(arm);
    return arm;
  });

  body.add(mesh(geo(new THREE.CylinderGeometry(0.035, 0.045, 0.12, 12)), M.ink, 0, 0.22, 0));

  const head = new THREE.Group();
  head.position.set(0, 0.3, 0);
  body.add(head);
  head.add(mesh(box(0.42, 0.25, 0.34, 0.1), M.porcelain, 0, 0.08, 0));
  head.add(mesh(box(0.35, 0.16, 0.04, 0.05), M.ink, 0, 0.08, 0.17));
  const eyes = new THREE.Group();
  eyes.position.set(0, 0.08, 0.195);
  head.add(eyes);
  const eyeL = mesh(box(0.075, 0.075, 0.02, 0.025), M.volt, -0.085, 0, 0);
  const eyeR = mesh(box(0.075, 0.075, 0.02, 0.025), M.volt, 0.085, 0, 0);
  eyes.add(eyeL, eyeR);

  const antenna = new THREE.Group();
  antenna.position.set(0.1, 0.2, 0);
  head.add(antenna);
  antenna.add(mesh(geo(new THREE.CylinderGeometry(0.012, 0.012, 0.2, 8)), M.ink, 0, 0.1, 0));
  antenna.add(mesh(geo(new THREE.SphereGeometry(0.04, 16, 12)), M.volt, 0, 0.22, 0));

  return { root, pose, body, head, eyes, eyeL, eyeR, antenna, arms, treads, chest, shadow };
}

/* `contained` keeps the agent inside its own box (used on the home page); by
   default it uses a fixed canvas so it can travel between sections. */
export default function HeroAgent({ contained = false }) {
  const slot = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const slotEl = slot.current;
    const canvas = canvasRef.current;
    if (!slotEl || !canvas) return undefined;

    try {
      const probe = document.createElement("canvas");
      if (!(probe.getContext("webgl2") || probe.getContext("webgl"))) return undefined;
    } catch {
      return undefined;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const approach = slotEl.closest("[data-hero]")?.nextElementSibling || null;

    const track = { textures: [], materials: [], geometries: [] };
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch {
      return undefined;
    }
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    // Pixel camera: one world unit = one CSS pixel, y up.
    const camera = new THREE.OrthographicCamera(0, 1, 0, -1, -2000, 2000);
    const R = buildRobot(track);
    scene.add(R.root);

    let vw = 1;
    let vh = 1;
    // Canvas size: the viewport, or just the slot when contained.
    let cw = 1;
    let ch = 1;
    const resize = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      const box = slotEl.getBoundingClientRect();
      cw = contained ? Math.max(1, box.width) : vw;
      ch = contained ? Math.max(1, box.height) : vh;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
      renderer.setSize(cw, ch, false);
      camera.left = 0;
      camera.right = cw;
      camera.top = 0;
      camera.bottom = -ch;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    // ── Input ───────────────────────────────────────────────────────────
    const pointer = { x: vw * 0.4, y: vh * 0.4, last: -10 };
    const onMove = (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.last = performance.now() / 1000;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });

    // ── State ───────────────────────────────────────────────────────────
    const S = {
      yaw: makeSpring(),
      pitch: makeSpring(),
      bodyYaw: makeSpring(),
      lean: makeSpring(),
      ant: makeSpring(),
      eyeX: makeSpring(),
      eyeY: makeSpring(),
      happy: makeSpring(),
      x: makeSpring(vw * 0.7),
      y: makeSpring(vh * 0.6),
      size: makeSpring(200),
    };
    let blinkAt = 1.5;
    let blinkT = -1;
    let hopT = -10;
    let lastHappy = 0;
    let prevX = S.x.v;

    const rectOf = (el) => (el ? el.getBoundingClientRect() : null);

    let raf = 0;
    let running = false;
    let last = performance.now();

    const frame = (now) => {
      if (!running) return;
      const t = now / 1000;
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;

      const wide = vw >= 900;
      const own = rectOf(slotEl);
      // Everything below works in canvas coordinates.
      const hero = contained ? { left: 0, top: 0, width: own.width, height: own.height, bottom: own.height } : own;
      const px = contained ? pointer.x - own.left : pointer.x;
      const py = contained ? pointer.y - own.top : pointer.y;
      const ap = rectOf(approach);

      // Anchor A: standing in the hero visual. Anchor B: beside the approach
      // copy, in its empty left column. Both move with the page.
      const sizeA = contained
        ? clamp(Math.min(hero.width * 0.34, hero.height * 0.36), 110, 250)
        : wide ? clamp(hero.width * 0.21, 120, 210) : clamp(hero.width * 0.34, 100, 150);
      const ax = hero.left + hero.width * (contained ? 0.52 : wide ? 0.72 : 0.5);
      const ay = hero.top + hero.height * (contained ? 0.62 : wide ? 0.5 : 0.56);
      let tx = ax;
      let ty = ay;
      let size = sizeA;
      let travel = 0;
      let exit = 0;

      if (wide && ap) {
        travel = smooth((vh - ap.top) / (vh * 0.75));
        const sizeB = 120;
        const bx = ap.left + Math.min(ap.width * 0.16, 260);
        const by = ap.top + ap.height * 0.62;
        tx = ax + (bx - ax) * travel;
        ty = ay + (by - ay) * travel - Math.sin(travel * Math.PI) * vh * 0.1;
        size = sizeA + (sizeB - sizeA) * travel;
        exit = clamp01((vh * 0.55 - ap.bottom) / (vh * 0.35));
      } else if (!contained) {
        exit = clamp01((vh * 0.35 - hero.bottom) / (vh * 0.35));
      }
      // Leaving: it looks down at what is coming and drops out of view.
      ty += exit * exit * vh * 0.3;
      size *= 1 - exit * 0.35;

      const k = reduced ? 1 : null;
      if (k) {
        S.x.v = tx;
        S.y.v = ty;
        S.size.v = size;
      } else {
        stepSpring(S.x, tx, dt, 40, 0.8);
        stepSpring(S.y, ty, dt, 40, 0.8);
        stepSpring(S.size, size, dt, 40, 0.9);
      }
      const unit = S.size.v / 0.46; // the body is 0.46 units wide

      // Where to look: the cursor, or a slow wander when nobody is around.
      const headX = S.x.v;
      const headY = S.y.v - unit * 0.42;
      const idle = t - pointer.last > 3;
      let lx = px;
      let ly = py;
      if (idle) {
        lx = headX + Math.sin(t * 0.45) * vw * 0.3;
        ly = headY + Math.sin(t * 0.31 + 1) * vh * 0.15;
      }
      if (exit > 0.05) {
        lx = headX;
        ly = headY + vh;
      }
      const dx = lx - headX;
      const dy = ly - headY;
      const yawT = clamp(dx / (vw * 0.45), -1, 1) * 0.75;
      const pitchT = clamp(dy / (vh * 0.5), -1, 1) * 0.45;

      // Closeness makes it happy: eyes squint into smiles, a little hop.
      const dist = Math.hypot(dx, dy);
      const near = !idle && dist < S.size.v * 1.1 ? 1 : 0;
      if (near && t - lastHappy > 2.2 && !reduced) {
        hopT = t;
        lastHappy = t;
      }

      if (reduced) {
        S.yaw.v = yawT;
        S.pitch.v = pitchT;
        S.bodyYaw.v = yawT * 0.3;
        S.happy.v = near;
      } else {
        stepSpring(S.yaw, yawT, dt, 60, 0.55);
        stepSpring(S.pitch, pitchT, dt, 60, 0.55);
        stepSpring(S.bodyYaw, yawT * 0.3, dt, 22, 0.7);
        stepSpring(S.happy, near, dt, 50, 0.6);
        stepSpring(S.eyeX, clamp(dx / vw, -1, 1) * 0.03, dt, 120, 0.7);
        stepSpring(S.eyeY, clamp(-dy / vh, -1, 1) * 0.02, dt, 120, 0.7);
      }

      // Rolling: lean into horizontal speed, the antenna lags behind.
      const vx = (S.x.v - prevX) / Math.max(dt, 1e-3);
      prevX = S.x.v;
      if (!reduced) {
        stepSpring(S.lean, clamp(-vx / 1400, -0.35, 0.35), dt, 30, 0.5);
        stepSpring(S.ant, clamp(-vx / 900, -0.6, 0.6) + S.yaw.vel * -0.04, dt, 45, 0.25);
      }

      // Blink every few seconds, sometimes twice.
      if (!reduced && t > blinkAt) {
        blinkT = t;
        blinkAt = t + 2.4 + Math.random() * 2.8 + (Math.random() < 0.2 ? -2.2 : 0);
      }
      const bp = (t - blinkT) / 0.16;
      const blink = bp >= 0 && bp <= 1 ? Math.sin(bp * Math.PI) : 0;

      // ── Pose ────────────────────────────────────────────────────────
      const breath = reduced ? 0 : Math.sin(t * 2.1);
      const hp = clamp01((t - hopT) / 0.55);
      const hop = hp < 1 ? Math.sin(hp * Math.PI) * 0.16 : 0;

      R.root.position.set(S.x.v, -S.y.v, 0);
      R.root.scale.setScalar(unit);
      R.pose.rotation.set(0.22 + S.lean.v * 0.2, -0.45 + S.bodyYaw.v, S.lean.v);
      R.body.position.y = hop + breath * 0.008;
      R.body.scale.set(1 + breath * 0.01, 1 - breath * 0.012, 1);
      R.head.rotation.set(S.pitch.v * 0.7 + exit * 0.5, S.yaw.v - S.bodyYaw.v, -S.yaw.v * 0.12);
      R.eyes.position.x = S.eyeX.v;
      R.eyes.position.y = 0.08 + S.eyeY.v + S.happy.v * 0.01;
      const lid = Math.max(0.08, 1 - blink * 0.92 - S.happy.v * 0.55);
      R.eyeL.scale.y = lid;
      R.eyeR.scale.y = lid;
      R.antenna.rotation.z = S.ant.v + (reduced ? 0 : Math.sin(t * 3.1) * 0.05);
      R.arms.forEach((arm, i) => {
        const wave = S.happy.v * Math.sin(t * 9 + i * Math.PI) * 0.25;
        arm.rotation.x = (reduced ? 0 : Math.sin(t * 2.1 + i) * 0.06) + S.lean.v * 0.6;
        arm.rotation.z = (i === 0 ? 1 : -1) * (S.happy.v * 0.5 + wave);
      });
      R.shadow.scale.set(0.95 - hop * 1.2, 0.22 - hop * 0.3, 1);
      R.shadow.position.y = -0.34 - hop;
      canvas.style.opacity = String(1 - exit);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    };

    const play = () => {
      if (running || document.hidden) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // Only run while the hero or the approach section is on screen.
    const visible = new Set();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      if (visible.size) play();
      else pause();
    });
    io.observe(slotEl);
    if (approach) io.observe(approach);

    const onVisibility = () => (document.hidden ? pause() : visible.size && play());
    document.addEventListener("visibilitychange", onVisibility);
    canvas.dataset.ready = "true";

    return () => {
      pause();
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
      track.geometries.forEach((g) => g.dispose());
      track.materials.forEach((m) => m.dispose());
      track.textures.forEach((tx) => tx.dispose());
      renderer.dispose();
    };
  }, [contained]);

  return (
    <div ref={slot} className={styles.heroAgentSlot} aria-hidden="true">
      <canvas ref={canvasRef} className={contained ? styles.heroAgentContained : styles.heroAgentCanvas} />
    </div>
  );
}
