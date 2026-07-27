'use client';

import React from 'react';
import { Calendar, Users, Building, ShieldCheck, CheckCircle2, Lock, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useRealtimeEvents } from '@/lib/hooks/useRealtimeEvents';
import { useCommunities } from '@/lib/hooks/useCommunities';

export default function AdminDashboardPage() {
  const { eventsList } = useRealtimeEvents();
  const { communities } = useCommunities();

  const liveCount = eventsList.filter((e) => e.status === 'live').length;
  const draftCount = eventsList.filter((e) => e.status === 'closed').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard Overview</h1>
        <p className="text-sm text-slate-400 mt-1">
          System health, slot bookings, dynamic RBAC metrics, and community publishing stats.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase font-semibold">Live Events</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{liveCount}</div>
          <p className="text-xs text-slate-500">Publicly visible across campus</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase font-semibold">Draft Slots</span>
            <Lock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{draftCount}</div>
          <p className="text-xs text-slate-500">Reserved on master calendar</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase font-semibold">Communities</span>
            <Building className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{communities.length}</div>
          <p className="text-xs text-slate-500">IEEE, IEDC, TinkerHub, FOSS, MuLearn</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase font-semibold">Event Assistant</span>
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-lg font-bold text-emerald-400">Gemini $\rightarrow$ Grok</div>
          <p className="text-xs text-slate-500">Automatic multi-provider failover</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            Slot Booking Engine
          </h3>
          <p className="text-sm text-slate-400">
            Reserve a date and time slot for your community event (`closed` draft state) to prevent overlaps with other campus organizations.
          </p>
          <Link
            href="/admin/events"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors"
          >
            <span>Manage & Book Slots</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            RBAC Access Control
          </h3>
          <p className="text-sm text-slate-400">
            Super Admins can invite leads, assign role privileges (`admin`, `manager`, `editor`), and tie managers to specific community entities.
          </p>
          <Link
            href="/admin/users"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-colors"
          >
            <span>User Accounts & Roles</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
