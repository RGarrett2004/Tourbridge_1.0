import React from 'react';
import {
    Clock, MapPin, Phone, Truck, Bed, Music,
    Info, Cloud, Star, ChevronRight, Share2, Download,
    ExternalLink, Calendar, CheckCircle, AlertTriangle, Zap,
    Coffee, Utensils, Home, Leaf, Loader2, Edit3, Save, X, FileText,
    Camera, Plus, Trash2, Image as ImageIcon, Maximize2, Video, PlayCircle, MoreHorizontal, ArrowRight, Banknote, Store, Map as MapIcon, ClipboardCheck, Printer, Eye, EyeOff, Sparkles, Lock,
    Plane, TrainFront, Car, MessageSquare
} from 'lucide-react';
import { TourDay, TourDayAsset, TourDayStatus } from '@tourbridger/shared-types';
import { geminiService, TourManagerIntel } from '../../services/geminiService';

interface TourDayViewProps {
    day: TourDay;
    tourId: string;
    intel: TourManagerIntel | null;
    loadingIntel: boolean;
    weather: string;
    onEdit: () => void;
    onDelete?: (dayId: string) => void;
    onRefreshIntel?: () => void;
    isReadOnly?: boolean;
}

const parseLocalDate = (str: string): Date => {
    const [y, m, d] = str.split('-').map(Number);
    return new Date(y, m - 1, d);
};

const sort26HourSchedule = (items: any[]) => {
    return [...items].sort((a, b) => {
        const timeToVal = (item: any) => {
            if (!item?.time) return 0;
            const match = item.time.match(/(\d+):(\d+)\s*(AM|PM)?/i) ||
                item.time.match(/(\d+)\s*(AM|PM)/i) ||
                item.time.match(/(\d+)/i);

            if (!match) return 0;
            let h = parseInt(match[1]);
            let m = parseInt(match[2] || '0');
            let ampm = match[3] || (match[2] && isNaN(parseInt(match[2])) ? match[2] : null);

            if (ampm) {
                if (ampm.toUpperCase().includes('PM') && h !== 12) h += 12;
                if (ampm.toUpperCase().includes('AM') && h === 12) h = 0;
            }
            let val = h * 60 + m;
            if (item.isLateNight) val += 24 * 60; // Use manual flag
            return val;
        };
        return timeToVal(a) - timeToVal(b);
    });
};

