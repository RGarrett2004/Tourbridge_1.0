import React, { useState } from 'react';
import { ArrowLeft, Clock, MapPin, DollarSign, Users, Calendar, Truck, Mic2 } from 'lucide-react';
import { GigOpportunity } from '../../types';

interface ShowDashboardProps {
    opportunity: GigOpportunity;
    onBack: () => void;
}

const ShowDashboard: React.FC<ShowDashboardProps> = ({ opportunity, onBack }) => {
    const [activeTab, setActiveTab] = useState<'DAYSHEET' | 'FINANCE' | 'LOGISTICS'>('DAYSHEET');

    return (
        <div className="flex flex-col h-full bg-black text-white">
            {/* Header */}
            <div className="p-8 border-b border-gray-800 flex items-center gap-6">
                <button
                    onClick={onBack}
                    className="p-3 bg-gray-900 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-white transition-all"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-3xl font-black uppercase tracking-tighter">{opportunity.venueName}</h2>
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${opportunity.status === 'CONFIRMED' ? 'bg-emerald-500 text-black' : 'bg-gray-800 text-gray-500'
                            }`}>
                            {opportunity.status}
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest flex items-center gap-4">
                        <span className="flex items-center gap-1.5"><Calendar size={12} /> {opportunity.date}</span>
                        <span className="flex items-center gap-1.5"><MapPin size={12} /> {opportunity.city}</span>
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-800 px-8">
                {[
                    { id: 'DAYSHEET', label: 'Day Sheet', icon: Clock },
                    { id: 'FINANCE', label: 'Settlement', icon: DollarSign },
                    { id: 'LOGISTICS', label: 'Logistics', icon: Truck },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border-b-2 transition-all ${activeTab === tab.id
                                ? 'border-white text-white'
                                : 'border-transparent text-gray-600 hover:text-gray-400'
                            }`}
                    >
                        <tab.icon size={14} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 p-8 overflow-y-auto">
                {activeTab === 'DAYSHEET' && (
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-gray-900/50 border border-gray-800 rounded-[2rem] p-8 mb-6">
                            <h3 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                                <Clock className="text-blue-500" /> Schedule
                            </h3>
                            <div className="space-y-4">
                                {/* Placeholder Schedule Items */}
                                {['16:00 - Load In', '17:30 - Soundcheck', '19:00 - Doors', '20:00 - Opener', '21:15 - Headliner'].map((time, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-black border border-gray-800 rounded-xl hover:border-gray-700 transition-all">
                                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                                        <p className="font-mono text-sm text-gray-300">{time}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gray-900/50 border border-gray-800 rounded-[2rem] p-8">
                            <h3 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-3">
                                <Users className="text-purple-500" /> Key Contacts
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-black border border-gray-800 rounded-xl">
                                    <p className="text-[10px] text-gray-500 font-black uppercase mb-1">Talent Buyer</p>
                                    <p className="text-white font-bold">{opportunity.contactName || 'TBD'}</p>
                                    <p className="text-xs text-gray-600">{opportunity.contactEmail || '---'}</p>
                                </div>
                                <div className="p-4 bg-black border border-gray-800 rounded-xl">
                                    <p className="text-[10px] text-gray-500 font-black uppercase mb-1">Production</p>
                                    <p className="text-white font-bold">Venue PM</p>
                                    <p className="text-xs text-gray-600">production@venue.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'FINANCE' && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-600">
                        <DollarSign size={48} className="mb-4 opacity-20" />
                        <p className="text-sm font-black uppercase tracking-widest">Settlement & Financials Coming Soon</p>
                    </div>
                )}

                {activeTab === 'LOGISTICS' && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-600">
                        <Truck size={48} className="mb-4 opacity-20" />
                        <p className="text-sm font-black uppercase tracking-widest">Maps & Routing Coming Soon</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShowDashboard;
