export type UserRole = 'dev' | 'admin' | 'manager' | 'editor';
export type EventStatus = 'closed' | 'live';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  position: string | null;
  avatar_url: string | null;
  role: UserRole;
  community_id: string | null;
  created_at: string;
  updated_at: string;
  community?: Community;
}

export interface Community {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  description: string | null;
  color: string;
  initials: string;
  created_at: string;
  updated_at: string;
}

export interface EventItem {
  id: string;
  community_id: string;
  slug: string;
  title: string;
  category: string;
  poster_url: string | null;
  event_date: string;
  time_slot: string;
  venue: string | null;
  event_format?: 'offline' | 'online';
  redirect_url: string | null;
  status: EventStatus;
  system_prompt: string | null;
  description: string | null;
  perks?: string | null;
  created_at: string;
  updated_at: string;
  community?: Community;
}

export interface AiConfig {
  id: string;
  provider_name: 'gemini' | 'grok' | 'openrouter';
  priority_order: number;
  is_active: boolean;
  api_key_env_var: string;
  model_name: string;
  created_at: string;
}

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface SupportTicket {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  issue: string;
  screenshot_url: string | null;
  suggestions: string | null;
  status: TicketStatus;
  created_at: string;
  updated_at: string;
}
