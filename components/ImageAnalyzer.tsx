
import React, { useState, useRef } from 'react';
import { analyzeFoodImage, AIAnalysisResult } from '../services/geminiService';
import { FoodItem, MealType } from '../types';

interface ImageAnalyzerProps {
  onAdd: (food: FoodItem, quantity: number, mealType: MealType) => void;
}

const ImageAnalyzer: React.FC<ImageAnalyzerProps> = ({ onAdd }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const analysis = await analyzeFoodImage(image);
      setResult(analysis);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء تحليل الصورة');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (result) {
      const food: FoodItem = {
        id: 'ai-' + Date.now(),
        name: result.foodName,
        nameEn: result.foodName,
        caloriesPer100g: Math.round((result.calories / result.estimatedWeight) * 100),
        proteinPer100g: (result.protein / result.estimatedWeight) * 100,
        carbsPer100g: (result.carbs / result.estimatedWeight) * 100,
        fatPer100g: (result.fat / result.estimatedWeight) * 100,
      };
      onAdd(food, result.estimatedWeight, MealType.LUNCH);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-3xl shadow-sm text-center">
        <h3 className="text-xl font-bold mb-4">التعرف على الطعام بالذكاء الاصطناعي 📸</h3>
        <p className="text-slate-500 mb-8">قم برفع صورة لطبقك، وسنقوم بتحليل السعرات والقيم الغذائية تلقائياً</p>
        
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`aspect-video w-full border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-all overflow-hidden relative ${image ? 'border-none' : ''}`}
        >
          {image ? (
            <img src={image} className="w-full h-full object-cover" alt="Food preview" />
          ) : (
            <>
              <div className="text-5xl mb-4">📷</div>
              <p className="font-semibold text-slate-600">اضغط لرفع صورة أو التصوير</p>
            </>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>

        {image && !result && !loading && (
          <button 
            onClick={startAnalysis}
            className="w-full mt-6 bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-transform active:scale-[0.98]"
          >
            حلل الصورة الآن ✨
          </button>
        )}

        {loading && (
          <div className="mt-8 space-y-4">
            <div className="animate-spin text-4xl mx-auto">🪄</div>
            <p className="font-bold text-emerald-600">جاري التعرف على المكونات وتقدير الكميات...</p>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl font-semibold">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-8 text-right animate-slide-up">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-2xl font-bold text-emerald-600">{result.foodName}</h4>
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">دقة: {Math.round(result.confidence * 100)}%</span>
              </div>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                {result.reasoning}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm">
                   <div className="text-xs text-slate-400 mb-1">الكمية المقدرة</div>
                   <div className="font-bold">{result.estimatedWeight} جم</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                   <div className="text-xs text-slate-400 mb-1">السعرات</div>
                   <div className="font-bold">{result.calories}</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                   <div className="text-xs text-slate-400 mb-1">بروتين</div>
                   <div className="font-bold text-emerald-600">{result.protein} جم</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                   <div className="text-xs text-slate-400 mb-1">كارب</div>
                   <div className="font-bold text-blue-600">{result.carbs} جم</div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleConfirm}
                className="flex-1 bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg"
              >
                تأكيد الإضافة للسجل ✅
              </button>
               <button 
                onClick={() => {setImage(null); setResult(null);}}
                className="px-8 bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl"
              >
                إلغاء
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageAnalyzer;
