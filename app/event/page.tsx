"use client";
import { useState } from "react";
import { events } from "@/app/lib/data";
import Link from "next/link";

export default function AllEventsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Get unique categories for filter buttons
  const categories = ["All", ...Array.from(new Set(events.map(e => e.category)))];

  // Filter Logic
  const filteredEvents = events.filter((e) => {
    const matchesSearch = 
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.community?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || e.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500 selection:text-white">
      
      {/* 1. Navbar Added Here */}

      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16 border-b border-gray-800 pb-8">
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
              Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Events</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl">
              Discover local tech meetups, music festivals, and community gatherings.
              Chat with our AI to get instant details.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input
              type="text"
              placeholder="Search by title or community..."
              className="w-full bg-gray-900/50 border border-gray-800 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder-gray-600"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-white text-black shadow-lg shadow-white/10"
                  : "bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white border border-gray-800"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`} className="group block h-full">
                <div className="relative h-full bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-3xl p-1 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-900/10 hover:border-blue-500/30">
                  
                  {/* Card Inner Content */}
                  <div className="bg-[#0A0A0A] rounded-[22px] p-6 h-full flex flex-col relative z-10">
                    
                    {/* Top Row: Date & Badge */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                          {event.category}
                        </span>
                        {event.community && (
                          <span className="text-xs font-semibold text-blue-400">
                            By {event.community}
                          </span>
                        )}
                      </div>
                      <div className="bg-gray-800/50 border border-gray-700 px-3 py-1 rounded-lg text-xs font-mono text-gray-300">
                        {event.date}
                      </div>
                    </div>

                    {/* Title & Desc */}
                    <h2 className="text-2xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">
                      {event.title}
                    </h2>
                    <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-1">
                      {event.description}
                    </p>

                    {/* Footer Action */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-800/50 mt-auto">
                      <div className="flex -space-x-2">
                         {/* Fake Avatars for social proof effect */}
                         <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-[#0A0A0A]"></div>
                         <div className="w-8 h-8 rounded-full bg-gray-600 border-2 border-[#0A0A0A]"></div>
                         <div className="w-8 h-8 rounded-full bg-gray-500 border-2 border-[#0A0A0A] flex items-center justify-center text-[10px] font-bold">+</div>
                      </div>
                      <span className="flex items-center gap-2 text-sm font-semibold text-white group-hover:gap-3 transition-all">
                        Chat with AI <span className="text-blue-500">→</span>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No events found</h3>
              <p className="text-gray-500">Try adjusting your search or category filter.</p>
              <button 
                onClick={() => {setSearch(""); setSelectedCategory("All")}}
                className="mt-6 text-blue-400 hover:text-blue-300 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}