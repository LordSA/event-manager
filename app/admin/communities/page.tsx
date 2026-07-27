'use client';

import React, { useState } from 'react';
import { Building, Plus, Edit2, Trash2 } from 'lucide-react';
import { useCommunities } from '@/lib/hooks/useCommunities';
import { createClient } from '@/lib/supabase/client';

export default function CommunitiesManagementPage() {
  const { communities, setCommunities, loading } = useCommunities();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [color, setColor] = useState('from-blue-600 to-cyan-400');
  const [initials, setInitials] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const newComm = {
      id: Date.now().toString(),
      name,
      slug,
      description: desc || 'Campus technical community.',
      color,
      initials: initials || name.slice(0, 2).toUpperCase(),
      logo_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setCommunities([...communities, newComm]);

    try {
      const supabase = createClient();
      await supabase.from('communities').insert({
        name,
        slug,
        description: desc,
        color,
        initials: initials || name.slice(0, 2).toUpperCase(),
      });
    } catch (err) {
      console.error(err);
    }

    setName('');
    setDesc('');
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    setCommunities(communities.filter((c) => c.id !== id));
    try {
      const supabase = createClient();
      await supabase.from('communities').delete().eq('id', id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Building className="w-8 h-8 text-cyan-400" />
            Community Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Dev & Admins can create or delete communities. Managers can update their own community bio and accent styling.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors shadow-lg shadow-blue-500/25"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Community</span>
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-400 text-sm bg-slate-900/60 border border-slate-800 rounded-2xl">
          Loading community entities from database...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((c) => (
            <div key={c.id} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${c.color || 'from-blue-600 to-cyan-400'} flex items-center justify-center text-white font-extrabold text-lg shadow-lg`}>
                    {c.initials || c.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex items-center space-x-1">
                    <button className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">{c.name}</h3>
                  <p className="text-sm text-slate-400 mt-1">{c.description}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
                <span>Slug: {c.slug || c.name.toLowerCase().replace(/\s+/g, '-')}</span>
                <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  {c.color || 'from-blue-600 to-cyan-400'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4 text-white shadow-2xl">
            <h3 className="text-xl font-bold">Create Community Entity</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Community Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. IEEE SB CEV"
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Initials Badge</label>
                <input
                  type="text"
                  value={initials}
                  onChange={(e) => setInitials(e.target.value)}
                  placeholder="e.g. IE"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Description / Bio</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Community mission..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 h-24"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Gradient Theme Class</label>
                <select
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="from-blue-600 to-cyan-400">Electric Blue / Cyan</option>
                  <option value="from-green-500 to-emerald-300">Emerald Green</option>
                  <option value="from-yellow-400 to-orange-500">Solar Amber</option>
                  <option value="from-green-600 to-lime-400">Lime Green</option>
                  <option value="from-purple-600 to-pink-500">Neon Violet</option>
                </select>
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
                  Create Community
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
