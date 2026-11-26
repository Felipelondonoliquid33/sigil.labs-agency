"use client";
import "./sample-project.css";
import Footer from "@/components/Footer/Footer";
import Copy from "@/components/Copy/Copy";
import { useSearchParams } from "next/navigation";
import { projectDetails } from "@/data/projectDetails";
import { projectMedia } from "@/data/projectMedia";
import { Suspense, useEffect, useRef, useState } from "react";
import Button from "@/components/Button/Button";
import SpotlightDeck from "@/components/SpotlightDeck/SpotlightDeck";

// Per-project headline metrics. Falls back to values derived from the record.
const METRICS = {
  pacifista: [
    { v: "4,229", l: "Pieces preserved" },
    { v: "10,436", l: "Images placed" },
    { v: "2014–25", l: "Archive coverage" },
    { v: "0", l: "Broken legacy links" },
  ],
  "gsap-motion-vault": [
    { v: "295", l: "Motion modules" },
    { v: "60fps", l: "Performance target" },
    { v: "Live", l: "Code inspector" },
    { v: "3", l: "Difficulty tiers" },
  ],
  li4uid: [
    { v: "Real-time", l: "AI infrastructure" },
    { v: "Sub-1s", l: "Latency" },
    { v: "100%", l: "Custom system" },
    { v: "Dublin", l: "Market" },
  ],
  "li4uid-core-web": [
    { v: "Real-time", l: "AI infrastructure" },
    { v: "Sub-1s", l: "Latency" },
    { v: "100%", l: "Custom system" },
    { v: "Dublin", l: "Market" },
  ],
  "la-mar": [
    { v: "<1s", l: "Load target" },
    { v: "Headless", l: "Architecture" },
    { v: "100%", l: "Custom UI" },
    { v: "Fluid", l: "Checkout" },
  ],
  "mar-shop": [
    { v: "<1s", l: "Load target" },
    { v: "Headless", l: "Architecture" },
    { v: "100%", l: "Custom UI" },
    { v: "Fluid", l: "Checkout" },
  ],
  empanadas: [
    { v: "24H", l: "Order window" },
    { v: "12", l: "Reasons" },
    { v: "100%", l: "Handcrafted" },
    { v: "Bogotá", l: "Origin" },
  ],
  "el-susurro-del-tiempo": [
    { v: "3D", l: "Living archive" },
    { v: "WebGL", l: "Rendering" },
    { v: "1", l: "Digital book" },
    { v: "∞", l: "Memory" },
  ],
  "internal-r-and-d": [
    { v: "R&D", l: "Internal lab" },
    { v: "GSAP", l: "Motion core" },
    { v: "Lenis", l: "Smooth scroll" },
    { v: "1:1", l: "Editorial" },
  ],
  "portfolio-flh": [
    { v: "R&D", l: "Internal lab" },
    { v: "GSAP", l: "Motion core" },
    { v: "Lenis", l: "Smooth scroll" },
    { v: "1:1", l: "Editorial" },
  ],
  "yen-galindo-photography": [
    { v: "35mm", l: "Film language" },
    { v: "120", l: "Medium format" },
    { v: "Natural", l: "Light direction" },
    { v: "Analog", l: "Image practice" },
  ],
  "yoahorro-ia": [
    { v: "Vision", l: "Gemini engine" },
    { v: "Real-world", l: "Price signals" },
    { v: "RN", l: "Mobile" },
    { v: "AI", l: "Automated" },
  ],
  "synapsis-academy": [
    { v: "Adaptive", l: "Learning routes" },
    { v: "Real-time", l: "Analytics" },
    { v: "Beyond", l: "The LMS" },
    { v: "Scale", l: "EdTech" },
  ],
  "puente-de-equidad": [
    { v: "Interactive", l: "Simulation" },
    { v: "Care", l: "Economy" },
    { v: "Gamified", l: "Experience" },
    { v: "Social", l: "Impact" },
  ],
  "arcade-portfolio": [
    { v: "1", l: "Continuous world" },
    { v: "7", l: "Drivable zones" },
    { v: "60", l: "Target FPS" },
    { v: "0", l: "Scroll events" },
  ],
  praxuz: [
    { v: "2", l: "Platforms, one bridge" },
    { v: "0", l: "Manual enrolments" },
    { v: "6", l: "Months of access" },
    { v: "15", l: "Countries reached" },
  ],
};

