"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Filter, RotateCcw, Check } from "lucide-react";

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
    "bg-slate-100 text-slate-700",
    "bg-[#f5d6a8] text-[#0b2545]",
    "bg-[#8da9c4] text-[#061628]",
    "bg-[#10b981] text-white",
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
      <div className="bg-white border-2 border-[#0b2545] p-3 shadow-[4px_4px_0px_0px_#0b2545] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#0b2545]" />
          <span className="text-xs font-black uppercase text-[#0b2545]">SYLLABUS RADAR:</span>
        </div>

        <div className="flex items-center gap-2">
          {canUndo && (
            <button
              onClick={onUndo}
              className="px-2 py-1 text-xs font-black bg-[#ef4444] text-white border-2 border-[#0b2545] shadow-[2px_2px_0px_0px_#0b2545] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> UNDO
            </button>
          )}

          <button
            onClick={() => setFilter8020(!filter8020)}
            className={`px-3 py-1 text-xs font-black border-2 border-[#0b2545] transition-all ${
              filter8020 ? "bg-[#e0a96d] text-[#0b2545] shadow-[2px_2px_0px_0px_#0b2545]" : "bg-white"
            }`}
          >
            ⚡ 80/20 HIGH YIELD
          </button>
        </div>
      </div>

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
            <div key={subj.key} className="border-2 border-[#0b2545] bg-white shadow-[4px_4px_0px_0px_#0b2545]">
              <div
                onClick={() => toggleSection(subj.key)}
                className="cursor-pointer p-3 bg-[#f8fafc] hover:bg-[#eef4f8] border-b-2 border-[#0b2545] flex items-center justify-between gap-2 select-none"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-black text-xs sm:text-sm text-[#0b2545]">{subj.title}</span>
                  <span className="bg-[#0b2545] text-[#f5d6a8] text-[9px] font-black px-1.5 py-0.5">
                    {subj.marks}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-slate-700">{masteredSubs}/{totalSubs} ({pct}%)</span>
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {isOpen && (
                <div className="p-3 space-y-3 divide-y divide-slate-100">
                  {subj.chapters.map((chap) => {
                    const subtopics = chap.subtopics.filter((st) => !filter8020 || st.is8020);
                    if (subtopics.length === 0) return null;

                    return (
                      <div key={chap.id} className="pt-2">
                        <div className="text-[11px] font-black text-[#134074] mb-2 flex justify-between">
                          <span>{chap.title}</span>
                          <span className="text-slate-400 font-mono text-[10px]">{chap.weightage}</span>
                        </div>

                        <div className="space-y-1.5">
                          {subtopics.map((st) => (
                            <div
                              key={st.id}
                              className="p-2 bg-[#f8fafc] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-xs font-bold text-slate-800 truncate">{st.name}</span>
                                {st.is8020 && (
                                  <span className="bg-[#e0a96d] text-[#0b2545] text-[8px] font-black px-1 rounded shrink-0">
                                    80/20
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0 text-[10px] font-mono">
                                {/* Notes Toggle */}
                                <button
                                  onClick={() =>
                                    onUpdateSubtopic(subj.key, chap.id, st.id, { notesDone: !st.notesDone })
                                  }
                                  className={`px-2 py-0.5 border border-[#0b2545] font-bold ${
                                    st.notesDone ? "bg-[#0b2545] text-white" : "bg-white text-slate-600"
                                  }`}
                                >
                                  NOTES
                                </button>

                                {/* PYQ Toggle */}
                                <button
                                  onClick={() =>
                                    onUpdateSubtopic(subj.key, chap.id, st.id, { pyqDone: !st.pyqDone })
                                  }
                                  className={`px-2 py-0.5 border border-[#0b2545] font-bold ${
                                    st.pyqDone ? "bg-emerald-600 text-white" : "bg-white text-slate-600"
                                  }`}
                                >
                                  PYQ
                                </button>

                                {/* DPP Toggle */}
                                <button
                                  onClick={() =>
                                    onUpdateSubtopic(subj.key, chap.id, st.id, { dppDone: !st.dppDone })
                                  }
                                  className={`px-2 py-0.5 border border-[#0b2545] font-bold ${
                                    st.dppDone ? "bg-[#134074] text-white" : "bg-white text-slate-600"
                                  }`}
                                >
                                  DPP
                                </button>

                                {/* Status Cycle Button */}
                                <button
                                  onClick={() => cycleStatus(subj.key, chap.id, st.id, st.status)}
                                  className={`px-2.5 py-0.5 border border-[#0b2545] font-black ${statusBg[st.status]}`}
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