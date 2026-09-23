'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Filter, Link2, Sparkles } from 'lucide-react';
import { MASTERY_STAGES, MasteryStage, Subject, Subtopic } from '@/lib/types';
import { loadState, saveState } from '@/lib/storage';
import { SYLLABUS_TEMPLATE } from '@/lib/syllabusData';

const STORAGE_KEY = 'syllabusTracker';

const MASTERY_STYLES: Record<MasteryStage, string> = {
  'Not Started': 'bg-cream text-choc/50 border-maroon/30',
  Lectures: 'bg-gold/25 text-choc border-gold',
  PYQs: 'bg-burnt/25 text-choc border-burnt',
  Mastered: 'bg-maroon text-cream border-maroon',
};

function nextStage(stage: MasteryStage): MasteryStage {
  const idx = MASTERY_STAGES.indexOf(stage);
  return MASTERY_STAGES[(idx + 1) % MASTERY_STAGES.length];
}

function subjectProgress(subject: Subject): number {
  if (subject.subtopics.length === 0) return 0;
  const mastered = subject.subtopics.filter((s) => s.mastery === 'Mastered').length;
  return Math.round((mastered / subject.subtopics.length) * 100);
}

export default function SyllabusTracker() {
  const [subjects, setSubjects] = useState<Subject[]>(SYLLABUS_TEMPLATE);
  const [expandedId, setExpandedId] = useState<string | null>(SYLLABUS_TEMPLATE[0]?.id ?? null);
  const [highYieldOnly, setHighYieldOnly] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadState<Subject[] | null>(STORAGE_KEY, null);
    if (stored && stored.length === SYLLABUS_TEMPLATE.length) {
      setSubjects(stored);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(STORAGE_KEY, subjects);
  }, [subjects, hydrated]);

  function updateSubtopic(subjectId: string, subtopicId: string, patch: Partial<Subtopic>) {
    setSubjects((prev) =>
      prev.map((subj) =>
        subj.id !== subjectId
          ? subj
          : {
              ...subj,
              subtopics: subj.subtopics.map((st) => (st.id === subtopicId ? { ...st, ...patch } : st)),
            }
      )
    );
  }

  const overallProgress = useMemo(() => {
    const all = subjects.flatMap((s) => s.subtopics);
    if (all.length === 0) return 0;
    return Math.round((all.filter((s) => s.mastery === 'Mastered').length / all.length) * 100);
  }, [subjects]);

  return (
    <div className="flex h-full flex-col gap-2.5 p-3 sm:p-4">
      <div className="flex items-center justify-between rounded-2xl border-2 border-maroon bg-cream px-3 py-2 shadow-block">
        <div>
          <p className="font-mono-tight text-[10px] text-maroon/70">SYLLABUS COVERAGE</p>
          <p className="font-mono-tight text-lg font-bold text-choc">{overallProgress}% mastered</p>
        </div>
        <button
          onClick={() => setHighYieldOnly((v) => !v)}
          className={`flex items-center gap-1 rounded-xl border-2 border-maroon px-2.5 py-1.5 font-mono-tight text-[11px] font-bold shadow-blockSm active:shadow-none active:translate-x-[1px] active:translate-y-[1px] ${
            highYieldOnly ? 'bg-gold text-choc' : 'bg-cream text-maroon'
          }`}
        >
          <Filter size={13} strokeWidth={2.5} />
          80/20
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-none space-y-2 pb-1">
        {subjects.map((subject) => {
          const isOpen = expandedId === subject.id;
          const visibleSubtopics = highYieldOnly
            ? subject.subtopics.filter((s) => s.highYield)
            : subject.subtopics;
          const progress = subjectProgress(subject);

          if (highYieldOnly && visibleSubtopics.length === 0) return null;

          return (
            <div
              key={subject.id}
              className="overflow-hidden rounded-2xl border-2 border-maroon bg-cream shadow-block"
            >
              <button
                onClick={() => setExpandedId(isOpen ? null : subject.id)}
                className="flex w-full items-center justify-between px-3.5 py-2.5"
              >
                <div className="text-left">
                  <p className="font-serif text-base font-semibold text-choc">{subject.name}</p>
                  <p className="font-mono-tight text-[10px] text-maroon/70">
                    {subject.weightagePct}% weightage &middot; {progress}% mastered
                  </p>
                </div>
                <ChevronDown
                  size={18}
                  strokeWidth={2.5}
                  className={`shrink-0 text-maroon transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isOpen && (
                <div className="max-h-64 overflow-y-auto scrollbar-none border-t-2 border-maroon/20 px-3 py-2">
                  {visibleSubtopics.map((sub) => (
                    <div key={sub.id} className="border-b border-maroon/10 py-2 last:border-none">
                      <div className="flex items-start justify-between gap-2">
                        <p className="flex items-center gap-1 font-serif text-sm text-choc">
                          {sub.name}
                          {sub.sem5Synergy && (
                            <span title="5th-semester synergy">
                              <Link2 size={11} className="text-burnt" strokeWidth={2.5} />
                            </span>
                          )}
                          {sub.highYield && (
                            <span title="High-yield (80/20)">
                              <Sparkles size={11} className="text-gold" strokeWidth={2.5} />
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="mt-1.5 flex flex-wrap items-center gap-3">
                        <label className="flex items-center gap-1 font-mono-tight text-[10px] text-choc/70">
                          <input
                            type="checkbox"
                            className="brute-check"
                            checked={sub.notes}
                            onChange={(e) => updateSubtopic(subject.id, sub.id, { notes: e.target.checked })}
                          />
                          NOTES
                        </label>
                        <label className="flex items-center gap-1 font-mono-tight text-[10px] text-choc/70">
                          <input
                            type="checkbox"
                            className="brute-check"
                            checked={sub.pyq15y}
                            onChange={(e) => updateSubtopic(subject.id, sub.id, { pyq15y: e.target.checked })}
                          />
                          15Y PYQ
                        </label>
                        <label className="flex items-center gap-1 font-mono-tight text-[10px] text-choc/70">
                          <input
                            type="checkbox"
                            className="brute-check"
                            checked={sub.dppDone}
                            onChange={(e) => updateSubtopic(subject.id, sub.id, { dppDone: e.target.checked })}
                          />
                          DPP
                        </label>

                        <button
                          onClick={() => updateSubtopic(subject.id, sub.id, { mastery: nextStage(sub.mastery) })}
                          className={`ml-auto rounded-lg border-2 px-2 py-1 font-mono-tight text-[9px] font-bold ${MASTERY_STYLES[sub.mastery]}`}
                        >
                          {sub.mastery === 'Mastered' ? 'MASTERED ✓' : sub.mastery.toUpperCase()}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
