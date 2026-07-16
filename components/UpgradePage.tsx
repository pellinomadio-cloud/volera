import React, { useState } from 'react';
import { ArrowLeft, Check, Sparkles, ShieldAlert, Award, Star, Zap, Cpu, Crown } from 'lucide-react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';

interface UpgradePageProps {
  onBack: () => void;
  user: UserProfile;
  onUpgradeSuccess: (newLevel: number, cost: number) => void;
}

interface UpgradeTier {
  level: number;
  name: string;
  price: number;
  icon: typeof Award;
  color: string;
  borderColor: string;
  glowColor: string;
  benefits: string[];
}

const UPGRADE_TIERS: UpgradeTier[] = [
  {
    level: 1,
    name: 'Level 1: Standard Node',
    price: 0,
    icon: Cpu,
    color: 'from-blue-600/20 via-blue-900/10 to-transparent',
    borderColor: 'border-blue-500/20',
    glowColor: 'rgba(59,130,246,0.1)',
    benefits: [
      'Basic wallet transactions',
      'Daily target limit: ₦5,000',
      'Standard job pool (Up to ₦14,900/job)',
      'Withdrawal speed: 24-48 Hours'
    ]
  },
  {
    level: 2,
    name: 'Level 2: Bronze Validator',
    price: 5000,
    icon: Zap,
    color: 'from-amber-600/25 via-[#251b0a] to-[#040814]',
    borderColor: 'border-amber-600/30',
    glowColor: 'rgba(245,158,11,0.15)',
    benefits: [
      'Access to Tier-2 Verified Jobs',
      'Daily target limit: ₦15,000',
      'Earn +15% more per completed task',
      'Priority tunnel speed (12-24 Hours)'
    ]
  },
  {
    level: 3,
    name: 'Level 3: Silver Master-Node',
    price: 12000,
    icon: Star,
    color: 'from-slate-400/20 via-[#10192e] to-[#040814]',
    borderColor: 'border-slate-400/30',
    glowColor: 'rgba(148,163,184,0.15)',
    benefits: [
      'Access to Tier-3 Premium Jobs',
      'Daily target limit: ₦40,000',
      'Earn +30% more per completed task',
      'Withdrawal clearance in under 6 hours',
      'Reduced network fees by 50%'
    ]
  },
  {
    level: 4,
    name: 'Level 4: Gold Quantum Ledger',
    price: 25000,
    icon: Crown,
    color: 'from-yellow-500/25 via-[#2d2208] to-[#040814]',
    borderColor: 'border-yellow-400/40 hover:border-yellow-300',
    glowColor: 'rgba(234,179,8,0.25)',
    benefits: [
      'Access to Tier-4 VIP high-earning jobs',
      'Daily target limit: ₦100,000',
      'Earn +50% more per completed task',
      'Instant withdrawal via CBN gateway API',
      'Dedicated private support line'
    ]
  },
  {
    level: 5,
    name: 'Level 5: Diamond CBN Nexus',
    price: 50000,
    icon: Sparkles,
    color: 'from-cyan-500/20 via-blue-900/20 to-[#040814]',
    borderColor: 'border-cyan-400/50',
    glowColor: 'rgba(34,211,238,0.3)',
    benefits: [
      'Unlimited high-paying contracts',
      'Unrestricted daily target & volume',
      'Earning multiplier: 2.0x (Double payouts)',
      'Real-time automated withdrawal clearance',
      'Zero fee node transactions',
      'Diamond elite badge on profile'
    ]
  }
];

