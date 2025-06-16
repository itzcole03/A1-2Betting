import React from "react";
import {
  User,
  Star,
  TrendingUp,
  Zap,
  Timer,
  Users,
  Activity,
} from "lucide-react";
import { getSportEmoji } from "../../constants/sports";
import { ProcessedPlayer } from "../../services/dataProcessor";

interface RealPlayersDisplayProps {
  players: ProcessedPlayer[];
}

export function RealPlayersDisplay({ players }: RealPlayersDisplayProps) {
  const getSportIcon = (sport: string) => {
    const icons: { [key: string]: string } = {
      NBA: "🏀",
      NFL: "🏈",
      MLB: "⚾",
      NHL: "🏒",
    };
    return icons[sport] || "🏆";
  };

  const getFormTrend = (recentForm: number[]) => {
    if (recentForm.length < 2) return "stable";
    const recent = recentForm.slice(-3);
    const avg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
    if (avg > 0.6) return "up";
    if (avg < 0.4) return "down";
    return "stable";
  };

  const getFormIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return "📈";
      case "down":
        return "📉";
      default:
        return "➡️";
    }
  };

  const getMainStat = (player: ProcessedPlayer) => {
    switch (player.sport) {
      case "NBA":
      case "WNBA":
        return {
          label: "PPG",
          value: player.stats.points?.toFixed(1) || "0.0",
        };
      case "NHL":
        return {
          label: "Goals",
          value: player.stats.goals?.toFixed(1) || "0.0",
        };
      case "MLB":
        return {
          label: "AVG",
          value: player.stats.average?.toFixed(3) || ".000",
        };
      case "NFL":
        return { label: "YDS", value: player.stats.yards?.toFixed(0) || "0" };
      case "Soccer":
        return { label: "Goals", value: player.stats.goals?.toFixed(0) || "0" };
      case "MMA":
        return { label: "Wins", value: player.stats.wins?.toFixed(0) || "0" };
      case "PGA":
        return {
          label: "Score",
          value: player.stats.score?.toFixed(1) || "0.0",
        };
      default:
        return { label: "Rating", value: player.rating?.toFixed(1) || "0.0" };
    }
  };

  if (players.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4 dark:text-white">
          Real Player Data
        </h3>
        <div className="text-center py-8">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No player data available from real sources
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold dark:text-white">Real Player Data</h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {players.length} players from real sources
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.slice(0, 12).map((player) => {
          const trend = getFormTrend(player.recentForm);
          const mainStat = getMainStat(player);

          return (
            <div
              key={player.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getSportIcon(player.sport)}</span>
                  <div>
                    <div className="font-semibold dark:text-white">
                      {player.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {player.team} • {player.position}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {mainStat.value}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {mainStat.label}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Form:
                  </span>
                  <span>{getFormIcon(trend)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Activity className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {player.source}
                  </span>
                </div>
              </div>

              {player.injuryStatus && (
                <div className="mt-2 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs rounded">
                  {player.injuryStatus}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
