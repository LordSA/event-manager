'use client';

import React, { useState, useEffect } from 'react';
import { Building, Edit2, CheckCircle2, AlertCircle, Eye, ShieldAlert } from 'lucide-react';
import { UserRole } from '@/types/database.types';

export default function MyCommunityPage() {
  const [community, setCommunity] = useState<any>(null);
  const [role, setRole] = useState<UserRole>('editor');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('from-blue-600 to-cyan-400');
  const [initials, setInitials] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    const fetchCommunity = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/my-community');
        const data = await res.json();
        if (res.ok && data.community) {
          setCommunity(data.community);
          setRole(data.role || 'editor');
          setName(data.community.name || '');
          setDescription(data.community.description || '');
          setColor(data.community.color || 'from-blue-600 to-cyan-400');
          setInitials(data.community.initials || '');
          setLogoUrl(data.community.logo_url || '');
        } else if (data.role) {
          setRole(data.role);
        }
      } catch {
        setToastMsg({ type: 'error', text: 'Failed to load community details.' });
      } finally {
        setLoading(false);
      }
    };

    fetchCommunity();
  }, []);

  const handleUpdateCommunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'editor') return; // Read-only for editors

    setSaving(true);
    setToastMsg(null);

    try {
      const res = await fetch('/api/admin/my-community', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: community?.id,
          name,
          description,
          color,
          initials,
          logo_url: logoUrl,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setToastMsg({ type: 'success', text: 'Community details updated successfully!' });
        if (data.community) {
          setCommunity((prev: any) => ({ ...prev, ...data.community }));
        }
      } else {
        throw new Error(data.error || 'Failed to update community');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update community';
      setToastMsg({ type: 'error', text: msg });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 text-sm bg-slate-900/60 border border-slate-800 rounded-2xl">
        Loading community details...
      </div>
    );
  }

  if (!community) {
    return (
      <div className="p-12 text-center text-slate-400 text-sm bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2">
        <ShieldAlert className="w-8 h-8 text-amber-400 mx-auto" />
        <p className="font-bold text-white text-base">No Community Assigned</p>
        <p>Your account is not assigned to a specific community entity yet.</p>
      </div>
    );
  }

  const isEditable = role === 'manager' || role === 'admin' || role === 'dev';

  return (
    <div className="max-w-4xl space-y-8 pb-20 md:pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Building className="w-8 h-8 text-cyan-400" />
            {community.name} - Profile & Settings
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {isEditable
              ? 'As a Manager, you can edit your community bio, initials, and accent styling.'
              : 'As an Editor, you have read-only visibility for your assigned community.'}
          </p>
        </div>

        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 w-fit">
          {isEditable ? <Edit2 className="w-3.5 h-3.5 text-blue-400" /> : <Eye className="w-3.5 h-3.5 text-emerald-400" />}
          <span>{isEditable ? 'Manager Edit Access' : 'Editor Visibility Access'}</span>
        </div>
      </div>

      {toastMsg && (
        <div
          className={`p-4 rounded-2xl border text-sm flex items-center gap-3 ${
            toastMsg.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-800 text-emerald-200'
              : 'bg-red-950/80 border-red-800 text-red-200'
          }`}
        >
          {toastMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* Community Card Preview */}
      <div className="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6 shadow-xl relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-80 h-80 bg-gradient-to-r ${color} opacity-15 rounded-full blur-3xl pointer-events-none`} />

        <div className="flex items-center space-x-5 border-b border-slate-800 pb-6">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${color} flex items-center justify-center text-white font-extrabold text-2xl shadow-xl shrink-0`}>
            {initials || name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{name}</h2>
            <p className="text-xs text-slate-400 mt-0.5">Slug: {community.slug}</p>
          </div>
        </div>

        <form onSubmit={handleUpdateCommunity} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Community Name
              </label>
              <input
                type="text"
                disabled={!isEditable}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-950 text-white disabled:text-slate-400 rounded-xl px-4 py-2.5 text-sm border border-slate-800 focus:outline-none focus:border-blue-500 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Initials Badge
              </label>
              <input
                type="text"
                disabled={!isEditable}
                value={initials}
                onChange={(e) => setInitials(e.target.value)}
                className="w-full bg-slate-950 text-white disabled:text-slate-400 rounded-xl px-4 py-2.5 text-sm border border-slate-800 focus:outline-none focus:border-blue-500 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description / Mission Bio
            </label>
            <textarea
              disabled={!isEditable}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 text-white disabled:text-slate-400 rounded-xl px-4 py-2.5 text-sm border border-slate-800 focus:outline-none focus:border-blue-500 h-28 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Gradient Theme Accent
            </label>
            <select
              disabled={!isEditable}
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full bg-slate-950 text-white disabled:text-slate-400 rounded-xl px-4 py-2.5 text-sm border border-slate-800 focus:outline-none focus:border-blue-500 disabled:cursor-not-allowed"
            >
              <option value="from-blue-600 to-cyan-400">Electric Blue / Cyan</option>
              <option value="from-green-500 to-emerald-300">Emerald Green</option>
              <option value="from-yellow-400 to-orange-500">Solar Amber</option>
              <option value="from-green-600 to-lime-400">Lime Green</option>
              <option value="from-purple-600 to-pink-500">Neon Violet</option>
            </select>
          </div>

          {isEditable && (
            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="py-3 px-8 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {saving ? 'Updating...' : 'Save Community Profile'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
