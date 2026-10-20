import { z } from 'zod';

const experienceSchema = z.object({
  position: z.string().min(1),
  organisation: z.string().min(1),
  location: z.string().min(1),
  dates: z.string().min(1),
  bullets: z.array(z.string().min(1)).min(1),
  techSkills: z.string().min(1),
  softSkills: z.string().min(1),
});

const educationSchema = z.object({
  degree: z.string().min(1),
  institution: z.string().min(1),
  location: z.string().min(1),
  dates: z.string().min(1),
  bullets: z.array(z.string().min(1)).min(1),
});

const projectSchema = z.object({
  project: z.string().min(1),
  organisation: z.string().min(1),
  location: z.string().min(1),
  dates: z.string().min(1),
  bullets: z.array(z.string().min(1)).min(1),
  techSkills: z.string().min(1),
  link: z.url(),
});

const skillSchema = z.object({
  category: z.string().min(1),
  skills: z.string().min(1),
});

const courseSchema = z.object({
  course: z.string().min(1),
  institution: z.string().min(1),
  date: z.string().min(1),
  link: z.url(),
});

const languageSchema = z.object({
  language: z.string().min(1),
  proficiency: z.string().min(1),
});

const sectionSchema = z.enum([
  'summary',
  'experience',
  'education',
  'projects',
  'skills',
  'courses',
  'languages',
]);

export const cvSchema = z.object({
  personal: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    position: z.string().min(1),
    address: z.string().min(1),
    email: z.email(),
    homepage: z.url(),
    linkedin: z.url(),
    github: z.url(),
  }),
  summary: z.string().min(1),
  education: z.array(educationSchema).min(1),
  experience: z.array(experienceSchema).min(1),
  projects: z.array(projectSchema).min(1),
  skills: z.array(skillSchema).min(1),
  courses: z.array(courseSchema).min(1),
  languages: z.array(languageSchema).min(1),
  settings: z.object({
    highlight: z.string().min(1),
    sections: z.array(sectionSchema).min(1),
  }),
});

export type Cv = z.infer<typeof cvSchema>;

export function parseCv(input: unknown): Cv {
  return cvSchema.parse(input);
}
