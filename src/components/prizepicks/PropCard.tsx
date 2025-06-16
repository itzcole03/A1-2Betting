import React from 'react';
import { TrendingUp, TrendingDown, Award, Zap, Shield } from 'lucide-react';
import { PlayerProp, TeamColors } from '../../types';

interface PropCardProps {
  prop: PlayerProp;
  onSelect: (propId: string, choice: 'over' | 'under') => void;
  isPrizePicksData?: boolean;
}

export function PropCard({ prop, onSelect, isPrizePicksData = false }: PropCardProps) {
  const teamColors = getTeamColors(prop.team);
  const dataQualityColor = prop.realDataQuality > 0.9 ? 'text-green-400' : 
                          prop.realDataQuality > 0.7 ? 'text-yellow-400' : 'text-red-400';

  const getValueRatingColor = (rating: string) => {
    if (rating?.startsWith('A')) return 'text-green-400 bg-green-900/30';
    if (rating?.startsWith('B')) return 'text-blue-400 bg-blue-900/30';
    if (rating?.startsWith('C')) return 'text-yellow-400 bg-yellow-900/30';
    return 'text-red-400 bg-red-900/30';
  };

  const getFormTrendIcon = () => {
    const formTrend = prop.aiEnhancement?.formTrend || 0;
    if (formTrend > 0.05) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (formTrend < -0.05) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-400';
    if (confidence >= 80) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className={`prop-card bg-gradient-to-br ${teamColors.gradient} rounded-2xl p-6 text-white shadow-lg relative overflow-hidden border-2 border-white/20 transition-all hover:scale-105 cursor-pointer`}>
      {/* Enhanced Data Badges */}
      <div className="absolute top-3 right-3 flex flex-col space-y-1">
        {isPrizePicksData && (
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center space-x-1">
            <Award className="w-3 h-3" />
            <span>PRIZEPICKS</span>
          </div>
        )}
        <div className={`bg-black/40 px-2 py-1 rounded-full text-xs font-bold ${dataQualityColor}`}>
          Quality: {(prop.realDataQuality * 100).toFixed(0)}%
        </div>
        {prop.aiEnhancement?.valueRating && (
          <div className={`px-2 py-1 rounded-full text-xs font-bold ${getValueRatingColor(prop.aiEnhancement.valueRating)}`}>
            {prop.aiEnhancement.valueRating}
          </div>
        )}
      </div>
      
      {/* Player Info */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center font-bold text-sm">
            {prop.playerName.split(' ').map(n => n[0]).join('')}
          </span>
          <div>
            <h3 className="font-bold text-lg">{prop.playerName}</h3>
            <p className="text-white/80 text-sm">{prop.team} {prop.position}</p>
          </div>
        </div>
      </div>
      
      {/* Enhanced Stat Display */}
      <div className="text-center mb-6 p-4 bg-black/30 rounded-xl backdrop-blur-sm">
        <div className="text-sm font-semibold mb-2 flex items-center justify-center space-x-2">
          <span>{prop.statType}</span>
          {getFormTrendIcon()}
        </div>
        <div className="text-4xl font-black mb-3">{prop.line}</div>
        
        {/* Enhanced Odds with AI Confidence */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => onSelect(prop.id, 'under')}
            className="px-3 py-2 bg-gradient-to-br from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 rounded-lg text-sm font-bold transition-all transform hover:scale-105 shadow-lg"
          >
            <div>Under -110</div>
            <div className={`text-xs mt-1 ${getConfidenceColor(prop.underConfidence)}`}>
              🤖 {prop.underConfidence.toFixed(0)}%
            </div>
          </button>
          <button 
            onClick={() => onSelect(prop.id, 'over')}
            className="px-3 py-2 bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 rounded-lg text-sm font-bold transition-all transform hover:scale-105 shadow-lg"
          >
            <div>Over -110</div>
            <div className={`text-xs mt-1 ${getConfidenceColor(prop.overConfidence)}`}>
              🤖 {prop.overConfidence.toFixed(0)}%
            </div>
          </button>
        </div>
      </div>
      
      {/* Advanced Analytics */}
      <div className="mb-4 p-3 bg-black/20 rounded-xl">
        <div className="text-xs font-semibold text-white mb-2 flex items-center space-x-1">
          <Zap className="w-3 h-3" />
          <span>Advanced Analytics</span>
        </div>
        <div className="text-xs text-white/90 space-y-1">
          <div className="flex justify-between">
            <span>Pattern Strength:</span>
            <span className="font-bold">
              {((prop.patternAnalysis?.overallStrength || 0.8) * 100).toFixed(0)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span>Expected Value:</span>
            <span className={`font-bold ${prop.expectedValue > 0 ? 'text-green-300' : 'text-red-300'}`}>
              {prop.expectedValue > 0 ? '+' : ''}{prop.expectedValue.toFixed(1)}%
            </span>
          </div>
          {prop.aiEnhancement?.kellyOptimal && (
            <div className="flex justify-between">
              <span>Kelly Optimal:</span>
              <span className="font-bold text-blue-300">
                {(prop.aiEnhancement.kellyOptimal * 100).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Factors */}
      <div className="mb-4 p-3 bg-black/20 rounded-xl">
        <div className="text-xs font-semibold text-white mb-2 flex items-center space-x-1">
          <Shield className="w-3 h-3" />
          <span>Key Factors</span>
        </div>
        <div className="text-xs text-white/90 space-y-1">
          {prop.aiEnhancement?.weatherImpact > 0 && (
            <div className="flex items-center space-x-1">
              <span>🌤️</span>
              <span>Weather Impact: {(prop.aiEnhancement.weatherImpact * 100).toFixed(0)}%</span>
            </div>
          )}
          {prop.aiEnhancement?.injuryImpact > 0 && (
            <div className="flex items-center space-x-1">
              <span>🏥</span>
              <span>Injury Risk: {(prop.aiEnhancement.injuryImpact * 100).toFixed(0)}%</span>
            </div>
          )}
          {prop.patternAnalysis?.homeAwayFactor !== 1 && (
            <div className="flex items-center space-x-1">
              <span>{prop.patternAnalysis.homeAwayFactor > 1 ? '🏠' : '✈️'}</span>
              <span>
                {prop.patternAnalysis.homeAwayFactor > 1 ? 'Home' : 'Away'} Advantage
              </span>
            </div>
          )}
          {prop.patternAnalysis?.backToBackPenalty < 1 && (
            <div className="flex items-center space-x-1">
              <span>⏰</span>
              <span>Back-to-Back Game</span>
            </div>
          )}
          {prop.aiEnhancement?.sharpMoney && (
            <div className="flex items-center space-x-1">
              <span>💰</span>
              <span>Sharp Money</span>
            </div>
          )}
          {prop.aiEnhancement?.steamMove && (
            <div className="flex items-center space-x-1">
              <span>🚀</span>
              <span>Steam Move</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Market Intelligence */}
      {(prop.aiEnhancement?.lineMovement || prop.aiEnhancement?.publicBetting) && (
        <div className="mb-4 p-3 bg-black/20 rounded-xl">
          <div className="text-xs font-semibold text-white mb-2">📊 Market Intelligence</div>
          <div className="text-xs text-white/90 space-y-1">
            {prop.aiEnhancement?.lineMovement && (
              <div className="flex justify-between">
                <span>Line Movement:</span>
                <span className={`font-bold ${prop.aiEnhancement.lineMovement > 0 ? 'text-green-300' : 'text-red-300'}`}>
                  {prop.aiEnhancement.lineMovement > 0 ? '+' : ''}{prop.aiEnhancement.lineMovement.toFixed(1)}
                </span>
              </div>
            )}
            {prop.aiEnhancement?.publicBetting && (
              <div className="flex justify-between">
                <span>Public Betting:</span>
                <span className="font-bold">
                  {(prop.aiEnhancement.publicBetting * 100).toFixed(0)}%
                </span>
              </div>
            )}
            {prop.aiEnhancement?.reverseLineMovement && (
              <div className="text-yellow-300 font-bold">⚠️ Reverse Line Movement</div>
            )}
          </div>
        </div>
      )}
      
      {/* Data Source */}
      <div className="flex justify-between items-center text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-lg">📈</span>
          <span>
            {isPrizePicksData ? 'PrizePicks Live' : 'Enhanced AI'}
          </span>
        </div>
        <div className="bg-purple-600/80 px-2 py-1 rounded text-xs font-semibold">
          EV: {prop.expectedValue > 0 ? '+' : ''}{prop.expectedValue.toFixed(1)}%
        </div>
      </div>
      
      {/* Team Glow Effect */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-30 transition-all duration-300 pointer-events-none"
        style={{ boxShadow: `0 0 40px ${teamColors.accent}` }}
      ></div>
    </div>
  );
}

function getTeamColors(team: string): TeamColors {
  const colors: Record<string, TeamColors> = {
    // NBA
    'LAL': { gradient: 'from-purple-600 to-yellow-500', accent: '#FDB927' },
    'BOS': { gradient: 'from-green-600 to-green-800', accent: '#007A33' },
    'GSW': { gradient: 'from-blue-600 to-yellow-500', accent: '#FFC72C' },
    'MIL': { gradient: 'from-green-700 to-green-900', accent: '#00471B' },
    'PHI': { gradient: 'from-blue-600 to-red-600', accent: '#ED174C' },
    'DAL': { gradient: 'from-blue-600 to-blue-800', accent: '#00538C' },
    'PHX': { gradient: 'from-orange-600 to-purple-600', accent: '#E56020' },
    'DEN': { gradient: 'from-blue-600 to-yellow-500', accent: '#0E2240' },
    
    // NFL
    'BUF': { gradient: 'from-blue-600 to-red-600', accent: '#00338D' },
    'KC': { gradient: 'from-red-600 to-yellow-500', accent: '#E31837' },
    'SF': { gradient: 'from-red-600 to-yellow-500', accent: '#AA0000' },
    'LAR': { gradient: 'from-blue-600 to-yellow-500', accent: '#003594' },
    
    // MLB
    'LAA': { gradient: 'from-red-600 to-red-800', accent: '#BA0021' },
    'LAD': { gradient: 'from-blue-600 to-blue-800', accent: '#005A9C' },
    'NYY': { gradient: 'from-gray-700 to-blue-800', accent: '#132448' },
    'ATL': { gradient: 'from-red-600 to-blue-600', accent: '#CE1141' },
    
    // NHL
    'EDM': { gradient: 'from-blue-600 to-orange-500', accent: '#041E42' },
    'COL': { gradient: 'from-blue-600 to-red-600', accent: '#6F263D' },
    
    // Soccer
    'MIA': { gradient: 'from-pink-500 to-black', accent: '#F7B5CD' },
    'PSG': { gradient: 'from-blue-600 to-red-600', accent: '#004170' },
    'MCI': { gradient: 'from-blue-400 to-blue-600', accent: '#6CABDD' },
    
    // WNBA
    'NY': { gradient: 'from-green-600 to-green-800', accent: '#6ECEB2' },
    'LV': { gradient: 'from-red-600 to-black', accent: '#C8102E' },
    
    // UFC/MMA
    'UFC': { gradient: 'from-red-600 to-black', accent: '#D20A0A' },
    
    // PGA
    'PGA': { gradient: 'from-green-600 to-green-800', accent: '#006747' }
  };
  
  return colors[team] || { gradient: 'from-gray-600 to-gray-800', accent: '#6B7280' };
}