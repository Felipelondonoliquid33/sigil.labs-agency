/**
 * GLSL del DAOISM 3D Journey.
 *
 * Todo el color entra por uniforms alimentados desde los tokens CSS
 * (`src/lib/daoism/tokens.ts`): ningún hex vive dentro del shader.
 */

/* ------------------------------------------------------------------
   1 · Partículas — morph `uMorph` 0→3 + repulsión gaussiana del puntero
   ------------------------------------------------------------------ */

export const PARTICLE_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uMorph;
  uniform float uPixelRatio;
  uniform float uSize;
  uniform vec3  uPointer;
  uniform float uPointerStrength;
  uniform float uTurbulence;

  attribute vec3  aTotem;
  attribute vec3  aCards;
  attribute vec3  aOrb;
  attribute float aSeed;

  varying float vSeed;
  varying float vFade;

  void main() {
    // --- Metamorfosis encadenada: cubo → tótem → cards → orbe
    vec3 p = position;
    p = mix(p, aTotem, clamp(uMorph,        0.0, 1.0));
    p = mix(p, aCards, clamp(uMorph - 1.0,  0.0, 1.0));
    p = mix(p, aOrb,   clamp(uMorph - 2.0,  0.0, 1.0));

    // --- Turbulencia: pico a mitad de cada transición, cero en reposo
    float phase = fract(uMorph);
    float burst = sin(3.14159265 * phase) * uTurbulence;
    p += vec3(
      sin(uTime * 0.90 + aSeed * 31.0),
      cos(uTime * 0.75 + aSeed * 23.0),
      sin(uTime * 0.60 + aSeed * 17.0)
    ) * burst * (0.45 + aSeed * 1.15);

    // --- Respiración idle (mantiene vivo el reposo sin coste)
    p += normalize(p + 0.0001) * sin(uTime * 0.7 + aSeed * 12.0) * 0.05;

    // --- Repulsión gaussiana radial desde el cursor (Stage 01)
    vec2  toPointer = p.xy - uPointer.xy;
    float dist      = length(toPointer);
    float gauss     = exp(-dist * dist / 5.0) * uPointerStrength;
    p.xy += normalize(toPointer + 0.0001) * gauss * 2.4;
    p.z  += gauss * 0.9;

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float depth = -mvPosition.z;
    gl_PointSize = uSize * uPixelRatio * (12.0 / max(depth, 0.1)) * (0.55 + aSeed * 0.9);

    vSeed = aSeed;
    vFade = (1.0 - smoothstep(6.0, 48.0, depth)) * smoothstep(0.15, 1.8, depth);
  }
`;

export const PARTICLE_FRAGMENT = /* glsl */ `
  uniform vec3  uColorA;
  uniform vec3  uColorB;
  uniform float uOpacity;

  varying float vSeed;
  varying float vFade;

  void main() {
    vec2  coord = gl_PointCoord - 0.5;
    float d2    = dot(coord, coord);
    if (d2 > 0.25) discard;

    float alpha = (1.0 - smoothstep(0.0, 0.25, d2));
    vec3  color = mix(uColorA, uColorB, smoothstep(0.15, 0.9, vSeed));

    gl_FragColor = vec4(color, alpha * vFade * uOpacity);
  }
`;

/* ------------------------------------------------------------------
   2 · Carrusel 3D — mesh warp por velocidad + rejilla wireframe
   ------------------------------------------------------------------ */


