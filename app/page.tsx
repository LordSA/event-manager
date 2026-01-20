import Link from "next/link";
import Image from "next/image";
import { events } from "@/app/lib/data";

export default function Home() {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const interestedEvents = events.filter((e) => e.category === "community" || e.category === "hackathon").slice(0, 2);

  const liveEvents = events.filter((e) => e.date === todayStr);
  
  const upcomingEvents = events
    .filter((e) => e.date > todayStr)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const pastEvents = events
    .filter((e) => e.date < todayStr)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

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
              Communities
            </Link>
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] -z-10"></div>
      </section>

      {liveEvents.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-2 mb-8">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <h2 className="text-2xl font-bold text-white">Happening Now</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {liveEvents.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`} className="group">
                <div className="bg-[#0A0A0A] border border-red-900/50 rounded-xl overflow-hidden hover:border-red-500 transition-all h-full flex flex-col shadow-lg shadow-red-900/20">
                  <div className="relative w-full aspect-[1080/1350] overflow-hidden">
                      <Image 
                        src={event.image || "/images/placeholder.jpg"} 
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">
                          LIVE
                      </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold mb-2 group-hover:text-red-400">{event.title}</h3>
                    <p className="text-gray-500 text-sm mb-4 flex-1 line-clamp-2">{event.description}</p>
                    <div className="flex items-center gap-2 mt-auto">
                      <span className="text-xs bg-red-900/20 text-red-400 px-2 py-1 rounded-full border border-red-900/30">
                          Join Now
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center gap-2 mb-8">
          <h2 className="text-2xl font-bold text-white">❤️ Picked For You</h2>
          <span className="px-2 py-0.5 rounded text-xs bg-gray-800 text-gray-400 border border-gray-700">Based on 'Coding'</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {interestedEvents.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`} className="group relative block h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
              
              <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-1 overflow-hidden h-full flex flex-col md:flex-row">
                 <div className="relative w-full md:w-2/5 aspect-[1080/1350] overflow-hidden rounded-xl">
                    <Image 
                      src={event.image || "/images/placeholder.jpg"} 
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                 </div>

                 <div className="p-6 flex flex-col justify-between md:w-3/5">
                    <div>
                        <div className="flex justify-between items-start mb-3">
                           <span className="text-xs font-bold text-blue-400 uppercase tracking-wider bg-blue-900/20 px-2 py-1 rounded">
                             {event.category}
                           </span>
                           <span className="text-gray-400 text-xs font-mono">{event.date}</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-300 transition-colors">{event.title}</h3>
                        <p className="text-gray-400 text-sm line-clamp-2">{event.description}</p>
                    </div>
                    <div className="mt-4 flex items-center text-sm font-semibold text-white">
                      Chat Now <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                 </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12 border-t border-gray-900">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl font-bold text-white">📅 Upcoming Events</h2>
          <Link href="/event" className="text-blue-500 hover:text-blue-400 text-sm font-medium">View All →</Link>
        </div>

        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`} className="group">
                <div className="bg-[#0A0A0A] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition-all h-full flex flex-col">
                  <div className="relative w-full aspect-[1080/1350] overflow-hidden">
                      <Image 
                        src={event.image || "/images/placeholder.jpg"} 
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
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
        ) : (
          <p className="text-gray-500">No upcoming events scheduled.</p>
        )}
      </section>

      {pastEvents.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-12 border-t border-gray-900 opacity-70 hover:opacity-100 transition-opacity">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold text-gray-400">📜 Past Events</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pastEvents.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`} className="group grayscale hover:grayscale-0 transition-all duration-500">
                <div className="bg-[#0A0A0A] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition-all h-full flex flex-col">
                  <div className="relative w-full aspect-[1080/1350] overflow-hidden">
                      <Image 
                        src={event.image || "/images/placeholder.jpg"} 
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-black/80 backdrop-blur px-2 py-1 rounded text-xs font-mono border border-gray-700 text-gray-400">
                          Ended
                      </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold mb-2 text-gray-400 group-hover:text-white">{event.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-2">{event.description}</p>
                    <div className="flex items-center gap-2 mt-auto">
                       <span className="text-xs text-gray-600 border border-gray-800 px-2 py-1 rounded-full">
                          Completed
                       </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

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