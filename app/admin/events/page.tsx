'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, Plus, Lock, CheckCircle2, Trash2, Edit3, Radio, AlertCircle } from 'lucide-react';
import { communities } from '@/app/lib/data';
import { UserRole } from '@/types/database.types';
import { useRealtimeEvents } from '@/lib/hooks/useRealtimeEvents';
import { createClient } from '@/lib/supabase/client';

export default function EventBookingEnginePage() {
  const { eventsList, setEventsList, loading } = useRealtimeEvents();

  // Simulated active user role & community
  const [currentUserRole] = useState<UserRole>('manager');
  const [userCommunity] = useState('IEEE SB CEV');

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('hackathon');
  const [community, setCommunity] = useState('IEEE SB CEV');
  const [date, setDate] = useState('2025-11-20');
  const [status, setStatus] = useState<'closed' | 'live'>('closed');
  const [desc, setDesc] = useState('');
  const [aiContext, setAiContext] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleBookSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;

    const newEvt = {
      id: Date.now().toString(),
      title,
      category,
      community,
      date,
      image: '/images/bit.jpg',
      description: desc || 'Campus event slot booked.',
      status,
      ai_context: aiContext || `Event: ${title}\nOrganizer: ${community}\nDate: ${date}`,
    };

    // Optimistic UI update
    setEventsList([newEvt, ...eventsList]);

    try {
      const supabase = createClient();
      await supabase.from('events').insert({
        title,
        category,
        event_date: date,
        time_slot: '10:00 AM - 4:00 PM',
        status,
        description: desc,
        system_prompt: aiContext,
        slug: title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now().toString().slice(-4),
        community_id: '00000000-0000-0000-0000-000000000000',
      });
      setFeedback({ type: 'success', message: 'Slot booked successfully and broadcast to all clients in real time!' });
    } catch (err) {
      console.error(err);
    }

    setTitle('');
    setDesc('');
    setAiContext('');
    setShowModal(false);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleToggleStatus = async (id: string, currentStatus: 'closed' | 'live') => {
    const nextStatus = currentStatus === 'live' ? 'closed' : 'live';

    // Optimistic update
    setEventsList(
      eventsList.map((e) => (e.id === id ? { ...e, status: nextStatus } : e))
    );

    try {
      const supabase = createClient();
      await supabase.from('events').update({ status: nextStatus }).eq('id', id);
      setFeedback({ type: 'success', message: `Event status toggled to ${nextStatus}!` });
    } catch (err) {
      console.error(err);
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDelete = async (id: string, evtCommunity: string) => {
    // RBAC Enforced: Editors CANNOT delete events
    if (currentUserRole === 'editor') {
      setFeedback({ type: 'error', message: 'RBAC Violation: Editors are not permitted to delete events.' });
      setTimeout(() => setFeedback(null), 4000);
      return;
    }

    // Managers can only delete own community events
    if (currentUserRole === 'manager' && userCommunity.toLowerCase() !== evtCommunity.toLowerCase()) {
      setFeedback({ type: 'error', message: 'RBAC Violation: Managers can only delete events belonging to their own community.' });
      setTimeout(() => setFeedback(null), 4000);
      return;
    }

    // Optimistic update
    setEventsList(eventsList.filter((e) => e.id !== id));

    try {
      const supabase = createClient();
      await supabase.from('events').delete().eq('id', id);
      setFeedback({ type: 'success', message: 'Event deleted successfully.' });
    } catch (err) {
      console.error(err);
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-blue-500" />
            Slot Booking & Publishing Engine
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Reserve dates in <span className="text-amber-400 font-semibold">closed</span> draft state to avoid conflicts across communities, then toggle to <span className="text-emerald-400 font-semibold">live</span> for public release.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-emerald-400 font-semibold">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>Realtime Broadcast Active</span>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors shadow-lg shadow-blue-500/25"
          >
            <Plus className="w-4 h-4" />
            <span>Book Date / Time Slot</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
          feedback.type === 'success' ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300' : 'bg-red-950/80 border-red-800 text-red-300'
        }`}>
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Master Event List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">Master Schedule & Conflict Matrix</h3>
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm bg-slate-900/60 border border-slate-800 rounded-2xl">
            Synchronizing realtime slots...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventsList.map((evt) => (
              <div
                key={evt.id}
                className={`p-6 rounded-2xl bg-slate-900/60 border ${
                  evt.status === 'closed' ? 'border-amber-800/60' : 'border-slate-800'
                } space-y-4 flex flex-col justify-between`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-bold text-cyan-400 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/50">
                      {evt.category}
                    </span>
                    <button
                      onClick={() => handleToggleStatus(evt.id, evt.status || 'live')}
                      className={`text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                        evt.status === 'closed'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800 hover:bg-amber-900'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800 hover:bg-emerald-900'
                      }`}
                    >
                      {evt.status === 'closed' ? (
                        <>
                          <Lock className="w-3 h-3" /> Closed (Draft Slot)
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Live (Published)
                        </>
                      )}
                    </button>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-white">{evt.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{evt.description}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <div>
                    <div className="font-semibold text-slate-200">{evt.community}</div>
                    <div className="text-[11px] text-slate-500">{evt.date}</div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(evt.id, evt.community)}
                      className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800"
                      title={currentUserRole === 'editor' ? 'Editors cannot delete events' : 'Delete event'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-4 text-white shadow-2xl my-8">
            <h3 className="text-xl font-bold">Book Date / Time Slot</h3>
            <form onSubmit={handleBookSlot} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Event Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. HackCEV 2025"
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="hackathon">Hackathon</option>
                    <option value="workshop">Workshop</option>
                    <option value="competition">Competition</option>
                    <option value="business">Business / Pitch</option>
                    <option value="robotics">Robotics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Target Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Organizing Community</label>
                <select
                  value={community}
                  onChange={(e) => setCommunity(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                >
                  {communities.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Publishing Status</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setStatus('closed')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
                      status === 'closed'
                        ? 'bg-amber-950 border-amber-500 text-amber-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" /> Closed (Draft Slot)
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('live')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
                      status === 'live'
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Live (Publish Now)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">System Prompt Context for AI Assistant</label>
                <textarea
                  value={aiContext}
                  onChange={(e) => setAiContext(e.target.value)}
                  placeholder="Feed prerequisites, venue rules, food info, prize details for the chatbot..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 h-28"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm shadow-lg shadow-blue-500/20"
                >
                  Reserve & Save Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
