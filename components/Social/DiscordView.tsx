
import React, { useState } from 'react';
import { Hash, Volume2, Settings, Plus, Mic, Headphones, Monitor, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ChatChannel } from '../../types';

const DiscordView: React.FC = () => {
    const { currentUser, logout } = useAuth();

    // Mock Channels
    const channels: ChatChannel[] = [
        { id: 'ch1', orgId: 'org1', name: 'general', type: 'TEXT', messages: [] },
        { id: 'ch2', orgId: 'org1', name: 'production', type: 'TEXT', messages: [] },
        { id: 'ch3', orgId: 'org1', name: 'booking', type: 'TEXT', messages: [] },
        { id: 'ch4', orgId: 'org1', name: 'Voice Lounge', type: 'VOICE', messages: [] },
    ];

    const [activeChannelId, setActiveChannelId] = useState('ch1');
    const activeChannel = channels.find(c => c.id === activeChannelId);

    return (
        <div className="flex h-full bg-[#313338] text-gray-100 font-sans">
            {/* Server Nav (Leftmost strip usually, but we are inside one org context) */}

            {/* Channel List */}
            <div className="w-60 bg-[#2b2d31] flex flex-col">
                <div className="h-12 border-b border-[#1f2023] flex items-center px-4 font-bold text-white shadow-sm hover:bg-[#35373c] transition-colors cursor-pointer">
                    {currentUser?.name || "Organization"} <span className="ml-auto text-xs opacity-50">▼</span>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
                    {channels.filter(c => c.type === 'TEXT').map(c => (
                        <button
                            key={c.id}
                            onClick={() => setActiveChannelId(c.id)}
                            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-gray-400 hover:bg-[#35373c] hover:text-gray-100 transition-all ${activeChannelId === c.id ? 'bg-[#404249] text-white' : ''}`}
                        >
                            <Hash size={20} className="text-gray-500" />
                            <span className="font-medium truncate">{c.name}</span>
                        </button>
                    ))}

                    <div className="pt-4 pb-1 pl-2 text-xs font-bold text-gray-500 uppercase hover:text-gray-400 cursor-pointer flex items-center justify-between group">
                        <span>Voice Channels</span>
                        <Plus size={12} className="mr-2 opacity-0 group-hover:opacity-100" />
                    </div>

                    {channels.filter(c => c.type === 'VOICE').map(c => (
                        <button
                            key={c.id}
                            className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-gray-400 hover:bg-[#35373c] hover:text-gray-100 transition-all"
                        >
                            <Volume2 size={20} className="text-gray-500" />
                            <span className="font-medium truncate">{c.name}</span>
                        </button>
                    ))}
                </div>

                {/* User Status Bar */}
                <div className="bg-[#232428] p-2 flex items-center gap-2">
                    <div className="relative">
                        <img src={currentUser?.avatar} alt="" className="w-8 h-8 rounded-full bg-gray-500" />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#232428]"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-white truncate">{currentUser?.name}</div>
                        <div className="text-[10px] text-gray-400 truncate">#{currentUser?.id.slice(-4)}</div>
                    </div>
                    <div className="flex items-center">
                        <button className="p-1 hover:bg-gray-700 rounded"><Mic size={16} /></button>
                        <button className="p-1 hover:bg-gray-700 rounded"><Headphones size={16} /></button>
                        <button className="p-1 hover:bg-gray-700 rounded"><Settings size={16} /></button>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-[#313338]">
                <div className="h-12 border-b border-[#26272d] flex items-center px-4 shadow-sm">
                    <Hash size={24} className="text-gray-400 mr-2" />
                    <span className="font-bold text-white">{activeChannel?.name}</span>
                </div>

                <div className="flex-1 p-4 overflow-y-auto flex flex-col justify-end">
                    {/* Empty State */}
                    <div className="mb-8">
                        <div className="w-16 h-16 bg-[#41434a] rounded-full flex items-center justify-center mb-4">
                            <Hash size={40} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Welcome to #{activeChannel?.name}!</h1>
                        <p className="text-gray-400">This is the start of the #{activeChannel?.name} channel.</p>
                    </div>
                </div>

                <div className="p-4 px-4 bg-[#313338]">
                    <div className="bg-[#383a40] rounded-lg px-4 py-2.5 flex items-center gap-4">
                        <button className="text-gray-400 hover:text-gray-200">
                            <Plus size={20} className="bg-gray-400 text-[#383a40] rounded-full p-0.5" />
                        </button>
                        <input
                            type="text"
                            placeholder={`Message #${activeChannel?.name}`}
                            className="bg-transparent border-none focus:outline-none flex-1 text-gray-200 placeholder:text-gray-500"
                        />
                    </div>
                </div>
            </div>

            {/* Members List (Right Sidebar) */}
            <div className="w-60 bg-[#2b2d31] hidden lg:flex flex-col p-4 border-l border-[#26272d]">
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-4">Online — 3</h3>

                <div className="space-y-2">
                    {['Band Manager', 'Tour Tech', 'Venue Rep'].map((role, i) => (
                        <div key={i} className="flex items-center gap-3 opacity-90 hover:opacity-100 hover:bg-[#35373c] p-1.5 rounded cursor-pointer">
                            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">
                                {role[0]}
                            </div>
                            <div>
                                <div className="font-medium text-gray-200 text-sm">{role}</div>
                                <div className="text-[10px] text-gray-400">Playing TourBridge</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DiscordView;
