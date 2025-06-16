import React, { useState } from "react";
import { HelpCircle, X } from "lucide-react";

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RulesModal({ isOpen, onClose }: RulesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Rules & Special Picks
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Demons & Goblins Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">
              Demons &amp; Goblins
            </h3>

            <div className="text-gray-400 text-sm leading-5">
              Lineups containing a Demon or Goblin may pay out differently than
              standard lineups. You can only pick MORE on these projections.
            </div>

            {/* Demons */}
            <div className="flex items-start gap-3 p-4 bg-red-900/20 rounded-lg border border-red-900/30">
              <img
                alt="Demon"
                src="https://app.prizepicks.com/7534b2e82fa0ac08ec43.png"
                className="w-8 h-8 flex-shrink-0"
              />
              <div className="text-gray-400 text-sm leading-5">
                <span className="text-red-300 font-semibold">Demons</span>
                <span>
                  {" "}
                  are a little wild. They're harder to win, but the lineup
                  qualifies for higher payouts (1.25x multiplier).
                </span>
              </div>
            </div>

            {/* Goblins */}
            <div className="flex items-start gap-3 p-4 bg-green-900/20 rounded-lg border border-green-900/30">
              <img
                alt="Goblin"
                src="https://app.prizepicks.com/e00b98475351cdfd1c38.png"
                className="w-8 h-8 flex-shrink-0"
              />
              <div className="text-gray-400 text-sm leading-5">
                <span className="text-green-300 font-semibold">Goblins</span>
                <span>
                  {" "}
                  love the green. They're easier to win, but come with lower
                  payout multipliers (0.85x multiplier).
                </span>
              </div>
            </div>
          </div>

          {/* How to Submit Section */}
          <div className="space-y-4 border-t border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-white">
              How do I submit a lineup?
            </h3>

            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                  1
                </div>
                <span>
                  Pick between 2 and 6 projections on the board. Selections can
                  include multiple different sports and/or stat types.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                  2
                </div>
                <span>
                  Hit "Finalize Lineup" found in the banner along the bottom of
                  your screen
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                  3
                </div>
                <span>Choose "More" or "Less" for each projection</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                  4
                </div>
                <span>Choose either "Flex Play" or "Power Play"</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                  5
                </div>
                <span>
                  Edit your entry fee as needed (the default entry fee is
                  usually set at $20)
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                  6
                </div>
                <span>
                  Hit the blue button that says "Submit Lineup" and you're done!
                </span>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-3 mt-4">
                <p className="text-yellow-300 text-sm">
                  <strong>Colorado residents</strong> will need to pick a
                  minimum of 3 projections.
                </p>
              </div>
            </div>
          </div>

          {/* Selection Rules Section */}
          <div className="space-y-4 border-t border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-white">
              Can I make any selection I want?
            </h3>

            <p className="text-sm text-gray-400">
              For the most part, you can select any combination of players in
              your lineup, regardless of the sport. However, there are a few key
              exceptions:
            </p>

            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  You must have picks from{" "}
                  <strong className="text-white">
                    AT LEAST 2 different teams
                  </strong>{" "}
                  in order for it to be a valid lineup.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  You can{" "}
                  <strong className="text-white">
                    not have the same player
                  </strong>{" "}
                  in your lineup more than once.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  All lineups must be submitted{" "}
                  <strong className="text-white">
                    BEFORE the start of the game
                  </strong>{" "}
                  for each player included in your picks.
                </span>
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-3 mt-4">
              <p className="text-blue-300 text-sm">
                Some sports also have specific rules. For example, you can not
                have a pitcher and an opposing batter in the same lineup. You
                can find those specific rules in the scoring chart for that
                sport.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}

interface RulesButtonProps {
  className?: string;
}

export function RulesButton({ className = "" }: RulesButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm ${className}`}
        title="View rules and special picks"
      >
        <HelpCircle className="w-4 h-4" />
        <span>Rules</span>
      </button>

      <RulesModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
