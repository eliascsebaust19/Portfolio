import { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";

/** Loads the bundled Montserrat locally (no network) and holds the render until it is ready. */
export const FontLoader: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading Montserrat"));
  useEffect(() => {
    const face = new FontFace("Montserrat", `url(${staticFile("fonts/Montserrat.ttf")})`, { weight: "100 900" });
    face
      .load()
      .then(() => {
        document.fonts.add(face);
        continueRender(handle);
      })
      .catch(() => continueRender(handle));
  }, [handle]);
  return null;
};
