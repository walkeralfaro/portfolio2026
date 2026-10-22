import { z } from 'zod';
import {
  PROJECT_CATEGORIES,
  PROJECT_SLUGS,
  PROJECT_STATUSES,
} from './project-slugs.ts';

export const galleryImageSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
});

export const gallerySchema = z.array(galleryImageSchema).default([]);

export const localizedProjectSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  role: z.string().min(1),
  result: z.string().min(1),
  availability: z.string().min(1).optional(),
  gallery: gallerySchema,
});

export const linkSchema = z.url().nullable().default(null);

export const projectSchema = z.object({
  slug: z.enum(PROJECT_SLUGS),
  year: z.union([z.number().int().min(2000).max(2100), z.literal('pending')]),
  category: z.enum(PROJECT_CATEGORIES),
  tags: z.array(z.string().min(1)).min(1),
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
});

export const projectCaseSchema = z.object({
  project: z.enum(PROJECT_SLUGS),
  locale: z.enum(['es', 'en']),
  order: z.number().int().positive(),
  updated: z.coerce.date().optional(),
});

export const narrativeSchema = z
  .object({
    problem: z.string().min(1),
    role: z.string().min(1),
    decisions: z.array(z.string().min(1)).min(3).max(4),
    result: z.string().min(1),
  })
  .strict();

export const intakeLocaleSchema = localizedProjectSchema
  .extend({
    narrative: narrativeSchema.optional(),
  })
  .strict();

export const intakeSchema = projectSchema
  .extend({
    locales: z
      .object({
        es: intakeLocaleSchema,
        en: intakeLocaleSchema,
      })
      .strict(),
  })
  .strict()
  .superRefine((value, context) => {
    const hasSpanishNarrative = Boolean(value.locales.es.narrative);
    const hasEnglishNarrative = Boolean(value.locales.en.narrative);

    if (hasSpanishNarrative !== hasEnglishNarrative) {
      context.addIssue({
        code: 'custom',
        path: ['locales'],
        message: 'narrative must be present in both locales or neither',
      });
    }
  });

export type ProjectRecord = z.infer<typeof projectSchema>;
export type ProjectCaseRecord = z.infer<typeof projectCaseSchema>;
export type IntakeRecord = z.infer<typeof intakeSchema>;
export type IntakeLocale = z.infer<typeof intakeLocaleSchema>;
export type Narrative = z.infer<typeof narrativeSchema>;
