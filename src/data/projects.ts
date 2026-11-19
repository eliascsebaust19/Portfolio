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
  apkUrl?: string | null;
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
      "Peer-to-peer campus marketplace for BAUST students — verified trading, barter, wanted board, and OCR ID verification.",
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
      "Authenticated marketplace for BAUST students to trade textbooks, electronics, and dorm essentials safely — with barter workflow, wanted board, and OCR-based ID verification.",
    problemStatement:
      "Unvetted social-media buy/sell groups mean scams, messy negotiation, and no campus accountability.",
    features: [
      "Sell, exchange, or donate listings",
      "Barter workflow with dual confirmation",
      "Wanted board with keyword match alerts",
      "1-to-1 in-app messaging",
      "OCR student ID verification (Tesseract.js)",
      "Role-based access + Google OAuth",
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
    id: "adoptmatch",
    indexLabel: "02",
    title: "AdoptMatch — Pet Adoption & Rescue App",
    category: "Flutter Cross-Platform Mobile Application (Android & iOS)",
    isDemo: false,
    shortDescription:
      "Flutter pet adoption app with swipe-and-match, compatibility quiz, and shelter messaging.",
    thumbnail: "/images/projects/adoptmatch/adoptmatch-banner.png",
    thumbnailAlt:
      "AdoptMatch Flutter mobile app showcase presenting Home dashboard, Swipe & Match, and Explore feed",
    technologies: [
      "Flutter",
      "Dart",
      "Firebase",
      "REST API",
      "Provider",
      "Material Design 3",
      "Android SDK",
    ],
    githubUrl: "https://github.com/eliascsebaust19/AdoptMatch",
    liveUrl: null,
    apkUrl: "/apk/AdoptMatch.apk",
    overview:
      "Cross-platform Flutter app connecting adopters with rescued pets via swipe gestures, a compatibility quiz, verified shelters, and real-time request tracking.",
    problemStatement:
      "Scattered social-media posts slow adoption and cause mismatched pet-owner lifestyles.",
    features: [
      "Swipe & match card interface",
      "5-step lifestyle compatibility quiz",
      "Home dashboard with category & distance filters",
      "AI pet advisor for breed & care tips",
      "Digital pet passport (vaccines, microchip)",
      "Real-time adoption requests & shelter chat",
    ],
    screenshots: [
      {
        src: "/images/projects/adoptmatch/adoptmatch-banner.png",
        caption: "AdoptMatch Mobile Suite — Home Feed, Gesture Swipe Match, and Explore Views",
      },
      {
        src: "/images/projects/adoptmatch/adoptmatch-home.jpeg",
        caption: "AdoptMatch Home Dashboard — Category Filters, Adoption Stats & Recommendations",
      },
      {
        src: "/images/projects/adoptmatch/adoptmatch-swipe.jpeg",
        caption: "Interactive Swipe & Match Interface — Rescue Profile with Health & Compatibility Badges",
      },
      {
        src: "/images/projects/adoptmatch/adoptmatch-feed.jpeg",
        caption: "Personalized Explore Feed & AI Pet Advisor Interface",
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
      "Clean REST routing, validation, and relational DB persistence.",
    thumbnail: "/images/projects/demo-inventory-api.svg",
    thumbnailAlt:
      "Demo preview of REST API endpoints and structured JSON response schema",
    technologies: ["Node.js", "REST API", "PostgreSQL", "Git"],
    githubUrl: null,
    liveUrl: null,
    overview:
      "Backend design demo — API contracts, schema validation, and database queries for scalable apps.",
    problemStatement:
      "Clients need predictable HTTP contracts and consistent validation errors as features grow.",
    features: [
      "REST endpoints with standard status codes",
      "Schema validation + structured JSON errors",
      "Paginated queries (PostgreSQL / MySQL)",
      "Ready to link to live repos & API docs",
    ],
    screenshots: [
      {
        src: "/images/projects/demo-inventory-api.svg",
        caption: "Demo Endpoint Map & JSON Response Structure",
      },
    ],
  },
];
