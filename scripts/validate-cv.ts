import { readFileSync } from 'node:fs';
import { cvEn } from '../src/data/cv.en.ts';
import { cvEs } from '../src/data/cv.es.ts';
import { parseCv, type Cv } from '../src/data/cv.schema.ts';

const fixture = process.env.CV_VALIDATION_FIXTURE;

if (fixture) {
  parseCv(JSON.parse(readFileSync(fixture, 'utf8')));
  console.log(`CV fixture passed validation: ${fixture}`);
  process.exit(0);
}

const locales: Array<[string, Cv]> = [
  ['es', cvEs],
  ['en', cvEn],
];

for (const [locale, cv] of locales) {
  const serialized = JSON.stringify(cv);

  if ('mobile' in cv.personal) {
    throw new Error(`[${locale}] Mobile phone field leaked into the CV adapter.`);
  }

  if (serialized.includes('986 640 912') || /puja/i.test(serialized)) {
    throw new Error(`[${locale}] Sensitive or excluded data leaked into the CV adapter.`);
  }
}

const counts = (cv: Cv) => ({
  education: cv.education.length,
  experience: cv.experience.length,
  projects: cv.projects.length,
  skills: cv.skills.length,
  courses: cv.courses.length,
  languages: cv.languages.length,
});

const esCounts = counts(cvEs);
const enCounts = counts(cvEn);

for (const key of Object.keys(esCounts) as Array<keyof typeof esCounts>) {
  if (esCounts[key] !== enCounts[key]) {
    throw new Error(
      `Section count mismatch for ${key}: es=${esCounts[key]}, en=${enCounts[key]}.`,
    );
  }
}

console.log(
  `CV validation passed for es/en: ${cvEs.experience.length} experience, ` +
    `${cvEs.education.length} education, ${cvEs.projects.length} projects, ` +
    `${cvEs.skills.length} skills, ${cvEs.courses.length} courses, ` +
    `${cvEs.languages.length} languages.`,
);
