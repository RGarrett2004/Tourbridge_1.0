import React, { useState } from 'react';
import { Hash, MessageSquare, Users, Volume2, Shield, Search, Send, User, Sparkles, ArrowLeftRight, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const CHANNELS = [
   { id: 'general', name: 'General Chat', description: 'Industry-wide discussions', type: 'text' },
   { id: 'gig-swaps', name: 'Gig Swap Exchange', description: 'Trade opening slots for tour networking', type: 'trade' },
   { id: 'gear', name: 'Gear Exchange', description: 'Buy/Sell/Borrow hardware', type: 'text' },
   { id: 'tour-help', name: 'Roadside Help', description: 'Immediate assistance for touring vans', type: 'urgent' },
];

const CommunityHub: React.FC = () => {
   const { currentUser } = useAuth();
   const [activeChannel, setActiveChannel] = useState(CHANNELS[0]);
   const [message, setMessage] = useState('');
   const [chatLog, setChatLog] = useState([
      { id: 1, user: 'EchoWaves', text: 'LOOKING TO SWAP: We have a Friday night headline slot in Austin (150 cap). Looking for a trade in New Orleans or Houston for early Nov.', isSwap: true, time: '2:15 PM' },
      { id: 2, user: 'SoundGuyBill', text: 'Anyone in Atlanta got a spare snare stand for tonight?', time: '2:45 PM' },
      { id: 3, user: 'HostMama', text: 'Room opened up in Nashville for next Tuesday if anyone is passing through.', time: '3:45 PM' },
   ]);

   const handleSend = () => {
      if (!message.trim()) return;
      const newMsg = {
         id: Date.now(),
         user: currentUser?.name || 'Guest',
         text: message,
         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
         isSwap: activeChannel.id === 'gig-swaps'
      };
      setChatLog([...chatLog, newMsg]);
      setMessage('');
   };

   return (
      <div className="flex h-full bg-black overflow-hidden animate-in fade-in duration-500 w-full">
         {/* Channel Sidebar */}
         <div className="w-64 border-r border-gray-900 bg-gray-950 flex flex-col shrink-0">
            <div className="p-6 border-b border-gray-900">
               <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
                  <Hash className="text-blue-500" size={20} /> Community
               </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
               {CHANNELS.map(ch => (
                  <button
                     key={ch.id}
                     onClick={() => setActiveChannel(ch)}
                     className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group ${activeChannel.id === ch.id ? 'bg-white/10 text-white' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'}`}
                  >
                     <Hash size={16} className={activeChannel.id === ch.id ? 'text-blue-500' : 'text-gray-600'} />
                     <span className="text-xs font-black uppercase tracking-tight">{ch.name}</span>
                  </button>
               ))}
            </div>
         </div>

         {/* Main Chat Area */}
         <div className="flex-1 flex flex-col bg-black relative">
            <div className="h-16 border-b border-gray-900 bg-gray-950/50 backdrop-blur-md flex items-center justify-between px-8 shrink-0 z-10">
               <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                     <Hash className="text-blue-500" size={16} /> {activeChannel.name}
                  </h3>
                  <p className="text-[9px] text-gray-600 font-bold uppercase tracking-tighter">{activeChannel.description}</p>
               </div>
               <div className="flex items-center gap-4">
                  <button className="p-2 text-gray-500 hover:text-white transition-all"><Users size={18} /></button>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar flex flex-col-reverse">
               <div className="space-y-6">
                  {chatLog.map(msg => (
                     <div key={msg.id} className={`group flex gap-4 -mx-4 px-4 py-4 rounded-3xl transition-all ${msg.isSwap ? 'bg-emerald-500/5 border border-emerald-500/10' : 'hover:bg-white/[0.02]'}`}>
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${msg.isSwap ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-gray-900 border-gray-800'}`}>
                           {msg.isSwap ? <ArrowLeftRight size={18} className="text-emerald-500" /> : <User size={18} className="text-gray-500" />}
                        </div>
                        <div className="flex-1">
                           <div className="flex items-center gap-3 mb-1">
                              <span className="text-xs font-black text-white uppercase">{msg.user}</span>
                              <span className="text-[9px] font-bold text-gray-600 uppercase">{msg.time}</span>
                              {msg.isSwap && <span className="bg-emerald-500 text-black px-2 py-0.5 rounded-[4px] text-[7px] font-black uppercase tracking-widest">Swap Request</span>}
                           </div>
                           <p className={`text-sm leading-relaxed ${msg.isSwap ? 'text-emerald-50 font-medium' : 'text-gray-400'}`}>{msg.text}</p>

                           {msg.isSwap && (
                              <div className="mt-4 flex gap-2">
                                 <button className="px-4 py-2 bg-emerald-500 text-black rounded-lg text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all">Review Deal</button>
                                 <button className="px-4 py-2 bg-gray-900 text-gray-400 rounded-lg text-[9px] font-black uppercase tracking-widest">Message Band</button>
                              </div>
                           )}
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            <div className="p-6 bg-gray-950 border-t border-gray-900">
               <div className="flex items-center gap-3 bg-black border border-gray-800 rounded-2xl p-2.5 shadow-inner focus-within:border-blue-500/50 transition-all">
                  <input
                     value={message}
                     onChange={(e) => setMessage(e.target.value)}
                     onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                     placeholder={activeChannel.id === 'gig-swaps' ? 'Describe your swap offer (Venue, Cap, Dates)...' : `Message #${activeChannel.id}`}
                     className="flex-1 bg-transparent border-none text-sm text-white focus:outline-none placeholder:text-gray-700 px-4"
                  />
                  <button
                     onClick={handleSend}
                     className="p-2.5 bg-blue-600 text-white rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-600/20"
                  >
                     <Send size={18} />
                  </button>
               </div>
            </div>
         </div>

         <div className="hidden xl:flex w-72 bg-gray-950/50 border-l border-gray-900 flex-col p-6 overflow-y-auto">
            <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-6">Network Intelligence</h4>
            <div className="bg-gray-900/50 border border-gray-800 p-5 rounded-2xl mb-8">
               <h5 className="text-[10px] font-black text-white uppercase mb-2">Gig Swapping 101</h5>
               <p className="text-[11px] text-gray-500 leading-relaxed italic">"A good swap includes draw metrics and tech specs. Always vet your swap partner's socials before locking a date."</p>
            </div>
         </div>
      </div>
   );
};

export default CommunityHub;
