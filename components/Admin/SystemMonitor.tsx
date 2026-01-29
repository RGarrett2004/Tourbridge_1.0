
import React from 'react';
import { Shield, Activity, Users, Database, AlertTriangle, CheckCircle, Server } from 'lucide-react';

const SystemMonitor: React.FC = () => {
    return (
        <div className="fixed inset-0 bg-black z-[9999] text-white overflow-auto font-mono">
            <div className="max-w-6xl mx-auto p-8">
                <div className="flex items-center justify-between mb-8 border-b border-red-900/50 pb-6">
                    <div className="flex items-center gap-4">
                        <Shield className="text-red-500" size={32} />
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-widest text-red-500">System Control</h1>
                            <p className="text-xs text-red-900 font-bold">RESTRICTED ACCESS // REID GARRETT</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-900/20 text-green-500 rounded-full border border-green-900/50 text-xs">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            Use1-West: ONLINE
                        </div>
                    </div>
                </div>

                {/* Health Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2 text-gray-500 text-xs uppercase tracking-widest">
                            <Activity size={14} /> Total Users
                        </div>
                        <div className="text-3xl font-black">2</div>
                        <div className="text-[10px] text-green-500 mt-1">+100% (Last 24h)</div>
                    </div>
                    <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2 text-gray-500 text-xs uppercase tracking-widest">
                            <Users size={14} /> Active Orgs
                        </div>
                        <div className="text-3xl font-black">1</div>
                        <div className="text-[10px] text-gray-500 mt-1">Dale and the ZDubs</div>
                    </div>
                    <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2 text-gray-500 text-xs uppercase tracking-widest">
                            <Database size={14} /> DB Reads
                        </div>
                        <div className="text-3xl font-black">1.2k</div>
                        <div className="text-[10px] text-blue-500 mt-1">Mock Mode Active</div>
                    </div>
                    <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2 text-gray-500 text-xs uppercase tracking-widest">
                            <Server size={14} /> Est. Cost
                        </div>
                        <div className="text-3xl font-black">$0.00</div>
                        <div className="text-[10px] text-green-500 mt-1">Free Tier</div>
                    </div>
                </div>

                {/* Main Console */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Error Log */}
                    <div className="bg-gray-950 border border-gray-900 rounded-2xl overflow-hidden">
                        <div className="bg-gray-900 p-4 border-b border-gray-800 flex justify-between items-center">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">System Log</h3>
                            <span className="text-[10px] bg-red-900/20 text-red-500 px-2 py-1 rounded">2 Issues</span>
                        </div>
                        <div className="p-4 space-y-3 font-mono text-xs">
                            <div className="flex gap-3 text-red-400">
                                <span className="opacity-50">21:42:01</span>
                                <span className="font-bold">[CRITICAL]</span>
                                <span>Rendering Engine Error: 'KickDrum' is not a valid icon.</span>
                            </div>
                            <div className="flex gap-3 text-yellow-400">
                                <span className="opacity-50">21:40:15</span>
                                <span className="font-bold">[WARN]</span>
                                <span>NetworkHub module removed but still referenced.</span>
                            </div>
                            <div className="flex gap-3 text-green-400">
                                <span className="opacity-50">21:35:00</span>
                                <span className="font-bold">[INFO]</span>
                                <span>System Update: StagePlot assets reloaded.</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-gray-950 border border-gray-900 rounded-2xl overflow-hidden">
                        <div className="bg-gray-900 p-4 border-b border-gray-800">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Admin Actions</h3>
                        </div>
                        <div className="p-4 space-y-2">
                            <button className="w-full flex items-center justify-between p-3 bg-gray-900 hover:bg-gray-800 rounded-lg text-xs font-bold transition-colors">
                                <span>Simulate Usage Spike</span>
                                <Activity size={14} className="text-blue-500" />
                            </button>
                            <button className="w-full flex items-center justify-between p-3 bg-gray-900 hover:bg-gray-800 rounded-lg text-xs font-bold transition-colors">
                                <span>Flush Local Storage</span>
                                <Database size={14} className="text-orange-500" />
                            </button>
                            <button className="w-full flex items-center justify-between p-3 bg-gray-900 hover:bg-gray-800 rounded-lg text-xs font-bold transition-colors text-red-500">
                                <span>Emergency Lockdown</span>
                                <AlertTriangle size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemMonitor;
