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
    { icon: Github, href: "https://github.com", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Mail, href: "mailto:hello@example.com", label: "Email" }
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
      title: "Lumina OS",
      category: "Web Operating System",
      description: "A complete OS simulation in the browser with a window manager, file system, and multitasking capabilities.",
      tech: ["React", "Redux", "Styled Components"],
      imageGradient: "from-indigo-500 via-purple-500 to-pink-500",
      link: "#",
      github: "#"
    },
    {
      id: 2,
      title: "Nebula AI",
      category: "Generative Interface",
      description: "Spatial chat interface for LLMs featuring voice synthesis and real-time canvas generation.",
      tech: ["Next.js 14", "OpenAI", "WebSockets"],
      imageGradient: "from-cyan-500 via-blue-500 to-indigo-500",
      link: "#",
      github: "#"
    },
    {
      id: 3,
      title: "Zenith",
      category: "E-Commerce Engine",
      description: "Headless commerce storefront capable of handling 10k+ concurrent users with sub-second loads.",
      tech: ["Shopify Hydrogen", "Remix", "Redis"],
      imageGradient: "from-emerald-400 via-teal-500 to-cyan-500",
      link: "#",
      github: "#"
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