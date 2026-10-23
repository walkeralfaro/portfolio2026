import resume from '../../data.js';
import { parseCv } from './cv.schema.ts';

const source = {
  ...resume,
  projects: resume.projects.filter((entry) => entry.project !== 'Portfolio Profesional'),
  experience: resume.experience.map((entry) => ({
    ...entry,
    bullets: entry.bullets.map((bullet) =>
      bullet.replace(/del proyecto Puja Inmobiliaria/gi, 'de un proyecto inmobiliario'),
    ),
  })),
};

/**
 * Spanish CV adapted from the generated, read-only `data.js`.
 * The schema intentionally omits `personal.mobile`, so parsing removes it.
 * The excluded client project is described generically and never published.
 */
export const cvEs = parseCv(source);
