import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, ShieldCheck, Search, Database, RefreshCw, Layers, Wallet, Mail, Settings, Send, CheckCircle, XCircle, Clock, Image, Sparkles } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'operators' | 'upgrades' | 'settings'>('operators');

  // Upgrade requests state variables
  const [upgradeRequests, setUpgradeRequests] = useState<any[]>([]);
  const [loadingUpgrades, setLoadingUpgrades] = useState(false);
  const [upgradeFilter, setUpgradeFilter] = useState<'all' | 'pending' | 'approved' | 'declined'>('pending');
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [selectedReceiptUrl, setSelectedReceiptUrl] = useState<string | null>(null);

  // App settings state
  const [telegramLink, setTelegramLink] = useState('');
  const [whatsappLink, setWhatsappLink] = useState('');
  const [supportTelegramLink, setSupportTelegramLink] = useState('');
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

  const loadUpgradeRequests = async () => {
    setLoadingUpgrades(true);
    try {
      const list = await authService.getUpgradeRequests();
      list.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      setUpgradeRequests(list);
    } catch (err) {
      console.error("Failed to load upgrade requests:", err);
    } finally {
      setLoadingUpgrades(false);
    }
  };

  const loadUsersData = async () => {
    setRefreshing(true);
    try {
      const allUsers = await authService.getUsers();
      setUsers(allUsers);
      await loadUpgradeRequests();
    } catch (err) {
      console.error("Failed to load users from Firebase:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleAction = async (requestId: string, status: 'approved' | 'declined', email: string, requestedLevel: number) => {
    setActioningId(requestId);
    try {
      const success = await authService.updateUpgradeRequestStatus(requestId, status, email, requestedLevel);
      if (success) {
        await loadUsersData();
      } else {
        alert("Failed to update status. Please try again.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActioningId(null);
    }
  };

  const loadAppSettingsData = async () => {
    try {
      const settings = await authService.getAppSettings();
      setTelegramLink(settings.telegramLink);
      setWhatsappLink(settings.whatsappLink || '');
      setSupportTelegramLink(settings.supportTelegramLink || '');
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
      whatsappLink,
      supportTelegramLink,
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
          className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${
            activeTab === 'operators'
              ? 'bg-gradient-to-r from-red-500/20 to-orange-500/10 text-orange-400 border border-orange-500/20 shadow-md shadow-orange-500/5'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Operators
        </button>
        <button
          onClick={() => setActiveTab('upgrades')}
          className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all relative ${
            activeTab === 'upgrades'
              ? 'bg-gradient-to-r from-red-500/20 to-orange-500/10 text-orange-400 border border-orange-500/20 shadow-md shadow-orange-500/5'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Upgrades
          {upgradeRequests.filter(r => r.status === 'pending').length > 0 && (
            <span className="absolute -top-1.5 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[8px] text-white items-center justify-center font-black">
                {upgradeRequests.filter(r => r.status === 'pending').length}
              </span>
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${
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

      {activeTab === 'upgrades' && (
        <div className="space-y-4 pb-24 animate-fadeIn">
          {/* Status Filter */}
          <div className="flex gap-1 p-1 bg-black/20 border border-white/5 rounded-xl">
            {(['all', 'pending', 'approved', 'declined'] as const).map((filterType) => {
              const count = filterType === 'all' 
                ? upgradeRequests.length 
                : upgradeRequests.filter(r => r.status === filterType).length;
              return (
                <button
                  key={filterType}
                  onClick={() => setUpgradeFilter(filterType)}
                  className={`flex-1 py-2 text-[8px] font-black uppercase tracking-widest rounded-lg transition-all ${
                    upgradeFilter === filterType
                      ? 'bg-white/10 text-white'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {filterType} ({count})
                </button>
              );
            })}
          </div>

          {/* Upgrade Requests list */}
          <div className="space-y-3">
            {upgradeRequests.filter(r => upgradeFilter === 'all' || r.status === upgradeFilter).length > 0 ? (
              upgradeRequests
                .filter(r => upgradeFilter === 'all' || r.status === upgradeFilter)
                .map((req, index) => {
                  const statusColors = {
                    pending: 'border-yellow-500/20 bg-yellow-500/5 text-yellow-400',
                    approved: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400',
                    declined: 'border-red-500/20 bg-red-500/5 text-red-400'
                  }[req.status as 'pending' | 'approved' | 'declined'] || 'border-white/5 text-white';

                  return (
                    <div 
                      key={req.id || index}
                      className="glass-card rounded-2xl p-4 border border-white/5 bg-gradient-to-r from-white/[0.01] to-[#060608] flex flex-col gap-3"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <span className="text-[11px] font-black uppercase text-white block font-sans tracking-wide">
                            {req.username || 'Anonymous'}
                          </span>
                          <span className="text-[8px] font-mono text-gray-500 block truncate max-w-[180px]">
                            {req.email}
                          </span>
                          <span className="text-[8px] text-gray-400 block font-medium">
                            Submitted: {new Date(req.submittedAt).toLocaleString()}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-mono font-black text-amber-400 block">
                            ₦{req.price.toLocaleString()}
                          </span>
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-wider mt-1 ${statusColors}`}>
                            {req.status}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-2.5 flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] text-gray-500 uppercase font-bold">Target Upgrade</span>
                          <span className="px-1.5 py-0.5 bg-orange-500/10 border border-orange-500/20 text-[7px] font-black text-orange-400 rounded">
                            LEVEL {req.requestedLevel} NODE
                          </span>
                        </div>

                        {req.proofBase64 && (
                          <div className="space-y-1.5">
                            <span className="text-[7.5px] text-gray-500 uppercase font-black tracking-widest block">Payment Receipt</span>
                            <div className="rounded-xl overflow-hidden border border-white/5 bg-black/40 flex justify-center p-1 cursor-zoom-in" onClick={() => setSelectedReceiptUrl(req.proofBase64)}>
                              <img src={req.proofBase64} alt="Proof" className="object-cover h-24 w-full rounded-lg" referrerPolicy="no-referrer" />
                            </div>
                          </div>
                        )}

                        {req.status === 'pending' && (
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => handleAction(req.id, 'declined', req.email, req.requestedLevel)}
                              disabled={actioningId !== null}
                              className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-[8px] font-black uppercase tracking-widest rounded-lg transition-colors"
                            >
                              DECLINE PAYMENT
                            </button>
                            <button
                              onClick={() => handleAction(req.id, 'approved', req.email, req.requestedLevel)}
                              disabled={actioningId !== null}
                              className="flex-1 py-2 bg-gradient-to-r from-emerald-600 to-green-500 text-white text-[8px] font-black uppercase tracking-widest rounded-lg shadow-md shadow-emerald-500/10 transition-all border border-emerald-500/20"
                            >
                              APPROVE UPGRADE
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
            ) : (
              <div className="text-center py-12 bg-white/[0.01] rounded-2xl border border-dashed border-white/5 text-gray-500">
                <Database size={24} className="mx-auto text-gray-600 mb-1.5" />
                <p className="text-[9.5px] font-black uppercase tracking-widest">
                  No {upgradeFilter} requests found
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {selectedReceiptUrl && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-center items-center p-4 animate-fadeIn" onClick={() => setSelectedReceiptUrl(null)}>
          <div className="relative max-w-lg w-full bg-[#0a0a0c] border border-white/10 rounded-3xl p-4 flex flex-col gap-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-[9px] text-gray-400 uppercase font-black tracking-widest">PAYMENT RECEIPT ENLARGED</span>
              <button onClick={() => setSelectedReceiptUrl(null)} className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-white font-black text-[9px] uppercase tracking-wider">CLOSE</button>
            </div>
            <div className="overflow-auto max-h-[70vh] flex justify-center bg-black rounded-2xl p-1">
              <img src={selectedReceiptUrl} alt="Receipt Enlarged" className="max-w-full object-contain" referrerPolicy="no-referrer" />
            </div>
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

            {/* WhatsApp Link */}
            <div className="space-y-1.5">
              <label className="text-[8px] font-black uppercase tracking-widest text-gray-500 block">
                Official WhatsApp Channel URL
              </label>
              <div className="flex items-center bg-black/40 border border-white/10 rounded-xl overflow-hidden focus-within:border-amber-400/40">
                <span className="pl-3.5 pr-1.5 text-[10px] font-mono text-gray-500"><span className="text-emerald-400 font-bold">WA</span></span>
                <input
                  type="url"
                  required
                  placeholder="e.g. https://chat.whatsapp.com/invite_code"
                  value={whatsappLink}
                  onChange={(e) => setWhatsappLink(e.target.value)}
                  className="w-full bg-transparent border-none py-3 px-1 text-[11px] text-white focus:outline-none font-medium"
                />
              </div>
            </div>

            {/* Support Telegram Link */}
            <div className="space-y-1.5">
              <label className="text-[8px] font-black uppercase tracking-widest text-gray-500 block">
                Customer Support Telegram Link
              </label>
              <div className="flex items-center bg-black/40 border border-white/10 rounded-xl overflow-hidden focus-within:border-amber-400/40">
                <span className="pl-3.5 pr-1.5 text-[10px] font-mono text-gray-500"><Send size={11} className="text-blue-400" /></span>
                <input
                  type="url"
                  required
                  placeholder="e.g. https://t.me/your_support"
                  value={supportTelegramLink}
                  onChange={(e) => setSupportTelegramLink(e.target.value)}
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
