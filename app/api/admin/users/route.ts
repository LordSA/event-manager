// Created by Shibili Aman TK | GitHub: https://github.com/LordSA
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAdminSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

async function getRequesterRole(req: NextRequest, supabase: any): Promise<string | null> {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return null;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    return profile?.role || null;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const supabase = getAdminSupabaseClient();
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*, community:communities(name, color, initials)')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ profiles: [] });
    }

    return NextResponse.json({ profiles: profiles || [] });
  } catch {
    return NextResponse.json({ profiles: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, full_name, position, avatar_url, role = 'manager', community_id = null } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const supabase = getAdminSupabaseClient();

    if (role === 'dev') {
      const requesterRole = await getRequesterRole(req, supabase);
      if (requesterRole && requesterRole !== 'dev') {
        return NextResponse.json({ error: 'Forbidden: Only Dev users can create Dev accounts.' }, { status: 403 });
      }
    }

    let userId = `usr_${Date.now()}`;
    try {
      const { data: authData } = await supabase.auth.admin.createUser({
        email,
        password: password || 'DefaultPass123!',
        email_confirm: true,
        user_metadata: {
          full_name,
          position,
          avatar_url,
        },
      });

      if (authData?.user?.id) {
        userId = authData.user.id;
      }
    } catch (authErr) {
      console.warn('Auth user creation warning (using profile fallback ID):', authErr);
    }

    const profilePayload = {
      id: userId,
      email,
      full_name: full_name || null,
      position: position || null,
      avatar_url: avatar_url || null,
      role,
      community_id: community_id || null,
      updated_at: new Date().toISOString(),
    };

    let profileData: any = profilePayload;

    try {
      const { data: insertedProfile } = await supabase
        .from('profiles')
        .upsert(profilePayload)
        .select('*, community:communities(name, color, initials)')
        .single();

      if (insertedProfile) {
        profileData = insertedProfile;
      }
    } catch {
    }

    return NextResponse.json({ success: true, profile: profileData });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create user';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, email, password, full_name, position, avatar_url, role, community_id } = body;

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const supabase = getAdminSupabaseClient();

    const { data: existingProfile } = await supabase.from('profiles').select('role').eq('id', id).single();
    if (existingProfile?.role === 'dev' || role === 'dev') {
      const requesterRole = await getRequesterRole(req, supabase);
      if (requesterRole && requesterRole !== 'dev') {
        return NextResponse.json({ error: 'Forbidden: Dev accounts cannot be modified by non-dev roles.' }, { status: 403 });
      }
    }

    if (email || password) {
      try {
        const updateAuthAttributes: Record<string, any> = {};
        if (email) updateAuthAttributes.email = email;
        if (password) updateAuthAttributes.password = password;
        updateAuthAttributes.user_metadata = { full_name, position, avatar_url };

        await supabase.auth.admin.updateUserById(id, updateAuthAttributes);
      } catch {
      }
    }

    const profilePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (email !== undefined) profilePayload.email = email;
    if (full_name !== undefined) profilePayload.full_name = full_name;
    if (position !== undefined) profilePayload.position = position;
    if (avatar_url !== undefined) profilePayload.avatar_url = avatar_url;
    if (role !== undefined) profilePayload.role = role;
    if (community_id !== undefined) profilePayload.community_id = community_id || null;

    let updatedProfile: any = { id, ...profilePayload };

    try {
      const { data } = await supabase
        .from('profiles')
        .update(profilePayload)
        .eq('id', id)
        .select('*, community:communities(name, color, initials)')
        .single();

      if (data) {
        updatedProfile = data;
      }
    } catch {
    }

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update user';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const supabase = getAdminSupabaseClient();

    const { data: targetProfile } = await supabase.from('profiles').select('role').eq('id', id).single();
    if (targetProfile?.role === 'dev') {
      const requesterRole = await getRequesterRole(req, supabase);
      if (requesterRole && requesterRole !== 'dev') {
        return NextResponse.json({ error: 'Forbidden: Dev accounts cannot be deleted by non-dev roles.' }, { status: 403 });
      }
    }

    try {
      await supabase.auth.admin.deleteUser(id);
    } catch {
    }

    try {
      await supabase.from('profiles').delete().eq('id', id);
    } catch {
    }

    return NextResponse.json({ success: true, id });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete user';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
