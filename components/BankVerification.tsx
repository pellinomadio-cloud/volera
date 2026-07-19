import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Check, Loader2, AlertCircle, CheckCircle2, Landmark, Hash, User } from 'lucide-react';

export interface BankItem {
  name: string;
  code: string;
}

export const BANK_LIST: BankItem[] = [
  { name: 'Access Bank', code: '044' },
  { name: 'Zenith Bank', code: '057' },
  { name: 'GTBank', code: '058' },
  { name: 'First Bank', code: '011' },
  { name: 'United Bank for Africa (UBA)', code: '033' },
  { name: 'Kuda Bank', code: '50211' },
  { name: 'Moniepoint', code: '50515' },
  { name: 'OPay', code: '999992' },
  { name: 'PalmPay', code: '999991' }
];

interface BankVerificationProps {
  onUpdate: (data: { bank: string; accountNumber: string; accountName: string; isValid: boolean }) => void;
  disabled?: boolean;
  initialBank?: string;
  initialAccountNumber?: string;
  initialAccountName?: string;
}

export const BankVerification: React.FC<BankVerificationProps> = ({
  onUpdate,
  disabled = false,
  initialBank = '',
  initialAccountNumber = '',
  initialAccountName = ''
}) => {
  const [accountNumber, setAccountNumber] = useState(initialAccountNumber);
  const [selectedBank, setSelectedBank] = useState<BankItem | null>(
    BANK_LIST.find((b) => b.name === initialBank) || null
  );
  const [accountName, setAccountName] = useState(initialAccountName);

  // Searchable dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Verification state
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  // Keep track of the last verified parameters to prevent duplicate requests
  const lastVerifiedParams = useRef<{ code: string; number: string }>({ code: '', number: '' });

  // Filter banks based on search
  const filteredBanks = BANK_LIST.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle clicking outside searchable dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Main verification engine
  const verifyAccount = async (bankCode: string, bankName: string, accNum: string) => {
    if (isVerifying) return;

    // Check if we already verified these exact parameters
    if (lastVerifiedParams.current.code === bankCode && lastVerifiedParams.current.number === accNum) {
      return;
    }

    setIsVerifying(true);
    setVerificationError(null);
    setVerificationSuccess(false);

    try {
      const params = new URLSearchParams();
      params.append('bank_code', bankCode);
      params.append('account_number', accNum);

      const response = await fetch('https://api.wtproject.space/vrf/verify.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const resultText = (await response.text()).trim();

      if (resultText.toLowerCase().includes('error') || resultText.startsWith('Error:')) {
        const cleanError = resultText.replace(/^error:\s*/i, '');
        setVerificationError(cleanError || 'Verification failed. Invalid account.');
        setAccountName('');
        onUpdate({
          bank: bankName,
          accountNumber: accNum,
          accountName: '',
          isValid: false
        });
      } else if (resultText) {
        setAccountName(resultText);
        setVerificationSuccess(true);
        lastVerifiedParams.current = { code: bankCode, number: accNum };
        onUpdate({
          bank: bankName,
          accountNumber: accNum,
          accountName: resultText,
          isValid: true
        });
      } else {
        setVerificationError('Invalid response from verification server.');
        setAccountName('');
        onUpdate({
          bank: bankName,
          accountNumber: accNum,
          accountName: '',
          isValid: false
        });
      }
    } catch (err) {
      console.error('Account verification error:', err);
      setVerificationError('Connection timeout. Please check your network.');
      setAccountName('');
      onUpdate({
        bank: bankName,
        accountNumber: accNum,
        accountName: '',
        isValid: false
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Run auto-verification when criteria are met (Bank selected & 10-digit number reached)
  useEffect(() => {
    const cleanNum = accountNumber.replace(/\D/g, '');
    if (cleanNum.length === 10 && selectedBank) {
      verifyAccount(selectedBank.code, selectedBank.name, cleanNum);
    } else {
      // Reset verification states if input is no longer 10 digits or no bank selected
      setVerificationSuccess(false);
      setVerificationError(null);
      if (accountName) {
        setAccountName('');
        onUpdate({
          bank: selectedBank?.name || '',
          accountNumber: cleanNum,
          accountName: '',
          isValid: false
        });
      }
    }
  }, [accountNumber, selectedBank]);

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setAccountNumber(val);
    onUpdate({
      bank: selectedBank?.name || '',
      accountNumber: val,
      accountName: val.length === 10 && verificationSuccess ? accountName : '',
      isValid: val.length === 10 && verificationSuccess
    });
  };

  return (
    <div className="space-y-4" id="bank-verification-container">
      {/* 1. Searchable Bank Dropdown */}
      <div className="space-y-1" ref={dropdownRef}>
        <label className="text-[8px] font-black uppercase tracking-widest text-gray-500 pl-1">
          Destination Bank
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <Landmark size={14} className="text-gray-500" />
          </div>
          
          <button
            type="button"
            disabled={disabled}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`w-full bg-black/40 border ${
              isDropdownOpen ? 'border-blue-500' : 'border-white/10'
            } rounded-2xl py-3.5 pl-11 pr-10 text-xs text-left text-white focus:outline-none transition-all flex items-center justify-between disabled:opacity-40 disabled:pointer-events-none`}
            id="bank-searchable-trigger"
          >
            <span className={selectedBank ? 'text-white font-semibold' : 'text-gray-500'}>
              {selectedBank ? selectedBank.name : 'Select Destination Bank'}
            </span>
            <ChevronDown size={14} className={`text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-blue-500' : ''}`} />
          </button>

          {/* Dropdown Box */}
          {isDropdownOpen && (
            <div className="absolute top-[105%] left-0 right-0 bg-[#0c0404] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fadeIn" id="bank-dropdown-menu">
              {/* Search input */}
              <div className="p-3 border-b border-white/5 relative">
                <Search size={12} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search popular banks..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-gray-500 outline-none focus:border-blue-500 transition-all font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  id="bank-search-input"
                  autoFocus
                />
              </div>

              {/* Items List */}
              <div className="max-h-48 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-white/10">
                {filteredBanks.length > 0 ? (
                  filteredBanks.map((bank) => (
                    <button
                      key={bank.code}
                      type="button"
                      onClick={() => {
                        setSelectedBank(bank);
                        setIsDropdownOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full text-left px-4 py-3 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-all flex items-center justify-between font-semibold border-b border-white/[0.02] last:border-0"
                    >
                      <span>{bank.name}</span>
                      {selectedBank?.code === bank.code && (
                        <Check size={12} className="text-blue-500" />
                      )}
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-gray-500 font-bold uppercase tracking-wider">
                    No matching bank found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Account Number Input */}
      <div className="space-y-1">
        <label className="text-[8px] font-black uppercase tracking-widest text-gray-500 pl-1">
          Account Number (10 Digits)
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Hash size={14} className="text-gray-500" />
          </div>
          <input
            type="text"
            pattern="\d*"
            maxLength={10}
            disabled={disabled}
            placeholder="Enter 10-Digit Account Number"
            className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-11 pr-12 text-xs text-white placeholder-gray-500 outline-none focus:border-blue-500 transition-all font-semibold disabled:opacity-40"
            value={accountNumber}
            onChange={handleNumberChange}
            id="bank-account-input"
          />
          {/* Real-time Inline loader inside input */}
          {isVerifying && (
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <Loader2 size={14} className="text-blue-500 animate-spin" />
            </div>
          )}
          {verificationSuccess && (
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <CheckCircle2 size={14} className="text-emerald-400" />
            </div>
          )}
        </div>
      </div>

      {/* 3. Account Name Verification Alert / Status */}
      {isVerifying && (
        <div className="flex items-center gap-2 px-4 py-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 animate-pulse" id="verification-status-loading">
          <Loader2 size={12} className="animate-spin shrink-0" />
          <span className="text-[9px] font-black uppercase tracking-wider">
            Verifying bank credentials with CBN node...
          </span>
        </div>
      )}

      {verificationError && (
        <div className="flex items-start gap-2.5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 animate-fadeIn" id="verification-status-error">
          <AlertCircle size={13} className="shrink-0 mt-0.5" />
          <div className="text-left">
            <p className="text-[9px] font-black uppercase tracking-wider mb-0.5">Verification Error</p>
            <p className="text-[8.5px] leading-relaxed font-bold text-gray-300">
              {verificationError}
            </p>
          </div>
        </div>
      )}

      {verificationSuccess && accountName && (
        <div className="flex items-start gap-2.5 px-4 py-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 animate-fadeIn" id="verification-status-success">
          <CheckCircle2 size={13} className="shrink-0 mt-0.5" />
          <div className="text-left flex-1">
            <p className="text-[8px] font-black uppercase tracking-widest text-emerald-500 mb-0.5">
              Verified Account Holder
            </p>
            <p className="text-xs font-black uppercase text-white tracking-wide">
              {accountName}
            </p>
          </div>
        </div>
      )}

      {/* Fallback field if manual input is required (only when verified, shown as readonly) */}
      {accountName && (
        <div className="space-y-1 animate-fadeIn">
          <label className="text-[8px] font-black uppercase tracking-widest text-gray-500 pl-1">
            Account Name (Auto-Populated)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User size={14} className="text-emerald-400" />
            </div>
            <input
              type="text"
              readOnly
              className="w-full bg-emerald-500/5 border border-emerald-500/20 rounded-2xl py-3.5 pl-11 pr-4 text-xs font-black text-emerald-400 tracking-wide outline-none select-none"
              value={accountName}
            />
          </div>
        </div>
      )}
    </div>
  );
};
