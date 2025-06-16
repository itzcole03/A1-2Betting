import { useState, useEffect, useCallback } from 'react';
import { enhancedDataSourceManager, EnhancedDataSource } from '../services/enhancedDataSources';
import { dataProcessor, ProcessedGame, ProcessedPlayer } from '../services/dataProcessor';

export function useEnhancedRealDataSources() {
  const [dataSources, setDataSources] = useState<Map<string, EnhancedDataSource>>(new Map());
  const [games, setGames] = useState<ProcessedGame[]>([]);
  const [players, setPlayers] = useState<ProcessedPlayer[]>([]);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [dataQuality, setDataQuality] = useState(0);
  const [dataReliability, setDataReliability] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const connectToSources = useCallback(async () => {
    setLoading(true);
    setConnectionStatus('Connecting to enhanced data sources...');

    try {
      console.log('🚀 Initializing Enhanced Data Sources...');
      
      // Check for API keys
      const hasApiKeys = import.meta.env.VITE_ODDS_API_KEY || 
                        import.meta.env.VITE_SPORTRADAR_API_KEY || 
                        import.meta.env.VITE_ESPN_API_KEY;

      if (!hasApiKeys) {
        console.warn('⚠️ No API keys found - initializing demo mode');
        setConnectionStatus('Demo mode - Add API keys for real data');
        setDataQuality(0.75); // Demo mode quality
        setDataReliability(0.80);
        
        // Initialize demo sources
        const demoSources = await enhancedDataSourceManager.initializeAllSources();
        setDataSources(demoSources);
        
        // Process demo data
        const demoGames = dataProcessor.processGames(convertToRealDataSources(demoSources));
        const demoPlayers = dataProcessor.processPlayers(convertToRealDataSources(demoSources));
        
        setGames(demoGames);
        setPlayers(demoPlayers);
        setLastUpdate(new Date());
        
        console.log(`🎮 Demo mode initialized: ${demoGames.length} games, ${demoPlayers.length} players`);
        return;
      }

      const sources = await enhancedDataSourceManager.initializeAllSources();
      setDataSources(sources);

      const connectedSources = enhancedDataSourceManager.getConnectedSources();
      const quality = enhancedDataSourceManager.getOverallDataQuality();
      const reliability = enhancedDataSourceManager.getSourceReliability();
      
      setDataQuality(quality);
      setDataReliability(reliability);
      setConnectionStatus(`Connected to ${connectedSources.length} enhanced data sources`);
      setLastUpdate(new Date());

      // Process the enhanced data
      const processedGames = dataProcessor.processGames(convertToRealDataSources(sources));
      const processedPlayers = dataProcessor.processPlayers(convertToRealDataSources(sources));
      
      setGames(processedGames);
      setPlayers(processedPlayers);

      console.log('Enhanced data connection results:', {
        connectedSources: connectedSources.length,
        totalSources: sources.size,
        games: processedGames.length,
        players: processedPlayers.length,
        quality: quality,
        reliability: reliability
      });

    } catch (error) {
      console.error('Error connecting to enhanced data sources:', error);
      setConnectionStatus('Connection failed - using fallback data');
      
      // Generate fallback data
      const fallbackGames = generateFallbackGames();
      const fallbackPlayers = generateFallbackPlayers();
      
      setGames(fallbackGames);
      setPlayers(fallbackPlayers);
      setDataQuality(0.6);
      setDataReliability(0.7);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    console.log('🔄 Refreshing enhanced data sources...');
    
    try {
      await enhancedDataSourceManager.refreshAllSources();
      setDataSources(enhancedDataSourceManager.getAllSources());
      
      const quality = enhancedDataSourceManager.getOverallDataQuality();
      const reliability = enhancedDataSourceManager.getSourceReliability();
      setDataQuality(quality);
      setDataReliability(reliability);
      setLastUpdate(new Date());

      // Reprocess data
      const sources = enhancedDataSourceManager.getAllSources();
      const processedGames = dataProcessor.processGames(convertToRealDataSources(sources));
      const processedPlayers = dataProcessor.processPlayers(convertToRealDataSources(sources));
      
      setGames(processedGames);
      setPlayers(processedPlayers);
      
      console.log('✅ Enhanced data refresh completed');
    } catch (error) {
      console.error('❌ Failed to refresh enhanced data:', error);
    }
  }, []);

  const getSourcesByCategory = useCallback((category: string) => {
    return enhancedDataSourceManager.getSourcesByCategory(category);
  }, []);

  const getDataSourceMetrics = useCallback(() => {
    return enhancedDataSourceManager.getDataSourceMetrics();
  }, []);

  // Convert EnhancedDataSource to RealDataSource for compatibility
  const convertToRealDataSources = (sources: Map<string, EnhancedDataSource>) => {
    const converted = new Map();
    sources.forEach((source, key) => {
      converted.set(key, {
        connected: source.connected,
        quality: source.quality,
        lastUpdate: source.lastUpdate,
        data: source.data,
        error: source.error,
        source: source.name
      });
    });
    return converted;
  };

  const generateFallbackGames = (): ProcessedGame[] => {
    const sports = ['NBA', 'NFL', 'MLB', 'NHL'];
    const games: ProcessedGame[] = [];
    
    sports.forEach(sport => {
      const teams = getTeamsForSport(sport);
      for (let i = 0; i < 3; i++) {
        const homeTeam = teams[Math.floor(Math.random() * teams.length)];
        const awayTeam = teams[Math.floor(Math.random() * teams.length)];
        
        if (homeTeam !== awayTeam) {
          games.push({
            id: `fallback_${sport}_${i}`,
            sport,
            homeTeam,
            awayTeam,
            gameTime: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'Scheduled',
            source: 'Fallback Data',
            venue: `${homeTeam} Arena`
          });
        }
      }
    });
    
    return games;
  };

  const generateFallbackPlayers = (): ProcessedPlayer[] => {
    const sports = ['NBA', 'NFL', 'MLB', 'NHL'];
    const players: ProcessedPlayer[] = [];
    
    sports.forEach(sport => {
      const sportPlayers = getPlayersForSport(sport);
      sportPlayers.forEach(playerData => {
        players.push({
          id: `fallback_${sport}_${playerData.name.replace(/\s+/g, '_').toLowerCase()}`,
          name: playerData.name,
          team: playerData.team,
          position: playerData.position || 'Unknown',
          sport,
          stats: generateStatsForSport(sport),
          recentForm: Array.from({length: 10}, () => Math.random()),
          source: 'Fallback Data'
        });
      });
    });
    
    return players;
  };

  const generateStatsForSport = (sport: string): any => {
    const stats: any = {};
    
    switch (sport) {
      case 'NBA':
        stats.points = 15 + Math.random() * 15;
        stats.rebounds = 3 + Math.random() * 8;
        stats.assists = 2 + Math.random() * 6;
        stats.threePointersMade = 1 + Math.random() * 3;
        break;
      case 'NFL':
        stats.passingYards = 200 + Math.random() * 150;
        stats.rushingYards = 50 + Math.random() * 100;
        stats.receptions = 3 + Math.random() * 7;
        stats.touchdowns = 0.5 + Math.random() * 2;
        break;
      case 'MLB':
        stats.hits = 0.8 + Math.random() * 0.8;
        stats.rbis = 0.5 + Math.random() * 1;
        stats.runs = 0.4 + Math.random() * 0.8;
        stats.homeRuns = 0.1 + Math.random() * 0.5;
        break;
      case 'NHL':
        stats.goals = 0.3 + Math.random() * 0.8;
        stats.assists = 0.4 + Math.random() * 1;
        stats.shots = 2 + Math.random() * 3;
        stats.points = stats.goals + stats.assists;
        break;
    }
    
    return stats;
  };

  const getTeamsForSport = (sport: string): string[] => {
    const teams = {
      'NBA': ['LAL', 'BOS', 'GSW', 'MIL', 'PHI', 'DAL', 'PHX', 'DEN'],
      'NFL': ['BUF', 'KC', 'SF', 'LAR', 'NE', 'MIA', 'NYJ', 'PIT'],
      'MLB': ['LAD', 'NYY', 'HOU', 'ATL', 'NYM', 'PHI', 'SD', 'TOR'],
      'NHL': ['EDM', 'COL', 'TOR', 'BOS', 'NYR', 'TB', 'CAR', 'VGK']
    };
    return teams[sport] || ['Team1', 'Team2'];
  };

  const getPlayersForSport = (sport: string): any[] => {
    const players = {
      'NBA': [
        { name: 'LeBron James', team: 'LAL', position: 'SF' },
        { name: 'Stephen Curry', team: 'GSW', position: 'PG' },
        { name: 'Giannis Antetokounmpo', team: 'MIL', position: 'PF' },
        { name: 'Jayson Tatum', team: 'BOS', position: 'SF' },
        { name: 'Luka Doncic', team: 'DAL', position: 'PG' }
      ],
      'NFL': [
        { name: 'Josh Allen', team: 'BUF', position: 'QB' },
        { name: 'Patrick Mahomes', team: 'KC', position: 'QB' },
        { name: 'Christian McCaffrey', team: 'SF', position: 'RB' },
        { name: 'Cooper Kupp', team: 'LAR', position: 'WR' }
      ],
      'MLB': [
        { name: 'Mike Trout', team: 'LAA', position: 'OF' },
        { name: 'Mookie Betts', team: 'LAD', position: 'OF' },
        { name: 'Aaron Judge', team: 'NYY', position: 'OF' },
        { name: 'Ronald Acuña Jr.', team: 'ATL', position: 'OF' }
      ],
      'NHL': [
        { name: 'Connor McDavid', team: 'EDM', position: 'C' },
        { name: 'Leon Draisaitl', team: 'EDM', position: 'C' },
        { name: 'Nathan MacKinnon', team: 'COL', position: 'C' }
      ]
    };
    return players[sport] || [{ name: 'Demo Player', team: 'DEMO', position: 'P' }];
  };

  useEffect(() => {
    connectToSources();
    
    // Set up periodic refresh
    const interval = setInterval(() => {
      refreshData();
    }, 300000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, [connectToSources, refreshData]);

  return {
    dataSources,
    games,
    players,
    loading,
    connectionStatus,
    dataQuality,
    dataReliability,
    lastUpdate,
    refreshData,
    getSourcesByCategory,
    getDataSourceMetrics,
    connectedSourcesCount: enhancedDataSourceManager.getConnectedSources().length,
    totalSourcesCount: dataSources.size
  };
}