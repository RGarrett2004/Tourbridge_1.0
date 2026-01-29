import React, { useState } from 'react';
import { UserAccount } from '../../types';
import ChatInterface from '../Social/ChatInterface';
import TeamMembers from './TeamMembers';
import MasterRouting from '../Routing/MasterRouting';
import FinanceDashboard from './Finance/FinanceDashboard';
import StagePlotDesigner from '../StagePlot/StagePlotDesigner';
import LevelAssessment, { CareerLevel } from '@/components/Onboarding/LevelAssessment';
import {
    LayoutGrid, MessageSquare, Users, FolderOpen,
    TrendingUp, DollarSign, Calendar, Globe, Settings,
    BarChart3, ArrowUpRight, ArrowDownRight, Mic2, Sparkles, MapPin, Clock, CheckCircle2, AlertCircle, Plus, ChevronRight, Zap, Bell
} from 'lucide-react';

interface OrganizationDashboardProps {
    team: UserAccount;
}

const OrganizationDashboard: React.FC<OrganizationDashboardProps> = ({ team }) => {
    const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'CHAT' | 'ROSTER' | 'FINANCE' | 'STAGE_PLOT'>('OVERVIEW');
    const [showAssessment, setShowAssessment] = useState(false);

    // Local state to simulate "saving" the level for this session since we don't have a real DB yet
    const [localLevel, setLocalLevel] = useState<CareerLevel | undefined>(team.careerLevel);

    const handleLevelComplete = (level: CareerLevel) => {
        setLocalLevel(level);
        setShowAssessment(false);
        // In a real app, this would make an API call to save the level
        team.careerLevel = level; // Mutate prop for immediate feedback in this session
    };

    const effectiveLevel = localLevel || 'STARTER';

    return (
        <div className="h-full bg-black text-white overflow-hidden flex flex-col relative">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none" />
            <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Header / Navigation Bar */}
            <div className="flex items-center justify-between px-8 py-6 shrink-0 z-20">
                <div className="flex items-center gap-6">
                    <div className="relative group cursor-pointer">
                        <img src={team.avatar} alt={team.name} className="w-14 h-14 rounded-2xl object-cover border border-white/10 group-hover:border-blue-500 transition-all shadow-2xl" />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-black flex items-center justify-center">
                            <Sparkles size={8} className="text-black fill-black" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter uppercase leading-none mb-1 flex items-center gap-3">
                            {team.name}
                            {effectiveLevel !== 'STARTER' && (
                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${effectiveLevel === 'TOURING' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                                    {effectiveLevel} Tier
                                </span>
                            )}
                        </h1>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Command Center • Active</p>
                    </div>
                </div>

                {/* Pill Navigation */}
                <div className="flex bg-gray-900/50 backdrop-blur-md p-1.5 rounded-2xl border border-white/5 shadow-2xl">
                    {[
                        { id: 'OVERVIEW', label: 'Command', icon: LayoutGrid },
                        { id: 'CHAT', label: 'Comms', icon: MessageSquare, alert: 3 },
                        { id: 'ROSTER', label: 'Unit', icon: Users },
                        { id: 'ROUTING', label: 'Master Routing', icon: MapPin },
                        { id: 'FINANCE', label: 'Filebox', icon: FolderOpen },
                        { id: 'STAGE_PLOT', label: 'Stage Plot', icon: Mic2 },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === tab.id
                                ? 'bg-white text-black shadow-lg shadow-white/10'
                                : 'text-gray-500 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <tab.icon size={14} className={activeTab === tab.id ? 'text-blue-600' : ''} />
                            {tab.label}
                            {/* @ts-ignore */}
                            {tab.alert && (
                                <span className={`absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full text-[8px] border border-black ${activeTab === tab.id ? 'bg-red-500 text-white' : 'bg-red-500/20 text-red-400 border-red-500/20'}`}>
                                    {/* @ts-ignore */}
                                    {tab.alert}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <button className="p-3 bg-gray-900/50 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-all border border-white/5">
                        <Bell size={18} />
                    </button>
                    <button className="p-3 bg-gray-900/50 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-all border border-white/5">
                        <Settings size={18} />
                    </button>
                </div>
            </div>

            {/* Main Content Area - "Command Deck" */}
            <div className="flex-1 overflow-y-auto p-8 pt-2 z-10 custom-scrollbar">
                {activeTab === 'OVERVIEW' && (
                    <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-6">

                        {/* LEFT COLUMN: Context & Brief (3 cols) */}
                        <div className="col-span-12 lg:col-span-3 space-y-6">
                            {/* Daily Signal / Weather */}
                            <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Clock size={14} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">09:42 AM EST</span>
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                </div>
                                <h2 className="text-3xl font-black text-white tracking-tighter mb-1">Good Morning.</h2>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-6">3 Urgent items need attention.</p>
                                <hr className="border-gray-800 mb-6" />
                                <button className="w-full py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-[1.02] transition-transform shadow-xl shadow-white/5 flex items-center justify-center gap-2">
                                    <Zap size={14} className="text-blue-600" />
                                    Start Briefing
                                </button>
                            </div>

                            {/* Active Tour Widget (Conditional) */}
                            {effectiveLevel === 'TOURING' ? (
                                <div className="bg-gradient-to-br from-blue-900/20 to-black/40 backdrop-blur-xl border border-blue-500/20 p-6 rounded-[2rem] relative overflow-hidden">
                                    <div className="space-y-4 relative z-10">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Active Tour</p>
                                                <h3 className="text-lg font-black text-white uppercase tracking-tight">Spring Run '26</h3>
                                            </div>
                                            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 animate-pulse">
                                                <MapPin size={16} />
                                            </div>
                                        </div>

                                        <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                                            <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Next Stop • Tonight</p>
                                            <p className="text-xl font-black text-white mb-0.5">Chicago, IL</p>
                                            <p className="text-xs text-gray-400 font-bold uppercase">The Empty Bottle</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="bg-black/40 rounded-lg p-3 border border-white/5 text-center">
                                                <p className="text-[8px] text-gray-600 uppercase font-bold">Doors</p>
                                                <p className="text-sm font-black text-white">7:00 PM</p>
                                            </div>
                                            <div className="bg-black/40 rounded-lg p-3 border border-white/5 text-center">
                                                <p className="text-[8px] text-gray-600 uppercase font-bold">Set</p>
                                                <p className="text-sm font-black text-white">9:15 PM</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-black/20 backdrop-blur-md border border-white/5 p-6 rounded-[2rem] flex flex-col items-center justify-center text-center opacity-60 hover:opacity-100 transition-opacity cursor-pointer border-dashed border-gray-800 hover:border-gray-600">
                                    <div className="p-4 bg-gray-900 rounded-full mb-4 text-gray-500">
                                        <Globe size={24} />
                                    </div>
                                    <h4 className="text-sm font-black text-white uppercase mb-1">No Active Tour</h4>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Plan your next run</p>
                                </div>
                            )}
                        </div>

                        {/* CENTER COLUMN: Hero Action & Growth (6 cols) */}
                        <div className="col-span-12 lg:col-span-6 space-y-6">
                            {/* Hero Action Center */}
                            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden min-h-[400px] flex flex-col">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />

                                <div className="flex items-center gap-3 mb-6 relative z-10">
                                    <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                                        <Sparkles size={10} /> Highest Priority
                                    </div>
                                </div>

                                <div className="flex-1 relative z-10">
                                    {(!team.careerLevel || team.careerLevel === 'STARTER') && (
                                        <div className="space-y-6">
                                            <h2 className="text-4xl font-black text-white tracking-tighter leading-[0.9]">
                                                Your Stage Plot is missing. <br />
                                                <span className="text-gray-600">Venues can't prepare.</span>
                                            </h2>
                                            <p className="text-sm text-gray-400 font-medium leading-relaxed max-w-md">
                                                Without a technical rider, you risk bad sound checks and longer load-ins. Use the designer to drag-and-drop your setup in minutes.
                                            </p>
                                            <div className="pt-4">
                                                <button onClick={() => setActiveTab('STAGE_PLOT')} className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-lg shadow-emerald-900/20 group">
                                                    Open Designer <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {team.careerLevel === 'WORKING' && (
                                        <div className="space-y-6">
                                            <h2 className="text-4xl font-black text-white tracking-tighter leading-[0.9]">
                                                3 New Venues match <br />
                                                <span className="text-blue-500">Your Route to Chicago.</span>
                                            </h2>
                                            <div className="grid grid-cols-1 gap-3 max-w-md">
                                                {['The Grog Shop (Cleveland)', 'Musica (Akron)', 'Small\'s (Detroit)'].map((v, i) => (
                                                    <div key={v} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                                                        <span className="text-xs font-bold text-gray-300 group-hover:text-white">{v}</span>
                                                        <ArrowUpRight size={14} className="text-gray-600 group-hover:text-white" />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="pt-4 flex gap-4">
                                                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20">
                                                    Draft Emails
                                                </button>
                                                <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                                                    Ignore
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Growth Metrics Row */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {/* Metric 1 */}
                                <div className="bg-black/30 backdrop-blur-sm border border-white/5 p-5 rounded-[2rem] hover:bg-white/5 transition-colors group cursor-pointer">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500 group-hover:scale-110 transition-transform"><Users size={18} /></div>
                                        <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">+124 This Week</span>
                                    </div>
                                    <p className="text-2xl font-black text-white">12.8k</p>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Reach</p>
                                    <div className="h-1 w-full bg-gray-800 rounded-full mt-4 overflow-hidden">
                                        <div className="h-full bg-blue-500 w-[65%]" />
                                    </div>
                                </div>

                                {/* Metric 2 */}
                                <div className="bg-black/30 backdrop-blur-sm border border-white/5 p-5 rounded-[2rem] hover:bg-white/5 transition-colors group cursor-pointer">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500 group-hover:scale-110 transition-transform"><DollarSign size={18} /></div>
                                        <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">+12% MoM</span>
                                    </div>
                                    <p className="text-2xl font-black text-white">$4,250</p>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Gross Tix Sales</p>
                                    <div className="h-1 w-full bg-gray-800 rounded-full mt-4 overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-[45%]" />
                                    </div>
                                </div>

                                {/* Metric 3 (Pipeline) */}
                                <div className="bg-black/30 backdrop-blur-sm border border-white/5 p-5 rounded-[2rem] hover:bg-white/5 transition-colors group cursor-pointer">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500 group-hover:scale-110 transition-transform"><Calendar size={18} /></div>
                                    </div>
                                    <p className="text-2xl font-black text-white">8 Holds</p>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Pending Confirm</p>
                                    <div className="flex -space-x-2 mt-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-6 h-6 rounded-full bg-gray-800 border-2 border-black flex items-center justify-center text-[8px] text-gray-400">?</div>
                                        ))}
                                        <div className="w-6 h-6 rounded-full bg-gray-800 border-2 border-black flex items-center justify-center text-[8px] text-gray-400">+5</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Feed & Quick Actions (3 cols) */}
                        <div className="col-span-12 lg:col-span-3 space-y-6">
                            {/* Quick Actions Panel */}
                            <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem]">
                                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Zap size={12} className="text-yellow-500" /> Quick Actions
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <button className="p-4 bg-gray-900/50 hover:bg-blue-600/20 hover:border-blue-500/50 hover:text-blue-400 border border-transparent rounded-2xl flex flex-col items-center justify-center gap-2 transition-all group">
                                        <MessageSquare size={18} className="text-gray-400 group-hover:text-blue-400" />
                                        <span className="text-[9px] font-black uppercase">Blast Chat</span>
                                    </button>
                                    <button className="p-4 bg-gray-900/50 hover:bg-emerald-600/20 hover:border-emerald-500/50 hover:text-emerald-400 border border-transparent rounded-2xl flex flex-col items-center justify-center gap-2 transition-all group">
                                        <DollarSign size={18} className="text-gray-400 group-hover:text-emerald-400" />
                                        <span className="text-[9px] font-black uppercase">Log Expense</span>
                                    </button>
                                    <button className="p-4 bg-gray-900/50 hover:bg-purple-600/20 hover:border-purple-500/50 hover:text-purple-400 border border-transparent rounded-2xl flex flex-col items-center justify-center gap-2 transition-all group">
                                        <Calendar size={18} className="text-gray-400 group-hover:text-purple-400" />
                                        <span className="text-[9px] font-black uppercase">Add Hold</span>
                                    </button>
                                    <button className="p-4 bg-gray-900/50 hover:bg-amber-600/20 hover:border-amber-500/50 hover:text-amber-400 border border-transparent rounded-2xl flex flex-col items-center justify-center gap-2 transition-all group">
                                        <MapPin size={18} className="text-gray-400 group-hover:text-amber-400" />
                                        <span className="text-[9px] font-black uppercase">Route</span>
                                    </button>
                                </div>
                            </div>

                            {/* Feed / Activity */}
                            <div className="bg-black/20 backdrop-blur-md border border-white/5 p-6 rounded-[2rem] max-h-[400px] overflow-y-auto custom-scrollbar">
                                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Live Feed</h3>
                                <div className="space-y-4">
                                    {[
                                        { user: 'Example Person 1', action: 'uploaded a Stage Plot', time: '2h ago', icon: FolderOpen, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                                        { user: 'Example Person 2', action: 'commented in #general', time: '5h ago', icon: MessageSquare, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                                        { user: 'System', action: 'New payout processed', time: '1d ago', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                                        { user: 'Manager', action: 'Updated Day Sheet', time: '1d ago', icon: Calendar, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-3 items-start group">
                                            <div className={`w-8 h-8 rounded-xl ${item.bg} flex items-center justify-center ${item.color} shrink-0 mt-0.5`}>
                                                <item.icon size={14} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-300 leading-tight">
                                                    <span className="font-bold text-white hover:underline cursor-pointer">{item.user}</span> {item.action}
                                                </p>
                                                <p className="text-[9px] text-gray-600 font-bold uppercase mt-1">{item.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                )}

                {activeTab === 'CHAT' && <div className="h-full rounded-[2.5rem] bg-gray-900/30 border border-white/10 overflow-hidden backdrop-blur-xl"><ChatInterface /></div>}

                {activeTab === 'ROUDING' && (
                    <div className="h-full bg-black rounded-3xl border border-gray-800 overflow-hidden shadow-2xl">
                        {/* Typo in ID meant it wouldn't show, fixing ID to ROUTING matching tab definition */}
                    </div>
                )}
                {activeTab === 'ROUTING' && (
                    <div className="h-full rounded-[2.5rem] bg-black border border-white/10 overflow-hidden shadow-2xl">
                        <MasterRouting />
                    </div>
                )}

                {activeTab === 'ROSTER' && <TeamMembers teamId={team.id} />}

                {activeTab === 'FINANCE' && <FinanceDashboard team={team} />}

                {activeTab === 'STAGE_PLOT' && (
                    <div className="h-full rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
                        <StagePlotDesigner />
                    </div>
                )}
            </div>

            {/* Level Assessment Modal */}
            {showAssessment && (
                <LevelAssessment onComplete={handleLevelComplete} />
            )}
        </div>
    );
};

export default OrganizationDashboard;
