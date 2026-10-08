import React from 'react';
import type { SampleMealPlan, Meal } from '../types/nutrition';
import { Utensils, Flame, Coffee, Sun, Cookie, Moon } from 'lucide-react';

interface MealPlanSectionProps {
  mealPlan: SampleMealPlan | null;
  loading: boolean;
  onGenerate: () => void;
}

export const MealPlanSection: React.FC<MealPlanSectionProps> = ({
  mealPlan,
  loading,
  onGenerate,
}) => {
  if (!mealPlan) {
    return (
      <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
        <Utensils className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-white mb-2">Sample Daily Meal Plan</h3>
        <p className="text-slate-400 text-sm max-w-lg mx-auto mb-6">
          Generate an Indian cuisine sample meal plan split into 4 meals (Breakfast, Lunch, Snack, Dinner) formatted to hit your target calories and protein goals.
        </p>
        <button
          onClick={onGenerate}
          disabled={loading}
          className="py-3 px-6 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-sm hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
        >
          {loading ? 'Generating Meal Plan...' : 'Generate Sample Indian Meal Plan'}
        </button>
      </div>
    );
  }

  const mealIcons: Record<string, { icon: React.ElementType; color: string }> = {
    breakfast: { icon: Coffee, color: 'text-amber-400 bg-amber-500/10' },
    lunch: { icon: Sun, color: 'text-emerald-400 bg-emerald-500/10' },
    snack: { icon: Cookie, color: 'text-cyan-400 bg-cyan-500/10' },
    dinner: { icon: Moon, color: 'text-purple-400 bg-purple-500/10' },
  };

  const renderMealCard = (key: string, meal: Meal) => {
    const meta = mealIcons[key] || { icon: Utensils, color: 'text-emerald-400 bg-emerald-500/10' };
    const Icon = meta.icon;

    return (
      <div
        key={key}
        className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${meta.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-100 text-base capitalize">{key}</h4>
                <p className="text-xs text-slate-400">{meal.name}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-extrabold text-white flex items-center space-x-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>{meal.totalCalories} kcal</span>
              </span>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            {meal.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60"
              >
                <span className="text-slate-300 font-medium">
                  {item.food.name} <span className="text-slate-500">({item.portionGrams}g)</span>
                </span>
                <span className="text-slate-400 font-semibold">{item.calories} kcal</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 grid grid-cols-3 gap-2 text-center text-[11px]">
          <div>
            <span className="block text-slate-500 font-semibold">Protein</span>
            <span className="font-bold text-emerald-400">{meal.totalProtein}g</span>
          </div>
          <div>
            <span className="block text-slate-500 font-semibold">Carbs</span>
            <span className="font-bold text-cyan-400">{meal.totalCarbs}g</span>
          </div>
          <div>
            <span className="block text-slate-500 font-semibold">Fat</span>
            <span className="font-bold text-amber-400">{meal.totalFat}g</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-white flex items-center space-x-2">
            <Utensils className="w-5 h-5 text-emerald-400" />
            <span>Recommended Indian Meal Plan</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Structured 4-meal target breakdown matching {mealPlan.targetCalories} total kcal/day.
          </p>
        </div>

        <button
          onClick={onGenerate}
          disabled={loading}
          className="py-2.5 px-4 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs hover:bg-slate-700 transition-all"
        >
          Re-generate Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {renderMealCard('breakfast', mealPlan.meals.breakfast)}
        {renderMealCard('lunch', mealPlan.meals.lunch)}
        {renderMealCard('snack', mealPlan.meals.snack)}
        {renderMealCard('dinner', mealPlan.meals.dinner)}
      </div>

      {/* Summary Box */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <span className="font-bold text-slate-300 uppercase tracking-wide">
          Meal Plan Totals:
        </span>
        <div className="flex items-center space-x-6">
          <span className="text-white font-bold">
            Calories: <span className="text-amber-400">{mealPlan.summary.calories} kcal</span>
          </span>
          <span className="text-white font-bold">
            Protein: <span className="text-emerald-400">{mealPlan.summary.protein}g</span>
          </span>
          <span className="text-white font-bold">
            Carbs: <span className="text-cyan-400">{mealPlan.summary.carbs}g</span>
          </span>
          <span className="text-white font-bold">
            Fat: <span className="text-amber-400">{mealPlan.summary.fat}g</span>
          </span>
        </div>
      </div>
    </div>
  );
};
