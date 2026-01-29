import React from 'react';
import { UserAccount } from '../../types';
import MySchedule from './MySchedule';
import { LayoutGrid, MessageSquare, CheckSquare, Music, Settings, User } from 'lucide-react';

interface PersonalDashboardProps {
    user: UserAccount;
}

const PersonalDashboard: React.FC<PersonalDashboardProps> = ({ user }) => {
    return (
        <div className="flex flex-col h-full bg-black text-gray-200 overflow-y-auto">
            {/* Header / Profile Section */}
            <div className="p-8 pb-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-24 h-24 rounded-full object-cover border-4 border-gray-900 shadow-2xl"
                            />
                            <div className="absolute bottom-0 right-0 bg-emerald-500 w-6 h-6 rounded-full border-4 border-black" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tighter mb-2">{user.name}</h1>
                            <div className="flex flex-wrap gap-2">
                                <span className="bg-blue-600/20 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                                    {user.role}
                                </span>
                                {/* Mock Extra Roles */}
                                <span className="bg-purple-600/20 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                                    Tour Manager
                                </span>
                            </div>
                        </div>
                    </div>

                    <button className="p-3 bg-gray-900 rounded-full hover:bg-gray-800 transition-colors">
                        <Settings size={20} className="text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Dashboard Grid */}
            <div className="p-8 pt-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Column 1: Schedule */}
                <div className="lg:col-span-1">
                    <MySchedule />
                </div>

                {/* Column 2: Tasks & Active Tours */}
                <div className="lg:col-span-1 space-y-8">
                    {/* My Tasks */}
                    <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                                <CheckSquare size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white leading-none">My Tasks</h3>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">5 Pending</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {[
                                { id: 1, text: "Advance Hospitality for Richmond", band: "Dale and the ZDubs", done: false },
                                { id: 2, text: "Submit W9 for Ocean City", band: "Dale and the ZDubs", done: true },
                                { id: 3, text: "Send Setlist to Lighting Director", band: "Carolina Reefer", done: false },
                            ].map(task => (
                                <div key={task.id} className="flex items-center gap-3 p-3 bg-black border border-gray-800 rounded-xl hover:border-gray-600 transition-colors group cursor-pointer">
                                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${task.done ? 'bg-emerald-500 border-emerald-500' : 'border-gray-600 group-hover:border-emerald-500'}`}>
                                        {task.done && <CheckSquare size={12} className="text-black" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-sm font-bold ${task.done ? 'text-gray-600 line-through' : 'text-gray-300'}`}>{task.text}</p>
                                        <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mt-0.5">{task.band}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Active Tours */}
                    <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
                                <Music size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white leading-none">Active Tours</h3>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">2 Active Runs</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="bg-black border border-gray-800 p-4 rounded-xl">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-bold text-gray-200">Spring Run 2026</h4>
                                    <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded-full uppercase">Active</span>
                                </div>
                                <p className="text-xs text-gray-500 mb-3">Dale and the ZDubs</p>
                                <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-emerald-500 w-1/3 h-full rounded-full" />
                                </div>
                                <div className="flex justify-between mt-2 text-[9px] font-bold text-gray-600 uppercase tracking-widest">
                                    <span>Mar 05 - Mar 22</span>
                                    <span>Day 3 of 15</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column 3: Messages */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-6 h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-6 shrink-0">
                            <div className="w-10 h-10 bg-pink-500/10 rounded-xl flex items-center justify-center text-pink-500">
                                <MessageSquare size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white leading-none">Direct Messages</h3>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Recent conversations</p>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 space-y-2">
                            {/* Mock Messages */}
                            {/* Mock Messages */}
                            {[1].map((_, i) => (
                                <div key={i} className="flex gap-4 p-4 bg-black border border-gray-800 rounded-2xl hover:bg-gray-900 transition-colors cursor-pointer group">
                                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                                        EP
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h5 className="text-sm font-bold text-white">Example Person 2</h5>
                                            <span className="text-[10px] text-gray-600">2m ago</span>
                                        </div>
                                        <p className="text-xs text-gray-500 line-clamp-2">Hey! Just checking in about the new schedule...</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalDashboard;
