# SIGIL LABS — continuidad, 8 septiembre 2026

## Proyecto y contexto recuperado
- Aplicación: `CGMWTOCT2025/CGMWTOCT2025/polite-chaos` (Next.js App Router, React 19, GSAP).
- Vista: http://127.0.0.1:3000/stories?mobile-check=2
- Sesión anterior: `C:\Users\rapma\Downloads\ejecutar-proyecto-y-recuperar-pendientes-seo.json` (OpenCode / Kimi).
- La última petición conserva el concepto editorial del carrusel de servicios, pero rechaza las figuras geométricas y los fondos de colores. Pide tres sigilos emparentados con el logo real y transformaciones elegantes entre tarjetas.
- El SVG original está en `sigil_logo.svg`; su versión React es `src/components/SolomonicCircuit.jsx`.

## Implementación actual
- `StorySlides.jsx` ya tenía cambios sin commit al iniciar esta sesión: tres SVG independientes, con estilos y animaciones anteriores aún pendientes de ajustar.
- `LiveSigil.jsx` mantiene un único SVG. El primer estado reproduce la geometría del logo; los siguientes reinterpretan sus antenas, alas, conexiones y núcleo para AI y experiencias web.
- GSAP interpola las coordenadas de curvas cúbicas compatibles, nodos y radio del núcleo durante 3.2 segundos con sine.inOut. El círculo exterior y el eje central permanecen estables. Los cambios rápidos parten de la geometría actual.
- Actualización solicitada: sigilo negro sobre fondo transparente, integrado en la composición editorial clara, sin panel negro ni marcas de esquina. Morph alargado a 3.2 segundos para apreciar mejor la transformación.
- Navegación manual, reproducción automática y pausa. Navegar manualmente detiene el avance automático. Reduced motion desactiva el avance y aplica los cambios SVG inmediatamente.
- Corregida la herencia de width/padding del nav global sobre los controles del carrusel y separado el encabezado del menú.

## Verificación y entorno
- `npm run build` pasó: 27 páginas generadas.
- `check-live-sigils.cjs` en la raíz comprueba geometría intermedia real, tres estados, navegación rápida, anchuras 390/320 px, reduced motion y ausencia de errores de ejecución.
- Capturas `sigil-*-review.png` y `sigil-mobile-*.png` en la raíz.
- Se reinició el servidor del puerto 3000 tras un conflicto de caché entre build y dev. Logs en `sigil-dev.log` y `sigil-dev-error.log`.
- No se ha hecho commit, push ni deploy en esta sesión. La apreciación estética final corresponde al usuario.
- Evitar ejecutar build mientras dev usa el mismo directorio `.next`; detener/reiniciar dev o usar una salida separada.

---

# SIGIL LABS — continuidad, 11 septiembre 2026

