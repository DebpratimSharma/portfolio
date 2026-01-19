"use client";

import { motion } from "framer-motion";
import { Code2, Cpu, Database, Globe, Layers, Terminal } from "lucide-react";
import { useEffect, useState } from "react";

// 5. Tech Stack Hologram (Replaces Geometric Art)
const HeroTechStack = () => {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() =>{
        const checkDevice =()=>{
            const isTouch = window.matchMedia("(pointer: coarse)").matches;
            const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
            setIsMobile(isTouch || !hasFinePointer);
        
        };
        checkDevice();
        window.addEventListener("resize", checkDevice);
        return () => window.removeEventListener("resize", checkDevice);
    }, [isMobile]);

    

    return (
        <div className="relative w-full h-full min-h-125 flex items-center justify-center pointer-events-none select-none">
            {/* Central Core System */}
            {isMobile &&(
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute w-175 h-175 bg-cyan-500/20 rounded-full blur-[120px] z-0"
                />
            )}
            <div className="relative z-10 w-32 h-32 rounded-full bg-neutral-900/20 backdrop-blur-2xl border border-white/10 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-t border-cyan-500/50"
                />
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mb-2 shadow-[0_0_10px_#22c55e]" />
                <span className="text-[10px] font-mono text-white/50 tracking-widest">SYSTEM</span>
                <span className="text-xs font-bold text-white tracking-widest">ONLINE</span>
            </div>

            {/* Orbit 1: Frontend (React, Next) */}
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute w-70 h-70 border border-white/5 rounded-full z-50"
            >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <motion.div 
                        animate={{ rotate: -360 }} 
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 rounded-2xl bg-black/15 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg"
                    >
                        <Globe size={20} className="text-blue-400" />
                    </motion.div>
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                    <motion.div 
                        animate={{ rotate: -360 }} 
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 rounded-2xl bg-black/15 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg"
                    >
                        <Code2 size={20} className="text-cyan-400" />
                    </motion.div>
                </div>
            </motion.div>

            {/* Orbit 2: Backend (Node, DB) - Reverse Rotation */}
            <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute w-105 h-105 border border-white/5 rounded-full border-dashed z-40"
            >
                <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <motion.div 
                        animate={{ rotate: 360 }} 
                        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 rounded-2xl bg-black/15 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg"
                    >
                        <Cpu size={20} className="text-green-400" />
                    </motion.div>
                </div>
                <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2">
                    <motion.div 
                        animate={{ rotate: 360 }} 
                        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 rounded-2xl bg-black/15 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg"
                    >
                        <Database size={20} className="text-purple-400" />
                    </motion.div>
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <motion.div 
                        animate={{ rotate: 360 }} 
                        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                        className="w-10 h-10 rounded-xl bg-black/15 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg"
                    >
                        <Terminal size={18} className="text-yellow-400" />
                    </motion.div>
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                    <motion.div 
                        animate={{ rotate: 360 }} 
                        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                        className="w-10 h-10 rounded-xl bg-black/15 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg"
                    >
                        <Layers size={18} className="text-pink-400" />
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default HeroTechStack;