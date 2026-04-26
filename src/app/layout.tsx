import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import { Syne } from 'next/font/google';


const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://debprix.vercel.app'),
  keywords: ['Next.js', 'React', 'TypeScript', 'Node.js', 'Full Stack Developer', 'Software Engineer'],
  title: {
    default: 'Debpratim Sharma | Full Stack Developer',
    template: '%s | Debpratim Sharma'
  },
  description: 'Portfolio of Debpratim Sharma, a Full Stack Web Developer.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-US" className={syne.className}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CustomCursor />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
