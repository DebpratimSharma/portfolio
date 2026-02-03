import { Github, Linkedin, Mail } from "lucide-react";
import { Code2, Cpu, Database, Globe, Layers, Terminal } from "lucide-react";

export const PORTFOLIO_DATA = {
  title: "Debprix",
  name: "Debpratim Sharma",
  role: "Full-Stack Engineer (Backend-leaning)",
  tagline:
    "I build production-grade web systems with real users, focusing on reliability, scalability, and long-term growth.",
  resumeUrl: "#",

  about: {
    description:
      "I'm a Full-Stack Engineer with strong experience in building and shipping real-world products using the React and Next.js ecosystem. I enjoy working close to production—thinking about system boundaries, trade-offs, and long-term maintainability. My background in electrical engineering and IoT gives me a systems-first mindset that goes beyond UI development.",
  },

  socials: [
    {
      icon: Github,
      href: "https://github.com/DebpratimSharma",
      label: "GitHub",
    },
    {
      icon: Linkedin,
      href: "https://linkedin.com",
      label: "LinkedIn",
    },
    {
      icon: Mail,
      href: "mailto:debpratimsharma33@gmail.com",
      label: "Email",
    },
  ],

  stack: [
    { name: "Next.js", icon: Globe },
    { name: "React", icon: Code2 },
    { name: "TypeScript", icon: Terminal },
    { name: "Node.js", icon: Cpu },
    { name: "PostgreSQL / SQL", icon: Database },
    { name: "System & Product Design", icon: Layers },
  ],

  projects: [
    {
      id: 1,
      title: "Academic OS",
      category: "Routine & Attendance Management System",
      description:
        "A production-ready academic management system handling routines, attendance, and role-based access.",
      tech: ["Next.js", "Supabase", "TypeScript", "Tailwind", "Shadcn UI"],
      link: "https://academicos.vercel.app",
      github: "https://github.com/DebpratimSharma/AcademicOs",

      details: {
        problem:
          "Manual handling of routines and attendance caused inconsistency, errors, and lack of visibility for students and organisers.",
        role:
          "Designed and built the system end-to-end, including frontend, backend logic, database schema, and deployment.",
        architecture: [
          "Next.js frontend communicating with Supabase-backed APIs",
          "Role-based access enforced at the database layer",
          "Schema designed to support scalable attendance tracking",
        ],
        challenges: [
          "Balancing rapid development with long-term schema clarity",
          "Designing permissions that scale across roles",
          "Ensuring usability for non-technical users",
        ],
        impact:
          "Actively used by students and organisers for managing real academic workflows.",
      },
    },

    {
      id: 2,
      title: "SCEEAOT Platform",
      category: "Student Chapter Website & Admin System",
      description:
        "Public-facing and internal platform for managing events, announcements, and chapter identity.",
      tech: ["Next.js", "TypeScript", "Tailwind"],
      link: "https://sceeaot.in",
      github: "https://github.com/DebpratimSharma/sceeaot-web",

      details: {
        problem:
          "The student chapter lacked a central, maintainable digital presence for events and communication.",
        role:
          "Led frontend development and deployment, collaborating closely with organisers on requirements.",
        architecture: [
          "Static-first Next.js architecture for performance and reliability",
          "Simple, maintainable structure for future student teams",
        ],
        challenges: [
          "Designing for long-term maintainability across batches",
          "Balancing flexibility with simplicity",
        ],
        impact:
          "Official platform representing the Electrical Engineering student chapter.",
      },
    },

    {
      id: 3,
      title: "AI Voice Translator",
      category: "AI-Powered Voice Translation System",
      description:
        "An AI-assisted system that captures, translates, and synthesises speech in real time.",
      tech: [
        "Next.js",
        "OpenAI API",
        "ElevenLabs API",
        "Web Media APIs",
        "TypeScript",
      ],
      link: "https://ai-voice-translator.vercel.app",
      github: "https://github.com/DebpratimSharma/voice-to-voice-ai-translator",

      details: {
        problem:
          "Real-time voice translation requires orchestrating multiple AI services with low latency and failure handling.",
        role:
          "Built the orchestration logic and frontend, integrating speech capture, LLM processing, and synthesis.",
        architecture: [
          "Frontend-driven orchestration across multiple AI APIs",
          "Sequential processing with explicit error handling",
        ],
        challenges: [
          "Managing latency across chained AI services",
          "Keeping AI as a subsystem, not core logic",
        ],
        impact:
          "Prototype system exploring architectural feasibility and AI trade-offs.",
      },
    },
  ],

  experience: [
    {
      id: 1,
      role: "Tech Team Member",
      organisation: "Student Chapter of Electrical Engineering, AOT",
      location: "India",
      period: "2024 – Present",
      summary:
        "Worked on real-world technical platforms supporting student and departmental activities.",
      contributions: [
        "Built and maintained production-facing web platforms",
        "Handled deployment, domain configuration, and updates",
        "Collaborated across teams to ensure system reliability",
      ],
      focus: [
        "Frontend Engineering",
        "Deployment & Operations",
        "System Ownership",
      ],
      techStack: ["Next.js", "React", "Tailwind CSS", "Git", "Vercel"],
    },

    {
      id: 2,
      role: "Tech Team Member",
      organisation: "GDG On Campus – Academy of Technology",
      location: "India",
      period: "2025 – Present",
      summary:
        "Part of the core technical organising team for a large-scale hackathon.",
      contributions: [
        "Supported technical planning and execution",
        "Assisted in participant onboarding and tooling",
        "Coordinated with organisers for smooth operations",
      ],
      focus: ["Event Systems", "Community Tech", "Coordination"],
      techStack: ["Web Platforms", "Google Cloud Console", "Collaboration Tools"],
    },
  ],
};
