import { PlayerProp } from "../types";

export interface LineupValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  canSubmit: boolean;
}

export interface SelectedProp {
  propId: string;
  choice: "over" | "under";
  prop: PlayerProp;
  confidence?: number;
  expectedValue?: number;
  source?: string;
  enhanced?: boolean;
}

export function validateLineup(
  selectedProps: Map<string, SelectedProp>,
): LineupValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const props = Array.from(selectedProps.values());

  // Rule 1: Must have between 2-6 projections
  if (props.length < 2) {
    errors.push("You must select at least 2 projections to create a lineup");
  }
  if (props.length > 6) {
    errors.push("You cannot select more than 6 projections in a lineup");
  }

  // Rule 2: Must have picks from at least 2 different teams
  const teams = new Set(props.map((p) => p.prop.team));
  if (teams.size < 2) {
    errors.push("You must have picks from at least 2 different teams");
  }

  // Rule 3: Cannot have the same player more than once
  const players = new Map<string, number>();
  props.forEach((p) => {
    const playerKey = `${p.prop.playerName}_${p.prop.team}`;
    players.set(playerKey, (players.get(playerKey) || 0) + 1);
  });

  const duplicatePlayers = Array.from(players.entries())
    .filter(([_, count]) => count > 1)
    .map(([player, count]) => `${player.split("_")[0]} (${count} picks)`);

  if (duplicatePlayers.length > 0) {
    errors.push(
      `Cannot have the same player multiple times: ${duplicatePlayers.join(", ")}`,
    );
  }

  // Rule 4: Sport-specific rules (pitcher vs opposing batter)
  const mlbPitchers = props.filter(
    (p) =>
      p.prop.sport === "MLB" &&
      (p.prop.position === "P" ||
        p.prop.statType.toLowerCase().includes("pitcher")),
  );

  const mlbBatters = props.filter(
    (p) =>
      p.prop.sport === "MLB" &&
      p.prop.position !== "P" &&
      !p.prop.statType.toLowerCase().includes("pitcher"),
  );

  // Check for pitcher vs opposing batter conflicts
  mlbPitchers.forEach((pitcher) => {
    mlbBatters.forEach((batter) => {
      // This is a simplified check - in real implementation, you'd need game matchup data
      if (isOpposingTeams(pitcher.prop.team, batter.prop.team)) {
        warnings.push(
          `Warning: You have a pitcher (${pitcher.prop.playerName}) facing an opposing batter (${batter.prop.playerName}). This may not be allowed.`,
        );
      }
    });
  });

  // Rule 5: Game timing validation (all games must be in the future)
  const currentTime = new Date();
  const gamesInPast = props.filter((p) => {
    // Mock game times - in real app this would come from game data
    const gameHour = Math.floor(Math.random() * 12) + 12; // 12pm to 12am
    const today = new Date();
    today.setHours(gameHour, 0, 0, 0);
    return today < currentTime;
  });

  if (gamesInPast.length > 0) {
    errors.push(
      `Some games have already started and cannot be included in lineups`,
    );
  }

  // Additional validation for demons/goblins
  const invalidDemonGoblinPicks = props.filter((p) => {
    // Check if this is a demon or goblin that has "Less" selected
    return (
      p.choice === "under" && (isDemonType(p.prop) || isGoblinType(p.prop))
    );
  });

  if (invalidDemonGoblinPicks.length > 0) {
    const playerNames = invalidDemonGoblinPicks
      .map((p) => p.prop.playerName)
      .join(", ");
    errors.push(
      `You can only pick "More" on Demon and Goblin projections. Invalid picks: ${playerNames}`,
    );
  }

  // Colorado specific rule
  const isColorado = detectColoradoUser();
  if (isColorado && props.length < 3) {
    errors.push("Colorado residents must pick a minimum of 3 projections");
  }

  // Multi-sport validation
  const sports = new Set(props.map((p) => p.prop.sport));
  if (sports.size > 1) {
    warnings.push(
      `Multi-sport lineup detected (${Array.from(sports).join(", ")}). Ensure you understand the rules for each sport.`,
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    canSubmit: errors.length === 0 && props.length >= 2 && props.length <= 6,
  };
}

// Helper function to check if teams are opposing
function isOpposingTeams(team1: string, team2: string): boolean {
  // Common opposing team matchups for demo purposes
  const commonMatchups = {
    NYY: ["BOS", "TB", "TOR", "BAL", "LAA"],
    BOS: ["NYY", "TB", "TOR", "BAL"],
    LAD: ["SF", "SD", "COL", "ARI"],
    SF: ["LAD", "SD", "COL", "ARI"],
    PHI: ["NYM", "ATL", "WAS", "MIA"],
    NYM: ["PHI", "ATL", "WAS", "MIA"],
  };

  return (
    commonMatchups[team1]?.includes(team2) ||
    commonMatchups[team2]?.includes(team1) ||
    false
  );
}

