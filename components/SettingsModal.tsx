
import React, { useState } from 'react';
import { X, User, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  onUpdate: (newName: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentName, onUpdate }) => {
  const [newName, setNewName] = useState(currentName);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    if (newName.trim()) {
      onUpdate(newName);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
      <div className="w-full max-w-sm glass-card rounded-[2.5rem] p-8 shadow-2xl border border-white/10 animate-fadeIn">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-black italic tracking-wider text-blue-500">SETTINGS</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-3 block">
              Display Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User size={18} className="text-blue-500" />
              </div>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-blue-500 transition-all outline-none"
                placeholder="Enter new username"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={isSuccess}
            className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              isSuccess ? 'bg-green-500 text-white' : 'blue-gradient text-white active:scale-95'
            }`}
          >
            {isSuccess ? (
              <>
                <Check size={18} /> Updated
              </>
            ) : (
              'Save Changes'
            )}
          </button>
          
          <p className="text-[9px] text-center text-gray-600 uppercase tracking-widest leading-loose">
            Account security is verified by CBN. Only public display name can be changed here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
