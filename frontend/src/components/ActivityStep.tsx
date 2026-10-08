import React from 'react';
import { ActivityLevel } from '../types/nutrition';
import {
  Footprints,
  Dumbbell,
  Flame,
  Trophy,
  Zap,
  ArrowLeft,
  ArrowRight,
  User,
  Activity,
} from 'lucide-react';

interface ActivityStepProps {
  selectedActivity: ActivityLevel;
  onSelect: (activity: ActivityLevel) => void;
  onNext: () => void;
  onBack: () => void;
}

const ACTIVITIES: Array<{
  id: ActivityLevel;
  title: string;
  badge: string;
  description: string;
  icon: React.ElementType;
}> = [
  {
    id: 'normal',
    title: 'Normal Activity',
    badge: '1.2x TDEE',
    description: 'Desk job, standard daily living movements, minimal intentional exercise.',
    icon: User,
  },
  {
    id: 'walking',
    title: 'Walking / Light Activity',
    badge: '1.375x TDEE',
    description: 'Daily light walking, light chores, or 1–3 days per week light exercise.',
    icon: Footprints,
  },
  {
    id: 'gym',
    title: 'Gym / Strength Training',
    badge: '1.55x TDEE',
    description: '3–5 days per week moderate resistance training or fitness workouts.',
    icon: Dumbbell,
  },
  {
    id: 'bodybuilding',
    title: 'Bodybuilding / Hypertrophy',
    badge: '1.7x TDEE',
    description: 'Intense weightlifting, progressive overload, heavy muscle-building focus.',
    icon: Activity,
  },
  {
    id: 'running',
    title: 'Running / Jogging',
    badge: '1.6x TDEE',
    description: 'Regular distance running, road races, or high-cardio training sessions.',
    icon: Flame,
  },
  {
    id: 'endurance',
    title: 'Endurance Athlete',
    badge: '1.75x TDEE',
    description: 'Marathons, cycling, triathlon, or long-duration cardiovascular training.',
    icon: Zap,
  },
  {
    id: 'sports',
    title: 'Sports Athlete',
    badge: '1.65x TDEE',
    description: 'Football, basketball, tennis, martial arts, or competitive team sports.',
    icon: Trophy,
  },
  {
    id: 'highly_active',
    title: 'Highly Active / Physical Work',
    badge: '1.9x TDEE',
    description: 'Heavy physical labor combined with intense daily athletic workouts.',
    icon: Zap,
  },
];

export const ActivityStep: React.FC<ActivityStepProps> = ({
  selectedActivity,
  onSelect,
  onNext,
  onBack,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6 text-center">
        <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          Step 2 of 3
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
          Select Physical Activity Level
        </h2>
        <p className="text-slate-400 text-sm mt-1 max-w-xl mx-auto">
          Your activity level determines estimated Total Daily Energy Expenditure (TDEE) and optimal protein per kg ratio.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {ACTIVITIES.map((act) => {
          const Icon = act.icon;
          const isSelected = selectedActivity === act.id;

          return (
            <div
              key={act.id}
              onClick={() => onSelect(act.id)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-b from-slate-900 to-emerald-950/40 border-emerald-400 shadow-xl shadow-emerald-500/15 ring-2 ring-emerald-500/30 transform -translate-y-1'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {act.badge}
                  </span>
                </div>
                <h3
                  className={`font-bold text-base mb-1.5 ${
                    isSelected ? 'text-white' : 'text-slate-200'
                  }`}
                >
                  {act.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{act.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                <span>Select Level</span>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    isSelected
                      ? 'border-emerald-400 bg-emerald-400'
                      : 'border-slate-600'
                  }`}
                >
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-4 max-w-xl mx-auto">
        <button
          type="button"
          onClick={onBack}
          className="py-3.5 px-6 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 font-semibold text-sm flex items-center space-x-2 hover:bg-slate-800 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="py-3.5 px-8 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-base flex items-center space-x-2 shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-400 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <span>Continue to Fitness Goal</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
