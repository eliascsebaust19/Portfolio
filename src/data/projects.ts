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
 */
export const projects: ProjectItem[] = [
  {
    id: "baust-exchange",
    indexLabel: "01",
    title: "BAUST Exchange",
    category: "Full-Stack Campus Marketplace & P2P Platform",
    isDemo: false,
    shortDescription:
      "A dedicated peer-to-peer campus marketplace for BAUST university students featuring verified student trading, barter requests, wanted board, and OCR ID card authentication.",
    thumbnail: "/images/projects/baust-exchange.png",
    thumbnailAlt:
      "BAUST Exchange peer-to-peer campus marketplace interface preview",
    technologies: [
      "Next.js 15",
      "TypeScript",
      "Tailwind CSS",
      "Prisma",
      "MySQL",
      "Auth.js",
      "Tesseract.js OCR",
    ],
    githubUrl: "https://github.com/eliascsebaust19/BaustExchange1",
    liveUrl: "https://baust-exchange.vercel.app/",
    overview:
      "BAUST Exchange is an authenticated, student-centric marketplace platform built to solve the clutter and fraud risks of unorganized social media buy-and-sell groups. Exclusively designed for Bangladesh Army University of Science and Technology (BAUST), it facilitates verified peer-to-peer trading of academic textbooks, drawing tools, electronics, and dorm essentials.",
    problemStatement:
      "Students seeking semester materials frequently face unvetted Facebook group posts, lack of category-wise search, scam risks, and messy negotiation channels without campus accountability.",
    features: [
      "Multi-type listings for Selling, Exchanging, or Free Donation giveaways",
      "Structured barter workflow with formal trade offers and dual confirmation",
      "Campus ISO (Wanted Board) with automatic keyword matchmaking alerts",
      "Direct 1-to-1 in-app messaging linked to listing contexts for safe on-campus handoffs",
      "Automated Student ID verification via server-side OCR (Tesseract.js + Sharp)",
      "Role-based access control (Student, Teacher, Admin) with Google OAuth 2.0",
    ],
    screenshots: [
      {
        src: "/images/projects/baust-exchange.png",
        caption: "BAUST Exchange Homepage & Filterable Marketplace Interface",
      },
      {
        src: "/images/projects/baust-exchange-detail.png",
        caption: "Marketplace Listings, Category Navigation & Search View",
      },
    ],
  },
  {
    id: "demo-study-planner",
    indexLabel: "02",
    title: "Academic Task & Study Planner",
    category: "Full-Stack Web Application",
    isDemo: true,
    shortDescription:
      "Structured course tracker, deadline planner, and responsive dark dashboard interface.",
    thumbnail: "/images/projects/demo-study-planner.svg",
    thumbnailAlt:
      "Demo preview of the Academic Task and Study Planner dashboard interface",
    technologies: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
    githubUrl: null,
    liveUrl: null,
    overview:
      "Academic Task & Study Planner is designed to demonstrate structured task management and course organization for university students.",
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
        caption: "Demo Dashboard & Task Organization Layout",
      },
    ],
  },
  {
    id: "demo-inventory-rest-api",
    indexLabel: "03",
    title: "Structured Resource & REST API Service",
    category: "Backend & Database Architecture",
    isDemo: true,
    shortDescription:
      "Clean REST API routing, request validation, and relational database persistence architecture.",
    thumbnail: "/images/projects/demo-inventory-api.svg",
    thumbnailAlt:
      "Demo preview of REST API endpoints and structured JSON response schema",
    technologies: ["Node.js", "REST API", "PostgreSQL", "Git"],
    githubUrl: null,
    liveUrl: null,
    overview:
      "A demonstration of robust backend design, API contracts, schema validation, and database queries for scalable web applications.",
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
        caption: "Demo Endpoint Map & JSON Response Structure",
      },
    ],
  },
];
