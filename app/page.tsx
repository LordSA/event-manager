'use client';

import React from 'react';
import { ArrowRight, Calendar as CalendarIcon, MessageSquare, ShieldCheck, Layers } from 'lucide-react';
import Link from 'next/link';
import { useCommunities } from '@/lib/hooks/useCommunities';
import { useRealtimeEvents } from '@/lib/hooks/useRealtimeEvents';

export default function LandingHomePage() {
  const { communities, loading: communitiesLoading } = useCommunities();
  const { eventsList, loading: eventsLoading } = useRealtimeEvents();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] flex flex-col">
      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Hero Section */}
        <section className="text-center space-y-6 max-w-3xl mx-auto pt-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-medium text-neutral-300">
            <CalendarIcon className="w-3.5 h-3.5 text-neutral-400" />
            <span>Campus Event & Workshop Directory</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            The central event hub for CEV campus
          </h1>

          <p className="text-base sm:text-lg text-neutral-400 max-w-xl mx-auto leading-relaxed">
            Discover technical sessions, hackathons, and workshops organized by IEEE, IEDC, TinkerHub, FOSS Club, and MuLearn.
          </p>

          {/* Header Action Section: Exactly Two Primary Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-4">
            <Link
              href="/events"
              className="w-full sm:w-auto py-3 px-6 rounded-lg bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition-colors text-center"
            >
              Explore Events
            </Link>

            <Link
              href="/calendar"
              className="w-full sm:w-auto py-3 px-6 rounded-lg bg-neutral-900 border border-neutral-800 text-white font-semibold text-sm hover:bg-neutral-800 transition-colors text-center"
            >
              Explore Calendar
            </Link>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-[#121212] border border-neutral-800 space-y-3">
            <div className="p-2.5 w-fit rounded-lg bg-neutral-800 text-white border border-neutral-700">
              <CalendarIcon className="w-5 h-5 text-neutral-300" />
            </div>
            <h3 className="text-lg font-bold text-white">Centralized Schedule</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Unified master schedule across all campus organizations with conflict-free slot booking.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#121212] border border-neutral-800 space-y-3">
            <div className="p-2.5 w-fit rounded-lg bg-neutral-800 text-white border border-neutral-700">
              <MessageSquare className="w-5 h-5 text-neutral-300" />
            </div>
            <h3 className="text-lg font-bold text-white">Contextual Assistant</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Instant answers regarding venue locations, schedules, prerequisites, and registration links.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#121212] border border-neutral-800 space-y-3">
            <div className="p-2.5 w-fit rounded-lg bg-neutral-800 text-white border border-neutral-700">
              <Layers className="w-5 h-5 text-neutral-300" />
            </div>
            <h3 className="text-lg font-bold text-white">Multi-Community Network</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Browse initiatives, student achievements, and technical workshops by organization.
            </p>
          </div>
        </section>

        {/* Participating Communities */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Participating Communities</h2>
            <p className="text-neutral-400 text-xs mt-1">Student branches and technical chapters at CEV.</p>
          </div>

          {communitiesLoading ? (
            <div className="p-8 text-neutral-500 text-xs bg-[#121212] border border-neutral-800 rounded-xl text-center">
              Loading communities...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {communities.map((c) => (
                <div
                  key={c.id}
                  className="p-5 rounded-xl bg-[#121212] border border-neutral-800 flex flex-col space-y-2 hover:border-neutral-700 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-white font-bold text-sm">
                    {c.initials || c.name.slice(0, 2).toUpperCase()}
                  </div>
                  <h3 className="font-semibold text-white text-sm mt-1">{c.name}</h3>
                  <p className="text-xs text-neutral-400 line-clamp-2">{c.description || 'Campus community.'}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Featured Live Events */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white tracking-tight">Featured Events</h2>
            <Link href="/events" className="text-xs text-neutral-300 hover:text-white font-medium flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {eventsLoading ? (
            <div className="p-8 text-neutral-500 text-xs bg-[#121212] border border-neutral-800 rounded-xl text-center">
              Loading live events...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {eventsList.slice(0, 3).map((evt) => (
                <div
                  key={evt.id}
                  className="p-5 rounded-xl bg-[#121212] border border-neutral-800 flex flex-col justify-between space-y-4 hover:border-neutral-700 transition-colors"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase font-semibold text-neutral-300 bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700">
                      {evt.category}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">{evt.title}</h3>
                    <p className="text-xs text-neutral-400 line-clamp-2">{evt.description}</p>
                  </div>

                  <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                    <span>{evt.community}</span>
                    <Link href={`/events/${evt.id}`} className="text-white font-medium hover:underline flex items-center gap-1">
                      Details &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800 bg-[#0a0a0a] py-6 text-center text-xs text-neutral-500">
        <p>Whats @CEV - Campus Event Management Platform</p>
      </footer>
    </div>
  );
}