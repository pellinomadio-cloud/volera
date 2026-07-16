import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, ShieldCheck, Search, Database, RefreshCw, Layers, Wallet, Mail } from 'lucide-react';
import { authService } from '../services/authService';

interface CommercialPageProps {
  onBack: () => void;
}

export const CommercialPage: React.FC<CommercialPageProps> = ({ onBack }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadUsersData = () => {
    setRefreshing(true);
    setTimeout(() => {
      const allUsers = authService.getUsers();
      setUsers(allUsers);
      setRefreshing(false);
    }, 800);
  };

  useEffect(() => {
    loadUsersData();
  }, []);

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

      {/* Users Search Panel */}
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
            filteredUsers.map((item, index) => (
              <div 
                key={item.email || index}
                className="glass-card rounded-2xl p-4 border border-white/5 bg-gradient-to-r from-white/[0.01] to-[#060608] flex justify-between items-center"
              >
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

                <div className="text-right">
                  <span className="text-[11px] font-mono font-black text-amber-400 block">
                    ₦{(item.balance || 0).toLocaleString()}
                  </span>
                  <span className="text-[7.5px] text-gray-500 uppercase font-black tracking-wider block">
                    Available Balance
                  </span>
                </div>
              </div>
            ))
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
    </div>
  );
};
