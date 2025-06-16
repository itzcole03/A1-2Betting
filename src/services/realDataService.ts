import axios from 'axios';

// Real API endpoints that work without API keys
const API_ENDPOINTS = {
  // ESPN public APIs
  NBA_SCOREBOARD: 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard',
  NFL_SCOREBOARD: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard',
  MLB_SCOREBOARD: 'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard',
  NHL_SCOREBOARD: 'https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard',
  
  // NBA.com official APIs
  NBA_TEAMS: 'https://data.nba.net/prod/v1/2023/teams.json',
  NBA_PLAYERS: 'https://data.nba.net/prod/v1/2023/players.json',
  NBA_STANDINGS: 'https://data.nba.net/prod/v1/current/standings_all.json',
  
  // MLB official APIs
  MLB_TEAMS: 'https://statsapi.mlb.com/api/v1/teams',
  MLB_SCHEDULE: 'https://statsapi.mlb.com/api/v1/schedule/games/',
  
  // NHL official APIs
  NHL_TEAMS: 'https://api-web.nhle.com/v1/teams',
  NHL_SCHEDULE: 'https://api-web.nhle.com/v1/schedule/now',
  
  // Weather API (OpenMeteo - free, no key required)
  WEATHER: 'https://api.open-meteo.com/v1/forecast',
  
  // News APIs (RSS to JSON)
  ESPN_NEWS: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.espn.com/espn/rss/news',
  SPORTS_NEWS: 'https://api.rss2json.com/v1/api.json?rss_url=https://feeds.nbcsports.com/nbcsports/NBCSPORTS',
  
  // GitHub sports data repositories
  FIVETHIRTYEIGHT_NBA: 'https://api.github.com/repos/fivethirtyeight/data/contents/nba-forecasts',
  SPORTS_REFERENCE: 'https://raw.githubusercontent.com/fivethirtyeight/data/master/nba-raptor/modern_RAPTOR_by_player.csv',
  
  // Reddit public feeds
  NBA_REDDIT: 'https://www.reddit.com/r/nba/hot.json?limit=25',
  SPORTSBOOK_REDDIT: 'https://www.reddit.com/r/sportsbook/hot.json?limit=25',
  
  // Cryptocurrency/Financial APIs (for odds simulation patterns)
  CRYPTO_PRICES: 'https://api.coindesk.com/v1/bpi/currentprice.json',
  EXCHANGE_RATES: 'https://api.exchangerate-api.com/v4/latest/USD'
};

export interface RealDataSource {
  name: string;
  endpoint: string;
  connected: boolean;
  lastUpdate: Date | null;
  data: any;
  quality: number;
  error?: string;
}

export class RealDataService {
  private dataSources: Map<string, RealDataSource> = new Map();
  private retryAttempts = 3;
  private timeout = 10000; // 10 seconds

  async connectToAllSources(): Promise<Map<string, RealDataSource>> {
    const connections = [
      this.connectToNBA(),
      this.connectToNFL(),
      this.connectToMLB(),
      this.connectToNHL(),
      this.connectToWeather(),
      this.connectToNews(),
      this.connectToGitHubData(),
      this.connectToReddit(),
      this.connectToFinancialData()
    ];

    await Promise.allSettled(connections);
    return this.dataSources;
  }

