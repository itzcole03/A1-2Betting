import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, XCircle, AlertTriangle, Activity, TrendingUp, Database, Wifi } from 'lucide-react';
import { enhancedDataSourceManager, EnhancedDataSource } from '../../services/enhancedDataSources';

export function DataSourcesPanel() {
  const [sources, setSources] = useState<Map<string, EnhancedDataSource>>(new Map());
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<any>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadDataSources();
    const interval = setInterval(updateMetrics, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadDataSources = async () => {
    setLoading(true);
    try {
      const sourcesMap = await enhancedDataSourceManager.initializeAllSources();
      setSources(sourcesMap);
      updateMetrics();
    } catch (error) {
      console.error('Error loading data sources:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateMetrics = () => {
    const newMetrics = enhancedDataSourceManager.getDataSourceMetrics();
    setMetrics(newMetrics);
  };

  const refreshAllSources = async () => {
    setLoading(true);
    await enhancedDataSourceManager.refreshAllSources();
    setSources(enhancedDataSourceManager.getAllSources());
    updateMetrics();
    setLoading(false);
  };

  const refreshSource = async (sourceId: string) => {
    await enhancedDataSourceManager.refreshSource(sourceId);
    setSources(enhancedDataSourceManager.getAllSources());
    updateMetrics();
  };

  const getStatusIcon = (source: EnhancedDataSource) => {
    if (source.rateLimited) return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    if (source.connected) return <CheckCircle className="w-4 h-4 text-green-500" />;
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 0.9) return 'text-green-600';
    if (quality >= 0.7) return 'text-yellow-600';
    if (quality >= 0.5) return 'text-orange-600';
    return 'text-red-600';
  };

  const getReliabilityColor = (reliability: number) => {
    if (reliability >= 0.95) return 'text-green-600';
    if (reliability >= 0.85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredSources = Array.from(sources.values()).filter(source => 
    selectedCategory === 'all' || source.category === selectedCategory
  );

  const categories = ['all', 'sports', 'financial', 'news', 'social', 'betting', 'weather', 'analytics'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Database className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold dark:text-white">Enhanced Data Sources</h3>
        </div>
        <button
          onClick={refreshAllSources}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh All</span>
        </button>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl">
          <div className="flex items-center space-x-2 mb-2">
            <Wifi className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">Connected</span>
          </div>
          <div className="text-2xl font-bold text-green-800 dark:text-green-200">
            {metrics.connected || 0}/{metrics.total || 0}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Quality</span>
          </div>
          <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
            {((metrics.averageQuality || 0) * 100).toFixed(1)}%
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-xl">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Reliability</span>
          </div>
          <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">
            {((metrics.averageReliability || 0) * 100).toFixed(1)}%
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-4 rounded-xl">
          <div className="flex items-center space-x-2 mb-2">
            <RefreshCw className="w-5 h-5 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Last Update</span>
          </div>
          <div className="text-sm font-bold text-yellow-800 dark:text-yellow-200">
            {metrics.lastUpdate ? new Date(metrics.lastUpdate).toLocaleTimeString() : 'Never'}
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
            {category !== 'all' && (
              <span className="ml-1 text-xs">
                ({metrics.byCategory?.[category] || 0})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Sources List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredSources.map(source => (
          <div
            key={source.id}
            className={`p-4 rounded-lg border-2 transition-all ${
              source.connected
                ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                : source.rateLimited
                ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20'
                : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                {getStatusIcon(source)}
                <div>
                  <h4 className="font-semibold dark:text-white">{source.name}</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="capitalize">{source.category}</span>
                    {source.premium && (
                      <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-xs font-medium">
                        Premium
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => refreshSource(source.id)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {source.connected ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Quality:</span>
                  <div className={`font-semibold ${getQualityColor(source.quality)}`}>
                    {(source.quality * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Reliability:</span>
                  <div className={`font-semibold ${getReliabilityColor(source.reliability)}`}>
                    {(source.reliability * 100).toFixed(1)}%
                  </div>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Update Freq:</span>
                  <div className="font-semibold dark:text-white">
                    {source.updateFrequency}m
                  </div>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Last Update:</span>
                  <div className="font-semibold dark:text-white">
                    {source.lastUpdate?.toLocaleTimeString() || 'Never'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm">
                <div className="text-red-600 dark:text-red-400 font-medium mb-1">
                  {source.rateLimited ? '⏱️ Rate Limited' : '❌ Connection Failed'}
                </div>
                {source.error && (
                  <div className="text-gray-600 dark:text-gray-400 text-xs">
                    {source.error}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredSources.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No data sources found for the selected category.
        </div>
      )}
    </div>
  );
}