
import React, { useState } from 'react';
import { X, Upload, Link, FileText, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { TourDay } from '../types';

interface ImportTourModalProps {
    onClose: () => void;
    onImport: (tourName: string, days: Partial<TourDay>[]) => void;
}

const ImportTourModal: React.FC<ImportTourModalProps> = ({ onClose, onImport }) => {
    const [activeTab, setActiveTab] = useState<'TEXT' | 'IMAGE' | 'URL'>('TEXT');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Inputs
    const [textInput, setTextInput] = useState('');
    const [urlInput, setUrlInput] = useState('');
    // For image, we'll just do a mock file input for now or standard input

    const handleImport = async () => {
        setIsLoading(true);
        setError(null);

        try {
            let result;
            if (activeTab === 'URL') {
                if (!urlInput) throw new Error("Please enter a URL");
                result = await geminiService.smartImportTour(urlInput);
            } else if (activeTab === 'TEXT') {
                if (!textInput) throw new Error("Please enter tour data");
                result = await geminiService.smartImportFromText(textInput);
            } else {
                // Image not implemented yet on backend fully without file handling
                throw new Error("Image import coming soon");
            }

            if (result && result.days && result.days.length > 0) {
                onImport(result.name || 'Imported Tour', result.days);
                onClose();
            } else {
                throw new Error("No dates found in the provided data.");
            }
        } catch (err: any) {
            setError(err.message || "Failed to import");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[3000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-full max-w-2xl bg-gray-950 border border-gray-800 rounded-[2rem] overflow-hidden flex flex-col shadow-2xl relative">
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors z-10">
                    <X size={24} />
                </button>

                <div className="p-8 pb-0">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Import Schedule</h2>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">AI-Powered Extraction Engine</p>
                </div>

                <div className="p-8 flex gap-4">
                    {/* Tabs */}
                    <button
                        onClick={() => setActiveTab('TEXT')}
                        className={`flex-1 py-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${activeTab === 'TEXT' ? 'bg-white text-black border-white' : 'bg-gray-900 text-gray-500 border-gray-800 hover:bg-gray-800 hover:text-white'}`}
                    >
                        <FileText size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Text / CSV</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('URL')}
                        className={`flex-1 py-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${activeTab === 'URL' ? 'bg-white text-black border-white' : 'bg-gray-900 text-gray-500 border-gray-800 hover:bg-gray-800 hover:text-white'}`}
                    >
                        <Link size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Website URL</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('IMAGE')}
                        className={`flex-1 py-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${activeTab === 'IMAGE' ? 'bg-white text-black border-white' : 'bg-gray-900 text-gray-500 border-gray-800 hover:bg-gray-800 hover:text-white'}`}
                    >
                        <Upload size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Screenshot</span>
                    </button>
                </div>

                <div className="flex-1 p-8 pt-0 min-h-[300px]">
                    {activeTab === 'TEXT' && (
                        <div className="h-full flex flex-col gap-4">
                            <textarea
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                className="flex-1 bg-black border border-gray-800 rounded-2xl p-4 text-xs font-mono text-gray-300 outline-none focus:border-blue-500 transition-all resize-none"
                                placeholder="Paste your schedule here (Excel rows, email text, etc.)..."
                            />
                            <p className="text-[10px] text-gray-600 font-medium">Examples: "Mar 5 - Richmond - The National" or CSV data.</p>
                        </div>
                    )}

                    {activeTab === 'URL' && (
                        <div className="h-full flex flex-col gap-6 justify-center">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Target URL</label>
                                <input
                                    value={urlInput}
                                    onChange={(e) => { setUrlInput(e.target.value); setError(null); }}
                                    type="url"
                                    placeholder="e.g. daleandthezdubs.com/tour"
                                    className="w-full bg-black border border-gray-800 rounded-xl p-4 text-white outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex gap-3 items-start">
                                <AlertCircle size={16} className="text-blue-500 shrink-0 mt-0.5" />
                                <p className="text-[10px] text-blue-400 leading-relaxed">
                                    Our AI agent will visit this page, scan for date/venue patterns, and attempt to resolve location data automatically.
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'IMAGE' && (
                        <div className="h-full border-2 border-dashed border-gray-800 rounded-2xl flex flex-col items-center justify-center gap-4 text-gray-600 hover:border-gray-600 hover:bg-gray-900/50 transition-all cursor-pointer">
                            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center">
                                <Upload size={24} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest">Drop tour poster or screenshot</p>
                        </div>
                    )}
                </div>

                <div className="p-8 border-t border-gray-900 bg-gray-950 flex justify-between items-center">
                    {error ? (
                        <div className="text-red-500 text-xs font-bold flex items-center gap-2">
                            <AlertCircle size={14} /> {error}
                        </div>
                    ) : (
                        <div />
                    )}

                    <button
                        onClick={handleImport}
                        disabled={isLoading || (activeTab === 'IMAGE')}
                        className="px-8 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50 disabled:pointer-events-none flex items-center gap-3"
                    >
                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                        {isLoading ? 'Processing...' : 'Process Import'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImportTourModal;
