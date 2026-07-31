'use client';

import React from 'react';
import MasterCalendar from '@/app/components/MasterCalendar';
import { Calendar } from 'lucide-react';
import { useRealtimeEvents } from '@/lib/hooks/useRealtimeEvents';
import { useCommunities } from '@/lib/hooks/useCommunities';

export default function EventsDiscoveryPage() {
  const { eventsList, loading: eventsLoading } = useRealtimeEvents();
  const { communities, loading: communitiesLoading } = useCommunities();

  const loading = eventsLoading || communitiesLoading;

  return (
    <div className="min-h-screen bg-[#08090d] text-[#f8fafc] flex flex-col pt-28 md:pt-32">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-6">
        <div className="space-y-2 border-b border-neutral-800 pb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-medium text-neutral-300">
            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
            <span>Campus Event Directory</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Campus Events & Workshops
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm max-w-2xl">
            Discover workshops, hackathons, and technical sessions organized by student branches and technical communities across CEV.
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-neutral-500 text-xs bg-[#121212] border border-neutral-800 rounded-xl">
            Loading campus events...
          </div>
        ) : (
          <MasterCalendar events={eventsList} communities={communities} isManagerView={false} />
        )}
      </main>
    </div>
  );
}
