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
    id: "adoptmatch",
    indexLabel: "02",
    title: "AdoptMatch — Pet Adoption & Rescue App",
    category: "Flutter Cross-Platform Mobile Application (Android & iOS)",
    isDemo: false,
    shortDescription:
      "A modern Flutter & Dart mobile application for pet adoption, smart matchmaking with Tinder-style swipe cards, lifestyle compatibility quiz, and direct shelter communication.",
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
      "AdoptMatch is a production-grade cross-platform mobile application developed with Flutter and Dart to revolutionize pet rescue and adoption. Designed with an engaging, user-first UI, it connects compassionate adopters with rescued animals through intuitive Tinder-style swipe gestures, compatibility quizzes, verified shelter profiles, and real-time adoption request tracking.",
    problemStatement:
      "Traditional pet adoption processes in shelters are fragmented across scattered social media posts, leading to delayed responses, low adoption completion rates, and mismatched pet-owner lifestyles.",
    features: [
      "Tinder-style 'Swipe & Match' card interface with gesture-driven likes, passes, and quick pet information inspection",
      "5-step Lifestyle & Compatibility Quiz calculating percentage match based on living space, activity level, and family setup",
      "Interactive Home Dashboard with categorized pet browsing (Dogs, Cats, Birds, Rabbits) and distance-based filtering",
      "Integrated AI Pet Advisor floating assistant to recommend suitable breeds, care tips, and training guidance",
      "Digital Pet Passport tracking vaccination statuses, microchip numbers, spay/neuter history, and urgency tags",
      "Real-time adoption request lifecycle management and in-app direct shelter communication",
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
