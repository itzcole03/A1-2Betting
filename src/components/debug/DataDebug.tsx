import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Wifi, WifiOff, AlertTriangle, CheckCircle, RefreshCw, Database, Activity } from 'lucide-react';
import { useRealTimeData } from '../../hooks/useRealTimeData';
import { useEnhancedRealDataSources } from '../../hooks/useEnhancedRealDataSources';

export function DataDebug() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  const {
    sources: realTimeSources,
    connectionStatus,
    dataQuality,
    reliability,
    lastUpdate,
    connectedSourcesCount,
    totalSourcesCount
  } = useRealTimeData();

  const {
    dataSources: enhancedSources,
    connectedSourcesCount: enhancedConnectedCount,
    totalSourcesCount: enhancedTotalCount,
    dataQuality: enhancedQuality,
    dataReliability: enhancedReliability,
    getDataSourceMetrics
  } = useEnhancedRealDataSources();

  const metrics = getDataSourceMetrics();

  // Check environment variables
  const envStatus = {
    VITE_ODDS_API_KEY: !!import.meta.env.VITE_ODDS_API_KEY,
    VITE_SPORTRADAR_API_KEY: !!import.meta.env.VITE_SPORTRADAR_API_KEY,
    VITE_SPORTRADAR_DAILYFANTASY_KEY: !!import.meta.env.VITE_SPORTRADAR_DAILYFANTASY_KEY,
    VITE_DATA_API_KEY_PRIMARY: !!import.meta.env.VITE_DATA_API_KEY_PRIMARY,
    VITE_PROP_PROVIDER_KEY: !!import.meta.env.VITE_PROP_PROVIDER_KEY,
    VITE_ESPN_API_KEY: !!import.meta.env.VITE_ESPN_API_KEY,
    VITE_WEATHER_API_KEY: !!import.meta.env.VITE_WEATHER_API_KEY
  };

  const missingKeys = Object.entries(envStatus).filter(([key, value]) => !value).map(([key]) => key);
  const hasAllKeys = missingKeys.length === 0;

  // Log warnings for missing keys
  React.useEffect(() => {
    if (missingKeys.length > 0) {
      console.warn('🔑 Missing API Keys:', missingKeys);
      console.warn('📝 Add these keys to your .env file for full functionality');
    }
  }, [missingKeys.length]);

  const getStatusColor = (connected: boolean) => connected ? 'text-green-500' : 'text-red-500';
  const getStatusIcon = (connected: boolean) => connected ? CheckCircle : WifiOff;

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsExpanded(true)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg shadow-lg transition-all ${
            hasAllKeys && connectedSourcesCount > 0 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-yellow-600 hover:bg-yellow-700'
          } text-white`}
        >
          <Database className="w-4 h-4" />
          <span className="text-sm font-medium">
            Data: {connectedSourcesCount + enhancedConnectedCount}/{totalSourcesCount + enhancedTotalCount}
          </span>
          <ChevronUp className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Data Debug Panel</h3>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'sources', label: 'Sources' },
          { id: 'env', label: 'Config' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 max-h-64 overflow-y-auto">
        {activeTab === 'overview' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded">
                <div className="text-gray-600 dark:text-gray-400">Total Sources</div>
                <div className="font-bold text-lg">
                  {connectedSourcesCount + enhancedConnectedCount}/{totalSourcesCount + enhancedTotalCount}
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded">
                <div className="text-gray-600 dark:text-gray-400">Data Quality</div>
                <div className="font-bold text-lg text-green-600">
                  {((dataQuality + enhancedQuality) / 2 * 100).toFixed(1)}%
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded">
                <div className="text-gray-600 dark:text-gray-400">Reliability</div>
                <div className="font-bold text-lg text-blue-600">
                  {((reliability + enhancedReliability) / 2 * 100).toFixed(1)}%
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded">
                <div className="text-gray-600 dark:text-gray-400">Last Update</div>
                <div className="font-bold text-sm">
                  {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Never'}
                </div>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Real-Time Engine:</span>
                <div className={`flex items-center space-x-1 ${getStatusColor(connectedSourcesCount > 0)}`}>
                  {React.createElement(getStatusIcon(connectedSourcesCount > 0), { className: "w-4 h-4" })}
                  <span className="text-sm font-medium">
                    {connectedSourcesCount > 0 ? 'Active' : 'Offline'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Enhanced Sources:</span>
                <div className={`flex items-center space-x-1 ${getStatusColor(enhancedConnectedCount > 0)}`}>
                  {React.createElement(getStatusIcon(enhancedConnectedCount > 0), { className: "w-4 h-4" })}
                  <span className="text-sm font-medium">
                    {enhancedConnectedCount > 0 ? 'Active' : 'Offline'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">API Keys:</span>
                <div className={`flex items-center space-x-1 ${getStatusColor(hasAllKeys)}`}>
                  {React.createElement(hasAllKeys ? CheckCircle : AlertTriangle, { className: "w-4 h-4" })}
                  <span className="text-sm font-medium">
                    {Object.keys(envStatus).length - missingKeys.length}/{Object.keys(envStatus).length}
                  </span>
                </div>
              </div>
            </div>

            {!hasAllKeys && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-2">
                <div className="text-yellow-800 dark:text-yellow-200 text-xs">
                  ⚠️ Missing {missingKeys.length} API key(s). Check console for details.
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'sources' && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Data Sources ({connectedSourcesCount + enhancedConnectedCount} connected)
            </div>
            
            {/* Real-Time Sources */}
            {Array.from(realTimeSources.values()).slice(0, 5).map((source, index) => (
              <div key={index} className="flex items-center justify-between py-1">
                <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {source.name || `Source ${index + 1}`}
                </span>
                <div className={`flex items-center space-x-1 ${getStatusColor(source.connected)}`}>
                  {React.createElement(getStatusIcon(source.connected), { className: "w-3 h-3" })}
                  <span className="text-xs">
                    {source.connected ? 'OK' : 'Failed'}
                  </span>
                </div>
              </div>
            ))}

            {/* Enhanced Sources */}
            {Array.from(enhancedSources.values()).slice(0, 5).map((source, index) => (
              <div key={`enhanced_${index}`} className="flex items-center justify-between py-1">
                <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {source.name}
                </span>
                <div className={`flex items-center space-x-1 ${getStatusColor(source.connected)}`}>
                  {React.createElement(getStatusIcon(source.connected), { className: "w-3 h-3" })}
                  <span className="text-xs">
                    {source.connected ? `${(source.quality * 100).toFixed(0)}%` : 'Failed'}
                  </span>
                </div>
              </div>
            ))}

            {(connectedSourcesCount + enhancedConnectedCount) === 0 && (
              <div className="text-center py-4">
                <WifiOff className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  No data sources connected
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'env' && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Environment Configuration
            </div>
            
            {Object.entries(envStatus).map(([key, hasValue]) => (
              <div key={key} className="flex items-center justify-between py-1">
                <span className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                  {key.replace('VITE_', '')}
                </span>
                <div className={`flex items-center space-x-1 ${getStatusColor(hasValue)}`}>
                  {React.createElement(hasValue ? CheckCircle : AlertTriangle, { className: "w-3 h-3" })}
                  <span className="text-xs">
                    {hasValue ? 'Set' : 'Missing'}
                  </span>
                </div>
              </div>
            ))}

            {missingKeys.length > 0 && (
              <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                <div className="text-red-800 dark:text-red-200 text-xs">
                  Add missing keys to .env file for full functionality
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}