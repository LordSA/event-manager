"use client";
import { useParams } from "next/navigation";
import { communities, events } from "@/app/lib/data"; // Import both lists
import Navbar from "@/app/components/Navbar";
import Link from "next/link";

export default function SingleCommunityPage() {
  // 1. Get the ID from the URL (e.g., "ieee")
  const params = useParams();
  const id = params?.id as string;

  // 2. Find the Community details (Name, Color, Description)
  const community = communities.find((c) => c.id === id);

  // 3. Find the Events that belong to this Community
  // We compare the event's "community" field to this community's "name"
  const communityEvents = events.filter((e) => e.community === community?.name);

  // Safety check: If someone types a random URL like /community/potato
  if (!community) {
    return <div className="text-white text-center pt-40">Community not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500 selection:text-white">

      {/* --- PART A: HERO SECTION (Community Info) --- */}
      <div className="relative pt-32 pb-12 overflow-hidden border-b border-gray-900">
        
        {/* Glow Effect matching community color */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-r ${community.color} opacity-20 blur-[120px] -z-10`} />

        <div className="max-w-4xl mx-auto px-6 text-center">
          {/* Logo Box */}
          <div className={`w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br ${community.color} flex items-center justify-center mb-6 shadow-2xl`}>
             <span className="text-4xl font-bold text-white">{community.initials}</span>
          </div>
          
          <h1 className="text-5xl font-extrabold mb-4">{community.name}</h1>
          <p className="text-xl text-gray-400 leading-relaxed">{community.description}</p>
        </div>
      </div>

      {/* --- PART B: EVENTS GRID (Only their events) --- */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-8 text-gray-200">
            Upcoming Events by {community.name}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {communityEvents.length > 0 ? (
            communityEvents.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`} className="group block h-full">
                <div className="bg-[#0A0A0A] border border-gray-800 rounded-3xl p-6 h-full hover:border-gray-600 hover:scale-[1.02] transition-all">
                    <div className="flex justify-between items-start mb-4">
                       <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                         {event.category}
                       </span>
                       <span className="text-xs font-mono text-gray-400 border border-gray-800 px-2 py-1 rounded">
                         {event.date}
                       </span>
                    </div>

                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-6">
                      {event.description}
                    </p>

                    <div className="mt-auto pt-4 border-t border-gray-800 flex items-center gap-2 text-sm font-semibold text-white">
                        Ask AI about this event <span className="text-blue-500">→</span>
                    </div>
                </div>
              </Link>
            ))
          ) : (
            /* Show this if they have 0 events */
            <div className="col-span-full py-12 text-center border border-dashed border-gray-800 rounded-xl">
                <p className="text-gray-500">No events scheduled yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}