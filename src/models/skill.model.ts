import type { SkillGroup, Tech, TechId } from "./types";

const names: Record<TechId, string> = {
  react: "React", nextjs: "Next.js", nodejs: "Node.js", express: "Express", rails: "Ruby on Rails",
  mongodb: "MongoDB", postgresql: "PostgreSQL", mysql: "MySQL", docker: "Docker",
  githubactions: "GitHub Actions", tailwindcss: "Tailwind CSS", javascript: "JavaScript",
  typescript: "TypeScript", python: "Python", ruby: "Ruby", opencv: "OpenCV", tensorflow: "TensorFlow",
  keras: "Keras", pandas: "Pandas", numpy: "NumPy", dotnetcore: ".NET", csharp: "C#", azure: "Azure",
  java: "Java", postman: "Postman", jira: "Jira", git: "Git", github: "GitHub", vitejs: "Vite",
  bootstrap: "Bootstrap", django: "Django", raspberrypi: "Raspberry Pi", jest: "Jest", html5: "HTML5",
  css3: "CSS3", c: "C", intellij: "IntelliJ IDEA", vscode: "VS Code", amazonwebservices: "AWS",
  matplotlib: "Matplotlib", junit: "JUnit", maven: "Maven", unity: "Unity", pug: "Pug",
  stimulusjs: "Stimulus", jwt: "JWT", githubcopilot: "GitHub Copilot", claude: "Claude Code",
};

export const tech = (id: TechId): Tech => ({ id, name: names[id] });

export const skillGroups: SkillGroup[] = [
  { title: "Languages", items: ["javascript", "typescript", "python", "ruby", "java", "csharp", "c"] },
  { title: "Frontend", items: ["react", "nextjs", "tailwindcss", "stimulusjs", "bootstrap", "vitejs", "html5", "css3"] },
  { title: "Backend", items: ["nodejs", "express", "rails", "dotnetcore", "django", "jwt"] },
  { title: "Databases", items: ["mongodb", "postgresql", "mysql"] },
  { title: "Cloud & DevOps", items: ["azure", "amazonwebservices", "docker", "githubactions", "git", "github"] },
  { title: "AI & ML", items: ["tensorflow", "keras", "opencv", "pandas", "numpy", "matplotlib"] },
  { title: "Tools", items: ["vscode", "intellij", "postman", "jira", "jest", "junit", "maven", "claude", "githubcopilot"] },
];

// Logos that orbit the avatar in the hero.
export const orbitTech: TechId[] = ["react", "nodejs", "rails", "mongodb", "docker", "azure", "python", "typescript"];
