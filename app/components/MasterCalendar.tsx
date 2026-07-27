'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, ListFilter, Users, ArrowUpRight, Lock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export interface EventItemData {
  id: string;
  title: string;
  category: string;
  community: string;
  date: string;
  image?: string;
  description?: string;
  status?: 'closed' | 'live';
}

interface MasterCalendarProps {
  events: EventItemData[];
  communities: Array<{ id: string; name: string; color: string; initials: string }>;
  isManagerView?: boolean;
}

export default function MasterCalendar({ events, communities, isManagerView = false }: MasterCalendarProps) {
  const [activeTab, setActiveTab] = useState<'calendar' | 'list' | 'community'>('list');
  const [selectedCommunity, setSelectedCommunity] = useState<string>('all');

  const filteredEvents = events.filter((evt) => {
    // Hide closed status from public unless isManagerView is true
    if (!isManagerView && evt.status === 'closed') return false;

    if (selectedCommunity === 'all') return true;
    return evt.community.toLowerCase().includes(selectedCommunity.toLowerCase());
  });

  return (
    <div className="w-full space-y-6">
      {/* Controls Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
        {/* View Switcher Toggles */}
        <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'list'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ListFilter className="w-4 h-4" />
            <span>Date Order List</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'calendar'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Calendar View</span>
          </button>

          <button
            onClick={() => setActiveTab('community')}
            className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'community'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Community Filter</span>
          </button>
        </div>

        {/* Community Dropdown filter when in Community tab */}
        {activeTab === 'community' && (
          <select
            value={selectedCommunity}
            onChange={(e) => setSelectedCommunity(e.target.value)}
            className="bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 w-full sm:w-auto"
          >
            <option value="all">All Communities</option>
            {communities.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* View Content */}
      {activeTab === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="group relative rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase font-semibold text-cyan-400 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/50">
                    {evt.category}
                  </span>
                  {evt.status === 'closed' ? (
                    <span className="text-[10px] uppercase font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/50 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Draft Slot
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/50 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Live
                    </span>
                  )}
                </div>

                <h4 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                  {evt.title}
                </h4>

                <p className="text-sm text-slate-400 line-clamp-2 mb-4">
                  {evt.description || 'Join us for an exciting community gathering and technical session.'}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="font-medium text-slate-300">{evt.community}</span>
                <span className="text-slate-500">{evt.date}</span>
                <Link
                  href={`/events/${evt.id}`}
                  className="p-2 rounded-lg bg-slate-800 text-white hover:bg-blue-600 transition-colors"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-4">
          <CalendarIcon className="w-12 h-12 text-blue-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">Master Calendar Overview</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Interactive month grid displaying all upcoming campus events and reserved slots.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left pt-4">
            {filteredEvents.map((evt) => (
              <div key={evt.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start space-x-3">
                <div className="p-3 rounded-lg bg-blue-950 text-blue-400 font-bold text-center leading-tight">
                  <span className="text-xs uppercase">{evt.date.split('-')[1]}</span>
                  <div className="text-lg">{evt.date.split('-')[2]}</div>
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{evt.title}</div>
                  <div className="text-xs text-slate-400">{evt.community}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'community' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {communities.map((c) => {
            const commEvents = filteredEvents.filter(
              (e) => e.community.toLowerCase() === c.name.toLowerCase()
            );
            return (
              <div key={c.id} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${c.color} flex items-center justify-center text-white font-bold`}>
                    {c.initials}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{c.name}</h3>
                    <span className="text-xs text-slate-400">{commEvents.length} events scheduled</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  {commEvents.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No events published yet.</p>
                  ) : (
                    commEvents.map((e) => (
                      <Link
                        key={e.id}
                        href={`/events/${e.id}`}
                        className="block p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800/80 transition-colors border border-slate-800/60 flex items-center justify-between"
                      >
                        <span className="text-sm text-slate-200 font-medium">{e.title}</span>
                        <span className="text-xs text-slate-400">{e.date}</span>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