const fmt = (s) => {
  if (!s || !isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec < 10 ? "0" : ""}${sec}`;
};

const ProjectVideoShowcase = ({ src, poster, title, label }) => {
  const wrapperRef = useRef(null);
  const videoRef = useRef(null);
  const browserRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [time, setTime] = useState("0:00 / 0:00");

  useEffect(() => {
    const video = videoRef.current;
    const wrapper = wrapperRef.current;
    if (!video || !wrapper) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            video.play().then(() => setPlaying(true)).catch(() => {});
          } else {
            video.pause();
            setPlaying(false);
          }
        });
      },
      { threshold: 0.35 }
    );
    obs.observe(wrapper);

    const onTime = () => {
      if (!video.duration) return;
      setProgress((video.currentTime / video.duration) * 100);
      setTime(`${fmt(video.currentTime)} / ${fmt(video.duration)}`);
    };
    video.addEventListener("timeupdate", onTime);

    return () => {
      obs.disconnect();
      video.removeEventListener("timeupdate", onTime);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const onMove = (e) => {
    const el = browserRef.current;
    if (!el || window.innerWidth < 1000) return;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
    const dy = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
    el.style.transform = `perspective(1000px) rotateY(${dx * 8}deg) rotateX(${-dy * 5}deg)`;
  };

  const onLeave = () => {
    const el = browserRef.current;
    if (el) el.style.transform = "perspective(1000px) rotateY(-4deg) rotateX(2deg)";
  };

  return (
    <div className="svc">
      <div className="svc-glow" />
      <div className="svc-floating-label">
        <span className="sfl-title">Live Preview</span>
        <span className="sfl-name">{title}</span>
      </div>

      <div className="svc-browser" ref={browserRef} onMouseMove={onMove} onMouseLeave={onLeave}>
        <div className="svc-topbar">
          <div className="svc-dots">
            <span className="svc-dot" />
            <span className="svc-dot" />
            <span className="svc-dot" />
          </div>
          <div className="svc-url-bar">
            <span className="svc-url-dot" />
            sigil.labs
          </div>
          <div className="svc-live-badge">
            <span className="svc-live-pulse" />
            Demo
          </div>
        </div>

        <div className="svc-video-wrapper" ref={wrapperRef} onClick={togglePlay}>
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            muted={muted}
            loop
            playsInline
            preload="metadata"
            aria-label={label || `${title} — showcase video`}
          />
          <div className="svc-scanlines" />
          <div className={`svc-play-btn ${playing ? "" : "svc-show"}`}>
            <div className="svc-play-icon">
              {playing ? (
                <svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
              ) : (
                <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              )}
            </div>
          </div>
          <div className="svc-progress-bar">
            <div className="svc-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="svc-bottombar">
          <span className="svc-time">{time}</span>
          <button className="svc-mute-btn" onClick={toggleMute} type="button">
            {muted ? "Muted" : "Audio"}
          </button>
        </div>
      </div>
    </div>
  );
};

const ProjectSelection = ({ projectId }) => {
  const searchParams = useSearchParams();
  const requested = searchParams.get("project");
  const id = Object.hasOwn(projectDetails, projectId)
    ? projectId
    : Object.hasOwn(projectDetails, requested)
      ? requested
      : "pacifista";
  return <ProjectDetail key={id} id={id} />;
};

const ProjectDetail = ({ id }) => {
  const project = projectDetails[id];
  const media = projectMedia[id];
  const ids = Object.keys(projectDetails);
  const nextId = ids[(ids.indexOf(id) + 1) % ids.length];
  const next = projectDetails[nextId];

  const stack = project.medium.split(/,| and /).map((s) => s.trim()).filter(Boolean);
  const services = [
    ...project.eyebrow.split(" / "),
    ...project.form.split(/ and | & /),
  ]
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 6);
  const metrics =
    METRICS[id] || [
      { v: project.cycle, l: "Cycle" },
      { v: "GSAP", l: "Motion core" },
      { v: "100%", l: "Bespoke build" },
      { v: "1", l: "Protocol" },
    ];

  return (
    <div className="sample-project-page">
      <section className="project-header">
        <Copy delay={0.75}>
          <p className="lg">{project.eyebrow}</p>
          <h1>{project.title}</h1>
        </Copy>
      </section>

      <section className="project-banner-img">
        <div className="project-banner-img-wrapper">
          <img src={media.cover.src} alt={media.cover.alt} />
        </div>
      </section>

      {/* OVERVIEW — browser-framed showcase + stack/concept */}
      <section className="project-overview">
        <div className="project-overview-col">
          {media.video ? (
            <ProjectVideoShowcase
              src={media.video}
              poster={media.cover.src}
              title={project.title}
              label={media.videoLabel}
            />
          ) : (
            <div className="svc">
              <div className="svc-glow" />
              <div className="svc-browser" style={{ transform: "none" }}>
                <div className="svc-topbar">
                  <div className="svc-dots">
                    <span className="svc-dot" />
                    <span className="svc-dot" />
                    <span className="svc-dot" />
                  </div>
                  <div className="svc-url-bar">
                    <span className="svc-url-dot" />
                    sigil.labs
                  </div>
                  <div className="svc-live-badge">
                    <span className="svc-live-pulse" />
                    Case
                  </div>
                </div>
                <div className="svc-video-wrapper">
                  <img src={media.cover.src} alt={media.cover.alt} />
                  <div className="svc-scanlines" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="project-overview-col">
          <div className="project-stack">
            <p className="mono">&#9654; Stack</p>
            {stack.map((s, i) => (
              <p key={`stack-${i}`} className="stack-line">{s}</p>
            ))}
          </div>
          <div className="project-overview-copy">
            <p className="mono">&#9654; Overview</p>
            <p>{project.concept}</p>
            {project.externalUrl ? (
              <a className="project-live-link" href={project.externalUrl} target="_blank" rel="noreferrer">
                {project.externalLabel || "Visit live project"} <span aria-hidden="true">↗</span>
              </a>
            ) : null}
          </div>
        </div>
      </section>

      {/* METRICS + services */}
      <section className="project-metrics-section">
        <div className="project-metrics-card">
          <div className="pm-tag">Protocol Readout</div>
          <h4 className="pm-title">{project.form}</h4>
          <div className="pm-metrics">
            {metrics.map((m, i) => (
              <div className="pm-metric" key={`m-${i}`}>
                <div className="pm-metric-val">{m.v}</div>
                <div className="pm-metric-label">{m.l}</div>
              </div>
            ))}
          </div>
          <p className="mono pm-services-title">&#9654; Core Services</p>
          <div className="pm-services">
            {services.map((s, i) => (
              <span className="pm-service-tag" key={`svc-${i}`}>{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* SNAPSHOTS — 3D spotlight deck of real project frames */}
      {media.gallery && media.gallery.length > 0 && (
        <SpotlightDeck
          items={media.gallery}
          eyebrow="Snapshots"
          heading={`Inside ${project.title}`}
        />
      )}

      <section className="project-details">
        <Copy animateOnScroll={true}>
          <div className="details">
            <p>Project</p>
            <h3>{project.title}</h3>
          </div>

          <div className="details">
            <p>Discipline</p>
            <h3>{project.form}</h3>
          </div>

          <div className="details">
            <p>Technology</p>
            <h3>{project.medium}</h3>
          </div>

          <div className="details">
            <p>Presented by</p>
            <h3>SIGIL LABS</h3>
          </div>

          <div className="details">
            <p>Portfolio</p>
            <h3>Creative Engineering</h3>
          </div>

          {project.externalUrl ? (
            <div className="details">
              <p>Live project</p>
              <h3><a href={project.externalUrl} target="_blank" rel="noreferrer">{project.externalLabel || "Visit live project"} ↗</a></h3>
            </div>
          ) : null}
        </Copy>
      </section>

      <section className="next-project">
        <Copy animateOnScroll={true}>
          <p style={{ marginBottom: "1rem" }}>{String(ids.indexOf(nextId) + 1).padStart(2, "0")} / {ids.length}</p>
          <h2>Next</h2>
        </Copy>

        <div className="next-project-img">
          <div className="next-project-img-wrapper">
            <img src={projectMedia[nextId].cover.src} alt={projectMedia[nextId].cover.alt} loading="lazy" />
          </div>
        </div>

        <Copy animateOnScroll={true}>
          <h3>{next.title}</h3>
        </Copy>
        <Button href={`/work/${nextId}`}>View project</Button>
      </section>

      <Footer />
    </div>
  );
};

export default function Page({ projectId }) {
  return <Suspense fallback={<div className="sample-project-page" aria-busy="true" />}><ProjectSelection projectId={projectId} /></Suspense>;
}
