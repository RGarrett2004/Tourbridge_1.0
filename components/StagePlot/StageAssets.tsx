
import React from 'react';

// ==========================================
// DRUMS & PERCUSSION
// ==========================================

export const DrumKit = () => (
    <svg viewBox="0 0 200 180" className="w-full h-full drop-shadow-xl" strokeLinecap="round" strokeLinejoin="round">
        {/* Floor Tom */}
        <circle cx="160" cy="140" r="28" fill="#f59e0b" stroke="#111" strokeWidth="3" />
        <circle cx="160" cy="140" r="22" fill="#fcd34d" stroke="#111" strokeWidth="2" />

        {/* Snare */}
        <circle cx="60" cy="130" r="24" fill="#e5e7eb" stroke="#111" strokeWidth="3" />
        <circle cx="60" cy="130" r="18" fill="#fff" stroke="#111" strokeWidth="2" strokeDasharray="4 4" />

        {/* Kick Drum (Center) */}
        <path d="M70,60 Q100,50 130,60 L130,110 Q100,120 70,110 Z" fill="#111" stroke="#111" strokeWidth="3" />
        <ellipse cx="100" cy="85" rx="32" ry="28" fill="#f59e0b" stroke="#111" strokeWidth="3" />

        {/* Rack Toms */}
        <circle cx="80" cy="50" r="22" fill="#f59e0b" stroke="#111" strokeWidth="3" />
        <circle cx="80" cy="50" r="16" fill="#fcd34d" stroke="#111" strokeWidth="2" />
        <circle cx="120" cy="50" r="22" fill="#f59e0b" stroke="#111" strokeWidth="3" />
        <circle cx="120" cy="50" r="16" fill="#fcd34d" stroke="#111" strokeWidth="2" />

        {/* Cymbals (Thick Gold Discs) */}
        <circle cx="30" cy="110" r="20" fill="#fbbf24" stroke="#d97706" strokeWidth="3" />
        <circle cx="30" cy="110" r="3" fill="#111" />

        <circle cx="40" cy="30" r="26" fill="#fbbf24" stroke="#d97706" strokeWidth="3" />
        <circle cx="40" cy="30" r="4" fill="#111" />

        <circle cx="170" cy="50" r="30" fill="#fbbf24" stroke="#d97706" strokeWidth="3" />
        <circle cx="170" cy="50" r="5" fill="#111" />

        {/* Stool */}
        <circle cx="100" cy="150" r="18" fill="#4b5563" stroke="#111" strokeWidth="3" />
    </svg>
);

export const Cajon = () => (
    <svg viewBox="0 0 60 70" className="w-full h-full drop-shadow-lg">
        <rect x="5" y="5" width="50" height="60" rx="4" fill="#d97706" stroke="#111" strokeWidth="3" />
        <circle cx="30" cy="25" r="12" fill="#92400e" stroke="#111" strokeWidth="2" opacity="0.6" />
        <rect x="5" y="5" width="50" height="10" rx="2" fill="#fcd34d" opacity="0.3" />
    </svg>
);

// ==========================================
// AMPS & AUDIO
// ==========================================

export const GuitarAmp = () => (
    <svg viewBox="0 0 100 60" className="w-full h-full drop-shadow-xl">
        {/* Cabinet */}
        <rect x="2" y="2" width="96" height="56" rx="6" fill="#1f2937" stroke="#111" strokeWidth="4" />
        {/* Grille */}
        <rect x="8" y="16" width="84" height="38" rx="2" fill="#9ca3af" stroke="#111" strokeWidth="2" />
        <path d="M8,16 L92,54 M8,54 L92,16" stroke="#6b7280" strokeWidth="1" opacity="0.5" />
        {/* Panel */}
        <rect x="8" y="6" width="84" height="6" fill="#d1d5db" />
        <circle cx="15" cy="9" r="2" fill="#111" />
        <circle cx="25" cy="9" r="2" fill="#111" />
        <circle cx="35" cy="9" r="2" fill="#111" />
    </svg>
);

