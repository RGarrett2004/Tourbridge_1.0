
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Music, Check, ArrowRight, Loader2, Globe } from 'lucide-react';

const LoginScreen: React.FC = () => {
    const { login, loginWithGoogle, loginAsDemo, register, isLoading } = useAuth();
    const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            if (mode === 'LOGIN') {
                await login(email, password);
            } else {
                await register(name, email, password);
            }
        } catch (err) {
            setError('Authentication failed. Please check credentials.');
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] left-[-20%] w-[800px] h-[800px] bg-blue-900/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-20%] w-[800px] h-[800px] bg-purple-900/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="w-full max-w-md z-10">
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-white rounded-2xl mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)] mb-6">
                        <Music className="text-black w-8 h-8" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter mb-2">TOURBRIDGE</h1>
                    <p className="text-gray-500 uppercase tracking-[0.3em] text-xs font-bold">The Backstage Network</p>
                </div>

                <div className="bg-gray-950/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl">
                    <div className="flex gap-4 mb-8">
                        <button
                            onClick={() => setMode('LOGIN')}
                            className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'LOGIN' ? 'bg-white text-black' : 'text-gray-500 hover:bg-gray-900'}`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => setMode('REGISTER')}
                            className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'REGISTER' ? 'bg-white text-black' : 'text-gray-500 hover:bg-gray-900'}`}
                        >
                            Create Account
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'REGISTER' && (
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-3">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-gray-900/50 border border-gray-800 focus:border-white/50 rounded-xl px-4 py-3 text-white placeholder:text-gray-700 focus:outline-none transition-colors"
                                    placeholder="e.g. Sarah Smith"
                                    required={mode === 'REGISTER'}
                                />
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-3">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-900/50 border border-gray-800 focus:border-white/50 rounded-xl px-4 py-3 text-white placeholder:text-gray-700 focus:outline-none transition-colors"
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-3">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-900/50 border border-gray-800 focus:border-white/50 rounded-xl px-4 py-3 text-white placeholder:text-gray-700 focus:outline-none transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 group mt-6"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : (
                                <>
                                    {mode === 'LOGIN' ? 'Go backstage' : 'Start Your Career'}
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-px bg-gray-800 flex-1"></div>
                            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Or</span>
                            <div className="h-px bg-gray-800 flex-1"></div>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={loginWithGoogle}
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-3 bg-gray-900 border border-gray-800 text-white py-4 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors"
                            >
                                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                                Continue with Google
                            </button>

                            <button
                                onClick={loginAsDemo}
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-3 bg-white text-black py-4 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                            >
                                <Globe size={18} className="text-blue-600" />
                                Try Demo Account
                            </button>
                        </div>
                    </div>

                    <div className="mt-12 flex justify-center gap-8 opacity-40">
                        <div className="flex items-center gap-2 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
                            <Check size={12} className="text-emerald-500" /> Secure Encryption
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
                            <Check size={12} className="text-emerald-500" /> Cloud Sync
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
