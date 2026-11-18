import { useEffect, useState } from "react";
import { socialLinks } from "@/data/socialLinks";

export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
}

export interface GitHubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  fork: boolean;
  homepage: string | null;
  topics?: string[];
}

interface GitHubState {
  user: GitHubUser | null;
  repos: GitHubRepo[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const CACHE_KEY = "elias_portfolio_gh_v1";
const CACHE_TTL_MS = 10 * 60 * 1000;

export function useGitHubProfile(): GitHubState {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const username = socialLinks.githubUsername;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        if (nonce === 0) {
          const cachedRaw = sessionStorage.getItem(CACHE_KEY);
          if (cachedRaw) {
            const cached = JSON.parse(cachedRaw) as {
              ts: number;
              user: GitHubUser;
              repos: GitHubRepo[];
            };
            if (Date.now() - cached.ts < CACHE_TTL_MS) {
              if (!cancelled) {
                setUser(cached.user);
                setRepos(cached.repos);
                setLoading(false);
              }
              return;
            }
          }
        }

        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`, {
            headers: { Accept: "application/vnd.github+json" },
          }),
          fetch(
            `https://api.github.com/users/${username}/repos?sort=updated&per_page=12`,
            {
              headers: { Accept: "application/vnd.github+json" },
            }
          ),
        ]);

        if (!userRes.ok || !reposRes.ok) {
          const status = !userRes.ok ? userRes.status : reposRes.status;
          throw new Error(
            status === 403
              ? "GitHub API public rate limit reached temporarily."
              : `GitHub returned status ${status}.`
          );
        }

        const userData = (await userRes.json()) as GitHubUser;
        const repoData = (await reposRes.json()) as GitHubRepo[];

        const selectedRepos = repoData
          .filter((r) => !r.fork)
          .sort((a, b) => {
            if (b.stargazers_count !== a.stargazers_count) {
              return b.stargazers_count - a.stargazers_count;
            }
            return (
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime()
            );
          })
          .slice(0, 6);

        if (!cancelled) {
          setUser(userData);
          setRepos(selectedRepos);
          setLoading(false);
          try {
            sessionStorage.setItem(
              CACHE_KEY,
              JSON.stringify({
                ts: Date.now(),
                user: userData,
                repos: selectedRepos,
              })
            );
          } catch {
            // Ignore storage quota errors
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load GitHub repositories right now."
          );
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [nonce]);

  return {
    user,
    repos,
    loading,
    error,
    refetch: () => setNonce((n) => n + 1),
  };
}
