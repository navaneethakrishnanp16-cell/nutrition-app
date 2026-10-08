import React, { useState } from 'react';
import type {
  NutritionResponse,
  FoodItem,
  SampleMealPlan,
} from '../types/nutrition';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  Flame,
  Dumbbell,
  Wheat,
  Droplet,
  GlassWater,
  Sparkles,
  RefreshCw,
  Utensils,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { FoodDatabaseModal } from './FoodDatabaseModal';
import { MealPlanSection } from './MealPlanSection';
import { fetchSampleMealPlan } from '../services/api';

interface ResultsDashboardProps {
  data: NutritionResponse;
  foodDatabase: FoodItem[];
  onReset: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  data,
  foodDatabase,
  onReset,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mealPlan, setMealPlan] = useState<SampleMealPlan | null>(null);
  const [loadingMealPlan, setLoadingMealPlan] = useState(false);

  const { calories, protein, carbohydrates, fat, fiber, water, micronutrients, inputs, bmr, tdee } =
    data;

  // Recharts Macro Donut Data
  const macroPieData = [
    { name: 'Protein', value: protein.calories, grams: protein.grams, color: '#22c55e' },
    { name: 'Carbs', value: carbohydrates.calories, grams: carbohydrates.grams, color: '#06b6d4' },
    { name: 'Fat', value: fat.calories, grams: fat.grams, color: '#f59e0b' },
  ];

  // Recharts Energy Expenditure Bar Data
  const energyBarData = [
    { name: 'BMR (Basal)', kcal: bmr, fill: '#64748b' },
    { name: 'TDEE (Burn)', kcal: tdee, fill: '#3b82f6' },
    { name: 'Target Daily', kcal: calories, fill: '#22c55e' },
  ];

  const handleGeneratePlan = async () => {
    setLoadingMealPlan(true);
    const plan = await fetchSampleMealPlan(calories, protein.grams, inputs.goal || 'maintain');
    setMealPlan(plan);
    setLoadingMealPlan(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Header Summary Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Personalized Results
            </span>
            <span className="text-xs text-slate-400">Calculated via Mifflin-St Jeor</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Your Daily Nutrition Plan
          </h2>
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs sm:text-sm font-semibold">
            <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
              Weight: <strong className="text-emerald-400">{inputs.weight} kg</strong>
            </span>
            <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 capitalize">
              Activity: <strong className="text-teal-400">{inputs.activity.replace('_', ' ')}</strong>
            </span>
            <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 capitalize">
              Goal: <strong className="text-cyan-400">{inputs.goal?.replace('_', ' ') || 'Maintain'}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 md:flex-none py-3 px-5 rounded-xl bg-slate-900 border border-emerald-500/30 text-emerald-400 font-bold text-xs hover:bg-emerald-500/10 transition-all flex items-center justify-center space-x-2 shadow-lg"
          >
            <Utensils className="w-4 h-4" />
            <span>Indian Food DB</span>
          </button>

          <button
            onClick={onReset}
            className="flex-1 md:flex-none py-3 px-5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 font-bold text-xs hover:bg-slate-800 transition-all flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Recalculate</span>
          </button>
        </div>
      </div>

      {/* Main Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* CALORIES CARD */}
        <div className="glass-card p-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950/20 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Daily Target Calories
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Flame className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-white tracking-tight">
              {calories.toLocaleString()}
            </span>
            <span className="text-emerald-400 font-bold text-sm">kcal/day</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Estimated maintenance TDEE: {tdee} kcal
          </p>
        </div>

        {/* PROTEIN CARD */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Daily Protein
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Dumbbell className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-white tracking-tight">
              {protein.grams}
            </span>
            <span className="text-slate-400 font-bold text-sm">g/day</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-800">
            <span className="text-emerald-400 font-extrabold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {protein.perKg} g/kg
            </span>
            <span className="text-slate-400 font-semibold">{protein.percentage}% calories</span>
          </div>
        </div>

        {/* CARBOHYDRATES CARD */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Daily Carbs
            </span>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Wheat className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-white tracking-tight">
              {carbohydrates.grams}
            </span>
            <span className="text-slate-400 font-bold text-sm">g/day</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-800">
            <span className="text-cyan-400 font-extrabold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              {carbohydrates.perKg} g/kg
            </span>
            <span className="text-slate-400 font-semibold">{carbohydrates.percentage}% calories</span>
          </div>
        </div>

        {/* FAT CARD */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition-all shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Daily Fat
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Droplet className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-white tracking-tight">
              {fat.grams}
            </span>
            <span className="text-slate-400 font-bold text-sm">g/day</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-800">
            <span className="text-amber-400 font-extrabold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {fat.perKg} g/kg
            </span>
            <span className="text-slate-400 font-semibold">{fat.percentage}% calories</span>
          </div>
        </div>
      </div>

      {/* Fiber & Fluid hydration row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">
                Recommended Daily Fiber
              </span>
              <h4 className="text-xl font-extrabold text-white mt-0.5">{fiber.range}</h4>
            </div>
          </div>
          <span className="text-xs text-slate-500 max-w-[120px] text-right font-medium">
            Digestive health & satiety
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <GlassWater className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">
                Recommended Daily Water
              </span>
              <h4 className="text-xl font-extrabold text-white mt-0.5">{water.range}</h4>
            </div>
          </div>
          <span className="text-xs text-slate-500 max-w-[120px] text-right font-medium">
            Hydration & metabolic flow
          </span>
        </div>
      </div>

      {/* Visualizations Section (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DONUT CHART */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <h3 className="text-lg font-extrabold text-white mb-1">
            Macronutrient Calorie Distribution
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            Proportional split of daily calories derived from Protein, Carbs, and Fat.
          </p>

          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={macroPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {macroPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={3} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: any, item: any) => [
                    `${value} kcal (${item.payload.grams}g)`,
                    name,
                  ]}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center pt-4 border-t border-slate-800">
            <div>
              <span className="block text-[11px] text-slate-400 font-semibold">Protein</span>
              <span className="text-sm font-bold text-emerald-400">{protein.grams}g ({protein.percentage}%)</span>
            </div>
            <div>
              <span className="block text-[11px] text-slate-400 font-semibold">Carbs</span>
              <span className="text-sm font-bold text-cyan-400">{carbohydrates.grams}g ({carbohydrates.percentage}%)</span>
            </div>
            <div>
              <span className="block text-[11px] text-slate-400 font-semibold">Fat</span>
              <span className="text-sm font-bold text-amber-400">{fat.grams}g ({fat.percentage}%)</span>
            </div>
          </div>
        </div>

        {/* BAR CHART */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <h3 className="text-lg font-extrabold text-white mb-1">
            Energy Expenditure Breakdown
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            Basal Metabolic Rate (BMR) vs Activity Burn (TDEE) vs Goal Target.
          </p>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={energyBarData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(val: any) => [`${val} kcal`, 'Energy']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="kcal" radius={[8, 8, 0, 0]}>
                  {energyBarData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>BMR: {bmr} kcal</span>
            <span>TDEE: {tdee} kcal</span>
            <span className="text-emerald-400 font-bold">Goal Target: {calories} kcal</span>
          </div>
        </div>
      </div>

      {/* Micronutrients Table */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800">
        <div className="mb-4">
          <h3 className="text-xl font-extrabold text-white flex items-center space-x-2">
            <Info className="w-5 h-5 text-emerald-400" />
            <span>Micronutrient Guidelines</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            General dietary reference intakes (DRI) for essential vitamins and minerals.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">Nutrient</th>
                <th className="py-3 px-4">Recommended Value</th>
                <th className="py-3 px-4">Primary Biological Function</th>
                <th className="py-3 px-4 rounded-r-xl">Top Food Sources</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr>
                <td className="py-3 px-4 font-bold text-white">Calcium</td>
                <td className="py-3 px-4 text-emerald-400 font-semibold">{micronutrients.calciumMg} mg/day</td>
                <td className="py-3 px-4 text-slate-400">Bone density, muscle contraction</td>
                <td className="py-3 px-4 text-slate-400">Milk, Paneer, Curd, Sesame seeds</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">Iron</td>
                <td className="py-3 px-4 text-emerald-400 font-semibold">{micronutrients.ironMg} mg/day</td>
                <td className="py-3 px-4 text-slate-400">Oxygen transport in hemoglobin</td>
                <td className="py-3 px-4 text-slate-400">Spinach, Black Chana, Eggs, Dal</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">Magnesium</td>
                <td className="py-3 px-4 text-emerald-400 font-semibold">{micronutrients.magnesiumMg} mg/day</td>
                <td className="py-3 px-4 text-slate-400">Nerve function & ATP energy production</td>
                <td className="py-3 px-4 text-slate-400">Almonds, Oats, Seeds, Dark Chocolate</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">Potassium</td>
                <td className="py-3 px-4 text-emerald-400 font-semibold">{micronutrients.potassiumMg} mg/day</td>
                <td className="py-3 px-4 text-slate-400">Electrolyte balance & muscle cramping prevention</td>
                <td className="py-3 px-4 text-slate-400">Banana, Sweet Potato, Coconut Water</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">Sodium</td>
                <td className="py-3 px-4 text-emerald-400 font-semibold">&lt; {micronutrients.sodiumMg} mg/day</td>
                <td className="py-3 px-4 text-slate-400">Fluid balance & cellular hydration</td>
                <td className="py-3 px-4 text-slate-400">Table salt, natural whole foods</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">Vitamin D</td>
                <td className="py-3 px-4 text-emerald-400 font-semibold">{micronutrients.vitaminDIu} IU/day</td>
                <td className="py-3 px-4 text-slate-400">Calcium absorption & immune defense</td>
                <td className="py-3 px-4 text-slate-400">Egg yolks, Fortified milk, Sunlight</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">Vitamin C</td>
                <td className="py-3 px-4 text-emerald-400 font-semibold">{micronutrients.vitaminCMg} mg/day</td>
                <td className="py-3 px-4 text-slate-400">Antioxidant & collagen synthesis</td>
                <td className="py-3 px-4 text-slate-400">Amla, Guava, Lemons, Oranges</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">Vitamin B12</td>
                <td className="py-3 px-4 text-emerald-400 font-semibold">{micronutrients.vitaminB12Mcg} mcg/day</td>
                <td className="py-3 px-4 text-slate-400">Red blood cell formation & neurological health</td>
                <td className="py-3 px-4 text-slate-400">Chicken, Eggs, Milk, Curd</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Sample Meal Plan Component */}
      <MealPlanSection
        mealPlan={mealPlan}
        loading={loadingMealPlan}
        onGenerate={handleGeneratePlan}
      />

      {/* Health Disclaimer */}
      <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start space-x-3 text-xs text-amber-200 leading-relaxed">
        <ShieldAlert className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5" />
        <p>{data.disclaimer}</p>
      </div>

      {/* Indian Food Database Modal */}
      <FoodDatabaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        foods={foodDatabase}
      />
    </div>
  );
};
