"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

/* ────────────────────────────────────────────────────────────────────────────
   Scroll companion — a node lattice that travels with the reader.

   The page argues one idea at a time, so the artifact does too: it is not a
   decoration that loops in the background, it *reconfigures* into the shape of
   whatever chapter you are reading. Four clusters for the four places, three
   columns for the three ways, a scanning grid for the audit, a directed chain
   for the work an agent takes over.

   Rendering notes: one Points object for the nodes, one LineSegments for the
   edges, one Points for the travelling pulses. Positions are lerped on the CPU
   every frame from a single buffer, so the whole thing is three draw calls.
   ──────────────────────────────────────────────────────────────────────────── */

const NODES = 36;

/* Deterministic noise: the same lattice on every reload, so nothing pops
   between server and client and screenshots stay comparable. */
function rand(i, salt) {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const EDGES = [];
for (let i = 0; i < NODES; i++) {
  const links = 2 + Math.floor(rand(i, 3) * 2);
  for (let k = 0; k < links; k++) {
    const j = (i + 1 + Math.floor(rand(i * 7 + k, 11) * (NODES - 1))) % NODES;
    if (j !== i) EDGES.push([i, j]);
  }
}

/* Five formations, one per chapter. Values are three.js world units. */
function formation(chapter) {
  const p = [];
  for (let i = 0; i < NODES; i++) {
    if (chapter === 0) {
      // Scattered cloud: the system before it is described.
      p.push([
        (rand(i, 1) - 0.5) * 6.4,
        (rand(i, 2) - 0.5) * 5.2,
        (rand(i, 4) - 0.5) * 3.6,
      ]);
    } else if (chapter === 1) {
      // Four clusters: the four places to start.
      const c = i % 4;
      const cx = [-2.5, 2.5, -2.5, 2.5][c];
      const cy = [1.5, 1.5, -1.6, -1.6][c];
      const r = 0.9;
      const a = (i / 9) * Math.PI * 2;
      p.push([
        cx + Math.cos(a) * r * (0.5 + rand(i, 5)),
        cy + Math.sin(a) * r * (0.5 + rand(i, 6)),
        (rand(i, 7) - 0.5) * 1.4,
      ]);
    } else if (chapter === 2) {
      // Three columns: Build / Enable / Audit.
      const col = i % 3;
      const row = Math.floor(i / 3);
      p.push([
        (col - 1) * 2.6,
        2.4 - row * 0.52,
        (rand(i, 8) - 0.5) * 0.9,
      ]);
    } else if (chapter === 3) {
      // Scanning grid: the audit reads the whole surface.
      const gx = i % 6;
      const gy = Math.floor(i / 6);
      p.push([(gx - 2.5) * 1.15, (gy - 2.5) * 1.15, (rand(i, 9) - 0.5) * 0.35]);
    } else {
      // Directed chain: a task becoming an agent, start to end.
      const t = i / (NODES - 1);
      p.push([
        (t - 0.5) * 6.6,
        Math.sin(t * Math.PI * 2.2) * 0.85,
        Math.cos(t * Math.PI * 1.4) * 0.7,
      ]);
    }
  }
  return p;
}

const FORMATIONS = [0, 1, 2, 3, 4].map(formation);

export default function ScrollCompanion({ className = "" }) {
  const host = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const host_ = host.current;
    const canvas = canvasRef.current;
    if (!host_ || !canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = window.matchMedia("(min-width: 1001px)");

    /* The artifact is a wide-screen passenger. On a phone it would fight the
       copy for space, so it simply does not mount there. */
    let cleanupScene = () => {};
    let observer;

    const boot = () => {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 60);
      camera.position.set(0, 0, 9.6);

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
      renderer.setClearAlpha(0);

      const size = () => {
        const rect = host_.getBoundingClientRect();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
        renderer.setSize(rect.width, rect.height, false);
        camera.aspect = rect.width / Math.max(rect.height, 1);
        camera.updateProjectionMatrix();
      };
      size();

      // ── nodes ────────────────────────────────────────────────────────────
      const nodeGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(NODES * 3);
      const targets = new Float32Array(NODES * 3);
      FORMATIONS[0].forEach((p, i) => {
        positions.set(p, i * 3);
        targets.set(p, i * 3);
      });
      nodeGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      // A soft round sprite drawn at runtime: no external asset, no CORS.
      const sprite = (() => {
        const c = document.createElement("canvas");
        c.width = c.height = 64;
        const g = c.getContext("2d");
        const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, "rgba(4,5,7,1)");
        grad.addColorStop(0.45, "rgba(4,5,7,0.85)");
        grad.addColorStop(1, "rgba(4,5,7,0)");
        g.fillStyle = grad;
        g.fillRect(0, 0, 64, 64);
        const tex = new THREE.CanvasTexture(c);
        tex.needsUpdate = true;
        return tex;
      })();

      const nodeMat = new THREE.PointsMaterial({
        size: 0.2,
        map: sprite,
        transparent: true,
        depthWrite: false,
        opacity: 0.9,
        sizeAttenuation: true,
      });
      const nodePoints = new THREE.Points(nodeGeo, nodeMat);
      scene.add(nodePoints);

      // ── edges ────────────────────────────────────────────────────────────
      const edgeGeo = new THREE.BufferGeometry();
      const edgePos = new Float32Array(EDGES.length * 6);
      edgeGeo.setAttribute("position", new THREE.BufferAttribute(edgePos, 3));
      const edgeMat = new THREE.LineBasicMaterial({
        color: 0x040507,
        transparent: true,
        opacity: 0.16,
      });
      const edgeLines = new THREE.LineSegments(edgeGeo, edgeMat);
      scene.add(edgeLines);

      // ── pulses ───────────────────────────────────────────────────────────
      const PULSES = 12;
      const pulseGeo = new THREE.BufferGeometry();
      const pulsePos = new Float32Array(PULSES * 3);
      pulseGeo.setAttribute("position", new THREE.BufferAttribute(pulsePos, 3));
      const pulseMat = new THREE.PointsMaterial({
        size: 0.34,
        color: 0x00f0ff,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        sizeAttenuation: true,
      });
      const pulsePoints = new THREE.Points(pulseGeo, pulseMat);
      scene.add(pulsePoints);

      const pulseState = Array.from({ length: PULSES }, (_, i) => ({
        edge: EDGES[(rand(i, 21) * EDGES.length) | 0],
        t: rand(i, 22),
        speed: 0.16 + rand(i, 23) * 0.3,
      }));

      // ── scroll → chapter ─────────────────────────────────────────────────
      let chapter = 0;
      let blend = 0; // 0..1 between chapter and chapter+1
      let rotY = 0;
      let rotX = 0;
      let visible = 0;
      let visibleTarget = 0;

      const applyFormation = (index) => {
        const next = FORMATIONS[Math.min(index, FORMATIONS.length - 1)];
        next.forEach((p, i) => targets.set(p, i * 3));
      };

      const start = document.querySelector("[data-companion-start]");
      const end = document.querySelector("[data-companion-end]");

      const trigger = start && end
        ? ScrollTrigger.create({
            trigger: start,
            endTrigger: end,
            start: "top 80%",
            end: "bottom 20%",
            scrub: true,
            onUpdate: (self) => {
              const p = self.progress;
              // Five chapters across the journey; the last one holds.
              const raw = p * (FORMATIONS.length - 1);
              const idx = Math.min(Math.floor(raw), FORMATIONS.length - 2);
              blend = raw - idx;
              if (idx !== chapter) {
                chapter = idx;
                applyFormation(idx);
              }
              // Anticipate the next shape as the chapter closes.
              visibleTarget = 1;
              rotY = -0.9 + p * 2.1;
              rotX = -0.18 + Math.sin(p * Math.PI) * 0.22;
            },
            onLeave: () => { visibleTarget = 0; },
            onLeaveBack: () => { visibleTarget = 0; },
            onEnter: () => { visibleTarget = 1; },
            onEnterBack: () => { visibleTarget = 1; },
          })
        : null;

      // Pre-roll the second formation so the lattice is already assembling.
      applyFormation(0);

      // ── frame loop ───────────────────────────────────────────────────────
      let raf = 0;
      let alive = true;
      let last = performance.now();

      const frame = (now) => {
        if (!alive) return;
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;

        visible += (visibleTarget - visible) * Math.min(dt * 4, 1);

        const pos = nodeGeo.attributes.position.array;
        // Move toward the target formation, plus a slow drift so the lattice
        // never looks frozen when the reader stops scrolling.
        for (let i = 0; i < NODES; i++) {
          const i3 = i * 3;
          const drift = reduced ? 0 : Math.sin(now * 0.0004 + i * 1.7) * 0.035;
          const ease = reduced ? 1 : Math.min(dt * 3.4, 1);
          pos[i3] += (targets[i3] - pos[i3]) * ease;
          pos[i3 + 1] += (targets[i3 + 1] - pos[i3 + 1]) * ease + drift * 0.4;
          pos[i3 + 2] += (targets[i3 + 2] - pos[i3 + 2]) * ease;
        }
        nodeGeo.attributes.position.needsUpdate = true;

        // Edges follow the nodes verbatim.
        const ep = edgeGeo.attributes.position.array;
        for (let e = 0; e < EDGES.length; e++) {
          const [a, b] = EDGES[e];
          ep[e * 6] = pos[a * 3];
          ep[e * 6 + 1] = pos[a * 3 + 1];
          ep[e * 6 + 2] = pos[a * 3 + 2];
          ep[e * 6 + 3] = pos[b * 3];
          ep[e * 6 + 4] = pos[b * 3 + 1];
          ep[e * 6 + 5] = pos[b * 3 + 2];
        }
        edgeGeo.attributes.position.needsUpdate = true;

        // Pulses ride their edge and restart when they arrive.
        const pp = pulseGeo.attributes.position.array;
        for (let i = 0; i < PULSES; i++) {
          const s = pulseState[i];
          s.t += dt * s.speed;
          if (s.t > 1) {
            s.t = 0;
            s.edge = EDGES[(rand(i + now * 0.001, 31) * EDGES.length) | 0];
          }
          const [a, b] = s.edge;
          const t = s.t;
          pp[i * 3] = pos[a * 3] + (pos[b * 3] - pos[a * 3]) * t;
          pp[i * 3 + 1] = pos[a * 3 + 1] + (pos[b * 3 + 1] - pos[a * 3 + 1]) * t;
          pp[i * 3 + 2] = pos[a * 3 + 2] + (pos[b * 3 + 2] - pos[a * 3 + 2]) * t;
        }
        pulseGeo.attributes.position.needsUpdate = true;
        pulseMat.opacity = visible * 0.95;

        // Whole-lattice presentation.
        const scale = 0.86 + blend * 0.06;
        scene.rotation.y += (rotY - scene.rotation.y) * Math.min(dt * 2.2, 1);
        scene.rotation.x += (rotX - scene.rotation.x) * Math.min(dt * 2.2, 1);
        scene.scale.setScalar(scale);
        nodeMat.opacity = visible * 0.9;
        edgeMat.opacity = visible * 0.16;
        host_.style.opacity = String(visible);

        renderer.render(scene, camera);
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);

      const onResize = () => size();
      window.addEventListener("resize", onResize);

      // Stop burning frames when the tab is hidden.
      const onVisibility = () => {
        if (document.hidden) {
          cancelAnimationFrame(raf);
        } else {
          last = performance.now();
          raf = requestAnimationFrame(frame);
        }
      };
      document.addEventListener("visibilitychange", onVisibility);

      cleanupScene = () => {
        alive = false;
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", onResize);
        document.removeEventListener("visibilitychange", onVisibility);
        trigger?.kill();
        observer?.disconnect();
        nodeGeo.dispose();
        edgeGeo.dispose();
        pulseGeo.dispose();
        nodeMat.dispose();
        edgeMat.dispose();
        pulseMat.dispose();
        sprite.dispose();
        renderer.dispose();
      };

      observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) visibleTarget = 0;
      }, { threshold: 0 });
      observer.observe(host_);
    };

    /* WebGL may be unavailable; the page must still read perfectly. */
    let supports = false;
    try {
      const probe = document.createElement("canvas");
      supports = !!(probe.getContext("webgl2") || probe.getContext("webgl"));
    } catch {
      supports = false;
    }

    if (supports && wide.matches) {
      boot();
    }

    const onBreakpoint = (e) => {
      if (!e.matches) {
        cleanupScene();
        cleanupScene = () => {};
      } else if (!supports) {
        return;
      } else if (!host_.firstElementChild) {
        boot();
      }
    };
    wide.addEventListener("change", onBreakpoint);

    return () => {
      wide.removeEventListener("change", onBreakpoint);
      cleanupScene();
    };
  }, []);

  return (
    <div ref={host} className={className} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
