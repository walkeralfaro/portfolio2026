import resume from "../../data.js";

const personal = resume.personal;

export const site = {
  name: `${personal.firstName} ${personal.lastName}`,
  role: "Desarrollador Full-Stack",
  coreStack: ["React", "Next.js", "TypeScript", "Node.js", "Astro"],
  location: personal.address,
  email: personal.email,
  socials: [
    { name: "LinkedIn", url: personal.linkedin },
    { name: "GitHub", url: personal.github },
  ],
  url: "https://walkeralfaro.com",
  cvUrl: "https://resume.walkeralfaro.com/",
} as const;
