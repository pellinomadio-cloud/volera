
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface BalanceCardProps {
  balance: number;
  target: number;
  currency: string;
  onWithdraw: () => void;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance, target, currency, onWithdraw }) => {
  const [showBalance, setShowBalance] = useState(true);
  const progress = (balance / target) * 100;

  return (
    <div className="w-full blue-gradient rounded-[2rem] p-5 shadow-2xl relative overflow-hidden mb-6">
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-1">
            <p className="text-white/80 text-[10px] font-medium tracking-tight">Available Balance</p>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {showBalance ? `${currency}${balance.toLocaleString()}` : '•••••••'}
              </h2>
              <button 
                onClick={() => setShowBalance(!showBalance)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                {showBalance ? <Eye size={16} className="text-white/60" /> : <EyeOff size={16} className="text-white/60" />}
              </button>
            </div>
          </div>
          <button 
            onClick={onWithdraw}
            className="bg-white text-[#0066FF] px-6 py-1.5 rounded-full font-bold text-[12px] shadow-lg hover:bg-opacity-90 transition-all active:scale-95"
          >
            Withdraw
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-white/80 text-[10px] font-medium">Daily target</span>
            <span className="text-white/90 text-[10px] font-bold">{currency}{target.toLocaleString()}</span>
          </div>
          <div className="w-full h-[3px] bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;