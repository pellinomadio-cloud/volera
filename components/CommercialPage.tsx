import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, ShieldCheck, Search, Database, RefreshCw, Layers, Wallet, Mail, Settings, Send } from 'lucide-react';
import { authService } from '../services/authService';

interface CommercialPageProps {
  onBack: () => void;
}

export const CommercialPage: React.FC<CommercialPageProps> = ({ onBack }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Admin Editing states for user nodes
  const [editingEmail, setEditingEmail] = useState<string | null>(null);
  const [editLevel, setEditLevel] = useState<number>(1);
  const [editBalance, setEditBalance] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState<'operators' | 'settings'>('operators');

  // App settings state
  const [telegramLink, setTelegramLink] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const startEditing = (user: any) => {
    setEditingEmail(user.email);
    setEditLevel(user.level || 1);
    setEditBalance((user.balance || 0).toString());
  };

  const saveUserUpdates = async (email: string) => {
    setIsSaving(true);
    const balanceNum = parseFloat(editBalance) || 0;
    const success = await authService.updateUserByAdmin(email, {
      balance: balanceNum,
      level: editLevel
    });
    if (success) {
      await loadUsersData();
      setEditingEmail(null);
    } else {
      alert("Failed to update user. Please try again.");
    }
    setIsSaving(false);
  };

  const loadUsersData = async () => {
    setRefreshing(true);
    try {
      const allUsers = await authService.getUsers();
      setUsers(allUsers);
    } catch (err) {
      console.error("Failed to load users from Firebase:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const loadAppSettingsData = async () => {
    try {
      const settings = await authService.getAppSettings();
      setTelegramLink(settings.telegramLink);
      setBankName(settings.bankName);
      setAccountNumber(settings.accountNumber);
      setAccountName(settings.accountName);
    } catch (err) {
      console.error("Failed to load app settings:", err);
    }
  };

  useEffect(() => {
    loadUsersData();
    loadAppSettingsData();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaving(true);
    setSettingsMessage(null);
    const success = await authService.updateAppSettings({
      telegramLink,
      bankName,
      accountNumber,
      accountName
    });
    if (success) {
      setSettingsMessage({ type: 'success', text: 'Settings successfully deployed to Firebase & local node cache.' });
      setTimeout(() => setSettingsMessage(null), 4000);
    } else {
      setSettingsMessage({ type: 'error', text: 'Error executing Firestore deployment. Check logs.' });
    }
    setSettingsSaving(false);
  };

  // Filter users
  const filteredUsers = users.filter((u) => {
    const term = search.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term)) ||
      (u.username && u.username.toLowerCase().includes(term))
    );
  });

  // Calculate stats
  const totalUsers = users.length;
  const totalDeposits = users.reduce((acc, curr) => acc + (curr.balance || 0), 0);
  const averageBalance = totalUsers > 0 ? Math.floor(totalDeposits / totalUsers) : 0;

  return (
    <div className="py-2 text-white animate-fadeIn relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="p-1.5 hover:bg-white/5 rounded-xl transition-colors border border-white/5"
          >
            <ArrowLeft size={18} className="text-gray-400" />
          </button>
          <div>
            <h2 className="text-sm font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-300 uppercase">
              COMMERCIAL OPERATIONS
            </h2>
            <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest">
              Authorized Root Admin Workspace
            </p>
          </div>
        </div>

        <button 
          onClick={loadUsersData}
          disabled={refreshing}
          className="p-2 bg-white/[0.02] hover:bg-white/10 rounded-xl transition-all border border-white/5 text-gray-400 active:scale-95"
        >
          <RefreshCw size={13} className={refreshing ? 'animate-spin text-amber-400' : ''} />
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="glass-card p-3 rounded-2xl border-white/5 text-center bg-gradient-to-b from-white/[0.01] to-[#040406]">
          <div className="flex justify-center mb-1 text-red-400">
            <Users size={12} />
          </div>
          <span className="text-[7.5px] text-gray-500 uppercase font-black tracking-wider block">Reg. Users</span>
          <span className="text-xs font-mono font-black text-white mt-0.5 block">{totalUsers}</span>
        </div>
        <div className="glass-card p-3 rounded-2xl border-white/5 text-center bg-gradient-to-b from-white/[0.01] to-[#040406]">
          <div className="flex justify-center mb-1 text-emerald-400">
            <Wallet size={12} />
          </div>
          <span className="text-[7.5px] text-gray-500 uppercase font-black tracking-wider block">Total Vault</span>
          <span className="text-xs font-mono font-black text-emerald-400 mt-0.5 block">₦{totalDeposits.toLocaleString()}</span>
        </div>
        <div className="glass-card p-3 rounded-2xl border-white/5 text-center bg-gradient-to-b from-white/[0.01] to-[#040406]">
          <div className="flex justify-center mb-1 text-amber-400">
            <Database size={12} />
          </div>
          <span className="text-[7.5px] text-gray-500 uppercase font-black tracking-wider block">Avg. Holdings</span>
          <span className="text-xs font-mono font-black text-amber-400 mt-0.5 block">₦{averageBalance.toLocaleString()}</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 bg-black/40 border border-white/5 rounded-2xl mb-6">
        <button
          onClick={() => setActiveTab('operators')}
          className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
            activeTab === 'operators'
              ? 'bg-gradient-to-r from-red-500/20 to-orange-500/10 text-orange-400 border border-orange-500/20 shadow-md shadow-orange-500/5'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Operators
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
            activeTab === 'settings'
              ? 'bg-gradient-to-r from-red-500/20 to-orange-500/10 text-orange-400 border border-orange-500/20 shadow-md shadow-orange-500/5'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          App Settings
        </button>
      </div>

      {activeTab === 'operators' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 bg-black/60 border border-white/5 rounded-2xl px-3.5 py-2.5">
            <Search size={14} className="text-gray-500" />
            <input 
              type="text" 
              placeholder="Search operator name, email or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none text-[11px] text-white placeholder-gray-600 focus:outline-none w-full font-bold"
            />
          </div>

          {/* Users List Container */}
          <div className="space-y-3 mb-24">
            <div className="flex justify-between items-center px-1">
              <span className="text-[8px] text-gray-500 uppercase font-black tracking-widest">
                Operator Consensus Directory ({filteredUsers.length})
              </span>
              <span className="text-[8px] text-gray-500 uppercase font-black tracking-widest font-mono">
                Status: Live Sync
              </span>
            </div>

            {filteredUsers.length > 0 ? (
              filteredUsers.map((item, index) => {
                const isEditing = editingEmail === item.email;
                return (
                  <div 
                    key={item.email || index}
                    className={`glass-card rounded-2xl p-4 border transition-all duration-300 bg-gradient-to-r from-white/[0.01] to-[#060608] flex flex-col gap-3 ${
                      isEditing ? 'border-amber-500/30 shadow-lg shadow-amber-500/5' : 'border-white/5'
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex justify-between items-center w-full">
                      <div className="space-y-1 max-w-[180px]">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-black uppercase text-white truncate max-w-[130px]">
                            {item.name || 'Anonymous User'}
                          </span>
                          <span className="px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-[7px] font-black text-emerald-400 rounded">
                            Lvl {item.level || 1}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[8.5px] text-gray-500 font-bold truncate">
                          <Mail size={8} className="text-gray-600 shrink-0" />
                          <span className="truncate">{item.email}</span>
                        </div>
                        {item.username && (
                          <span className="text-[7.5px] font-mono text-gray-600 block uppercase">
                            Code: VOLERA-{item.username.toUpperCase()}
                          </span>
                        )}
                      </div>

                      <div className="text-right flex flex-col items-end gap-1">
                        <div>
                          <span className="text-[11px] font-mono font-black text-amber-400 block">
                            ₦{(item.balance || 0).toLocaleString()}
                          </span>
                          <span className="text-[7.5px] text-gray-500 uppercase font-black tracking-wider block">
                            Available Balance
                          </span>
                        </div>
                        
                        {!isEditing && (
                          <button
                            onClick={() => startEditing(item)}
                            className="mt-1 px-2.5 py-1 bg-white/[0.02] hover:bg-white/10 text-[8px] font-black uppercase tracking-wider border border-white/5 rounded-lg text-amber-400 hover:text-amber-300 transition-colors"
                          >
                            Modify Node
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Editing Panel */}
                    {isEditing && (
                      <div className="pt-3 border-t border-white/5 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          {/* Edit Wallet Level */}
                          <div className="space-y-1">
                            <label className="text-[7.5px] font-black uppercase tracking-widest text-gray-500">
                              Clearance Wallet Level
                            </label>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((lvl) => (
                                <button
                                  key={lvl}
                                  type="button"
                                  onClick={() => setEditLevel(lvl)}
                                  className={`flex-1 py-1 text-[9px] font-black rounded-lg transition-all border ${
                                    editLevel === lvl
                                      ? 'bg-amber-400 text-black border-amber-400 shadow-md shadow-amber-400/10'
                                      : 'bg-black/40 text-gray-400 border-white/5 hover:bg-white/5'
                                  }`}
                                >
                                  {lvl}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Edit Balance */}
                          <div className="space-y-1">
                            <label className="text-[7.5px] font-black uppercase tracking-widest text-gray-500">
                              Custom Node Balance (₦)
                            </label>
                            <div className="relative flex items-center bg-black/40 border border-white/10 rounded-lg overflow-hidden focus-within:border-amber-400/40">
                              <span className="pl-2.5 text-[10px] font-mono font-bold text-gray-500">₦</span>
                              <input
                                type="number"
                                value={editBalance}
                                onChange={(e) => setEditBalance(e.target.value)}
                                className="w-full bg-transparent border-none py-1 px-1 text-[10px] font-mono text-white focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2 justify-end pt-1">
                          <button
                            type="button"
                            disabled={isSaving}
                            onClick={() => setEditingEmail(null)}
                            className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-[8.5px] font-black uppercase tracking-widest text-gray-400 hover:bg-white/10"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            disabled={isSaving}
                            onClick={() => saveUserUpdates(item.email)}
                            className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-lg text-[8.5px] font-black uppercase tracking-widest shadow-md shadow-emerald-500/10 flex items-center gap-1.5"
                          >
                            {isSaving ? (
                              <>
                                <span className="w-2.5 h-2.5 border border-white border-t-transparent rounded-full animate-spin"></span>
                                Saving...
                              </>
                            ) : (
                              'Save Node'
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 bg-white/[0.01] rounded-2xl border border-dashed border-white/5">
                <Users size={24} className="mx-auto text-gray-600 mb-1.5" />
                <p className="text-[9.5px] text-gray-500 font-black uppercase tracking-widest">
                  No matching operators found
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-6 animate-fadeIn pb-24">
          <div className="glass-card p-6 rounded-3xl border-white/5 bg-gradient-to-b from-white/[0.01] to-[#040406] space-y-4">
            <div className="flex items-center gap-2 text-amber-400 border-b border-white/5 pb-3">
              <Settings size={15} />
              <span className="text-[11px] font-black uppercase tracking-wider">Ecosystem Settings</span>
            </div>

            {settingsMessage && (
              <div className={`p-4 rounded-xl text-[10px] font-bold leading-relaxed border ${
                settingsMessage.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}>
                {settingsMessage.text}
              </div>
            )}

            {/* Telegram Link */}
            <div className="space-y-1.5">
              <label className="text-[8px] font-black uppercase tracking-widest text-gray-500 block">
                Official Telegram Channel URL
              </label>
              <div className="flex items-center bg-black/40 border border-white/10 rounded-xl overflow-hidden focus-within:border-amber-400/40">
                <span className="pl-3.5 pr-1.5 text-[10px] font-mono text-gray-500"><Send size={11} /></span>
                <input
                  type="url"
                  required
                  placeholder="e.g. https://t.me/yourchannel"
                  value={telegramLink}
                  onChange={(e) => setTelegramLink(e.target.value)}
                  className="w-full bg-transparent border-none py-3 px-1 text-[11px] text-white focus:outline-none font-medium"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-amber-400 border-b border-white/5 pb-3 pt-3">
              <Database size={15} />
              <span className="text-[11px] font-black uppercase tracking-wider">Company Bank Account Ledger</span>
            </div>

            {/* Bank Name */}
            <div className="space-y-1.5">
              <label className="text-[8px] font-black uppercase tracking-widest text-gray-500 block">
                Company Bank Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Moniepoint Bank"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-3.5 text-[11px] text-white focus:outline-none focus:border-amber-400/40 font-medium"
              />
            </div>

            {/* Account Number */}
            <div className="space-y-1.5">
              <label className="text-[8px] font-black uppercase tracking-widest text-gray-500 block">
                Company Account Number
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 8164299246"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-3.5 text-[11px] text-white focus:outline-none focus:border-amber-400/40 font-mono font-bold"
              />
            </div>

            {/* Account Name */}
            <div className="space-y-1.5">
              <label className="text-[8px] font-black uppercase tracking-widest text-gray-500 block">
                Company Account Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Volerapay Ledger Services"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-3.5 text-[11px] text-white focus:outline-none focus:border-amber-400/40 font-medium"
              />
            </div>

            {/* Submit settings button */}
            <button
              type="submit"
              disabled={settingsSaving}
              className="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-300 hover:brightness-110 text-black rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 transition-all"
            >
              {settingsSaving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  DEPLOYING RECONFIGURATIONS...
                </>
              ) : (
                'SAVE SYSTEM CONFIGURATIONS'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
