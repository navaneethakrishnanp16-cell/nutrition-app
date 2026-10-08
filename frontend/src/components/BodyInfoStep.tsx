import React from 'react';
import { Scale, Ruler, Calendar, Users, AlertCircle, ArrowRight } from 'lucide-react';
import type { Gender } from '../types/nutrition';

interface BodyInfoStepProps {
  weight: number | '';
  height: number | '';
  age: number | '';
  gender: Gender | '';
  onChange: (fields: {
    weight?: number | '';
    height?: number | '';
    age?: number | '';
    gender?: Gender | '';
  }) => void;
  onNext: () => void;
  error?: string;
}

export const BodyInfoStep: React.FC<BodyInfoStepProps> = ({
  weight,
  height,
  age,
  gender,
  onChange,
  onNext,
  error,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="w-full max-w-xl mx-auto glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl">
      <div className="mb-6">
        <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          Step 1 of 3
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
          Body Metrics
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Enter your body weight to calculate baseline requirements. Height, age, and gender unlock precise Mifflin-St Jeor BMR calculations.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center space-x-3 text-red-400 text-sm animate-shake">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Weight (Mandatory) */}
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Scale className="w-4 h-4 text-emerald-400" />
              <span>Weight (kg)</span>
            </span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              Required
            </span>
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              min="20"
              max="300"
              placeholder="e.g. 70"
              value={weight}
              onChange={(e) =>
                onChange({ weight: e.target.value === '' ? '' : parseFloat(e.target.value) })
              }
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-semibold"
              required
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">
              kg
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Height (Optional) */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <Ruler className="w-4 h-4 text-teal-400" />
                <span>Height (cm)</span>
              </span>
              <span className="text-xs text-slate-500">Optional</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="50"
                max="250"
                placeholder="e.g. 175"
                value={height}
                onChange={(e) =>
                  onChange({ height: e.target.value === '' ? '' : parseInt(e.target.value, 10) })
                }
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">
                cm
              </span>
            </div>
          </div>

          {/* Age (Optional) */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>Age (Years)</span>
              </span>
              <span className="text-xs text-slate-500">Optional</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="10"
                max="120"
                placeholder="e.g. 25"
                value={age}
                onChange={(e) =>
                  onChange({ age: e.target.value === '' ? '' : parseInt(e.target.value, 10) })
                }
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">
                yrs
              </span>
            </div>
          </div>
        </div>

        {/* Gender (Optional) */}
        <div className="pt-2">
          <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-sky-400" />
              <span>Biological Gender</span>
            </span>
            <span className="text-xs text-slate-500">Optional</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'male', label: 'Male' },
              { id: 'female', label: 'Female' },
              { id: 'other', label: 'Other' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onChange({ gender: item.id as Gender })}
                className={`py-3 px-4 rounded-xl text-sm font-semibold border transition-all ${
                  gender === item.id
                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-900/90 border-slate-700/80 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-8 py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-base flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-400 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <span>Continue to Activity Level</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </form>
    </div>
  );
};
