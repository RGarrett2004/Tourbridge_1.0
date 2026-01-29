
import React, { useState } from 'react';
import { X, Users, ArrowRight, Building2, Loader2 } from 'lucide-react';

interface CreateTeamModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (name: string) => Promise<void>;
}

const CreateTeamModal: React.FC<CreateTeamModalProps> = ({ isOpen, onClose, onCreate }) => {
    const [teamName, setTeamName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!teamName.trim()) return;

        setIsLoading(true);
        await onCreate(teamName);
        setIsLoading(false);
        setTeamName('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="mb-8 text-center">
                    <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                        <Building2 className="text-blue-500 w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Create New Team</h2>
                    <p className="text-gray-500 text-xs font-medium">Establish a new organization workspace</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Team Name</label>
                        <input
                            type="text"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            placeholder="e.g. Red Rocks Production Crew"
                            className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder:text-gray-700 focus:outline-none focus:border-blue-500/50 transition-colors"
                            autoFocus
                        />
                    </div>

                    <div className="bg-blue-900/10 border border-blue-500/10 rounded-xl p-4 flex gap-3">
                        <Users className="text-blue-500 shrink-0" size={20} />
                        <div>
                            <p className="text-xs font-bold text-blue-400 mb-1">Team Workspace</p>
                            <p className="text-[10px] text-gray-400 leading-relaxed">
                                You will be the admin of this new organization. You can invite members, assign roles, and manage tours together.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!teamName.trim() || isLoading}
                            className="flex-[2] py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={16} /> : (
                                <>
                                    Create Team
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTeamModal;
