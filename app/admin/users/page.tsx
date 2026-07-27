'use client';

import React, { useState } from 'react';
import { Users, Shield, Plus, Check, Mail, Building } from 'lucide-react';
import { UserRole } from '@/types/database.types';

interface UserAccount {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  community: string;
}

export default function UsersManagementPage() {
  const [usersList, setUsersList] = useState<UserAccount[]>([
    { id: '1', email: 'shibili@cev.ac.in', full_name: 'Shibili Aman TK', role: 'dev', community: 'Super Admin (All)' },
    { id: '2', email: 'saivivek@cev.ac.in', full_name: 'Saivivek M.V', role: 'admin', community: 'Super Admin (All)' },
    { id: '3', email: 'ieee.lead@cev.ac.in', full_name: 'IEEE Lead', role: 'manager', community: 'IEEE SB CEV' },
    { id: '4', email: 'iedc.lead@cev.ac.in', full_name: 'IEDC Lead', role: 'manager', community: 'IEDC CEV' },
    { id: '5', email: 'tinkerhub.editor@cev.ac.in', full_name: 'TinkerHub Editor', role: 'editor', community: 'TinkerHub CEV' },
  ]);

  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [roleInput, setRoleInput] = useState<UserRole>('editor');
  const [communityInput, setCommunityInput] = useState('IEEE SB CEV');
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !nameInput) return;

    const newUser: UserAccount = {
      id: Date.now().toString(),
      email: emailInput,
      full_name: nameInput,
      role: roleInput,
      community: roleInput === 'dev' || roleInput === 'admin' ? 'Super Admin (All)' : communityInput,
    };

    setUsersList([...usersList, newUser]);
    setEmailInput('');
    setNameInput('');
    setShowAddModal(false);
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    setUsersList(
      usersList.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
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

      {/* Users Table */}
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
              {usersList.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-white">{user.full_name}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3" /> {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-medium text-slate-300">
                      <Building className="w-3.5 h-3.5 text-blue-400" />
                      {user.community}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
                    <option value="IEEE SB CEV">IEEE SB CEV</option>
                    <option value="IEDC CEV">IEDC CEV</option>
                    <option value="TinkerHub CEV">TinkerHub CEV</option>
                    <option value="FOSS Club CEV">FOSS Club CEV</option>
                    <option value="MuLearn CEV">MuLearn CEV</option>
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
