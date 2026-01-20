import Link from "next/link";
import { events } from "@/app/lib/data";

export default function Home() {
  const interestedEvents = events.filter((e) => e.category === "community");
  const upcomingEvents = events;

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500 selection:text-white">
      
      <section className="relative overflow-hidden py-20 sm:py-32 lg:pb-32 xl:pb-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-800 text-blue-400 text-sm font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            AI-Powered Event Assistant
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Discover Events. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              Ask the AI.
            </span>
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto mb-10">
            Don't just read the FAQ. Chat with our intelligent agents to get instant answers about parking, schedules, and tickets for any event.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/events" 
              className="px-8 py-4 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-all hover:scale-105"
            >
              Browse All Events
            </Link>
            <Link 
              href="/community" 
              className="px-8 py-4 rounded-full bg-gray-900 border border-gray-700 hover:border-blue-500 text-white font-bold transition-all"
            >
              Join Community
            </Link>
          </div>
        </div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] -z-10"></div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center gap-2 mb-8">
          <h2 className="text-2xl font-bold text-white">❤️ Picked For You</h2>
          <span className="px-2 py-0.5 rounded text-xs bg-gray-800 text-gray-400 border border-gray-700">Based on 'Coding'</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {interestedEvents.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`} className="group relative block h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-8 h-full hover:border-blue-500/50 transition-all flex flex-col justify-between">
                <div>
                   <div className="flex justify-between items-start mb-4">
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-wider bg-blue-900/20 px-2 py-1 rounded">
                        {event.category}
                      </span>
                      <span className="text-gray-400 text-sm">🔥 Trending</span>
                   </div>
                   <h3 className="text-3xl font-bold mb-2 group-hover:text-blue-300 transition-colors">{event.title}</h3>
                   <p className="text-gray-400 line-clamp-2">{event.description}</p>
                </div>
                <div className="mt-6 flex items-center text-sm font-semibold text-white">
                  Chat Now <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12 border-t border-gray-900">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl font-bold text-white">📅 Upcoming Events</h2>
          <Link href="/events" className="text-blue-500 hover:text-blue-400 text-sm font-medium">View All →</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`} className="group">
              <div className="bg-[#0A0A0A] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition-all h-full flex flex-col">
                <div className="h-32 bg-gray-900 w-full relative">
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs font-mono border border-gray-700">
                        {event.date}
                    </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold mb-2 group-hover:text-blue-400">{event.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 flex-1 line-clamp-2">{event.description}</p>
                  
                  <div className="flex items-center gap-2 mt-auto">
                    {event.community && (
                        <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full">
                           By {event.community}
                        </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-20 border-t border-gray-900 bg-[#080808]">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
                <div className="w-12 h-12 bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🤖</div>
                <h3 className="font-bold text-lg mb-2">AI Concierge</h3>
                <p className="text-gray-500 text-sm">Every event gets a dedicated AI trained on its specific documents and rules.</p>
            </div>
            <div className="p-6">
                <div className="w-12 h-12 bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">⚡</div>
                <h3 className="font-bold text-lg mb-2">Instant Info</h3>
                <p className="text-gray-500 text-sm">No more searching through emails. Just ask "Where do I park?"</p>
            </div>
            <div className="p-6">
                <div className="w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🤝</div>
                <h3 className="font-bold text-lg mb-2">Community First</h3>
                <p className="text-gray-500 text-sm">Built for meetups, conferences, and local gigs.</p>
            </div>
         </div>
      </section>

    </main>
  );
}