import type { Experience } from "./types";

export const experiences: Experience[] = [
  {
    id: "lwp",
    role: "Full Stack Software Developer",
    type: "Freelance",
    company: { name: "Lambton Window Pros", url: "https://www.lambtonwindowpros.ca", logo: "/logos/company/lambton-window-pros.png", initials: "LW" },
    location: "Ontario, Canada",
    start: "May 2026",
    end: "Present",
    current: true,
    highlights: [
      "Designed and shipped the company's official website, which lifted online appointment bookings by 30%.",
      "Built the React front end and a Node.js / Express REST API for appointment management.",
      "Added a secure admin dashboard with role-based access, booking management and automated email notifications.",
      "Containerized with Docker Compose and automated testing and releases with CI/CD.",
    ],
    stack: ["react", "javascript", "nodejs", "express", "docker", "githubactions", "claude"],
  },
  {
    id: "ndr",
    role: "Full Stack Software Developer",
    company: { name: "Next Door Rental", url: "https://nextdoorrental.com", logo: "/logos/company/next-door-rental.png", initials: "ND" },
    location: "Petrolia, Ontario",
    start: "Jan 2026",
    end: "Apr 2026",
    highlights: [
      "Built and maintained production Ruby on Rails features with event-driven background jobs and real-time updates.",
      "Created mobile-first, accessible UIs with Tailwind CSS and Stimulus.js.",
      "Led root-cause analysis on 25+ production incidents, fixing them by severity to keep lenders and renters online.",
      "Reviewed teammates' code, maintained automated tests and helped run backlog refinement.",
    ],
    stack: ["rails", "ruby", "tailwindcss", "stimulusjs", "git"],
    quote: {
      text: "Athul demonstrated strong problem-solving skills and contributed to frontend development... with a focus on mobile-first, accessible UI implementation.",
      author: "Jordan Huzevka, CEO / Co-Founder",
    },
  },
  {
    id: "rinex",
    role: "Data Science Intern",
    company: { name: "Rinex Technologies", url: "https://rinex.ai", logo: "/logos/company/rinex.png", initials: "RX" },
    location: "Bangalore, India",
    start: "Sep 2022",
    end: "Nov 2022",
    highlights: [
      "Built data analysis and computer vision solutions with Python and OpenCV.",
      "Owned end-to-end preprocessing of client datasets and contributed to data pipelines.",
    ],
    stack: ["python", "opencv", "pandas", "numpy"],
  },
  {
    id: "cognitive",
    role: "Machine Learning Intern",
    company: { name: "Cognitive Solutions", url: "https://cognitivesolution.in", initials: "CS" },
    location: "Mangalore, India",
    start: "May 2022",
    end: "Jul 2022",
    highlights: [
      "Built and evaluated supervised and unsupervised models with Pandas and NumPy.",
      "Owned testing, debugging and documentation across the model lifecycle.",
    ],
    stack: ["python", "pandas", "numpy", "matplotlib"],
  },
];
