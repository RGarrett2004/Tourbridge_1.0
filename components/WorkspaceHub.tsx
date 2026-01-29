
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Lock, Sparkles, Music, Camera, Briefcase, 
  ChevronRight, ArrowRight, Zap, Trophy, 
  BarChart3, Users, Layout, ShieldCheck, 
  Settings, CheckCircle2, Globe, FileText, ArrowUpRight, Store, Building2, ChevronDown, X,
  Search, CalendarCheck, Film, Target, TrendingUp, TrendingDown, Receipt, Filter, ChevronLeft, MapPin, UserCircle, Mail, ListFilter, Plus, UserPlus, Trash2, Copy, Send, Loader2, History, Banknote
} from 'lucide-react';
import { Tour, MerchSale, UserAccount, BandProfile, BudgetItem, GigOpportunity, PromoVideo } from '../types';
import MerchHub from './MerchHub';
import OrganizationVault from './OrganizationVault'; 
import StagePlotBuilder from './StagePlotBuilder';
import OnboardingChecklist from './OnboardingChecklist';
import { geminiService } from '../services/geminiService';
import { MOCK_TOURS } from '../constants';

// --- EMBEDDED TOOLS FROM PREVIOUS TOOLSPANEL ---

const TourBudgeter: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>(MOCK_TOURS);
  const [selectedTourId, setSelectedTourId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'ESTIMATED' | 'RECORDED'>('ESTIMATED');
  const [newCat, setNewCat] = useState('');
  const [newAmt, setNewAmt] = useState('');
  const [newType, setNewType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [newDesc, setNewDesc] = useState('');
  const selectedTour = tours.find(t => t.id === selectedTourId);
  const addItem = () => {
    if (!selectedTourId || !newCat || !newAmt) return;
    const newItem: BudgetItem = { id: Date.now().toString(), category: newCat, amount: parseFloat(newAmt), type: newType, mode: viewMode, description: newDesc };
    setTours(prev => prev.map(t => t.id === selectedTourId ? { ...t, budget: { items: [...t.budget.items, newItem] } } : t));
    setNewCat(''); setNewAmt(''); setNewDesc('');
  };
  const removeItem = (id: string) => { setTours(prev => prev.map(t => t.id === selectedTourId ? { ...t, budget: { items: t.budget.items.filter(i => i.id !== id) } } : t)); };
  const filteredItems = selectedTour?.budget.items.filter(i => i.mode === viewMode) || [];
  const stats = useMemo(() => { const income = filteredItems.filter(i => i.type === 'INCOME').reduce((a, b) => a + b.amount, 0); const expense = filteredItems.filter(i => i.type === 'EXPENSE').reduce((a, b) => a + b.amount, 0); return { income, expense, net: income - expense }; }, [filteredItems]);
  if (!selectedTourId) { return ( <div className="flex flex-col h-full bg-black p-12 overflow-y-auto"> <h2 className="text-5xl font-black text-white tracking-tighter uppercase mb-12">Finance Center</h2> <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> {tours.map(tour => ( <button key={tour.id} onClick={() => setSelectedTourId(tour.id)} className="bg-gray-900/40 border border-gray-800 p-8 rounded-[3rem] text-left hover:border-emerald-500/30 transition-all group"> <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">{tour.name}</h3> <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-6">Finance Ledger • {tour.status}</p> <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest"> <span className="text-gray-600">{tour.budget.items.length} Entries</span> <ChevronRight size={16} className="text-gray-700 group-hover:text-white" /> </div> </button> ))} </div> </div> ); }
  return ( <div className="flex flex-col h-full bg-black overflow-hidden"> <div className="h-20 border-b border-gray-900 bg-gray-950 flex items-center justify-between px-8 shrink-0"> <div className="flex items-center gap-6"> <button onClick={() => setSelectedTourId(null)} className="p-2 bg-gray-900 border border-gray-800 rounded-xl text-gray-500 hover:text-white transition-all"> <ChevronLeft size={20} /> </button> <div> <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{selectedTour.name} Budget</h2> <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Finance Tracking Dashboard</p> </div> </div> <div className="flex bg-gray-900 p-1 rounded-xl border border-gray-800"> <button onClick={() => setViewMode('ESTIMATED')} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'ESTIMATED' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/10' : 'text-gray-500 hover:text-white'}`}> <Target size={14} className="inline mr-2" /> Estimated </button> <button onClick={() => setViewMode('RECORDED')} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'RECORDED' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/10' : 'text-gray-500 hover:text-white'}`}> <CheckCircle2 size={14} className="inline mr-2" /> Recorded </button> </div> </div> <div className="flex-1 p-10 overflow-y-auto custom-scrollbar"> <div className="grid grid-cols-3 gap-8 mb-10"> <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-[2rem]"> <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2 flex items-center gap-2"> <TrendingUp size={14} /> Total Profit/Income </p> <p className="text-5xl font-black text-white tracking-tighter">${stats.income.toFixed(2)}</p> </div> <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-[2rem]"> <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2 flex items-center gap-2"> <TrendingDown size={14} /> Total Expenses </p> <p className="text-5xl font-black text-white tracking-tighter">${stats.expense.toFixed(2)}</p> </div> <div className={`p-8 rounded-[2rem] border ${stats.net >= 0 ? 'bg-blue-500/10 border-blue-500/20' : 'bg-red-900/10 border-red-500/20'}`}> <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Net Run Margin</p> <p className="text-5xl font-black text-white tracking-tighter">${stats.net.toFixed(2)}</p> </div> </div> <div className="bg-gray-950 border border-gray-800 p-8 rounded-[2.5rem] mb-10"> <div className="flex items-center gap-6"> <div className="flex-1 grid grid-cols-4 gap-4"> <input value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="Category (e.g. Merch)" className="bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500/50 outline-none" /> <input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Description" className="bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500/50 outline-none" /> <input value={newAmt} onChange={e => setNewAmt(e.target.value)} type="number" placeholder="Amount" className="bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500/50 outline-none" /> <select value={newType} onChange={e => setNewType(e.target.value as any)} className="bg-black border border-gray-800 rounded-xl px-4 py-3 text-[10px] font-black text-gray-400"> <option value="EXPENSE">EXPENSE</option> <option value="INCOME">PROFIT/INCOME</option> </select> </div> <button onClick={addItem} className="bg-white text-black px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5"> Add Entry </button> </div> </div> <div className="bg-gray-900/30 border border-gray-900 rounded-[3rem] overflow-hidden"> <div className="p-6 border-b border-gray-900 bg-gray-950 flex justify-between items-center"> <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{viewMode} LEDGER</h3> <button className="text-[9px] font-black text-gray-600 uppercase hover:text-white transition-all flex items-center gap-2"> <Filter size={12} /> Deep Filter </button> </div> <div className="divide-y divide-gray-900"> {filteredItems.length > 0 ? filteredItems.map(item => ( <div key={item.id} className="p-6 flex items-center justify-between group hover:bg-white/5 transition-all"> <div className="flex items-center gap-6"> <div className={`p-3 rounded-2xl ${item.type === 'INCOME' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}> {item.type === 'INCOME' ? <TrendingUp size={18} /> : <TrendingDown size={18} />} </div> <div> <h4 className="text-sm font-black text-white uppercase tracking-tight">{item.category}</h4> <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{item.description}</p> </div> </div> <div className="flex items-center gap-8"> <p className={`text-xl font-black ${item.type === 'INCOME' ? 'text-emerald-500' : 'text-red-500'}`}> {item.type === 'INCOME' ? '+' : '-'}${item.amount.toFixed(2)} </p> <button onClick={() => removeItem(item.id)} className="p-2 text-gray-800 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"> <Trash2 size={18} /> </button> </div> </div> )) : ( <div className="py-20 text-center flex flex-col items-center justify-center"> <div className="p-4 bg-gray-900 rounded-full border border-gray-800 mb-4"> <Receipt size={24} className="text-gray-700" /> </div> <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">No entries recorded for this mode</p> </div> )} </div> </div> </div> </div> );
};

interface GigSchedulerProps {
  opportunities: GigOpportunity[];
  onUpdateOpportunities: (opps: GigOpportunity[]) => void;
}

const GigScheduler: React.FC<GigSchedulerProps> = ({ opportunities, onUpdateOpportunities }) => {
  const [view, setView] = useState<'PIPELINE' | 'WAREHOUSE'>('PIPELINE');
  const [activePitch, setActivePitch] = useState<GigOpportunity | null>(null);
  const [pitchContent, setPitchContent] = useState('');
  const [isGeneratingPitch, setIsGeneratingPitch] = useState(false);
  const [isAddingLead, setIsAddingLead] = useState(false);
  const [warehouseSearch, setWarehouseSearch] = useState('');
  const [warehouseLoading, setWarehouseLoading] = useState(false);
  const [warehouseResults, setWarehouseResults] = useState<{name: string, city: string, contact?: string, email?: string}[]>([]);
  const [newLead, setNewLead] = useState<Partial<GigOpportunity>>({ venueName: '', city: '', date: '', status: 'LEAD', fee: 0, contactName: '', contactEmail: '', capacity: 0 });
  const getStatusStyle = (status: GigOpportunity['status']) => { switch (status) { case 'CONFIRMED': return 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'; case 'CONTRACTED': return 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'; case 'HOLD_1': return 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20'; case 'HOLD_2': return 'bg-orange-500 text-black shadow-lg shadow-orange-500/20'; case 'PITCHED': return 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'; case 'SETTLED': return 'bg-gray-500 text-white'; default: return 'bg-gray-800 text-gray-400 border border-gray-700'; } };
  const handleUpdateStatus = (id: string, newStatus: GigOpportunity['status']) => { onUpdateOpportunities(opportunities.map(opp => opp.id === id ? { ...opp, status: newStatus } : opp)); };
  const handleAddLead = () => { if (!newLead.venueName || !newLead.city) return; const lead: GigOpportunity = { ...newLead, id: Date.now().toString(), } as GigOpportunity; onUpdateOpportunities([lead, ...opportunities]); setIsAddingLead(false); setNewLead({ venueName: '', city: '', date: '', status: 'LEAD', fee: 0, contactName: '', contactEmail: '', capacity: 0 }); };
  const handleRemoveOpportunity = (id: string) => { onUpdateOpportunities(opportunities.filter(opp => opp.id !== id)); };
  const handleGeneratePitch = async (opp: GigOpportunity) => { setIsGeneratingPitch(true); try { const ai = new GoogleGenAI({ apiKey: process.env.API_KEY }); const prompt = `Draft a professional yet high-energy gig pitch email from an independent touring band (Reggae Rock) to a talent buyer named ${opp.contactName || 'the Talent Buyer'} at ${opp.venueName}. The date they are looking for is ${opp.date}. Mention our strong regional draw and recent successful shows. Include a professional tech rider link (placeholder). Focus on the "vibe" and business reliability.`; const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt }); setPitchContent(response.text || "Failed to generate pitch."); } catch (error) { setPitchContent("Error communicating with the AI Agent."); } finally { setIsGeneratingPitch(false); } };
  const handleWarehouseSearch = async () => { if (!warehouseSearch) return; setWarehouseLoading(true); try { const ai = new GoogleGenAI({ apiKey: process.env.API_KEY }); const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: `I need contact information for talent buyers or booking agents at venues in "${warehouseSearch}". Return a JSON list of 5 real or probable venues with their name, city, and if possible, a name and email for the booking contact. Format as JSON array: [{ "name": "", "city": "", "contact": "", "email": "" }]`, config: { responseMimeType: "application/json" } }); const data = JSON.parse(response.text || '[]'); setWarehouseResults(data); } catch (e) { console.error(e); } finally { setWarehouseLoading(false); } };
  return ( <div className="flex flex-col h-full bg-black overflow-hidden relative"> <div className="h-20 border-b border-gray-900 bg-gray-950 flex items-center justify-between px-8 shrink-0"> <div className="flex items-center gap-6"> <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20"> <CalendarCheck className="text-blue-500" size={24} /> </div> <div> <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Agent Warehouse</h2> <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Gig Pipeline & Deal Tracking</p> </div> </div> <div className="flex bg-gray-900 p-1 rounded-xl border border-gray-800"> <button onClick={() => setView('PIPELINE')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'PIPELINE' ? 'bg-white text-black shadow-xl shadow-white/5' : 'text-gray-500 hover:text-white'}`}>Pipeline View</button> <button onClick={() => setView('WAREHOUSE')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'WAREHOUSE' ? 'bg-white text-black shadow-xl shadow-white/5' : 'text-gray-500 hover:text-white'}`}>Venue Archive</button> </div> </div> <div className="flex-1 overflow-y-auto custom-scrollbar"> {view === 'PIPELINE' ? ( <div className="p-8"> <div className="flex justify-between items-end mb-8"> <div> <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"> <ListFilter size={14} className="text-blue-500" /> Active Deals </h3> </div> <button onClick={() => setIsAddingLead(true)} className="px-6 py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-white/10" > <Plus size={16} className="inline mr-2" /> New Lead </button> </div> <div className="grid grid-cols-1 gap-4"> {opportunities.map(opp => ( <div key={opp.id} className="bg-gray-900/40 border border-gray-800 p-6 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-blue-500/30 transition-all relative overflow-hidden"> <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none"> <Building2 size={80} className="text-white" /> </div> <div className="flex items-center gap-6 flex-1 min-w-[300px]"> <div className="text-center w-20 border-r border-gray-800 pr-6 shrink-0"> <p className="text-[10px] font-black text-gray-600 uppercase mb-0.5">{opp.date ? new Date(opp.date).toLocaleDateString('en-US', { month: 'short' }) : '---'}</p> <p className="text-2xl font-black text-white">{opp.date ? new Date(opp.date).getDate() : '--'}</p> </div> <div> <div className="flex items-center gap-3 mb-1"> <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-none">{opp.venueName}</h3> <span className="text-[8px] bg-gray-800 text-gray-500 px-2 py-0.5 rounded font-black uppercase tracking-widest">Cap: {opp.capacity || 'TBD'}</span> </div> <p className="text-xs text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2"> <MapPin size={12} className="text-red-500" /> {opp.city} </p> </div> </div> <div className="flex items-center gap-8 px-8 border-x border-gray-800/50 flex-1"> <div className="flex-1 min-w-[140px]"> <p className="text-[8px] font-black text-gray-600 uppercase mb-1 flex items-center gap-1.5"><UserCircle size={10} /> Contact</p> <p className="text-xs font-black text-gray-300 uppercase truncate">{opp.contactName || 'Finding Buyer...'}</p> <p className="text-[10px] text-gray-600 truncate">{opp.contactEmail || 'No Email'}</p> </div> <div className="flex-1 text-right min-w-[120px]"> <p className="text-[8px] font-black text-gray-600 uppercase mb-1">Deal Terms</p> <p className="text-xs font-black text-blue-400 uppercase truncate">{opp.dealTerms || 'Negotiating'}</p> <p className="text-sm font-black text-white">${opp.fee || '0.00'}</p> </div> </div> <div className="flex items-center gap-4 shrink-0"> <select value={opp.status} onChange={(e) => handleUpdateStatus(opp.id, e.target.value as any)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-transparent outline-none cursor-pointer appearance-none text-center ${getStatusStyle(opp.status)}`} > <option value="LEAD">LEAD</option> <option value="PITCHED">PITCHED</option> <option value="HOLD_1">HOLD 1</option> <option value="HOLD_2">HOLD 2</option> <option value="CONFIRMED">CONFIRMED</option> <option value="CONTRACTED">CONTRACTED</option> <option value="SETTLED">SETTLED</option> </select> <button onClick={() => { setActivePitch(opp); handleGeneratePitch(opp); }} className="p-3 bg-gray-800 hover:bg-purple-600/20 text-gray-400 hover:text-purple-400 rounded-xl transition-all border border-gray-700" title="Draft Pitch with AI" > <Sparkles size={18} /> </button> <button onClick={() => handleRemoveOpportunity(opp.id)} className="p-3 bg-gray-800 hover:bg-red-500/20 text-gray-400 hover:text-red-500 rounded-xl transition-all border border-gray-700" title="Discard Lead" > <Trash2 size={18} /> </button> </div> </div> ))} </div> </div> ) : ( <div className="p-8"> <div className="bg-gray-900 border border-gray-800 rounded-[3rem] p-10 mb-8 relative overflow-hidden"> <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none"> <Building2 size={120} /> </div> <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Venue Discovery Engine</h3> <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-8">Search the global database of talent buyers and contact details</p> <div className="flex gap-4"> <div className="flex-1 relative"> <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} /> <input type="text" placeholder="Enter city or region (e.g. Austin, TX Venue Contacts)" className="w-full bg-black border border-gray-800 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:border-blue-500 outline-none" value={warehouseSearch} onChange={(e) => setWarehouseSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleWarehouseSearch()} /> </div> <button onClick={handleWarehouseSearch} disabled={warehouseLoading} className="px-10 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/10" > {warehouseLoading ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />} {warehouseLoading ? 'Indexing...' : 'Fetch Contacts'} </button> </div> </div> <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {warehouseResults.map((result, idx) => ( <div key={idx} className="bg-gray-950 border border-gray-900 rounded-[2.5rem] p-8 flex flex-col hover:border-blue-500/20 transition-all group shadow-2xl"> <div className="flex justify-between items-start mb-6"> <div className="p-4 bg-gray-900 rounded-2xl border border-gray-800 group-hover:bg-blue-500/5 transition-all"> <Building2 className="text-blue-500" size={24} /> </div> <button onClick={() => { setNewLead({ venueName: result.name, city: result.city, contactName: result.contact, contactEmail: result.email }); setIsAddingLead(true); }} className="p-3 bg-gray-900 rounded-xl text-gray-500 hover:text-emerald-500 border border-gray-800 hover:border-emerald-500/30 transition-all" title="Convert to Lead" > <Plus size={20} /> </button> </div> <h4 className="text-xl font-black text-white uppercase tracking-tight mb-1">{result.name}</h4> <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-6 flex items-center gap-2"> <MapPin size={12} className="text-red-500" /> {result.city} </p> <div className="space-y-3 pt-6 border-t border-gray-900"> <div className="flex items-center gap-3"> <UserCircle size={14} className="text-gray-700" /> <p className="text-xs text-gray-400 font-medium uppercase tracking-tighter">{result.contact || 'Contact Hidden'}</p> </div> <div className="flex items-center gap-3"> <Mail size={14} className="text-gray-700" /> <p className="text-xs text-gray-400 truncate">{result.email || 'Email Protected'}</p> </div> </div> <button onClick={() => { const opp: GigOpportunity = { venueName: result.name, city: result.city, contactName: result.contact, contactEmail: result.email, status: 'LEAD' } as any; setActivePitch(opp); handleGeneratePitch(opp); }} className="mt-8 w-full py-4 bg-gray-900 border border-gray-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-purple-400 hover:border-purple-400/30 transition-all flex items-center justify-center gap-2" > <Sparkles size={14} /> Quick AI Pitch </button> </div> ))} {warehouseResults.length === 0 && !warehouseLoading && ( <div className="col-span-full py-20 text-center opacity-30 flex flex-col items-center"> <History size={64} className="mb-4" /> <p className="text-[10px] font-black uppercase tracking-widest">Perform a sector search to populate archive</p> </div> )} </div> </div> )} </div> {isAddingLead && ( <div className="fixed inset-0 z-[2600] bg-black/90 backdrop-blur-xl flex items-center justify-center p-8"> <div className="w-full max-w-2xl bg-gray-950 border border-gray-800 rounded-[3rem] p-10 relative shadow-2xl"> <button onClick={() => setIsAddingLead(false)} className="absolute top-8 right-8 p-3 text-gray-500 hover:text-white transition-all"><X size={24} /></button> <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-3"> <UserPlus className="text-blue-500" /> Construct New Lead </h3> <div className="grid grid-cols-2 gap-6 mb-8"> <div> <label className="text-[10px] font-black text-gray-600 uppercase mb-2 block tracking-widest">Venue Name</label> <input type="text" value={newLead.venueName} onChange={e => setNewLead({...newLead, venueName: e.target.value})} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-white outline-none focus:border-blue-500" placeholder="e.g. Red Rocks" /> </div> <div> <label className="text-[10px] font-black text-gray-600 uppercase mb-2 block tracking-widest">City, State</label> <input type="text" value={newLead.city} onChange={e => setNewLead({...newLead, city: e.target.value})} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-white outline-none focus:border-blue-500" placeholder="Morrison, CO" /> </div> <div> <label className="text-[10px] font-black text-gray-600 uppercase mb-2 block tracking-widest">Talent Buyer Name</label> <input type="text" value={newLead.contactName} onChange={e => setNewLead({...newLead, contactName: e.target.value})} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-white outline-none focus:border-blue-500" /> </div> <div> <label className="text-[10px] font-black text-gray-600 uppercase mb-2 block tracking-widest">Direct Email</label> <input type="email" value={newLead.contactEmail} onChange={e => setNewLead({...newLead, contactEmail: e.target.value})} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-white outline-none focus:border-blue-500" /> </div> </div> <div className="flex gap-4"> <button onClick={() => setIsAddingLead(false)} className="flex-1 py-4 text-[10px] font-black uppercase text-gray-500">Discard</button> <button onClick={handleAddLead} className="flex-[2] py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Secure Lead to Pipeline</button> </div> </div> </div> )} {activePitch && ( <div className="fixed inset-0 z-[2500] bg-black/90 backdrop-blur-xl flex items-center justify-center p-8"> <div className="w-full max-w-3xl bg-gray-950 border border-gray-800 rounded-[3rem] p-10 relative overflow-hidden flex flex-col max-h-[90vh]"> <button onClick={() => setActivePitch(null)} className="absolute top-8 right-8 p-3 bg-gray-900 rounded-full text-gray-500 hover:text-white"><X size={20} /></button> <div className="flex items-center gap-4 mb-10"> <div className="p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20"> <Sparkles className="text-purple-500" size={28} /> </div> <div> <h3 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Pitch Architect</h3> <p className="text-xs text-purple-400 font-black uppercase tracking-widest mt-1">AI-Powered Negotiation for {activePitch.venueName}</p> </div> </div> <div className="flex-1 bg-black border border-gray-800 rounded-3xl p-8 overflow-y-auto relative min-h-[300px]"> {isGeneratingPitch ? ( <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md"> <Loader2 className="animate-spin text-purple-500 mb-6" size={48} /> <p className="text-[10px] font-black text-purple-500 uppercase tracking-[0.2em] animate-pulse">Drafting Master Pitch...</p> </div> ) : ( <textarea value={pitchContent} onChange={(e) => setPitchContent(e.target.value)} className="w-full h-full bg-transparent border-none text-gray-300 text-sm leading-relaxed resize-none focus:outline-none custom-scrollbar" /> )} </div> <div className="flex items-center justify-between mt-10"> <div className="flex items-center gap-4"> <button onClick={() => handleGeneratePitch(activePitch)} className="flex items-center gap-2 px-6 py-3 bg-gray-900 border border-gray-800 text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white"> <Zap size={14} className="text-yellow-500" /> Regenerate </button> <button onClick={() => { navigator.clipboard.writeText(pitchContent); }} className="flex items-center gap-2 px-6 py-3 bg-gray-900 border border-gray-800 text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white" > <Copy size={14} className="text-blue-500" /> Copy to Clipboard </button> </div> <div className="flex gap-4"> <button onClick={() => setActivePitch(null)} className="px-6 py-3 text-[10px] font-black uppercase text-gray-600">Discard</button> <button className="flex items-center gap-2 px-10 py-4 bg-purple-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-purple-500/20"> <Send size={14} /> Send to Buyer </button> </div> </div> </div> </div> )} </div> );
};

const PromoManager: React.FC = () => {
  const [videos, setVideos] = useState<PromoVideo[]>([ { id: 'v1', name: 'Summer Tour Sizzle Reel', url: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4', type: 'EPK', date: '2024-05-15' } ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { const vid: PromoVideo = { id: Date.now().toString(), name: file.name, url: reader.result as string, type: 'PROMO', date: new Date().toISOString().split('T')[0] }; setVideos(prev => [...prev, vid]); }; reader.readAsDataURL(file); };
  const removeVideo = (id: string) => { setVideos(prev => prev.filter(v => v.id !== id)); };
  return ( <div className="flex flex-col h-full bg-black"> <div className="h-20 border-b border-gray-900 bg-gray-950 flex items-center justify-between px-8 shrink-0"> <div className="flex items-center gap-6"> <div className="p-3 bg-pink-500/10 rounded-2xl border border-pink-500/20"> <Film className="text-pink-500" size={24} /> </div> <div> <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Promo Package</h2> <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">EPK & Video Assets</p> </div> </div> <button onClick={() => inputRef.current?.click()} className="flex items-center gap-3 px-6 py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl" > <Plus size={16} /> Upload Video </button> <input type="file" ref={inputRef} accept="video/*" className="hidden" onChange={handleUpload} /> </div> <div className="flex-1 overflow-y-auto p-10 custom-scrollbar"> {videos.length === 0 ? ( <div className="flex flex-col items-center justify-center h-full opacity-30"> <Film size={64} className="mb-4 text-gray-600" /> <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">No promo videos uploaded</p> </div> ) : ( <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"> {videos.map(vid => ( <div key={vid.id} className="bg-gray-900 border border-gray-800 rounded-[2.5rem] overflow-hidden group hover:border-pink-500/30 transition-all"> <div className="aspect-video bg-black relative"> <video src={vid.url} className="w-full h-full object-cover opacity-80" controls /> </div> <div className="p-6"> <div className="flex justify-between items-start mb-4"> <div> <h4 className="text-lg font-black text-white uppercase tracking-tight leading-tight mb-1">{vid.name}</h4> <span className="text-[9px] bg-gray-800 text-gray-500 px-2 py-0.5 rounded font-bold uppercase tracking-widest">{vid.type}</span> </div> <button onClick={() => removeVideo(vid.id)} className="text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={18} /></button> </div> <div className="flex justify-between items-center pt-4 border-t border-gray-800"> <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{vid.date}</span> <button className="flex items-center gap-2 text-[10px] font-black text-pink-500 uppercase tracking-widest hover:text-white transition-colors"> <Copy size={12} /> Copy Link </button> </div> </div> </div> ))} </div> )} </div> </div> );
};

// --- END EMBEDDED TOOLS ---

interface WorkspaceHubProps {
  unlockedWorkspaces: string[];
  onUnlock: (role: string) => void;
  tours: Tour[];
  salesHistory: MerchSale[];
  onUpdateSales: (sales: MerchSale[]) => void;
  currentUser: UserAccount;
  bands: BandProfile[];
  opportunities: GigOpportunity[];
  onUpdateOpportunities: (opps: GigOpportunity[]) => void;
}

const WorkspaceHub: React.FC<WorkspaceHubProps> = ({ 
  unlockedWorkspaces, 
  onUnlock, 
  tours, 
  salesHistory, 
  onUpdateSales,
  currentUser,
  bands,
  opportunities,
  onUpdateOpportunities
}) => {
  const [activePlayground, setActivePlayground] = useState<string | null>(null);
  const [activeOrgId, setActiveOrgId] = useState<string | null>(null);
  const [showVault, setShowVault] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [citySearch, setCitySearch] = useState('');
  const [aiTips, setAiTips] = useState<string | null>(null);
  const [loadingTips, setLoadingTips] = useState(false);

  const fetchCityTips = async () => {
    if (!citySearch) return;
    setLoadingTips(true);
    const tips = await geminiService.getTourTip(citySearch);
    setAiTips(tips);
    setLoadingTips(false);
  };

  // 1. Determine available organizations for the current user
  const userOrgs = useMemo(() => {
    if (currentUser.type === 'ORGANIZATION') {
      return [{ id: currentUser.id, name: currentUser.name }];
    }
    return bands.filter(b => b.members.some(m => m.userId === currentUser.id)).map(b => ({
      id: b.id,
      name: b.name
    }));
  }, [currentUser, bands]);

  // 2. Set default active org or validate existing one
  useEffect(() => {
    if (userOrgs.length > 0) {
      const isActiveValid = userOrgs.some(o => o.id === activeOrgId);
      if (!activeOrgId || !isActiveValid) {
        setActiveOrgId(userOrgs[0].id);
      }
    } else {
      setActiveOrgId(null);
    }
  }, [userOrgs, activeOrgId]);

  // 3. Determine permissions for the selected organization
  const currentPermissions = useMemo(() => {
    if (!activeOrgId) return [];
    if (currentUser.type === 'ORGANIZATION' && currentUser.id === activeOrgId) return ['TOUR_OPS', 'MEDIA', 'MERCH'];
    const band = bands.find(b => b.id === activeOrgId);
    if (!band) return [];
    const member = band.members.find(m => m.userId === currentUser.id);
    return member?.permissions || [];
  }, [activeOrgId, currentUser, bands]);

  // 4. Filter data for the active organization context
  const orgTours = useMemo(() => tours.filter(t => t.ownerId === activeOrgId), [tours, activeOrgId]);

  const playgrounds = [
    {
      id: 'TOUR_OPS',
      role: 'Tour Operations',
      sub: 'Artist & Management Unified',
      description: 'The central command for routing, financials, booking, and team logistics. Everything you need to run the show.',
      icon: Briefcase,
      color: 'emerald',
      accent: 'text-emerald-400',
      bgAccent: 'bg-emerald-500/10',
      tools: [
        { label: 'Gig Pipeline', icon: CalendarCheck, toolId: 'GIGS' },
        { label: 'Financials', icon: Banknote, toolId: 'BUDGET' },
        { label: 'Vault', icon: Lock, toolId: 'VAULT' },
        { label: 'Master Routing', icon: MapPin, toolId: 'ROUTING' } // Routing just placeholder or opens Gigs
      ]
    },
    {
      id: 'MEDIA',
      role: 'Media Lab',
      sub: 'Creator Workzone',
      description: 'Manage your portfolio, gear registry, and client shooting schedule. The creative engine for tour content.',
      icon: Camera,
      color: 'purple',
      accent: 'text-purple-400',
      bgAccent: 'bg-purple-500/10',
      tools: [
        { label: 'Promo Package', icon: Film, toolId: 'PROMO' },
        { label: 'Stage Plot', icon: FileText, toolId: 'PLOT' },
      ]
    },
    {
      id: 'MERCH',
      role: 'Merch Master',
      sub: 'Retail Logistics',
      description: 'Full inventory tracking, POS terminal, and sales analytics. Manage your merch table like a storefront.',
      icon: Store,
      color: 'orange',
      accent: 'text-orange-400',
      bgAccent: 'bg-orange-500/10',
      tools: [] // Merch has its own full view
    }
  ];

  const handleLaunchTool = (toolId: string) => {
    setActiveTool(toolId);
  };

  if (activePlayground === 'MERCH') {
    return (
      <MerchHub 
        tours={orgTours}
        salesHistory={salesHistory}
        onUpdateSales={onUpdateSales}
        onBack={() => setActivePlayground(null)}
      />
    );
  }

  // Handle Tool Overlays
  if (activeTool || showVault) {
    const isVault = activeTool === 'VAULT' || showVault;
    return (
      <div className="fixed inset-0 z-[2000] bg-black animate-in fade-in zoom-in-95 duration-300 flex flex-col">
         <div className="absolute top-6 right-6 z-[2100]">
            <button 
              onClick={() => { setActiveTool(null); setShowVault(false); }}
              className="p-3 bg-gray-900 border border-gray-800 rounded-full text-gray-400 hover:text-white transition-all hover:scale-110"
            >
              <X size={24} />
            </button>
         </div>
         {activeTool === 'PLOT' && <StagePlotBuilder />}
         {activeTool === 'BUDGET' && <TourBudgeter />}
         {(activeTool === 'GIGS' || activeTool === 'ROUTING') && (
           <GigScheduler 
             opportunities={opportunities} 
             onUpdateOpportunities={onUpdateOpportunities} 
           />
         )}
         {activeTool === 'PROMO' && <PromoManager />}
         {isVault && <OrganizationVault />}
      </div>
    );
  }

  const handleChecklistAction = (action: string) => {
    if (action === 'VAULT') {
      setShowVault(true);
    }
  };

  if (activePlayground) {
    const playground = playgrounds.find(p => p.id === activePlayground)!;
    return (
      <div className="flex flex-col h-full bg-black animate-in fade-in slide-in-from-right-4">
        <div className="h-20 border-b border-gray-900 bg-gray-950 flex items-center justify-between px-10">
           <div className="flex items-center gap-4">
              <button onClick={() => setActivePlayground(null)} className="p-2 bg-gray-900 rounded-xl text-gray-500 hover:text-white"><ChevronRight className="rotate-180" size={20}/></button>
              <div className="flex items-center gap-3">
                 <div className={`p-2 ${playground.bgAccent} rounded-xl`}>
                    <playground.icon className={playground.accent} size={20} />
                 </div>
                 <h2 className="text-xl font-black text-white uppercase tracking-tighter">{playground.role} Playground</h2>
              </div>
           </div>
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl">
                 <ShieldCheck size={14} className="text-emerald-500" />
                 <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active Ops Mode</span>
              </div>
              <button className="p-2 text-gray-500 hover:text-white"><Settings size={20} /></button>
           </div>
        </div>

        <div className="flex-1 p-12 overflow-y-auto custom-scrollbar">
           <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
              <div className="xl:col-span-3 space-y-10">
                 {/* Main Dashboard Stats */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-900/40 border border-gray-800 p-8 rounded-[2.5rem] relative overflow-hidden">
                       <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">Workspace Health</p>
                       <p className="text-4xl font-black text-white">94%</p>
                       <div className="mt-4 h-1.5 w-full bg-gray-800 rounded-full"><div className={`h-full ${playground.accent.replace('text-', 'bg-')} w-[94%]`} /></div>
                    </div>
                    <div className="bg-gray-900/40 border border-gray-800 p-8 rounded-[2.5rem]">
                       <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">Active Pitches</p>
                       <p className="text-4xl font-black text-white">{opportunities.filter(o => o.status !== 'SETTLED').length}</p>
                    </div>
                    <div className="bg-gray-900/40 border border-gray-800 p-8 rounded-[2.5rem]">
                       <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">Network Rank</p>
                       <p className="text-4xl font-black text-yellow-500 flex items-center gap-2">A+ <Trophy size={20} /></p>
                    </div>
                 </div>

                 {/* Module Grid */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {playground.tools.map((tool, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => handleLaunchTool(tool.toolId)}
                        className="bg-gray-950 border border-gray-800 p-8 rounded-[3rem] hover:border-gray-700 transition-all cursor-pointer group shadow-2xl text-left flex flex-col h-full"
                      >
                         <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 ${playground.bgAccent} rounded-2xl group-hover:scale-110 transition-transform`}>
                               <tool.icon className={playground.accent} />
                            </div>
                            <ArrowRight size={20} className="text-gray-700 group-hover:text-white" />
                         </div>
                         <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">{tool.label}</h3>
                         <p className="text-xs text-gray-600 font-bold uppercase tracking-widest leading-relaxed">Launch {tool.label.toLowerCase()} tactical interface</p>
                      </button>
                    ))}
                 </div>
              </div>

              <div className="space-y-8">
                 <div className="bg-gray-950 border border-gray-900 p-8 rounded-[3rem]">
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2"><Globe size={14} /> Global Feed</h3>
                    <div className="space-y-6">
                       {[1, 2, 3].map(i => (
                         <div key={i} className="flex gap-4 border-l-2 border-gray-800 pl-4 py-1">
                            <div className="text-[9px] font-black text-gray-700 uppercase pt-0.5">2h ago</div>
                            <p className="text-xs text-gray-400">New venue certificated in Nashville sector. View details.</p>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black p-12 overflow-y-auto custom-scrollbar">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <span className="p-2 bg-blue-500/10 rounded-lg"><Layout className="text-blue-500" size={18} /></span>
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Backstage Control Center</span>
           </div>
           <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Role Hub & Workspaces</h1>
           <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-4">Activate specialized tactical interfaces for your industry role.</p>
        </div>

        {/* Organization Context Switcher */}
        {userOrgs.length > 0 && (
          <div className="bg-gray-900 p-2 rounded-[1.5rem] border border-gray-800 flex items-center gap-2">
             <div className="px-4 py-2">
                <span className="text-[8px] font-black text-gray-500 uppercase block tracking-widest mb-0.5">Acting As</span>
                <div className="relative group">
                   <select 
                    value={activeOrgId || ''} 
                    onChange={(e) => setActiveOrgId(e.target.value)}
                    className="appearance-none bg-transparent text-white font-black text-sm uppercase tracking-tight outline-none pr-6 cursor-pointer"
                   >
                      {userOrgs.map(org => (
                        <option key={org.id} value={org.id}>{org.name}</option>
                      ))}
                   </select>
                   <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={14} />
                </div>
             </div>
             <div className="h-10 w-10 bg-gray-800 rounded-full flex items-center justify-center">
                <Building2 size={18} className="text-gray-400" />
             </div>
          </div>
        )}
      </div>

      {/* Tour Intel Section Integrated */}
      <div className="mb-12 bg-gray-900/50 border border-gray-800 p-6 rounded-[2.5rem]">
        <h3 className="font-bold flex items-center gap-2 text-white mb-3">
          <span className="p-1.5 bg-yellow-500/10 rounded-lg">
            <Sparkles className="w-4 h-4 text-yellow-500" />
          </span>
          Tour Intel (AI Agent)
        </h3>
        <p className="text-xs text-gray-400 mb-4">Get localized tips for any city on your route.</p>
        <div className="flex gap-2 max-w-lg">
          <input 
            type="text" 
            placeholder="e.g. Austin, TX"
            className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 text-white placeholder:text-gray-600"
            value={citySearch}
            onChange={(e) => setCitySearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchCityTips()}
          />
          <button 
            onClick={fetchCityTips}
            disabled={loadingTips}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center"
          >
            {loadingTips ? <Search className="animate-spin" size={18} /> : <Search size={18} />}
          </button>
        </div>
        {aiTips && (
          <div className="mt-4 p-4 bg-black/40 rounded-2xl text-sm text-gray-300 border border-gray-800 animate-in slide-in-from-top-2">
             <div className="prose prose-invert prose-sm">
                {aiTips.split('\n').map((line, i) => <p key={i} className="mb-2 last:mb-0">{line}</p>)}
             </div>
          </div>
        )}
      </div>

      <div className="mb-12">
         {/* Insert Pro Checklist Widget here for organizations */}
         {activeOrgId && <OnboardingChecklist onAction={handleChecklistAction} />}
      </div>

      {userOrgs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-800 rounded-[3rem]">
           <Building2 size={48} className="text-gray-700 mb-6" />
           <h3 className="text-xl font-black text-gray-600 uppercase tracking-widest">No Organizations Found</h3>
           <p className="text-gray-500 text-xs mt-2">Join a band or create an organization to access workspaces.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {playgrounds.map(playground => {
            const hasPermission = currentPermissions.includes(playground.id); 
            const isUnlocked = hasPermission || unlockedWorkspaces.includes(playground.id);
            
            return (
              <div key={playground.id} className="relative group">
                <div className={`bg-gray-900 border border-gray-800 rounded-[3.5rem] p-10 h-full flex flex-col transition-all duration-500 ${!isUnlocked ? 'opacity-60 grayscale hover:grayscale-0 hover:opacity-100 hover:border-gray-700' : 'hover:border-emerald-500/30 ring-1 ring-white/5 shadow-2xl'}`}>
                   <div className="flex justify-between items-start mb-10">
                      <div className={`p-6 ${playground.bgAccent} rounded-[2rem] shadow-xl group-hover:scale-105 transition-transform`}>
                         <playground.icon className={isUnlocked ? playground.accent : 'text-gray-600'} size={32} />
                      </div>
                      {!isUnlocked ? (
                         <div className="flex items-center gap-2 p-3 bg-black/40 rounded-2xl border border-gray-800 text-gray-500">
                            <Lock size={14} />
                            <span className="text-[8px] font-black uppercase tracking-widest">Restricted</span>
                         </div>
                      ) : (
                         <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-2xl">
                            <CheckCircle2 size={12} className="text-emerald-500" />
                            <span className="text-[8px] font-black text-emerald-500 uppercase">Authorized</span>
                         </div>
                      )}
                   </div>

                   <div>
                      <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-1">{playground.role}</h3>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-4">{playground.sub}</p>
                      <p className="text-sm text-gray-400 font-medium leading-relaxed mb-10">{playground.description}</p>
                   </div>
                   
                   <div className="mt-auto pt-8 border-t border-gray-800">
                      {isUnlocked ? (
                         <button 
                          onClick={() => setActivePlayground(playground.id)}
                          className={`w-full py-5 bg-white text-black rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-white/5`}
                         >
                            Enter Playground <ArrowRight size={18} />
                         </button>
                      ) : (
                         <div className="w-full py-5 bg-gray-800/50 text-gray-500 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 border border-gray-700/50">
                            Request Access <Lock size={14} />
                         </div>
                      )}
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-20 p-12 bg-gray-900/30 border border-gray-800 rounded-[4rem] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-purple-500 to-blue-500 opacity-20" />
         <div className="max-w-xl">
            <h4 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Cross-Role Collaboration</h4>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-relaxed">TourBridge workspaces sync data in real-time. Unlocking multiple roles allows you to jump between workflows seamlessly.</p>
         </div>
         <div className="flex gap-4">
            <div className="bg-gray-950 p-4 rounded-3xl border border-gray-800 text-center w-32">
               <p className="text-2xl font-black text-white">4k+</p>
               <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Active Artists</p>
            </div>
            <div className="bg-gray-950 p-4 rounded-3xl border border-gray-800 text-center w-32">
               <p className="text-2xl font-black text-white">800+</p>
               <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Vetted Pros</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default WorkspaceHub;
