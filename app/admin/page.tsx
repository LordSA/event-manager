'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, Users, Building, ShieldCheck, CheckCircle2, Lock, ArrowUpRight, User } from 'lucide-react';
import Link from 'next/link';
import { useRealtimeEvents } from '@/lib/hooks/useRealtimeEvents';
import { useCommunities } from '@/lib/hooks/useCommunities';
import { createClient } from '@/lib/supabase/client';
import { UserRole } from '@/types/database.types';

export default function AdminDashboardPage() {
  const { eventsList } = useRealtimeEvents();
  const { communities } = useCommunities();

  const [role, setRole] = useState<UserRole>('editor');
  const [communityId, setCommunityId] = useState<string | null>(null);
  const [communityName, setCommunityName] = useState<string>('My Community');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role, community_id, community:communities(name)')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setRole(profile.role);
            setCommunityId(profile.community_id || null);
            if ((profile as any).community?.name) {
              setCommunityName((profile as any).community.name);
            }
          }
        }
      } catch {
        // Fallback
      }
    };

    fetchProfile();
  }, []);

  const isScoped = role === 'manager' || role === 'editor';

  // Filter events and communities based on user role
  const filteredEvents = eventsList.filter((e) => {
    if (!isScoped || !communityId) return true;
    const targetComm = communities.find((c) => c.id === communityId);
    return e.community === targetComm?.name;
  });

  const liveCount = filteredEvents.filter((e) => e.status === 'live').length;
  const draftCount = filteredEvents.filter((e) => e.status === 'closed').length;

  return (
    <div className="space-y-8 pb-20 md:pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          {isScoped ? `${communityName} Overview` : 'Campus Dashboard Overview'}
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          {isScoped
            ? `Overview metrics, slot reservations, and event status for ${communityName}.`
            : 'System health, slot bookings, dynamic RBAC metrics, and multi-community publishing stats.'}
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
          <p className="text-xs text-slate-500">
            {isScoped ? `Published by ${communityName}` : 'Publicly visible across campus'}
          </p>
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
            <span className="text-xs uppercase font-semibold">
              {isScoped ? 'My Organization' : 'Communities'}
            </span>
            <Building className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-extrabold text-white truncate">
            {isScoped ? communityName : `${communities.length} Active`}
          </div>
          <p className="text-xs text-slate-500">
            {isScoped ? 'Assigned campus community' : 'IEEE, IEDC, TinkerHub, FOSS, MuLearn'}
          </p>
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

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              Slot Booking Engine
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Reserve dates and time slots for your community events (`closed` draft state) to prevent overlaps.
            </p>
          </div>
          <Link
            href="/admin/events"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors w-fit"
          >
            <span>Manage Events</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {role !== 'editor' && (
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-cyan-400" />
                My Community
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Update community profile bio, accent gradients, initials badge, and theme details.
              </p>
            </div>
            <Link
              href="/admin/my-community"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors w-fit"
            >
              <span>Community Details</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-purple-400" />
              My Account Profile
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Update your personal full name, profile picture, and auth password.
            </p>
          </div>
          <Link
            href="/admin/profile"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors w-fit"
          >
            <span>Edit Profile</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
