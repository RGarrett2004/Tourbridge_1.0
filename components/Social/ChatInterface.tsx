
import React, { useState } from 'react';
import { Hash, Volume2, Users, Settings, Plus, Send, MoreVertical, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { MOCK_MESSAGES } from '../../constants';

const CHANNELS = [
    { id: '1', name: 'general', type: 'TEXT' },
    { id: '2', name: 'production', type: 'TEXT' },
    { id: '3', name: 'dates-and-routing', type: 'TEXT' },
    { id: '4', name: 'files', type: 'TEXT' },
    { id: '5', name: 'Lobby', type: 'VOICE' },
];

const ChatInterface: React.FC = () => {
    const { isDemoMode } = useAuth();
    const [selectedChannel, setSelectedChannel] = useState(CHANNELS[0].id);
    const [messageInput, setMessageInput] = useState('');
    const [messages, setMessages] = useState<any[]>(MOCK_MESSAGES[CHANNELS[0].id] || []);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (isDemoMode) { alert("Feature Disabled in Demo Account"); return; }
        if (!messageInput.trim()) return;

        const newMessage = {
            id: `msg-${Date.now()}`,
            sender: 'You',
            text: messageInput,
            time: 'Just now',
            avatar: 'https://ui-avatars.com/api/?name=You&background=random'
        };

        setMessages([...messages, newMessage]);
        setMessageInput('');
    };

    const activeChannel = CHANNELS.find(c => c.id === selectedChannel);

    return (
        <div className="flex h-full bg-gray-900 rounded-tl-3xl border-l border-t border-gray-800 overflow-hidden">
            {/* Sidebar List */}
            <div className="w-64 bg-gray-950 flex flex-col border-r border-gray-800">
                <div className="p-4 border-b border-gray-900">
                    <button className="w-full bg-gray-900 border border-gray-800 text-gray-400 rounded-lg px-3 py-1.5 text-xs text-left flex items-center gap-2">
                        <Search size={12} />
                        Find conversation
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-6">
                    <div>
                        <div className="flex items-center justify-between px-2 mb-2 group">
                            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Text Channels</h3>
                            <button className="text-gray-600 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"><Plus size={12} /></button>
                        </div>
                        <div className="space-y-0.5">
                            {CHANNELS.filter(c => c.type === 'TEXT').map(channel => (
                                <button
                                    key={channel.id}
                                    onClick={() => {
                                        setSelectedChannel(channel.id);
                                        // Simple randomized messages for demo
                                        setMessages(MOCK_MESSAGES[channel.id] || MOCK_MESSAGES['1']);
                                    }}
                                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors group ${selectedChannel === channel.id ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-900 hover:text-gray-300'}`}
                                >
                                    <Hash size={14} className={selectedChannel === channel.id ? 'text-gray-400' : 'text-gray-600 group-hover:text-gray-500'} />
                                    <span className="text-sm font-medium truncate">{channel.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between px-2 mb-2 group">
                            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Voice Channels</h3>
                            <button className="text-gray-600 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"><Plus size={12} /></button>
                        </div>
                        <div className="space-y-0.5">
                            {CHANNELS.filter(c => c.type === 'VOICE').map(channel => (
                                <button
                                    key={channel.id}
                                    onClick={() => setSelectedChannel(channel.id)}
                                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors group ${selectedChannel === channel.id ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-900 hover:text-gray-300'}`}
                                >
                                    <Volume2 size={14} className={selectedChannel === channel.id ? 'text-gray-400' : 'text-gray-600 group-hover:text-gray-500'} />
                                    <span className="text-sm font-medium truncate">{channel.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-3 bg-black/30 border-t border-gray-900">
                    <div className="flex items-center gap-2 py-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Voice Connected</span>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-gray-900/50">
                <header className="h-14 border-b border-gray-800 flex items-center justify-between px-6 shrink-0 bg-gray-900/80 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <Hash size={20} className="text-gray-400" />
                        <div>
                            <h3 className="text-sm font-bold text-white">{activeChannel?.name}</h3>
                            <p className="text-[10px] text-gray-500 font-medium">Topic: Coordinate tour logistics here</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-gray-400">
                        <button className="hover:text-white transition-colors"><Users size={18} /></button>
                        <button className="hover:text-white transition-colors"><Settings size={18} /></button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map((msg: any) => (
                        <div key={msg.id} className="flex gap-4 group">
                            <img src={msg.avatar} alt="" className="w-10 h-10 rounded-full bg-gray-800 object-cover mt-1" />
                            <div className="flex-1">
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="text-sm font-bold text-gray-200 hover:underline cursor-pointer">{msg.sender}</span>
                                    <span className="text-[10px] text-gray-600 font-medium">{msg.time}</span>
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed">{msg.text}</p>
                            </div>
                            <button className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:bg-gray-800 rounded-lg transition-all self-start">
                                <MoreVertical size={16} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="p-4 px-6 pb-6">
                    <form onSubmit={handleSendMessage} className="relative">
                        <button type="button" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 w-6 h-6 rounded-full flex items-center justify-center transition-colors">
                            <Plus size={14} />
                        </button>
                        <input
                            type="text"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            placeholder={`Message #${activeChannel?.name}`}
                            className="w-full bg-gray-800/50 border-none rounded-xl py-3 pl-12 pr-12 text-gray-200 placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-700 transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!messageInput.trim()}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;