const UpgradePage: React.FC<UpgradePageProps> = ({ onBack, user, onUpgradeSuccess }) => {
  const currentLevel = user.level || 1;
  const [loadingTier, setLoadingTier] = useState<number | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleUpgrade = (tier: UpgradeTier) => {
    if (tier.level <= currentLevel) {
      setFeedbackMsg({
        type: 'error',
        text: `You already hold the ${tier.name} or a higher level account.`
      });
      return;
    }

    setLoadingTier(tier.level);
    setFeedbackMsg(null);

    setTimeout(() => {
      if (user.balance >= tier.price) {
        onUpgradeSuccess(tier.level, tier.price);
        setFeedbackMsg({
          type: 'success',
          text: `Congratulations! Successfully upgraded to ${tier.name}! ₦${tier.price.toLocaleString()} debited.`
        });
      } else {
        // Offer simulation/bypass option for preview purposes, or alert them
        setFeedbackMsg({
          type: 'error',
          text: `Insufficient Volera balance (Requires ₦${tier.price.toLocaleString()}). Please complete more jobs or top up node balance.`
        });
      }
      setLoadingTier(null);
    }, 1800);
  };

  return (
    <div className="py-2 animate-fadeIn text-white">
      {/* Page Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={onBack} 
          className="p-1.5 hover:bg-white/5 rounded-xl transition-colors border border-white/5"
        >
          <ArrowLeft size={18} className="text-gray-400" />
        </button>
        <div>
          <h2 className="text-base font-black italic tracking-widest text-amber-400 uppercase">WALLET SECURE UPGRADE</h2>
          <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest">Active Level: Level {currentLevel}</p>
        </div>
      </div>

      {/* Visual Identity banner */}
      <div className="relative rounded-3xl p-5 mb-6 overflow-hidden border border-amber-500/10 bg-gradient-to-br from-[#091124] to-[#1c1404]">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl animate-pulse"></div>
        <div className="relative z-10">
          <span className="px-2.5 py-0.5 bg-amber-400/15 border border-amber-400/30 text-[8px] font-black text-amber-400 uppercase tracking-widest rounded-full mb-2 inline-block">
            Secure Cryptographic Tiering
          </span>
          <h3 className="text-sm font-black text-white uppercase tracking-wider mb-1.5">
            Increase Your Earning Power
          </h3>
          <p className="text-[9.5px] text-gray-400 leading-relaxed">
            Upgrade your Volera wallet node to bypass gateway rate-limits, unlock higher job payouts, and activate instant CBN ledger withdrawals.
          </p>
        </div>
      </div>

      {feedbackMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl mb-6 text-xs font-bold leading-relaxed border ${
            feedbackMsg.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}
        >
          <div className="flex gap-2.5 items-start">
            <ShieldAlert size={14} className="shrink-0 mt-0.5" />
            <span>{feedbackMsg.text}</span>
          </div>
        </motion.div>
      )}

      {/* Display tiers */}
      <div className="space-y-4 mb-20">
        {UPGRADE_TIERS.map((tier) => {
          const isCurrent = tier.level === currentLevel;
          const isPassed = tier.level < currentLevel;
          const isLocked = tier.level > currentLevel;

          return (
            <motion.div
              key={tier.level}
              whileHover={{ scale: 1.01 }}
              className={`relative rounded-3xl p-5 border transition-all overflow-hidden bg-gradient-to-br ${tier.color} ${
                isCurrent 
                  ? 'border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.15)]' 
                  : tier.borderColor
              }`}
            >
              {/* Gold/blue ambient localized glow */}
              <div 
                className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl pointer-events-none"
                style={{ backgroundColor: tier.glowColor }}
              ></div>

              <div className="flex justify-between items-start mb-3 relative z-10">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl bg-white/[0.02] border border-white/5 ${
                    isCurrent ? 'text-amber-400 border-amber-400/20' : 'text-gray-400'
                  }`}>
                    <tier.icon size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">{tier.name}</h4>
                    <p className="text-[8px] text-gray-500 uppercase font-bold tracking-wider mt-0.5">
                      {isCurrent ? 'Current active tier' : isPassed ? 'Completed' : 'Locked Upgrade'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">
                    {tier.price === 0 ? 'FREE' : `₦${tier.price.toLocaleString()}`}
                  </span>
                </div>
              </div>

              {/* Benefits list */}
              <div className="space-y-1.5 mt-4 border-t border-white/5 pt-3 mb-4 relative z-10">
                {tier.benefits.map((b, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[9.5px] text-gray-400">
                    <Check size={11} className="text-amber-400 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              {isLocked && (
                <button
                  disabled={loadingTier !== null}
                  onClick={() => handleUpgrade(tier)}
                  className="w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 hover:brightness-110 text-black py-2.5 rounded-xl font-black text-[10px] uppercase tracking-wider shadow-lg transition-all border border-amber-300/30 flex items-center justify-center gap-2"
                >
                  {loadingTier === tier.level ? (
                    <>
                      <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      SECURE LOGGING...
                    </>
                  ) : (
                    <>
                      UPGRADE FOR ₦{tier.price.toLocaleString()}
                    </>
                  )}
                </button>
              )}

              {isCurrent && (
                <div className="w-full bg-amber-400/10 border border-amber-400/20 text-amber-400 py-2 rounded-xl text-center text-[9px] font-black uppercase tracking-widest">
                  ACTIVE SECURE SHIELDED NODE
                </div>
              )}

              {isPassed && (
                <div className="w-full bg-white/5 border border-white/10 text-gray-500 py-2 rounded-xl text-center text-[9px] font-black uppercase tracking-widest">
                  COMPLETED PREVIOUS VERSION
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default UpgradePage;
