
import React, { useState } from 'react';
import { ArrowLeft, Users, Copy, Check, ShieldCheck, Zap, Share2 } from 'lucide-react';

interface FreeWithdrawalPageProps {
  onBack: () => void;
}

const FreeWithdrawalPage: React.FC<FreeWithdrawalPageProps> = ({ onBack }) => {
  const [copied, setCopied] = useState(false);
  const referralLink = "easypay-wallet-reff.netlify.app";
  const requiredReferrals = 50;
  const currentReferrals = 0;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fadeIn pb-24">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
          <ArrowLeft size={24} className="text-gray-400" />
        </button>
        <h2 className="text-xl font-black italic tracking-wider text-blue-500 uppercase">FREE WITHDRAWAL</h2>
      </div>

      <div className="space-y-6">
        <div className="glass-card p-8 rounded-[2.5rem] border-blue-500/20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          
          <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Users size={40} className="text-blue-500" />
          </div>

          <h3 className="text-2xl font-black text-white mb-2">Unlock Free Access</h3>
          <p className="text-gray-400 text-xs leading-relaxed mb-8 px-2">
            Invite 50 active users to the Easy Wallet ecosystem to bypass the NODE CODE security requirement permanently.
          </p>

          <div className="bg-white/5 p-6 rounded-3xl border border-white/5 mb-8">
            <div className="flex justify-between items-end mb-3">
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Referral Progress</span>
              <span className="text-sm font-black text-blue-500">{currentReferrals} / {requiredReferrals}</span>
            </div>
            <div className="w-full h-3 bg-black rounded-full overflow-hidden border border-white/5 p-0.5">
              <div 
                className="h-full blue-gradient rounded-full transition-all duration-500"
                style={{ width: `${(currentReferrals / requiredReferrals) * 100}%` }}
              ></div>
            </div>
            <p className="text-[9px] text-blue-400 font-black uppercase tracking-widest mt-4 animate-pulse">
              Liquidity Bridge Pending...
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Your Referral Bridge Link</p>
            <div 
              onClick={handleCopy}
              className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 flex items-center justify-between group cursor-pointer hover:border-blue-500/50 transition-all"
            >
              <span className="text-xs font-bold text-blue-300 truncate mr-4">{referralLink}</span>
              <div className="shrink-0 text-gray-500 group-hover:text-blue-500 transition-colors">
                {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
              </div>
            </div>
            {copied && <p className="text-[9px] text-green-500 font-black uppercase tracking-[0.2em] animate-fadeIn">Link Copied to Clipboard!</p>}
          </div>
        </div>

        {/* Trust Message Section */}
        <div className="p-6 rounded-3xl bg-blue-600/5 border border-blue-500/20 relative overflow-hidden">
          <div className="absolute top-4 right-4 opacity-10">
            <ShieldCheck size={48} className="text-blue-500" />
          </div>
          <h4 className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <Zap size={12} /> Secure Protocol Trust Message
          </h4>
          <p className="text-[11px] text-gray-400 font-medium leading-relaxed italic pr-8">
            "Easy Wallet's decentralized protocol rewards community growth. By inviting 50 active nodes to the ecosystem, your account bypasses the standard NODE CODE requirement through our verified Liquidity Bridge Protocol. This ensures network integrity while granting you absolute financial freedom."
          </p>
        </div>
        
        <button
          onClick={handleCopy}
          className="w-full blue-gradient py-5 rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 transition-all active:scale-95 text-white"
        >
          <Share2 size={20} />
          COPY LINK & START INVITING
        </button>

        <p className="text-[9px] text-center text-gray-600 uppercase tracking-widest leading-relaxed px-6">
          System verification is automated. Do not use bots or fake accounts, as this will trigger a permanent node suspension.
        </p>
      </div>
    </div>
  );
};

export default FreeWithdrawalPage;
