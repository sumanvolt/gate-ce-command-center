"use client";

import React, { useState, useEffect } from "react";
import GoalHeader from "@/components/GoalHeader";
import DailyTracker from "@/components/DailyTracker";
import SyllabusTracker, { GateSubjectGroup, GateSubTopic } from "@/components/SyllabusTracker";
import PWMockLogger, { GateMockEntry } from "@/components/PWMockLogger";
import { RotateCcw } from "lucide-react";

export const IITB_CIVIL_SYLLABUS: GateSubjectGroup[] = [
  {
    key: "geotech",
    title: "Geotechnical Engineering",
    marks: "~14-16 Marks [Core Trinity]",
    chapters: [
      {
        id: "geo-c1",
        title: "Soil Mechanics & Foundation Core",
        weightage: "~15M",
        subtopics: [
          { id: "g-1", name: "Three-phase system, void ratio, porosity, saturation & index relations", is8020: true, status: 0, notesDone: false, pyqDone: false, dppDone: false },
          { id: "g-2", name: "Atterberg limits, plasticity chart & IS soil classification", is8020: true, status: 0, notesDone: false, pyqDone: false, dppDone: false },
          { id: "g-3", name: "Darcy's law, permeability & effective stress concept", is8020: true, status: 0, notesDone: false, pyqDone: false, dppDone: false },
          { id: "g-4", name: "Terzaghi consolidation theory, Mohr-Coulomb shear strength & bearing capacity", is8020: true, status: 0, notesDone: false, pyqDone: false, dppDone: false },
        ],
      },
    ],
  },
  {
    key: "math",
    title: "Engineering Mathematics",
    marks: "13 Marks [Mandatory]",
    chapters: [
      {
        id: "mat-c1",
        title: "Linear Algebra, Calculus & Probability",
        weightage: "~13M",
        subtopics: [
          { id: "m-1", name: "Matrix rank, system of linear equations (AX=B) & Eigenvalues", is8020: true, status: 0, notesDone: false, pyqDone: false, dppDone: false },
          { id: "m-2", name: "Vector Calculus (Gradient, Divergence, Curl, Gauss/Stokes theorems)", is8020: true, status: 0, notesDone: false, pyqDone: false, dppDone: false },
          { id: "m-3", name: "Probability distributions (Poisson, Normal) & Numerical Methods", is8020: true, status: 0, notesDone: false, pyqDone: false, dppDone: false },
        ],
      },
    ],
  },
  {
    key: "env",
    title: "Environmental Engineering",
    marks: "~10-12 Marks [Core Trinity]",
    chapters: [
      {
        id: "env-c1",
        title: "Water & Wastewater Engineering",
        weightage: "~11M",
        subtopics: [
          { id: "e-1", name: "Water quality standards, sedimentation, rapid sand filters & chlorination", is8020: true, status: 0, notesDone: false, pyqDone: false, dppDone: false },
          { id: "e-2", name: "BOD kinetics, Activated Sludge Process (ASP) & Streeter-Phelps sag equation", is8020: true, status: 0, notesDone: false, pyqDone: false, dppDone: false },
        ],
      },
    ],
  },
];

