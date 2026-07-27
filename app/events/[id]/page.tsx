'use client';

import React, { useState, use } from 'react';
import Navbar from '@/app/components/Navbar';
import EventAiDrawer from '@/app/components/EventAiDrawer';
import { events } from '@/app/lib/data';
import { Calendar, MapPin, ExternalLink, Bot, ArrowLeft, Clock, Award, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface PageParams {
  id: string;
}

export default function DynamicEventPage({ params }: { params: Promise<PageParams> }) {
  const resolvedParams = use(params);
  const eventId = resolvedParams.id;

  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);

  // Lookup event by ID or slug
  const eventData = events.find((e) => e.id === eventId) || events[0];

  // Structured Data (JSON-LD) for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: eventData.title,
    startDate: eventData.date,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'College of Engineering Vadakara (CEV)',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Vadakara',
        addressRegion: 'Kerala',
        addressCountry: 'IN',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: eventData.community,
    },
    description: eventData.description,
  };

  return (
    <div className="min-h-screen bg-[#05070E] text-white flex flex-col relative">
      {/* Inject SEO JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        <Link
          href="/events"
          className="inline-flex items-center space-x-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Events</span>
        </Link>

        {/* Hero Card */}
        <div className="relative rounded-3xl bg-slate-900/60 border border-slate-800 p-6 sm:p-10 overflow-hidden shadow-2xl space-y-8">
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Info Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400">
                  {eventData.category}
                </span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-300 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  {eventData.community}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {eventData.title}
              </h1>

              <p className="text-base text-slate-300 leading-relaxed">
                {eventData.description}
              </p>

              {/* Event Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-sm text-slate-300">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Date</div>
                    <div className="font-bold">{eventData.date}</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Time Slot</div>
                    <div className="font-bold">10:00 AM - 4:00 PM</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Venue</div>
                    <div className="font-bold">Seminar Hall / CEV</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center space-x-3">
                  <Award className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Perks</div>
                    <div className="font-bold">KTU Points & Swag</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                {/* CTA 1: External Registration Redirect */}
                <a
                  href="https://forms.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-95 text-white font-bold text-base shadow-xl shadow-blue-500/25 flex items-center justify-center space-x-2 transition-all"
                >
                  <span>Register for Event</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                {/* CTA 2: Event AI Assistant */}
                <button
                  onClick={() => setAiDrawerOpen(true)}
                  className="flex-1 py-4 px-6 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-base border border-slate-800 flex items-center justify-center space-x-2 transition-all group"
                >
                  <Bot className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform" />
                  <span>Event AI Assistant</span>
                </button>
              </div>
            </div>

            {/* Right Poster Column */}
            <div className="lg:col-span-5 relative w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
              <Image
                src={eventData.image || '/images/bit.jpg'}
                alt={eventData.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
            </div>
          </div>
        </div>
      </main>

      {/* Interactive AI Drawer */}
      <EventAiDrawer
        isOpen={aiDrawerOpen}
        onClose={() => setAiDrawerOpen(false)}
        eventTitle={eventData.title}
        systemPrompt={eventData.ai_context || `Event: ${eventData.title}\nCommunity: ${eventData.community}`}
      />
    </div>
  );
}