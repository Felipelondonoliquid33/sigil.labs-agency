import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { paintMatcap, paintShadow } from "../services/agentic-products/diorama";
import { buildRobot } from "../services/agentic-products/HeroAgent";

/* ────────────────────────────────────────────────────────────────────────────
   Shared engine for the case stories. Every story has one protagonist made of
   many small pieces (a single InstancedMesh) that reorganise per chapter, a few
   props that appear in the chapters that need them, and the SIGIL agent.

   A scene provides:
     count        number of pieces
     piece        [w, h, d, radius]
     formation(chapter, i, t) → { p:[x,y,z], r:[x,y,z], s, color, h? }  (pure)
     spots        { chapter: [x,y,z] }     where the agent stands
     views        { chapter: { y, zoom } } how the camera frames it
     setup(kit)   builds props; may return update(chapter, t, age, dt)
     pose(chapter, t) → { yaw, pitch, cheer }
   ──────────────────────────────────────────────────────────────────────────── */

export const C = {
  porcelain: 0xf5f7f9,
  paper: 0xdde2e8,
  steel: 0xa9b4c2,
  ink: 0x15181d,
  volt: 0xccff00,
  cyan: 0x00f0ff,
};

export function rand(i, salt) {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}
export const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const FLAT = [-Math.PI / 2, 0, 0];
const SQ = Math.SQRT1_2;
/* Screen-horizontal r and screen-depth d (toward the viewer) → world point. */
export const iso = (r, y = 0, d = 0) => [(r + d) * SQ, y, (-r + d) * SQ];

