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

  const formData = new FormData();
  formData.append('file', webpFile);
  formData.append('category', category);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to upload image via Vercel Blob');
  }

  return data.url;
}
