'use client';

import React from 'react';
import MasterCalendar from '@/app/components/MasterCalendar';
import Navbar from '@/app/components/Navbar';
import { events, communities } from '@/app/lib/data';
import { Sparkles } from 'lucide-react';

export default function EventsDiscoveryPage() {
  const liveEvents = events.map((e) => ({ ...e, status: 'live' as const }));

  return (
    <div className="min-h-screen bg-[#05070E] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-xs font-semibold text-cyan-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Community Event Portal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Discover Campus Events
          </h1>
          <p className="text-slate-400 max-w-2xl text-base">
            Toggle between Calendar View, Date Order List, or filter by your favorite campus community (IEEE, IEDC, TinkerHub, FOSS, MuLearn).
          </p>
        </div>

        {/* Master Discovery Component */}
        <MasterCalendar events={liveEvents} communities={communities} isManagerView={false} />
      </main>
    </div>
  );
}
