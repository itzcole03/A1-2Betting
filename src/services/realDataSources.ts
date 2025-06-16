import axios from 'axios';

// Real API endpoints with environment variable support
const API_ENDPOINTS = {
  // The Odds API
  ODDS_SPORTS: 'https://api.the-odds-api.com/v4/sports',
  ODDS_ODDS: 'https://api.the-odds-api.com/v4/sports/{sport}/odds',
  ODDS_SCORES: 'https://api.the-odds-api.com/v4/sports/{sport}/scores',
  
  // SportRadar APIs
  SPORTRADAR_NBA_SCHEDULE: 'https://api.sportradar.com/nba/trial/v8/en/games/{year}/{month}/{day}/schedule.json',
  SPORTRADAR_NBA_SUMMARY: 'https://api.sportradar.com/nba/trial/v8/en/games/{game_id}/summary.json',
  SPORTRADAR_NFL_SCHEDULE: 'https://api.sportradar.com/nfl/official/trial/v7/en/games/{year}/{nfl_season}/{week}/schedule.json',
  SPORTRADAR_MLB_SCHEDULE: 'https://api.sportradar.com/mlb/trial/v7/en/games/{year}/{month}/{day}/schedule.json',
  SPORTRADAR_NHL_SCHEDULE: 'https://api.sportradar.com/nhl/trial/v7/en/games/{year}/{month}/{day}/schedule.json',
  
  // SportRadar DailyFantasy
  SPORTRADAR_DF_NBA: 'https://api.sportradar.com/dailyfantasy/trial/v1/en/projections/nba/{date}.json',
  SPORTRADAR_DF_NFL: 'https://api.sportradar.com/dailyfantasy/trial/v1/en/projections/nfl/{date}.json',
  SPORTRADAR_DF_MLB: 'https://api.sportradar.com/dailyfantasy/trial/v1/en/projections/mlb/{date}.json',
  SPORTRADAR_DF_NHL: 'https://api.sportradar.com/dailyfantasy/trial/v1/en/projections/nhl/{date}.json',
  
  // ESPN Public APIs (backup)
  ESPN_NBA: 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard',
  ESPN_NFL: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard',
  ESPN_MLB: 'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard',
  ESPN_NHL: 'https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard',
  
  // Official APIs (no auth)
  NBA_SCHEDULE: 'https://data.nba.net/prod/v1/today.json',
  NBA_SCOREBOARD: 'https://data.nba.net/prod/v2/{date}/scoreboard.json',
  MLB_SCHEDULE: 'https://statsapi.mlb.com/api/v1/schedule/games/',
  NHL_SCHEDULE: 'https://api-web.nhle.com/v1/schedule/now'
};

// Sport mappings for different APIs
const SPORT_MAPPINGS = {
  odds: {
    'NBA': 'basketball_nba',
    'NFL': 'americanfootball_nfl', 
    'MLB': 'baseball_mlb',
    'NHL': 'icehockey_nhl',
    'Soccer': 'soccer_epl',
    'WNBA': 'basketball_wnba',
    'MMA': 'mma_mixed_martial_arts',
    'PGA': 'golf_pga_championship'
  }
};

export interface RealDataSource {
  id: string;
  name: string;
  endpoint: string;
  connected: boolean;
  lastUpdate: Date | null;
  data: any;
  quality: number;
  reliability: number;
  error?: string;
  requiresAuth: boolean;
  category: 'sports' | 'odds' | 'fantasy' | 'news';
  sport?: string;
}

export interface LiveGame {
  id: string;
  sport: string;
  homeTeam: string;
  awayTeam: string;
  gameTime: string;
  status: string;
  score?: { home: number; away: number };
  venue?: string;
  odds?: BettingOdds;
  source: string;
}

export interface LivePlayer {
  id: string;
  name: string;
  team: string;
  position: string;
  sport: string;
  stats: any;
  projections?: any;
  props?: PlayerProp[];
  source: string;
}

