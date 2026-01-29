
import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronUp, ChevronDown, Check, Plus, LogOut,
  User, Mail, Lock, Chrome, ArrowLeft, Building2
} from 'lucide-react';
import { UserAccount } from '../types';

interface AccountSwitcherProps {
  currentUser: UserAccount;
  accounts: UserAccount[];
  organizations: UserAccount[];
  onSwitch: (account: UserAccount) => void;
  onAddAccount: (account: UserAccount) => void;
  onCreateTeam?: () => void;
  onSignOut: () => void;
}

const AccountSwitcher: React.FC<AccountSwitcherProps> = ({
  currentUser,
  accounts,
  organizations,
  onSwitch,
  onAddAccount,
  onCreateTeam,
  onSignOut
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'LIST' | 'LOGIN'>('LIST');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setView('LIST'); // Reset view on close
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) return;

    // Simulate login
    const newAccount: UserAccount = {
      id: `acc-${Date.now()}`,
      name: formData.email.split('@')[0],
      email: formData.email,
      avatar: `https://ui-avatars.com/api/?name=${formData.email}&background=random`,
      role: 'Member',
      type: 'PERSON'
    };

    onAddAccount(newAccount);
    setView('LIST');
    setFormData({ email: '', password: '' });
  };

  const handleGoogleLogin = () => {
    // Simulate Google Login
    const googleAccount: UserAccount = {
      id: `acc-g-${Date.now()}`,
      name: 'Google User',
      email: 'user@gmail.com',
      avatar: 'https://ui-avatars.com/api/?name=Google+User&background=db4437&color=fff',
      role: 'Member',
      isGoogleLinked: true,
      type: 'PERSON'
    };
    onAddAccount(googleAccount);
    setView('LIST');
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {isOpen && (
        <div className="absolute bottom-full left-0 w-full mb-3 bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl p-2 z-50 animate-in slide-in-from-bottom-2 fade-in zoom-in-95 duration-200">

          {view === 'LIST' ? (
            <>
              {/* PERSONAL ACCOUNTS */}
              <div className="px-3 py-2">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">My Accounts</p>
              </div>
              <div className="space-y-1 max-h-32 overflow-y-auto custom-scrollbar">
                {accounts.map(acc => (
                  <button
                    key={acc.id}
                    onClick={() => {
                      onSwitch(acc);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl transition-all ${currentUser.id === acc.id ? 'bg-gray-900 border border-gray-800' : 'hover:bg-gray-900 border border-transparent'}`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={acc.avatar} className="w-8 h-8 rounded-full object-cover" alt="" />
                      <div className="text-left overflow-hidden">
                        <p className={`text-xs font-black truncate ${currentUser.id === acc.id ? 'text-white' : 'text-gray-400'}`}>{acc.name}</p>
                        <p className="text-[9px] text-gray-600 truncate font-medium">{acc.email}</p>
                      </div>
                    </div>
                    {currentUser.id === acc.id && <Check size={14} className="text-emerald-500" />}
                  </button>
                ))}
              </div>

              {/* ORGANIZATIONS */}
              {organizations.length > 0 && (
                <>
                  <div className="relative py-4 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-dashed border-gray-800"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-gray-950 px-3 text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Building2 size={10} /> Organizations
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    {organizations.map(org => (
                      <button
                        key={org.id}
                        onClick={() => {
                          onSwitch(org);
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl transition-all group ${currentUser.id === org.id ? 'bg-blue-900/20 border border-blue-500/30' : 'hover:bg-gray-900 border border-transparent'}`}
                      >
                        <div className="flex items-center gap-3">
                          <img src={org.avatar} className="w-8 h-8 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                          <div className="text-left overflow-hidden">
                            <p className={`text-xs font-black truncate ${currentUser.id === org.id ? 'text-blue-400' : 'text-gray-300'}`}>{org.name}</p>
                            <p className="text-[9px] text-gray-600 truncate font-medium">Organization Workspace</p>
                          </div>
                        </div>
                        {currentUser.id === org.id && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <div className="h-px bg-gray-900 my-2" />

              <button
                onClick={() => setView('LOGIN')}
                className="w-full flex items-center gap-3 p-2 rounded-xl text-gray-400 hover:bg-gray-900 hover:text-white transition-all text-xs font-bold"
              >
                <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center border border-gray-800">
                  <Plus size={14} />
                </div>
                Add another account
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  onCreateTeam?.();
                }}
                className="w-full flex items-center gap-3 p-2 rounded-xl text-gray-400 hover:bg-gray-900 hover:text-white transition-all text-xs font-bold mt-1"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600/10 flex items-center justify-center border border-blue-500/20 text-blue-500">
                  <Building2 size={14} />
                </div>
                Create new team
              </button>

              <button
                onClick={() => {
                  onSignOut();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-xs font-bold mt-1"
              >
                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                  <LogOut size={14} />
                </div>
                Sign out of all
              </button>
            </>
          ) : (
            <div className="p-2">
              <button
                onClick={() => setView('LIST')}
                className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white mb-4"
              >
                <ArrowLeft size={12} /> Back
              </button>

              <form onSubmit={handleLogin} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-500 uppercase ml-1">Email</label>
                  <div className="flex items-center gap-2 bg-gray-900 rounded-xl px-3 py-2 border border-gray-800 focus-within:border-blue-500/50 transition-colors">
                    <Mail size={14} className="text-gray-500" />
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      className="bg-transparent border-none text-xs text-white placeholder:text-gray-600 w-full focus:outline-none"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-500 uppercase ml-1">Password</label>
                  <div className="flex items-center gap-2 bg-gray-900 rounded-xl px-3 py-2 border border-gray-800 focus-within:border-blue-500/50 transition-colors">
                    <Lock size={14} className="text-gray-500" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      className="bg-transparent border-none text-xs text-white placeholder:text-gray-600 w-full focus:outline-none"
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </div>

                <button type="submit" className="w-full bg-white text-black py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-colors">
                  Log In
                </button>
              </form>

              <div className="flex items-center gap-2 my-4 opacity-50">
                <div className="h-px bg-gray-800 flex-1" />
                <span className="text-[8px] font-black uppercase text-gray-600">OR</span>
                <div className="h-px bg-gray-800 flex-1" />
              </div>

              <button
                onClick={handleGoogleLogin}
                className="w-full bg-gray-900 text-white border border-gray-800 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center p-0.5">
                  <svg viewBox="0 0 24 24" className="w-full h-full">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                </div>
                Sign in with Google
              </button>
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all border ${isOpen ? 'bg-gray-900 border-gray-800' : 'bg-transparent border-transparent hover:bg-gray-900 hover:border-gray-800'}`}
      >
        <img src={currentUser.avatar} alt="Current" className={`w-9 h-9 ${currentUser.type === 'ORGANIZATION' ? 'rounded-lg' : 'rounded-full'} object-cover border-2 border-gray-800`} />
        <div className="flex-1 text-left overflow-hidden hidden md:block">
          <p className="text-xs font-black text-white truncate">{currentUser.name}</p>
          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest truncate">
            {currentUser.type === 'ORGANIZATION' ? 'Organization' : currentUser.role}
          </p>
        </div>
        <div className="hidden md:block text-gray-500">
          {isOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </div>
      </button>
    </div>
  );
};

export default AccountSwitcher;