const TourDayView: React.FC<TourDayViewProps> = ({
    day,
    tourId,
    intel,
    loadingIntel,
    weather,
    onEdit,
    onDelete,
    onRefreshIntel,
    isReadOnly
}) => {
    const [copyStatus, setCopyStatus] = React.useState<string | null>(null);
    const [selectedNoteItem, setSelectedNoteItem] = React.useState<any | null>(null);

    const handleCopy = (type: 'FULL' | 'ROS') => {
        let text = `📅 ${formattedDate} - ${day.title || 'UNNAMED DAY'}\n`;
        text += `📍 ${day.cityName}, ${day.state}\n\n`;

        if (type === 'FULL') {
            if (day.travel) {
                text += `🚚 TRAVEL:\n`;
                text += `   Origin: ${day.travel.origin}\n`;
                text += `   Drive: ${day.travel.driveTime}\n`;
                text += `   Bus Call: ${day.travel.busCall}\n\n`;
            }
        }

        text += `⏰ SCHEDULE:\n`;
        const itemsToCopy = type === 'ROS'
            ? sort26HourSchedule(day.schedule).filter(i => i.isMilestone || i.isCritical)
            : sort26HourSchedule(day.schedule);

        itemsToCopy.forEach(item => {
            const timePrefix = item.isApproximateTime ? '~' : '';
            const timeStr = item.endTime ? `${timePrefix}${item.time} - ${item.endTime}` : `${timePrefix}${item.time}`;
            let statusSuffix = item.isMilestone ? ' ⭐' : '';
            if (item.status === 'confirmed') statusSuffix += ' [CONFIRMED]';
            else if (item.status === 'pending') statusSuffix += ' [PENDING]';
            else if (item.status === 'subject_to_change') statusSuffix += ' [SUBJECT TO CHANGE]';

            text += `   ${timeStr} - ${item.activity}${statusSuffix}\n`;
        });

        if (type === 'FULL' && day.lodging) {
            text += `\n🏨 LODGING:\n`;
            text += `   ${day.lodging.name}\n`;
            text += `   ${day.lodging.address || 'No address provided'}\n`;
        }

        navigator.clipboard.writeText(text);
        setCopyStatus(type);
        setTimeout(() => setCopyStatus(null), 2000);
    };

    const sortedSchedule = sort26HourSchedule(day.schedule);
    const formattedDate = parseLocalDate(day.date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    const isOff = day.status === 'OFF';

    let displayTitle = day.title || 'UNCONFIRMED';
    if (day.status === 'OFF') {
        displayTitle = day.title || 'Off Day';
    } else if (day.status === 'TRAVEL') {
        if (day.travel?.origin && day.travel?.destination) {
            displayTitle = day.title || `${day.travel.origin} ➔ ${day.travel.destination}`;
        } else {
            displayTitle = day.title || 'Travel Day';
        }
    } else {
        if (day.venueName && day.venueName !== 'TBD' && day.venueName.trim() !== '') {
            displayTitle = day.venueName;
        } else {
            displayTitle = day.title || 'TBA Venue';
        }
    }
    const locationParts = [day.cityName, day.state].filter(s => s && s !== 'TBD');
    const displayLocation = isOff ? '' : (locationParts.length > 0 ? locationParts.join(', ') : 'TBD');

    return (
        <div className="h-full overflow-y-auto custom-scrollbar p-3 lg:p-8 space-y-6 lg:space-y-8 animate-in fade-in duration-500">

            {/* HEADER SECTION */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 md:gap-4">
                <div className="space-y-1.5 md:space-y-2">
                    <div className="flex items-center gap-2 md:gap-3">
                        <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                            {displayTitle}
                        </h1>
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${day.status === 'SHOW' ? 'bg-blue-500 text-black' :
                            day.status === 'TRAVEL' ? 'bg-amber-500 text-black' :
                                'bg-gray-800 text-gray-400'
                            }`}>
                            {day.status}
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest mt-1">
                        <div className="flex items-center gap-2 text-gray-500">
                            <Calendar size={14} className="text-gray-700" />
                            <span>{formattedDate}</span>
                        </div>
                        {displayLocation && (
                            <>
                                <span className="w-1.5 h-1.5 bg-gray-800 rounded-full hidden md:block" />
                                <div className="flex items-center gap-2 text-gray-500">
                                    <MapPin size={14} className="text-blue-500" />
                                    <span className="text-white">{displayLocation}</span>
                                </div>
                            </>
                        )}
                        <span className="w-1.5 h-1.5 bg-gray-800 rounded-full hidden md:block" />
                        <div className={`flex items-center gap-2 border px-3 py-1 rounded-full ${day.isConfirmed ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-amber-500/10 border-amber-500/30 text-amber-500'}`}>
                            {day.isConfirmed ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                            <span className="text-[9px] font-black">{day.isConfirmed ? 'CONFIRMED' : 'PROVISIONAL'}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap md:flex-nowrap w-full md:w-auto mt-2 md:mt-0 gap-3">
                    <div className="flex bg-gray-900/50 rounded-2xl border border-gray-800 p-1 w-full md:w-auto">
                        <button
                            onClick={() => handleCopy('ROS')}
                            className={`flex-1 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${copyStatus === 'ROS' ? 'bg-emerald-500 text-black' : 'hover:text-white text-gray-400'}`}
                        >
                            {copyStatus === 'ROS' ? 'Copied ROS' : 'Copy ROS'}
                        </button>
                        <button
                            onClick={() => handleCopy('FULL')}
                            className={`flex-1 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${copyStatus === 'FULL' ? 'bg-emerald-500 text-black' : 'hover:text-white text-gray-400'}`}
                        >
                            {copyStatus === 'FULL' ? 'Copied Full' : 'Copy Full'}
                        </button>
                    </div>
                    {!isReadOnly && (
                        <button
                            onClick={onEdit}
                            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white hover:bg-gray-200 text-black rounded-xl text-[9px] md:text-[10px] whitespace-nowrap font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl"
                        >
                            <Edit3 size={14} />
                            Edit Day
                        </button>
                    )}
                    {!isReadOnly && onDelete && (
                        <button
                            onClick={() => {
                                if (window.confirm('Are you sure you want to delete this day?')) {
                                    onDelete(day.id);
                                }
                            }}
                            className="flex items-center justify-center p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all"
                            title="Delete Day"
                        >
                            <Trash2 size={14} />
                        </button>
                    )}
                </div>
            </div>

            {/* 70/30 GRID LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

                {/* PRIMARY COLUMN (70%): DAY'S ITINERARY */}
                <div className="lg:col-span-8 space-y-8">

                    {/* KEY MILESTONES (DYNAMIC) */}
                    {day.schedule?.some(item => item.isMilestone) && (
                        <section className="bg-black/40 border border-gray-900 rounded-3xl p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <Star className="text-blue-500" size={20} fill="currentColor" />
                                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Key Starred Items</h3>
                            </div>
                            <div className="flex flex-wrap gap-8">
                                {day.schedule
                                    .filter(item => item.isMilestone)
                                    .map(item => {
                                        const label = item.activity.toUpperCase();
                                        let Icon = Zap;
                                        let color = 'text-blue-500';

                                        if (label.includes('LOAD')) { Icon = Truck; color = 'text-amber-500'; }
                                        else if (label.includes('CHECK')) { Icon = Music; color = 'text-blue-500'; }
                                        else if (label.includes('DOOR')) { Icon = ExternalLink; color = 'text-emerald-500'; }
                                        else if (label.includes('SHOW')) { Icon = Zap; color = 'text-purple-500'; }
                                        else if (label.includes('OFF')) { Icon = X; color = 'text-red-500'; }
                                        else if (label.includes('VAN') || label.includes('BUS')) { Icon = Truck; color = 'text-orange-500'; }

                                        return (
                                            <div key={item.id} className="space-y-1 min-w-[100px]">
                                                <div className="flex items-center gap-2">
                                                    <Icon size={12} className={color} />
                                                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{item.activity}</span>
                                                </div>
                                                <div className="text-2xl font-black text-white tracking-tighter leading-none">
                                                    {item.isApproximateTime && <span className="text-amber-500/80 mr-0.5 text-xl">~</span>}
                                                    {item.endTime ? `${item.time} - ${item.endTime}` : (item.time || '--:--')}
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </section>
                    )}

                    {/* ITINERARY TIMELINE */}
                    <section className="space-y-8">
                        <div className="flex items-center justify-between border-b border-gray-900 pb-4">
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                                <Clock className="text-blue-500" />
                                Day's Itinerary
                            </h2>
                            <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                                {sortedSchedule.length} Items Scheduled
                            </div>
                        </div>

                        <div className="relative space-y-3">
                            {/* Vertical connecting line */}
                            <div className="absolute left-[1.875rem] top-6 bottom-6 w-px bg-gradient-to-b from-blue-500/50 via-gray-800 to-transparent z-0 hidden md:block" />

                            {sortedSchedule.length > 0 ? (
                                sortedSchedule.map((item, idx) => (
                                    <div
                                        key={item.id || idx}
                                        className={`relative z-10 flex items-center justify-between md:justify-normal md:odd:flex-row-reverse gap-4 rounded-3xl border transition-all hover:scale-[1.01] overflow-hidden group cursor-pointer ${item.isMilestone ? 'p-6 bg-blue-500/5 border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.1)]' : 'p-4 bg-gray-900/40 border-gray-800'
                                            } ${item.isCritical && !item.isMilestone ? 'bg-orange-900/5 border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.05)]' : ''
                                            }`}
                                        onClick={() => (item.notes || item.details) && setSelectedNoteItem(item)}
                                    >
                                        <div className={`shrink-0 text-center rounded-2xl border ${item.isMilestone ? 'w-20 py-3 bg-blue-500 text-black border-blue-400 shadow-lg' :
                                            item.isCritical ? 'w-14 py-2 bg-orange-500 text-black border-orange-400' :
                                                'w-14 py-2 bg-black/40 border-gray-800 text-white'
                                            }`}>
                                            <div className={`${item.isMilestone ? 'text-xl' : 'text-sm'} font-black tracking-tighter leading-none whitespace-nowrap`}>
                                                {item.isApproximateTime && <span className="opacity-60 mr-0.5">~</span>}
                                                {item.endTime ? `${item.time} - ${item.endTime}` : item.time}
                                            </div>
                                            <div className={`${item.isMilestone ? 'text-[8px]' : 'text-[7px]'} font-black uppercase tracking-widest mt-0.5 opacity-70`}>LT</div>
                                        </div>

                                        {/* Icon Node */}
                                        <div className="flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 rounded-full border-4 border-[#0a0a0a] bg-gray-900 text-gray-500 shrink-0 md:order-1 md:group-odd:-ml-5 md:group-even:-mr-5 shadow-xl relative z-10 
                                            group-hover:bg-white group-hover:text-black transition-colors ml-[4.5rem] lg:ml-[5.5rem] absolute left-0 md:static md:ml-0"
                                        >
                                            {item.isMilestone ? <Star size={12} className="lg:w-4 lg:h-4 text-amber-500 group-hover:text-black" /> :
                                                item.travelType ? <Truck size={12} className="lg:w-4 lg:h-4 text-blue-500 group-hover:text-black" /> :
                                                    <Clock size={12} className="lg:w-4 lg:h-4" />}
                                        </div>

                                        {/* Content Card */}
                                        <div className={`w-[calc(100%-8rem)] md:w-[calc(50%-3rem)] p-3 lg:p-4 rounded-2xl border transition-all duration-300 ml-[2rem] md:ml-0
                                            ${item.isMilestone ? 'bg-blue-500/5 border-blue-500/20 group-hover:border-blue-500/50' :
                                                item.isCritical ? 'bg-orange-500/5 border-orange-500/20 group-hover:border-orange-500/50' :
                                                    item.travelType ? 'bg-gray-900/80 border-gray-800 group-hover:border-gray-600' :
                                                        'bg-[#111] border-white/5 group-hover:border-gray-700'}`
                                        }>
                                            <div className="flex flex-wrap items-center gap-1.5 lg:gap-3 lg:mb-1">
                                                <h4 className={`text-sm lg:text-lg font-black uppercase tracking-tighter truncate leading-tight ${item.isMilestone ? 'text-white' : item.isCritical ? 'text-orange-100' : 'text-gray-200'}`}>
                                                    {item.activity}
                                                </h4>
                                                {(item.notes || item.details) && (
                                                    <div className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-800 text-gray-400 rounded-md text-[8px] font-black uppercase tracking-widest shrink-0">
                                                        <Info size={10} />
                                                        Details
                                                    </div>
                                                )}
                                                {item.travelType && (
                                                    <div className={`flex items-center gap-2 px-3 py-1.5 border rounded-xl shadow-sm ${item.travelType === 'DRIVE' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' :
                                                        item.travelType === 'FLIGHT' ? 'bg-blue-500/10 border-blue-500/30 text-blue-500' :
                                                            item.travelType === 'TRAIN' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' :
                                                                item.travelType === 'BUS_CALL' ? 'bg-purple-500/10 border-purple-500/30 text-purple-500' :
                                                                    item.travelType === 'LODGING' ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' :
                                                                        'bg-gray-950 border-gray-800 text-gray-400'
                                                        }`}>
                                                        {item.travelType === 'DRIVE' ? <Car size={14} /> :
                                                            item.travelType === 'FLIGHT' ? <Plane size={14} /> :
                                                                item.travelType === 'TRAIN' ? <TrainFront size={14} /> :
                                                                    item.travelType === 'BUS_CALL' ? <Clock size={14} /> :
                                                                        item.travelType === 'LODGING' ? <Bed size={14} /> :
                                                                            <MapPin size={14} />}
                                                        <div className="flex flex-col -space-y-0.5">
                                                            <span className="text-[9px] font-black uppercase tracking-widest leading-none">{item.travelType}</span>
                                                            {(item.miles || item.flightNumber) && (
                                                                <span className="text-[7px] font-bold opacity-70 uppercase tracking-tighter">
                                                                    {item.travelType === 'DRIVE' && item.miles ? `${item.miles} mi` : ''}
                                                                    {item.travelType === 'FLIGHT' && item.flightNumber ? `Flight ${item.flightNumber}` : ''}
                                                                </span>
                                                            )}
                                                            {item.isCritical && (
                                                                <div className="px-2 py-0.5 bg-orange-500/20 text-orange-500 text-[8px] font-black uppercase tracking-widest rounded-full border border-orange-500/30">
                                                                    Critical
                                                                </div>
                                                            )}
                                                            {item.visibility?.type !== 'TOUR' && (
                                                                <div className="px-2 py-0.5 bg-amber-500 text-black text-[8px] font-black uppercase tracking-widest rounded-full">
                                                                    OFF-SHOW
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center bg-gray-900/20 border border-dashed border-gray-800 rounded-[2rem]">
                                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">No items on the schedule yet.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* SIDEBAR COLUMN (30%): LOGISTICS MANIFEST */}
                <div className="lg:col-span-4 space-y-4">

                    <div className="sticky top-24 space-y-4">

                        {/* WEATHER & INTEL CARD */}
                        <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 p-5 rounded-3xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                <Sparkles size={120} className="text-indigo-500" />
                            </div>

                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Cloud className="text-indigo-400" size={24} />
                                        <div>
                                            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Local Intel</h4>
                                            <p className="text-lg font-black text-white uppercase tracking-tighter">{weather}</p>
                                        </div>
                                    </div>
                                    {onRefreshIntel && (
                                        <button
                                            onClick={onRefreshIntel}
                                            disabled={loadingIntel}
                                            className="p-2 border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-full transition-all disabled:opacity-50"
                                            title="Fetch latest intel (Uses AI Quota)"
                                        >
                                            <Sparkles size={14} className={loadingIntel ? "animate-spin" : ""} />
                                        </button>
                                    )}
                                </div>

                                {loadingIntel ? (
                                    <div className="flex items-center gap-3 py-4">
                                        <Loader2 size={24} className="text-indigo-400 animate-spin" />
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest animate-pulse">Scanning Location...</span>
                                    </div>
                                ) : intel ? (
                                    <>
                                        {intel.localTips && (
                                            <div className="bg-blue-900/20 border border-blue-500/20 rounded-2xl p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Info size={14} className="text-blue-400" />
                                                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Local Insight</span>
                                                </div>
                                                <p className="text-[11px] font-bold text-gray-400 leading-relaxed italic">
                                                    "{intel.localTips}"
                                                </p>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest text-center py-2">No advance intel available</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* TRAVEL LOGISTICS */}
                        <div className="bg-gray-900/40 border border-gray-800 p-5 rounded-3xl space-y-4">
                            <div className="flex items-center gap-3">
                                <Truck className="text-amber-500" size={18} />
                                <h4 className="text-xs font-black text-white uppercase tracking-widest">Travel</h4>
                            </div>

                            {day.travel ? (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                        <span className="text-gray-500">Origin</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-white truncate max-w-[120px]">{day.travel.origin}</span>
                                            {day.travel.origin && (
                                                <a
                                                    href={`https://maps.apple.com/?daddr=${encodeURIComponent(day.travel.origin)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[8px]"
                                                >
                                                    Navigate
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest pt-2 border-t border-gray-800">
                                        <span className="text-gray-500">Drive Time</span>
                                        <span className="text-amber-500">{day.travel.driveTime}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest pt-2 border-t border-gray-800">
                                        <span className="text-gray-500">Bus Call</span>
                                        <span className="text-red-500 font-black">{day.travel.busCall}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest pt-2 border-t border-gray-800">
                                        <span className="text-gray-500">Destination</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-white truncate max-w-[120px]">{day.travel.destination}</span>
                                            {day.travel.destination && (
                                                <a
                                                    href={`https://maps.apple.com/?daddr=${encodeURIComponent(day.travel.destination)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-2 py-1 bg-blue-500 text-black hover:bg-blue-400 rounded text-[8px] font-black"
                                                >
                                                    Navigate
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest text-center">No travel specified</p>
                                </div>
                            )}
                        </div>

                        {/* LODGING DETAILS */}
                        <div className="bg-gray-900/40 border border-gray-800 p-5 rounded-3xl space-y-4">
                            <div className="flex items-center gap-3">
                                <Bed className="text-rose-500" size={18} />
                                <h4 className="text-xs font-black text-white uppercase tracking-widest">Lodging</h4>
                            </div>

                            {day.lodging ? (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                        <span className="text-gray-500">Hotel</span>
                                        <span className="text-white truncate max-w-[150px]">{day.lodging.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest pt-2 border-t border-gray-800">
                                        <span className="text-gray-500">Address</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-white truncate max-w-[120px]">{day.lodging.address}</span>
                                            {day.lodging.address && (
                                                <a
                                                    href={`https://maps.apple.com/?daddr=${encodeURIComponent(day.lodging.address)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[8px]"
                                                >
                                                    Navigate
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest pt-2 border-t border-gray-800">
                                        <span className="text-gray-500">Rooms</span>
                                        <div className="flex gap-2">
                                            <span className="px-2 py-0.5 bg-gray-800 rounded">{day.lodging.rooms.split('/')[0]} <span className="text-gray-500 opacity-50 text-[6px]">SGL</span></span>
                                            <span className="px-2 py-0.5 bg-gray-800 rounded">{day.lodging.rooms.split('/')[1]} <span className="text-gray-500 opacity-50 text-[6px]">DBL</span></span>
                                        </div>
                                    </div>
                                    {day.lodging.confirmation && (
                                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest pt-2 border-t border-gray-800">
                                            <span className="text-gray-500">Confirmation</span>
                                            <span className="text-white">{day.lodging.confirmation}</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest text-center">Bus/Drive Night (No Hotel)</p>
                                </div>
                            )}
                        </div>

                        {/* FINANCIAL BRIEFING */}
                        <div className="bg-emerald-900/10 border border-emerald-500/20 p-6 rounded-[2.5rem] space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <Banknote className="text-emerald-500" size={20} />
                                <h4 className="text-sm font-black text-white uppercase tracking-widest">Settlement</h4>
                            </div>

                            <div className="flex justify-between items-center p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/10">
                                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Potential</span>
                                <span className="text-2xl font-black text-emerald-400">
                                    {(day as any).finance?.walkoutPotential || '$0.00'}
                                </span>
                            </div>

                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest px-1">
                                <span className="text-gray-500">Status</span>
                                <span className="text-white">NOT STARTED</span>
                            </div>
                        </div>

                        {/* MEMBER PERSONAL PLANS */}
                        {day.personalPlans && day.personalPlans.length > 0 && (
                            <div className="bg-blue-900/10 border border-blue-500/20 p-6 rounded-[2.5rem] space-y-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <MessageSquare className="text-blue-400" size={20} />
                                    <h4 className="text-sm font-black text-white uppercase tracking-widest">Team Member Plans</h4>
                                    <span className="ml-auto text-[9px] font-black text-blue-400 bg-blue-500/10 rounded-full px-2 py-1 border border-blue-500/20">{day.personalPlans.length}</span>
                                </div>
                                <div className="space-y-3">
                                    {day.personalPlans.map((plan, i) => (
                                        <div key={i} className="bg-black/40 rounded-2xl p-4 border border-white/5">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">{plan.userName}</span>
                                                <span className="text-[8px] text-gray-600 font-bold">{new Date(plan.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <p className="text-sm text-gray-300 leading-relaxed">{plan.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* QUICK NOTE MODAL */}
            {selectedNoteItem && (
                <div className="fixed inset-0 z-[4000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 lg:p-8" onClick={() => setSelectedNoteItem(null)}>
                    <div className="w-full max-w-lg bg-[#111] border border-gray-800 rounded-3xl p-6 lg:p-8 shadow-2xl relative" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setSelectedNoteItem(null)}
                            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white bg-gray-900/50 hover:bg-gray-800 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center border border-gray-800">
                                <Info size={20} className="text-blue-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-none">{selectedNoteItem.activity}</h3>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">{selectedNoteItem.time} {selectedNoteItem.endTime ? `- ${selectedNoteItem.endTime}` : ''}</p>
                            </div>
                        </div>

                        <div className="prose prose-invert max-w-none bg-gray-900/30 p-5 rounded-2xl border border-white/5">
                            <p className="text-sm font-medium text-gray-300 leading-relaxed whitespace-pre-wrap">
                                {selectedNoteItem.notes || selectedNoteItem.details || 'No additional details provided.'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TourDayView;
