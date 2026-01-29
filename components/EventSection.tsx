
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Tag, Clock, Search, Loader2, Compass, PlusCircle } from 'lucide-react';
import { MOCK_EVENTS, CURRENT_USER } from '../constants';
import { EventListing, GigOpportunity } from '../types';
import { geminiService } from '../services/geminiService';

interface GigBoardOverlayProps {
  onClose: () => void;
  onAddToPipeline: (gig: GigOpportunity) => void;
}

const GigBoardOverlay: React.FC<GigBoardOverlayProps> = ({ onClose, onAddToPipeline }) => {
  const [events, setEvents] = useState<EventListing[]>(MOCK_EVENTS);
  const [locationSearch, setLocationSearch] = useState('Current Location');
  const [isLoading, setIsLoading] = useState(false);

  const fetchGigs = async (loc: string) => {
    setIsLoading(true);
    const discovered = await geminiService.searchGigsByLocation(loc);
    if (discovered && discovered.length > 0) {
      setEvents(discovered);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // Initial fetch if mock is empty or based on user location could happen here
  }, []);

  const handleAdd = (event: EventListing) => {
    const opportunity: GigOpportunity = {
        id: Date.now().toString(),
        venueName: event.venueName,
        city: locationSearch === 'Current Location' ? 'Unknown City' : locationSearch, // In real app, EventListing should have city
        date: event.date,
        status: 'LEAD',
        fee: 0,
        dealTerms: 'To Be Negotiated',
        capacity: 0,
        notes: `Source: Gig Board - ${event.title}`
    };
    onAddToPipeline(opportunity);
  };

  return (
    <div className="absolute top-4 left-4 w-96 max-h-[85vh] bg-gray-950 border border-gray-800 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col z-[950] animate-in slide-in-from-left-4 duration-300">
      <div className="p-6 bg-gradient-to-r from-gray-900 to-black border-b border-gray-800 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-lg font-black text-white tracking-tighter uppercase">Gig Board</h2>
          <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest mt-0.5">Live Slots & Openings</p>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <Compass size={20} />
        </button>
      </div>
      
      <div className="p-4 bg-black/50 border-b border-gray-800 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input 
              type="text" 
              placeholder="Search city (e.g. Austin)" 
              className="w-full bg-gray-900 border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-blue-500/50"
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchGigs(locationSearch)}
            />
          </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-center opacity-60">
             <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
             <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Scanning...</p>
          </div>
        ) : events.length > 0 ? (
            events.map(event => (
              <div key={event.id} className="bg-gray-900/40 border border-gray-800 rounded-xl p-4 flex flex-col hover:border-blue-500/30 transition-all group relative overflow-hidden">
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border uppercase tracking-widest ${event.status === 'OPEN' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                    {event.status}
                  </span>
                  <div className="flex items-center gap-1 text-gray-500 text-[9px] font-black uppercase">
                    <Clock size={10} className="text-blue-500" /> {event.time || 'TBD'}
                  </div>
                </div>

                <h3 className="text-sm font-black text-white mb-0.5 uppercase tracking-tight truncate group-hover:text-blue-400 transition-colors">{event.title}</h3>
                <div className="flex items-center gap-1 text-gray-400 text-[9px] font-bold uppercase mb-2">
                  <MapPin size={10} className="text-red-500" /> {event.venueName}
                </div>

                <p className="text-[10px] text-gray-500 mb-3 line-clamp-2 leading-relaxed">{event.description}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {event.genreTags.slice(0, 3).map(tag => (
                    <span key={tag} className="flex items-center gap-1 text-[7px] font-black bg-black/40 px-1.5 py-0.5 rounded text-gray-400 border border-gray-800 uppercase tracking-tighter">
                      <Tag size={8} /> {tag}
                    </span>
                  ))}
                </div>

                <button 
                    onClick={() => handleAdd(event)}
                    className="mt-auto w-full bg-white text-black text-[9px] font-black uppercase tracking-widest py-2 rounded-lg hover:scale-[1.02] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                    <PlusCircle size={12} /> Add to Pipeline
                </button>
              </div>
            ))
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center opacity-40">
             <Compass size={32} className="text-gray-700 mb-2" />
             <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">No gigs found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GigBoardOverlay;
