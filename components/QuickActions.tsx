
import React from 'react';
import { Cpu, ArrowUpCircle, Briefcase, Gamepad2, Globe, UserPlus } from 'lucide-react';
import { motion } from 'motion/react';

interface QuickActionsProps {
  onActionClick: (id: string) => void;
}

const actions = [
  { id: 'my-jobs', icon: Cpu, label: 'MY JOB', accent: 'amber', color: 'text-amber-400 group-hover:text-amber-300' },
  { id: 'upgrade', icon: ArrowUpCircle, label: 'Upgrade', accent: 'blue', color: 'text-blue-400 group-hover:text-blue-300' },
  { id: 'jobs', icon: Briefcase, label: 'JOB Portal', accent: 'gold', color: 'text-yellow-400 group-hover:text-yellow-300' },
  { id: 'games', icon: Gamepad2, label: 'Games Arena', accent: 'gold', color: 'text-yellow-400 group-hover:text-yellow-300' },
  { id: 'community', icon: Globe, label: 'Community', accent: 'amber', color: 'text-amber-400 group-hover:text-amber-300' },
  { id: 'invite', icon: UserPlus, label: 'Invite', accent: 'blue', color: 'text-blue-400 group-hover:text-blue-300' },
];

const QuickActions: React.FC<QuickActionsProps> = ({ onActionClick }) => {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {actions.map((action, idx) => {
        const isJob = action.id === 'jobs';
        
        return (
          <motion.button 
            key={action.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ 
              scale: 1.04, 
              backgroundColor: 'rgba(255,255,255,0.02)',
              borderColor: isJob ? 'rgba(234,179,8,0.6)' : action.accent === 'amber' ? 'rgba(245,158,11,0.25)' : 'rgba(59,130,246,0.25)',
              boxShadow: isJob ? '0 0 22px rgba(234,179,8,0.25)' : action.accent === 'amber' ? '0 0 15px rgba(245,158,11,0.08)' : '0 0 15px rgba(59,130,246,0.08)'
            }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onActionClick(action.id)}
            className={`flex flex-col items-center justify-center py-4 px-2 rounded-2xl glass-card transition-all group relative overflow-hidden ${
              isJob 
                ? 'border-2 border-yellow-500/40 bg-gradient-to-br from-[#1c1303] to-[#040814] shadow-[0_0_15px_rgba(234,179,8,0.1)]' 
                : 'border border-white/5'
            }`}
          >
            {/* Subtle localized ambient backdrop blur */}
            <div className={`absolute -top-10 -right-10 w-16 h-16 rounded-full blur-xl opacity-20 pointer-events-none transition-all duration-300 ${
              isJob ? 'bg-yellow-500 animate-pulse group-hover:opacity-40' : action.accent === 'amber' ? 'bg-amber-500 group-hover:opacity-40' : 'bg-blue-500 group-hover:opacity-40'
            }`}></div>

            {/* Shining gold animations for job portal button */}
            {isJob && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>
            )}

            <div className={`mb-2.5 p-2 rounded-xl transition-colors ${
              isJob 
                ? 'bg-yellow-500/10 border border-yellow-500/30' 
                : 'bg-white/[0.02] border border-white/5 group-hover:border-white/10'
            }`}>
              <action.icon size={18} className={`${action.color} transition-colors duration-300 ${isJob ? 'animate-pulse' : ''}`} />
            </div>
            
            <span className={`text-[10px] font-black group-hover:text-white transition-colors tracking-wide ${
              isJob ? 'text-yellow-300' : 'text-gray-400'
            }`}>
              {action.label}
            </span>

            {/* Micro badge for jobs */}
            {isJob && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(234,179,8,1)] animate-ping"></span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default QuickActions;
