"use client";
import "./FeaturedWork.css";
import { useRef } from "react";
import { projects } from "./project.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useViewTransition } from "@/hooks/useViewTransition";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function FeaturedWork() {
  const featuredWorkContainerRef = useRef(null);
  const { navigateWithTransition } = useViewTransition();

  useGSAP(
    () => {
      const createFeaturedWorkItem = (project) => {
        const featuredWorkItem = document.createElement("div");
        featuredWorkItem.className = "featured-work-item";
        featuredWorkItem.innerHTML = `
        <a href="${project.route}" class="featured-work-item-link">
          <div class="featured-work-item-img">
           <div class="featured-work-item-copy">
            <h3>${project.name}</h3>
          </div>
            ${project.video ? `<video data-src="${project.video}" poster="${project.img}" autoplay loop muted playsinline preload="none"></video>` : `<img src="${project.img}" alt="${project.name}" loading="lazy" />`}
          </div>
        </a>
      `;
        return featuredWorkItem;
      };

      const workContainer = featuredWorkContainerRef.current;

      workContainer.innerHTML = "";

      for (let i = 0; i < projects.length; i += 2) {
        const row = document.createElement("div");
        row.className = "row";

        const leftItemIndex = i;
        const rightItemIndex = i + 1;

        row.appendChild(createFeaturedWorkItem(projects[leftItemIndex]));

        if (rightItemIndex < projects.length) {
          row.appendChild(createFeaturedWorkItem(projects[rightItemIndex]));
        }

      workContainer.appendChild(row);
      }

      const videoObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const video = entry.target;
            const source = video.getAttribute("data-src");
            if (source && !video.getAttribute("src")) {
              video.setAttribute("src", source);
              video.load();
              video.play().catch(() => {});
            }
            videoObserver.unobserve(video);
          });
        },
        { rootMargin: "25% 0px" }
      );

      workContainer.querySelectorAll("video[data-src]").forEach((video) => {
        videoObserver.observe(video);
      });

      gsap.set(".featured-work-item", {
        y: 1000,
      });

      document.querySelectorAll(".row").forEach((row) => {
        const featuredWorkItems = row.querySelectorAll(".featured-work-item");

        featuredWorkItems.forEach((item, itemIndex) => {
          const isLeftProjectItem = itemIndex === 0;
          gsap.set(item, {
            rotation: isLeftProjectItem ? -60 : 60,
            transformOrigin: "center center",
          });
        });

        ScrollTrigger.create({
          trigger: row,
          start: "top 70%",
          onEnter: () => {
            gsap.to(featuredWorkItems, {
              y: 0,
              rotation: 0,
              duration: 1,
              ease: "power4.out",
              stagger: 0.25,
            });
          },
        });
      });

      const links = workContainer.querySelectorAll(".featured-work-item-link");
      const handleClick = (e) => {
        const anchor = e.currentTarget;
        if (!anchor) return;
        e.preventDefault();
        const href = anchor.getAttribute("href");
        if (!href) return;
        navigateWithTransition(href);
      };
      links.forEach((a) => a.addEventListener("click", handleClick));

      return () => {
        videoObserver.disconnect();
        links.forEach((a) => a.removeEventListener("click", handleClick));
      };
    },
    { scope: featuredWorkContainerRef }
  );

  return (
    <>
      <div className="featured-work-list" ref={featuredWorkContainerRef}></div>
    </>
  );
}
