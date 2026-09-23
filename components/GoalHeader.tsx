"use client";

import React, { useState, useEffect } from "react";
import { Timer, Target, Flame, DownloadCloud, RefreshCw, Sparkles } from "lucide-react";
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
    <header className="border-b-4 border-[#0b2545] bg-[#0b2545] text-white p-3 sm:p-5 shadow-[4px_4px_0px_0px_#0b2545]">
      <div className="max-w-7xl mx-auto flex flex-col gap-3">
        {/* User Profile Bar (Matching Reference Layout) */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-[#061628] border-2 border-[#e0a96d] p-2 sm:p-3 shadow-[3px_3px_0px_0px_#e0a96d]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#e0a96d] text-[#0b2545] font-black flex items-center justify-center border-2 border-[#0b2545] text-base shadow-sm">
              SK
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-white tracking-wide">
                Suman Kumar Mahato
              </h2>
              <p className="text-[10px] text-[#e0a96d] font-mono font-bold">
                ज्ञानं परमं बलम् // Target: M.Tech IIT Bombay
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {showInstallBtn && (
              <button
                onClick={handleInstallClick}
                className="bg-[#e0a96d] text-[#0b2545] text-[10px] font-black px-2.5 py-1 border-2 border-[#0b2545] shadow-[2px_2px_0px_0px_#0b2545] flex items-center gap-1 animate-pulse"
              >
                <DownloadCloud className="w-3.5 h-3.5" /> INSTALL APP
              </button>
            )}

            <button
              onClick={handleForceUpdate}
              disabled={isUpdating}
              className="bg-[#134074] hover:bg-[#1d4e89] text-[#eef4f8] px-2.5 py-1 border-2 border-[#e0a96d] font-black text-[10px] shadow-[2px_2px_0px_0px_#e0a96d] flex items-center gap-1"
            >
              <span>SYNC</span>
              <RefreshCw className={`w-3 h-3 text-[#e0a96d] ${isUpdating ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Compact Countdown & Progress Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div className="bg-[#061628] border-2 border-[#134074] p-2 rounded">
            <span className="text-[9px] text-[#8da9c4] block">GATE CE 2027</span>
            <span className="text-base font-black text-[#e0a96d]">{timeLeft.days}D : {timeLeft.hours}H</span>
          </div>
          <div className="bg-[#061628] border-2 border-[#134074] p-2 rounded">
            <span className="text-[9px] text-[#8da9c4] block">TARGET BENCHMARK</span>
            <span className="text-base font-black text-[#00e5ff]">70+ MARKS</span>
          </div>
          <div className="bg-[#061628] border-2 border-[#134074] p-2 rounded">
            <span className="text-[9px] text-[#8da9c4] block">IITB ADMISSION</span>
            <span className="text-base font-black text-amber-300">AIR &lt; 150</span>
          </div>
          <div className="bg-[#061628] border-2 border-[#134074] p-2 rounded flex flex-col justify-between">
            <div className="flex justify-between text-[9px] text-[#8da9c4]">
              <span>READINESS</span>
              <span className="text-emerald-400 font-bold">{overallProgress}%</span>
            </div>
            <div className="w-full bg-[#0b2545] h-2 rounded overflow-hidden border border-[#8da9c4]/30 mt-1">
              <motion.div
                className="h-full bg-gradient-to-r from-[#00e5ff] to-[#e0a96d]"
                animate={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}