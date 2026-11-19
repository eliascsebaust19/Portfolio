export interface WhatIDoItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  focusAreas: string[];
  icon: "globe" | "server" | "code" | "database" | "cpu";
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
    headline: "Building practical software with strong engineering fundamentals.",
    paragraphs: [
      "I'm Elias Ahmad, a Computer Science and Engineering (CSE) student at Bangladesh Army University of Science and Technology (BAUST), aspiring Software Engineer, and technology enthusiast.",
      "My core focus is on web development, backend engineering, and database-driven software solutions, alongside a strong interest in Flutter Mobile App Development and DevOps.",
      "I enjoy breaking down real-world problems, learning modern tools step by step, and transforming creative ideas into reliable, maintainable digital applications.",
    ],
    highlights: [
      { label: "Institution", value: "BAUST" },
      { label: "Department", value: "Computer Science & Engineering" },
      { label: "Core Focus", value: "Web, Backend & Software Engineering" },
      { label: "Exploring Next", value: "Flutter Mobile & DevOps" },
    ],
  },
  whatIDo: [
    {
      id: "web-development",
      title: "Web Development",
      subtitle: "Frontend & Interactive Interfaces",
      description:
        "Designing clean, responsive, accessible web interfaces with semantic HTML, modern CSS, and interactive JavaScript.",
      focusAreas: ["HTML & CSS", "JavaScript", "Responsive UI"],
      icon: "globe",
    },
    {
      id: "backend-development",
      title: "Backend Development",
      subtitle: "Server Logic & APIs",
      description:
        "Building structured server-side workflows, authentication flows, and RESTful APIs using PHP and Node.js.",
      focusAreas: ["PHP", "Node.js", "REST APIs"],
      icon: "server",
    },
    {
      id: "software-development",
      title: "Software Development",
      subtitle: "Practical Digital Solutions",
      description:
        "Applying computer science principles to turn everyday challenges into maintainable, practical applications.",
      focusAreas: ["Architecture", "Version Control", "Clean Code"],
      icon: "code",
    },
    {
      id: "database-management",
      title: "Database Management",
      subtitle: "Relational Data Modeling",
      description:
        "Structuring normalized schemas, writing clear SQL queries, and managing relational data in MySQL and PostgreSQL.",
      focusAreas: ["MySQL", "PostgreSQL", "Schema Design"],
      icon: "database",
    },
    {
      id: "problem-solving",
      title: "Problem Solving",
      subtitle: "Algorithms & Debugging",
      description:
        "Strengthening algorithmic thinking, tracing complex bugs systematically, and continuously improving engineering depth.",
      focusAreas: ["Data Structures", "Logic", "Debugging"],
      icon: "cpu",
    },
  ] as WhatIDoItem[],
};
