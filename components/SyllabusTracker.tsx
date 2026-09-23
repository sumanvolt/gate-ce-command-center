"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Filter, RotateCcw } from "lucide-react";

export interface GateSubTopic {
  id: string;
  name: string;
  is8020: boolean;
  status: number; // 0: Not Started, 1: Reading, 2: PYQ Done, 3: Mastered
  notesDone: boolean;
  pyqDone: boolean;
  dppDone: boolean;
}

export interface GateChapter {
  id: string;
  title: string;
  weightage: string;
  subtopics: GateSubTopic[];
}

export interface GateSubjectGroup {
  key: string;
  title: string;
  marks: string;
  chapters: GateChapter[];
}

interface SyllabusTrackerProps {
  subjects: GateSubjectGroup[];
  onUpdateSubtopic: (
    subjKey: string,
    chapterId: string,
    subtopicId: string,
    updates: Partial<GateSubTopic>
  ) => void;
  onUndo: () => void;
  canUndo: boolean;
}

export default function SyllabusTracker({
  subjects,
  onUpdateSubtopic,
  onUndo,
  canUndo,
}: SyllabusTrackerProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ geotech: true });
  const [filter8020, setFilter8020] = useState(false);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const statusLabels = ["NOT STARTED", "LECTURES", "PYQs", "MASTERED ✓"];
  const statusBg = [
    "bg-[#fff8f0] text-slate-500",
    "bg-[#d48806] text-[#2c0d0d]",
    "bg-[#d96b1b] text-white",
    "bg-emerald-700 text-white",
  ];

  const cycleStatus = (
    subjKey: string,
    chapterId: string,
    subtopicId: string,
    currentStatus: number
  ) => {
    const nextStatus = (currentStatus + 1) % 4;
    onUpdateSubtopic(subjKey, chapterId, subtopicId, { status: nextStatus });
  };

  return (
    <div className="space-y-4">
      {/* Action & Filter Bar */}
      <div className="bg-[#fffdfa] border-2 border-[#7a1c00] p-3 rounded-2xl shadow-[4px_4px_0px_0px_#7a1c00] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#7a1c00]" />
          <span className="text-xs font-black uppercase text-[#7a1c00] font-mono-code">SYLLABUS RADAR:</span>
        </div>

        <div className="flex items-center gap-2">
          {canUndo && (
            <button
              onClick={onUndo}
              className="px-2 py-1 text-xs font-black bg-rose-700 text-white border-2 border-[#7a1c00] rounded-xl shadow-sm flex items-center gap-1 active:scale-95"
            >
              <RotateCcw className="w-3 h-3" /> UNDO
            </button>
          )}

          <button
            onClick={() => setFilter8020(!filter8020)}
            className={`px-3 py-1 text-xs font-black border-2 border-[#7a1c00] rounded-xl transition-all shadow-sm active:scale-95 ${
              filter8020 ? "bg-[#d48806] text-[#2c0d0d]" : "bg-white text-[#7a1c00] hover:bg-[#fff8f0]"
            }`}
          >
            ⚡ 80/20 HIGH YIELD
          </button>
        </div>
      </div>

      {/* Syllabus Accordion Lists */}
      <div className="space-y-3">
        {subjects.map((subj) => {
          const isOpen = openSections[subj.key] ?? false;
          let totalSubs = 0;
          let masteredSubs = 0;

          subj.chapters.forEach((c) => {
            c.subtopics.forEach((st) => {
              totalSubs++;
              if (st.status === 3) masteredSubs++;
            });
          });

          const pct = totalSubs > 0 ? Math.round((masteredSubs / totalSubs) * 100) : 0;

          return (
            <div key={subj.key} className="border-2 border-[#7a1c00] bg-[#fffdfa] rounded-2xl shadow-[4px_4px_0px_0px_#7a1c00] overflow-hidden">
              <div
                onClick={() => toggleSection(subj.key)}
                className="cursor-pointer p-3 bg-[#fff8f0] hover:bg-[#ffeedb] border-b-2 border-[#7a1c00]/30 flex items-center justify-between gap-2 select-none"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-black text-xs sm:text-sm text-[#7a1c00] font-mono-code">{subj.title}</span>
                  <span className="bg-[#7a1c00] text-[#f5d6a8] rounded-md text-[9px] font-black px-2 py-0.5">
                    {subj.marks}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-slate-700 font-mono-code">{masteredSubs}/{totalSubs} ({pct}%)</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-[#7a1c00]" /> : <ChevronDown className="w-4 h-4 text-[#7a1c00]" />}
                </div>
              </div>

              {isOpen && (
                <div className="p-3 space-y-3 divide-y divide-[#7a1c00]/10">
                  {subj.chapters.map((chap) => {
                    const subtopics = chap.subtopics.filter((st) => !filter8020 || st.is8020);
                    if (subtopics.length === 0) return null;

                    return (
                      <div key={chap.id} className="pt-2">
                        <div className="text-[11px] font-black text-[#d96b1b] mb-2 flex justify-between font-mono-code">
                          <span>{chap.title}</span>
                          <span className="text-slate-500">{chap.weightage}</span>
                        </div>

                        <div className="space-y-2">
                          {subtopics.map((st) => (
                            <div
                              key={st.id}
                              className="p-2 bg-[#fffdfa] border border-[#7a1c00]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-xs font-bold text-[#2c0d0d] truncate">{st.name}</span>
                                {st.is8020 && (
                                  <span className="bg-[#d48806] text-[#2c0d0d] text-[8px] font-black px-1.5 py-0.5 rounded-md shrink-0">
                                    80/20
                                  </span>
                                )}
                              </div>

                              {/* Single-Line Action Grid */}
                              <div className="flex items-center gap-1.5 shrink-0 text-[10px] font-mono-code overflow-x-auto scrollbar-none">
                                <button
                                  onClick={() =>
                                    onUpdateSubtopic(subj.key, chap.id, st.id, { notesDone: !st.notesDone })
                                  }
                                  className={`px-2 py-1 border-2 border-[#7a1c00] rounded-lg font-bold shadow-sm active:scale-95 ${
                                    st.notesDone ? "bg-[#7a1c00] text-white" : "bg-white text-slate-500"
                                  }`}
                                >
                                  NOTES
                                </button>

                                <button
                                  onClick={() =>
                                    onUpdateSubtopic(subj.key, chap.id, st.id, { pyqDone: !st.pyqDone })
                                  }
                                  className={`px-2 py-1 border-2 border-[#7a1c00] rounded-lg font-bold shadow-sm active:scale-95 ${
                                    st.pyqDone ? "bg-[#d96b1b] text-white" : "bg-white text-slate-500"
                                  }`}
                                >
                                  PYQ
                                </button>

                                <button
                                  onClick={() =>
                                    onUpdateSubtopic(subj.key, chap.id, st.id, { dppDone: !st.dppDone })
                                  }
                                  className={`px-2 py-1 border-2 border-[#7a1c00] rounded-lg font-bold shadow-sm active:scale-95 ${
                                    st.dppDone ? "bg-[#d48806] text-[#2c0d0d]" : "bg-white text-slate-500"
                                  }`}
                                >
                                  DPP
                                </button>

                                <button
                                  onClick={() => cycleStatus(subj.key, chap.id, st.id, st.status)}
                                  className={`px-2.5 py-1 border-2 border-[#7a1c00] rounded-lg font-black shadow-sm active:scale-95 ${statusBg[st.status]}`}
                                >
                                  {statusLabels[st.status]}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}