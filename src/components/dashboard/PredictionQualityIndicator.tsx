import React from 'react';
import { Brain, TrendingUp, Shield, Target, AlertTriangle, CheckCircle } from 'lucide-react';

interface PredictionQualityIndicatorProps {
  quality: number;
  confidence: number;
  modelConsensus: number;
  dataReliability: number;
  riskScore: number;
  valueGrade: string;
  factors: any[];
}

export function PredictionQualityIndicator({
  quality,
  confidence,
  modelConsensus,
  dataReliability,
  riskScore,
  valueGrade,
  factors
}: PredictionQualityIndicatorProps) {
  const getQualityColor = (score: number) => {
    if (score >= 0.9) return 'text-green-600 bg-green-100 dark:bg-green-900/30';
    if (score >= 0.7) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
    return 'text-red-600 bg-red-100 dark:bg-red-900/30';
  };

  const getValueGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-100 dark:bg-green-900/30';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
    return 'text-red-600 bg-red-100 dark:bg-red-900/30';
  };

  const getRiskColor = (risk: number) => {
    if (risk <= 0.3) return 'text-green-600';
    if (risk <= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const overallScore = (quality + confidence + modelConsensus + dataReliability + (1 - riskScore)) / 5;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold dark:text-white flex items-center space-x-2">
          <Brain className="w-6 h-6 text-purple-600" />
          <span>Prediction Quality Analysis</span>
        </h3>
        <div className={`px-4 py-2 rounded-full font-bold text-lg ${getValueGradeColor(valueGrade)}`}>
          Grade: {valueGrade}
        </div>
      </div>

      {/* Overall Score */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-purple-700 dark:text-purple-300">Overall Prediction Score</span>
          <span className={`font-bold text-2xl ${getQualityColor(overallScore).split(' ')[0]}`}>
            {(overallScore * 100).toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              overallScore >= 0.9 ? 'bg-green-500' :
              overallScore >= 0.7 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${overallScore * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Quality Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-700 dark:text-gray-300">Data Quality</span>
          </div>
          <div className={`text-xl font-bold ${getQualityColor(quality).split(' ')[0]}`}>
            {(quality * 100).toFixed(1)}%
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${quality * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="w-5 h-5 text-green-600" />
            <span className="font-medium text-gray-700 dark:text-gray-300">Confidence</span>
          </div>
          <div className={`text-xl font-bold ${getQualityColor(confidence).split(' ')[0]}`}>
            {(confidence * 100).toFixed(1)}%
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${confidence * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
          <div className="flex items-center space-x-2 mb-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-gray-700 dark:text-gray-300">Model Consensus</span>
          </div>
          <div className={`text-xl font-bold ${getQualityColor(modelConsensus).split(' ')[0]}`}>
            {(modelConsensus * 100).toFixed(1)}%
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
            <div 
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${modelConsensus * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-5 h-5 text-indigo-600" />
            <span className="font-medium text-gray-700 dark:text-gray-300">Data Reliability</span>
          </div>
          <div className={`text-xl font-bold ${getQualityColor(dataReliability).split(' ')[0]}`}>
            {(dataReliability * 100).toFixed(1)}%
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
            <div 
              className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${dataReliability * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="w-5 h-5 text-orange-600" />
            <span className="font-medium text-gray-700 dark:text-gray-300">Risk Score</span>
          </div>
          <div className={`text-xl font-bold ${getRiskColor(riskScore)}`}>
            {(riskScore * 100).toFixed(1)}%
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                riskScore <= 0.3 ? 'bg-green-500' :
                riskScore <= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${riskScore * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <span className="font-medium text-gray-700 dark:text-gray-300">Active Factors</span>
          </div>
          <div className="text-xl font-bold text-yellow-600">
            {factors.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {factors.length > 0 ? 'Factors detected' : 'No factors'}
          </div>
        </div>
      </div>

      {/* Key Factors */}
      {factors.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Key Prediction Factors</h4>
          {factors.slice(0, 5).map((factor, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex-1">
                <div className="font-medium dark:text-white">{factor.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{factor.description}</div>
              </div>
              <div className="flex items-center space-x-3">
                <div className={`text-sm font-medium ${
                  factor.impact > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {factor.impact > 0 ? '+' : ''}{(factor.impact * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {(factor.confidence * 100).toFixed(0)}% conf
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quality Indicators */}
      <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900/50 dark:to-blue-900/50 rounded-xl">
        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Quality Indicators</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            {overallScore >= 0.9 ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : overallScore >= 0.7 ? (
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-500" />
            )}
            <span className="dark:text-gray-300">
              {overallScore >= 0.9 ? 'Excellent prediction quality' :
               overallScore >= 0.7 ? 'Good prediction quality' : 'Fair prediction quality'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {modelConsensus >= 0.8 ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
            )}
            <span className="dark:text-gray-300">
              {modelConsensus >= 0.8 ? 'Strong model agreement' : 'Moderate model agreement'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {riskScore <= 0.3 ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : riskScore <= 0.6 ? (
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-500" />
            )}
            <span className="dark:text-gray-300">
              {riskScore <= 0.3 ? 'Low risk prediction' :
               riskScore <= 0.6 ? 'Moderate risk prediction' : 'High risk prediction'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {dataReliability >= 0.9 ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
            )}
            <span className="dark:text-gray-300">
              {dataReliability >= 0.9 ? 'Highly reliable data' : 'Moderately reliable data'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}