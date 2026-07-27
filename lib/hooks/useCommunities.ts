'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { communities as defaultCommunities } from '@/app/lib/data';
import { Community } from '@/types/database.types';

export function useCommunities() {
  const defaultMapped: Community[] = defaultCommunities.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.id,
    logo_url: null,
    description: c.description,
    color: c.color,
    initials: c.initials,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));

  const [communities, setCommunities] = useState<Community[]>(defaultMapped);
  const [loading, setLoading] = useState(false);

  const fetchCommunities = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .order('name', { ascending: true });

      if (!error && data && data.length > 0) {
        setCommunities(data);
      }
    } catch {
      // Keep default mapped communities
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();

    try {
      const supabase = createClient();
      const channel = supabase
        .channel('realtime-communities')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'communities' }, () => {
          fetchCommunities();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch {
      // Ignore channel errors in development
    }
  }, []);

  return { communities, setCommunities, loading, refetch: fetchCommunities };
}
