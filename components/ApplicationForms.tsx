
import React, { useState } from 'react';
import { Shield, Camera, Home, CheckCircle, AlertCircle, Info, Zap, Megaphone, Users, Award } from 'lucide-react';

export const HostApplicationForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  
  if (submitted) {
    return (
      <div className="bg-emerald-900/20 border border-emerald-500/30 p-8 rounded-2xl text-center">
        <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
        <h3 className="text-xl font-black text-white uppercase tracking-widest">Application Received</h3>
        <p className="text-gray-400 mt-2">Our team is currently running the background check. We'll contact you within 48 hours.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-500">
          <Home size={24} />
        </div>
        <div>
          <h3 className="text-lg font-black text-white uppercase tracking-widest">Become a Band Host</h3>
          <p className="text-xs text-gray-500 uppercase font-bold">Offer sanctuary to traveling artists</p>
        </div>
      </div>

      <form className="space-y-4 flex-1" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Full Name" className="bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50" required />
          <input type="email" placeholder="Email Address" className="bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50" required />
        </div>
        <input type="text" placeholder="Host Address (Visible after verification)" className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none" required />
        
        <div className="bg-black/50 p-4 rounded-xl border border-gray-800">
          <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Shield size={12} className="text-emerald-500" /> Security Clearing (Private)
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <input type="password" placeholder="SSN Last 4" className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-sm focus:outline-none" required />
            <div className="flex items-center gap-2">
              <input type="checkbox" id="consent" className="rounded bg-gray-900 border-gray-800" required />
              <label htmlFor="consent" className="text-[9px] text-gray-400 font-bold leading-tight">Consent to background check</label>
            </div>
          </div>
        </div>

        <button className="w-full bg-emerald-500 text-black py-4 rounded-xl font-black uppercase text-xs hover:scale-[1.01] active:scale-95 transition-all mt-auto">
          Submit Application
        </button>
      </form>
    </div>
  );
};

export const PromoterSignupForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="bg-pink-900/20 border border-pink-500/30 p-8 rounded-2xl text-center">
        <Megaphone className="w-12 h-12 text-pink-500 mx-auto mb-4" />
        <h3 className="text-xl font-black text-white uppercase tracking-widest">Promoter Review Initiated</h3>
        <p className="text-gray-400 mt-2">Our booking specialists will review your past shows and vetting credentials.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-pink-500/20 rounded-lg text-pink-500">
          <Megaphone size={24} />
        </div>
        <div>
          <h3 className="text-lg font-black text-white uppercase tracking-widest">Independent Promoter</h3>
          <p className="text-xs text-gray-500 uppercase font-bold">Book tours and pair local talent</p>
        </div>
      </div>

      <form className="space-y-4 flex-1" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Company / Stage Name" className="bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-500/50" required />
          <input type="text" placeholder="Primary Genres (Comma sep)" className="bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none" required />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <select className="bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-400">
            <option>Typical Venue Size</option>
            <option>Club (50-200)</option>
            <option>Mid-Sized (200-800)</option>
            <option>Theater (800+)</option>
          </select>
          <input type="text" placeholder="Region / City" className="bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none" required />
        </div>

        <textarea placeholder="List 3 past successful shows or touring bands you've handled" className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none min-h-[100px]" required />

        <div className="flex items-center gap-3 bg-pink-500/5 p-3 rounded-xl border border-pink-500/10">
           <Award className="text-pink-500 shrink-0" size={18} />
           <p className="text-[10px] text-pink-400 font-bold leading-tight uppercase">I verify that I hold legitimate booking authority or production rights in this region.</p>
        </div>

        <button className="w-full bg-pink-500 text-white py-4 rounded-xl font-black uppercase text-xs hover:scale-[1.01] active:scale-95 transition-all mt-auto">
          Register for Vetting
        </button>
      </form>
    </div>
  );
};

export const CreatorApplicationForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="bg-purple-900/20 border border-purple-500/30 p-8 rounded-2xl text-center">
        <CheckCircle className="w-12 h-12 text-purple-500 mx-auto mb-4" />
        <h3 className="text-xl font-black text-white uppercase tracking-widest">Creator Profile Listed</h3>
        <p className="text-gray-400 mt-2">Your travel radius is now active on the map.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-500/20 rounded-lg text-purple-500">
          <Camera size={24} />
        </div>
        <div>
          <h3 className="text-lg font-black text-white uppercase tracking-widest">Content Creator Network</h3>
          <p className="text-xs text-gray-500 uppercase font-bold">List your production services</p>
        </div>
      </div>

      <form className="space-y-4 flex-1" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Full Name" className="bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/50" required />
          <input type="number" placeholder="Age" className="bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <select className="bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-400">
            <option>Male</option>
            <option>Female</option>
            <option>Non-binary</option>
            <option>Prefer not to say</option>
          </select>
          <input type="text" placeholder="Specialty (e.g. Photo, Video)" className="bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none" required />
        </div>
        <input type="text" placeholder="Gear List (e.g. Sony A7IV, Blackmagic 6K)" className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none" />
        <div className="flex items-center justify-between bg-black p-3 rounded-xl border border-gray-800">
           <span className="text-xs text-gray-500 font-bold">Travel Radius (Miles)</span>
           <input type="number" defaultValue={50} className="w-20 bg-gray-900 border-none rounded px-2 py-1 text-sm text-center" />
        </div>
        <button className="w-full bg-purple-500 text-black py-4 rounded-xl font-black uppercase text-xs hover:scale-[1.01] active:scale-95 transition-all mt-auto">
          Activate My Blip
        </button>
      </form>
    </div>
  );
};
