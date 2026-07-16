
import React from 'react';
import { Wallet, Globe, BarChart2, User } from 'lucide-react';
import { View } from '../types';

interface BottomNavProps {
  currentView: View;
  onViewChange: (view: View) => void;
  onAIAssistant: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onViewChange, onAIAssistant }) => {
  const items: { id: View; icon: typeof Wallet; label: string }[] = [
    { id: 'wallet', icon: Wallet, label: 'Wallet' },
    { id: 'explore', icon: Globe, label: 'Explore' }, // Just a placeholder for the globe button area
    { id: 'history', icon: BarChart2, label: 'History' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-6 pt-2 pointer-events-none">
      <div className="max-w-md mx-auto h-20 bg-[#111] border border-white/5 rounded-3xl shadow-2xl shadow-black flex items-center justify-between px-6 pointer-events-auto">
        {items.map((item) => {
          if (item.id === 'explore') {
             return (
              <button 
                key={item.id}
                onClick={onAIAssistant}
                className="relative -top-10 w-16 h-16 rounded-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)] flex items-center justify-center transition-transform active:scale-90 hover:scale-105 z-10"
              >
                <Globe size={28} className="text-white" />
              </button>
             );
          }
          const isActive = currentView === item.id;
          return (
            <button 
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className="flex flex-col items-center gap-1 group"
            >
              <item.icon 
                size={isActive ? 24 : 20} 
                className={isActive ? 'text-blue-500' : 'text-gray-500 group-hover:text-gray-300 transition-colors'} 
              />
              <span className={`text-[10px] font-bold ${isActive ? 'text-blue-500' : 'text-gray-600 group-hover:text-gray-400 transition-colors'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
