'use client';

import React from 'react';
import Navbar from '@/app/components/Navbar';
import HeroCanvas from '@/app/components/HeroCanvas';
import { communities, events } from '@/app/lib/data';
import { ArrowRight, Sparkles, Calendar, ShieldCheck, Zap, Bot } from 'lucide-react';
import Link from 'next/link';

export default function LandingHomePage() {
  return (
    <div className="min-h-screen bg-[#05070E] text-white flex flex-col relative overflow-hidden">
      {/* Three.js / WebGL Particle Canvas */}
      <HeroCanvas />

      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pb-24 space-y-24">
        {/* Hero Section */}
        <section className="text-center space-y-8 max-w-4xl mx-auto pt-8">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-950/80 border border-blue-800/60 text-xs font-bold text-cyan-400 backdrop-blur-md shadow-lg shadow-blue-500/10">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Multi-Community Publishing & AI Discovery</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
            The Campus Event Hub for <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">Every Community</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Centralizing event discovery across IEEE, IEDC, TinkerHub, FOSS, and MuLearn. Slot booking for community leads, and instant AI assistance for attendees.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/events"
              className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-95 text-white font-bold text-base shadow-xl shadow-blue-500/25 flex items-center justify-center space-x-3 transition-all"
            >
              <span>Explore Events</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-white font-semibold text-base border border-slate-800 backdrop-blur-md transition-all flex items-center justify-center space-x-2"
            >
              <ShieldCheck className="w-5 h-5 text-purple-400" />
              <span>Admin / Lead Portal</span>
            </Link>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-xl space-y-4 hover:border-blue-500/50 transition-colors">
            <div className="p-3 w-fit rounded-2xl bg-blue-950 text-blue-400 border border-blue-800">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Slot Booking Engine</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Reserve dates in `closed` draft state to prevent date collisions across campus communities before publishing `live`.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-xl space-y-4 hover:border-purple-500/50 transition-colors">
            <div className="p-3 w-fit rounded-2xl bg-purple-950 text-purple-400 border border-purple-800">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Multi-Provider Fallback AI</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Resilient query pipeline fallback (Gemini $\rightarrow$ Grok $\rightarrow$ OpenRouter) answering attendee questions about prerequisites and rules.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-xl space-y-4 hover:border-cyan-500/50 transition-colors">
            <div className="p-3 w-fit rounded-2xl bg-cyan-950 text-cyan-400 border border-cyan-800">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Dynamic RBAC Security</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              4-tier permissions matrix (Dev, Admin, Manager, Editor) secured at Supabase Row-Level Security layer.
            </p>
          </div>
        </section>

        {/* Communities Section */}
        <section className="space-y-8 text-center">
          <div>
            <h2 className="text-3xl font-extrabold text-white">Participating Campus Communities</h2>
            <p className="text-slate-400 text-sm mt-2">Discover technical sessions, hackathons, and workshops by organization.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {communities.map((c) => (
              <div
                key={c.id}
                className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-md flex flex-col items-center text-center space-y-3 hover:border-slate-700 transition-all"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${c.color} flex items-center justify-center text-white font-extrabold text-lg shadow-lg`}>
                  {c.initials}
                </div>
                <h3 className="font-bold text-white text-base">{c.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{c.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Events */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-extrabold text-white">Featured Live Events</h2>
            <Link href="/events" className="text-sm text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.slice(0, 3).map((evt) => (
              <div
                key={evt.id}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-blue-500/50 transition-colors"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded-full border border-cyan-800">
                    {evt.category}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-3">{evt.title}</h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">{evt.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>{evt.community}</span>
                  <Link href={`/events/${evt.id}`} className="text-blue-400 font-bold hover:underline">
                    Details &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 text-center text-xs text-slate-500 relative z-10">
        <p>Whats @CEV - Multi-Community Event Publishing Platform</p>
      </footer>
    </div>
  );
}