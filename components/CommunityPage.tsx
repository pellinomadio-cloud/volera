
import React from 'react';
import { ArrowLeft, Globe, ExternalLink, Send, Users } from 'lucide-react';

interface CommunityPageProps {
  onBack: () => void;
}

const CommunityPage: React.FC<CommunityPageProps> = ({ onBack }) => {
  const handleJoinTelegram = () => {
    window.open('https://t.me/novapay999', '_blank');
  };

  return (
    <div className="animate-fadeIn pb-12">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
          <ArrowLeft size={24} className="text-gray-400" />
        </button>
        <h2 className="text-xl font-black italic tracking-wider text-blue-500 uppercase">COMMUNITY NODE</h2>
      </div>

      <div className="space-y-6">
        <div className="glass-card p-8 rounded-[2.5rem] border-blue-500/20 text-center relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          
          <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Users size={40} className="text-blue-500" />
          </div>

          <h3 className="text-2xl font-black text-white mb-3">Join the Ecosystem</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            Connect with thousands of Easy Wallet users, get real-time updates on node deployments, and access exclusive financial insights in our official Telegram community.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Members</p>
              <p className="text-lg font-bold text-blue-400">15.4K+</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Uptime</p>
              <p className="text-lg font-bold text-green-400">99.9%</p>
            </div>
          </div>

          <button
            onClick={handleJoinTelegram}
            className="w-full blue-gradient py-5 rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 group hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Send size={20} />
            JOIN TELEGRAM CHANNEL
            <ExternalLink size={16} className="opacity-50 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

        <div className="bg-blue-500/5 p-6 rounded-3xl border border-blue-500/10">
          <h4 className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em] mb-4">Community Benefits</h4>
          <ul className="space-y-4">
            {[
              'Direct access to technical support nodes',
              'Real-time network security alerts',
              'Early access to new Easy Wallet features',
              'Peer-to-peer transaction verification'
            ].map((benefit, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0"></div>
                <p className="text-[11px] text-gray-400 font-medium leading-relaxed">{benefit}</p>
              </li>
            ))}
          </ul>
        </div>
        
        <p className="text-[9px] text-center text-gray-600 uppercase tracking-widest leading-relaxed">
          Official node verification @novapay999. Avoid clones and unofficial groups.
        </p>
      </div>
    </div>
  );
};

export default CommunityPage;