export interface BettingOdds {
  gameId: string;
  sportsbook: string;
  moneyline: { home: number; away: number };
  spread: { line: number; home: number; away: number };
  total: { line: number; over: number; under: number };
  lastUpdate: Date;
}

export interface PlayerProp {
  playerId: string;
  playerName: string;
  statType: string;
  line: number;
  overOdds: number;
  underOdds: number;
  sportsbook: string;
  confidence?: number;
  expectedValue?: number;
}

export interface BettingPrediction {
  id: string;
  type: 'game' | 'player_prop';
  sport: string;
  game: string;
  pick: string;
  line: number;
  recommendation: 'over' | 'under' | 'home' | 'away';
  confidence: number;
  expectedValue: number;
  odds: number;
  reasoning: string[];
  dataQuality: number;
  sources: string[];
  timestamp: Date;
}

class RealDataSourceManager {
  private sources: Map<string, RealDataSource> = new Map();
  private apiKeys = {
    odds: import.meta.env.VITE_ODDS_API_KEY || '',
    sportradar: import.meta.env.VITE_SPORTRADAR_API_KEY || '',
    sportradarDF: import.meta.env.VITE_SPORTRADAR_DAILYFANTASY_KEY || '',
    primary: import.meta.env.VITE_DATA_API_KEY_PRIMARY || '',
    propProvider: import.meta.env.VITE_PROP_PROVIDER_KEY || ''
  };
  private requestCache: Map<string, { data: any; timestamp: number }> = new Map();
  private rateLimits: Map<string, { count: number; resetTime: number }> = new Map();

  private supportedSports = ['NBA', 'NFL', 'MLB', 'NHL', 'Soccer', 'WNBA', 'MMA', 'PGA'];

  async initializeAllSources(): Promise<Map<string, RealDataSource>> {
    console.log('🚀 Initializing Real-Time Data Sources...');
    
    // Validate API keys
    const hasApiKeys = this.validateApiKeys();
    
    if (!hasApiKeys.hasAny) {
      console.warn('⚠️ No API keys found - running in demo mode');
      return this.initializeDemoMode();
    }

    console.log('🔑 API Keys Status:', hasApiKeys);

    const initPromises = [];

    if (hasApiKeys.odds) {
      initPromises.push(this.initializeOddsAPI());
    }

    if (hasApiKeys.sportradar) {
      initPromises.push(this.initializeSportRadar());
    }

    if (hasApiKeys.sportradarDF) {
      initPromises.push(this.initializeSportRadarDF());
    }

    // Always initialize ESPN backup (no auth required)
    initPromises.push(this.initializeESPNBackup());
    initPromises.push(this.initializeOfficialAPIs());

    const results = await Promise.allSettled(initPromises);
    
    results.forEach((result, index) => {
      const categories = ['Odds API', 'SportRadar', 'SportRadar DF', 'ESPN Backup', 'Official APIs'];
      if (result.status === 'fulfilled') {
        console.log(`✅ ${categories[index]} initialized`);
      } else {
        console.warn(`⚠️ ${categories[index]} failed:`, result.reason);
      }
    });

    const connectedCount = Array.from(this.sources.values()).filter(s => s.connected).length;
    console.log(`📊 Connected: ${connectedCount}/${this.sources.size} sources`);
    
    return this.sources;
  }

  private validateApiKeys() {
    const status = {
      odds: !!this.apiKeys.odds && this.apiKeys.odds.length > 10,
      sportradar: !!this.apiKeys.sportradar && this.apiKeys.sportradar.length > 10,
      sportradarDF: !!this.apiKeys.sportradarDF && this.apiKeys.sportradarDF.length > 10,
      primary: !!this.apiKeys.primary && this.apiKeys.primary.length > 10,
      propProvider: !!this.apiKeys.propProvider && this.apiKeys.propProvider.length > 10,
      hasAny: false
    };

    status.hasAny = status.odds || status.sportradar || status.sportradarDF || status.primary || status.propProvider;

    // Log warnings for missing keys
    if (!status.odds) console.warn('🔑 VITE_ODDS_API_KEY missing or invalid');
    if (!status.sportradar) console.warn('🔑 VITE_SPORTRADAR_API_KEY missing or invalid');
    if (!status.sportradarDF) console.warn('🔑 VITE_SPORTRADAR_DAILYFANTASY_KEY missing or invalid');
    if (!status.primary) console.warn('🔑 VITE_DATA_API_KEY_PRIMARY missing or invalid');
    if (!status.propProvider) console.warn('🔑 VITE_PROP_PROVIDER_KEY missing or invalid');

    return status;
  }

