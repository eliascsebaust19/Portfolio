import { Suspense, lazy, useCallback, useState } from "react";
import { AudioPlayerWidget } from "@/components/AudioVibe/AudioPlayerWidget";
import { Charlie } from "@/components/Charlie/Charlie";
import { VibeParticles } from "@/components/AudioVibe/VibeParticles";
import { Hero } from "@/components/Hero/Hero";
import { LuxuryIntro } from "@/components/Intro/LuxuryIntro";
import { Navbar } from "@/components/Navbar/Navbar";
import { SeasonalParticlesOverlay } from "@/components/SeasonalTheme/SeasonalParticlesOverlay";
import { AudioVibeProvider } from "@/context/AudioVibeContext";
import { SeasonalThemeProvider } from "@/context/SeasonalThemeContext";

const About = lazy(() =>
  import("@/components/About/About").then((m) => ({ default: m.About }))
);
const WhatIDo = lazy(() =>
  import("@/components/WhatIDo/WhatIDo").then((m) => ({ default: m.WhatIDo }))
);
const Technologies = lazy(() =>
  import("@/components/Technologies/Technologies").then((m) => ({
    default: m.Technologies,
  }))
);
const Projects = lazy(() =>
  import("@/components/Projects/Projects").then((m) => ({
    default: m.Projects,
  }))
);
const Education = lazy(() =>
  import("@/components/Education/Education").then((m) => ({
    default: m.Education,
  }))
);
const Credentials = lazy(() =>
  import("@/components/Credentials/Credentials").then((m) => ({
    default: m.Credentials,
  }))
);
const GitHubSection = lazy(() =>
  import("@/components/GitHub/GitHub").then((m) => ({
    default: m.GitHubSection,
  }))
);
const Contact = lazy(() =>
  import("@/components/Contact/Contact").then((m) => ({ default: m.Contact }))
);
const Footer = lazy(() =>
  import("@/components/Footer/Footer").then((m) => ({ default: m.Footer }))
);

function SectionFallback() {
  return (
    <div className="flex min-h-[220px] items-center justify-center bg-void py-16">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-800 border-t-cyan" />
    </div>
  );
}

export function App() {
  const [loaderDone, setLoaderDone] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const portfolioVisible = revealing || loaderDone;
  const handleLoaderReveal = useCallback(() => setRevealing(true), []);
  const handleLoaderComplete = useCallback(() => setLoaderDone(true), []);
  const setPortfolioRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) node.inert = !portfolioVisible;
    },
    [portfolioVisible]
  );

  return (
    <SeasonalThemeProvider>
      <AudioVibeProvider>
        {!loaderDone && (
          <LuxuryIntro onReveal={handleLoaderReveal} onComplete={handleLoaderComplete} />
        )}
        <div
          ref={setPortfolioRef}
          className={`relative min-h-screen bg-void text-slate-100 ${portfolioVisible ? "" : "invisible"}`}
        >
          <SeasonalParticlesOverlay />
          <VibeParticles />
          <Navbar />

          <main id="main-content">
            <Hero ready={portfolioVisible} />

            <Suspense fallback={<SectionFallback />}>
              <About />
              <WhatIDo />
              <Technologies />
              <Projects />
              <Education />
              <Credentials />
              <GitHubSection />
              <Contact />
            </Suspense>
          </main>

          <Suspense fallback={null}>
            <Footer />
          </Suspense>

          <AudioPlayerWidget />
          <Charlie />
        </div>
      </AudioVibeProvider>
    </SeasonalThemeProvider>
  );
}

export default App;
