import React from 'react';
import { User, Zap, Target, BarChart2, CheckCircle2 } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, onStepClick }) => {
  const steps = [
    { id: 1, label: 'Body Info', icon: User },
    { id: 2, label: 'Activity Level', icon: Zap },
    { id: 3, label: 'Fitness Goal', icon: Target },
    { id: 4, label: 'Nutrition Dashboard', icon: BarChart2 },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mb-10 px-4">
      <div className="flex items-center justify-between relative">
        {/* Background Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 w-full bg-slate-800 rounded-full z-0" />
        
        {/* Progress Fill Line */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full z-0 transition-all duration-500 ease-in-out"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div
              key={step.id}
              onClick={() => isCompleted && onStepClick && onStepClick(step.id)}
              className={`relative z-10 flex flex-col items-center group ${
                isCompleted ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all duration-300 ${
                  isCompleted
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                    : isCurrent
                    ? 'bg-slate-900 border-2 border-emerald-400 text-emerald-400 shadow-xl shadow-emerald-500/10 scale-110'
                    : 'bg-slate-900 border border-slate-800 text-slate-500'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>

              <span
                className={`mt-2 text-xs font-semibold tracking-wide transition-colors ${
                  isCurrent
                    ? 'text-emerald-400'
                    : isCompleted
                    ? 'text-slate-300'
                    : 'text-slate-600'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
