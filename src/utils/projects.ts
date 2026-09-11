import { getCollection } from 'astro:content';
export async function getProjects() {
  const entries = await getCollection('projects');
  for (const lang of ['es', 'ca', 'en'] as const) {
    const slugs = entries.map(p => p.data.translations[lang].slug);
    if (new Set(slugs).size !== slugs.length) throw new Error(`Duplicate project slug: ${lang}`);
  }
  return entries.sort((a, b) => a.data.order - b.data.order || a.id.localeCompare(b.id));
}
