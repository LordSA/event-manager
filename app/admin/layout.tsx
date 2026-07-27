'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Users, Calendar, Building, LayoutDashboard, LogOut } from 'lucide-react';
import { UserRole } from '@/types/database.types';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Simulated active user role (defaults to dev/admin for dashboard showcase)
  const [currentRole] = useState<UserRole>('admin');

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard, roleRequired: ['dev', 'admin', 'manager', 'editor'] },
    { label: 'User Roles', href: '/admin/users', icon: Users, roleRequired: ['dev', 'admin'] },
    { label: 'Communities', href: '/admin/communities', icon: Building, roleRequired: ['dev', 'admin', 'manager'] },
    { label: 'Event Booking', href: '/admin/events', icon: Calendar, roleRequired: ['dev', 'admin', 'manager', 'editor'] },
  ];

  return (
    <div className="min-h-screen bg-[#05070E] text-white flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-950 border-b md:border-b-0 md:border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
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

      {/* Main Admin Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
