'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Users, Calendar, Building, LayoutDashboard, User, LogOut, ExternalLink } from 'lucide-react';
import { UserRole } from '@/types/database.types';
import { createClient } from '@/lib/supabase/client';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [currentRole, setCurrentRole] = useState<UserRole>('editor');

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (profile?.role) {
            setCurrentRole(profile.role);
          }
        }
      } catch {
        // Fallback
      }
    };

    fetchUserRole();
  }, []);

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.href = '/login';
    } catch {
      window.location.href = '/login';
    }
  };

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard, roleRequired: ['dev', 'admin', 'manager', 'editor'] },
    { label: 'Event Booking', href: '/admin/events', icon: Calendar, roleRequired: ['dev', 'admin', 'manager', 'editor'] },
    { label: 'My Community', href: '/admin/my-community', icon: Building, roleRequired: ['manager', 'editor'] },
    { label: 'User Roles', href: '/admin/users', icon: Users, roleRequired: ['dev', 'admin', 'manager'] },
    { label: 'Communities', href: '/admin/communities', icon: Building, roleRequired: ['dev', 'admin'] },
    { label: 'Profile', href: '/admin/profile', icon: User, roleRequired: ['dev', 'admin', 'manager', 'editor'] },
  ];

  return (
    <div className="min-h-screen bg-[#08090d] text-[#f8fafc] flex flex-col md:flex-row font-sans">
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex w-64 bg-[#0f121d] border-r border-[#1e2436] p-6 flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#6366f1] border border-[#4f46e5] rounded-lg text-white shadow-[2px_2px_0px_0px_#312e81]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white font-display">Whats @CEV</h2>
              <span className="text-[10px] uppercase font-bold text-white bg-[#6366f1] px-2 py-0.5 rounded border border-[#4f46e5] font-mono">
                {currentRole} Access
              </span>
            </div>
          </div>

          <nav className="space-y-1.5 pt-4">
            {navItems.map((item) => {
              if (!item.roleRequired.includes(currentRole)) return null;
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all border ${
                    isActive
                      ? 'bg-[#6366f1] text-white border-[#4f46e5] shadow-[3px_3px_0px_0px_#312e81]'
                      : 'text-[#94a3b8] hover:text-white hover:bg-[#161a29] border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-heading">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-[#1e2436] space-y-2">
          <Link
            href="/"
            className="flex items-center justify-between text-xs text-[#94a3b8] hover:text-white transition-colors py-2 px-1 font-semibold"
          >
            <span>Home</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </Link>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-between text-xs text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-lg py-2 px-1 font-semibold transition-colors"
          >
            <span>Sign Out</span>
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* Mobile Sub-Navigation Header */}
      <div className="flex md:hidden items-center justify-between overflow-x-auto pt-4 pb-3 px-4 gap-2 border-b border-[#1e2436] bg-[#0f121d] scrollbar-hide shrink-0">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {navItems.map((item) => {
            if (!item.roleRequired.includes(currentRole)) return null;
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold shrink-0 border ${
                  isActive
                    ? 'bg-[#6366f1] text-white border-[#4f46e5] shadow-[2px_2px_0px_0px_#312e81]'
                    : 'bg-[#161a29] text-[#94a3b8] border-[#1e2436]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="font-heading">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <button
          onClick={handleSignOut}
          className="p-2 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs shrink-0 flex items-center gap-1 font-semibold"
          title="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Admin Content Container */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
