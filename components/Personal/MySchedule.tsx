import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

const MySchedule: React.FC = () => {
    // Mock Schedule Data (Aggregated from all bands)
    const scheduleItems = [
        { id: 1, time: '10:00 AM', activity: 'Bus Call', location: 'Hotel Lobby', band: 'Dale and the ZDubs' },
        { id: 2, time: '2:00 PM', activity: 'Load In', location: 'The Norva', band: 'Dale and the ZDubs' },
        { id: 3, time: '4:30 PM', activity: 'Soundcheck', location: 'The Norva', band: 'Dale and the ZDubs' },
        { id: 4, time: '8:00 PM', activity: 'Interviews', location: 'Backstage', band: 'Carolina Reefer' }, // Cross-band example
    ];

    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                    <Calendar size={20} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white leading-none">My Schedule</h3>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Today • March 21</p>
                </div>
            </div>

            <div className="space-y-4">
                {scheduleItems.map((item) => (
                    <div key={item.id} className="relative pl-6 pb-2 last:pb-0 border-l border-gray-800 last:border-0">
                        <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-black" />

                        <div className="bg-black border border-gray-800 rounded-xl p-3 hover:border-blue-500/30 transition-colors group">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-xl font-black text-white">{item.time}</span>
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-gray-900 px-2 py-0.5 rounded-full">{item.band}</span>
                            </div>
                            <h4 className="font-bold text-gray-300">{item.activity}</h4>
                            <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
                                <MapPin size={12} />
                                {item.location}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MySchedule;
