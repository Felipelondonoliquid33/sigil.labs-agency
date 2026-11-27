"use client";
import "./Spotlight.css";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Spotlight = () => {
  const spotlightRef = useRef(null);

  useGSAP(
    () => {
      const root = spotlightRef.current;
      if (!root) return;

      const splitInstances = [];

      root.querySelectorAll(".marquee-container").forEach((container, index) => {
        const marquee = container.querySelector(".marquee");
        const textEl = container.querySelector(".marquee-text-item h1, .marquee-text-item .display-h1");

        // Horizontal drift — transform only (GPU composited, no reflow).
        gsap.to(marquee, {
          x: index % 2 === 0 ? "5%" : "-15%",
          ease: "none",
          force3D: true,
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "150% top",
            scrub: true,
          },
        });

        // Character reveal — opacity only. Avoids the per-frame font-weight
        // reflow that made this section stutter/hang on scroll.
        if (textEl) {
          const split = new SplitType(textEl, { types: "chars" });
          splitInstances.push(split);

          gsap.fromTo(
            split.chars,
            { opacity: 0.15 },
            {
              opacity: 1,
              ease: "none",
              stagger: {
                each: 0.35,
                from: index % 2 === 0 ? "end" : "start",
                ease: "linear",
              },
              scrollTrigger: {
                trigger: container,
                start: "50% bottom",
                end: "top top",
                scrub: true,
              },
            }
          );
        }
      });

      ScrollTrigger.refresh();

      // useGSAP (scoped) reverts the tweens + their ScrollTriggers on unmount;
      // SplitType instances must be reverted manually.
      return () => {
        splitInstances.forEach((split) => split.revert && split.revert());
      };
    },
    { scope: spotlightRef }
  );

  return (
    <section className="spotlight" ref={spotlightRef}>
      <div className="marquees">
        <div className="marquee-container" id="marquee-1">
          <div className="marquee">
            <div className="marquee-img-item">
              <img src="/showcase/opt/mar_shop_hero.webp" alt="Mar Shop Hero" loading="lazy" />
            </div>
            <div className="marquee-img-item marquee-text-item">
              <h2 className="display-h1">MAR SHOP</h2>
            </div>
            <div className="marquee-img-item">
              <img src="/showcase/opt/mar_shop_full.webp" alt="Mar Shop Catalogo" loading="lazy" />
            </div>
            <div className="marquee-img-item">
              <img src="/showcase/opt/mar_shop_hero.webp" alt="Mar Shop Hero" loading="lazy" />
            </div>
            <div className="marquee-img-item">
              <img src="/showcase/opt/mar_shop_full.webp" alt="Mar Shop Detalle" loading="lazy" />
            </div>
          </div>
        </div>

        <div className="marquee-container" id="marquee-2">
          <div className="marquee">
            <div className="marquee-img-item">
              <img src="/showcase/opt/empanadas_app_hero.webp" alt="Empanadas Hero" loading="lazy" />
            </div>
            <div className="marquee-img-item">
              <img src="/showcase/opt/empanadas_app_full.webp" alt="Empanadas Menu" loading="lazy" />
            </div>
            <div className="marquee-img-item">
              <img src="/showcase/opt/empanadas_app_hero.webp" alt="Empanadas UI" loading="lazy" />
            </div>
            <div className="marquee-img-item marquee-text-item">
              <h2 className="display-h1">ANTOJOS LA BOCA</h2>
            </div>
            <div className="marquee-img-item">
              <img src="/showcase/opt/empanadas_app_full.webp" alt="Empanadas Interfaz" loading="lazy" />
            </div>
          </div>
        </div>

        <div className="marquee-container" id="marquee-3">
          <div className="marquee">
            <div className="marquee-img-item">
              <img src="/showcase/opt/el_susurro_del_tiempo_hero.webp" alt="El Susurro del Tiempo Hero" loading="lazy" />
            </div>
            <div className="marquee-img-item marquee-text-item">
              <h2 className="display-h1">3D ARCHIVE</h2>
            </div>
            <div className="marquee-img-item">
              <img src="/showcase/opt/el_susurro_del_tiempo_full.webp" alt="El Susurro del Tiempo 3D" loading="lazy" />
            </div>
            <div className="marquee-img-item">
              <img src="/showcase/opt/portfolio_flh_hero.webp" alt="Portfolio FLH Hero" loading="lazy" />
            </div>
            <div className="marquee-img-item">
              <img src="/showcase/opt/portfolio_flh_full.webp" alt="Portfolio FLH Full" loading="lazy" />
            </div>
          </div>
        </div>

        <div className="marquee-container" id="marquee-4">
          <div className="marquee">
            <div className="marquee-img-item">
              <img src="/showcase/opt/liquid_new_landing_hero.webp" alt="Li4uid 2.0 Hero" loading="lazy" />
            </div>
            <div className="marquee-img-item">
              <img src="/showcase/opt/liquid_new_landing_full.webp" alt="Li4uid 2.0 Landing" loading="lazy" />
            </div>
            <div className="marquee-img-item">
              <img src="/showcase/opt/liquid_new_landing_hero.webp" alt="Li4uid 2.0 UI" loading="lazy" />
            </div>
            <div className="marquee-img-item marquee-text-item">
              <h2 className="display-h1">LI4UID 2.0</h2>
            </div>
            <div className="marquee-img-item">
              <img src="/showcase/opt/liquid_new_landing_full.webp" alt="Li4uid 2.0 Motion" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Spotlight;
