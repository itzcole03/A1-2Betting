import React from 'react';

const patternData = [
  { name: 'Seasonal Trends', strength: 0.92, patterns: ['home_advantage', 'back_to_back', 'rest_advantage'] },
  { name: 'Player Performance', strength: 0.89, patterns: ['form_cycles', 'matchup_advantages', 'usage_rates'] },
  { name: 'Team Dynamics', strength: 0.87, patterns: ['pace_correlation', 'defensive_ratings', 'offensive_efficiency'] },
  { name: 'Market Inefficiencies', strength: 0.83, patterns: ['line_movement', 'public_bias', 'sharp_action'] },
];

export function PatternStrengthMetrics() {
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
      <h3 className="font-bold text-lg mb-4 dark:text-white">Pattern Recognition Strength</h3>
      <div className="space-y-4">
        {patternData.map((pattern, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium dark:text-white capitalize">
                  {pattern.name}
                </span>
                <span className="text-sm font-bold dark:text-white">
                  {(pattern.strength * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${pattern.strength * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {pattern.patterns.join(', ')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}