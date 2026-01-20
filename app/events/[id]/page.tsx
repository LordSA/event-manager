"use client";
import { useState } from "react";
import { events } from "@/app/lib/data";
import Link from "next/link";
import { useParams } from "next/navigation"; // Import useParams

export default function EventPage() {
  // 1. Get the ID safely using the hook
  const params = useParams();
  const id = params?.id as string; 

  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState<{ role: string; msg: string }[]>([]);
  const [loading, setLoading] = useState(false);

  // 2. Find the specific event
  const event = events.find((e) => e.id === id);

  // Handle case where event doesn't exist
  if (!event) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Event not found</h1>
          <Link href="/" className="text-blue-500 hover:underline mt-4 block">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  async function sendMessage() {
    if (!input.trim()) return;

    const userMsg = input;
    setInput(""); // Clear input immediately
    setChatLog((prev) => [...prev, { role: "user", msg: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        // 3. FIX IS HERE: Use event.id, not events.id
        body: JSON.stringify({ message: userMsg, eventId: event.id }),
      });
      const text = await res.text();
      const data = await res.json();
      setChatLog((prev) => [...prev, { role: "ai", msg: data.reply }]);
    } catch (err) {
      console.error(err);
      setChatLog((prev) => [...prev, { role: "ai", msg: "Sorry, something went wrong." }]);
    }
    
    setLoading(false);
  }

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      {/* LEFT: Sidebar Info */}
      <div className="w-1/3 border-r border-gray-800 p-8 hidden md:block">
        <Link href="/" className="text-gray-500 hover:text-white mb-8 block">
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
        <p className="text-gray-400 mb-6">{event.description}</p>
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
          <h3 className="font-bold text-gray-300 mb-2">Details</h3>
          <p className="text-sm text-gray-400">📅 {event.date}</p>
          <p className="text-sm text-gray-400 capitalize">🏷️ {event.category}</p>
        </div>
      </div>

      {/* RIGHT: Chat Interface */}
      <div className="flex-1 flex flex-col bg-gray-900">
        <div className="p-4 border-b border-gray-800 text-center font-semibold text-gray-300">
          Chat with {event.title} AI Agent
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {chatLog.length === 0 && (
            <div className="text-center text-gray-600 mt-10">
              <p>Ask about parking, tickets, or schedule!</p>
            </div>
          )}
          {chatLog.map((log, i) => (
            <div key={i} className={`flex ${log.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  log.role === "user" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-200"
                }`}
              >
                {log.msg}
              </div>
            </div>
          ))}
          {loading && <div className="text-gray-500 text-sm ml-2">AI is typing...</div>}
        </div>

        <div className="p-4 bg-gray-950 border-t border-gray-800 flex gap-2">
          <input
            className="flex-1 bg-gray-900 border border-gray-700 rounded-full px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-2 rounded-full font-medium"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}