# Service pages — component reuse

This redesign adapts the owner's existing projects. Source projects are read-only; changes live in the agency.

| Source | Reuse in the agency |
| --- | --- |
| `New Portafolio Experience FLH/Portfolio new 2026/Source Code/Felipe Londoño/script/home.js` and `css/home.css` | Creative Engineering's project-card fan: opposing rotations, staggered spatial composition and scrubbed movement. Movement bounded to the hero. |
| FLH `script/project.js` and `css/project.css` | Selected-work horizontal snapshot rail. Rebuilt as a React-scoped GSAP timeline, measured from actual content, with transform-based progress and a vertical mobile/reduced-motion layout. |
| FLH `script/log01.js` | Agentic AI's SVG route drawing with content nodes. |
| `Gsap showroom library/Gsap showroom library/gsap-showroom/src/components/showcase/CardTriptychFlip.tsx` | CapabilityDeck's React state and Y-axis flip. Replaced demo letters with actual capabilities and deliverables, real front/back faces, accessible native buttons. |
| `lIQUID NEW LANDING/New landing 2.0/landing code 2/src/lib/daoism/shapes.ts` | Copied deterministic cube/totem/cards/orb buffers into `components/particleShapes.js`, removed TypeScript types and unused forest generation. |
| LI4UID `src/lib/daoism/shaders.ts` | Copied the particle vertex and fragment shaders into `components/particleShaders.js`. Replaced reversed smoothstep edges with defined ascending-edge expressions. |
| LI4UID `src/components/canvas/daoism-canvas.tsx` | Adapted scene lifecycle, morph uniforms and pointer-field integration into `SignalField.jsx`; limited to a section-sized monochrome canvas rather than the full multi-stage landing. |

## Page directions

- Creative Engineering: photographic fan, explanatory flip triptych, selected project rail.
- Agentic AI Systems: four user-selected particle forms, SVG workflow, selected project rail.
- Interactive Web Experiences: spatial project frames, interactive capability selector with particle transitions, selected project rail.
- Shared: editorial hierarchy, approach, four collaboration steps, contact and next-service links. All projects use the existing `projectMedia` sources.
- Existing root ReactLenis supplies smooth scrolling. Service animations subscribe through `useLenis`; no nested scroll engine.

## Runtime

Three.js is dynamically imported by SignalField. Rendering stops outside the viewport and when the document is hidden. Reduced motion renders a still scene and changes state immediately. A static agency sigil remains if WebGL cannot initialize. Observers, listeners, GSAP tweens, geometry, material and renderer are cleaned up on unmount.

Three.js lifecycle reference: https://threejs.org/docs/pages/WebGLRenderer.html

Build independently of dev: `SIGIL_BUILD_DIR=.next-production npm run build` (set the environment variable using the host shell). Do not build into the running dev server's `.next` directory.
