'use client';

import React from 'react';
import MasterCalendar from '@/app/components/MasterCalendar';
import { Sparkles, Radio } from 'lucide-react';
import { useRealtimeEvents } from '@/lib/hooks/useRealtimeEvents';
import { useCommunities } from '@/lib/hooks/useCommunities';

export default function EventsDiscoveryPage() {
  const { eventsList, loading: eventsLoading } = useRealtimeEvents();
  const { communities, loading: communitiesLoading } = useCommunities();

  const loading = eventsLoading || communitiesLoading;

  return (
    <div className="min-h-screen bg-[#05070E] text-white flex flex-col">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20 md:pb-12 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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

          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-emerald-400 font-semibold">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>Supabase Realtime Sync Active</span>
          </div>
        </div>

        {/* Master Discovery Component */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm bg-slate-900/60 border border-slate-800 rounded-2xl">
            Synchronizing live events from database...
          </div>
        ) : (
          <MasterCalendar events={eventsList} communities={communities} isManagerView={false} />
        )}
      </main>
    </div>
  );
}
