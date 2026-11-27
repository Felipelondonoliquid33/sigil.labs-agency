"use client";
import "./Preloader.css";
import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";

gsap.registerPlugin(useGSAP, CustomEase);
CustomEase.create("hop", "0.9, 0, 0.1, 1");

export let isInitialLoad = true;

const STROKE_IDS = [
  "#outer-ring",
  "#central-spine",
  "#antenna-loops",
  "#bus-lead-left",
  "#bus-lead-right",
  "#binding-wings",
  "#eye-outer-ring",
];

const NODE_IDS = [
  "#top-cap",
  "#bottom-cap",
  "#antenna-node-left",
  "#antenna-node-right",
  "#bus-node-left",
  "#bus-node-right",
  "#wing-node-left",
  "#wing-node-right",
  "#eye-pupil",
];

const Preloader = () => {
  const preloaderRef = useRef(null);
  const [showPreloader, setShowPreloader] = useState(isInitialLoad);
  const [loaderAnimating, setLoaderAnimating] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    return () => {
      isInitialLoad = false;
    };
  }, []);

  useEffect(() => {
    if (lenis) {
      if (loaderAnimating) {
        lenis.stop();
      } else {
        lenis.start();
      }
    }
  }, [lenis, loaderAnimating]);

  useGSAP(
    () => {
      if (!showPreloader) return;

      const root = preloaderRef.current;
      if (!root) return;

      setLoaderAnimating(true);

      const q = (sel) => root.querySelector(sel);
      const el = (sel) => {
        const node = root.querySelector(sel);
        return node || undefined;
      };

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const strokeEls = STROKE_IDS.map(q).filter(Boolean);
      const nodeEls = NODE_IDS.map(q).filter(Boolean);
      const wordmark = q(".preloader-wordmark");
      const tagline = q(".preloader-tagline");
      const progress = q(".preloader-progress");
      const shockwave = q(".preloader-shockwave");

      // Prime the SVG for the stroke-draw ("laser") reveal.
      strokeEls.forEach((node) => {
        const len = node.getTotalLength ? node.getTotalLength() : 800;
        node.style.strokeDasharray = len;
        node.style.strokeDashoffset = len;
      });
      gsap.set(nodeEls, { scale: 0, transformOrigin: "center" });
      gsap.set([wordmark, tagline], { opacity: 0, y: 18 });
      gsap.set(progress, { scaleX: 0, transformOrigin: "left" });

      const finish = () => {
        gsap.to(root, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          duration: 1.5,
          ease: "hop",
          onStart: () => gsap.set(root, { pointerEvents: "none" }),
          onComplete: () => {
            setLoaderAnimating(false);
            setShowPreloader(false);
          },
        });
      };

      if (prefersReduced) {
        gsap.set(strokeEls, { strokeDashoffset: 0 });
        gsap.set(nodeEls, { scale: 1 });
        gsap.set([wordmark, tagline], { opacity: 1, y: 0 });
        gsap.delayedCall(0.9, finish);
        return;
      }

      const tl = gsap.timeline({
        delay: 0.2,
        onComplete: () => gsap.delayedCall(0.5, finish),
      });

      tl.to(progress, { scaleX: 1, duration: 2.6, ease: "power2.inOut" }, 0)
        .to(el("#outer-ring"), { strokeDashoffset: 0, duration: 1.2, ease: "power3.inOut" }, 0.1)
        .to(el("#central-spine"), { strokeDashoffset: 0, duration: 0.8, ease: "expo.out" }, 0.5)
        .to([el("#top-cap"), el("#bottom-cap")], { scale: 1, duration: 0.35, stagger: 0.1, ease: "back.out(2)" }, 0.85)
        .to(el("#antenna-loops"), { strokeDashoffset: 0, duration: 0.9, ease: "power2.out" }, 0.9)
        .to([el("#antenna-node-left"), el("#antenna-node-right")], { scale: 1, duration: 0.3, stagger: 0.08, ease: "back.out(2.5)" }, 1.3)
        .to([el("#bus-lead-left"), el("#bus-lead-right")], { strokeDashoffset: 0, duration: 0.6, stagger: 0.05, ease: "power2.out" }, 1.2)
        .to([el("#bus-node-left"), el("#bus-node-right")], { scale: 1, duration: 0.4, stagger: 0.08, ease: "elastic.out(1, 0.4)" }, 1.45)
        .to(el("#binding-wings"), { strokeDashoffset: 0, duration: 0.8, ease: "power2.out" }, 1.4)
        .to([el("#wing-node-left"), el("#wing-node-right")], { scale: 1, duration: 0.3, stagger: 0.06, ease: "back.out(2)" }, 1.7)
        .to(el("#eye-outer-ring"), { strokeDashoffset: 0, duration: 0.7, ease: "power3.out" }, 1.7)
        .to(el("#eye-pupil"), { scale: 1, duration: 0.5, ease: "elastic.out(1.2, 0.3)" }, 2.0)
        .fromTo(
          shockwave,
          { scale: 0.2, opacity: 0.85 },
          { scale: 1.25, opacity: 0, duration: 0.9, ease: "power2.out" },
          2.05
        )
        .to(wordmark, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 2.2)
        .to(tagline, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 2.4);
    },
    { scope: preloaderRef, dependencies: [showPreloader] }
  );

  if (!showPreloader) {
    return null;
  }

  return (
    <div className="preloader" ref={preloaderRef}>
      <div className="preloader-grid"></div>
      <div className="preloader-scanlines"></div>

      <div className="preloader-inner">
        <div className="preloader-hud">
          <span className="preloader-dot"></span>
          <span>SEAL_CORE: ENGAGING</span>
        </div>

        <div className="preloader-stage">
          <div className="preloader-shockwave"></div>

          <svg
            className="preloader-sigil"
            viewBox="0 0 500 500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="SIGIL LABS — Solomonic Circuit"
            role="img"
          >
            <circle id="outer-ring" cx="250" cy="250" r="210" stroke="#FFFFFF" strokeWidth="12" />
            <line id="central-spine" x1="250" y1="60" x2="250" y2="440" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" />
            <circle id="top-cap" cx="250" cy="60" r="10" fill="#FFFFFF" />
            <circle id="bottom-cap" cx="250" cy="440" r="10" fill="#FFFFFF" />
            <path id="antenna-loops" d="M 170,165 C 170,115 250,115 250,165 C 250,115 330,115 330,165" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" fill="none" />
            <circle id="antenna-node-left" cx="170" cy="165" r="14" fill="#FFFFFF" />
            <circle id="antenna-node-right" cx="330" cy="165" r="14" fill="#FFFFFF" />
            <line id="bus-lead-left" x1="115" y1="250" x2="200" y2="250" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" />
            <line id="bus-lead-right" x1="300" y1="250" x2="385" y2="250" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" />
            <circle id="bus-node-left" cx="110" cy="250" r="15" fill="#FFFFFF" />
            <circle id="bus-node-right" cx="390" cy="250" r="15" fill="#FFFFFF" />
            <path id="binding-wings" d="M 180,345 C 210,385 250,385 250,345 C 250,385 290,385 320,345" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" fill="none" />
            <circle id="wing-node-left" cx="180" cy="345" r="12" fill="#FFFFFF" />
            <circle id="wing-node-right" cx="320" cy="345" r="12" fill="#FFFFFF" />
            <circle id="eye-outer-ring" cx="250" cy="250" r="50" stroke="#FFFFFF" strokeWidth="12" />
            <circle id="eye-pupil" cx="250" cy="250" r="18" fill="#FFFFFF" />
          </svg>
        </div>

        <div className="preloader-brand">
          <p className="preloader-wordmark">SIGIL LABS</p>
          <p className="preloader-tagline">ENGINEERED WILL // AUTONOMOUS REALITY</p>
        </div>

        <div className="preloader-progress-track">
          <div className="preloader-progress"></div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
