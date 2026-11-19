export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  issuerOrg: string;
  type: "Hackathon Achievement" | "Professional Certification";
  date: string;
  credentialId?: string;
  badgeText: string;
  description: string;
  image: string;
  pdfUrl: string;
  signatories?: string[];
  skills: string[];
}

export interface HackathonGalleryItem {
  id: string;
  title: string;
  caption: string;
  image: string;
  category: "Software" | "Team" | "Official" | "Event";
}

export const certificates: CertificateItem[] = [
  {
    id: "diu-ai-hackathon-2026",
    title: "AI Hackathon @ AI Dev Fest 2026",
    issuer: "DIU CPC & Department of CSE, Daffodil International University",
    issuerOrg: "In collaboration with Upay (UCB Fintech Company Limited)",
    type: "Hackathon Achievement",
    date: "October 7, 2026",
    badgeText: "Certificate of Appreciation / Achievement",
    description:
      "Awarded to Team Loading_211 (Md Elias Ahmad, Suaib Islam, and Md. Sayadul Islam from BAUST) for active participation and innovation in the national AI Hackathon at AI Dev Fest 2026, held at Daffodil Smart City.",
    image: "/certificates/diu-ai-hackathon-certificate.png",
    pdfUrl: "/certificates/diu-ai-hackathon-2026-certificate.pdf",
    signatories: [
      "Dr. Sheak Rashed Haider Noori — Professor & Head, Dept. of CSE, DIU",
      "Mayen Uddin Mojumdar — Assistant Professor, Dept. of CSE; Convenor, DIU CPC",
      "Mohammad Mamun Reza Khan — Head of Product & Technology, upay, UCB Fintech; Judging Director, AI Hackathon",
    ],
    skills: [
      "AI & Machine Learning",
      "Fintech Fraud Detection",
      "FastAPI Live Telemetry",
      "Team Loading_211",
      "BAUST Representative",
    ],
  },
  {
    id: "bohubrihi-software-engineering",
    title: "Pathway to Software Engineering",
    issuer: "BOHUBRIHI",
    issuerOrg: "Shikho Technologies Bangladesh Ltd.",
    type: "Professional Certification",
    date: "November 8, 2026",
    credentialId: "6aefe4db60143534454f7a38",
    badgeText: "Certificate of Completion",
    description:
      "Successfully completed the comprehensive Pathway to Software Engineering program covering modern software engineering fundamentals, structured architecture, and industry-grade engineering practices.",
    image: "/certificates/bohubrihi-certificate.png",
    pdfUrl: "/certificates/bohubrihi-pathway-to-software-engineering.pdf",
    signatories: [
      "Shahir Chowdhury — Founder and CEO, Shikho Technologies Bangladesh Ltd.",
    ],
    skills: [
      "Software Engineering",
      "System Architecture",
      "Data Structures & Algorithms",
      "Industry Best Practices",
      "Clean Code",
    ],
  },
];

export const hackathonGallery: HackathonGalleryItem[] = [
  {
    id: "app-screen",
    title: "Upay RiskIntel Live Application",
    caption:
      "Evaluator Sandbox Toolbar and Live Telemetry Inspector running on workstation during the hackathon",
    image: "/images/hackathon-diu/upay-riskintel-app.jpeg",
    category: "Software",
  },
  {
    id: "desk-placard",
    title: "Official Hackathon Desk Placard",
    caption:
      "Team 067 Loading_211 official table identification with judge verification signature (MKR 07.10.2026)",
    image: "/images/hackathon-diu/hackathon-desk-placard.jpeg",
    category: "Official",
  },
  {
    id: "team-coding",
    title: "Team Loading_211 in Active Development",
    caption:
      "Md Elias Ahmad and team developing fraud detection telemetry heuristics and FastAPI endpoints",
    image: "/images/hackathon-diu/team-loading211-hacking.jpeg",
    category: "Team",
  },
  {
    id: "team-workstation",
    title: "Hackathon Workstation Setup",
    caption:
      "Collaborative development setup with real-time testing laptops at Daffodil Smart City",
    image: "/images/hackathon-diu/team-loading211-workstation.jpeg",
    category: "Event",
  },
  {
    id: "team-discussion",
    title: "Architecture & Telemetry Discussion",
    caption:
      "Fine-tuning ATO attack detection rules and simulated network velocity parameters",
    image: "/images/hackathon-diu/team-loading211-discussion.jpeg",
    category: "Team",
  },
  {
    id: "elias-portrait",
    title: "Md Elias Ahmad @ AI Dev Fest 2026",
    caption:
      "Md Elias Ahmad representing BAUST at the national AI Dev Fest 2026, Daffodil International University",
    image: "/images/hackathon-diu/elias-ahmad-ai-dev-fest.jpeg",
    category: "Event",
  },
];
