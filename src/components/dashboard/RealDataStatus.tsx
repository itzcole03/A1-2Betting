import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { RealDataSource } from '../../services/realDataService';

interface RealDataStatusProps {
  dataSources: Map<string, RealDataSource>;
  dataQuality: number;
}

export function RealDataStatus({ dataSources, dataQuality }: RealDataStatusProps) {
  const sources = Array.from(dataSources.values());
  const connectedCount = sources.filter(s => s.connected).length;

  const getStatusIcon = (connected: boolean) => {
    if (connected) {
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    }
    return <XCircle className="w-4 h-4 text-red-400" />;
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 0.8) return 'text-green-400';
    if (quality >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold dark:text-white">Real Data Sources</h3>
        <div className="flex items-center space-x-2">
          <div className={`text-sm font-semibold ${getQualityColor(dataQuality)}`}>
            Quality: {(dataQuality * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {connectedCount}/{sources.length} Connected
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sources.map((source, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-2 transition-all ${
              source.connected
                ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-sm dark:text-white">{source.name}</span>
              {getStatusIcon(source.connected)}
            </div>
            
            {source.connected ? (
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Quality:</span>
                  <span className={`font-semibold ${getQualityColor(source.quality)}`}>
                    {(source.quality * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Updated:</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {source.lastUpdate?.toLocaleTimeString() || 'Never'}
                  </span>
                </div>
                <div className="text-green-600 dark:text-green-400 font-medium">
                  ✓ Live Data Active
                </div>
              </div>
            ) : (
              <div className="text-xs">
                <div className="text-red-600 dark:text-red-400 font-medium mb-1">
                  ✗ Connection Failed
                </div>
                {source.error && (
                  <div className="text-gray-600 dark:text-gray-400 truncate">
                    {source.error}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {connectedCount === 0 && (
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-800 dark:text-yellow-200 font-medium">
              No real data sources connected. The platform will use enhanced AI simulation.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}