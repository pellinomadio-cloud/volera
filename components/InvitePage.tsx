
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Share2, MessageCircle, Gift, CheckCircle, Users, Copy, Sparkles, Trophy } from 'lucide-react';
import { authService } from '../services/authService';

interface InvitePageProps {
  onBack: () => void;
  onRewardClaimed: (amount: number) => void;
}

const InvitePage: React.FC<InvitePageProps> = ({ onBack, onRewardClaimed }) => {
  const [shareCount, setShareCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [referrals, setReferrals] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const totalRequired = 5; // Reduced share target for realistic accomplishment

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      
      // Load actual referrals if they exist in the user object
      const userRefList = user.referrals || [];
      setReferrals(userRefList);
    }
  }, []);

  const username = currentUser?.username || "user";
  const refCode = `VOLERA-${username.toUpperCase()}`;
  const inviteLink = `https://volerapay.ng/register?ref=${refCode}`;
  const shareMessage = encodeURIComponent(`Hi! Join Volerapay, the premium digital ledger system with 0-fee withdrawals. Register now using my referral code ${refCode} to start checking your secure node: ${inviteLink}`);

  const handleShare = () => {
    if (shareCount < totalRequired) {
      // Open WhatsApp
      window.open(`https://wa.me/?text=${shareMessage}`, '_blank');
      
      const newCount = shareCount + 1;
      setShareCount(newCount);
      
      if (newCount === totalRequired) {
        setIsCompleted(true);
      }
    }
  };

  const copyToClipboard = (text: string, isLink: boolean) => {
    navigator.clipboard.writeText(text);
    if (isLink) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleClaimReward = () => {
    // Claim sharing bonus
    onRewardClaimed(25000);
    setIsCompleted(false);
    setShareCount(0);
  };

  return (
    <div className="animate-fadeIn pb-24 text-white">
      {/* Back Button and Title */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
          <ArrowLeft size={20} className="text-gray-400" />
        </button>
        <div className="flex flex-col">
          <h2 className="text-sm font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200 uppercase">
            REFERRAL NETWORK
          </h2>
          <span className="text-[8px] text-gray-500 font-black uppercase tracking-wider">Earn real bonuses instantly</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Referral Code Panel */}
        <div className="glass-card p-6 rounded-3xl border border-amber-500/10 bg-gradient-to-b from-amber-500/[0.03] to-transparent relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl"></div>
          
          <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Sparkles size={14} className="text-amber-400 animate-pulse" /> Your Referral Code
          </h3>

          <div className="flex gap-2 mb-4">
            <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
              <span className="font-mono text-sm font-bold tracking-widest text-yellow-200">{refCode}</span>
              <button 
                onClick={() => copyToClipboard(refCode, false)}
                className="p-2 hover:bg-white/5 rounded-xl transition-all text-amber-400 hover:text-amber-300"
              >
                {copiedCode ? <CheckCircle size={16} className="text-emerald-400" /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          <div className="bg-black/40 rounded-2xl p-3 border border-white/5 flex items-center justify-between text-xs">
            <span className="text-gray-400 truncate pr-4 text-[10px] font-mono">{inviteLink}</span>
            <button 
              onClick={() => copyToClipboard(inviteLink, true)}
              className="text-[10px] text-amber-400 font-bold uppercase shrink-0 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 rounded-xl transition-all"
            >
              {copiedLink ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </div>

        {/* WhatsApp Sharing Promotion Card */}
        <div className="glass-card p-6 rounded-3xl border border-white/5 text-center relative overflow-hidden">
          <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Gift size={28} className="text-amber-400" />
          </div>

          <h3 className="text-sm font-black text-white mb-1.5">WhatsApp Share Challenge</h3>
          <p className="text-[10px] text-gray-400 leading-relaxed max-w-[280px] mx-auto mb-5">
            Share your secure link to WhatsApp groups or friends. Reach <span className="text-amber-400 font-bold">{totalRequired} shares</span> to release a locked ₦25,000 Node Bonus.
          </p>

          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 mb-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Share Challenge</span>
              <span className="text-[11px] font-bold text-amber-400">{shareCount} / {totalRequired}</span>
            </div>
            <div className="w-full h-2 bg-black rounded-full overflow-hidden border border-white/5 p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full transition-all duration-500"
                style={{ width: `${(shareCount / totalRequired) * 100}%` }}
              ></div>
            </div>
          </div>

          {!isCompleted ? (
            <button
              onClick={handleShare}
              className="w-full bg-[#25D366] hover:bg-[#20ba5a] py-3.5 rounded-xl font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 text-white"
            >
              <MessageCircle size={16} />
              SHARE LINK ON WHATSAPP
            </button>
          ) : (
            <button
              onClick={handleClaimReward}
              className="w-full bg-gradient-to-r from-amber-400 to-yellow-300 py-3.5 rounded-xl font-black text-xs text-black shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 animate-bounce"
            >
              <Trophy size={16} className="text-black" />
              CLAIM ₦25,000 SYSTEM REWARD
            </button>
          )}
        </div>

        {/* Dynamic Referral Network List */}
        <div className="glass-card p-6 rounded-3xl border border-white/5">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-[10px] text-amber-400 font-black uppercase tracking-[0.15em] flex items-center gap-1.5">
              <Users size={14} /> Active Node Network
            </h4>
            <span className="text-[10px] font-mono font-bold text-gray-500">
              Total Bonus: ₦{ (referrals.length * 10000).toLocaleString() }
            </span>
          </div>

          {referrals.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
              <Users size={24} className="text-gray-600 mx-auto mb-2" />
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">No referred nodes registered yet</p>
              <p className="text-[9px] text-gray-600 mt-1">Friends registering with your code earn you ₦10,000</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {referrals.map((username, idx) => (
                <div key={idx} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-500/10 flex items-center justify-center font-bold text-[9px] text-amber-400 uppercase">
                      {username.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{username}</p>
                      <p className="text-[8px] text-gray-500 uppercase tracking-tighter">Node Registered</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-emerald-400 font-black tracking-tight">+₦10,000</span>
                    <p className="text-[8px] text-gray-500 font-black uppercase">PAID</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Informative Step */}
        <div className="bg-blue-950/20 p-5 rounded-2xl border border-blue-500/10 text-[10px] text-gray-400 space-y-2">
          <p className="font-bold text-blue-400 uppercase tracking-wider">How to earn ₦10,000 per invite:</p>
          <ol className="list-decimal pl-4 space-y-1 leading-relaxed">
            <li>Copy your <span className="text-amber-400 font-bold">Referral Code</span> or invite link and send it to friends.</li>
            <li>When they sign up for Volerapay, make sure they enter your code in the registration form.</li>
            <li>Once they register, <span className="text-emerald-400 font-bold">₦10,000</span> will be added to your ledger instantly!</li>
          </ol>
        </div>

        <p className="text-[8px] text-center text-gray-600 uppercase tracking-widest">
          Node suspension applies to any artificial account duplication.
        </p>
      </div>
    </div>
  );
};

export default InvitePage;
