import { useRef } from "react";
import { GraduationCap, Compass, Layers, Terminal } from "lucide-react";
import { gsap, useGSAP } from "@/animations/gsapConfig";
import { profile } from "@/data/profile";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const HIGHLIGHT_ICONS = [GraduationCap, Layers, Terminal, Compass];

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;

      gsap.fromTo(
        ".about-animate",
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.1,
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
      id="about"
      ref={sectionRef}
      className="relative bg-obsidian py-16 sm:py-20"
    >
      <div className="section-divider absolute inset-x-0 top-0" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="about-animate mb-8 max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-cyan">
            01 // About Me
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-slate-50 sm:text-3xl">
            {profile.about.headline}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Narrative Bio */}
          <div className="about-animate space-y-4 lg:col-span-7">
            {profile.about.paragraphs.map((paragraph, idx) => (
              <p
                key={idx}
                className="text-sm leading-relaxed text-slate-300 sm:text-base"
              >
                {paragraph}
              </p>
            ))}

            <div className="pt-1">
              <div className="inline-flex items-center gap-2.5 rounded-xl border border-slate-800 bg-surface/60 px-3.5 py-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-teal" />
                <span className="font-mono text-[11px] text-slate-300">
                  Learning, building, and growing at {profile.universityShort}.
                </span>
              </div>
            </div>
          </div>

          {/* Profile Fact Cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-5">
            {profile.about.highlights.map((item, idx) => {
              const Icon = HIGHLIGHT_ICONS[idx % HIGHLIGHT_ICONS.length];
              return (
                <div
                  key={item.label}
                  className="about-animate group rounded-2xl border border-slate-800/90 bg-surface/70 p-4 transition-colors duration-200 hover:border-cyan/35"
                >
                  <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-xl bg-cyan/10 text-cyan">
                    <Icon size={16} />
                  </div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                    {item.label}
                  </p>
                  <h3 className="mt-0.5 font-display text-sm font-semibold text-slate-100">
                    {item.value}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