export const BassAmp = () => (
    <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-xl">
        {/* Cab */}
        <rect x="5" y="20" width="90" height="55" rx="4" fill="#111" stroke="#374151" strokeWidth="4" />
        <rect x="10" y="25" width="80" height="45" fill="#374151" stroke="#111" strokeWidth="2" />
        {/* 4x10 Circles */}
        <circle cx="30" cy="40" r="8" fill="#111" />
        <circle cx="70" cy="40" r="8" fill="#111" />
        <circle cx="30" cy="60" r="8" fill="#111" />
        <circle cx="70" cy="60" r="8" fill="#111" />
        {/* Head */}
        <rect x="10" y="2" width="80" height="16" rx="2" fill="#d1d5db" stroke="#111" strokeWidth="3" />
        <rect x="15" y="6" width="70" height="8" fill="#111" />
    </svg>
);

export const WedgeMonitor = () => (
    <svg viewBox="0 0 100 60" className="w-full h-full drop-shadow-lg">
        <path d="M5,55 L20,10 L80,10 L95,55 Z" fill="#111" stroke="#374151" strokeWidth="4" strokeLinejoin="round" />
        <path d="M20,15 L80,15 L88,50 L12,50 Z" fill="#374151" stroke="#111" strokeWidth="2" />
        <line x1="20" y1="15" x2="88" y2="50" stroke="#111" strokeWidth="1" opacity="0.3" />
        <line x1="80" y1="15" x2="12" y2="50" stroke="#111" strokeWidth="1" opacity="0.3" />
    </svg>
);

export const PASpeaker = () => (
    <svg viewBox="0 0 60 90" className="w-full h-full drop-shadow-xl">
        <rect x="5" y="5" width="50" height="80" rx="6" fill="#1f2937" stroke="#111" strokeWidth="3" />
        <circle cx="30" cy="25" r="14" fill="#111" stroke="#374151" strokeWidth="2" />
        <circle cx="30" cy="65" r="18" fill="#111" stroke="#374151" strokeWidth="2" />
    </svg>
);

export const Subwoofer = () => (
    <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-xl">
        <rect x="5" y="5" width="70" height="70" rx="6" fill="#111" stroke="#374151" strokeWidth="4" />
        <circle cx="40" cy="40" r="28" fill="#1f2937" stroke="#374151" strokeWidth="2" />
        <circle cx="40" cy="40" r="20" fill="#111" />
    </svg>
);

// ==========================================
// STRING INSTRUMENTS (Iconic Style)
// ==========================================

export const ElectricGuitar = () => (
    <svg viewBox="0 0 60 140" className="w-full h-full drop-shadow-md">
        <path d="M30,35 C15,35 5,55 5,85 C5,115 20,135 30,135 C40,135 55,115 55,85 C55,65 50,45 45,35 C40,25 35,35 30,35 Z" fill="#ef4444" stroke="#111" strokeWidth="3" />
        <path d="M22,70 L22,110 Q30,115 38,110 L38,70 Z" fill="#fff" stroke="#111" strokeWidth="2" />
        <rect x="27" y="5" width="6" height="65" fill="#fcd34d" stroke="#111" strokeWidth="2" />
        <path d="M24,0 L36,0 L36,12 L24,12 Z" fill="#fcd34d" stroke="#111" strokeWidth="2" />
    </svg>
);

export const BassPlayer = () => (
    <svg viewBox="0 0 60 140" className="w-full h-full drop-shadow-md">
        <path d="M30,35 C10,35 5,55 10,85 C15,115 25,135 30,135 C35,135 45,115 50,85 C55,55 50,35 30,35 Z" fill="#3b82f6" stroke="#111" strokeWidth="3" />
        <path d="M40,70 Q45,100 40,110 L25,110 Q20,100 25,70 Z" fill="#fff" stroke="#111" strokeWidth="2" />
        <rect x="27" y="5" width="6" height="65" fill="#fde68a" stroke="#111" strokeWidth="2" />
        <path d="M24,0 L36,0 L36,15 L24,15 C20,10 20,5 24,0 Z" fill="#fde68a" stroke="#111" strokeWidth="2" />
    </svg>
);

