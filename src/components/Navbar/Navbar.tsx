import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { profile } from "@/data/profile";
import { useActiveSection } from "@/hooks/useActiveSection";
import { scrollToSection } from "@/animations/gsapConfig";

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "technologies", label: "Technologies" },
  { id: "projects", label: "Projects" },
  { id: "journey", label: "Journey" },
  { id: "contact", label: "Contact" },
];

const SECTION_IDS = NAV_ITEMS.map((item) => item.id);

export function Navbar() {
  const activeSection = useActiveSection(SECTION_IDS);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    setMobileOpen(false);
    scrollToSection(id);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-slate-800/80 bg-void/80 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <nav
        aria-label="Primary navigation"
        className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-5 sm:px-8"
      >
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, "home")}
          className="group flex items-center gap-3 focus-visible:outline-none"
          aria-label="Elias Ahmad — Back to top"
        >
          <span className="vibe-monogram flex h-10 w-10 items-center justify-center rounded-xl border border-cyan/30 bg-surface/80 font-display text-sm font-bold tracking-wider text-cyan transition-transform duration-300 group-hover:scale-105 group-hover:border-cyan/60">
            {profile.monogram}
          </span>
          <span className="hidden font-display text-sm font-semibold tracking-[0.16em] text-slate-100 sm:inline-block">
            {profile.name}
          </span>
        </a>

        {/* Desktop Links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`group relative inline-flex items-center px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-cyan"
                      : "text-slate-300 hover:text-slate-100"
                  }`}
                >
                  <span>{item.label}</span>
                  <span
                    className={`absolute bottom-1 left-4 right-4 h-[2px] origin-left rounded-full bg-gradient-to-r from-cyan to-teal transition-transform duration-300 ${
                      isActive
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        {/* Right CTA + Mobile Menu Button */}
        <div className="flex items-center gap-3">
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, "contact")}
            className="hidden rounded-lg border border-cyan/35 bg-cyan/10 px-4 py-2 font-mono text-xs font-medium text-cyan transition-all duration-200 hover:border-cyan hover:bg-cyan/20 sm:inline-flex"
          >
            Let&apos;s Connect
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-surface/80 text-slate-200 transition-colors hover:border-cyan/40 hover:text-cyan lg:hidden"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        id="mobile-navigation"
        className={`overflow-hidden border-b border-slate-800/80 bg-obsidian/95 backdrop-blur-lg transition-all duration-300 lg:hidden ${
          mobileOpen ? "max-h-[420px] opacity-100" : "max-h-0 border-b-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-1 px-5 py-4">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`flex items-center justify-between rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                    isActive
                      ? "bg-cyan/10 text-cyan"
                      : "text-slate-300 hover:bg-surface hover:text-slate-100"
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}
