import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { COLORS } from "./config";
import { SCENES, computeTimeline } from "./timeline";
import { SmokeLayer } from "./components/SmokeLayer";
import { SmokeOverlay } from "./components/SmokeOverlay";
import { Particles } from "./components/Particles";
import { Logo3D } from "./components/Logo3D";
import { Typography } from "./components/Typography";
import { BeamCore, Vignette } from "./components/Lighting";
import { FontLoader } from "./components/FontLoader";

const LOGO_CX = 960;
const LOGO_CY = 448;
const NAME_TOP = 698;

export const EALuxuryIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const tl = computeTimeline(frame);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black, filter: "contrast(1.06) saturate(0.9)" }}>
      <FontLoader />
      <Audio src={staticFile("audio/ea-intro.wav")} />

      {/* Scenes 1-6: continuous atmosphere (darkness -> smoke from the sides -> dissipates) */}
      <Sequence from={0} durationInFrames={360} name="Atmosphere">
        <SmokeLayer
          u={{
            t: tl.t, side: tl.side, gather: tl.gather, clear: tl.clear, dis: tl.dis,
            beam: tl.beam, amt: 1, seed: 0, ambient: tl.ambient, grain: 0.014,
          }}
        />
        <SmokeOverlay />
        <Particles t={tl.t} fade={tl.particles} beam={tl.beam} />
      </Sequence>

      {/* Scene 2: silver beam from behind */}
      <Sequence from={SCENES.formation.from} durationInFrames={270} name="Scene 2 - Beam">
        <BeamCore beam={tl.beam} />
      </Sequence>

      {/* Scenes 2-6: the monogram, grouped with the name so the exit scales both */}
      <AbsoluteFill style={{ transform: `scale(${tl.exitScale})` }}>
        <Sequence from={SCENES.formation.from} durationInFrames={300} name="EA Monogram">
          <Logo3D
            cx={LOGO_CX}
            cy={LOGO_CY}
            ry={tl.ry}
            rx={tl.rx}
            scale={tl.logoScale}
            blur={tl.logoBlur}
            opacity={tl.logoOpacity}
            sweepX={tl.sweepX}
            sweepGain={tl.sweepGain}
            bevelAz={tl.bevelAz}
            gradAngle={tl.gradAngle}
            gradShift={tl.gradShift}
          />
        </Sequence>

        {/* Scene 2-3: smoke in front of the silhouette, clearing as the logo reveals */}
        <Sequence from={SCENES.formation.from} durationInFrames={120} name="Scene 2 - Veil of smoke">
          <SmokeLayer
            u={{
              t: tl.t, side: 0.25, gather: 1, clear: 0, dis: 0,
              beam: 0, amt: tl.frontSmoke, seed: 7.3, ambient: 0, grain: 0,
            }}
          />
        </Sequence>

        {/* Scene 4-6: brand name */}
        <Sequence from={SCENES.name.from} durationInFrames={150} name="Scene 4 - Name">
          <Typography
            opacity={tl.nameOpacity}
            tracking={tl.tracking}
            y={tl.nameY}
            blur={tl.nameBlur}
            shine={tl.shine}
            accent={tl.accent}
            top={NAME_TOP}
          />
        </Sequence>
      </AbsoluteFill>

      <Vignette />

      {/* Scene 6: transition into darkness */}
      <Sequence from={SCENES.transition.from} durationInFrames={SCENES.transition.duration} name="Scene 6 - Transition">
        <AbsoluteFill style={{ backgroundColor: COLORS.black, opacity: tl.veil }} />
      </Sequence>
    </AbsoluteFill>
  );
};
