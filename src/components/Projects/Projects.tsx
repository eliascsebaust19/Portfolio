import { useRef, useState } from "react";
import { ArrowUpRight, Eye, ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { gsap, useGSAP } from "@/animations/gsapConfig";
import { projects, type ProjectItem } from "@/data/projects";
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
      className="relative bg-void py-24 sm:py-28"
    >
      <div className="section-divider absolute inset-x-0 top-0" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Heading */}
        <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan">
              04 // Selected Showcase
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-slate-50 sm:text-4xl">
              Featured Projects
            </h2>
          </div>
          <div className="max-w-md rounded-xl border border-slate-800/80 bg-obsidian/80 px-4 py-3 text-xs text-slate-400">
            Currently displaying <strong className="text-slate-200">2 initial demo placeholders</strong>. Final verified projects and live URLs can be swapped directly in{" "}
            <code className="font-mono text-cyan">src/data/projects.ts</code>.
          </div>
        </div>

        {/* 2-Card Editorial Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
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
                <div className="absolute left-4 top-4 flex items-center gap-2">
                  <span className="rounded-lg border border-slate-700/80 bg-void/85 px-2.5 py-1 font-mono text-xs font-semibold text-cyan backdrop-blur-sm">
                    {project.indexLabel}
                  </span>
                  {project.isDemo && (
                    <span className="rounded-lg border border-cyan/35 bg-void/85 px-2.5 py-1 font-mono text-[11px] text-slate-200 backdrop-blur-sm">
                      Demo Placeholder
                    </span>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                <div>
                  <p className="font-mono text-xs text-teal-400">
                    {project.category}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-bold text-slate-50">
                    {project.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">
                    {project.shortDescription}
                  </p>

                  {/* Tech Tags */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-slate-800 bg-surface/80 px-2.5 py-1 font-mono text-xs text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-5">
                  <button
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    className="inline-flex items-center gap-2 rounded-xl bg-cyan/15 px-4 py-2.5 font-display text-sm font-semibold text-cyan transition-colors hover:bg-cyan/25"
                  >
                    <Eye size={16} />
                    <span>View Details</span>
                    <ArrowUpRight size={15} />
                  </button>

                  <div className="flex items-center gap-2">
                    {project.githubUrl ? (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} GitHub repository`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-surface px-3 py-2 font-mono text-xs text-slate-300 transition-colors hover:border-cyan/40 hover:text-cyan"
                      >
                        <FaGithub size={14} />
                        <span>Code</span>
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSelectedProject(project)}
                        title="Placeholder project — click View Details"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-void px-3 py-2 font-mono text-xs text-slate-500 transition-colors hover:border-slate-700 hover:text-slate-300"
                      >
                        <FaGithub size={14} />
                        <span>Demo Slot</span>
                      </button>
                    )}

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} live demo`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-surface px-3 py-2 font-mono text-xs text-slate-300 transition-colors hover:border-cyan/40 hover:text-cyan"
                      >
                        <ExternalLink size={13} />
                        <span>Live</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
