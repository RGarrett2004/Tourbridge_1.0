import React, { useState } from 'react';
import { User, Shield, MoreVertical, Plus, Mail } from 'lucide-react';
import { MOCK_ACCOUNTS } from '../../constants';
import { useAuth } from '../../contexts/AuthContext';
import { UserAccount } from '../../types';

interface TeamMembersProps {
    teamId: string;
}

const TeamMembers: React.FC<TeamMembersProps> = ({ teamId }) => {
    const { isDemoMode } = useAuth();
    // Mock members for now
    const [members, setMembers] = useState<any[]>(() => {
        // Safe fallback if MOCK_ACCOUNTS is empty
        const initialMembers: any[] = [];
        if (MOCK_ACCOUNTS.length > 0) {
            initialMembers.push({ ...MOCK_ACCOUNTS[0], role: 'Admin', joinedAt: 'Oct 2024' });
        }
        if (MOCK_ACCOUNTS.length > 1) {
            initialMembers.push({ ...MOCK_ACCOUNTS[1], role: 'Member', joinedAt: 'Nov 2024' });
        }
        // If empty, maybe add a placeholder or keep empty?
        // Let's keep it empty to be safe, or add a dummy if needed.
        return initialMembers;
    });
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');

    const handleInvite = (e: React.FormEvent) => {
        e.preventDefault();
        if (isDemoMode) { alert("Feature Disabled in Demo Account"); return; }
        if (!inviteEmail) return;

        // Mock invite logic
        setIsInviteOpen(false);
        setInviteEmail('');
        // Add a "Pending" member
        setMembers(prev => [...prev, {
            id: `usr-${Date.now()}`,
            name: inviteEmail.split('@')[0],
            email: inviteEmail,
            avatar: `https://ui-avatars.com/api/?name=${inviteEmail}&background=random`,
            role: 'Pending',
            type: 'PERSON',
            joinedAt: 'Invited'
        } as any]);
    };

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">Team Members</h3>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Manage access and roles</p>
                </div>
                <button
                    onClick={() => setIsInviteOpen(true)}
                    className="bg-white text-black px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                    <Plus size={14} /> Invite
                </button>
            </div>

            {isInviteOpen && (
                <div className="p-4 bg-gray-900/50 border-b border-gray-800 animate-in slide-in-from-top-2">
                    <form onSubmit={handleInvite} className="flex gap-2">
                        <div className="flex-1 relative">
                            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="email"
                                value={inviteEmail}
                                onChange={e => setInviteEmail(e.target.value)}
                                placeholder="Enter email address"
                                className="w-full bg-black/40 border border-gray-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                                autoFocus
                            />
                        </div>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold uppercase transition-colors hover:bg-blue-500">
                            Send
                        </button>
                        <button onClick={() => setIsInviteOpen(false)} className="px-3 py-2 text-gray-400 hover:text-white transition-colors">
                            Cancel
                        </button>
                    </form>
                </div>
            )}

            <div className="overflow-y-auto p-4 space-y-2">
                {members.map(member => (
                    <div key={member.id} className="group flex items-center justify-between p-3 rounded-2xl hover:bg-gray-800/50 transition-colors border border-transparent hover:border-gray-800">
                        <div className="flex items-center gap-4">
                            <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover bg-gray-800" />
                            <div>
                                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                    {member.name}
                                    {member.role === 'Admin' && <Shield size={12} className="text-blue-500" />}
                                    {member.role === 'Pending' && <span className="px-1.5 py-0.5 rounded-md bg-yellow-500/10 text-yellow-500 text-[9px] font-black uppercase">Pending</span>}
                                </h4>
                                <p className="text-xs text-gray-500">{member.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-medium text-gray-600 uppercase tracking-wider hidden md:block">
                                {member.joinedAt}
                            </span>
                            <div className="px-3 py-1 rounded-lg bg-gray-900 border border-gray-800 text-[10px] font-bold text-gray-400 uppercase w-20 text-center">
                                {member.role}
                            </div>
                            <button className="p-2 text-gray-600 hover:text-white rounded-lg hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-all">
                                <MoreVertical size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeamMembers;
