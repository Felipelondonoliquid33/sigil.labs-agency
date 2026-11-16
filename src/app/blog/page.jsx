"use client";
import "./blog.css";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Copy from "@/components/Copy/Copy";
import CTACard from "@/components/CTACard/CTACard";
import Footer from "@/components/Footer/Footer";
import { blogPosts } from "@/data/blogPosts";

gsap.registerPlugin(useGSAP);

// Mismo gesto que /work: la carpeta sube y sus tres vistas previas saltan al pasar el mouse.
// Los artículos son experiencias estáticas fuera del router de Next, por eso <a> normal (navegación completa).
const Page = () => {
  const pageRef = useRef(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(pageRef);
      const folders = q(".folder");
      const wrappers = q(".folder-wrapper");
      let isMobile = window.innerWidth < 1000;
      const handlers = new Map();

      gsap.set(wrappers, { y: isMobile ? 0 : 25 });

      folders.forEach((folder, index) => {
        const previews = folder.querySelectorAll(".folder-preview-img");
        const onEnter = () => {
          if (isMobile) return;
          folders.forEach((f) => f !== folder && f.classList.add("disabled"));
          gsap.to(wrappers[index], { y: 0, duration: 0.25, ease: "back.out(1.7)" });
          previews.forEach((img, i) => {
            const rotation = i === 0 ? gsap.utils.random(-20, -10) : i === 1 ? gsap.utils.random(-10, 10) : gsap.utils.random(10, 20);
            gsap.to(img, { y: "-100%", rotation, duration: 0.25, ease: "back.out(1.7)", delay: i * 0.025 });
          });
        };
        const onLeave = () => {
          if (isMobile) return;
          folders.forEach((f) => f.classList.remove("disabled"));
          gsap.to(wrappers[index], { y: 25, duration: 0.25, ease: "back.out(1.7)" });
          previews.forEach((img, i) => gsap.to(img, { y: "0%", rotation: 0, duration: 0.25, ease: "back.out(1.7)", delay: i * 0.05 }));
        };
        handlers.set(folder, [onEnter, onLeave]);
        folder.addEventListener("mouseenter", onEnter);
        folder.addEventListener("mouseleave", onLeave);
      });

      const onResize = () => {
        const next = window.innerWidth < 1000;
        if (next === isMobile) return;
        isMobile = next;
        gsap.set(wrappers, { y: isMobile ? 0 : 25 });
        folders.forEach((f) => f.classList.remove("disabled"));
        gsap.set(q(".folder-preview-img"), { y: "0%", rotation: 0 });
      };
      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("resize", onResize);
        handlers.forEach(([enter, leave], folder) => {
          folder.removeEventListener("mouseenter", enter);
          folder.removeEventListener("mouseleave", leave);
        });
      };
    },
    { scope: pageRef }
  );

  return (
    <div className="blog-page" ref={pageRef}>
      <header className="blog-header">
        <div className="container">
          <Copy delay={0.6}>
            <p className="blog-eyebrow">SIGIL LABS / Blog</p>
          </Copy>
          <div className="blog-header-row blog-header-row--right">
            <Copy delay={0.8}>
              <h1>Interactive</h1>
            </Copy>
          </div>
          <div className="blog-header-row">
            <Copy delay={0.95}>
              <h1>Stories</h1>
            </Copy>
          </div>
        </div>
      </header>

      <section className="blog-intro container">
        <Copy animateOnScroll={true}>
          <p className="lg">
            Long-form research told as immersive web experiences. Real data,
            original storytelling, built to be played, not just read.
          </p>
        </Copy>
      </section>

      <section className="blog-folders" aria-label="Stories">
        {blogPosts.map((post, index) => (
          <article className="blog-entry" key={post.slug}>
            <a href={`/blog/${post.slug}`} className="blog-folder-link" aria-label={`${post.title}: read the interactive story`}>
              <div className={`folder ${["variant-3", "variant-1", "variant-2"][index % 3]}`}>
                <div className="folder-preview">
                  {post.previews.map((src, i) => (
                    <div className="folder-preview-img" key={src}>
                      <img src={src} alt={`${post.title} — preview ${i + 1}`} loading="lazy" />
                    </div>
                  ))}
                </div>
                <div className="folder-wrapper">
                  <div className="folder-index">
                    <p>{String(index + 1).padStart(2, "0")}</p>
                  </div>
                  <div className="folder-name">
                    <h2>{post.title}</h2>
                  </div>
                </div>
              </div>
            </a>
            <div className="blog-meta container">
              <p className="blog-meta-line">
                <span>{post.tag}</span>
                <span>{post.lang}</span>
                <span>{new Date(post.date).toLocaleDateString("en-US", { timeZone: "UTC", year: "numeric", month: "short", day: "numeric" })}</span>
                <span>{post.readingTime} read</span>
              </p>
              <p className="blog-meta-excerpt">{post.excerpt}</p>
              <p className="blog-meta-tagline" lang="es">{post.tagline}</p>
              <a className="blog-meta-cta" href={`/blog/${post.slug}`}>Read the story →</a>
            </div>
          </article>
        ))}
        <div className="blog-soon container">
          <p>More interactive stories soon.</p>
        </div>
      </section>

      <CTACard />
      <Footer />
    </div>
  );
};

export default Page;
