'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  Heart,
  User,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  RefreshCw,
  Info,
  Stethoscope,
  ChevronRight,
  TrendingDown,
  Sparkles,
  Zap,
  Printer,
  Sliders,
  Flame,
  FileText
} from 'lucide-react';

interface FormData {
  age: number;
  sex: string;
  chest_pain: string;
  resting_bp: number;
  cholesterol: number;
  fasting_bs: number;
  resting_ecg: string;
  max_hr: number;
  exercise_angina: string;
  oldpeak: number;
  st_slope: string;
}

interface PredictionResult {
  prediction: number;
  risk_label: string;
  risk_level: string;
  probability: number;
  key_factors: string[];
  recommendations: string[];
}

const DEFAULT_FORM: FormData = {
  age: 40,
  sex: 'M',
  chest_pain: 'ATA',
  resting_bp: 120,
  cholesterol: 200,
  fasting_bs: 0,
  resting_ecg: 'Normal',
  max_hr: 150,
  exercise_angina: 'N',
  oldpeak: 1.0,
  st_slope: 'Up',
};

const CHEST_PAIN_LABELS: Record<string, string> = {
  ATA: 'Atypical Angina (ATA)',
  NAP: 'Non-Anginal Pain (NAP)',
  TA: 'Typical Angina (TA)',
  ASY: 'Asymptomatic / Silent Ischemia (ASY)',
};

const RESTING_ECG_LABELS: Record<string, string> = {
  Normal: 'Normal (No baseline abnormalities)',
  ST: 'ST-T Wave Abnormality',
  LVH: 'Left Ventricular Hypertrophy (LVH)',
};

const ST_SLOPE_LABELS: Record<string, string> = {
  Up: 'Up-sloping (Normal exercise response)',
  Flat: 'Flat (Borderline / Ischemic marker)',
  Down: 'Down-sloping (High ischemic sign)',
};

const PRESETS = [
  {
    name: 'Healthy Individual',
    desc: 'Normal vitals, up-sloping ST, no angina',
    icon: CheckCircle2,
    color: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20',
    data: {
      age: 32,
      sex: 'M',
      chest_pain: 'ATA',
      resting_bp: 115,
      cholesterol: 185,
      fasting_bs: 0,
      resting_ecg: 'Normal',
      max_hr: 172,
      exercise_angina: 'N',
      oldpeak: 0.0,
      st_slope: 'Up',
    },
  },
  {
    name: 'Moderate Concern',
    desc: 'Borderline BP, elevated cholesterol',
    icon: AlertTriangle,
    color: 'border-amber-500/40 text-amber-400 bg-amber-950/20',
    data: {
      age: 52,
      sex: 'F',
      chest_pain: 'NAP',
      resting_bp: 135,
      cholesterol: 235,
      fasting_bs: 1,
      resting_ecg: 'Normal',
      max_hr: 140,
      exercise_angina: 'N',
      oldpeak: 1.2,
      st_slope: 'Flat',
    },
  },
  {
    name: 'High Risk Profile',
    desc: 'Asymptomatic pain, ST depression, angina',
    icon: ShieldAlert,
    color: 'border-rose-500/40 text-rose-400 bg-rose-950/20',
    data: {
      age: 62,
      sex: 'M',
      chest_pain: 'ASY',
      resting_bp: 155,
      cholesterol: 285,
      fasting_bs: 1,
      resting_ecg: 'ST',
      max_hr: 120,
      exercise_angina: 'Y',
      oldpeak: 2.5,
      st_slope: 'Flat',
    },
  },
];

