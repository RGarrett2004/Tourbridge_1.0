
import React, { useState, useRef, useMemo } from 'react';
import { StageAsset, AssetType, InputChannel } from './types';
import {
    Mic2, Speaker, Music2, Box, Move, RotateCw, Trash2,
    Save, Download, GripVertical, Plus, Type, Settings2,
    X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import {
    DrumKit, GuitarAmp, BassAmp, WedgeMonitor, MicStand, VocalMic,
    DIBox, Keyboard, Pedalboard, PowerOutlet,
    Riser, InEarMonitor,
    Cajon, ElectricGuitar, BassPlayer, Saxophone, Trumpet, Trombone, Flute, Keytar,
    PASpeaker, Subwoofer, PowerDrop, CableCoil, Headphones, MusicStand
} from './StageAssets';

// Extended Template Definition
interface AssetTemplate {
    type: AssetType;
    label: string;
    component?: React.FC;
    defaultInputs: number;
    width: number;
    height: number;
    defaultDescription?: string;
}

const ASSET_TEMPLATES: AssetTemplate[] = [
    // DRUMS & PERC
    { type: 'DRUM', label: 'Drum Kit', component: DrumKit, defaultInputs: 4, width: 120, height: 100, defaultDescription: 'Standard 4-pc Kit' },
    { type: 'DRUM', label: 'Cajon', component: Cajon, defaultInputs: 1, width: 40, height: 50, defaultDescription: 'Mic: SM57/Beta 91' },

    // AMPS
    { type: 'AMP', label: 'Guitar Amp', component: GuitarAmp, defaultInputs: 1, width: 60, height: 40, defaultDescription: 'Mic: SM57' },
    { type: 'AMP', label: 'Bass Amp', component: BassAmp, defaultInputs: 1, width: 60, height: 40, defaultDescription: 'DI Out' },

    // STRINGS
    { type: 'AMP', label: 'Electric Guitar', component: ElectricGuitar, defaultInputs: 0, width: 30, height: 70, defaultDescription: 'Goes to Amp' },
    { type: 'AMP', label: 'Bass Guitar', component: BassPlayer, defaultInputs: 0, width: 30, height: 70, defaultDescription: 'Goes to Amp/DI' },

    // KEYS & PEDALS
    { type: 'KEYBOARD', label: 'Keyboard', component: Keyboard, defaultInputs: 2, width: 100, height: 35, defaultDescription: 'Stereo DI' },
    { type: 'KEYBOARD', label: 'Keytar', component: Keytar, defaultInputs: 1, width: 70, height: 35, defaultDescription: 'Wireless/DI' },
    { type: 'KEYBOARD', label: 'Pedalboard', component: Pedalboard, defaultInputs: 0, width: 50, height: 30 },

    // HORNS / WINDS
    { type: 'MIC', label: 'Saxophone', component: Saxophone, defaultInputs: 1, width: 40, height: 60, defaultDescription: 'Clip Mic' },
    { type: 'MIC', label: 'Trumpet', component: Trumpet, defaultInputs: 1, width: 60, height: 20, defaultDescription: 'Clip Mic' },
    { type: 'MIC', label: 'Trombone', component: Trombone, defaultInputs: 1, width: 70, height: 20, defaultDescription: 'Clip Mic' },
    { type: 'MIC', label: 'Flute', component: Flute, defaultInputs: 1, width: 60, height: 10, defaultDescription: 'Mic on Stand' },

    // MICS
    { type: 'MIC', label: 'Vocal Mic', component: VocalMic, defaultInputs: 1, width: 30, height: 30, defaultDescription: 'Boom Stand' },
    { type: 'MIC', label: 'Inst Mic', component: MicStand, defaultInputs: 1, width: 30, height: 30 },

    // MONITORS
    { type: 'MONITOR', label: 'Wedge', component: WedgeMonitor, defaultInputs: 1, width: 50, height: 35, defaultDescription: 'Mix 1' },
    { type: 'MONITOR', label: 'In-Ear', component: InEarMonitor, defaultInputs: 1, width: 40, height: 25, defaultDescription: 'Stereo IEM' },

    // PA & SOUND
    { type: 'MONITOR', label: 'Main Speaker', component: PASpeaker, defaultInputs: 0, width: 50, height: 80, defaultDescription: 'FOH Main' },
    { type: 'MONITOR', label: 'Subwoofer', component: Subwoofer, defaultInputs: 0, width: 60, height: 60, defaultDescription: 'FOH Sub' },

    // UTILS
    { type: 'DI', label: 'DI Box', component: DIBox, defaultInputs: 1, width: 30, height: 30 },
    { type: 'DI', label: 'Power Outlet', component: PowerOutlet, defaultInputs: 0, width: 30, height: 30, defaultDescription: 'Quad Box' },
    { type: 'UTILITY', label: 'Power Drop', component: PowerDrop, defaultInputs: 0, width: 30, height: 30, defaultDescription: 'Stage Power' },
    { type: 'UTILITY', label: 'XLR Coil', component: CableCoil, defaultInputs: 0, width: 30, height: 30, defaultDescription: 'Extra Cable' },
    { type: 'UTILITY', label: 'Headphones', component: Headphones, defaultInputs: 0, width: 30, height: 30, defaultDescription: 'Cue Mix' },
    { type: 'UTILITY', label: 'Music Stand', component: MusicStand, defaultInputs: 0, width: 30, height: 30, defaultDescription: 'Sheet Music' },
    { type: 'RISER', label: 'Riser (8x8)', component: Riser, defaultInputs: 0, width: 150, height: 120 },

    // TEXT
    { type: 'TEXT', label: 'Label / Note', defaultInputs: 0, width: 100, height: 40, defaultDescription: 'New Text' },
];

const StagePlotDesigner: React.FC = () => {
    const [assets, setAssets] = useState<StageAsset[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'CANVAS' | 'RIDER'>('CANVAS');
    const { isDemoMode } = useAuth();
    const stageRef = useRef<HTMLDivElement>(null);

    // Selected Asset Properties
    const selectedAsset = useMemo(() => assets.find(a => a.id === selectedId), [assets, selectedId]);

    // Color Palette for Cables / Labels
    const COLOR_PALETTE = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];

    // Generate Input List
    const inputList = useMemo(() => {
        const list: InputChannel[] = [];
        let chCounter = 1;

        // Sort assets by x position (Stage Left to Right approx) for logical patching
        const sortedAssets = [...assets].sort((a, b) => a.x - b.x);

        sortedAssets.forEach(asset => {
            if (asset.inputs > 0) {
                if (asset.type === 'DRUM' && asset.label === 'Drum Kit') {
                    list.push({ channel: chCounter++, name: 'Kick', mic: 'Beta 52', stand: 'Boom' });
                    list.push({ channel: chCounter++, name: 'Snare', mic: 'SM57', stand: 'Snare Stand' });
                    list.push({ channel: chCounter++, name: 'OH L', mic: 'KSM32', stand: 'Tall Boom' });
                    list.push({ channel: chCounter++, name: 'OH R', mic: 'KSM32', stand: 'Tall Boom' });
                } else if (asset.inputs === 2) {
                    list.push({ channel: chCounter++, name: `${asset.label} L`, mic: 'DI', stand: '' });
                    list.push({ channel: chCounter++, name: `${asset.label} R`, mic: 'DI', stand: '' });
                } else {
                    const micInfo = asset.phantom ? 'Active DI / 48v' : (asset.description?.includes('DI') ? 'DI' : 'SM58');
                    list.push({ channel: chCounter++, name: asset.label, mic: micInfo, stand: 'Boom' });
                }
            }
        });
        return list;
    }, [assets]);

    const handleDragStart = (e: React.DragEvent, template: AssetTemplate) => {
        const { component, ...data } = template;
        e.dataTransfer.setData('application/json', JSON.stringify(data));
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const stageRect = stageRef.current?.getBoundingClientRect();
        if (!stageRect) return;

        const data = e.dataTransfer.getData('application/json');
        if (data) {
            const template = JSON.parse(data);
            const x = e.clientX - stageRect.left;
            const y = e.clientY - stageRect.top;

            const newAsset: StageAsset = {
                id: `asset-${Date.now()}`,
                type: template.type,
                label: template.type === 'TEXT' ? 'New Text' : template.label,
                x,
                y,
                rotation: 0,
                inputs: template.defaultInputs,
                width: template.width,
                height: template.height,
                description: template.defaultDescription,
                brand: '',
                model: '',
                phantom: false,
                colorLabel: '',
                fontSize: 16,
                color: '#ffffff',
                fontWeight: 'normal'
            };
            setAssets(prev => [...prev, newAsset]);
            setSelectedId(newAsset.id);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const updateAsset = (id: string, updates: Partial<StageAsset>) => {
        setAssets(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    };

    const deleteAsset = (id: string) => {
        setAssets(prev => prev.filter(a => a.id !== id));
        if (selectedId === id) setSelectedId(null);
    };

    return (
        <div className="flex h-full bg-black text-white font-sans overflow-hidden">
            {/* Sidebar Tools */}
            <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0">
                <div className="p-4 border-b border-gray-800">
                    <h2 className="text-xl font-black uppercase tracking-tighter">Stage Plotter</h2>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Drag items to stage</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {/* Categories */}
                    {[
                        { title: 'Drums', filter: (t: AssetTemplate) => t.type === 'DRUM' },
                        { title: 'Guitars', filter: (t: AssetTemplate) => ['Electric Guitar', 'Bass Guitar', 'Guitar Amp', 'Bass Amp'].includes(t.label) },
                        { title: 'Keys', filter: (t: AssetTemplate) => ['Keyboard', 'Keytar', 'Pedalboard'].includes(t.label) },
                        { title: 'Horns & Winds', filter: (t: AssetTemplate) => ['Saxophone', 'Trumpet', 'Trombone', 'Flute'].includes(t.label) },
                        { title: 'Mics', filter: (t: AssetTemplate) => t.type === 'MIC' && !['Saxophone', 'Trumpet', 'Trombone', 'Flute'].includes(t.label) },
                        { title: 'Sound / PA', filter: (t: AssetTemplate) => ['Main Speaker', 'Subwoofer', 'Wedge', 'In-Ear'].includes(t.label) },
                        { title: 'Utilities', filter: (t: AssetTemplate) => ['DI Box', 'Power', 'Riser (8x8)'].includes(t.label) || t.type === 'UTILITY' },
                    ].map(cat => (
                        <div key={cat.title}>
                            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">{cat.title}</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {ASSET_TEMPLATES.filter(cat.filter).map(t => (
                                    <div
                                        key={t.label}
                                        draggable
                                        title={t.label}
                                        onDragStart={(e) => handleDragStart(e, t)}
                                        className="aspect-square bg-gray-800 hover:bg-gray-700 rounded-lg cursor-grab active:cursor-grabbing flex items-center justify-center p-2 border border-gray-700 hover:border-blue-500 transition-all group relative"
                                    >
                                        <div className="w-full h-full flex items-center justify-center pointer-events-none">
                                            {t.component && <t.component />}
                                        </div>
                                        {/* Tooltip on Hover */}
                                        <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black/90 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-50 pointer-events-none">
                                            {t.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Text Tool */}
                    <div>
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Annotation</h3>
                        <div
                            draggable
                            onDragStart={(e) => handleDragStart(e, ASSET_TEMPLATES.find(t => t.type === 'TEXT')!)}
                            className="bg-gray-800 hover:bg-gray-700 p-3 rounded-lg cursor-grab active:cursor-grabbing flex items-center gap-3 border border-gray-700 hover:border-blue-500/50 transition-all"
                        >
                            <Type size={16} />
                            <span className="text-xs font-bold">Add Text Label</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area (Canvas OR Rider View) */}
            <div className="flex-1 bg-[#1a1a1a] relative flex flex-col overflow-hidden">

                {/* 1. VISUAL CANVAS VIEW */}
                {viewMode === 'CANVAS' && (
                    <div
                        ref={stageRef}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        className="flex-1 relative m-8 bg-[#222] rounded-3xl border border-dashed border-gray-700 shadow-2xl overflow-hidden"
                        onClick={() => setSelectedId(null)}
                    >
                        <div className="absolute inset-0 opacity-10 pointer-events-none"
                            style={{ backgroundImage: 'radial-gradient(#666 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                        />

                        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500 pointer-events-none">
                            UPSTAGE
                        </div>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500 pointer-events-none">
                            DOWNSTAGE
                        </div>

                        {assets.map((asset) => {
                            const Template = ASSET_TEMPLATES.find(t => t.label === asset.label && t.type === asset.type);
                            const Component = Template?.component;

                            return (
                                <div
                                    key={asset.id}
                                    style={{
                                        left: asset.x,
                                        top: asset.y,
                                        position: 'absolute',
                                        transform: `translate(-50%, -50%) rotate(${asset.rotation}deg)`,
                                        width: asset.width,
                                        height: asset.height,
                                        zIndex: asset.type === 'RISER' ? 0 : 10
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedId(asset.id);
                                    }}
                                    className={`group cursor-pointer hover:brightness-110 transition-all ${selectedId === asset.id ? 'z-50' : ''}`}
                                >
                                    {/* ASSET RENDER */}
                                    {asset.type === 'TEXT' ? (
                                        <div
                                            className={`w-full h-full flex items-center justify-center text-center whitespace-pre-wrap ${selectedId === asset.id ? 'border-2 border-dashed border-blue-500 rounded p-1' : ''}`}
                                            style={{ fontSize: asset.fontSize, color: asset.color, fontWeight: asset.fontWeight }}
                                        >
                                            {asset.label}
                                        </div>
                                    ) : (
                                        <div className="relative w-full h-full">
                                            {Component ? <Component /> : <div className="w-full h-full bg-red-500 rounded" />}

                                            {selectedId === asset.id && (
                                                <div className="absolute -inset-2 border-2 border-blue-500 rounded-lg pointer-events-none animate-pulse" />
                                            )}

                                            {/* Cable Color Indicator */}
                                            {asset.colorLabel && (
                                                <div
                                                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full border border-white box-content"
                                                    style={{ backgroundColor: asset.colorLabel }}
                                                />
                                            )}

                                            <div
                                                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 flex flex-col items-center pointer-events-none w-[200px]"
                                                style={{ transform: `translate(-50%, 0) rotate(-${asset.rotation}deg)` }}
                                            >
                                                <span className="bg-black/90 text-white px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap border border-gray-800">
                                                    {asset.label}
                                                </span>
                                                {(asset.brand || asset.model) && (
                                                    <span className="text-[8px] text-blue-300 bg-black/80 px-1 rounded mt-0.5 font-mono">
                                                        {asset.brand} {asset.model}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* 2. RIDER (TABLE) VIEW */}
                {viewMode === 'RIDER' && (
                    <div className="flex-1 m-8 bg-[#151515] rounded-3xl border border-gray-800 shadow-2xl overflow-hidden flex flex-col p-8">
                        <div className="mb-8 border-b border-gray-800 pb-4">
                            <h2 className="text-3xl font-black uppercase tracking-tighter">Technical Rider</h2>
                            <p className="text-gray-500 mt-2">Generated from Stage Plot • {assets.length} Assets • {inputList.length} Inputs</p>
                        </div>

                        {/* Input List Table */}
                        <div className="mb-8">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-blue-500 mb-4">Input Patch List</h3>
                            <div className="border border-gray-800 rounded-lg overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-900 text-xs font-black uppercase text-gray-500">
                                        <tr>
                                            <th className="p-4 border-b border-gray-800">CH</th>
                                            <th className="p-4 border-b border-gray-800">Source</th>
                                            <th className="p-4 border-b border-gray-800">Mic / DI</th>
                                            <th className="p-4 border-b border-gray-800">Stand</th>
                                            <th className="p-4 border-b border-gray-800">Notes</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm divide-y divide-gray-800">
                                        {inputList.map(ch => (
                                            <tr key={ch.channel} className="hover:bg-gray-900/50">
                                                <td className="p-4 font-mono text-blue-500 font-bold">{ch.channel < 10 ? `0${ch.channel}` : ch.channel}</td>
                                                <td className="p-4 font-bold">{ch.name}</td>
                                                <td className="p-4 text-gray-300">{ch.mic}</td>
                                                <td className="p-4 text-gray-400">{ch.stand}</td>
                                                <td className="p-4 text-gray-500 italic">-</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Equipment Detail List */}
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-green-500 mb-4">Equipment Details</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {assets.filter(a => a.type !== 'TEXT' && a.type !== 'RISER').map(asset => (
                                    <div key={asset.id} className="bg-gray-900/50 border border-gray-800 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            {asset.colorLabel && <div className="w-2 h-2 rounded-full" style={{ background: asset.colorLabel }} />}
                                            <span className="font-bold text-sm">{asset.label}</span>
                                        </div>
                                        {(asset.brand || asset.model) ? (
                                            <div className="text-xs text-blue-400 font-mono mb-1">{asset.brand} {asset.model}</div>
                                        ) : (
                                            <div className="text-xs text-gray-600 italic mb-1">No specifics specified</div>
                                        )}
                                        {asset.description && <div className="text-xs text-gray-400 mt-2 border-t border-gray-800 pt-2">{asset.description}</div>}
                                        {asset.phantom && <div className="mt-2 inline-block bg-red-900/30 text-red-400 text-[9px] px-1.5 py-0.5 rounded border border-red-900/50">48v PHANTOM</div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Bottom Bar Controls */}
                <div className="h-16 bg-gray-900 border-t border-gray-800 flex items-center justify-between px-6 shrink-0 z-50">
                    <div className="flex bg-gray-950 p-1 rounded-lg border border-gray-800">
                        <button
                            onClick={() => setViewMode('CANVAS')}
                            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'CANVAS' ? 'bg-gray-800 text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Stage Plot
                        </button>
                        <button
                            onClick={() => setViewMode('RIDER')}
                            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'RIDER' ? 'bg-gray-800 text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Rider View
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                if (isDemoMode) {
                                    alert("Feature Disabled in Demo Account");
                                    return;
                                }
                            }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${isDemoMode
                                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                    : 'bg-gray-800 hover:bg-gray-700'
                                }`}
                        >
                            <Save size={14} /> Save Project
                        </button>
                        <button
                            onClick={() => {
                                if (isDemoMode) {
                                    alert("Feature Disabled in Demo Account");
                                    return;
                                }
                            }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${isDemoMode
                                    ? 'bg-blue-900/20 text-blue-500/50 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                                }`}
                        >
                            <Download size={14} /> Export PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* Properties Panel (Right Side) - ONLY IN CANVAS MODE */}
            {viewMode === 'CANVAS' && (
                <div className="w-80 bg-gray-950 border-l border-gray-800 flex flex-col shrink-0">
                    {selectedAsset ? (
                        <div className="flex flex-col h-full animate-in slide-in-from-right duration-200">
                            <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900">
                                <h3 className="font-bold text-white uppercase tracking-widest text-xs">Edit Item</h3>
                                <button onClick={() => setSelectedId(null)} className="text-gray-500 hover:text-white"><X size={16} /></button>
                            </div>

                            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                                {/* Basic Label */}
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Label</label>
                                    <input
                                        type="text"
                                        value={selectedAsset.label}
                                        onChange={(e) => updateAsset(selectedAsset.id, { label: e.target.value })}
                                        className="w-full bg-gray-900 border border-gray-800 rounded p-2 text-sm text-white focus:border-blue-500 outline-none font-bold"
                                    />
                                </div>

                                {/* Extended Details (TecRider Parity) */}
                                {selectedAsset.type !== 'TEXT' && (
                                    <div className="space-y-3 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                                        <h4 className="text-[10px] font-black uppercase text-blue-500">Technical Details</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="block text-[9px] font-bold text-gray-500 mb-1">Brand</label>
                                                <input
                                                    className="w-full bg-black border border-gray-700 rounded p-1.5 text-xs focus:border-blue-500 outline-none"
                                                    placeholder="Fender"
                                                    value={selectedAsset.brand || ''}
                                                    onChange={(e) => updateAsset(selectedAsset.id, { brand: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[9px] font-bold text-gray-500 mb-1">Model</label>
                                                <input
                                                    className="w-full bg-black border border-gray-700 rounded p-1.5 text-xs focus:border-blue-500 outline-none"
                                                    placeholder="Stratocaster"
                                                    value={selectedAsset.model || ''}
                                                    onChange={(e) => updateAsset(selectedAsset.id, { model: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        {/* Toggles */}
                                        <label className="flex items-center gap-2 cursor-pointer mt-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedAsset.phantom || false}
                                                onChange={(e) => updateAsset(selectedAsset.id, { phantom: e.target.checked })}
                                                className="accent-blue-500"
                                            />
                                            <span className="text-xs text-gray-300 font-medium">Req. 48v Phantom Power</span>
                                        </label>

                                        {/* Description */}
                                        <div>
                                            <label className="block text-[9px] font-bold text-gray-500 mb-1 mt-2">Notes</label>
                                            <textarea
                                                value={selectedAsset.description || ''}
                                                onChange={(e) => updateAsset(selectedAsset.id, { description: e.target.value })}
                                                className="w-full bg-black border border-gray-700 rounded p-2 text-xs text-gray-300 focus:border-blue-500 outline-none h-16 resize-none"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Cable Color Picker */}
                                {selectedAsset.type !== 'TEXT' && (
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-gray-500 mb-2">Cable / Group Color</label>
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => updateAsset(selectedAsset.id, { colorLabel: undefined })}
                                                className={`w-6 h-6 rounded-full border border-gray-600 flex items-center justify-center text-[10px] text-gray-500 hover:text-white ${!selectedAsset.colorLabel ? 'ring-2 ring-white' : ''}`}
                                            >
                                                /
                                            </button>
                                            {COLOR_PALETTE.map(c => (
                                                <button
                                                    key={c}
                                                    onClick={() => updateAsset(selectedAsset.id, { colorLabel: c })}
                                                    className={`w-6 h-6 rounded-full border border-gray-800 transition-all ${selectedAsset.colorLabel === c ? 'ring-2 ring-white scale-110' : 'hover:scale-105'}`}
                                                    style={{ backgroundColor: c }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Rotation */}
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Rotation</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="range" min="0" max="360" step="15"
                                            value={selectedAsset.rotation || 0}
                                            onChange={(e) => updateAsset(selectedAsset.id, { rotation: parseInt(e.target.value) })}
                                            className="flex-1 accent-blue-500"
                                        />
                                        <span className="text-xs font-mono w-8 text-right">{selectedAsset.rotation}°</span>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-800">
                                    <button
                                        onClick={() => deleteAsset(selectedAsset.id)}
                                        className="w-full py-3 bg-red-900/20 text-red-500 border border-red-900/50 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-red-900/40 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Trash2 size={14} /> Remove Item
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Default Input List View (When nothing selected) */
                        <div className="flex flex-col h-full items-center justify-center text-gray-600">
                            <div className="p-8 text-center opacity-50">
                                <Settings2 size={48} className="mx-auto mb-4" />
                                <p className="text-xs font-bold uppercase tracking-widest">Select an item to edit</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StagePlotDesigner;
