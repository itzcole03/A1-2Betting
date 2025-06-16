export interface Player {
  id: string;
  name: string;
  team: string;
  position: string;
  rating: number;
  sport: string;
  stats: Record<string, number>;
  aiEnhancement?: AIEnhancement;
  patternStrength?: PatternStrength;
  realDataQuality?: number;
  socialSentiment?: SocialSentiment;
  newsImpact?: NewsImpact;
}

export interface AIEnhancement {
  ratingBoost: number;
  consistencyFactor: number;
  injuryRisk: number;
  formMultiplier: number;
  qualityBoost?: number;
  confidenceMultiplier?: number;
  dataRichness?: number;
  patternStrength?: number;
}

export interface PatternStrength {
  overall: number;
  recent: number;
  seasonal: number;
}

export interface SocialSentiment {
  score: number;
  volume: number;
  trend: "positive" | "negative" | "neutral";
  keywords?: string[];
}

export interface NewsImpact {
  mentions: number;
  sentiment: number;
  impact: number;
}

export interface PlayerProp {
  id: string;
  playerName: string;
  team: string;
  position: string;
  statType: string;
  line: number;
  sport: string;
  aiEnhancement?: any;
  patternAnalysis?: any;
  realDataQuality: number;
  overConfidence: number;
  underConfidence: number;
  expectedValue: number;
  source: string;
  intelligentEnhancement?: any;
  socialSentiment?: SocialSentiment;
  newsImpact?: NewsImpact;
}

export interface Game {
  id: string;
  name: string;
  date: string;
  sport: string;
  status: string;
  homeTeam?: string;
  awayTeam?: string;
  venue?: string;
  source: string;
  sentiment?: {
    overall: number;
    volume: number;
    confidence: number;
  };
  weather?: {
    temperature: number;
    conditions: string;
    impact: number;
  };
  intelligentFactors?: any;
  dataQuality?: number;
}

export interface AIModel {
  accuracy: number;
  confidence: number;
  predictions: number;
  category: string;
  lastUpdate: Date;
}

export interface DataSource {
  connected: boolean;
  data?: any;
  lastUpdate?: Date;
  quality?: number;
  error?: string;
  source?: string;
}

export interface BettingOpportunity {
  id: string;
  game: string;
  pick: string;
  confidence: number;
  odds: string;
  aiEnhancement: string;
  expectedValue: number;
  dataSource: string;
  platform: string;
  lastUpdate: string;
  realData: boolean;
  bettable: boolean;
  gameTime?: string;
  venue?: string;
  recommendation?: string;
  qualityScore?: string;
}

export interface UltimateAIConfig {
  investment: number;
  dataSource: "real" | "hybrid" | "simulation";
  strategy: "maximum" | "conservative" | "aggressive" | "real_time";
  confidence: number;
  portfolio: string;
  sports: string;
}

export interface PatternRecognition {
  strength: number;
  patterns: string[];
  confidence: number;
}

export interface TeamColors {
  gradient: string;
  accent: string;
}

export interface SportConfig {
  id: string;
  name: string;
  emoji: string;
  displayName: string;
}
