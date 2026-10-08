import { Request, Response } from 'express';
import { calculateNutrition } from '../services/calculationEngine.js';
import { generateMealPlan } from '../services/mealPlannerService.js';
import { INDIAN_FOOD_DATABASE } from '../data/foodDatabase.js';
import { checkDatabaseConnection, pool } from '../database/db.js';

export async function handleCalculateNutrition(req: Request, res: Response): Promise<void> {
  try {
    const { weight, height, age, gender, activity, goal } = req.body;

    if (!weight || typeof weight !== 'number') {
      res.status(400).json({
        error: 'Please enter a valid weight between 20 kg and 300 kg.',
      });
      return;
    }

    if (!activity) {
      res.status(400).json({
        error: 'Please select your activity level.',
      });
      return;
    }

    const result = calculateNutrition({
      weight,
      height: height ? Number(height) : undefined,
      age: age ? Number(age) : undefined,
      gender,
      activity,
      goal: goal || 'maintain',
    });

    // Optionally save to PostgreSQL if DB is available
    const dbAvailable = await checkDatabaseConnection();
    if (dbAvailable) {
      try {
        await pool.query(
          `INSERT INTO nutrition_calculations (weight, height, age, gender, activity_level, fitness_goal, calories, protein_g, carbs_g, fat_g)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            weight,
            height || null,
            age || null,
            gender || null,
            activity,
            goal || 'maintain',
            result.calories,
            result.protein.grams,
            result.carbohydrates.grams,
            result.fat.grams,
          ]
        );
      } catch (dbErr: any) {
        console.warn('DB Log skip:', dbErr.message);
      }
    }

    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({
      error: err.message || 'An unexpected error occurred during calculation.',
    });
  }
}

export async function handleGetFoods(req: Request, res: Response): Promise<void> {
  try {
    const { category } = req.query;
    let foods = INDIAN_FOOD_DATABASE;

    if (category && typeof category === 'string') {
      foods = foods.filter((f) => f.category.toLowerCase() === category.toLowerCase());
    }

    res.status(200).json({
      count: foods.length,
      foods,
    });
  } catch (err: any) {
    res.status(500).json({
      error: 'Unable to retrieve food database.',
    });
  }
}

export async function handleGenerateMealPlan(req: Request, res: Response): Promise<void> {
  try {
    const { calories, protein, goal } = req.body;

    const targetCalories = Number(calories) || 2200;
    const targetProtein = Number(protein) || 120;

    const mealPlan = generateMealPlan(targetCalories, targetProtein, goal);
    res.status(200).json(mealPlan);
  } catch (err: any) {
    res.status(400).json({
      error: 'Unable to generate sample meal plan.',
    });
  }
}

export async function handleHealthCheck(req: Request, res: Response): Promise<void> {
  const dbConnected = await checkDatabaseConnection();
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'nutrition-app-backend',
    database: dbConnected ? 'connected' : 'fallback-mode',
  });
}