  private async makeRequest(url: string, retries = this.retryAttempts): Promise<any> {
    try {
      const response = await axios.get(url, {
        timeout: this.timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      });
      return response.data;
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.makeRequest(url, retries - 1);
      }
      throw error;
    }
  }

  async connectToNBA(): Promise<void> {
    try {
      // Try ESPN NBA first
      const scoreboardData = await this.makeRequest(API_ENDPOINTS.NBA_SCOREBOARD);
      
      this.dataSources.set('nba_espn', {
        name: 'ESPN NBA',
        endpoint: API_ENDPOINTS.NBA_SCOREBOARD,
        connected: true,
        lastUpdate: new Date(),
        data: scoreboardData,
        quality: 0.95
      });

      // Try NBA.com official data
      try {
        const teamsData = await this.makeRequest(API_ENDPOINTS.NBA_TEAMS);
        this.dataSources.set('nba_official', {
          name: 'NBA Official',
          endpoint: API_ENDPOINTS.NBA_TEAMS,
          connected: true,
          lastUpdate: new Date(),
          data: teamsData,
          quality: 0.98
        });
      } catch (e) {
        console.warn('NBA official API unavailable');
      }

    } catch (error) {
      this.dataSources.set('nba_espn', {
        name: 'ESPN NBA',
        endpoint: API_ENDPOINTS.NBA_SCOREBOARD,
        connected: false,
        lastUpdate: null,
        data: null,
        quality: 0,
        error: error instanceof Error ? error.message : 'Connection failed'
      });
    }
  }

  async connectToNFL(): Promise<void> {
    try {
      const data = await this.makeRequest(API_ENDPOINTS.NFL_SCOREBOARD);
      this.dataSources.set('nfl_espn', {
        name: 'ESPN NFL',
        endpoint: API_ENDPOINTS.NFL_SCOREBOARD,
        connected: true,
        lastUpdate: new Date(),
        data: data,
        quality: 0.94
      });
    } catch (error) {
      this.dataSources.set('nfl_espn', {
        name: 'ESPN NFL',
        endpoint: API_ENDPOINTS.NFL_SCOREBOARD,
        connected: false,
        lastUpdate: null,
        data: null,
        quality: 0,
        error: error instanceof Error ? error.message : 'Connection failed'
      });
    }
  }

  async connectToMLB(): Promise<void> {
    try {
      // Try ESPN MLB
      const espnData = await this.makeRequest(API_ENDPOINTS.MLB_SCOREBOARD);
      this.dataSources.set('mlb_espn', {
        name: 'ESPN MLB',
        endpoint: API_ENDPOINTS.MLB_SCOREBOARD,
        connected: true,
        lastUpdate: new Date(),
        data: espnData,
        quality: 0.93
      });

      // Try MLB official API
      try {
        const mlbData = await this.makeRequest(API_ENDPOINTS.MLB_TEAMS);
        this.dataSources.set('mlb_official', {
          name: 'MLB Official',
          endpoint: API_ENDPOINTS.MLB_TEAMS,
          connected: true,
          lastUpdate: new Date(),
          data: mlbData,
          quality: 0.97
        });
      } catch (e) {
        console.warn('MLB official API unavailable');
      }

    } catch (error) {
      this.dataSources.set('mlb_espn', {
        name: 'ESPN MLB',
        endpoint: API_ENDPOINTS.MLB_SCOREBOARD,
        connected: false,
        lastUpdate: null,
        data: null,
        quality: 0,
        error: error instanceof Error ? error.message : 'Connection failed'
      });
    }
  }

  async connectToNHL(): Promise<void> {
    try {
      // Try ESPN NHL
      const espnData = await this.makeRequest(API_ENDPOINTS.NHL_SCOREBOARD);
      this.dataSources.set('nhl_espn', {
        name: 'ESPN NHL',
        endpoint: API_ENDPOINTS.NHL_SCOREBOARD,
        connected: true,
        lastUpdate: new Date(),
        data: espnData,
        quality: 0.92
      });

      // Try NHL official API
      try {
        const nhlData = await this.makeRequest(API_ENDPOINTS.NHL_SCHEDULE);
        this.dataSources.set('nhl_official', {
          name: 'NHL Official',
          endpoint: API_ENDPOINTS.NHL_SCHEDULE,
          connected: true,
          lastUpdate: new Date(),
          data: nhlData,
          quality: 0.96
        });
      } catch (e) {
        console.warn('NHL official API unavailable');
      }

    } catch (error) {
      this.dataSources.set('nhl_espn', {
        name: 'ESPN NHL',
        endpoint: API_ENDPOINTS.NHL_SCOREBOARD,
        connected: false,
        lastUpdate: null,
        data: null,
        quality: 0,
        error: error instanceof Error ? error.message : 'Connection failed'
      });
    }
  }

  async connectToWeather(): Promise<void> {
    try {
      // Get weather for major sports cities
      const cities = [
        { name: 'New York', lat: 40.7128, lon: -74.0060 },
        { name: 'Los Angeles', lat: 34.0522, lon: -118.2437 },
        { name: 'Chicago', lat: 41.8781, lon: -87.6298 },
        { name: 'Boston', lat: 42.3601, lon: -71.0589 }
      ];

      const weatherData = await Promise.all(
        cities.map(async (city) => {
          const url = `${API_ENDPOINTS.WEATHER}?latitude=${city.lat}&longitude=${city.lon}&current_weather=true&hourly=temperature_2m,precipitation,windspeed_10m`;
          const data = await this.makeRequest(url);
          return { city: city.name, ...data };
        })
      );

      this.dataSources.set('weather', {
        name: 'Weather Data',
        endpoint: API_ENDPOINTS.WEATHER,
        connected: true,
        lastUpdate: new Date(),
        data: weatherData,
        quality: 0.88
      });

    } catch (error) {
      this.dataSources.set('weather', {
        name: 'Weather Data',
        endpoint: API_ENDPOINTS.WEATHER,
        connected: false,
        lastUpdate: null,
        data: null,
        quality: 0,
        error: error instanceof Error ? error.message : 'Connection failed'
      });
    }
  }

  async connectToNews(): Promise<void> {
    try {
      const [espnNews, sportsNews] = await Promise.all([
        this.makeRequest(API_ENDPOINTS.ESPN_NEWS),
        this.makeRequest(API_ENDPOINTS.SPORTS_NEWS)
      ]);

      this.dataSources.set('news', {
        name: 'Sports News',
        endpoint: API_ENDPOINTS.ESPN_NEWS,
        connected: true,
        lastUpdate: new Date(),
        data: { espn: espnNews, sports: sportsNews },
        quality: 0.85
      });

    } catch (error) {
      this.dataSources.set('news', {
        name: 'Sports News',
        endpoint: API_ENDPOINTS.ESPN_NEWS,
        connected: false,
        lastUpdate: null,
        data: null,
        quality: 0,
        error: error instanceof Error ? error.message : 'Connection failed'
      });
    }
  }

  async connectToGitHubData(): Promise<void> {
    try {
      const [fiveThirtyEight, sportsReference] = await Promise.all([
        this.makeRequest(API_ENDPOINTS.FIVETHIRTYEIGHT_NBA),
        this.makeRequest(API_ENDPOINTS.SPORTS_REFERENCE)
      ]);

      this.dataSources.set('github_data', {
        name: 'GitHub Sports Data',
        endpoint: API_ENDPOINTS.FIVETHIRTYEIGHT_NBA,
        connected: true,
        lastUpdate: new Date(),
        data: { fiveThirtyEight, sportsReference },
        quality: 0.90
      });

    } catch (error) {
      this.dataSources.set('github_data', {
        name: 'GitHub Sports Data',
        endpoint: API_ENDPOINTS.FIVETHIRTYEIGHT_NBA,
        connected: false,
        lastUpdate: null,
        data: null,
        quality: 0,
        error: error instanceof Error ? error.message : 'Connection failed'
      });
    }
  }

  async connectToReddit(): Promise<void> {
    try {
      const [nbaReddit, sportsbookReddit] = await Promise.all([
        this.makeRequest(API_ENDPOINTS.NBA_REDDIT),
        this.makeRequest(API_ENDPOINTS.SPORTSBOOK_REDDIT)
      ]);

      this.dataSources.set('reddit', {
        name: 'Reddit Sports Data',
        endpoint: API_ENDPOINTS.NBA_REDDIT,
        connected: true,
        lastUpdate: new Date(),
        data: { nba: nbaReddit, sportsbook: sportsbookReddit },
        quality: 0.75
      });

    } catch (error) {
      this.dataSources.set('reddit', {
        name: 'Reddit Sports Data',
        endpoint: API_ENDPOINTS.NBA_REDDIT,
        connected: false,
        lastUpdate: null,
        data: null,
        quality: 0,
        error: error instanceof Error ? error.message : 'Connection failed'
      });
    }
  }

  async connectToFinancialData(): Promise<void> {
    try {
      const [cryptoData, exchangeRates] = await Promise.all([
        this.makeRequest(API_ENDPOINTS.CRYPTO_PRICES),
        this.makeRequest(API_ENDPOINTS.EXCHANGE_RATES)
      ]);

      this.dataSources.set('financial', {
        name: 'Financial Data',
        endpoint: API_ENDPOINTS.CRYPTO_PRICES,
        connected: true,
        lastUpdate: new Date(),
        data: { crypto: cryptoData, rates: exchangeRates },
        quality: 0.82
      });

    } catch (error) {
      this.dataSources.set('financial', {
        name: 'Financial Data',
        endpoint: API_ENDPOINTS.CRYPTO_PRICES,
        connected: false,
        lastUpdate: null,
        data: null,
        quality: 0,
        error: error instanceof Error ? error.message : 'Connection failed'
      });
    }
  }

  getConnectedSources(): RealDataSource[] {
    return Array.from(this.dataSources.values()).filter(source => source.connected);
  }

  getDataQuality(): number {
    const connectedSources = this.getConnectedSources();
    if (connectedSources.length === 0) return 0;
    
    const totalQuality = connectedSources.reduce((sum, source) => sum + source.quality, 0);
    return totalQuality / connectedSources.length;
  }

  async refreshData(): Promise<void> {
    await this.connectToAllSources();
  }
}

export const realDataService = new RealDataService();