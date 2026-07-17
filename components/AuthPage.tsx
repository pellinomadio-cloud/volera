
import React, { useState } from 'react';
import { Mail, User, Lock, ArrowRight, ShieldCheck, Users, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { authService } from '../services/authService';
import logoImg from '../src/assets/images/volerapay_icon_1784200310877.jpg';

interface AuthPageProps {
  onAuthSuccess: (user: any) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    referralCode: '',
    agreeTerms: false
  });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref');
      if (ref) {
        setFormData(prev => ({
          ...prev,
          referralCode: ref.trim()
        }));
      }
    } catch (e) {
      console.error("Error parsing referral code from URL:", e);
    }
  }, []);

  const handleAction = async () => {
    setError('');
    setSuccessMsg('');
    setIsLoading(true);
    try {
      if (isLogin) {
        const user = await authService.login(formData.email, formData.password);
        if (user) {
          onAuthSuccess(user);
        } else {
          setError('Invalid email or 6-digit pin');
        }
      } else {
        if (!formData.username || !formData.email || !formData.password) {
          setError('All fields are required');
          setIsLoading(false);
          return;
        }
        if (formData.password.length !== 6 || !/^\d+$/.test(formData.password)) {
          setError('Pin must be exactly 6 digits');
          setIsLoading(false);
          return;
        }
        if (!formData.agreeTerms) {
          setError('You must agree to the Terms & Conditions');
          setIsLoading(false);
          return;
        }

        // Check if username is unique
        const users = await authService.getUsers();
        if (users.some(u => u.username?.toLowerCase() === formData.username.toLowerCase())) {
          setError('Username is already taken');
          setIsLoading(false);
          return;
        }
        if (users.some(u => (u.email || '').toLowerCase() === formData.email.toLowerCase())) {
          setError('Email is already registered');
          setIsLoading(false);
          return;
        }

        // New user registration defaults to 0.0 Naira
        const newUser = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          balance: 0.0, // Strict requirement: 0.0 Naira on registration
          referrals: [],
          createdAt: new Date().toISOString()
        };

        await authService.register(newUser);
        localStorage.setItem('volerapay_just_registered', 'true');

        // Apply referral code if provided
        if (formData.referralCode) {
          const applied = await authService.applyReferral(formData.username, formData.referralCode);
          if (applied) {
            setSuccessMsg('Referral code applied successfully! +₦10,000 credited to your referrer.');
          }
        }

        setTimeout(() => {
          onAuthSuccess(newUser);
        }, formData.referralCode ? 2000 : 500);
      }
    } catch (e) {
      setError('An error occurred during authentication. Please try again.');
    } finally {
      if (isLogin) {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col items-center justify-center px-6 py-8 relative overflow-hidden">
      {/* Dynamic Animated Ambient Background Orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{
            x: [0, 80, -40, 0],
            y: [0, -50, 60, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-12 -left-12 w-80 h-80 rounded-full bg-blue-600/15 blur-[80px]"
        />
        <motion.div 
          animate={{
            x: [0, -60, 50, 0],
            y: [0, 70, -40, 0],
            scale: [1, 1.1, 1.2, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -bottom-16 -right-16 w-96 h-96 rounded-full bg-amber-500/10 blur-[90px]"
        />
      </div>

      {/* Brand Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, cubicBezier: [0.16, 1, 0.3, 1] }}
        className="mb-8 text-center z-10 flex flex-col items-center"
      >
        <div className="w-20 h-20 mb-3 rounded-2xl overflow-hidden shadow-2xl border border-amber-500/30 p-1 bg-gradient-to-br from-amber-400 to-blue-600">
          <img 
            src={logoImg} 
            alt="Volerapay Logo" 
            className="w-full h-full object-cover rounded-xl"
            referrerPolicy="no-referrer"
          />
        </div>
        <h1 className="text-3xl font-black tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-blue-400 italic uppercase">
          VOLERAPAY
        </h1>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">
          <span className="text-amber-400">Premium</span> Node Ledger System
        </p>
      </motion.div>

      {/* Main Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm glass-card rounded-[2.5rem] p-8 border border-white/5 relative z-10 shadow-2xl bg-black/40 backdrop-blur-xl"
      >
        {/* Shimmer line top */}
        <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent"></div>

        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold text-white tracking-tight mb-1">Welcome Back</h2>
              <p className="text-xs text-gray-400 mb-6">Enter your credentials to access your node ledger</p>

              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-11 pr-4 text-xs text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all outline-none"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    maxLength={6}
                    placeholder="6-Digit Secure Pin"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-11 pr-4 text-xs text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all outline-none tracking-widest"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight mb-1">Create Account</h2>
                <p className="text-xs text-gray-400 mb-4">Register a secure identity with Volerapay ledger</p>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Username"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-xs text-white focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 transition-all outline-none"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-xs text-white focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 transition-all outline-none"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    maxLength={6}
                    placeholder="6-Digit Transfer Pin (Numeric)"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-xs text-white focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 transition-all outline-none tracking-widest"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Users size={16} className="text-amber-400/80" />
                  </div>
                  <input
                    type="text"
                    placeholder="Referral Code (Optional)"
                    className="w-full bg-amber-500/5 border border-amber-500/10 rounded-2xl py-3.5 pl-11 pr-4 text-xs text-white placeholder-amber-400/30 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 transition-all outline-none uppercase font-semibold"
                    value={formData.referralCode}
                    onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
                  />
                </div>

                <div className="relative">
                  <label className="flex items-center gap-2.5 cursor-pointer group py-1 pl-5">
                    {/* Bouncing Pointer Arrow */}
                    {!formData.agreeTerms && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, x: [-3, 1, -3] }}
                        transition={{
                          opacity: { duration: 0.3 },
                          x: { repeat: Infinity, duration: 1, ease: "easeInOut" }
                        }}
                        className="absolute left-0 text-amber-400 flex items-center justify-center"
                      >
                        <ArrowRight size={12} className="stroke-[3.5]" />
                      </motion.div>
                    )}
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={formData.agreeTerms}
                        onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                      />
                      <div className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${formData.agreeTerms ? 'bg-amber-400 border-amber-400' : 'border-white/20 group-hover:border-amber-400/40'}`}>
                        {formData.agreeTerms && <ShieldCheck size={11} className="text-black stroke-[3]" />}
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      I accept the terms of the node agreement
                    </span>
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feedback Messages */}
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -5 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-red-400 text-[10px] font-black text-center mt-4 uppercase tracking-wider"
          >
            ⚠️ {error}
          </motion.p>
        )}

        {successMsg && (
          <motion.p 
            initial={{ opacity: 0, y: -5 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-emerald-400 text-[10px] font-black text-center mt-4 uppercase tracking-wider flex items-center justify-center gap-1"
          >
            <Sparkles size={11} className="text-amber-400 animate-spin" /> {successMsg}
          </motion.p>
        )}

        {/* Dynamic Glowing Action Button */}
        <motion.button
          whileHover={isLoading ? {} : { scale: 1.01, boxShadow: "0 0 20px rgba(245, 158, 11, 0.15)" }}
          whileTap={isLoading ? {} : { scale: 0.99 }}
          onClick={handleAction}
          disabled={isLoading}
          className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest mt-6 flex items-center justify-center gap-2 transition-all text-black ${
            isLoading 
              ? 'bg-gray-700 cursor-not-allowed opacity-55 text-gray-400'
              : isLogin 
                ? 'bg-gradient-to-r from-blue-400 to-amber-400 hover:brightness-110 shadow-lg shadow-blue-500/10' 
                : 'bg-gradient-to-r from-amber-400 to-amber-300 hover:brightness-110 shadow-lg shadow-amber-500/10'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
              Synchronizing...
            </span>
          ) : (
            <>
              {isLogin ? 'Initialize Node' : 'Confirm Registration'}
              <ArrowRight size={14} className="stroke-[3.5]" />
            </>
          )}
        </motion.button>

        {/* Tab Toggle */}
        <div className="mt-8 text-center border-t border-white/5 pt-5">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setSuccessMsg('');
            }}
            className="text-[10px] text-gray-500 hover:text-amber-400 font-black uppercase tracking-[0.15em] transition-colors"
          >
            {isLogin ? "New to Volerapay? Register ledger" : "Existing Node identity? Access Ledger"}
          </button>
        </div>
      </motion.div>

      {/* Trust Signet */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.8 }}
        className="text-[8px] tracking-[0.4em] uppercase text-gray-500 text-center mt-8 z-10 font-bold"
      >
        Verified by Central CBN Node Network
      </motion.p>
    </div>
  );
};

export default AuthPage;

