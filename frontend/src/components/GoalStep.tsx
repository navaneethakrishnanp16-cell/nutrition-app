import React from 'react';
import type { FitnessGoal } from '../types/nutrition';
import {
  Scale,
  TrendingDown,
  TrendingUp,
  Dumbbell,
  Zap,
  ArrowLeft,
  Calculator,
  Loader2,
} from 'lucide-react';

interface GoalStepProps {
  selectedGoal: FitnessGoal;
  onSelect: (goal: FitnessGoal) => void;
  onCalculate: () => void;
  onBack: () => void;
  loading: boolean;
}

const GOALS: Array<{
  id: FitnessGoal;
  title: string;
  adjustment: string;
  description: string;
  icon: React.ElementType;
  badgeColor: string;
}> = [
  {
    id: 'maintain',
    title: 'Maintain Weight',
    adjustment: 'TDEE',
    description: 'Keep body weight stable, maintain current physique and metabolic equilibrium.',
    icon: Scale,
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  {
    id: 'weight_loss',
    title: 'Weight Loss',
    adjustment: '-300 to -500 kcal',
    description: 'Controlled calorie deficit for body fat reduction while preserving lean muscle.',
    icon: TrendingDown,
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  {
    id: 'weight_gain',
    title: 'Weight Gain',
    adjustment: '+200 to +400 kcal',
    description: 'Calorie surplus designed for gradual weight and overall mass increase.',
    icon: TrendingUp,
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
  {
    id: 'muscle_gain',
    title: 'Muscle Gain (Hypertrophy)',
    adjustment: '+200 to +300 kcal',
    description: 'Optimal lean surplus combined with high protein for maximum muscle synthesis.',
    icon: Dumbbell,
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  {
    id: 'athletic',
    title: 'Athletic Performance',
    adjustment: 'Performance Calorie Boost',
    description: 'Focus on high energy availability, carbohydrate loading, and athletic stamina.',
    icon: Zap,
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  },
];

export const GoalStep: React.FC<GoalStepProps> = ({
  selectedGoal,
  onSelect,
  onCalculate,
  onBack,
  loading,
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-6 text-center">
        <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          Step 3 of 3
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
          Select Your Primary Fitness Goal
        </h2>
        <p className="text-slate-400 text-sm mt-1 max-w-lg mx-auto">
          We tune your daily target calories and macronutrient ratios to support your specific physique or athletic goal.
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {GOALS.map((g) => {
          const Icon = g.icon;
          const isSelected = selectedGoal === g.id;

          return (
            <div
              key={g.id}
              onClick={() => onSelect(g.id)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex items-center justify-between ${
                isSelected
                  ? 'bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border-emerald-400 shadow-xl shadow-emerald-500/15 ring-2 ring-emerald-500/30 transform -translate-y-0.5'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`w-12 h-12 rounded-xl flex flex-shrink-0 items-center justify-center ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h3
                      className={`font-bold text-lg ${
                        isSelected ? 'text-white' : 'text-slate-200'
                      }`}
                    >
                      {g.title}
                    </h3>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${g.badgeColor}`}
                    >
                      {g.adjustment}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                    {g.description}
                  </p>
                </div>
              </div>

              <div
                className={`w-6 h-6 rounded-full border flex items-center justify-center ml-4 flex-shrink-0 ${
                  isSelected ? 'border-emerald-400 bg-emerald-400' : 'border-slate-700'
                }`}
              >
                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-slate-950" />}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="py-4 px-6 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 font-semibold text-sm flex items-center space-x-2 hover:bg-slate-800 transition-all disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onCalculate}
          disabled={loading}
          className="py-4 px-8 sm:px-10 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 font-extrabold text-base sm:text-lg flex items-center space-x-3 shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin text-slate-950" />
              <span>Calculating Engine...</span>
            </>
          ) : (
            <>
              <Calculator className="w-6 h-6 stroke-[2.5]" />
              <span>Calculate My Nutrition</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