export default function GateDashboard() {
  const [subjects, setSubjects] = useState<GateSubjectGroup[]>(IITB_CIVIL_SYLLABUS);
  const [gateTests, setGateTests] = useState<GateMockEntry[]>([]);
  const [activeTab, setActiveTab] = useState<"habits" | "syllabus" | "mocks">("habits");

  const [syllabusHistory, setSyllabusHistory] = useState<GateSubjectGroup[][]>([]);
  const [mockHistory, setMockHistory] = useState<GateMockEntry[][]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("suman_gate_ce_singleface_v2");
    if (saved) {
      try {
        setSubjects(JSON.parse(saved));
      } catch (e) {}
    }
    const savedMocks = localStorage.getItem("suman_gate_ce_mocks_singleface_v2");
    if (savedMocks) {
      try {
        setGateTests(JSON.parse(savedMocks));
      } catch (e) {}
    }
  }, []);

  const handleUpdateSubtopic = (
    subjKey: string,
    chapterId: string,
    subtopicId: string,
    updates: Partial<GateSubTopic>
  ) => {
    setSyllabusHistory((prev) => [...prev.slice(-20), JSON.parse(JSON.stringify(subjects))]);

    const updated = subjects.map((subj) => {
      if (subj.key !== subjKey) return subj;
      return {
        ...subj,
        chapters: subj.chapters.map((chap) => {
          if (chap.id !== chapterId) return chap;
          return {
            ...chap,
            subtopics: chap.subtopics.map((st) =>
              st.id === subtopicId ? { ...st, ...updates } : st
            ),
          };
        }),
      };
    });

    setSubjects(updated);
    localStorage.setItem("suman_gate_ce_singleface_v2", JSON.stringify(updated));
  };

  const handleUndoSubtopic = () => {
    if (syllabusHistory.length === 0) return;
    const prev = syllabusHistory[syllabusHistory.length - 1];
    setSyllabusHistory((p) => p.slice(0, -1));
    setSubjects(prev);
    localStorage.setItem("suman_gate_ce_singleface_v2", JSON.stringify(prev));
  };

  const handleAddTest = (entry: GateMockEntry) => {
    setMockHistory((prev) => [...prev.slice(-10), JSON.parse(JSON.stringify(gateTests))]);
    const updated = [...gateTests, entry];
    setGateTests(updated);
    localStorage.setItem("suman_gate_ce_mocks_singleface_v2", JSON.stringify(updated));
  };

  const handleUndoMock = () => {
    if (mockHistory.length === 0) return;
    const prev = mockHistory[mockHistory.length - 1];
    setMockHistory((p) => p.slice(0, -1));
    setGateTests(prev);
    localStorage.setItem("suman_gate_ce_mocks_singleface_v2", JSON.stringify(prev));
  };

  let earnedScore = 0;
  let maxPossibleScore = 0;

  subjects.forEach((s) => {
    s.chapters.forEach((c) => {
      c.subtopics.forEach((st) => {
        maxPossibleScore += 100;
        const statusPoints = (st.status / 3) * 50;
        const notesPoints = st.notesDone ? 25 : 0;
        const pyqPoints = st.pyqDone ? 25 : 0;
        earnedScore += statusPoints + notesPoints + pyqPoints;
      });
    });
  });

  const overallProgress =
    maxPossibleScore > 0 ? Math.round((earnedScore / maxPossibleScore) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#eef4f8] overflow-x-hidden">
      <GoalHeader overallProgress={overallProgress} />

      <main className="max-w-7xl mx-auto w-full p-2.5 sm:p-5 flex-1 space-y-3">
        {/* Navigation Tabs (DISCIPLINE, SYLLABUS, MOCKS) */}
        <div className="flex items-center justify-between border-b-2 border-[#0b2545] pb-2 gap-2 overflow-x-auto scrollbar-none whitespace-nowrap">
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setActiveTab("habits")}
              className={`px-3 py-1.5 text-xs font-black border-2 border-[#0b2545] rounded transition-all shrink-0 ${
                activeTab === "habits"
                  ? "bg-white text-[#0b2545] shadow-[2px_2px_0px_0px_#0b2545]"
                  : "bg-[#8da9c4]/20 text-[#0b2545] hover:bg-white"
              }`}
            >
              📅 DISCIPLINE
            </button>
            <button
              onClick={() => setActiveTab("syllabus")}
              className={`px-3 py-1.5 text-xs font-black border-2 border-[#0b2545] rounded transition-all shrink-0 ${
                activeTab === "syllabus"
                  ? "bg-white text-[#0b2545] shadow-[2px_2px_0px_0px_#0b2545]"
                  : "bg-[#8da9c4]/20 text-[#0b2545] hover:bg-white"
              }`}
            >
              ⚙️ SYLLABUS
            </button>
            <button
              onClick={() => setActiveTab("mocks")}
              className={`px-3 py-1.5 text-xs font-black border-2 border-[#0b2545] rounded transition-all shrink-0 ${
                activeTab === "mocks"
                  ? "bg-white text-[#0b2545] shadow-[2px_2px_0px_0px_#0b2545]"
                  : "bg-[#8da9c4]/20 text-[#0b2545] hover:bg-white"
              }`}
            >
              🎯 MOCKS
            </button>
          </div>

          {activeTab === "syllabus" && syllabusHistory.length > 0 && (
            <button
              onClick={handleUndoSubtopic}
              className="px-2.5 py-1 text-xs font-black bg-[#ef4444] text-white border-2 border-[#0b2545] shadow-[1px_1px_0px_0px_#0b2545] flex items-center gap-1 shrink-0"
            >
              <RotateCcw className="w-3 h-3" /> UNDO
            </button>
          )}

          {activeTab === "mocks" && mockHistory.length > 0 && (
            <button
              onClick={handleUndoMock}
              className="px-2.5 py-1 text-xs font-black bg-[#ef4444] text-white border-2 border-[#0b2545] shadow-[1px_1px_0px_0px_#0b2545] flex items-center gap-1 shrink-0"
            >
              <RotateCcw className="w-3 h-3" /> UNDO TEST
            </button>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === "habits" && <DailyTracker />}

        {activeTab === "syllabus" && (
          <SyllabusTracker
            subjects={subjects}
            onUpdateSubtopic={handleUpdateSubtopic}
            onUndo={handleUndoSubtopic}
            canUndo={syllabusHistory.length > 0}
          />
        )}

        {activeTab === "mocks" && (
          <PWMockLogger
            tests={gateTests}
            onAddTest={handleAddTest}
            subjects={subjects}
            onUndoLastTest={handleUndoMock}
            canUndoTest={mockHistory.length > 0}
          />
        )}
      </main>

      <footer className="bg-[#0b2545] text-[#8da9c4] border-t-4 border-[#0b2545] p-4 mt-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs font-mono">
          <span>SUMAN KUMAR MAHATO // IIT BOMBAY</span>
          <span className="text-[#e0a96d]">ज्ञानं परमं बलम्</span>
        </div>
      </footer>
    </div>
  );
}