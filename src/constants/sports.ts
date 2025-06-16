export interface SportConfig {
  id: string;
  name: string;
  emoji: string;
  displayName: string;
}

// Centralized sports configuration matching HeroSection
export const SPORTS_CONFIG: SportConfig[] = [
  {
    id: "NBA",
    name: "NBA",
    emoji: "🏀",
    displayName: "NBA",
  },
  {
    id: "WNBA",
    name: "WNBA",
    emoji: "🏀",
    displayName: "WNBA",
  },
  {
    id: "NFL",
    name: "NFL",
    emoji: "🏈",
    displayName: "NFL",
  },
  {
    id: "MLB",
    name: "MLB",
    emoji: "⚾",
    displayName: "MLB",
  },
  {
    id: "NHL",
    name: "NHL",
    emoji: "🏒",
    displayName: "NHL",
  },
  {
    id: "Soccer",
    name: "Soccer",
    emoji: "⚽",
    displayName: "Soccer",
  },
  {
    id: "MMA",
    name: "MMA",
    emoji: "🥊",
    displayName: "MMA/UFC",
  },
  {
    id: "PGA",
    name: "PGA",
    emoji: "🏌️",
    displayName: "PGA Golf",
  },
];

// Helper functions
export const getAllSports = (): SportConfig[] => SPORTS_CONFIG;

export const getSportById = (id: string): SportConfig | undefined => {
  return SPORTS_CONFIG.find((sport) => sport.id === id);
};

export const getSportNames = (): string[] => {
  return SPORTS_CONFIG.map((sport) => sport.id);
};

export const getSportNamesWithAll = (): string[] => {
  return ["All", ...getSportNames()];
};

export const getSportEmoji = (id: string): string => {
  const sport = getSportById(id);
  return sport ? sport.emoji : "🏆";
};

export const getSportDisplayName = (id: string): string => {
  if (id === "All") return "🌐 All Sports";
  const sport = getSportById(id);
  return sport ? `${sport.emoji} ${sport.displayName}` : id;
};

// Note: PrizePicks is a platform/service, not a sport
// It's handled separately in the PrizePicks integration section

// Export for use in components
export const SPORT_OPTIONS = getSportNamesWithAll();
