
import React, { useState } from 'react';
import { Users, UserPlus, Search, Shield, Music, Check, X } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { FriendRequest, UserAccount } from '../../types';

const NetworkHub: React.FC = () => {
    const { currentUser } = useAuth();
    const { bands } = useData(); // We can use bands/users from data context to simulate discovery
    const [activeTab, setActiveTab] = useState<'FRIENDS' | 'REQUESTS' | 'DISCOVER'>('DISCOVER');

    // Mock incoming requests
    const [requests, setRequests] = useState<FriendRequest[]>([
        { id: 'r1', fromId: 'u2', fromName: 'Sarah Jenkins', fromAvatar: 'https://ui-avatars.com/api/?name=Sarah+Jenkins', status: 'PENDING' },
        { id: 'r2', fromId: 'u3', fromName: 'Mike The Promoter', fromAvatar: 'https://ui-avatars.com/api/?name=Mike', status: 'PENDING' }
    ]);

    // Mock friends
    const [friends, setFriends] = useState<any[]>([
        { id: 'f1', name: 'Echo & The Waves', role: 'Artist', avatar: 'https://ui-avatars.com/api/?name=Echo' },
        { id: 'f2', name: 'The Red Room', role: 'Venue', avatar: 'https://ui-avatars.com/api/?name=Red+Room' }
    ]);

    const handleAccept = (id: string) => {
        setRequests(prev => prev.filter(r => r.id !== id));
        // Add to friends implementation would go here
    };

    return (
        <div className="flex h-full bg-black">
            {/* Sidebar */}
            <div className="w-64 border-r border-gray-800 bg-gray-950 p-4">
                <h2 className="text-xl font-black text-white px-2 mb-6 tracking-tight flex items-center gap-2">
                    <Users className="text-blue-500" /> COMMUNITY
                </h2>

                <div className="space-y-2">
                    <button
                        onClick={() => setActiveTab('DISCOVER')}
                        className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'DISCOVER' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-gray-500 hover:bg-gray-900'}`}
                    >
                        Town Square
                    </button>
                    <button
                        onClick={() => setActiveTab('FRIENDS')}
                        className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'FRIENDS' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-gray-500 hover:bg-gray-900'}`}
                    >
                        My Network <span className="ml-2 opacity-50">{friends.length}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('REQUESTS')}
                        className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'REQUESTS' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-gray-500 hover:bg-gray-900'}`}
                    >
                        Requests
                        {requests.length > 0 && <span className="ml-2 bg-red-500 text-white px-1.5 py-0.5 rounded-full text-[9px]">{requests.length}</span>}
                    </button>
                </div>

                <div className="mt-8 bg-blue-900/10 border border-blue-500/20 p-4 rounded-xl">
                    <h4 className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-2">Invite Code</h4>
                    <div className="bg-black border border-blue-500/30 rounded p-2 text-center text-lg font-mono text-white tracking-widest selection:bg-blue-500">
                        TB-{currentUser?.id.slice(-4).toUpperCase()}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-8 relative">
                {activeTab === 'DISCOVER' && (
                    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-black text-white tracking-tighter mb-4">THE TOWN SQUARE</h1>
                            <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">Discover artists, venues, and pros nearby</p>
                        </div>

                        <div className="relative mb-8">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search by name, role, or location..."
                                className="w-full bg-gray-900 border border-gray-800 rounded-2xl py-4 pl-12 pr-6 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Mock Disover Cards */}
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl hover:border-blue-500/50 transition-all group cursor-pointer">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                                            <Music className="text-gray-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white">Artist Name {i}</h3>
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Indie Rock • Austin, TX</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="flex-1 bg-white text-black py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200">
                                            Connect
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'REQUESTS' && (
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-2xl font-black text-white mb-8">Pending Requests</h2>
                        {requests.map(req => (
                            <div key={req.id} className="bg-gray-900 border border-gray-800 p-6 rounded-2xl mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <img src={req.fromAvatar} alt="" className="w-12 h-12 rounded-full" />
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{req.fromName}</h3>
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Wants to connect</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleAccept(req.id)}
                                        className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-emerald-900/20"
                                    >
                                        <Check size={20} />
                                    </button>
                                    <button className="w-10 h-10 bg-gray-800 text-gray-400 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {requests.length === 0 && (
                            <div className="text-center py-20 text-gray-600 font-bold uppercase tracking-widest">
                                No pending requests
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NetworkHub;
