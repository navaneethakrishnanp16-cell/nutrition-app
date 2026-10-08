import React, { useState } from 'react';
import type { FoodItem } from '../types/nutrition';
import { X, Search, Utensils, Flame, Sparkles } from 'lucide-react';

interface FoodDatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  foods: FoodItem[];
}

export const FoodDatabaseModal: React.FC<FoodDatabaseModalProps> = ({
  isOpen,
  onClose,
  foods,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  if (!isOpen) return null;

  const filteredFoods = foods.filter((food) => {
    const matchesCategory =
      activeCategory === 'all' || food.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch =
      food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.servingSize.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-extrabold text-white">Indian Food Database</h3>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Curated Nutrients</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Prioritized Indian food choices with high protein & balanced macronutrients.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters & Search */}
        <div className="p-4 sm:p-6 border-b border-slate-800/80 bg-slate-900/50 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search Indian foods (e.g. Paneer, Chicken, Dal, Roti, Oats)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Foods' },
              { id: 'protein', label: 'High Protein' },
              { id: 'carbohydrate', label: 'Carbohydrates' },
              { id: 'fat', label: 'Healthy Fats' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Food List */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredFoods.length > 0 ? (
            filteredFoods.map((food) => (
              <div
                key={food.id || food.name}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="font-bold text-slate-100 text-base">{food.name}</h4>
                    <span
                      className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded ${
                        food.category === 'protein'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : food.category === 'carbohydrate'
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {food.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">Serving: {food.servingSize}</p>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center pt-2 border-t border-slate-800/80">
                  <div className="bg-slate-900 p-2 rounded-lg">
                    <span className="block text-[10px] text-slate-500 uppercase font-semibold">
                      Calories
                    </span>
                    <span className="text-xs font-bold text-white flex items-center justify-center space-x-0.5">
                      <Flame className="w-3 h-3 text-amber-400 inline" />
                      <span>{food.calories}</span>
                    </span>
                  </div>

                  <div className="bg-slate-900 p-2 rounded-lg">
                    <span className="block text-[10px] text-slate-500 uppercase font-semibold">
                      Protein
                    </span>
                    <span className="text-xs font-bold text-emerald-400">
                      {food.proteinGrams}g
                    </span>
                  </div>

                  <div className="bg-slate-900 p-2 rounded-lg">
                    <span className="block text-[10px] text-slate-500 uppercase font-semibold">
                      Carbs
                    </span>
                    <span className="text-xs font-bold text-cyan-400">
                      {food.carbsGrams}g
                    </span>
                  </div>

                  <div className="bg-slate-900 p-2 rounded-lg">
                    <span className="block text-[10px] text-slate-500 uppercase font-semibold">
                      Fat
                    </span>
                    <span className="text-xs font-bold text-amber-400">
                      {food.fatGrams}g
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-slate-500 text-sm">
              No matching Indian foods found. Try adjusting your search keyword.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
