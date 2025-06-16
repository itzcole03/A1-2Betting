// Realistic data generation utilities

export class DataGenerator {
  private static seed = 12345; // Consistent seed for reproducible results

  // Seeded random number generator for consistent results
  private static seededRandom(): number {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }

  // Generate realistic confidence values based on historical data
  static generateConfidence(prop: any): number {
    const baseSeed = this.stringToSeed(prop.playerName + prop.statType);
    this.seed = baseSeed;

    // Base confidence varies by sport and stat type
    let baseConfidence = 75;

    if (prop.sport === "NBA") {
      baseConfidence = 80; // Basketball tends to be more predictable
    } else if (prop.sport === "NFL") {
      baseConfidence = 70; // Football has more variance
    } else if (prop.sport === "MLB") {
      baseConfidence = 65; // Baseball is notoriously unpredictable
    }

    // Adjust based on stat type
    const reliableStats = ["Points", "Assists", "Receptions"];
    const volatileStats = ["Home Runs", "Touchdowns", "Goals"];

    if (reliableStats.includes(prop.statType)) {
      baseConfidence += 5;
    } else if (volatileStats.includes(prop.statType)) {
      baseConfidence -= 8;
    }

    // Add some realistic variance
    const variance = (this.seededRandom() - 0.5) * 20;
    return Math.max(50, Math.min(95, baseConfidence + variance));
  }

  // Generate realistic expected value based on market efficiency
  static generateExpectedValue(prop: any): number {
    const baseSeed = this.stringToSeed(prop.playerName + prop.statType + "ev");
    this.seed = baseSeed;

    // Most props have slight negative EV (house edge)
    const houseEdge = -2 - this.seededRandom() * 3; // -2% to -5%

    // Some props might have positive EV due to market inefficiencies
    const marketInefficiency =
      this.seededRandom() < 0.15 ? this.seededRandom() * 8 : 0;

    return houseEdge + marketInefficiency;
  }

  // Generate realistic game times
  static generateGameTime(): { day: string; time: string; opponent: string } {
    const days = [
      "Mon, Jun 16",
      "Tue, Jun 17",
      "Wed, Jun 18",
      "Thu, Jun 19",
      "Fri, Jun 20",
      "Sat, Jun 21",
      "Sun, Jun 22",
    ];

    // Games typically start at these times
    const commonTimes = [
      "1:05 PM",
      "1:35 PM",
      "4:05 PM",
      "4:35 PM",
      "7:05 PM",
      "7:35 PM",
      "8:05 PM",
      "10:05 PM",
    ];

    const opponents = [
      "LAA",
      "BOS",
      "NYY",
      "TB",
      "TOR",
      "BAL",
      "CWS",
      "CLE",
      "DET",
      "KC",
      "MIN",
      "HOU",
      "OAK",
      "SEA",
      "TEX",
      "ATL",
      "MIA",
      "NYM",
      "PHI",
      "WAS",
      "CHC",
      "CIN",
      "MIL",
      "PIT",
      "STL",
      "ARI",
      "COL",
      "LAD",
      "SD",
      "SF",
    ];

    const dayIndex = Math.floor(this.seededRandom() * days.length);
    const timeIndex = Math.floor(this.seededRandom() * commonTimes.length);
    const opponentIndex = Math.floor(this.seededRandom() * opponents.length);

    return {
      day: days[dayIndex],
      time: commonTimes[timeIndex],
      opponent: opponents[opponentIndex],
    };
  }

  // Determine pick type based on realistic criteria
  static generatePickType(prop: any): "normal" | "demon" | "goblin" {
    const baseSeed = this.stringToSeed(
      prop.playerName + prop.statType + "type",
    );
    this.seed = baseSeed;

    const random = this.seededRandom();

    // Star players with difficult stats = demons (5%)
    const starPlayers = [
      "Aaron Judge",
      "Shohei Ohtani",
      "Patrick Mahomes",
      "LeBron James",
    ];
    const difficultStats = ["Home Runs", "Touchdowns", "Triple-Double"];
    const isStarPlayer = starPlayers.some((star) =>
      prop.playerName.includes(star.split(" ")[0]),
    );
    const isDifficultStat = difficultStats.includes(prop.statType);

    if (isStarPlayer && isDifficultStat && random < 0.05) {
      return "demon";
    }

    // Easy stats with low lines = goblins (10%)
    const easyStats = ["Hits", "Assists", "Receptions"];
    const isEasyStat = easyStats.includes(prop.statType);
    const isLowLine = parseFloat(prop.line.toString()) <= 1.5;

    if (isEasyStat && isLowLine && random < 0.15) {
      return "goblin";
    }

    return "normal";
  }

  // Generate trending value based on recent performance
  static generateTrendValue(prop: any): string {
    const baseSeed = this.stringToSeed(prop.playerName + "trend");
    this.seed = baseSeed;

    // Trending values typically range from 0.1k to 15k
    const baseValue = 1 + this.seededRandom() * 14;

    if (baseValue < 1) {
      return (baseValue * 1000).toFixed(0);
    } else {
      return baseValue.toFixed(1);
    }
  }

  // Convert string to seed for consistent generation
  private static stringToSeed(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  // Generate realistic stat line values
  static generateStatLine(
    sport: string,
    statType: string,
    playerName: string,
  ): number {
    const baseSeed = this.stringToSeed(playerName + statType);
    this.seed = baseSeed;

    const statRanges = {
      NBA: {
        Points: [15, 35],
        Rebounds: [4, 15],
        Assists: [3, 12],
        "3-Pointers Made": [1.5, 4.5],
        Steals: [0.5, 2.5],
        Blocks: [0.5, 3.5],
      },
      NFL: {
        "Passing Yards": [200, 350],
        "Rushing Yards": [50, 150],
        Receptions: [3, 12],
        "Receiving Yards": [40, 120],
        Touchdowns: [0.5, 2.5],
      },
      MLB: {
        Hits: [0.5, 2.5],
        RBIs: [0.5, 2.5],
        Runs: [0.5, 2.5],
        "Home Runs": [0.5, 1.5],
        Strikeouts: [4.5, 8.5],
        "Hitter Fantasy Score": [6.5, 12.5],
      },
      NHL: {
        Goals: [0.5, 1.5],
        Assists: [0.5, 2.5],
        Shots: [2.5, 5.5],
        Points: [0.5, 3.5],
      },
    };

    const sportStats = statRanges[sport] || statRanges["NBA"];
    const range = sportStats[statType] || [0.5, 2.5];

    const min = range[0];
    const max = range[1];
    const value = min + this.seededRandom() * (max - min);

    // Round to nearest 0.5
    return Math.round(value * 2) / 2;
  }
}
