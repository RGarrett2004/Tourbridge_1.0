
import React, { useState } from 'react';
import { ArrowRight, Check, Star, Users, DollarSign, Music } from 'lucide-react';

export type CareerLevel = 'STARTER' | 'WORKING' | 'TOURING';

interface LevelAssessmentProps {
    onComplete: (level: CareerLevel) => void;
}

const LevelAssessment: React.FC<LevelAssessmentProps> = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [answers, setAnswers] = useState({
        experience: '',
        team: '',
        revenue: ''
    });

    const handleSelect = (category: string, value: string) => {
        setAnswers(prev => ({ ...prev, [category]: value }));
    };

    const handleNext = () => {
        if (step < 3) {
            setStep(prev => prev + 1);
        } else {
            calculateLevel();
        }
    };

    const calculateLevel = () => {
        // Simple logic for MVP
        let score = 0;
        if (answers.experience === 'veteran') score += 2;
        if (answers.experience === 'working') score += 1;

        if (answers.team === 'crew') score += 2;
        if (answers.team === 'manager') score += 1;

        if (answers.revenue === 'high') score += 2;
        if (answers.revenue === 'medium') score += 1;

        let finalLevel: CareerLevel = 'STARTER';
        if (score >= 4) finalLevel = 'TOURING';
        else if (score >= 2) finalLevel = 'WORKING';

        onComplete(finalLevel);
    };

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-6 text-white animate-in fade-in duration-500">
            <div className="max-w-md w-full">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Let's set your path</h1>
                    <p className="text-gray-500 font-medium">To give you the right tools, we need to know where you're starting.</p>
                </div>

                {/* Progress */}
                <div className="flex gap-2 mb-8 justify-center">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`h-1 w-12 rounded-full transition-colors ${i <= step ? 'bg-blue-600' : 'bg-gray-800'}`} />
                    ))}
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">

                    {/* STEP 1: EXPERIENCE */}
                    {step === 1 && (
                        <div className="animate-in slide-in-from-right-4 duration-300">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                                <Music className="text-blue-500" /> Show History
                            </h2>
                            <div className="space-y-3">
                                {[
                                    { id: 'new', label: 'Just Starting', desc: '0 - 10 Shows played' },
                                    { id: 'working', label: 'Working Band', desc: '10 - 50 Shows played' },
                                    { id: 'veteran', label: 'Road Warriors', desc: '50+ Shows / Touring' },
                                ].map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => handleSelect('experience', opt.id)}
                                        className={`w-full text-left p-4 rounded-xl border transition-all ${answers.experience === opt.id ? 'border-blue-500 bg-blue-900/20' : 'border-gray-800 hover:border-gray-700 bg-black'}`}
                                    >
                                        <div className="font-bold">{opt.label}</div>
                                        <div className="text-xs text-gray-500">{opt.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 2: TEAM */}
                    {step === 2 && (
                        <div className="animate-in slide-in-from-right-4 duration-300">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                                <Users className="text-purple-500" /> Team Structure
                            </h2>
                            <div className="space-y-3">
                                {[
                                    { id: 'solo', label: 'DIY / Self-Managed', desc: 'We do everything ourselves.' },
                                    { id: 'manager', label: 'We have a Manager', desc: 'Someone handles the business.' },
                                    { id: 'crew', label: 'Full Crew', desc: 'TM, FOH, Techs on payroll.' },
                                ].map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => handleSelect('team', opt.id)}
                                        className={`w-full text-left p-4 rounded-xl border transition-all ${answers.team === opt.id ? 'border-purple-500 bg-purple-900/20' : 'border-gray-800 hover:border-gray-700 bg-black'}`}
                                    >
                                        <div className="font-bold">{opt.label}</div>
                                        <div className="text-xs text-gray-500">{opt.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 3: REVENUE */}
                    {step === 3 && (
                        <div className="animate-in slide-in-from-right-4 duration-300">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                                <DollarSign className="text-emerald-500" /> Average Guarantee
                            </h2>
                            <div className="space-y-3">
                                {[
                                    { id: 'low', label: 'Door Deals / Tips', desc: '$0 - $200 per show' },
                                    { id: 'medium', label: 'Guarantee', desc: '$200 - $1,500 per show' },
                                    { id: 'high', label: 'Hard Ticket', desc: '$2,000+ per show' },
                                ].map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => handleSelect('revenue', opt.id)}
                                        className={`w-full text-left p-4 rounded-xl border transition-all ${answers.revenue === opt.id ? 'border-emerald-500 bg-emerald-900/20' : 'border-gray-800 hover:border-gray-700 bg-black'}`}
                                    >
                                        <div className="font-bold">{opt.label}</div>
                                        <div className="text-xs text-gray-500">{opt.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={handleNext}
                            disabled={
                                (step === 1 && !answers.experience) ||
                                (step === 2 && !answers.team) ||
                                (step === 3 && !answers.revenue)
                            }
                            className="bg-white text-black px-6 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {step === 3 ? 'Analyze' : 'Next'} <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LevelAssessment;
