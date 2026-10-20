export const ICON_PATHS = {
  external:
    '<path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />',
  code: '<path d="m16 18 5-6-5-6" /><path d="m8 6-5 6 5 6" />',
  system:
    '<rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8" /><path d="M12 17v4" />',
  light:
    '<circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />',
  dark: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />',
  menu: '<path d="M4 7h16M4 12h16M4 17h16" />',
  close: '<path d="m6 6 12 12M18 6 6 18" />',
} as const;

export type IconName = keyof typeof ICON_PATHS;
