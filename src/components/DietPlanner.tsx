import React, { useState } from 'react';
import { Apple, Calculator, Target, TrendingUp, Clock, User } from 'lucide-react';
import { DietPlan, MealItem } from '../types';

interface DietPlannerProps {
  onPlanGenerated: (plan: DietPlan) => void;
}

const DietPlanner: React.FC<DietPlannerProps> = ({ onPlanGenerated }) => {
  const [formData, setFormData] = useState({
    age: '',
    gender: 'Male' as 'Male' | 'Female',
    dietaryPreference: 'Vegetarian' as 'Vegetarian' | 'Non-Vegetarian',
    weight: '',
    height: '',
    workoutDuration: '',
    bodyGoal: 'Maintain Weight' as 'Gain Weight' | 'Lose Weight' | 'Maintain Weight'
  });

  const [generatedPlan, setGeneratedPlan] = useState<DietPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const calculateBMR = (weight: number, height: number, age: number, gender: string) => {
    if (gender === 'Male') {
      return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
  };

  const generateMealPlan = (calories: number, dietaryPreference: string): DietPlan['meals'] => {
    const vegBreakfast: MealItem[] = [
      { name: 'Oatmeal with fruits', quantity: '1 bowl', calories: 250 },
      { name: 'Greek yogurt', quantity: '1 cup', calories: 130 },
      { name: 'Almonds', quantity: '10 pieces', calories: 70 }
    ];

    const nonVegBreakfast: MealItem[] = [
      { name: 'Scrambled eggs', quantity: '2 eggs', calories: 180 },
      { name: 'Whole wheat toast', quantity: '2 slices', calories: 160 },
      { name: 'Avocado', quantity: '1/2 medium', calories: 120 }
    ];

    const vegLunch: MealItem[] = [
      { name: 'Brown rice', quantity: '1 cup', calories: 220 },
      { name: 'Dal (lentils)', quantity: '1 cup', calories: 180 },
      { name: 'Mixed vegetables', quantity: '1 cup', calories: 80 },
      { name: 'Chapati', quantity: '2 pieces', calories: 140 }
    ];

    const nonVegLunch: MealItem[] = [
      { name: 'Grilled chicken breast', quantity: '150g', calories: 250 },
      { name: 'Quinoa', quantity: '1 cup', calories: 220 },
      { name: 'Steamed broccoli', quantity: '1 cup', calories: 55 },
      { name: 'Sweet potato', quantity: '1 medium', calories: 100 }
    ];

    const vegSnacks: MealItem[] = [
      { name: 'Apple with peanut butter', quantity: '1 apple + 1 tbsp', calories: 190 },
      { name: 'Green tea', quantity: '1 cup', calories: 2 }
    ];

    const nonVegSnacks: MealItem[] = [
      { name: 'Protein shake', quantity: '1 scoop', calories: 120 },
      { name: 'Banana', quantity: '1 medium', calories: 105 }
    ];

    const vegDinner: MealItem[] = [
      { name: 'Grilled paneer', quantity: '100g', calories: 265 },
      { name: 'Mixed salad', quantity: '1 large bowl', calories: 50 },
      { name: 'Whole wheat roti', quantity: '2 pieces', calories: 140 }
    ];

    const nonVegDinner: MealItem[] = [
      { name: 'Grilled salmon', quantity: '150g', calories: 280 },
      { name: 'Steamed vegetables', quantity: '1 cup', calories: 60 },
      { name: 'Brown rice', quantity: '1/2 cup', calories: 110 }
    ];

    return {
      breakfast: dietaryPreference === 'Vegetarian' ? vegBreakfast : nonVegBreakfast,
      lunch: dietaryPreference === 'Vegetarian' ? vegLunch : nonVegLunch,
      snacks: dietaryPreference === 'Vegetarian' ? vegSnacks : nonVegSnacks,
      dinner: dietaryPreference === 'Vegetarian' ? vegDinner : nonVegDinner
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const age = parseInt(formData.age);
    const workoutDuration = parseFloat(formData.workoutDuration);

    const bmr = calculateBMR(weight, height, age, formData.gender);
    const activityMultiplier = 1.2 + (workoutDuration * 0.2);
    let dailyCalories = bmr * activityMultiplier;

    // Adjust based on body goal
    if (formData.bodyGoal === 'Lose Weight') {
      dailyCalories -= 500;
    } else if (formData.bodyGoal === 'Gain Weight') {
      dailyCalories += 500;
    }

    const meals = generateMealPlan(dailyCalories, formData.dietaryPreference);

    const plan: DietPlan = {
      id: Date.now().toString(),
      memberId: 'current-user',
      age,
      gender: formData.gender,
      dietaryPreference: formData.dietaryPreference,
      weight,
      height,
      workoutDuration,
      bodyGoal: formData.bodyGoal,
      dailyCalories: Math.round(dailyCalories),
      macros: {
        carbs: Math.round(dailyCalories * 0.45 / 4),
        proteins: Math.round(dailyCalories * 0.25 / 4),
        fats: Math.round(dailyCalories * 0.30 / 9)
      },
      meals,
      createdAt: new Date().toISOString()
    };

    setGeneratedPlan(plan);
    setIsGenerating(false);
    onPlanGenerated(plan);
  };

  const getTotalMealCalories = (meal: MealItem[]) => {
    return meal.reduce((total, item) => total + item.calories, 0);
  };

  const getTotalDayCalories = (meals: DietPlan['meals']) => {
    return getTotalMealCalories(meals.breakfast) + 
           getTotalMealCalories(meals.lunch) + 
           getTotalMealCalories(meals.snacks) + 
           getTotalMealCalories(meals.dinner);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Personalized Diet Planner</h2>
        <p className="text-gray-600">Get an AI-generated diet chart tailored to your goals</p>
      </div>

      {!generatedPlan ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  required
                  min="16"
                  max="80"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Male' | 'Female' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                <input
                  type="number"
                  required
                  min="30"
                  max="200"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                <input
                  type="number"
                  required
                  min="120"
                  max="220"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Daily Workout Duration (hours)</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="5"
                  step="0.5"
                  value={formData.workoutDuration}
                  onChange={(e) => setFormData({ ...formData, workoutDuration: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Preference</label>
                <select
                  value={formData.dietaryPreference}
                  onChange={(e) => setFormData({ ...formData, dietaryPreference: e.target.value as 'Vegetarian' | 'Non-Vegetarian' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Body Goal</label>
                <select
                  value={formData.bodyGoal}
                  onChange={(e) => setFormData({ ...formData, bodyGoal: e.target.value as 'Gain Weight' | 'Lose Weight' | 'Maintain Weight' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Lose Weight">Lose Weight</option>
                  <option value="Maintain Weight">Maintain Weight</option>
                  <option value="Gain Weight">Gain Weight</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Generating Your Diet Plan...</span>
                </>
              ) : (
                <>
                  <Apple className="h-5 w-5" />
                  <span>Generate Diet Plan</span>
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Plan Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Your Personalized Diet Plan</h3>
              <button
                onClick={() => setGeneratedPlan(null)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Generate New Plan
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">Daily Calories</span>
                </div>
                <p className="text-2xl font-bold text-blue-900">{generatedPlan.dailyCalories}</p>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Carbs</span>
                </div>
                <p className="text-2xl font-bold text-green-900">{generatedPlan.macros.carbs}g</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">Proteins</span>
                </div>
                <p className="text-2xl font-bold text-purple-900">{generatedPlan.macros.proteins}g</p>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Calculator className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-700">Fats</span>
                </div>
                <p className="text-2xl font-bold text-orange-900">{generatedPlan.macros.fats}g</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Recommendations for {generatedPlan.bodyGoal}</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                {generatedPlan.bodyGoal === 'Lose Weight' && (
                  <>
                    <li>• Focus on high-protein, low-calorie foods</li>
                    <li>• Include cardio exercises 4-5 times per week</li>
                    <li>• Stay hydrated with 8-10 glasses of water daily</li>
                  </>
                )}
                {generatedPlan.bodyGoal === 'Gain Weight' && (
                  <>
                    <li>• Eat frequent, nutrient-dense meals</li>
                    <li>• Focus on strength training exercises</li>
                    <li>• Include healthy fats and complex carbohydrates</li>
                  </>
                )}
                {generatedPlan.bodyGoal === 'Maintain Weight' && (
                  <>
                    <li>• Balance your macronutrients evenly</li>
                    <li>• Maintain consistent workout routine</li>
                    <li>• Monitor portion sizes regularly</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Meal Plan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(generatedPlan.meals).map(([mealType, items]) => (
              <div key={mealType} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 capitalize">{mealType}</h4>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                    {getTotalMealCalories(items)} cal
                  </span>
                </div>
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.quantity}</p>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{item.calories} cal</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DietPlanner;