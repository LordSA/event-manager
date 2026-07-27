'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, ListFilter, Users, ArrowUpRight, Lock, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';

export interface EventItemData {
  id: string;
  title: string;
  category: string;
  community: string;
  date: string;
  time_slot?: string;
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
    return evt.community.toLowerCase() === selectedCommunity.toLowerCase();
  });

  return (
    <div className="space-y-8">
      {/* Top Header & View Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-blue-400" />
            Master Schedule & Conflict Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Realtime multi-community calendar preventing slot conflicts across campus organizations.
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center space-x-1 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
              activeTab === 'list'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Timeline Order</span>
          </button>

          <button
            onClick={() => setActiveTab('community')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
              activeTab === 'community'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>By Community</span>
          </button>
        </div>
      </div>

      {/* Community Filter Pills */}
      {activeTab === 'community' && (
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setSelectedCommunity('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
              selectedCommunity === 'all'
                ? 'bg-white text-slate-950 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Communities
          </button>
          {communities.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCommunity(c.name)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                selectedCommunity.toLowerCase() === c.name.toLowerCase()
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Events List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500 text-sm bg-slate-900/40 border border-slate-800 rounded-3xl space-y-2">
            <p className="font-semibold text-slate-300">No scheduled events found.</p>
            <p className="text-xs">No slot bookings match the selected community filter.</p>
          </div>
        ) : (
          filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all space-y-4 flex flex-col justify-between shadow-xl relative overflow-hidden group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                    {evt.category}
                  </span>

                  {isManagerView && evt.status === 'closed' ? (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 border border-amber-800 px-2 py-0.5 rounded flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Draft Slot
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Live
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {evt.title}
                  </h3>
                  {evt.description && (
                    <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {evt.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Time Slot & Date Badge */}
              <div className="pt-4 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">{evt.community}</span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <CalendarIcon className="w-3.5 h-3.5 text-blue-400" />
                    {evt.date}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-cyan-400 font-mono text-[11px] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    {evt.time_slot || '10:00 AM - 04:00 PM'}
                  </span>

                  <Link
                    href={`/events/${evt.id}`}
                    className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                  >
                    <span>Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
