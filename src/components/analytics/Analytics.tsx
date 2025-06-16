import React from 'react';
import { BarChart3 } from 'lucide-react';
import { ModelPerformanceChart } from './ModelPerformanceChart';
import { DataQualityChart } from './DataQualityChart';
import { ReliabilityChart } from './ReliabilityChart';
import { PatternStrengthMetrics } from './PatternStrengthMetrics';

export function Analytics() {
  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
        <h2 className="text-3xl font-bold mb-6 flex items-center space-x-3">
          <BarChart3 className="w-8 h-8 text-primary-600" />
          <span className="dark:text-white">Real-Time Advanced Analytics</span>
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ModelPerformanceChart />
          <DataQualityChart />
          <PatternStrengthMetrics />
          <ReliabilityChart />
        </div>
      </div>
    </div>
  );
}