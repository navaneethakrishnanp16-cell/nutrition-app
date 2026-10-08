export type ActivityLevel =
  | 'normal'
  | 'walking'
  | 'gym'
  | 'bodybuilding'
  | 'running'
  | 'endurance'
  | 'sports'
  | 'highly_active';

export type FitnessGoal =
  | 'maintain'
  | 'weight_loss'
  | 'weight_gain'
  | 'muscle_gain'
  | 'athletic';

export type Gender = 'male' | 'female' | 'other';

export interface NutritionRequest {
  weight: number;
  activity: ActivityLevel;
  height?: number;
  age?: number;
  gender?: Gender;
  goal?: FitnessGoal;
}

export interface MacroDetail {
  grams: number;
  perKg: number;
  calories: number;
  percentage: number;
}

export interface Micronutrients {
  calciumMg: number;
  ironMg: number;
  magnesiumMg: number;
  potassiumMg: number;
  sodiumMg: number;
  vitaminDIu: number;
  vitaminCMg: number;
  vitaminB12Mcg: number;
  folateMcg: number;
  zincMg: number;
}

export interface NutritionResponse {
  inputs: NutritionRequest;
  bmr: number;
  tdee: number;
  calories: number;
  protein: MacroDetail;
  carbohydrates: MacroDetail;
  fat: MacroDetail;
  fiber: {
    grams: number;
    range: string;
  };
  water: {
    liters: number;
    range: string;
  };
  micronutrients: Micronutrients;
  disclaimer: string;
}

export interface FoodItem {
  id: number;
  name: string;
  category: 'protein' | 'carbohydrate' | 'fat' | 'balanced';
  servingSize: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams?: number;
  isIndian: boolean;
}

export interface MealItem {
  food: FoodItem;
  portionGrams: number;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
}

export interface Meal {
  name: string;
  items: MealItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface SampleMealPlan {
  goal: FitnessGoal;
  targetCalories: number;
  meals: {
    breakfast: Meal;
    lunch: Meal;
    snack: Meal;
    dinner: Meal;
  };
  summary: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}
