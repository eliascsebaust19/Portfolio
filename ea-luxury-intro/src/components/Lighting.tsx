import React from "react";
import { AbsoluteFill } from "remotion";

/** Crisp narrow silver beam core (the volumetric halo lives in the smoke shader). Tilted 12deg to match. */
export const BeamCore: React.FC<{ beam: number }> = ({ beam }) => (
  <div
    style={{
      position: "absolute",
      left: "50%",
      top: -120,
      width: 5,
      height: 1320,
      marginLeft: -2.5,
      transform: "rotate(12deg)",
      background:
        "linear-gradient(to bottom, rgba(220,228,240,0) 0%, rgba(220,228,240,0.85) 38%, rgba(220,228,240,0.85) 62%, rgba(220,228,240,0) 100%)",
      filter: "blur(3px)",
      opacity: beam * 0.34,
    }}
  />
);

/** Cinematic vignette + soft top/bottom falloff for contrast. */
export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse 75% 70% at 50% 48%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)",
      pointerEvents: "none",
    }}
  />
);
