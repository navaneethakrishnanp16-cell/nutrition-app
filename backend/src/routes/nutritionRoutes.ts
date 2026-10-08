import { Router } from 'express';
import {
  handleCalculateNutrition,
  handleGetFoods,
  handleGenerateMealPlan,
  handleHealthCheck,
} from '../controllers/nutritionController.js';

const router = Router();

router.get('/health', handleHealthCheck);
router.post('/nutrition/calculate', handleCalculateNutrition);
router.get('/foods', handleGetFoods);
router.post('/meal-plan/generate', handleGenerateMealPlan);

export default router;
