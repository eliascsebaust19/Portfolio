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
      className="relative bg-obsidian py-24 sm:py-28"
    >
      <div className="section-divider absolute inset-x-0 top-0" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="about-animate mb-12 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan">
            01 // About Me
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-slate-50 sm:text-4xl">
            {profile.about.headline}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Narrative Bio */}
          <div className="about-animate space-y-5 lg:col-span-7">
            {profile.about.paragraphs.map((paragraph, idx) => (
              <p
                key={idx}
                className="text-base leading-relaxed text-slate-300 sm:text-lg"
              >
                {paragraph}
              </p>
            ))}

            <div className="pt-2">
              <div className="inline-flex items-center gap-3 rounded-xl border border-slate-800 bg-surface/60 px-4 py-3">
                <span className="h-2 w-2 rounded-full bg-teal" />
                <span className="font-mono text-xs text-slate-300">
                  Continuously learning, building, and refining computer science
                  fundamentals at {profile.universityShort}.
                </span>
              </div>
            </div>
          </div>

          {/* Profile Fact Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-5">
            {profile.about.highlights.map((item, idx) => {
              const Icon = HIGHLIGHT_ICONS[idx % HIGHLIGHT_ICONS.length];
              return (
                <div
                  key={item.label}
                  className="about-animate group rounded-2xl border border-slate-800/90 bg-surface/70 p-5 transition-colors duration-200 hover:border-cyan/35"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan/10 text-cyan">
                    <Icon size={20} />
                  </div>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
                    {item.label}
                  </p>
                  <h3 className="mt-1 font-display text-base font-semibold text-slate-100">
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
