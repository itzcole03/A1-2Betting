import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function ModelPerformanceChart() {
  const chartRef = useRef<ChartJS<'line'> | null>(null);

  const generateTimeLabels = () => {
    const labels = [];
    for (let i = 11; i >= 0; i--) {
      const time = new Date(Date.now() - i * 5 * 60 * 1000);
      labels.push(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
    return labels;
  };

  const generateModelPerformanceData = (baseAccuracy: number) => {
    let accuracy = baseAccuracy;
    return Array.from({length: 12}, () => {
      accuracy += (Math.random() - 0.5) * 0.02;
      accuracy = Math.max(0.85, Math.min(0.99, accuracy));
      return accuracy * 100;
    });
  };

  const data = {
    labels: generateTimeLabels(),
    datasets: [
      {
        label: 'Traditional ML',
        data: generateModelPerformanceData(0.94),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Deep Learning',
        data: generateModelPerformanceData(0.96),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Ensemble',
        data: generateModelPerformanceData(0.97),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Real-Time AI Model Performance',
      },
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 85,
        max: 100,
        ticks: {
          callback: function(value: any) {
            return value + '%';
          },
        },
      },
    },
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (chartRef.current) {
        chartRef.current.data.datasets.forEach(dataset => {
          dataset.data.shift();
          const newPoint = 85 + Math.random() * 13;
          dataset.data.push(newPoint);
        });
        
        chartRef.current.data.labels?.shift();
        chartRef.current.data.labels?.push(
          new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        );
        chartRef.current.update();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
      <h3 className="font-bold text-lg mb-4 dark:text-white">Real-Time Model Performance</h3>
      <Line ref={chartRef} data={data} options={options} />
    </div>
  );
}