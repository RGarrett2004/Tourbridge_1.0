import React, { useState } from 'react';
import {
    CalendarCheck, ListFilter, Plus, Building2, MapPin,
    UserCircle, Mail, Sparkles, Trash2, Search, Loader2,
    Zap, History, X, UserPlus, Copy, Send
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { GigOpportunity } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import ShowDashboard from './ShowDashboard';

const MasterRouting: React.FC = () => {
    // Pipeline view state
    const [view, setView] = useState<'PIPELINE' | 'WAREHOUSE' | 'SHOW_DETAILS'>('PIPELINE');

    // Show details drill-down state
    const [selectedOpportunity, setSelectedOpportunity] = useState<GigOpportunity | null>(null);

    // Initial dummy data
    const [opportunities, setOpportunities] = useState<GigOpportunity[]>([
        { id: '1', venueName: 'Music Farm', city: 'Charleston, SC', date: '2024-10-12', status: 'CONFIRMED', fee: 500, contactName: 'Mark Smith', contactEmail: 'mark@musicfarm.com', dealTerms: '$500 vs 70% door', capacity: 600 },
        { id: '2', venueName: 'Terminal West', city: 'Atlanta, GA', date: '2024-10-15', status: 'HOLD_1', fee: 750, contactName: 'Sarah Jenkins', contactEmail: 'sarah@terminalwest.com', dealTerms: '$750 Guarantee', capacity: 800 },
        { id: '3', venueName: 'Exit/In', city: 'Nashville, TN', date: '2024-10-22', status: 'PITCHED', fee: 0, contactName: 'Tommy Gunn', contactEmail: 'booking@exitin.com', dealTerms: 'TBD', capacity: 500 },
        { id: '4', venueName: '9:30 Club', city: 'Washington, DC', date: '2024-10-25', status: 'LEAD', fee: 0, contactName: 'Seth Hurwitz', contactEmail: 'seth@imp.com', capacity: 1200 }
    ]);
    const [activePitch, setActivePitch] = useState<GigOpportunity | null>(null);
    const [pitchContent, setPitchContent] = useState('');
    const [isGeneratingPitch, setIsGeneratingPitch] = useState(false);
    const [isAddingLead, setIsAddingLead] = useState(false);
    const [warehouseSearch, setWarehouseSearch] = useState('');
    const [warehouseLoading, setWarehouseLoading] = useState(false);
    const [warehouseResults, setWarehouseResults] = useState<{ name: string, city: string, contact?: string, email?: string }[]>([]);
    const [newLead, setNewLead] = useState<Partial<GigOpportunity>>({ venueName: '', city: '', date: '', status: 'LEAD', fee: 0, contactName: '', contactEmail: '', capacity: 0 });

    const { isDemoMode } = useAuth();

    const getStatusStyle = (status: GigOpportunity['status']) => { switch (status) { case 'CONFIRMED': return 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'; case 'CONTRACTED': return 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'; case 'HOLD_1': return 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20'; case 'HOLD_2': return 'bg-orange-500 text-black shadow-lg shadow-orange-500/20'; case 'PITCHED': return 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'; case 'SETTLED': return 'bg-gray-500 text-white'; default: return 'bg-gray-800 text-gray-400 border border-gray-700'; } };

    const handleUpdateStatus = (id: string, newStatus: GigOpportunity['status']) => { setOpportunities(prev => prev.map(opp => opp.id === id ? { ...opp, status: newStatus } : opp)); };

    const handleAddLead = () => {
        if (isDemoMode) { alert("Feature Disabled in Demo Account"); return; }
        if (!newLead.venueName || !newLead.city) return;
        const lead: GigOpportunity = { ...newLead, id: Date.now().toString(), } as GigOpportunity;
        setOpportunities(prev => [lead, ...prev]);
        setIsAddingLead(false);
        setNewLead({ venueName: '', city: '', date: '', status: 'LEAD', fee: 0, contactName: '', contactEmail: '', capacity: 0 });
    };

    const handleRemoveOpportunity = (id: string) => { setOpportunities(prev => prev.filter(opp => opp.id !== id)); };

    const handleGeneratePitch = async (opp: GigOpportunity) => {
        setIsGeneratingPitch(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Draft a professional yet high-energy gig pitch email from an independent touring band (Reggae Rock) to a talent buyer named ${opp.contactName || 'the Talent Buyer'} at ${opp.venueName}. The date they are looking for is ${opp.date}. Mention our strong regional draw and recent successful shows. Include a professional tech rider link (placeholder). Focus on the "vibe" and business reliability.`;
            const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
            setPitchContent(response.text || "Failed to generate pitch.");
        } catch (error) {
            setPitchContent("Error communicating with the AI Agent.");
        } finally {
            setIsGeneratingPitch(false);
        }
    };

    const handleWarehouseSearch = async () => {
        if (!warehouseSearch) return;
        setWarehouseLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: `I need contact information for talent buyers or booking agents at venues in "${warehouseSearch}". Return a JSON list of 5 real or probable venues with their name, city, and if possible, a name and email for the booking contact. Format as JSON array: [{ "name": "", "city": "", "contact": "", "email": "" }]`, config: { responseMimeType: "application/json" } });
            const data = JSON.parse(response.text || '[]');
            setWarehouseResults(data);
        } catch (e) {
            console.error(e);
        } finally {
            setWarehouseLoading(false);
        }
    };

    // Handler to open show details
    const handleOpenShow = (opp: GigOpportunity) => {
        setSelectedOpportunity(opp);
        setView('SHOW_DETAILS');
    };

    return (
        <div className="flex flex-col h-full bg-black overflow-hidden relative">
            {view === 'SHOW_DETAILS' && selectedOpportunity ? (
                <div className="h-full animate-in slide-in-from-right duration-300">
                    <ShowDashboard
                        opportunity={selectedOpportunity}
                        onBack={() => {
                            setView('PIPELINE');
                            setSelectedOpportunity(null);
                        }}
                    />
                </div>
            ) : (
                <>
                    {/* Header */}
                    <div className="h-20 border-b border-gray-900 bg-gray-950 flex items-center justify-between px-8 shrink-0">
                        {/* ... (Existing Header Content) ... */}
                        <div className="flex items-center gap-6">
                            <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                <CalendarCheck className="text-blue-500" size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Master Routing</h2>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Gig Pipeline & Deal Tracking</p>
                            </div>
                        </div>
                        <div className="flex bg-gray-900 p-1 rounded-xl border border-gray-800">
                            <button onClick={() => setView('PIPELINE')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'PIPELINE' ? 'bg-white text-black shadow-xl shadow-white/5' : 'text-gray-500 hover:text-white'}`}>Pipeline View</button>
                            <button onClick={() => setView('WAREHOUSE')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'WAREHOUSE' ? 'bg-white text-black shadow-xl shadow-white/5' : 'text-gray-500 hover:text-white'}`}>Venue Archive</button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {view === 'PIPELINE' ? (
                            <div className="p-8">
                                {/* ... existing pipeline controls ... */}
                                <div className="flex justify-between items-end mb-8">
                                    <div>
                                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <ListFilter size={14} className="text-blue-500" /> Active Deals
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => setIsAddingLead(true)}
                                        className="px-6 py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-white/10"
                                    >
                                        <Plus size={16} className="inline mr-2" /> New Lead
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {opportunities.map(opp => (
                                        <div key={opp.id} className="bg-gray-900/40 border border-gray-800 p-6 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-blue-500/30 transition-all relative overflow-hidden">
                                            {/* ... existing card content ... */}
                                            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                                                <Building2 size={80} className="text-white" />
                                            </div>

                                            {/* Clickable Area for Drill-down */}
                                            <div
                                                className="flex items-center gap-6 flex-1 min-w-[300px] cursor-pointer"
                                                onClick={() => handleOpenShow(opp)}
                                            >
                                                <div className="text-center w-20 border-r border-gray-800 pr-6 shrink-0">
                                                    <p className="text-[10px] font-black text-gray-600 uppercase mb-0.5">{opp.date ? new Date(opp.date).toLocaleDateString('en-US', { month: 'short' }) : '---'}</p>
                                                    <p className="text-2xl font-black text-white">{opp.date ? new Date(opp.date).getDate() : '--'}</p>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-none group-hover:text-blue-400 transition-colors">{opp.venueName}</h3>
                                                        <span className="text-[8px] bg-gray-800 text-gray-500 px-2 py-0.5 rounded font-black uppercase tracking-widest">Cap: {opp.capacity || 'TBD'}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
                                                        <MapPin size={12} className="text-red-500" /> {opp.city}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-8 px-8 border-x border-gray-800/50 flex-1">
                                                <div className="flex-1 min-w-[140px]">
                                                    <p className="text-[8px] font-black text-gray-600 uppercase mb-1 flex items-center gap-1.5"><UserCircle size={10} /> Contact</p>
                                                    <p className="text-xs font-black text-gray-300 uppercase truncate">{opp.contactName || 'Finding Buyer...'}</p>
                                                    <p className="text-[10px] text-gray-600 truncate">{opp.contactEmail || 'No Email'}</p>
                                                </div>
                                                <div className="flex-1 text-right min-w-[120px]">
                                                    <p className="text-[8px] font-black text-gray-600 uppercase mb-1">Deal Terms</p>
                                                    <p className="text-xs font-black text-blue-400 uppercase truncate">{opp.dealTerms || 'Negotiating'}</p>
                                                    <p className="text-sm font-black text-white">${opp.fee || '0.00'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 shrink-0">
                                                <select value={opp.status} onChange={(e) => handleUpdateStatus(opp.id, e.target.value as any)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-transparent outline-none cursor-pointer appearance-none text-center ${getStatusStyle(opp.status)}`} >
                                                    <option value="LEAD">LEAD</option> <option value="PITCHED">PITCHED</option> <option value="HOLD_1">HOLD 1</option> <option value="HOLD_2">HOLD 2</option> <option value="CONFIRMED">CONFIRMED</option> <option value="CONTRACTED">CONTRACTED</option> <option value="SETTLED">SETTLED</option>
                                                </select>
                                                <button onClick={() => { setActivePitch(opp); handleGeneratePitch(opp); }} className="p-3 bg-gray-900 hover:bg-purple-600/20 text-gray-400 hover:text-purple-400 rounded-xl transition-all border border-gray-800" title="Draft Pitch with AI" >
                                                    <Sparkles size={18} />
                                                </button>
                                                <button onClick={() => handleRemoveOpportunity(opp.id)} className="p-3 bg-gray-900 hover:bg-red-500/20 text-gray-400 hover:text-red-500 rounded-xl transition-all border border-gray-800" title="Discard Lead" >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="p-8">
                                <div className="bg-gray-900 border border-gray-800 rounded-[3rem] p-10 mb-8 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                                        <Building2 size={120} />
                                    </div>
                                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Venue Discovery Engine</h3>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-8">Search the global database of talent buyers and contact details</p>
                                    <div className="flex gap-4">
                                        <div className="flex-1 relative">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                            <input type="text" placeholder="Enter city or region (e.g. Austin, TX Venue Contacts)" className="w-full bg-black border border-gray-800 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:border-blue-500 outline-none" value={warehouseSearch} onChange={(e) => setWarehouseSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleWarehouseSearch()} />
                                        </div>
                                        <button onClick={handleWarehouseSearch} disabled={warehouseLoading} className="px-10 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/10" >
                                            {warehouseLoading ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
                                            {warehouseLoading ? 'Indexing...' : 'Fetch Contacts'}
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {warehouseResults.map((result, idx) => (
                                        <div key={idx} className="bg-gray-950 border border-gray-900 rounded-[2.5rem] p-8 flex flex-col hover:border-blue-500/20 transition-all group shadow-2xl">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="p-4 bg-gray-900 rounded-2xl border border-gray-800 group-hover:bg-blue-500/5 transition-all">
                                                    <Building2 className="text-blue-500" size={24} />
                                                </div>
                                                <button onClick={() => { setNewLead({ venueName: result.name, city: result.city, contactName: result.contact, contactEmail: result.email }); setIsAddingLead(true); }} className="p-3 bg-gray-900 rounded-xl text-gray-500 hover:text-emerald-500 border border-gray-800 hover:border-emerald-500/30 transition-all" title="Convert to Lead" >
                                                    <Plus size={20} />
                                                </button>
                                            </div>
                                            <h4 className="text-xl font-black text-white uppercase tracking-tight mb-1">{result.name}</h4>
                                            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                                                <MapPin size={12} className="text-red-500" /> {result.city}
                                            </p>
                                            <div className="space-y-3 pt-6 border-t border-gray-900">
                                                <div className="flex items-center gap-3">
                                                    <UserCircle size={14} className="text-gray-700" />
                                                    <p className="text-xs text-gray-400 font-medium uppercase tracking-tighter">{result.contact || 'Contact Hidden'}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Mail size={14} className="text-gray-700" />
                                                    <p className="text-xs text-gray-400 truncate">{result.email || 'Email Protected'}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => { const opp: GigOpportunity = { venueName: result.name, city: result.city, contactName: result.contact, contactEmail: result.email, status: 'LEAD' } as any; setActivePitch(opp); handleGeneratePitch(opp); }} className="mt-8 w-full py-4 bg-gray-900 border border-gray-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-purple-400 hover:border-purple-400/30 transition-all flex items-center justify-center gap-2" >
                                                <Sparkles size={14} /> Quick AI Pitch
                                            </button>
                                        </div>
                                    ))}
                                    {warehouseResults.length === 0 && !warehouseLoading && (
                                        <div className="col-span-full py-20 text-center opacity-30 flex flex-col items-center">
                                            <History size={64} className="mb-4" />
                                            <p className="text-[10px] font-black uppercase tracking-widest">Perform a sector search to populate archive</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
            {/* ... Modals (ActivePitch, IsAddingLead) ... */}            {isAddingLead && (
                <div className="fixed inset-0 z-[2600] bg-black/90 backdrop-blur-xl flex items-center justify-center p-8">
                    <div className="w-full max-w-2xl bg-gray-950 border border-gray-800 rounded-[3rem] p-10 relative shadow-2xl">
                        <button onClick={() => setIsAddingLead(false)} className="absolute top-8 right-8 p-3 text-gray-500 hover:text-white transition-all"><X size={24} /></button>
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-3">
                            <UserPlus className="text-blue-500" /> Construct New Lead
                        </h3>
                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div>
                                <label className="text-[10px] font-black text-gray-600 uppercase mb-2 block tracking-widest">Venue Name</label>
                                <input type="text" value={newLead.venueName} onChange={e => setNewLead({ ...newLead, venueName: e.target.value })} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-white outline-none focus:border-blue-500" placeholder="e.g. Red Rocks" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-600 uppercase mb-2 block tracking-widest">City, State</label>
                                <input type="text" value={newLead.city} onChange={e => setNewLead({ ...newLead, city: e.target.value })} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-white outline-none focus:border-blue-500" placeholder="Morrison, CO" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-600 uppercase mb-2 block tracking-widest">Talent Buyer Name</label>
                                <input type="text" value={newLead.contactName} onChange={e => setNewLead({ ...newLead, contactName: e.target.value })} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-white outline-none focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-600 uppercase mb-2 block tracking-widest">Direct Email</label>
                                <input type="email" value={newLead.contactEmail} onChange={e => setNewLead({ ...newLead, contactEmail: e.target.value })} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-white outline-none focus:border-blue-500" />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => setIsAddingLead(false)} className="flex-1 py-4 text-[10px] font-black uppercase text-gray-500">Discard</button>
                            <button onClick={handleAddLead} className="flex-[2] py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Secure Lead to Pipeline</button>
                        </div>
                    </div>
                </div>
            )}
            {activePitch && (
                <div className="fixed inset-0 z-[2500] bg-black/90 backdrop-blur-xl flex items-center justify-center p-8">
                    <div className="w-full max-w-3xl bg-gray-950 border border-gray-800 rounded-[3rem] p-10 relative overflow-hidden flex flex-col max-h-[90vh]">
                        <button onClick={() => setActivePitch(null)} className="absolute top-8 right-8 p-3 bg-gray-900 rounded-full text-gray-500 hover:text-white"><X size={20} /></button>
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                                <Sparkles className="text-purple-500" size={28} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Pitch Architect</h3>
                                <p className="text-xs text-purple-400 font-black uppercase tracking-widest mt-1">AI-Powered Negotiation for {activePitch.venueName}</p>
                            </div>
                        </div>
                        <div className="flex-1 bg-black border border-gray-800 rounded-3xl p-8 overflow-y-auto relative min-h-[300px]">
                            {isGeneratingPitch ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md">
                                    <Loader2 className="animate-spin text-purple-500 mb-6" size={48} />
                                    <p className="text-[10px] font-black text-purple-500 uppercase tracking-[0.2em] animate-pulse">Drafting Master Pitch...</p>
                                </div>
                            ) : (
                                <textarea value={pitchContent} onChange={(e) => setPitchContent(e.target.value)} className="w-full h-full bg-transparent border-none text-gray-300 text-sm leading-relaxed resize-none focus:outline-none custom-scrollbar" />
                            )}
                        </div>
                        <div className="flex items-center justify-between mt-10">
                            <div className="flex items-center gap-4">
                                <button onClick={() => handleGeneratePitch(activePitch)} className="flex items-center gap-2 px-6 py-3 bg-gray-900 border border-gray-800 text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white">
                                    <Zap size={14} className="text-yellow-500" /> Regenerate
                                </button>
                                <button onClick={() => { navigator.clipboard.writeText(pitchContent); }} className="flex items-center gap-2 px-6 py-3 bg-gray-900 border border-gray-800 text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white" >
                                    <Copy size={14} className="text-blue-500" /> Copy to Clipboard
                                </button>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => setActivePitch(null)} className="px-6 py-3 text-[10px] font-black uppercase text-gray-600">Discard</button>
                                <button className="flex items-center gap-2 px-10 py-4 bg-purple-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-purple-500/20">
                                    <Send size={14} /> Send to Buyer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MasterRouting;
