import React from 'react';
import { Smartphone, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const PromoBanner: React.FC = () => {
  const handleGetStarted = () => {
    window.open('https://t.me/novapay999', '_blank');
  };

  return (
    <motion.div 
      onClick={handleGetStarted}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
      className="relative w-full rounded-[2.2rem] overflow-hidden mb-8 group cursor-pointer border border-amber-500/10 shadow-2xl"
    >
      {/* Background rich cosmic royal blue with amber blend */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#081534] via-black to-[#1c1303] z-0"></div>
      
      {/* Golden Glowing Core Dust */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_50%_40%,rgba(245,158,11,0.25),transparent_55%)]"></div>

      <div className="relative z-10 p-6 flex flex-col items-center text-center">
        <span className="px-3 py-1 bg-amber-400/10 border border-amber-400/20 text-[9px] font-black text-amber-400 uppercase tracking-[0.25em] rounded-full mb-3 animate-pulse">
          Secure Tunnel Core
        </span>
        <h3 className="text-[17px] font-black tracking-[0.25em] mb-5 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-400 to-amber-200 italic uppercase">
          VOLERAPAY SYSTEM
        </h3>
        
        <div className="flex gap-3 mb-6">
          {[Smartphone, ShieldCheck, Cpu].map((Icon, i) => (
            <div key={i} className="p-3 rounded-2xl border border-white/5 bg-white/[0.01] shadow-xl group-hover:border-amber-500/20 transition-all duration-300">
              <Icon size={18} className={i % 2 === 0 ? "text-amber-400" : "text-blue-400"} />
            </div>
          ))}
        </div>

        <p className="text-[10px] text-gray-400 max-w-[240px] leading-relaxed mb-6">
          Unlock high-speed transactions with authorized Central Bank of Nigeria node gateways.
        </p>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            handleGetStarted();
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-amber-500 hover:brightness-110 text-white px-8 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-wider shadow-xl transition-all border border-white/10"
        >
          Secure Access <ArrowRight size={13} className="text-amber-300 stroke-[3]" />
        </motion.button>

        <div className="flex gap-1.5 mt-5">
          <div className="w-5 h-1 bg-amber-400 rounded-full"></div>
          <div className="w-1.5 h-1 bg-white/10 rounded-full"></div>
          <div className="w-1.5 h-1 bg-white/10 rounded-full"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default PromoBanner;
