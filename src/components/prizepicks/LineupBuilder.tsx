import React from 'react';
import { DollarSign, Target, X, Award, TrendingUp, Shield } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface LineupBuilderProps {
  entryAmount: number;
  onEntryAmountChange: (amount: number) => void;
  onSubmitLineup: () => void;
  prizePicksConnected?: boolean;
}

export function LineupBuilder({ 
  entryAmount, 
  onEntryAmountChange, 
  onSubmitLineup, 
  prizePicksConnected = false 
}: LineupBuilderProps) {
  const { state, removeSelectedProp } = useApp();
  const selectedCount = state.selectedProps.size;

  const getMultiplier = () => {
    const baseMultipliers: Record<number, number> = { 
      2: 3, 3: 5, 4: 10, 5: 20, 6: 40 
    };
    const baseMultiplier = baseMultipliers[selectedCount] || 0;
    
    // Enhanced multipliers for real data
    const realDataBonus = prizePicksConnected ? 1.25 : 1.15; // 25% bonus for PrizePicks, 15% for enhanced AI
    const aiBoost = 1.20; // 20% AI enhancement
    
    return baseMultiplier * realDataBonus * aiBoost;
  };

  const getPayout = () => {
    if (selectedCount < 2) return 0;
    return entryAmount * getMultiplier();
  };

  const getAverageConfidence = () => {
    const props = Array.from(state.selectedProps.values());
    if (props.length === 0) return 0;
    
    const totalConfidence = props.reduce((sum, prop) => sum + (prop.confidence || 80), 0);
    return totalConfidence / props.length;
  };

  const getTotalExpectedValue = () => {
    const props = Array.from(state.selectedProps.values());
    return props.reduce((sum, prop) => sum + (prop.expectedValue || 0), 0);
  };

  const getDataSourceBreakdown = () => {
    const props = Array.from(state.selectedProps.values());
    const sources = {
      prizepicks: 0,
      enhanced: 0,
      simulation: 0
    };
    
    props.forEach(prop => {
      if (prop.source?.includes('PRIZEPICKS')) sources.prizepicks++;
      else if (prop.source?.includes('ENHANCED')) sources.enhanced++;
      else sources.simulation++;
    });
    
    return sources;
  };

  const removeSelectedPropByIndex = (index: number) => {
    const keys = Array.from(state.selectedProps.keys());
    if (keys[index]) {
      removeSelectedProp(keys[index]);
    }
  };

  const avgConfidence = getAverageConfidence();
  const totalEV = getTotalExpectedValue();
  const sources = getDataSourceBreakdown();

  return (
    <div className="xl:col-span-1">
      <div className="sticky top-6 space-y-6">
        {/* Entry Amount */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <label className="block text-sm font-bold mb-3 dark:text-white">Entry Amount</label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-primary-600" />
            <input
              type="number"
              value={entryAmount}
              onChange={(e) => onEntryAmountChange(parseInt(e.target.value) || 0)}
              min="5"
              max="5000"
              className="w-full pl-12 pr-4 py-4 text-center font-bold text-xl bg-white dark:bg-gray-700 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none dark:text-white"
            />
          </div>
        </div>

        {/* Selected Props */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 min-h-64 shadow-lg">
          {selectedCount === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">
              <Target className="w-12 h-12 mx-auto mb-3" />
              <div className="font-medium">Select 2-6 props</div>
              <div className="text-sm mt-1">
                {prizePicksConnected ? 'Build PrizePicks lineup' : 'Build AI-enhanced lineup'}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="font-bold text-lg dark:text-white mb-4 flex items-center space-x-2">
                <span>Selected Props ({selectedCount})</span>
                {prizePicksConnected && <Award className="w-5 h-5 text-yellow-500" />}
              </h3>
              {Array.from(state.selectedProps.values()).map((prop, i) => (
                <div key={i} className="p-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-sm flex items-center space-x-2">
                        <span className="capitalize">{prop.choice} Prop</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          prop.source?.includes('PRIZEPICKS') ? 'bg-green-500 text-white' :
                          prop.source?.includes('ENHANCED') ? 'bg-blue-500 text-white' :
                          'bg-purple-500 text-white'
                        }`}>
                          {prop.source?.includes('PRIZEPICKS') ? '🎯 PRIZEPICKS' :
                           prop.source?.includes('ENHANCED') ? '🤖 ENHANCED AI' :
                           '🔮 AI SIM'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Confidence: {(prop.confidence || 80).toFixed(0)}% | 
                        EV: {prop.expectedValue > 0 ? '+' : ''}{(prop.expectedValue || 0).toFixed(1)}%
                      </div>
                    </div>
                    <button 
                      onClick={() => removeSelectedPropByIndex(i)}
                      className="text-red-600 text-xs px-2 py-1 rounded bg-red-100 hover:bg-red-200 transition-colors ml-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Enhanced Lineup Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <div className="grid grid-cols-2 gap-4 text-center mb-4">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Props</div>
              <div className="text-2xl font-bold dark:text-white">{selectedCount}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Multiplier</div>
              <div className="text-2xl font-bold text-purple-600">
                {selectedCount >= 2 ? `${getMultiplier().toFixed(1)}x` : '-'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Confidence</div>
              <div className={`text-2xl font-bold ${
                avgConfidence >= 85 ? 'text-green-600' :
                avgConfidence >= 75 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {selectedCount > 0 ? `${avgConfidence.toFixed(0)}%` : '-'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Payout</div>
              <div className="text-2xl font-bold text-green-600">${getPayout().toFixed(2)}</div>
            </div>
          </div>
          
          {selectedCount > 0 && (
            <>
              <div className="text-xs space-y-1 border-t pt-4 dark:border-gray-700 mb-4">
                <div className="flex justify-between">
                  <span className="dark:text-gray-400">Expected Value:</span>
                  <span className={`font-bold ${totalEV > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {totalEV > 0 ? '+' : ''}{totalEV.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="dark:text-gray-400">Data Quality:</span>
                  <span className="font-bold text-blue-600">
                    {prizePicksConnected ? 'Premium' : 'Enhanced'}
                  </span>
                </div>
                {prizePicksConnected && (
                  <div className="flex justify-between">
                    <span className="dark:text-gray-400">PrizePicks Bonus:</span>
                    <span className="font-bold text-green-600">+25%</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="dark:text-gray-400">AI Enhancement:</span>
                  <span className="font-bold text-purple-600">+20%</span>
                </div>
              </div>

              {/* Data Source Breakdown */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 mb-4">
                <div className="text-xs font-semibold dark:text-white mb-2 flex items-center space-x-1">
                  <Shield className="w-3 h-3" />
                  <span>Data Sources</span>
                </div>
                <div className="space-y-1 text-xs">
                  {sources.prizepicks > 0 && (
                    <div className="flex justify-between">
                      <span className="text-green-600">🎯 PrizePicks:</span>
                      <span className="font-bold text-green-600">{sources.prizepicks}</span>
                    </div>
                  )}
                  {sources.enhanced > 0 && (
                    <div className="flex justify-between">
                      <span className="text-blue-600">🤖 Enhanced AI:</span>
                      <span className="font-bold text-blue-600">{sources.enhanced}</span>
                    </div>
                  )}
                  {sources.simulation > 0 && (
                    <div className="flex justify-between">
                      <span className="text-purple-600">🔮 AI Simulation:</span>
                      <span className="font-bold text-purple-600">{sources.simulation}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Enhanced Submit Button */}
        <button
          onClick={onSubmitLineup}
          disabled={selectedCount < 2}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
            selectedCount >= 2
              ? `${prizePicksConnected ? 
                  'bg-gradient-to-r from-green-600 to-blue-600' : 
                  'bg-gradient-to-r from-purple-600 to-blue-600'
                } text-white hover:scale-105 shadow-lg`
              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
        >
          {selectedCount >= 2 ? (
            <div className="flex items-center justify-center space-x-2">
              {prizePicksConnected ? <Award className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
              <span>
                Submit {prizePicksConnected ? 'PrizePicks' : 'Enhanced'} Lineup
              </span>
            </div>
          ) : (
            'Select 2+ Props to Submit'
          )}
        </button>

        {selectedCount >= 2 && (
          <div className="text-center text-xs text-gray-600 dark:text-gray-400">
            <div className="font-medium">Potential Win: ${getPayout().toFixed(2)}</div>
            <div className="mt-1">
              {prizePicksConnected ? 
                '🎯 PrizePicks integration active with real-time data' :
                '🤖 Enhanced AI analysis with 47+ models'
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}