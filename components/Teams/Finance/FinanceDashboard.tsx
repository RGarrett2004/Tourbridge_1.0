import React, { useState } from 'react';
import { UserAccount, Transaction, BankConnection } from '../../../types';
import PayoutManager from './PayoutManager';
import { Landmark, ArrowUpRight, ArrowDownRight, History, Wallet, CreditCard } from 'lucide-react';

interface FinanceDashboardProps {
    team: UserAccount;
}

const FinanceDashboard: React.FC<FinanceDashboardProps> = ({ team }) => {
    const [view, setView] = useState<'OVERVIEW' | 'PAYOUTS'>('OVERVIEW');
    const [balance, setBalance] = useState<number>(12450.00);
    const [transactions, setTransactions] = useState<Transaction[]>([
        { id: '1', date: '2026-03-20T10:00:00', description: 'The Norva - Guarantee', amount: 3500.00, type: 'INCOME', category: 'Gig Deposit', from: 'The Norva', to: 'Band Vault', status: 'COMPLETED' },
        { id: '2', date: '2026-03-19T14:30:00', description: 'Guitar Center - Cables', amount: 142.50, type: 'EXPENSE', category: 'Equipment', from: 'Band Vault', to: 'Guitar Center', status: 'COMPLETED' },
    ]);
    const [bank, setBank] = useState<BankConnection>({
        id: 'bank_123', provider: 'STRIPE', bankName: 'Chase Business Checking', last4: '4421', balance: 12450.00, status: 'CONNECTED'
    });

    return (
        <div className="h-full flex flex-col">
            {/* Finance Header */}
            <div className="flex items-center justify-between mb-8 shrink-0">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                        <Landmark className="text-amber-500" />
                        Financial OS
                    </h2>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">
                        Vault & Distribution
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setView('OVERVIEW')}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'OVERVIEW' ? 'bg-amber-500 text-black' : 'bg-gray-900 text-gray-500 hover:text-white'}`}
                    >
                        Vault Overview
                    </button>
                    <button
                        onClick={() => setView('PAYOUTS')}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'PAYOUTS' ? 'bg-emerald-500 text-black' : 'bg-gray-900 text-gray-500 hover:text-white'}`}
                    >
                        Payout Center
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden">
                {view === 'OVERVIEW' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full overflow-y-auto pb-8">
                        {/* Column 1: Balance & Bank */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Vault Card */}
                            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-8 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-32 bg-amber-500/10 blur-3xl rounded-full pointer-events-none group-hover:bg-amber-500/20 transition-all" />

                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-2 text-amber-500">
                                        <Wallet size={20} />
                                        <span className="text-xs font-black uppercase tracking-widest">Vault Balance</span>
                                    </div>
                                    <h1 className="text-5xl font-black text-white tracking-tighter mb-6">
                                        ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </h1>

                                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 flex items-center gap-4">
                                        <div className="p-3 bg-white rounded-lg text-black">
                                            <BuildingIconWrapper />
                                            {/* Simulating Chase Logo */}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-white">{bank.bankName}</p>
                                            <p className="text-xs text-gray-500 font-mono">•••• {bank.last4}</p>
                                        </div>
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="grid grid-cols-2 gap-4">
                                <button className="p-4 bg-gray-900 border border-gray-800 rounded-2xl hover:border-gray-600 transition-colors flex flex-col items-center justify-center gap-2 group">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <ArrowDownRight size={20} />
                                    </div>
                                    <span className="text-xs font-black text-gray-300 uppercase tracking-widest">Deposit</span>
                                </button>
                                <button className="p-4 bg-gray-900 border border-gray-800 rounded-2xl hover:border-gray-600 transition-colors flex flex-col items-center justify-center gap-2 group">
                                    <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <ArrowUpRight size={20} />
                                    </div>
                                    <span className="text-xs font-black text-gray-300 uppercase tracking-widest">Send ($)</span>
                                </button>
                            </div>
                        </div>

                        {/* Column 2 & 3: Transactions */}
                        <div className="lg:col-span-2 bg-gray-900/30 border border-gray-800 rounded-3xl p-6 flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <History size={20} className="text-gray-500" />
                                    Transaction History
                                </h3>
                                <button className="text-xs font-bold text-blue-500 hover:text-blue-400">Export CSV</button>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-2">
                                {transactions.map(tx => (
                                    <div key={tx.id} className="flex items-center justify-between p-4 bg-black border border-gray-800 rounded-xl hover:bg-gray-900 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-xl ${tx.type === 'INCOME' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-800 text-gray-400'}`}>
                                                {tx.type === 'INCOME' ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white">{tx.description}</h4>
                                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{tx.category} • {new Date(tx.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <span className={`text-lg font-black tracking-tight ${tx.type === 'INCOME' ? 'text-emerald-500' : 'text-white'}`}>
                                            {tx.type === 'INCOME' ? '+' : '-'}${tx.amount.toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <PayoutManager
                        members={[team, { id: 'm2', name: 'Example Person 2', role: 'Guitarist', email: '', avatar: '' } as any]}
                    />
                )}
            </div>
        </div>
    );
};

const BuildingIconWrapper = () => (
    <Landmark size={20} />
);

export default FinanceDashboard;
