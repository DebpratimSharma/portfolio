import { Github, Linkedin, Mail } from "lucide-react";
import { Code2, Cpu, Database, Globe, Layers, Terminal } from "lucide-react";
export const PORTFOLIO_DATA = {
  name: "Debprix",
  role: "Full-Stack Developer",
  tagline: "I build pixel-perfect, accessible web experiences.",
  resumeUrl: "#", 
  about: {
    description: "I'm a Full-Stack Developer with a focus on React ecosystem. Beyond the code, I'm an avid hiker and analog photography enthusiast—hobbies that teach me patience and a different perspective on composition.",
  },
  socials: [
    { icon: Github, href: "https://github.com/DebpratimSharma", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Mail, href: "mailto:debpratimsharma33@gmail.com", label: "Email" }
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
      description: "A comprehensive platform to manage academic routines and attendance tracking for institutions.",
      tech: ["Next.js", "Supabase", "Shadcn UI", "TypeScript", "Tailwind"],
      imageGradient: "from-indigo-500 via-purple-500 to-pink-500",
      link: "https://academicos.vercel.app",
      github: "https://github.com/DebpratimSharma/AcademicOs"
    },
    {
      id: 2,
      title: "SCEEAOT",
      category: "Student Chapter Platform",
      description: "A platform for showcasing student chapter of Electrical Engineering Department at Academy of Technology and managing events and activities.",
      tech: ["Next.js 14", "OpenAI", "WebSockets"],
      imageGradient: "from-cyan-500 via-blue-500 to-indigo-500",
      link: "https://sceeaot.in",
      github: "https://github.com/DebpratimSharma/sceeaot-web"
    },
    {
      id: 3,
      title: "AI Voice Translator",
      category: "Voice Translation Web App",
      description: "Translate and synthesize speech in real-time using AI technologies.",
      tech: ["Next.js", "OpenAI", "ElevenLabs API", "WebMedia", "TypeScript", "Tailwind"],
      imageGradient: "from-emerald-400 via-teal-500 to-cyan-500",
      link: "https://ai-voice-translator.vercel.app",
      github: "https://github.com/DebpratimSharma/voice-to-voice-ai-translator"
    }
  ],
  experience: [
    {
      id: 1,
      role: "Senior Engineer",
      company: "TechVision",
      period: "2023—Present",
      description: "Architecting the next generation of cloud-native creative tools."
    },
    {
      id: 2,
      role: "Product Developer",
      company: "Creative Pulse",
      period: "2021—2023",
      description: "Built award-winning immersive web campaigns for global brands."
    },
    {
      id: 3,
      role: "Frontend Dev",
      company: "StartUp Flow",
      period: "2019—2021",
      description: "Established the core component library and design system."
    }
  ]
};