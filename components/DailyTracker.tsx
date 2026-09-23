"use client";

import React, { useState, useEffect } from "react";
import { Plus, Minus, CheckCircle, Flame } from "lucide-react";

export default function DailyTracker() {
  const [studyHours, setStudyHours] = useState(5.0);
  const [phoneHours, setPhoneHours] = useState(1.5);
  const [blankRecall, setBlankRecall] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("suman_editorial_daily_v1");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setStudyHours(data.studyHours ?? 5.0);
        setPhoneHours(data.phoneHours ?? 1.5);
        setBlankRecall(data.blankRecall ?? false);
      } catch (e) {}
    }
  }, []);

  const saveToday = (sh: number, ph: number, br: boolean) => {
    setStudyHours(sh);
    setPhoneHours(ph);
    setBlankRecall(br);
    localStorage.setItem(
      "suman_editorial_daily_v1",
      JSON.stringify({ studyHours: sh, phoneHours: ph, blankRecall: br })
    );
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 1200);
  };

  return (
    <div className="bg-[#fffdfa] border-2 border-[#7a1c00] p-3 sm:p-4 rounded-2xl shadow-[4px_4px_0px_0px_#7a1c00] space-y-3">
      <div className="flex items-center justify-between border-b-2 border-[#7a1c00]/20 pb-2">
        <div className="flex items-center gap-2 text-xs font-black text-[#7a1c00] font-mono-code">
          <Flame className="w-4 h-4 text-[#d48806]" /> DAILY HABIT MOMENTUM PROTOCOL
        </div>
        {savedMsg && <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 font-bold rounded-lg">SAVED ✓</span>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono-code">
        {/* Study Hours */}
        <div className="bg-[#fff8f0] border-2 border-[#7a1c00] p-3 rounded-xl flex flex-col justify-between shadow-sm">
          <span className="font-bold text-[#7a1c00]">DEEP STUDY (Target: 5h+)</span>
          <div className="flex items-center justify-between my-2">
            <button
              onClick={() => saveToday(Math.max(0, studyHours - 0.5), phoneHours, blankRecall)}
              className="w-8 h-8 bg-white border-2 border-[#7a1c00] rounded-xl font-black flex items-center justify-center shadow-sm active:scale-95"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-lg font-black text-[#d48806]">{studyHours}h</span>
            <button
              onClick={() => saveToday(studyHours + 0.5, phoneHours, blankRecall)}
              className="w-8 h-8 bg-[#d48806] text-[#2c0d0d] border-2 border-[#7a1c00] rounded-xl font-black flex items-center justify-center shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <span className="text-[10px] text-slate-600">College: 5h | Weekend: 9-10h</span>
        </div>

        {/* Phone Limit */}
        <div className="bg-[#fff8f0] border-2 border-[#7a1c00] p-3 rounded-xl flex flex-col justify-between shadow-sm">
          <span className="font-bold text-[#7a1c00]">PHONE SCREEN TIME (&le; 2.0h)</span>
          <div className="flex items-center justify-between my-2">
            <button
              onClick={() => saveToday(studyHours, Math.max(0, phoneHours - 0.25), blankRecall)}
              className="w-8 h-8 bg-white border-2 border-[#7a1c00] rounded-xl font-black flex items-center justify-center shadow-sm active:scale-95"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className={`text-lg font-black ${phoneHours <= 2.0 ? "text-emerald-700" : "text-rose-700"}`}>
              {phoneHours}h
            </span>
            <button
              onClick={() => saveToday(studyHours, phoneHours + 0.25, blankRecall)}
              className="w-8 h-8 bg-rose-200 text-rose-900 border-2 border-[#7a1c00] rounded-xl font-black flex items-center justify-center shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <span className="text-[10px] text-slate-600">Adjust in 15m intervals</span>
        </div>

        {/* Blank Recall */}
        <div className="bg-[#fff8f0] border-2 border-[#7a1c00] p-3 rounded-xl flex flex-col justify-between shadow-sm">
          <span className="font-bold text-[#7a1c00]">ACTIVE RETRIEVAL (11:45 PM)</span>
          <button
            onClick={() => saveToday(studyHours, phoneHours, !blankRecall)}
            className={`mt-2 py-2 px-3 border-2 border-[#7a1c00] rounded-xl text-xs font-black shadow-sm flex items-center justify-center gap-1.5 transition-all ${
              blankRecall ? "bg-emerald-700 text-white" : "bg-white text-slate-700"
            }`}
          >
            <CheckCircle className="w-4 h-4" /> {blankRecall ? "COMPLETED ✓" : "MARK BLANK SHEET"}
          </button>
          <span className="text-[10px] text-slate-600 mt-1">Zero-notebook formula dump</span>
        </div>
      </div>
    </div>
  );
}