// ==========================================
// KEYS
// ==========================================

export const Keyboard = () => (
    <svg viewBox="0 0 140 50" className="w-full h-full drop-shadow-lg">
        {/* Frame */}
        <rect x="5" y="5" width="130" height="40" rx="4" fill="#1f2937" stroke="#111" strokeWidth="3" />
        {/* White Keys */}
        <rect x="10" y="10" width="120" height="30" fill="#fff" stroke="#111" strokeWidth="2" />
        {/* Black Keys Pattern */}
        {[20, 30, 50, 60, 70, 90, 100, 120].map(x => (
            <rect key={x} x={x} y="10" width="6" height="18" fill="#111" stroke="#111" strokeWidth="1" />
        ))}
    </svg>
);

export const Keytar = () => (
    <svg viewBox="0 0 120 60" className="w-full h-full drop-shadow-md">
        <path d="M30,30 L110,20 L110,40 L30,50 Z" fill="#ec4899" stroke="#111" strokeWidth="3" />
        <rect x="5" y="35" width="35" height="10" transform="rotate(-15 20 40)" fill="#111" stroke="#111" strokeWidth="2" />
        <rect x="40" y="25" width="60" height="15" transform="rotate(-5 70 32)" fill="#fff" stroke="#111" strokeWidth="2" />
        {[45, 50, 55, 65, 70, 80, 85].map(x => (
            <rect key={x} x={x} y="25" width="3" height="10" transform="rotate(-5 70 32)" fill="#111" />
        ))}
    </svg>
);

export const Pedalboard = () => (
    <svg viewBox="0 0 100 60" className="w-full h-full drop-shadow-md">
        <rect x="5" y="5" width="90" height="50" rx="6" fill="#111" stroke="#374151" strokeWidth="3" />
        <rect x="15" y="15" width="20" height="30" rx="3" fill="#ef4444" stroke="#111" strokeWidth="2" />
        <rect x="40" y="15" width="20" height="30" rx="3" fill="#3b82f6" stroke="#111" strokeWidth="2" />
        <rect x="65" y="15" width="20" height="30" rx="3" fill="#22c55e" stroke="#111" strokeWidth="2" />
        <circle cx="25" cy="40" r="3" fill="#fff" opacity="0.8" />
        <circle cx="50" cy="40" r="3" fill="#fff" opacity="0.8" />
        <circle cx="75" cy="40" r="3" fill="#fff" opacity="0.8" />
    </svg>
);

// ==========================================
// HORNS (Iconic Gold)
// ==========================================

export const Saxophone = () => (
    <svg viewBox="0 0 80 120" className="w-full h-full drop-shadow-md">
        <path d="M45,20 L45,85 Q45,110 25,100 Q10,95 20,75 L30,65" fill="none" stroke="#fbbf24" strokeWidth="16" strokeLinecap="round" />
        <path d="M45,20 L45,85 Q45,110 25,100 Q10,95 20,75 L30,65" fill="none" stroke="#111" strokeWidth="18" strokeLinecap="round" opacity="0.2" /> {/* Subtle Outline Shadow */}
        <path d="M45,20 L45,85 Q45,110 25,100 Q10,95 20,75 L30,65" fill="none" stroke="#fbbf24" strokeWidth="14" strokeLinecap="round" />
        <path d="M45,20 L45,85 Q45,110 25,100 Q10,95 20,75 L30,65" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round" fillOpacity="0" /> {/* Real Outline */}

        <circle cx="25" cy="70" r="14" fill="#fbbf24" stroke="#111" strokeWidth="3" />
        <path d="M45,25 L55,15" stroke="#111" strokeWidth="3" />
    </svg>
);

