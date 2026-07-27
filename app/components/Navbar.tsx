'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calendar,
  ShieldCheck,
  LogOut,
  User as UserIcon,
  Sparkles,
  Home,
  Building,
  PlusCircle,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { UserRole } from '@/types/database.types';

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
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
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

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

  const mobileNavTabs = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Events', href: '/events', icon: Sparkles },
    { label: 'Slots', href: '/admin/events', icon: PlusCircle },
    { label: 'Communities', href: '/admin/communities', icon: Building },
    { label: user ? 'Dashboard' : 'Login', href: user ? '/admin' : '/login', icon: user ? ShieldCheck : UserIcon },
  ];

  return (
    <>
      {/* Desktop & Mobile Header Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
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

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/events"
              className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                pathname === '/events' ? 'text-cyan-400 font-bold' : 'text-slate-300 hover:text-white'
              }`}
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

          {/* Mobile Right Status Badge */}
          <div className="flex md:hidden items-center space-x-2">
            {!loading && user ? (
              <Link
                href="/admin"
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs font-bold"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="uppercase text-[10px]">{role || 'User'}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/20"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile App UI Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-2xl border-t border-slate-800/80 px-2 py-2 shadow-[0_-10px_25px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-around">
          {mobileNavTabs.map((tab) => {
            const isActive = pathname === tab.href;
            const Icon = tab.icon;
            return (
              <Link
                key={tab.label}
                href={tab.href}
                className={`flex flex-col items-center justify-center w-full py-1 rounded-xl transition-all relative ${
                  isActive ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <span className="absolute -top-2 w-8 h-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-md shadow-cyan-400/50" />
                )}
                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'scale-110' : ''} transition-transform`} />
                <span className={`text-[10px] tracking-tight ${isActive ? 'font-bold text-white' : 'font-medium'}`}>
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}