
import React, { useState } from 'react';
import { UserProfile, Gender, ActivityLevel, HealthGoal } from '../types';

interface ProfileFormProps {
  onSave: (data: UserProfile) => void;
  initialData: UserProfile | null;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onSave, initialData }) => {
  const [formData, setFormData] = useState<UserProfile>(initialData || {
    name: '',
    age: 25,
    gender: Gender.MALE,
    weight: 70,
    height: 170,
    activityLevel: ActivityLevel.MODERATE,
    goal: HealthGoal.MAINTAIN
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const inputClass = "w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-700">الاسم</label>
          <input 
            type="text" 
            required 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-700">العمر</label>
          <input 
            type="number" 
            required 
            value={formData.age}
            onChange={e => setFormData({...formData, age: parseInt(e.target.value)})}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-700">الوزن (كجم)</label>
          <input 
            type="number" 
            required 
            value={formData.weight}
            onChange={e => setFormData({...formData, weight: parseFloat(e.target.value)})}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-700">الطول (سم)</label>
          <input 
            type="number" 
            required 
            value={formData.height}
            onChange={e => setFormData({...formData, height: parseInt(e.target.value)})}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-700">الجنس</label>
          <select 
            value={formData.gender}
            onChange={e => setFormData({...formData, gender: e.target.value as Gender})}
            className={inputClass}
          >
            <option value={Gender.MALE}>ذكر</option>
            <option value={Gender.FEMALE}>أنثى</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-700">مستوى النشاط</label>
          <select 
            value={formData.activityLevel}
            onChange={e => setFormData({...formData, activityLevel: e.target.value as ActivityLevel})}
            className={inputClass}
          >
            <option value={ActivityLevel.SEDENTARY}>خامل (مكتب)</option>
            <option value={ActivityLevel.LIGHT}>نشاط خفيف (مشق خفيف)</option>
            <option value={ActivityLevel.MODERATE}>نشاط متوسط (3-5 أيام)</option>
            <option value={ActivityLevel.ACTIVE}>نشيط (6-7 أيام)</option>
            <option value={ActivityLevel.VERY_ACTIVE}>نشيط جداً (عمل شاق)</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-2 text-slate-700">الهدف الصحي</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: HealthGoal.LOSE_WEIGHT, label: 'تنزيل وزن' },
              { id: HealthGoal.MAINTAIN, label: 'تثبيت وزن' },
              { id: HealthGoal.GAIN_WEIGHT, label: 'زيادة وزن' },
            ].map(g => (
              <button
                key={g.id}
                type="button"
                onClick={() => setFormData({...formData, goal: g.id})}
                className={`py-3 rounded-xl border text-sm transition-all ${
                  formData.goal === g.id 
                    ? 'bg-emerald-600 text-white border-emerald-600' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <button 
        type="submit"
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-100 transition-all transform active:scale-[0.98]"
      >
        حفظ البيانات
      </button>
    </form>
  );
};

export default ProfileForm;
