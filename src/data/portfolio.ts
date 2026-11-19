import React from "react";
import { Mail, Code } from "lucide-react";
import { Code2, Cpu, Database, Globe, Layers, Terminal } from "lucide-react";

// Lucide v1.x removed brand icons, so provide clean SVG components for GitHub & LinkedIn
const Github = (props: React.SVGProps<SVGSVGElement>) =>
  React.createElement(
    "svg",
    {
      viewBox: "0 0 24 24",
      width: 24,
      height: 24,
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      fill: "none",
      ...props,
    },
    React.createElement("path", {
      d: "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4",
    }),
    React.createElement("path", { d: "M9 18c-4.51 2-5-2-7-2" })
  );

const Linkedin = (props: React.SVGProps<SVGSVGElement>) =>
  React.createElement(
    "svg",
    {
      viewBox: "0 0 24 24",
      width: 24,
      height: 24,
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      fill: "none",
      ...props,
    },
    React.createElement("path", {
      d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z",
    }),
    React.createElement("rect", { width: 4, height: 12, x: 2, y: 9 }),
    React.createElement("circle", { cx: 4, cy: 4, r: 2 })
  );

export const PORTFOLIO_DATA = {
  title: "Debprix",
  name: "Debpratim Sharma",
  role: "Full-Stack Engineer (Backend-leaning)",
  location: "West Bengal, India",
  tagline:
    "I build production-grade web systems with real users, focusing on reliability, scalability, and long-term growth.",
  resumeUrl: "/resume.pdf",
  status: "Available for work",
  statusDescription: [
    "Open to full-time roles",
    "Remote or hybrid preferred",
    "Looking for a long-term opportunity",
  ],
  about: {
    description:
      "I'm a Full-Stack Engineer with strong experience in building and shipping real-world products using the React and Next.js ecosystem. I enjoy working close to production—thinking about system boundaries, trade-offs, and long-term maintainability. My background in electrical engineering and IoT gives me a systems-first mindset that goes beyond UI development.",
  },
  roles: ["Full-Stack Engineer", "Backend Engineer", "Frontend Engineer"],

  socials: [
    {
      icon: Github,
      href: "https://github.com/DebpratimSharma",
      label: "GitHub",
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/debpratim-sharma-916203267/",
      label: "LinkedIn",
    },
    {
      icon: Mail,
      href: "mailto:debpratimsharma33@gmail.com",
      label: "Email",
    },
    {
      icon: Code ,
      href: "https://leetcode.com/u/debpratimsharma/",
      label: "LeetCode",
    }
  ],

  stack: [
    { name: "Next.js", icon: Globe, },
    { name: "React", icon: Code2 },
    { name: "TypeScript", icon: Terminal },
    { name: "Node.js", icon: Cpu },
    { name: "PostgreSQL / SQL", icon: Database },
    { name: "System & Product Design", icon: Layers },
  ],

  projects: [
    {
      id: 1,
      number: "01",
      title: "TellWeb",
      category: "Anonymous Messaging Platform",
      description:
        "An anonymous messaging platform featuring private username inboxes, real-time message updates, input validation, rate limiting, and automatic 36-hour message cleanup.",
      tech: ["Next.js", "React", "TypeScript", "Supabase", "PostgreSQL", "Upstash Redis", "Tailwind CSS"],
      link: "https://tellweb.debprix.in",
      github: "https://github.com/DebpratimSharma",
      award: null,
      details: {
        problem:
          "Traditional feedback and confession systems require registration or expose sender identity, reducing authentic candid feedback.",
        role: "Full-stack design and implementation including database models, rate limiting, and real-time client updates.",
        architecture: [
          "Next.js App Router for frontend and serverless API endpoints",
          "Supabase & PostgreSQL for transactional relational storage and auth",
          "Upstash Redis for IP and token-based rate limiting to prevent spam",
          "Automated cron worker for 36-hour ephemeral message cleanup",
        ],
        challenges: [
          "Preventing abuse and spam with low-latency rate limiting",
          "Handling real-time subscriptions cleanly across browser sessions",
        ],
        impact:
          "Production messaging platform providing confidential, frictionless two-way feedback.",
      },
    },

    {
      id: 2,
      number: "02",
      title: "AI Voice Translator",
      category: "Real-Time Speech-to-Speech Translation",
      description:
        "A multi-step AI speech translation system that captures browser audio with Web Media APIs, translates with OpenAI API, and synthesizes low-latency speech via ElevenLabs API.",
      tech: ["Next.js", "TypeScript", "OpenAI API", "ElevenLabs API", "Web Audio APIs"],
      link: "https://voices.debprix.in",
      github: "https://github.com/DebpratimSharma/voice-to-voice-ai-translate",
      award: null,
      details: {
        problem:
          "Real-time voice translation requires orchestrating multiple AI services with low latency and failure handling.",
        role: "Built the orchestration logic and frontend, integrating speech capture, LLM processing, and synthesis.",
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

    {
      id: 3,
      number: "03",
      title: "DonorFi",
      category: "Transparent Charitable dApp on Solana",
      description:
        "A transparent charitable dApp on Solana eliminating intermediaries from charitable giving, leveraging smart contracts for immutable, peer-to-peer donation tracking.",
      tech: ["Solana", "Next.js", "TypeScript", "Tailwind CSS", "Shadcn UI"],
      link: "https://donorfi.vercel.app",
      github: "https://github.com/HACKTROPICA-CODE-PHOENIX/hacktropica",
      award: "BEST UI/UX AWARD @ SYNCHRONICITY S2 HACKATHON",
      details: {
        problem:
          "Traditional philanthropy lacks transparency and direct peer-to-peer donation flows on the blockchain.",
        role: "Built the frontend and Solana wallet integration, enabling direct donations via Phantom wallet.",
        architecture: [
          "Next.js frontend with Tailwind CSS and Shadcn UI",
          "Solana wallet integration using Phantom adapter",
        ],
        challenges: [
          "Integrating Solana wallet with React hooks",
          "Ensuring seamless user experience during transaction flows",
        ],
        impact:
          "Created a functional frontend prototype for a Web3 philanthropy platform.",
      },
    },

    {
      id: 4,
      number: "04",
      title: "Schedura OS",
      category: "Routine & Attendance Management System",
      description:
        "A production-ready academic attendance & routine management app with Google OAuth, automated schedule tracking, and cloud storage actively used by students.",
      tech: ["Next.js", "Supabase", "TypeScript", "PostgreSQL", "Tailwind CSS", "Shadcn UI"],
      link: "https://scheduraos.vercel.app",
      github: "https://github.com/DebpratimSharma/scheduraos",
      award: "1ST PLACE @ IOT HACKATHON 2024",
      details: {
        problem:
          "Manual handling of routines and attendance caused inconsistency, errors, and lack of visibility for students.",
        role: "Designed and built the system end-to-end, including frontend, backend logic, database schema, and deployment.",
        architecture: [
          "Next.js frontend communicating with Supabase-backed APIs",
          "Google O-Auth for authentication and authorization",
          "Cloud storage for academic resources and user-generated content",
        ],
        challenges: [
          "Balancing rapid development with long-term schema clarity",
          "Managing local time to match with the global timezones",
          "Ensuring usability for non-technical users (UX)",
        ],
        impact:
          "Actively used by students for managing real academic routines and attendance.",
      },
    },

    {
      id: 5,
      number: "05",
      title: "SCEEAOT Platform",
      category: "Student Chapter of Electrical Engineering Platform",
      description:
        "Official digital portal and internal management system for events, announcements, and chapter identity for SCEE Academy of Technology.",
      tech: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
      link: "https://sceeaot.in",
      github: "https://github.com/DebpratimSharma/sceeaot-web",
      award: "CONVENOR & LEAD @ SCEE",
      details: {
        problem:
          "The student chapter lacked a central, maintainable digital presence for events and communication.",
        role: "Led frontend development and deployment, collaborating closely with organisers on requirements.",
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
  ],

  experience: [
    {
      id: 1,
      role: "Freelance Developer",
      organisation: "Narratives Creative Labs Pvt. Ltd.",
      location: "Remote",
      period: "2026 – Present",
      timelineDate: "2026 — Present",
      link: "https://narratives.tv",
      type: "Freelance / Client Work",
      preset: "atmosphere",
      summary:
        "Building client-facing web systems and engineering internal workflow automation tools.",
      contributions: [
        "Built and deployed the company’s portfolio website using Next.js and Tailwind CSS.",
        "Currently designing and prototyping internal workflow automation tools for the company (details confidential).",
      ],
      focus: [
        "Frontend Engineering",
        "Workflow Automation",
        "Production Systems",
      ],
      techStack: ["Next.js", "Tailwind CSS", "TypeScript", "React", "Workflow Automation", "Vercel"],
    },
    {
      id: 2,
      role: "Convenor",
      organisation: "Student Chapter of Electrical Engineering (SCEE), Academy of Technology",
      location: "India",
      period: "2026 – Present",
      timelineDate: "2026 — Present",
      link: "https://sceeaot.in",
      type: "Leadership / Chapter Lead",
      preset: "lagoon",
      summary:
        "Leading the chapter’s technical roadmap, coordinating hackathons, workshops and community events, and mentoring juniors moving from EE fundamentals into software.",
      contributions: [
        "Lead the chapter’s technical roadmap, coordinating hackathons, workshops and community events, and mentor juniors moving from EE fundamentals into software.",
        "Led technical workshops and peer-learning initiatives in collaboration with faculty for academic and departmental activities.",
        "Mentored juniors in EE fundamentals, modern software practices, and basic programming.",
      ],
      focus: [
        "Technical Roadmap",
        "Student Leadership",
        "Peer Mentorship",
      ],
      techStack: [
        "Next.js",
        "React",
        "TypeScript",
        "Git & GitHub",
        "JavaScript",
        "ESP32",
      ],
    },
    {
      id: 3,
      role: "Tech Team Member",
      organisation: "Google Developer Group on Campus (GDGoC) – Academy of Technology",
      location: "India",
      period: "2025 – 2026",
      timelineDate: "2025 — 2026",
      type: "Developer Community",
      preset: "corona",
      summary:
        "Part of the core technical organising team for large-scale hackathons and technical community events.",
      contributions: [
        "Helped manage GDG events, learned Google Cloud Platform (GCP) and mentored juniors on it.",
        "Part of the core technical organising team for a large-scale hackathon.",
        "Supported technical planning and execution, assisted in participant onboarding and tooling, and coordinated with organisers for smooth operations.",
      ],
      focus: ["Event Systems", "Google Cloud", "Community Tech", "Coordination"],
      techStack: [
        "Google Cloud Platform (GCP)",
        "Web Platforms",
        "Developer Community",
        "Event Infrastructure",
      ],
    },
    {
      id: 4,
      role: "Tech Team Member",
      organisation: "Student Chapter of Electrical Engineering (SCEE), Academy of Technology",
      location: "India",
      period: "2024 – 2025",
      timelineDate: "2024 — 2025",
      link: "https://sceeaot.in",
      type: "Department Tech Team",
      preset: "rose",
      summary:
        "Built and maintained production-facing web platforms supporting student and departmental activities.",
      contributions: [
        "Built and maintained web platforms for department activities, including domain configuration, HTTPS deployment and cross-team feature rollouts.",
        "Handled deployment, domain configuration, and continuous updates to ensure high system uptime.",
        "Collaborated across teams to ensure platform reliability and smooth user experience for students and faculty.",
      ],
      focus: [
        "Frontend Engineering",
        "Deployment & Operations",
        "System Ownership",
      ],
      techStack: ["Next.js", "React", "Tailwind CSS", "Git", "Vercel", "Domain & DNS"],
    },
  ],
};
