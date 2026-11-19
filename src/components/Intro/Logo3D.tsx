import React from "react";
import { A_HOLE, A_OUTER, E_D, LOGO_VIEWBOX } from "./logoPaths";

const BOX_W = 420;
const BOX_H = 320;
const LAYERS = 12;
const STEP = 2.9; // px between extrusion layers
const DEPTH = LAYERS * STEP;

export type LogoProps = {
  ry: number;
  rx: number;
  scale: number;
  e: number;
  a: number;
  eFlash: number;
  aFlash: number;
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
  const l =
    k < 0.15 ? 205 - k * 560 : k < 0.5 ? 121 - (k - 0.15) * 197 : 52 - (k - 0.5) * 60;
  const crimson = Math.max(0, (k - 0.82) / 0.18);
  const r = Math.round(l + crimson * 42);
  const g = Math.round(l * (1 - crimson * 0.62));
  const b = Math.round(l * (1 - crimson * 0.55) + 4);
  return `rgb(${r},${g},${b})`;
};

const layerStyle = (z: number): React.CSSProperties => ({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  transform: `translateZ(${z}px)`,
  overflow: "visible",
});

function LogoLetters({
  e, a, mark = false, ...style
}: Pick<LogoProps, "e" | "a"> & React.SVGProps<SVGPathElement> & { mark?: boolean }) {
  return (
    <>
      <path {...style} d={E_D} opacity={e} data-ea-letter={mark ? "E" : undefined} />
      <path {...style} d={`${A_OUTER}${A_HOLE}`} opacity={a} data-ea-letter={mark ? "A" : undefined} />
    </>
  );
}

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
        filter: "drop-shadow(0 0 14px rgba(190,200,215,0.16))",
      }}
    >
      {/* shared defs */}
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <defs>
          <linearGradient
            id="eaChrome"
            gradientUnits="userSpaceOnUse"
            x1={gx1}
            y1={gy1}
            x2={gx2}
            y2={gy2}
          >
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
            <feSpecularLighting
              in="b"
              surfaceScale="7"
              specularConstant="1.1"
              specularExponent="22"
              lightingColor="#ffffff"
              result="spec"
            >
              <feDistantLight azimuth={p.bevelAz} elevation={38} />
            </feSpecularLighting>
            <feComposite
              in="spec"
              in2="SourceAlpha"
              operator="in"
              result="specIn"
            />
            <feComposite
              in="SourceGraphic"
              in2="specIn"
              operator="arithmetic"
              k1={0}
              k2={1}
              k3={0.85}
              k4={0}
            />
          </filter>
        </defs>
      </svg>

      {/* 3D stage */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
          transform: `scale(${p.scale}) rotateX(${p.rx}deg) rotateY(${p.ry}deg)`,
        }}
      >
        {/* Soft shadow at the back */}
        <svg
          viewBox={LOGO_VIEWBOX}
          style={{
            ...layerStyle(-DEPTH - 18),
            filter: "blur(18px)",
            opacity: 0.55,
          }}
        >
          <LogoLetters e={p.e} a={p.a} fill="#000000" fillRule="evenodd" />
        </svg>

        {/* Extruded sides */}
        {Array.from({ length: LAYERS - 1 }, (_, i) => {
          const z = -(i + 1) * STEP;
          return (
            <svg key={i} viewBox={LOGO_VIEWBOX} style={layerStyle(z)}>
              <LogoLetters e={p.e} a={p.a} fill={shade(i + 1)} fillRule="evenodd" />
            </svg>
          );
        })}

        {/* Front cap */}
        <svg
          viewBox={LOGO_VIEWBOX}
          style={{ ...layerStyle(0), filter: "url(#eaBevel)" }}
        >
          <LogoLetters e={p.e} a={p.a} mark fill="url(#eaChrome)" fillRule="evenodd" />
        </svg>

        {/* Front light sweep */}
        <svg
          viewBox={LOGO_VIEWBOX}
          style={{
            ...layerStyle(0.6),
            mixBlendMode: "color-dodge",
            opacity: p.sweepGain,
          }}
        >
          <LogoLetters e={p.e} a={p.a} fill="url(#eaSweep)" fillRule="evenodd" />
        </svg>

        {/* Each bolt briefly lights only the letter it strikes. */}
        <svg viewBox={LOGO_VIEWBOX} style={layerStyle(0.7)}>
          <LogoLetters
            e={p.eFlash}
            a={p.aFlash}
            fill="#c4dcff"
            fillRule="evenodd"
            stroke="#f2f8ff"
            strokeWidth={1.1}
          />
        </svg>

        {/* Rim specular highlight */}
        <svg
          viewBox={LOGO_VIEWBOX}
          style={{
            ...layerStyle(0.8),
            mixBlendMode: "screen",
            opacity: 0.65,
          }}
        >
          <LogoLetters
            e={p.e}
            a={p.a}
            fill="none"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth={1.2}
            fillRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
};
