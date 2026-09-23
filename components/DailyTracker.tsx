'use client';

import { useEffect, useMemo, useState } from 'react';
import { Minus, Plus, Footprints, BrainCircuit } from 'lucide-react';
import { DayLog, WeekLog } from '@/lib/types';
import { addDays, getWeekStart, loadState, saveState, toISODate } from '@/lib/storage';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const STORAGE_KEY = 'dailyTracker';

function emptyDay(date: string): DayLog {
  return { date, studyHours: 0, screenHours: 0, walked: false, activeRetrieval: false };
}

function emptyWeek(weekStart: string): WeekLog {
  const days: Record<string, DayLog> = {};
  for (let i = 0; i < 7; i++) {
    const d = addDays(weekStart, i);
    days[d] = emptyDay(d);
  }
  return { weekStart, days };
}

export default function DailyTracker() {
  const todayISO = toISODate(new Date());
  const currentWeekStart = getWeekStart(new Date());

  const [week, setWeek] = useState<WeekLog>(() => emptyWeek(currentWeekStart));
  const [selectedDate, setSelectedDate] = useState<string>(todayISO);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from storage, rolling over into a fresh week if one has elapsed.
  useEffect(() => {
    const stored = loadState<WeekLog | null>(STORAGE_KEY, null);
    if (stored && stored.weekStart === currentWeekStart) {
      setWeek(stored);
    } else {
      setWeek(emptyWeek(currentWeekStart));
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (hydrated) saveState(STORAGE_KEY, week);
  }, [week, hydrated]);

  const selectedDay = week.days[selectedDate] ?? emptyDay(selectedDate);

  function updateDay(patch: Partial<DayLog>) {
    setWeek((w) => ({
      ...w,
      days: {
        ...w.days,
        [selectedDate]: { ...(w.days[selectedDate] ?? emptyDay(selectedDate)), ...patch },
      },
    }));
  }

  const weekTotals = useMemo(() => {
    const values = Object.values(week.days);
    const studyTotal = values.reduce((s, d) => s + d.studyHours, 0);
    const walkedDays = values.filter((d) => d.walked).length;
    const retrievalDays = values.filter((d) => d.activeRetrieval).length;
    return { studyTotal, walkedDays, retrievalDays };
  }, [week]);

  const screenGood = selectedDay.screenHours <= 2.0;

  return (
    <div className="flex h-full flex-col gap-3 p-3 sm:p-4">
      {/* Week strip */}
      <div className="rounded-2xl border-2 border-maroon bg-cream p-2.5 shadow-block">
        <div className="mb-1.5 flex items-center justify-between font-mono-tight text-[10px] text-maroon/70">
          <span>WEEK OF {week.weekStart}</span>
          <span>{weekTotals.studyTotal.toFixed(1)}h logged</span>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {DAY_LABELS.map((label, i) => {
            const date = addDays(week.weekStart, i);
            const day = week.days[date] ?? emptyDay(date);
            const isSelected = date === selectedDate;
            const isToday = date === todayISO;
            return (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center rounded-lg border-2 py-1.5 font-mono-tight transition-none ${
                  isSelected
                    ? 'border-maroon bg-maroon text-cream shadow-blockSm'
                    : 'border-maroon/30 bg-cream text-choc'
                }`}
              >
                <span className="text-[9px]">{label}</span>
                <span className={`text-[9px] ${isToday && !isSelected ? 'text-burnt font-bold' : ''}`}>
                  {isToday ? '•' : day.studyHours > 0 ? day.studyHours : '-'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected day editor */}
      <div className="flex-1 overflow-y-auto scrollbar-none rounded-2xl border-2 border-maroon bg-cream p-3.5 shadow-block">
        <p className="font-mono-tight text-xs text-maroon/70">
          EDITING <span className="font-bold text-choc">{selectedDate}</span>
          {selectedDate === todayISO ? ' (today)' : ''}
        </p>

        {/* Study hours */}
        <div className="mt-3 rounded-xl border-2 border-maroon/70 bg-cream p-3">
          <p className="font-serif text-sm text-choc">Study hours</p>
          <div className="mt-2 flex items-center justify-between">
            <button
              onClick={() => updateDay({ studyHours: Math.max(0, Math.round((selectedDay.studyHours - 0.5) * 2) / 2) })}
              className="grid h-9 w-9 place-items-center rounded-lg border-2 border-maroon bg-cream text-maroon shadow-blockSm active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
              aria-label="Decrease study hours"
            >
              <Minus size={16} strokeWidth={3} />
            </button>
            <span className="font-mono-tight text-2xl font-bold text-choc tabular-nums">
              {selectedDay.studyHours.toFixed(1)}h
            </span>
            <button
              onClick={() => updateDay({ studyHours: Math.min(16, Math.round((selectedDay.studyHours + 0.5) * 2) / 2) })}
              className="grid h-9 w-9 place-items-center rounded-lg border-2 border-maroon bg-burnt text-cream shadow-blockSm active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
              aria-label="Increase study hours"
            >
              <Plus size={16} strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Screen time */}
        <div className="mt-2.5 rounded-xl border-2 border-maroon/70 bg-cream p-3">
          <p className="font-serif text-sm text-choc">Phone screen time</p>
          <div className="mt-2 flex items-center justify-between">
            <button
              onClick={() =>
                updateDay({ screenHours: Math.max(0, Math.round((selectedDay.screenHours - 0.15) * 100) / 100) })
              }
              className="grid h-9 w-9 place-items-center rounded-lg border-2 border-maroon bg-cream text-maroon shadow-blockSm active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
              aria-label="Decrease screen time"
            >
              <Minus size={16} strokeWidth={3} />
            </button>
            <span
              className={`font-mono-tight text-2xl font-bold tabular-nums ${
                screenGood ? 'text-green-700' : 'text-burnt'
              }`}
            >
              {selectedDay.screenHours.toFixed(2)}h
            </span>
            <button
              onClick={() =>
                updateDay({ screenHours: Math.min(16, Math.round((selectedDay.screenHours + 0.15) * 100) / 100) })
              }
              className="grid h-9 w-9 place-items-center rounded-lg border-2 border-maroon bg-cream text-maroon shadow-blockSm active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
              aria-label="Increase screen time"
            >
              <Plus size={16} strokeWidth={3} />
            </button>
          </div>
          <p className="mt-1 text-right font-mono-tight text-[10px] text-choc/50">
            {screenGood ? 'within 2.0h target' : 'over 2.0h target'}
          </p>
        </div>

        {/* Toggles */}
        <div className="mt-2.5 grid grid-cols-2 gap-2.5">
          <button
            onClick={() => updateDay({ walked: !selectedDay.walked })}
            className={`flex flex-col items-center gap-1 rounded-xl border-2 border-maroon p-3 shadow-blockSm active:shadow-none active:translate-x-[1px] active:translate-y-[1px] ${
              selectedDay.walked ? 'bg-maroon text-cream' : 'bg-cream text-choc'
            }`}
          >
            <Footprints size={18} strokeWidth={2.5} />
            <span className="font-mono-tight text-[10px]">30M WALK</span>
          </button>
          <button
            onClick={() => updateDay({ activeRetrieval: !selectedDay.activeRetrieval })}
            className={`flex flex-col items-center gap-1 rounded-xl border-2 border-maroon p-3 shadow-blockSm active:shadow-none active:translate-x-[1px] active:translate-y-[1px] ${
              selectedDay.activeRetrieval ? 'bg-maroon text-cream' : 'bg-cream text-choc'
            }`}
          >
            <BrainCircuit size={18} strokeWidth={2.5} />
            <span className="font-mono-tight text-[10px]">BLANK SHEET</span>
          </button>
        </div>

        {/* Week summary */}
        <div className="mt-3 flex justify-between rounded-xl border-2 border-dashed border-maroon/40 px-3 py-2 font-mono-tight text-[10px] text-choc/70">
          <span>Walked {weekTotals.walkedDays}/7</span>
          <span>Retrieval {weekTotals.retrievalDays}/7</span>
          <span>Total {weekTotals.studyTotal.toFixed(1)}h</span>
        </div>
      </div>
    </div>
  );
}