export const Trumpet = () => (
    <svg viewBox="0 0 120 40" className="w-full h-full drop-shadow-md">
        <path d="M85,10 L110,5 L110,35 L85,30" fill="#fbbf24" stroke="#111" strokeWidth="3" strokeLinejoin="round" />
        <ellipse cx="110" cy="20" rx="4" ry="15" fill="#fcd34d" stroke="#111" strokeWidth="2" />
        <rect x="10" y="15" width="75" height="10" rx="5" fill="#fbbf24" stroke="#111" strokeWidth="3" />
        <rect x="40" y="8" width="16" height="24" fill="#e5e7eb" stroke="#111" strokeWidth="2" rx="2" />
        <circle cx="44" cy="12" r="2" fill="#111" />
        <circle cx="48" cy="12" r="2" fill="#111" />
        <circle cx="52" cy="12" r="2" fill="#111" />
    </svg>
);

export const Trombone = () => (
    <svg viewBox="0 0 140 40" className="w-full h-full drop-shadow-md">
        <rect x="20" y="12" width="80" height="16" rx="4" fill="none" stroke="#fbbf24" strokeWidth="6" />
        <rect x="20" y="12" width="80" height="16" rx="4" fill="none" stroke="#111" strokeWidth="3" />
        <line x1="100" y1="20" x2="130" y2="20" stroke="#fbbf24" strokeWidth="6" />
        <line x1="100" y1="20" x2="130" y2="20" stroke="#111" strokeWidth="3" strokeDasharray="30 30" /> {/* Just outline top/bottom? simplified */}
        <path d="M10,20 L0,5 L0,35 L10,20 Z" fill="#fbbf24" transform="translate(110,0) scale(-1,1)" stroke="#111" strokeWidth="2" />
        <ellipse cx="110" cy="20" rx="3" ry="12" fill="#fcd34d" stroke="#111" strokeWidth="2" />
    </svg>
);

export const Flute = () => (
    <svg viewBox="0 0 120 20" className="w-full h-full drop-shadow-sm">
        <rect x="5" y="6" width="110" height="8" rx="4" fill="#e2e8f0" stroke="#111" strokeWidth="2" />
        <circle cx="30" cy="10" r="3" fill="#fff" stroke="#111" strokeWidth="1" />
        <circle cx="45" cy="10" r="3" fill="#fff" stroke="#111" strokeWidth="1" />
        <circle cx="60" cy="10" r="3" fill="#fff" stroke="#111" strokeWidth="1" />
        <circle cx="75" cy="10" r="3" fill="#fff" stroke="#111" strokeWidth="1" />
    </svg>
);

// ==========================================
// MICS & UTILS
// ==========================================

export const VocalMic = () => (
    <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-md">
        <circle cx="20" cy="20" r="14" fill="#374151" stroke="#111" strokeWidth="3" />
        <circle cx="20" cy="20" r="8" fill="#ef4444" stroke="#7f1d1d" strokeWidth="2" />
        <path d="M20,34 L20,40" stroke="#111" strokeWidth="3" />
    </svg>
);

export const MicStand = () => (
    <svg viewBox="0 0 60 60" className="w-full h-full">
        <circle cx="30" cy="30" r="4" fill="#111" />
        <line x1="30" y1="30" x2="10" y2="50" stroke="#111" strokeWidth="3" strokeLinecap="round" />
        <line x1="30" y1="30" x2="50" y2="50" stroke="#111" strokeWidth="3" strokeLinecap="round" />
        <line x1="30" y1="30" x2="30" y2="55" stroke="#111" strokeWidth="3" strokeLinecap="round" />
        <line x1="30" y1="30" x2="45" y2="10" stroke="#111" strokeWidth="3" strokeLinecap="round" />
    </svg>
);

export const DIBox = () => (
    <svg viewBox="0 0 60 60" className="w-full h-full drop-shadow-md">
        <rect x="10" y="10" width="40" height="40" rx="4" fill="#3b82f6" stroke="#111" strokeWidth="3" />
        <text x="30" y="36" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="900" style={{ fontFamily: 'sans-serif' }}>DI</text>
    </svg>
);

