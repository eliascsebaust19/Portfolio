import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";
import { SMOKE_OVERLAY } from "../config";

/** Optional replaceable transparent smoke footage (see config.ts). Renders nothing when unset. */
export const SmokeOverlay: React.FC<{ opacity?: number }> = ({ opacity = 0.6 }) => {
  if (!SMOKE_OVERLAY) return null;
  return (
    <AbsoluteFill style={{ mixBlendMode: "screen", opacity }}>
      <OffthreadVideo src={staticFile(SMOKE_OVERLAY)} transparent muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
  );
};
