'use client';

import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, Lock, CheckCircle2, Trash2, Edit3, Radio, AlertCircle, Clock, ShieldAlert } from 'lucide-react';
import { UserRole } from '@/types/database.types';
import { useRealtimeEvents } from '@/lib/hooks/useRealtimeEvents';
import { useCommunities } from '@/lib/hooks/useCommunities';
import { createClient } from '@/lib/supabase/client';

export default function EventBookingEnginePage() {
  const { eventsList, setEventsList, loading: eventsLoading } = useRealtimeEvents();
  const { communities, loading: communitiesLoading } = useCommunities();

  const loading = eventsLoading || communitiesLoading;

  // Active User Profile Info
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('editor');
  const [currentUserCommunityId, setCurrentUserCommunityId] = useState<string | null>(null);
  const [currentUserCommunityName, setCurrentUserCommunityName] = useState<string>('');

  // Form State
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('16:00');

  const [category, setCategory] = useState('Workshop');
  const [customCategory, setCustomCategory] = useState('');
  const [selectedCommunityId, setSelectedCommunityId] = useState('');
  const [status, setStatus] = useState<'closed' | 'live'>('closed');
  const [desc, setDesc] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const fetchActiveUser = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role, community_id, community:communities(name)')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setCurrentUserRole(profile.role);
            setCurrentUserCommunityId(profile.community_id || null);
            if ((profile as any).community?.name) {
              setCurrentUserCommunityName((profile as any).community.name);
            }
          }
        }
      } catch {
        // Fallback
      }
    };

    fetchActiveUser();
  }, []);

  const isSuperAdmin = currentUserRole === 'dev' || currentUserRole === 'admin';

  const handleBookSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startDate) return;

    const finalCategory = category === 'Other' ? (customCategory || 'Custom Event') : category;
    
    // Determine Community ID
    const targetCommunityId = isSuperAdmin ? selectedCommunityId : currentUserCommunityId;
    const matchedComm = communities.find((c) => c.id === targetCommunityId || c.name === targetCommunityId);
    const commName = matchedComm ? matchedComm.name : (currentUserCommunityName || 'CEV Community');

    const formattedTimeSlot = `${startTime} - ${endTime}`;
    const dateRangeString = startDate === endDate ? startDate : `${startDate} to ${endDate}`;

    const newEvt = {
      id: Date.now().toString(),
      title,
      category: finalCategory,
      community: commName,
      date: dateRangeString,
      image: '/images/bit.jpg',
      description: desc || 'Full event details and schedule.',
      status,
      ai_context: `Event: ${title}\nCategory: ${finalCategory}\nOrganizer: ${commName}\nDates: ${dateRangeString}\nTime: ${formattedTimeSlot}\nFull Description:\n${desc}`,
    };

    setEventsList([newEvt, ...eventsList]);

    try {
      const supabase = createClient();
      await supabase.from('events').insert({
        title,
        category: finalCategory,
        event_date: startDate,
        time_slot: formattedTimeSlot,
        status,
        description: desc,
        system_prompt: desc, // Full Explained description used for AI chatbot context
        slug: title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now().toString().slice(-4),
        community_id: matchedComm ? matchedComm.id : (currentUserCommunityId || null),
      });
      setFeedback({ type: 'success', message: 'Slot booked and event details saved successfully!' });
    } catch (err) {
      console.error(err);
    }

    setTitle('');
    setDesc('');
    setCustomCategory('');
    setShowModal(false);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleToggleStatus = async (id: string, currentStatus: 'closed' | 'live', evtCommunity: string) => {
    // Check permission
    const isOwnCommunity = isSuperAdmin || (
      currentUserCommunityName &&
      evtCommunity.toLowerCase() === currentUserCommunityName.toLowerCase()
    );

    if (!isOwnCommunity) {
      setFeedback({ type: 'error', message: 'RBAC Violation: You can only modify events belonging to your own community.' });
      setTimeout(() => setFeedback(null), 4000);
      return;
    }

    const nextStatus = currentStatus === 'live' ? 'closed' : 'live';

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
    if (currentUserRole === 'editor') {
      setFeedback({ type: 'error', message: 'RBAC Violation: Editors are not permitted to delete events.' });
      setTimeout(() => setFeedback(null), 4000);
      return;
    }

    const isOwnCommunity = isSuperAdmin || (
      currentUserCommunityName &&
      evtCommunity.toLowerCase() === currentUserCommunityName.toLowerCase()
    );

    if (!isOwnCommunity) {
      setFeedback({ type: 'error', message: 'RBAC Violation: Managers can only delete events belonging to their own community.' });
      setTimeout(() => setFeedback(null), 4000);
      return;
    }

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
    <div className="space-y-8 pb-20 md:pb-12">
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
            <span>Realtime Sync Active</span>
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
            Synchronizing realtime slots from database...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventsList.length === 0 ? (
              <div className="col-span-full p-8 text-center text-slate-500 text-xs italic bg-slate-900/40 border border-slate-800 rounded-2xl">
                No events or reserved slots found in database. Click &quot;Book Date / Time Slot&quot; to reserve your first event.
              </div>
            ) : (
              eventsList.map((evt) => {
                const isOwnCommunity = isSuperAdmin || (
                  currentUserCommunityName &&
                  evt.community.toLowerCase() === currentUserCommunityName.toLowerCase()
                );
                const isClosed = evt.status === 'closed';

                // CASE 1: Other community's closed (draft) slot -> Show ONLY Date & Time slot booked, hide all details
                if (!isOwnCommunity && isClosed) {
                  return (
                    <div
                      key={evt.id}
                      className="p-6 rounded-2xl bg-slate-900/40 border border-amber-950/80 space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-amber-400 px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-800 flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Slot Booked (Reserved)
                          </span>
                        </div>

                        <div>
                          <h4 className="text-lg font-bold text-slate-300 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-amber-400" /> Time Slot Reserved
                          </h4>
                          <p className="text-xs text-slate-500 mt-1">
                            Reserved by another campus community to prevent scheduling conflicts. Details hidden until live.
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                        <div>
                          <div className="font-semibold text-slate-300">{evt.community}</div>
                          <div className="text-[11px] text-slate-500">{evt.date}</div>
                        </div>
                      </div>
                    </div>
                  );
                }

                // CASE 2: Other community's live event -> Show basic info (Name, Category, Date/Time, Community), but NO edit/delete buttons
                if (!isOwnCommunity && !isClosed) {
                  return (
                    <div
                      key={evt.id}
                      className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs uppercase font-bold text-cyan-400 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/50">
                            {evt.category}
                          </span>
                          <span className="text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Live
                          </span>
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
                        <div className="text-[10px] text-slate-500 italic">Read-only (Other Community)</div>
                      </div>
                    </div>
                  );
                }

                // CASE 3: Own community event -> Full visibility, status toggle, and edit/delete controls
                return (
                  <div
                    key={evt.id}
                    className={`p-6 rounded-2xl bg-slate-900/60 border ${
                      isClosed ? 'border-amber-800/60' : 'border-slate-800'
                    } space-y-4 flex flex-col justify-between`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase font-bold text-cyan-400 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/50">
                          {evt.category}
                        </span>
                        <button
                          onClick={() => handleToggleStatus(evt.id, evt.status || 'live', evt.community)}
                          className={`text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                            isClosed
                              ? 'bg-amber-950 text-amber-400 border border-amber-800 hover:bg-amber-900'
                              : 'bg-emerald-950 text-emerald-400 border border-emerald-800 hover:bg-emerald-900'
                          }`}
                        >
                          {isClosed ? (
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
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-xl space-y-5 text-white shadow-2xl my-8">
            <h3 className="text-xl font-bold border-b border-slate-800 pb-3">Book Date / Time Slot</h3>
            
            <form onSubmit={handleBookSlot} className="space-y-4">
              {/* Event Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Event Name
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. BitBurst Hackathon 2.0"
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Start Date & End Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <CalendarIcon className="w-3.5 h-3.5 text-blue-400" /> Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <CalendarIcon className="w-3.5 h-3.5 text-blue-400" /> End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Start Time & End Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" /> Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" /> End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Category Selection with 'Other' Custom Box */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="Workshop">Workshop</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Tech Fest">Tech Fest</option>
                  <option value="Webinar">Webinar</option>
                  <option value="Competition">Competition</option>
                  <option value="Other">Other (Custom Category)</option>
                </select>

                {category === 'Other' && (
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Enter custom category name..."
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 mt-2"
                  />
                )}
              </div>

              {/* Organizing Community Selection (Only visible for Admins and Devs) */}
              {isSuperAdmin ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Organizing Community
                  </label>
                  <select
                    value={selectedCommunityId}
                    onChange={(e) => setSelectedCommunityId(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="">-- Select Organizing Community --</option>
                    {communities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                  <span className="text-slate-400">Organizing Community:</span>
                  <span className="font-bold text-cyan-400">{currentUserCommunityName || 'Assigned Community'}</span>
                </div>
              )}

              {/* Publishing Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Publishing Status
                </label>
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

              {/* Full Explained Description of Event */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Detailed Description of Event
                </label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Explain event details, schedule, venue rules, food info, prize details..."
                  required
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
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-blue-500/20"
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
