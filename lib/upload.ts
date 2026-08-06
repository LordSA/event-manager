// Created by Shibili Aman TK | GitHub: https://github.com/LordSA
import { createClient } from '@/lib/supabase/client';

export async function convertToWebP(file: File, quality = 0.82): Promise<File> {
  if (file.type === 'image/webp') return file;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(file);
        }

        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(file);
            const webpFileName = file.name.replace(/\.[^/.]+$/, '') + '.webp';
            const webpFile = new File([blob], webpFileName, {
              type: 'image/webp',
              lastModified: Date.now(),
            });
            resolve(webpFile);
          },
          'image/webp',
          quality
        );
      };
      img.onerror = () => reject(new Error('Failed to load image for WebP conversion'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

export async function uploadImageFile(
  file: File,
  category: 'posters' | 'logos' | 'avatars' = 'posters'
): Promise<string> {
  const webpFile = await convertToWebP(file);

  // 1. Try Vercel Blob API
  try {
    const formData = new FormData();
    formData.append('file', webpFile);
    formData.append('category', category);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.url) {
        return data.url;
      }
    }
  } catch (err) {
    console.warn('Vercel Blob upload failed, attempting Supabase Storage fallback...', err);
  }

  // 2. Fallback to Supabase Storage bucket
  try {
    const supabase = createClient();
    const fileExt = webpFile.name.split('.').pop() || 'webp';
    const fileName = `${category}/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

    const { error: uploadErr } = await supabase.storage
      .from('posters')
      .upload(fileName, webpFile, { cacheControl: '3600', upsert: true });

    if (!uploadErr) {
      const { data: publicUrlData } = supabase.storage.from('posters').getPublicUrl(fileName);
      if (publicUrlData && publicUrlData.publicUrl) {
        return publicUrlData.publicUrl;
      }
    }
  } catch (supaErr) {
    console.warn('Supabase Storage fallback error:', supaErr);
  }

  throw new Error('Failed to upload image to storage. Please check connection or paste a direct image URL.');
}
