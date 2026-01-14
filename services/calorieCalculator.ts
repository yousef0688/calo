
import { UserProfile, Gender, HealthGoal } from '../types';

/**
 * Calculates Basal Metabolic Rate using Mifflin-St Jeor Equation
 */
export function calculateBMR(profile: UserProfile): number {
  const { weight, height, age, gender } = profile;
  
  if (gender === Gender.MALE) {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

/**
 * Calculates Total Daily Energy Expenditure (TDEE) based on activity level and goal
 */
export function calculateTargetCalories(profile: UserProfile): number {
  const bmr = calculateBMR(profile);
  const tdee = bmr * parseFloat(profile.activityLevel);
  
  switch (profile.goal) {
    case HealthGoal.LOSE_WEIGHT:
      return Math.round(tdee - 500); // 500 cal deficit
    case HealthGoal.GAIN_WEIGHT:
      return Math.round(tdee + 500); // 500 cal surplus
    case HealthGoal.MAINTAIN:
    default:
      return Math.round(tdee);
  }
}

/**
 * Basic Macro splits recommendation
 * Protein: 30%, Carbs: 40%, Fat: 30%
 */
export function calculateMacros(targetCalories: number) {
  return {
    protein: Math.round((targetCalories * 0.30) / 4), // 4 cal per gram
    carbs: Math.round((targetCalories * 0.40) / 4),   // 4 cal per gram
    fat: Math.round((targetCalories * 0.30) / 9),     // 9 cal per gram
  };
}
