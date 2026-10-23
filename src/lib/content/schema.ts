import { z } from 'zod';
import {
  PROJECT_CATEGORIES,
  PROJECT_SLUG_PATTERN,
  PROJECT_STATUSES,
} from './taxonomy.ts';

export const galleryImageSchema = z
  .object({
    src: z.string().min(1),
    alt: z.string().min(1),
  })
  .strict();

export const gallerySchema = z.array(galleryImageSchema).default([]);

export const decisionSchema = z
  .object({
    title: z.string().min(1),
    body: z.string().min(1),
  })
  .strict();

export const narrativeSchema = z
  .object({
    problem: z.string().min(1),
    role: z.string().min(1),
    decisions: z.array(decisionSchema).min(3).max(4),
    result: z.string().min(1),
  })
  .strict();

export const localizedProjectSchema = z
  .object({
    title: z.string().min(1),
    summary: z.string().min(1),
    role: z.string().min(1),
    result: z.string().min(1),
    availability: z.string().min(1).optional(),
    gallery: gallerySchema,
    narrative: narrativeSchema.optional(),
  })
  .strict();

export const linkSchema = z.url().nullable().default(null);

export const projectSchema = z
  .object({
    slug: z.string().regex(PROJECT_SLUG_PATTERN),
    year: z.union([
      z.number().int().min(2000).max(2100),
      z.literal('pending'),
    ]),
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
    locales: z
      .object({
        es: localizedProjectSchema,
        en: localizedProjectSchema,
      })
      .strict(),
  })
  .strict()
  .superRefine((value, context) => {
    const hasSpanishAvailability = Boolean(value.locales.es.availability);
    const hasEnglishAvailability = Boolean(value.locales.en.availability);

    if (hasSpanishAvailability !== hasEnglishAvailability) {
      context.addIssue({
        code: 'custom',
        path: ['locales'],
        message: 'availability must be present in both locales or neither',
      });
    }

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
export type ProjectLocale = z.infer<typeof localizedProjectSchema>;
export type Narrative = z.infer<typeof narrativeSchema>;
export type Decision = z.infer<typeof decisionSchema>;