## Hitos de SEO, Presencia Digital & Analítica
- **Google Search Console:** Verificado exitosamente con `sitemap.xml` dinámico aceptado (17+ URLs descubiertas y rastreadas).
- **Google Business Profile:** Ficha de SIGIL LABS / Sigil Labs Agency creada con datos NAP consistentes (Bogotá, +57 333 4016876, `https://www.sigillabs.agency`, `sigillabsdevs@gmail.com`, LinkedIn: `https://www.linkedin.com/company/sigil-labs/`). Actualmente verificada por Google; estado confirmado mediante revisión read-only en Business Profile Manager.
- **Google Ads:** Primera campaña configurada con cupón de $300 USD de crédito. Sitelinks expandidos con descripciones de 35 caracteres (*Selected Work*, *Contact Us*, *Studio Details*, *Agentic AI Systems*) y titulares largos de marca. **Pausada estratégicamente** para no gastar a ciegas y volcar los esfuerzos a SEO orgánico inicial.
- **Analítica Web:**
  - Vercel Web Analytics (`@vercel/analytics/next`) integrado en `src/app/layout.js`.
  - Google Analytics 4 (`@next/third-parties/google`) integrado en `layout.js` con activación condicional mediante `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
- **Hoja de Ruta Orgánica Inicial Activa:**
  1. Inyección de Schema JSON-LD `LocalBusiness` / `ProfessionalService` en la web.
  2. Densidad semántica (Reto / Stack / Resultados) en los 12 casos de estudio (`/work/[slug]`).
  3. Publicación de páginas de servicios pendientes (`motion-webgl` y `edtech-platforms`).
  4. Primeras reseñas en Google Maps y backlinks de alta autoridad (directorios de diseño).

---

# SIGIL LABS — continuidad, 18 septiembre 2026

## Identidad oficial (corregida)
- **Correo oficial: `sigillabsdevs@gmail.com`** — con "devs", NO "dvs", NO `sigillabs@gmail.com`.
- Aparece en `src/app/layout.js` (JSON-LD), `src/app/contact/page.jsx` y `src/components/Menu/Menu.jsx`.
- Cuenta Google de Ads + Analytics: `londonof@gmail.com`.

## Commits de esta sesión (todos en `origin/main`)
| Commit | Qué hizo |
|---|---|
| `11ec8b0` | Unificar correo oficial a `sigillabsdevs@gmail.com` (código + docs) |
| `0298915` | Desactivar link externo de PACIFISTA hasta el relanzamiento |
| `e109ccd` | Tracking GA4 `contact_click` (email / phone / whatsapp) |
| `9e83427` | WhatsApp abre Web directo + fallback `dataLayer` |
| `199a5a5` | **Fix crítico**: `transport_type: "beacon"` en el tracking |

## PACIFISTA — link desactivado
- `src/data/projectDetails.js`: `externalUrl` y `externalLabel` comentados.
- Los puntos de render son condicionales (`project.externalUrl ? ...`) en `src/app/sample-project/project-page.jsx` (~líneas 341 y 408).
- **Para reactivar:** descomentar esas 2 líneas. No hay que tocar el JSX.

## WhatsApp
- Antes: `https://wa.me/573334016876` → mostraba selector de aplicaciones.
- Ahora: `https://web.whatsapp.com/send?phone=573334016876` → abre WhatsApp Web directo.
- Aplicado en `src/app/contact/page.jsx` y `src/components/Menu/Menu.jsx`.

## Tracking de conversiones — causa raíz documentada

### Síntoma
GA4 mostraba `page_view`, `first_visit`, `session_start`, `click`, `scroll`, `user_engagement`, pero **nunca `contact_click`** — ni en Realtime ni en Events hub.

### Diagnóstico
Se interceptó con Playwright el POST real a `google-analytics.com/g/collect`. El body **sí** contenía:
```
en=page_view&_ee=1
en=contact_click&_ee=1&ep.contact_method=email&_et=4
```
El código era correcto: el evento se enviaba al measurement ID `G-W56M3FGSX8`.

### Causa raíz
El clic navega a `mailto:` / `tel:`. Esa navegación **aborta la petición GA4 en vuelo** (`net::ERR_ABORTED`). `page_view` se envía al cargar la página y sobrevive; `contact_click` se envía al hacer clic y se pierde.

### Solución
`transport_type: "beacon"` en `src/lib/analytics.js`. Eso hace que gtag use `navigator.sendBeacon`, que sobrevive a la navegación.

### Verificación pendiente
1. `https://www.sigillabs.agency/contact` → `Ctrl + F5` → clic en el correo.
2. GA4 → **Admin → DebugView** → debe aparecer `contact_click` con `contact_method = email`.
3. Marcar como **evento clave** (Admin → Events → estrella).
4. Importar a Google Ads (Metas → Conversiones → Importar → GA4).

**Regla:** no activar campañas hasta completar el paso 4.

## Google Ads — estado y acceso

### Cuenta
- Customer ID activo: **`3146500144`** — "Sigil Labs Agency", COP, America/Bogota.
- Cuenta `9913912325` existe pero está deshabilitada.
- Campañas: solo `Campaign #1` (id `24248145520`), Performance Max, estado **REMOVED**, presupuesto ~2000 COP.
- Conversiones configuradas: solo `Calls from ads` (AD_CALL / PHONE_CALL_LEAD).

