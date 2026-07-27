'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { events as defaultEvents } from '@/app/lib/data';
import { EventItemData } from '@/app/components/MasterCalendar';

export function useRealtimeEvents() {
  const defaultMapped: EventItemData[] = defaultEvents.map((e) => ({
    id: e.id,
    title: e.title,
    category: e.category,
    community: e.community,
    date: e.date,
    description: e.description,
    status: 'live' as const,
    image: e.image,
  }));

  const [eventsList, setEventsList] = useState<EventItemData[]>(defaultMapped);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('events')
        .select('*, community:communities(name)')
        .order('event_date', { ascending: true });

      if (!error && data && data.length > 0) {
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
    } catch {
      // Keep default mapped events on error
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
      // Ignore channel errors in development
    }
  }, []);

  return { eventsList, setEventsList, loading, refetch: fetchEvents };
}
