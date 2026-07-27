'use client';

import React, { useState } from 'react';
import { Users, Shield, Plus, Check, Mail, Building } from 'lucide-react';
import { UserRole } from '@/types/database.types';
import { useProfiles, UserAccountWithCommunity } from '@/lib/hooks/useProfiles';
import { useCommunities } from '@/lib/hooks/useCommunities';
import { createClient } from '@/lib/supabase/client';

export default function UsersManagementPage() {
  const { profiles, setProfiles, loading } = useProfiles();
  const { communities } = useCommunities();

  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [roleInput, setRoleInput] = useState<UserRole>('editor');
  const [communityInput, setCommunityInput] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !nameInput) return;

    const newProfile: UserAccountWithCommunity = {
      id: Date.now().toString(),
      email: emailInput,
      full_name: nameInput,
      role: roleInput,
      community_id: communityInput || null,
      community_name: communityInput ? (communities.find(c => c.id === communityInput)?.name || 'Assigned Community') : 'Super Admin (All)',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setProfiles([...profiles, newProfile]);

    try {
      const supabase = createClient();
      await supabase.from('profiles').insert({
        email: emailInput,
        full_name: nameInput,
        role: roleInput,
        community_id: communityInput || null,
      });
    } catch (err) {
      console.error(err);
    }

    setEmailInput('');
    setNameInput('');
    setShowAddModal(false);
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setProfiles(
      profiles.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );

    try {
      const supabase = createClient();
      await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-500" />
            User Management & RBAC Roles
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Restricted to Dev & Admin roles. Invite leads, update permissions, and assign community scoping.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors shadow-lg shadow-blue-500/25"
        >
          <Plus className="w-4 h-4" />
          <span>Invite / Assign User</span>
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-400 text-sm bg-slate-900/60 border border-slate-800 rounded-2xl">
          Loading user profiles from database...
        </div>
      ) : (
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Assigned Community</th>
                  <th className="px-6 py-4">Current Role</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {profiles.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500 text-xs italic">
                      No user accounts registered yet. Click &quot;Invite / Assign User&quot; to add your first team member.
                    </td>
                  </tr>
                ) : (
                  profiles.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{user.full_name || 'Anonymous User'}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" /> {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-medium text-slate-300">
                          <Building className="w-3.5 h-3.5 text-blue-400" />
                          {user.community_name || 'Super Admin (All)'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                          className="bg-slate-950 text-slate-200 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-semibold uppercase focus:outline-none focus:border-blue-500"
                        >
                          <option value="dev">Dev (Super Admin)</option>
                          <option value="admin">Admin</option>
                          <option value="manager">Manager (Lead)</option>
                          <option value="editor">Editor</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-xs text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-800/50 inline-flex items-center gap-1">
                          <Check className="w-3 h-3" /> Active
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4 text-white shadow-2xl">
            <h3 className="text-xl font-bold">Invite New User</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="lead@cev.ac.in"
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Role</label>
                <select
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value as UserRole)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="editor">Editor</option>
                  <option value="manager">Manager (Lead)</option>
                  <option value="admin">Admin</option>
                  <option value="dev">Dev</option>
                </select>
              </div>

              {roleInput !== 'dev' && roleInput !== 'admin' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Assigned Community</label>
                  <select
                    value={communityInput}
                    onChange={(e) => setCommunityInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="">-- Select Community --</option>
                    {communities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm shadow-lg shadow-blue-500/20"
                >
                  Confirm Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
