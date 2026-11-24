/**
 * Utility helper to clean and deduplicate real estate property listings across
 * database results, localStorage caches, and client state.
 */
export function deduplicatePropertyList<T extends Record<string, any>>(rawList: T[]): T[] {
  if (!Array.isArray(rawList)) return [];
  const seenIds = new Set<string>();
  const seenSignatures = new Set<string>();
  const result: T[] = [];

  for (const p of rawList) {
    if (!p) continue;

    // Discard test / junk items
    const name = String(p.name || '').trim().toLowerCase();
    const contact = String(p.contactName || '').trim().toLowerCase();
    const title = String(p.title || '').trim().toLowerCase();
    if (name === 'ee' || contact === 'ee' || title === 'ee' || title === 'owner: ee') continue;

    const idStr = p.id != null ? String(p.id).trim() : null;
    const normProject = String(p.projectName || p.title || p.name || '').trim().toLowerCase();
    const normLocality = String(p.addressLocality || p.address || p.location || '').trim().toLowerCase();
    const normPrice = String(p.price || p.budget || '').replace(/\D/g, '');
    const sig = `${normProject}|${normLocality}|${normPrice}`;

    // Skip duplicate by primary ID
    if (idStr && seenIds.has(idStr)) continue;

    // Skip duplicate by project name + locality + price signature
    if (normProject && normLocality && seenSignatures.has(sig)) continue;

    if (idStr) seenIds.add(idStr);
    if (normProject && normLocality) seenSignatures.add(sig);

    result.push(p);
  }

  return result;
}
