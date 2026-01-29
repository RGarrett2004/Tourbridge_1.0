
import React, { useState, useMemo, useEffect } from 'react';
import {
  Calendar, List, Map as MapIcon, Plus, ChevronRight,
  Clock, Truck, Music, Bed, MapPin, Search,
  MoreHorizontal, Download, Share2, Filter,
  ArrowRight, Cloud, Info, Zap, LayoutGrid, Route, Navigation, BarChart3,
  ThermometerSun, FolderOpen, Banknote, TrendingUp, ChevronLeft, Users, UserPlus, CheckCircle2, Mail,
  ShieldAlert, Lock, Sparkles, Loader2, Link as LinkIcon, Trash2, Edit3, MessageSquare, Store, X, Save,
  Camera, Briefcase, Layout, ShieldCheck, ListTodo, TrendingDown, Target, Drum, Video, Package, Activity, Globe, PlusCircle, AlertCircle, RefreshCw, Copy, CalendarDays,
  Radio, Compass, BadgeCheck
} from 'lucide-react';
import { CURRENT_USER, MOCK_ACCOUNTS } from '../constants';
import { TourDay, TourDayStatus, Tour, BudgetItem, TourMember, RoleType, MerchSale, UserAccount, LocationPoint, MarkerType } from '../types';
import TourDaySheet from './TourDaySheet';
import ImportTourModal from './ImportTourModal';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import MapComponent from './MapComponent';
import GigBoardOverlay from './EventSection';
import L from 'leaflet';
import { geminiService } from '../services/geminiService';

const ROLE_CONFIGS = [
  { id: 'MGMT', label: 'Management', icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 'ARTIST', label: 'Artist', icon: Music, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 'MEDIA', label: 'Media / Crew', icon: Camera, color: 'text-purple-400', bg: 'bg-purple-500/10' },
];

const AdvancementPill: React.FC<{ day: TourDay }> = ({ day }) => {
  if (day.status !== 'SHOW') return null;
  const status = day.advancement || { techAdvance: 'PENDING', lodgingAdvance: 'PENDING', marketingAdvance: 'PENDING' };

  return (
    <div className="flex gap-1 mt-2">
      <div className={`w-2 h-2 rounded-full ${status.techAdvance === 'CONFIRMED' ? 'bg-emerald-500' : 'bg-gray-800'}`} title="Tech Advance" />
      <div className={`w-2 h-2 rounded-full ${status.lodgingAdvance === 'CONFIRMED' ? 'bg-emerald-500' : 'bg-gray-800'}`} title="Lodging Advance" />
      <div className={`w-2 h-2 rounded-full ${status.marketingAdvance === 'CONFIRMED' ? 'bg-emerald-500' : 'bg-gray-800'}`} title="Marketing Advance" />
    </div>
  );
};

// --- CORE TOUR MANAGER ---

interface TourManagerProps {
  tours: Tour[];
  onUpdateTours: (tours: Tour[]) => void;
  merchSales: MerchSale[];
  currentUser: UserAccount;
  // Map / Explorer Props
  filteredPoints: LocationPoint[];
  onPointSelect: (point: LocationPoint) => void;
  mapCenter: [number, number];
  onMapViewChange: (lat: number, lng: number, zoom: number) => void;
  isDiscovering: boolean;
  aiResult: any;
  setAiResult: (result: any) => void;
  setMapCenter: (center: [number, number]) => void;
  selectedPoint: LocationPoint | null;
  onAddToPipeline: (gig: any) => void; // Pass GigOpportunity type if needed
}

const CITY_COORDS: Record<string, [number, number]> = {
  'Asheville': [35.5951, -82.5515],
  'Waynesville': [35.4884, -82.9887],
  'Charleston': [32.7765, -79.9311],
  'Nashville': [36.1627, -86.7816],
  'Wilmington': [34.2104, -77.8868],
  'Raleigh': [35.7796, -78.6382]
};

