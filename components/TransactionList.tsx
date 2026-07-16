import React from 'react';
import { Transaction } from '../types';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowDownLeft, ShieldCheck } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  currency: string;
  onViewAll?: () => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, currency, onViewAll }) => {
  return (
    <div className="mt-4 mb-24">
      <div className="flex justify-between items-center mb-4 px-1">
        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
          {onViewAll ? 'Recent Transactions' : 'All Transactions'}
        </h3>
        {onViewAll && (
          <button 
            onClick={onViewAll}
            className="text-amber-400 text-[11px] font-black uppercase tracking-wider hover:underline transition-all"
          >
            View all
          </button>
        )}
      </div>
      
      <div className="space-y-3">
        {transactions.length > 0 ? (
          transactions.map((tx, idx) => {
            const isCredit = tx.type === 'credit';
            return (
              <motion.div 
                key={tx.id} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05, ease: "easeOut" }}
                whileHover={{ scale: 1.01, backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
                className="flex justify-between items-center p-4 rounded-3xl glass-card border border-white/5 relative overflow-hidden"
              >
                {/* Accent neon strip */}
                <div className={`absolute top-0 bottom-0 left-0 w-[3px] ${isCredit ? 'bg-gradient-to-b from-blue-500 to-indigo-600' : 'bg-gradient-to-b from-amber-500 to-amber-600'}`}></div>

                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
                    isCredit ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                  }`}>
                    {isCredit ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="text-xs font-bold text-white">{tx.title}</p>
                      <ShieldCheck size={11} className="text-emerald-500" />
                    </div>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wide mt-0.5">{tx.date} • {tx.category}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`text-xs font-black font-mono tracking-tight ${isCredit ? 'text-blue-400' : 'text-amber-400'}`}>
                    {isCredit ? '+' : '-'}{currency}{tx.amount.toLocaleString()}
                  </p>
                  <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest">SUCCESS</span>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white/[0.01] rounded-3xl border border-dashed border-white/5">
            <p className="text-xs text-gray-600 font-black uppercase tracking-widest">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
