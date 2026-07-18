
import React, { useState } from 'react';
import { ArrowLeft, Landmark, User, Hash, CheckCircle2, AlertCircle, ShieldAlert, ArrowUpCircle } from 'lucide-react';

interface WithdrawPageProps {
  onBack: () => void;
  onFreeWithdrawClick: () => void;
  balance: number;
  currency: string;
  onSuccess: (amount: number) => void;
  userLevel: number;
  onGoToUpgrade: () => void;
}

const BANKS = [
  'OPay', 'PalmPay', 'Access Bank', 'Zenith Bank', 'GTBank', 
  'First Bank', 'United Bank for Africa (UBA)', 'Kuda Bank', 'Moniepoint'
];

const WithdrawPage: React.FC<WithdrawPageProps> = ({ onBack, onFreeWithdrawClick, balance, currency, onSuccess, userLevel, onGoToUpgrade }) => {
  const [formData, setFormData] = useState({
    accountNumber: '',
    bank: '',
    accountName: '',
    amount: ''
  });
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleWithdraw = () => {
    setError('');
    
    if (userLevel < 3) {
      setError('Account Level 3 required to withdraw');
      return;
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      setError('Enter a valid amount');
      return;
    }
    if (userLevel < 4 && Number(formData.amount) < 200000) {
      setError('Minimum withdrawal is ₦200,000 (Level 4+ enjoys unlimited/no minimum withdrawal)');
      return;
    }
    if (Number(formData.amount) > balance) {
      setError('Insufficient funds');
      return;
    }
    if (formData.accountNumber.length !== 10 || !/^\d+$/.test(formData.accountNumber)) {
      setError('Account number must be 10 digits');
      return;
    }
    if (!formData.bank) {
      setError('Please select a bank');
      return;
    }
    if (!formData.accountName) {
      setError('Enter account name');
      return;
    }

    // Simulate Processing
    setIsSuccess(true);
    setTimeout(() => {
      onSuccess(Number(formData.amount));
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6 animate-fadeIn">
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle2 size={48} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Withdrawal Initiated</h2>
        <p className="text-gray-400 text-sm">Your funds are being moved through secure CBN channels.</p>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
          <ArrowLeft size={24} className="text-gray-400" />
        </button>
        <h2 className="text-xl font-black italic tracking-wider text-blue-500">WITHDRAW FUNDS</h2>
      </div>

      <div className="space-y-6">
        <div className="glass-card p-4 rounded-2xl border-blue-500/20 flex justify-between items-center">
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Available to Withdraw</p>
            <p className="text-2xl font-black text-white">{currency}{balance.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Your Shield Level</p>
            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${userLevel >= 3 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              Level {userLevel}
            </span>
          </div>
        </div>

        {userLevel < 3 ? (
          <div className="p-5 rounded-3xl bg-red-500/10 border border-red-500/20 flex flex-col items-center gap-4 text-center shadow-xl shadow-red-500/5 animate-fadeIn">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
              <ShieldAlert size={24} className="text-red-400" />
            </div>
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider mb-1.5">Withdrawal Locked</h3>
              <p className="text-[10px] text-gray-400 leading-relaxed max-w-[280px]">
                To qualify for instant node withdrawals, security compliance requires your wallet to be upgraded to <span className="text-red-400 font-bold">Level 3</span>.
              </p>
            </div>
            <button 
              onClick={onGoToUpgrade}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-500 to-amber-600 hover:brightness-110 text-white font-black text-[11px] uppercase tracking-wider shadow-lg shadow-red-500/10 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <ArrowUpCircle size={14} />
              Upgrade to Level 3 Now
            </button>
          </div>
        ) : null}

        <div className={`space-y-4 ${userLevel < 3 ? 'opacity-40 pointer-events-none' : ''}`}>
          {/* Amount */}
          <div className="space-y-1.5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-500 font-bold">
                {currency}
              </div>
              <input
                type="number"
                placeholder="0.00"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-blue-500 transition-all outline-none font-semibold"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                disabled={userLevel < 3}
              />
            </div>
             <p className="text-[10px] text-amber-400 font-black uppercase tracking-wider pl-1.5">
              {userLevel >= 4 ? 'No Minimum Withdrawal Limit (Unlimited)' : 'Minimum withdrawal: ₦200,000'}
            </p>
          </div>

          {/* Account Number */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Hash size={18} className="text-gray-500" />
            </div>
            <input
              type="text"
              maxLength={10}
              placeholder="10-Digit Account Number"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-blue-500 transition-all outline-none"
              value={formData.accountNumber}
              onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              disabled={userLevel < 3}
            />
          </div>

          {/* Bank Select */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Landmark size={18} className="text-gray-500" />
            </div>
            <select
              className="w-full bg-black border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-blue-500 transition-all outline-none appearance-none"
              value={formData.bank}
              onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
              disabled={userLevel < 3}
            >
              <option value="">Select Bank</option>
              {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          {/* Account Name */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User size={18} className="text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Account Name"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-blue-500 transition-all outline-none"
              value={formData.accountName}
              onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
              disabled={userLevel < 3}
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 justify-center text-red-400 bg-red-400/10 py-3 rounded-xl animate-shake">
            <AlertCircle size={16} />
            <span className="text-xs font-bold uppercase tracking-tight">{error}</span>
          </div>
        )}

        {userLevel >= 3 && (
          <button
            onClick={handleWithdraw}
            className="w-full blue-gradient py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 group hover:scale-[1.02] active:scale-95 transition-all"
          >
            APPROVE WITHDRAWAL
          </button>
        )}

        <p className="text-[9px] text-center text-gray-500 uppercase tracking-widest leading-relaxed mt-4">
          All transactions are end-to-end encrypted and verified by the Central Bank of Nigeria node.
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};

export default WithdrawPage;
