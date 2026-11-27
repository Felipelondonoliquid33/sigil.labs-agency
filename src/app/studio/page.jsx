"use client";
import "./studio.css";
import TeamCards from "@/components/TeamCards/TeamCards";
import Spotlight from "@/components/Spotlight/Spotlight";
import CTACard from "@/components/CTACard/CTACard";
import Footer from "@/components/Footer/Footer";
import React, { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Copy from "@/components/Copy/Copy";
import StudioMethod from "@/components/StudioMethod/StudioMethod";

gsap.registerPlugin(ScrollTrigger);

const Page = () => {
  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      ScrollTrigger.refresh(true);
    });

    const onLoad = () => ScrollTrigger.refresh(true);
    window.addEventListener("load", onLoad, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return (
    <div className="studio-page">
      <section className="studio-header">
        <div className="container">
          <div className="studio-header-row">
            <Copy delay={0.8}>
              <h1>We design</h1>
            </Copy>
          </div>

          <div className="studio-header-row">
            <Copy delay={0.95}>
              <h2 className="display-h1">the extraordinary</h2>
            </Copy>
          </div>
        </div>
      </section>

      <section className="studio-copy">
        <div className="container">
          <div className="studio-copy-img">
            <img src="/showcase/opt/sigil_labs_updated_hero.webp" alt="SIGIL LABS Studio" />
          </div>

          <Copy animateOnScroll={true}>
            <p className="lg">
              SIGIL LABS is a creative engineering unit that builds autonomous
              digital systems through motion, intelligence and narrative. We turn
              strategic intent into interfaces, agents and ecosystems that feel
              alive because they are designed to evolve.
            </p>

            <p className="lg">
              We operate across immersive development, agentic AI and digital
              infrastructure. Every project is treated as a protocol: a clear
              system of decisions, interactions and outcomes that transcend the
              screen.
            </p>
          </Copy>
        </div>
      </section>

      <StudioMethod />

      <TeamCards />

      <Spotlight />

      <CTACard />

      <Footer />
    </div>
  );
};

export default Page;
