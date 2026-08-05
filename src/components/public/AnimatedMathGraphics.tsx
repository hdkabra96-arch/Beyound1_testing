import React, { useState } from 'react';
import { Sparkles, Calculator, PieChart, Activity, RefreshCw } from 'lucide-react';

export const AnimatedMathGraphics: React.FC = () => {
  // Interactive Pythagoras State
  const [aSide, setASide] = useState(3);
  const [bSide, setBSide] = useState(4);
  const cSide = Math.sqrt(aSide * aSide + bSide * bSide).toFixed(2);

  // Fraction State
  const [numerator, setNumerator] = useState(3);
  const [denominator, setDenominator] = useState(8);

  return (
    <div className="relative rounded-3xl bg-white p-6 sm:p-8 text-slate-900 overflow-hidden border border-slate-200 shadow-2xl space-y-6">
      {/* Background Animated Floating Math Symbols */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-4 left-6 text-2xl font-mono font-extrabold text-indigo-600 animate-bounce">
          E = mc²
        </div>
        <div className="absolute top-12 right-12 text-3xl font-mono font-black text-amber-600 animate-pulse">
          a² + b² = c²
        </div>
        <div className="absolute bottom-8 left-1/4 text-4xl font-mono font-bold text-cyan-600 animate-bounce">
          π ≈ 3.14159
        </div>
        <div className="absolute bottom-16 right-10 text-3xl font-mono font-bold text-emerald-600 animate-pulse">
          ∫ f(x)dx
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Interactive Mathematics Visualizer</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
          Visualizing Class 1 to 8 Concepts in Real-Time
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xl">
          Experience how abstract geometry, fractions, and equations transform into intuitive visual models.
        </p>
      </div>

      {/* Grid of 2 Interactive Graphic Cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Graphic 1: Interactive Pythagoras Theorem */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-indigo-900 flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-amber-600" />
              Pythagoras Right Triangle Proof
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold border border-indigo-200">
              Class 7 & 8
            </span>
          </div>

          {/* SVG Triangle Graphic */}
          <div className="h-44 bg-white rounded-xl p-4 flex items-center justify-center relative overflow-hidden border border-slate-200 shadow-inner">
            <svg viewBox="0 0 200 160" className="w-full h-full max-w-[180px]">
              {/* Base Line A */}
              <line x1="30" y1="130" x2={30 + aSide * 12} y2="130" stroke="#4f46e5" strokeWidth="4" />
              {/* Perpendicular Line B */}
              <line
                x1={30 + aSide * 12}
                y1="130"
                x2={30 + aSide * 12}
                y2={130 - bSide * 12}
                stroke="#059669"
                strokeWidth="4"
              />
              {/* Hypotenuse C */}
              <line
                x1="30"
                y1="130"
                x2={30 + aSide * 12}
                y2={130 - bSide * 12}
                stroke="#d97706"
                strokeWidth="4"
                strokeDasharray="4 2"
              />

              {/* Labels */}
              <text x={30 + (aSide * 12) / 2} y="150" fill="#4f46e5" fontSize="12" textAnchor="middle" fontWeight="bold">
                a = {aSide}
              </text>
              <text x={30 + aSide * 12 + 12} y={130 - (bSide * 12) / 2} fill="#059669" fontSize="12" fontWeight="bold">
                b = {bSide}
              </text>
              <text
                x={30 + (aSide * 12) / 2 - 10}
                y={130 - (bSide * 12) / 2 - 6}
                fill="#d97706"
                fontSize="12"
                fontWeight="bold"
              >
                c = {cSide}
              </text>
            </svg>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-800 font-bold block mb-1">Base (a): {aSide}</label>
              <input
                type="range"
                min="2"
                max="8"
                value={aSide}
                onChange={(e) => setASide(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
            <div>
              <label className="text-slate-800 font-bold block mb-1">Height (b): {bSide}</label>
              <input
                type="range"
                min="2"
                max="8"
                value={bSide}
                onChange={(e) => setBSide(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs font-mono text-center text-indigo-950 font-bold">
            {aSide}² + {bSide}² = {aSide * aSide} + {bSide * bSide} = <span className="text-amber-700 font-black">{aSide * aSide + bSide * bSide}</span> → c = {cSide}
          </div>
        </div>

        {/* Graphic 2: Interactive Fraction Slices */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-emerald-900 flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-cyan-600" />
              Dynamic Fraction Bar Model
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
              Class 3 to 5
            </span>
          </div>

          {/* Visual Fraction Bar */}
          <div className="h-44 bg-white rounded-xl p-4 flex flex-col justify-center space-y-3 border border-slate-200 shadow-inner">
            <div className="text-center font-mono font-extrabold text-2xl text-slate-900">
              <span className="border-b-2 border-indigo-600 pb-0.5 inline-block text-indigo-700">{numerator}</span>
              <br />
              <span className="text-slate-800">{denominator}</span>
            </div>

            {/* Grid Slices */}
            <div className="grid gap-1.5 w-full h-10" style={{ gridTemplateColumns: `repeat(${denominator}, minmax(0, 1fr))` }}>
              {Array.from({ length: denominator }).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-full rounded-md transition-all duration-300 flex items-center justify-center text-[10px] font-mono font-bold ${
                    idx < numerator
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 scale-105'
                      : 'bg-slate-200 text-slate-600 border border-slate-300'
                  }`}
                >
                  1/{denominator}
                </div>
              ))}
            </div>

            <div className="text-center text-xs font-bold text-slate-700">
              Percentage: <span className="text-indigo-700 font-black font-mono">{((numerator / denominator) * 100).toFixed(1)}%</span>
            </div>
          </div>

          {/* Fraction Controls */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-800 font-bold block mb-1">Numerator: {numerator}</label>
              <input
                type="range"
                min="1"
                max={denominator}
                value={numerator}
                onChange={(e) => setNumerator(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
            <div>
              <label className="text-slate-800 font-bold block mb-1">Denominator: {denominator}</label>
              <select
                value={denominator}
                onChange={(e) => {
                  const newDen = Number(e.target.value);
                  setDenominator(newDen);
                  if (numerator > newDen) setNumerator(newDen);
                }}
                className="w-full px-2 py-1.5 rounded-lg bg-white text-slate-900 border border-slate-300 text-xs font-bold shadow-xs focus:ring-2 focus:ring-indigo-500"
              >
                {[2, 3, 4, 5, 6, 8, 10, 12].map((d) => (
                  <option key={d} value={d}>
                    {d} Equal Parts
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
