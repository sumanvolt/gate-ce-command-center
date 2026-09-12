// components/FormulaModal.tsx
"use client";

import React, { useState } from "react";
import { Zap, X } from "lucide-react";

interface FormulaModalProps {
  isOpen: boolean;
  topicName: string;
  onClose: () => void;
  onConfirm: (typedFormula: string) => void;
}

export default function FormulaModal({ isOpen, topicName, onClose, onConfirm }: FormulaModalProps) {
  const [input, setInput] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim().length < 3) {
      alert("Type out at least one core formula or condition from memory!");
      return;
    }
    onConfirm(input.trim());
    setInput("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg bg-white border-4 border-black p-6 shadow-neoLg">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-neoYellow p-1 border-2 border-black">
              <Zap className="w-5 h-5 text-black" />
            </span>
            <h3 className="font-black text-lg text-black uppercase tracking-wider">Formula Flash // Active Recall</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 border-2 border-transparent hover:border-black">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs font-bold text-slate-700 mb-2">Topic: <span className="text-gateMaroon underline">{topicName}</span></p>
        <p className="text-xs text-slate-500 mb-4 font-mono">
          Before locking this as mastered, recite the critical governing equation(s), assumptions, or limiting values from memory:
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            required
            rows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., Critical Hydraulic Gradient: ic = (G - 1)/(1 + e)..."
            className="w-full border-2 border-black p-3 font-mono text-xs focus:outline-none focus:bg-amber-50"
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold border-2 border-black hover:bg-slate-100"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-black bg-gateGold border-2 border-black shadow-neoSm hover:bg-gateGoldHover flex items-center gap-2"
            >
              CONFIRM & MASTER
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}