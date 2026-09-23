'use client';

import { useState } from 'react';
import { ListChecks, ListTodo, LineChart } from 'lucide-react';
import GoalHeader from '@/components/GoalHeader';
import DailyTracker from '@/components/DailyTracker';
import SyllabusTracker from '@/components/SyllabusTracker';
import PWMockLogger from '@/components/PWMockLogger';

type Tab = 'discipline' | 'syllabus' | 'mocks';

const TABS: { id: Tab; label: string; icon: typeof ListChecks }[] = [
  { id: 'discipline', label: 'DISCIPLINE', icon: ListChecks },
  { id: 'syllabus', label: 'SYLLABUS', icon: ListTodo },
  { id: 'mocks', label: 'MOCKS', icon: LineChart },
];

export default function Home() {
  const [tab, setTab] = useState<Tab>('discipline');

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-cream">
      <div className="paper-grain pointer-events-none fixed inset-0" />

      <GoalHeader />

      <nav className="flex border-b-2 border-maroon bg-cream">
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex flex-1 items-center justify-center gap-1.5 border-r-2 border-maroon py-2.5 font-mono-tight text-xs font-bold last:border-r-0 ${
                active ? 'bg-maroon text-cream' : 'bg-cream text-maroon/70'
              }`}
            >
              <Icon size={14} strokeWidth={2.5} />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="min-h-0 flex-1 overflow-hidden">
        {tab === 'discipline' && <DailyTracker />}
        {tab === 'syllabus' && <SyllabusTracker />}
        {tab === 'mocks' && <PWMockLogger />}
      </div>
    </main>
  );
}
