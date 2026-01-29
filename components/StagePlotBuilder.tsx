
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Mic, Speaker, Music, Box, Circle, Square, ArrowUp, 
  Trash2, Move, Type, Layers, Download, Plus, Info, 
  Undo, RotateCcw, Monitor, Piano, Drum, Guitar,
  Zap, Disc, CircleDot, Volume2, HardDrive, Mic2
} from 'lucide-react';

interface GearItem {
  id: string;
  type: GearType;
  x: number;
  y: number;
  label: string;
  rotation: number;
}

type GearType = 
  | 'VOCAL_MIC' 
  | 'INSTRUMENT_MIC' 
  | 'AMP_GUITAR' 
  | 'AMP_BASS' 
  | 'KEYBOARD' 
  | 'DRUM_KICK' 
  | 'DRUM_SNARE' 
  | 'DRUM_TOM' 
  | 'CYMBAL' 
  | 'DI_BOX' 
  | 'MONITOR' 
  | 'POWER';

const GEAR_CATALOG = [
  { type: 'VOCAL_MIC' as GearType, icon: Mic, label: 'Vocal Mic', color: 'text-white', bgColor: 'bg-white/10' },
  { type: 'INSTRUMENT_MIC' as GearType, icon: Mic2, label: 'Inst. Mic', color: 'text-gray-300', bgColor: 'bg-gray-800' },
  { type: 'MONITOR' as GearType, icon: Monitor, label: 'Wedge Monitor', color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
  { type: 'AMP_GUITAR' as GearType, icon: Volume2, label: 'Guitar Amp', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
  { type: 'AMP_BASS' as GearType, icon: Speaker, label: 'Bass Amp', color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
  { type: 'KEYBOARD' as GearType, icon: Piano, label: 'Keyboard', color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
  { type: 'DRUM_KICK' as GearType, icon: CircleDot, label: 'Kick Drum', color: 'text-red-500', bgColor: 'bg-red-500/10' },
  { type: 'DRUM_SNARE' as GearType, icon: Disc, label: 'Snare Drum', color: 'text-red-400', bgColor: 'bg-red-400/10' },
  { type: 'DRUM_TOM' as GearType, icon: Circle, label: 'Tom Drum', color: 'text-red-300', bgColor: 'bg-red-300/10' },
  { type: 'CYMBAL' as GearType, icon: Disc, label: 'Cymbal', color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
  { type: 'DI_BOX' as GearType, icon: HardDrive, label: 'DI Box', color: 'text-gray-400', bgColor: 'bg-gray-400/10' },
  { type: 'POWER' as GearType, icon: Zap, label: 'Power Drop', color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
];

const StagePlotBuilder: React.FC = () => {
  const [items, setItems] = useState<GearItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const addItem = (type: GearType) => {
    const catalogItem = GEAR_CATALOG.find(g => g.type === type);
    const newItem: GearItem = {
      id: `item-${Date.now()}`,
      type,
      x: 45, // percentage
      y: 45,
      label: catalogItem?.label || 'New Item',
      rotation: 0
    };
    setItems(prev => [...prev, newItem]);
    setSelectedId(newItem.id);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const updateItem = (id: string, updates: Partial<GearItem>) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
  };

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedId(id);
    setIsDragging(true);
    
    const item = items.find(i => i.id === id);
    if (item && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const currentX = (item.x / 100) * rect.width;
      const currentY = (item.y / 100) * rect.height;
      dragOffset.current = {
        x: e.clientX - rect.left - currentX,
        y: e.clientY - rect.top - currentY
      };
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && selectedId && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      let newX = ((e.clientX - rect.left - dragOffset.current.x) / rect.width) * 100;
      let newY = ((e.clientY - rect.top - dragOffset.current.y) / rect.height) * 100;

      // Constrain to bounds
      newX = Math.max(2, Math.min(93, newX));
      newY = Math.max(2, Math.min(93, newY));

      updateItem(selectedId, { x: newX, y: newY });
    }
  }, [isDragging, selectedId]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div className="flex flex-col h-full bg-black overflow-hidden select-none">
      {/* Top Header */}
      <div className="h-20 border-b border-gray-900 bg-gray-950/50 flex items-center justify-between px-8 shrink-0">
        <div>
           <div className="flex items-center gap-2 mb-1">
             <Layers size={14} className="text-blue-500" />
             <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Stage Plot Architect</span>
           </div>
           <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Tech Rider Designer</h2>
        </div>

        <div className="flex items-center gap-4">
           <button 
             onClick={() => setItems([])}
             className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-gray-400 hover:text-white transition-all text-[10px] font-black uppercase border border-gray-800"
           >
             <RotateCcw size={14} /> Clear Stage
           </button>
           <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black hover:bg-gray-200 transition-all text-[10px] font-black uppercase shadow-lg shadow-white/10">
             <Download size={14} /> Export PDF
           </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Gear Catalog Sidebar */}
        <aside className="w-80 border-r border-gray-900 bg-gray-950 flex flex-col shrink-0">
           <div className="p-6 border-b border-gray-900">
             <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4">Gear Inventory</h3>
             <div className="grid grid-cols-2 gap-3">
                {GEAR_CATALOG.map((g) => (
                  <button 
                    key={g.type}
                    onClick={() => addItem(g.type)}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-blue-500/50 hover:bg-gray-900 transition-all group"
                  >
                    <div className={`p-2 rounded-lg ${g.bgColor} mb-2 group-hover:scale-110 transition-transform`}>
                      <g.icon className={`w-6 h-6 ${g.color}`} />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-tighter text-gray-500 group-hover:text-white">{g.label}</span>
                  </button>
                ))}
             </div>
           </div>

           <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {selectedId ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-left-2">
                   <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Item Configuration</h3>
                   <div>
                     <label className="text-[8px] font-black text-gray-600 uppercase mb-2 block">Display Label</label>
                     <input 
                       type="text" 
                       value={items.find(i => i.id === selectedId)?.label || ''}
                       onChange={(e) => updateItem(selectedId, { label: e.target.value })}
                       className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500/50"
                     />
                   </div>
                   <div>
                     <label className="text-[8px] font-black text-gray-600 uppercase mb-2 block">Rotation</label>
                     <input 
                       type="range" 
                       min="0" max="315" step="45"
                       value={items.find(i => i.id === selectedId)?.rotation || 0}
                       onChange={(e) => updateItem(selectedId, { rotation: parseInt(e.target.value) })}
                       className="w-full accent-blue-500"
                     />
                   </div>
                   <button 
                     onClick={() => removeItem(selectedId)}
                     className="w-full py-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-black uppercase hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                   >
                     <Trash2 size={14} /> Remove Selected
                   </button>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                   <Move size={32} className="text-gray-600 mb-4" />
                   <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Select item on stage<br/>to edit details</p>
                </div>
              )}
           </div>
        </aside>

        {/* Main Canvas Area */}
        <main className="flex-1 bg-black p-12 overflow-hidden flex items-center justify-center relative">
           <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-30">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-600">Upstage / Back</span>
              <ArrowUp size={16} className="text-gray-700" />
           </div>

           <div 
             ref={canvasRef}
             className="w-full max-w-5xl aspect-[16/10] bg-gray-950/20 border-4 border-gray-900 rounded-[3rem] relative shadow-2xl overflow-hidden"
             style={{
               backgroundImage: 'radial-gradient(circle, #1f2937 1px, transparent 1px)',
               backgroundSize: '40px 40px'
             }}
             onClick={() => setSelectedId(null)}
           >
              {/* Center Line */}
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gray-900/50" />
              <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-900/50" />

              {items.map((item) => {
                const catalog = GEAR_CATALOG.find(g => g.type === item.type);
                const Icon = catalog?.icon || Circle;
                const isSelected = selectedId === item.id;

                return (
                  <div
                    key={item.id}
                    onMouseDown={(e) => handleMouseDown(e, item.id)}
                    className={`absolute cursor-move group flex flex-col items-center justify-center p-3 transition-shadow ${isSelected ? 'z-50' : 'z-10'}`}
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                      transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
                    }}
                  >
                    <div className={`p-4 rounded-2xl transition-all border-2 ${
                      isSelected ? 'bg-blue-600 border-white shadow-2xl scale-110' : 'bg-gray-900/80 backdrop-blur-md border-gray-800 hover:border-gray-600'
                    }`}>
                      <Icon className={`w-8 h-8 ${isSelected ? 'text-white' : catalog?.color}`} />
                    </div>
                    <span 
                      className={`mt-2 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                        isSelected ? 'bg-white text-black' : 'text-gray-400 bg-black/60 backdrop-blur-sm'
                      }`}
                      style={{ transform: `rotate(-${item.rotation}deg)` }}
                    >
                      {item.label}
                    </span>
                  </div>
                );
              })}
           </div>

           <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-30">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-600">Downstage / Front</span>
           </div>

           <div className="absolute bottom-8 right-8 bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-2xl p-4 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-500/20 border border-red-500" />
                <span className="text-[8px] font-black text-gray-500 uppercase">Input Node</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-500/20 border border-blue-500" />
                <span className="text-[8px] font-black text-gray-500 uppercase">Audio Mon</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-orange-500/20 border border-orange-500" />
                <span className="text-[8px] font-black text-gray-500 uppercase">Power</span>
              </div>
           </div>
        </main>
      </div>
    </div>
  );
};

export default StagePlotBuilder;
