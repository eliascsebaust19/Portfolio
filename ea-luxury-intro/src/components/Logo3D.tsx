import React from "react";
import { EA_D, LOGO_VIEWBOX } from "../logoPaths";

const BOX_W = 420;
const BOX_H = 320;
const LAYERS = 24;
const STEP = 1.45; // px between extrusion layers
const DEPTH = LAYERS * STEP;

export type LogoProps = {
  ry: number;
  rx: number;
  scale: number;
  blur: number;
  opacity: number;
  sweepX: number;
  sweepGain: number;
  bevelAz: number;
  gradAngle: number;
  gradShift: number;
  cx: number;
  cy: number;
};

const shade = (i: number) => {
  const k = i / (LAYERS - 1);
  const l = k < 0.15 ? 205 - k * 560 : k < 0.5 ? 121 - (k - 0.15) * 197 : 52 - (k - 0.5) * 60;
  const crimson = Math.max(0, (k - 0.82) / 0.18);
  const r = Math.round(l + crimson * 42);
  const g = Math.round(l * (1 - crimson * 0.62));
  const b = Math.round(l * (1 - crimson * 0.55) + 4);
  return `rgb(${r},${g},${b})`;
};

const layerStyle = (z: number): React.CSSProperties => ({
  position: "absolute",
  inset: 0,
  transform: `translateZ(${z}px)`,
  overflow: "visible",
});

/** Premium chrome monogram: stacked-layer extrusion in real CSS 3D, bevel lighting, reflections, light sweep. */
export const Logo3D: React.FC<LogoProps> = (p) => {
  const rad = (p.gradAngle * Math.PI) / 180;
  const L = 200;
  const gcx = 165 + p.gradShift;
  const gcy = 120;
  const gx1 = gcx - Math.cos(rad) * L * 0.5;
  const gy1 = gcy - Math.sin(rad) * L;
  const gx2 = gcx + Math.cos(rad) * L * 0.5;
  const gy2 = gcy + Math.sin(rad) * L;

  return (
    <div
      style={{
        position: "absolute",
        left: p.cx - BOX_W / 2,
        top: p.cy - BOX_H / 2,
        width: BOX_W,
        height: BOX_H,
        perspective: 1600,
        opacity: p.opacity,
        filter: `blur(${p.blur}px) drop-shadow(0 0 14px rgba(190,200,215,0.16))`,
      }}
    >
      {/* shared defs */}
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="eaChrome" gradientUnits="userSpaceOnUse" x1={gx1} y1={gy1} x2={gx2} y2={gy2}>
            <stop offset="0" stopColor="#f7f9fc" />
            <stop offset="0.14" stopColor="#aeb4bd" />
            <stop offset="0.3" stopColor="#4a4e55" />
            <stop offset="0.46" stopColor="#1b1d21" />
            <stop offset="0.5" stopColor="#e6e9ee" />
            <stop offset="0.56" stopColor="#8b9199" />
            <stop offset="0.72" stopColor="#3a3d43" />
            <stop offset="0.88" stopColor="#c9cdd3" />
            <stop offset="1" stopColor="#7c8189" />
          </linearGradient>
          <linearGradient
            id="eaSweep"
            gradientUnits="userSpaceOnUse"
            x1={-60}
            y1={0}
            x2={60}
            y2={-30}
            gradientTransform={`translate(${p.sweepX} 120)`}
          >
            <stop offset="0" stopColor="#ffffff" stopOpacity={0} />
            <stop offset="0.5" stopColor="#ffffff" stopOpacity={0.92} />
            <stop offset="1" stopColor="#ffffff" stopOpacity={0} />
          </linearGradient>
          <filter id="eaBevel" x="-8%" y="-8%" width="116%" height="116%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3.2" result="b" />
            <feSpecularLighting in="b" surfaceScale="7" specularConstant="1.1" specularExponent="22" lightingColor="#ffffff" result="spec">
              <feDistantLight azimuth={p.bevelAz} elevation={38} />
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceAlpha" operator="in" result="specIn" />
            <feComposite in="SourceGraphic" in2="specIn" operator="arithmetic" k1={0} k2={1} k3={0.85} k4={0} />
          </filter>
          <filter id="eaRim" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>
      </svg>

      <div
        style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
          transform: `rotateX(${p.rx}deg) rotateY(${p.ry}deg) scale(${p.scale})`,
        }}
      >
        {/* crimson rim light behind the form */}
        <svg viewBox={LOGO_VIEWBOX} style={{ ...layerStyle(-DEPTH / 2 - 5), transform: `translateZ(${-DEPTH / 2 - 5}px) translate(5px, 2px)` }}>
          <path d={EA_D} fill="#8a0e1d" fillRule="evenodd" filter="url(#eaRim)" opacity={0.5} />
        </svg>

        {/* extrusion layers, back to front */}
        {Array.from({ length: LAYERS - 1 }, (_, n) => {
          const i = LAYERS - 1 - n; // i = LAYERS-1 (back) ... 1
          return (
            <svg key={i} viewBox={LOGO_VIEWBOX} style={layerStyle(DEPTH / 2 - i * STEP)}>
              <path d={EA_D} fill={shade(i)} fillRule="evenodd" />
            </svg>
          );
        })}

        {/* chrome front face */}
        <svg viewBox={LOGO_VIEWBOX} style={layerStyle(DEPTH / 2)}>
          <g filter="url(#eaBevel)">
            <path d={EA_D} fill="url(#eaChrome)" fillRule="evenodd" />
          </g>
          <path d={EA_D} fill="none" stroke="rgba(238,242,249,0.92)" strokeWidth={1.4} strokeLinejoin="round" fillRule="evenodd" />
          <path d={EA_D} fill="url(#eaSweep)" fillRule="evenodd" opacity={p.sweepGain} />
        </svg>
      </div>
    </div>
  );
};
