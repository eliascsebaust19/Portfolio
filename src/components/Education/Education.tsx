import { useRef } from "react";
import { Briefcase, GraduationCap, Sparkles, Terminal } from "lucide-react";
import { gsap, useGSAP } from "@/animations/gsapConfig";
import {
  educationMilestones,
  experienceItems,
  type TimelineMilestone,
} from "@/data/education";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const TYPE_ICON: Record<TimelineMilestone["type"], typeof GraduationCap> = {
  Education: GraduationCap,
  Development: Terminal,
  "Learning Focus": Sparkles,
};

export function Education() {
  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;

      if (railRef.current) {
        gsap.fromTo(
          railRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".timeline-track",
              start: "top 75%",
              end: "bottom 75%",
              scrub: 0.6,
            },
          }
        );
      }

      gsap.fromTo(
        ".milestone-card",
        { x: 24, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".timeline-track",
            start: "top 80%",
            once: true,
          },
        }
      );
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="relative bg-obsidian py-24 sm:py-28"
    >
      <div className="section-divider absolute inset-x-0 top-0" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-14 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan">
            05 // Education &amp; Journey
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-slate-50 sm:text-4xl">
            Academic Path &amp; Growth
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">
            Academic engineering foundations at BAUST combined with self-driven
            practice in software development, backend architecture, and mobile
            &amp; DevOps exploration.
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="timeline-track relative pl-8 sm:pl-12">
          {/* Background Rail */}
          <div
            aria-hidden="true"
            className="absolute bottom-2 left-3 top-2 w-[2px] bg-slate-800 sm:left-4"
          />
          {/* Animated Active Rail */}
          <div
            ref={railRef}
            aria-hidden="true"
            className="absolute bottom-2 left-3 top-2 w-[2px] origin-top bg-gradient-to-b from-cyan via-teal to-violet sm:left-4"
          />

          <div className="space-y-8">
            {educationMilestones.map((item) => {
              const Icon = TYPE_ICON[item.type];
              return (
                <article
                  key={item.id}
                  className="milestone-card relative rounded-2xl border border-slate-800/90 bg-void/80 p-6 transition-colors duration-200 hover:border-cyan/35 sm:p-7"
                >
                  {/* Node indicator */}
                  <div
                    aria-hidden="true"
                    className="absolute -left-[29px] top-7 flex h-6 w-6 items-center justify-center rounded-full border border-cyan/50 bg-obsidian text-cyan shadow-[0_0_16px_rgba(0,229,255,0.28)] sm:-left-[41px]"
                  >
                    <span className="h-2 w-2 rounded-full bg-cyan" />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2 rounded-lg border border-cyan/25 bg-cyan/10 px-3 py-1 font-mono text-xs text-cyan">
                      <Icon size={14} />
                      <span>{item.type}</span>
                    </div>
                    <span className="font-mono text-xs text-slate-400">
                      {item.period}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-xl font-bold text-slate-50 sm:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-teal-400">
                    {item.organization}
                    {item.location ? ` · ${item.location}` : ""}
                  </p>

                  <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                    {item.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-slate-800 bg-surface/80 px-2.5 py-1 font-mono text-xs text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Configurable Experience Block */}
        <div className="mt-12 rounded-2xl border border-slate-800/80 bg-void/60 p-6 sm:p-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet/30 bg-violet/10 text-violet-300">
              <Briefcase size={18} />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-slate-100">
                Experience &amp; Collaboration
              </h3>
              <p className="font-mono text-xs text-slate-400">
                Configurable section · Updated as confirmed roles are added
              </p>
            </div>
          </div>

          {experienceItems.length > 0 ? (
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              {experienceItems.map((exp) => (
                <div
                  key={exp.id}
                  className="rounded-xl border border-slate-800 bg-obsidian p-4"
                >
                  <p className="font-mono text-xs text-cyan">{exp.period}</p>
                  <h4 className="mt-1 font-display text-base font-semibold text-slate-100">
                    {exp.role}
                  </h4>
                  <p className="text-xs text-teal-400">{exp.company}</p>
                  <p className="mt-2 text-sm text-slate-400">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Currently focused on undergraduate CSE studies at BAUST and
              independent software development. Open to software engineering
              internships, collaborative student builds, and open-source
              learning opportunities.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
