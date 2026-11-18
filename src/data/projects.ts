export interface ProjectItem {
  id: string;
  indexLabel: string;
  title: string;
  category: string;
  isDemo: boolean;
  shortDescription: string;
  thumbnail: string;
  thumbnailAlt: string;
  technologies: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  overview: string;
  problemStatement: string;
  features: string[];
  screenshots: { src: string; caption: string }[];
}

/**
 * Centralized Project Showcase Data
 *
 * Currently configured with 2 clearly labeled temporary demo placeholders.
 * Replace or append entries in this array when final projects are ready
 * (for example: BAUST Exchange, AdoptMatch, Family Card Distribution System,
 * Community Center Booking System, or Our Cousins Family App) without modifying
 * any component code.
 */
export const projects: ProjectItem[] = [
  {
    id: "demo-study-planner",
    indexLabel: "01",
    title: "Academic Task & Study Planner",
    category: "Full-Stack Web Application · Demo Placeholder",
    isDemo: true,
    shortDescription:
      "Temporary demo project layout showcasing a structured course tracker, deadline planner, and responsive dark dashboard interface.",
    thumbnail: "/images/projects/demo-study-planner.svg",
    thumbnailAlt:
      "Demo preview of the Academic Task and Study Planner dashboard interface",
    technologies: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
    githubUrl: null,
    liveUrl: null,
    overview:
      "This is a temporary demo placeholder entry designed to demonstrate the portfolio's project card and detailed modal structure. Once final projects are selected, this entry can be swapped directly inside src/data/projects.ts.",
    problemStatement:
      "Students managing multiple university courses, lab assignments, and project milestones often scatter deadlines across separate notes, making weekly prioritization harder.",
    features: [
      "Course-wise task grouping with priority status indicators",
      "Relational MySQL schema concept for courses, milestones, and notes",
      "Responsive layout tailored for desktop and mobile study sessions",
      "Configurable repository and live deployment links in centralized data",
    ],
    screenshots: [
      {
        src: "/images/projects/demo-study-planner.svg",
        caption: "Demo Dashboard & Task Organization Layout (Placeholder Preview)",
      },
    ],
  },
  {
    id: "demo-inventory-rest-api",
    indexLabel: "02",
    title: "Structured Resource & REST API Service",
    category: "Backend & Database Architecture · Demo Placeholder",
    isDemo: true,
    shortDescription:
      "Temporary demo project layout illustrating clean REST API routing, request validation, and relational database persistence.",
    thumbnail: "/images/projects/demo-inventory-api.svg",
    thumbnailAlt:
      "Demo preview of REST API endpoints and structured JSON response schema",
    technologies: ["Node.js", "REST API", "PostgreSQL", "Git"],
    githubUrl: null,
    liveUrl: null,
    overview:
      "This is a temporary demo placeholder entry showcasing how backend-focused projects, API architectures, and database workflows are presented in the portfolio before final project URLs and screenshots are added.",
    problemStatement:
      "Frontend and mobile clients require predictable HTTP contracts, consistent validation errors, and well-indexed relational tables to stay reliable as features grow.",
    features: [
      "Resource-oriented REST endpoints with standard HTTP status codes",
      "Schema validation layer and structured JSON error responses",
      "Paginated query patterns backed by PostgreSQL / MySQL",
      "Ready to link directly to live GitHub repositories and API docs",
    ],
    screenshots: [
      {
        src: "/images/projects/demo-inventory-api.svg",
        caption: "Demo Endpoint Map & JSON Response Structure (Placeholder Preview)",
      },
    ],
  },
];
