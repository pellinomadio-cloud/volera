
import React from 'react';
import { Transaction } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  currency: string;
  onViewAll?: () => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, currency, onViewAll }) => {
  return (
    <div className="mt-4 mb-24">
      <div className="flex justify-between items-center mb-4 px-1">
        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
          {onViewAll ? 'Recent Transactions' : 'All Transactions'}
        </h3>
        {onViewAll && (
          <button 
            onClick={onViewAll}
            className="text-blue-500 text-[11px] font-bold hover:underline"
          >
            View all
          </button>
        )}
      </div>
      
      <div className="space-y-3">
        {transactions.length > 0 ? (
          transactions.map((tx) => (
            <div 
              key={tx.id} 
              className="flex justify-between items-center p-4 rounded-3xl glass-card border border-white/5 transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center font-bold text-xs">
                  <span className="text-blue-500">Node</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{tx.title}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{tx.date} • {tx.category}</p>
                </div>
              </div>
              <p className={`text-xs font-black ${tx.type === 'credit' ? 'text-blue-500' : 'text-red-500'}`}>
                {tx.type === 'credit' ? '+' : '-'}{currency}{tx.amount.toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
