'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Plus, Trash2 } from 'lucide-react';
import { MockEntry, MockSubjectScore } from '@/lib/types';
import { loadState, saveState, toISODate } from '@/lib/storage';
import { SYLLABUS_TEMPLATE } from '@/lib/syllabusData';

const MOCKS_KEY = 'pwMocks';
const PLAN_KEY = 'pwUpcomingPlan';

const ALL_SUBTOPICS = SYLLABUS_TEMPLATE.flatMap((subj) =>
  subj.subtopics.map((st) => ({ id: st.id, name: st.name, subject: subj.name }))
);

function emptyScore(): MockSubjectScore {
  return { mathsApt: 0, geotech: 0, env: 0, otherCivil: 0, negativeMarks: 0 };
}

function computeTotal(s: MockSubjectScore): number {
  const raw = s.mathsApt + s.geotech + s.env + s.otherCivil - s.negativeMarks;
  return Math.round(raw * 100) / 100;
}

export default function PWMockLogger() {
  const [mocks, setMocks] = useState<MockEntry[]>([]);
  const [scopedIds, setScopedIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState<{ label: string; date: string; scores: MockSubjectScore }>({
    label: '',
    date: toISODate(new Date()),
    scores: emptyScore(),
  });

  useEffect(() => {
    setMocks(loadState<MockEntry[]>(MOCKS_KEY, []));
    setScopedIds(loadState<string[]>(PLAN_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(MOCKS_KEY, mocks);
  }, [mocks, hydrated]);

  useEffect(() => {
    if (hydrated) saveState(PLAN_KEY, scopedIds);
  }, [scopedIds, hydrated]);

  const chartData = useMemo(
    () =>
      [...mocks]
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((m) => ({ name: m.label || m.date, score: m.totalScore, date: m.date })),
    [mocks]
  );

  const avgScore = useMemo(() => {
    if (mocks.length === 0) return 0;
    return Math.round((mocks.reduce((s, m) => s + m.totalScore, 0) / mocks.length) * 10) / 10;
  }, [mocks]);

  function addMock() {
    const total = computeTotal(draft.scores);
    const entry: MockEntry = {
      id: crypto.randomUUID(),
      label: draft.label || `Mock ${mocks.length + 1}`,
      date: draft.date,
      totalScore: total,
      subjectScores: draft.scores,
    };
    setMocks((prev) => [...prev, entry]);
    setDraft({ label: '', date: toISODate(new Date()), scores: emptyScore() });
    setShowForm(false);
  }

  function removeMock(id: string) {
    setMocks((prev) => prev.filter((m) => m.id !== id));
  }

  function toggleScoped(id: string) {
    setScopedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  return (
    <div className="flex h-full flex-col gap-3 p-3 sm:p-4">
      {/* Trajectory chart */}
      <div className="rounded-2xl border-2 border-maroon bg-cream p-3 shadow-block">
        <div className="mb-1 flex items-center justify-between">
          <p className="font-mono-tight text-[10px] text-maroon/70">SCORE TRAJECTORY vs 70-MARK TARGET</p>
          <p className="font-mono-tight text-[10px] text-choc/60">avg {avgScore}</p>
        </div>
        {chartData.length === 0 ? (
          <div className="flex h-32 items-center justify-center font-mono-tight text-xs text-choc/40">
            Log a mock to start the trend
          </div>
        ) : (
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 6, right: 10, left: -22, bottom: 0 }}>
                <CartesianGrid stroke="#7a1c0022" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 9, fontFamily: 'monospace', fill: '#2c0d0d' }} />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 9, fontFamily: 'monospace', fill: '#2c0d0d' }}
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    border: '2px solid #7a1c00',
                    borderRadius: 10,
                    fontFamily: 'monospace',
                    fontSize: 11,
                  }}
                />
                <ReferenceLine y={70} stroke="#d48806" strokeDasharray="5 4" strokeWidth={2} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#d96b1b"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#7a1c00' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-none space-y-3 pb-1">
        {/* Log list + add button */}
        <div className="rounded-2xl border-2 border-maroon bg-cream p-3 shadow-block">
          <div className="mb-2 flex items-center justify-between">
            <p className="font-serif text-sm font-semibold text-choc">Mock log</p>
            <button
              onClick={() => setShowForm((v) => !v)}
              className="flex items-center gap-1 rounded-lg border-2 border-maroon bg-burnt px-2 py-1 font-mono-tight text-[10px] font-bold text-cream shadow-blockSm active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
            >
              <Plus size={12} strokeWidth={3} />
              LOG MOCK
            </button>
          </div>

          {showForm && (
            <div className="mb-3 space-y-2 rounded-xl border-2 border-dashed border-maroon/40 p-2.5">
              <div className="flex gap-2">
                <input
                  value={draft.label}
                  onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))}
                  placeholder="PW Test 12"
                  className="w-1/2 rounded-lg border-2 border-maroon/50 bg-cream px-2 py-1 font-mono-tight text-xs text-choc outline-none"
                />
                <input
                  type="date"
                  value={draft.date}
                  onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))}
                  className="w-1/2 rounded-lg border-2 border-maroon/50 bg-cream px-2 py-1 font-mono-tight text-xs text-choc outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    ['mathsApt', 'Math/Apt'],
                    ['geotech', 'Geotech'],
                    ['env', 'Env'],
                    ['otherCivil', 'Other Civil'],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key} className="flex flex-col font-mono-tight text-[10px] text-choc/70">
                    {label}
                    <input
                      type="number"
                      inputMode="decimal"
                      value={draft.scores[key]}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          scores: { ...d.scores, [key]: parseFloat(e.target.value) || 0 },
                        }))
                      }
                      className="mt-0.5 rounded-lg border-2 border-maroon/50 bg-cream px-2 py-1 text-sm text-choc outline-none"
                    />
                  </label>
                ))}
                <label className="flex flex-col font-mono-tight text-[10px] text-burnt">
                  Negative marks
                  <input
                    type="number"
                    inputMode="decimal"
                    value={draft.scores.negativeMarks}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        scores: { ...d.scores, negativeMarks: parseFloat(e.target.value) || 0 },
                      }))
                    }
                    className="mt-0.5 rounded-lg border-2 border-burnt/50 bg-cream px-2 py-1 text-sm text-choc outline-none"
                  />
                </label>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="font-mono-tight text-xs text-choc/70">
                  Total: <span className="font-bold text-choc">{computeTotal(draft.scores)}</span>
                </span>
                <button
                  onClick={addMock}
                  className="rounded-lg border-2 border-maroon bg-maroon px-3 py-1.5 font-mono-tight text-[11px] font-bold text-cream shadow-blockSm active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
                >
                  SAVE ENTRY
                </button>
              </div>
            </div>
          )}

          {mocks.length === 0 ? (
            <p className="font-mono-tight text-xs text-choc/40">No mocks logged yet.</p>
          ) : (
            <div className="space-y-1.5">
              {[...mocks]
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between rounded-lg border-2 border-maroon/30 px-2.5 py-1.5"
                  >
                    <div>
                      <p className="font-mono-tight text-xs font-bold text-choc">{m.label}</p>
                      <p className="font-mono-tight text-[9px] text-choc/50">{m.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono-tight text-sm font-bold ${
                          m.totalScore >= 70 ? 'text-green-700' : 'text-burnt'
                        }`}
                      >
                        {m.totalScore}
                      </span>
                      <button onClick={() => removeMock(m.id)} aria-label="Delete mock entry">
                        <Trash2 size={14} className="text-maroon/50" strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Upcoming test target planner */}
        <div className="rounded-2xl border-2 border-maroon bg-cream p-3 shadow-block">
          <p className="mb-2 font-serif text-sm font-semibold text-choc">Upcoming test target planner</p>
          <p className="mb-2 font-mono-tight text-[10px] text-choc/50">
            {scopedIds.length} topic{scopedIds.length === 1 ? '' : 's'} scoped for next PW test
          </p>
          <div className="max-h-48 space-y-1 overflow-y-auto scrollbar-none">
            {ALL_SUBTOPICS.map((t) => (
              <label
                key={t.id}
                className="flex items-center gap-2 rounded-lg border border-maroon/15 px-2 py-1.5 font-mono-tight text-[11px] text-choc/80"
              >
                <input
                  type="checkbox"
                  className="brute-check"
                  checked={scopedIds.includes(t.id)}
                  onChange={() => toggleScoped(t.id)}
                />
                <span className="truncate">{t.name}</span>
                <span className="ml-auto shrink-0 text-[9px] text-maroon/50">{t.subject}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
