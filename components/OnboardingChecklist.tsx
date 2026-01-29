
import React, { useState } from 'react';
import { CheckCircle2, Circle, ArrowRight, ShieldCheck, FileText, Users, PlayCircle, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { OnboardingStep } from '../types';

const INITIAL_STEPS: OnboardingStep[] = [
  { id: '1', label: 'Complete Organization Profile', isComplete: true, category: 'SETUP' },
  { id: '2', label: 'Upload W-9 Form', isComplete: false, category: 'LEGAL', action: 'VAULT' },
  { id: '3', label: 'Add 3 Crew Members', isComplete: false, category: 'CREW', action: 'TEAM' },
  { id: '4', label: 'Upload Stage Plot', isComplete: false, category: 'SETUP', action: 'VAULT' },
  { id: '5', label: 'Verify Insurance (COI)', isComplete: false, category: 'LEGAL', action: 'VAULT' },
  { id: '6', label: 'Connect Bank Account', isComplete: false, category: 'LEGAL' },
  { id: '7', label: 'Input Emergency Medical Info', isComplete: false, category: 'CREW', action: 'VAULT' }
];

interface OnboardingChecklistProps {
  onAction?: (action: string) => void;
}

const OnboardingChecklist: React.FC<OnboardingChecklistProps> = ({ onAction }) => {
  const [steps, setSteps] = useState<OnboardingStep[]>(INITIAL_STEPS);
  const [isMinimized, setIsMinimized] = useState(false);
  const completedCount = steps.filter(s => s.isComplete).length;
  const progress = (completedCount / steps.length) * 100;

  const toggleStep = (id: string) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, isComplete: !s.isComplete } : s));
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden transition-all">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <ShieldCheck size={120} className="text-white" />
      </div>

      <div className="flex justify-between items-end mb-8 relative z-10">
        <div>
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Road To Pro</h3>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Complete these steps to unlock verified status.</p>
        </div>
        <div className="text-right flex items-center gap-4">
          <span className="text-4xl font-black text-emerald-500">{Math.round(progress)}%</span>
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 bg-gray-800 border border-gray-700 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
          >
            {isMinimized ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </button>
        </div>
      </div>

      <div className={`w-full bg-gray-800 h-2 rounded-full relative z-10 overflow-hidden ${isMinimized ? 'mb-0' : 'mb-8'}`}>
        <div className="bg-emerald-500 h-full transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
      </div>

      {!isMinimized && (
        <div className="space-y-3 relative z-10 animate-in fade-in slide-in-from-top-4 duration-300">
          {steps.map(step => (
            <div 
              key={step.id} 
              className={`group flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${step.isComplete ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-black/20 border-gray-800 hover:border-gray-700'}`}
              onClick={() => toggleStep(step.id)}
            >
              <div className="flex items-center gap-4">
                <div className={`transition-colors ${step.isComplete ? 'text-emerald-500' : 'text-gray-600 group-hover:text-gray-400'}`}>
                  {step.isComplete ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                </div>
                <div>
                  <p className={`text-xs font-bold uppercase tracking-wide ${step.isComplete ? 'text-emerald-500 line-through opacity-50' : 'text-white'}`}>
                    {step.label}
                  </p>
                  <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">{step.category}</span>
                </div>
              </div>
              {step.action && !step.isComplete && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onAction?.(step.action || '');
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 bg-gray-800 text-[8px] font-black uppercase text-white rounded-lg hover:bg-white hover:text-black flex items-center gap-1"
                >
                  Go <ArrowRight size={10} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      
      {!isMinimized && progress === 100 && (
        <div className="mt-8 p-4 bg-emerald-500 text-black rounded-xl text-center animate-in zoom-in duration-300">
           <p className="text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
             <ShieldCheck size={16} /> Organization Fully Verified
           </p>
        </div>
      )}
    </div>
  );
};

export default OnboardingChecklist;
