"use client";

import React, { useState } from "react";
import { TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { GateSubjectGroup } from "./SyllabusTracker";

export interface GateMockEntry {
  id: string;
  name: string;
  score: number;
  mathAptMarks: number;
  geotechMarks: number;
  envMarks: number;
  otherMarks: number;
  negativeCount: number;
  date: string;
  rawDate: string;
}

interface PWMockLoggerProps {
  tests: GateMockEntry[];
  onAddTest: (entry: GateMockEntry) => void;
  subjects?: GateSubjectGroup[];
  onUndoLastTest?: () => void;
  canUndoTest?: boolean;
}

export default function PWMockLogger({ tests, onAddTest }: PWMockLoggerProps) {
  const todayISO = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    name: "",
    testDate: todayISO,
    mathApt: "",
    geotech: "",
    env: "",
    other: "",
    negatives: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ma = parseFloat(form.mathApt) || 0;
    const geo = parseFloat(form.geotech) || 0;
    const ev = parseFloat(form.env) || 0;
    const oth = parseFloat(form.other) || 0;
    const total = parseFloat((ma + geo + ev + oth).toFixed(2));

    const formattedDate = new Date(form.testDate || todayISO).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    });

    onAddTest({
      id: Date.now().toString(),
      name: form.name || "PW Test",
      score: total,
      mathAptMarks: ma,
      geotechMarks: geo,
      envMarks: ev,
      otherMarks: oth,
      negativeCount: parseFloat(form.negatives) || 0,
      date: formattedDate,
      rawDate: form.testDate || todayISO,
    });

    setForm({
      name: "",
      testDate: todayISO,
      mathApt: "",
      geotech: "",
      env: "",
      other: "",
      negatives: "",
    });
  };

  const chartData = [...tests].sort(
    (a, b) => new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime()
  );

  return (
    <div className="space-y-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white border-2 border-[#0b2545] p-3 sm:p-5 shadow-[4px_4px_0px_0px_#0b2545] space-y-3"
      >
        <div className="flex items-center gap-2 border-b-2 border-[#0b2545] pb-2 font-black text-xs text-[#0b2545]">
          <TrendingUp className="w-4 h-4 text-[#e0a96d]" /> LOG GATE CE / PW MOCK TEST
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
          <input
            type="text"
            required
            placeholder="Test Name (e.g. Geotech Part Test 01)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border-2 border-[#0b2545] p-2 outline-none font-bold"
          />
          <input
            type="date"
            required
            value={form.testDate}
            onChange={(e) => setForm({ ...form, testDate: e.target.value })}
            className="border-2 border-[#0b2545] p-2 outline-none font-bold"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div>
            <label className="text-[10px] font-bold text-slate-600 block">Math + Apt (/28)</label>
            <input
              type="number"
              step="0.1"
              placeholder="22.0"
              value={form.mathApt}
              onChange={(e) => setForm({ ...form, mathApt: e.target.value })}
              className="border-2 border-[#0b2545] p-1.5 w-full outline-none font-bold"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-600 block">Geotech (/15)</label>
            <input
              type="number"
              step="0.1"
              placeholder="12.5"
              value={form.geotech}
              onChange={(e) => setForm({ ...form, geotech: e.target.value })}
              className="border-2 border-[#0b2545] p-1.5 w-full outline-none font-bold"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-600 block">Env (/11)</label>
            <input
              type="number"
              step="0.1"
              placeholder="9.0"
              value={form.env}
              onChange={(e) => setForm({ ...form, env: e.target.value })}
              className="border-2 border-[#0b2545] p-1.5 w-full outline-none font-bold"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-600 block">Other Civil (/46)</label>
            <input
              type="number"
              step="0.1"
              placeholder="28.0"
              value={form.other}
              onChange={(e) => setForm({ ...form, other: e.target.value })}
              className="border-2 border-[#0b2545] p-1.5 w-full outline-none font-bold"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-rose-600 block">Negatives Lost</label>
          <input
            type="number"
            step="0.33"
            placeholder="-3.33"
            value={form.negatives}
            onChange={(e) => setForm({ ...form, negatives: e.target.value })}
            className="border-2 border-[#0b2545] p-1.5 w-full outline-none font-bold text-xs font-mono"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#e0a96d] hover:bg-[#f5d6a8] text-[#0b2545] font-black py-2 border-2 border-[#0b2545] shadow-[2px_2px_0px_0px_#0b2545]"
        >
          + SAVE TEST LOG
        </button>
      </form>

      {tests.length > 0 && (
        <div className="bg-white border-2 border-[#0b2545] p-3 sm:p-5 shadow-[4px_4px_0px_0px_#0b2545]">
          <div className="text-xs font-black text-[#0b2545] mb-2 flex justify-between">
            <span>POWAI TARGET TRAJECTORY</span>
            <span className="text-emerald-600 font-bold">TARGET: 70+ MARKS</span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="date" stroke="#0b2545" fontSize={10} />
                <YAxis domain={[0, 100]} stroke="#0b2545" fontSize={10} />
                <Tooltip />
                <ReferenceLine
                  y={70}
                  stroke="#ef4444"
                  strokeDasharray="3 3"
                  label={{ value: "70M Cutoff", fill: "#ef4444", fontSize: 10 }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#134074"
                  strokeWidth={3}
                  dot={{ fill: "#e0a96d", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}