const TourManager: React.FC<TourManagerProps> = ({
  tours, onUpdateTours, merchSales, currentUser,
  filteredPoints, onPointSelect, mapCenter, onMapViewChange, isDiscovering, aiResult, setAiResult, setMapCenter, selectedPoint, onAddToPipeline
}) => {
  const [activeView, setActiveView] = useState<'OVERVIEW' | 'ADVANCE' | 'TEAM'>('OVERVIEW');
  const [activeRole, setActiveRole] = useState<string>('MGMT');
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);

  // Invitation State
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteFeedback, setInviteFeedback] = useState<string | null>(null);

  // Gig Board State
  const [showGigBoard, setShowGigBoard] = useState(false);

  // Filter tours so only those where currentUser is a member are shown
  const visibleTours = useMemo(() => {
    return tours.filter(tour => tour.members.some(member => member.userId === currentUser.id));
  }, [tours, currentUser]);

  // Flatten all days into a single chronological list
  const allDays = useMemo(() => {
    return visibleTours
      .flatMap(t => t.days.map(d => ({ ...d, tourId: t.id, tourName: t.name })))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [visibleTours]);

  const selectedDay = useMemo(() => allDays.find(d => d.id === selectedDayId), [allDays, selectedDayId]);

  // Group by Month Year
  const calendarGroups = useMemo(() => {
    const groups: Record<string, typeof allDays> = {};
    allDays.forEach(day => {
      const date = new Date(day.date);
      // Use a sortable key format YYYY-MM for sorting keys, but display name for rendering
      const key = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!groups[key]) groups[key] = [];
      groups[key].push(day);
    });
    return groups;
  }, [allDays]);

  const routeCoords = useMemo(() => {
    return allDays
      .map(day => CITY_COORDS[day.cityName] || null)
      .filter(Boolean) as [number, number][];
  }, [allDays]);

  // Aggregated Stats
  const stats = useMemo(() => {
    const totalMiles = allDays.reduce((acc, d) => acc + (d.travel?.miles || 0), 0);
    const confirmedCount = allDays.filter(d => d.status === 'SHOW' && d.advancement?.techAdvance === 'CONFIRMED').length;
    const showCount = allDays.filter(d => d.status === 'SHOW').length;
    const advanceRate = showCount > 0 ? (confirmedCount / showCount) * 100 : 0;

    // Mock merch net from salesHistory (assuming salesHistory is globally passed)
    const merchNet = merchSales.reduce((acc, s) => acc + s.totalAmount, 0);

    return { totalMiles, advanceRate, merchNet };
  }, [allDays, merchSales]);

  // Aggregated Team
  const uniqueMembers = useMemo(() => {
    const map = new Map<string, TourMember>();
    visibleTours.forEach(t => t.members.forEach(m => {
      if (!map.has(m.userId)) map.set(m.userId, m);
    }));
    return Array.from(map.values());
  }, [visibleTours]);

  const handleUpdateDay = (updatedDay: TourDay) => {
    // Find the tour
    const tourIndex = tours.findIndex(t => t.days.some(d => d.id === updatedDay.id));
    if (tourIndex === -1) return;

    const updatedTours = [...tours];
    const tour = { ...updatedTours[tourIndex] };
    tour.days = tour.days.map(d => d.id === updatedDay.id ? updatedDay : d);
    updatedTours[tourIndex] = tour;
    onUpdateTours(updatedTours);
  };

  const handleInvite = () => {
    // Basic mock invite
    setInviteFeedback(`Invite sent to ${inviteEmail}`);
    setTimeout(() => {
      setInviteFeedback(null);
      setInviteEmail('');
      setIsInviteModalOpen(false);
    }, 1500);
  };

  const handleImport = (tourName: string, days: Partial<TourDay>[]) => {
    // Convert partial days to full TourDay objects with IDs
    const newDays: TourDay[] = days.map((day, i) => ({
      id: `imported-${Date.now()}-${i}`,
      date: day.date || new Date().toISOString().split('T')[0],
      status: (day.status as TourDayStatus) || 'SHOW',
      cityName: day.cityName || 'Unknown City',
      state: day.state || '',
      venueName: day.venueName || 'TBD',
      schedule: [],
      travel: { origin: 'TBD', destination: day.cityName || 'TBD', miles: 0, driveTime: '0h', busCall: '00:00', vehicleName: 'Van' }
    }));

    if (newDays.length === 0) return;

    // Create new tour
    const newTour: Tour = {
      id: `tour-${Date.now()}`,
      name: tourName,
      ownerId: currentUser.id, // Assign to current user for now
      startDate: newDays[0].date,
      endDate: newDays[newDays.length - 1].date,
      status: 'PLANNING',
      members: [{ userId: currentUser.id, name: currentUser.name, role: 'Tour Manager', avatar: currentUser.avatar, status: 'ACCEPTED' }],
      budget: { items: [] },
      days: newDays
    };

    onUpdateTours([...tours, newTour]);
  };

  // Auto-scroll to today/upcoming
  useEffect(() => {
    // Simple implementation: could scroll to ID of first day >= today
  }, []);

  if (visibleTours.length === 0) {
    return (
      <div className="flex flex-col h-full bg-black p-10 items-center justify-center text-center">
        <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center border border-gray-800 mb-6">
          <CalendarDays size={40} className="text-gray-600" />
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Master Calendar Empty</h2>
        <p className="text-gray-500 max-w-md mb-8">You have no upcoming tours or events scheduled. Initialize a new run to begin.</p>
        <button className="px-8 py-4 bg-white text-black rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all">
          Initialize Calendar
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black overflow-hidden relative">
      <div className="h-20 border-b border-gray-900 bg-gray-950 flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-6">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Master Itinerary</h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Unified Calendar • {allDays.length} Events</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all"
          >
            <UserPlus size={14} /> Invite
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black border border-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all shadow-lg shadow-white/10"
          >
            <Download size={14} /> Import Schedule
          </button>

          <div className="flex bg-gray-900 p-1 rounded-xl border border-gray-800">
            {['OVERVIEW', 'ADVANCE', 'TEAM'].map(v => (
              <button key={v} onClick={() => setActiveView(v as any)} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeView === v ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}>{v}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* YEAR BY YEAR SCROLLING CALENDAR SIDEBAR */}
        <div className="w-80 border-r border-gray-900 bg-gray-950 overflow-y-auto custom-scrollbar flex flex-col shrink-0">
          <div className="p-6 space-y-8">
            {Object.entries(calendarGroups).map(([monthYear, days]) => (
              <div key={monthYear} className="animate-in fade-in slide-in-from-bottom-2">
                <div className="sticky top-0 bg-gray-950/95 backdrop-blur-md py-2 border-b border-gray-900 mb-2 z-10 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <h3 className="text-xs font-black text-white uppercase tracking-widest">{monthYear}</h3>
                </div>
                <div className="space-y-1">
                  {days.map(day => (
                    <button
                      key={day.id}
                      onClick={() => {
                        setSelectedDayId(day.id);
                        setActiveView('OVERVIEW');
                        if (CITY_COORDS[day.cityName]) {
                          setMapCenter(CITY_COORDS[day.cityName]);
                        }
                      }}
                      className={`w-full text-left p-3 rounded-xl transition-all border group relative overflow-hidden ${selectedDayId === day.id ? 'bg-white/10 border-white/20' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                    >
                      <div className="flex justify-between items-start relative z-10">
                        <div className="flex items-center gap-2">
                          <span className={`text-lg font-black ${selectedDayId === day.id ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>{new Date(day.date).getDate()}</span>
                          <span className="text-[9px] font-bold text-gray-600 uppercase mt-1">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                        </div>
                        <span className={`px-1.5 py-0.5 rounded-[4px] text-[7px] font-black uppercase text-white ${day.status === 'SHOW' ? 'bg-red-500' : 'bg-blue-500'}`}>{day.status}</span>
                      </div>
                      <h4 className={`text-xs font-black uppercase truncate mt-1 relative z-10 ${selectedDayId === day.id ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>{day.cityName}</h4>
                      <p className="text-[8px] text-gray-600 font-bold uppercase truncate relative z-10">{(day as any).tourName}</p>
                      <AdvancementPill day={day} />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 bg-black overflow-y-auto custom-scrollbar">
          {selectedDay ? (
            <div className="p-10">
              <button onClick={() => setSelectedDayId(null)} className="text-[10px] font-black text-gray-500 uppercase flex items-center gap-2 mb-8 hover:text-white"><ChevronLeft size={14} /> Back to Master Overview</button>
              <TourDaySheet day={selectedDay} onUpdate={handleUpdateDay} />
            </div>
          ) : activeView === 'OVERVIEW' ? (
            <div className="flex flex-col h-full p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
                <div className="bg-gray-900/50 p-6 rounded-3xl border border-gray-800"><p className="text-[9px] font-black text-gray-600 uppercase mb-1">Total Distance</p><p className="text-3xl font-black text-white tracking-tighter leading-none">{stats.totalMiles.toLocaleString()} MI</p></div>
                <div className="bg-gray-900/50 p-6 rounded-3xl border border-gray-800"><p className="text-[9px] font-black text-gray-600 uppercase mb-1">Advance Rate</p><p className="text-3xl font-black text-emerald-500 tracking-tighter leading-none">{stats.advanceRate.toFixed(0)}%</p></div>
                <div className="bg-gray-900/50 p-6 rounded-3xl border border-gray-800"><p className="text-[9px] font-black text-gray-600 uppercase mb-1">Total Merch Net</p><p className="text-3xl font-black text-white tracking-tighter leading-none">${stats.merchNet.toLocaleString()}</p></div>
              </div>

              <div className="flex-1 bg-gray-950 border border-gray-900 rounded-[3rem] overflow-hidden relative shadow-2xl min-h-[500px]">
                {/* Full Map Component with Explorer Features */}
                <MapComponent
                  points={filteredPoints}
                  onPointSelect={onPointSelect}
                  center={mapCenter}
                  onViewChange={onMapViewChange}
                >
                  {/* Overlay Route */}
                  <Polyline positions={routeCoords} color="#3b82f6" weight={3} dashArray="4, 8" opacity={0.6} />

                  {/* Overlay Tour Stops */}
                  {allDays.filter(d => CITY_COORDS[d.cityName]).map(d => (
                    <Marker
                      key={`route-${d.id}`}
                      position={CITY_COORDS[d.cityName]}
                      icon={L.divIcon({ className: 'bg-transparent', html: `<div class="w-3 h-3 bg-white border-2 border-blue-500 rounded-full shadow-lg"></div>` })}
                      eventHandlers={{ click: () => { setSelectedDayId(d.id); } }}
                    >
                      <Popup className="dark-popup">
                        <div className="text-gray-900 font-bold text-xs uppercase">{d.cityName} - {new Date(d.date).toLocaleDateString()}</div>
                      </Popup>
                    </Marker>
                  ))}
                </MapComponent>

                {/* EXPLORER OVERLAYS */}

                {/* Radar Indicator */}
                <div className="absolute top-4 right-4 z-[900]">
                  <div className={`bg-gray-950/80 backdrop-blur-xl border border-gray-800 rounded-2xl px-4 py-3 shadow-2xl transition-all flex items-center gap-3 ${isDiscovering ? 'ring-2 ring-emerald-500/50 scale-105' : 'opacity-60'}`}>
                    <div className="relative">
                      <Radio size={16} className={`text-emerald-500 ${isDiscovering ? 'animate-ping' : ''}`} />
                      <Radio size={16} className="text-emerald-500 absolute top-0 left-0" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white">Discovery Radar</span>
                      <span className="text-[8px] font-bold uppercase tracking-tighter text-gray-500">
                        {isDiscovering ? 'Scanning for local nodes...' : 'Radar Active: Zone Clear'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Gig Board Button */}
                {!showGigBoard && (
                  <button
                    onClick={() => setShowGigBoard(true)}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] bg-white text-black px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl flex items-center gap-3 hover:scale-105 transition-all"
                  >
                    <Compass size={18} /> Open Gig Board
                  </button>
                )}

                {/* Gig Board Overlay */}
                {showGigBoard && (
                  <GigBoardOverlay
                    onClose={() => setShowGigBoard(false)}
                    onAddToPipeline={onAddToPipeline}
                  />
                )}

                {/* AI Result Overlay */}
                {aiResult && (
                  <div className="absolute top-4 left-4 z-[900] w-72 max-h-[60%] overflow-y-auto hidden lg:flex flex-col gap-4">
                    <div className="bg-gray-900 border border-yellow-500/30 rounded-2xl p-5 shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                        <Sparkles size={64} className="text-yellow-500" />
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-[10px] font-black text-yellow-500 uppercase tracking-widest flex items-center gap-2">
                          <Sparkles size={12} /> AI Field Report
                        </h3>
                        <button onClick={() => setAiResult(null)} className="text-gray-600 hover:text-white">
                          <X size={14} />
                        </button>
                      </div>
                      <div className="text-xs text-gray-300 leading-relaxed max-h-60 overflow-y-auto pr-2 custom-scrollbar scrollable-content prose prose-invert prose-xs">
                        {aiResult.text.split('\n').filter((l: string) => l.trim()).map((line: string, i: number) => (
                          <p key={i} className="mb-2">{line}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Nearby Records List */}
                <div className="absolute top-4 left-4 z-[800] w-72 max-h-[85%] pt-[200px] pointer-events-none hidden lg:flex flex-col">
                  {/* Using pointer-events-none on wrapper to let clicks pass through, but enabling on children */}
                  <div className="bg-gray-950/80 backdrop-blur-md border border-gray-800 rounded-2xl p-4 shadow-2xl flex-1 overflow-hidden flex flex-col pointer-events-auto">
                    <div className="flex items-center justify-between mb-4 shrink-0 px-1">
                      <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Nearby Records</h3>
                      {isDiscovering && <Loader2 className="w-3 h-3 text-emerald-500 animate-spin" />}
                    </div>
                    <div className="space-y-2 overflow-y-auto flex-1 pr-1 custom-scrollbar">
                      {filteredPoints.length > 0 ? filteredPoints.map(p => (
                        <button
                          key={p.id}
                          onClick={() => {
                            setMapCenter([p.lat, p.lng]);
                            onPointSelect(p);
                          }}
                          className={`w-full text-left p-3 rounded-xl border transition-all ${selectedPoint?.id === p.id ? 'bg-white/10 border-white/20' : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/10'}`}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <p className="text-xs font-black text-white truncate leading-tight flex items-center gap-2">
                              {p.name}
                              {p.isCertified && <BadgeCheck size={12} className="text-yellow-500 shrink-0" />}
                              {p.isDynamic && <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" title="Live Discovery Hit" />}
                            </p>
                            <div className={`w-2 h-2 rounded-full shrink-0 mt-1 ${p.type === MarkerType.VENUE ? 'bg-red-500' :
                              p.type === MarkerType.HOST ? 'bg-emerald-500' :
                                p.type === MarkerType.PRO ? 'bg-blue-500' :
                                  p.type === MarkerType.PROMOTER ? 'bg-pink-500' : 'bg-purple-500'
                              }`} />
                          </div>
                          <p className="text-[9px] text-gray-500 mt-1 truncate uppercase tracking-tighter">{p.address}</p>
                        </button>
                      )) : (
                        <div className="py-8 text-center px-4">
                          <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest">No local hits</p>
                          <p className="text-[9px] text-gray-800 mt-2 uppercase">Zoom into a city to discover nodes</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ) : activeView === 'ADVANCE' ? (
            <div className="p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Advancement Hub</h2>
                  <p className="text-xs text-blue-400 font-bold uppercase tracking-widest mt-2">All Upcoming Confirmations</p>
                </div>
                <button
                  onClick={(e) => {
                    const btn = e.currentTarget;
                    const originalContent = btn.innerHTML;
                    btn.innerHTML = '<div class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Syncing...';
                    setTimeout(() => {
                      btn.innerHTML = 'Synced';
                      setTimeout(() => {
                        btn.innerHTML = originalContent;
                      }, 2000);
                    }, 1500);
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20"
                >
                  <RefreshCw size={14} /> Resync All Riders
                </button>
              </div>
              <div className="bg-gray-950 border border-gray-800 rounded-[3.5rem] overflow-hidden">
                <div className="grid grid-cols-6 p-6 bg-gray-900/50 border-b border-gray-800 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  <div className="col-span-2">Show Node</div>
                  <div>Date</div>
                  <div className="text-center">Tech Status</div>
                  <div className="text-center">Lodging</div>
                  <div className="text-center">Marketing</div>
                </div>
                <div className="divide-y divide-gray-900">
                  {allDays.filter(d => d.status === 'SHOW').map(d => (
                    <div key={d.id} className="grid grid-cols-6 p-6 items-center hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => { setSelectedDayId(d.id); setActiveView('OVERVIEW'); }}>
                      <div className="col-span-2">
                        <p className="text-sm font-black text-white uppercase">{d.cityName}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase truncate">{d.venueName}</p>
                      </div>
                      <div className="text-[10px] font-black text-gray-400">{new Date(d.date).toLocaleDateString()}</div>
                      <div className="flex justify-center"><div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border ${d.advancement?.techAdvance === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-gray-800 text-gray-500 border-transparent'}`}>{d.advancement?.techAdvance || 'PENDING'}</div></div>
                      <div className="flex justify-center"><div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border ${d.advancement?.lodgingAdvance === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-gray-800 text-gray-500 border-transparent'}`}>{d.advancement?.lodgingAdvance || 'PENDING'}</div></div>
                      <div className="flex justify-center"><div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border ${d.advancement?.marketingAdvance === 'CONFIRMED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-gray-800 text-gray-500 border-transparent'}`}>{d.advancement?.marketingAdvance || 'PENDING'}</div></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : activeView === 'TEAM' ? (
            <div className="p-10 space-y-8">
              <h2 className="text-4xl font-black text-white tracking-tighter uppercase mb-8">Aggregated Roster</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {uniqueMembers.map((member, i) => (
                  <div key={member.userId} className="bg-gray-900/40 border border-gray-800 p-6 rounded-[2rem] flex items-center gap-4 hover:border-gray-700 transition-all">
                    <img src={member.avatar} className="w-16 h-16 rounded-full object-cover border-2 border-gray-900" alt="" />
                    <div>
                      <p className="text-sm font-black text-white uppercase">{member.name}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{member.role}</p>
                    </div>
                  </div>
                ))}
                <button onClick={() => setIsInviteModalOpen(true)} className="bg-gray-900 border border-dashed border-gray-700 p-6 rounded-[2rem] flex flex-col items-center justify-center gap-2 hover:bg-gray-800 transition-all text-gray-500 hover:text-white">
                  <UserPlus size={24} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Add Member</span>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* INVITE MODAL */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-[2500] bg-black/90 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-full max-w-lg bg-gray-950 border border-gray-800 rounded-[3rem] p-10 relative shadow-2xl">
            <button onClick={() => setIsInviteModalOpen(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white"><X size={20} /></button>

            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Invite to Network</h3>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-8">Grant access to master itinerary</p>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-gray-600 uppercase mb-2 block tracking-widest">Email Address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="crew@example.com"
                  className="w-full bg-black border border-gray-800 rounded-xl p-4 text-white outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <button
                onClick={handleInvite}
                className="w-full py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl"
              >
                Send Invitation
              </button>

              {inviteFeedback && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl flex items-center justify-center gap-2 text-emerald-500 animate-in fade-in slide-in-from-bottom-2">
                  <CheckCircle2 size={14} /> <span className="text-[10px] font-black uppercase tracking-widest">{inviteFeedback}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* IMPORT MODAL */}
      {isImportModalOpen && (
        <ImportTourModal
          onClose={() => setIsImportModalOpen(false)}
          onImport={handleImport}
        />
      )}
    </div>
  );
};

export default TourManager;
