"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Video, Loader2 } from "lucide-react";
import ColorBends from "@/components/ColorBends";
import RollingButton from "@/components/RollingButton";

function Meet() {
  const [redirecting, setRedirecting] = useState(false);
  const meetUrl = "https://meet.google.com/tst-erax-opb";

  useEffect(() => {
    const timeout = setTimeout(() => {
      setRedirecting(true);
      window.location.href = meetUrl;
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <main className="relative w-full h-screen flex flex-col justify-center items-center px-4 overflow-hidden bg-[#030303]">
      <div className="absolute inset-0 pointer-events-none">
        <ColorBends
          colors={["#08414aff", "#0e4f5fff", "#083d4cff"]}
          speed={0.5}
          frequency={0.8}
          noise={0.15}
          rotation={70}
          iterations={0}
          intensity={1.0}
          className="absolute inset-0 hidden md:block opacity-60"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center justify-center max-w-md mx-auto text-center"
      >
        <div className="relative flex items-center justify-center mb-8">
          <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full" />
          <div className="w-24 h-24 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,255,255,0.15)] relative z-10">
            {redirecting ? (
              <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
            ) : (
              <Video className="w-10 h-10 text-cyan-400" />
            )}
          </div>
        </div>

        <h1 className="bg-clip-text text-transparent bg-linear-to-r from-white via-white/80 to-white/40 font-syne font-bold text-4xl sm:text-5xl tracking-tight mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
          Joining Meeting
        </h1>
        
        <p className="text-white/60 mb-10 font-sans text-sm sm:text-base max-w-[280px] mx-auto leading-relaxed">
          {redirecting 
            ? "Redirecting you to Google Meet..." 
            : "Preparing your secure connection to the meeting room."}
        </p>

        <RollingButton
          text={redirecting ? "Redirecting..." : "Join Manually"}
          className="bg-white/5 py-3 px-8 border border-white/10 backdrop-blur-sm"
          textColor="text-white"
          onClick={() => {
            setRedirecting(true);
            window.location.href = meetUrl;
          }}
        />
      </motion.div>
    </main>
  );
}

export default Meet;