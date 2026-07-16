
import React, { useState } from 'react';
import { ArrowLeft, Landmark, User, Hash, Lock, CheckCircle2, AlertCircle, Zap } from 'lucide-react';

interface WithdrawPageProps {
  onBack: () => void;
  onFreeWithdrawClick: () => void;
  balance: number;
  currency: string;
  onSuccess: (amount: number) => void;
}

const BANKS = [
  'OPay', 'PalmPay', 'Access Bank', 'Zenith Bank', 'GTBank', 
  'First Bank', 'United Bank for Africa (UBA)', 'Kuda Bank', 'Moniepoint'
];

const BPC_SECRET = "NOD999";

const WithdrawPage: React.FC<WithdrawPageProps> = ({ onBack, onFreeWithdrawClick, balance, currency, onSuccess }) => {
  const [formData, setFormData] = useState({
    accountNumber: '',
    bank: '',
    accountName: '',
    nodeCode: '',
    amount: ''
  });
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleWithdraw = () => {
    setError('');
    
    if (!formData.amount || Number(formData.amount) <= 0) {
      setError('Enter a valid amount');
      return;
    }
    if (Number(formData.amount) < 200000) {
      setError('Minimum withdrawal is ₦200,000');
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
    if (formData.nodeCode !== BPC_SECRET) {
      setError('Invalid NODE CODE. Withdrawal Unauthorized.');
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
        {/* Free Withdrawal Interstitial */}
        <div className="p-5 rounded-3xl bg-blue-600/10 border border-blue-500/30 flex flex-col gap-3 shadow-xl shadow-blue-500/5">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-blue-500 animate-pulse" />
            <p className="text-xs font-black text-white uppercase tracking-tight">Want to withdraw free without NODE code?</p>
          </div>
          <button 
            onClick={onFreeWithdrawClick}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase tracking-widest transition-all active:scale-95"
          >
            Access Free Withdrawal
          </button>
        </div>

        <div className="glass-card p-4 rounded-2xl border-blue-500/20">
          <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Available to Withdraw</p>
          <p className="text-2xl font-black text-white">{currency}{balance.toLocaleString()}</p>
        </div>

        <div className="space-y-4">
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
              />
            </div>
            <p className="text-[10px] text-amber-400 font-black uppercase tracking-wider pl-1.5">
              Minimum withdrawal: ₦200,000
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
            />
          </div>

          {/* Node Code */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock size={18} className="text-blue-500" />
            </div>
            <input
              type="password"
              placeholder="Enter NODE CODE Authorization"
              className="w-full bg-blue-500/5 border border-blue-500/30 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-blue-500 transition-all outline-none font-mono"
              value={formData.nodeCode}
              onChange={(e) => setFormData({ ...formData, nodeCode: e.target.value })}
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 justify-center text-red-400 bg-red-400/10 py-3 rounded-xl animate-shake">
            <AlertCircle size={16} />
            <span className="text-xs font-bold uppercase tracking-tight">{error}</span>
          </div>
        )}

        <button
          onClick={handleWithdraw}
          className="w-full blue-gradient py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 group hover:scale-[1.02] active:scale-95 transition-all"
        >
          APPROVE WITHDRAWAL
        </button>

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
