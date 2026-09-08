"use client";
import "./Showreel.css";
import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LuVolumeX, LuVolume } from "react-icons/lu";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Flagship stop-motion reel — real interfaces, pages & interactions only.
// Pacifista leads (agency flagship). No product/isolated-object photography.
const frames = [
  "/showcase/reel/05_pacifista_editorial.webp",
  "/showcase/reel/06_pacifista_journalism.webp",
  "/showcase/reel/01_gsap_showroom_hero.webp",
  "/showcase/reel/02_gsap_showroom_catalog.webp",
  "/showcase/reel/07_gsap_showroom_inspect.webp",
  "/showcase/reel/liquid_real_1.webp",
  "/showcase/reel/08_liquid_motion.webp",
  "/showcase/reel/03_susurro_hero.webp",
  "/showcase/reel/11_susurro_archive.webp",
  "/showcase/reel/13_susurro_interactive_book.webp",
  "/showcase/reel/06_empanada_ui.webp",
  "/showcase/reel/05_empanada_popart.webp",
  "/showcase/reel/15_flh_identity.webp",
  "/showcase/reel/09_sigil_circuit.webp",
  "/showcase/reel/16_sigil_manifesto.webp",
];

const Showreel = () => {
  const showreelSecRef = useRef(null);
  const audioRef = useRef(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const totalFrames = frames.length;

  useEffect(() => {
    // Preload all frames for instant, stutter-free stop-motion
    frames.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    const timer = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % totalFrames);
    }, 280);

    return () => clearInterval(timer);
  }, [totalFrames]);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(!isMuted);

      if (!audioRef.current.muted && audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      }
    }
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1000px)", () => {
        const scrollTriggerInstances = [];

        if (audioRef.current) {
          audioRef.current.play().catch(() => {});
        }

        const scrollTrigger = ScrollTrigger.create({
          trigger: showreelSecRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * 2}px`,
          pin: true,
          pinSpacing: true,
          onUpdate: (self) => {
            const progress = self.progress;

            const scaleValue = gsap.utils.mapRange(0, 1, 0.75, 1, progress);
            const borderRadiusValue =
              progress <= 0.5 ? gsap.utils.mapRange(0, 0.5, 2, 0, progress) : 0;

            gsap.set(".showreel-container", {
              scale: scaleValue,
              borderRadius: `${borderRadiusValue}rem`,
            });
          },
        });

        if (scrollTrigger) {
          scrollTriggerInstances.push(scrollTrigger);
        }

        const refreshHandler = () => {
          ScrollTrigger.refresh();
        };

        window.addEventListener("orientationchange", refreshHandler);
        window.addEventListener("resize", refreshHandler);

        const onLoad = () => ScrollTrigger.refresh();
        window.addEventListener("load", onLoad, { passive: true });

        return () => {
          scrollTriggerInstances.forEach((trigger) => trigger.kill());

          window.removeEventListener("orientationchange", refreshHandler);
          window.removeEventListener("resize", refreshHandler);
          window.removeEventListener("load", onLoad);
        };
      });

      mm.add("(max-width: 999px)", () => {
        const showreelSection = showreelSecRef.current;
        if (showreelSection) {
          gsap.set(showreelSection, { clearProps: "all" });
        }
        gsap.set(".showreel-container", { clearProps: "all" });

        ScrollTrigger.refresh();

        const refreshHandler = () => {
          ScrollTrigger.refresh();
        };

        window.addEventListener("orientationchange", refreshHandler);
        const onLoad = () => ScrollTrigger.refresh();
        window.addEventListener("load", onLoad, { passive: true });

        return () => {
          window.removeEventListener("orientationchange", refreshHandler);
          window.removeEventListener("load", onLoad);
        };
      });

      return () => {
        mm.revert();
      };
    },
    { scope: showreelSecRef }
  );

  return (
    <section className="showreel" ref={showreelSecRef}>
      <div className="showreel-container">
        {frames.map((src, index) => (
          <img
            key={index}
            className={`showreel-frame ${index === currentFrame ? "active" : ""}`}
            src={src}
            alt={`Showreel frame ${index + 1}`}
            loading="eager"
          />
        ))}
      </div>

      <div className="volume-icon" onClick={toggleMute} aria-label="Toggle sound">
        {isMuted ? (
          <LuVolumeX color="var(--base-100)" size={24} />
        ) : (
          <LuVolume color="var(--base-100)" size={24} />
        )}
      </div>

      <audio
        ref={audioRef}
        src="/showreel/sigil_techno_reel.mp3"
        loop
        muted={isMuted}
      />
    </section>
  );
};

export default Showreel;
