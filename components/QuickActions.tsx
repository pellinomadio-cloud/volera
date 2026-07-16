
import React from 'react';
import { ShoppingBag, PlayCircle, Radio, Headset, Globe, UserPlus } from 'lucide-react';
import { motion } from 'motion/react';

interface QuickActionsProps {
  onActionClick: (id: string) => void;
}

const actions = [
  { id: 'node', icon: ShoppingBag, label: 'Buy NODE', accent: 'amber', color: 'text-amber-400 group-hover:text-amber-300' },
  { id: 'video', icon: PlayCircle, label: 'Video', accent: 'blue', color: 'text-blue-400 group-hover:text-blue-300' },
  { id: 'broadcast', icon: Radio, label: 'Broadcast', accent: 'amber', color: 'text-amber-400 group-hover:text-amber-300' },
  { id: 'support', icon: Headset, label: 'Support', accent: 'blue', color: 'text-blue-400 group-hover:text-blue-300' },
  { id: 'community', icon: Globe, label: 'Community', accent: 'amber', color: 'text-amber-400 group-hover:text-amber-300' },
  { id: 'invite', icon: UserPlus, label: 'Invite', accent: 'blue', color: 'text-blue-400 group-hover:text-blue-300' },
];

const QuickActions: React.FC<QuickActionsProps> = ({ onActionClick }) => {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {actions.map((action, idx) => (
        <motion.button 
          key={action.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ 
            scale: 1.04, 
            backgroundColor: 'rgba(255,255,255,0.02)',
            borderColor: action.accent === 'amber' ? 'rgba(245,158,11,0.25)' : 'rgba(59,130,246,0.25)',
            boxShadow: action.accent === 'amber' ? '0 0 15px rgba(245,158,11,0.08)' : '0 0 15px rgba(59,130,246,0.08)'
          }}
          whileTap={{ scale: 0.96 }}
          onClick={() => onActionClick(action.id)}
          className={`flex flex-col items-center justify-center py-4 px-2 rounded-2xl glass-card border border-white/5 transition-all group relative overflow-hidden`}
        >
          {/* Subtle localized ambient backdrop blur */}
          <div className={`absolute -top-10 -right-10 w-16 h-16 rounded-full blur-xl opacity-20 pointer-events-none transition-all duration-300 ${
            action.accent === 'amber' ? 'bg-amber-500 group-hover:opacity-40' : 'bg-blue-500 group-hover:opacity-40'
          }`}></div>

          <div className="mb-2.5 p-2 rounded-xl bg-white/[0.02] border border-white/5 group-hover:border-white/10 transition-colors">
            <action.icon size={18} className={`${action.color} transition-colors duration-300`} />
          </div>
          <span className="text-[10px] font-bold text-gray-400 group-hover:text-white transition-colors tracking-wide">
            {action.label}
          </span>
        </motion.button>
      ))}
    </div>
  );
};

export default QuickActions;
