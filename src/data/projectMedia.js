const image = (folder, name, alt) => ({ src: `/cases/${folder}/${name}.webp`, alt });
const series = (folder, count, label) => Array.from({ length: count }, (_, i) => image(folder, `image-${i + 1}`, `${label} — view ${i + 1}`));
// Slices carved from the tall full-page composites (see /showcase/opt/slices).
const slices = (name, count, label) =>
  Array.from({ length: count }, (_, i) => ({
    src: `/showcase/opt/slices/${name}-${i + 1}.webp`,
    alt: `${label} — section ${i + 1}`,
  }));

export const projectMedia = {
  pacifista: {
    cover: image('pacifista', 'cover', 'PACIFISTA — restored editorial archive'),
    gallery: series('pacifista', 3, 'PACIFISTA'),
    video: '/cases/pacifista/showcase.mp4',
  },
  'gsap-motion-vault': {
    cover: image('gsap-motion-vault', 'cover', 'GSAP Showroom — component gallery'),
    gallery: series('gsap-motion-vault', 5, 'GSAP Showroom'),
    video: '/cases/gsap-motion-vault/showcase.mp4',
  },
  'yoahorro-ia': {
    cover: image('yoahorro-ia', 'cover', 'YoAhorro IA — price intelligence interface'),
    gallery: series('yoahorro-ia', 5, 'YoAhorro IA'),
    video: '/cases/yoahorro-ia/showcase.mp4',
  },
  'synapsis-academy': {
    cover: image('synapsis-academy', 'cover', 'Synapsis Academy — learning platform'),
    gallery: series('synapsis-academy', 3, 'Synapsis Academy'),
    video: '/cases/synapsis-academy/showcase.mp4',
  },
  li4uid: {
    cover: { src: '/showcase/opt/liquid_new_landing_hero.webp', alt: 'Li4uid 2.0 — Digital Identity System' },
    gallery: slices('liquid', 4, 'Li4uid 2.0'),
    video: '/showcase/liquid_new_landing_showcase_90s_60fps.webm',
    videoLabel: 'Li4uid 2.0 — 90-second cinematic showcase',
  },
  'li4uid-core-web': {
    cover: { src: '/showcase/opt/liquid_new_landing_hero.webp', alt: 'Li4uid 2.0 — Digital Identity System' },
    gallery: slices('liquid', 4, 'Li4uid 2.0'),
    video: '/showcase/liquid_new_landing_showcase_90s_60fps.webm',
    videoLabel: 'Li4uid 2.0 — 90-second cinematic showcase',
  },
  'puente-de-equidad': {
    cover: image('puente-de-equidad', 'cover', 'Puente de Equidad — interactive simulation'),
    gallery: series('puente-de-equidad', 2, 'Puente de Equidad'),
  },
  'la-mar': {
    cover: { src: '/showcase/opt/mar_shop_hero.webp', alt: 'Mar Shop — Headless Web Catalog' },
    gallery: slices('mar_shop', 3, 'Mar Shop'),
    video: '/showcase/mar_shop_showcase_90s_60fps.webm',
    videoLabel: 'Mar Shop — 90-second interactive showcase',
  },
  'mar-shop': {
    cover: { src: '/showcase/opt/mar_shop_hero.webp', alt: 'Mar Shop — Headless Web Catalog' },
    gallery: slices('mar_shop', 3, 'Mar Shop'),
    video: '/showcase/mar_shop_showcase_90s_60fps.webm',
    videoLabel: 'Mar Shop — 90-second interactive showcase',
  },
  empanadas: {
    cover: { src: '/showcase/opt/empanadas_app_hero.webp', alt: 'Antojos La Boca — Interactive Gastronomy Interface' },
    gallery: slices('empanadas', 4, 'Antojos La Boca'),
    video: '/showcase/empanadas_app_showcase_90s_60fps.webm',
    videoLabel: 'Antojos La Boca — 90-second interactive showcase',
  },
  'el-susurro-del-tiempo': {
    cover: { src: '/showcase/opt/el_susurro_del_tiempo_hero.webp', alt: 'El Susurro del Tiempo — 3D Experience & Archive' },
    gallery: slices('susurro', 4, 'El Susurro del Tiempo'),
    video: '/showcase/el_susurro_del_tiempo_showcase_90s_60fps.webm',
    videoLabel: 'El Susurro del Tiempo — 90-second interactive reading',
  },
  'internal-r-and-d': {
    cover: { src: '/showcase/opt/portfolio_flh_hero.webp', alt: 'Felipe Londoño — Personal Portfolio' },
    gallery: slices('portfolio', 5, 'Felipe Londoño'),
    video: '/showcase/portfolio_flh_showcase_90s_60fps.webm',
    videoLabel: 'Felipe Londoño — 90-second portfolio showcase',
  },
  'portfolio-flh': {
    cover: { src: '/showcase/opt/portfolio_flh_hero.webp', alt: 'Felipe Londoño — Personal Portfolio' },
    gallery: slices('portfolio', 5, 'Felipe Londoño'),
    video: '/showcase/portfolio_flh_showcase_90s_60fps.webm',
    videoLabel: 'Felipe Londoño — 90-second portfolio showcase',
  },
  'yen-galindo-photography': {
    cover: {
      src: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=1600',
      alt: 'Yen Galindo Photography — editorial portrait',
    },
    gallery: [
      {
        src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1200',
        alt: 'Yen Galindo Photography — editorial fashion study',
      },
      {
        src: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=1200',
        alt: 'Yen Galindo Photography — analog portrait study',
      },
      {
        src: 'https://images.unsplash.com/photo-1496449903678-c8dd7459a12b?auto=format&fit=crop&q=80&w=1200',
        alt: 'Yen Galindo Photography — natural light portrait',
      },
      {
        src: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&q=80&w=1200',
        alt: 'Yen Galindo Photography — intimate portrait',
      },
      {
        src: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=1200',
        alt: 'Yen Galindo Photography — editorial texture and light',
      },
    ],
    video: '/showcase/yen_galindo_portfolio_showcase.webm',
    videoLabel: 'Yen Galindo Photography — portfolio reel',
  },
};
