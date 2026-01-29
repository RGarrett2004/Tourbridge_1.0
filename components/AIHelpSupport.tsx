
import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User, Sparkles, Loader2, ShieldAlert, ExternalLink } from 'lucide-react';
import { geminiService } from '../services/geminiService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  sources?: any[];
}

interface AIHelpSupportProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIHelpSupport: React.FC<AIHelpSupportProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'welcome', 
      role: 'assistant', 
      text: "I am the TourBridge Guardian. I'm here to assist with your tour logistics and protect the integrity of our network. How can I help you navigate the map or verify venue data today?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const history = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.text }]
    }));

    const result = await geminiService.supportChat(input, history);
    
    const aiMsg: Message = { 
      id: (Date.now() + 1).toString(), 
      role: 'assistant', 
      text: result.text,
      sources: result.sources
    };
    
    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 w-[380px] h-[550px] bg-gray-950 border border-gray-800 rounded-[2.5rem] shadow-2xl z-[1100] flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-300">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-gray-900 to-gray-950 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-pink-500/10 rounded-xl">
            <Bot className="text-pink-500" size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-tighter">Bridge Guardian</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Network Secure</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`flex items-start gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center border ${msg.role === 'user' ? 'bg-white/10 border-white/20' : 'bg-pink-500/10 border-pink-500/20'}`}>
                {msg.role === 'user' ? <User size={14} className="text-gray-400" /> : <Bot size={14} className="text-pink-500" />}
              </div>
              <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                msg.role === 'user' 
                ? 'bg-white text-black font-medium' 
                : 'bg-gray-900 text-gray-300 border border-gray-800 shadow-sm'
              }`}>
                {msg.text}
                
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-800/50 space-y-2">
                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Verification Sources</p>
                    {msg.sources.map((s, idx) => (
                      <a 
                        key={idx} 
                        href={s.web?.uri} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center gap-2 text-[9px] text-pink-500 hover:underline font-bold"
                      >
                        <ExternalLink size={10} /> {s.web?.title || 'External Report'}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
                <Loader2 size={14} className="text-pink-500 animate-spin" />
             </div>
             <div className="bg-gray-900 px-4 py-2 rounded-2xl border border-gray-800">
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest animate-pulse">Analyzing logs...</span>
             </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-gray-950 border-t border-gray-900">
        <div className="flex items-center gap-2 bg-gray-900/50 p-2 rounded-2xl border border-gray-800 shadow-inner group focus-within:border-pink-500/50 transition-all">
          <input 
            type="text" 
            placeholder="Report issue or ask for help..."
            className="flex-1 bg-transparent border-none px-4 text-xs text-white placeholder:text-gray-600 focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className={`p-2.5 rounded-xl transition-all ${!input.trim() || loading ? 'text-gray-700' : 'bg-pink-500 text-white hover:scale-105 shadow-lg shadow-pink-500/20'}`}
          >
            <Send size={16} />
          </button>
        </div>
        <div className="mt-2 flex items-center justify-center gap-2">
          <ShieldAlert size={10} className="text-gray-700" />
          <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">Verify all critical data independently.</span>
        </div>
      </div>
    </div>
  );
};

export default AIHelpSupport;