  private async initializeDemoMode(): Promise<Map<string, RealDataSource>> {
    console.log('🎮 Initializing Demo Mode...');
    
    for (const sport of this.supportedSports) {
      // ESPN backup (always works)
      await this.connectToSource({
        id: `demo_espn_${sport.toLowerCase()}`,
        name: `Demo ESPN - ${sport}`,
        endpoint: this.getESPNEndpoint(sport),
        category: 'sports',
        requiresAuth: false,
        sport: sport
      });

      // Simulated odds source
      this.sources.set(`demo_odds_${sport.toLowerCase()}`, {
        id: `demo_odds_${sport.toLowerCase()}`,
        name: `Demo Odds - ${sport}`,
        endpoint: 'demo://odds',
        connected: true,
        lastUpdate: new Date(),
        data: this.generateDemoOddsData(sport),
        quality: 0.85,
        reliability: 0.90,
        requiresAuth: false,
        category: 'odds',
        sport: sport
      });

      // Simulated fantasy projections
      this.sources.set(`demo_fantasy_${sport.toLowerCase()}`, {
        id: `demo_fantasy_${sport.toLowerCase()}`,
        name: `Demo Fantasy - ${sport}`,
        endpoint: 'demo://fantasy',
        connected: true,
        lastUpdate: new Date(),
        data: this.generateDemoFantasyData(sport),
        quality: 0.80,
        reliability: 0.85,
        requiresAuth: false,
        category: 'fantasy',
        sport: sport
      });
    }

    console.log(`✅ Demo mode initialized with ${this.sources.size} simulated sources`);
    return this.sources;
  }

  private getESPNEndpoint(sport: string): string {
    const endpoints = {
      'NBA': API_ENDPOINTS.ESPN_NBA,
      'NFL': API_ENDPOINTS.ESPN_NFL,
      'MLB': API_ENDPOINTS.ESPN_MLB,
      'NHL': API_ENDPOINTS.ESPN_NHL
    };
    return endpoints[sport] || API_ENDPOINTS.ESPN_NBA;
  }

  private generateDemoOddsData(sport: string): any {
    const games = [];
    const teams = this.getTeamsForSport(sport);
    
    for (let i = 0; i < 5; i++) {
      const homeTeam = teams[Math.floor(Math.random() * teams.length)];
      const awayTeam = teams[Math.floor(Math.random() * teams.length)];
      
      if (homeTeam !== awayTeam) {
        games.push({
          id: `demo_${sport}_${i}`,
          home_team: homeTeam,
          away_team: awayTeam,
          commence_time: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          bookmakers: [{
            title: 'DraftKings',
            markets: [{
              key: 'h2h',
              outcomes: [
                { name: homeTeam, price: -110 + Math.random() * 40 },
                { name: awayTeam, price: -110 + Math.random() * 40 }
              ]
            }]
          }]
        });
      }
    }
    
    return games;
  }

  private generateDemoFantasyData(sport: string): any {
    const players = this.getPlayersForSport(sport);
    const projections = [];
    
    for (const player of players) {
      const stats = this.getStatsForSport(sport);
      const playerProjection = { player, statistics: {} };
      
      for (const stat of stats) {
        playerProjection.statistics[stat.toLowerCase()] = {
          value: this.getBaseStatValue(sport, stat),
          projection: this.getBaseStatValue(sport, stat) * (0.9 + Math.random() * 0.2)
        };
      }
      
      projections.push(playerProjection);
    }
    
    return { projections };
  }

