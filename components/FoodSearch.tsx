
import React, { useState, useMemo } from 'react';
import { FoodItem, MealType } from '../types';
import { SEED_FOODS } from '../constants';

interface FoodSearchProps {
  onAdd: (food: FoodItem, quantity: number, mealType: MealType) => void;
}

const FoodSearch: React.FC<FoodSearchProps> = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState(100);
  const [mealType, setMealType] = useState<MealType>(MealType.LUNCH);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [newFood, setNewFood] = useState<Partial<FoodItem>>({
    name: '',
    caloriesPer100g: 0,
    proteinPer100g: 0,
    carbsPer100g: 0,
    fatPer100g: 0
  });

  const filteredFoods = useMemo(() => {
    if (!query) return [];
    return SEED_FOODS.filter(f => 
      f.name.includes(query) || f.nameEn.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  }, [query]);

  const handleAdd = () => {
    if (selectedFood) {
      onAdd(selectedFood, quantity, mealType);
    }
  };

  const handleCreateNew = () => {
    if (newFood.name && newFood.caloriesPer100g !== undefined) {
      const food: FoodItem = {
        id: Math.random().toString(),
        name: newFood.name,
        nameEn: newFood.name,
        caloriesPer100g: Number(newFood.caloriesPer100g),
        proteinPer100g: Number(newFood.proteinPer100g || 0),
        carbsPer100g: Number(newFood.carbsPer100g || 0),
        fatPer100g: Number(newFood.fatPer100g || 0),
      };
      onAdd(food, quantity, mealType);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-3xl shadow-sm">
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setIsAddingNew(false)}
            className={`flex-1 py-3 rounded-xl font-bold transition-all ${!isAddingNew ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-100 text-slate-500'}`}
          >
            بحث في قاعدة البيانات
          </button>
          <button 
            onClick={() => setIsAddingNew(true)}
            className={`flex-1 py-3 rounded-xl font-bold transition-all ${isAddingNew ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-100 text-slate-500'}`}
          >
            إضافة أكلة جديدة ✍️
          </button>
        </div>

        {!isAddingNew ? (
          <div className="space-y-6">
            <div className="relative">
              <input 
                type="text" 
                placeholder="ابحث عن طعام (مثل: أرز، دجاج...)"
                className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none"
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                  setSelectedFood(null);
                }}
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
              
              {filteredFoods.length > 0 && !selectedFood && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-20">
                  {filteredFoods.map(food => (
                    <button
                      key={food.id}
                      onClick={() => {
                        setSelectedFood(food);
                        setQuery(food.name);
                      }}
                      className="w-full p-4 text-right hover:bg-slate-50 flex justify-between items-center transition-colors border-b border-slate-100 last:border-0"
                    >
                      <span className="font-bold">{food.name}</span>
                      <span className="text-xs text-slate-400">{food.caloriesPer100g} سعرة / 100 جرام</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedFood && (
              <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 animate-slide-up">
                <h4 className="font-bold text-emerald-800 text-lg mb-4">{selectedFood.name}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white p-3 rounded-xl shadow-sm text-center">
                    <div className="text-[10px] text-slate-400 uppercase">سعرات</div>
                    <div className="font-bold">{Math.round((selectedFood.caloriesPer100g * quantity) / 100)}</div>
                  </div>
                   <div className="bg-white p-3 rounded-xl shadow-sm text-center">
                    <div className="text-[10px] text-slate-400 uppercase">بروتين</div>
                    <div className="font-bold text-emerald-600">{Math.round((selectedFood.proteinPer100g * quantity) / 100)}g</div>
                  </div>
                   <div className="bg-white p-3 rounded-xl shadow-sm text-center">
                    <div className="text-[10px] text-slate-400 uppercase">كارب</div>
                    <div className="font-bold text-blue-600">{Math.round((selectedFood.carbsPer100g * quantity) / 100)}g</div>
                  </div>
                   <div className="bg-white p-3 rounded-xl shadow-sm text-center">
                    <div className="text-[10px] text-slate-400 uppercase">دهون</div>
                    <div className="font-bold text-amber-600">{Math.round((selectedFood.fatPer100g * quantity) / 100)}g</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">الكمية (جرام)</label>
                    <input 
                      type="number" 
                      value={quantity}
                      onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">نوع الوجبة</label>
                    <select 
                      value={mealType}
                      onChange={e => setMealType(e.target.value as MealType)}
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value={MealType.BREAKFAST}>إفطار</option>
                      <option value={MealType.LUNCH}>غداء</option>
                      <option value={MealType.DINNER}>عشاء</option>
                      <option value={MealType.SNACK}>سناك</option>
                    </select>
                  </div>
                </div>

                <button 
                  onClick={handleAdd}
                  className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-[0.98]"
                >
                  إضافة للجدول اليومي
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">اسم الطعام</label>
                <input 
                  type="text" 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl"
                  placeholder="مثال: منسف لحم"
                  value={newFood.name}
                  onChange={e => setNewFood({...newFood, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">سعرات (لكل 100 جرام)</label>
                <input 
                  type="number" 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl"
                  value={newFood.caloriesPer100g}
                  onChange={e => setNewFood({...newFood, caloriesPer100g: parseFloat(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">البروتين (جرام)</label>
                <input 
                  type="number" 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl"
                  value={newFood.proteinPer100g}
                  onChange={e => setNewFood({...newFood, proteinPer100g: parseFloat(e.target.value)})}
                />
              </div>
               <div>
                <label className="block text-sm font-semibold mb-2">الكارب (جرام)</label>
                <input 
                  type="number" 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl"
                  value={newFood.carbsPer100g}
                  onChange={e => setNewFood({...newFood, carbsPer100g: parseFloat(e.target.value)})}
                />
              </div>
               <div>
                <label className="block text-sm font-semibold mb-2">الدهون (جرام)</label>
                <input 
                  type="number" 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl"
                  value={newFood.fatPer100g}
                  onChange={e => setNewFood({...newFood, fatPer100g: parseFloat(e.target.value)})}
                />
              </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <label className="block text-sm font-semibold mb-2">الكمية التي تناولتها (جرام)</label>
                  <input 
                    type="number" 
                    value={quantity}
                    onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">نوع الوجبة</label>
                  <select 
                    value={mealType}
                    onChange={e => setMealType(e.target.value as MealType)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl"
                  >
                    <option value={MealType.BREAKFAST}>إفطار</option>
                    <option value={MealType.LUNCH}>غداء</option>
                    <option value={MealType.DINNER}>عشاء</option>
                    <option value={MealType.SNACK}>سناك</option>
                  </select>
                </div>
              </div>

            <button 
              onClick={handleCreateNew}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg"
            >
              حفظ وإضافة للجدول
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodSearch;
