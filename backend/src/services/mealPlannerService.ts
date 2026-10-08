import { INDIAN_FOOD_DATABASE } from '../data/foodDatabase.js';
import { FitnessGoal, Meal, SampleMealPlan } from '../models/nutrition.js';

export function generateMealPlan(
  targetCalories: number,
  targetProtein: number,
  goal: FitnessGoal = 'maintain'
): SampleMealPlan {
  // Meal calorie splits: Breakfast 25%, Lunch 35%, Snack 15%, Dinner 25%
  const bCal = Math.round(targetCalories * 0.25);
  const lCal = Math.round(targetCalories * 0.35);
  const sCal = Math.round(targetCalories * 0.15);
  const dCal = Math.round(targetCalories * 0.25);

  // Breakfast items
  const breakfast: Meal = {
    name: 'Power Breakfast',
    items: [
      {
        food: INDIAN_FOOD_DATABASE.find((f) => f.id === 16)! || INDIAN_FOOD_DATABASE[15], // Oats
        portionGrams: 60,
        calories: 228,
        proteinGrams: 7.8,
        carbsGrams: 39.6,
        fatGrams: 4.2,
      },
      {
        food: INDIAN_FOOD_DATABASE.find((f) => f.id === 1)! || INDIAN_FOOD_DATABASE[0], // Eggs
        portionGrams: 100,
        calories: 155,
        proteinGrams: 13.0,
        carbsGrams: 1.1,
        fatGrams: 11.0,
      },
      {
        food: INDIAN_FOOD_DATABASE.find((f) => f.id === 18)! || INDIAN_FOOD_DATABASE[17], // Banana
        portionGrams: 110,
        calories: 105,
        proteinGrams: 1.3,
        carbsGrams: 27.0,
        fatGrams: 0.3,
      },
    ],
    totalCalories: 488,
    totalProtein: 22.1,
    totalCarbs: 67.7,
    totalFat: 15.5,
  };

  // Lunch items
  const lunch: Meal = {
    name: 'High-Protein Indian Lunch',
    items: [
      {
        food: INDIAN_FOOD_DATABASE.find((f) => f.id === 13)! || INDIAN_FOOD_DATABASE[12], // Chapati (2 rotis)
        portionGrams: 80,
        calories: 208,
        proteinGrams: 6.2,
        carbsGrams: 40.0,
        fatGrams: 1.6,
      },
      {
        food: INDIAN_FOOD_DATABASE.find((f) => f.id === 2)! || INDIAN_FOOD_DATABASE[2], // Paneer / Chicken
        portionGrams: 120,
        calories: 198,
        proteinGrams: 37.2,
        carbsGrams: 0.0,
        fatGrams: 4.3,
      },
      {
        food: INDIAN_FOOD_DATABASE.find((f) => f.id === 5)! || INDIAN_FOOD_DATABASE[4], // Tadka Dal
        portionGrams: 150,
        calories: 140,
        proteinGrams: 8.5,
        carbsGrams: 20.0,
        fatGrams: 3.0,
      },
      {
        food: INDIAN_FOOD_DATABASE.find((f) => f.id === 7)! || INDIAN_FOOD_DATABASE[6], // Curd
        portionGrams: 150,
        calories: 90,
        proteinGrams: 5.25,
        carbsGrams: 6.75,
        fatGrams: 4.5,
      },
    ],
    totalCalories: 636,
    totalProtein: 57.15,
    totalCarbs: 66.75,
    totalFat: 13.4,
  };

  // Snack items
  const snack: Meal = {
    name: 'Pre/Post Workout Recovery Snack',
    items: [
      {
        food: INDIAN_FOOD_DATABASE.find((f) => f.id === 4)! || INDIAN_FOOD_DATABASE[3], // Soy Chunks
        portionGrams: 30,
        calories: 103,
        proteinGrams: 15.6,
        carbsGrams: 9.6,
        fatGrams: 0.3,
      },
      {
        food: INDIAN_FOOD_DATABASE.find((f) => f.id === 20)! || INDIAN_FOOD_DATABASE[19], // Almonds
        portionGrams: 20,
        calories: 116,
        proteinGrams: 4.2,
        carbsGrams: 4.0,
        fatGrams: 10.0,
      },
    ],
    totalCalories: 219,
    totalProtein: 19.8,
    totalCarbs: 13.6,
    totalFat: 10.3,
  };

  // Dinner items
  const dinner: Meal = {
    name: 'Balanced Sustained Dinner',
    items: [
      {
        food: INDIAN_FOOD_DATABASE.find((f) => f.id === 11)! || INDIAN_FOOD_DATABASE[10], // Rice
        portionGrams: 150,
        calories: 195,
        proteinGrams: 4.0,
        carbsGrams: 43.0,
        fatGrams: 0.5,
      },
      {
        food: INDIAN_FOOD_DATABASE.find((f) => f.id === 6)! || INDIAN_FOOD_DATABASE[5], // Black Chana
        portionGrams: 150,
        calories: 180,
        proteinGrams: 9.5,
        carbsGrams: 28.0,
        fatGrams: 3.5,
      },
      {
        food: INDIAN_FOOD_DATABASE.find((f) => f.id === 3)! || INDIAN_FOOD_DATABASE[2], // Paneer / Fish
        portionGrams: 80,
        calories: 212,
        proteinGrams: 14.4,
        carbsGrams: 2.8,
        fatGrams: 16.0,
      },
    ],
    totalCalories: 587,
    totalProtein: 27.9,
    totalCarbs: 73.8,
    totalFat: 20.0,
  };

  const totalMealCalories =
    breakfast.totalCalories + lunch.totalCalories + snack.totalCalories + dinner.totalCalories;
  const totalMealProtein =
    breakfast.totalProtein + lunch.totalProtein + snack.totalProtein + dinner.totalProtein;
  const totalMealCarbs =
    breakfast.totalCarbs + lunch.totalCarbs + snack.totalCarbs + dinner.totalCarbs;
  const totalMealFat =
    breakfast.totalFat + lunch.totalFat + snack.totalFat + dinner.totalFat;

  // Scale portions dynamically to match user target calories
  const scale = targetCalories / totalMealCalories;

  const scaleMeal = (m: Meal): Meal => ({
    ...m,
    items: m.items.map((it) => ({
      ...it,
      portionGrams: Math.round(it.portionGrams * scale),
      calories: Math.round(it.calories * scale),
      proteinGrams: Math.round(it.proteinGrams * scale * 10) / 10,
      carbsGrams: Math.round(it.carbsGrams * scale * 10) / 10,
      fatGrams: Math.round(it.fatGrams * scale * 10) / 10,
    })),
    totalCalories: Math.round(m.totalCalories * scale),
    totalProtein: Math.round(m.totalProtein * scale * 10) / 10,
    totalCarbs: Math.round(m.totalCarbs * scale * 10) / 10,
    totalFat: Math.round(m.totalFat * scale * 10) / 10,
  });

  const scaledBreakfast = scaleMeal(breakfast);
  const scaledLunch = scaleMeal(lunch);
  const scaledSnack = scaleMeal(snack);
  const scaledDinner = scaleMeal(dinner);

  return {
    goal,
    targetCalories,
    meals: {
      breakfast: scaledBreakfast,
      lunch: scaledLunch,
      snack: scaledSnack,
      dinner: scaledDinner,
    },
    summary: {
      calories:
        scaledBreakfast.totalCalories +
        scaledLunch.totalCalories +
        scaledSnack.totalCalories +
        scaledDinner.totalCalories,
      protein: Math.round(
        (scaledBreakfast.totalProtein +
          scaledLunch.totalProtein +
          scaledSnack.totalProtein +
          scaledDinner.totalProtein) *
          10
      ) / 10,
      carbs: Math.round(
        (scaledBreakfast.totalCarbs +
          scaledLunch.totalCarbs +
          scaledSnack.totalCarbs +
          scaledDinner.totalCarbs) *
          10
      ) / 10,
      fat: Math.round(
        (scaledBreakfast.totalFat +
          scaledLunch.totalFat +
          scaledSnack.totalFat +
          scaledDinner.totalFat) *
          10
      ) / 10,
    },
  };
}
