'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
    <header className="sticky top-0 z-40 w-full border-b border-[#1e2436] bg-[#0f121d]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo - Uses logo.png */}
        <Link href="/" className="flex items-center space-x-3 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Whats @CEV"
            className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
          <span className="font-extrabold text-base tracking-tight text-white font-display">
            Whats @CEV
          </span>
        </Link>

        {/* Dynamic Role-Aware Links */}
        <nav className="flex items-center space-x-1 sm:space-x-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-xs sm:text-sm font-semibold transition-all px-3 py-1.5 rounded-md border ${
                  isActive
                    ? 'bg-[#6366f1] text-white border-[#4f46e5] shadow-[2px_2px_0px_0px_#312e81]'
                    : 'text-[#94a3b8] hover:text-white hover:bg-[#161a29] border-transparent'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}