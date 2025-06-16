import React from "react";
import { PlayerProp } from "../../types";
import { DataGenerator } from "../../utils/dataGenerator";

interface PropCardProps {
  prop: PlayerProp;
  onSelect: (propId: string, choice: "over" | "under") => void;
  isPrizePicksData?: boolean;
}

export function PropCard({
  prop,
  onSelect,
  isPrizePicksData = false,
}: PropCardProps) {
  // Reliable player avatar system using services that always work
  const getPlayerImageUrl = (
    playerName: string,
    sport: string,
    team: string,
  ) => {
    // Use reliable avatar services that will always load
    const encodedName = encodeURIComponent(playerName);

    // Sport-specific color schemes
    const sportColors = {
      NBA: { bg: "1f2937", color: "ffffff" }, // Dark gray/white
      NFL: { bg: "059669", color: "ffffff" }, // Green/white
      MLB: { bg: "7c2d12", color: "ffffff" }, // Brown/white
      NHL: { bg: "1e40af", color: "ffffff" }, // Blue/white
      Soccer: { bg: "166534", color: "ffffff" }, // Green/white
      MMA: { bg: "dc2626", color: "ffffff" }, // Red/white
      PGA: { bg: "15803d", color: "ffffff" }, // Green/white
      WNBA: { bg: "ea580c", color: "ffffff" }, // Orange/white
    };

    const colors = sportColors[sport] || { bg: "6366f1", color: "ffffff" };

    // Use DiceBear for professional sports avatars
    return `https://api.dicebear.com/7.x/initials/png?seed=${encodedName}&size=64&backgroundColor=${colors.bg}&color=${colors.color}&fontSize=24&fontWeight=600`;
  };

  // Generate realistic game info and pick data
  const gameInfo = DataGenerator.generateGameTime();
  const pickType = DataGenerator.generatePickType(prop);
  const trendValue = DataGenerator.generateTrendValue(prop);

  const playerImageUrl = getPlayerImageUrl(
    prop.playerName,
    prop.sport,
    prop.team,
  );

  // Simple, guaranteed working fallback system
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    const encodedName = encodeURIComponent(prop.playerName);
    const initials = prop.playerName
      .split(" ")
      .map((n) => n[0])
      .join("");

    // Simple fallback chain with services that always work
    if (target.src.includes("dicebear.com")) {
      // Try UI Avatars
      target.src = `https://ui-avatars.com/api/?name=${encodedName}&size=64&background=374151&color=ffffff&bold=true&format=png`;
    } else if (target.src.includes("ui-avatars.com")) {
      // Try placeholder service
      target.src = `https://via.placeholder.com/64x64/6366f1/ffffff?text=${initials}`;
    } else if (target.src.includes("via.placeholder.com")) {
      // Final fallback: CSS-based avatar that always works
      target.style.display = "none";
      const parent = target.parentElement;
      if (parent) {
        parent.innerHTML = `
          <div style="
            width: 64px;
            height: 64px;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 18px;
            border: 1px solid rgb(75, 85, 99);
          ">${initials}</div>
        `;
      }
    }
  };
  return (
    <li
      aria-label={`${prop.playerName} - ${prop.team}`}
      className="bg-gray-900 border-b border-gray-600 rounded-b-lg relative text-center grid grid-rows-[min-content_min-content_1fr] overflow-hidden pt-3"
      style={{
        backgroundColor: "rgb(18, 19, 32)",
        borderBottom: "1px solid rgb(44, 44, 57)",
        borderBottomLeftRadius: "8px",
        borderBottomRightRadius: "8px",
        display: "grid",
        gridTemplate: "min-content min-content 1fr / none",
        gridTemplateRows: "min-content min-content 1fr",
        overflowX: "hidden",
        overflowY: "hidden",
        paddingTop: "12px",
        position: "relative",
        textAlign: "center",
      }}
    >
      {/* Stats Button - Top Left */}
      <button
        className="absolute top-2 left-2 appearance-none border-0 bg-black/50 rounded-md p-1 text-gray-300 cursor-pointer"
        style={{
          appearance: "button",
          borderBottomLeftRadius: "6px",
          borderBottomRightRadius: "6px",
          borderTopLeftRadius: "6px",
          borderTopRightRadius: "6px",
          color: "rgb(212, 211, 218)",
          cursor: "pointer",
          left: "8px",
          paddingBottom: "4px",
          paddingLeft: "4px",
          paddingRight: "4px",
          paddingTop: "4px",
          position: "absolute",
          textAlign: "center",
          top: "8px",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          border: "none",
        }}
      >
        <div
          className="w-4 h-4"
          style={{
            color: "rgb(212, 211, 218)",
            cursor: "pointer",
            fill: "rgb(212, 211, 218)",
            height: "16px",
            width: "16px",
            textAlign: "center",
          }}
        >
          <svg
            width="16"
            height="16"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M7.333 2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v11a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-11ZM4 4.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-9ZM8.667 7.833a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5V13.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5V7.833ZM14 5.833a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5V13.5a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V5.833Z"></path>
          </svg>
        </div>
      </button>

      {/* Trending Indicator - Top Right */}
      <div
        className="absolute top-2 right-2 flex items-center"
        style={{
          display: "flex",
          flexBasis: "0%",
          flexGrow: "1",
          position: "absolute",
          right: "8px",
          textAlign: "center",
          top: "8px",
        }}
      >
        <img
          alt="Trending"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAbCAYAAABiFp9rAAAEXUlEQVR4Ae2VW2gcVRjH/+ecmZ3LXpvYrcnGJtskqG9qRSgNhZI+1D6oFIQUxT4piIiKINQLmhYvL4r0VfCCFVREiwENVaNYrIUQWtrExraxoTYXN3Gzu83uZG7n+E2KIq3NZvPkQz84zNmz832/73a+AW7Iv2S8p23n+D3Zb091GaNKKbHSuxrWIH88tWdD9fzpQ+rShR0KDMh3jzDGwpV0OBqUC307O6rD3x/n85d2MDsBbykA37ztzXp6DYEoPUzz57/RvMsdvLUL0qnBTzSj+4l9h+vpNpS6qd78Xl6a6kKyCTKegvQDSF2sSrehiDj8J7lGhpW8oqrpUIUZ/PLZod31dRsQpuRd4KQSerRc8EQKmlBwjw29VSwW02sGTTy7p+fcA12d0b4yPX0TWBnICLAERaTKYBvWQUtzhKM/ZmfeO/jMmkDTL97/ghwbOCoC52zl56GtyZaWKmslp7M20MzA9CJUxgJr0hBLB3CGv37u4sXx1oZAM6/3dbCFEwf0tjRkSuPuT4dfo3vi8Gz2LJriYGkdbAvVqjMGmaB9kkFNjViVzz98pSGQYIWXJWYZktSUGRvOme+2VSdO7ZK+96liVJ94DEqvgW/0wfM6YDOIBFA7Odg3/+vJ3KpAdFcM7k3sRpy8NOgglYRbOY+l41+9k7n36feVvwQlHEQDR4UVYFPkDAez6PfcaHLqy3cfXRWoOri/h/HZFLNotHAyqocIqRbloYOtbraznzXnSoo7kBqDpM6DCsBuoQYxGDRbQk6feJyc1eqCwvLI7TxOHtq0Yg6Y5lLBm+BpJcx/8PBDbu23jKT/QykoIheSQDJBTqUiGEcwN5adOPLJbXVBwpQ5FtehxU3oJs2xZBHSbIZa34GAADJGkJRFIHIqoBSqEIo4KgKZ1BisSlGN3X213WtHkKHHuCUgYmnEKO9+3AE3ivCm0tATNwNyAWFiEVIuQSIgiFx2V9k6RI1D0ak/O9ZcF8S5NwmDQCxDzUCRaQV6zkGyRQTTCiLnUYSUrkDRqJBQUU6oXozKwsoiGlPQbW7XBans9t+ZMwwubHDLpFSWoNxFmFYFYbu6MuYiSPT18ekZEC8kiKSlc3KQgceThWsCuPrAzmz+AVZLhcdscpRmmd0MQY0hqKOEFVIaQ6qFpMIT0VDgJhmhVHNicqpftLfyW07XBbH89pJIdX3E+AJ5TC0rCagbEJq2vKLp/c/Soyh0Sjel+HKM6gqYGzZN5nofO1YXFInR/dKrTNMmOZ+HmHMhYBCM0rgMpCWip7m81ygko0DOUJ30uIB96337/8smw3XEG3v+Dr9wdEB5QZv0qwgtB4HpIaAGCKku0qMOK9KLRfomhSZFRjk0Um+07x3a1xAoEufMFx3yz4F+6dUeke4CGaeJ4HvLHSfpwspoRjET3G4p8WSuf33vgbevZ2tF0N+ydO7jzqA8+aB0F7fKULXTtU4SaSaUfDwUxqC+cdeRdfk7S/g/yF/ZrLFK5X31mgAAAABJRU5ErkJggg=="
          className="max-w-full"
          style={{
            borderBottomStyle: "none",
            borderLeftStyle: "none",
            borderRightStyle: "none",
            borderTopStyle: "none",
            height: "16px",
            maxWidth: "100%",
            overflowClipMargin: "content-box",
            overflowX: "clip",
            overflowY: "clip",
            paddingRight: "2px",
            textAlign: "center",
            verticalAlign: "middle",
          }}
        />
        <span
          className="text-white text-xs leading-4 pt-1"
          style={{
            color: "rgb(251, 249, 255)",
            fontSize: "12px",
            lineHeight: "16px",
            paddingTop: "4px",
            textAlign: "center",
          }}
        >
          {trendValue}K
        </span>
      </div>

      {/* Player Image and Basic Info */}
      <div className="text-center">
        <button
          className="inline-block cursor-pointer"
          style={{
            appearance: "button",
            cursor: "pointer",
            display: "inline-block",
            textAlign: "center",
            backgroundColor: "rgba(0, 0, 0, 0)",
            border: "none",
          }}
        >
          <span className="cursor-pointer inline">
            <img
              alt={prop.playerName}
              src={playerImageUrl}
              onError={handleImageError}
              className="cursor-pointer inline-block max-w-full"
              style={{
                borderBottomStyle: "none",
                borderLeftStyle: "none",
                borderRightStyle: "none",
                borderTopStyle: "none",
                cursor: "pointer",
                display: "inline-block",
                height: "64px",
                maxWidth: "100%",
                overflowClipMargin: "content-box",
                overflowX: "clip",
                overflowY: "clip",
                textAlign: "center",
                verticalAlign: "middle",
                width: "64px",
              }}
            />
          </span>
        </button>

        {/* Demon/Goblin Icon */}
        {(pickType === "demon" || pickType === "goblin") && (
          <div
            className="absolute"
            style={{
              left: "50%",
              position: "absolute",
              right: "-16px",
              textAlign: "center",
              top: "48px",
            }}
          >
            <button
              aria-label={`${pickType === "demon" ? "Demon pick - Harder to win, higher payout (1.25x)" : "Goblin pick - Easier to win, lower payout (0.85x)"}`}
              title={
                pickType === "demon"
                  ? "Demon pick - Harder to win, higher payout (1.25x)"
                  : "Goblin pick - Easier to win, lower payout (0.85x)"
              }
              className="inline-block cursor-pointer relative group"
              style={{
                appearance: "button",
                cursor: "pointer",
                display: "inline-block",
                textAlign: "center",
                backgroundColor: "rgba(0, 0, 0, 0)",
                border: "none",
              }}
            >
              <img
                alt={pickType === "demon" ? "Demon" : "Goblin"}
                src={
                  pickType === "demon"
                    ? "https://app.prizepicks.com/7534b2e82fa0ac08ec43.png"
                    : "https://app.prizepicks.com/e00b98475351cdfd1c38.png"
                }
                className="cursor-pointer inline-block max-w-full"
                style={{
                  borderBottomStyle: "none",
                  borderLeftStyle: "none",
                  borderRightStyle: "none",
                  borderTopStyle: "none",
                  cursor: "pointer",
                  display: "inline-block",
                  height: "36px",
                  maxWidth: "100%",
                  overflowClipMargin: "content-box",
                  overflowX: "clip",
                  overflowY: "clip",
                  textAlign: "center",
                  verticalAlign: "middle",
                  width: "36px",
                  transform:
                    "matrix(0.978148, 0.207912, -0.207912, 0.978148, 0, 0)",
                }}
              />
            </button>
          </div>
        )}

        {/* Team and Position */}
        <div
          className="text-gray-400 text-xs leading-4 mx-auto mt-2 relative"
          style={{
            color: "rgb(199, 198, 206)",
            fontSize: "12px",
            lineHeight: "16px",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "8px",
            paddingBottom: "2px",
            position: "relative",
            textAlign: "center",
          }}
        >
          <span>{prop.team}</span>
          <span> - </span>
          <span>{prop.position}</span>
        </div>
      </div>

      {/* Player Name and Game Info */}
      <div
        className="grid px-3"
        style={{
          display: "grid",
          gridTemplate: "min-content min-content 1fr / none",
          gridTemplateRows: "min-content min-content 1fr",
          paddingLeft: "12px",
          paddingRight: "12px",
          textAlign: "center",
        }}
      >
        <h3
          aria-label="name"
          className="text-white text-sm leading-4 pb-1"
          style={{
            fontSize: "14px",
            lineHeight: "16px",
            paddingBottom: "4px",
            textAlign: "center",
            color: "rgb(255, 255, 255)",
          }}
        >
          {prop.playerName}
        </h3>

        <time
          aria-label="Start Time"
          className="text-gray-400 text-xs leading-4"
          style={{
            color: "rgb(199, 198, 206)",
            fontSize: "12px",
            lineHeight: "16px",
            textAlign: "center",
          }}
        >
          <span>vs </span>
          <span>{gameInfo.opponent} </span>
          <span>
            {gameInfo.day} {gameInfo.time}
          </span>
        </time>

        {/* Centered Stat Section */}
        <div
          className="self-end flex gap-2 justify-center pb-3 pt-2 px-1"
          style={{
            alignSelf: "flex-end",
            display: "flex",
            gap: "8px",
            justifySelf: "center",
            paddingBottom: "12px",
            paddingLeft: "4px",
            paddingRight: "4px",
            paddingTop: "8px",
            textAlign: "center",
          }}
        >
          <div
            className="flex items-baseline flex-1 text-xs gap-1"
            style={{
              alignItems: "last baseline",
              display: "flex",
              flexBasis: "0%",
              flexGrow: "1",
              fontSize: "12px",
              gap: "4px",
              lineHeight: "16px",
              textAlign: "center",
            }}
          >
            <div
              className="text-xl leading-7"
              style={{
                fontSize: "20px",
                lineHeight: "28px",
                textAlign: "center",
                color: "rgb(255, 255, 255)",
              }}
            >
              {prop.line}
            </div>
            <span
              className="text-gray-400 text-sm leading-5 max-w-28 text-left"
              style={{
                color: "rgb(199, 198, 206)",
                fontSize: "14px",
                lineHeight: "20px",
                maxWidth: "112px",
                textAlign: "left",
              }}
            >
              <span
                className="inline"
                style={{
                  color: "rgb(199, 198, 206)",
                  display: "inline",
                  fontSize: "14px",
                  lineHeight: "20px",
                  overflowWrap: "break-word",
                  textAlign: "left",
                  wordWrap: "break-word",
                }}
              >
                {prop.statType}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Less/More Buttons */}
      <div
        className="self-end flex"
        style={{
          alignSelf: "flex-end",
          display: "flex",
          textAlign: "center",
        }}
      >
        {/* Less Button */}
        <button
          onClick={() => onSelect(prop.id, "under")}
          disabled={pickType === "demon" || pickType === "goblin"}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 border-r border-t border-gray-600 transition-colors ${
            pickType === "demon" || pickType === "goblin"
              ? "bg-gray-800/50 text-gray-500 cursor-not-allowed opacity-50"
              : "bg-black/50 hover:bg-gray-700/50 text-white"
          }`}
          style={{
            alignContent: "center",
            alignItems: "baseline",
            appearance: "button",
            borderBottomLeftRadius: "6px",
            borderColor: "rgb(44, 44, 57)",
            borderRight: "1px solid rgb(44, 44, 57)",
            borderRightWidth: "1px",
            borderTop: "1px solid rgb(44, 44, 57)",
            borderTopWidth: "1px",
            borderWidth: "1px 1px 0px 0px",
            cursor:
              pickType === "demon" || pickType === "goblin"
                ? "not-allowed"
                : "pointer",
            display: "flex",
            flexBasis: "0%",
            flexGrow: "1",
            fontSize: "14px",
            gap: "6px",
            justifyContent: "center",
            lineHeight: "16px",
            paddingBottom: "10px",
            paddingLeft: "12px",
            paddingRight: "12px",
            paddingTop: "10px",
            textAlign: "center",
            backgroundColor:
              pickType === "demon" || pickType === "goblin"
                ? "rgba(75, 85, 99, 0.5)"
                : "rgba(0, 0, 0, 0.5)",
          }}
        >
          <svg
            width="8"
            height="8"
            viewBox="0 0 9 8"
            fill="#FBF9FF"
            xmlns="http://www.w3.org/2000/svg"
            className="h-2 w-2"
            alt="Arrow Down"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.815 7.842a.678.678 0 0 0 .87 0l3.36-2.89a.562.562 0 0 0 .034-.837.677.677 0 0 0-.905-.03L4.89 6.047V.593C4.89.265 4.603 0 4.25 0c-.353 0-.64.265-.64.593v5.455L1.325 4.085a.677.677 0 0 0-.904.031.562.562 0 0 0 .034.838l3.36 2.889Z"
            ></path>
          </svg>
          <span className="text-sm">
            {pickType === "demon" || pickType === "goblin" ? "N/A" : "Less"}
          </span>
        </button>

        {/* More Button */}
        <button
          onClick={() => onSelect(prop.id, "over")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 border-t border-gray-600 transition-colors ${
            pickType === "demon"
              ? "bg-red-900/30 hover:bg-red-800/40 text-red-100"
              : pickType === "goblin"
                ? "bg-green-900/30 hover:bg-green-800/40 text-green-100"
                : "bg-black/50 hover:bg-gray-700/50 text-white"
          }`}
          style={{
            alignContent: "center",
            alignItems: "baseline",
            appearance: "button",
            borderColor: "rgb(44, 44, 57)",
            borderTop: "1px solid rgb(44, 44, 57)",
            borderTopWidth: "1px",
            borderWidth: "1px 0px 0px 0px",
            cursor: "pointer",
            display: "flex",
            flexBasis: "0%",
            flexGrow: "1",
            fontSize: "14px",
            gap: "6px",
            justifyContent: "center",
            lineHeight: "16px",
            paddingBottom: "10px",
            paddingLeft: "12px",
            paddingRight: "12px",
            paddingTop: "10px",
            textAlign: "center",
            backgroundColor:
              pickType === "demon"
                ? "rgba(127, 29, 29, 0.3)"
                : pickType === "goblin"
                  ? "rgba(20, 83, 45, 0.3)"
                  : "rgba(0, 0, 0, 0.5)",
          }}
        >
          <svg
            width="8"
            height="8"
            viewBox="0 0 9 8"
            fill="#FBF9FF"
            xmlns="http://www.w3.org/2000/svg"
            className="h-2 w-2"
            alt="Arrow Up"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.315.158a.678.678 0 0 1 .87 0l3.36 2.89a.562.562 0 0 1 .034.837.677.677 0 0 1-.905.03L5.39 1.953v5.455c0 .328-.287.593-.64.593-.353 0-.64-.265-.64-.593V1.952L1.825 3.916a.677.677 0 0 1-.904-.031.562.562 0 0 1 .034-.838L4.315.158Z"
            ></path>
          </svg>
          <span className="text-sm">More</span>
          {pickType === "demon" && (
            <span className="text-xs opacity-75 ml-1">1.25x</span>
          )}
          {pickType === "goblin" && (
            <span className="text-xs opacity-75 ml-1">0.85x</span>
          )}
        </button>
      </div>
    </li>
  );
}