export function createStoryScene(canvas, { reduced = false } = {}, spec) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
  const camDir = new THREE.Vector3(1, 0.82, 1).normalize();
  const VIEW_H = 8.6;

  const track = { textures: [], materials: [], geometries: [] };
  const neutral = paintMatcap(
    [[0, "#ffffff"], [0.28, "#f2f4f7"], [0.62, "#cdd3db"], [1, "#8b95a2"]],
    "rgba(255,255,255,0.4)"
  );
  const shadowTex = paintShadow();
  track.textures.push(neutral, shadowTex);

  const keep = (m) => {
    track.materials.push(m);
    return m;
  };
  const geo = (g) => {
    track.geometries.push(g);
    return g;
  };
  const shadowMat = keep(new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }));
  const props = [];

  const kit = {
    THREE,
    scene,
    reduced,
    geo,
    keep,
    mat: (color) => keep(new THREE.MeshMatcapMaterial({ matcap: neutral, color })),
    glow: (color, opacity = 1) =>
      keep(new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity, depthWrite: opacity === 1 })),
    mesh: (g, m, x = 0, y = 0, z = 0) => {
      const o = new THREE.Mesh(g, m);
      o.position.set(x, y, z);
      return o;
    },
    box: (w, h, d, r, m, x = 0, y = 0, z = 0) =>
      kit.mesh(geo(new RoundedBoxGeometry(w, h, d, 2, Math.min(r, w / 2, h / 2, d / 2))), m, x, y, z),
    cyl: (r, h, m, x = 0, y = 0, z = 0, seg = 28) => kit.mesh(geo(new THREE.CylinderGeometry(r, r, h, seg)), m, x, y, z),
    sph: (r, m, x = 0, y = 0, z = 0) => kit.mesh(geo(new THREE.SphereGeometry(r, 20, 14)), m, x, y, z),
    ring: (r, tube, m) => {
      const o = kit.mesh(geo(new THREE.TorusGeometry(r, tube, 10, 96)), m);
      o.rotation.x = Math.PI / 2;
      return o;
    },
    /* A group that scales in only during the listed chapters. */
    prop: (chapters, ...children) => {
      const group = new THREE.Group();
      if (children.length) group.add(...children);
      scene.add(group);
      props.push({ group, chapters, v: 0 });
      return group;
    },
  };

  const ground = kit.mesh(geo(new THREE.PlaneGeometry(8.4, 8.4)), shadowMat, 0, -0.04, 0);
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  const [pw, ph, pd, pr] = spec.piece;
  const pieces = new THREE.InstancedMesh(geo(new RoundedBoxGeometry(pw, ph, pd, 2, pr)), kit.mat(0xffffff), spec.count);
  pieces.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  pieces.frustumCulled = false;
  scene.add(pieces);

  const update = spec.setup ? spec.setup(kit) : null;

  const robot = buildRobot(track);
  robot.shadow.visible = false;
  const agent = new THREE.Group();
  agent.add(robot.root);
  scene.add(agent);
  const agentShadow = kit.mesh(geo(new THREE.PlaneGeometry(1.5, 1.5)), shadowMat);
  agentShadow.rotation.x = -Math.PI / 2;
  scene.add(agentShadow);

  const dummy = new THREE.Object3D();
  const goalP = new THREE.Vector3();
  const goalQ = new THREE.Quaternion();
  const euler = new THREE.Euler();
  const goalC = new THREE.Color();
  let state = null;
  const robotPos = new THREE.Vector3();
  const from = new THREE.Vector3();
  let hopAt = -10;
  let chapter = "";
  let changedAt = 0;
  let camY = 1;
  let zoom = 1;
  let width = 1;
  let height = 1;

  const setSize = (w, h) => {
    width = Math.max(1, w);
    height = Math.max(1, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.setSize(width, height, false);
    const a = width / height;
    camera.left = (-VIEW_H * a) / 2;
    camera.right = (VIEW_H * a) / 2;
    camera.top = VIEW_H / 2;
    camera.bottom = -VIEW_H / 2;
    camera.updateProjectionMatrix();
  };

  const damp = (dt, k) => (reduced ? 1 : 1 - Math.exp(-dt * k));

  function frame(dt, t, next) {
    const time = reduced ? 0.4 : t;
    if (!state) {
      state = Array.from({ length: spec.count }, (_, i) => {
        const f = spec.formation(next, i, 0);
        return {
          p: new THREE.Vector3(...f.p),
          q: new THREE.Quaternion().setFromEuler(new THREE.Euler(...f.r)),
          s: f.s,
          h: f.h ?? 1,
          c: new THREE.Color(f.color),
        };
      });
      robotPos.set(...spec.spots[next]);
      camY = spec.views[next].y;
      zoom = spec.views[next].zoom;
    }
    if (next !== chapter) {
      chapter = next;
      changedAt = t;
      from.copy(robotPos);
      hopAt = t;
    }
    const age = reduced ? 10 : t - changedAt;

    for (let i = 0; i < spec.count; i++) {
      const s = state[i];
      const f = spec.formation(chapter, i, time);
      // The wave: piece i leaves a beat after piece i-1.
      if (age > (i / spec.count) * 0.7) {
        const k = damp(dt, f.k ?? 4.2);
        goalP.set(...f.p);
        // A piece that wraps around a path jumps instead of crossing the scene.
        if (f.snap && s.p.distanceTo(goalP) > 2) s.p.copy(goalP);
        s.p.lerp(goalP, k);
        goalQ.setFromEuler(euler.set(...f.r));
        s.q.slerp(goalQ, k);
        s.s += (f.s - s.s) * k;
        s.h += ((f.h ?? 1) - s.h) * k;
        s.c.lerp(goalC.set(f.color), damp(dt, 7));
      }
      dummy.position.copy(s.p);
      dummy.quaternion.copy(s.q);
      dummy.scale.set(s.s, s.s * s.h, s.s);
      dummy.updateMatrix();
      pieces.setMatrixAt(i, dummy.matrix);
      pieces.setColorAt(i, s.c);
    }
    pieces.instanceMatrix.needsUpdate = true;
    if (pieces.instanceColor) pieces.instanceColor.needsUpdate = true;

    props.forEach((p) => {
      p.v += ((p.chapters.includes(chapter) ? 1 : 0) - p.v) * damp(dt, 4.5);
      p.group.visible = p.v > 0.02;
      p.group.scale.setScalar(Math.max(0.001, p.v));
    });
    update?.(chapter, time, age, dt);

    // The agent hops to its spot and does what the chapter asks.
    goalP.set(...spec.spots[chapter]);
    const h = reduced ? 1 : clamp01((t - hopAt) / 1.0);
    robotPos.lerpVectors(from, goalP, h * h * (3 - 2 * h));
    const arc = Math.sin(h * Math.PI) * 1.2;
    const pose = spec.pose ? spec.pose(chapter, time) : {};
    const cheer = pose.cheer && !reduced;
    agent.position.set(robotPos.x, robotPos.y + 0.45 + arc, robotPos.z);
    agent.scale.setScalar(1.25);
    robot.pose.rotation.y = pose.yaw ?? Math.PI / 4;
    robot.head.rotation.set(pose.pitch ?? 0.1, reduced ? 0 : Math.sin(time * 0.9) * 0.4, 0);
    robot.arms[0].rotation.z = cheer ? -(1.7 + Math.sin(time * 9) * 0.35) : 0;
    robot.arms[1].rotation.z = cheer ? 1.7 + Math.sin(time * 9 + 1.6) * 0.35 : pose.reach ?? 0;
    const blink = !reduced && Math.abs((time % 3.7) - 3.55) < 0.07 ? 0.1 : 1;
    robot.eyeL.scale.y = blink;
    robot.eyeR.scale.y = blink;
    agentShadow.position.set(robotPos.x, robotPos.y + 0.01, robotPos.z);
    agentShadow.scale.setScalar(Math.max(0.35, 1 - arc * 0.4));

    const view = spec.views[chapter];
    camY += (view.y - camY) * damp(dt, 2.4);
    zoom += (view.zoom - zoom) * damp(dt, 2.4);
    camera.position.set(0, camY, 0).addScaledVector(camDir, 30);
    camera.lookAt(0, camY, 0);
    camera.zoom = zoom * Math.min(1, (VIEW_H * (width / height)) / 9);
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
  }

  const dispose = (releaseContext = false) => {
    pieces.dispose();
    track.geometries.forEach((g) => g.dispose());
    track.materials.forEach((m) => m.dispose());
    track.textures.forEach((x) => x.dispose());
    renderer.dispose();
    if (releaseContext) renderer.forceContextLoss();
  };

  return { setSize, frame, dispose };
}
