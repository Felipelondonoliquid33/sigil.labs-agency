/**
 * Buffers de las 4 formas del DAOISM 3D Journey.
 *
 * Cada partícula existe en las 4 formas a la vez (4 attributes) y el vertex
 * shader interpola entre ellas con `uMorph` (0..3):
 *
 *   0 · Mother Cube BaGua  → 1 · Tótem Voxel → 2 · Wireframe Cards → 3 · Orbe
 *
 * Todo es determinista (PRNG con semilla) para que el resultado sea idéntico
 * en cada carga y auditable frame a frame.
 */

const TAU = Math.PI * 2;

/** PRNG mulberry32 — determinista, rápido, sin dependencias. */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const lerp = (a, b, t) => a + (b - a) * t;

/** Cuantiza a una rejilla de `steps` divisiones — de ahí el look voxel. */
const quantize = (value, steps) => Math.round(value * steps) / steps;

/** Punto sobre la superficie de una caja centrada en el origen. */
function boxSurface(
  rnd,
  halfWidth,
  halfHeight,
  halfDepth,
  steps,
) {
  const face = Math.floor(rnd() * 6);
  const u = quantize(rnd() * 2 - 1, steps);
  const v = quantize(rnd() * 2 - 1, steps);

  switch (face) {
    case 0:
      return [halfWidth, u * halfHeight, v * halfDepth];
    case 1:
      return [-halfWidth, u * halfHeight, v * halfDepth];
    case 2:
      return [u * halfWidth, halfHeight, v * halfDepth];
    case 3:
      return [u * halfWidth, -halfHeight, v * halfDepth];
    case 4:
      return [u * halfWidth, v * halfHeight, halfDepth];
    default:
      return [u * halfWidth, v * halfHeight, -halfDepth];
  }
}

/** FORMA 0 — Mother Cube: rejilla voxel + 3 anillos octagonales BaGua. */
function motherCube(rnd) {
  if (rnd() < 0.34) {
    const ring = Math.floor(rnd() * 3);
    const radius = 3.15 + ring * 0.82;
    const segment = Math.floor(rnd() * 8);
    const t = rnd();

    // Trigramas: cada segmento se corta en dos trazos con un hueco central.
    const gapped = t < 0.42 ? t * 0.9 : 0.55 + (t - 0.42) * 0.78;

    const a0 = (segment / 8) * TAU;
    const a1 = ((segment + 1) / 8) * TAU;
    const x = lerp(Math.cos(a0), Math.cos(a1), gapped) * radius;
    const y = lerp(Math.sin(a0), Math.sin(a1), gapped) * radius;
    const z = (ring - 1) * 0.55 + (rnd() - 0.5) * 0.18;
    return [x, y, z];
  }

  return boxSurface(rnd, 2.5, 2.5, 2.5, 7);
}

/** FORMA 1 — Tótem voxel: 9 losas apiladas y ramificadas en vertical. */
function totem(rnd) {
  const level = Math.floor(rnd() * 9);
  const halfWidth = 0.5 + 1.75 * Math.abs(Math.sin(level * 1.7 + 0.6));
  const halfDepth = 0.45 + 1.15 * Math.abs(Math.cos(level * 1.1 + 0.25));
  const [x, y, z] = boxSurface(rnd, halfWidth, 0.42, halfDepth, 4);

  return [
    x + Math.sin(level * 2.1) * 0.72,
    y + (-5.4 + level * 1.34),
    z + Math.cos(level * 1.6) * 0.5,
  ];
}

/** FORMA 2 — Dos cards wireframe (XIILOO · NΛW) en el espacio Z. */
function cards(rnd) {
  const side = rnd() < 0.5 ? -1 : 1;
  const halfW = 1.68;
  const halfH = 1.06;

  let u = rnd() * 2 - 1;
  let v = rnd() * 2 - 1;
  // Rejilla: se cuantiza un eje u otro para dibujar líneas, no relleno.
  if (rnd() < 0.5) u = quantize(u, 6);
  else v = quantize(v, 4);

  const localX = u * halfW;
  const localY = v * halfH;
  const yaw = side * 0.3;

  return [
    side * 2.35 + localX * Math.cos(yaw),
    0.15 + localY,
    -0.5 - localX * Math.sin(yaw),
  ];
}

/** FORMA 3 — Orbe del Assistant: esfera + anillo ecuatorial. */
function orb(rnd) {
  if (rnd() < 0.17) {
    const angle = rnd() * TAU;
    const radius = 3.45;
    return [
      Math.cos(angle) * radius,
      (rnd() - 0.5) * 0.14,
      Math.sin(angle) * radius,
    ];
  }

  const u = rnd() * 2 - 1;
  const theta = rnd() * TAU;
  const radius = 2.2 * (0.93 + rnd() * 0.07);
  const ring = Math.sqrt(Math.max(0, 1 - u * u));

  return [radius * ring * Math.cos(theta), radius * u, radius * ring * Math.sin(theta)];
}



export function buildJourneyBuffers(count) {
  const cube = new Float32Array(count * 3);
  const totemBuffer = new Float32Array(count * 3);
  const cardsBuffer = new Float32Array(count * 3);
  const orbBuffer = new Float32Array(count * 3);
  const seed = new Float32Array(count);

  const rnd = mulberry32(0x114901d);

  for (let i = 0; i < count; i += 1) {
    const offset = i * 3;

    const a = motherCube(rnd);
    const b = totem(rnd);
    const c = cards(rnd);
    const d = orb(rnd);

    cube[offset] = a[0];
    cube[offset + 1] = a[1];
    cube[offset + 2] = a[2];

    totemBuffer[offset] = b[0];
    totemBuffer[offset + 1] = b[1];
    totemBuffer[offset + 2] = b[2];

    cardsBuffer[offset] = c[0];
    cardsBuffer[offset + 1] = c[1];
    cardsBuffer[offset + 2] = c[2];

    orbBuffer[offset] = d[0];
    orbBuffer[offset + 1] = d[1];
    orbBuffer[offset + 2] = d[2];

    seed[i] = rnd();
  }

  return { cube, totem: totemBuffer, cards: cardsBuffer, orb: orbBuffer, seed };
}


