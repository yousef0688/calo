
export enum Gender {
  MALE = 'male',
  FEMALE = 'female'
}

export enum ActivityLevel {
  SEDENTARY = '1.2',
  LIGHT = '1.375',
  MODERATE = '1.55',
  ACTIVE = '1.725',
  VERY_ACTIVE = '1.9'
}

export enum HealthGoal {
  LOSE_WEIGHT = 'lose',
  MAINTAIN = 'maintain',
  GAIN_WEIGHT = 'gain'
}

export enum MealType {
  BREAKFAST = 'breakfast',
  LUNCH = 'lunch',
  DINNER = 'dinner',
  SNACK = 'snack'
}

export interface UserProfile {
  name: string;
  age: number;
  gender: Gender;
  weight: number; // in kg
  height: number; // in cm
  activityLevel: ActivityLevel;
  goal: HealthGoal;
}

export interface FoodItem {
  id: string;
  name: string;
  nameEn: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  category?: string;
}

export interface MealLog {
  id: string;
  foodId: string;
  foodName: string;
  quantity: number; // in grams
  totalCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: number;
  mealType: MealType;
}

export interface DayStats {
  targetCalories: number;
  consumedCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
}
