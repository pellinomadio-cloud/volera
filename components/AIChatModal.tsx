
import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}

const AIChatModal: React.FC<AIChatModalProps> = ({ isOpen, onClose, user }) => {
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'ai' }[]>([
    { text: `Hi ${user.name}! I'm your Easy Wallet AI assistant. How can I help you with your finances today?`, sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
    
    // Start typing for first message
    setIsTyping(true);

    // Response 1: How Easy Wallet works
    const response1 = "Easy Wallet works by utilizing a decentralized 'Secure Node Tunneling' system. This high-tech infrastructure allows for instant, end-to-end encrypted transfers and digital asset management, ensuring your wealth moves through verified CBN nodes with zero friction.";
    
    // Response 2: How it helped Nigeria
    const response2 = "Our mission has already empowered over 50,000 users to overcome traditional banking barriers. By providing a stable bridge to the digital economy, Easy Wallet has helped thousands secure their savings against inflation and achieve true financial independence.";

    // Simulate real-time bot typing for the first bubble
    setTimeout(() => {
      setMessages(prev => [...prev, { text: response1, sender: 'ai' }]);
      
      // Briefly show typing again for the second bubble
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setMessages(prev => [...prev, { text: response2, sender: 'ai' }]);
        }, 1200);
      }, 500);
      
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#0A0A0A] sm:rounded-3xl h-[80vh] flex flex-col border-t sm:border border-white/10 shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-white/5 bg-[#0A0A0A] z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold">Easy Wallet AI Assistant</h2>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] text-gray-500 uppercase font-black">Online</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${m.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white/5 text-gray-300 rounded-bl-none border border-white/5'}`}>
                {m.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start animate-fadeIn">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex gap-1 items-center">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-duration:0.6s]"></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.1s]"></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.2s]"></div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/5 bg-[#0A0A0A]">
          <div className="flex gap-2 bg-white/5 p-2 rounded-2xl border border-white/10">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask how Easy Wallet works..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-white px-2 outline-none"
            />
            <button 
              onClick={handleSend}
              className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center hover:bg-blue-500 transition-colors active:scale-95"
            >
              <Send size={18} className="text-white" />
            </button>
          </div>
          <p className="text-[8px] text-center text-gray-600 mt-2 uppercase tracking-widest font-black">Powered by Gemini AI Ecosystem</p>
        </div>
      </div>
    </div>
  );
};

export default AIChatModal;
