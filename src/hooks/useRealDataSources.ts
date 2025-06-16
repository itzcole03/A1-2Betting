import { useState, useEffect, useCallback } from 'react';
import { realDataService, RealDataSource } from '../services/realDataService';
import { dataProcessor, ProcessedGame, ProcessedPlayer } from '../services/dataProcessor';

export function useRealDataSources() {
  const [dataSources, setDataSources] = useState<Map<string, RealDataSource>>(new Map());
  const [games, setGames] = useState<ProcessedGame[]>([]);
  const [players, setPlayers] = useState<ProcessedPlayer[]>([]);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [dataQuality, setDataQuality] = useState(0);

  const connectToSources = useCallback(async () => {
    setLoading(true);
    setConnectionStatus('Connecting to real data sources...');

    try {
      const sources = await realDataService.connectToAllSources();
      setDataSources(sources);

      const connectedSources = realDataService.getConnectedSources();
      const quality = realDataService.getDataQuality();
      
      setDataQuality(quality);
      setConnectionStatus(`Connected to ${connectedSources.length} real data sources`);

      // Process the data
      const processedGames = dataProcessor.processGames(sources);
      const processedPlayers = dataProcessor.processPlayers(sources);
      
      setGames(processedGames);
      setPlayers(processedPlayers);

      console.log('Real data connection results:', {
        connectedSources: connectedSources.length,
        totalSources: sources.size,
        games: processedGames.length,
        players: processedPlayers.length,
        quality: quality
      });

    } catch (error) {
      console.error('Error connecting to real data sources:', error);
      setConnectionStatus('Connection failed - using fallback data');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    await connectToSources();
  }, [connectToSources]);

  useEffect(() => {
    connectToSources();
  }, [connectToSources]);

  return {
    dataSources,
    games,
    players,
    loading,
    connectionStatus,
    dataQuality,
    refreshData,
    connectedSourcesCount: realDataService.getConnectedSources().length
  };
}