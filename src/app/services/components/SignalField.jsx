"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { buildJourneyBuffers } from "./particleShapes";
import { PARTICLE_VERTEX, PARTICLE_FRAGMENT } from "./particleShaders";
import SolomonicCircuit from "@/components/SolomonicCircuit";

// Adapted from LI4UID's DaoismCanvas: deterministic morph buffers + pointer field.
export default function SignalField({ phase = 0, className }) {
  const host = useRef(null);
  const controls = useRef(null);
  const latestPhase = useRef(phase);
  latestPhase.current = phase;

  useEffect(() => {
    let disposed = false;
    let release = () => {};
    const element = host.current;
    import("three").then((THREE) => {
      if (disposed) return;
      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "low-power" });
      } catch { return; }
      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100);
      camera.position.z = 17;
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.setAttribute("aria-hidden", "true");
      const buffers = buildJourneyBuffers(window.innerWidth < 800 ? 4000 : 9000);
      const geometry = new THREE.BufferGeometry();
      [["position", "cube"], ["aTotem", "totem"], ["aCards", "cards"], ["aOrb", "orb"]].forEach(([name, key]) => {
        geometry.setAttribute(name, new THREE.BufferAttribute(buffers[key], 3));
      });
      geometry.setAttribute("aSeed", new THREE.BufferAttribute(buffers.seed, 1));
      geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 14);
      const uniforms = {
        uTime: { value: 0 }, uMorph: { value: latestPhase.current },
        uPixelRatio: { value: renderer.getPixelRatio() }, uSize: { value: 2.8 },
        uPointer: { value: new THREE.Vector3() }, uPointerStrength: { value: 0 },
        uTurbulence: { value: media.matches ? 0 : 0.5 },
        uColorA: { value: new THREE.Color("#040507") }, uColorB: { value: new THREE.Color("#64748b") },
        uOpacity: { value: 1 },
      };
      const material = new THREE.ShaderMaterial({ uniforms, vertexShader: PARTICLE_VERTEX, fragmentShader: PARTICLE_FRAGMENT, transparent: true, depthWrite: false });
      const cloud = new THREE.Points(geometry, material);
      scene.add(cloud);
      element.appendChild(renderer.domElement);
      element.dataset.ready = "true";
      let visible = true;
      let tween;
      const render = (time = 0) => {
        if (!media.matches) {
          uniforms.uTime.value = time * 0.001;
          cloud.rotation.y = Math.sin(time * 0.00012) * 0.28;
          cloud.rotation.x = Math.sin(time * 0.00009) * 0.09;
        }
        renderer.render(scene, camera);
      };
      const sync = () => {
        uniforms.uTurbulence.value = media.matches ? 0 : 0.5;
        renderer.setAnimationLoop(visible && !document.hidden && !media.matches ? render : null);
        if (media.matches) { tween?.kill(); uniforms.uMorph.value = latestPhase.current; render(); }
      };
      controls.current = (next) => {
        tween?.kill();
        tween = gsap.to(uniforms.uMorph, { value: next, duration: media.matches ? 0 : 2.4, ease: "power2.inOut", onUpdate: media.matches ? render : undefined });
      };
      const resize = () => {
        const { width, height } = element.getBoundingClientRect();
        renderer.setSize(Math.max(1, width), Math.max(1, height), false);
        camera.aspect = width / Math.max(1, height);
        camera.position.z = camera.aspect < 0.8 ? 21 : 17;
        camera.updateProjectionMatrix(); render();
      };
      const pointer = (event) => {
        if (media.matches) return;
        const rect = element.getBoundingClientRect();
        uniforms.uPointer.value.set((event.clientX - rect.left - rect.width / 2) / rect.width * 12, -(event.clientY - rect.top - rect.height / 2) / rect.height * 12, 0);
        uniforms.uPointerStrength.value = 0.35;
      };
      const leave = () => { uniforms.uPointerStrength.value = 0; };
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(element);
      const visibilityObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
      visibilityObserver.observe(element);
      element.addEventListener("pointermove", pointer);
      element.addEventListener("pointerleave", leave);
      document.addEventListener("visibilitychange", sync);
      media.addEventListener("change", sync);
      resize(); sync();
      release = () => {
        controls.current = null; tween?.kill(); renderer.setAnimationLoop(null);
        resizeObserver.disconnect(); visibilityObserver.disconnect();
        element.removeEventListener("pointermove", pointer); element.removeEventListener("pointerleave", leave);
        document.removeEventListener("visibilitychange", sync); media.removeEventListener("change", sync);
        geometry.dispose(); material.dispose(); renderer.dispose(); renderer.domElement.remove();
        delete element.dataset.ready;
      };
    }).catch(() => {});
    return () => { disposed = true; release(); };
  }, []);

  useEffect(() => { controls.current?.(phase); }, [phase]);
  return <div ref={host} className={className} aria-hidden="true"><div data-field-fallback><SolomonicCircuit size={300} /></div></div>;
}
