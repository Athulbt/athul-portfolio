import { readFile } from "node:fs/promises";
import path from "node:path";
import { cacheLife } from "next/cache";
import { experiences } from "@/models/experience.model";
import { certifications, education, profile } from "@/models/profile.model";
import { otherRepos, projects } from "@/models/project.model";
import { orbitTech, skillGroups, tech } from "@/models/skill.model";
import type { Project, RepoStats, Tech } from "@/models/types";
import { getRepoStats } from "@/services/github.service";
import { getMediaManifest } from "@/services/media.service";

const GITHUB_BASE = profile.links.github;

/** The repo README, read at build time and shown in the "How I built this" view. */
async function getReadme() {
  try {
    return await readFile(path.join(process.cwd(), "README.md"), "utf8");
  } catch {
    return `README not found. Read it on GitHub: ${profile.links.repo}#readme`;
  }
}

export interface ProjectViewModel extends Omit<Project, "stack"> {
  stack: Tech[];
  repoUrl?: string;
  stats?: RepoStats;
}

export type PortfolioViewModel = Awaited<ReturnType<typeof getPortfolio>>;

/**
 * Controller: combines the static models with live GitHub data
 * and shapes everything into what the views need to render.
 */
export async function getPortfolio() {
  "use cache";
  cacheLife("hours");

  const repoStats = await getRepoStats();
  const statsByName = new Map(repoStats.map((r) => [r.name.toLowerCase(), r]));

  const projectViews: ProjectViewModel[] = projects.map((p) => ({
    ...p,
    stack: p.stack.map(tech),
    repoUrl: p.repo ? `${GITHUB_BASE}/${p.repo}` : undefined,
    stats: p.repo ? statsByName.get(p.repo.toLowerCase()) : undefined,
  }));

  return {
    readme: await getReadme(),
    media: await getMediaManifest(),
    profile,
    experiences: experiences.map((e) => ({ ...e, stack: e.stack.map(tech) })),
    projects: projectViews,
    moreRepos: otherRepos.map((r) => ({ ...r, url: `${GITHUB_BASE}/${r.name}` })),
    skills: skillGroups.map((g) => ({ title: g.title, items: g.items.map(tech) })),
    orbit: orbitTech.map(tech),
    education,
    certifications,
    github: {
      publicRepos: repoStats.length,
      lastPush: repoStats.map((r) => r.pushedAt).sort().at(-1) ?? null,
    },
  };
}
