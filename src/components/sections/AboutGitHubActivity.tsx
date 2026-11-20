"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import type { ContributionDay } from "@/components/ui/contribution-skyline";

// Dynamically import the heavy 3D canvas so it doesn't block initial page load or hydration
const ContributionSkyline = dynamic(
  () => import("@/components/ui/contribution-skyline"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[280px] w-full rounded-2xl border border-white/10 bg-zinc-950/60 animate-pulse flex items-center justify-center text-xs text-zinc-600 font-mono">
        Loading activity skyline...
      </div>
    ),
  }
);

export default function AboutGitHubActivity() {
  const [contributions, setContributions] = useState<ContributionDay[] | undefined>(
    undefined
  );
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchContributions() {
      try {
        const res = await fetch("/api/github");
        if (!res.ok) throw new Error("Network response was not ok");
        const json = await res.json();
        if (isMounted && json.success && Array.isArray(json.contributions)) {
          setContributions(json.contributions);
          setIsLoaded(true);
        }
      } catch (err) {
        console.warn("Using sample contributions due to API fetch fallback:", err);
      }
    }

    fetchContributions();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between mb-1 px-1 sm:px-2 gap-2">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase">
            GitHub Activity
          </span>
          <span className="text-zinc-700">•</span>
          <a
            href="https://github.com/DebpratimSharma"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5"
          >
            @DebpratimSharma
            <span className="text-[10px] text-zinc-500">↗</span>
          </a>
        </div>

        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span
              className={cn(
                "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                isLoaded ? "bg-emerald-400" : "bg-zinc-500"
              )}
            />
            <span
              className={cn(
                "relative inline-flex rounded-full h-2 w-2",
                isLoaded ? "bg-emerald-500" : "bg-zinc-400"
              )}
            />
          </span>
          <span className="text-xs text-zinc-400 font-mono">
            {isLoaded ? "Live GitHub Synced" : "Fetching live data..."}
          </span>
        </div>
      </div>

      <ContributionSkyline
        data={contributions}
        palette="github"
        defaultView="3d"
        className="border-white/10 bg-zinc-950 shadow-2xl rounded-2xl overflow-hidden"
      />
    </div>
  );
}
