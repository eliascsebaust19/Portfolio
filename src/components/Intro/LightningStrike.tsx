const bolts = {
  E: {
    x: 846,
    main: "M-98 -306L-56 -271L-78 -237L-25 -201L-44 -164L-7 -132L-24 -95L11 -70L-6 -36L0 0",
    branches: "M-25 -201L29 -184L49 -147L86 -138M-24 -95L-64 -75L-55 -48L-91 -21M11 -70L40 -50L26 -24L49 -9",
    color: "#71afff",
  },
  A: {
    x: 1045,
    main: "M127 -307L86 -279L103 -246L46 -214L60 -179L20 -158L38 -125L2 -92L21 -70L-9 -42L0 0",
    branches: "M46 -214L-3 -200L-18 -163L-57 -138M38 -125L76 -98L66 -66L102 -40M-9 -42L-45 -22L-51 14",
    color: "#9e9aff",
  },
};

export function LightningStrike({
  letter, travel, glow, impact, contentScale,
}: {
  letter: keyof typeof bolts;
  travel: number;
  glow: number;
  impact: number;
  contentScale: number;
}) {
  if (glow <= 0) return null;
  const bolt = bolts[letter];
  const x = 960 + (bolt.x - 960) * contentScale;
  const y = 518.4 + (317 - 518.4) * contentScale;
  const flash = travel === 1 ? glow * impact : 0;

  return (
    <svg
      aria-hidden="true"
      data-strike={letter}
      className="pointer-events-none absolute inset-0"
      width={1920}
      height={1080}
      style={{ overflow: "visible" }}
    >
      <g transform={`translate(${x} ${y}) scale(${contentScale})`}>
        <ellipse cy={-120} rx={105} ry={165} fill={bolt.color} opacity={glow * 0.12} style={{ filter: "blur(62px)" }} />
        <circle r={46} fill={bolt.color} opacity={flash * 0.55} style={{ filter: "blur(28px)" }} />
        <circle r={12} fill="#edf6ff" opacity={flash * 0.9} style={{ filter: "blur(5px)" }} />
        <g fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={glow}>
          <path
            d={bolt.main} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - travel}
            stroke={bolt.color} strokeWidth={19} style={{ filter: "blur(9px)" }}
          />
          <path
            d={bolt.branches} pathLength={1} strokeDasharray={1}
            strokeDashoffset={1 - Math.max(0, (travel - 0.28) / 0.72)}
            stroke={bolt.color} strokeWidth={2}
            style={{ filter: `drop-shadow(0 0 6px ${bolt.color})` }}
          />
          <path
            d={bolt.main} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - travel}
            stroke="#d4e7ff" strokeWidth={5} style={{ filter: `drop-shadow(0 0 5px ${bolt.color})` }}
          />
          <path
            d={bolt.main} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - travel}
            stroke="#fff" strokeWidth={1.7}
          />
        </g>
      </g>
    </svg>
  );
}
