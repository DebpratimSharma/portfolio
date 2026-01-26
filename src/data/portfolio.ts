import { Github, Linkedin, Mail } from "lucide-react";
import { Code2, Cpu, Database, Globe, Layers, Terminal } from "lucide-react";
export const PORTFOLIO_DATA = {
  name: "Debprix",
  role: "Full-Stack Developer",
  tagline: "I build pixel-perfect, accessible web experiences.",
  resumeUrl: "#",
  about: {
    description:
      "I'm a Full-Stack Developer with a focus on React ecosystem. Beyond the code, I'm an avid hiker and analog photography enthusiast—hobbies that teach me patience and a different perspective on composition.",
  },
  socials: [
    {
      icon: Github,
      href: "https://github.com/DebpratimSharma",
      label: "GitHub",
    },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Mail, href: "mailto:debpratimsharma33@gmail.com", label: "Email" },
  ],
  stack: [
    { name: "Next.js", icon: Globe },
    { name: "React", icon: Code2 },
    { name: "TypeScript", icon: Terminal },
    { name: "Node.js", icon: Cpu },
    { name: "PostgreSQL", icon: Database },
    { name: "Design", icon: Layers },
  ],
  projects: [
    {
      id: 1,
      title: "Academic OS",
      category: "Routine and Attendance System",
      description:
        "A comprehensive platform to manage academic routines and attendance tracking for institutions.",
      tech: ["Next.js", "Supabase", "Shadcn UI", "TypeScript", "Tailwind"],
      imageGradient: "from-indigo-500 via-purple-500 to-pink-500",
      link: "https://academicos.vercel.app",
      github: "https://github.com/DebpratimSharma/AcademicOs",
    },
    {
      id: 2,
      title: "SCEEAOT",
      category: "Student Chapter Platform",
      description:
        "A platform for showcasing student chapter of Electrical Engineering Department at Academy of Technology and managing events and activities.",
      tech: ["Next.js", "TypeScript", "Tailwind"],
      imageGradient: "from-cyan-500 via-blue-500 to-indigo-500",
      link: "https://sceeaot.in",
      github: "https://github.com/DebpratimSharma/sceeaot-web",
    },
    {
      id: 3,
      title: "AI Voice Translator",
      category: "Voice Translation Web App",
      description:
        "Translate and synthesize speech in real-time using AI technologies.",
      tech: [
        "Next.js",
        "OpenAI",
        "ElevenLabs API",
        "WebMedia",
        "TypeScript",
        "Tailwind",
      ],
      imageGradient: "from-emerald-400 via-teal-500 to-cyan-500",
      link: "https://ai-voice-translator.vercel.app",
      github: "https://github.com/DebpratimSharma/voice-to-voice-ai-translator",
    },
  ],
  experience: [
    {
      id: 1,
      role: "Tech Team Member",
      organisation: "SCEE Academy of Technology",
      location: "India",
      period: "2024 - Present",
      summary:
        "Contributing to the institute’s technical initiatives with a focus on frontend development and infrastructure coordination.",
      contributions: [
        "Built and maintained frontend interfaces for internal and public-facing platforms",
        "Managed domain configuration and deployment workflows",
        "Collaborated with the tech team to ensure system stability and scalability",
        "Continuing as an active member for the current academic year",
      ],
      focus: [
        "Frontend Engineering",
        "Domain & Deployment",
        "Team Collaboration",
      ],
      techStack: ["React", "Next.js", "Tailwind CSS", "Git", "Vercel"],
      brandColors: ["#FFFF00", "#8A2BE2"], // institute palette Yellow violet
    },
    {
      id: 2,
      role: "Tech Team Member",
      organisation: "GDG On Campus – Academy of Technology",
      location: "India",
      period: "2025 - Present",
      summary:
        "Part of the organising tech team for a large-scale hackathon under the Google Developer Groups programme.",
      contributions: [
        "Contributed to planning and execution of TechSprint Hackathon",
        "Supported technical coordination and participant onboarding",
        "Worked closely with organisers to ensure smooth event operations",
      ],
      focus: ["Event Engineering", "Community Tech", "Hackathon Operations"],
      techStack: ["Web Platforms", "Google Workspace", "Google Cloud Console"],
      brandColors: [
        "rgba(66,133,244,0.9)", // Blue
        "rgba(52,168,83,0.9)", // Green
        "rgba(251,188,5,0.9)", // Yellow
        "rgba(234,67,53,0.9)", // Red
      ],
    },
  ],
};
