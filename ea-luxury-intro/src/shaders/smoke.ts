export const SMOKE_VERT = `
attribute vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }
`;

// Domain-warped fBm volumetric smoke. Fully deterministic: a pure function of uniforms.
export const SMOKE_FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uT, uSide, uGather, uClear, uDis, uBeam, uAmt, uSeed, uAmbient, uGrain;

float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++){ v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}

float field(vec2 pp, float t, float seed, out float qx){
  vec2 q = vec2(fbm(pp * 1.4 + vec2(0.0, -t * 1.2) + seed),
                fbm(pp * 1.4 + vec2(5.2, 1.3) + vec2(t, 0.0) + seed));
  vec2 r = vec2(fbm(pp * 1.9 + 1.7 * q + vec2(1.7, 9.2) + t * 0.8),
                fbm(pp * 1.9 + 1.7 * q + vec2(8.3, 2.8) - t * 0.6));
  qx = q.x;
  return fbm(pp * 1.6 + 1.6 * r + vec2(0.0, -t * 0.5));
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (uv - 0.5) * vec2(uRes.x / uRes.y, 1.0);
  float t = uT * 0.09;

  // smoke slides in from both sides; each bank is its own noise field, blended across the middle
  float w = smoothstep(-0.12, 0.12, p.x);           // 1 on the right bank
  float inflow = (1.0 - uSide) * 0.9;
  float fA = 0.0, fB = 0.0, qA = 0.0, qB = 0.0;
  if (w > 0.001) fA = field(vec2(p.x - inflow, p.y), t, uSeed, qA);
  if (w < 0.999) fB = field(vec2(p.x + inflow, p.y) + vec2(7.3, 0.41), t, uSeed + 3.1, qB);
  float f = mix(fB, fA, w);
  float qx = mix(qB, qA, w);
  float dens = smoothstep(0.30, 0.95, f);
  dens = dens * (0.55 + 0.45 * dens);

  // masks: edges, centre gathering, clearing behind/around the logo, dissipation
  float sideM = smoothstep(0.1, 0.95, abs(p.x)) * uSide;
  vec2 cq = p * vec2(0.85, 1.25);
  float cen = exp(-dot(cq, cq) * 2.4) * uGather;
  dens = mix(dens, smoothstep(0.12, 0.7, f), clamp(cen, 0.0, 1.0));
  vec2 h = p / vec2(0.50, 0.34);
  float hole = 1.0 - uClear * 0.72 * exp(-dot(h, h) * 1.2);
  float low = smoothstep(0.1, -0.5, p.y) * 0.25 * uSide;
  float mask = (clamp(sideM * 0.9 + cen, 0.0, 1.3) + low) * hole * (1.0 - 0.9 * uDis);

  // narrow silver beam from behind, tilted 12 degrees
  float a = 0.2094;
  vec2 pr = vec2(p.x * cos(a) - p.y * sin(a), p.x * sin(a) + p.y * cos(a));
  float beamCore = exp(-pr.x * pr.x * 1400.0);
  float beamHalo = exp(-pr.x * pr.x * 55.0);
  float beamEnd = smoothstep(0.62, 0.18, abs(pr.y));
  float beam = uBeam * beamEnd;

  vec3 smokeCol = mix(vec3(0.10, 0.105, 0.115), vec3(0.52, 0.54, 0.58), f);
  vec3 col = smokeCol * dens * mask * uAmt * 0.78;
  col += vec3(0.78, 0.82, 0.90) * beam * (beamHalo * (0.07 + 0.85 * dens * mask) + beamCore * 0.08);
  col += vec3(0.55, 0.04, 0.07) * pow(qx, 4.0) * dens * mask * 0.22 * uAmt; // faint crimson rim
  col += vec3(0.70, 0.72, 0.78) * exp(-dot(p, p) * 3.2) * uAmbient * 0.05;

  col = 1.0 - exp(-col * 1.3);
  float g = hash(gl_FragCoord.xy + fract(uT * 7.13) * 100.0) - 0.5;
  col += g * uGrain;
  vec3 c = max(col, 0.0);
  gl_FragColor = vec4(c, max(c.r, max(c.g, c.b))); // premultiplied alpha: additive over black, veils what is behind it
}
`;
