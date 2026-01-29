
import React, { useState } from 'react';
import { UserAccount } from '../../types';
import ChatInterface from '../Social/ChatInterface';
import TeamMembers from './TeamMembers';
import TourManager from '../TourManager';
import { LayoutGrid, MessageSquare, Users, FolderOpen } from 'lucide-react';

interface TeamDashboardProps {
    team: UserAccount;
}

const TeamDashboard: React.FC<TeamDashboardProps> = ({ team }) => {
    const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'CHAT' | 'MEMBERS' | 'FILES'>('OVERVIEW');

    return (
        <div className="flex flex-col h-full bg-black">
            {/* Team Header */}
            <div className="shrink-0 p-6 pb-0">
                <div className="flex items-end justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <img src={team.avatar} alt="" className="w-12 h-12 rounded-xl object-cover border border-gray-800" />
                            <div>
                                <h1 className="text-3xl font-black text-white tracking-tighter uppercase">{team.name}</h1>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Organization Workspace</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex bg-gray-900 p-1 rounded-xl border border-gray-800">
                        {[
                            { id: 'OVERVIEW', icon: LayoutGrid, label: 'Overview' },
                            { id: 'CHAT', icon: MessageSquare, label: 'Team Chat' },
                            { id: 'MEMBERS', icon: Users, label: 'Members' },
                            { id: 'FILES', icon: FolderOpen, label: 'Vault' },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                <tab.icon size={14} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden p-6 pt-2">
                {activeTab === 'OVERVIEW' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                        <div className="col-span-2 bg-gray-900/50 border border-gray-800 rounded-3xl p-6 flex flex-col justify-center items-center text-center">
                            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                <LayoutGrid className="text-gray-600" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Team Overview</h3>
                            <p className="text-gray-500 text-sm max-w-md">Currently empty. Start by adding tours or assigning tasks to team members.</p>
                        </div>
                        <div className="col-span-1 h-full">
                            <TeamMembers teamId={team.id} />
                        </div>
                    </div>
                )}

                {activeTab === 'CHAT' && (
                    <div className="h-full rounded-3xl overflow-hidden border border-gray-800">
                        <ChatInterface />
                    </div>
                )}

                {activeTab === 'MEMBERS' && (
                    <div className="h-full">
                        <TeamMembers teamId={team.id} />
                    </div>
                )}

                {activeTab === 'FILES' && (
                    <div className="h-full flex flex-col items-center justify-center bg-gray-900/30 border border-gray-800 rounded-3xl border-dashed">
                        <FolderOpen size={48} className="text-gray-700 mb-4" />
                        <h3 className="text-lg font-bold text-gray-500 uppercase tracking-widest">Vault Empty</h3>
                        <button className="mt-4 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-colors">
                            Upload Files
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeamDashboard;
