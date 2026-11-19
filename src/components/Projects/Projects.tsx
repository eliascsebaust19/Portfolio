import { useRef, useState } from "react";
import { ArrowUpRight, Eye, ExternalLink } from "lucide-react";
import { FaGithub, FaAndroid } from "react-icons/fa";
import { gsap, useGSAP } from "@/animations/gsapConfig";
import { projects, type ProjectItem } from "@/data/projects";
import { socialLinks } from "@/data/socialLinks";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ProjectModal } from "./ProjectModal";

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
    null
  );

  useGSAP(
    () => {
      if (reducedMotion) return;

      gsap.fromTo(
        ".project-card",
        { y: 34, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.16,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 76%",
            once: true,
          },
        }
      );
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative bg-void py-16 sm:py-20"
    >
      <div className="section-divider absolute inset-x-0 top-0" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Heading */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-cyan">
              04 // Selected Showcase
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-slate-50 sm:text-3xl">
              Featured Projects
            </h2>
          </div>
          <p className="max-w-md text-xs text-slate-400">
            Selected builds — full list on GitHub.
          </p>
        </div>

        {/* 4-Card Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((project) => (
            <article
              key={project.id}
              className="project-card group flex flex-col overflow-hidden rounded-3xl border border-slate-800/90 bg-obsidian/90 transition-all duration-300 hover:border-cyan/40"
            >
              {/* Thumbnail */}
              <div className="relative overflow-hidden border-b border-slate-800/80 bg-void">
                <img
                  src={project.thumbnail}
                  alt={project.thumbnailAlt}
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute left-3 top-3 flex items-center gap-1.5">
                  <span className="rounded-md border border-slate-700/80 bg-void/85 px-2 py-0.5 font-mono text-[10px] font-semibold text-cyan backdrop-blur-sm">
                    {project.indexLabel}
                  </span>
                  {project.isDemo && (
                    <span className="rounded-md border border-cyan/35 bg-void/85 px-2 py-0.5 font-mono text-[10px] text-slate-200 backdrop-blur-sm">
                      Demo
                    </span>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                <div>
                  <p className="font-mono text-[10px] text-teal-400">
                    {project.category}
                  </p>
                  <h3 className="mt-1.5 font-display text-base font-bold text-slate-50 sm:text-lg">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400 sm:text-[13px]">
                    {project.shortDescription}
                  </p>

                  {/* Tech Tags */}
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-slate-800 bg-surface/80 px-2 py-0.5 font-mono text-[10px] text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 pt-4">
                  <button
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-cyan/15 px-3 py-2 font-display text-xs font-semibold text-cyan transition-colors hover:bg-cyan/25"
                  >
                    <Eye size={13} />
                    <span>Details</span>
                    <ArrowUpRight size={12} />
                  </button>

                  <div className="flex items-center gap-1.5">
                    {project.apkUrl && (
                      <a
                        href={project.apkUrl}
                        download="AdoptMatch.apk"
                        aria-label={`Download ${project.title} Android APK`}
                        className="inline-flex items-center gap-1 rounded-md border border-teal-500/40 bg-teal-500/10 px-2 py-1.5 font-mono text-[10px] text-teal-300 transition-colors hover:border-teal-400 hover:bg-teal-500/20"
                      >
                        <FaAndroid size={12} className="text-teal-400" />
                        <span>APK</span>
                      </a>
                    )}

                    {project.githubUrl ? (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} GitHub repository`}
                        className="inline-flex items-center gap-1 rounded-md border border-slate-800 bg-surface px-2 py-1.5 font-mono text-[10px] text-slate-300 transition-colors hover:border-cyan/40 hover:text-cyan"
                      >
                        <FaGithub size={12} />
                        <span>Code</span>
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSelectedProject(project)}
                        title="Placeholder project — click Details"
                        className="inline-flex items-center gap-1 rounded-md border border-slate-800 bg-void px-2 py-1.5 font-mono text-[10px] text-slate-500 transition-colors hover:border-slate-700 hover:text-slate-300"
                      >
                        <FaGithub size={12} />
                        <span>Demo</span>
                      </button>
                    )}

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} live demo`}
                        className="inline-flex items-center gap-1 rounded-md border border-slate-800 bg-surface px-2 py-1.5 font-mono text-[10px] text-slate-300 transition-colors hover:border-cyan/40 hover:text-cyan"
                      >
                        <ExternalLink size={11} />
                        <span>Live</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}

          {/* 4th Slot — More on GitHub */}
          <a
            href={socialLinks.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="project-card group flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-slate-700 bg-obsidian/60 p-6 text-center transition-all duration-300 hover:border-cyan/50 hover:bg-surface/60"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan/25 bg-cyan/10 text-cyan transition-transform duration-300 group-hover:scale-105">
              <FaGithub size={20} />
            </span>
            <span className="font-display text-base font-bold text-slate-100">
              More on GitHub
            </span>
            <span className="max-w-[200px] text-xs leading-relaxed text-slate-400">
              Experiments, practice repos, and future builds.
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-cyan">
              <span>@{socialLinks.githubUsername}</span>
              <ArrowUpRight size={12} />
            </span>
          </a>
        </div>
      </div>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
