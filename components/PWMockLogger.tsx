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
      name: form.name || "Test Log",
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
      {/* Test Log Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#fffdfa] border-2 border-[#7a1c00] p-4 rounded-2xl shadow-[4px_4px_0px_0px_#7a1c00] space-y-3"
      >
        <div className="flex items-center gap-2 border-b-2 border-[#7a1c00]/20 pb-2 font-black text-xs text-[#7a1c00] font-mono-code">
          <TrendingUp className="w-4 h-4 text-[#d48806]" /> LOG MOCK TEST RESULTS
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono-code">
          <input
            type="text"
            required
            placeholder="Test Name (e.g. Geotech Part 1)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border-2 border-[#7a1c00] rounded-xl p-2 bg-[#fff8f0] outline-none font-bold text-[#2c0d0d]"
          />
          <input
            type="date"
            required
            value={form.testDate}
            onChange={(e) => setForm({ ...form, testDate: e.target.value })}
            className="border-2 border-[#7a1c00] rounded-xl p-2 bg-[#fff8f0] outline-none font-bold text-[#2c0d0d]"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono-code">
          <div>
            <label className="text-[10px] font-bold text-slate-600 block mb-1">Math + Apt (/28)</label>
            <input
              type="number"
              step="0.1"
              placeholder="22.0"
              value={form.mathApt}
              onChange={(e) => setForm({ ...form, mathApt: e.target.value })}
              className="border-2 border-[#7a1c00] rounded-xl p-2 bg-[#fff8f0] w-full outline-none font-bold text-[#2c0d0d]"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-600 block mb-1">Geotech (/15)</label>
            <input
              type="number"
              step="0.1"
              placeholder="12.5"
              value={form.geotech}
              onChange={(e) => setForm({ ...form, geotech: e.target.value })}
              className="border-2 border-[#7a1c00] rounded-xl p-2 bg-[#fff8f0] w-full outline-none font-bold text-[#2c0d0d]"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-600 block mb-1">Env (/11)</label>
            <input
              type="number"
              step="0.1"
              placeholder="9.0"
              value={form.env}
              onChange={(e) => setForm({ ...form, env: e.target.value })}
              className="border-2 border-[#7a1c00] rounded-xl p-2 bg-[#fff8f0] w-full outline-none font-bold text-[#2c0d0d]"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-600 block mb-1">Other Civil (/46)</label>
            <input
              type="number"
              step="0.1"
              placeholder="28.0"
              value={form.other}
              onChange={(e) => setForm({ ...form, other: e.target.value })}
              className="border-2 border-[#7a1c00] rounded-xl p-2 bg-[#fff8f0] w-full outline-none font-bold text-[#2c0d0d]"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-rose-700 block mb-1">Negatives Lost</label>
          <input
            type="number"
            step="0.33"
            placeholder="-3.33"
            value={form.negatives}
            onChange={(e) => setForm({ ...form, negatives: e.target.value })}
            className="border-2 border-[#7a1c00] rounded-xl p-2 bg-[#fff8f0] w-full outline-none font-bold text-xs font-mono-code text-[#2c0d0d]"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#d48806] hover:bg-[#d96b1b] hover:text-white transition-colors text-[#2c0d0d] font-black py-2.5 rounded-xl border-2 border-[#7a1c00] shadow-sm active:scale-[0.98]"
        >
          + SAVE TEST LOG
        </button>
      </form>

      {/* Performance Trajectory Graph */}
      {tests.length > 0 && (
        <div className="bg-[#fffdfa] border-2 border-[#7a1c00] p-4 rounded-2xl shadow-[4px_4px_0px_0px_#7a1c00]">
          <div className="text-xs font-black text-[#7a1c00] mb-2 flex justify-between font-mono-code">
            <span>PERFORMANCE TRAJECTORY</span>
            <span className="text-[#d96b1b]">TARGET: 70+ MARKS</span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="date" stroke="#7a1c00" fontSize={10} tickLine={false} axisLine={{ strokeWidth: 2 }} />
                <YAxis domain={[0, 100]} stroke="#7a1c00" fontSize={10} tickLine={false} axisLine={{ strokeWidth: 2 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fffdfa', border: '2px solid #7a1c00', borderRadius: '12px', fontFamily: 'monospace', fontSize: '12px' }}
                  itemStyle={{ color: '#2c0d0d', fontWeight: 'bold' }}
                />
                <ReferenceLine
                  y={70}
                  stroke="#d96b1b"
                  strokeDasharray="4 4"
                  label={{ value: "70M Target", fill: "#d96b1b", fontSize: 10, fontWeight: "bold", position: 'insideTopLeft' }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#7a1c00"
                  strokeWidth={3}
                  dot={{ fill: "#d48806", stroke: "#7a1c00", strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, fill: "#d96b1b", stroke: "#7a1c00" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}