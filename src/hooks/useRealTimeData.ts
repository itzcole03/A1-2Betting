import { useState, useEffect, useCallback } from 'react';
import { realDataSourceManager } from '../services/realDataSources';
import { realTimePredictionEngine, EnhancedPrediction } from '../services/realTimePredictionEngine';

export function useRealTimeData() {
  const [sources, setSources] = useState(new Map());
  const [predictions, setPredictions] = useState<Map<string, EnhancedPrediction[]>>(new Map());
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [dataQuality, setDataQuality] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const initializeData = useCallback(async () => {
    setLoading(true);
    setConnectionStatus('Connecting to real-time data sources...');

    try {
      console.log('🚀 Initializing real-time data connections...');
      
      // Check for API keys first
      const hasApiKeys = import.meta.env.VITE_ODDS_API_KEY || 
                        import.meta.env.VITE_SPORTRADAR_API_KEY || 
                        import.meta.env.VITE_DATA_API_KEY_PRIMARY;

      if (!hasApiKeys) {
        console.warn('⚠️ No API keys found - running in demo mode');
        setConnectionStatus('❌ No API keys - Demo mode active');
        setDataQuality(0.7); // Demo mode quality
        
        // Generate demo predictions
        await generateDemoPredictions();
        return;
      }
      
      // Initialize all data sources with API keys
      const connectedSources = await realDataSourceManager.initializeAllSources();
      setSources(connectedSources);

      const connectedCount = Array.from(connectedSources.values()).filter(s => s.connected).length;
      const totalCount = connectedSources.size;
      
      if (connectedCount > 0) {
        setConnectionStatus(`✅ Connected to ${connectedCount}/${totalCount} real data sources`);
        setDataQuality(realDataSourceManager.getOverallDataQuality());
        setLastUpdate(new Date());
        
        console.log(`📊 Successfully connected to ${connectedCount} data sources`);
        
        // Generate predictions for all sports
        await generateAllPredictions();
      } else {
        setConnectionStatus('❌ No data sources connected - check API keys');
        setDataQuality(0);
        
        // Generate demo predictions as fallback
        await generateDemoPredictions();
      }
    } catch (error) {
      console.error('❌ Failed to initialize data sources:', error);
      setConnectionStatus('❌ Connection failed - check network and API keys');
      setDataQuality(0);
      
      // Generate demo predictions as fallback
      await generateDemoPredictions();
    } finally {
      setLoading(false);
    }
  }, []);

  const generateAllPredictions = useCallback(async () => {
    console.log('🔮 Generating real-time predictions...');
    
    const sports = ['NBA', 'NFL', 'MLB', 'NHL', 'Soccer', 'WNBA', 'MMA', 'PGA'];
    const newPredictions = new Map<string, EnhancedPrediction[]>();
    
    for (const sport of sports) {
      try {
        const sportPredictions = await realTimePredictionEngine.generateRealTimePredictions(sport);
        if (sportPredictions.length > 0) {
          newPredictions.set(sport, sportPredictions);
          console.log(`✅ Generated ${sportPredictions.length} predictions for ${sport}`);
        }
      } catch (error) {
        console.warn(`⚠️ Failed to generate predictions for ${sport}:`, error);
        
        // Generate fallback predictions for this sport
        const fallbackPredictions = generateFallbackPredictions(sport);
        if (fallbackPredictions.length > 0) {
          newPredictions.set(sport, fallbackPredictions);
        }
      }
    }
    
    setPredictions(newPredictions);
    
    const totalPredictions = Array.from(newPredictions.values()).reduce((sum, preds) => sum + preds.length, 0);
    console.log(`🎯 Total predictions generated: ${totalPredictions}`);
  }, []);

  const generateDemoPredictions = useCallback(async () => {
    console.log('🎮 Generating demo predictions...');
    
    const sports = ['NBA', 'NFL', 'MLB', 'NHL'];
    const demoPredictions = new Map<string, EnhancedPrediction[]>();
    
    sports.forEach(sport => {
      const predictions = generateFallbackPredictions(sport);
      demoPredictions.set(sport, predictions);
    });
    
    setPredictions(demoPredictions);
    setLastUpdate(new Date());
  }, []);

  const generateFallbackPredictions = (sport: string): EnhancedPrediction[] => {
    const predictions: EnhancedPrediction[] = [];
    const teams = getTeamsForSport(sport);
    const players = getPlayersForSport(sport);
    
    // Generate game predictions
    for (let i = 0; i < 3; i++) {
      const homeTeam = teams[Math.floor(Math.random() * teams.length)];
      const awayTeam = teams[Math.floor(Math.random() * teams.length)];
      
      if (homeTeam !== awayTeam) {
        predictions.push({
          id: `demo_${sport}_game_${i}`,
          type: 'game',
          sport,
          game: `${awayTeam} @ ${homeTeam}`,
          pick: `${homeTeam} -3.5`,
          line: 3.5,
          recommendation: 'home',
          confidence: 80 + Math.random() * 15,
          expectedValue: (Math.random() - 0.3) * 20,
          odds: -110,
          reasoning: [
            'Demo prediction based on simulated data',
            'Home field advantage factor',
            'Recent form analysis'
          ],
          dataQuality: 0.7,
          sources: ['Demo Data'],
          timestamp: new Date(),
          modelConsensus: 0.8 + Math.random() * 0.15,
          valueGrade: ['A', 'B+', 'B', 'C+'][Math.floor(Math.random() * 4)] as any,
          kellyOptimal: Math.random() * 0.1,
          riskScore: Math.random() * 0.3,
          backtestResults: {
            winRate: 0.55 + Math.random() * 0.1,
            avgReturn: 0.08 + Math.random() * 0.12,
            maxDrawdown: 0.15 + Math.random() * 0.1,
            profitFactor: 1.2 + Math.random() * 0.8
          },
          realTimeFactors: {
            lineMovement: (Math.random() - 0.5) * 2,
            publicBetting: Math.random(),
            sharpMoney: Math.random() > 0.7,
            weatherImpact: Math.random() * 0.1,
            injuryImpact: Math.random() * 0.05
          }
        });
      }
    }
    
    // Generate player prop predictions
    for (let i = 0; i < 5; i++) {
      const player = players[Math.floor(Math.random() * players.length)];
      const statTypes = getStatTypesForSport(sport);
      const statType = statTypes[Math.floor(Math.random() * statTypes.length)];
      const line = getBaseStatValue(sport, statType);
      
      predictions.push({
        id: `demo_${sport}_prop_${i}`,
        type: 'player_prop',
        sport,
        game: `${player.name} - ${statType}`,
        pick: `${player.name} Over ${line} ${statType}`,
        line,
        recommendation: 'over',
        confidence: 75 + Math.random() * 20,
        expectedValue: (Math.random() - 0.2) * 15,
        odds: -110,
        reasoning: [
          'Demo prediction from simulated player data',
          'Historical performance analysis',
          'Matchup advantage identified'
        ],
        dataQuality: 0.7,
        sources: ['Demo Data'],
        timestamp: new Date(),
        modelConsensus: 0.75 + Math.random() * 0.2,
        valueGrade: ['A', 'B+', 'B', 'C+'][Math.floor(Math.random() * 4)] as any,
        kellyOptimal: Math.random() * 0.08,
        riskScore: Math.random() * 0.4,
        backtestResults: {
          winRate: 0.52 + Math.random() * 0.12,
          avgReturn: 0.06 + Math.random() * 0.14,
          maxDrawdown: 0.18 + Math.random() * 0.12,
          profitFactor: 1.1 + Math.random() * 0.9
        },
        realTimeFactors: {
          lineMovement: (Math.random() - 0.5) * 1.5,
          publicBetting: Math.random(),
          sharpMoney: Math.random() > 0.8,
          weatherImpact: Math.random() * 0.05,
          injuryImpact: Math.random() * 0.1
        }
      });
    }
    
    return predictions;
  };

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      console.log('🔄 Refreshing all data sources...');
      await realDataSourceManager.refreshAllSources();
      
      const updatedSources = realDataSourceManager.getAllSources();
      setSources(updatedSources);
      setDataQuality(realDataSourceManager.getOverallDataQuality());
      setLastUpdate(new Date());
      
      // Regenerate predictions with fresh data
      await generateAllPredictions();
      
      console.log('✅ Data refresh completed');
    } catch (error) {
      console.error('❌ Failed to refresh data:', error);
    } finally {
      setLoading(false);
    }
  }, [generateAllPredictions]);

  const getPredictionsForSport = useCallback((sport: string): EnhancedPrediction[] => {
    return predictions.get(sport) || [];
  }, [predictions]);

  const getAllPredictions = useCallback((): EnhancedPrediction[] => {
    const allPredictions: EnhancedPrediction[] = [];
    predictions.forEach(sportPredictions => {
      allPredictions.push(...sportPredictions);
    });
    return allPredictions.sort((a, b) => (b.expectedValue * b.confidence) - (a.expectedValue * a.confidence));
  }, [predictions]);

  const getTopPredictions = useCallback((count: number = 10): EnhancedPrediction[] => {
    return getAllPredictions().slice(0, count);
  }, [getAllPredictions]);

  const getSourceMetrics = useCallback(() => {
    return realDataSourceManager.getDataSourceMetrics();
  }, []);

  const getConnectedSourcesCount = useCallback((): number => {
    return realDataSourceManager.getConnectedSources().length;
  }, []);

  const getTotalSourcesCount = useCallback((): number => {
    return sources.size;
  }, [sources]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        refreshData();
      }
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, [loading, refreshData]);

  // Initialize on mount
  useEffect(() => {
    initializeData();
  }, [initializeData]);

  return {
    sources,
    predictions,
    loading,
    connectionStatus,
    dataQuality,
    lastUpdate,
    refreshData,
    getPredictionsForSport,
    getAllPredictions,
    getTopPredictions,
    getSourceMetrics,
    connectedSourcesCount: getConnectedSourcesCount(),
    totalSourcesCount: getTotalSourcesCount(),
    reliability: realDataSourceManager.getSourceReliability()
  };
}

