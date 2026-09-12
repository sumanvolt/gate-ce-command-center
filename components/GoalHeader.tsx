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
    <header className="border-b-4 border-[#0b2545] bg-[#0b2545] text-white p-3 sm:p-6 shadow-[4px_4px_0px_0px_#0b2545]">
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 max-w-full">
            <div className="flex items-center border-2 border-[#e0a96d] bg-[#061628] shadow-[2px_2px_0px_0px_#e0a96d] overflow-hidden whitespace-nowrap">
              <span className="bg-[#e0a96d] text-[#0b2545] text-[10px] sm:text-xs font-black px-2.5 py-1 tracking-wider flex items-center gap-1.5">
                <span>⚙️</span> IIT BOMBAY
              </span>
              <span className="text-[#f5d6a8] text-[9px] sm:text-[11px] font-mono font-bold px-2 py-1">
                SUMANVOLT // CE_2027
              </span>
            </div>

            <span className="hidden sm:inline-block bg-[#134074] text-[#f5d6a8] font-black text-xs px-2.5 py-1 border-2 border-[#8da9c4]">
              ज्ञानं परमं बलम्
            </span>
          </div>

          <div className="flex items-center gap-2">
            {showInstallBtn && (
              <button
                onClick={handleInstallClick}
                className="bg-[#e0a96d] hover:bg-[#f5d6a8] text-[#0b2545] text-[10px] sm:text-xs font-black px-2.5 py-1 border-2 border-[#0b2545] shadow-[2px_2px_0px_0px_#0b2545] flex items-center gap-1 animate-pulse"
              >
                <DownloadCloud className="w-3.5 h-3.5" /> INSTALL APP
              </button>
            )}

            <button
              onClick={handleForceUpdate}
              disabled={isUpdating}
              className="bg-[#134074] hover:bg-[#1d4e89] text-[#eef4f8] px-2.5 py-1 border-2 border-[#e0a96d] font-black text-[10px] sm:text-xs shadow-[2px_2px_0px_0px_#e0a96d] flex items-center gap-1.5 whitespace-nowrap transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
              <span>POWAI SYNC</span>
              <RefreshCw className={`w-3 h-3 text-[#e0a96d] ${isUpdating ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        <div className="bg-[#134074] text-[#f5d6a8] border-2 border-[#e0a96d] px-3.5 py-2 shadow-[2px_2px_0px_0px_#0b2545] flex items-center gap-2 text-xs font-bold">
          <Compass className="w-4 h-4 text-[#e0a96d] shrink-0" />
          <span>&quot;From BIT Mesra to the Powai Convocation Hall: Master Geotech, Math &amp; Environment. 70+ Marks is Non-Negotiable.&quot;</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-white text-[#0b2545] border-2 border-[#0b2545] p-3 sm:p-4 shadow-[4px_4px_0px_0px_#e0a96d] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-black tracking-wider text-[#0b2545] flex items-center gap-1.5">
                <Target className="w-4 h-4 text-[#134074]" /> IIT BOMBAY CUTOFFS
              </span>
              <span className="text-[10px] bg-[#e0a96d] text-[#0b2545] border border-[#0b2545] font-black px-1.5 py-0.2">AIR &lt; 150</span>
            </div>
            <div className="space-y-1.5 text-xs font-bold">
              <div className="flex justify-between border-b border-[#0b2545]/15 pb-0.5">
                <span>Structural Engineering:</span>
                <span className="text-[#0b2545] font-black">~74+ Marks</span>
              </div>
              <div className="flex justify-between border-b border-[#0b2545]/15 pb-0.5">
                <span>Geotechnical Engineering:</span>
                <span className="text-[#0b2545] font-black">~70+ Marks</span>
              </div>
              <div className="flex justify-between">
                <span>WRE / Transportation / Env:</span>
                <span className="text-[#10b981] font-black">~66+ Marks</span>
              </div>
            </div>
          </div>

          <div className="bg-[#061628] text-white border-2 border-[#e0a96d] p-3 sm:p-4 shadow-[4px_4px_0px_0px_#0b2545] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-black text-[#e0a96d] flex items-center gap-1.5">
                <Timer className="w-4 h-4" /> GATE CE 2027
              </span>
              <span className="text-[10px] text-[#8da9c4] font-bold">06 FEB 2027</span>
            </div>
            <div className="grid grid-cols-4 gap-1 text-center my-1">
              <div className="bg-[#0b2545] border border-[#e0a96d]/40 p-1 sm:p-1.5">
                <div className="text-lg sm:text-xl font-black text-[#e0a96d]">{timeLeft.days}</div>
                <div className="text-[8px] sm:text-[9px] text-[#8da9c4]">DAYS</div>
              </div>
              <div className="bg-[#0b2545] border border-[#e0a96d]/40 p-1 sm:p-1.5">
                <div className="text-lg sm:text-xl font-black text-white">{timeLeft.hours}</div>
                <div className="text-[8px] sm:text-[9px] text-[#8da9c4]">HRS</div>
              </div>
              <div className="bg-[#0b2545] border border-[#e0a96d]/40 p-1 sm:p-1.5">
                <div className="text-lg sm:text-xl font-black text-white">{timeLeft.minutes}</div>
                <div className="text-[8px] sm:text-[9px] text-[#8da9c4]">MIN</div>
              </div>
              <div className="bg-[#0b2545] border border-[#e0a96d]/40 p-1 sm:p-1.5">
                <div className="text-lg sm:text-xl font-black text-[#10b981]">{timeLeft.seconds}</div>
                <div className="text-[8px] sm:text-[9px] text-[#8da9c4]">SEC</div>
              </div>
            </div>
            <div className="text-[10px] text-[#f5d6a8] flex justify-between mt-0.5">
              <span>BIT Routine:</span>
              <span className="text-[#10b981] font-black">5h College / 9h Weekend</span>
            </div>
          </div>

          <div className="bg-[#134074] text-white border-2 border-[#0b2545] p-3 sm:p-4 shadow-[4px_4px_0px_0px_#e0a96d] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black tracking-wider text-[#f5d6a8] flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#e0a96d]" /> 70+ MARKS READINESS
              </span>
              <span className="text-lg sm:text-xl font-black text-white">{overallProgress}%</span>
            </div>
            <div className="w-full bg-[#0b2545] border-2 border-[#e0a96d] h-5 sm:h-6 my-1.5 relative overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#e0a96d] to-[#10b981]"
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ type: "spring", stiffness: 60 }}
              />
            </div>
            <div className="flex justify-between text-[10px] sm:text-[11px] font-black text-[#f5d6a8]">
              <span>Ground Zero</span>
              <span>Target: 70+ Marks</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}