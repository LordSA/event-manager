'use client';

import React from 'react';
import { ArrowRight, Calendar as CalendarIcon, MessageSquare, Layers } from 'lucide-react';
import Link from 'next/link';
import { useCommunities } from '@/lib/hooks/useCommunities';
import { useRealtimeEvents } from '@/lib/hooks/useRealtimeEvents';

export default function LandingHomePage() {
  const { communities, loading: communitiesLoading } = useCommunities();
  const { eventsList, loading: eventsLoading } = useRealtimeEvents();

  return (
    <div className="min-h-screen bg-[#08090d] text-[#f8fafc] flex flex-col pt-28 md:pt-32">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-20">
        <section className="text-center space-y-6 max-w-3xl mx-auto pt-4">

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display leading-tight">
            The Central Event Hub for CE Vadakara
          </h1>

          <p className="text-sm sm:text-base text-[#94a3b8] max-w-xl mx-auto leading-relaxed font-sans">
            Discover technical sessions, hackathons, and workshops organized by Our College Communities and Clubs.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Link
              href="/events"
              className="w-full sm:w-auto brutalist-btn-primary py-3 px-8 rounded-lg text-xs font-bold text-center tracking-wider uppercase"
            >
              Explore Events
            </Link>

            <Link
              href="/calendar"
              className="w-full sm:w-auto brutalist-btn-secondary py-3 px-8 rounded-lg text-xs font-semibold text-center tracking-wider uppercase"
            >
              Explore Calendar
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="brutalist-card p-6 rounded-xl space-y-3">
            <div className="p-2.5 w-fit rounded-lg bg-[#161a29] text-white border border-[#1e2436]">
              <CalendarIcon className="w-5 h-5 text-[#6366f1]" />
            </div>
            <h3 className="text-lg font-bold text-white font-heading">Centralized Schedule</h3>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Unified master schedule across all campus organizations with conflict-free slot booking.
            </p>
          </div>

          <div className="brutalist-card p-6 rounded-xl space-y-3">
            <div className="p-2.5 w-fit rounded-lg bg-[#161a29] text-white border border-[#1e2436]">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white font-heading">Contextual Assistant</h3>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Instant answers regarding venue locations, schedules, prerequisites, and registration links.
            </p>
          </div>

          <div className="brutalist-card p-6 rounded-xl space-y-3">
            <div className="p-2.5 w-fit rounded-lg bg-[#161a29] text-white border border-[#1e2436]">
              <Layers className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-white font-heading">Multi-Community Network</h3>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Browse initiatives, student achievements, and technical workshops by organization.
            </p>
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">Communities and Clubs</h2>
            <p className="text-[#94a3b8] text-xs mt-1">Student branches and technical chapters at CEV.</p>
          </div>

          {communitiesLoading ? (
            <div className="p-8 text-[#94a3b8] text-xs bg-[#0f121d] border border-[#1e2436] rounded-xl text-center">
              Loading communities...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {communities.map((c) => (
                <Link
                  key={c.id}
                  href={`/community/${c.slug || c.id}`}
                  className="brutalist-card p-5 rounded-xl flex flex-col space-y-2 hover:border-[#6366f1] transition-all cursor-pointer group"
                >
                  {c.logo_url ? (
                    <img
                      src={c.logo_url}
                      alt={c.name}
                      className="w-10 h-10 rounded-lg object-cover border border-[#1e2436]"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-[#161a29] border border-[#1e2436] flex items-center justify-center text-white font-bold text-sm font-display">
                      {c.initials || c.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <h3 className="font-bold text-white text-sm mt-1 font-heading group-hover:text-[#6366f1] transition-colors">{c.name}</h3>
                  <p className="text-xs text-[#94a3b8] line-clamp-2">{c.description || 'Campus community.'}</p>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">Featured Events</h2>
            <Link href="/events" className="text-xs text-[#6366f1] hover:underline font-semibold flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {eventsLoading ? (
            <div className="p-8 text-[#94a3b8] text-xs bg-[#0f121d] border border-[#1e2436] rounded-xl text-center">
              Loading live events...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {eventsList.slice(0, 3).map((evt) => (
                <div
                  key={evt.id}
                  className="brutalist-card p-5 rounded-xl flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase font-bold text-[#6366f1] bg-[#161a29] px-2 py-0.5 rounded border border-[#1e2436]">
                      {evt.category}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1 font-heading">{evt.title}</h3>
                    <p className="text-xs text-[#94a3b8] line-clamp-2">{evt.description}</p>
                  </div>

                  <div className="pt-3 border-t border-[#1e2436] flex items-center justify-between text-xs text-[#94a3b8]">
                    <span>{evt.community}</span>
                    <Link href={`/events/${evt.slug || evt.id}`} className="text-[#6366f1] font-semibold hover:underline flex items-center gap-1">
                      Details &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-[#1e2436] bg-[#0f121d] py-6 text-center text-xs text-[#94a3b8]">
        <p>Whats @CEV - Campus Event Management Platform</p>
      </footer>
    </div>
  );
}