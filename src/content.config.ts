import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { projectCaseSchema, projectSchema } from './content/schemas';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/projects' }),
  schema: projectSchema,
});

const cases = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/cases' }),
  schema: projectCaseSchema,
});

export const collections = { projects, cases };
