import { useEffect, useCallback } from 'react';
import { useApp } from '../contexts/AppContext';
import { DataSource, Game, Player } from '../types';

export function useDataSources() {
  const { state, dispatch } = useApp();

  const connectToDataSources = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'UPDATE_CONNECTION_STATUS', payload: 'Connecting to Data Sources...' });

    try {
      const dataSources = new Map<string, DataSource>();
      
      // Simulate connections to various sports APIs
      const endpoints = [
        { key: 'nba', name: 'NBA API', quality: 0.92 },
        { key: 'wnba', name: 'WNBA API', quality: 0.88 },
        { key: 'mlb', name: 'MLB API', quality: 0.90 },
        { key: 'nhl', name: 'NHL API', quality: 0.89 },
        { key: 'soccer', name: 'Soccer API', quality: 0.85 },
        { key: 'espn', name: 'ESPN API', quality: 0.94 },
        { key: 'odds', name: 'Odds API', quality: 0.91 },
        { key: 'sentiment', name: 'Sentiment API', quality: 0.76 },
        { key: 'weather', name: 'Weather API', quality: 0.87 },
        { key: 'injuries', name: 'Injury Reports', quality: 0.83 },
      ];

      for (const endpoint of endpoints) {
        // Simulate API connection with realistic delays
        await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));
        
        const success = Math.random() > 0.15; // 85% success rate
        dataSources.set(endpoint.key, {
          connected: success,
          quality: success ? endpoint.quality + (Math.random() - 0.5) * 0.1 : 0,
          lastUpdate: new Date(),
          source: endpoint.name,
          data: success ? generateMockData(endpoint.key) : null,
          error: success ? undefined : 'Connection failed'
        });
      }

      dispatch({ type: 'SET_REAL_DATA_SOURCES', payload: dataSources });
      
      const connectedCount = Array.from(dataSources.values()).filter(ds => ds.connected).length;
      dispatch({ 
        type: 'UPDATE_CONNECTION_STATUS', 
        payload: `🟢 ${connectedCount}/${endpoints.length} Sources Active` 
      });

      // Generate games and props based on connected data
      const games = await generateGamesFromDataSources(dataSources);
      const props = await generatePropsFromDataSources(dataSources);
      
      dispatch({ type: 'SET_CURRENT_GAMES', payload: games });
      dispatch({ type: 'SET_CURRENT_PROPS', payload: props });

      // Update live stats
      dispatch({ type: 'UPDATE_LIVE_STATS', payload: {
        liveGames: games.length,
        dataPoints: Math.floor(Math.random() * 50000) + 10000,
        aiPredictions: Math.floor(Math.random() * 5000) + 2000,
      }});

    } catch (error) {
      console.error('Data source connection error:', error);
      dispatch({ type: 'UPDATE_CONNECTION_STATUS', payload: '🟡 Enhanced AI Mode' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch]);

  useEffect(() => {
    connectToDataSources();
    
    // Set up real-time updates
    const interval = setInterval(() => {
      dispatch({ type: 'UPDATE_LIVE_STATS', payload: {
        dataPoints: state.liveStats.dataPoints + Math.floor(Math.random() * 100) + 20,
        aiPredictions: state.liveStats.aiPredictions + Math.floor(Math.random() * 15) + 5,
        realTimeAccuracy: Math.min(99.5, state.liveStats.realTimeAccuracy + (Math.random() - 0.5) * 0.5),
      }});
    }, 3000);

    return () => clearInterval(interval);
  }, [connectToDataSources, dispatch, state.liveStats]);

  return {
    connectToDataSources,
    dataSources: state.realDataSources,
    connectionStatus: state.connectionStatus,
    loading: state.loading,
  };
}

function generateMockData(sourceKey: string) {
  switch (sourceKey) {
    case 'nba':
      return {
        games: Array.from({ length: 8 }, (_, i) => ({
          id: `nba_${i}`,
          homeTeam: ['LAL', 'BOS', 'GSW', 'MIL'][i % 4],
          awayTeam: ['PHI', 'DAL', 'PHX', 'DEN'][i % 4],
          date: new Date(Date.now() + i * 3600000).toISOString(),
        }))
      };
    case 'odds':
      return Array.from({ length: 20 }, (_, i) => ({
        gameId: `odds_${i}`,
        moneyline: { home: -120 + Math.random() * 40, away: 100 + Math.random() * 40 },
        spread: { line: Math.random() * 10 - 5, odds: -110 },
        total: { line: 210 + Math.random() * 20, overOdds: -105, underOdds: -115 }
      }));
    default:
      return { connected: true, timestamp: Date.now() };
  }
}

