
import React, { useState } from 'react';
import { ShieldCheck, XCircle, CheckCircle, Clock, Search, ShieldAlert, UserCheck } from 'lucide-react';
import { MOCK_APPROVALS } from '../constants';
import { ApprovalRequest } from '../types';

/**
 * AdminSection component allows administrators to review and act on network vetting requests.
 */
interface AdminSectionProps {
  onExit: () => void;
}

const AdminSection: React.FC<AdminSectionProps> = ({ onExit }) => {
  const [requests, setRequests] = useState<ApprovalRequest[]>(MOCK_APPROVALS);
  const [filter, setFilter] = useState<ApprovalRequest['status'] | 'ALL'>('PENDING');

  // Helper to update request status locally
  const handleAction = (id: string, status: 'APPROVED' | 'REJECTED') => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const filteredRequests = requests.filter(r => filter === 'ALL' || r.status === filter);

  // Styling helper for status labels
  const getStatusColor = (status: ApprovalRequest['status']) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'APPROVED': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'REJECTED': return 'text-red-500 bg-red-500/10 border-red-500/20';
    }
  };

  // Helper to get appropriate icon for request type
  const getTypeIcon = (type: ApprovalRequest['type']) => {
    switch (type) {
      case 'HOST': return <ShieldCheck className="text-emerald-500" size={16} />;
      case 'PROMOTER': return <UserCheck className="text-pink-500" size={16} />;
      case 'VENUE_CERT': return <ShieldAlert className="text-yellow-500" size={16} />;
      case 'CREATOR': return <UserCheck className="text-purple-500" size={16} />;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-950 overflow-hidden">
      {/* Admin Header with Stats */}
      <div className="p-8 border-b border-gray-900 bg-black/50">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onExit}
            className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors"
          >
            <span className="text-xl">←</span>
            <span className="text-xs font-black uppercase tracking-widest">Back to User App</span>
          </button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
              <ShieldAlert className="text-yellow-500" size={32} />
              ADMIN OPERATIONS
            </h2>
            <p className="text-gray-500 font-medium uppercase tracking-widest text-[10px] mt-1">Network Integrity & Vetting Console</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-gray-900 p-1 rounded-xl border border-gray-800">
              {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === s ? 'bg-white text-black' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-2xl">
            <p className="text-[10px] font-black text-gray-600 uppercase mb-1">Queue Depth</p>
            <p className="text-2xl font-black text-white">{requests.filter(r => r.status === 'PENDING').length}</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-2xl">
            <p className="text-[10px] font-black text-gray-600 uppercase mb-1">Verified Nodes</p>
            <p className="text-2xl font-black text-emerald-500">{requests.filter(r => r.status === 'APPROVED').length}</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-2xl">
            <p className="text-[10px] font-black text-gray-600 uppercase mb-1">Risk Alerts</p>
            <p className="text-2xl font-black text-red-500">0</p>
          </div>
        </div>
      </div>

      {/* Requests Feed */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto space-y-4">
          {filteredRequests.length > 0 ? filteredRequests.map(req => (
            <div key={req.id} className="bg-gray-900 border border-gray-800 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-gray-700 transition-all">
              <div className="flex items-start gap-4 flex-1">
                <div className={`p-3 rounded-2xl ${getStatusColor(req.status)} border`}>
                  {getTypeIcon(req.type)}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">{req.applicantName}</h3>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${getStatusColor(req.status)}`}>
                      {req.status}
                    </span>
                  </div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">{req.type.replace('_', ' ')} • Submitted {req.timestamp}</p>
                  <p className="text-sm text-gray-400 font-medium bg-black/40 p-3 rounded-xl border border-gray-800">{req.details}</p>
                </div>
              </div>

              {req.status === 'PENDING' && (
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => handleAction(req.id, 'REJECTED')}
                    className="p-3 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all group"
                    title="Deny Request"
                  >
                    <XCircle size={20} />
                  </button>
                  <button
                    onClick={() => handleAction(req.id, 'APPROVED')}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    <CheckCircle size={16} /> Approve Access
                  </button>
                </div>
              )}

              {req.status !== 'PENDING' && (
                <div className="text-[10px] font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
                  <Clock size={12} /> Decision Recorded
                </div>
              )}
            </div>
          )) : (
            <div className="py-20 text-center border-2 border-dashed border-gray-800 rounded-[3rem]">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-800">
                <Search size={24} className="text-gray-700" />
              </div>
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">No requests found in this sector</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSection;
