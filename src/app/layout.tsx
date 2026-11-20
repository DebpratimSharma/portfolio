import type { Metadata, Viewport } from "next";
import { Roboto_Flex, Syne } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import ChatbotSidebar from "@/components/ChatbotSidebar";

const robotoFlex = Roboto_Flex({
  variable: "--font-roboto-flex",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://debprix.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Debpratim Sharma – Debprix | Web Developer, Gen AI Engineer & Freelancer",
    template: "%s | Debpratim Sharma – Debprix",
  },
  description:
    "Official portfolio of Debpratim Sharma – Debprix – Full-Stack Web Developer, Gen AI Engineer, and Freelance React Developer based in Kolkata, India. Building production-grade web systems, generative AI applications, and resilient digital architectures.",
  keywords: [
    "Debpratim Sharma",
    "Debprix",
    "web developer",
    "gen ai engineer",
    "freelancer",
    "react developer in kolkata",
    "freelance web developer kolkata",
    "full stack developer kolkata",
    "frontend developer kolkata",
    "react developer",
    "nextjs developer india",
    "generative ai engineer",
    "ai engineer kolkata",
    "software engineer west bengal",
    "debprix portfolio",
    "debpratim sharma portfolio",
  ],
  authors: [{ name: "Debpratim Sharma", url: siteUrl }],
  creator: "Debpratim Sharma",
  publisher: "Debpratim Sharma",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Debpratim Sharma (Debprix) Portfolio",
    title: "Debpratim Sharma (Debprix) | Web Developer, Gen AI Engineer & Freelancer",
    description:
      "Web Developer, Gen AI Engineer, and Freelance React Developer based in Kolkata, India. Building modern web platforms, AI pipelines, and interactive digital experiences.",
    images: [
      {
        url: "/navbar-icon.png",
        width: 800,
        height: 800,
        alt: "Debpratim Sharma (Debprix) - Web Developer & Gen AI Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Debpratim Sharma (Debprix) | Web Developer, Gen AI Engineer & Freelancer",
    description:
      "Web Developer, Gen AI Engineer, and Freelance React Developer in Kolkata. Specialized in React, Next.js, and Gen AI solutions.",
    images: ["/navbar-icon.png"],
    creator: "@DebpratimSharma",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/navbar-icon.png", type: "image/png" },
    ],
    apple: [{ url: "/navbar-icon.png" }],
  },
  category: "technology",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Debpratim Sharma",
      alternateName: ["Debprix", "debpratimsharma"],
      url: siteUrl,
      image: `${siteUrl}/navbar-icon.png`,
      jobTitle: [
        "Web Developer",
        "Gen AI Engineer",
        "Freelancer",
        "React Developer",
        "Full-Stack Engineer",
      ],
      description:
        "Full-Stack Web Developer, Gen AI Engineer, and Freelance React Developer based in Kolkata, India.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kolkata",
        addressRegion: "West Bengal",
        addressCountry: "IN",
      },
      sameAs: [
        "https://github.com/DebpratimSharma",
        "https://www.linkedin.com/in/debpratim-sharma-916203267/",
        "https://leetcode.com/u/debpratimsharma/",
      ],
      knowsAbout: [
        "Web Development",
        "React",
        "Next.js",
        "Generative AI",
        "TypeScript",
        "Node.js",
        "PostgreSQL",
        "Tailwind CSS",
        "AI Agents",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Debpratim Sharma (Debprix) Portfolio",
      description:
        "Official portfolio of Debpratim Sharma (Debprix) - Web Developer, Gen AI Engineer & Freelance React Developer in Kolkata",
      publisher: {
        "@id": `${siteUrl}/#person`,
      },
      inLanguage: "en-US",
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${robotoFlex.variable} ${syne.variable} antialiased dark`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:wght@100..900&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
        {/* Physics-based smooth scroll container powered by motion */}
        <SmoothScroll>
          {/* Floating cosmic aurora navbar */}
          <Navbar />

          {children}

          {/* Floating crystalized ball trigger and chatbot sidebar */}
          <ChatbotSidebar />
        </SmoothScroll>
      </body>
    </html>
  );
}
