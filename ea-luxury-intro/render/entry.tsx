import React from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { FrameContext } from "./remotion-shim";
import { EALuxuryIntro } from "../src/EALuxuryIntro";

const root = createRoot(document.getElementById("app")!);
(window as any).renderFrame = (f: number) => {
  flushSync(() => {
    root.render(
      <FrameContext.Provider value={f}>
        <EALuxuryIntro />
      </FrameContext.Provider>,
    );
  });
};
(window as any).harnessReady = true;
