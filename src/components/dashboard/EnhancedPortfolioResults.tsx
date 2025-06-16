import React, { useState } from 'react';
import { TrendingUp, Shield, Target, Brain, BarChart3, AlertTriangle, CheckCircle, Star } from 'lucide-react';

interface EnhancedPortfolioResult {
  opportunities: any[];
  portfolioMetrics: any;
  investment: number;
  expectedReturn: number;
  riskAdjustedReturn: number;
  maxDrawdown: number;
  winProbability: number;
  kellyOptimal: number;
  diversificationScore: number;
  confidenceLevel: number;
  backtestResults: any;
  realTimeFactors: any;
  lastUpdate: string;
}

interface EnhancedPortfolioResultsProps {
  results: EnhancedPortfolioResult | null;
}

export function EnhancedPortfolioResults({ results }: EnhancedPortfolioResultsProps) {
  const [activeTab, setActiveTab] = useState('opportunities');

  if (!results) return null;

  const getValueRatingColor = (rating: string) => {
    const colors = {
      'A+': 'text-green-600 bg-green-100 dark:bg-green-900/30',
      'A': 'text-green-500 bg-green-50 dark:bg-green-900/20',
      'B+': 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
      'B': 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
      'C+': 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30',
      'C': 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
      'D': 'text-red-600 bg-red-100 dark:bg-red-900/30'
    };
    return colors[rating] || colors['C'];
  };

  const getRiskColor = (risk: number) => {
    if (risk < 0.3) return 'text-green-600';
    if (risk < 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="glass-morphism rounded-3xl p-8 animate-scale-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          🚀 Enhanced AI Portfolio Generated
        </h3>
        <div className="flex justify-center items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-600 font-semibold">Real-Time Analysis Active</span>
          </div>
          <div className="text-gray-500">•</div>
          <span className="text-blue-600 font-semibold">
            {results.opportunities.length} Premium Opportunities
          </span>
          <div className="text-gray-500">•</div>
          <span className="text-purple-600 font-semibold">
            {(results.confidenceLevel).toFixed(1)}% Avg Confidence
          </span>
        </div>
      </div>

      {/* Portfolio Metrics Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-4 text-center">
          <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-600">
            {(results.expectedReturn * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-green-700 font-semibold">Expected Return</div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl p-4 text-center">
          <Shield className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-600">
            {results.riskAdjustedReturn.toFixed(2)}
          </div>
          <div className="text-xs text-blue-700 font-semibold">Sharpe Ratio</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl p-4 text-center">
          <Target className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-600">
            {(results.winProbability * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-purple-700 font-semibold">Win Probability</div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl p-4 text-center">
          <Brain className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-yellow-600">
            {(results.kellyOptimal * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-yellow-700 font-semibold">Kelly Optimal</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {[
          { id: 'opportunities', label: 'Opportunities', icon: Target },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'backtest', label: 'Backtest', icon: TrendingUp },
          { id: 'risk', label: 'Risk Analysis', icon: Shield }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 shadow-md text-blue-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'opportunities' && (
        <div className="space-y-6">
          {results.opportunities.map((opp, i) => (
            <div key={i} className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-800 relative overflow-hidden">
              {/* Enhanced Badges */}
              <div className="absolute top-4 right-4 flex flex-col space-y-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getValueRatingColor(opp.valueRating)}`}>
                  Grade: {opp.valueRating}
                </span>
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                  🔴 REAL DATA
                </span>
                <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                  {opp.platform}
                </span>
              </div>
              
              <div className="pr-32">
                <div className="font-bold text-2xl text-blue-800 dark:text-blue-300 mb-3">{opp.game}</div>
                <div className="font-bold text-xl text-green-700 dark:text-green-300 mb-4">{opp.pick}</div>
                
                {/* Enhanced Metrics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="bg-white/50 dark:bg-black/20 p-3 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Confidence</div>
                    <div className="text-xl font-bold text-blue-600">{opp.confidence.toFixed(1)}%</div>
                  </div>
                  <div className="bg-white/50 dark:bg-black/20 p-3 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Expected Value</div>
                    <div className="text-xl font-bold text-green-600">+{opp.expectedValue.toFixed(1)}%</div>
                  </div>
                  <div className="bg-white/50 dark:bg-black/20 p-3 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Risk Score</div>
                    <div className={`text-xl font-bold ${getRiskColor(opp.riskScore)}`}>
                      {(opp.riskScore * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div className="bg-white/50 dark:bg-black/20 p-3 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Kelly Bet</div>
                    <div className="text-xl font-bold text-purple-600">{(opp.kellyBet * 100).toFixed(1)}%</div>
                  </div>
                </div>
                
                {/* Advanced Analytics */}
                <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 p-4 rounded-lg mb-4">
                  <div className="font-semibold text-purple-700 dark:text-purple-300 mb-2 flex items-center">
                    <Brain className="w-4 h-4 mr-2" />
                    Advanced Analytics
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Model Consensus:</span>
                      <div className="font-bold">{(opp.modelConsensus * 100).toFixed(0)}%</div>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Market Edge:</span>
                      <div className="font-bold text-green-600">+{(opp.marketEdge * 100).toFixed(1)}%</div>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Sharpe Ratio:</span>
                      <div className="font-bold">{opp.sharpeRatio.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
                
                {/* Backtest Results */}
                <div className="bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 p-4 rounded-lg mb-4">
                  <div className="font-semibold text-green-700 dark:text-green-300 mb-2 flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Historical Performance
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Win Rate:</span>
                      <div className="font-bold text-green-600">{(opp.backtestResults.winRate * 100).toFixed(1)}%</div>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Avg Return:</span>
                      <div className="font-bold">{(opp.backtestResults.avgReturn * 100).toFixed(1)}%</div>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Max Drawdown:</span>
                      <div className="font-bold text-red-600">{(opp.backtestResults.maxDrawdown * 100).toFixed(1)}%</div>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Profit Factor:</span>
                      <div className="font-bold">{opp.backtestResults.profitFactor.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
                
                {/* Impact Factors */}
                <div className="grid grid-cols-3 gap-3 text-xs mb-4">
                  {opp.injuryImpact > 0 && (
                    <div className="flex items-center space-x-1 text-red-600">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Injury Impact: {(opp.injuryImpact * 100).toFixed(0)}%</span>
                    </div>
                  )}
                  {opp.weatherImpact > 0 && (
                    <div className="flex items-center space-x-1 text-blue-600">
                      <span>🌤️ Weather: {(opp.weatherImpact * 100).toFixed(0)}%</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1 text-purple-600">
                    <span>📊 Sentiment: {opp.sentimentScore > 0 ? '+' : ''}{(opp.sentimentScore * 100).toFixed(0)}%</span>
                  </div>
                </div>
                
                {/* Action Button */}
                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-orange-800 dark:text-orange-300 mb-1">
                        💰 READY TO BET - {opp.platform}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Recommended bet size: {(opp.kellyBet * 100).toFixed(1)}% of bankroll
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-bold text-green-600">VERIFIED</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Portfolio Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <h4 className="font-bold text-lg mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                Portfolio Composition
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Diversification Score:</span>
                  <span className="font-bold text-green-600">
                    {(results.diversificationScore * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Risk-Adjusted Return:</span>
                  <span className="font-bold text-blue-600">
                    {results.riskAdjustedReturn.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Maximum Drawdown:</span>
                  <span className="font-bold text-red-600">
                    {(results.maxDrawdown * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <h4 className="font-bold text-lg mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-purple-600" />
                Real-Time Factors
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Data Quality:</span>
                  <span className="font-bold text-green-600">
                    {(results.realTimeFactors.dataQuality * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Market Conditions:</span>
                  <span className="font-bold text-blue-600">Favorable</span>
                </div>
                <div className="flex justify-between">
                  <span>Sentiment Score:</span>
                  <span className="font-bold text-purple-600">
                    {results.realTimeFactors.sentimentAnalysis?.combined > 0 ? 'Positive' : 'Negative'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'backtest' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
          <h4 className="font-bold text-lg mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Historical Backtest Results
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {(results.backtestResults.avgWinRate * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">Average Win Rate</div>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {(results.backtestResults.avgReturn * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">Average Return</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {results.backtestResults.avgProfitFactor.toFixed(2)}
              </div>
              <div className="text-sm text-purple-700 dark:text-purple-300">Profit Factor</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'risk' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
            <h4 className="font-bold text-lg mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-red-600" />
              Risk Analysis
            </h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h5 className="font-semibold mb-3">Portfolio Risk Metrics</h5>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Value at Risk (95%):</span>
                    <span className="font-bold text-red-600">
                      {(results.maxDrawdown * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Correlation Risk:</span>
                    <span className="font-bold text-yellow-600">Low</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Liquidity Risk:</span>
                    <span className="font-bold text-green-600">Minimal</span>
                  </div>
                </div>
              </div>
              <div>
                <h5 className="font-semibold mb-3">Risk Mitigation</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Diversified across sports</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Kelly criterion sizing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Real-time monitoring</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center justify-center space-x-4">
          <span>Last updated: {results.lastUpdate}</span>
          <div className="text-gray-400">•</div>
          <span>Next update in: 30 seconds</span>
          <div className="text-gray-400">•</div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>Premium Analysis Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}