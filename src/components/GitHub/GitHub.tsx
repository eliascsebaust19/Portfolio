import { useMemo, useRef } from "react";
import {
  ArrowUpRight,
  GitFork,
  RefreshCw,
  Star,
  AlertCircle,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { gsap, useGSAP } from "@/animations/gsapConfig";
import { socialLinks } from "@/data/socialLinks";
import { useGitHubProfile } from "@/hooks/useGitHubProfile";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Dart: "#00B4AB",
  PHP: "#4F5D95",
  HTML: "#e34c26",
  CSS: "#563d7c",
  C: "#555555",
  "C++": "#f34b7d",
  Java: "#b07219",
  Shell: "#89e051",
};

export function GitHubSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { user, repos, loading, error, refetch } = useGitHubProfile();

  useGSAP(
    () => {
      if (reducedMotion) return;

      gsap.fromTo(
        ".gh-reveal",
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  const languageSummary = useMemo(() => {
    const counts = new Map<string, number>();
    repos.forEach((r) => {
      if (r.language) {
        counts.set(r.language, (counts.get(r.language) || 0) + 1);
      }
    });
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [repos]);

  return (
    <section
      id="github"
      ref={sectionRef}
      className="relative bg-void py-16 sm:py-20"
    >
      <div className="section-divider absolute inset-x-0 top-0" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header */}
        <div className="gh-reveal mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan">
              06 // Open Source &amp; Code
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-slate-50 sm:text-3xl">
              GitHub Activity
            </h2>
          </div>

          <a
            href={socialLinks.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-700 bg-surface px-4 py-2.5 font-mono text-xs text-slate-200 transition-colors hover:border-cyan/50 hover:text-cyan md:self-auto"
          >
            <FaGithub size={16} />
            <span>@{socialLinks.githubUsername}</span>
            <ArrowUpRight size={14} />
          </a>
        </div>

        {/* Profile Overview Strip */}
        <div className="gh-reveal mb-8 rounded-2xl border border-slate-800/90 bg-obsidian/90 p-6">
          {loading ? (
            <div className="flex animate-pulse items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-slate-800" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-44 rounded bg-slate-800" />
                <div className="h-3 w-72 rounded bg-slate-800/80" />
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3">
                <AlertCircle
                  size={20}
                  className="mt-0.5 shrink-0 text-amber-400"
                />
                <div>
                  <p className="font-display text-sm font-semibold text-slate-100">
                    Unable to fetch live GitHub stats right now
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {error} You can still view Elias&apos;s full profile directly
                    on GitHub.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={refetch}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-surface px-3 py-2 font-mono text-xs text-slate-200 hover:border-cyan/40 hover:text-cyan"
                >
                  <RefreshCw size={13} />
                  <span>Retry</span>
                </button>
                <a
                  href={socialLinks.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-cyan/15 px-3 py-2 font-mono text-xs text-cyan hover:bg-cyan/25"
                >
                  <span>Open GitHub</span>
                  <ArrowUpRight size={13} />
                </a>
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div className="flex items-center gap-4">
                {user?.avatar_url && (
                  <img
                    src={user.avatar_url}
                    alt={`${user.name || user.login} GitHub avatar`}
                    width={60}
                    height={60}
                    loading="lazy"
                    className="h-14 w-14 rounded-2xl border border-slate-700 object-cover"
                  />
                )}
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-100">
                    {user?.name || "Elias Ahmad"}
                  </h3>
                  <p className="font-mono text-xs text-cyan">
                    github.com/{user?.login || socialLinks.githubUsername}
                  </p>
                  {user?.bio && (
                    <p className="mt-1 max-w-xl text-xs text-slate-400 sm:text-sm">
                      {user.bio}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <div className="rounded-xl border border-slate-800 bg-void/80 px-4 py-2.5 text-center">
                  <p className="font-display text-xl font-bold text-slate-50">
                    {user?.public_repos ?? repos.length}
                  </p>
                  <p className="font-mono text-[11px] text-slate-400">
                    Public Repos
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-void/80 px-4 py-2.5 text-center">
                  <p className="font-display text-xl font-bold text-slate-50">
                    {user?.followers ?? 0}
                  </p>
                  <p className="font-mono text-[11px] text-slate-400">
                    Followers
                  </p>
                </div>
                {languageSummary.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    {languageSummary.slice(0, 4).map(([lang]) => (
                      <span
                        key={lang}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-surface px-2.5 py-1 font-mono text-[11px] text-slate-300"
                      >
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{
                            backgroundColor: LANG_COLORS[lang] || "#00e5ff",
                          }}
                        />
                        {lang}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Repositories Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, idx) => (
              <div
                key={idx}
                className="h-44 animate-pulse rounded-2xl border border-slate-800/80 bg-obsidian/70 p-5"
              >
                <div className="h-4 w-36 rounded bg-slate-800" />
                <div className="mt-4 h-3 w-full rounded bg-slate-800/70" />
                <div className="mt-2 h-3 w-2/3 rounded bg-slate-800/70" />
              </div>
            ))}
          </div>
        ) : (
          repos.length > 0 && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {repos.map((repo) => (
                <a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gh-reveal group flex flex-col justify-between rounded-2xl border border-slate-800/90 bg-obsidian/90 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-cyan/40 hover:bg-surface/75"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="truncate font-display text-base font-semibold text-slate-100 group-hover:text-cyan">
                        {repo.name}
                      </h3>
                      <ArrowUpRight
                        size={16}
                        className="shrink-0 text-slate-500 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan"
                      />
                    </div>
                    <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-slate-400 sm:text-sm">
                      {repo.description ||
                        "Public repository on GitHub exploring code and implementation ideas."}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-800/70 pt-3.5 font-mono text-xs text-slate-400">
                    <div className="flex items-center gap-3">
                      {repo.language && (
                        <span className="inline-flex items-center gap-1.5 text-slate-300">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{
                              backgroundColor:
                                LANG_COLORS[repo.language] || "#00e5ff",
                            }}
                          />
                          {repo.language}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <Star size={13} className="text-amber-400" />
                        {repo.stargazers_count}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <GitFork size={13} />
                        {repo.forks_count}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      {new Date(repo.updated_at).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )
        )}
      </div>
    </section>
  );
}
