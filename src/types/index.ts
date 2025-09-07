export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  membershipType: 'Basic' | 'Premium' | 'VIP';
  joinDate: string;
  membershipPrice: number;
  pricing: {
    monthly: number;
    quarterly: number;
    yearly: number;
    discount?: number;
  };
  status: 'Active' | 'Inactive' | 'Suspended';
  lastCheckIn?: string;
}

export interface Trainer {
  id: string;
  name: string;
  specialization: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
  experience: string;
}

export interface GymClass {
  id: string;
  name: string;
  trainerId: string;
  schedule: string;
  duration: number;
  capacity: number;
  enrolled: number;
}

export interface Equipment {
  id: string;
  name: string;
  category: 'Cardio' | 'Strength' | 'Functional' | 'Other';
  status: 'Available' | 'In Use' | 'Maintenance' | 'Out of Order';
  lastMaintenance: string;
}

export interface Payment {
  id: string;
  memberId: string;
  amount: number;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
  description: string;
}

export interface DietPlan {
  id: string;
  memberId: string;
  age: number;
  gender: 'Male' | 'Female';
  dietaryPreference: 'Vegetarian' | 'Non-Vegetarian';
  weight: number;
  height: number;
  workoutDuration: number;
  bodyGoal: 'Gain Weight' | 'Lose Weight' | 'Maintain Weight';
  dailyCalories: number;
  macros: {
    carbs: number;
    proteins: number;
    fats: number;
  };
  meals: {
    breakfast: MealItem[];
    lunch: MealItem[];
    snacks: MealItem[];
    dinner: MealItem[];
  };
  createdAt: string;
}

export interface MealItem {
  name: string;
  quantity: string;
  calories: number;
}

export interface WorkoutPlan {
  id: string;
  memberId: string;
  fitnessGoal: 'Muscle Gain' | 'Weight Loss' | 'Strength' | 'Endurance' | 'General Fitness';
  currentLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  availableDays: number;
  preferredWorkouts: string[];
  weeklySchedule: {
    [key: string]: WorkoutDay;
  };
  createdAt: string;
}

export interface WorkoutDay {
  focus: string;
  exercises: Exercise[];
  restTime: string;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  notes?: string;
}