import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import {
  SiCss,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiMysql,
  SiNodedotjs,
  SiPhp,
  SiPostgresql,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import { TbApi } from "react-icons/tb";
import { gsap, useGSAP } from "@/animations/gsapConfig";
import { useAudioVibe } from "@/context/useAudioVibe";
import {
  TECH_CATEGORIES,
  TECH_STAGES,
  technologies,
  type TechCategory,
  type TechStage,
} from "@/data/technologies";
import { useDeviceCapabilities } from "@/hooks/useReducedMotion";

const TechOrbitCanvas = lazy(() => import("./TechOrbitCanvas"));

const TECH_ICONS: Record<string, typeof SiHtml5> = {
  html: SiHtml5,
  css: SiCss,
  javascript: SiJavascript,
  php: SiPhp,
  nodejs: SiNodedotjs,
  mysql: SiMysql,
  postgresql: SiPostgresql,
  git: SiGit,
  github: SiGithub,
  vscode: VscVscode,
  "rest-api": TbApi,
};

const STAGE_BADGE_CLASSES: Record<TechStage, string> = {
  "Familiar With": "border-cyan/35 bg-cyan/10 text-cyan",
  Practicing: "border-teal/35 bg-teal/10 text-teal-400",
  Learning: "border-violet/40 bg-violet/15 text-violet-300",
};

export function Technologies() {
  const sectionRef = useRef<HTMLElement>(null);
  const { canRender3D, reducedMotion } = useDeviceCapabilities();
  const { vibeRef } = useAudioVibe();
  const [selectedCategory, setSelectedCategory] = useState<
    "All" | TechCategory
  >("All");
  const [selectedStage, setSelectedStage] = useState<"All" | TechStage>("All");
  const [selectedTechId, setSelectedTechId] = useState<string | null>(
    "javascript"
  );
  const [isInView, setIsInView] = useState(false);

  // Pause 3D render loop when section is off-screen
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { rootMargin: "120px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      if (reducedMotion) return;

      gsap.fromTo(
        ".tech-reveal",
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
            once: true,
          },
        }
      );
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  const filteredTech = useMemo(() => {
    return technologies.filter((item) => {
      const catOk =
        selectedCategory === "All" || item.category === selectedCategory;
      const stageOk = selectedStage === "All" || item.stage === selectedStage;
      return catOk && stageOk;
    });
  }, [selectedCategory, selectedStage]);

  const highlightedIds = useMemo(
    () => new Set(filteredTech.map((t) => t.id)),
    [filteredTech]
  );

  const activeTech =
    technologies.find((t) => t.id === selectedTechId) ||
    filteredTech[0] ||
    technologies[0];

  const groupedByStage = useMemo(() => {
    const order: TechStage[] = ["Learning", "Practicing", "Familiar With"];
    return order.map((stage) => ({
      stage,
      items: filteredTech.filter((t) => t.stage === stage),
    }));
  }, [filteredTech]);

  return (
    <section
      id="technologies"
      ref={sectionRef}
      className="relative bg-obsidian py-24 sm:py-28"
    >
      <div className="section-divider absolute inset-x-0 top-0" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Section Heading */}
        <div className="tech-reveal mb-10 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan">
              03 // Tech Stack
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-slate-50 sm:text-4xl">
              Technologies &amp; Tools
            </h2>
          </div>
          <p className="max-w-lg text-sm text-slate-400">
            Organized honestly by current stage — distinguishing technologies I
            am actively <span className="text-violet-300">learning</span>,{" "}
            <span className="text-teal-400">practicing</span>, and{" "}
            <span className="text-cyan">familiar with</span>.
          </p>
        </div>

        {/* Interactive Filter Controls */}
        <div className="tech-reveal mb-8 flex flex-col gap-4 rounded-2xl border border-slate-800/80 bg-void/60 p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 font-mono text-[11px] uppercase tracking-wider text-slate-500">
              Domain:
            </span>
            {TECH_CATEGORIES.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-lg px-3 py-1.5 font-mono text-xs transition-all ${
                    active
                      ? "border border-cyan/50 bg-cyan/15 text-cyan"
                      : "border border-slate-800 bg-surface/70 text-slate-300 hover:border-slate-700 hover:text-slate-100"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-slate-800/70 pt-3">
            <span className="mr-1 font-mono text-[11px] uppercase tracking-wider text-slate-500">
              Stage:
            </span>
            {TECH_STAGES.map((stage) => {
              const active = selectedStage === stage;
              return (
                <button
                  key={stage}
                  type="button"
                  onClick={() => setSelectedStage(stage)}
                  className={`rounded-lg px-3 py-1.5 font-mono text-xs transition-all ${
                    active
                      ? "border border-teal/50 bg-teal/15 text-teal-400"
                      : "border border-slate-800 bg-surface/70 text-slate-300 hover:border-slate-700 hover:text-slate-100"
                  }`}
                >
                  {stage}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3D Interactive Showcase + Selected Detail */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left 3D / Interactive Showcase Panel */}
          <div className="tech-reveal flex flex-col justify-between rounded-2xl border border-slate-800/90 bg-void/80 p-5 lg:col-span-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
                Interactive 3D Orbit
              </span>
              <span className="font-mono text-[11px] text-cyan">
                Click any node
              </span>
            </div>

            <div className="relative my-3 h-[280px] w-full sm:h-[320px]">
              {canRender3D && !reducedMotion ? (
                <Suspense
                  fallback={
                    <div className="flex h-full items-center justify-center font-mono text-xs text-slate-500">
                      Loading 3D tech nodes...
                    </div>
                  }
                >
                  <TechOrbitCanvas
                    items={technologies}
                    highlightedIds={highlightedIds}
                    selectedId={activeTech?.id || null}
                    onSelect={setSelectedTechId}
                    active={isInView}
                    vibeRef={vibeRef}
                  />
                </Suspense>
              ) : (
                <div className="flex h-full flex-wrap items-center justify-center gap-3 p-4">
                  {filteredTech.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedTechId(t.id)}
                      className={`rounded-xl border px-3 py-2 font-mono text-xs transition-colors ${
                        activeTech?.id === t.id
                          ? "border-cyan bg-cyan/15 text-cyan"
                          : "border-slate-800 bg-surface text-slate-300"
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {activeTech && (
              <div className="rounded-xl border border-slate-800 bg-surface/80 p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-lg font-semibold text-slate-100">
                    {activeTech.name}
                  </h3>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] ${
                      STAGE_BADGE_CLASSES[activeTech.stage]
                    }`}
                  >
                    {activeTech.stage}
                  </span>
                </div>
                <p className="mt-1 font-mono text-[11px] text-slate-400">
                  Category: {activeTech.category}
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  {activeTech.summary}
                </p>
              </div>
            )}
          </div>

          {/* Right Categorized Technology Matrix */}
          <div className="space-y-6 lg:col-span-7">
            {filteredTech.length === 0 ? (
              <div className="flex h-full min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-void/40 p-8 text-center">
                <p className="font-display text-lg text-slate-200">
                  No technologies match that filter combination
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("All");
                    setSelectedStage("All");
                  }}
                  className="mt-4 rounded-lg border border-cyan/40 bg-cyan/10 px-4 py-2 font-mono text-xs text-cyan hover:bg-cyan/20"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              groupedByStage.map(({ stage, items }) => {
                if (items.length === 0) return null;
                const stageLetter =
                  stage === "Learning"
                    ? "A"
                    : stage === "Practicing"
                      ? "B"
                      : "C";
                return (
                  <div
                    key={stage}
                    className="rounded-2xl border border-slate-800/80 bg-void/60 p-5"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-display text-base font-semibold text-slate-100">
                        <span className="mr-2 font-mono text-xs text-cyan">
                          {stageLetter}.
                        </span>
                        {stage}
                      </h3>
                      <span className="font-mono text-xs text-slate-500">
                        {items.length} {items.length === 1 ? "tool" : "tools"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {items.map((tech) => {
                        const Icon = TECH_ICONS[tech.id] || TbApi;
                        const isSelected = activeTech?.id === tech.id;
                        return (
                          <button
                            key={tech.id}
                            type="button"
                            onClick={() => setSelectedTechId(tech.id)}
                            onMouseEnter={() => setSelectedTechId(tech.id)}
                            className={`group flex items-center gap-3.5 rounded-xl border p-3.5 text-left transition-all duration-200 ${
                              isSelected
                                ? "border-cyan/50 bg-surface shadow-[0_0_24px_rgba(0,229,255,0.08)]"
                                : "border-slate-800/80 bg-obsidian/80 hover:border-slate-700 hover:bg-surface/70"
                            }`}
                          >
                            <div
                              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-800 bg-void/90 transition-transform duration-200 group-hover:scale-105"
                              style={{ color: tech.accent }}
                            >
                              <Icon size={20} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="truncate font-display text-sm font-semibold text-slate-100">
                                  {tech.name}
                                </span>
                                <span className="font-mono text-[10px] text-slate-500">
                                  {tech.category}
                                </span>
                              </div>
                              <p className="mt-0.5 truncate text-xs text-slate-400">
                                {tech.summary}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
