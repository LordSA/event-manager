"use client";
import { useState } from "react";
import { events } from "@/app/lib/data";
import Link from "next/link";
import Image from "next/image";

export default function AllEventsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(events.map(e => e.category)))];

  const filteredEvents = events.filter((e) => {
    const matchesSearch = 
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.community?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || e.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500 selection:text-white">
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12 border-b border-gray-800 pb-8">
          <div className="flex-1">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
              Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Events</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl">
              Discover local tech meetups, music festivals, and community gatherings.
            </p>
          </div>

          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input
              type="text"
              placeholder="Search events..."
              className="w-full bg-gray-900/50 border border-gray-800 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder-gray-600"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-3 mb-12 flex-wrap pb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 border ${
                selectedCategory === cat
                  ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  : "bg-gray-900/50 text-gray-400 border-gray-800 hover:border-gray-600 hover:text-white"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`} className="group block h-full">
                <div className="bg-[#0A0A0A] border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition-all duration-300 h-full flex flex-col hover:shadow-2xl hover:shadow-blue-900/10">
                  
                  <div className="relative w-full aspect-[1080/1350] overflow-hidden">
                    <Image 
                      src={event.image || "/images/placeholder.jpg"} 
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-60"></div>

                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-mono font-bold border border-white/10 shadow-lg">
                        {event.date}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1 relative">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-wider bg-blue-900/10 px-2 py-1 rounded border border-blue-900/20">
                        {event.category}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                      {event.title}
                    </h2>
                    
                    <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-800/50 mt-auto">
                      {event.community ? (
                         <span className="text-xs font-medium text-gray-300 flex items-center gap-1">
                           <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                           {event.community}
                         </span>
                      ) : <span></span>}
                      
                      <span className="flex items-center gap-2 text-sm font-semibold text-white group-hover:gap-3 transition-all">
                        View Details <span className="text-blue-500">→</span>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-32 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-gray-900/50 rounded-full flex items-center justify-center mb-6 border border-gray-800">
                <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No events found</h3>
              <p className="text-gray-500 max-w-sm mx-auto mb-8">We couldn't find any events matching your search or category.</p>
              <button 
                onClick={() => {setSearch(""); setSelectedCategory("All")}}
                className="px-6 py-3 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}