// Helper function to detect demon/goblin picks
function isDemonOrGoblin(prop: PlayerProp): boolean {
  // This would be determined by the actual prop data
  // For now, using a simple heuristic based on line values or other indicators
  return false;
}

// Get user-friendly explanation of lineup requirements
export function getLineupRequirements(): string[] {
  return [
    "Pick between 2 and 6 projections",
    "Must include players from at least 2 different teams",
    "Cannot select the same player multiple times",
    'Choose "More" or "Less" for each projection',
    "All games must start in the future",
    'For Demons and Goblins, you can only pick "More"',
  ];
}

// Calculate lineup payout based on PrizePicks rules
export function calculatePayout(
  selectedProps: Map<string, SelectedProp>,
  entryAmount: number,
  prizePicksConnected: boolean = false,
): {
  payout: number;
  multiplier: number;
  breakdown: string[];
} {
  const propCount = selectedProps.size;

  // Base PrizePicks multipliers
  const baseMultipliers: Record<number, number> = {
    2: 3,
    3: 5,
    4: 10,
    5: 20,
    6: 40,
  };

  let multiplier = baseMultipliers[propCount] || 0;
  const breakdown: string[] = [];

  if (multiplier > 0) {
    breakdown.push(`${propCount} picks: ${multiplier}x base multiplier`);

    // Check for demons and goblins modifiers
    const props = Array.from(selectedProps.values());
    const demons = props.filter((p) => isDemonType(p.prop));
    const goblins = props.filter((p) => isGoblinType(p.prop));

    if (demons.length > 0) {
      multiplier *= 1.25; // 25% bonus for demons
      breakdown.push(`${demons.length} demon picks: +25% bonus`);
    }

    if (goblins.length > 0) {
      multiplier *= 0.85; // 15% penalty for goblins
      breakdown.push(`${goblins.length} goblin picks: -15% penalty`);
    }

    // Enhanced data bonus
    if (prizePicksConnected) {
      multiplier *= 1.1; // 10% bonus for real PrizePicks data
      breakdown.push("PrizePicks data: +10% bonus");
    }
  }

  return {
    payout: entryAmount * multiplier,
    multiplier,
    breakdown,
  };
}

// Detect if user is in Colorado (simplified for demo)
function detectColoradoUser(): boolean {
  // In a real app, this would check user's IP, account settings, or ask directly
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return timezone === "America/Denver" || timezone === "America/Phoenix";
  } catch {
    return false;
  }
}

// Helper functions for demon/goblin detection (would be based on real data)
function isDemonType(prop: PlayerProp): boolean {
  // Demon picks are typically high-risk, high-reward props
  const starPlayers = [
    "Aaron Judge",
    "Shohei Ohtani",
    "Connor McDavid",
    "LeBron James",
    "Patrick Mahomes",
  ];
  const isStarPlayer = starPlayers.some((star) =>
    prop.playerName.includes(star.split(" ")[0]),
  );
  const isHighValueStat = [
    "Home Runs",
    "Goals",
    "Touchdowns",
    "Passing Yards",
  ].includes(prop.statType);
  const isHighLine = parseFloat(prop.line.toString()) >= 2.5;

  // Also check for specific difficult stat combinations
  const difficultStats = ["Triple-Double", "Perfect Game", "Hat Trick"];
  const isDifficultStat = difficultStats.some((stat) =>
    prop.statType.includes(stat),
  );

  return (isStarPlayer && isHighValueStat && isHighLine) || isDifficultStat;
}

function isGoblinType(prop: PlayerProp): boolean {
  // Goblins are easier picks with lower payouts
  const easyStats = [
    "Hits",
    "Assists",
    "Receptions",
    "Shots",
    "Saves",
    "Strikeouts",
  ];
  const isEasyStat = easyStats.includes(prop.statType);
  const isLowLine = parseFloat(prop.line.toString()) <= 1.5;

  // Role players and bench players more likely to have goblin props
  const benchPositions = ["6", "C", "Bench", "Relief"];
  const isBenchPlayer = benchPositions.some((pos) =>
    prop.position?.includes(pos),
  );

  // Defensive stats are often easier to hit
  const defensiveStats = ["Rebounds", "Blocks", "Steals", "Tackles", "Saves"];
  const isDefensiveStat = defensiveStats.includes(prop.statType);

  return (isEasyStat && isLowLine) || isBenchPlayer || isDefensiveStat;
}
