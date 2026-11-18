import { ArrowUp, Mail } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { profile } from "@/data/profile";
import { socialLinks } from "@/data/socialLinks";
import { scrollToSection } from "@/animations/gsapConfig";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-slate-800/80 bg-void py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 sm:flex-row sm:px-8">
        <div className="text-center sm:text-left">
          <p className="font-display text-sm font-semibold tracking-wider text-slate-100">
            {profile.fullName}
          </p>
          <p className="mt-1 font-mono text-xs text-slate-400">
            CSE @ {profile.universityShort} · © {year} All rights reserved.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={socialLinks.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-obsidian text-slate-300 transition-colors hover:border-cyan/40 hover:text-cyan"
          >
            <FaGithub size={16} />
          </a>
          <a
            href={socialLinks.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-obsidian text-slate-300 transition-colors hover:border-cyan/40 hover:text-cyan"
          >
            <FaLinkedinIn size={15} />
          </a>
          <a
            href={`mailto:${socialLinks.email}`}
            aria-label="Send email"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-obsidian text-slate-300 transition-colors hover:border-cyan/40 hover:text-cyan"
          >
            <Mail size={15} />
          </a>
          <button
            type="button"
            onClick={() => scrollToSection("home")}
            aria-label="Back to top"
            className="ml-2 inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-800 bg-surface px-3 font-mono text-xs text-slate-300 transition-colors hover:border-cyan/40 hover:text-cyan"
          >
            <span>Top</span>
            <ArrowUp size={13} />
          </button>
        </div>
      </div>
    </footer>
  );
}
