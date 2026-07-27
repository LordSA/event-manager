'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Users, Calendar, Building, LayoutDashboard, LogOut } from 'lucide-react';
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

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard, roleRequired: ['dev', 'admin', 'manager', 'editor'] },
    { label: 'Event Booking', href: '/admin/events', icon: Calendar, roleRequired: ['dev', 'admin', 'manager', 'editor'] },
    { label: 'User Roles', href: '/admin/users', icon: Users, roleRequired: ['dev', 'admin', 'manager'] },
    { label: 'Communities', href: '/admin/communities', icon: Building, roleRequired: ['dev', 'admin'] },
  ];

  return (
    <div className="min-h-screen bg-[#05070E] text-white flex flex-col md:flex-row">
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex w-64 bg-slate-950 border-r border-slate-800 p-6 flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl text-white shadow-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-white">Whats @CEV</h2>
              <span className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                {currentRole} Access
              </span>
            </div>
          </div>

          <nav className="space-y-1 pt-4">
            {navItems.map((item) => {
              if (!item.roleRequired.includes(currentRole)) return null;
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 space-y-3">
          <Link
            href="/"
            className="flex items-center justify-between text-xs text-slate-400 hover:text-white transition-colors"
          >
            <span>Public Front-End</span>
            <LogOut className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* Mobile Quick Admin Sub-Navigation Pills */}
      <div className="flex md:hidden overflow-x-auto p-4 gap-2 border-b border-slate-800/80 bg-slate-950/60 no-scrollbar">
        {navItems.map((item) => {
          if (!item.roleRequired.includes(currentRole)) return null;
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Main Admin Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 pb-24 md:pb-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
