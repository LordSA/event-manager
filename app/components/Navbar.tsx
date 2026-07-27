'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, ShieldCheck, LogOut, User as UserIcon, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { UserRole } from '@/types/database.types';

export default function Navbar() {
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Check active session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);

          // Fetch profile role
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (profile) setRole(profile.role);
        } else {
          setUser(null);
          setRole(null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Realtime auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        if (profile) setRole(profile.role);
      } else {
        setUser(null);
        setRole(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-purple-600 text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-cyan-400 transition-colors">
              Whats @CEV
            </span>
            <span className="hidden sm:inline-block text-[10px] uppercase font-bold text-slate-400 ml-2 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
              Event Manager
            </span>
          </div>
        </Link>

        {/* Links & User Controls */}
        <div className="flex items-center space-x-4">
          <Link
            href="/events"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Discover Events</span>
          </Link>

          {!loading && user ? (
            <div className="flex items-center space-x-3 pl-2 border-l border-slate-800">
              <Link
                href="/admin"
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-white transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                <span>Dashboard</span>
                {role && (
                  <span className="uppercase text-[9px] font-bold text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800">
                    {role}
                  </span>
                )}
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-900 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Admin Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}