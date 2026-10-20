import resume from "../../data.js";

const personal = resume.personal;

export const site = {
  name: `${personal.firstName} ${personal.lastName}`,
  role: "Desarrollador Full-Stack",
  location: personal.address,
  email: personal.email,
  socials: [
    { name: "LinkedIn", url: personal.linkedin },
    { name: "GitHub", url: personal.github },
  ],
  url: "https://example.com",
} as const;
