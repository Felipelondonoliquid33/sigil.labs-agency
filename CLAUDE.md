# CLAUDE.md — SIGIL LABS / Polite-Chaos

## Overview
Next.js Pages Router application for **SIGIL LABS** creative agency portfolio.

## Key Commands
```bash
# Start dev server
npm run dev
# Or with explicit port:
npm run dev -- -p 3001

# Production build check
npm run build
```

## Structure & Architecture
- `src/components/Showreel/Showreel.jsx`: 16 high-definition project showcase frames (1080p WebP), cycling at 280ms with GSAP ScrollTrigger scale `0.75 -> 1.0`.
- `src/components/FeaturedWork/`:
  - Card 1: **PACIFISTA** (`/videos/pacifista_demo_hd.webm`, cover `/images/pacifista_hero.png`)
  - Card 2: **GSAP Showroom** (`/videos/gsap_showroom_demo_hd.webm`, cover `/images/gsap_showroom_cover.png`)
  - Card 3: **Liquid Landing** (`/videos/liquid_landing_demo_hd.webm`)
  - Card 4: **El Susurro del Tiempo** (`/videos/susurro_tiempo_demo_hd.webm`)
  - Card 5: **Mar Shop** (`/videos/mar_shop_demo_hd.webm`)
  - Card 6: **Empanadas** (`/videos/empanadas_demo_hd.webm`)
- Media locations:
  - High-res videos: `public/videos/`
  - High-res images: `public/images/`
- Obsidian Documentation: `The brain/03-Projects/SIGIL-LABS-Claude-Code-Handover.md`
