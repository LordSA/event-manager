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
  category: 'posters' | 'logos' | 'avatars' = 'posters',
  onProgress?: (percent: number) => void
): Promise<string> {
  if (onProgress) onProgress(10);
  const webpFile = await convertToWebP(file);
  if (onProgress) onProgress(25);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', webpFile);
    formData.append('category', category);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round(25 + (event.loaded / event.total) * 70);
        onProgress(Math.min(95, percent));
      }
    };

    xhr.onload = async () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          if (data.success && data.url) {
            if (onProgress) onProgress(100);
            return resolve(data.url);
          }
        } catch (e) {}
      }

      // Fallback to Supabase Storage bucket
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
            if (onProgress) onProgress(100);
            return resolve(publicUrlData.publicUrl);
          }
        }
      } catch (supaErr) {
        console.warn('Supabase Storage fallback error:', supaErr);
      }

      reject(new Error('Failed to upload image. Please check connection or paste a direct image URL.'));
    };

    xhr.onerror = async () => {
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
            if (onProgress) onProgress(100);
            return resolve(publicUrlData.publicUrl);
          }
        }
      } catch (supaErr) {}

      reject(new Error('Image upload failed. Please try again.'));
    };

    xhr.open('POST', '/api/upload');
    xhr.send(formData);
  });
}
