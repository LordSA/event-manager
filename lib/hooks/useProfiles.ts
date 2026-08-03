// Created by Shibili Aman TK | GitHub: https://github.com/LordSA
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Profile } from '@/types/database.types';

export interface UserAccountWithCommunity extends Profile {
  community_name?: string;
}

export function useProfiles() {
  const [profiles, setProfiles] = useState<UserAccountWithCommunity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfiles = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('*, community:communities(name)');

      if (!error && data) {
        const mapped: UserAccountWithCommunity[] = data.map((item: any) => ({
          ...item,
          community_name: item.community?.name || (item.role === 'dev' || item.role === 'admin' ? 'Super Admin (All)' : 'Unassigned'),
        }));
        setProfiles(mapped);
      }
    } catch (err) {
      console.error('Error fetching profiles from Supabase:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();

    const supabase = createClient();
    const channel = supabase
      .channel('realtime-profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        fetchProfiles();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { profiles, setProfiles, loading, refetch: fetchProfiles };
}