### Acceso API configurado
- Proyecto GCP: **`sigil-labs-analytics-2026`** con **Explorer access**.
- OAuth Client tipo Desktop (guardado en Descargas del usuario).
- ADC en `%APPDATA%\gcloud\application_default_credentials.json` con refresh token y quota project.
- `gcloud` v585.0.0 en `C:\Users\rapma\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin`.

### Errores resueltos (para no repetirlos)
1. **"the app is blocked"** al hacer login ADC: Google deprecó el scope `adwords` en el client ID por defecto de gcloud. Solución: usar un OAuth Client propio tipo Desktop con `--client-id-file`.
2. **`set-quota-project` fallaba** con "cloudresourcemanager.googleapis.com not enabled": estaba usando el proyecto numérico `923304213393` del OAuth client. Solución: `gcloud auth login` (el login ADC **no** equivale al login CLI) y luego habilitar la API en `sigil-labs-analytics-2026`.
3. **API Center ya no sirve** para solicitar acceso: Google sunset los developer tokens el **2026-09-09**. Ahora todo se gestiona en `console.cloud.google.com/google/ads-apis/overview`.

### MCP de Google Ads
- `google-ads-mcp` v0.0.3 registrado en `%APPDATA%\Code\User\mcp.json` (uvx/stdio).
- **Es de SOLO LECTURA**: expone únicamente `list_accessible_customers`, `get_resource_metadata` y `search` (GAQL).
- **No puede** pausar, activar campañas ni cambiar presupuestos. Eso se hace en la interfaz de Google Ads.

### Gotchas de GAQL
- `campaign.budget_amount_micros` **no existe**. Usar el recurso `campaign_budget` con `campaign_budget.amount_micros`.
- `DURING LAST_365_DAYS` es inválido. Usar `LAST_30_DAYS`, `LAST_90_DAYS` o `LAST_14_DAYS`.

### Consulta rápida desde terminal
```powershell
$env:GOOGLE_CLOUD_PROJECT = "sigil-labs-analytics-2026"
uvx --from google-ads-mcp python -c "from ads_mcp.tools.search import search; import json; print(json.dumps(search('3146500144',['campaign.id','campaign.name','campaign.status'],'campaign'), indent=2))"
```

## Estrategia de posicionamiento — Colombia (entregada, pendiente de ejecutar)
1. **Anclar entidad local**: publicar semanalmente en Google Business Profile, fotos reales, primeras reseñas de clientes reales.
2. **Definir categoría propia**: no competir por "diseño web". Poseer "creative engineering", "agentic AI systems", "interactive web experiences".
3. **PACIFISTA como activo de PR**: 4.229 publicaciones y 10.436 imágenes restauradas es una historia periodística, no un portafolio. Pitchear a medios, universidades y archivos digitales.
4. **Autoridad local real**: comunidad GSAP/WebGL/Dev de Bogotá, universidades, coworkings, alianzas con agencias complementarias, LinkedIn (empresa + marca personal).
5. **Contenido con prueba**: estructura Reto → Stack → Resultado en los 12 casos.

## Recomendación de inversión en Ads
- **No activar campaña amplia todavía.**
- Primero: confirmar `contact_click` → marcarlo como evento clave → importarlo a Ads.
- Luego: campaña pequeña con defensa de marca (`sigil labs`, `sigil labs agency`) + intención exacta (`creative engineering agency`, `agencia desarrollo web interactivo Bogotá`).
- No escalar hasta tener 15–30 conversiones al mes.

## Notas operativas
- El repo contiene `.next`, `.next-production` y `.next-security` con builds obsoletos que aún incluyen el correo antiguo. **Ignorarlos** al buscar strings.
- `git push` a veces queda en background en esta terminal. Verificar con `git status --porcelain=v1 --branch` y `git ls-remote origin refs/heads/main`. Si no sube, usar el MCP de GitKraken.
- No ejecutar `npm run build` mientras `npm run dev` usa el mismo directorio `.next`.
