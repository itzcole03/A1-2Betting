import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export function DataQualityChart() {
  const data = {
    labels: ['Real Data', 'AI Enhanced', 'Simulated'],
    datasets: [
      {
        data: [60, 30, 10],
        backgroundColor: ['#10b981', '#8b5cf6', '#f59e0b'],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Data Quality Distribution',
      },
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
      <h3 className="font-bold text-lg mb-4 dark:text-white">Live Data Quality Index</h3>
      <Doughnut data={data} options={options} />
    </div>
  );
}