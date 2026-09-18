# SIGIL LABS — Marketing & SEO Strategy

Roadmap de trabajo para `sigillabs.agency`.

## Estado actual

- [x] Google Search Console verificado con sitemap procesado y 17+ páginas descubiertas.
- [x] `robots.txt` publicado y validado en `https://www.sigillabs.agency/robots.txt`.
- [x] URLs limpias en `/work/[slug]` con redirecciones permanentes 308 desde `/sample-project?project=...`.
- [x] Metadata dinámica, Canonical URLs, Open Graph (1200x630) y Twitter Cards por proyecto.
- [x] JSON-LD `CreativeWork` en proyectos y `Service` en páginas de servicios.
- [x] JSON-LD `ProfessionalService` / `LocalBusiness` inyectado en `RootLayout` vinculando identidad NAP (Bogotá, teléfono, email, LinkedIn, servicios).
- [x] 3 páginas de servicios publicadas con Canvas 3D e integradas al sitemap (`creative-engineering`, `agentic-ai-systems`, `interactive-web-experiences`).
- [x] Ficha de **Google Business Profile** de SIGIL LABS creada con datos NAP (Bogotá, +57 333 4016876, `sigillabs.agency`) y verificada por Google.
- [x] Primera campaña de **Google Ads** configurada con cupón de $300 USD, sitelinks expandidos (Selected Work, Contact Us, Studio Details, Agentic AI Systems), long headline de marca y **pausada estratégicamente** para priorizar SEO orgánico inicial.
- [x] Capa de analítica Vercel Web Analytics (`@vercel/analytics/next`) integrada en `RootLayout`.
- [x] Capa de analítica Google Analytics 4 (`@next/third-parties/google`) integrada en `RootLayout` con soporte para `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
- [x] Canales oficiales consolidados: correo `sigillabsdevs@gmail.com` y LinkedIn de empresa `https://www.linkedin.com/company/sigil-labs/`.
- [x] Estrategia reorientada a los 4 pilares de SEO orgánico inicial (anclaje de entidad local, densidad semántica de casos de estudio, servicios faltantes y backlinks de autoridad).

## Prioridad 1 — Próxima sesión

### Search Console

- [ ] Revisar **Indexing → Pages**.
- [ ] Revisar páginas válidas, excluidas y errores.
- [ ] Inspeccionar Home, Work, PACIFISTA, Yen Galindo y Contact.
- [ ] Solicitar indexación si alguna página prioritaria no fue descubierta.
- [ ] Revisar Core Web Vitals cuando Google tenga datos.

### Rendimiento

- [ ] Ejecutar PageSpeed Insights en Home, Work y Yen.
- [ ] Medir LCP, INP y CLS.
- [ ] Identificar el elemento LCP real.
- [ ] Optimizar videos, fuentes e imágenes iniciales.
- [ ] Separar datos de laboratorio de datos reales de usuarios.

### Keywords

- [ ] Confirmar mercados: Colombia, Latinoamérica y operación global.
- [ ] Crear mapa keyword → página.
- [ ] Investigar intención para:
  - `creative engineering agency`
  - `AI systems agency`
  - `digital experience agency Colombia`
  - `GSAP development studio`
  - `immersive web design Bogotá`
  - `interactive website agency Colombia`
- [ ] No inventar volumen, dificultad, tráfico ni posiciones.

## Páginas de servicios

- [x] `/services/creative-engineering` — publicada y añadida al sitemap.
- [x] `/services/agentic-ai-systems` — publicada y añadida al sitemap.
- [x] `/services/interactive-web-experiences` — publicada y añadida al sitemap.
- [ ] `/services/motion-webgl`
- [ ] `/services/edtech-platforms`
- [x] Cada página publicada tiene H1 claro, metadata, CTA, JSON-LD `Service` y enlaces a casos relevantes.

## Casos de estudio

- [ ] Añadir problema, rol, proceso, stack y resultado a cada caso.
- [ ] Diferenciar clientes reales, R&D interno y colaboradores.
- [ ] Revisar consistencia entre H1, metadata, imagen y contenido visible.
- [ ] Enlazar servicios con casos de estudio relacionados.

## SEO local

- [x] Crear Google Business Profile — creado y verificado por Google.
- [x] Usar Bogotá como base real y operación global.
- [x] Mantener consistentes nombre (SIGIL LABS), teléfono (+57 333 4016876), ubicación y redes.
- [x] Completar verificación final de Google Business Profile — confirmada en Business Profile Manager.
- [ ] Conseguir menciones legítimas de Colombia/Bogotá.

## Marketing y autoridad

- [ ] Optimizar Instagram `@sigil.labs`.
- [x] Crear/optimizar LinkedIn de SIGIL LABS: `https://www.linkedin.com/company/sigil-labs/`.
- [ ] Añadir Behance y perfiles profesionales reales.
- [ ] Publicar casos de estudio en canales propios.
- [ ] Evitar compra de enlaces, spam y testimonios inventados.

## Imágenes y video

- [ ] Revisar `alt` de imágenes principales.
- [ ] Mantener portada social específica por proyecto.
- [ ] Optimizar posters y videos showcase.
- [ ] Verificar que los videos no bloqueen el LCP.
- [ ] Añadir metadata de video solo cuando el contenido sea estable y visible.

## Validaciones técnicas

- [x] Revisar `https://www.sigillabs.agency/robots.txt`.
- [x] Revisar `https://www.sigillabs.agency/sitemap.xml`; incluye las 3 páginas de servicios.
- [ ] Comprobar códigos `200` de páginas canónicas.
- [ ] Comprobar redirecciones `308` de URLs antiguas.
- [ ] Confirmar que no existan enlaces internos a `sample-project`.
- [ ] Validar JSON-LD con Rich Results Test.
- [ ] Mantener el sitemap limitado a URLs canónicas e indexables.

## Medición

- [ ] Revisar Search Console semanalmente durante el primer mes.
- [ ] Registrar impresiones, clics, CTR y consultas.
- [ ] Separar Web, imágenes, video y Discover.
- [ ] Registrar cada cambio SEO con fecha, URL y motivo.

## Expectativas

- Sitemap aceptado no garantiza indexación inmediata.
- JSON-LD válido no garantiza rich results.
- PageSpeed de laboratorio no equivale a Core Web Vitals reales.
- Solicitar indexación no garantiza posiciones.
- No prometer tráfico, rankings ni citas en AI Search.

## Definición de terminado

- Search Console procesa el sitemap.
- Las páginas prioritarias aparecen como válidas o rastreadas.
- No hay errores críticos de robots, canonical o redirects.
- Existe un mapa keyword → página.
- Hay al menos tres páginas de servicios útiles.
- Existe una medición base de rendimiento.
- Se mantiene una revisión SEO semanal.
