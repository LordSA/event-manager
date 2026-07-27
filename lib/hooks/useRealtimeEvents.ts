'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { EventItemData } from '@/app/components/MasterCalendar';

export function useRealtimeEvents() {
  const [eventsList, setEventsList] = useState<EventItemData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('events')
        .select('*, community:communities(name)')
        .order('event_date', { ascending: true });

      if (!error && data) {
        const mapped: EventItemData[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          category: item.category || 'workshop',
          community: item.community?.name || 'CEV Community',
          date: item.event_date,
          description: item.description || '',
          status: item.status as 'closed' | 'live',
          image: item.poster_url || '/images/bit.jpg',
        }));
        setEventsList(mapped);
      }
    } catch (err) {
      console.error('Failed to fetch events from Supabase:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();

    try {
      const supabase = createClient();
      const channel = supabase
        .channel('realtime-events')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => {
          fetchEvents();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch {
      // Ignore channel errors
    }
  }, []);

  return { eventsList, setEventsList, loading, refetch: fetchEvents };
}
