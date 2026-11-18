export type TechCategory =
  | "Frontend"
  | "Backend"
  | "Database"
  | "Development Tools"
  | "APIs";

export type TechStage = "Learning" | "Practicing" | "Familiar With";

export interface TechnologyItem {
  id: string;
  name: string;
  shortLabel: string;
  category: TechCategory;
  stage: TechStage;
  accent: string;
  summary: string;
}

export const TECH_CATEGORIES: ("All" | TechCategory)[] = [
  "All",
  "Frontend",
  "Backend",
  "Database",
  "Development Tools",
  "APIs",
];

export const TECH_STAGES: ("All" | TechStage)[] = [
  "All",
  "Familiar With",
  "Practicing",
  "Learning",
];

export const technologies: TechnologyItem[] = [
  {
    id: "html",
    name: "HTML",
    shortLabel: "HTML5",
    category: "Frontend",
    stage: "Familiar With",
    accent: "#E34F26",
    summary: "Semantic document structure, accessibility landmarks, and SEO markup.",
  },
  {
    id: "css",
    name: "CSS",
    shortLabel: "CSS3",
    category: "Frontend",
    stage: "Familiar With",
    accent: "#264DE4",
    summary: "Responsive layouts, Flexbox, Grid, custom properties, and UI transitions.",
  },
  {
    id: "javascript",
    name: "JavaScript",
    shortLabel: "JS",
    category: "Frontend",
    stage: "Practicing",
    accent: "#F7DF1E",
    summary: "DOM interactivity, asynchronous fetch flows, and modern ES6+ patterns.",
  },
  {
    id: "php",
    name: "PHP",
    shortLabel: "PHP",
    category: "Backend",
    stage: "Practicing",
    accent: "#777BB4",
    summary: "Server-side request handling, form processing, and relational DB integration.",
  },
  {
    id: "nodejs",
    name: "Node.js",
    shortLabel: "Node",
    category: "Backend",
    stage: "Learning",
    accent: "#5FA04E",
    summary: "Event-driven JavaScript runtime for backend services and API tooling.",
  },
  {
    id: "mysql",
    name: "MySQL",
    shortLabel: "MySQL",
    category: "Database",
    stage: "Practicing",
    accent: "#00758F",
    summary: "Structured relational tables, joins, constraints, and query writing.",
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    shortLabel: "PgSQL",
    category: "Database",
    stage: "Learning",
    accent: "#336791",
    summary: "Advanced relational modeling, indexing, and transactional SQL queries.",
  },
  {
    id: "git",
    name: "Git",
    shortLabel: "Git",
    category: "Development Tools",
    stage: "Familiar With",
    accent: "#F05032",
    summary: "Branching, commit history hygiene, and collaborative version control.",
  },
  {
    id: "github",
    name: "GitHub",
    shortLabel: "GitHub",
    category: "Development Tools",
    stage: "Familiar With",
    accent: "#E2E8F0",
    summary: "Repository hosting, pull requests, issue tracking, and project documentation.",
  },
  {
    id: "vscode",
    name: "VS Code",
    shortLabel: "VS Code",
    category: "Development Tools",
    stage: "Familiar With",
    accent: "#007ACC",
    summary: "Primary development environment, debugging tools, and workflow extensions.",
  },
  {
    id: "rest-api",
    name: "REST API",
    shortLabel: "REST",
    category: "APIs",
    stage: "Practicing",
    accent: "#00E5FF",
    summary: "Designing and consuming JSON endpoints with clear HTTP semantics.",
  },
];
