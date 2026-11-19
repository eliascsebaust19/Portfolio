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
    id: "upay-riskintel",
    indexLabel: "03",
    title: "Upay RiskIntel — AI Trust & Risk Intelligence",
    category: "AI Hackathon Project (Fintech Fraud Analytics)",
    isDemo: false,
    shortDescription:
      "AI-powered fintech fraud detection and risk telemetry platform built at the AI Hackathon (AI Dev Fest 2026, DIU) for Upay / UCB Fintech by Team Loading_211.",
    thumbnail: "/images/hackathon-diu/upay-riskintel-banner.png",
    thumbnailAlt:
      "Upay RiskIntel fintech fraud detection platform developed for AI Dev Fest Hackathon",
    technologies: [
      "Python",
      "FastAPI",
      "Machine Learning",
      "Fintech API",
      "Risk Scoring",
      "React",
      "Live Telemetry",
    ],
    githubUrl: "https://github.com/eliascsebaust19/Upay-RiskIntel",
    liveUrl: null,
    overview:
      "Upay RiskIntel is an AI-powered trust and fraud intelligence system developed during the national AI Hackathon at AI Dev Fest 2026, organized by DIU CPC under the Department of CSE, Daffodil International University in collaboration with Upay (UCB Fintech Company Limited). Built by Team Loading_211, the system monitors transaction streams in real time to detect anomalous velocity spikes, account takeover (ATO) attacks, and midnight cashout patterns.",
    problemStatement:
      "Digital financial services in Bangladesh face rapid, sophisticated fraud attempts such as SIM-swap account takeovers and automated midnight cashouts that traditional static rule engines fail to catch in real time.",
    features: [
      "Real-time Telemetry Inspector calculating velocity, failure rates, and agent-distance metrics",
      "Evaluator Sandbox Toolbar with instant test scenarios: Normal P2P, ATO Attack, and Midnight Cashout",
      "Upay Trust & Risk AI Shield with adaptive scoring threshold and automated threat alerts",
      "Integrated mobile simulator showing real-time impact on user wallet balance & transaction validation",
      "High-throughput FastAPI backend architecture with async live evaluation pipelines",
      "Recognized with Certificate of Appreciation / Achievement by DIU & Upay leadership",
    ],
    screenshots: [
      {
        src: "/images/hackathon-diu/upay-riskintel-banner.png",
        caption: "Upay RiskIntel — Live Application, Hackathon Session & Official Certificate",
      },
      {
        src: "/images/hackathon-diu/upay-riskintel-app.jpeg",
        caption: "Upay RiskIntel Telemetry Inspector & Evaluator Sandbox on Live Workstation",
      },
      {
        src: "/images/hackathon-diu/hackathon-desk-placard.jpeg",
        caption: "Official DIU AI Hackathon Desk Placard (Team 067 Loading_211) Signed by Judge",
      },
      {
        src: "/images/hackathon-diu/team-loading211-hacking.jpeg",
        caption: "Team Loading_211 in Active Development & Algorithm Implementation",
      },
      {
        src: "/certificates/diu-ai-hackathon-certificate.png",
        caption: "Official Certificate of Appreciation / Achievement from DIU & Upay",
      },
    ],
  },
];
