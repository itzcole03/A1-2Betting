import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function ReliabilityChart() {
  const data = {
    labels: ['ESPN', 'NBA API', 'Odds API', 'AI Models'],
    datasets: [
      {
        label: 'Reliability Score',
        data: [95, 90, 85, 97],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Data Source Reliability',
      },
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value: any) {
            return value + '%';
          },
        },
      },
    },
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
      <h3 className="font-bold text-lg mb-4 dark:text-white">Data Source Reliability</h3>
      <Bar data={data} options={options} />
    </div>
  );
}