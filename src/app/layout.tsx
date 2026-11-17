import type { Metadata } from "next";
import { Roboto_Flex, Syne } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";
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

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Smooth scrolling with Motion",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${robotoFlex.variable} ${syne.variable} antialiased dark`}
    >
      <body className="min-h-screen bg-black text-white selection:bg-white selection:text-black">

        {/* Floating cosmic aurora navbar */}
        <Navbar />

        {/* Physics-based smooth scroll container powered by motion */}
        <SmoothScroll>{children}</SmoothScroll>

        {/* Floating crystalized ball trigger and chatbot sidebar */}
        <ChatbotSidebar />
      </body>
    </html>
  );
}
