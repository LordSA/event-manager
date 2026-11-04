'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import {
  Building,
  Calendar,
  Plus,
  Search,
  CheckCircle2,
  Lock,
  Edit2,
  Trash2,
  ExternalLink,
  ShieldAlert,
  MapPin,
  Clock,
  Sparkles,
  List,
  LayoutGrid,
  Upload,
  X,
  AlertCircle,
  Eye,
  Tag,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { EventItem, Community, UserRole } from '@/types/database.types';
import { uploadImageFile } from '@/lib/upload';

function toIsoDateString(str?: string | null): string {
  if (!str) return new Date().toISOString().split('T')[0];
  const s = String(str).trim();
  const isoMatch = s.match(/\d{4}-\d{2}-\d{2}/);
  if (isoMatch) {
    return isoMatch[0];
  }
  const d = new Date(s);
  if (!isNaN(d.getTime())) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
  return new Date().toISOString().split('T')[0];
}

export default function MyCommunityPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [community, setCommunity] = useState<Community | null>(null);
  const [role, setRole] = useState<UserRole>('manager');
  const [events, setEvents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'closed'>('all');
  const [formatFilter, setFormatFilter] = useState<'all' | 'offline' | 'online'>('all');
  const [viewModeTab, setViewModeTab] = useState<'grid' | 'list'>('grid');

  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [editCommModalOpen, setEditCommModalOpen] = useState(false);
  const [commName, setCommName] = useState('');
  const [commSlug, setCommSlug] = useState('');
  const [commDescription, setCommDescription] = useState('');
  const [commColor, setCommColor] = useState('from-blue-600 to-cyan-400');
  const [commInitials, setCommInitials] = useState('');
  const [commLogoUrl, setCommLogoUrl] = useState('');
  const [savingComm, setSavingComm] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [savingEvent, setSavingEvent] = useState(false);

  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('16:00');
  const [category, setCategory] = useState('Workshop');
  const [customCategory, setCustomCategory] = useState('');
  const [status, setStatus] = useState<'live' | 'closed'>('closed');
  const [desc, setDesc] = useState('');
  const [perks, setPerks] = useState('');
  const [eventType, setEventType] = useState<'offline' | 'online'>('offline');
  const [venue, setVenue] = useState('Campus Setup / CEV');
  const [posterUrl, setPosterUrl] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [uploadingPoster, setUploadingPoster] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role, community_id')
        .eq('id', session.user.id)
        .single();

      if (!profile || !profile.community_id) {
        setLoading(false);
        return;
      }

      if (profile.role) {
        setRole(profile.role);
      }

      const { data: commData } = await supabase
        .from('communities')
        .select('*')
        .eq('id', profile.community_id)
        .single();

      if (commData) {
        setCommunity(commData);
        setCommName(commData.name || '');
        setCommSlug(commData.slug || '');
        setCommDescription(commData.description || '');
        setCommColor(commData.color || '#6366f1');
        setCommInitials(commData.initials || '');
        setCommLogoUrl(commData.logo_url || '');
      }

      const { data: eventData } = await supabase
        .from('events')
        .select('*, community:communities(name, color, initials)')
        .eq('community_id', profile.community_id)
        .order('event_date', { ascending: false });

      if (eventData) {
        const mappedEvents = eventData.map((item: any) => ({
          ...item,
          date: item.event_date,
          community: item.community?.name || commData?.name || 'Community',
        }));
        setEvents(mappedEvents as any[]);
      }
    } catch {
      setToastMsg({ type: 'error', text: 'Failed to load community details and events.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    if (file.size > 5 * 1024 * 1024) {
      setToastMsg({ type: 'error', text: 'Logo image file size must be under 5MB.' });
      return;
    }

    setUploadingLogo(true);
    setToastMsg(null);

    try {
      const publicUrl = await uploadImageFile(file, 'logos');
      setCommLogoUrl(publicUrl);
      setToastMsg({ type: 'success', text: 'Community logo image uploaded!' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to upload logo';
      setToastMsg({ type: 'error', text: msg });
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleUpdateCommunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!community) return;

    setSavingComm(true);
    setToastMsg(null);

    try {
      const payload: Record<string, any> = {
        id: community.id,
        name: commName,
        description: commDescription,
        color: commColor,
        initials: commInitials,
        logo_url: commLogoUrl,
      };

      if (role === 'dev' || role === 'admin') {
        payload.slug = commSlug;
      }

      const res = await fetch('/api/admin/my-community', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setToastMsg({ type: 'success', text: 'Community details updated successfully!' });
        if (data.community) {
          setCommunity(data.community);
        }
        setEditCommModalOpen(false);
      } else {
        throw new Error(data.error || 'Failed to update community');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update community';
      setToastMsg({ type: 'error', text: msg });
    } finally {
      setSavingComm(false);
    }
  };

  const openCreateEventModal = () => {
    setEditingEvent(null);
    setTitle('');
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
    setEndDate(today);
    setStartTime('10:00');
    setEndTime('16:00');
    setCategory('Workshop');
    setCustomCategory('');
    setStatus('closed');
    setDesc('');
    setPerks('');
    setEventType('offline');
    setVenue('Campus Setup / CEV');
    setPosterUrl('');
    setRedirectUrl('');
    setEventModalOpen(true);
  };

  const openEditEventModal = (evt: EventItem) => {
    setEditingEvent(evt);
    setTitle(evt.title);

    const rawDateStr = evt.event_date || (evt as any).date || '';
    let startStr = rawDateStr;
    let endStr = rawDateStr;

    if (typeof rawDateStr === 'string') {
      if (rawDateStr.toLowerCase().includes(' to ')) {
        const parts = rawDateStr.split(/ to /i);
        startStr = parts[0].trim();
        endStr = parts[1].trim();
      } else if (rawDateStr.includes(' - ')) {
        const parts = rawDateStr.split(/\s+-\s+/);
        startStr = parts[0].trim();
        endStr = parts[1].trim();
      } else if (rawDateStr.includes(' / ')) {
        const parts = rawDateStr.split(/\s+\/\s+/);
        startStr = parts[0].trim();
        endStr = parts[1].trim();
      }
    }

    setStartDate(toIsoDateString(startStr));
    setEndDate(toIsoDateString(endStr));

    if (evt.time_slot && evt.time_slot.includes(' - ')) {
      const times = evt.time_slot.split(' - ');
      setStartTime(times[0].trim());
      setEndTime(times[1].trim());
    } else {
      setStartTime('10:00');
      setEndTime('16:00');
    }

    const stdCategories = ['Workshop', 'Hackathon', 'Competition', 'Seminar', 'Exam', 'Meetup', 'Cultural'];
    if (stdCategories.includes(evt.category)) {
      setCategory(evt.category);
      setCustomCategory('');
    } else {
      setCategory('Other');
      setCustomCategory(evt.category);
    }

    setStatus(evt.status || 'closed');
    setDesc(evt.description || '');
    setPerks(evt.perks || '');

    const rawVenue = evt.venue || '';
    if (rawVenue.toLowerCase().startsWith('online')) {
      setEventType('online');
      setVenue(rawVenue.replace(/^online\s*•\s*/i, ''));
    } else {
      setEventType('offline');
      setVenue(rawVenue.replace(/^offline\s*•\s*/i, ''));
    }

    setPosterUrl(evt.poster_url || '');
    setRedirectUrl(evt.redirect_url || '');
    setEventModalOpen(true);
  };

  const handlePosterFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    if (file.size > 5 * 1024 * 1024) {
      setToastMsg({ type: 'error', text: 'Poster image file size must be under 5MB.' });
      return;
    }

    setUploadingPoster(true);
    setUploadProgress(0);

    try {
      const publicUrl = await uploadImageFile(file, 'posters', (percent) => {
        setUploadProgress(percent);
      });
      setPosterUrl(publicUrl);
      setToastMsg({ type: 'success', text: 'Event poster uploaded successfully!' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to upload poster';
      setToastMsg({ type: 'error', text: msg });
    } finally {
      setUploadingPoster(false);
      setUploadProgress(0);
    }
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!community || !title.trim() || !startDate) return;

    setSavingEvent(true);
    setToastMsg(null);

    const finalCategory = category === 'Other' ? customCategory.trim() || 'General' : category;
    const finalEventDate = startDate === endDate || !endDate ? startDate : `${startDate} to ${endDate}`;
    const finalTimeSlot = `${startTime} - ${endTime}`;
    const venuePrefix = eventType === 'online' ? 'Online' : 'Offline';
    const finalVenue = `${venuePrefix} • ${venue.trim() || 'Campus Setup / CEV'}`;

    try {
      const supabase = createClient();

      let targetSlug = editingEvent ? editingEvent.slug : title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      if (!editingEvent) {
        const uniqueSuffix = Date.now().toString(36);
        targetSlug = `${targetSlug}-${uniqueSuffix}`;
      }

      const payload = {
        title: title.trim(),
        slug: targetSlug,
        category: finalCategory,
        community_id: community.id,
        event_date: finalEventDate,
        time_slot: finalTimeSlot,
        venue: finalVenue,
        status,
        description: desc.trim() || null,
        perks: perks.trim() || null,
        poster_url: posterUrl.trim() || null,
        redirect_url: redirectUrl.trim() || null,
        updated_at: new Date().toISOString(),
      };

      if (editingEvent) {
        const { error } = await supabase.from('events').update(payload).eq('id', editingEvent.id);
        if (error) throw error;
        setToastMsg({ type: 'success', text: `Updated "${title}" successfully!` });
      } else {
        const { error } = await supabase.from('events').insert([payload]);
        if (error) throw error;
        setToastMsg({ type: 'success', text: `Created "${title}" for ${community.name}!` });
      }

      setEventModalOpen(false);
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save event';
      setToastMsg({ type: 'error', text: msg });
    } finally {
      setSavingEvent(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: 'live' | 'closed') => {
    const nextStatus = currentStatus === 'live' ? 'closed' : 'live';
    try {
      const supabase = createClient();
      const { error } = await supabase.from('events').update({ status: nextStatus }).eq('id', id);
      if (error) throw error;
      setToastMsg({
        type: 'success',
        text: `Event status updated to ${nextStatus === 'live' ? 'Live (Published)' : 'Closed (Draft)'}.`,
      });
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update event status';
      setToastMsg({ type: 'error', text: msg });
    }
  };

  const handleDeleteEvent = async () => {
    if (!deleteId) return;
    try {
      const supabase = createClient();
      const { error } = await supabase.from('events').delete().eq('id', deleteId);
      if (error) throw error;
      setToastMsg({ type: 'success', text: 'Event deleted successfully.' });
      setDeleteId(null);
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete event';
      setToastMsg({ type: 'error', text: msg });
    }
  };

  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      evt.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.venue?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || evt.status === statusFilter;

    const isOnline = (evt.venue || '').toLowerCase().includes('online');
    const matchesFormat =
      formatFilter === 'all' ||
      (formatFilter === 'online' && isOnline) ||
      (formatFilter === 'offline' && !isOnline);

    return matchesSearch && matchesStatus && matchesFormat;
  });

  const totalEvents = events.length;
  const liveCount = events.filter((e) => e.status === 'live').length;
  const closedCount = events.filter((e) => e.status === 'closed').length;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-xs font-mono uppercase tracking-widest text-neutral-400">
          Loading community workspace...
        </div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="p-8 text-center text-neutral-500 text-xs bg-white border border-neutral-200/60 rounded-[28px] space-y-3 max-w-xl mx-auto my-12 shadow-sm">
        <ShieldAlert className="w-8 h-8 text-amber-500 mx-auto" />
        <h3 className="font-bold text-[#141518] text-base">No Community Assigned</h3>
        <p>Your account is not assigned to a specific community entity yet. Please contact an Administrator.</p>
      </div>
    );
  }

  const isSlugEditable = role === 'admin' || role === 'dev';

  return (
    <div className="space-y-10 pb-20 md:pb-12 text-[#141518]">
      {toastMsg && (
        <div
          className={`flex items-center gap-3 rounded-2xl px-5 py-4 border text-xs font-semibold ${toastMsg.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
        >
          {toastMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{toastMsg.text}</span>
        </div>
      )}

      <section className="bg-white rounded-[28px] border border-neutral-200/80 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-4 lg:col-span-3 flex items-center justify-center self-stretch">
            <div className="w-full h-full min-h-[190px] sm:min-h-[210px] bg-[#141518] text-white rounded-[24px] p-6 flex items-center justify-center relative overflow-hidden shadow-md">
              <div className="absolute -right-20 -top-20 w-56 h-56 rounded-full border border-white/10 pointer-events-none" />
              <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full border border-white/10 pointer-events-none" />

              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[20px] overflow-hidden bg-white/10 border border-white/10 flex items-center justify-center shadow-lg relative z-10">
                {community.logo_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={community.logo_url}
                    alt={community.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="text-3xl font-extrabold font-display text-white">
                    {community.initials || community.name.substring(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-8 lg:col-span-9 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-[#141518]">
                {community.name}
              </h1>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href={`/community/${community.slug}`}
                  target="_blank"
                  className="py-2.5 px-4 rounded-full bg-neutral-100 hover:bg-neutral-200 text-[#141518] text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Public View</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400" />
                </Link>

                <button
                  onClick={() => setEditCommModalOpen(true)}
                  className="py-2.5 px-5 rounded-full bg-[#141518] hover:bg-black text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
                >
                  <Edit2 className="w-3.5 h-3.5 text-white" />
                  <span>Edit Community Details</span>
                </button>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              {community.description || 'No community description provided yet. Click "Edit Community Details" to add a bio and guidelines.'}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 border border-neutral-200">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Initials:</span>
                <span className="font-extrabold text-[#141518] font-mono">{community.initials || '—'}</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 border border-neutral-200">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Slug:</span>
                <span className="font-mono text-[#141518] font-bold">/community/{community.slug}</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 border border-neutral-200">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Brand Accent:</span>
                <span
                  className="w-3.5 h-3.5 rounded-full border border-neutral-300 shrink-0"
                  style={{ backgroundColor: community.color || '#6366f1' }}
                />
                <span className="font-mono font-bold text-[#141518]">{community.color || '#6366f1'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-[#141518]">
              Events
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 font-medium">
              Manage events of  {community.name}.
            </p>
          </div>

          <button
            onClick={openCreateEventModal}
            className="py-2.5 px-6 rounded-full bg-[#141518] hover:bg-black text-white font-extrabold text-xs shadow-md flex items-center space-x-2 w-fit transition-all"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Create New Event</span>
          </button>
        </div>


        <div className="bg-white p-4 rounded-[24px] border border-neutral-200/80 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-sm">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search events by title, category, venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-neutral-100 border border-neutral-200 rounded-full text-xs text-[#141518] placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            <div className="flex items-center bg-neutral-100 p-1 rounded-full border border-neutral-200 shrink-0 text-xs font-bold">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-full transition-all ${statusFilter === 'all' ? 'bg-[#141518] text-white shadow-sm' : 'text-neutral-500 hover:text-[#141518]'
                  }`}
              >
                All Status
              </button>
              <button
                onClick={() => setStatusFilter('live')}
                className={`px-3 py-1 rounded-full transition-all ${statusFilter === 'live' ? 'bg-[#141518] text-white shadow-sm' : 'text-neutral-500 hover:text-[#141518]'
                  }`}
              >
                Live
              </button>
              <button
                onClick={() => setStatusFilter('closed')}
                className={`px-3 py-1 rounded-full transition-all ${statusFilter === 'closed' ? 'bg-[#141518] text-white shadow-sm' : 'text-neutral-500 hover:text-[#141518]'
                  }`}
              >
                Draft
              </button>
            </div>

            <div className="flex items-center bg-neutral-100 p-1 rounded-full border border-neutral-200 shrink-0 text-xs font-bold">
              <button
                onClick={() => setFormatFilter('all')}
                className={`px-3 py-1 rounded-full transition-all ${formatFilter === 'all' ? 'bg-[#141518] text-white shadow-sm' : 'text-neutral-500 hover:text-[#141518]'
                  }`}
              >
                All Format
              </button>
              <button
                onClick={() => setFormatFilter('offline')}
                className={`px-3 py-1 rounded-full transition-all ${formatFilter === 'offline' ? 'bg-[#141518] text-white shadow-sm' : 'text-neutral-500 hover:text-[#141518]'
                  }`}
              >
                Offline
              </button>
              <button
                onClick={() => setFormatFilter('online')}
                className={`px-3 py-1 rounded-full transition-all ${formatFilter === 'online' ? 'bg-[#141518] text-white shadow-sm' : 'text-neutral-500 hover:text-[#141518]'
                  }`}
              >
                Online
              </button>
            </div>

            <div className="flex items-center bg-neutral-100 p-1 rounded-full border border-neutral-200 shrink-0">
              <button
                onClick={() => setViewModeTab('grid')}
                className={`p-1.5 rounded-full transition-all ${viewModeTab === 'grid' ? 'bg-[#141518] text-white shadow-sm' : 'text-neutral-500 hover:text-[#141518]'
                  }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewModeTab('list')}
                className={`p-1.5 rounded-full transition-all ${viewModeTab === 'list' ? 'bg-[#141518] text-white shadow-sm' : 'text-neutral-500 hover:text-[#141518]'
                  }`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 text-xs bg-white border border-neutral-200/80 rounded-[28px] space-y-3">
            <Calendar className="w-8 h-8 text-neutral-300 mx-auto" />
            <p className="font-semibold text-neutral-600">No events found matching your filter criteria.</p>
            <button
              onClick={openCreateEventModal}
              className="py-2 px-4 rounded-full bg-[#141518] text-white text-xs font-bold inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Event</span>
            </button>
          </div>
        ) : viewModeTab === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((evt) => {
              const isLive = evt.status === 'live';
              return (
                <div
                  key={evt.id}
                  className="bg-white rounded-[28px] border border-neutral-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="relative h-44 w-full bg-neutral-100 overflow-hidden border-b border-neutral-100">
                      {evt.poster_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={evt.poster_url}
                          alt={evt.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-neutral-100 text-neutral-400">
                          <Calendar className="w-8 h-8 text-neutral-300" />
                        </div>
                      )}

                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-[#141518]/80 backdrop-blur-sm text-white">
                          {evt.category}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3">
                        <button
                          onClick={() => handleToggleStatus(evt.id, evt.status)}
                          className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border shadow-sm transition-all flex items-center gap-1 ${isLive
                            ? 'bg-emerald-500 text-white border-emerald-600'
                            : 'bg-amber-500 text-white border-amber-600'
                            }`}
                        >
                          {isLive ? <CheckCircle2 className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                          <span>{isLive ? 'Live' : 'Draft'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <h3 className="font-extrabold text-base text-[#141518] font-display line-clamp-2 leading-snug">
                        {evt.title}
                      </h3>

                      <div className="space-y-1.5 text-xs text-neutral-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                          <span className="font-mono font-medium">{evt.event_date || evt.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                          <span className="font-mono">{evt.time_slot || '10:00 - 16:00'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                          <span className="truncate">{evt.venue || 'Campus Setup / CEV'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-neutral-100 mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {isLive && (
                        <Link
                          href={`/events/${evt.slug || evt.id}`}
                          target="_blank"
                          className="p-2 text-neutral-400 hover:text-[#141518] rounded-full hover:bg-neutral-100 transition-colors"
                          title="View Live Page"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      )}
                      <button
                        onClick={() => openEditEventModal(evt)}
                        className="p-2 text-neutral-400 hover:text-[#141518] rounded-full hover:bg-neutral-100 transition-colors"
                        title="Edit Event"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(evt.id)}
                        className="p-2 text-neutral-400 hover:text-rose-600 rounded-full hover:bg-rose-50 transition-colors"
                        title="Delete Event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleToggleStatus(evt.id, evt.status)}
                      className="text-[11px] font-bold text-neutral-500 hover:text-[#141518] transition-colors"
                    >
                      {isLive ? 'Unpublish' : 'Publish'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-[28px] border border-neutral-200/80 overflow-hidden shadow-sm divide-y divide-neutral-100">
            {filteredEvents.map((evt) => {
              const isLive = evt.status === 'live';
              return (
                <div
                  key={evt.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-neutral-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-14 h-14 rounded-2xl bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0 flex items-center justify-center">
                      {evt.poster_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={evt.poster_url} alt={evt.title} className="w-full h-full object-cover" />
                      ) : (
                        <Calendar className="w-5 h-5 text-neutral-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                          {evt.category}
                        </span>
                        <span className="text-xs text-neutral-400 font-mono font-medium">
                          {evt.event_date || evt.date}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-sm text-[#141518] truncate mt-0.5">
                        {evt.title}
                      </h3>
                      <p className="text-xs text-neutral-500 truncate">{evt.venue || 'Campus Setup / CEV'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => handleToggleStatus(evt.id, evt.status)}
                      className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border shadow-sm transition-all flex items-center gap-1 ${isLive
                        ? 'bg-emerald-500 text-white border-emerald-600'
                        : 'bg-amber-500 text-white border-amber-600'
                        }`}
                    >
                      {isLive ? <CheckCircle2 className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                      <span>{isLive ? 'Live' : 'Draft'}</span>
                    </button>

                    {isLive && (
                      <Link
                        href={`/events/${evt.slug || evt.id}`}
                        target="_blank"
                        className="p-2 text-neutral-400 hover:text-[#141518] rounded-full hover:bg-neutral-100 transition-colors"
                        title="View Live Page"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    )}

                    <button
                      onClick={() => openEditEventModal(evt)}
                      className="p-2 text-neutral-400 hover:text-[#141518] rounded-full hover:bg-neutral-100 transition-colors"
                      title="Edit Event"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setDeleteId(evt.id)}
                      className="p-2 text-neutral-400 hover:text-rose-600 rounded-full hover:bg-rose-50 transition-colors"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {editCommModalOpen && mounted && typeof document !== 'undefined' && createPortal(
        <div
          data-lenis-prevent
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditCommModalOpen(false);
          }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
        >
          <div className="w-full max-w-xl bg-white border border-neutral-200/80 rounded-[28px] p-5 sm:p-7 space-y-4 my-auto max-h-[90vh] overflow-y-auto shadow-2xl relative text-[#141518]">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3 sticky top-0 bg-white z-10">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#141518] flex items-center gap-2 font-display">
                <Building className="w-5 h-5 text-[#141518]" />
                Edit Community Details
              </h2>
              <button
                onClick={() => setEditCommModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-[#141518] rounded-full hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateCommunity} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold text-[#141518] uppercase tracking-wider mb-1">
                    Community Name *
                  </label>
                  <input
                    type="text"
                    value={commName}
                    onChange={(e) => setCommName(e.target.value)}
                    required
                    className="w-full bg-neutral-100 text-[#141518] placeholder-neutral-400 rounded-full px-4 py-2 text-xs border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-[#141518] uppercase tracking-wider mb-1">
                    URL Slug {isSlugEditable ? '(Editable)' : '(Read-Only)'}
                  </label>
                  <input
                    type="text"
                    disabled={!isSlugEditable}
                    value={commSlug}
                    onChange={(e) => setCommSlug(e.target.value)}
                    className="w-full bg-neutral-100 text-neutral-500 rounded-full px-4 py-2 text-xs border border-neutral-200 font-mono disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold text-[#141518] uppercase tracking-wider mb-1">
                    Initials Badge
                  </label>
                  <input
                    type="text"
                    value={commInitials}
                    onChange={(e) => setCommInitials(e.target.value)}
                    placeholder="e.g. IEEE"
                    className="w-full bg-neutral-100 text-[#141518] placeholder-neutral-400 rounded-full px-4 py-2 text-xs border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-[#141518] uppercase tracking-wider mb-1">
                    Brand Accent Color (Hex)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={commColor.startsWith('#') ? commColor : '#6366f1'}
                      onChange={(e) => setCommColor(e.target.value)}
                      className="w-8 h-8 rounded-full border border-neutral-300 p-0 cursor-pointer overflow-hidden"
                    />
                    <input
                      type="text"
                      value={commColor}
                      onChange={(e) => setCommColor(e.target.value)}
                      placeholder="#6366f1"
                      className="w-full bg-neutral-100 text-[#141518] placeholder-neutral-400 rounded-full px-4 py-2 text-xs border border-neutral-200 font-mono focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-extrabold text-[#141518] uppercase tracking-wider">
                  Community Logo Image
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoFileUpload}
                    disabled={uploadingLogo}
                    id="comm-logo-upload"
                    className="hidden"
                  />
                  <label
                    htmlFor="comm-logo-upload"
                    className="flex-1 py-2 px-4 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-[#141518] text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
                    <span>{uploadingLogo ? 'Uploading Logo...' : 'Upload Logo WebP'}</span>
                  </label>

                  <span className="text-[10px] text-neutral-400 font-mono text-center shrink-0 font-bold">OR</span>

                  <input
                    type="text"
                    value={commLogoUrl}
                    onChange={(e) => setCommLogoUrl(e.target.value)}
                    placeholder="Paste image URL (https://...)"
                    className="flex-[2] bg-neutral-100 text-[#141518] placeholder-neutral-400 rounded-full px-4 py-2 text-xs border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-[#141518] uppercase tracking-wider mb-1">
                  Community Description / Bio
                </label>
                <textarea
                  value={commDescription}
                  onChange={(e) => setCommDescription(e.target.value)}
                  placeholder="Tell students what your community represents, activities, and vision..."
                  rows={4}
                  className="w-full bg-neutral-100 text-[#141518] placeholder-neutral-400 rounded-2xl p-3 text-xs border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditCommModalOpen(false)}
                  className="py-2 px-4 rounded-full text-neutral-500 hover:text-[#141518] text-xs font-bold hover:bg-neutral-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingComm}
                  className="py-2.5 px-6 rounded-full bg-[#141518] hover:bg-black text-white text-xs font-extrabold shadow-md disabled:opacity-50 transition-all"
                >
                  {savingComm ? 'Saving Changes...' : 'Save Community Details'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {eventModalOpen && mounted && typeof document !== 'undefined' && createPortal(
        <div
          data-lenis-prevent
          onClick={(e) => {
            if (e.target === e.currentTarget) setEventModalOpen(false);
          }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
        >
          <div className="w-full max-w-2xl bg-white border border-neutral-200/80 rounded-[28px] p-5 sm:p-7 space-y-4 my-auto max-h-[90vh] overflow-y-auto shadow-2xl relative text-[#141518]">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3 sticky top-0 bg-white z-10">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#141518] flex items-center gap-2 font-display">
                <Calendar className="w-5 h-5 text-[#141518]" />
                {editingEvent ? 'Modify Community Event' : 'Create New Community Event'}
              </h2>
              <button
                onClick={() => setEventModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-[#141518] rounded-full hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4">
              <div>
                <label className="block text-[11px] font-extrabold text-[#141518] uppercase tracking-wider mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. AI & Robotics Bootcamp"
                  required
                  className="w-full bg-neutral-100 text-[#141518] placeholder-neutral-400 rounded-full px-4 py-2.5 text-xs border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold text-[#141518] uppercase tracking-wider mb-1">
                    Event Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-neutral-100 text-[#141518] rounded-full px-4 py-2.5 text-xs border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Competition">Competition</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Meetup">Meetup</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Other">Other (Custom)</option>
                  </select>
                </div>

                {category === 'Other' && (
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#141518] uppercase tracking-wider mb-1">
                      Custom Category Name *
                    </label>
                    <input
                      type="text"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="e.g. Ideathon"
                      required
                      className="w-full bg-neutral-100 text-[#141518] rounded-full px-4 py-2.5 text-xs border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-extrabold text-[#141518] uppercase tracking-wider mb-1">
                    Initial Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'live' | 'closed')}
                    className="w-full bg-neutral-100 text-[#141518] rounded-full px-4 py-2.5 text-xs border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="closed">Closed (Draft Slot)</option>
                    <option value="live">Live (Published Publicly)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold text-[#141518] uppercase tracking-wider mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="w-full bg-neutral-100 text-[#141518] rounded-full px-4 py-2 text-xs border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-[#141518] uppercase tracking-wider mb-1">
                    End Date (For Multi-Day)
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-neutral-100 text-[#141518] rounded-full px-4 py-2 text-xs border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold text-[#141518] uppercase tracking-wider mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-neutral-100 text-[#141518] rounded-full px-4 py-2 text-xs border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-[#141518] uppercase tracking-wider mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-neutral-100 text-[#141518] rounded-full px-4 py-2 text-xs border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold text-[#141518] uppercase tracking-wider mb-1">
                    Format
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as 'offline' | 'online')}
                    className="w-full bg-neutral-100 text-[#141518] rounded-full px-4 py-2.5 text-xs border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="offline">Offline (In-Person)</option>
                    <option value="online">Online (Virtual)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-[#141518] uppercase tracking-wider mb-1">
                    Venue / Link
                  </label>
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder={eventType === 'online' ? 'Google Meet / Zoom URL' : 'Auditorium / Lab 3'}
                    required
                    className="w-full bg-neutral-100 text-[#141518] rounded-full px-4 py-2.5 text-xs border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-extrabold text-[#141518] uppercase tracking-wider">
                  Event Poster (WebP)
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePosterFileUpload}
                    disabled={uploadingPoster}
                    id="event-poster-upload"
                    className="hidden"
                  />
                  <label
                    htmlFor="event-poster-upload"
                    className="flex-1 py-2 px-4 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-[#141518] text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
                    <span>{uploadingPoster ? `Uploading ${uploadProgress}%` : 'Upload Poster Image'}</span>
                  </label>

                  <span className="text-[10px] text-neutral-400 font-mono text-center shrink-0 font-bold">OR</span>

                  <input
                    type="text"
                    value={posterUrl}
                    onChange={(e) => setPosterUrl(e.target.value)}
                    placeholder="Paste image URL (https://...)"
                    className="flex-[2] bg-neutral-100 text-[#141518] placeholder-neutral-400 rounded-full px-4 py-2 text-xs border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                {uploadingPoster && (
                  <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden mt-1">
                    <div
                      className="bg-[#141518] h-full transition-all duration-300 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-[#141518] uppercase tracking-wider mb-1">
                  Registration / Redirect Link (Optional)
                </label>
                <input
                  type="url"
                  value={redirectUrl}
                  onChange={(e) => setRedirectUrl(e.target.value)}
                  placeholder="https://forms.google.com/..."
                  className="w-full bg-neutral-100 text-[#141518] placeholder-neutral-400 rounded-full px-4 py-2 text-xs border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-[#141518] uppercase tracking-wider mb-1">
                  Event Description & Guidelines
                </label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Detail schedule, requirements, rules, coordinator contacts..."
                  rows={3}
                  className="w-full bg-neutral-100 text-[#141518] placeholder-neutral-400 rounded-2xl p-3 text-xs border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-[#141518] uppercase tracking-wider mb-1">
                  Highlights / Perks (Optional)
                </label>
                <input
                  type="text"
                  value={perks}
                  onChange={(e) => setPerks(e.target.value)}
                  placeholder="e.g. KTU Activity Points, Certificates, Refreshments"
                  className="w-full bg-neutral-100 text-[#141518] placeholder-neutral-400 rounded-full px-4 py-2 text-xs border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEventModalOpen(false)}
                  className="py-2 px-4 rounded-full text-neutral-500 hover:text-[#141518] text-xs font-bold hover:bg-neutral-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEvent}
                  className="py-2.5 px-6 rounded-full bg-[#141518] hover:bg-black text-white text-xs font-extrabold shadow-md disabled:opacity-50 transition-all"
                >
                  {savingEvent ? 'Saving Event...' : editingEvent ? 'Save Changes' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {deleteId && mounted && typeof document !== 'undefined' && createPortal(
        <div
          data-lenis-prevent
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeleteId(null);
          }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <div className="w-full max-w-sm bg-white border border-neutral-200 rounded-[28px] p-6 space-y-4 shadow-2xl text-center">
            <div className="p-3 rounded-full bg-rose-50 text-rose-600 w-fit mx-auto border border-rose-100">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-[#141518] font-display">Delete Event?</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Are you sure you want to permanently delete this event? This action cannot be reversed.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="py-2 px-5 rounded-full text-xs font-bold text-neutral-600 hover:bg-neutral-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteEvent}
                className="py-2 px-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-md transition-all"
              >
                Delete Event
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
