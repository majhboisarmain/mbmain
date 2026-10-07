/**
 * Slug generator utility for Majh Boisar directory
 * Ensures clean, SEO-optimized, lowercase alphanumeric slugs with locality signal.
 */
export function generateBusinessSlug(name: string, location?: string): string {
  if (!name) return 'business-boisar';

  // Normalize string
  let clean = name
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/['’"]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  // Add boisar suffix if not present for local SEO ranking signal
  if (!clean.includes('boisar')) {
    clean = `${clean}-boisar`;
  }

  return clean;
}

export function generateCategorySlug(category: string): string {
  if (!category) return 'all';
  return category
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/['’"]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function generateLocationSlug(location: string): string {
  if (!location) return 'boisar';
  return location
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/['’"]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
