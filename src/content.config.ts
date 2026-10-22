import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import {
  PROJECT_CATEGORIES,
  PROJECT_SLUGS,
  PROJECT_STATUSES,
} from './content/project-slugs';

const localizedProjectSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  role: z.string().min(1),
  result: z.string().min(1),
  availability: z.string().min(1).optional(),
});

const linkSchema = z.url().nullable().default(null);

const projects = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/projects' }),
  schema: z.object({
    slug: z.enum(PROJECT_SLUGS),
    year: z.union([z.number().int().min(2000).max(2100), z.literal('pending')]),
    category: z.enum(PROJECT_CATEGORIES),
    tags: z.array(z.string().min(1)).min(1),
    tier: z.number().int().min(1).max(3),
    status: z.enum(PROJECT_STATUSES),
    featured: z.boolean(),
    order: z.number().int().positive(),
    stack: z.array(z.string().min(1)).min(3).max(5),
    links: z
      .object({
        live: linkSchema,
        code: linkSchema,
      })
      .default({ live: null, code: null }),
    cover: z.string().min(1).nullable().default(null),
    locales: z.object({
      es: localizedProjectSchema,
      en: localizedProjectSchema,
    }),
  }),
});

const gallerySchema = z.array(
  z.object({
    src: z.string().min(1),
    alt: z.string().min(1),
  }),
);

const cases = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/cases' }),
  schema: z.object({
    project: z.enum(PROJECT_SLUGS),
    locale: z.enum(['es', 'en']),
    order: z.number().int().positive(),
    updated: z.coerce.date().optional(),
    gallery: gallerySchema.default([]),
  }),
});

export const collections = { projects, cases };
