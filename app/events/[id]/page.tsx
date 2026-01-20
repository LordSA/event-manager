"use client";
import { useState } from "react";
import { events } from "@/app/lib/data";
import Link from "next/link";
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
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
        <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
        <Link href="/" className="text-blue-500 hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  async function sendMessage() {
    if (!input.trim()) return;

    const userMsg = input;
    setInput(""); // Clear the input box
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
    <div className="flex flex-col md:flex-row h-screen bg-gray-950 text-white overflow-hidden">
      {/* LEFT PANEL: Event Details */}
      <div className="w-full md:w-1/3 border-r border-gray-800 p-8 hidden md:flex flex-col">
        <Link href="/" className="text-gray-500 hover:text-white mb-8 block">
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
        <p className="text-gray-400 mb-6">{event.description}</p>
        
        <div className="mt-auto bg-gray-900 p-4 rounded-lg border border-gray-800">
          <h3 className="font-bold text-gray-300 mb-2">Event Info</h3>
          <p className="text-sm text-gray-400">📅 Date: {event.date}</p>
          <p className="text-sm text-gray-400">🏷️ Type: {event.category}</p>
        </div>
      </div>

      {/* RIGHT PANEL: Chat Interface */}
      <div className="flex-1 flex flex-col bg-gray-900 h-full">
        {/* Mobile Header (Only shows on small screens) */}
        <div className="md:hidden p-4 border-b border-gray-800 bg-black flex justify-between items-center">
          <Link href="/" className="text-sm text-gray-500">← Back</Link>
          <span className="font-bold">{event.title}</span>
        </div>

        <div className="p-4 border-b border-gray-800 text-center text-sm text-gray-400 hidden md:block">
          AI Assistant for {event.title}
        </div>

        {/* Chat Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatLog.length === 0 && (
            <div className="text-center text-gray-600 mt-10 px-6">
              <p>Hello! I am the AI guide for <strong>{event.title}</strong>.</p>
              <p className="text-sm mt-2">Ask me about the schedule, parking, or rules.</p>
            </div>
          )}
          
          {chatLog.map((log, i) => (
            <div key={i} className={`flex ${log.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] p-3 rounded-2xl text-sm md:text-base ${
                  log.role === "user" 
                    ? "bg-blue-600 text-white rounded-br-none" 
                    : "bg-gray-800 text-gray-200 rounded-bl-none"
                }`}
              >
                {log.role === "ai" ? (
                  <ReactMarkdown
                    components={{
                      // These classes fix the missing bullets and bold text in Tailwind
                      ul: ({node, ...props}) => <ul className="list-disc ml-5 space-y-1" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal ml-5 space-y-1" {...props} />,
                      li: ({node, ...props}) => <li className="pl-1" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-bold text-blue-300" {...props} />,
                      p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
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
            <div className="flex justify-start animate-pulse">
              <div className="bg-gray-800 text-gray-500 text-xs px-3 py-2 rounded-full ml-2">
                AI is typing...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-gray-950 border-t border-gray-800">
          <div className="flex gap-2 max-w-4xl mx-auto">
            <input
              className="flex-1 bg-gray-900 border border-gray-700 rounded-full px-5 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 rounded-full font-bold transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}