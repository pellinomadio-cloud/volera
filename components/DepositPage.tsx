import React, { useState, useEffect } from 'react';
import { ArrowLeft, Landmark, Copy, CheckCircle2, Clock, UploadCloud, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';
import { authService } from '../services/authService';

interface DepositPageProps {
  onBack: () => void;
  user: UserProfile;
}

export const DepositPage: React.FC<DepositPageProps> = ({ onBack, user }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [amount, setAmount] = useState<string>('');
  const [copiedText, setCopiedText] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Settings state
  const [settings, setSettings] = useState({
    bankName: 'Moniepoint Bank',
    accountNumber: '8164299246',
    accountName: 'Volerapay Node Ledger Services'
  });

  // Proof state
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofBase64, setProofBase64] = useState<string>('');
  const [activePendingRequest, setActivePendingRequest] = useState<any | null>(null);
  const [loadingPendingCheck, setLoadingPendingCheck] = useState(true);

  const checkPendingDeposit = async () => {
    setLoadingPendingCheck(true);
    if (user.email) {
      const pending = await authService.getActivePendingDepositRequest(user.email);
      setActivePendingRequest(pending);
    }
    const s = await authService.getAppSettings();
    setSettings({
      bankName: s.bankName,
      accountNumber: s.accountNumber,
      accountName: s.accountName
    });
    setLoadingPendingCheck(false);
  };

  useEffect(() => {
    checkPendingDeposit();
  }, [user.email]);

  const handleNextStep = () => {
    const numAmt = Number(amount);
    if (isNaN(numAmt) || numAmt <= 0) {
      setErrorMessage("Please enter a valid deposit amount.");
      return;
    }
    if (numAmt < 1000) {
      setErrorMessage("Minimum deposit is ₦1,000.");
      return;
    }
    setErrorMessage(null);
    setStep(2);
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(settings.accountNumber);
    setCopiedText(true);
    setShowWarningModal(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProofFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitProof = async () => {
    if (!proofBase64) {
      setErrorMessage("Please choose or upload a screenshot of your payment receipt first.");
      return;
    }
    setErrorMessage(null);
    setSubmitting(true);

    const success = await authService.submitDepositRequest({
      email: user.email || '',
      username: user.name || 'Anonymous',
      amount: Number(amount),
      proofBase64: proofBase64
    });

    if (success) {
      await checkPendingDeposit();
      setSuccessMsg("Deposit proof submitted successfully! Awaiting validation.");
    } else {
      setErrorMessage("Failed to submit proof. Please try again.");
    }
    setSubmitting(false);
  };

  if (loadingPendingCheck) {
    return (
      <div className="py-12 text-center text-white flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
          Syncing Ledger Node Credentials...
        </p>
      </div>
    );
  }

  // Active Pending Screen
  if (activePendingRequest) {
    const submittedDate = new Date(activePendingRequest.submittedAt).toLocaleString();
    return (
      <div className="py-2 animate-fadeIn text-white max-w-md mx-auto">
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={onBack} 
            className="p-1.5 hover:bg-white/5 rounded-xl transition-colors border border-white/5"
          >
            <ArrowLeft size={18} className="text-gray-400" />
          </button>
          <div>
            <h2 className="text-base font-black italic tracking-widest text-blue-400 uppercase">PROCESSING DEPOSIT</h2>
            <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest">Awaiting Ledger Verification</p>
          </div>
        </div>

        {/* Pending Card */}
        <div className="relative rounded-[2rem] p-6 mb-6 overflow-hidden border border-blue-500/20 bg-gradient-to-br from-[#0a122c]/40 via-[#050917]/20 to-[#02040a] text-center">
          <div className="w-12 h-12 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mx-auto mb-4 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Clock size={16} className="text-blue-400 animate-pulse" />
            </div>
          </div>
          <h3 className="text-sm font-black text-blue-400 uppercase tracking-wider mb-2">
            PENDING LEDGER CLEARANCE
          </h3>
          <p className="text-[10px] text-gray-300 leading-relaxed font-semibold px-4">
            Your transfer payment of <span className="text-blue-400">₦{activePendingRequest.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span> is currently undergoing manual and smart node security review.
          </p>
          <p className="text-[8px] text-gray-500 uppercase font-black tracking-wider mt-3">
            Funds will be credited to your dashboard main balance once confirmed.
          </p>
        </div>

        {/* Ledger Details */}
        <div className="rounded-[2rem] p-5 mb-6 border border-white/5 bg-gradient-to-b from-[#0c0c14] to-[#040406] space-y-3.5">
          <div className="flex items-center gap-2 text-blue-400 border-b border-white/5 pb-2">
            <Landmark size={13} />
            <span className="text-[10px] font-black uppercase tracking-wider">Transaction Ledger Details</span>
          </div>

          <div className="space-y-3 font-medium">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-gray-500 uppercase font-bold">Deposit ID</span>
              <span className="text-white font-mono text-[9px]">{activePendingRequest.id}</span>
            </div>
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-gray-500 uppercase font-bold">Submitted At</span>
              <span className="text-white">{submittedDate}</span>
            </div>
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-gray-500 uppercase font-bold">Status</span>
              <span className="px-2 py-0.5 bg-blue-500/15 border border-blue-500/20 text-blue-400 font-black uppercase text-[8px] tracking-widest rounded-full">
                PROCESSING
              </span>
            </div>
          </div>
        </div>

        {/* Proof Preview */}
        {activePendingRequest.proofBase64 && (
          <div className="rounded-[2rem] p-5 border border-white/5 bg-gradient-to-b from-white/[0.01] to-[#040406] space-y-3">
            <span className="text-[8px] text-gray-500 uppercase font-black tracking-widest block">Submitted Receipt Proof</span>
            <div className="rounded-2xl overflow-hidden max-h-48 border border-white/5 bg-black/20 flex justify-center p-2">
              <img src={activePendingRequest.proofBase64} alt="Submitted Receipt" className="object-contain max-h-full rounded-lg" referrerPolicy="no-referrer" />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="py-2 animate-fadeIn text-white max-w-md mx-auto">
      {/* Page Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={step === 2 ? () => setStep(1) : onBack} 
          className="p-1.5 hover:bg-white/5 rounded-xl transition-colors border border-white/5"
        >
          <ArrowLeft size={18} className="text-gray-400" />
        </button>
        <div>
          <h2 className="text-base font-black italic tracking-widest text-blue-400 uppercase">FUND WALLET</h2>
          <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest">Step {step} of 2</p>
        </div>
      </div>

      {step === 1 ? (
        <div className="space-y-6">
          <div className="rounded-[2.2rem] p-6 border border-white/5 bg-gradient-to-br from-zinc-900/60 to-black/80 shadow-xl relative overflow-hidden">
            <div className="absolute -right-24 -bottom-24 w-48 h-48 rounded-full bg-blue-500/[0.03] blur-[40px] pointer-events-none"></div>
            
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Enter Deposit Amount</p>
            <div className="relative flex items-center border border-white/10 rounded-2xl bg-black/40 px-4 focus-within:border-blue-500/50 transition-colors">
              <span className="text-xl font-black text-blue-400 select-none mr-2">₦</span>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setErrorMessage(null);
                }}
                className="w-full bg-transparent border-0 text-white font-black text-lg py-4 focus:ring-0 focus:outline-none placeholder-zinc-700 font-mono"
              />
            </div>
            
            <div className="flex items-center gap-2 mt-4 text-[10px] text-gray-500 font-medium">
              <AlertCircle size={12} className="text-zinc-600 shrink-0" />
              <span>Funds will automatically update your dashboard balance after node validation.</span>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-semibold uppercase tracking-wider text-center">
              {errorMessage}
            </div>
          )}

          <button
            onClick={handleNextStep}
            className="w-full py-4 rounded-[1.6rem] bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:brightness-110 text-white font-black text-[11px] uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all border border-blue-400/25 flex items-center justify-center gap-2"
          >
            Proceed to Transfer
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Bank instructions card */}
          <div className="rounded-[2.2rem] p-6 border border-white/5 bg-gradient-to-br from-zinc-900/60 to-black/80 shadow-xl space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-blue-400 pb-2 border-b border-white/5 flex items-center gap-2">
              <Landmark size={14} /> Transfer Instructions
            </h3>
            
            <p className="text-[10px] text-gray-400 leading-relaxed font-semibold">
              Please transfer exactly <span className="text-white font-black">₦{Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span> to the authorized secure company ledger account listed below:
            </p>

            <div className="space-y-3 pt-1">
              <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-3">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-gray-500 uppercase font-bold">Bank Name</span>
                  <span className="text-white font-black uppercase">{settings.bankName}</span>
                </div>
                
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-gray-500 uppercase font-bold">Account Name</span>
                  <span className="text-white font-black uppercase text-right max-w-[200px] leading-tight">{settings.accountName}</span>
                </div>

                <div className="flex justify-between items-center text-[10px] border-t border-white/5 pt-2">
                  <span className="text-gray-500 uppercase font-bold">Account Number</span>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400 font-mono font-black text-sm">{settings.accountNumber}</span>
                    <button
                      onClick={handleCopyAccount}
                      className="p-1 hover:bg-white/5 rounded-lg border border-white/5 text-zinc-400 hover:text-white transition-all"
                    >
                      {copiedText ? (
                        <span className="text-[8px] bg-green-500/20 text-green-400 px-1 py-0.5 rounded font-black uppercase">Copied</span>
                      ) : (
                        <Copy size={12} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Screenshot / receipt proof uploader */}
          <div className="rounded-[2.2rem] p-6 border border-white/5 bg-gradient-to-br from-zinc-900/60 to-black/80 shadow-xl space-y-4 relative overflow-hidden">
            <h3 className="text-xs font-black uppercase tracking-widest text-blue-400 pb-1 flex items-center gap-2">
              <UploadCloud size={14} /> Upload Payment Receipt
            </h3>
            
            <div className="relative border-2 border-dashed border-white/10 rounded-2xl p-6 text-center hover:border-blue-500/30 transition-colors bg-black/20 group">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                  <UploadCloud size={20} />
                </div>
                {proofFile ? (
                  <div>
                    <p className="text-[10px] font-black text-green-400 uppercase tracking-wider">{proofFile.name}</p>
                    <p className="text-[8px] text-gray-500 uppercase font-bold">Click or drag to replace screenshot</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-wider">Choose or Drag Receipt</p>
                    <p className="text-[8px] text-gray-500 uppercase font-bold mt-0.5">Supports PNG, JPG, or Screenshots</p>
                  </div>
                )}
              </div>
            </div>

            {proofBase64 && (
              <div className="rounded-xl overflow-hidden max-h-32 border border-white/5 bg-black/40 p-2 flex justify-center">
                <img src={proofBase64} alt="Receipt Preview" className="object-contain max-h-full rounded-lg" referrerPolicy="no-referrer" />
              </div>
            )}
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-semibold uppercase tracking-wider text-center">
              {errorMessage}
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-wider text-center">
              {successMsg}
            </div>
          )}

          <button
            onClick={handleSubmitProof}
            disabled={submitting}
            className="w-full py-4 rounded-[1.6rem] bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:brightness-110 disabled:brightness-75 text-white font-black text-[11px] uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all border border-blue-400/25 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              'Submit Deposit Proof'
            )}
          </button>
        </div>
      )}

      {/* OPay / PalmPay Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn" id="deposit-warning-modal">
          <div className="bg-[#0f0404] border border-red-500/30 rounded-[2rem] p-6 max-w-sm w-full space-y-4 shadow-2xl shadow-red-500/10">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto animate-bounce">
              <AlertCircle size={24} />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-sm font-black uppercase tracking-wider text-red-500">
                Critical Payment Warning!
              </h3>
              <p className="text-[10.5px] text-gray-300 leading-relaxed font-semibold">
                You have copied the company account number. Please follow this safety rule carefully:
              </p>
              <div className="bg-red-500/5 rounded-2xl p-3 border border-red-500/10 text-[9.5px] text-gray-300 leading-relaxed space-y-1.5 text-left">
                <p className="font-bold text-red-400 uppercase tracking-wider">
                  ⚠️ DO NOT PAY WITH OPAY OR PALMPAY
                </p>
                <p>
                  OPay and PalmPay transfers are currently restricted and will <strong className="text-white">NOT</strong> be processed or credited to your balance.
                </p>
                <p className="text-emerald-400 font-bold uppercase tracking-wider">
                  ✓ OTHER BANKS ARE FULLY ALLOWED:
                </p>
                <p className="text-gray-400">
                  You can pay using GTBank, Access Bank, Zenith Bank, Kuda, Moniepoint, or any other licensed commercial banks.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowWarningModal(false)}
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-red-600/25"
              id="deposit-warning-dismiss"
            >
              I Understand
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
