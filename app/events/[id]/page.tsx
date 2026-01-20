"use client";
import { useState } from "react";
import { events } from "@/app/lib/data";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";

export default function EventPage() {
  const params = useParams();
  const id = params?.id as string; 

  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState<{ role: string; msg: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const event = events.find((e) => e.id === id);

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#050505] text-white">
        <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
        <Link href="/event" className="text-blue-500 hover:text-blue-400 underline">
          Return to Events
        </Link>
      </div>
    );
  }

  async function sendMessage() {
    if (!input.trim()) return;

    const userMsg = input;
    setInput("");
    setChatLog((prev) => [...prev, { role: "user", msg: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message: userMsg, eventId: event?.id }),
      });
      
      const data = await res.json();
      setChatLog((prev) => [...prev, { role: "ai", msg: data.reply }]);
    } catch (err) {
      console.error(err);
      setChatLog((prev) => [...prev, { role: "ai", msg: "Sorry, I can't connect right now." }]);
    }
    
    setLoading(false);
  }

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden selection:bg-blue-500 selection:text-white">
      
      <div className="w-full md:w-[400px] lg:w-[450px] border-r border-gray-800 bg-[#0A0A0A] p-6 hidden md:flex flex-col h-full overflow-y-auto custom-scrollbar">
        <Link href="/event" className="text-gray-500 hover:text-white mb-8 flex items-center gap-2 text-sm font-medium transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Events
        </Link>

        <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden mb-6 border border-gray-800 shadow-2xl shadow-blue-900/10 group">
          <Image 
            src={event.image || "/images/placeholder.jpg"} 
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4">
             <span className="inline-block px-2 py-1 mb-2 text-xs font-bold text-blue-400 bg-blue-900/30 border border-blue-900/50 rounded uppercase tracking-wider">
               {event.category}
             </span>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold mb-3 leading-tight">{event.title}</h1>
        <p className="text-gray-400 text-sm leading-relaxed mb-8 border-b border-gray-800 pb-8">
          {event.description}
        </p>
        
        <div className="mt-auto space-y-4">
          <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 backdrop-blur-sm">
            <h3 className="font-bold text-gray-200 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Event Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Date</span>
                <span className="text-white font-mono">{event.date}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Organizer</span>
                <span className="text-white">{event.community || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-[#050505] relative">
        
        <div className="md:hidden p-4 border-b border-gray-800 bg-[#0A0A0A]/80 backdrop-blur-md flex justify-between items-center z-20 absolute top-0 left-0 right-0">
          <Link href="/events" className="text-sm text-gray-400 hover:text-white">← Back</Link>
          <span className="font-bold text-sm truncate max-w-[200px]">{event.title}</span>
        </div>

        <div className="p-4 border-b border-gray-800 bg-[#050505]/50 backdrop-blur-sm text-center text-xs font-medium text-gray-500 uppercase tracking-widest hidden md:block">
          AI Concierge • Live Chat
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth pt-16 md:pt-8">
          {chatLog.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-4 opacity-0 animate-fade-in-up" style={{animationFillMode: 'forwards'}}>
              <div className="w-16 h-16 bg-blue-900/20 rounded-full flex items-center justify-center border border-blue-900/30 mb-2">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
              </div>
              <div>
                <p className="text-lg font-medium text-white">How can I help you?</p>
                <p className="text-sm mt-1 max-w-xs mx-auto">Ask about the schedule, venue, ticket prices, or specific rules for <span className="text-blue-400">{event.title}</span>.</p>
              </div>
            </div>
          )}
          
          {chatLog.map((log, i) => (
            <div key={i} className={`flex ${log.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
              <div
                className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl text-sm md:text-base leading-relaxed shadow-md ${
                  log.role === "user" 
                    ? "bg-blue-600 text-white rounded-br-none" 
                    : "bg-[#1A1A1A] border border-gray-800 text-gray-200 rounded-bl-none"
                }`}
              >
                {log.role === "ai" ? (
                  <ReactMarkdown
                    components={{
                      ul: ({node, ...props}) => <ul className="list-disc ml-4 space-y-1 my-2" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal ml-4 space-y-1 my-2" {...props} />,
                      li: ({node, ...props}) => <li className="pl-1" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-bold text-blue-300" {...props} />,
                      p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                      a: ({node, ...props}) => <a className="text-blue-400 hover:underline" {...props} />
                    }}
                  >
                    {log.msg}
                  </ReactMarkdown>
                ) : (
                  log.msg
                )}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#1A1A1A] border border-gray-800 px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-1.5">
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 md:p-6 bg-[#050505] border-t border-gray-800">
          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-20 group-focus-within:opacity-50 blur transition-opacity duration-500"></div>
            <div className="relative flex gap-2">
              <input
                suppressHydrationWarning
                className="flex-1 bg-[#0A0A0A] border border-gray-800 rounded-full px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-gray-700 transition-all shadow-inner"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question here..."
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed px-6 md:px-8 rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-white/10"
              >
                <span className="hidden md:inline">Send</span>
                <span className="md:hidden">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}