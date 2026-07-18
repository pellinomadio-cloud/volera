
import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

interface BalanceCardProps {
  balance: number;
  target: number;
  currency: string;
  onWithdraw: () => void;
  onDeposit: () => void;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance, target, currency, onWithdraw, onDeposit }) => {
  const [showBalance, setShowBalance] = useState(true);
  const progress = (balance / target) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full bg-gradient-to-br from-[#0B1530] via-[#050C1D] to-[#201602] rounded-[2.2rem] p-6 shadow-2xl relative overflow-hidden mb-6 border border-amber-500/15"
    >
      {/* Golden Glowing Ambient Dust */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-[40px] pointer-events-none animate-pulse"></div>
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-500/10 rounded-full blur-[45px] pointer-events-none"></div>

      {/* Decorative Gold Laser Lines */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6 gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-amber-400/80">
              <ShieldCheck size={13} className="stroke-[2.5]" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] truncate">Verified Ledger Node</span>
              <Sparkles size={11} className="animate-spin text-amber-400" style={{ animationDuration: '6s' }} />
            </div>
            
            <p className="text-gray-400 text-[13px] font-bold uppercase tracking-wider">Available Balance</p>
            <div className="flex flex-wrap items-center gap-2.5 mt-2">
              <h2 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-yellow-100 via-amber-200 to-amber-400 drop-shadow-[0_10px_50px_rgba(251,191,36,0.8)] tracking-tighter leading-none py-1 truncate">
                {showBalance ? `${currency}${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '•••••••'}
              </h2>
              <button 
                onClick={() => setShowBalance(!showBalance)}
                className="p-1.5 hover:bg-white/5 text-amber-400 rounded-lg transition-colors"
                title={showBalance ? "Hide Balance" : "Show Balance"}
              >
                {showBalance ? <Eye size={15} /> : <EyeOff size={15} />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <motion.button 
              whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(245,158,11,0.2)' }}
              whileTap={{ scale: 0.97 }}
              onClick={onWithdraw}
              className="w-28 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-300 text-black py-2.5 rounded-xl font-black text-[10px] uppercase tracking-wider shadow-lg hover:brightness-110 transition-all border border-amber-300/30 text-center"
            >
              Withdraw
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(59,130,246,0.2)' }}
              whileTap={{ scale: 0.97 }}
              onClick={onDeposit}
              className="w-28 bg-gradient-to-r from-blue-500 via-indigo-500 to-indigo-600 text-white py-2.5 rounded-xl font-black text-[10px] uppercase tracking-wider shadow-lg hover:brightness-110 transition-all border border-blue-400/30 text-center"
            >
              Deposit
            </motion.button>
          </div>
        </div>

        {/* Dynamic target tracking and golden progress bar */}
        <div className="space-y-2.5 pt-4 border-t border-white/5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <TrendingUp size={13} className="text-amber-400" /> Daily Node Target
            </span>
            <span className="text-amber-400 font-mono font-black text-xs">{currency}{target.toLocaleString()}</span>
          </div>
          <div className="w-full h-2.5 bg-black/50 rounded-full overflow-hidden border border-white/5 p-[2px]">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-blue-500 via-amber-400 to-amber-300 rounded-full"
            ></motion.div>
          </div>
          <div className="flex justify-between text-[10px] text-gray-500 font-black uppercase tracking-widest pt-0.5">
            <span>Tunnel Efficiency: {Math.round(Math.min(progress, 100))}%</span>
            <span>Secure Sync Active</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BalanceCard;