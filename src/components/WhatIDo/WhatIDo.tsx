import { useRef } from "react";
import { Code2, Cpu, Database, Globe, Server } from "lucide-react";
import { gsap, useGSAP } from "@/animations/gsapConfig";
import { profile, type WhatIDoItem } from "@/data/profile";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const ICON_MAP: Record<WhatIDoItem["icon"], typeof Globe> = {
  globe: Globe,
  server: Server,
  code: Code2,
  database: Database,
  cpu: Cpu,
};

export function WhatIDo() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;

      gsap.fromTo(
        ".whatido-card",
        { y: 26, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.09,
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

  return (
    <section
      id="what-i-do"
      ref={sectionRef}
      className="relative bg-void py-24 sm:py-28"
    >
      <div className="section-divider absolute inset-x-0 top-0" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan">
              02 // Core Interests
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-slate-50 sm:text-4xl">
              What I Focus On
            </h2>
          </div>
          <p className="max-w-md text-sm text-slate-400">
            Areas of software engineering and computer science where I actively
            practice, build projects, and deepen technical understanding.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {profile.whatIDo.map((item, idx) => {
            const Icon = ICON_MAP[item.icon];
            return (
              <article
                key={item.id}
                className="whatido-card group relative flex flex-col justify-between rounded-2xl border border-slate-800/90 bg-obsidian/90 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan/40 hover:bg-surface/80"
              >
                <div>
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan/20 bg-cyan/10 text-cyan transition-transform duration-300 group-hover:scale-105">
                      <Icon size={22} />
                    </div>
                    <span className="font-mono text-xs text-slate-500">
                      0{idx + 1}
                    </span>
                  </div>

                  <p className="font-mono text-[11px] uppercase tracking-wider text-teal-400">
                    {item.subtitle}
                  </p>
                  <h3 className="mt-1.5 font-display text-xl font-semibold text-slate-100">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-800/70 pt-4">
                  {item.focusAreas.map((area) => (
                    <span
                      key={area}
                      className="rounded-md border border-slate-800 bg-void/80 px-2.5 py-1 font-mono text-[11px] text-slate-300"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
