"use client";

import React, { useState, useEffect } from "react";
import { Timer, Target, Flame, DownloadCloud, RefreshCw, Compass } from "lucide-react";
import { motion } from "framer-motion";

interface GoalHeaderProps {
  overallProgress: number;
}

export default function GoalHeader({ overallProgress }: GoalHeaderProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const gateExamDate = new Date("2027-02-06T09:30:00").getTime();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const diff = gateExamDate - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [gateExamDate]);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone;
    if (isStandalone) {
      setShowInstallBtn(false);
    } else {
      window.addEventListener("beforeinstallprompt", handler);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowInstallBtn(false);
      setDeferredPrompt(null);
    }
  };

  const handleForceUpdate = async () => {
    setIsUpdating(true);
    if ("caches" in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((c) => caches.delete(c)));
    }
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const reg of registrations) {
        await reg.unregister();
      }
    }
    window.location.reload();
  };

  return (
    <header className="border-b-4 border-[#7a1c00] bg-[#7a1c00] text-[#fffdfa] p-3 sm:p-4 rounded-b-3xl shadow-[4px_4px_0px_0px_#2c0d0d]">
      <div className="max-w-7xl mx-auto flex flex-col gap-2.5">
        {/* User Profile Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-[#6b1900] border-2 border-[#d48806] p-2.5 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#d48806] text-[#2c0d0d] font-black flex items-center justify-center border-2 border-[#fffdfa] text-xs">
              SK
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-black tracking-wide text-[#fffdfa] font-mono-code">
                Suman Kumar Mahato
              </h2>
              <p className="text-[10px] text-[#f5d6a8] font-mono-code">
                ज्ञानं परमं बलम् // GATE CE 2027
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {showInstallBtn && (
              <button
                onClick={handleInstallClick}
                className="bg-[#d48806] text-[#2c0d0d] text-[10px] font-black px-2.5 py-1 rounded-xl border-2 border-[#2c0d0d] shadow-sm animate-pulse flex items-center gap-1 active:scale-95"
              >
                <DownloadCloud className="w-3.5 h-3.5" /> INSTALL APP
              </button>
            )}

            <button
              onClick={handleForceUpdate}
              disabled={isUpdating}
              className="bg-[#d96b1b] text-white px-2.5 py-1 rounded-xl border-2 border-[#2c0d0d] font-black text-[10px] flex items-center gap-1 shadow-sm transition-all active:scale-95"
            >
              <span>POWAI SYNC</span>
              <RefreshCw className={`w-3 h-3 text-[#ffe600] ${isUpdating ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Status Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 font-mono-code text-xs">
          {/* Benchmarks Card */}
          <div className="bg-[#6b1900] border-2 border-[#d48806] p-3 rounded-2xl flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="font-black text-[#f5d6a8] flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-[#d48806]" /> BENCHMARK
              </span>
              <span className="text-[9px] bg-[#d48806] text-[#2c0d0d] font-black px-1.5 py-0.5 rounded-md">AIR &lt; 150</span>
            </div>
            <div className="space-y-1 text-[11px] font-bold text-[#fffdfa]">
              <div className="flex justify-between border-b border-[#fffdfa]/10 pb-0.5">
                <span>IIT Bombay (Structures/Geo):</span>
                <span className="text-[#ffe600] font-black">~72+ Marks</span>
              </div>
              <div className="flex justify-between">
                <span>Target Mission:</span>
                <span className="text-[#10b981] font-black">70+ Marks</span>
              </div>
            </div>
          </div>

          {/* Countdown Card */}
          <div className="bg-[#6b1900] border-2 border-[#d48806] p-3 rounded-2xl flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="font-black text-[#f5d6a8] flex items-center gap-1">
                <Timer className="w-3.5 h-3.5" /> GATE CE 2027
              </span>
              <span className="text-[9px] text-[#f5d6a8] font-bold">06 FEB 2027</span>
            </div>
            <div className="grid grid-cols-4 gap-1 text-center my-0.5">
              <div className="bg-[#2c0d0d] border border-[#d48806]/40 p-1 rounded-lg">
                <div className="text-sm font-black text-[#ffe600]">{timeLeft.days}</div>
                <div className="text-[7px] text-slate-300">DAYS</div>
              </div>
              <div className="bg-[#2c0d0d] border border-[#d48806]/40 p-1 rounded-lg">
                <div className="text-sm font-black text-white">{timeLeft.hours}</div>
                <div className="text-[7px] text-slate-300">HRS</div>
              </div>
              <div className="bg-[#2c0d0d] border border-[#d48806]/40 p-1 rounded-lg">
                <div className="text-sm font-black text-white">{timeLeft.minutes}</div>
                <div className="text-[7px] text-slate-300">MIN</div>
              </div>
              <div className="bg-[#2c0d0d] border border-[#d48806]/40 p-1 rounded-lg">
                <div className="text-sm font-black text-[#10b981]">{timeLeft.seconds}</div>
                <div className="text-[7px] text-slate-300">SEC</div>
              </div>
            </div>
            <div className="text-[9px] text-[#f5d6a8] flex justify-between mt-1">
              <span>Target Admission:</span>
              <span className="text-[#ffe600] font-black">IIT Bombay M.Tech</span>
            </div>
          </div>

          {/* Readiness Card */}
          <div className="bg-[#6b1900] border-2 border-[#d48806] p-3 rounded-2xl flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-black text-[#f5d6a8] flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-[#d48806]" /> READINESS
              </span>
              <span className="text-base font-black text-[#ffe600]">{overallProgress}%</span>
            </div>
            <div className="w-full bg-[#2c0d0d] h-3 rounded-full overflow-hidden border border-[#d48806]/40 my-1.5">
              <motion.div
                className="h-full bg-gradient-to-r from-[#d48806] to-[#d96b1b]"
                animate={{ width: `${overallProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-black text-[#f5d6a8]">
              <span>Ground Zero</span>
              <span>70+ Non-Negotiable</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}