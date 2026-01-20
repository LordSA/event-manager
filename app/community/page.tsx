"use client";
import { useState } from "react";
import Link from "next/link";
import { communities } from "@/app/lib/data";

export default function CommunityPage() {
  const [search, setSearch] = useState("");

  const filteredCommunities = communities.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500 selection:text-white">
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16 border-b border-gray-800 pb-8">
          <div className="flex-1">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
              Campus <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Communities</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl">
              Join the vibrant student organizations at CEV. Connect, learn, and grow with like-minded peers.
            </p>
          </div>

          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input
              type="text"
              placeholder="Search communities..."
              className="w-full bg-gray-900/50 border border-gray-800 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder-gray-600"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCommunities.map((comm) => (
            <Link key={comm.id} href={`/community/${comm.id}`} className="group block h-full">
              <div className="bg-[#0A0A0A] border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition-all duration-300 h-full flex flex-col hover:shadow-2xl hover:shadow-blue-900/10">
                
                <div className="relative w-full aspect-[1080/1350] overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${comm.color} opacity-80 group-hover:opacity-100 transition-all duration-700 ease-out`} />
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-9xl font-extrabold text-white/20 group-hover:text-white/30 transition-colors select-none">
                        {comm.initials}
                    </span>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent"></div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col">
                      <h2 className="text-3xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors drop-shadow-lg">
                        {comm.name}
                      </h2>
                      
                      <p className="text-gray-300 text-sm leading-relaxed mb-6 line-clamp-3">
                        {comm.description}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-700/50 mt-auto">
                        <span className="text-xs font-medium text-gray-400">
                          View Profile
                        </span>
                        <span className="flex items-center gap-2 text-sm font-semibold text-white group-hover:gap-3 transition-all">
                          Join Us <span className="text-blue-500">→</span>
                        </span>
                      </div>
                  </div>
                </div>

              </div>
            </Link>
          ))}

          {filteredCommunities.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-500">
              No communities found matching "{search}"
            </div>
          )}
        </div>

      </div>
    </div>
  );
}