import { cacheLife } from "next/cache";
import type { RepoStats } from "@/models/types";

const GITHUB_USER = "Athulbt";

interface GitHubRepo {
  name: string;
  html_url: string;
  language: string | null;
  pushed_at: string;
  stargazers_count: number;
  fork: boolean;
}

/**
 * Fetches public repo stats from the GitHub API.
 * Cached for hours so the site stays fast and well under the API rate limit.
 * Returns an empty list on failure so the page still renders from the models.
 */
export async function getRepoStats(): Promise<RepoStats[]> {
  "use cache";
  cacheLife("hours");

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) return [];
    const repos = (await res.json()) as GitHubRepo[];
    return repos
      .filter((r) => !r.fork)
      .map((r) => ({
        name: r.name,
        url: r.html_url,
        language: r.language,
        pushedAt: r.pushed_at,
        stars: r.stargazers_count,
      }));
  } catch {
    return [];
  }
}
