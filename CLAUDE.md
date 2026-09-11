# CLAUDE.md — SIGIL LABS / Polite-Chaos

## Overview
Next.js 15 App Router application (React 19, GSAP 3, Lenis, WebGL) for **SIGIL LABS** creative agency portfolio.

- **Live URL**: `https://www.sigillabs.agency`
- **GitHub**: `https://github.com/Felipelondonoliquid33/sigil.labs-agency.git` (`main` auto-deploys to Vercel)
- **Primary Contacts**: `sigillabs@gmail.com` | `+57 333 4016876` | Bogotá, Colombia

## Key Commands
```bash
# Start dev server
npm run dev
# Or with explicit port:
npm run dev -- -p 3001

# Production build check (27 static pages)
npm run build
```

## Structure & Architecture
- **App Router Layout (`src/app/layout.js`)**:
  - `ViewTransitions` provider.
  - Vercel Web Analytics (`@vercel/analytics/next`).
  - Google Analytics 4 (`@next/third-parties/google`).
  - Schema.org `["ProfessionalService", "Organization"]` JSON-LD with verified NAP (Bogotá, Colombia).
- **Core Components**:
  - `src/components/Showreel/Showreel.jsx`: 16 HD 1080p WebP project frames cycling at 280ms.
  - `src/components/LiveSigil.jsx`: Solomonic Circuit morphing with GSAP across brand states.
  - `src/components/FeaturedWork/`: Real client cases (PACIFISTA, GSAP Showroom, Liquid, El Susurro del Tiempo, Mar Shop, Empanadas).
- **Dynamic Routes**:
  - Services: `/services/creative-engineering`, `/services/agentic-ai-systems`, `/services/interactive-web-experiences`.
  - Cases: `/work/[slug]` with JSON-LD `CreativeWork` and 308 legacy redirects.
- **Obsidian Documentation**: `The brain/03-Projects/SIGIL-LABS-Agency-Polite-Chaos.md` & `SIGIL-LABS-Claude-Code-Handover.md`

