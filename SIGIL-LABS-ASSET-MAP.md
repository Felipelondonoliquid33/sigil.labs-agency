# SIGIL LABS — Project media map

Updated 2026-09-06. Project assets are authorized for integration. Only general
template illustrations, team portraits and unrelated placeholders await manual
curation. Earlier notes putting ALL media on hold are superseded by this distinction.
No source assets or original template media were deleted.

## Implemented presentation

Home retains six Featured Work cards. Work exposes all eleven case entries through
the original animated folder pattern. Shared detail route:
`/sample-project?project=<id>`. PACIFISTA and GSAP are priority cases, not the
exclusive portfolio. The personal site is Internal R&D, not a commissioned client case.

| Case ID | Material connected | Outstanding material |
| --- | --- | --- |
| pacifista | Four showcase frames and complete reel | Replace placeholder closing credit before public launch |
| gsap-motion-vault | Cover, five captures, showcase | Optional refreshed recording; preserve derivative-library provenance |
| yoahorro-ia | Cover, five captures, showcase | Further editorial curation |
| synapsis-academy | Cover, three captures, showcase | Further editorial curation |
| li4uid | Earlier identity cover, five captures, original reel | Historical edition, not the new landing |
| puente-de-equidad | Cover and two captures | Optional interaction walkthrough |
| la-mar | Three original product photographs | Website walkthrough, not just product imagery |
| empanadas | Three original brand illustrations | Website screenshots and recording |
| el-susurro-del-tiempo | Reading poster/video, desk scene, book cover | Site/reader walkthrough; reading video is not a site reel |
| li4uid-core-web | Actual new landing screenshot | Clean production capture without dev indicator and new reel |
| internal-r-and-d | Personal portfolio identity mark | Full site screenshot and interaction reel |

Current import: **46 files, approximately 115.4 MB**, including six videos.
Images are WebP derivatives; videos load on demand with native controls, no autoplay.
`src/data/projectMedia.js` defines frontend references.
`scripts/import-project-media.cjs` copies selected derivatives without overwriting.
Exact source/target paths are recorded in `.sigil-review/asset-import.json`.

## Source locations

- Portfolio: `C:/Users/Felipe/Documents/WEB PROJECTS/New Portafolio Experience FLH/Portfolio new 2026/Source Code/Felipe Londoño/public`
- PACIFISTA: `C:/Users/Felipe/Downloads/PACIFISTA-portfolio-showcase.zip` (presentation, not site source)
- GSAP narrative: `C:/Users/Felipe/Documents/WEB PROJECTS/Gsap showroom library/Gsap showroom library/gsap-showroom/positioning-and-marketing`
- LA MAR: `C:/Users/Felipe/Documents/WEB PROJECTS/proyecto Mar Shop`
- Empanadas: `C:/Users/Felipe/Documents/WEB PROJECTS/Empanadas/app/public/images`
- El Susurro: `C:/Users/Felipe/Documents/WEB PROJECTS/El susurro del tiempo Landing/public/assets`
- New Li4uid: `C:/Users/Felipe/Documents/WEB PROJECTS/lIQUID  NEW LANDING/New landing 2.0/Landing Code`; screenshot in parent directory

## Protected template

Original files under featured-work, work, stories, spotlight, objects and team-cards
remain on disk. Featured Work, Work previews, Stories and preloader reference actual
project media. General Spotlight/Showreel/Team imagery remains for manual curation;
no generated replacements yet.

English website copy, `[ INICIAR PROTOCOLO ]`, `People Approved` and
SolomonicCircuit remain. Existing GSAP/ScrollTrigger/Lenis/Copy timelines, durations
and easing are preserved. Navigation wiring was corrected so Story links follow
the visible case and query changes refresh project details. Work repeats the
original folder pattern for the full catalog.

## Verification

- Production build passes with explicit project tracing root. Use
  `SIGIL_BUILD_DIR=.next-production` for isolated production output.
- `scripts/verify-projects.cjs`: all eleven case titles/media, six video metadata
  loads, next-project and Story navigation, folder hover, People Approved, six
  featured cards and representative mobile overflow checks pass; no page errors.
- Results: `.sigil-review/verification.json`; desktop/mobile screenshots alongside.
  This is not comprehensive cross-device certification.
- Preview: http://localhost:3001/work. No public deployment performed.

## Next curation

Manual general-image selection; missing original project recordings; PACIFISTA
closing credit correction; final responsive and media polish. Do not treat product
photography, illustrations or an identity mark as completed website screenshots.
