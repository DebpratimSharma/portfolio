import Hero from "@/components/hero/Hero";
import Image from "next/image";
import BackgroundGlow from "@/components/BackgroundGlow";


export default function Home() {
  return (
    <div className="min-h-screen bg-transparent relative overflow-x-hidden">
      <BackgroundGlow />
      <main className="relative">
        <Hero />
      </main>
      
    </div>
  )
}
