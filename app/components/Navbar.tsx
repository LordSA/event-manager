'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { UserRole } from '@/types/database.types';

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);

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
      } catch {
        setUser(null);
        setRole(null);
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

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Calendar', href: '/calendar' },
    { label: 'Events', href: '/events' },
    { label: 'Communities', href: '/community' },
  ];

  if (user && role) {
    navLinks.push({ label: 'Dashboard', href: '/admin' });
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-base tracking-tight text-white">
            Whats @CEV
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-1 sm:space-x-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-xs sm:text-sm font-medium transition-colors px-2 py-1 rounded-md ${
                  isActive
                    ? 'text-white font-semibold bg-neutral-800'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {user && (
            <div className="flex items-center space-x-2 pl-3 border-l border-neutral-800">
              <span className="hidden sm:inline-block uppercase text-[10px] font-bold text-neutral-300 bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700">
                {role}
              </span>
              <button
                onClick={handleLogout}
                className="p-1.5 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}