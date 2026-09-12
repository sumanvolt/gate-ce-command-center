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
    title: "Geotechnical Engineering (Soil Mechanics & Foundations)",
    marks: "~14-16 Marks [5th Sem Core]",
    chapters: [
      {
        id: "geo-c1",
        title: "Soil Mechanics: Properties, Permeability & Seepage",
        weightage: "~6-7 Marks",
        subtopics: [
          { id: "g-1", name: "Three-phase system, void ratio, porosity, saturation & index relations", is8020: true, status: 0, notesDone: false, pyqDone: false },
          { id: "g-2", name: "Atterberg limits, plasticity chart & IS soil classification", is8020: true, status: 0, notesDone: false, pyqDone: false },
          { id: "g-3", name: "Darcy's law, 1D/stratified permeability & discharge velocity", is8020: true, status: 0, notesDone: false, pyqDone: false },
          { id: "g-4", name: "Effective stress concept, pore water pressure & quicksand gradient", is8020: true, status: 0, notesDone: false, pyqDone: false },
          { id: "g-5", name: "2D Seepage, flow nets, Laplace equation, uplift force & piping failure", is8020: true, status: 0, notesDone: false, pyqDone: false },
        ],
      },
      {
        id: "geo-c2",
        title: "Consolidation, Shear Strength & Compaction",
        weightage: "~4-5 Marks",
        subtopics: [
          { id: "g-6", name: "Compaction parameters (MDD, OMC) & field rolling equipment", is8020: false, status: 0, notesDone: false, pyqDone: false },
          { id: "g-7", name: "Terzaghi 1D consolidation theory, Cc, mv, cv, time factor & settlement", is8020: true, status: 0, notesDone: false, pyqDone: false },
          { id: "g-8", name: "Mohr-Coulomb failure criterion, stress paths & shear strength (c, φ)", is8020: true, status: 0, notesDone: false, pyqDone: false },
          { id: "g-9", name: "Laboratory shear tests: Direct shear, Triaxial (UU, CU, CD) & pore pressure", is8020: true, status: 0, notesDone: false, pyqDone: false },
        ],
      },
      {
        id: "geo-c3",
        title: "Earth Pressures & Foundation Engineering",
        weightage: "~4-5 Marks",
        subtopics: [
          { id: "g-10", name: "Earth pressure: Rankine & Coulomb active/passive states on retaining walls", is8020: true, status: 0, notesDone: false, pyqDone: false },
          { id: "g-11", name: "Shallow foundations: Terzaghi & Meyerhof bearing capacity with water table", is8020: true, status: 0, notesDone: false, pyqDone: false },
          { id: "g-12", name: "Deep foundations: Static pile load capacity, group efficiency & negative skin friction", is8020: true, status: 0, notesDone: false, pyqDone: false },
          { id: "g-13", name: "Subsurface investigation: SPT, CPT, plate load test & corrections", is8020: true, status: 0, notesDone: false, pyqDone: false },
        ],
      },
    ],
  },
  {
    key: "aptitude",
    title: "General Aptitude",
    marks: "15 Marks [High ROI]",
    chapters: [
      {
        id: "apt-c1",
        title: "Quantitative & Analytical Aptitude",
        weightage: "~10 Marks",
        subtopics: [
          { id: "apt-1", name: "Ratios, percentages, profit-loss, work-time & speed-distance-time", is8020: true, status: 0, notesDone: false, pyqDone: false },
          { id: "apt-2", name: "Data interpretation: Charts, histograms, tables & linear equations", is8020: true, status: 0, notesDone: false, pyqDone: false },
          { id: "apt-3", name: "Spatial reasoning: 2D/3D paper folding, transformations, reflections", is8020: true, status: 0, notesDone: false, pyqDone: false },
        ],
      },
      {
        id: "apt-c2",
        title: "Verbal Aptitude",
        weightage: "~5 Marks",
        subtopics: [
          { id: "apt-4", name: "English grammar, vocabulary, sentence completion & reading comprehension", is8020: false, status: 0, notesDone: false, pyqDone: false },
          { id: "apt-5", name: "Critical reasoning & logical deduction", is8020: true, status: 0, notesDone: false, pyqDone: false },
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
        title: "Linear Algebra & Calculus",
        weightage: "~6-7 Marks",
        subtopics: [
          { id: "m-1", name: "Matrix operations, rank, consistency of system of linear equations (AX=B)", is8020: true, status: 0, notesDone: false, pyqDone: false },
          { id: "m-2", name: "Eigenvalues, eigenvectors & Cayley-Hamilton theorem", is8020: true, status: 0, notesDone: false, pyqDone: false },
          { id: "m-3", name: "Calculus: Maxima-minima, Taylor/Maclaurin series, indeterminate forms", is8020: true, status: 0, notesDone: false, pyqDone: false },
          { id: "m-4", name: "Vector Calculus: Gradient, divergence, curl, line/surface integrals & Gauss/Stokes", is8020: true, status: 0, notesDone: false, pyqDone: false },
        ],
      },
      {
        id: "mat-c2",
        title: "Differential Equations, Probability & Numerical Methods",
        weightage: "~6-7 Marks",
        subtopics: [
          { id: "m-5", name: "First-order ODEs & higher-order linear ODEs with constant coefficients", is8020: true, status: 0, notesDone: false, pyqDone: false },
          { id: "m-6", name: "Probability: Conditional probability, Bayes theorem, Poisson & Normal distributions", is8020: true, status: 0, notesDone: false, pyqDone: false },
          { id: "m-7", name: "Numerical methods: Newton-Raphson method, Trapezoidal & Simpson 1/3 rule", is8020: true, status: 0, notesDone: false, pyqDone: false },
        ],
      },
    ],
  },
  {
    key: "env",
    title: "Environmental Engineering",
    marks: "~10-12 Marks [5th Sem Core]",
    chapters: [
      {
        id: "env-c1",
        title: "Water Quality & Purification Engineering",
        weightage: "~5-6 Marks",
        subtopics: [
          { id: "e-1", name: "Water quality standards: Hardness, alkalinity, turbidity, MPN & chlorides", is8020: true, status: 0, notesDone: false, pyqDone: false },
          { id: "e-2", name: "Coagulation, flocculation & Stokes settling velocity in sedimentation tanks", is8020: true, status: 0, notesDone: false, pyqDone: false },
          { id: "e-3", name: "Filtration: Rapid sand filters, backwashing mechanics & design parameters", is8020: true, status: 0, notesDone: false, pyqDone: false },
          { id: "e-4", name: "Disinfection kinetics: Chlorination, breakpoint chlorination & residual chlorine", is8020: true, status: 0, notesDone: false, pyqDone: false },
        ],
      },
      {
        id: "env-c2",
        title: "Wastewater, Air Pollution & Solid Waste",
        weightage: "~5-6 Marks",
        subtopics: [
          { id: "e-5", name: "BOD kinetics (1st order rate, ultimate BOD), COD, ThOD & population equivalent", is8020: true, status: 0, notesDone: false, pyqDone: false },
          { id: "e-6", name: "Activated Sludge Process (ASP): F/M ratio, HRT, SRT & Sludge Volume Index (SVI)", is8020: true, status: 0, notesDone: false, pyqDone: false },
          { id: "e-7", name: "Streeter-Phelps oxygen sag equation & river self-purification constant", is8020: true, status: 0, notesDone: false, pyqDone: false },
          { id: "e-8", name: "Air pollution: Gaussian dispersion plume model, lapse rates, AQI limits & noise Leq", is8020: true, status: 0, notesDone: false, pyqDone: false },
        ],
      },
    ],
  },
  {
    key: "transportation",
    title: "Transportation Engineering",
    marks: "~8-10 Marks [5th Sem Core]",
    chapters: [
      {
        id: "trans-c1",
        title: "Highway Geometric Design & Traffic Engineering",
        weightage: "~6-7 Marks",
        subtopics: [
          { id: "t-1", name: "Sight distances: Stopping Sight Distance (SSD) & Overtaking Sight Distance (OSD)", is8020: true, status: 0, notesDone: false, pyqDone: false },
          { id: "t-2", name: "Horizontal alignment: Super-elevation (e+f=v²/127R), widening & transition curves", is8020: true, status: 0, notesDone: false, pyqDone: false },
          { id: "t-3", name: "Vertical alignment: Summit & valley parabolic curve design", is8020: true, status: 0, notesDone: false, pyqDone: false },
          { id: "t-4", name: "Traffic engineering: Greenshields traffic stream model, capacity & LOS", is8020: true, status: 0, notesDone: false, pyqDone: false },
          { id: "t-5", name: "Signal design: Webster method, cycle time & delay analysis", is8020: true, status: 0, notesDone: false, pyqDone: false },
        ],
      },
      {
        id: "trans-c2",
        title: "Pavements, Railways & Airports",
        weightage: "~3-4 Marks",
        subtopics: [
          { id: "t-6", name: "Pavement design: IRC 37 flexible pavement ESAL & IRC 58 rigid pavement factors", is8020: true, status: 0, notesDone: false, pyqDone: false },
          { id: "t-7", name: "Railway & Airport: Cant deficiency, max permissible speed & runway corrections", is8020: false, status: 0, notesDone: false, pyqDone: false },
        ],
      },
    ],
  },
  {
    key: "wre_fluid",
    title: "Water Resources & Fluid Mechanics",
    marks: "~8-10 Marks [5th Sem Core]",
    chapters: [
      {
        id: "wre-c1",
        title: "Fluid Mechanics & Open Channel Flow",
        weightage: "~5-6 Marks",
        subtopics: [
          { id: "w-1", name: "Fluid kinematics & dynamics: Continuity, Bernoulli theorem & pipe head loss", is8020: true, status: 0, notesDone: false, pyqDone: false },
          { id: "w-2", name: "Open Channel Flow: Specific energy, critical depth, hydraulic jump & GVF profiles", is8020: true, status: 0, notesDone: false, pyqDone: false },
        ],
      },
      {
        id: "wre-c2",
        title: "Hydrology & Irrigation Engineering",
        weightage: "~4-5 Marks",
        subtopics: [
          { id: "w-3", name: "Hydrographs: Unit Hydrograph (UH) convolution, S-curve derivation & synthetic UH", is8020: true, status: 0, notesDone: false, pyqDone: false },
          { id: "w-4", name: "Groundwater & Irrigation: Darcy's law, well hydraulics, Duty, Delta & silt theories", is8020: true, status: 0, notesDone: false, pyqDone: false },
        ],
      },
    ],
  },
  {
    key: "structures",
    title: "Structural Mechanics, RCC & Steel",
    marks: "~14-16 Marks",
    chapters: [
      {
        id: "str-c1",
        title: "SOM & Structural Analysis",
        weightage: "~7-8 Marks",
        subtopics: [
          { id: "s-1", name: "Stress-strain, Mohr's circle, SFD/BMD & bending/shear stresses", is8020: true, status: 0, notesDone: false, pyqDone: false },
          { id: "s-2", name: "Deflection of beams, Castigliano's theorem & determinate plane trusses", is8020: true, status: 0, notesDone: false, pyqDone: false },
          { id: "s-3", name: "Indeterminate analysis: Moment distribution method & slope deflection", is8020: true, status: 0, notesDone: false, pyqDone: false },
        ],
      },
      {
        id: "str-c2",
        title: "RCC & Steel Design",
        weightage: "~7-8 Marks",
        subtopics: [
          { id: "s-4", name: "LSM Flexure: Singly/doubly reinforced, shear design & prestress losses", is8020: true, status: 0, notesDone: false, pyqDone: false },
          { id: "s-5", name: "Steel Structures: Bolted/welded connections & plastic collapse load analysis", is8020: true, status: 0, notesDone: false, pyqDone: false },
        ],
      },
    ],
  },
  {
    key: "survey_cmm",
    title: "Surveying & Project Management (CPM/PERT)",
    marks: "~6-8 Marks [Scoring]",
    chapters: [
      {
        id: "sur-c1",
        title: "Surveying & Geomatics",
        weightage: "~4-5 Marks",
        subtopics: [
          { id: "sv-1", name: "Traversing, bearings, latitude-departure, Bowditch rule & levelling HI/rise-fall", is8020: true, status: 0, notesDone: false, pyqDone: false },
          { id: "sv-2", name: "Photogrammetry scale, flying height, relief displacement & Total Station/GPS", is8020: true, status: 0, notesDone: false, pyqDone: false },
        ],
      },
      {
        id: "cmm-c1",
        title: "Construction Project Management",
        weightage: "~2-3 Marks",
        subtopics: [
          { id: "cm-1", name: "CPM & PERT: Critical path, float calculations (total/free/independent) & crashing", is8020: true, status: 0, notesDone: false, pyqDone: false },
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
    const saved = localStorage.getItem("suman_gate_ce_syllabus_clean_v1");
    if (saved) {
      try {
        setSubjects(JSON.parse(saved));
      } catch (e) {}
    }
    const savedMocks = localStorage.getItem("suman_gate_ce_mocks_clean_v1");
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
    localStorage.setItem("suman_gate_ce_syllabus_clean_v1", JSON.stringify(updated));
  };

  const handleUndoSubtopic = () => {
    if (syllabusHistory.length === 0) return;
    const prev = syllabusHistory[syllabusHistory.length - 1];
    setSyllabusHistory((p) => p.slice(0, -1));
    setSubjects(prev);
    localStorage.setItem("suman_gate_ce_syllabus_clean_v1", JSON.stringify(prev));
  };

  const handleAddTest = (entry: GateMockEntry) => {
    setMockHistory((prev) => [...prev.slice(-10), JSON.parse(JSON.stringify(gateTests))]);
    const updated = [...gateTests, entry];
    setGateTests(updated);
    localStorage.setItem("suman_gate_ce_mocks_clean_v1", JSON.stringify(updated));
  };

  const handleUndoMock = () => {
    if (mockHistory.length === 0) return;
    const prev = mockHistory[mockHistory.length - 1];
    setMockHistory((p) => p.slice(0, -1));
    setGateTests(prev);
    localStorage.setItem("suman_gate_ce_mocks_clean_v1", JSON.stringify(prev));
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
    <div className="min-h-screen flex flex-col bg-[#eef4f8]">
      <GoalHeader overallProgress={overallProgress} />

      <main className="max-w-7xl mx-auto w-full p-2.5 sm:p-5 flex-1 space-y-4">
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
              📅 CAMPUS DISCIPLINE
            </button>
            <button
              onClick={() => setActiveTab("syllabus")}
              className={`px-3 py-1.5 text-xs font-black border-2 border-[#0b2545] rounded transition-all shrink-0 ${
                activeTab === "syllabus"
                  ? "bg-white text-[#0b2545] shadow-[2px_2px_0px_0px_#0b2545]"
                  : "bg-[#8da9c4]/20 text-[#0b2545] hover:bg-white"
              }`}
            >
              ⚙️ COMPLETE SYLLABUS (70+)
            </button>
            <button
              onClick={() => setActiveTab("mocks")}
              className={`px-3 py-1.5 text-xs font-black border-2 border-[#0b2545] rounded transition-all shrink-0 ${
                activeTab === "mocks"
                  ? "bg-white text-[#0b2545] shadow-[2px_2px_0px_0px_#0b2545]"
                  : "bg-[#8da9c4]/20 text-[#0b2545] hover:bg-white"
              }`}
            >
              🎯 MOCKS &amp; TARGETS
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

      <footer className="bg-[#0b2545] text-[#8da9c4] border-t-4 border-[#0b2545] p-5 mt-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="bg-[#e0a96d] text-[#0b2545] font-black px-2 py-0.5 text-[10px]">IIT BOMBAY</span>
            <span>SUMANVOLT // MISSION CIVIL 70+ MARKS</span>
          </div>
          <div className="text-[10px] text-[#f5d6a8]">
            ज्ञानं परमं बलम् // BIT MESRA TO POWAI CONVOCATION.
          </div>
        </div>
      </footer>
    </div>
  );
}