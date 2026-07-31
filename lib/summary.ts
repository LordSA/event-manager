/**
 * Refactors a detailed full event description into a clean, 2-line public summary.
 * Filters out raw AI system prompts and formats text cleanly for public cards and directory views.
 */
export function generate2LineSummary(text: string | null | undefined): string {
  if (!text) return 'Discover event details, schedule, and venue setup for this campus session.';

  // Strip raw system prompt text if accidentally passed
  let cleaned = text
    .replace(/You are the official AI Assistant[\s\S]*/gi, '')
    .replace(/EVENT DETAILS:[\s\S]*/gi, '')
    .replace(/TONE INSTRUCTIONS:[\s\S]*/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) {
    return 'Join us for an interactive technical session with campus community leads.';
  }

  // Extract up to 2 sentences
  const sentences = cleaned.match(/[^.!?]+[.!?]+/g);
  if (sentences && sentences.length >= 2) {
    const twoSentences = (sentences[0].trim() + ' ' + sentences[1].trim()).trim();
    return twoSentences.length > 180 ? twoSentences.slice(0, 177) + '...' : twoSentences;
  }

  return cleaned.length > 160 ? cleaned.slice(0, 157) + '...' : cleaned;
}