async function generateGamesFromDataSources(dataSources: Map<string, DataSource>): Promise<Game[]> {
  const games: Game[] = [];
  const sports = ['NBA', 'WNBA', 'MLB', 'NHL', 'Soccer'];
  
  sports.forEach((sport, index) => {
    const count = Math.floor(Math.random() * 6) + 2;
    for (let i = 0; i < count; i++) {
      games.push({
        id: `${sport.toLowerCase()}_${i}`,
        name: `${sport} Game ${i + 1}`,
        date: new Date(Date.now() + i * 3600000).toISOString(),
        sport,
        status: 'Scheduled',
        source: 'ENHANCED_DATA',
        dataQuality: 0.85 + Math.random() * 0.15,
      });
    }
  });

  return games;
}

async function generatePropsFromDataSources(dataSources: Map<string, DataSource>): Promise<Player[]> {
  const players: Player[] = [
    { 
      id: 'lebron_james',
      name: 'LeBron James', 
      team: 'LAL', 
      position: 'SF', 
      rating: 96, 
      sport: 'NBA',
      stats: { points: 25.2, rebounds: 7.8, assists: 6.8 },
      realDataQuality: 0.95,
    },
    { 
      id: 'jayson_tatum',
      name: 'Jayson Tatum', 
      team: 'BOS', 
      position: 'SF', 
      rating: 93, 
      sport: 'NBA',
      stats: { points: 28.1, rebounds: 8.2, assists: 4.9 },
      realDataQuality: 0.93,
    },
    { 
      id: 'stephen_curry',
      name: 'Stephen Curry', 
      team: 'GSW', 
      position: 'PG', 
      rating: 95, 
      sport: 'NBA',
      stats: { points: 27.8, rebounds: 4.3, assists: 5.9 },
      realDataQuality: 0.94,
    },
    { 
      id: 'giannis_antetokounmpo',
      name: 'Giannis Antetokounmpo', 
      team: 'MIL', 
      position: 'PF', 
      rating: 97, 
      sport: 'NBA',
      stats: { points: 31.2, rebounds: 11.8, assists: 5.7 },
      realDataQuality: 0.96,
    },
    { 
      id: 'joel_embiid',
      name: 'Joel Embiid', 
      team: 'PHI', 
      position: 'C', 
      rating: 95, 
      sport: 'NBA',
      stats: { points: 27.9, rebounds: 11.2, assists: 4.1 },
      realDataQuality: 0.92,
    },
    { 
      id: 'luka_doncic',
      name: 'Luka Doncic', 
      team: 'DAL', 
      position: 'PG', 
      rating: 94, 
      sport: 'NBA',
      stats: { points: 29.1, rebounds: 8.1, assists: 8.9 },
      realDataQuality: 0.94,
    },
  ];

  // Add AI enhancements to each player
  return players.map(player => ({
    ...player,
    aiEnhancement: {
      ratingBoost: (player.rating - 80) * 0.01,
      consistencyFactor: 0.85 + Math.random() * 0.15,
      injuryRisk: Math.random() * 0.1,
      formMultiplier: 0.9 + Math.random() * 0.2,
    },
    patternStrength: {
      overall: 0.8 + Math.random() * 0.2,
      recent: 0.75 + Math.random() * 0.25,
      seasonal: 0.85 + Math.random() * 0.15,
    },
    socialSentiment: {
      score: Math.random() * 2 - 1,
      volume: Math.floor(Math.random() * 5000),
      trend: Math.random() > 0.5 ? 'positive' : 'negative' as const,
    },
    newsImpact: {
      mentions: Math.floor(Math.random() * 20),
      sentiment: Math.random() * 2 - 1,
      impact: Math.random() * 0.15,
    },
  }));
}