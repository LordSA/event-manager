// Created by Shibili Aman TK | GitHub: https://github.com/LordSA
'use client';

import React from 'react';
import GoogleCalendarView from '@/app/components/GoogleCalendarView';
import { useRealtimeEvents } from '@/lib/hooks/useRealtimeEvents';
import { useCommunities } from '@/lib/hooks/useCommunities';

export default function PublicCalendarPage() {
  const { eventsList, loading: eventsLoading } = useRealtimeEvents();
  const { communities, loading: communitiesLoading } = useCommunities();

  const loading = eventsLoading || communitiesLoading;

  return (
    <div className="min-h-screen bg-[#08090d] text-[#f8fafc] flex flex-col pt-28 md:pt-32">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-neutral-800 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Campus Calendar</h1>
            <p className="text-sm text-neutral-400 mt-1">
              Unified master schedule for workshops, hackathons, and community events across CEV.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-neutral-500 text-sm bg-[#121212] border border-neutral-800 rounded-xl">
            Loading calendar events...
          </div>
        ) : (
          <GoogleCalendarView events={eventsList} communities={communities} />
        )}
      </main>
    </div>
  );
}
