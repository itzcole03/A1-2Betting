import React from "react";

export function DemonsGoblins() {
  return (
    <div className="bg-gray-700 px-4 pt-8 pb-4 flex flex-col gap-3">
      <h1 className="text-white font-medium text-2xl leading-8">
        Demons &amp; Goblins
      </h1>

      <div className="text-gray-400 text-sm leading-5">
        Lineups containing a Demon or Goblin may pay out differently than
        standard lineups. You can only pick MORE on these projections.
      </div>

      {/* Demons Section */}
      <div className="flex items-start gap-3">
        <img
          alt="Demon"
          src="https://app.prizepicks.com/7534b2e82fa0ac08ec43.png"
          className="w-8 h-8 flex-shrink-0"
        />
        <div className="text-gray-400 text-xs leading-5">
          <span className="text-white font-medium">Demons</span>
          <span>
            {" "}
            are a little wild. They're harder to win, but the lineup qualifies
            for higher payouts.
          </span>
        </div>
      </div>

      {/* Goblins Section */}
      <div className="flex items-start gap-3">
        <img
          alt="Goblin"
          src="https://app.prizepicks.com/e00b98475351cdfd1c38.png"
          className="w-8 h-8 flex-shrink-0"
        />
        <div className="text-gray-400 text-xs leading-5">
          <span className="text-white font-medium">Goblins</span>
          <span>
            {" "}
            love the green. They're easier to win, but come with lower payout
            multipliers.
          </span>
        </div>
      </div>
    </div>
  );
}
