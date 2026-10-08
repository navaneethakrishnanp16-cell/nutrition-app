import type {
  NutritionRequest,
  NutritionResponse,
  FoodItem,
  SampleMealPlan,
} from '../types/nutrition';
import { calculateNutritionClient } from '../utils/calculationEngine';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export async function fetchNutritionCalculation(
  request: NutritionRequest
): Promise<NutritionResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/nutrition/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Server calculation failed.');
    }

    return await res.json();
  } catch (err: any) {
    console.warn('API unavailable or error encountered, falling back to local engine:', err.message);
    return calculateNutritionClient(request);
  }
}

export async function fetchFoodDatabase(category?: string): Promise<FoodItem[]> {
  try {
    const url = category ? `${API_BASE_URL}/foods?category=${category}` : `${API_BASE_URL}/foods`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch food database');
    const data = await res.json();
    return data.foods;
  } catch (err) {
    console.warn('Food database API fallback activated.');
    return [];
  }
}

export async function fetchSampleMealPlan(
  calories: number,
  protein: number,
  goal: string
): Promise<SampleMealPlan | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/meal-plan/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ calories, protein, goal }),
    });
    if (!res.ok) throw new Error('Failed to fetch meal plan');
    return await res.json();
  } catch (err) {
    console.warn('Meal plan API fallback activated.');
    return null;
  }
}
