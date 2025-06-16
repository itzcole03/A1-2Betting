import React from "react";
import { SPORT_OPTIONS, getSportDisplayName } from "../../constants/sports";

interface SportSelectorProps {
  selectedSport: string;
  onSportChange: (sport: string) => void;
  className?: string;
  label?: string;
  includeAll?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export function SportSelector({
  selectedSport,
  onSportChange,
  className = "",
  label = "Sport",
  includeAll = true,
  placeholder = "Select a sport...",
  disabled = false,
}: SportSelectorProps) {
  const sportOptions = includeAll
    ? SPORT_OPTIONS
    : SPORT_OPTIONS.filter((sport) => sport !== "All");

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <select
        value={selectedSport}
        onChange={(e) => onSportChange(e.target.value)}
        disabled={disabled}
        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {placeholder && !includeAll && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {sportOptions.map((sport) => (
          <option key={sport} value={sport}>
            {getSportDisplayName(sport)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SportSelector;
