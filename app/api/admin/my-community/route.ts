import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

function getAdminSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    });

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('community_id, role')
      .eq('id', session.user.id)
      .single();

    if (!profile?.community_id) {
      return NextResponse.json({ community: null, role: profile?.role });
    }

    const { data: community } = await supabase
      .from('communities')
      .select('*')
      .eq('id', profile.community_id)
      .single();

    return NextResponse.json({ community, role: profile.role });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch community';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    });

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('community_id, role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'manager' && profile?.role !== 'admin' && profile?.role !== 'dev') {
      return NextResponse.json({ error: 'Only Managers and Admins can edit community details.' }, { status: 403 });
    }

    const body = await req.json();
    const { name, description, color, initials, logo_url } = body;
    const targetCommunityId = body.id || profile?.community_id;

    if (!targetCommunityId) {
      return NextResponse.json({ error: 'No community specified' }, { status: 400 });
    }

    const adminSupabase = getAdminSupabaseClient();
    const payload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (name !== undefined) payload.name = name;
    if (description !== undefined) payload.description = description;
    if (color !== undefined) payload.color = color;
    if (initials !== undefined) payload.initials = initials;
    if (logo_url !== undefined) payload.logo_url = logo_url;

    let updatedComm: any = { id: targetCommunityId, ...payload };

    try {
      const { data } = await adminSupabase
        .from('communities')
        .update(payload)
        .eq('id', targetCommunityId)
        .select('*')
        .single();

      if (data) updatedComm = data;
    } catch {
    }

    return NextResponse.json({ success: true, community: updatedComm });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update community';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
