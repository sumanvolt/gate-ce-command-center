'use client';

import { useEffect, useState } from 'react';
import { Download, RefreshCw, Target } from 'lucide-react';

// GATE CE is historically held on the first Sunday of February; Semester 5
// end-exams milestone is set for mid-December. Both are placeholders the
// user can adjust to their institute's actual dates.
const GATE_CE_2027 = new Date('2027-02-07T09:00:00+05:30');
const SEM5_MILESTONE = new Date('2026-12-15T09:00:00+05:30');

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function useCountdown(target: Date) {
  const [remaining, setRemaining] = useState(() => target.getTime() - Date.now());

  useEffect(() => {
    const id = setInterval(() => setRemaining(target.getTime() - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);

  const clamped = Math.max(remaining, 0);
  const days = Math.floor(clamped / (1000 * 60 * 60 * 24));
  const hours = Math.floor((clamped / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((clamped / (1000 * 60)) % 60);
  const seconds = Math.floor((clamped / 1000) % 60);

  return { days, hours, minutes, seconds, expired: remaining <= 0 };
}

function CountdownCard({ label, target }: { label: string; target: Date }) {
  const { days, hours, minutes, seconds, expired } = useCountdown(target);
  return (
    <div className="flex-1 min-w-[140px] rounded-xl border-2 border-maroon bg-cream px-3 py-2 shadow-blockSm">
      <p className="text-[10px] uppercase tracking-wide text-maroon/70 font-mono-tight">{label}</p>
      {expired ? (
        <p className="font-mono-tight text-lg font-bold text-burnt">DUE NOW</p>
      ) : (
        <p className="font-mono-tight text-xl font-bold text-choc tabular-nums">
          {days}
          <span className="text-xs font-normal text-choc/60">d </span>
          {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:
          {String(seconds).padStart(2, '0')}
        </p>
      )}
    </div>
  );
}

export default function GoalHeader() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setInstalled(isStandalone);

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setInstallEvent(null);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  async function handleInstall() {
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === 'accepted') setInstalled(true);
    setInstallEvent(null);
  }

  async function handleSync() {
    setSyncing(true);
    try {
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg) {
          reg.active?.postMessage('SKIP_WAITING');
          await reg.update();
        }
      }
    } finally {
      window.location.reload();
    }
  }

  const showInstall = !!installEvent && !installed;

  return (
    <header className="relative z-10 border-b-2 border-maroon bg-cream px-3 pt-3 pb-3 sm:px-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-mono-tight text-[10px] text-maroon inline-block rounded-md border-2 border-maroon bg-gold/20 px-2 py-0.5 mb-1.5">
            [ SUMANVOLT // COMMAND_CENTER_v2.7 ]
          </p>
          <h1 className="font-serif text-xl font-semibold leading-tight text-choc sm:text-2xl">
            Suman Kumar Mahato
          </h1>
          <p className="font-serif text-sm italic text-maroon/80">
            ज्ञानं परमं बलम् <span className="not-italic text-choc/50">//</span> IIT Bombay M.Tech
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1.5">
          {showInstall && (
            <button
              onClick={handleInstall}
              className="flex items-center gap-1 rounded-xl border-2 border-maroon bg-burnt px-2.5 py-1.5 font-mono-tight text-[11px] font-bold text-cream shadow-blockSm active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
            >
              <Download size={13} strokeWidth={2.5} />
              INSTALL APP
            </button>
          )}
          <button
            onClick={handleSync}
            className="flex items-center gap-1 rounded-xl border-2 border-maroon bg-cream px-2.5 py-1.5 font-mono-tight text-[11px] font-bold text-maroon shadow-blockSm active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
          >
            <RefreshCw size={13} strokeWidth={2.5} className={syncing ? 'animate-spin' : ''} />
            POWAI SYNC
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <CountdownCard label="GATE CE 2027" target={GATE_CE_2027} />
        <CountdownCard label="SEM 5 MILESTONE" target={SEM5_MILESTONE} />
        <div className="flex-1 min-w-[140px] rounded-xl border-2 border-maroon bg-maroon px-3 py-2 shadow-[4px_4px_0px_0px_#d48806]">
          <p className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-gold/90 font-mono-tight">
            <Target size={11} strokeWidth={2.5} />
            Target
          </p>
          <p className="font-mono-tight text-xl font-bold text-cream">
            70<span className="text-sm font-normal text-cream/70">+ marks</span>
          </p>
          <p className="font-mono-tight text-[10px] text-gold">AIR &lt; 150</p>
        </div>
      </div>
    </header>
  );
}
