import React, { useState } from 'react';
import { Rocket } from 'lucide-react';
import { HeroSection } from './HeroSection';
import { ConfigurationMatrix } from './ConfigurationMatrix';
import { DataSourcesPanel } from './DataSourcesPanel';
import { LiveGamesDisplay } from './LiveGamesDisplay';
import { RealPlayersDisplay } from './RealPlayersDisplay';
import { RealTimePredictions } from './RealTimePredictions';
import { DataDebug } from '../debug/DataDebug';
import { useRealTimeData } from '../../hooks/useRealTimeData';
import { useEnhancedRealDataSources } from '../../hooks/useEnhancedRealDataSources';
import { useRealDataValidation } from '../../hooks/useRealDataValidation';
import { UltimateAIConfig } from '../../types';
import { LoadingOverlay } from '../common/LoadingOverlay';

export function Dashboard() {
  const [currentConfig, setCurrentConfig] = useState<UltimateAIConfig | null>(null);
  
  // Use real-time data hooks
  const {
    predictions,
    loading: realTimeLoading,
    connectionStatus,
    dataQuality,
    lastUpdate,
    refreshData,
    getAllPredictions,
    getTopPredictions,
    connectedSourcesCount,
    totalSourcesCount,
    reliability
  } = useRealTimeData();

  const {
    games,
    players,
    loading: enhancedLoading,
    connectedSourcesCount: enhancedConnectedCount,
    totalSourcesCount: enhancedTotalCount,
    dataQuality: enhancedDataQuality,
    dataReliability: enhancedReliability
  } = useEnhancedRealDataSources();

  const validation = useRealDataValidation();

  // Combine data from both sources
  const allPredictions = getAllPredictions();
  const topPredictions = getTopPredictions(10);
  const totalConnected = connectedSourcesCount + enhancedConnectedCount;
  const totalSources = totalSourcesCount + enhancedTotalCount;
  const combinedQuality = (dataQuality + enhancedDataQuality) / 2;
  const combinedReliability = (reliability + enhancedReliability) / 2;
  const isLoading = realTimeLoading || enhancedLoading;

  const handleActivateAI = async () => {
    if (!currentConfig) return;

    try {
      console.log('🚀 AI System Activated with real data sources');
      console.log('📊 Connected Sources:', totalConnected);
      console.log('🎯 Available Predictions:', allPredictions.length);
      
      if (!validation.isValid) {
        console.warn('⚠️ Some API keys are missing - functionality may be limited');
      }
      
      // Refresh data to get latest predictions
      await refreshData();
    } catch (error) {
      console.error('Error activating AI system:', error);
    }
  };

  return (
    <div className="space-y-8">
      <LoadingOverlay 
        isVisible={isLoading}
        title="Connecting to Real-Time Data Sources"
        subtitle={`Establishing connections to ${totalSources} live data sources...`}
      />
      
      <HeroSection 
        connectedSources={totalConnected}
        totalSources={totalSources}
        gamesCount={games.length}
        playersCount={players.length}
        dataQuality={combinedQuality}
        dataReliability={combinedReliability}
      />
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <DataSourcesPanel />
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold mb-4 dark:text-white">Real-Time System Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Connection Status:</span>
                <span className="font-medium dark:text-white">{connectionStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Data Quality:</span>
                <span className="font-medium text-green-600">{(combinedQuality * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Data Reliability:</span>
                <span className="font-medium text-blue-600">{(combinedReliability * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Active Predictions:</span>
                <span className="font-medium text-purple-600">{allPredictions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Data Sources:</span>
                <span className="font-medium text-yellow-600">{totalConnected}/{totalSources}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Last Update:</span>
                <span className="font-medium text-indigo-600">
                  {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Never'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">API Status:</span>
                <span className={`font-medium ${validation.isValid ? 'text-green-600' : 'text-yellow-600'}`}>
                  {validation.isValid ? 'All Keys Valid' : `${validation.missingKeys.length} Missing`}
                </span>
              </div>
            </div>
          </div>

          {/* Validation Warnings */}
          {!validation.isValid && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                ⚠️ Configuration Issues
              </h4>
              <div className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
                {validation.warnings.map((warning, index) => (
                  <div key={index}>• {warning}</div>
                ))}
              </div>
              <div className="mt-2 text-xs text-yellow-600 dark:text-yellow-400">
                Check the Data Debug panel for details
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{topPredictions.length}</div>
              <div className="text-xs text-green-700 font-semibold">Top Predictions</div>
            </div>
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {topPredictions.length > 0 ? topPredictions[0].confidence.toFixed(0) : 0}%
              </div>
              <div className="text-xs text-blue-700 font-semibold">Best Confidence</div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Data Displays */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <LiveGamesDisplay games={games} />
        <RealPlayersDisplay players={players} />
      </div>

      {/* Real-Time Predictions */}
      <RealTimePredictions predictions={allPredictions} loading={isLoading} />
      
      <ConfigurationMatrix onConfigChange={setCurrentConfig} />
      
      {/* Enhanced Activation Button */}
      <div className="text-center">
        <button
          onClick={handleActivateAI}
          disabled={!currentConfig || isLoading}
          className="ultimate-btn px-20 py-8 rounded-3xl text-white font-black text-2xl relative overflow-hidden transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="relative z-10 flex items-center justify-center space-x-4">
            <Rocket className="w-8 h-8" />
            <span>ACTIVATE REAL-TIME AI SYSTEM</span>
            <Rocket className="w-8 h-8" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 opacity-0 hover:opacity-20 transition-opacity"></div>
        </button>
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          🚀 Real API Integration • 🔴 Live Data Feeds • 📊 Advanced ML Models • 🎯 Kelly Optimization • 🛡️ Risk Management
        </div>
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
          Connected to {totalConnected} live data sources with {(combinedQuality * 100).toFixed(1)}% quality rating
        </div>
        {!validation.isValid && (
          <div className="mt-2 text-xs text-yellow-600 dark:text-yellow-400">
            ⚠️ Some features limited due to missing API keys
          </div>
        )}
      </div>

      {/* Data Debug Panel */}
      <DataDebug />
    </div>
  );
}