  private async initializeOddsAPI(): Promise<void> {
    if (!this.apiKeys.odds) return;

    try {
      console.log('📊 Initializing Odds API...');
      
      // Get available sports first
      const sportsData = await this.makeAuthenticatedRequest(
        API_ENDPOINTS.ODDS_SPORTS,
        this.apiKeys.odds
      );

      for (const sport of this.supportedSports) {
        const oddsApiKey = SPORT_MAPPINGS.odds[sport];
        if (!oddsApiKey) continue;

        const sportData = sportsData.find((s: any) => s.key === oddsApiKey && s.active);
        if (!sportData) continue;

        // Get odds for this sport
        const oddsEndpoint = API_ENDPOINTS.ODDS_ODDS.replace('{sport}', oddsApiKey);
        await this.connectToSource({
          id: `odds_${sport.toLowerCase()}`,
          name: `Odds - ${sport}`,
          endpoint: oddsEndpoint,
          category: 'odds',
          requiresAuth: true,
          sport: sport
        });
      }
    } catch (error) {
      console.error('❌ Failed to initialize Odds API:', error);
    }
  }

  private async initializeSportRadar(): Promise<void> {
    if (!this.apiKeys.sportradar) return;

    console.log('🏈 Initializing SportRadar...');

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    for (const sport of this.supportedSports.slice(0, 4)) { // NBA, NFL, MLB, NHL
      try {
        let endpoint = '';
        
        switch (sport) {
          case 'NBA':
            endpoint = API_ENDPOINTS.SPORTRADAR_NBA_SCHEDULE
              .replace('{year}', year.toString())
              .replace('{month}', month)
              .replace('{day}', day);
            break;
          case 'NFL':
            const week = this.getCurrentNFLWeek();
            endpoint = API_ENDPOINTS.SPORTRADAR_NFL_SCHEDULE
              .replace('{year}', year.toString())
              .replace('{nfl_season}', 'REG')
              .replace('{week}', week.toString());
            break;
          case 'MLB':
            endpoint = API_ENDPOINTS.SPORTRADAR_MLB_SCHEDULE
              .replace('{year}', year.toString())
              .replace('{month}', month)
              .replace('{day}', day);
            break;
          case 'NHL':
            endpoint = API_ENDPOINTS.SPORTRADAR_NHL_SCHEDULE
              .replace('{year}', year.toString())
              .replace('{month}', month)
              .replace('{day}', day);
            break;
        }

        if (endpoint) {
          await this.connectToSource({
            id: `sportradar_${sport.toLowerCase()}`,
            name: `SportRadar - ${sport}`,
            endpoint: endpoint,
            category: 'sports',
            requiresAuth: true,
            sport: sport
          });
        }
      } catch (error) {
        console.warn(`⚠️ Failed to initialize SportRadar for ${sport}:`, error);
      }
    }
  }

  private async initializeSportRadarDF(): Promise<void> {
    if (!this.apiKeys.sportradarDF) return;

    console.log('🎯 Initializing SportRadar DailyFantasy...');

    const today = new Date().toISOString().split('T')[0];

    for (const sport of ['NBA', 'NFL', 'MLB', 'NHL']) {
      try {
        let endpoint = '';
        
        switch (sport) {
          case 'NBA':
            endpoint = API_ENDPOINTS.SPORTRADAR_DF_NBA.replace('{date}', today);
            break;
          case 'NFL':
            endpoint = API_ENDPOINTS.SPORTRADAR_DF_NFL.replace('{date}', today);
            break;
          case 'MLB':
            endpoint = API_ENDPOINTS.SPORTRADAR_DF_MLB.replace('{date}', today);
            break;
          case 'NHL':
            endpoint = API_ENDPOINTS.SPORTRADAR_DF_NHL.replace('{date}', today);
            break;
        }

        if (endpoint) {
          await this.connectToSource({
            id: `sportradar_df_${sport.toLowerCase()}`,
            name: `SportRadar DF - ${sport}`,
            endpoint: endpoint,
            category: 'fantasy',
            requiresAuth: true,
            sport: sport
          });
        }
      } catch (error) {
        console.warn(`⚠️ Failed to initialize SportRadar DF for ${sport}:`, error);
      }
    }
  }