export default function HeartPredictionPage() {
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reportId, setReportId] = useState<string>('CP-8921');
  const [reportDate, setReportDate] = useState<string>('');

  useEffect(() => {
    setReportId(`CP-${Math.floor(100000 + Math.random() * 900000)}`);
    setReportDate(
      new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    );
  }, []);

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const applyPreset = (presetData: FormData) => {
    setFormData(presetData);
    setResult(null);
    setError(null);
  };

  const handleReset = () => {
    setFormData(DEFAULT_FORM);
    setResult(null);
    setError(null);
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate prediction.');
      }

      setResult(data);
      setReportDate(
        new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. INTERACTIVE SCREEN UI (Hidden when printing / generating PDF)          */}
      {/* ========================================================================= */}
      <div className="screen-only min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Banner */}
          <header className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute right-48 -bottom-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 heart-pulse">
                  <Heart className="w-10 h-10 fill-rose-500/30" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 animate-pulse" /> AI Clinical Intelligence
                    </span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-1">
                    CardioPulse <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-500">AI Assessor</span>
                  </h1>
                  <p className="text-slate-400 text-sm sm:text-base mt-1">
                    Advanced Machine Learning Heart Stroke & Cardiovascular Risk Diagnostic System
                  </p>
                </div>
              </div>

              {/* Quick Actions / Reset */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" /> Reset Fields
                </button>
              </div>
            </div>

            {/* Quick Presets Bar */}
            <div className="mt-8 pt-6 border-t border-slate-800/80">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                <Sparkles className="w-4 h-4 text-amber-400" /> One-Click Patient Sample Presets:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PRESETS.map((preset, idx) => {
                  const IconComponent = preset.icon;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => applyPreset(preset.data)}
                      className={`p-3.5 rounded-2xl border text-left transition hover:scale-[1.02] flex items-center justify-between group cursor-pointer ${preset.color}`}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className="w-5 h-5 flex-shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-rose-300 transition">
                            {preset.name}
                          </div>
                          <div className="text-[11px] text-slate-400 line-clamp-1">{preset.desc}</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 opacity-60 group-hover:translate-x-1 transition" />
                    </button>
                  );
                })}
              </div>
            </div>
          </header>

          {/* Main Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Side: Input Form (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <form onSubmit={handlePredict} className="space-y-6">
                {/* Category 1: Demographics & Core Vitals */}
                <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-2 text-base font-bold text-white">
                      <User className="w-5 h-5 text-rose-400" /> Patient Demographics & Vitals
                    </div>
                    <span className="text-xs text-slate-400 font-mono">Step 1 of 3</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Age Input */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm font-semibold text-slate-300">
                        <label className="flex items-center gap-1.5">Age (Years)</label>
                        <span className="text-rose-400 font-mono font-bold text-base px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                          {formData.age} yrs
                        </span>
                      </div>
                      <input
                        type="range"
                        min={18}
                        max={100}
                        value={formData.age}
                        onChange={(e) => handleChange('age', parseInt(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                        <span>18 yrs</span>
                        <span>50 yrs</span>
                        <span>100 yrs</span>
                      </div>
                    </div>

                    {/* Sex Input */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-300">Sex</label>
                      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
                        <button
                          type="button"
                          onClick={() => handleChange('sex', 'M')}
                          className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                            formData.sex === 'M'
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          Male (M)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleChange('sex', 'F')}
                          className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                            formData.sex === 'F'
                              ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-500/20'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          Female (F)
                        </button>
                      </div>
                    </div>

                    {/* Resting BP */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm font-semibold text-slate-300">
                        <label className="flex items-center gap-1.5">
                          Resting BP <span className="text-xs text-slate-400 font-normal">(mm Hg)</span>
                        </label>
                        <span
                          className={`font-mono font-bold text-base px-2 py-0.5 rounded border ${
                            formData.resting_bp >= 140
                              ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                              : formData.resting_bp >= 120
                              ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                              : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                          }`}
                        >
                          {formData.resting_bp} mm Hg
                        </span>
                      </div>
                      <input
                        type="range"
                        min={80}
                        max={200}
                        value={formData.resting_bp}
                        onChange={(e) => handleChange('resting_bp', parseInt(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                        <span>80 (Low)</span>
                        <span>120 (Normal)</span>
                        <span>200 (High)</span>
                      </div>
                    </div>

                    {/* Cholesterol */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm font-semibold text-slate-300">
                        <label className="flex items-center gap-1.5">
                          Cholesterol <span className="text-xs text-slate-400 font-normal">(mg/dL)</span>
                        </label>
                        <span
                          className={`font-mono font-bold text-base px-2 py-0.5 rounded border ${
                            formData.cholesterol >= 240
                              ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                              : formData.cholesterol >= 200
                              ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                              : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                          }`}
                        >
                          {formData.cholesterol} mg/dL
                        </span>
                      </div>
                      <input
                        type="range"
                        min={100}
                        max={600}
                        value={formData.cholesterol}
                        onChange={(e) => handleChange('cholesterol', parseInt(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                        <span>100</span>
                        <span>200 (Target)</span>
                        <span>600</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category 2: Cardiac Symptoms & Exercise Performance */}
                <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-2 text-base font-bold text-white">
                      <Stethoscope className="w-5 h-5 text-indigo-400" /> Symptoms & Cardiac Metrics
                    </div>
                    <span className="text-xs text-slate-400 font-mono">Step 2 of 3</span>
                  </div>

                  {/* Chest Pain Type Select */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-300">
                      Chest Pain Type
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { code: 'ATA', title: 'Atypical', desc: 'Atypical Angina' },
                        { code: 'NAP', title: 'Non-Anginal', desc: 'Non-Anginal Pain' },
                        { code: 'TA', title: 'Typical', desc: 'Typical Angina' },
                        { code: 'ASY', title: 'Asymptomatic', desc: 'Silent Ischemia' },
                      ].map((item) => (
                        <button
                          key={item.code}
                          type="button"
                          onClick={() => handleChange('chest_pain', item.code)}
                          className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                            formData.chest_pain === item.code
                              ? 'bg-rose-500/20 border-rose-500 text-white shadow-lg shadow-rose-500/10'
                              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                          }`}
                        >
                          <div className="font-bold text-xs">{item.title}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Max Heart Rate */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm font-semibold text-slate-300">
                        <label className="flex items-center gap-1.5">Max Heart Rate achieved</label>
                        <span className="text-indigo-400 font-mono font-bold text-base px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                          {formData.max_hr} bpm
                        </span>
                      </div>
                      <input
                        type="range"
                        min={60}
                        max={220}
                        value={formData.max_hr}
                        onChange={(e) => handleChange('max_hr', parseInt(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                        <span>60 bpm</span>
                        <span>150 bpm</span>
                        <span>220 bpm</span>
                      </div>
                    </div>

                    {/* Fasting Blood Sugar */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-300">
                        Fasting Blood Sugar &gt; 120 mg/dL
                      </label>
                      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
                        <button
                          type="button"
                          onClick={() => handleChange('fasting_bs', 0)}
                          className={`py-2 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                            formData.fasting_bs === 0
                              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          No (≤120)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleChange('fasting_bs', 1)}
                          className={`py-2 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                            formData.fasting_bs === 1
                              ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          Yes (&gt;120)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Exercise Induced Angina */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-300">
                      Exercise-Induced Angina (Chest Pain during Exercise)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleChange('exercise_angina', 'N')}
                        className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                          formData.exercise_angina === 'N'
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" /> No Angina (N)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChange('exercise_angina', 'Y')}
                        className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                          formData.exercise_angina === 'Y'
                            ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400'
                        }`}
                      >
                        <AlertTriangle className="w-4 h-4" /> Angina Present (Y)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Category 3: Electrocardiogram (ECG) Findings */}
                <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-2 text-base font-bold text-white">
                      <Activity className="w-5 h-5 text-teal-400" /> Electrocardiogram (ECG) Diagnostics
                    </div>
                    <span className="text-xs text-slate-400 font-mono">Step 3 of 3</span>
                  </div>

                  {/* Resting ECG */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-300">Resting ECG Result</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { code: 'Normal', title: 'Normal', desc: 'No baseline abnormalities' },
                        { code: 'ST', title: 'ST Abnormality', desc: 'ST-T wave depression/elevation' },
                        { code: 'LVH', title: 'LV Hypertrophy', desc: 'Est. left ventricular hypertrophy' },
                      ].map((ecg) => (
                        <button
                          key={ecg.code}
                          type="button"
                          onClick={() => handleChange('resting_ecg', ecg.code)}
                          className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                            formData.resting_ecg === ecg.code
                              ? 'bg-teal-500/20 border-teal-500 text-white shadow-lg shadow-teal-500/10'
                              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                          }`}
                        >
                          <div className="font-bold text-xs">{ecg.title}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{ecg.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Oldpeak */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm font-semibold text-slate-300">
                        <label className="flex items-center gap-1.5">
                          Oldpeak <span className="text-xs text-slate-400 font-normal">(ST Depression)</span>
                        </label>
                        <span className="text-teal-400 font-mono font-bold text-base px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/20">
                          {formData.oldpeak.toFixed(1)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0.0}
                        max={6.0}
                        step={0.1}
                        value={formData.oldpeak}
                        onChange={(e) => handleChange('oldpeak', parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                        <span>0.0 (Normal)</span>
                        <span>3.0</span>
                        <span>6.0 (Severe)</span>
                      </div>
                    </div>

                    {/* ST Slope */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-300">Peak Exercise ST Slope</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { code: 'Up', label: 'Up-sloping' },
                          { code: 'Flat', label: 'Flat' },
                          { code: 'Down', label: 'Down-sloping' },
                        ].map((slope) => (
                          <button
                            key={slope.code}
                            type="button"
                            onClick={() => handleChange('st_slope', slope.code)}
                            className={`py-2 px-2 rounded-xl border text-xs font-bold transition text-center cursor-pointer ${
                              formData.st_slope === slope.code
                                ? 'bg-rose-500/20 border-rose-500 text-white shadow-md'
                                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {slope.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Predict Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-lg shadow-xl shadow-rose-600/30 hover:shadow-rose-600/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 flex items-center justify-center gap-3 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-6 h-6 animate-spin" /> Analyzing Clinical Risk...
                    </>
                  ) : (
                    <>
                      <Heart className="w-6 h-6 fill-white/20" /> Generate Diagnostic Risk Assessment
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Side: Prediction Output & Analysis Panel (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              {error && (
                <div className="p-5 rounded-3xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3 shadow-xl">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
                  <div>
                    <div className="font-bold text-white">Prediction Error</div>
                    <div className="mt-1">{error}</div>
                  </div>
                </div>
              )}

              {result ? (
                <div className="space-y-6 sticky top-6">
                  {/* Result Card */}
                  <div
                    className={`glass-panel rounded-3xl p-6 sm:p-8 border shadow-2xl transition-all relative overflow-hidden ${
                      result.prediction === 1
                        ? 'border-rose-500/40 bg-gradient-to-b from-slate-900 via-rose-950/20 to-slate-900'
                        : 'border-emerald-500/40 bg-gradient-to-b from-slate-900 via-emerald-950/20 to-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border flex items-center gap-1.5 ${
                          result.prediction === 1
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {result.prediction === 1 ? (
                          <>
                            <ShieldAlert className="w-4 h-4" /> High Risk Detected
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" /> Low Risk Detected
                          </>
                        )}
                      </span>

                      {/* Enhanced Save / Print Button */}
                      <button
                        type="button"
                        onClick={handlePrint}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-2 transition border border-slate-700 shadow-sm cursor-pointer"
                        title="Print Report or Save as PDF"
                      >
                        <Printer className="w-4 h-4 text-rose-400" />
                        <span>Save / Print PDF</span>
                      </button>
                    </div>

                    <h2 className="text-2xl font-extrabold text-white">{result.risk_label}</h2>
                    <p className="text-slate-400 text-xs mt-1">
                      Based on supervised ML classification trained on clinical heart disease features.
                    </p>

                    {/* Risk Score Progress Bar / Meter */}
                    <div className="mt-6 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                          <Flame className="w-4 h-4 text-amber-400" /> Estimated Stroke & Disease Probability
                        </span>
                        <span
                          className={`font-mono text-xl font-extrabold ${
                            result.probability > 50 ? 'text-rose-400' : 'text-emerald-400'
                          }`}
                        >
                          {result.probability}%
                        </span>
                      </div>

                      <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${
                            result.probability > 50
                              ? 'bg-gradient-to-r from-amber-500 to-rose-600 shadow-md shadow-rose-500/50'
                              : 'bg-gradient-to-r from-teal-500 to-emerald-500 shadow-md shadow-emerald-500/50'
                          }`}
                          style={{ width: `${Math.max(5, Math.min(100, result.probability))}%` }}
                        />
                      </div>
                    </div>

                    {/* Key Factors */}
                    {result.key_factors.length > 0 && (
                      <div className="mt-6 space-y-3">
                        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Info className="w-4 h-4 text-rose-400" /> Key Clinical Drivers Identified:
                        </div>
                        <div className="space-y-2">
                          {result.key_factors.map((factor, i) => (
                            <div
                              key={i}
                              className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 flex items-center gap-2.5"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0" />
                              {factor}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Clinical Recommendations */}
                    {result.recommendations.length > 0 && (
                      <div className="mt-6 space-y-3">
                        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Stethoscope className="w-4 h-4 text-indigo-400" /> Recommended Next Steps:
                        </div>
                        <div className="space-y-2">
                          {result.recommendations.map((rec, i) => (
                            <div
                              key={i}
                              className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-indigo-200 flex items-start gap-2.5"
                            >
                              <ChevronRight className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                              <span>{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="glass-panel rounded-3xl p-8 border border-slate-800 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                    <Activity className="w-8 h-8 text-rose-500/50" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Awaiting Input Parameters</h3>
                  <p className="text-slate-400 text-xs max-w-sm mx-auto">
                    Fill out the patient details or select one of the patient sample presets above, then click{' '}
                    <strong className="text-rose-400">Generate Diagnostic Risk Assessment</strong>.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DEDICATED PRINT / PDF REPORT (Crystal Clear, High Contrast, Legible)    */}
      {/* ========================================================================= */}
      <div className="print-only hidden font-sans text-slate-900 bg-white p-6 max-w-4xl mx-auto">
        {/* Clinic Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Heart className="w-8 h-8 fill-red-500 text-red-500" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                CardioPulse Medical Diagnostics
              </h1>
              <p className="text-xs font-semibold text-slate-600">
                Cardiovascular & Heart Stroke Risk Evaluation System • Clinical ML Assessment
              </p>
            </div>
          </div>
          <div className="text-right text-xs">
            <div className="font-mono font-bold text-slate-900">REF: {reportId}</div>
            <div className="text-slate-600">{reportDate}</div>
            <div className="inline-block mt-1 px-2.5 py-0.5 rounded bg-slate-100 font-bold text-slate-700 text-[10px] uppercase border border-slate-300">
              Diagnostic Clinical Record
            </div>
          </div>
        </div>

        {/* Patient Vitals Summary Table */}
        <div className="mb-5">
          <div className="text-xs font-black uppercase tracking-wider text-slate-800 bg-slate-100 px-3 py-1.5 rounded-t-lg border border-slate-300 flex items-center justify-between">
            <span>1. Patient Baseline Information & Clinical Vitals</span>
            <span className="text-[10px] text-slate-600 font-normal">Standard 11-Parameter Cardiovascular Assessment</span>
          </div>
          <table className="w-full text-xs border border-t-0 border-slate-300 border-collapse">
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="p-2 font-semibold bg-slate-50 w-1/4 border-r border-slate-200 text-slate-700">Patient Age</td>
                <td className="p-2 font-bold text-slate-900 w-1/4 border-r border-slate-200">{formData.age} years</td>
                <td className="p-2 font-semibold bg-slate-50 w-1/4 border-r border-slate-200 text-slate-700">Biological Sex</td>
                <td className="p-2 font-bold text-slate-900 w-1/4">{formData.sex === 'M' ? 'Male (M)' : 'Female (F)'}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2 font-semibold bg-slate-50 border-r border-slate-200 text-slate-700">Resting Blood Pressure</td>
                <td className="p-2 font-bold text-slate-900 border-r border-slate-200">
                  {formData.resting_bp} mm Hg
                  <span className="ml-1 text-[10px] font-normal text-slate-500">
                    ({formData.resting_bp >= 140 ? 'High / Stage 2' : formData.resting_bp >= 120 ? 'Pre-hypertension' : 'Normal'})
                  </span>
                </td>
                <td className="p-2 font-semibold bg-slate-50 border-r border-slate-200 text-slate-700">Serum Cholesterol</td>
                <td className="p-2 font-bold text-slate-900">
                  {formData.cholesterol} mg/dL
                  <span className="ml-1 text-[10px] font-normal text-slate-500">
                    ({formData.cholesterol >= 240 ? 'High Risk' : formData.cholesterol >= 200 ? 'Borderline' : 'Desirable'})
                  </span>
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2 font-semibold bg-slate-50 border-r border-slate-200 text-slate-700">Fasting Blood Sugar</td>
                <td className="p-2 font-bold text-slate-900 border-r border-slate-200">
                  {formData.fasting_bs === 1 ? '> 120 mg/dL (Elevated)' : '≤ 120 mg/dL (Normal)'}
                </td>
                <td className="p-2 font-semibold bg-slate-50 border-r border-slate-200 text-slate-700">Max Heart Rate Achieved</td>
                <td className="p-2 font-bold text-slate-900">{formData.max_hr} bpm</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-2 font-semibold bg-slate-50 border-r border-slate-200 text-slate-700">Chest Pain Type</td>
                <td className="p-2 font-bold text-slate-900 border-r border-slate-200">{CHEST_PAIN_LABELS[formData.chest_pain] || formData.chest_pain}</td>
                <td className="p-2 font-semibold bg-slate-50 border-r border-slate-200 text-slate-700">Exercise-Induced Angina</td>
                <td className="p-2 font-bold text-slate-900">{formData.exercise_angina === 'Y' ? 'Present (Yes)' : 'Absent (No)'}</td>
              </tr>
              <tr>
                <td className="p-2 font-semibold bg-slate-50 border-r border-slate-200 text-slate-700">Resting ECG</td>
                <td className="p-2 font-bold text-slate-900 border-r border-slate-200">{RESTING_ECG_LABELS[formData.resting_ecg] || formData.resting_ecg}</td>
                <td className="p-2 font-semibold bg-slate-50 border-r border-slate-200 text-slate-700">ST Depression / Slope</td>
                <td className="p-2 font-bold text-slate-900">{formData.oldpeak.toFixed(1)} mm • {ST_SLOPE_LABELS[formData.st_slope] || formData.st_slope}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Diagnostic Machine Learning Result */}
        <div className="mb-5">
          <div className="text-xs font-black uppercase tracking-wider text-slate-800 bg-slate-100 px-3 py-1.5 rounded-t-lg border border-slate-300">
            2. Diagnostic Machine Learning Evaluation & Risk Level
          </div>
          <div
            className={`p-4 rounded-b-lg border border-t-0 ${
              result?.prediction === 1
                ? 'border-red-600 bg-red-50/70'
                : 'border-emerald-600 bg-emerald-50/70'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`px-3 py-1.5 rounded-lg text-white font-extrabold text-sm tracking-wide ${
                    result?.prediction === 1 ? 'bg-red-600' : 'bg-emerald-600'
                  }`}
                >
                  {result?.prediction === 1 ? 'HIGH RISK' : 'LOW RISK'}
                </div>
                <div>
                  <h2
                    className={`text-xl font-black ${
                      result?.prediction === 1 ? 'text-red-950' : 'text-emerald-950'
                    }`}
                  >
                    {result?.risk_label || (result?.prediction === 1 ? 'High Risk of Heart Disease' : 'Low Risk of Heart Disease')}
                  </h2>
                  <p className="text-xs text-slate-700 font-medium mt-0.5">
                    Evaluated via standard scaler normalization and multivariate logistic regression classification.
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-slate-600">Stroke / Disease Probability</div>
                <div
                  className={`text-2xl font-black ${
                    result?.prediction === 1 ? 'text-red-700' : 'text-emerald-700'
                  }`}
                >
                  {result?.probability ?? 0}%
                </div>
              </div>
            </div>

            {/* Probability Gauge Bar */}
            <div className="mt-3.5">
              <div className="w-full bg-slate-200 h-3.5 rounded-full overflow-hidden border border-slate-300">
                <div
                  className={`h-full ${
                    result?.prediction === 1 ? 'bg-red-600' : 'bg-emerald-600'
                  }`}
                  style={{ width: `${Math.max(5, Math.min(100, result?.probability || 0))}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-600 font-mono mt-1">
                <span>0% (Minimal Risk)</span>
                <span>50% (Clinical Cutoff)</span>
                <span>100% (High Risk)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Factors & Clinical Action Plan Grid */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          {/* Key Clinical Drivers */}
          <div className="border border-slate-300 rounded-lg p-3.5 bg-slate-50/60">
            <div className="text-xs font-black uppercase tracking-wider text-slate-800 mb-2 pb-1 border-b border-slate-200 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-red-600" /> Key Clinical Factors Identified
            </div>
            {result && result.key_factors.length > 0 ? (
              <ul className="space-y-1.5 text-xs text-slate-800">
                {result.key_factors.map((factor, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-1.5 flex-shrink-0" />
                    <span className="font-medium">{factor}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-600 italic">No acute adverse clinical indicators noted.</p>
            )}
          </div>

          {/* Recommendations */}
          <div className="border border-slate-300 rounded-lg p-3.5 bg-slate-50/60">
            <div className="text-xs font-black uppercase tracking-wider text-slate-800 mb-2 pb-1 border-b border-slate-200 flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-indigo-700" /> Recommended Action Items
            </div>
            {result && result.recommendations.length > 0 ? (
              <ul className="space-y-1.5 text-xs text-slate-800">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="font-bold text-slate-900 flex-shrink-0">{i + 1}.</span>
                    <span className="font-medium">{rec}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-600 italic">Maintain healthy nutrition and routine annual medical checkup.</p>
            )}
          </div>
        </div>

        {/* Disclaimer & Physician Verification Signature */}
        <div className="border-t-2 border-slate-300 pt-3 text-[11px] text-slate-600">
          <p className="leading-snug mb-3">
            <strong className="text-slate-800">CLINICAL NOTICE:</strong> This report is generated by an artificial intelligence diagnostic screening model trained on clinical cardiovascular datasets. It is intended solely as an auxiliary decision-support tool and does not replace professional medical judgment or direct clinical evaluation by a licensed healthcare specialist.
          </p>

          <div className="grid grid-cols-3 gap-6 pt-2 border-t border-slate-200 text-xs">
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Diagnostic System</div>
              <div className="font-bold text-slate-900">CardioPulse Logistic ML Engine</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Attending Physician / Specialist</div>
              <div className="border-b border-slate-400 mt-5 h-2"></div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Date & Clinic Stamp</div>
              <div className="border-b border-slate-400 mt-5 h-2"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
