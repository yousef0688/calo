
import React from 'react';

interface SidebarProps {
  activeTab: 'dashboard' | 'add-food' | 'ai' | 'profile';
  setActiveTab: (tab: 'dashboard' | 'add-food' | 'ai' | 'profile') => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: '🏠' },
    { id: 'add-food', label: 'إضافة طعام', icon: '🥗' },
    { id: 'ai', label: 'تصوير الوجبة', icon: '📸' },
    { id: 'profile', label: 'الملف الشخصي', icon: '👤' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-l border-slate-200 p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">ص</div>
          <span className="text-2xl font-bold tracking-tight text-emerald-600">صحّة</span>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-bold transition-all ${
                activeTab === item.id 
                  ? 'bg-emerald-50 text-emerald-600 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button 
          onClick={onLogout}
          className="mt-auto flex items-center gap-4 px-4 py-4 text-slate-400 font-bold hover:text-red-500 transition-colors"
        >
          <span className="text-xl">🚪</span>
          <span>تسجيل الخروج</span>
        </button>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 flex justify-around p-2 pb-6">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
              activeTab === item.id ? 'text-emerald-600' : 'text-slate-400'
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        ))}
      </div>
    </>
  );
};

export default Sidebar;
