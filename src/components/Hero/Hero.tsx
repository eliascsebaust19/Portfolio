import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, Download, Mail } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { gsap, useGSAP, scrollToSection } from "@/animations/gsapConfig";
import { profile } from "@/data/profile";
import { socialLinks } from "@/data/socialLinks";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Character3D } from "@/components/Character3D/Character3D";

interface HeroProps {
  ready: boolean;
}

export function Hero({ ready }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const roleRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  const [roleIndex, setRoleIndex] = useState(0);

  // Cycle dynamic role text smoothly
  useEffect(() => {
    const interval = setInterval(() => {
      if (reducedMotion || !roleRef.current) {
        setRoleIndex((prev) => (prev + 1) % profile.dynamicRoles.length);
        return;
      }

      gsap.to(roleRef.current, {
        y: -14,
        opacity: 0,
        duration: 0.28,
        ease: "power2.in",
        onComplete: () => {
          setRoleIndex((prev) => (prev + 1) % profile.dynamicRoles.length);
          if (roleRef.current) {
            gsap.fromTo(
              roleRef.current,
              { y: 14, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.36, ease: "power2.out" }
            );
          }
        },
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [reducedMotion]);

  // Hero entrance animation
  useGSAP(
    () => {
      if (!ready || reducedMotion) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        ".hero-reveal",
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 }
      ).fromTo(
        ".hero-stage",
        { scale: 0.94, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.9 },
        "-=0.5"
      );
    },
    { scope: sectionRef, dependencies: [ready, reducedMotion] }
  );

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden bg-void pt-24 pb-16 sm:pt-28"
    >
      {/* Subtle grid & atmospheric radial glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-pattern bg-[size:64px_64px] opacity-60"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-24 h-96 w-96 rounded-full bg-cyan/10 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/3 h-[420px] w-[420px] rounded-full bg-violet/10 blur-[140px]"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:gap-8">
        {/* Left Content Column */}
        <div className="flex flex-col items-start lg:col-span-7">
          <div className="hero-reveal inline-flex items-center gap-2.5 rounded-full border border-cyan/25 bg-surface/80 px-4 py-1.5 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-cyan shadow-[0_0_10px_#00e5ff]" />
            <span className="font-mono text-xs tracking-wide text-slate-300">
              {profile.universityShort} · {profile.department}
            </span>
          </div>

          <p className="hero-reveal mt-5 font-mono text-xs font-medium uppercase tracking-[0.22em] text-cyan sm:text-sm">
            {profile.greeting}
          </p>

          <h1 className="hero-reveal mt-2 font-display text-3xl font-bold tracking-tight text-slate-50 sm:text-5xl xl:text-6xl">
            {profile.name}
          </h1>

          <p className="hero-reveal mt-3 text-sm font-medium text-slate-300 sm:text-base">
            {profile.introSubtitle}
          </p>

          {/* Dynamic Cycling Role */}
          <div className="hero-reveal mt-5 flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-widest text-slate-500">
              Role Focus //
            </span>
            <div className="inline-flex h-9 items-center overflow-hidden rounded-lg border border-slate-800 bg-obsidian/90 px-4">
              <span
                ref={roleRef}
                aria-live="polite"
                className="font-display text-sm font-semibold text-teal-400 sm:text-base"
              >
                {profile.dynamicRoles[roleIndex]}
              </span>
            </div>
          </div>

          <p className="hero-reveal mt-5 max-w-md text-sm leading-relaxed text-slate-400">
            CSE student at BAUST building practical web &amp; mobile apps with clean code.
          </p>

          {/* Primary Actions */}
          <div className="hero-reveal mt-7 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("projects");
              }}
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan to-teal px-5 py-3 font-display text-[13px] font-semibold text-void shadow-[0_10px_30px_rgba(0,229,255,0.2)] transition-all duration-200 hover:brightness-110"
            >
              <span>Explore Projects</span>
              <ArrowUpRight
                size={15}
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>

            <a
              href="/cv/Elias-Ahmad-CV.pdf"
              download="Elias-Ahmad-CV.pdf"
              className="inline-flex items-center gap-2 rounded-xl border border-teal/40 bg-teal/10 px-5 py-3 font-display text-[13px] font-semibold text-teal-300 transition-colors duration-200 hover:border-teal-400 hover:bg-teal/20"
            >
              <Download size={15} />
              <span>Download CV</span>
            </a>

            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("contact");
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-surface/80 px-5 py-3 font-display text-[13px] font-semibold text-slate-100 transition-colors duration-200 hover:border-cyan/50 hover:text-cyan"
            >
              <span>Get in Touch</span>
            </a>
          </div>

          {/* Social Links */}
          <div className="hero-reveal mt-7 flex items-center gap-2.5">
            <span className="mr-1 font-mono text-[11px] text-slate-500">
              CONNECT:
            </span>
            <a
              href={socialLinks.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Elias Ahmad on GitHub"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-surface/70 text-slate-300 transition-all hover:border-cyan/50 hover:text-cyan"
            >
              <FaGithub size={15} />
            </a>
            <a
              href={socialLinks.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Elias Ahmad on LinkedIn"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-surface/70 text-slate-300 transition-all hover:border-cyan/50 hover:text-cyan"
            >
              <FaLinkedinIn size={14} />
            </a>
            <a
              href={`mailto:${socialLinks.email}`}
              aria-label="Email Elias Ahmad"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-surface/70 text-slate-300 transition-all hover:border-cyan/50 hover:text-cyan"
            >
              <Mail size={14} />
            </a>
          </div>
        </div>

        {/* Right 3D Avatar Column */}
        <div className="hero-stage lg:col-span-5">
          {ready ? (
            <Character3D />
          ) : (
            <div className="h-[400px] sm:h-[480px] lg:h-[600px]" />
          )}
        </div>
      </div>

      {/* Scroll Down Cue */}
      <a
        href="#about"
        onClick={(e) => {
          e.preventDefault();
          scrollToSection("about");
        }}
        aria-label="Scroll to About section"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 font-mono text-xs text-slate-400 transition-colors hover:text-cyan sm:inline-flex"
      >
        <span>Scroll</span>
        <ArrowDown size={14} className="animate-bounce text-cyan" />
      </a>
    </section>
  );
}
