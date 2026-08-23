
export function getValidSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || 'https://event.cev.ac.in';
  const trimmed = raw.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}
