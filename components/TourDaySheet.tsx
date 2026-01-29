
import React, { useState, useEffect, useRef } from 'react';
import {
  Clock, MapPin, Phone, Truck, Bed, Music,
  Info, Cloud, Star, ChevronRight, Share2, Download,
  ExternalLink, Calendar, CheckCircle, AlertTriangle, Zap,
  Coffee, Utensils, Home, Leaf, Loader2, Edit3, Save, X, FileText,
  Camera, Plus, Trash2, Image as ImageIcon, Maximize2, Video, PlayCircle
} from 'lucide-react';
import { TourDay, MarkerType, TravelLogistics, LodgingInfo, TourDayAsset } from '../types';
import { geminiService, TourManagerIntel } from '../services/geminiService';
import { MOCK_POINTS } from '../constants';
import { useAuth } from '../contexts/AuthContext';

interface TourDaySheetProps {
  day: TourDay;
  onUpdate?: (day: TourDay) => void;
}

const TourDaySheet: React.FC<TourDaySheetProps> = ({ day, onUpdate }) => {
  const { currentUser, isDemoMode } = useAuth();
  const [intel, setIntel] = useState<TourManagerIntel | null>(null);
  const [loadingIntel, setLoadingIntel] = useState(false);
  const [weather, setWeather] = useState<string>('Loading weather...');
  const [isEditing, setIsEditing] = useState(false);
  const [fullScreenAsset, setFullScreenAsset] = useState<TourDayAsset | null>(null);

  // Local state for edits
  const [editDay, setEditDay] = useState<TourDay>(day);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingIntel(true);
      const [intelData, weatherInfo] = await Promise.all([
        geminiService.getTourManagerIntel(day.cityName, day.venueName, currentUser?.dietaryPreference),
        geminiService.getWeatherInfo(day.cityName, day.date)
      ]);
      setIntel(intelData);
      setWeather(weatherInfo);
      setLoadingIntel(false);
    };
    fetchData();
    setEditDay(day);
  }, [day]);

  const handleSave = () => {
    if (isDemoMode) {
      alert("Feature Disabled in Demo Account");
      return;
    }
    onUpdate?.(editDay);
    setIsEditing(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'IMAGE' | 'VIDEO') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const newAsset: TourDayAsset = {
        id: `asset-${Date.now()}`,
        url: base64String,
        label: file.name,
        type: type,
        category: type === 'VIDEO' ? 'PROMO_VIDEO' : 'OTHER'
      };
      setEditDay(prev => ({
        ...prev,
        assets: [...(prev.assets || []), newAsset]
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeAsset = (id: string) => {
    setEditDay(prev => ({
      ...prev,
      assets: prev.assets?.filter(a => a.id !== id) || []
    }));
  };

  const updateAsset = (id: string, updates: Partial<TourDayAsset>) => {
    setEditDay(prev => ({
      ...prev,
      assets: prev.assets?.map(a => a.id === id ? { ...a, ...updates } : a) || []
    }));
  };

  const localHosts = MOCK_POINTS.filter(p =>
    p.type === MarkerType.HOST &&
    (p.address.toLowerCase().includes(day.cityName.toLowerCase()) ||
      p.description.toLowerCase().includes(day.cityName.toLowerCase()))
  );

  const assetCategories = [
    { value: 'STAGE_PLOT', label: 'Stage Plot' },
    { value: 'PARKING', label: 'Parking Map' },
    { value: 'PRODUCTION', label: 'Production Specs' },
    { value: 'LOAD_IN', label: 'Load-in Info' },
    { value: 'PROMO_VIDEO', label: 'Promo Video' },
    { value: 'OTHER', label: 'Other' }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      {fullScreenAsset && (
        <div
          className="fixed inset-0 z-[3000] bg-black/95 flex items-center justify-center p-8 animate-in fade-in duration-300"
          onClick={() => setFullScreenAsset(null)}
        >
          <button className="absolute top-8 right-8 text-white p-4 hover:bg-white/10 rounded-full z-10">
            <X size={32} />
          </button>
          <div className="max-w-[90vw] max-h-[90vh] relative" onClick={e => e.stopPropagation()}>
            {fullScreenAsset.type === 'VIDEO' ? (
              <video
                src={fullScreenAsset.url}
                className="max-w-full max-h-[85vh] rounded-xl shadow-2xl"
                controls
                autoPlay
              />
            ) : (
              <img
                src={fullScreenAsset.url}
                className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
                alt="Fullscreen preview"
              />
            )}
            <p className="text-center text-white font-black uppercase mt-4 tracking-widest">{fullScreenAsset.label}</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-start mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white ${day.status === 'SHOW' ? 'bg-red-500' : 'bg-blue-500'}`}>
              {day.status} DAY
            </span>
            <span className="text-gray-600 font-black text-[10px] uppercase tracking-widest">
              {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">
            {day.cityName} <span className="text-gray-700">{day.state}</span>
          </h1>
          <div className="flex items-center gap-6 mt-4">
            {day.venueName && (
              <div className="flex items-center gap-3">
                <Music className="text-red-500" size={20} />
                <h2 className="text-2xl font-black text-gray-400 tracking-tight uppercase">{day.venueName}</h2>
              </div>
            )}
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-900 border border-gray-800 rounded-full">
              <Cloud size={12} className="text-sky-400" />
              <span className="text-[9px] font-black text-sky-400 uppercase tracking-widest">{weather}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => setIsEditing(!isEditing)} className={`p-3 border rounded-xl transition-all ${isEditing ? 'bg-emerald-500 text-black border-emerald-500' : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'}`}>
            {isEditing ? <Save size={20} onClick={handleSave} /> : <Edit3 size={20} />}
          </button>
          <button className="p-3 bg-gray-900 border border-gray-800 rounded-xl text-gray-400 hover:text-white"><Share2 size={20} /></button>
        </div>
      </div>

      {isEditing && (
        <div className="mb-12 p-8 bg-gray-900 border border-emerald-500/30 rounded-[3rem] space-y-12 animate-in slide-in-from-top-4">
          {/* Section: Logistics & Lodging */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2"><Truck size={14} /> Logistics Entry</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[8px] font-black text-gray-500 uppercase mb-1 block">Origin</label>
                  <input type="text" value={editDay.travel?.origin || ''} onChange={(e) => setEditDay({ ...editDay, travel: { ...editDay.travel!, origin: e.target.value } })} className="w-full bg-black border border-gray-800 rounded-xl p-3 text-xs text-white" />
                </div>
                <div>
                  <label className="text-[8px] font-black text-gray-500 uppercase mb-1 block">Destination</label>
                  <input type="text" value={editDay.travel?.destination || ''} onChange={(e) => setEditDay({ ...editDay, travel: { ...editDay.travel!, destination: e.target.value } })} className="w-full bg-black border border-gray-800 rounded-xl p-3 text-xs text-white" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[8px] font-black text-gray-500 uppercase mb-1 block">Miles</label>
                  <input type="number" value={editDay.travel?.miles || ''} onChange={(e) => setEditDay({ ...editDay, travel: { ...editDay.travel!, miles: parseFloat(e.target.value) } })} className="w-full bg-black border border-gray-800 rounded-xl p-3 text-xs text-white" />
                </div>
                <div>
                  <label className="text-[8px] font-black text-gray-500 uppercase mb-1 block">Drive Time</label>
                  <input type="text" value={editDay.travel?.driveTime || ''} onChange={(e) => setEditDay({ ...editDay, travel: { ...editDay.travel!, driveTime: e.target.value } })} className="w-full bg-black border border-gray-800 rounded-xl p-3 text-xs text-white" placeholder="e.g. 4h 20m" />
                </div>
                <div>
                  <label className="text-[8px] font-black text-gray-500 uppercase mb-1 block">Bus Call</label>
                  <input type="text" value={editDay.travel?.busCall || ''} onChange={(e) => setEditDay({ ...editDay, travel: { ...editDay.travel!, busCall: e.target.value } })} className="w-full bg-black border border-gray-800 rounded-xl p-3 text-xs text-white" placeholder="09:00" />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2"><Bed size={14} /> Lodging Entry</h4>
              <div>
                <label className="text-[8px] font-black text-gray-500 uppercase mb-1 block">Facility / Host Name</label>
                <input type="text" value={editDay.lodging?.hotelName || ''} onChange={(e) => setEditDay({ ...editDay, lodging: { ...editDay.lodging!, hotelName: e.target.value } })} className="w-full bg-black border border-gray-800 rounded-xl p-3 text-xs text-white" />
              </div>
              <div>
                <label className="text-[8px] font-black text-gray-500 uppercase mb-1 block">Address</label>
                <input type="text" value={editDay.lodging?.address || ''} onChange={(e) => setEditDay({ ...editDay, lodging: { ...editDay.lodging!, address: e.target.value } })} className="w-full bg-black border border-gray-800 rounded-xl p-3 text-xs text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[8px] font-black text-gray-500 uppercase mb-1 block">Confirmation #</label>
                  <input type="text" value={editDay.lodging?.confirmation || ''} onChange={(e) => setEditDay({ ...editDay, lodging: { ...editDay.lodging!, confirmation: e.target.value } })} className="w-full bg-black border border-gray-800 rounded-xl p-3 text-xs text-white" />
                </div>
                <div className="flex items-end">
                  <button onClick={handleSave} className="w-full bg-emerald-500 py-3 rounded-xl text-[10px] font-black uppercase text-black hover:scale-[1.02] transition-all">Apply Data Updates</button>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Notes */}
          <div className="space-y-6 pt-8 border-t border-gray-800">
            <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2"><FileText size={14} /> Daily Coordinator Log & Notes</h4>
            <textarea
              value={editDay.notes || ''}
              onChange={(e) => setEditDay({ ...editDay, notes: e.target.value })}
              className="w-full bg-black border border-gray-800 rounded-2xl p-6 text-sm text-white min-h-[150px] focus:border-emerald-500/50 outline-none leading-relaxed"
              placeholder="Log daily activities, detailed instructions, or reminders for the crew..."
            />
          </div>

          {/* Section: Asset Catalog (Photo Upload) */}
          <div className="space-y-6 pt-8 border-t border-gray-800">
            <div className="flex justify-between items-center">
              <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2"><Camera size={14} /> Production Assets & Photo Catalog</h4>
              <div className="flex gap-2">
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all flex items-center gap-2"
                >
                  <Plus size={14} /> Add Image
                </button>
                <button
                  onClick={() => videoInputRef.current?.click()}
                  className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 text-purple-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all flex items-center gap-2"
                >
                  <Video size={14} /> Add Video
                </button>
              </div>
              <input
                type="file"
                ref={imageInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'IMAGE')}
              />
              <input
                type="file"
                ref={videoInputRef}
                className="hidden"
                accept="video/*"
                onChange={(e) => handleFileUpload(e, 'VIDEO')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {editDay.assets?.map((asset) => (
                <div key={asset.id} className="bg-black border border-gray-800 rounded-2xl overflow-hidden group">
                  <div className="relative h-40 overflow-hidden bg-gray-900 flex items-center justify-center">
                    {asset.type === 'VIDEO' ? (
                      <div className="relative w-full h-full">
                        <video src={asset.url} className="w-full h-full object-cover opacity-80" muted />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <PlayCircle size={32} className="text-white/80" />
                        </div>
                      </div>
                    ) : (
                      <img src={asset.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={asset.label} />
                    )}

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-10">
                      <button onClick={() => setFullScreenAsset(asset)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white"><Maximize2 size={16} /></button>
                      <button onClick={() => removeAsset(asset.id)} className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-full text-red-500"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <select
                      value={asset.category}
                      onChange={(e) => updateAsset(asset.id, { category: e.target.value as any })}
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase text-emerald-500 outline-none"
                    >
                      {assetCategories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                    <input
                      type="text"
                      value={asset.label}
                      onChange={(e) => updateAsset(asset.id, { label: e.target.value })}
                      className="w-full bg-transparent border-b border-gray-800 px-1 py-1 text-xs text-white outline-none focus:border-emerald-500/50"
                      placeholder="Label (e.g. Stage Plot 2024)"
                    />
                  </div>
                </div>
              ))}
              {(!editDay.assets || editDay.assets.length === 0) && (
                <div className="col-span-full py-12 border-2 border-dashed border-gray-800 rounded-3xl flex flex-col items-center justify-center opacity-40">
                  <ImageIcon size={32} className="text-gray-600 mb-2" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">No assets uploaded yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 space-y-10">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] flex items-center gap-2"><Clock className="w-4 h-4" /> Day Schedule</h3>
              <div className="h-px flex-1 bg-gray-900 mx-6"></div>
            </div>
            <div className="space-y-4">
              {day.schedule.map((item) => (
                <div key={item.id} className={`flex items-center gap-6 p-5 rounded-2xl border ${item.isCritical ? 'bg-blue-500/5 border-blue-500/20' : 'bg-gray-900/40 border-gray-800/50'}`}>
                  <span className={`text-lg font-black tracking-tight w-20 ${item.isCritical ? 'text-blue-400' : 'text-gray-400'}`}>{item.time}</span>
                  <div className="flex-1">
                    <h4 className="text-sm font-black text-white uppercase tracking-widest">{item.activity}</h4>
                    {item.details && <p className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-tighter">{item.details}</p>}
                  </div>
                  {item.isCritical && <CheckCircle size={16} className="text-blue-500" />}
                </div>
              ))}
            </div>
          </section>

          {day.notes && (
            <section className="bg-blue-900/5 border border-blue-500/10 p-8 rounded-[2rem]">
              <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4 flex items-center gap-2"><FileText size={16} /> Daily Coordinator Log</h3>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{day.notes}</p>
            </section>
          )}

          {day.assets && day.assets.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] flex items-center gap-2"><Camera className="w-4 h-4" /> Production Assets</h3>
                <div className="h-px flex-1 bg-gray-900 mx-6"></div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {day.assets.map(asset => (
                  <div key={asset.id} className="relative group rounded-2xl overflow-hidden border border-gray-800 cursor-pointer" onClick={() => setFullScreenAsset(asset)}>
                    {asset.type === 'VIDEO' ? (
                      <div className="relative w-full h-32 bg-gray-900">
                        <video src={asset.url} className="w-full h-full object-cover opacity-80" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <PlayCircle size={24} className="text-white/80" />
                        </div>
                      </div>
                    ) : (
                      <img src={asset.url} alt={asset.label} className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-500" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
                      <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-1">{asset.category.replace('_', ' ')}</span>
                      <p className="text-[10px] font-bold text-white uppercase truncate">{asset.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-gray-900/30 border border-gray-800 p-8 rounded-[2rem]">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2"><Truck size={16} className="text-blue-500" /> Logistics Info</h3>
              {day.travel ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div><p className="text-[8px] font-black text-gray-600 uppercase mb-1">Van Call</p><p className="text-xl font-black text-white">{day.travel.busCall}</p></div>
                    <div><p className="text-[8px] font-black text-gray-600 uppercase mb-1">Drive Time</p><p className="text-xl font-black text-white">{day.travel.driveTime}</p></div>
                  </div>
                  <div className="pt-6 border-t border-gray-800/50">
                    <div className="flex justify-between items-center mb-2"><span className="text-[10px] font-black text-gray-600 uppercase">Segment</span><span className="text-[10px] font-black text-gray-500">{day.travel.miles} MI</span></div>
                    <div className="flex items-center gap-3 text-xs font-bold text-white"><span>{day.travel.origin}</span><ChevronRight size={14} className="text-gray-700" /><span>{day.travel.destination}</span></div>
                  </div>
                </div>
              ) : <p className="text-xs text-gray-600 italic">No travel data logged.</p>}
            </section>

            <section className="bg-gray-900/30 border border-gray-800 p-8 rounded-[2rem]">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2"><Bed size={16} className="text-indigo-400" /> Lodging Details</h3>
              {day.lodging ? (
                <div className="space-y-4">
                  <div><p className="text-lg font-black text-white leading-tight uppercase">{day.lodging.hotelName}</p><p className="text-[10px] text-gray-500 font-bold mt-1 uppercase">{day.lodging.address}</p></div>
                  <div className="bg-black/40 p-3 rounded-xl border border-gray-800"><p className="text-[8px] font-black text-gray-600 uppercase mb-1">Verification</p><p className="text-xs font-black text-indigo-400">{day.lodging.confirmation}</p></div>
                </div>
              ) : <p className="text-xs text-gray-600 italic">No lodging recorded.</p>}
            </section>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-emerald-900/10 border border-emerald-500/30 p-8 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5"><Home size={80} className="text-emerald-400" /></div>
            <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-6 flex items-center gap-2"><Home size={16} /> Area Band Hosts</h3>
            {localHosts.length > 0 ? localHosts.map(host => (
              <div key={host.id} className="p-4 rounded-2xl bg-black/40 border border-emerald-500/10 mb-2">
                <p className="text-xs font-black text-white uppercase flex items-center justify-between">{host.name}{host.isCertified && <Star size={10} className="text-yellow-500 fill-yellow-500" />}</p>
                <p className="text-[10px] text-gray-500 font-bold mt-1 leading-relaxed">{host.description}</p>
              </div>
            )) : <div className="py-6 border border-dashed border-emerald-500/10 rounded-2xl text-center"><p className="text-[9px] font-black text-gray-700 uppercase">No hosts in sector</p></div>}
          </div>

          {intel && (
            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Local Intelligence</h3>
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-[2rem] space-y-4">
                <h4 className="text-[10px] font-black text-orange-400 uppercase tracking-widest flex items-center gap-2"><Utensils size={12} /> Crew Fuel</h4>
                {intel.foodAndBev.map((food, i) => (
                  <div key={i} className="text-xs">
                    <p className="font-black text-white uppercase">{food.name}</p>
                    <p className="text-gray-500 mt-0.5">{food.desc}</p>
                  </div>
                ))}
              </div>
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-[2rem]">
                <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2 mb-3"><Zap size={12} /> Survivor Tips</h4>
                <p className="text-xs text-gray-400 italic leading-relaxed">{intel.localTips}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TourDaySheet;
