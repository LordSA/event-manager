"use client";
import { useState } from "react";
import { events } from "@/app/lib/data";
import Link from "next/link";

export default function AllEventsPage() {
  const [search, setSearch] = useState("");

  // Filter events based on search input (checks Title or Community name)
  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.community?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white p-8 md:p-12 font-sans">
      
      {/* Header & Search */}
      <div className="max-w-6xl mx-auto mb-12 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            All Upcoming Events
          </h1>
          <p className="text-gray-400 mt-2">Find your next experience.</p>
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search events or communities..."
          className="bg-gray-900 border border-gray-800 text-white px-4 py-3 rounded-full w-full md:w-80 focus:outline-none focus:border-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`} className="group">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 h-full hover:border-blue-600 hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-300 flex flex-col">
                
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs font-bold uppercase px-2 py-1 rounded bg-blue-900/30 text-blue-400 border border-blue-900">
                    {event.category}
                  </span>
                  {event.community && (
                    <span className="text-xs font-bold uppercase px-2 py-1 rounded bg-purple-900/30 text-purple-400 border border-purple-900">
                      By {event.community}
                    </span>
                  )}
                </div>

                {/* Content */}
                <h2 className="text-2xl font-bold group-hover:text-blue-400 transition-colors">
                  {event.title}
                </h2>
                <p className="text-gray-400 mt-3 text-sm flex-1">
                  {event.description}
                </p>

                {/* Footer (Date & Arrow) */}
                <div className="mt-6 pt-4 border-t border-gray-800 flex justify-between items-center text-sm text-gray-500">
                  <span>📅 {event.date}</span>
                  <span className="group-hover:translate-x-1 transition-transform text-white">
                    Join Chat →
                  </span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-gray-500">
            No events found matching "{search}"
          </div>
        )}
      </div>
    </div>
  );
}