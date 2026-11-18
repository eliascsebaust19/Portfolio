import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

ScrollTrigger.config({
  ignoreMobileResize: true,
});

export { gsap, ScrollTrigger, useGSAP };

/**
 * Smoothly scrolls to an element ID while accounting for fixed navbar height
 * and respecting prefers-reduced-motion.
 */
export function scrollToSection(sectionId: string): void {
  const el = document.getElementById(sectionId);
  if (!el) return;

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const navOffset = 76;
  const top =
    el.getBoundingClientRect().top + window.scrollY - (sectionId === "home" ? 0 : navOffset);

  window.scrollTo({
    top: Math.max(0, top),
    behavior: prefersReduced ? "auto" : "smooth",
  });
}
