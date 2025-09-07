import React, { useState } from 'react';
import { Dumbbell, Calendar, Target, Clock, CheckCircle } from 'lucide-react';
import { WorkoutPlan, WorkoutDay, Exercise } from '../types';

interface WorkoutPlannerProps {
  onPlanGenerated: (plan: WorkoutPlan) => void;
}

const WorkoutPlanner: React.FC<WorkoutPlannerProps> = ({ onPlanGenerated }) => {
  const [formData, setFormData] = useState({
    fitnessGoal: 'General Fitness' as 'Muscle Gain' | 'Weight Loss' | 'Strength' | 'Endurance' | 'General Fitness',
    currentLevel: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    availableDays: 3,
    preferredWorkouts: [] as string[]
  });

  const [generatedPlan, setGeneratedPlan] = useState<WorkoutPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const workoutTypes = [
    'Strength Training',
    'Cardio',
    'HIIT',
    'Yoga',
    'Pilates',
    'Functional Training',
    'Bodyweight Exercises'
  ];

  const generateWorkoutPlan = (goal: string, level: string, days: number): { [key: string]: WorkoutDay } => {
    const plans = {
      'Muscle Gain': {
        3: {
          'Monday': {
            focus: 'Chest & Triceps',
            exercises: [
              { name: 'Bench Press', sets: 4, reps: '8-10' },
              { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12' },
              { name: 'Chest Flyes', sets: 3, reps: '12-15' },
              { name: 'Tricep Dips', sets: 3, reps: '10-12' },
              { name: 'Overhead Tricep Extension', sets: 3, reps: '12-15' }
            ],
            restTime: '60-90 seconds between sets'
          },
          'Wednesday': {
            focus: 'Back & Biceps',
            exercises: [
              { name: 'Pull-ups/Lat Pulldown', sets: 4, reps: '8-10' },
              { name: 'Barbell Rows', sets: 3, reps: '10-12' },
              { name: 'Seated Cable Rows', sets: 3, reps: '12-15' },
              { name: 'Barbell Curls', sets: 3, reps: '10-12' },
              { name: 'Hammer Curls', sets: 3, reps: '12-15' }
            ],
            restTime: '60-90 seconds between sets'
          },
          'Friday': {
            focus: 'Legs & Shoulders',
            exercises: [
              { name: 'Squats', sets: 4, reps: '8-10' },
              { name: 'Romanian Deadlifts', sets: 3, reps: '10-12' },
              { name: 'Leg Press', sets: 3, reps: '12-15' },
              { name: 'Shoulder Press', sets: 3, reps: '10-12' },
              { name: 'Lateral Raises', sets: 3, reps: '12-15' }
            ],
            restTime: '60-90 seconds between sets'
          }
        }
      },
      'Weight Loss': {
        3: {
          'Monday': {
            focus: 'Full Body HIIT',
            exercises: [
              { name: 'Burpees', sets: 4, reps: '30 seconds' },
              { name: 'Mountain Climbers', sets: 4, reps: '30 seconds' },
              { name: 'Jump Squats', sets: 4, reps: '30 seconds' },
              { name: 'Push-ups', sets: 4, reps: '30 seconds' },
              { name: 'High Knees', sets: 4, reps: '30 seconds' }
            ],
            restTime: '30 seconds between exercises, 2 minutes between sets'
          },
          'Wednesday': {
            focus: 'Cardio & Core',
            exercises: [
              { name: 'Treadmill/Running', sets: 1, reps: '20-30 minutes' },
              { name: 'Plank', sets: 3, reps: '30-60 seconds' },
              { name: 'Russian Twists', sets: 3, reps: '20 each side' },
              { name: 'Bicycle Crunches', sets: 3, reps: '20 each side' },
              { name: 'Dead Bug', sets: 3, reps: '10 each side' }
            ],
            restTime: '30-45 seconds between sets'
          },
          'Friday': {
            focus: 'Circuit Training',
            exercises: [
              { name: 'Kettlebell Swings', sets: 4, reps: '15-20' },
              { name: 'Box Jumps', sets: 4, reps: '10-12' },
              { name: 'Battle Ropes', sets: 4, reps: '30 seconds' },
              { name: 'Rowing Machine', sets: 4, reps: '1 minute' },
              { name: 'Wall Balls', sets: 4, reps: '15-20' }
            ],
            restTime: '45 seconds between exercises'
          }
        }
      },
      'General Fitness': {
        3: {
          'Monday': {
            focus: 'Upper Body',
            exercises: [
              { name: 'Push-ups', sets: 3, reps: '10-15' },
              { name: 'Dumbbell Rows', sets: 3, reps: '12-15' },
              { name: 'Shoulder Press', sets: 3, reps: '10-12' },
              { name: 'Bicep Curls', sets: 3, reps: '12-15' },
              { name: 'Tricep Extensions', sets: 3, reps: '12-15' }
            ],
            restTime: '45-60 seconds between sets'
          },
          'Wednesday': {
            focus: 'Lower Body',
            exercises: [
              { name: 'Bodyweight Squats', sets: 3, reps: '15-20' },
              { name: 'Lunges', sets: 3, reps: '12 each leg' },
              { name: 'Glute Bridges', sets: 3, reps: '15-20' },
              { name: 'Calf Raises', sets: 3, reps: '15-20' },
              { name: 'Wall Sit', sets: 3, reps: '30-45 seconds' }
            ],
            restTime: '45-60 seconds between sets'
          },
          'Friday': {
            focus: 'Full Body & Cardio',
            exercises: [
              { name: 'Jumping Jacks', sets: 3, reps: '30 seconds' },
              { name: 'Plank', sets: 3, reps: '30-45 seconds' },
              { name: 'Modified Burpees', sets: 3, reps: '8-10' },
              { name: 'Step-ups', sets: 3, reps: '12 each leg' },
              { name: 'Stretching', sets: 1, reps: '10 minutes' }
            ],
            restTime: '45-60 seconds between sets'
          }
        }
      }
    };

    return plans[goal as keyof typeof plans]?.[days as keyof typeof plans[typeof goal]] || plans['General Fitness'][3];
  };

  const handleWorkoutTypeChange = (type: string) => {
    setFormData(prev => ({
      ...prev,
      preferredWorkouts: prev.preferredWorkouts.includes(type)
        ? prev.preferredWorkouts.filter(t => t !== type)
        : [...prev.preferredWorkouts, type]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const weeklySchedule = generateWorkoutPlan(
      formData.fitnessGoal,
      formData.currentLevel,
      formData.availableDays
    );

    const plan: WorkoutPlan = {
      id: Date.now().toString(),
      memberId: 'current-user',
      fitnessGoal: formData.fitnessGoal,
      currentLevel: formData.currentLevel,
      availableDays: formData.availableDays,
      preferredWorkouts: formData.preferredWorkouts,
      weeklySchedule,
      createdAt: new Date().toISOString()
    };

    setGeneratedPlan(plan);
    setIsGenerating(false);
    onPlanGenerated(plan);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Personalized Workout Planner</h2>
        <p className="text-gray-600">Get a customized gym workout plan based on your goals</p>
      </div>

      {!generatedPlan ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fitness Goal</label>
                <select
                  value={formData.fitnessGoal}
                  onChange={(e) => setFormData({ ...formData, fitnessGoal: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="General Fitness">General Fitness</option>
                  <option value="Muscle Gain">Muscle Gain</option>
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Strength">Strength</option>
                  <option value="Endurance">Endurance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Level</label>
                <select
                  value={formData.currentLevel}
                  onChange={(e) => setFormData({ ...formData, currentLevel: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Days Per Week</label>
                <div className="flex space-x-4">
                  {[3, 4, 5, 6].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setFormData({ ...formData, availableDays: days })}
                      className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${
                        formData.availableDays === days
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {days} days
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Workout Types</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {workoutTypes.map((type) => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.preferredWorkouts.includes(type)}
                        onChange={() => handleWorkoutTypeChange(type)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
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
                  <span>Generating Your Workout Plan...</span>
                </>
              ) : (
                <>
                  <Dumbbell className="h-5 w-5" />
                  <span>Generate Workout Plan</span>
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
              <h3 className="text-xl font-semibold text-gray-900">Your Personalized Workout Plan</h3>
              <button
                onClick={() => setGeneratedPlan(null)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Generate New Plan
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">Goal</span>
                </div>
                <p className="text-lg font-bold text-blue-900">{generatedPlan.fitnessGoal}</p>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Frequency</span>
                </div>
                <p className="text-lg font-bold text-green-900">{generatedPlan.availableDays} days/week</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">Level</span>
                </div>
                <p className="text-lg font-bold text-purple-900">{generatedPlan.currentLevel}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">General Guidelines</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Warm up for 5-10 minutes before each workout</li>
                <li>• Cool down and stretch for 5-10 minutes after each workout</li>
                <li>• Stay hydrated throughout your workout</li>
                <li>• Rest for at least 24 hours between intense sessions</li>
                <li>• Listen to your body and adjust intensity as needed</li>
              </ul>
            </div>
          </div>

          {/* Weekly Schedule */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Weekly Schedule</h3>
            {Object.entries(generatedPlan.weeklySchedule).map(([day, workout]) => (
              <div key={day} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">{day}</h4>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {workout.focus}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  {workout.exercises.map((exercise, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <div>
                        <p className="font-medium text-gray-900">{exercise.name}</p>
                        {exercise.notes && (
                          <p className="text-sm text-gray-500">{exercise.notes}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-700">
                          {exercise.sets} sets × {exercise.reps}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                  <Clock className="h-4 w-4" />
                  <span>Rest: {workout.restTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutPlanner;