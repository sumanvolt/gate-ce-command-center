"use client";

import React, { useState, useEffect } from "react";
import { Check, Flame, Smartphone, BookOpen, ChevronLeft, ChevronRight, CalendarCheck } from "lucide-react";

export interface DailyLog {
  date: string;
  studyHours: number;
  phoneHours: number;
  activeRecallDone: boolean;
}

export default function DailyTracker() {
  const [logs, setLogs] = useState<Record<string, DailyLog>>({});
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  const todayStr = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    const saved = localStorage.getItem("iitb_daily_logs_v1");
    if (saved) {
      try {
        setLogs(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const saveLogs = (updated: Record<string, DailyLog>) => {
    setLogs(updated);
    localStorage.setItem("iitb_daily_logs_v1", JSON.stringify(updated));
  };

  const currentLog = logs[todayStr] || {
    date: todayStr,
    studyHours: 0,
    phoneHours: 0,
    activeRecallDone: false,
  };

  const updateToday = (updates: Partial<DailyLog>) => {
    const updated = {
      ...logs,
      [todayStr]: { ...currentLog, ...updates },
    };
    saveLogs(updated);
  };

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const monthName = currentMonthDate.toLocaleString("default", { month: "long" });
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  const monthDays = Array.from({ length: totalDaysInMonth }, (_, i) => {
    const d = i + 1;
    const dayStr = d < 10 ? `0${d}` : `${d}`;
    const mStr = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
    return `${year}-${mStr}-${dayStr}`;
  });

  const nextMonth = () => setCurrentMonthDate(new Date(year, month + 1, 1));
  const prevMonth = () => setCurrentMonthDate(new Date(year, month - 1, 1));

  const monthCompletedCount = monthDays.filter((d) => {
    const entry = logs[d];
    return entry && entry.studyHours >= 5 && entry.phoneHours <= 2 && entry.activeRecallDone;
  }).length;
  const monthPercentage = Math.round((monthCompletedCount / totalDaysInMonth) * 100);

  return (
    <div className="space-y-6">
      {/* Today's Discipline Board */}
      <div className="bg-white border-2 border-[#0b2545] p-4 sm:p-6 shadow-[4px_4px_0px_0px_#0b2545]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#0b2545] pb-3 mb-4">
          <div>
            <h3 className="text-sm sm:text-base font-black uppercase text-[#0b2545]">
              POWAI GRIND PROTOCOL // {todayStr}
            </h3>
            <p className="text-[11px] text-[#134074] font-bold">Temple (05:30-07:00) | Midday Nap | Night Question Block (09:30-11:45)</p>
          </div>
          <div className="bg-[#e0a96d] text-[#0b2545] border-2 border-[#0b2545] px-3 py-1 text-xs font-black shadow-[2px_2px_0px_0px_#0b2545] flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-[#ef4444] fill-[#ef4444]" />
            IITB SCORE: {monthCompletedCount}/{totalDaysInMonth} ({monthPercentage}%)
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Target Study Hours */}
          <div className="border-2 border-[#0b2545] p-4 bg-[#eef4f8] shadow-[2px_2px_0px_0px_#0b2545] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-[#0b2545] flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#134074]" /> 5H+ DEEP STUDY
              </span>
              <span className={`text-[10px] font-black px-1.5 py-0.5 border border-[#0b2545] ${currentLog.studyHours >= 5 ? 'bg-[#10b981] text-white' : 'bg-white text-[#0b2545]'}`}>
                {currentLog.studyHours >= 5 ? "TARGET HIT" : "IN PROGRESS"}
              </span>
            </div>
            <div className="flex items-center justify-center gap-3 my-2">
              <button
                onClick={() => updateToday({ studyHours: Math.max(0, parseFloat((currentLog.studyHours - 0.5).toFixed(1))) })}
                className="w-8 h-8 font-black text-base border-2 border-[#0b2545] bg-white hover:bg-[#eef4f8] shadow-[2px_2px_0px_0px_#0b2545]"
              >
                -
              </button>
              <span className="text-2xl font-black font-mono text-[#0b2545]">{currentLog.studyHours}h</span>
              <button
                onClick={() => updateToday({ studyHours: parseFloat((currentLog.studyHours + 0.5).toFixed(1)) })}
                className="w-8 h-8 font-black text-base border-2 border-[#0b2545] bg-white hover:bg-[#eef4f8] shadow-[2px_2px_0px_0px_#0b2545]"
              >
                +
              </button>
            </div>
            <p className="text-[10px] text-center font-bold text-slate-500">College: 5h | Weekend: 9-10h</p>
          </div>

          {/* Screen Time Limit */}
          <div className="border-2 border-[#0b2545] p-4 bg-[#eef4f8] shadow-[2px_2px_0px_0px_#0b2545] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-[#0b2545] flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-[#ef4444]" /> PHONE &le; 2.0H LIMIT
              </span>
              <span className={`text-[10px] font-black px-1.5 py-0.5 border border-[#0b2545] ${currentLog.phoneHours <= 2 ? 'bg-[#10b981] text-white' : 'bg-[#ef4444] text-white'}`}>
                {currentLog.phoneHours <= 2 ? "LOCKED" : "EXCEEDED"}
              </span>
            </div>
            <div className="flex items-center justify-center gap-3 my-2">
              <button
                onClick={() => updateToday({ phoneHours: Math.max(0, parseFloat((currentLog.phoneHours - 0.25).toFixed(2))) })}
                className="w-8 h-8 font-black text-base border-2 border-[#0b2545] bg-white hover:bg-[#eef4f8] shadow-[2px_2px_0px_0px_#0b2545]"
              >
                -
              </button>
              <span className="text-2xl font-black font-mono text-[#0b2545]">{currentLog.phoneHours}h</span>
              <button
                onClick={() => updateToday({ phoneHours: parseFloat((currentLog.phoneHours + 0.25).toFixed(2)) })}
                className="w-8 h-8 font-black text-base border-2 border-[#0b2545] bg-white hover:bg-[#eef4f8] shadow-[2px_2px_0px_0px_#0b2545]"
              >
                +
              </button>
            </div>
            <p className="text-[10px] text-center font-bold text-slate-500">Adjust in 15m intervals</p>
          </div>

          {/* Active Recall Blank Sheet Exercise */}
          <div className="border-2 border-[#0b2545] p-4 bg-[#eef4f8] shadow-[2px_2px_0px_0px_#0b2545] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-[#0b2545] flex items-center gap-1.5">
                <CalendarCheck className="w-4 h-4 text-[#134074]" /> BLANK RETRIEVAL (11:45 PM)
              </span>
              <span className={`text-[10px] font-black px-1.5 py-0.5 border border-[#0b2545] ${currentLog.activeRecallDone ? 'bg-[#10b981] text-white' : 'bg-white text-[#0b2545]'}`}>
                {currentLog.activeRecallDone ? "COMPLETED" : "PENDING"}
              </span>
            </div>
            <button
              onClick={() => updateToday({ activeRecallDone: !currentLog.activeRecallDone })}
              className={`w-full py-2.5 border-2 border-[#0b2545] text-xs font-black shadow-[2px_2px_0px_0px_#0b2545] transition-all flex items-center justify-center gap-2 ${
                currentLog.activeRecallDone ? 'bg-[#10b981] text-white' : 'bg-white hover:bg-[#eef4f8] text-[#0b2545]'
              }`}
            >
              <Check className="w-4 h-4" />
              {currentLog.activeRecallDone ? "BLANK RETRIEVAL DONE" : "MARK BLANK SHEET REVIEW"}
            </button>
            <p className="text-[10px] text-center font-bold text-slate-500 mt-2">Zero-notebook formula dump</p>
          </div>
        </div>
      </div>

      {/* Monthly Momentum Grid */}
      <div className="bg-white border-2 border-[#0b2545] p-4 sm:p-6 shadow-[4px_4px_0px_0px_#0b2545]">
        <div className="flex flex-wrap items-center justify-between border-b-2 border-[#0b2545] pb-3 mb-4 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-black uppercase text-[#0b2545] flex items-center gap-1.5">
              📅 {monthName.toUpperCase()} {year} CALENDAR
            </span>
            <span className="text-[10px] bg-[#134074] text-white font-black px-2 py-0.5 border border-[#0b2545]">
              {monthCompletedCount} PERFECT DAYS
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="p-1 border-2 border-[#0b2545] bg-[#eef4f8] hover:bg-white shadow-[2px_2px_0px_0px_#0b2545]"
            >
              <ChevronLeft className="w-4 h-4 text-[#0b2545]" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1 border-2 border-[#0b2545] bg-[#eef4f8] hover:bg-white shadow-[2px_2px_0px_0px_#0b2545]"
            >
              <ChevronRight className="w-4 h-4 text-[#0b2545]" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
          {monthDays.map((d) => {
            const entry = logs[d];
            const studyPass = entry && entry.studyHours >= 5;
            const phonePass = entry && entry.phoneHours <= 2;
            const recallPass = entry && entry.activeRecallDone;
            const isFullSuccess = studyPass && phonePass && recallPass;
            const isPartial = entry && (studyPass || phonePass || recallPass);
            const isToday = d === todayStr;

            let cardBg = "bg-[#eef4f8] text-[#0b2545]";
            if (isFullSuccess) cardBg = "bg-[#10b981] text-white";
            else if (isPartial) cardBg = "bg-[#e0a96d] text-[#0b2545]";

            return (
              <div
                key={d}
                className={`border-2 border-[#0b2545] p-2 flex flex-col justify-between h-24 shadow-[2px_2px_0px_0px_#0b2545] ${cardBg} ${
                  isToday ? "ring-2 ring-[#e0a96d]" : ""
                }`}
              >
                <div className="flex justify-between items-center text-[11px] font-black">
                  <span>{d.slice(8)} {monthName.slice(0, 3)}</span>
                  {isFullSuccess && <span>⚙️ 70+</span>}
                </div>

                <div className="text-[10px] font-mono font-bold leading-tight my-1">
                  <div className="flex justify-between">
                    <span>Study:</span>
                    <span>{entry ? `${entry.studyHours}h` : "0h"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phone:</span>
                    <span>{entry ? `${entry.phoneHours}h` : "0h"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Recall:</span>
                    <span>{entry?.activeRecallDone ? "Done ✓" : "✗"}</span>
                  </div>
                </div>

                <div className="text-[8px] font-black uppercase text-center border-t border-[#0b2545]/20 pt-0.5">
                  {isFullSuccess ? "POWAI READY" : isPartial ? "PARTIAL" : "INACTIVE"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}