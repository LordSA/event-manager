'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, Briefcase, Key, Image as ImageIcon, CheckCircle2, AlertCircle, Shield, Building } from 'lucide-react';
import Image from 'next/image';

export default function MyProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchMyProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/profile');
        const data = await res.json();
        if (res.ok && data.profile) {
          setProfile(data.profile);
          setFullName(data.profile.full_name || '');
          setAvatarUrl(data.profile.avatar_url || '');
        }
      } catch {
        setToastMsg({ type: 'error', text: 'Failed to load profile.' });
      } finally {
        setLoading(false);
      }
    };

    fetchMyProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setToastMsg(null);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          avatar_url: avatarUrl,
          password: password || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setToastMsg({ type: 'success', text: 'Your profile has been updated successfully!' });
        setPassword('');
        if (data.profile) {
          setProfile((prev: any) => ({ ...prev, ...data.profile }));
        }
      } else {
        throw new Error(data.error || 'Failed to update profile');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile';
      setToastMsg({ type: 'error', text: msg });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 text-sm bg-slate-900/60 border border-slate-800 rounded-2xl">
        Loading profile information...
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-8 pb-20 md:pb-12">
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <User className="w-8 h-8 text-blue-400" />
          My Profile & Account Settings
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your personal account details, profile picture, and auth password.
        </p>
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

      {/* Account Info Card */}
      <div className="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-slate-800">
          <div className="relative w-20 h-20 rounded-3xl overflow-hidden bg-slate-800 border border-slate-700 shrink-0 flex items-center justify-center text-2xl font-extrabold text-white shadow-lg">
            {avatarUrl || profile?.avatar_url ? (
              <Image
                src={avatarUrl || profile?.avatar_url}
                alt={fullName || profile?.email}
                fill
                className="object-cover"
              />
            ) : (
              <span>{(fullName || profile?.email || 'ME').substring(0, 2).toUpperCase()}</span>
            )}
          </div>

          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-xl font-bold text-white">{profile?.full_name || 'My Profile'}</h2>
            <p className="text-xs text-slate-400">{profile?.email}</p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-950 text-blue-400 border border-blue-800 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                {profile?.role || 'editor'}
              </span>

              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 flex items-center gap-1">
                <Building className="w-3 h-3 text-slate-400" />
                {profile?.community?.name || 'Super Admin (All)'}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="w-full bg-slate-950 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-3 text-sm border border-slate-800 focus:outline-none focus:border-blue-500"
              />
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address (Fixed)
            </label>
            <div className="relative">
              <input
                type="email"
                disabled
                value={profile?.email || ''}
                className="w-full bg-slate-950/60 text-slate-400 rounded-xl pl-10 pr-4 py-3 text-sm border border-slate-800 cursor-not-allowed"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Profile Picture URL (Avatar)
            </label>
            <div className="relative">
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full bg-slate-950 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-3 text-sm border border-slate-800 focus:outline-none focus:border-blue-500"
              />
              <ImageIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Change Auth Password (Optional)
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep existing password"
                className="w-full bg-slate-950 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-3 text-sm border border-slate-800 focus:outline-none focus:border-blue-500"
              />
              <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="py-3 px-8 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {saving ? 'Updating Profile...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
