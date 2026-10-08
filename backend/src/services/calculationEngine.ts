import {
  NutritionRequest,
  NutritionResponse,
  ActivityLevel,
  FitnessGoal,
  Micronutrients,
} from '../models/nutrition.js';

// Activity Multipliers for TDEE calculation
const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  normal: 1.2,
  walking: 1.375,
  gym: 1.55,
  bodybuilding: 1.7,
  running: 1.6,
  endurance: 1.75,
  sports: 1.65,
  highly_active: 1.9,
};

// Activity-based Protein Multipliers (grams per kg of body weight)
const PROTEIN_PER_KG: Record<ActivityLevel, { default: number; min: number; max: number }> = {
  normal: { default: 0.9, min: 0.8, max: 1.0 },
  walking: { default: 1.1, min: 1.0, max: 1.2 },
  gym: { default: 1.8, min: 1.6, max: 2.0 },
  bodybuilding: { default: 2.0, min: 1.8, max: 2.2 },
  running: { default: 1.4, min: 1.2, max: 1.6 },
  endurance: { default: 1.5, min: 1.2, max: 1.7 },
  sports: { default: 1.6, min: 1.4, max: 1.8 },
  highly_active: { default: 1.9, min: 1.6, max: 2.2 },
};

/**
  Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor equation.
  If age, height, or gender are not provided, fall back to body-mass estimation formula.
 */
export function calculateBMR(
  weightKg: number,
  heightCm?: number,
  ageYears?: number,
  gender?: string
): number {
  if (heightCm && ageYears && gender) {
    const isMale = gender.toLowerCase() === 'male';
    const isFemale = gender.toLowerCase() === 'female';

    if (isMale) {
      return 10 * weightKg + 6.25 * heightCm - 5 * ageYears + 5;
    } else if (isFemale) {
      return 10 * weightKg + 6.25 * heightCm - 5 * ageYears - 161;
    } else {
      // Neutral estimate for 'other' or unspecified gender
      return 10 * weightKg + 6.25 * heightCm - 5 * ageYears - 78;
    }
  }

  // Fallback BMR estimation when optional fields (age/height/gender) are missing
  return Math.round(22 * weightKg);
}

/**
  Calculate Total Daily Energy Expenditure (TDEE).
 */
export function calculateTDEE(bmr: number, activity: ActivityLevel): number {
  const multiplier = ACTIVITY_MULTIPLIERS[activity] || 1.2;
  return Math.round(bmr * multiplier);
}

/**
  Adjust target calories based on user fitness goal.
 */
export function adjustCaloriesForGoal(tdee: number, goal: FitnessGoal = 'maintain'): number {
  switch (goal) {
    case 'weight_loss':
      return Math.round(tdee - 400); // 300-500 kcal deficit
    case 'weight_gain':
      return Math.round(tdee + 350); // 200-400 kcal surplus
    case 'muscle_gain':
      return Math.round(tdee + 250); // 200-300 kcal lean surplus
    case 'athletic':
      return Math.round(tdee + 200); // Performance surplus
    case 'maintain':
    default:
      return tdee;
  }
}

/**
  Main Nutrition Calculation Service
 */
export function calculateNutrition(request: NutritionRequest): NutritionResponse {
  const { weight, activity, height, age, gender, goal = 'maintain' } = request;

  // Validate inputs
  if (!weight || weight < 20 || weight > 300) {
    throw new Error('Please enter a valid weight between 20 kg and 300 kg.');
  }
  if (!activity || !ACTIVITY_MULTIPLIERS[activity]) {
    throw new Error('Please select a valid activity level.');
  }

  // 1. Calculate BMR & TDEE
  const bmr = Math.round(calculateBMR(weight, height, age, gender));
  const tdee = calculateTDEE(bmr, activity);
  const targetCalories = adjustCaloriesForGoal(tdee, goal);

  // 2. Calculate Protein
  let proteinMultiplier = PROTEIN_PER_KG[activity].default;
  if (goal === 'muscle_gain' || (goal === 'weight_loss' && ['gym', 'bodybuilding'].includes(activity))) {
    proteinMultiplier = Math.min(2.2, proteinMultiplier + 0.2);
  }
  const proteinGrams = Math.round(weight * proteinMultiplier);
  const proteinCalories = proteinGrams * 4;
  const proteinPerKg = Math.round((proteinGrams / weight) * 100) / 100;

  // 3. Calculate Fat (25% of target calories or ~0.9-1.0 g/kg minimum)
  const fatCaloriesTarget = targetCalories * 0.25;
  const fatGrams = Math.round(fatCaloriesTarget / 9);
  const fatCalories = fatGrams * 9;
  const fatPerKg = Math.round((fatGrams / weight) * 100) / 100;

  // 4. Calculate Carbohydrates (Remaining calories)
  const carbCaloriesTarget = targetCalories - proteinCalories - fatCalories;
  const carbGrams = Math.max(50, Math.round(carbCaloriesTarget / 4));
  const carbCalories = carbGrams * 4;
  const carbPerKg = Math.round((carbGrams / weight) * 100) / 100;

  // Calculate actual total calories from computed macros for accuracy
  const totalMacroCalories = proteinCalories + fatCalories + carbCalories;

  // 5. Calculate Fiber & Water recommendations
  const fiberGrams = Math.round((targetCalories / 1000) * 14);
  const minFiber = Math.max(25, fiberGrams - 3);
  const maxFiber = fiberGrams + 5;

  const waterLiters = Math.round(weight * 0.04 * 10) / 10;
  const minWater = Math.round((waterLiters - 0.3) * 10) / 10;
  const maxWater = Math.round((waterLiters + 0.5) * 10) / 10;

  // 6. Calculate Micronutrient baseline values
  const micronutrients: Micronutrients = {
    calciumMg: 1000,
    ironMg: gender === 'female' ? 18 : 10,
    magnesiumMg: gender === 'female' ? 320 : 420,
    potassiumMg: 3400,
    sodiumMg: 2000,
    vitaminDIu: 600,
    vitaminCMg: 90,
    vitaminB12Mcg: 2.4,
    folateMcg: 400,
    zincMg: gender === 'female' ? 8 : 11,
  };

  return {
    inputs: {
      weight,
      activity,
      height,
      age,
      gender,
      goal,
    },
    bmr,
    tdee,
    calories: totalMacroCalories,
    protein: {
      grams: proteinGrams,
      perKg: proteinPerKg,
      calories: proteinCalories,
      percentage: Math.round((proteinCalories / totalMacroCalories) * 100),
    },
    carbohydrates: {
      grams: carbGrams,
      perKg: carbPerKg,
      calories: carbCalories,
      percentage: Math.round((carbCalories / totalMacroCalories) * 100),
    },
    fat: {
      grams: fatGrams,
      perKg: fatPerKg,
      calories: fatCalories,
      percentage: Math.round((fatCalories / totalMacroCalories) * 100),
    },
    fiber: {
      grams: fiberGrams,
      range: `${minFiber}–${maxFiber} g/day`,
    },
    water: {
      liters: waterLiters,
      range: `${minWater}–${maxWater} L/day`,
    },
    micronutrients,
    disclaimer:
      'These calculations provide general nutritional estimates for healthy adults and are not medical advice. Individual requirements vary based on health conditions, medications, training load and other factors. Consult a qualified healthcare professional or registered dietitian for personalized advice.',
  };
}
