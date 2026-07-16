
import React from 'react';
import { Smartphone, LayoutGrid, DollarSign, ArrowRight } from 'lucide-react';

const PromoBanner: React.FC = () => {
  const handleGetStarted = () => {
    window.open('https://t.me/novapay999', '_blank');
  };

  return (
    <div 
      onClick={handleGetStarted}
      className="relative w-full rounded-[2rem] overflow-hidden mb-8 group cursor-pointer border border-white/5 shadow-2xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 to-black z-0"></div>
      
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(circle_at_30%_50%,rgba(0,163,255,0.2),transparent_50%)]"></div>

      <div className="relative z-10 p-6 flex flex-col items-center text-center">
        <h3 className="text-[18px] font-black tracking-[0.2em] mb-6 text-blue-200 italic">EASY WALLET 2026</h3>
        
        <div className="flex gap-4 mb-8">
          {[Smartphone, LayoutGrid, DollarSign].map((Icon, i) => (
            <div key={i} className="p-4 rounded-xl border border-white/10 bg-white/5 shadow-lg">
              <Icon size={22} className="text-white" />
            </div>
          ))}
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleGetStarted();
          }}
          className="flex items-center gap-2 bg-blue-600/90 hover:bg-blue-600 text-white px-8 py-2 rounded-full font-bold text-[12px] shadow-xl transition-all active:scale-95 border border-white/10"
        >
          Get Started <ArrowRight size={14} />
        </button>

        <div className="flex gap-2 mt-6">
          <div className="w-4 h-1 bg-blue-500 rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-gray-700 rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-gray-700 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
