"use client";

import React, { useState, useEffect } from "react";
import { Plus, Minus, CheckCircle, Flame, ShieldAlert } from "lucide-react";

export default function DailyTracker() {
  const [studyHours, setStudyHours] = useState(5.0);
  const [phoneHours, setPhoneHours] = useState(1.5);
  const [blankRecall, setBlankRecall] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("suman_daily_tracker_v3");
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
      "suman_daily_tracker_v3",
      JSON.stringify({ studyHours: sh, phoneHours: ph, blankRecall: br })
    );
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 1500);
  };

  return (
    <div className="bg-white border-2 border-[#0b2545] p-3 sm:p-5 shadow-[4px_4px_0px_0px_#0b2545] space-y-4">
      <div className="flex items-center justify-between border-b-2 border-[#0b2545] pb-2">
        <div className="flex items-center gap-2 text-xs font-black text-[#0b2545]">
          <Flame className="w-4 h-4 text-[#e0a96d]" /> DAILY MOMENTUM &amp; HABIT PROTOCOL
        </div>
        {savedMsg && <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 font-bold rounded">SAVED ✓</span>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
        {/* Study Hours Card */}
        <div className="bg-[#f8fafc] border-2 border-[#0b2545] p-3 rounded flex flex-col justify-between">
          <span className="font-bold text-slate-700">DEEP STUDY (Target: 5h+)</span>
          <div className="flex items-center justify-between my-2">
            <button
              onClick={() => saveToday(Math.max(0, studyHours - 0.5), phoneHours, blankRecall)}
              className="w-8 h-8 bg-white border-2 border-[#0b2545] font-black flex items-center justify-center shadow-[2px_2px_0px_0px_#0b2545] active:translate-x-0.5 active:translate-y-0.5"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-xl font-black text-[#134074]">{studyHours}h</span>
            <button
              onClick={() => saveToday(studyHours + 0.5, phoneHours, blankRecall)}
              className="w-8 h-8 bg-[#e0a96d] text-[#0b2545] border-2 border-[#0b2545] font-black flex items-center justify-center shadow-[2px_2px_0px_0px_#0b2545] active:translate-x-0.5 active:translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <span className="text-[10px] text-slate-500">College: 5h | Weekend: 9-10h</span>
        </div>

        {/* Phone Limit Card */}
        <div className="bg-[#f8fafc] border-2 border-[#0b2545] p-3 rounded flex flex-col justify-between">
          <span className="font-bold text-slate-700">PHONE SCREEN TIME (&le; 2.0h)</span>
          <div className="flex items-center justify-between my-2">
            <button
              onClick={() => saveToday(studyHours, Math.max(0, phoneHours - 0.25), blankRecall)}
              className="w-8 h-8 bg-white border-2 border-[#0b2545] font-black flex items-center justify-center shadow-[2px_2px_0px_0px_#0b2545] active:translate-x-0.5 active:translate-y-0.5"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className={`text-xl font-black ${phoneHours <= 2.0 ? "text-emerald-600" : "text-rose-600"}`}>
              {phoneHours}h
            </span>
            <button
              onClick={() => saveToday(studyHours, phoneHours + 0.25, blankRecall)}
              className="w-8 h-8 bg-rose-200 text-rose-900 border-2 border-[#0b2545] font-black flex items-center justify-center shadow-[2px_2px_0px_0px_#0b2545] active:translate-x-0.5 active:translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <span className="text-[10px] text-slate-500">Adjust in 15m intervals</span>
        </div>

        {/* Blank Retrieval Sheet */}
        <div className="bg-[#f8fafc] border-2 border-[#0b2545] p-3 rounded flex flex-col justify-between">
          <span className="font-bold text-slate-700">ACTIVE RETRIEVAL (11:45 PM)</span>
          <button
            onClick={() => saveToday(studyHours, phoneHours, !blankRecall)}
            className={`mt-2 py-2 px-3 border-2 border-[#0b2545] text-xs font-black shadow-[2px_2px_0px_0px_#0b2545] flex items-center justify-center gap-1.5 transition-all ${
              blankRecall ? "bg-emerald-600 text-white" : "bg-white text-slate-700"
            }`}
          >
            <CheckCircle className="w-4 h-4" /> {blankRecall ? "COMPLETED ✓" : "MARK BLANK SHEET"}
          </button>
          <span className="text-[10px] text-slate-500 mt-1">Zero-notebook formula dump</span>
        </div>
      </div>
    </div>
  );
}