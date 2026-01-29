
import React, { useState } from 'react';
import { 
  FileText, Shield, HeartPulse, HardDrive, DollarSign, Upload, 
  Download, Eye, Trash2, CheckCircle2, AlertCircle, FileCheck, Lock
} from 'lucide-react';
import { VaultItem } from '../types';

const INITIAL_DOCS: VaultItem[] = [
  { id: '1', name: 'W-9 Form (2024)', category: 'LEGAL', uploadDate: '2024-01-15', status: 'VALID', size: '245 KB' },
  { id: '2', name: 'Crew Allergy List', category: 'MEDICAL', uploadDate: '2023-11-20', status: 'VALID', size: '1.2 MB' },
  { id: '3', name: 'Stage Plot v4.2', category: 'PRODUCTION', uploadDate: '2024-02-01', status: 'VALID', size: '3.5 MB' },
  { id: '4', name: 'Insurance COI', category: 'LEGAL', uploadDate: '2023-05-10', status: 'EXPIRED', size: '500 KB' },
];

const OrganizationVault: React.FC = () => {
  const [docs, setDocs] = useState<VaultItem[]>(INITIAL_DOCS);
  const [activeCategory, setActiveCategory] = useState<VaultItem['category'] | 'ALL'>('ALL');

  const categories = [
    { id: 'LEGAL', label: 'Legal & Tax', icon: FileText, color: 'blue' },
    { id: 'MEDICAL', label: 'Medical & Safety', icon: HeartPulse, color: 'red' },
    { id: 'PRODUCTION', label: 'Production', icon: HardDrive, color: 'purple' },
    { id: 'FINANCE', label: 'Finance', icon: DollarSign, color: 'emerald' },
    { id: 'CERTS', label: 'Certifications', icon: Shield, color: 'amber' },
  ];

  const filteredDocs = activeCategory === 'ALL' ? docs : docs.filter(d => d.category === activeCategory);

  const handleUpload = () => {
    // Mock upload
    const newDoc: VaultItem = {
      id: Date.now().toString(),
      name: 'New Document.pdf',
      category: activeCategory === 'ALL' ? 'LEGAL' : activeCategory,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'PENDING',
      size: '0 KB'
    };
    setDocs([newDoc, ...docs]);
  };

  const getStatusColor = (status: VaultItem['status']) => {
    switch(status) {
      case 'VALID': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'EXPIRED': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'PENDING': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    }
  };

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Header */}
      <div className="h-20 border-b border-gray-900 bg-gray-950 flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-4">
           <div className="p-3 bg-gray-900 rounded-xl border border-gray-800">
             <Lock className="text-gray-400" size={20} />
           </div>
           <div>
             <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Secure Vault</h2>
             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Organization Records & Sensitive Data</p>
           </div>
        </div>
        <button 
          onClick={handleUpload}
          className="flex items-center gap-3 px-6 py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
        >
          <Upload size={16} /> Upload Record
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Categories */}
        <div className="w-64 border-r border-gray-900 bg-gray-950 p-6 flex flex-col gap-2">
           <button 
             onClick={() => setActiveCategory('ALL')}
             className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === 'ALL' ? 'bg-white text-black' : 'text-gray-500 hover:bg-gray-900 hover:text-white'}`}
           >
             All Records
           </button>
           <div className="h-px bg-gray-900 my-2" />
           {categories.map(cat => (
             <button 
               key={cat.id}
               onClick={() => setActiveCategory(cat.id as any)}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${activeCategory === cat.id ? `bg-${cat.color}-500/10 text-${cat.color}-500 border border-${cat.color}-500/20` : 'text-gray-500 hover:bg-gray-900 hover:text-gray-300 border border-transparent'}`}
             >
               <cat.icon size={16} className={activeCategory === cat.id ? `text-${cat.color}-500` : 'text-gray-600 group-hover:text-gray-400'} />
               <span className="text-[10px] font-black uppercase tracking-widest">{cat.label}</span>
             </button>
           ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-black">
           {filteredDocs.length > 0 ? (
             <div className="grid grid-cols-1 gap-4">
                {filteredDocs.map(doc => (
                  <div key={doc.id} className="group bg-gray-900/40 border border-gray-800 p-6 rounded-2xl flex items-center justify-between hover:border-gray-700 transition-all">
                     <div className="flex items-center gap-6">
                        <div className="p-4 bg-black rounded-xl border border-gray-800 group-hover:border-gray-600 transition-colors">
                           <FileText size={24} className="text-gray-400" />
                        </div>
                        <div>
                           <h4 className="text-sm font-black text-white uppercase tracking-tight mb-1">{doc.name}</h4>
                           <div className="flex items-center gap-3">
                              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{doc.category}</span>
                              <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">• {doc.size}</span>
                              <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">• {doc.uploadDate}</span>
                           </div>
                        </div>
                     </div>

                     <div className="flex items-center gap-6">
                        <div className={`px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest ${getStatusColor(doc.status)}`}>
                           {doc.status}
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button className="p-2 text-gray-500 hover:text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-all"><Eye size={16} /></button>
                           <button className="p-2 text-gray-500 hover:text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-all"><Download size={16} /></button>
                           <button className="p-2 text-gray-500 hover:text-red-500 bg-gray-900 rounded-lg hover:bg-red-500/10 transition-all"><Trash2 size={16} /></button>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center opacity-30">
                <FileCheck size={64} className="text-gray-600 mb-6" />
                <p className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">No Records Found In This Sector</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationVault;
