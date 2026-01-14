
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { MealLog, MealType } from '../types';

interface DashboardProps {
  stats: {
    target: number;
    consumed: number;
    macros: { protein: number; carbs: number; fat: number };
    consumedMacros: { protein: number; carbs: number; fat: number };
  };
  logs: MealLog[];
  onDelete: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, logs, onDelete }) => {
  const remaining = Math.max(0, stats.target - stats.consumed);
  const percentage = Math.min(100, Math.round((stats.consumed / stats.target) * 100));

  const macroData = [
    { name: 'البروتين', value: stats.consumedMacros.protein, target: stats.macros.protein, color: '#10b981' },
    { name: 'الكارب', value: stats.consumedMacros.carbs, target: stats.macros.carbs, color: '#3b82f6' },
    { name: 'الدهون', value: stats.consumedMacros.fat, target: stats.macros.fat, color: '#f59e0b' },
  ];

  const chartData = [
    { name: 'Consumed', value: stats.consumed },
    { name: 'Remaining', value: remaining },
  ];

  const mealTypeLabels: Record<MealType, string> = {
    [MealType.BREAKFAST]: 'إفطار',
    [MealType.LUNCH]: 'غداء',
    [MealType.DINNER]: 'عشاء',
    [MealType.SNACK]: 'سناك',
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calorie Ring Card */}
        <div className="bg-white p-8 rounded-3xl shadow-sm flex flex-col items-center justify-center relative">
          <h3 className="text-lg font-bold mb-4">السعرات اليومية</h3>
          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#f1f5f9" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-bold">{stats.consumed}</span>
              <span className="text-slate-400 text-sm">من {stats.target}</span>
            </div>
          </div>
          <div className="w-full mt-4 flex justify-between items-center text-sm font-bold">
            <div className="text-emerald-600">المستهلك: {percentage}%</div>
            <div className="text-slate-400">المتبقي: {remaining}</div>
          </div>
        </div>

        {/* Macros Progress */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm">
          <h3 className="text-lg font-bold mb-8 text-right">توزيع العناصر الغذائية (جم)</h3>
          <div className="space-y-10">
            {macroData.map(m => (
              <div key={m.name}>
                <div className="flex justify-between mb-2">
                  <span className="font-bold">{m.name}</span>
                  <span className="text-slate-500 text-sm">{m.value} / {m.target} جرام</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (m.value / m.target) * 100)}%`, backgroundColor: m.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Logs Section */}
      <div className="bg-white p-8 rounded-3xl shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">سجل الوجبات لليوم</h3>
          <span className="bg-emerald-50 text-emerald-600 px-4 py-1 rounded-full text-sm font-bold">
            {logs.length} وجبات
          </span>
        </div>

        {logs.length === 0 ? (
          <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <div className="text-4xl mb-2">🍽️</div>
            <p>لا توجد وجبات مسجلة لليوم</p>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map(log => (
              <div key={log.id} className="group flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-2xl">
                    {log.mealType === MealType.BREAKFAST ? '🍳' : log.mealType === MealType.LUNCH ? '🥘' : log.mealType === MealType.DINNER ? '🥗' : '🍎'}
                  </div>
                  <div>
                    <h4 className="font-bold">{log.foodName}</h4>
                    <div className="flex gap-2 text-xs text-slate-500">
                      <span>{mealTypeLabels[log.mealType]}</span>
                      <span>•</span>
                      <span>{log.quantity} جرام</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-left md:text-right">
                    <div className="font-bold text-emerald-600">{log.totalCalories} سعرة</div>
                    <div className="text-[10px] text-slate-400">P:{log.protein}g C:{log.carbs}g F:{log.fat}g</div>
                  </div>
                  <button 
                    onClick={() => onDelete(log.id)}
                    className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 rounded-lg transition-all"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
