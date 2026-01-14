
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { UserProfile, Gender, ActivityLevel, HealthGoal, MealLog, FoodItem, MealType } from './types';
import { SEED_FOODS, APP_CONFIG } from './constants';
import { calculateTargetCalories, calculateMacros } from './services/calorieCalculator';
import ProfileForm from './components/ProfileForm';
import Dashboard from './components/Dashboard';
import FoodSearch from './components/FoodSearch';
import ImageAnalyzer from './components/ImageAnalyzer';
import Sidebar from './components/Sidebar';
import WelcomeHero from './components/WelcomeHero';

const App: React.FC = () => {
  // State
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('sahha_profile');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [mealLogs, setMealLogs] = useState<MealLog[]>(() => {
    const saved = localStorage.getItem('sahha_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'add-food' | 'ai' | 'profile'>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Persistence
  useEffect(() => {
    if (profile) localStorage.setItem('sahha_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('sahha_logs', JSON.stringify(mealLogs));
  }, [mealLogs]);

  // Derived Stats
  const targetCalories = useMemo(() => profile ? calculateTargetCalories(profile) : 2000, [profile]);
  const targetMacros = useMemo(() => calculateMacros(targetCalories), [targetCalories]);

  const dailyLogs = useMemo(() => {
    const today = new Date().setHours(0,0,0,0);
    return mealLogs.filter(log => new Date(log.timestamp).setHours(0,0,0,0) === today);
  }, [mealLogs]);

  const consumedToday = useMemo(() => ({
    calories: dailyLogs.reduce((acc, log) => acc + log.totalCalories, 0),
    protein: dailyLogs.reduce((acc, log) => acc + log.protein, 0),
    carbs: dailyLogs.reduce((acc, log) => acc + log.carbs, 0),
    fat: dailyLogs.reduce((acc, log) => acc + log.fat, 0),
  }), [dailyLogs]);

  // Handlers
  const addMeal = useCallback((food: FoodItem, quantity: number, mealType: MealType) => {
    const ratio = quantity / 100;
    const newLog: MealLog = {
      id: Math.random().toString(36).substr(2, 9),
      foodId: food.id,
      foodName: food.name,
      quantity,
      totalCalories: Math.round(food.caloriesPer100g * ratio),
      protein: Math.round(food.proteinPer100g * ratio),
      carbs: Math.round(food.carbsPer100g * ratio),
      fat: Math.round(food.fatPer100g * ratio),
      timestamp: Date.now(),
      mealType
    };
    setMealLogs(prev => [newLog, ...prev]);
    setActiveTab('dashboard');
  }, []);

  const deleteLog = useCallback((id: string) => {
    setMealLogs(prev => prev.filter(log => log.id !== id));
  }, []);

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <WelcomeHero />
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden mt-8">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-center mb-6 text-emerald-600">لنبدأ رحلتك الصحية</h2>
            <ProfileForm onSave={setProfile} initialData={null} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'} flex flex-col md:flex-row`}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={() => {
          localStorage.removeItem('sahha_profile');
          localStorage.removeItem('sahha_logs');
          setProfile(null);
          setMealLogs([]);
        }}
      />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-h-screen custom-scrollbar">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">مرحباً، {profile.name} 👋</h1>
            <p className="text-slate-500 text-sm">إليك ملخص يومك الصحي</p>
          </div>
          <div className="flex gap-4">
             <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl bg-white shadow-sm border border-slate-200"
             >
              {isDarkMode ? '🌙' : '☀️'}
             </button>
             <div className="text-left md:text-right">
                <div className="text-xs font-semibold text-emerald-600 uppercase">هدفك اليومي</div>
                <div className="text-lg font-bold">{targetCalories} سعرة</div>
             </div>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <Dashboard 
            stats={{
              target: targetCalories,
              consumed: consumedToday.calories,
              macros: targetMacros,
              consumedMacros: { 
                protein: consumedToday.protein, 
                carbs: consumedToday.carbs, 
                fat: consumedToday.fat 
              }
            }}
            logs={dailyLogs}
            onDelete={deleteLog}
          />
        )}

        {activeTab === 'add-food' && (
          <FoodSearch onAdd={addMeal} />
        )}

        {activeTab === 'ai' && (
          <ImageAnalyzer onAdd={addMeal} />
        )}

        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-sm">
            <h2 className="text-xl font-bold mb-6">تعديل الملف الشخصي</h2>
            <ProfileForm onSave={setProfile} initialData={profile} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
