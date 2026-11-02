import type { Certification, Education, Profile } from "./types";

export const profile: Profile = {
  name: "Athul Babu Teeyancheri",
  shortName: "Athul",
  headline: "Full Stack Software Developer",
  roles: [
    "Full Stack Software Developer",
    "React & Node.js Engineer",
    "Ruby on Rails Developer",
    "AI / ML Tinkerer",
  ],
  location: "Ontario, Canada",
  summary: [
    "I build production web apps end-to-end, from React interfaces to Node.js and Rails APIs, containerized with Docker and shipped through CI/CD.",
    "My path started in robotics and machine learning in India, training YOLO models on a Raspberry Pi and wiring up RC cars. I moved to Canada to go deep on software engineering, and since then I've shipped real products for real businesses.",
    "I care about clean APIs, accessible mobile-first UIs, and tests that catch things before users do. I also use AI tools like Claude Code and GitHub Copilot every day to move faster.",
  ],
  email: "athuljr240701@gmail.com",
  links: {
    github: "https://github.com/Athulbt",
    linkedin: "https://www.linkedin.com/in/athulbabu",
    repo: "https://github.com/Athulbt/athul-portfolio",
  },
};

export const education: Education[] = [
  {
    id: "lambton",
    credential: "Ontario Graduate Certificate, Full Stack Software Development",
    school: { name: "Lambton College", url: "https://www.lambtoncollege.ca", logo: "/logos/company/lambton-college.webp", initials: "LC" },
    location: "Sarnia, Ontario",
    period: "2024 – 2026",
    detail: "Full stack JavaScript, C#/.NET, Java EE, databases, DevOps and cloud. Dean's Honour List.",
  },
  {
    id: "yenepoya",
    credential: "Bachelor of Computer Applications, Robotics, AI & Machine Learning",
    school: { name: "Yenepoya Institution of Science", url: "https://www.yenepoya.edu.in", logo: "/logos/company/yenepoya.png", initials: "YI" },
    location: "Karnataka, India",
    period: "Graduated 2023",
    detail: "Artificial intelligence, machine learning and computer vision, with hands-on robotics projects.",
  },
];

export const certifications: Certification[] = [
  { code: "AZ-900", name: "Azure Fundamentals" },
  { code: "AI-900", name: "Azure AI Fundamentals" },
  { code: "DP-900", name: "Azure Data Fundamentals" },
  { code: "PL-900", name: "Power Platform Fundamentals" },
  { code: "SC-900", name: "Security, Compliance & Identity" },
];
