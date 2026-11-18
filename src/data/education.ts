export interface TimelineMilestone {
  id: string;
  period: string;
  title: string;
  organization: string;
  location?: string;
  type: "Education" | "Development" | "Learning Focus";
  description: string;
  tags: string[];
}

export interface ExperienceItem {
  id: string;
  period: string;
  role: string;
  company: string;
  description: string;
}

export const educationMilestones: TimelineMilestone[] = [
  {
    id: "baust-cse",
    period: "Ongoing",
    title: "B.Sc. in Computer Science and Engineering (CSE)",
    organization:
      "Bangladesh Army University of Science and Technology (BAUST)",
    location: "Bangladesh",
    type: "Education",
    description:
      "Pursuing undergraduate studies in Computer Science and Engineering — building core foundations in programming, data structures, algorithms, databases, and software systems.",
    tags: ["CSE", "BAUST", "Core CS", "Software Engineering"],
  },
  {
    id: "web-backend-practice",
    period: "Continuous Practice",
    title: "Web & Backend Development Foundations",
    organization: "Self-Directed Engineering & Coursework",
    type: "Development",
    description:
      "Practicing frontend fundamentals (HTML, CSS, JavaScript), server-side development with PHP and Node.js, relational databases (MySQL, PostgreSQL), and REST API design.",
    tags: ["HTML/CSS/JS", "PHP & Node.js", "MySQL & PostgreSQL", "REST API"],
  },
  {
    id: "flutter-devops-exploration",
    period: "Current Interest",
    title: "Exploring Flutter Mobile Development & DevOps",
    organization: "Personal Technical Growth",
    type: "Learning Focus",
    description:
      "Expanding technical curiosity toward cross-platform mobile application development with Flutter alongside modern DevOps practices, Git workflows, and deployment pipelines.",
    tags: ["Flutter Interest", "DevOps Interest", "Git & GitHub"],
  },
];

/**
 * Configurable Professional Experience List
 * Keep empty until confirmed internships or employment roles are added.
 */
export const experienceItems: ExperienceItem[] = [];
