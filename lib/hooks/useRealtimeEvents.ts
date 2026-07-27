'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { events as mockEvents } from '@/app/lib/data';
import { EventItemData } from '@/app/components/MasterCalendar';

export function useRealtimeEvents() {
  const [eventsList, setEventsList] = useState<EventItemData[]>(
    mockEvents.map((e) => ({ ...e, status: 'live' as const }))
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // 1. Fetch initial live & closed events from database
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*, community:communities(name)');

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
      } catch (err) {
        console.error('Supabase fetch failed, using initial mock data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

    // 2. Subscribe to Supabase Postgres Realtime changes on 'events' table
    const channel = supabase
      .channel('realtime-events-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'events' },
        (_payload) => {
          // Refresh list instantly whenever an event is inserted, updated, or deleted
          fetchEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { eventsList, setEventsList, loading };
}
