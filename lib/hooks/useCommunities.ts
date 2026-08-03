// Created by Shibili Aman TK | GitHub: https://github.com/LordSA
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Community } from '@/types/database.types';

export function useCommunities() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCommunities = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .order('name', { ascending: true });

      if (!error && data) {
        setCommunities(data);
      }
    } catch (err) {
      console.error('Failed to fetch communities from Supabase:', err);
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
    }
  }, []);

  return { communities, setCommunities, loading, refetch: fetchCommunities };
}
