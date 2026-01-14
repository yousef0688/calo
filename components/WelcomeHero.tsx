
import React from 'react';

const WelcomeHero: React.FC = () => {
  return (
    <div className="text-center space-y-4 max-w-lg mx-auto">
      <div className="w-20 h-20 bg-emerald-600 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-xl shadow-emerald-100 mb-8">
        🥗
      </div>
      <h1 className="text-4xl font-black text-slate-900 leading-tight">
        أهلاً بك في <span className="text-emerald-600">صحّة</span>
      </h1>
      <p className="text-slate-500 text-lg leading-relaxed">
        منصتك الذكية لإدارة نمط حياتك الصحي. نحسب سعراتك، نحلل وجباتك بالذكاء الاصطناعي، ونرافقك في كل خطوة نحو هدفك.
      </p>
    </div>
  );
};

export default WelcomeHero;
