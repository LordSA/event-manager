"use client";

import { use, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft, Calendar, MessageSquare } from "lucide-react";

interface PageParams {
  id: string;
}

export default function SingleCommunityPage({ params }: { params: Promise<PageParams> }) {
  const resolvedParams = use(params);
  const communityId = resolvedParams.id;

  const [community, setCommunity] = useState<any>(null);
  const [communityEvents, setCommunityEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        const supabase = createClient();
        
        // Fetch community record
        const { data: commData } = await supabase
          .from("communities")
          .select("*")
          .or(`id.eq.${communityId},slug.eq.${communityId}`)
          .single();

        if (commData) {
          setCommunity(commData);

          // Fetch associated live events
          const { data: evtsData } = await supabase
            .from("events")
            .select("*")
            .eq("community_id", commData.id)
            .eq("status", "live")
            .order("event_date", { ascending: true });

          if (evtsData) {
            setCommunityEvents(evtsData);
          }
        }
      } catch (err) {
        console.error("Error fetching community:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityData();
  }, [communityId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center text-sm">
        Loading community details...
      </div>
    );
  }

  if (!community) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center space-y-4">
        <p className="text-gray-400">Community not found.</p>
        <Link href="/community" className="text-sm text-blue-400 hover:underline">
          &larr; Back to Communities
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500 selection:text-white pb-20 md:pb-12">
      {/* Header */}
      <div className="relative pt-24 pb-12 overflow-hidden border-b border-gray-900">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-r ${community.color || 'from-blue-600 to-cyan-400'} opacity-20 blur-[120px] -z-10`} />

        <div className="max-w-4xl mx-auto px-6 text-center space-y-4">
          <Link href="/community" className="inline-flex items-center space-x-2 text-xs text-slate-400 hover:text-white transition-colors mb-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Communities</span>
          </Link>

          <div className={`w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br ${community.color || 'from-blue-600 to-cyan-400'} flex items-center justify-center shadow-2xl`}>
            <span className="text-4xl font-bold text-white">
              {community.initials || community.name.slice(0, 2).toUpperCase()}
            </span>
          </div>

          <h1 className="text-5xl font-extrabold">{community.name}</h1>
          <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
            {community.description}
          </p>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
        <h2 className="text-2xl font-bold text-gray-200">
          Events by {community.name}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {communityEvents.length > 0 ? (
            communityEvents.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`} className="group block h-full">
                <div className="bg-[#0A0A0A] border border-gray-800 rounded-3xl p-6 h-full hover:border-gray-600 transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                        {event.category || 'Workshop'}
                      </span>
                      <span className="text-xs font-mono text-gray-400 border border-gray-800 px-2 py-1 rounded">
                        {event.event_date}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {event.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-800 flex items-center justify-between text-xs font-semibold text-slate-300">
                    <span className="flex items-center gap-1.5 text-cyan-400">
                      <MessageSquare className="w-3.5 h-3.5" />
                      Event Assistant
                    </span>
                    <span className="text-blue-500">&rarr;</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-12 text-center border border-dashed border-gray-800 rounded-2xl text-gray-500">
              No live events currently published for {community.name}.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}