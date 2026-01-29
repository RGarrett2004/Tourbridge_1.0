
import React, { useState, useEffect } from 'react';
import {
  User, Music, MapPin, Link as LinkIcon, Plus, Save, ChevronRight, Zap,
  Instagram, Youtube, Video, Globe, Share2, Users, ArrowLeftRight, Settings,
  ShieldCheck, ShieldAlert, Star, Trophy, Layout, ToggleRight, ToggleLeft,
  Building2, Briefcase, Edit2, X, Check, Lock, Unlock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { MOCK_BANDS, MOCK_ACCOUNTS } from '../constants';
import { PermissionTag, UserAccount, BandProfile } from '../types';

interface ProfileSectionProps {
  currentUser: UserAccount;
  profileData: any;
  onUpdateProfile: (updates: any) => void;
  unlockedWorkspaces?: string[];
  onUnlock?: (role: string) => void;
  bands?: BandProfile[];
  onUpdateBands?: (bands: BandProfile[]) => void;
}

const TagBadge: React.FC<{ tag: PermissionTag }> = ({ tag }) => (
  <div className={`flex items-center rounded-[4px] overflow-hidden shadow-lg border border-white/10 group h-6`}>
    <div className={`${tag.color} px-2 h-full flex items-center`}>
      <span className="text-[10px] font-black text-white uppercase tracking-widest">{tag.label}</span>
    </div>
    {tag.affiliation && (
      <div className="bg-gray-800 px-2 h-full flex items-center border-l border-white/5">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">@{tag.affiliation}</span>
      </div>
    )}
  </div>
);

const ProfileSection: React.FC<ProfileSectionProps> = ({
  currentUser,
  profileData,
  onUpdateProfile,
  unlockedWorkspaces = [],
  onUnlock,
  bands = [],
  onUpdateBands
}) => {
  const { isDemoMode } = useAuth();
  const isPerson = profileData.type !== 'ORGANIZATION';
  const [isEditing, setIsEditing] = useState(false);
  const [activeMemberId, setActiveMemberId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    subtitle: '', // Used for Role (Person) or Genre (Org)
    location: '',
    bio: ''
  });

  // Sync internal form state when profile data changes or mode switches
  useEffect(() => {
    setFormData({
      name: profileData.name || '',
      subtitle: isPerson ? profileData.role : profileData.genre || 'Music Group',
      location: profileData.location || '',
      bio: profileData.bio || ''
    });
  }, [profileData, isPerson]);

  const handleSave = () => {
    if (isDemoMode) {
      alert("Feature Disabled in Demo Account");
      return;
    }
    onUpdateProfile({
      name: formData.name,
      // Map subtitle back to correct field
      [isPerson ? 'role' : 'genre']: formData.subtitle,
      location: formData.location,
      bio: formData.bio
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      name: profileData.name || '',
      subtitle: isPerson ? profileData.role : profileData.genre || 'Music Group',
      location: profileData.location || '',
      bio: profileData.bio || ''
    });
    setIsEditing(false);
  };

  const toggleMemberPermission = (userId: string, permission: string) => {
    if (!onUpdateBands || !bands) return;

    // Find the band we are currently editing (which is the current profile if we are in Org view)
    const bandIndex = bands.findIndex(b => b.id === profileData.id);
    if (bandIndex === -1) return;

    const updatedBands = [...bands];
    const band = { ...updatedBands[bandIndex] };

    const memberIndex = band.members.findIndex(m => m.userId === userId);
    if (memberIndex === -1) return;

    const member = { ...band.members[memberIndex] };
    const perms = member.permissions || [];

    if (perms.includes(permission)) {
      member.permissions = perms.filter(p => p !== permission);
    } else {
      member.permissions = [...perms, permission];
    }

    band.members[memberIndex] = member;
    updatedBands[bandIndex] = band;
    onUpdateBands(updatedBands);
  };

  const displayData = {
    title: formData.name,
    subtitle: isPerson ? `Person • ${formData.subtitle}` : `Organization • ${formData.subtitle}`,
    avatar: profileData.avatar,
    location: formData.location || (isPerson ? 'Unknown Location' : 'Global'),
    bgGradient: isPerson ? 'bg-gradient-to-r from-blue-900 to-indigo-900' : 'bg-gradient-to-r from-amber-900 to-orange-900',
    icon: isPerson ? User : Building2,
    members: isPerson ? [] : (bands.find(b => b.id === profileData.id)?.members || []),
    tags: profileData.tags || [],
    bands: profileData.bands || [],
    socials: profileData.socials || { instagram: '@user', tiktok: '@user', youtube: 'UserTV' }
  };

  return (
    <div className="flex flex-col h-full bg-gray-950 overflow-y-auto custom-scrollbar">
      {/* Dynamic Header */}
      <div className={`h-64 relative transition-colors duration-500 shrink-0 ${displayData.bgGradient}`}>
        <div className="absolute top-6 left-8 flex gap-2">
          <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${isPerson ? 'bg-blue-500 text-white' : 'bg-white/10 text-white border border-white/20'}`}>
            <User size={12} /> Personal Profile
          </div>
          {!isPerson && (
            <div className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-orange-500 text-black flex items-center gap-2">
              <Building2 size={12} /> Organization Page
            </div>
          )}
        </div>

        <div className="absolute -bottom-16 left-12 flex items-end gap-8">
          <div className="relative group">
            <img src={displayData.avatar} alt="Avatar" className={`w-40 h-40 rounded-[2.5rem] border-8 border-gray-950 object-cover shadow-2xl ${!isPerson ? 'rounded-full' : ''}`} />
            <div className={`absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity ${!isPerson ? 'rounded-full' : 'rounded-[2.5rem]'}`}>
              <Settings className="text-white" size={24} />
            </div>
          </div>
          <div className="mb-6 flex-1">
            {isEditing ? (
              <div className="space-y-2 mb-2 max-w-md bg-black/40 p-4 rounded-2xl backdrop-blur-md border border-white/20">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-transparent border-b border-white/30 text-3xl font-black text-white uppercase tracking-tighter outline-none focus:border-white mb-2"
                  placeholder="Display Name"
                />
                <div className="flex items-center gap-2">
                  <displayData.icon size={14} className="text-white/50" />
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="bg-transparent border-b border-white/30 text-sm font-bold text-white/80 uppercase tracking-widest outline-none focus:border-white flex-1"
                    placeholder={isPerson ? "Role (e.g. Drummer)" : "Genre (e.g. Rock)"}
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-5xl font-black text-white leading-tight tracking-tighter uppercase">
                    {displayData.title}
                  </h2>
                  {isPerson && displayData.tags?.some((t: any) => t.type === 'ADMIN') && (
                    <ShieldCheck className="text-blue-400" size={24} />
                  )}
                  {!isPerson && (
                    <div className="bg-orange-500 text-black p-1 rounded-full"><Music size={16} /></div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {isPerson && displayData.tags ? displayData.tags.map((tag: any) => (
                    <TagBadge key={tag.id} tag={tag} />
                  )) : !isPerson && (
                    <div className="bg-orange-500/20 border border-orange-500/50 text-orange-500 px-3 py-1 rounded font-black text-[10px] uppercase tracking-widest shadow-xl">Verified Music Organization</div>
                  )}
                </div>
                <p className={`${isPerson ? 'text-blue-400' : 'text-orange-400'} font-black uppercase tracking-widest text-sm flex items-center gap-2`}>
                  <displayData.icon size={14} /> {displayData.subtitle}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Edit Controls */}
        <div className="absolute top-6 right-8">
          {isEditing ? (
            <div className="flex gap-2">
              <button onClick={handleCancel} className="px-4 py-2 bg-gray-900/80 backdrop-blur text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all border border-white/10 flex items-center gap-2">
                <X size={14} /> Cancel
              </button>
              <button onClick={handleSave} className="px-6 py-2 bg-emerald-500 text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg flex items-center gap-2">
                <Check size={14} /> Save Profile
              </button>
            </div>
          ) : (
            <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-white/10 backdrop-blur text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10 flex items-center gap-2">
              <Edit2 size={14} /> Edit Page
            </button>
          )}
        </div>
      </div>

      <div className="mt-24 px-12 pb-24 grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-16">
          {/* Main Dossier Section */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                {isPerson ? <User size={24} className="text-gray-600" /> : <Building2 size={24} className="text-gray-600" />}
                {isPerson ? 'Personal Identity' : 'Organization Overview'}
              </h3>
            </div>

            <div className={`space-y-8 bg-gray-900/40 p-10 rounded-[3rem] border shadow-2xl transition-colors ${isEditing ? 'border-blue-500/50 bg-blue-900/5' : 'border-gray-800'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="opacity-50 pointer-events-none">
                  <label className="text-[10px] font-black text-gray-600 uppercase mb-3 block tracking-widest ml-1">Display Name (Header)</label>
                  <input
                    type="text"
                    value={formData.name}
                    className="w-full bg-gray-950 border border-gray-800 rounded-2xl p-4 text-sm text-white focus:border-white/20 outline-none transition-all"
                    readOnly
                  />
                </div>
                <div>
                  <label className={`text-[10px] font-black uppercase mb-3 block tracking-widest ml-1 ${isEditing ? 'text-blue-400' : 'text-gray-600'}`}>{isPerson ? 'Home City' : 'HQ Location'}</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className={`w-full rounded-2xl p-4 text-sm text-white outline-none transition-all ${isEditing ? 'bg-black border border-blue-500/50 focus:border-blue-500' : 'bg-gray-950 border border-gray-800'}`}
                    readOnly={!isEditing}
                  />
                </div>
              </div>
              <div>
                <label className={`text-[10px] font-black uppercase mb-3 block tracking-widest ml-1 ${isEditing ? 'text-blue-400' : 'text-gray-600'}`}>About</label>
                <textarea
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className={`w-full rounded-2xl p-4 text-sm text-white outline-none resize-none transition-all ${isEditing ? 'bg-black border border-blue-500/50 focus:border-blue-500' : 'bg-gray-950 border border-gray-800'}`}
                  readOnly={!isEditing}
                />
              </div>
            </div>
          </section>

          {/* Members / Affiliations */}
          <section className="animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                <Users size={24} className={isPerson ? "text-blue-500" : "text-orange-500"} />
                {isPerson ? 'Affiliated Organizations' : 'Organization Members & Permissions'}
              </h3>
              {!isPerson && (
                <button className="text-[10px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-2 hover:underline">
                  <Plus size={14} /> Add Team Member
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isPerson ? (
                // Show Bands/Orgs linked to Person
                displayData.bands?.map((bandId: string) => {
                  const band = MOCK_BANDS.find(b => b.id === bandId);
                  if (!band) return null;
                  return (
                    <div key={band.id} className="bg-gray-900/40 border border-gray-800 p-6 rounded-[2rem] flex items-center justify-between group hover:border-blue-500/30 transition-all cursor-pointer shadow-xl">
                      <div className="flex items-center gap-4">
                        <img src={band.avatar} className="w-14 h-14 rounded-2xl object-cover border-2 border-gray-950" alt="" />
                        <div>
                          <p className="text-sm font-black text-white uppercase tracking-tight">{band.name}</p>
                          <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Member</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-gray-800 group-hover:text-white transition-colors" />
                    </div>
                  );
                })
              ) : (
                // Show Members of Organization with Permission Controls
                displayData.members?.map((member: any) => {
                  // Match member ID to MOCK_ACCOUNTS to get details (Avatar/Name)
                  const acc = MOCK_ACCOUNTS.find(a => a.id === member.userId);
                  const isActive = activeMemberId === member.userId;
                  const perms = member.permissions || [];

                  return (
                    <div
                      key={member.userId}
                      className={`bg-gray-900/40 border p-6 rounded-[2rem] transition-all shadow-xl ${isActive ? 'border-orange-500/50 bg-gray-900' : 'border-gray-800 hover:border-orange-500/30'}`}
                    >
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => setActiveMemberId(isActive ? null : member.userId)}
                      >
                        <div className="flex items-center gap-4">
                          <img src={acc?.avatar} className="w-14 h-14 rounded-full object-cover border-2 border-gray-950" alt="" />
                          <div>
                            <p className="text-sm font-black text-white uppercase tracking-tight">{acc?.name || 'Unknown'}</p>
                            <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">{member.role}</p>
                          </div>
                        </div>
                        {isActive ? <ChevronRight className="rotate-90 text-orange-500" /> : <Settings size={16} className="text-gray-600" />}
                      </div>

                      {isActive && (
                        <div className="mt-6 pt-6 border-t border-gray-800 space-y-4 animate-in slide-in-from-top-2">
                          <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Workspace Access</p>
                          <div className="space-y-2">
                            {[
                              { id: 'TOUR_OPS', label: 'Tour Operations' },
                              { id: 'MEDIA', label: 'Media Lab' },
                              { id: 'MERCH', label: 'Merch Master' }
                            ].map(ws => {
                              const hasAccess = perms.includes(ws.id);
                              return (
                                <div key={ws.id} className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-gray-800">
                                  <span className={`text-xs font-bold uppercase ${hasAccess ? 'text-white' : 'text-gray-600'}`}>{ws.label}</span>
                                  <button
                                    onClick={() => toggleMemberPermission(member.userId, ws.id)}
                                    className={`p-2 rounded-lg transition-all ${hasAccess ? 'bg-emerald-500 text-black' : 'bg-gray-800 text-gray-500'}`}
                                  >
                                    {hasAccess ? <Unlock size={14} /> : <Lock size={14} />}
                                  </button>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* Digital Grid */}
          <section>
            <h3 className="text-2xl font-black text-white mb-8 uppercase tracking-tighter flex items-center gap-3">
              <Share2 size={24} className="text-gray-600" /> Digital Grid
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3 group">
                <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest block ml-1">Instagram</label>
                <div className="flex items-stretch gap-3">
                  <div className="flex items-center justify-center w-14 rounded-2xl bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 shadow-xl shadow-pink-500/10 group-hover:scale-105 transition-transform">
                    <Instagram className="text-white w-6 h-6" />
                  </div>
                  <input type="text" value={displayData.socials.instagram} className="flex-1 bg-gray-900 border border-gray-800 rounded-2xl p-4 text-xs text-white outline-none" readOnly />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-12">
          {/* Workspace Activation Panel */}
          {isPerson ? (
            <div className="bg-gray-900 rounded-[3rem] p-10 border border-gray-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Layout size={100} className="text-blue-500" />
              </div>
              <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-10">Personal Workspaces</h4>

              <div className="space-y-6">
                {[
                  { id: 'TOUR_OPS', label: 'Tour Operations', sub: 'Artist & Mgmt', color: 'emerald' },
                  { id: 'MEDIA', label: 'Media Lab', sub: 'Creator Tools', color: 'purple' },
                  { id: 'MERCH', label: 'Merch Master', sub: 'Retail Logistics', color: 'orange' }
                ].map(ws => {
                  const isActive = unlockedWorkspaces.includes(ws.id);
                  return (
                    <div key={ws.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isActive ? `bg-${ws.color}-900/10 border-${ws.color}-500/30` : 'bg-black/20 border-gray-800'}`}>
                      <div>
                        <p className={`text-xs font-black uppercase tracking-tight ${isActive ? `text-${ws.color}-400` : 'text-gray-400'}`}>{ws.label}</p>
                        <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">{ws.sub}</p>
                      </div>
                      <button
                        onClick={() => onUnlock?.(ws.id)}
                        className={`p-2 rounded-xl transition-all ${isActive ? `bg-${ws.color}-500 text-black` : 'bg-gray-800 text-gray-500 hover:text-white'}`}
                      >
                        {isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-gray-900 rounded-[3rem] p-10 border border-gray-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Building2 size={100} className="text-orange-500" />
              </div>
              <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-10">Organization Status</h4>
              <div className="space-y-6">
                <div className="bg-black/40 p-4 rounded-2xl border border-gray-800">
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Active Plan</p>
                  <p className="text-lg font-black text-white uppercase">Pro Touring</p>
                </div>
                <div className="bg-black/40 p-4 rounded-2xl border border-gray-800">
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Billing Admin</p>
                  <p className="text-lg font-black text-white uppercase">{displayData.title}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gradient-to-br from-gray-900 to-black rounded-[3rem] p-10 border border-gray-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5">
              <Settings size={80} className="text-white" />
            </div>
            <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-8">{isPerson ? 'User Settings' : 'Organization Settings'}</h4>
            <ul className="space-y-6">
              {['Security Clearing', 'API Access', 'Syncing Options', 'Delete Data'].map(opt => (
                <li key={opt} className="flex items-center justify-between group cursor-pointer">
                  <span className="text-xs font-black text-gray-500 group-hover:text-white uppercase transition-colors">{opt}</span>
                  <ChevronRight size={14} className="text-gray-800 group-hover:text-white transition-colors" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
