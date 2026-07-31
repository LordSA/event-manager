import { createClient } from '@/lib/supabase/client';

export async function uploadImageToSupabase(
  file: File,
  bucket: 'avatars' | 'community-logos',
  folderPath: string = ''
): Promise<string> {
  const supabase = createClient();
  const fileExt = file.name.split('.').pop() || 'png';
  const fileName = `${folderPath ? `${folderPath}/` : ''}${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
}
