import React, { useState, useEffect } from 'react';
import { PayoutRule, UserAccount } from '../../../types';
import { useAuth } from '../../../contexts/AuthContext';
import { Plus, Trash, PieChart, DollarSign, Save, RefreshCw } from 'lucide-react';

interface PayoutManagerProps {
    members: UserAccount[];
    // Mocking persistence for now, in real app would interact with backend
    initialRules?: PayoutRule[];
}

const PayoutManager: React.FC<PayoutManagerProps> = ({ members, initialRules = [] }) => {
    const { isDemoMode } = useAuth();
    const [rules, setRules] = useState<PayoutRule[]>(initialRules);
    const [mockDeposit, setMockDeposit] = useState<number>(0);
    const [calculatedSplits, setCalculatedSplits] = useState<{ name: string, amount: number }[]>([]);

    useEffect(() => {
        if (rules.length === 0 && members.length > 0) {
            // Initialize with some default rules if empty
            // e.g. Equal split for members
            const newRules: PayoutRule[] = members.map(m => ({
                id: Math.random().toString(),
                recipientId: m.id,
                recipientName: m.name,
                type: 'PERCENTAGE',
                value: 0, // Pending setup
                roleLabel: m.role
            }));
            setRules(newRules);
        }
    }, [members]);

    const handleUpdateRule = (id: string, field: keyof PayoutRule, value: any) => {
        setRules(rules.map(r => r.id === id ? { ...r, [field]: value } : r));
    };

    const calculateSplits = () => {
        if (mockDeposit <= 0) return;

        let remaining = mockDeposit;
        const splits: { name: string, amount: number }[] = [];

        // 1. Process Flat Rates First (Expenses/Salaries)
        rules.filter(r => r.type === 'FLAT_RATE').forEach(r => {
            const amount = r.value;
            splits.push({ name: r.recipientName, amount });
            remaining -= amount;
        });

        // 2. Process Percentages of the REMAINING or TOTAL? 
        // USUAL BAND AGREEMENT: active expenses come off top, then percentage of Net.
        // Let's assume Percentage of NET (Remaining).

        // OR Percentage of GROSS? Let's check user request "transfer their %". 
        // Let's go with "Percentage of Gross" for simplicity unless remaining < 0, 
        // but typically bands do "Net after expenses". 
        // Let's stick to a simpler model: Percentage of Total, 
        // warning if total > 100%.

        // Actually, safer model for this MVP:
        // Flat rates come off top.
        // Percentages apply to the *Remaining* Pot (Net Profit).

        const netPot = remaining > 0 ? remaining : 0;

        rules.filter(r => r.type === 'PERCENTAGE').forEach(r => {
            const amount = (r.value / 100) * netPot;
            splits.push({ name: r.recipientName + ' (' + r.value + '%)', amount });
            remaining -= amount;
        });

        // Add Band Vault (Remainder)
        if (remaining > 0) {
            splits.push({ name: 'Band Vault (Retained)', amount: remaining });
        }

        setCalculatedSplits(splits);
    };

    useEffect(() => {
        calculateSplits();
    }, [mockDeposit, rules]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            {/* Left: Rules Engine */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-3xl p-6 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Settings size={20} className="text-blue-500" />
                            Payout Rules
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">Define how gig income is split.</p>
                    </div>
                    <button
                        onClick={() => {
                            if (isDemoMode) {
                                alert("Feature Disabled in Demo Account");
                                return;
                            }
                            alert("Rules Saved!");
                        }}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-colors ${isDemoMode ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white'
                            }`}
                    >
                        <Save size={14} /> Save Rules
                    </button>
                </div>

                <div className="space-y-3 overflow-y-auto flex-1 pr-2">
                    {rules.map(rule => (
                        <div key={rule.id} className="bg-black border border-gray-800 p-4 rounded-xl flex items-center justify-between group hover:border-gray-600 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 font-bold">
                                    {rule.recipientName.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-200">{rule.recipientName}</h4>
                                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest block">{rule.roleLabel}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <select
                                    className="bg-gray-900 text-gray-300 text-xs font-bold p-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
                                    value={rule.type}
                                    onChange={(e) => handleUpdateRule(rule.id, 'type', e.target.value)}
                                >
                                    <option value="PERCENTAGE">% Net Share</option>
                                    <option value="FLAT_RATE">$ Flat Rate</option>
                                </select>
                                <div className="relative">
                                    <input
                                        type="number"
                                        className="w-20 bg-gray-900 text-white text-sm font-bold p-2 pl-6 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
                                        value={rule.value}
                                        onChange={(e) => handleUpdateRule(rule.id, 'value', parseFloat(e.target.value))}
                                    />
                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-bold">
                                        {rule.type === 'TOTAL' ? '$' : rule.type === 'FLAT_RATE' ? '$' : '%'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button className="w-full py-3 border border-dashed border-gray-700 text-gray-500 rounded-xl hover:bg-gray-900 hover:text-white transition-colors flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest">
                        <Plus size={14} /> Add Recipient
                    </button>
                </div>
            </div>

            {/* Right: Simulator / Preview */}
            <div className="bg-gray-900/30 border border-gray-800 rounded-3xl p-6 flex flex-col">
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <PieChart size={20} className="text-emerald-500" />
                        Payout Simulator
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Test your split rules with a hypothetical deposit.</p>
                </div>

                <div className="bg-black border border-gray-800 rounded-2xl p-6 mb-6">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Simulate Deposit Amount</label>
                    <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={24} />
                        <input
                            type="number"
                            className="w-full bg-transparent text-4xl font-black text-white pl-12 focus:outline-none placeholder:text-gray-800"
                            placeholder="0.00"
                            value={mockDeposit || ''}
                            onChange={(e) => setMockDeposit(parseFloat(e.target.value))}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2">
                    {mockDeposit > 0 ? (
                        <>
                            <div className="flex justify-between items-center text-xs font-black text-gray-500 uppercase tracking-widest mb-2 px-2">
                                <span>Recipient</span>
                                <span>Allocation</span>
                            </div>
                            {calculatedSplits.map((split, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 rounded-xl border border-gray-800 bg-gray-900/20">
                                    <span className="font-bold text-gray-300">{split.name}</span>
                                    <span className="font-black text-emerald-400">
                                        ${split.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                            ))}
                            <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center px-2">
                                <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Total Distributed</span>
                                <span className="text-sm font-black text-white">
                                    ${calculatedSplits.reduce((a, b) => a + b.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50">
                            <RefreshCw size={48} className="mb-4" />
                            <p className="text-sm font-bold">Enter an amount to preview splits</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

import { Settings } from 'lucide-react'; // Fix missing import if needed, though Lucide is usually globally available in snippet context depending on how I write it.
// Wait, I imported Settings in the top block but missed it in the usage block? No, I imported it.

export default PayoutManager;
