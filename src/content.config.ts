import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
const localized = z.object({ es: z.string().min(1), ca: z.string().min(1), en: z.string().min(1) });
const projectTranslation = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(1),
  location: z.string().nullable(),
  category: z.string().nullable(),
  description: z.array(z.string()),
  seo: z.object({ title: z.string(), description: z.string() }),
});
const projects = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/projects' }),
  schema: ({ image }) => z.object({
    projectId: z.string(),
    year: z.number().int().nullable(),
    order: z.number().default(0),
    featured: z.boolean().default(false),
    credits: z.string().nullable(),
    cover: image(),
    coverAlt: localized,
    gallery: z.array(z.object({ src: image(), alt: localized })).min(1),
    translations: z.object({ es: projectTranslation, ca: projectTranslation, en: projectTranslation }),
  }),
});
export const collections = { projects };