export const PowerDrop = () => (
    <svg viewBox="0 0 60 60" className="w-full h-full drop-shadow-sm">
        <rect x="12" y="12" width="36" height="36" rx="6" fill="#111" stroke="#f59e0b" strokeWidth="3" />
        <path d="M30,12 L30,5" stroke="#111" strokeWidth="3" />
        <circle cx="22" cy="22" r="3" fill="#f59e0b" />
        <circle cx="38" cy="22" r="3" fill="#f59e0b" />
        <circle cx="22" cy="38" r="3" fill="#f59e0b" />
        <circle cx="38" cy="38" r="3" fill="#f59e0b" />
    </svg>
);

export const PowerOutlet = () => (
    <svg viewBox="0 0 60 60" className="w-full h-full drop-shadow-sm">
        <rect x="10" y="10" width="40" height="40" rx="6" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
        <path d="M30,22 L36,32 L24,32 L30,42 L28,34 L40,34 L30,22" fill="#78350f" />
    </svg>
);

export const CableCoil = () => (
    <svg viewBox="0 0 60 60" className="w-full h-full opacity-80">
        <circle cx="30" cy="30" r="22" fill="none" stroke="#111" strokeWidth="4" />
        <circle cx="30" cy="30" r="16" fill="none" stroke="#111" strokeWidth="3" />
        <circle cx="30" cy="30" r="10" fill="none" stroke="#111" strokeWidth="2" />
        <line x1="8" y1="30" x2="20" y2="42" stroke="#111" strokeWidth="3" strokeLinecap="round" />
    </svg>
);

export const Headphones = () => (
    <svg viewBox="0 0 60 60" className="w-full h-full drop-shadow-sm">
        <path d="M10,40 Q10,10 30,10 Q50,10 50,40" fill="none" stroke="#111" strokeWidth="5" strokeLinecap="round" />
        <rect x="5" y="35" width="12" height="18" rx="4" fill="#374151" stroke="#111" strokeWidth="3" />
        <rect x="43" y="35" width="12" height="18" rx="4" fill="#374151" stroke="#111" strokeWidth="3" />
    </svg>
);

export const MusicStand = () => (
    <svg viewBox="0 0 60 60" className="w-full h-full drop-shadow-sm">
        <path d="M15,20 L45,20 L40,15 L20,15 Z" fill="#111" stroke="#111" strokeWidth="2" />
        <line x1="30" y1="50" x2="30" y2="20" stroke="#111" strokeWidth="3" />
        <line x1="15" y1="55" x2="45" y2="55" stroke="#111" strokeWidth="3" strokeLinecap="round" />
    </svg>
);

export const Riser = () => (
    <svg viewBox="0 0 200 150" className="w-full h-full drop-shadow-none opacity-50">
        <rect x="2" y="2" width="196" height="146" fill="none" stroke="#111" strokeWidth="3" rx="4" strokeDasharray="12 6" />
        <line x1="0" y1="0" x2="200" y2="150" stroke="#111" strokeWidth="1" opacity="0.2" />
        <line x1="200" y1="0" x2="0" y2="150" stroke="#111" strokeWidth="1" opacity="0.2" />
        <text x="100" y="75" textAnchor="middle" fill="#111" fontSize="16" fontWeight="bold" opacity="0.6">RISER 8x8</text>
    </svg>
);

export const InEarMonitor = () => (
    <svg viewBox="0 0 60 40" className="w-full h-full drop-shadow-md">
        <rect x="5" y="10" width="50" height="20" rx="6" fill="#111" stroke="#374151" strokeWidth="3" />
        <text x="30" y="25" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">IEM</text>
        <path d="M5,20 Q-5,30 10,35" fill="none" stroke="#111" strokeWidth="2" /> {/* Wire */}
        <path d="M55,20 Q65,30 50,35" fill="none" stroke="#111" strokeWidth="2" />
    </svg>
);
