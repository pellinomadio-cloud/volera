import React, { useState, useEffect } from 'react';
import { ArrowLeft, Landmark, User, Hash, CheckCircle2, AlertCircle, Copy, FileText, Upload, ShieldCheck, CreditCard, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';
import { authService } from '../services/authService';

interface LinkWithdrawAccountPageProps {
  onBack: () => void;
  user: UserProfile;
  onSuccess: () => void;
}

const BANKS = [
  'OPay', 'PalmPay', 'Access Bank', 'Zenith Bank', 'GTBank', 
  'First Bank', 'United Bank for Africa (UBA)', 'Kuda Bank', 'Moniepoint'
];

export const LinkWithdrawAccountPage: React.FC<LinkWithdrawAccountPageProps> = ({ onBack, user, onSuccess }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    accountNumber: '',
    bank: '',
    accountName: ''
  });
  const [error, setError] = useState('');
  const [copiedText, setCopiedText] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofBase64, setProofBase64] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companySettings, setCompanySettings] = useState({
    bankName: 'Moniepoint Bank',
    accountNumber: '8164299246',
    accountName: 'Volerapay Node Ledger Services'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const s = await authService.getAppSettings();
        setCompanySettings({
          bankName: s.bankName,
          accountNumber: s.accountNumber,
          accountName: s.accountName
        });
      } catch (err) {
        console.error("Failed to load app settings in link-account:", err);
      }
    };
    fetchSettings();
  }, []);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.accountNumber.length !== 10 || !/^\d+$/.test(formData.accountNumber)) {
      setError('Account number must be 10 digits');
      return;
    }
    if (!formData.bank) {
      setError('Please select a bank');
      return;
    }
    if (!formData.accountName.trim()) {
      setError('Enter account name');
      return;
    }

    setStep(2);
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(companySettings.accountNumber);
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setProofFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setProofBase64(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setError('Please drop an image file');
      }
    }
  };

  const handleSubmitRequest = async () => {
    setError('');
    if (!proofBase64) {
      setError('Please upload your payment screenshot/receipt');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await authService.updateUserByAdmin(user.email || '', {
        linkingStatus: 'pending',
        linkingDetails: {
          accountNumber: formData.accountNumber,
          bank: formData.bank,
          accountName: formData.accountName,
          proofBase64: proofBase64
        }
      });

      if (success) {
        onSuccess();
      } else {
        setError('Database connection error. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fadeIn max-w-sm mx-auto py-2">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={step === 2 ? () => setStep(1) : onBack} 
          className="p-1.5 hover:bg-white/5 rounded-xl transition-colors border border-white/5"
        >
          <ArrowLeft size={18} className="text-gray-400" />
        </button>
        <div>
          <h2 className="text-sm font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 uppercase">
            LINK SECURE WITHDRAWAL ACCOUNT
          </h2>
          <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest">
            Step {step} of 2 • Authentication Portal
          </p>
        </div>
      </div>

      {step === 1 ? (
        <form onSubmit={handleStep1Submit} className="space-y-5">
          <div className="glass-card p-4 rounded-3xl border-white/5 space-y-4">
            <p className="text-[10px] text-gray-400 leading-relaxed uppercase tracking-wider text-center">
              Enter the bank account details where you wish to receive your withdrawals.
            </p>

            {/* Account Number */}
            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase tracking-widest text-gray-500 pl-1">
                Account Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Hash size={14} className="text-gray-500" />
                </div>
                <input
                  type="text"
                  maxLength={10}
                  required
                  placeholder="10-Digit Account Number"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-xs focus:border-blue-500 transition-all outline-none"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value.replace(/\D/g, '') })}
                />
              </div>
            </div>

            {/* Bank Selection */}
            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase tracking-widest text-gray-500 pl-1">
                Destination Bank
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Landmark size={14} className="text-gray-500" />
                </div>
                <select
                  required
                  className="w-full bg-black border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-xs focus:border-blue-500 transition-all outline-none appearance-none"
                  value={formData.bank}
                  onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
                >
                  <option value="">Select Bank</option>
                  {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>

            {/* Account Name */}
            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase tracking-widest text-gray-500 pl-1">
                Account Holder Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={14} className="text-gray-500" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Enter Account Name"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-xs focus:border-blue-500 transition-all outline-none"
                  value={formData.accountName}
                  onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 bg-red-400/10 py-3 px-4 rounded-xl text-center justify-center">
              <AlertCircle size={14} />
              <span className="text-[10px] font-bold uppercase tracking-tight">{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/10 transition-all active:scale-95"
          >
            PROCEED TO LINKING PAYMENT
          </button>
        </form>
      ) : (
        <div className="space-y-5">
          {/* Step 2 payment instructions */}
          <div className="glass-card p-5 rounded-3xl border-red-500/20 bg-gradient-to-br from-[#120404] via-black to-black space-y-4">
            <div className="flex items-center gap-2 text-red-400 border-b border-white/5 pb-2.5">
              <CreditCard size={15} />
              <span className="text-[10px] font-black uppercase tracking-wider">LINKING COMPLIANCE FEE</span>
            </div>

            <p className="text-[10.5px] text-gray-300 leading-relaxed">
              You are required to pay a linking compliance fee of <span className="text-red-400 font-black">₦28,000</span> to complete the instant crediting protocol.
            </p>
            <p className="text-[10px] text-emerald-400 leading-relaxed font-bold">
              ★ Rest assured: immediately after your account linking request is approved by the admin node, your pending withdrawal will be credited instantly.
            </p>

            <div className="bg-black/60 p-4 rounded-2xl border border-white/5 space-y-2.5">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-gray-500 font-bold uppercase">Compliance Bank</span>
                <span className="text-white font-black">{companySettings.bankName}</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-gray-500 font-bold uppercase">Account Number</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-400 font-mono font-black">{companySettings.accountNumber}</span>
                  <button 
                    onClick={handleCopyAccount}
                    className="p-1 hover:bg-white/10 rounded transition-all text-gray-400 active:scale-90"
                    title="Copy Account Number"
                  >
                    <Copy size={11} className={copiedText ? 'text-green-400' : ''} />
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-gray-500 font-bold uppercase">Account Name</span>
                <span className="text-white font-black text-right max-w-[180px] leading-tight truncate">
                  {companySettings.accountName}
                </span>
              </div>
            </div>
          </div>

          {/* Payment proof upload */}
          <div className="glass-card p-5 rounded-3xl border-white/5 space-y-4">
            <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider text-center">
              UPLOAD PAYMENT RECEIPT
            </p>

            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border border-dashed border-white/10 hover:border-blue-500/30 transition-all rounded-2xl p-6 text-center cursor-pointer bg-black/40 relative overflow-hidden"
            >
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {proofBase64 ? (
                <div className="space-y-2">
                  <img src={proofBase64} alt="Receipt Proof" className="max-h-24 mx-auto rounded-lg object-cover" />
                  <p className="text-[8px] text-emerald-400 font-black uppercase tracking-widest">
                    Receipt Selected successfully • Click to replace
                  </p>
                </div>
              ) : (
                <div className="space-y-2 text-gray-500">
                  <Upload size={20} className="mx-auto text-blue-500/50" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Choose Receipt Screenshot
                  </p>
                  <p className="text-[8px] uppercase tracking-wider text-gray-600">
                    Drag and drop or tap to browse gallery
                  </p>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 bg-red-400/10 py-3 px-4 rounded-xl text-center justify-center">
              <AlertCircle size={14} />
              <span className="text-[10px] font-bold uppercase tracking-tight">{error}</span>
            </div>
          )}

          <button
            onClick={handleSubmitRequest}
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-500 hover:brightness-110 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/10 transition-all flex items-center justify-center gap-1.5 active:scale-95"
          >
            {isSubmitting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                PROCESSING PAYMENT SUBMISSION...
              </>
            ) : (
              'SUBMIT PAYMENT PROOF & LINK ACCOUNT'
            )}
          </button>
        </div>
      )}

      {/* OPay / PalmPay Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn" id="link-warning-modal">
          <div className="bg-[#0f0404] border border-red-500/30 rounded-[2rem] p-6 max-w-sm w-full space-y-4 shadow-2xl shadow-red-500/10 text-white">
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
              id="link-warning-dismiss"
            >
              I Understand
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
