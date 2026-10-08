import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StepIndicator } from './components/StepIndicator';
import { BodyInfoStep } from './components/BodyInfoStep';
import { ActivityStep } from './components/ActivityStep';
import { GoalStep } from './components/GoalStep';
import { ResultsDashboard } from './components/ResultsDashboard';
import type {
  ActivityLevel,
  FitnessGoal,
  Gender,
  NutritionResponse,
  FoodItem,
} from './types/nutrition';
import { fetchNutritionCalculation, fetchFoodDatabase } from './services/api';

export function App() {
  const [step, setStep] = useState<number>(1);
  const [weight, setWeight] = useState<number | ''>(70);
  const [height, setHeight] = useState<number | ''>(175);
  const [age, setAge] = useState<number | ''>(25);
  const [gender, setGender] = useState<Gender | ''>('male');
  const [activity, setActivity] = useState<ActivityLevel>('gym');
  const [goal, setGoal] = useState<FitnessGoal>('muscle_gain');

  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<NutritionResponse | null>(null);
  const [foodDatabase, setFoodDatabase] = useState<FoodItem[]>([]);

  useEffect(() => {
    // Load food database
    fetchFoodDatabase().then((foods) => {
      if (foods && foods.length > 0) {
        setFoodDatabase(foods);
      }
    });
  }, []);

  const handleBodyInfoChange = (fields: {
    weight?: number | '';
    height?: number | '';
    age?: number | '';
    gender?: Gender | '';
  }) => {
    if (fields.weight !== undefined) setWeight(fields.weight);
    if (fields.height !== undefined) setHeight(fields.height);
    if (fields.age !== undefined) setAge(fields.age);
    if (fields.gender !== undefined) setGender(fields.gender);
    if (error) setError('');
  };

  const handleValidateStep1 = () => {
    if (weight === '' || weight < 20 || weight > 300) {
      setError('Please enter a valid weight between 20 kg and 300 kg.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleCalculate = async () => {
    if (weight === '' || weight < 20 || weight > 300) {
      setError('Please enter a valid weight between 20 kg and 300 kg.');
      setStep(1);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await fetchNutritionCalculation({
        weight: Number(weight),
        height: height ? Number(height) : undefined,
        age: age ? Number(age) : undefined,
        gender: gender || undefined,
        activity,
        goal,
      });

      setResults(data);
      setStep(4);
    } catch (err: any) {
      setError(err.message || 'Calculation error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setStep(1);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 font-sans flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
      <Header onReset={handleReset} />

      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <StepIndicator currentStep={step} onStepClick={(s) => setStep(s)} />

        {step === 1 && (
          <BodyInfoStep
            weight={weight}
            height={height}
            age={age}
            gender={gender}
            onChange={handleBodyInfoChange}
            onNext={handleValidateStep1}
            error={error}
          />
        )}

        {step === 2 && (
          <ActivityStep
            selectedActivity={activity}
            onSelect={(act) => setActivity(act)}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <GoalStep
            selectedGoal={goal}
            onSelect={(g) => setGoal(g)}
            onCalculate={handleCalculate}
            onBack={() => setStep(2)}
            loading={loading}
          />
        )}

        {step === 4 && results && (
          <ResultsDashboard
            data={results}
            foodDatabase={foodDatabase}
            onReset={handleReset}
          />
        )}
      </main>

      <footer className="border-t border-slate-800 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} NutriFit Engine. Science-Based Personalized Nutrition.</p>
          <div className="flex items-center space-x-4">
            <span className="hover:text-slate-400 cursor-pointer">Dockerized</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">REST API Ready</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Cloud Scalable</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
