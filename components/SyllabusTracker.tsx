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

  const statusLabels = ["NOT STARTED", "LECTURES DONE", "PYQs DONE", "MASTERED ✓"];
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

  const stepBackStatus = (
    subjKey: string,
    chapterId: string,
    subtopicId: string,
    currentStatus: number,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    const prevStatus = currentStatus === 0 ? 0 : currentStatus - 1;
    onUpdateSubtopic(subjKey, chapterId, subtopicId, { status: prevStatus });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white border-2 border-[#0b2545] p-3 sm:p-4 shadow-[4px_4px_0px_0px_#0b2545] flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#0b2545]" />
          <span className="text-xs font-black uppercase text-[#0b2545]">SYLLABUS RADAR:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {canUndo && (
            <button
              onClick={onUndo}
              className="px-2.5 py-1 text-xs font-black bg-[#ef4444] text-white border-2 border-[#0b2545] shadow-[2px_2px_0px_0px_#0b2545] flex items-center gap-1 hover:bg-red-600 active:translate-x-0.5 active:translate-y-0.5"
            >
              <RotateCcw className="w-3 h-3" /> UNDO
            </button>
          )}

          <button
            onClick={() => setFilter8020(!filter8020)}
            className={`px-3 py-1 text-xs font-black border-2 border-[#0b2545] transition-all ${
              filter8020
                ? "bg-[#e0a96d] text-[#0b2545] shadow-[2px_2px_0px_0px_#0b2545]"
                : "bg-white hover:bg-slate-100"
            }`}
          >
            ⚡ 80/20 HIGH YIELD ONLY
          </button>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
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
            <div
              key={subj.key}
              className="border-2 border-[#0b2545] bg-white shadow-[4px_4px_0px_0px_#0b2545]"
            >
              <div
                onClick={() => toggleSection(subj.key)}
                className="cursor-pointer p-3 sm:p-4 bg-[#f8fafc] hover:bg-[#eef4f8] border-b-2 border-[#0b2545] flex flex-wrap items-center justify-between gap-3 select-none"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-black text-sm sm:text-base text-[#0b2545]">{subj.title}</span>
                  <span className="bg-[#0b2545] text-[#f5d6a8] text-[10px] font-black px-2 py-0.5 border border-[#0b2545]">
                    {subj.marks}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-700">
                    {masteredSubs}/{totalSubs} Mastered ({pct}%)
                  </span>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-[#0b2545]" /> : <ChevronDown className="w-5 h-5 text-[#0b2545]" />}
                </div>
              </div>

              {isOpen && (
                <div className="divide-y-2 divide-[#0b2545]/10 p-3 sm:p-4 space-y-3">
                  {subj.chapters.map((chap) => {
                    const subtopics = chap.subtopics.filter((st) => !filter8020 || st.is8020);
                    if (subtopics.length === 0) return null;

                    return (
                      <div key={chap.id} className="pt-2">
                        <div className="text-xs font-black text-[#134074] mb-2 flex justify-between">
                          <span>{chap.title}</span>
                          <span className="text-slate-500 font-mono text-[11px]">{chap.weightage}</span>
                        </div>

                        <div className="space-y-2">
                          {subtopics.map((st) => (
                            <div
                              key={st.id}
                              className="pt-1.5 pb-1.5 flex flex-col md:flex-row md:items-center justify-between gap-2 hover:bg-[#eef4f8]/50 px-2 border-b border-slate-100"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-xs sm:text-sm text-slate-900">{st.name}</span>
                                  {st.is8020 && (
                                    <span className="bg-[#e0a96d] text-[#0b2545] text-[9px] font-black px-1.5 py-0.5 border border-[#0b2545]">
                                      80/20 CORE
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  onClick={() =>
                                    onUpdateSubtopic(subj.key, chap.id, st.id, { notesDone: !st.notesDone })
                                  }
                                  className={`px-2 py-1 text-[10px] font-black border-2 border-[#0b2545] shadow-[2px_2px_0px_0px_#0b2545] ${
                                    st.notesDone ? "bg-[#0b2545] text-white" : "bg-white text-slate-500"
                                  }`}
                                >
                                  NOTES
                                </button>

                                <button
                                  onClick={() =>
                                    onUpdateSubtopic(subj.key, chap.id, st.id, { pyqDone: !st.pyqDone })
                                  }
                                  className={`px-2 py-1 text-[10px] font-black border-2 border-[#0b2545] shadow-[2px_2px_0px_0px_#0b2545] ${
                                    st.pyqDone ? "bg-[#10b981] text-white" : "bg-white text-slate-500"
                                  }`}
                                >
                                  15Y PYQ
                                </button>

                                {st.status > 0 && (
                                  <button
                                    title="Step back"
                                    onClick={(e) => stepBackStatus(subj.key, chap.id, st.id, st.status, e)}
                                    className="p-1 text-[10px] font-black border-2 border-[#0b2545] bg-slate-200 hover:bg-rose-200 shadow-[2px_2px_0px_0px_#0b2545]"
                                  >
                                    <RotateCcw className="w-3 h-3" />
                                  </button>
                                )}

                                <button
                                  onClick={() => cycleStatus(subj.key, chap.id, st.id, st.status)}
                                  className={`px-2.5 py-1 text-[10px] font-black border-2 border-[#0b2545] ${
                                    statusBg[st.status]
                                  } shadow-[2px_2px_0px_0px_#0b2545] active:translate-x-0.5 active:translate-y-0.5`}
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