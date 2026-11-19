export interface WhatIDoItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  focusAreas: string[];
  icon: "globe" | "server" | "code" | "database" | "cpu" | "smartphone";
}

export interface AvatarOption {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  badge?: string;
  glbPath: string;
}

export const profile = {
  monogram: "EA",
  name: "ELIAS AHMAD",
  fullName: "Elias Ahmad",
  brandTitle: "Elias Ahmad — Developer Portfolio",
  greeting: "Hello, I'm",
  introSubtitle: "CSE Student | Developer | Technology Enthusiast",
  dynamicRoles: [
    "Flutter Mobile App Developer",
    "Software Developer",
    "Web Developer",
    "Backend Developer",
    "Problem Solver",
  ],
  university: "Bangladesh Army University of Science and Technology (BAUST)",
  universityShort: "BAUST",
  department: "Computer Science and Engineering (CSE)",
  location: "Bangladesh",
  avatar: {
    glbPath: "/models/avatar-01.glb",
    fallbackImage: "/images/profile/avatar-fallback.svg",
    alt: "Elias Ahmad 3D developer avatar stage",
    models: [
      {
        id: "avatar-01",
        label: "Avatar 01",
        title: "Executive Idle",
        subtitle: "Natural Lifelike Standing & Breathing",
        badge: "Idle",
        glbPath: "/models/avatar-01.glb",
      },
      {
        id: "avatar-02",
        label: "Avatar 02",
        title: "Developer Greeting",
        subtitle: "Friendly Gesture & Welcoming Pose",
        badge: "Greeting",
        glbPath: "/models/avatar-02.glb",
      },
      {
        id: "avatar-03",
        label: "Avatar 03",
        title: "Dynamic Action",
        subtitle: "Expressive Performance & Energy",
        badge: "Action",
        glbPath: "/models/avatar-03.glb",
      },
    ] as AvatarOption[],
  },
  about: {
    headline: "Building practical software & mobile apps.",
    paragraphs: [
      "CSE student at BAUST and aspiring software engineer. I build practical web and mobile apps with clean, maintainable code.",
      "Core focus: Flutter mobile apps, full-stack web, and backend engineering.",
    ],
    highlights: [
      { label: "Institution", value: "BAUST" },
      { label: "Department", value: "Computer Science & Engineering" },
      { label: "Mobile Focus", value: "Flutter & Dart (Android & iOS)" },
      { label: "Web & Backend", value: "React, Node.js, PHP & Relational DBs" },
    ],
  },
  whatIDo: [
    {
      id: "mobile-development",
      title: "Flutter Mobile App Development",
      subtitle: "Cross-Platform Android & iOS",
      description:
        "Native-compiled Android & iOS apps from a single Flutter codebase.",
      focusAreas: ["Flutter", "Dart", "State Management", "Cross-Platform UI"],
      icon: "smartphone",
    },
    {
      id: "web-development",
      title: "Web Development",
      subtitle: "Frontend & Interactive Interfaces",
      description:
        "Clean, responsive interfaces with HTML, CSS, and JavaScript.",
      focusAreas: ["HTML & CSS", "JavaScript", "Responsive UI"],
      icon: "globe",
    },
    {
      id: "backend-development",
      title: "Backend Development",
      subtitle: "Server Logic & APIs",
      description:
        "Server logic, auth flows, and REST APIs with PHP & Node.js.",
      focusAreas: ["PHP", "Node.js", "REST APIs"],
      icon: "server",
    },
    {
      id: "software-development",
      title: "Software Development",
      subtitle: "Practical Digital Solutions",
      description:
        "Turning everyday problems into practical, maintainable apps.",
      focusAreas: ["Architecture", "Version Control", "Clean Code"],
      icon: "code",
    },
    {
      id: "database-management",
      title: "Database Management",
      subtitle: "Relational Data Modeling",
      description:
        "Normalized schemas and clear SQL in MySQL & PostgreSQL.",
      focusAreas: ["MySQL", "PostgreSQL", "Schema Design"],
      icon: "database",
    },
    {
      id: "problem-solving",
      title: "Problem Solving",
      subtitle: "Algorithms & Debugging",
      description:
        "Algorithmic thinking and systematic debugging.",
      focusAreas: ["Data Structures", "Logic", "Debugging"],
      icon: "cpu",
    },
  ] as WhatIDoItem[],
};