// Helper functions
function getTeamsForSport(sport: string): string[] {
  const teams = {
    'NBA': ['LAL', 'BOS', 'GSW', 'MIL', 'PHI', 'DAL'],
    'NFL': ['BUF', 'KC', 'SF', 'LAR', 'NE', 'MIA'],
    'MLB': ['LAD', 'NYY', 'HOU', 'ATL', 'NYM', 'PHI'],
    'NHL': ['EDM', 'COL', 'TOR', 'BOS', 'NYR', 'TB']
  };
  return teams[sport] || ['Team1', 'Team2'];
}

function getPlayersForSport(sport: string): any[] {
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
    ],
    'MLB': [
      { name: 'Mike Trout', team: 'LAA' },
      { name: 'Mookie Betts', team: 'LAD' },
      { name: 'Aaron Judge', team: 'NYY' }
    ],
    'NHL': [
      { name: 'Connor McDavid', team: 'EDM' },
      { name: 'Leon Draisaitl', team: 'EDM' },
      { name: 'Nathan MacKinnon', team: 'COL' }
    ]
  };
  return players[sport] || [{ name: 'Demo Player', team: 'DEMO' }];
}

function getStatTypesForSport(sport: string): string[] {
  const stats = {
    'NBA': ['Points', 'Rebounds', 'Assists'],
    'NFL': ['Passing Yards', 'Rushing Yards', 'Receptions'],
    'MLB': ['Hits', 'RBIs', 'Runs'],
    'NHL': ['Goals', 'Assists', 'Shots']
  };
  return stats[sport] || ['Points'];
}

function getBaseStatValue(sport: string, statType: string): number {
  const values = {
    'NBA': { 'Points': 20, 'Rebounds': 8, 'Assists': 5 },
    'NFL': { 'Passing Yards': 250, 'Rushing Yards': 80, 'Receptions': 5 },
    'MLB': { 'Hits': 1.2, 'RBIs': 1, 'Runs': 0.8 },
    'NHL': { 'Goals': 0.8, 'Assists': 1.2, 'Shots': 3.5 }
  };
  return values[sport]?.[statType] || 10;
}