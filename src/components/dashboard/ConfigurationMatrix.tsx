import React, { useState } from "react";
import { UltimateAIConfig } from "../../types";
import { SPORTS_CONFIG, getSportDisplayName } from "../../constants/sports";

interface ConfigurationMatrixProps {
  onConfigChange: (config: UltimateAIConfig) => void;
}

export function ConfigurationMatrix({
  onConfigChange,
}: ConfigurationMatrixProps) {
  const [config, setConfig] = useState<UltimateAIConfig>({
    investment: 1000,
    dataSource: "real",
    strategy: "maximum",
    confidence: 90,
    portfolio: "3",
    sports: "all",
  });

  const handleConfigUpdate = (updates: Partial<UltimateAIConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    onConfigChange(newConfig);
  };

  return (
    <div className="glass-morphism rounded-3xl p-8">
      <h3 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
        🎯 Real Data AI Configuration Matrix
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        <div className="space-y-4">
          <label className="block text-sm font-bold mb-2 dark:text-white">
            Investment ($):
          </label>
          <input
            type="number"
            value={config.investment}
            onChange={(e) =>
              handleConfigUpdate({ investment: parseInt(e.target.value) || 0 })
            }
            min="100"
            max="100000"
            className="w-full px-4 py-4 text-center font-bold text-xl bg-white dark:bg-gray-700 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none dark:text-white"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-bold mb-2 dark:text-white">
            Data Source:
          </label>
          <select
            value={config.dataSource}
            onChange={(e) =>
              handleConfigUpdate({ dataSource: e.target.value as any })
            }
            className="w-full py-4 px-4 bg-white dark:bg-gray-700 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none dark:text-white"
          >
            <option value="real">🔴 Real Data Priority</option>
            <option value="hybrid">🟡 Hybrid (Real+AI)</option>
            <option value="simulation">🟢 AI Simulation</option>
          </select>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-bold mb-2 dark:text-white">
            Strategy:
          </label>
          <select
            value={config.strategy}
            onChange={(e) =>
              handleConfigUpdate({ strategy: e.target.value as any })
            }
            className="w-full py-4 px-4 bg-white dark:bg-gray-700 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none dark:text-white"
          >
            <option value="maximum">🚀 Maximum Profit</option>
            <option value="conservative">🛡️ Conservative</option>
            <option value="aggressive">🔥 High Risk/Reward</option>
            <option value="real_time">⚡ Real-Time Adaptive</option>
          </select>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-bold mb-2 dark:text-white">
            Confidence:
          </label>
          <select
            value={config.confidence}
            onChange={(e) =>
              handleConfigUpdate({ confidence: parseInt(e.target.value) })
            }
            className="w-full py-4 px-4 bg-white dark:bg-gray-700 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none dark:text-white"
          >
            <option value={99}>🏆 99%+ (Ultra Safe)</option>
            <option value={95}>👑 95%+ (Safe)</option>
            <option value={90}>💎 90%+ (Balanced)</option>
            <option value={85}>⚡ 85%+ (Aggressive)</option>
          </select>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-bold mb-2 dark:text-white">
            Portfolio:
          </label>
          <select
            value={config.portfolio}
            onChange={(e) => handleConfigUpdate({ portfolio: e.target.value })}
            className="w-full py-4 px-4 bg-white dark:bg-gray-700 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none dark:text-white"
          >
            <option value="2">2-Leg (Safe)</option>
            <option value="3">3-Leg (Optimal)</option>
            <option value="4">4-Leg (Balanced)</option>
            <option value="5">5-Leg (Aggressive)</option>
            <option value="dynamic">🎯 AI Dynamic</option>
          </select>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-bold mb-2 dark:text-white">
            Sports:
          </label>
          <select
            value={config.sports}
            onChange={(e) => handleConfigUpdate({ sports: e.target.value })}
            className="w-full py-4 px-4 bg-white dark:bg-gray-700 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:outline-none dark:text-white"
          >
            <option value="all">🌐 All Sports</option>
            {SPORTS_CONFIG.map((sport) => (
              <option key={sport.id} value={sport.id.toLowerCase()}>
                {getSportDisplayName(sport.id)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
