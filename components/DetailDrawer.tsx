
import React, { useState, useEffect, useCallback } from 'react';
import { LocationPoint, MarkerType, Review } from '../types';
import {
  Star, MapPin, Globe, Phone, X, ThumbsUp, ThumbsDown,
  User, ShieldCheck, MessageSquare, ExternalLink,
  ChevronDown, ChevronUp, Sparkles, Loader2, MessageCircle, RefreshCcw, Camera, Home, Zap, ShieldAlert, BadgeCheck, Megaphone, Send, Calendar
} from 'lucide-react';
import { geminiService, EnrichedVenueData } from '../services/geminiService';
import { useAuth } from '../contexts/AuthContext';
// import { CURRENT_USER } from '../constants'; // REMOVED

interface DetailDrawerProps {
  point: LocationPoint | null;
  onClose: () => void;
  onMessageInitiate?: (pointId: string) => void;
}

const DetailDrawer: React.FC<DetailDrawerProps> = ({ point, onClose, onMessageInitiate }) => {
  const { isSuperAdmin } = useAuth(); // ADDED
  const [enrichedData, setEnrichedData] = useState<EnrichedVenueData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLiveIntelOpen, setIsLiveIntelOpen] = useState(true);
  const [localReviews, setLocalReviews] = useState<Review[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isCertified, setIsCertified] = useState(false);
  const [isPitching, setIsPitching] = useState(false);

  const fetchEnrichedData = useCallback(async (p: LocationPoint) => {
    if (p.type !== MarkerType.VENUE) return;

    setLoading(true);
    try {
      const data = await geminiService.getVenueDetailsEnriched(p.name, p.address);
      setEnrichedData(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to refresh venue data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (point) {
      setLocalReviews(point.reviews || []);
      setIsCertified(point.isCertified || false);
      setIsPitching(false);
      if (point.type === MarkerType.VENUE) {
        fetchEnrichedData(point);
      } else {
        setEnrichedData(null);
        setLastUpdated(null);
      }
    }
  }, [point, fetchEnrichedData]);

  if (!point) return null;

  const handleManualRefresh = (e: React.MouseEvent) => {
    e.stopPropagation();
    fetchEnrichedData(point);
  };

  const handleToggleCertification = () => {
    setIsCertified(!isCertified);
  };

  const handleVote = (reviewId: string, isUp: boolean) => {
    setLocalReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        return {
          ...r,
          upvotes: isUp ? r.upvotes + 1 : r.upvotes,
          downvotes: !isUp ? r.downvotes + 1 : r.downvotes
        };
      }
      return r;
    }));
  };

  const getTypeStyle = () => {
    switch (point.type) {
      case MarkerType.VENUE: return 'bg-red-500/20 text-red-400 border-red-500/50';
      case MarkerType.HOST: return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case MarkerType.PRO: return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case MarkerType.CREATOR: return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case MarkerType.BAND: return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      case MarkerType.PROMOTER: return 'bg-pink-500/20 text-pink-400 border-pink-500/50';
      default: return '';
    }
  };

  const liveRating = enrichedData?.rating || (loading && !enrichedData ? '...' : point.avgRating || null);
  const livePhone = enrichedData?.phone || point.contact;
  const liveWebsite = enrichedData?.website || point.website;

  return (
    <div className="fixed top-0 right-0 w-full md:w-[450px] h-full bg-gray-950 border-l border-gray-800 shadow-2xl z-[1000] overflow-y-auto transform transition-transform duration-300">
      <div className="relative p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-800 rounded-full transition-colors z-10"
        >
          <X className="w-6 h-6 text-gray-400" />
        </button>

        {isSuperAdmin && (
          <div className="mb-6 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert size={14} className="text-yellow-500" />
              <span className="text-[9px] font-black text-yellow-500 uppercase tracking-widest">Admin Control Active</span>
            </div>
            <button
              onClick={handleToggleCertification}
              className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border transition-all ${isCertified ? 'bg-yellow-500 text-black border-yellow-500' : 'text-yellow-500 border-yellow-500/40 hover:bg-yellow-500/20'}`}
            >
              {isCertified ? 'Uncertify Node' : 'Certify Node'}
            </button>
          </div>
        )}

        <div className="mt-4">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-[10px] font-black border uppercase tracking-widest ${getTypeStyle()}`}>
              {point.type === MarkerType.PRO ? (point.specialty || 'Production') : point.category || point.type}
            </span>
            {isCertified && (
              <div className="flex items-center gap-1 bg-yellow-500 text-black px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter shadow-lg shadow-yellow-500/10">
                <BadgeCheck size={12} /> TourBridge Vetted
              </div>
            )}
          </div>

          <h1 className="text-3xl font-black mt-3 text-white tracking-tighter leading-none mb-2">{point.name}</h1>

          <div className="flex items-center gap-3 mt-3">
            {liveRating ? (
              <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/30 px-2 py-1 rounded-lg">
                <Star size={14} className="text-yellow-500" fill="currentColor" />
                <span className="text-sm font-black text-yellow-500">{liveRating}</span>
                <span className="text-[10px] text-yellow-500/70 font-bold uppercase">Network Rating</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-500/30">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} />)}
                </div>
                <span className="text-xs text-gray-600 font-bold uppercase">No Rating Yet</span>
              </div>
            )}
          </div>

          {/* Promoter Specialized View */}
          {point.type === MarkerType.PROMOTER && point.promoterMetadata && (
            <div className="mt-8 bg-pink-900/10 border border-pink-500/20 p-5 rounded-2xl">
              <h3 className="font-black flex items-center gap-2 text-pink-400 text-[10px] uppercase tracking-[0.2em] mb-4">
                <Megaphone className="w-4 h-4" /> Promoter Specs
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/40 p-3 rounded-xl border border-gray-800">
                  <p className="text-[8px] font-black text-gray-600 uppercase mb-1">Genre Focus</p>
                  <p className="text-xs text-pink-400 font-bold">{point.promoterMetadata.genres.join(', ')}</p>
                </div>
                <div className="bg-black/40 p-3 rounded-xl border border-gray-800">
                  <p className="text-[8px] font-black text-gray-600 uppercase mb-1">Cap Focus</p>
                  <p className="text-xs text-pink-400 font-bold">{point.promoterMetadata.capacityFocus}</p>
                </div>
              </div>
              {point.promoterMetadata.pastClients && (
                <div className="mt-4">
                  <p className="text-[8px] font-black text-gray-600 uppercase mb-2">Track Record</p>
                  <div className="flex flex-wrap gap-2">
                    {point.promoterMetadata.pastClients.map(c => (
                      <span key={c} className="text-[10px] bg-pink-500/10 text-pink-500/70 border border-pink-500/20 px-2 py-0.5 rounded-full font-bold">{c}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {point.type === MarkerType.VENUE && (
            <div className="mt-8 border border-gray-800 rounded-2xl overflow-hidden bg-gray-900/40">
              <div
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-900 transition-colors border-b border-gray-800 cursor-pointer"
                onClick={() => setIsLiveIntelOpen(!isLiveIntelOpen)}
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-yellow-500/10 rounded-lg">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-white block">Live Reviews & Info</span>
                    {lastUpdated && (
                      <span className="text-[8px] text-gray-500 font-bold uppercase tracking-tighter">
                        Synced {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={handleManualRefresh} disabled={loading} className="p-2 hover:bg-gray-800 rounded-lg transition-all text-gray-500 hover:text-white">
                    <RefreshCcw size={14} className={`${loading ? 'animate-spin text-yellow-500' : ''}`} />
                  </button>
                  {isLiveIntelOpen ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
                </div>
              </div>

              {isLiveIntelOpen && (
                <div className="p-5">
                  {loading && !enrichedData ? (
                    <div className="flex flex-col items-center justify-center py-10">
                      <Loader2 className="w-8 h-8 animate-spin text-yellow-500 mb-4" />
                      <p className="text-[10px] uppercase font-black text-gray-600 tracking-widest animate-pulse">Scanning Nodes...</p>
                    </div>
                  ) : enrichedData ? (
                    <div className={`space-y-6 ${loading ? 'opacity-50 transition-opacity' : ''}`}>
                      {enrichedData.reviewSnippets && enrichedData.reviewSnippets.length > 0 && (
                        <div className="space-y-3">
                          <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] mb-2">Live Snippets</p>
                          {enrichedData.reviewSnippets.map((snippet, idx) => (
                            <div key={idx} className="bg-black/40 p-3 rounded-xl border border-gray-800/50 italic text-xs text-gray-400 leading-relaxed relative">
                              <MessageCircle size={10} className="absolute -top-1.5 -left-1.5 text-gray-700" />
                              "{snippet.text}"
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="text-xs text-gray-400 leading-relaxed prose prose-invert prose-sm">
                        {enrichedData.text.split('\n').filter(l => l.trim()).map((line, i) => (
                          <p key={i} className="mb-2">{line}</p>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center text-[10px] font-black text-gray-700 uppercase tracking-widest">No Live Intel Found</div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col gap-3 mt-8">
            <div className="flex gap-3">
              <button
                onClick={() => onMessageInitiate?.(point.id)}
                className="flex-1 bg-white text-black py-4 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <MessageSquare size={18} /> Contact Node
              </button>
              {(point.type === MarkerType.VENUE || point.type === MarkerType.PROMOTER) && (
                <button
                  onClick={() => setIsPitching(true)}
                  className="flex-1 bg-pink-500 text-white py-4 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-pink-500/20"
                >
                  <Megaphone size={18} /> Pitch Gig
                </button>
              )}
            </div>
            {liveWebsite && (
              <a href={liveWebsite} target="_blank" rel="noreferrer" className="w-full h-12 flex items-center justify-center bg-gray-900 rounded-2xl border border-gray-800 hover:bg-gray-800 transition-all text-[10px] font-black uppercase tracking-widest text-gray-400 gap-2">
                <Globe size={16} /> Official Site <ExternalLink size={12} />
              </a>
            )}
          </div>

          {/* Gig Pitch Overlay */}
          {isPitching && (
            <div className="mt-8 bg-gray-900 border border-pink-500/30 p-6 rounded-3xl animate-in slide-in-from-bottom-4 duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Megaphone size={64} className="text-pink-500" />
              </div>
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-sm font-black text-white uppercase tracking-widest">Formal Gig Pitch</h4>
                <button onClick={() => setIsPitching(false)} className="text-gray-500 hover:text-white"><X size={16} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[8px] font-black text-gray-500 uppercase block mb-1">Target Date / Window</label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                    <input type="text" placeholder="e.g. October 2024" className="w-full bg-black border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-pink-500/50" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[8px] font-black text-gray-500 uppercase block mb-1">Expected Draw</label>
                    <input type="number" placeholder="e.g. 150" className="w-full bg-black border border-gray-800 rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-pink-500/50" />
                  </div>
                  <div>
                    <label className="text-[8px] font-black text-gray-500 uppercase block mb-1">EPK / Link</label>
                    <input type="text" placeholder="Spotify/Site" className="w-full bg-black border border-gray-800 rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-pink-500/50" />
                  </div>
                </div>
                <div>
                  <label className="text-[8px] font-black text-gray-500 uppercase block mb-1">Proposed Pitch</label>
                  <textarea placeholder="Why should this venue book you?" className="w-full bg-black border border-gray-800 rounded-xl p-4 text-xs focus:outline-none focus:border-pink-500/50 min-h-[80px] resize-none" />
                </div>
                <button
                  onClick={() => setIsPitching(false)}
                  className="w-full bg-pink-500 text-white py-3 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-pink-600 transition-all"
                >
                  <Send size={14} /> Send Proposal
                </button>
              </div>
            </div>
          )}

          <div className="mt-10 space-y-5 text-gray-300">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-gray-900 rounded-xl">
                <MapPin className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-white text-sm leading-tight">{point.address}</p>
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(point.name + " " + point.address)}`} target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 font-black uppercase tracking-widest mt-1 inline-block">Map View</a>
              </div>
            </div>

            {livePhone && (
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gray-900 rounded-xl">
                  <Phone className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">{livePhone}</p>
                </div>
              </div>
            )}
          </div>

          {(point.type === MarkerType.PRO || point.type === MarkerType.CREATOR) && point.radius && (
            <div className="mt-8 bg-blue-900/10 border border-blue-900/30 p-5 rounded-2xl relative overflow-hidden group">
              <h3 className="font-black flex items-center gap-2 text-blue-400 text-[10px] uppercase tracking-[0.2em] mb-2">
                <Zap className="w-4 h-4" /> Travel Blip Active
              </h3>
              <p className="text-xs text-gray-400">Available within <span className="text-white font-black">{point.radius} miles</span>.</p>
            </div>
          )}

          {point.type === MarkerType.HOST && (
            <div className="mt-8 bg-emerald-900/10 border border-emerald-900/30 p-5 rounded-2xl">
              <h3 className="font-black flex items-center gap-2 text-emerald-400 text-[10px] uppercase tracking-[0.2em] mb-2">
                <ShieldCheck className="w-4 h-4" /> Vetted Host Details
              </h3>
              <p className="text-xs text-gray-400">This host has passed a safety clearance. Secure parking and laundry facilities available.</p>
            </div>
          )}

          <div className="mt-12">
            <h3 className="text-[10px] font-black text-gray-700 uppercase tracking-[0.3em] mb-4">Node Briefing</h3>
            <p className="text-gray-400 leading-relaxed text-sm bg-gray-900/20 p-4 rounded-xl border border-gray-900/50">{point.description}</p>
          </div>

          <div className="mt-14 mb-12">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-[10px] font-black text-gray-700 uppercase tracking-[0.3em]">Network Reviews</h3>
              <button className="text-[9px] font-black text-white hover:bg-white hover:text-black uppercase tracking-widest px-4 py-2 rounded-full border border-gray-800 transition-all">Add Review</button>
            </div>

            <div className="space-y-4">
              {localReviews.length > 0 ? localReviews.map((rev) => (
                <div key={rev.id} className="bg-gray-900/40 p-5 rounded-2xl border border-gray-800/50">
                  <div className="flex justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center"><User size={14} className="text-gray-500" /></div>
                      <div>
                        <span className="text-xs font-black text-white block leading-none">{rev.userName}</span>
                        <span className="text-[9px] text-gray-600 font-bold uppercase tracking-tighter">{rev.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500 font-black text-[10px]">{rev.rating} <Star size={10} fill="currentColor" /></div>
                  </div>
                  <p className="text-xs text-gray-400 mb-5 leading-relaxed">{rev.comment}</p>
                  <div className="flex gap-6 border-t border-gray-800/50 pt-4">
                    <button onClick={() => handleVote(rev.id, true)} className="flex items-center gap-2 text-[10px] font-bold text-gray-600 hover:text-emerald-400"><ThumbsUp size={14} /> {rev.upvotes}</button>
                    <button onClick={() => handleVote(rev.id, false)} className="flex items-center gap-2 text-[10px] font-bold text-gray-600 hover:text-red-400"><ThumbsDown size={14} /> {rev.downvotes}</button>
                  </div>
                </div>
              )) : (
                <div className="text-center py-12 border border-dashed border-gray-800 rounded-3xl bg-gray-900/10">
                  <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Be the first to leave a blip.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailDrawer;
