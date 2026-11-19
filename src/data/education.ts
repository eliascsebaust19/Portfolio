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
      "Undergraduate CSE studies — programming, data structures, algorithms, databases, and software systems.",
    tags: ["CSE", "BAUST", "Core CS", "Software Engineering"],
  },
  {
    id: "bohubrihi-se",
    period: "Nov 2026",
    title: "Pathway to Software Engineering Certification",
    organization: "BOHUBRIHI (Shikho Technologies)",
    location: "Verified Credential",
    type: "Development",
    description:
      "Earned official Certificate of Completion in Software Engineering principles, architecture, and industry practices (ID: 6aefe4db60143534454f7a38).",
    tags: ["Bohubrihi", "Software Engineering", "Verified ID", "System Design"],
  },
  {
    id: "diu-ai-hackathon",
    period: "Oct 2026",
    title: "AI Hackathon @ AI Dev Fest 2026",
    organization:
      "Daffodil International University (DIU CPC) & Upay (UCB Fintech)",
    location: "Daffodil Smart City, Dhaka",
    type: "Development",
    description:
      "Competed as Team Loading_211 representing BAUST. Developed and pitched Upay RiskIntel — an AI trust & fraud intelligence platform.",
    tags: ["AI Dev Fest 2026", "DIU", "Upay Fintech", "Team Loading_211", "Awarded"],
  },
  {
    id: "flutter-devops-exploration",
    period: "Continuous Practice",
    title: "Full-Stack Web & Flutter Mobile Development",
    organization: "Self-Directed Engineering & Hands-on Builds",
    type: "Learning Focus",
    description:
      "Cross-platform mobile apps with Flutter & Dart (AdoptMatch), full-stack web platforms (BAUST Exchange), and FastAPI/Node.js backends.",
    tags: ["Flutter & Dart", "Next.js & React", "FastAPI & Python", "MySQL & Prisma"],
  },
];

export const experienceItems: ExperienceItem[] = [
  {
    id: "hackathon-team-lead",
    period: "Oct 2026",
    role: "Hackathon Team Lead & Core Developer",
    company: "AI Dev Fest 2026 Hackathon (DIU & Upay)",
    description:
      "Led Team Loading_211 in developing Upay RiskIntel — an AI trust & fraud intelligence prototype with live telemetry inspector, ATO attack simulation, and FastAPI backend.",
  },
];
