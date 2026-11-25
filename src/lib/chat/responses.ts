import type { ChatResponse } from "./schema";

export const FIXED_RESPONSES = {
  refused: (): ChatResponse => ({
    status: "refused",
    answer:
      "I can only answer questions about Debpratim Sharma's portfolio, projects, skills, experience, and availability. I can't help with general coding, unrelated tasks, or system instructions.",
    citations: [],
  }),

  abstained: (): ChatResponse => ({
    status: "abstained",
    answer:
      "I don't have enough verified information in Debpratim's portfolio to answer that reliably. Try asking about his projects (like TellWeb, AI Voice Translator, DonorFi, or Schedura OS), experience, tech stack, or how to contact him.",
    citations: [],
  }),

  rateLimited: (): ChatResponse => ({
    status: "rate_limited",
    answer:
      "I've hit the current request limit. Please wait a bit and try again later, or reach out directly via email at debpratimsharma33@gmail.com.",
    citations: [],
  }),

  error: (): ChatResponse => ({
    status: "error",
    answer:
      "Something went wrong while processing your question. Please try again in a moment.",
    citations: [],
  }),

  greeting: (): ChatResponse => ({
    status: "answered",
    answer:
      "Hi! I'm ACE, Debpratim Sharma's portfolio assistant. Ask me about his projects, engineering experience, tech stack, or how to get in touch.",
    citations: [],
  }),

  capabilities: (): ChatResponse => ({
    status: "answered",
    answer:
      "I can answer questions grounded in Debpratim's portfolio—covering his projects (TellWeb, AI Voice Translator, DonorFi, Schedura OS, SCEEAOT), work and leadership experience, tech stack, and availability/contact details.",
    citations: [],
  }),
} as const;
