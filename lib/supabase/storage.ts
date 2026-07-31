import { uploadImageFile } from '@/lib/upload';

export async function uploadImageToSupabase(
  file: File,
  bucket: 'avatars' | 'community-logos' | 'posters',
  folderPath: string = ''
): Promise<string> {
  const categoryMap: Record<string, 'posters' | 'logos' | 'avatars'> = {
    'avatars': 'avatars',
    'community-logos': 'logos',
    'posters': 'posters',
  };

  const category = categoryMap[bucket] || 'posters';
  return await uploadImageFile(file, category);
}
