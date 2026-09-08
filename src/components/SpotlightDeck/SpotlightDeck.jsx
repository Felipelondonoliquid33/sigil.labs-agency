"use client";
import "./SpotlightDeck.css";
import { useRef, useState, useCallback, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/**
 * SpotlightDeck — a 3D perspective gallery of real project screenshots.
 * Idle micro-float (CSS) + mouse-parallax tilt of the whole grid; on hover a
 * card lifts toward the viewer (translateZ + scale) while the rest dim
 * (Spotify-style spotlight). All 3D is gated behind matchMedia so reduced-motion
 * and touch/mobile fall back to a clean, static grid. Click opens a lightbox.
 */
const SpotlightDeck = ({ items = [], eyebrow = "Snapshots", heading = "Selected frames" }) => {
  const scopeRef = useRef(null);
  const gridRef = useRef(null);
  const [lightbox, setLightbox] = useState(null);
  // Card aspect follows the source frames so slices show near-complete (minimal
  // crop) whether the shots are portrait, square or landscape. Clamped to keep
  // extreme full-page ratios from producing absurdly tall cards.
  const [aspect, setAspect] = useState(null);
  const applyAspect = useCallback((w, h) => {
    if (w && h) setAspect(Math.min(Math.max(w / h, 0.62), 1.9));
  }, []);
  const onFirstLoad = useCallback((e) => applyAspect(e.target.naturalWidth, e.target.naturalHeight), [applyAspect]);
  // Cached images may be complete before onLoad can attach — read them here.
  const firstImgRef = useCallback(
    (node) => {
      if (node && node.complete && node.naturalWidth) applyAspect(node.naturalWidth, node.naturalHeight);
    },
    [applyAspect]
  );

  useGSAP(
    () => {
      const grid = gridRef.current;
      if (!grid) return;

      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 1000px) and (prefers-reduced-motion: no-preference)",
        () => {
          const stage = scopeRef.current.querySelector(".deck-stage");
          const cards = gsap.utils.toArray(grid.querySelectorAll(".deck-card"));

          // Mouse-parallax tilt of the whole grid (same language as the
          // .svc-browser tilt used on the project overview).
          const rotY = gsap.quickTo(grid, "rotationY", { duration: 0.8, ease: "power3.out" });
          const rotX = gsap.quickTo(grid, "rotationX", { duration: 0.8, ease: "power3.out" });

          const onMove = (e) => {
            const r = stage.getBoundingClientRect();
            const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
            const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
            rotY(dx * 10);
            rotX(-dy * 7);
          };
          const onLeave = () => {
            rotY(0);
            rotX(0);
          };
          stage.addEventListener("mousemove", onMove);
          stage.addEventListener("mouseleave", onLeave);

          // Per-card spotlight lift (transform only — GPU composited).
          const enterFns = [];
          const leaveFns = [];
          cards.forEach((card) => {
            const enter = () => gsap.to(card, { z: 70, scale: 1.05, duration: 0.4, ease: "power3.out", overwrite: true });
            const leave = () => gsap.to(card, { z: 0, scale: 1, duration: 0.5, ease: "power3.out", overwrite: true });
            card.addEventListener("mouseenter", enter);
            card.addEventListener("mouseleave", leave);
            enterFns.push([card, enter]);
            leaveFns.push([card, leave]);
          });

          return () => {
            stage.removeEventListener("mousemove", onMove);
            stage.removeEventListener("mouseleave", onLeave);
            enterFns.forEach(([c, f]) => c.removeEventListener("mouseenter", f));
            leaveFns.forEach(([c, f]) => c.removeEventListener("mouseleave", f));
          };
        }
      );

      return () => mm.revert();
    },
    { scope: scopeRef }
  );

  const closeLightbox = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => e.key === "Escape" && setLightbox(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  if (!items.length) return null;

  return (
    <section className="spotlight-deck" ref={scopeRef}>
      <div className="deck-head">
        <p className="deck-eyebrow">&#9654; {eyebrow}</p>
        <h2 className="deck-heading">{heading}</h2>
      </div>

      <div className="deck-stage">
        <div className="deck-grid" ref={gridRef} style={aspect ? { "--card-aspect": aspect } : undefined}>
          {items.map((item, i) => (
            <button
              type="button"
              className="deck-card"
              key={item.src}
              style={{ "--i": i }}
              onClick={() => setLightbox(item)}
              aria-label={`Open ${item.alt || `frame ${i + 1}`}`}
            >
              <span className="deck-card__float">
                <img
                  src={item.src}
                  alt={item.alt || `Frame ${i + 1}`}
                  loading="lazy"
                  ref={i === 0 ? firstImgRef : undefined}
                  onLoad={i === 0 ? onFirstLoad : undefined}
                />
                <span className="deck-card__scan" aria-hidden="true" />
                <span className="deck-card__idx">{String(i + 1).padStart(2, "0")}</span>
                <span className="deck-card__glow" aria-hidden="true" />
              </span>
            </button>
          ))}
        </div>
      </div>

      {lightbox && (
        <div className="deck-lightbox" onClick={closeLightbox} role="dialog" aria-modal="true">
          <button className="deck-lightbox__close" type="button" onClick={closeLightbox} aria-label="Close">
            &#10005;
          </button>
          <div className="deck-lightbox__inner" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.src} alt={lightbox.alt || "Project frame"} />
          </div>
        </div>
      )}
    </section>
  );
};

export default SpotlightDeck;
