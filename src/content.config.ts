import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { projectSchema } from './lib/content/schema';

/**
 * Each project is a self-contained folder under `projects/`:
 *
 *   projects/<slug>/README.md
 *   projects/<slug>/content.yaml
 *   projects/<slug>/cover.webp
 *   projects/<slug>/screenshots/<key>.webp
 *
 * The folder name is the slug, so adding a project never requires editing a
 * central inventory file.
 */
const projects = defineCollection({
  loader: glob({ pattern: '*/content.yaml', base: './projects' }),
  schema: projectSchema,
});

export const collections = { projects };
