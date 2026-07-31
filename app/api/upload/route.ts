import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const category = (formData.get('category') as string) || 'posters';

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    const fileExt = file.name.split('.').pop() || 'webp';
    const fileName = `${category}/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

    // Upload to Vercel Blob Storage
    const blob = await put(fileName, file, {
      access: 'public',
      contentType: file.type || 'image/webp',
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
      pathname: blob.pathname,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Vercel Blob upload failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