  private async initializeESPNBackup(): Promise<void> {
    console.log('📺 Initializing ESPN Backup...');

    const espnEndpoints = {
      'NBA': API_ENDPOINTS.ESPN_NBA,
      'NFL': API_ENDPOINTS.ESPN_NFL,
      'MLB': API_ENDPOINTS.ESPN_MLB,
      'NHL': API_ENDPOINTS.ESPN_NHL
    };

    for (const [sport, endpoint] of Object.entries(espnEndpoints)) {
      await this.connectToSource({
        id: `espn_${sport.toLowerCase()}`,
        name: `ESPN - ${sport}`,
        endpoint: endpoint,
        category: 'sports',
        requiresAuth: false,
        sport: sport
      });
    }
  }

  private async initializeOfficialAPIs(): Promise<void> {
    console.log('🏛️ Initializing Official APIs...');

    // NBA Official
    await this.connectToSource({
      id: 'nba_official_schedule',
      name: 'NBA Official Schedule',
      endpoint: API_ENDPOINTS.NBA_SCHEDULE,
      category: 'sports',
      requiresAuth: false,
      sport: 'NBA'
    });

    // MLB Official
    await this.connectToSource({
      id: 'mlb_official_schedule',
      name: 'MLB Official Schedule',
      endpoint: API_ENDPOINTS.MLB_SCHEDULE,
      category: 'sports',
      requiresAuth: false,
      sport: 'MLB'
    });

    // NHL Official
    await this.connectToSource({
      id: 'nhl_official_schedule',
      name: 'NHL Official Schedule',
      endpoint: API_ENDPOINTS.NHL_SCHEDULE,
      category: 'sports',
      requiresAuth: false,
      sport: 'NHL'
    });
  }

  private async connectToSource(config: Partial<RealDataSource>): Promise<void> {
    const source: RealDataSource = {
      id: config.id!,
      name: config.name!,
      endpoint: config.endpoint!,
      connected: false,
      lastUpdate: null,
      data: null,
      quality: 0,
      reliability: 0,
      requiresAuth: config.requiresAuth || false,
      category: config.category!,
      sport: config.sport
    };

    try {
      if (this.isRateLimited(source.id)) {
        source.error = 'Rate limited - will retry later';
        this.sources.set(source.id, source);
        return;
      }

      let data;
      if (source.requiresAuth) {
        const apiKey = source.category === 'fantasy' ? this.apiKeys.sportradarDF : 
                      source.category === 'odds' ? this.apiKeys.odds : this.apiKeys.sportradar;
        
        if (!apiKey) {
          throw new Error('API key not available');
        }
        
        data = await this.makeAuthenticatedRequest(source.endpoint, apiKey);
      } else {
        data = await this.makePublicRequest(source.endpoint);
      }
      
      source.connected = true;
      source.data = data;
      source.lastUpdate = new Date();
      source.quality = this.calculateDataQuality(data, source.category);
      source.reliability = this.calculateReliability(source.id, source.category);
      
      this.updateRateLimit(source.id);
      
    } catch (error) {
      source.connected = false;
      source.error = error instanceof Error ? error.message : 'Connection failed';
      source.quality = 0;
      source.reliability = 0;
    }

    this.sources.set(source.id, source);
  }

  private async makeAuthenticatedRequest(url: string, apiKey: string): Promise<any> {
    const cacheKey = `${url}_${apiKey.slice(-8)}`;
    const cached = this.requestCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < 300000) {
      return cached.data;
    }

