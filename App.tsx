import React, { useState, useEffect } from 'react';
import { Bell, Menu, User, ShieldCheck, Loader2, Smartphone, X, Check, Award, ArrowRight } from 'lucide-react';
import { INITIAL_TRANSACTIONS, WITHDRAWAL_ALERTS } from './constants';
import { View, Transaction, UserProfile } from './types';
import { authService } from './services/authService';
import BalanceCard from './components/BalanceCard';
import QuickActions from './components/QuickActions';
import PromoBanner from './components/PromoBanner';
import TransactionList from './components/TransactionList';
import BottomNav from './components/BottomNav';
import AIChatModal from './components/AIChatModal';
import AuthPage from './components/AuthPage';
import SettingsModal from './components/SettingsModal';
import WithdrawPage from './components/WithdrawPage';
import MyJobsPage from './components/MyJobsPage';
import CommunityPage from './components/CommunityPage';
import NotificationsPage from './components/NotificationsPage';
import InvitePage from './components/InvitePage';
import FreeWithdrawalPage from './components/FreeWithdrawalPage';
import JobsPage from './components/JobsPage';
import UpgradePage from './components/UpgradePage';
import { SidebarDrawer } from './components/SidebarDrawer';
import { CommercialPage } from './components/CommercialPage';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<View>('wallet');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWithdrawLoading, setIsWithdrawLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // PWA Install States
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  // Notification states
  const [currentAlert, setCurrentAlert] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  // Periodic notifications logic
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * WITHDRAWAL_ALERTS.length);
      setCurrentAlert(WITHDRAWAL_ALERTS[randomIndex]);
      setShowAlert(true);
      
      // Hide alert after 4 seconds
      setTimeout(() => setShowAlert(false), 4000);
    }, 12000); // New alert every 12 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Live Sync with Firestore for active user profile
  useEffect(() => {
    if (!isAuthenticated || !user?.email) return;

    let active = true;
    const syncProfile = async () => {
      try {
        const latestUsers = await authService.getUsers();
        if (!active) return;
        const matched = latestUsers.find(u => u.email.toLowerCase() === user.email.toLowerCase());
        if (matched) {
          // If balance or level changed, update state
          if (matched.balance !== user.balance || matched.level !== user.level || matched.username !== user.name) {
            setUser({
              name: matched.username || matched.email.split('@')[0],
              email: matched.email,
              balance: matched.balance !== undefined ? matched.balance : 0.0,
              dailyTarget: 200000,
              currency: "₦",
              level: matched.level || 1
            });
            // Update active session storage cache
            localStorage.setItem('volerapay_user', JSON.stringify(matched));
          }
        }
      } catch (err) {
        console.error("Profile periodic sync error:", err);
      }
    };

    // Run immediately and then every 7 seconds
    syncProfile();
    const timer = setInterval(syncProfile, 7000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [isAuthenticated, user?.email, user?.balance, user?.level, user?.name]);

  // Check for PWA Installation Support
  useEffect(() => {
    // Check if running in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsAppInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Load simulated install state
    const simInstalled = localStorage.getItem('volerapay_installed') === 'true';
    if (simInstalled) {
      setIsAppInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Persistence: Check if user is already registered/logged in on load
  useEffect(() => {
    const savedUser = authService.getCurrentUser();
    if (savedUser) {
      const userBalance = savedUser.balance !== undefined ? savedUser.balance : 0.0;
      const profile: UserProfile = {
        name: savedUser.username || savedUser.email.split('@')[0],
        email: savedUser.email,
        balance: userBalance, 
        dailyTarget: 200000,
        currency: "₦",
        level: savedUser.level || 1
      };
      setUser(profile);
      setIsAuthenticated(true);

      // Load user transactions
      const savedTxRaw = localStorage.getItem(`volerapay_tx_${savedUser.email}`);
      if (savedTxRaw) {
        setTransactions(JSON.parse(savedTxRaw));
      } else {
        // If they are a pre-existing user with a 200,000 balance, keep initial transactions
        if (userBalance > 0) {
          setTransactions(INITIAL_TRANSACTIONS);
          localStorage.setItem(`volerapay_tx_${savedUser.email}`, JSON.stringify(INITIAL_TRANSACTIONS));
        } else {
          const initTx: Transaction[] = [
            {
              id: 'init-activation',
              title: 'Secure Node Registration',
              date: 'Today',
              category: 'System',
              amount: 0,
              type: 'credit'
            }
          ];
          setTransactions(initTx);
          localStorage.setItem(`volerapay_tx_${savedUser.email}`, JSON.stringify(initTx));
        }
      }
    }
  }, []);

  const handleAuthSuccess = (userData: any) => {
    const userBalance = userData.balance !== undefined ? userData.balance : 0.0;
    const profile: UserProfile = {
      name: userData.username || userData.email.split('@')[0],
      email: userData.email,
      balance: userBalance, 
      dailyTarget: 200000,
      currency: "₦",
      level: userData.level || 1
    };
    setUser(profile);
    setIsAuthenticated(true);
    
    // Check if transactions exist or write a new one for new user starting at 0.0
    const savedTxRaw = localStorage.getItem(`volerapay_tx_${userData.email}`);
    if (savedTxRaw) {
      setTransactions(JSON.parse(savedTxRaw));
    } else {
      if (userBalance === 0.0 || userBalance === 0) {
        const initTx: Transaction[] = [
          {
            id: 'init-activation',
            title: 'Secure Node Registration',
            date: 'Today',
            category: 'System',
            amount: 0,
            type: 'credit'
          }
        ];
        setTransactions(initTx);
        localStorage.setItem(`volerapay_tx_${userData.email}`, JSON.stringify(initTx));
      } else {
        setTransactions(INITIAL_TRANSACTIONS);
        localStorage.setItem(`volerapay_tx_${userData.email}`, JSON.stringify(INITIAL_TRANSACTIONS));
      }
    }
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    setCurrentView('wallet');
  };

  const handleUpdateUsername = (newName: string) => {
    if (user) {
      const updatedUser = { ...user, name: newName };
      setUser(updatedUser);
      authService.updateUsername(newName);
    }
  };

  const confirmSimulatedInstall = () => {
    setIsAppInstalled(true);
    localStorage.setItem('volerapay_installed', 'true');
    setShowInstallGuide(false);
  };

  const handleInstallToggle = () => {
    if (isAppInstalled) {
      setIsAppInstalled(false);
      localStorage.removeItem('volerapay_installed');
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          setIsAppInstalled(true);
          localStorage.setItem('volerapay_installed', 'true');
        }
        setDeferredPrompt(null);
      });
    } else {
      // Trigger beautiful simulation/installation guide for sandbox/iframe/iOS
      setShowInstallGuide(true);
    }
  };

  const startWithdrawalFlow = () => {
    setIsWithdrawLoading(true);
    setTimeout(() => {
      setIsWithdrawLoading(false);
      setCurrentView('withdraw');
    }, 4000);
  };

  const handleWithdrawalSuccess = (amount: number) => {
    if (user) {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        title: 'Withdrawal',
        date: 'Today',
        category: 'Transfer',
        amount: amount,
        type: 'debit'
      };
      
      const updatedTransactions = [newTransaction, ...transactions];
      setTransactions(updatedTransactions);
      
      const updatedBalance = user.balance - amount;
      const updatedUser = { ...user, balance: updatedBalance };
      setUser(updatedUser);
      
      // Persist in localStorage
      localStorage.setItem(`volerapay_tx_${user.email}`, JSON.stringify(updatedTransactions));
      const savedUser = authService.getCurrentUser();
      if (savedUser) {
        savedUser.balance = updatedBalance;
        authService.register(savedUser);
      }

      setTimeout(() => {
        setCurrentView('wallet');
      }, 1500);
    }
  };

  const handleInviteReward = (amount: number) => {
    if (user) {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        title: 'Referral Bonus',
        date: 'Today',
        category: 'Bonus',
        amount: amount,
        type: 'credit'
      };
      
      const updatedTransactions = [newTransaction, ...transactions];
      setTransactions(updatedTransactions);
      
      const updatedBalance = user.balance + amount;
      const updatedUser = { ...user, balance: updatedBalance };
      setUser(updatedUser);

      // Persist in localStorage
      localStorage.setItem(`volerapay_tx_${user.email}`, JSON.stringify(updatedTransactions));
      const savedUser = authService.getCurrentUser();
      if (savedUser) {
        savedUser.balance = updatedBalance;
        authService.register(savedUser);
      }

      setCurrentView('wallet');
    }
  };

  const handleQuickAction = (id: string) => {
    if (id === 'my-jobs') {
      setCurrentView('my-jobs');
    } else if (id === 'community') {
      setCurrentView('community');
    } else if (id === 'invite') {
      setCurrentView('invite');
    } else if (id === 'jobs') {
      setCurrentView('jobs');
    } else if (id === 'upgrade') {
      setCurrentView('upgrade');
    } else if (id === 'support') {
      window.open('https://t.me/novapay999', '_blank');
    }
  };

  const handleUpgradeSuccess = (newLevel: number, cost: number) => {
    if (user) {
      const updatedBalance = user.balance - cost;
      const updatedUser = { ...user, balance: updatedBalance, level: newLevel };
      setUser(updatedUser);

      const newTransaction: Transaction = {
        id: `TX-UPGRADE-${Date.now()}`,
        title: `Wallet Level ${newLevel} Upgrade`,
        date: 'Today',
        category: 'Upgrade',
        amount: cost,
        type: 'debit'
      };
      
      const updatedTransactions = [newTransaction, ...transactions];
      setTransactions(updatedTransactions);

      localStorage.setItem(`volerapay_tx_${user.email}`, JSON.stringify(updatedTransactions));
      const savedUser = authService.getCurrentUser();
      if (savedUser) {
        savedUser.balance = updatedBalance;
        savedUser.level = newLevel;
        authService.register(savedUser);
      }
    }
  };

  const handleJobSuccess = (earnings: number, title: string) => {
    if (user) {
      const updatedBalance = user.balance + earnings;
      const updatedUser = { ...user, balance: updatedBalance };
      setUser(updatedUser);

      const newTransaction: Transaction = {
        id: `TX-JOB-${Date.now()}`,
        title: `Job: ${title}`,
        date: 'Today',
        category: 'Job Earning',
        amount: earnings,
        type: 'credit'
      };
      
      const updatedTransactions = [newTransaction, ...transactions];
      setTransactions(updatedTransactions);

      localStorage.setItem(`volerapay_tx_${user.email}`, JSON.stringify(updatedTransactions));
      const savedUser = authService.getCurrentUser();
      if (savedUser) {
        savedUser.balance = updatedBalance;
        authService.register(savedUser);
      }
    }
  };

  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  if (isWithdrawLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
        <Loader2 size={48} className="text-amber-400 animate-spin mb-6" />
        <h2 className="text-xl font-black italic tracking-widest text-amber-400 mb-2">SECURE TUNNELING</h2>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest animate-pulse">Verifying CBN Node...</p>
      </div>
    );
  }

  const isFullScreenView = ['withdraw', 'my-jobs', 'community', 'notifications', 'invite', 'free-withdraw', 'jobs', 'upgrade', 'commercial'].includes(currentView);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col max-w-md mx-auto relative shadow-2xl overflow-x-hidden border-x border-white/5">
      {/* Header - Compact */}
      <header className="px-6 py-4 flex justify-between items-center bg-black/90 backdrop-blur-md sticky top-0 z-[60] border-b border-white/5">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-1.5 hover:bg-white/5 rounded-xl transition-colors"
          title="Sidebar Menu"
        >
          <Menu size={18} className="text-gray-400" />
        </button>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
          <h1 className="text-xs font-black tracking-[0.4em] text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-blue-400 to-yellow-200 italic uppercase">VOLERAPAY</h1>
        </div>
        <div className="relative">
          <button 
            onClick={() => setCurrentView('notifications')}
            className="p-1.5 hover:bg-white/5 rounded-xl transition-colors relative"
          >
            <Bell size={18} className="text-gray-400" />
            <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full animate-pulse border border-black"></div>
          </button>

          {/* Popout Notification Alert */}
          {showAlert && currentAlert && (
            <div className="absolute top-full right-0 mt-2 w-56 glass-card p-3 rounded-2xl border-amber-500/40 shadow-2xl shadow-amber-500/10 animate-slideDown z-[100] pointer-events-none">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <ShieldCheck size={12} className="text-amber-500" />
                </div>
                <p className="text-[10px] font-bold text-white leading-tight">{currentAlert}</p>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 pb-24 overflow-y-auto pt-4">
        {!isFullScreenView && (
          <div className="flex items-center justify-between mb-5 animate-fadeIn bg-gradient-to-r from-amber-500/[0.03] to-blue-500/[0.03] p-3 rounded-2xl border border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/10">
                <User size={14} className="text-black stroke-[3]" />
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-[9px] font-black uppercase tracking-wider mb-0.5">GOOD DAY,</span>
                <span className="text-[12px] font-bold text-yellow-100 tracking-tight leading-none truncate max-w-[140px]">{user?.name}</span>
              </div>
            </div>

            {/* Install App Toggle Switch on the right-hand side */}
            <div className="flex items-center gap-2 bg-black/40 px-2.5 py-1.5 rounded-xl border border-white/5 shadow-inner">
              <div className="flex flex-col text-right">
                <span className="text-[7.5px] text-gray-500 font-black uppercase tracking-widest leading-none mb-0.5">INSTALL</span>
                <span className={`text-[8.5px] font-black uppercase tracking-tighter leading-none ${isAppInstalled ? 'text-amber-400' : 'text-gray-400'}`}>
                  {isAppInstalled ? 'Active' : 'Get App'}
                </span>
              </div>
              <button 
                onClick={handleInstallToggle}
                className={`w-8 h-4.5 rounded-full p-0.5 transition-all duration-300 relative ${isAppInstalled ? 'bg-gradient-to-r from-amber-400 to-yellow-300' : 'bg-white/10'}`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-black shadow-md transition-all duration-300 transform ${isAppInstalled ? 'translate-x-3.5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        )}

        {/* View Routing */}
        {currentView === 'wallet' && user && (
          <>
            <BalanceCard 
              balance={user.balance} 
              target={user.dailyTarget} 
              currency={user.currency}
              onWithdraw={startWithdrawalFlow}
            />
            <QuickActions onActionClick={handleQuickAction} />
            <PromoBanner />
            <TransactionList 
              transactions={transactions.slice(0, 3)} 
              currency={user.currency} 
              onViewAll={() => setCurrentView('history')}
            />
          </>
        )}

        {currentView === 'withdraw' && user && (
          <WithdrawPage 
            onBack={() => setCurrentView('wallet')}
            onFreeWithdrawClick={() => setCurrentView('free-withdraw')}
            balance={user.balance}
            currency={user.currency}
            onSuccess={handleWithdrawalSuccess}
          />
        )}

        {currentView === 'free-withdraw' && (
          <FreeWithdrawalPage 
            onBack={() => setCurrentView('withdraw')}
          />
        )}

        {currentView === 'my-jobs' && user && (
          <MyJobsPage 
            onBack={() => setCurrentView('wallet')}
            user={user}
            onGoToJobs={() => setCurrentView('jobs')}
            onGoToUpgrade={() => setCurrentView('upgrade')}
          />
        )}

        {currentView === 'community' && (
          <CommunityPage 
            onBack={() => setCurrentView('wallet')}
          />
        )}

        {currentView === 'notifications' && (
          <NotificationsPage 
            onBack={() => setCurrentView('wallet')}
          />
        )}

        {currentView === 'invite' && (
          <InvitePage 
            onBack={() => setCurrentView('wallet')}
            onRewardClaimed={handleInviteReward}
          />
        )}

        {currentView === 'jobs' && user && (
          <JobsPage 
            onBack={() => setCurrentView('wallet')}
            user={user}
            onJobSuccess={handleJobSuccess}
            onGoToUpgrade={() => setCurrentView('upgrade')}
          />
        )}

        {currentView === 'upgrade' && user && (
          <UpgradePage 
            onBack={() => setCurrentView('wallet')}
            user={user}
            onUpgradeSuccess={handleUpgradeSuccess}
          />
        )}

        {currentView === 'commercial' && (
          <CommercialPage 
            onBack={() => setCurrentView('wallet')}
          />
        )}

        {currentView === 'history' && user && (
          <div className="py-4 animate-fadeIn">
            <div className="flex items-center gap-4 mb-6">
              <button onClick={() => setCurrentView('wallet')} className="p-1.5 hover:bg-white/5 rounded-lg">
                <Menu size={18} className="text-gray-400" />
              </button>
              <h2 className="text-sm font-black italic tracking-widest text-amber-400 uppercase">Transaction Node History</h2>
            </div>
            <TransactionList 
              transactions={transactions} 
              currency={user.currency} 
            />
          </div>
        )}

        {currentView === 'profile' && user && (
          <div className="py-6 text-center space-y-6 animate-fadeIn">
             <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shadow-lg relative">
                <User size={32} className="text-amber-400" />
             </div>
             <div>
                <h2 className="text-lg font-black">{user.name}</h2>
                <p className="text-[9px] text-amber-400 font-black uppercase tracking-widest mt-1">SECURE NODE IDENTITY</p>
             </div>
             <div className="grid grid-cols-2 gap-3 px-4">
                <div className="p-3 glass-card rounded-2xl">
                  <p className="text-[8px] text-gray-500 uppercase font-black tracking-tighter mb-1">Status</p>
                  <p className="text-[9px] font-black text-amber-400">VERIFIED</p>
                </div>
                <div className="p-3 glass-card rounded-2xl">
                  <p className="text-[8px] text-gray-500 uppercase font-black tracking-tighter mb-1">Shield Level</p>
                  <p className="text-[9px] font-black text-emerald-400">LEVEL {user.level || 1}</p>
                </div>
             </div>
             <div className="px-4 space-y-3">
               <button 
                 onClick={() => setIsSettingsOpen(true)}
                 className="w-full py-3 rounded-xl bg-white/5 border border-white/5 font-bold text-[11px] hover:bg-white/10 transition-all text-gray-300"
               >
                 Profile Settings
               </button>
               <button 
                 onClick={handleLogout}
                 className="w-full py-3 rounded-xl text-red-400 font-bold text-[11px] bg-red-500/5 hover:bg-red-500/10 transition-all"
               >
                 Secure Sign Out
               </button>
             </div>
          </div>
        )}
      </main>

      {!isFullScreenView && (
        <BottomNav 
          currentView={currentView} 
          onViewChange={setCurrentView} 
        />
      )}

      {user && (
        <>
          <SidebarDrawer 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
            onNavigate={setCurrentView}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
          <AIChatModal 
            isOpen={isAIChatOpen} 
            onClose={() => setIsAIChatOpen(false)} 
            user={user}
          />
          <SettingsModal 
            isOpen={isSettingsOpen} 
            onClose={() => setIsSettingsOpen(false)} 
            currentName={user.name}
            onUpdate={handleUpdateUsername}
          />
        </>
      )}

      {/* PWA Installation Guide Modal */}
      {showInstallGuide && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 z-[200] animate-fadeIn">
          <div className="w-full max-w-sm bg-[#0a0a0c] border border-amber-500/20 rounded-[2.5rem] p-6 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-24 h-24 bg-amber-500/5 rounded-full -ml-12 -mt-12 blur-2xl"></div>
            
            <button 
              onClick={() => setShowInstallGuide(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-white/5 rounded-full text-gray-400 transition-colors"
            >
              <X size={16} />
            </button>

            <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
              <Smartphone size={26} className="text-amber-400" />
            </div>

            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-2">Install Volerapay on Phone</h3>
            <p className="text-[10px] text-gray-400 leading-relaxed max-w-[280px] mx-auto mb-6">
              To install this application on your mobile device as an offline-capable digital ledger, follow these quick instructions:
            </p>

            <div className="space-y-4 text-left bg-white/[0.02] border border-white/5 p-4 rounded-2xl mb-6 text-[10px] leading-relaxed text-gray-300">
              <div className="flex gap-3">
                <span className="w-5 h-5 bg-amber-500/20 rounded-full flex items-center justify-center text-[9px] font-black text-amber-400 mt-0.5 shrink-0">iOS</span>
                <div>
                  <p className="font-bold text-white">Apple Safari (iPhone)</p>
                  <p className="text-gray-400">Tap the <span className="text-amber-400 font-bold">Share</span> button in Safari, scroll down, and select <span className="text-amber-400 font-bold">"Add to Home Screen"</span>.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center text-[9px] font-black text-blue-400 mt-0.5 shrink-0">And</span>
                <div>
                  <p className="font-bold text-white">Google Chrome (Android)</p>
                  <p className="text-gray-400">Tap the <span className="text-blue-400 font-bold">Menu (3 dots)</span> at the top right, and choose <span className="text-blue-400 font-bold">"Install App"</span> or <span className="text-blue-400 font-bold">"Add to Home screen"</span>.</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowInstallGuide(false)}
                className="flex-1 py-3 bg-white/5 border border-white/5 hover:bg-white/10 text-white font-bold text-xs rounded-xl transition-all"
              >
                Close
              </button>
              <button
                onClick={confirmSimulatedInstall}
                className="flex-1 py-3 bg-gradient-to-r from-amber-400 to-yellow-300 hover:brightness-110 text-black font-black text-xs rounded-xl shadow-lg shadow-amber-500/10 transition-all"
              >
                Mock Success
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .animate-slideDown { animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        button, input, select {
          font-size: 11px !important;
        }
        h2 { font-size: 13px !important; }
        h1 { font-size: 10px !important; }
      `}</style>
    </div>
  );
};

export default App;
