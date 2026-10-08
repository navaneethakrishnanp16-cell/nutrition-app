import type {
  NutritionRequest,
  NutritionResponse,
  ActivityLevel,
  FitnessGoal,
  Micronutrients,
} from '../types/nutrition';

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

export function calculateNutritionClient(request: NutritionRequest): NutritionResponse {
  const { weight, activity, height, age, gender, goal = 'maintain' } = request;

  if (!weight || weight < 20 || weight > 300) {
    throw new Error('Please enter a valid weight between 20 kg and 300 kg.');
  }
  if (!activity || !ACTIVITY_MULTIPLIERS[activity]) {
    throw new Error('Please select a valid activity level.');
  }

  // Calculate BMR using Mifflin-St Jeor
  let bmr = Math.round(22 * weight);
  if (height && age && gender) {
    const isMale = gender.toLowerCase() === 'male';
    const isFemale = gender.toLowerCase() === 'female';
    if (isMale) {
      bmr = Math.round(10 * weight + 6.25 * height - 5 * age + 5);
    } else if (isFemale) {
      bmr = Math.round(10 * weight + 6.25 * height - 5 * age - 161);
    } else {
      bmr = Math.round(10 * weight + 6.25 * height - 5 * age - 78);
    }
  }

  // Calculate TDEE
  const multiplier = ACTIVITY_MULTIPLIERS[activity] || 1.2;
  const tdee = Math.round(bmr * multiplier);

  // Adjust calories for goal
  let targetCalories = tdee;
  if (goal === 'weight_loss') targetCalories = Math.round(tdee - 400);
  else if (goal === 'weight_gain') targetCalories = Math.round(tdee + 350);
  else if (goal === 'muscle_gain') targetCalories = Math.round(tdee + 250);
  else if (goal === 'athletic') targetCalories = Math.round(tdee + 200);

  // Calculate Protein
  let proteinMultiplier = PROTEIN_PER_KG[activity].default;
  if (goal === 'muscle_gain' || (goal === 'weight_loss' && ['gym', 'bodybuilding'].includes(activity))) {
    proteinMultiplier = Math.min(2.2, proteinMultiplier + 0.2);
  }
  const proteinGrams = Math.round(weight * proteinMultiplier);
  const proteinCalories = proteinGrams * 4;
  const proteinPerKg = Math.round((proteinGrams / weight) * 100) / 100;

  // Calculate Fat (25% calories)
  const fatCaloriesTarget = targetCalories * 0.25;
  const fatGrams = Math.round(fatCaloriesTarget / 9);
  const fatCalories = fatGrams * 9;
  const fatPerKg = Math.round((fatGrams / weight) * 100) / 100;

  // Calculate Carbohydrates
  const carbCaloriesTarget = targetCalories - proteinCalories - fatCalories;
  const carbGrams = Math.max(50, Math.round(carbCaloriesTarget / 4));
  const carbCalories = carbGrams * 4;
  const carbPerKg = Math.round((carbGrams / weight) * 100) / 100;

  const totalMacroCalories = proteinCalories + fatCalories + carbCalories;

  const fiberGrams = Math.round((targetCalories / 1000) * 14);
  const waterLiters = Math.round(weight * 0.04 * 10) / 10;

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
    inputs: { weight, activity, height, age, gender, goal },
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
      range: `${Math.max(25, fiberGrams - 3)}–${fiberGrams + 5} g/day`,
    },
    water: {
      liters: waterLiters,
      range: `${Math.round((waterLiters - 0.3) * 10) / 10}–${Math.round((waterLiters + 0.5) * 10) / 10} L/day`,
    },
    micronutrients,
    disclaimer:
      'These calculations provide general nutritional estimates for healthy adults and are not medical advice. Individual requirements vary based on health conditions, medications, training load and other factors. Consult a qualified healthcare professional or registered dietitian for personalized advice.',
  };
}