    try {
      const response = await axios.get(url, {
        timeout: 15000,
        params: { api_key: apiKey },
        headers: {
          'User-Agent': 'Elite-Sports-Intelligence-Platform/1.0',
          'Accept': 'application/json'
        }
      });

      const data = response.data;
      this.requestCache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          throw new Error('Rate limit exceeded');
        } else if (error.response?.status === 401) {
          throw new Error('Invalid API key');
        } else if (error.response?.status === 403) {
          throw new Error('Access forbidden');
        }
      }
      throw error;
    }
  }

  private async makePublicRequest(url: string): Promise<any> {
    const cached = this.requestCache.get(url);
    
    if (cached && Date.now() - cached.timestamp < 120000) {
      return cached.data;
    }

    try {
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json, text/plain, */*'
        }
      });

      const data = response.data;
      this.requestCache.set(url, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      throw error;
    }
  }

  private isRateLimited(sourceId: string): boolean {
    const limit = this.rateLimits.get(sourceId);
    if (!limit) return false;
    
    if (Date.now() > limit.resetTime) {
      this.rateLimits.delete(sourceId);
      return false;
    }
    
    return limit.count >= this.getRateLimitForSource(sourceId);
  }

  private getRateLimitForSource(sourceId: string): number {
    if (sourceId.includes('odds')) return 500;
    if (sourceId.includes('sportradar')) return 1000;
    if (sourceId.includes('espn')) return 100;
    return 60;
  }

  private updateRateLimit(sourceId: string): void {
    const now = Date.now();
    const resetTime = sourceId.includes('espn') ? 
      now + (60 * 60 * 1000) : 
      now + (24 * 60 * 60 * 1000);
    
    const current = this.rateLimits.get(sourceId);
    if (!current || now > current.resetTime) {
      this.rateLimits.set(sourceId, { count: 1, resetTime });
    } else {
      current.count++;
    }
  }

  private calculateDataQuality(data: any, category: string): number {
    if (!data) return 0;
    
    let quality = 0.5;
    
    if (typeof data === 'object' && data !== null) {
      const keys = Object.keys(data);
      quality += Math.min(keys.length / 10, 0.2);
      
      const hasNestedData = keys.some(key => typeof data[key] === 'object' && data[key] !== null);
      if (hasNestedData) quality += 0.1;
    }
    
    switch (category) {
      case 'sports':
        if (data.events || data.games || data.schedule || data.scoreboard) quality += 0.2;
        break;
      case 'odds':
        if (data.length > 0 && data[0].bookmakers) quality += 0.3;
        break;
      case 'fantasy':
        if (data.projections || data.players) quality += 0.3;
        break;
    }
    
    return Math.min(quality, 1.0);
  }

  private calculateReliability(sourceId: string, category: string): number {
    const baseReliability = {
      'odds_': 0.95,
      'sportradar_': 0.98,
      'espn_': 0.90,
      'nba_official': 0.99,
      'mlb_official': 0.97,
      'nhl_official': 0.96,
      'demo_': 0.85
    };
    
    for (const [prefix, reliability] of Object.entries(baseReliability)) {
      if (sourceId.startsWith(prefix)) {
        return reliability + (Math.random() - 0.5) * 0.02;
      }
    }
    
    return 0.85 + (Math.random() - 0.5) * 0.1;
  }

  private getCurrentNFLWeek(): number {
    const now = new Date();
    const seasonStart = new Date(now.getFullYear(), 8, 1);
    const weeksSinceStart = Math.floor((now.getTime() - seasonStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
    return Math.max(1, Math.min(18, weeksSinceStart + 1));
  }

  // Helper methods for demo data
  private getTeamsForSport(sport: string): string[] {
    const teams = {
      'NBA': ['LAL', 'BOS', 'GSW', 'MIL', 'PHI', 'DAL'],
      'NFL': ['BUF', 'KC', 'SF', 'LAR', 'NE', 'MIA'],
      'MLB': ['LAD', 'NYY', 'HOU', 'ATL', 'NYM', 'PHI'],
      'NHL': ['EDM', 'COL', 'TOR', 'BOS', 'NYR', 'TB']
    };
    return teams[sport] || ['Team1', 'Team2'];
  }

  private getPlayersForSport(sport: string): any[] {
    const players = {
      'NBA': [
        { name: 'LeBron James', team: 'LAL' },
        { name: 'Stephen Curry', team: 'GSW' },
        { name: 'Giannis Antetokounmpo', team: 'MIL' }
      ],
      'NFL': [
        { name: 'Josh Allen', team: 'BUF' },
        { name: 'Patrick Mahomes', team: 'KC' },
        { name: 'Christian McCaffrey', team: 'SF' }
      ]
    };
    return players[sport] || [{ name: 'Demo Player', team: 'DEMO' }];
  }

  private getStatsForSport(sport: string): string[] {
    const stats = {
      'NBA': ['Points', 'Rebounds', 'Assists'],
      'NFL': ['Passing Yards', 'Rushing Yards', 'Receptions'],
      'MLB': ['Hits', 'RBIs', 'Runs'],
      'NHL': ['Goals', 'Assists', 'Shots']
    };
    return stats[sport] || ['Points'];
  }

  private getBaseStatValue(sport: string, statType: string): number {
    const values = {
      'NBA': { 'Points': 20, 'Rebounds': 8, 'Assists': 5 },
      'NFL': { 'Passing Yards': 250, 'Rushing Yards': 80, 'Receptions': 5 },
      'MLB': { 'Hits': 1.2, 'RBIs': 1, 'Runs': 0.8 },
      'NHL': { 'Goals': 0.8, 'Assists': 1.2, 'Shots': 3.5 }
    };
    return values[sport]?.[statType] || 10;
  }

  // Public methods
  public getAllSources(): Map<string, RealDataSource> {
    return new Map(this.sources);
  }

  public getConnectedSources(): RealDataSource[] {
    return Array.from(this.sources.values()).filter(source => source.connected);
  }

  public getSourcesBySport(sport: string): RealDataSource[] {
    return Array.from(this.sources.values()).filter(source => source.sport === sport);
  }

  public getSourcesByCategory(category: string): RealDataSource[] {
    return Array.from(this.sources.values()).filter(source => source.category === category);
  }

  public getOverallDataQuality(): number {
    const connectedSources = this.getConnectedSources();
    if (connectedSources.length === 0) return 0;
    
    const totalQuality = connectedSources.reduce((sum, source) => sum + source.quality, 0);
    return totalQuality / connectedSources.length;
  }

  public getSourceReliability(): number {
    const connectedSources = this.getConnectedSources();
    if (connectedSources.length === 0) return 0;
    
    const totalReliability = connectedSources.reduce((sum, source) => sum + source.reliability, 0);
    return totalReliability / connectedSources.length;
  }

  public async refreshSource(sourceId: string): Promise<void> {
    const source = this.sources.get(sourceId);
    if (!source) return;
    
    console.log(`🔄 Refreshing ${source.name}...`);
    await this.connectToSource(source);
  }

  public async refreshAllSources(): Promise<void> {
    console.log('🔄 Refreshing all data sources...');
    const refreshPromises = Array.from(this.sources.keys()).map(id => this.refreshSource(id));
    await Promise.allSettled(refreshPromises);
    console.log('✅ All sources refreshed');
  }

  public getDataSourceMetrics(): any {
    const sources = Array.from(this.sources.values());
    const connected = sources.filter(s => s.connected);
    
    const byCategory = {};
    const bySport = {};
    
    sources.forEach(source => {
      byCategory[source.category] = (byCategory[source.category] || 0) + (source.connected ? 1 : 0);
      if (source.sport) {
        bySport[source.sport] = (bySport[source.sport] || 0) + (source.connected ? 1 : 0);
      }
    });
    
    return {
      total: sources.length,
      connected: connected.length,
      byCategory,
      bySport,
      averageQuality: this.getOverallDataQuality(),
      averageReliability: this.getSourceReliability(),
      lastUpdate: Math.max(...connected.map(s => s.lastUpdate?.getTime() || 0)),
      sportsSupported: Object.keys(bySport).length,
      authenticatedSources: sources.filter(s => s.requiresAuth && s.connected).length,
      hasValidApiKeys: this.validateApiKeys().hasAny
    };
  }
}

export const realDataSourceManager = new RealDataSourceManager();