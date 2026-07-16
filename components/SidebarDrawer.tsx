import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Briefcase, ShieldAlert, KeyRound, Lock, AlertCircle, ChevronRight } from 'lucide-react';
import { View } from '../types';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: View) => void;
  onOpenSettings: () => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenSettings,
}) => {
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleCommercialClick = () => {
    setShowPasswordPrompt(true);
    setError('');
    setPassword('');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'MAVELL999') {
      onNavigate('commercial');
      setShowPasswordPrompt(false);
      onClose();
    } else {
      setError('INVALID OPERATOR KEY');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-[100] backdrop-blur-sm"
          />

          {/* Left Sliding Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 22, stiffness: 150 }}
            className="fixed top-0 left-0 bottom-0 w-[280px] bg-[#07070a] border-r border-white/5 z-[110] flex flex-col p-6 shadow-2xl"
          >
            {/* Header */}
            <div className="flex justify-between items-center pb-6 border-b border-white/5 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                <span className="text-[10px] font-black tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200 uppercase font-mono">
                  VOLERA NET
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-white/5 rounded-xl transition-colors border border-white/5"
              >
                <X size={14} className="text-gray-400" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 space-y-4">
              {!showPasswordPrompt ? (
                <div className="space-y-2">
                  {/* Profile Settings */}
                  <button
                    onClick={() => {
                      onNavigate('profile');
                      onOpenSettings();
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/10 text-amber-400">
                        <User size={15} />
                      </div>
                      <div>
                        <span className="text-[11px] font-black uppercase text-white tracking-wide block">
                          Profile Settings
                        </span>
                        <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest block">
                          Manage Account Details
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={12} className="text-gray-600 group-hover:text-amber-400 transition-colors" />
                  </button>

                  {/* Job */}
                  <button
                    onClick={() => {
                      onNavigate('jobs');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/10 text-blue-400">
                        <Briefcase size={15} />
                      </div>
                      <div>
                        <span className="text-[11px] font-black uppercase text-white tracking-wide block">
                          Job Portal
                        </span>
                        <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest block">
                          Apply & Earn Rewards
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={12} className="text-gray-600 group-hover:text-blue-400 transition-colors" />
                  </button>

                  {/* Commercial */}
                  <button
                    onClick={handleCommercialClick}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/10 text-red-400">
                        <ShieldAlert size={15} />
                      </div>
                      <div>
                        <span className="text-[11px] font-black uppercase text-white tracking-wide block">
                          Commercial
                        </span>
                        <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest block">
                          Admin Operations
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={12} className="text-gray-600 group-hover:text-red-400 transition-colors" />
                  </button>
                </div>
              ) : (
                /* Password Entry Panel */
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card rounded-2xl p-4 border border-red-500/10 bg-gradient-to-br from-[#120404] to-black"
                >
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-7 h-7 rounded-lg bg-red-500/20 flex items-center justify-center border border-red-500/20 text-red-400">
                      <Lock size={12} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase text-white tracking-widest">Operator Access</h4>
                      <p className="text-[8px] text-gray-500 font-black tracking-wider uppercase">Credentials Required</p>
                    </div>
                  </div>

                  <form onSubmit={handlePasswordSubmit} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[7.5px] font-black uppercase tracking-widest text-gray-500">
                        Admin Secret Passcode
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-red-500/50 text-center tracking-widest uppercase text-white"
                        autoFocus
                      />
                    </div>

                    {error && (
                      <div className="flex items-center gap-1.5 text-red-400 text-[8.5px] font-black uppercase tracking-widest">
                        <AlertCircle size={10} />
                        <span>{error}</span>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowPasswordPrompt(false)}
                        className="flex-1 py-2 bg-white/5 border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-400 hover:bg-white/10"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-red-600/10"
                      >
                        Authorize
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </div>

            {/* Footer metadata */}
            <div className="pt-6 border-t border-white/5 text-center">
              <span className="text-[7px] text-gray-600 font-black tracking-widest uppercase font-mono">
                SECURE HANDSHAKE V3.41
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
