// Domain types shared by models, controllers and views.

export type TechId =
  | "react" | "nextjs" | "nodejs" | "express" | "rails" | "mongodb" | "postgresql" | "mysql"
  | "docker" | "githubactions" | "tailwindcss" | "javascript" | "typescript" | "python" | "ruby"
  | "opencv" | "tensorflow" | "keras" | "pandas" | "numpy" | "dotnetcore" | "csharp" | "azure"
  | "java" | "postman" | "jira" | "git" | "github" | "vitejs" | "bootstrap" | "django"
  | "raspberrypi" | "jest" | "html5" | "css3" | "c" | "intellij" | "vscode" | "amazonwebservices"
  | "matplotlib" | "junit" | "maven" | "unity" | "pug" | "stimulusjs" | "jwt" | "githubcopilot" | "claude";

export interface Tech {
  id: TechId;
  name: string;
}

export interface Profile {
  name: string;
  shortName: string;
  headline: string;
  roles: string[];
  location: string;
  summary: string[];
  photo: string; // shown only in the About section
  email: string;
  links: { github: string; linkedin: string; repo: string };
}

export interface Company {
  name: string;
  url?: string;
  logo?: string; // path under /public; falls back to initials
  initials: string;
}

export interface Experience {
  id: string;
  role: string;
  type?: string;
  company: Company;
  location: string;
  start: string;
  end: string;
  current?: boolean;
  highlights: string[];
  stack: TechId[];
  quote?: { text: string; author: string };
}

export interface CodeHighlight {
  file: string;
  language: string;
  code: string;
  notes: string[];
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  emoji: string;
  logo?: string;
  category: "Client" | "Full Stack" | "AI / ML" | "Hardware" | "Web";
  description: string;
  stack: TechId[];
  repo?: string; // GitHub repo name under the profile, used for live stats
  liveUrl?: string;
  privateNote?: string;
  architecture: string[];
  highlight?: CodeHighlight;
  featured?: boolean;
}

export interface RepoStats {
  name: string;
  url: string;
  language: string | null;
  pushedAt: string;
  stars: number;
}

export interface Education {
  id: string;
  credential: string;
  school: Company;
  location: string;
  period: string;
  detail: string;
}

export interface Certification {
  code: string;
  name: string;
}

export interface SkillGroup {
  title: string;
  items: TechId[];
}
