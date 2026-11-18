import { useEffect } from "react";
import { ExternalLink, Layers, X } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import type { ProjectItem } from "@/data/projects";

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    if (!project) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      className="fixed inset-0 z-[70] flex items-center justify-center bg-void/85 p-4 backdrop-blur-md sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-800 bg-obsidian shadow-[0_28px_90px_rgba(0,0,0,0.7)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800/80 bg-obsidian/95 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-cyan">
              {project.indexLabel}
            </span>
            <span className="text-xs text-slate-400">{project.category}</span>
            {project.isDemo && (
              <span className="rounded-full border border-cyan/35 bg-cyan/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-cyan">
                Demo Placeholder
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-surface text-slate-300 transition-colors hover:border-cyan/40 hover:text-cyan"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-7 p-6 sm:p-8">
          {/* Title & Action Links */}
          <div>
            <h3
              id="project-modal-title"
              className="font-display text-2xl font-bold text-slate-50 sm:text-3xl"
            >
              {project.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
              {project.overview}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {project.githubUrl ? (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-surface px-4 py-2.5 text-sm font-medium text-slate-100 transition-colors hover:border-cyan/50 hover:text-cyan"
                >
                  <FaGithub size={16} />
                  <span>View Repository</span>
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-void px-4 py-2.5 font-mono text-xs text-slate-400">
                  <FaGithub size={15} />
                  <span>Repository URL configurable in src/data/projects.ts</span>
                </span>
              )}

              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan to-teal px-4 py-2.5 text-sm font-semibold text-void transition-opacity hover:opacity-90"
                >
                  <span>Live Website</span>
                  <ExternalLink size={15} />
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-void px-4 py-2.5 font-mono text-xs text-slate-400">
                  <ExternalLink size={14} />
                  <span>Live Demo URL pending final project</span>
                </span>
              )}
            </div>
          </div>

          {/* Screenshots */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-wider text-slate-400">
              Preview Screenshots
            </h4>
            <div className="space-y-4">
              {project.screenshots.map((shot, idx) => (
                <figure
                  key={idx}
                  className="overflow-hidden rounded-2xl border border-slate-800 bg-void"
                >
                  <img
                    src={shot.src}
                    alt={shot.caption}
                    className="h-auto w-full object-cover"
                  />
                  <figcaption className="border-t border-slate-800/80 px-4 py-2.5 font-mono text-xs text-slate-400">
                    {shot.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          {/* Problem Statement */}
          <div className="rounded-2xl border border-slate-800 bg-surface/60 p-5">
            <h4 className="font-mono text-xs uppercase tracking-wider text-cyan">
              Problem Statement
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              {project.problemStatement}
            </p>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-slate-400">
              Key Planned &amp; Demonstrated Features
            </h4>
            <ul className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {project.features.map((feat, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 rounded-xl border border-slate-800/80 bg-void/70 p-3.5 text-sm text-slate-300"
                >
                  <Layers size={15} className="mt-0.5 shrink-0 text-teal-400" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-slate-400">
              Technologies
            </h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-slate-800 bg-surface px-3 py-1.5 font-mono text-xs text-slate-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
