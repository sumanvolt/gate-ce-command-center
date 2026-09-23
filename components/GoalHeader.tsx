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
    <header className="border-b-4 border-[#7a1c00] bg-[#7a1c00] text-[#fffdfa] p-3 sm:p-4 rounded-b-2xl shadow-[4px_4px_0px_0px_#2c0d0d]">
      <div className="max-w-7xl mx-auto flex flex-col gap-2.5">
        {/* Top Profile & Brand Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-[#6b1900] border-2 border-[#d48806] p-2.5 rounded-xl shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#d48806] text-[#2c0d0d] font-black flex items-center justify-center border-2 border-[#fffdfa] text-xs">
              SK
            </div>
            <div>
              <h1 className="text-xs sm:text-sm font-black tracking-wide text-[#fffdfa] font-mono-code">
                Suman Kumar Mahato
              </h1>
              <p className="text-[10px] text-[#f5d6a8] font-mono-code">
                ज्ञानं परमं बलम् // IIT Bombay M.Tech
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {showInstallBtn && (
              <button
                onClick={handleInstallClick}
                className="bg-[#d48806] text-[#2c0d0d] text-[10px] font-black px-2.5 py-1 rounded-lg border-2 border-[#2c0d0d] shadow-sm animate-pulse flex items-center gap-1"
              >
                <DownloadCloud className="w-3.5 h-3.5" /> INSTALL APP
              </button>
            )}

            <button
              onClick={handleForceUpdate}
              disabled={isUpdating}
              className="bg-[#d96b1b] text-white px-2 py-1 rounded-lg border-2 border-[#2c0d0d] font-black text-[10px] flex items-center gap-1 shadow-sm transition-all"
            >
              <span>SYNC</span>
              <RefreshCw className={`w-3 h-3 text-[#ffe600] ${isUpdating ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Compact Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono-code">
          <div className="bg-[#6b1900] border-2 border-[#d48806] p-2 rounded-xl">
            <span className="text-[9px] text-[#f5d6a8] block">GATE CE 2027</span>
            <span className="text-sm sm:text-base font-black text-[#ffe600]">{timeLeft.days}D : {timeLeft.hours}H</span>
          </div>
          <div className="bg-[#6b1900] border-2 border-[#d48806] p-2 rounded-xl">
            <span className="text-[9px] text-[#f5d6a8] block">BENCHMARK</span>
            <span className="text-sm sm:text-base font-black text-[#fffdfa]">70+ MARKS</span>
          </div>
          <div className="bg-[#6b1900] border-2 border-[#d48806] p-2 rounded-xl">
            <span className="text-[9px] text-[#f5d6a8] block">TARGET ADMISSION</span>
            <span className="text-sm sm:text-base font-black text-[#ffe600]">AIR &lt; 150</span>
          </div>
          <div className="bg-[#6b1900] border-2 border-[#d48806] p-2 rounded-xl flex flex-col justify-between">
            <div className="flex justify-between text-[9px] text-[#f5d6a8]">
              <span>READINESS</span>
              <span className="text-emerald-300 font-bold">{overallProgress}%</span>
            </div>
            <div className="w-full bg-[#2c0d0d] h-2 rounded-full overflow-hidden border border-[#d48806]/40 mt-1">
              <motion.div
                className="h-full bg-gradient-to-r from-[#d48806] to-[#d96b1b]"
                animate={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}