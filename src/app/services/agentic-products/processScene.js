import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { buildRobot, makeSpring, stepSpring } from "./HeroAgent";

/* The 3D half of ProcessAgent. Framework-free: the component imports it on the
   client, so the step list itself stays in the server HTML.
   Returns a cleanup function. */

const STEP_SECONDS = 3.4;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const clamp01 = (v) => clamp(v, 0, 1);
const backOut = (t) => {
  const x = clamp01(t);
  return 1 + 2.70158 * Math.pow(x - 1, 3) + 1.70158 * Math.pow(x - 1, 2);
};
/* Falls from `h` and lands with one small bounce. */
const dropFrom = (t, h) => {
  const x = clamp01(t);
  if (x < 0.72) return h * (1 - Math.pow(x / 0.72, 2));
  return Math.sin(((x - 0.72) / 0.28) * Math.PI) * h * 0.07;
};

export function createProcessScene({ wrapEl, canvas, items, activeRef, hoverRef, setActive, stepCount }) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const track = { textures: [], materials: [], geometries: [] };
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch {
      return () => {};
    }
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(0, 1, 0, -1, -2000, 2000);

    const R = buildRobot(track);
    const baby = buildRobot(track);
    scene.add(R.root, baby.root);

    const flat = (color) => {
      const m = new THREE.MeshBasicMaterial({ color });
      track.materials.push(m);
      return m;
    };
    const geo = (g) => {
      track.geometries.push(g);
      return g;
    };
    // The tag it sticks on the task (units are robot units).
    const tag = new THREE.Group();
    tag.add(new THREE.Mesh(geo(new RoundedBoxGeometry(0.3, 0.15, 0.04, 2, 0.02)), flat(0xccff00)));
    const hole = new THREE.Mesh(geo(new THREE.CircleGeometry(0.022, 16)), flat(0x040507));
    hole.position.set(-0.1, 0, 0.03);
    const ink = new THREE.Mesh(geo(new THREE.PlaneGeometry(0.15, 0.025)), flat(0x040507));
    ink.position.set(0.035, 0, 0.03);
    tag.add(hole, ink);
    scene.add(tag);
    // The tape it measures with: a bar that grows from its hand, with ticks.
    const tape = new THREE.Group();
    const barGeo = geo(new THREE.PlaneGeometry(1, 0.035).translate(0.5, 0, 0));
    const bar = new THREE.Mesh(barGeo, flat(0x040507));
    tape.add(bar);
    const ticks = Array.from({ length: 9 }, () => {
      const tick = new THREE.Mesh(geo(new THREE.PlaneGeometry(0.012, 0.085)), flat(0x040507));
      tape.add(tick);
      return tick;
    });
    const tip = new THREE.Mesh(geo(new THREE.SphereGeometry(0.04, 16, 12)), flat(0x00f0ff));
    tape.add(tip);
    scene.add(tape);

    let w = 1;
    let h = 1;
    const resize = () => {
      const r = wrapEl.getBoundingClientRect();
      w = Math.max(1, r.width);
      h = Math.max(1, r.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.setSize(w, h, false);
      camera.left = 0;
      camera.right = w;
      camera.top = 0;
      camera.bottom = -h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrapEl);

    const pointer = { x: 0, y: 0, last: -10 };
    const onMove = (e) => {
      const r = wrapEl.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.last = performance.now() / 1000;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const S = {
      x: makeSpring(60),
      y: makeSpring(100),
      yaw: makeSpring(),
      pitch: makeSpring(),
      lean: makeSpring(),
      ant: makeSpring(),
    };
    let current = -1;
    let since = 0;
    let tourAt = 0;
    let hopFrom = { x: 60, y: 100 };
    let babyHome = null;
    let started = false;

    const feetOf = (i, unit) => {
      const wr = wrapEl.getBoundingClientRect();
      const li = items.current[i]?.getBoundingClientRect();
      if (!li) return { x: 60, y: 100 };
      return { x: li.left - wr.left + li.width * 0.34, y: li.top - wr.top - 0.33 * unit };
    };

    let raf = 0;
    let running = false;
    let last = performance.now();

    const frame = (now) => {
      if (!running) return;
      const t = now / 1000;
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;

      const body = clamp(w * 0.055, 50, 82); // body width in px
      const unit = body / 0.46;

      // Which step: the hovered one, otherwise an unhurried tour.
      let want = hoverRef.current;
      if (want === null || want === undefined) {
        want = activeRef.current;
        if (!reduced && t > tourAt) want = (activeRef.current + 1) % stepCount;
      }
      if (reduced && hoverRef.current === null) want = stepCount - 1;
      if (!started) {
        want = reduced ? stepCount - 1 : 0;
      }
      if (want !== current) {
        hopFrom = started ? { x: S.x.v, y: S.y.v } : feetOf(want, unit);
        current = want;
        activeRef.current = want;
        setActive(want);
        since = t;
        tourAt = t + STEP_SECONDS;
        if (!started) {
          S.x.v = hopFrom.x;
          S.y.v = hopFrom.y;
          started = true;
        }
      }
      if (hoverRef.current !== null) tourAt = t + STEP_SECONDS;

      const age = reduced ? 10 : t - since;
      const goal = feetOf(current, unit);

      // Travel: spring along the path plus a hop arc.
      const hop = clamp01(age / 0.75);
      if (reduced) {
        S.x.v = goal.x;
        S.y.v = goal.y;
      } else {
        stepSpring(S.x, goal.x, dt, 60, 0.85);
        stepSpring(S.y, goal.y, dt, 60, 0.85);
      }
      const far = Math.min(1, Math.hypot(goal.x - hopFrom.x, goal.y - hopFrom.y) / 200);
      const arc = reduced ? 0 : Math.sin(hop * Math.PI) * 60 * far;
      const act = clamp01((age - 0.55) / 1.4); // the gesture, after landing

      // Gesture props.
      const handX = S.x.v + 0.34 * unit;
      tag.visible = current === 0 && age > 0.55;
      if (tag.visible) {
        const fall = dropFrom((age - 0.55) / 0.7, 0.9 * unit);
        tag.position.set(handX + 0.2 * unit, -(S.y.v + 0.22 * unit - fall), 60);
        tag.scale.setScalar(unit * backOut((age - 0.55) / 0.35));
        tag.rotation.z = -0.16 + Math.sin(age * 5) * 0.05 * Math.max(0, 1 - age / 3);
      }
      tape.visible = current === 1 && age > 0.55;
      let tapeTip = handX;
      if (tape.visible) {
        const li = items.current[1]?.getBoundingClientRect();
        const room = li ? li.width * 0.52 : 140;
        const len = Math.max(1, room * backOut(act));
        tape.position.set(handX, -(S.y.v + 0.02 * unit), 60);
        bar.scale.set(len, unit, 1);
        ticks.forEach((tick, i) => {
          const p = (i + 1) / (ticks.length + 1);
          tick.position.set(len * p, 0, 0);
          tick.scale.set(unit, unit * (i % 3 === 2 ? 1.4 : 1), 1);
        });
        tip.position.set(len, 0, 0);
        tip.scale.setScalar(unit);
        tapeTip = handX + len;
      }

      // The baby agent: assembled at step 2, awake at step 3.
      const showBaby = current >= 2;
      baby.root.visible = showBaby;
      if (showBaby) {
        const bu = unit * 0.48;
        const li = items.current[current]?.getBoundingClientRect();
        const wr = wrapEl.getBoundingClientRect();
        const target = {
          x: Math.min(S.x.v + 0.78 * unit, li ? li.right - wr.left - body * 0.4 : w),
          y: goal.y + 0.33 * unit - 0.33 * bu,
        };
        if (!babyHome) babyHome = { ...target };
        babyHome.x += (target.x - babyHome.x) * Math.min(1, dt * 6);
        babyHome.y += (target.y - babyHome.y) * Math.min(1, dt * 6);
        const building = current === 2;
        const a = building ? age - 0.55 : 10;
        const awake = current === 3 && age > 0.8;
        const jump = awake && !reduced ? Math.abs(Math.sin(t * 5.5)) * 0.16 * bu : 0;
        baby.root.position.set(babyHome.x, -(babyHome.y - jump), 0);
        baby.root.scale.setScalar(bu);
        baby.pose.rotation.set(0.22, -0.55, 0);
        // piece by piece: treads, body, head
        baby.treads.forEach((tr) => {
          tr.position.y = -0.26 + dropFrom(a / 0.45, 1.1);
          tr.visible = a > 0;
        });
        baby.body.position.y = dropFrom((a - 0.4) / 0.5, 1.3);
        baby.body.visible = a > 0.4;
        baby.head.position.y = 0.3 + dropFrom((a - 0.85) / 0.55, 1.3);
        baby.head.visible = a > 0.85;
        baby.head.rotation.set(0, awake ? -0.35 + Math.sin(t * 2.4) * 0.15 : 0, awake ? 0 : 0.2);
        const lid = awake || reduced ? 1 : 0.1;
        baby.eyeL.scale.y = lid;
        baby.eyeR.scale.y = lid;
        baby.arms.forEach((arm, i) => {
          arm.rotation.z = awake && i === 0 ? 1.9 + Math.sin(t * 10) * 0.4 : 0;
        });
        baby.shadow.visible = a > 0.3;
      } else {
        babyHome = null;
      }

      // Where to look: the cursor if it is here, else at what it is doing.
      const headY = S.y.v - 0.42 * unit;
      const watching = t - pointer.last < 2 && pointer.y > -120 && pointer.y < h + 80;
      let lx = watching ? pointer.x : S.x.v + unit * 0.9;
      let ly = watching ? pointer.y : S.y.v;
      if (!watching && current === 1) lx = tapeTip;
      if (!watching && current === 3) {
        lx = babyHome ? babyHome.x : lx;
        ly = babyHome ? babyHome.y - unit * 0.15 : ly;
      }
      const yawT = clamp((lx - S.x.v) / 260, -1, 1) * 0.75;
      const pitchT = clamp((ly - headY) / 220, -1, 1) * 0.42;
      const vx = (goal.x - S.x.v) * 0.004;
      if (reduced) {
        S.yaw.v = yawT;
        S.pitch.v = pitchT;
      } else {
        stepSpring(S.yaw, yawT, dt, 60, 0.55);
        stepSpring(S.pitch, pitchT, dt, 60, 0.55);
        stepSpring(S.lean, clamp(-vx, -0.3, 0.3), dt, 40, 0.5);
        stepSpring(S.ant, clamp(-vx * 2, -0.6, 0.6), dt, 45, 0.25);
      }

      const breath = reduced ? 0 : Math.sin(t * 2.1);
      const cheer = current === 3 && age > 0.8 && !reduced;
      const blink = reduced ? 0 : Math.max(0, 1 - Math.abs((t % 3.7) - 3.55) / 0.09);
      R.root.position.set(S.x.v, -(S.y.v - arc), 0);
      R.root.scale.setScalar(unit);
      R.pose.rotation.set(0.22, -0.4 + S.yaw.v * 0.25, S.lean.v);
      R.body.position.y = breath * 0.008;
      R.body.scale.set(1 + breath * 0.01, 1 - breath * 0.012, 1);
      R.head.rotation.set(S.pitch.v * 0.7, S.yaw.v * 0.75, -S.yaw.v * 0.12);
      const lid = Math.max(0.08, 1 - blink * 0.92 - (cheer ? 0.55 : 0));
      R.eyeL.scale.y = lid;
      R.eyeR.scale.y = lid;
      R.antenna.rotation.z = S.ant.v + (reduced ? 0 : Math.sin(t * 3.1) * 0.05);
      // right arm reaches while it works, both wave at the end
      const reach = current < 3 ? Math.sin(clamp01(act * 1.4) * Math.PI * 0.5) : 0;
      R.arms[0].rotation.set(0, 0, cheer ? -(1.7 + Math.sin(t * 9) * 0.35) : 0);
      R.arms[1].rotation.set(0, 0, cheer ? 1.7 + Math.sin(t * 9 + 1.6) * 0.35 : reach * (current === 2 ? 1.1 + Math.sin(t * 8) * 0.3 : 1.2));
      R.shadow.visible = arc < 6;

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
    let onScreen = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) {
          tourAt = performance.now() / 1000 + STEP_SECONDS;
          play();
        } else pause();
      },
      { threshold: 0.25 }
    );
    io.observe(wrapEl);
    const onVisibility = () => (document.hidden ? pause() : onScreen && play());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      pause();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
      track.geometries.forEach((g) => g.dispose());
      track.materials.forEach((m) => m.dispose());
      track.textures.forEach((tx) => tx.dispose());
      renderer.dispose();
    };
}
