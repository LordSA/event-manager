'use client';

import React, { useState, useEffect } from 'react';
import { Building, Plus, Trash2, ShieldAlert, Image as ImageIcon, Link2, Upload } from 'lucide-react';
import { useCommunities } from '@/lib/hooks/useCommunities';
import { createClient } from '@/lib/supabase/client';
import { UserRole } from '@/types/database.types';
import { uploadImageFile } from '@/lib/upload';

export default function CommunitiesManagementPage() {
  const { communities, setCommunities, loading } = useCommunities();
  const [userRole, setUserRole] = useState<UserRole>('editor');
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [desc, setDesc] = useState('');
  const [color, setColor] = useState('from-blue-600 to-cyan-400');
  const [initials, setInitials] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    setUploading(true);
    try {
      const publicUrl = await uploadImageFile(file, 'logos');
      setLogoUrl(publicUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (profile?.role) {
            setUserRole(profile.role);
          }
        }
      } catch {
        // Fallback
      }
    };

    fetchUserRole();
  }, []);

  if (userRole === 'manager' || userRole === 'editor') {
    return (
      <div className="p-8 rounded-xl bg-[#0f121d] border-2 border-[#1e2436] text-center space-y-4 max-w-2xl mx-auto my-12">
        <div className="p-3 rounded-lg bg-amber-950/80 border border-amber-800 text-amber-300 w-fit mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white font-display">Access Restricted</h2>
        <p className="text-xs text-[#94a3b8] leading-relaxed">
          Community Management is restricted to Super Admins and Developers. Community Managers and Editors do not have permission to add, edit, or delete campus community entities.
        </p>
      </div>
    );
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const finalSlug = slug.trim() ? slug.toLowerCase().replace(/\s+/g, '-') : name.toLowerCase().replace(/\s+/g, '-');
    const newComm = {
      id: Date.now().toString(),
      name,
      slug: finalSlug,
      description: desc || 'Campus technical community.',
      color,
      initials: initials || name.slice(0, 2).toUpperCase(),
      logo_url: logoUrl || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setCommunities([...communities, newComm]);

    try {
      const supabase = createClient();
      await supabase.from('communities').insert({
        name,
        slug: finalSlug,
        description: desc,
        color,
        initials: initials || name.slice(0, 2).toUpperCase(),
        logo_url: logoUrl || null,
      });
    } catch (err) {
      console.error(err);
    }

    setName('');
    setSlug('');
    setDesc('');
    setLogoUrl('');
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1e2436] pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3 font-display">
            <Building className="w-6 h-6 text-[#6366f1]" />
            Community Management
          </h1>
          <p className="text-xs text-[#94a3b8] mt-0.5">
            Dev & Admins can manage campus community entities, slugs, and branding logos.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="brutalist-btn-primary px-4 py-2 rounded-lg text-xs flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Community</span>
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-[#94a3b8] text-xs bg-[#0f121d] border border-[#1e2436] rounded-xl">
          Loading community entities...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((c) => (
            <div key={c.id} className="brutalist-card p-5 rounded-xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {c.logo_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={c.logo_url}
                        alt={c.name}
                        className="w-10 h-10 rounded-lg object-cover border border-[#1e2436]"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-[#161a29] border border-[#1e2436] flex items-center justify-center text-white font-bold text-sm">
                        {c.initials || c.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <h3 className="text-base font-bold text-white">{c.name}</h3>
                  </div>

                  <button
                    onClick={() => handleDelete(c.id)}
                    className="p-1.5 text-neutral-400 hover:text-red-400 rounded-md hover:bg-[#161a29] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-[#94a3b8] line-clamp-2">{c.description}</p>
              </div>

              {/* Slug & Logo Info Footer */}
              <div className="pt-3 border-t border-[#1e2436] text-[11px] text-[#94a3b8] flex items-center justify-between font-mono">
                <span className="truncate max-w-[150px]">slug: {c.slug || c.name.toLowerCase().replace(/\s+/g, '-')}</span>
                {c.logo_url && (
                  <span className="text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800 flex items-center gap-1 text-[10px]">
                    <ImageIcon className="w-3 h-3" /> Logo Set
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Dev/Admin Creation */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f121d] border-2 border-[#1e2436] rounded-xl p-6 w-full max-w-md space-y-4 text-white shadow-2xl">
            <h3 className="text-lg font-bold font-display">Create Community Entity</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-1">Community Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. IEEE SB CEV"
                  required
                  className="w-full bg-[#161a29] border border-[#1e2436] rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-[#6366f1]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-1">
                  Custom URL Slug (Dev / Admin Only)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. ieee-sb-cev"
                  className="w-full bg-[#161a29] border border-[#1e2436] rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-[#6366f1]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-1">
                  Community Logo (File Upload or URL)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoFileUpload}
                      disabled={uploading}
                      id="comm-logo-modal-upload"
                      className="hidden"
                    />
                    <label
                      htmlFor="comm-logo-modal-upload"
                      className="w-full bg-[#161a29] hover:bg-[#1e2436] text-[#94a3b8] hover:text-white rounded-lg px-3 py-2 text-xs border border-[#1e2436] flex items-center justify-center space-x-1.5 cursor-pointer transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#6366f1]" />
                      <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="url"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="Or enter Image URL"
                      className="w-full bg-[#161a29] border border-[#1e2436] rounded-lg pl-8 pr-2.5 py-2 text-xs focus:outline-none focus:border-[#6366f1]"
                    />
                    <Link2 className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-1">Initials Badge</label>
                <input
                  type="text"
                  value={initials}
                  onChange={(e) => setInitials(e.target.value)}
                  placeholder="e.g. IE"
                  className="w-full bg-[#161a29] border border-[#1e2436] rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-[#6366f1]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-1">Description / Bio</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Community mission..."
                  className="w-full bg-[#161a29] border border-[#1e2436] rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-[#6366f1] h-20"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#1e2436]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 text-xs text-[#94a3b8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="brutalist-btn-primary px-4 py-2 rounded-lg text-xs"
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
