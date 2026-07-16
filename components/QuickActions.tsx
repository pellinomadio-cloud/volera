
import React from 'react';
import { ShoppingBag, PlayCircle, Radio, Headset, Globe, UserPlus } from 'lucide-react';

interface QuickActionsProps {
  onActionClick: (id: string) => void;
}

const actions = [
  { id: 'node', icon: ShoppingBag, label: 'Buy NODE', color: 'text-blue-500' },
  { id: 'video', icon: PlayCircle, label: 'Video', color: 'text-blue-500' },
  { id: 'broadcast', icon: Radio, label: 'Broadcast', color: 'text-blue-500' },
  { id: 'support', icon: Headset, label: 'Support', color: 'text-blue-500' },
  { id: 'community', icon: Globe, label: 'Community', color: 'text-blue-500' },
  { id: 'invite', icon: UserPlus, label: 'Invite', color: 'text-blue-500' },
];

const QuickActions: React.FC<QuickActionsProps> = ({ onActionClick }) => {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {actions.map((action) => (
        <button 
          key={action.id}
          onClick={() => onActionClick(action.id)}
          className="flex flex-col items-center justify-center py-4 px-2 rounded-2xl glass-card transition-all hover:bg-white/5 active:scale-95 group"
        >
          <div className="mb-2">
            <action.icon size={20} className={action.color} />
          </div>
          <span className="text-[10px] font-semibold text-gray-300 tracking-tight">
            {action.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
