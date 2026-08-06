// Created by Shibili Aman TK | GitHub: https://github.com/LordSA
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendSupportTicketEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, issue, screenshot_url, suggestions } = body;

    if (!name || !email || !issue) {
      return NextResponse.json({ error: 'Name, Email, and Issue description are required.' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
      .from('support_tickets')
      .insert([
        {
          name: name.trim(),
          email: email.trim(),
          phone: phone ? phone.trim() : null,
          issue: issue.trim(),
          screenshot_url: screenshot_url ? screenshot_url.trim() : null,
          suggestions: suggestions ? suggestions.trim() : null,
          status: 'open',
        },
      ])
      .select();

    if (error) {
      console.error('Supabase support ticket insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const ticketRecord = data && data[0] ? data[0] : { id: `TICK-${Date.now()}`, name, email, phone, issue, screenshot_url, suggestions };

    // Fetch superadmin email addresses from DB profiles table
    let recipientEmails: string[] = [];
    try {
      const { data: superadmins } = await supabase
        .from('profiles')
        .select('email')
        .in('role', ['dev', 'admin']);

      if (superadmins && superadmins.length > 0) {
        recipientEmails = superadmins
          .map((sa: { email: string | null }) => sa.email?.trim() || '')
          .filter((emailStr: string) => emailStr.length > 0);
      }
    } catch (dbErr) {
      console.warn('Could not fetch superadmin emails from DB profiles:', dbErr);
    }

    if (recipientEmails.length === 0) {
      const fallbackEmail = process.env.SMTP_USER || 'room2homies@gmail.com';
      recipientEmails.push(fallbackEmail);
    }

    // Send email notification to all superadmins via SMTP in the background
    try {
      await sendSupportTicketEmail(
        {
          id: ticketRecord.id,
          name: ticketRecord.name,
          email: ticketRecord.email,
          phone: ticketRecord.phone,
          issue: ticketRecord.issue,
          screenshot_url: ticketRecord.screenshot_url,
          suggestions: ticketRecord.suggestions,
        },
        recipientEmails
      );
    } catch (mailErr) {
      console.error('Failed to send SMTP email notification:', mailErr);
    }

    return NextResponse.json({
      success: true,
      data: ticketRecord,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to submit support ticket';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
