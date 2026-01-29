
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import {
  Briefcase, FileText, Calendar, Compass,
  Search, Sparkles, X, Plus, Trash2, DollarSign,
  Receipt, TrendingDown, TrendingUp, CalendarCheck, MapPin,
  Target, CheckCircle2, ChevronRight, LayoutGrid, Filter, ChevronLeft,
  Banknote, Building2, UserCircle, Mail, Phone, Info, Zap, Send,
  ArrowRightLeft, ListFilter, Layout, Loader2, Home, Edit3, MoreHorizontal,
  ExternalLink, Check, Copy, History, UserPlus, Globe, Video, PlayCircle, Film, Lock
} from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { useAuth } from '../contexts/AuthContext';
import StagePlotBuilder from './StagePlotBuilder';
import OrganizationVault from './OrganizationVault';
import MasterRouting from './Routing/MasterRouting';
import { BudgetItem, GigOpportunity, Tour, PromoVideo } from '../types';
import { MOCK_TOURS } from '../constants';

// --- RE-INSERTING THE UNCHANGED SUB-COMPONENTS TO ENSURE FILE INTEGRITY ---
const TourBudgeter: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>(MOCK_TOURS);
  const [selectedTourId, setSelectedTourId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'ESTIMATED' | 'RECORDED'>('ESTIMATED');
  const [newCat, setNewCat] = useState('');
  const [newAmt, setNewAmt] = useState('');
  const [newType, setNewType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [newDesc, setNewDesc] = useState('');
  const { isDemoMode } = useAuth();
  const selectedTour = tours.find(t => t.id === selectedTourId);
  const addItem = () => {
    if (isDemoMode) { alert("Feature Disabled in Demo Account"); return; }
    if (!selectedTourId || !newCat || !newAmt) return;
    const newItem: BudgetItem = { id: Date.now().toString(), category: newCat, amount: parseFloat(newAmt), type: newType, mode: viewMode, description: newDesc };
    setTours(prev => prev.map(t => t.id === selectedTourId ? { ...t, budget: { items: [...t.budget.items, newItem] } } : t));
    setNewCat(''); setNewAmt(''); setNewDesc('');
  };
  const removeItem = (id: string) => { setTours(prev => prev.map(t => t.id === selectedTourId ? { ...t, budget: { items: t.budget.items.filter(i => i.id !== id) } } : t)); };
  const filteredItems = selectedTour?.budget.items.filter(i => i.mode === viewMode) || [];
  const stats = useMemo(() => { const income = filteredItems.filter(i => i.type === 'INCOME').reduce((a, b) => a + b.amount, 0); const expense = filteredItems.filter(i => i.type === 'EXPENSE').reduce((a, b) => a + b.amount, 0); return { income, expense, net: income - expense }; }, [filteredItems]);
  if (!selectedTourId) { return (<div className="flex flex-col h-full bg-black p-12 overflow-y-auto"> <h2 className="text-5xl font-black text-white tracking-tighter uppercase mb-12">Finance Center</h2> <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> {tours.map(tour => (<button key={tour.id} onClick={() => setSelectedTourId(tour.id)} className="bg-gray-900/40 border border-gray-800 p-8 rounded-[3rem] text-left hover:border-emerald-500/30 transition-all group"> <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">{tour.name}</h3> <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-6">Finance Ledger • {tour.status}</p> <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest"> <span className="text-gray-600">{tour.budget.items.length} Entries</span> <ChevronRight size={16} className="text-gray-700 group-hover:text-white" /> </div> </button>))} </div> </div>); }
  return (<div className="flex flex-col h-full bg-black overflow-hidden"> <div className="h-20 border-b border-gray-900 bg-gray-950 flex items-center justify-between px-8 shrink-0"> <div className="flex items-center gap-6"> <button onClick={() => setSelectedTourId(null)} className="p-2 bg-gray-900 border border-gray-800 rounded-xl text-gray-500 hover:text-white transition-all"> <ChevronLeft size={20} /> </button> <div> <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{selectedTour.name} Budget</h2> <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Finance Tracking Dashboard</p> </div> </div> <div className="flex bg-gray-900 p-1 rounded-xl border border-gray-800"> <button onClick={() => setViewMode('ESTIMATED')} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'ESTIMATED' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/10' : 'text-gray-500 hover:text-white'}`}> <Target size={14} className="inline mr-2" /> Estimated </button> <button onClick={() => setViewMode('RECORDED')} className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'RECORDED' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/10' : 'text-gray-500 hover:text-white'}`}> <CheckCircle2 size={14} className="inline mr-2" /> Recorded </button> </div> </div> <div className="flex-1 p-10 overflow-y-auto custom-scrollbar"> <div className="grid grid-cols-3 gap-8 mb-10"> <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-[2rem]"> <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2 flex items-center gap-2"> <TrendingUp size={14} /> Total Profit/Income </p> <p className="text-5xl font-black text-white tracking-tighter">${stats.income.toFixed(2)}</p> </div> <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-[2rem]"> <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2 flex items-center gap-2"> <TrendingDown size={14} /> Total Expenses </p> <p className="text-5xl font-black text-white tracking-tighter">${stats.expense.toFixed(2)}</p> </div> <div className={`p-8 rounded-[2rem] border ${stats.net >= 0 ? 'bg-blue-500/10 border-blue-500/20' : 'bg-red-900/10 border-red-500/20'}`}> <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Net Run Margin</p> <p className="text-5xl font-black text-white tracking-tighter">${stats.net.toFixed(2)}</p> </div> </div> <div className="bg-gray-950 border border-gray-800 p-8 rounded-[2.5rem] mb-10"> <div className="flex items-center gap-6"> <div className="flex-1 grid grid-cols-4 gap-4"> <input value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="Category (e.g. Merch)" className="bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500/50 outline-none" /> <input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Description" className="bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500/50 outline-none" /> <input value={newAmt} onChange={e => setNewAmt(e.target.value)} type="number" placeholder="Amount" className="bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500/50 outline-none" /> <select value={newType} onChange={e => setNewType(e.target.value as any)} className="bg-black border border-gray-800 rounded-xl px-4 py-3 text-[10px] font-black text-gray-400"> <option value="EXPENSE">EXPENSE</option> <option value="INCOME">PROFIT/INCOME</option> </select> </div> <button onClick={addItem} className="bg-white text-black px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5"> Add Entry </button> </div> </div> <div className="bg-gray-900/30 border border-gray-900 rounded-[3rem] overflow-hidden"> <div className="p-6 border-b border-gray-900 bg-gray-950 flex justify-between items-center"> <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{viewMode} LEDGER</h3> <button className="text-[9px] font-black text-gray-600 uppercase hover:text-white transition-all flex items-center gap-2"> <Filter size={12} /> Deep Filter </button> </div> <div className="divide-y divide-gray-900"> {filteredItems.length > 0 ? filteredItems.map(item => (<div key={item.id} className="p-6 flex items-center justify-between group hover:bg-white/5 transition-all"> <div className="flex items-center gap-6"> <div className={`p-3 rounded-2xl ${item.type === 'INCOME' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}> {item.type === 'INCOME' ? <TrendingUp size={18} /> : <TrendingDown size={18} />} </div> <div> <h4 className="text-sm font-black text-white uppercase tracking-tight">{item.category}</h4> <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{item.description}</p> </div> </div> <div className="flex items-center gap-8"> <p className={`text-xl font-black ${item.type === 'INCOME' ? 'text-emerald-500' : 'text-red-500'}`}> {item.type === 'INCOME' ? '+' : '-'}${item.amount.toFixed(2)} </p> <button onClick={() => removeItem(item.id)} className="p-2 text-gray-800 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"> <Trash2 size={18} /> </button> </div> </div>)) : (<div className="py-20 text-center flex flex-col items-center justify-center"> <div className="p-4 bg-gray-900 rounded-full border border-gray-800 mb-4"> <Receipt size={24} className="text-gray-700" /> </div> <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">No entries recorded for this mode</p> </div>)} </div> </div> </div> </div>);
};

// GigScheduler logic moved to Routing/MasterRouting.tsx

const PromoManager: React.FC = () => {
  const [videos, setVideos] = useState<PromoVideo[]>([{ id: 'v1', name: 'Summer Tour Sizzle Reel', url: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4', type: 'EPK', date: '2024-05-15' }]);
  const { isDemoMode } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isDemoMode) { alert("Feature Disabled in Demo Account"); return; }
    const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { const vid: PromoVideo = { id: Date.now().toString(), name: file.name, url: reader.result as string, type: 'PROMO', date: new Date().toISOString().split('T')[0] }; setVideos(prev => [...prev, vid]); }; reader.readAsDataURL(file);
  };
  const removeVideo = (id: string) => { setVideos(prev => prev.filter(v => v.id !== id)); };
  return (<div className="flex flex-col h-full bg-black"> <div className="h-20 border-b border-gray-900 bg-gray-950 flex items-center justify-between px-8 shrink-0"> <div className="flex items-center gap-6"> <div className="p-3 bg-pink-500/10 rounded-2xl border border-pink-500/20"> <Film className="text-pink-500" size={24} /> </div> <div> <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Promo Package</h2> <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">EPK & Video Assets</p> </div> </div> <button onClick={() => inputRef.current?.click()} className="flex items-center gap-3 px-6 py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl" > <Plus size={16} /> Upload Video </button> <input type="file" ref={inputRef} accept="video/*" className="hidden" onChange={handleUpload} /> </div> <div className="flex-1 overflow-y-auto p-10 custom-scrollbar"> {videos.length === 0 ? (<div className="flex flex-col items-center justify-center h-full opacity-30"> <Film size={64} className="mb-4 text-gray-600" /> <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">No promo videos uploaded</p> </div>) : (<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"> {videos.map(vid => (<div key={vid.id} className="bg-gray-900 border border-gray-800 rounded-[2.5rem] overflow-hidden group hover:border-pink-500/30 transition-all"> <div className="aspect-video bg-black relative"> <video src={vid.url} className="w-full h-full object-cover opacity-80" controls /> </div> <div className="p-6"> <div className="flex justify-between items-start mb-4"> <div> <h4 className="text-lg font-black text-white uppercase tracking-tight leading-tight mb-1">{vid.name}</h4> <span className="text-[9px] bg-gray-800 text-gray-500 px-2 py-0.5 rounded font-bold uppercase tracking-widest">{vid.type}</span> </div> <button onClick={() => removeVideo(vid.id)} className="text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={18} /></button> </div> <div className="flex justify-between items-center pt-4 border-t border-gray-800"> <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{vid.date}</span> <button className="flex items-center gap-2 text-[10px] font-black text-pink-500 uppercase tracking-widest hover:text-white transition-colors"> <Copy size={12} /> Copy Link </button> </div> </div> </div>))} </div>)} </div> </div>);
};

const ToolsPanel: React.FC = () => {
  const [citySearch, setCitySearch] = useState('');
  const [aiTips, setAiTips] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeOverlay, setActiveOverlay] = useState<'PLOT' | 'BUDGET' | 'GIGS' | 'PROMO' | 'VAULT' | null>(null);

  const fetchCityTips = async () => {
    if (!citySearch) return;
    setLoading(true);
    const tips = await geminiService.getTourTip(citySearch);
    setAiTips(tips);
    setLoading(false);
  };

  const tools = [
    { id: 'VAULT', title: 'Organization Vault', icon: Lock, color: 'text-amber-400', onClick: () => setActiveOverlay('VAULT') },
    { id: 'PLOT', title: 'Stage Plot Builder', icon: FileText, color: 'text-blue-400', onClick: () => setActiveOverlay('PLOT') },
    { id: 'BUDGET', title: 'Finance Center', icon: Banknote, color: 'text-emerald-400', onClick: () => setActiveOverlay('BUDGET') },
    { id: 'GIGS', title: 'Agent Warehouse', icon: CalendarCheck, color: 'text-purple-400', onClick: () => setActiveOverlay('GIGS') },
    { id: 'PROMO', title: 'Promo Package', icon: Film, color: 'text-pink-400', onClick: () => setActiveOverlay('PROMO') },
  ];

  return (
    <div className="space-y-6">
      {activeOverlay && (
        <div className="fixed inset-0 z-[2000] bg-black animate-in fade-in zoom-in-95 duration-300">
          <div className="absolute top-6 right-6 z-[2100]">
            <button
              onClick={() => setActiveOverlay(null)}
              className="p-3 bg-gray-900 border border-gray-800 rounded-full text-gray-400 hover:text-white transition-all hover:scale-110"
            >
              <X size={24} />
            </button>
          </div>
          {activeOverlay === 'PLOT' && <StagePlotBuilder />}
          {activeOverlay === 'BUDGET' && <TourBudgeter />}
          {activeOverlay === 'GIGS' && <MasterRouting />}
          {activeOverlay === 'PROMO' && <PromoManager />}
          {activeOverlay === 'VAULT' && <OrganizationVault />}
        </div>
      )}

      <div className="bg-gray-800/30 border border-gray-700 p-4 rounded-xl">
        <h3 className="font-bold flex items-center gap-2 text-white mb-3">
          <span className="p-1.5 bg-yellow-500/10 rounded-lg">
            <Sparkles className="w-4 h-4 text-yellow-500" />
          </span>
          Tour Intel (AI Agent)
        </h3>
        <p className="text-xs text-gray-400 mb-4">Get localized tips for any city on your route.</p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. Austin, TX"
            className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 text-white placeholder:text-gray-600"
            value={citySearch}
            onChange={(e) => setCitySearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchCityTips()}
          />
          <button
            onClick={fetchCityTips}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? <Search className="animate-spin" size={18} /> : <Search size={18} />}
          </button>
        </div>
        {aiTips && (
          <div className="mt-4 p-4 bg-black/40 rounded-xl text-sm text-gray-300 border border-gray-800 animate-in slide-in-from-top-2">
            <div className="prose prose-invert prose-sm">
              {aiTips.split('\n').map((line, i) => <p key={i} className="mb-2 last:mb-0">{line}</p>)}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {tools.map((tool, i) => (
          <button
            key={i}
            onClick={tool.onClick}
            className="flex flex-col items-center justify-center p-6 bg-gray-900/50 hover:bg-gray-900 border border-gray-800 rounded-2xl transition-all hover:scale-[1.02] hover:border-gray-700 active:scale-95 group"
          >
            <div className={`w-12 h-12 mb-3 rounded-xl bg-gray-950 flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <tool.icon className={`w-6 h-6 ${tool.color}`} />
            </div>
            <span className="text-[10px] uppercase font-black tracking-widest text-gray-500 group-hover:text-white transition-colors text-center">{tool.title}</span>
          </button>
        ))}
      </div>

      <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 p-6 rounded-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
          <Compass size={80} className="text-indigo-400" />
        </div>
        <h3 className="font-black text-white text-[10px] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <Compass className="w-4 h-4 text-indigo-400" /> Recommended for You
        </h3>
        <ul className="space-y-4">
          <li className="flex gap-4 items-center group/item cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center group-hover/item:border-indigo-500/50 transition-all">
              <FileText size={20} className="text-gray-600 group-hover/item:text-indigo-400" />
            </div>
            <div>
              <p className="font-black text-sm text-gray-200 uppercase tracking-tight">The Ultimate Packlist</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Don't forget the gaffer tape!</p>
            </div>
          </li>
          <li className="flex gap-4 items-center group/item cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center group-hover/item:border-indigo-500/50 transition-all">
              <Briefcase size={20} className="text-gray-600 group-hover/item:text-indigo-400" />
            </div>
            <div>
              <p className="font-black text-sm text-gray-200 uppercase tracking-tight">DIY Booking Guide</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">How to pitch to 100+ venues.</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ToolsPanel;
