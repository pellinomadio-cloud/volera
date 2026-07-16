
import React, { useState, useEffect } from 'react';
import { ArrowLeft, MessageSquare, Quote, Heart, TrendingUp } from 'lucide-react';
import { TESTIMONIALS } from '../constants';
import { Testimonial } from '../types';

interface NotificationsPageProps {
  onBack: () => void;
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ onBack }) => {
  const [visibleTestimonials, setVisibleTestimonials] = useState<Testimonial[]>([]);
  const [key, setKey] = useState(0); // Used to trigger animations on rotation

  const getRandomTestimonials = (count: number) => {
    const shuffled = [...TESTIMONIALS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  useEffect(() => {
    // Initial set
    setVisibleTestimonials(getRandomTestimonials(6));

    const interval = setInterval(() => {
      setKey(prev => prev + 1);
      // Brief delay to allow fade out if we were doing complex CSS transitions, 
      // but here we rely on the key for re-mounting animation
      setVisibleTestimonials(getRandomTestimonials(6));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-fadeIn pb-24">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
          <ArrowLeft size={24} className="text-gray-400" />
        </button>
        <h2 className="text-xl font-black italic tracking-wider text-blue-500 uppercase">COMMUNITY FEEDBACK</h2>
      </div>

      <div className="space-y-6">
        <div className="bg-blue-600/10 p-6 rounded-[2rem] border border-blue-500/20 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp size={20} className="text-blue-500" />
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Impact Report</h3>
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Thousands of users are migrating to Easy Wallet daily. Real people, real success stories. Every 10 seconds, the node refreshes with new verified feedback.
          </p>
        </div>

        <div key={key} className="space-y-4 animate-feedbackTransition">
          {visibleTestimonials.map((t) => (
            <div key={t.id} className="glass-card p-6 rounded-[2rem] border-white/5 relative overflow-hidden group">
              <div className="absolute top-4 right-6 opacity-5 group-hover:opacity-20 transition-opacity">
                <Quote size={40} className="text-blue-500" />
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center font-bold text-blue-500 text-xs uppercase">
                  {t.user.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{t.user}</h4>
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest">{t.time}</p>
                </div>
              </div>

              <p className="text-[12px] text-gray-300 leading-relaxed mb-4 italic">
                "{t.comment}"
              </p>

              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <Heart size={14} className="text-red-500 fill-red-500/20" />
                  <span className="text-[10px] text-gray-500 font-bold uppercase">Verified Success</span>
                </div>
                {t.amount && (
                  <span className="text-xs font-black text-blue-500">{t.amount}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="py-8 text-center">
          <MessageSquare size={24} className="text-gray-800 mx-auto mb-2" />
          <p className="text-[9px] text-gray-600 uppercase tracking-[0.3em]">Cycling Community Nodes</p>
        </div>
      </div>

      <style>{`
        @keyframes feedbackTransition {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-feedbackTransition {
          animation: feedbackTransition 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default NotificationsPage;
