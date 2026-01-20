import Link from "next/link";
import { events } from "@/app/lib/data";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white p-10">
      <h1 className="text-5xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
        EventHub AI
      </h1>

      <div className="flex justify-center gap-4 mb-12">
        <button className="px-6 py-2 rounded-full bg-gray-800 hover:bg-gray-700">All Events</button>
        <button className="px-6 py-2 rounded-full bg-gray-800 hover:bg-gray-700">Community</button>
        <button className="px-6 py-2 rounded-full bg-gray-800 hover:bg-gray-700">Entertainment</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {events.map((event) => (
          <Link key={event.id} href={`/events/${event.id}`} className="block group">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-blue-500 transition-all cursor-pointer h-full">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">{event.category}</span>
              <h2 className="text-2xl font-bold mt-2 group-hover:text-blue-300">{event.title}</h2>
              <p className="text-gray-400 mt-2">{event.description}</p>
              <div className="mt-4 text-sm text-gray-500">{event.date}</div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}