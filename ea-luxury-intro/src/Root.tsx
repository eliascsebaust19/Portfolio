import React from "react";
import { Composition } from "remotion";
import { EALuxuryIntro } from "./EALuxuryIntro";
import { DURATION, FPS, HEIGHT, WIDTH } from "./config";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="EALuxuryIntro"
    component={EALuxuryIntro}
    durationInFrames={DURATION}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);
