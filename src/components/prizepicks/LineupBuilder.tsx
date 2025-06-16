import React from "react";
import { X, Users } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { validateLineup, calculatePayout } from "../../utils/lineupValidation";
import { DataGenerator } from "../../utils/dataGenerator";

interface LineupBuilderProps {
  entryAmount: number;
  onEntryAmountChange: (amount: number) => void;
  onSubmitLineup: () => void;
  prizePicksConnected?: boolean;
}

export function LineupBuilder({
  entryAmount,
  onEntryAmountChange,
  onSubmitLineup,
  prizePicksConnected = false,
}: LineupBuilderProps) {
  const { state, removeSelectedProp } = useApp();
  const selectedCount = state.selectedProps.size;

  // Validate lineup using PrizePicks rules
  const validation = validateLineup(state.selectedProps);
  const payoutInfo = calculatePayout(
    state.selectedProps,
    entryAmount,
    prizePicksConnected,
  );

  const selectedPropsArray = Array.from(state.selectedProps.values());

  const removeSelectedPropByIndex = (index: number) => {
    const keys = Array.from(state.selectedProps.keys());
    if (keys[index]) {
      removeSelectedProp(keys[index]);
    }
  };

  const clearAllProps = () => {
    const keys = Array.from(state.selectedProps.keys());
    keys.forEach((key) => removeSelectedProp(key));
  };

  // Generate realistic data for props
  const getGameTime = (prop: any) => DataGenerator.generateGameTime();
  const getPickType = (prop: any) => DataGenerator.generatePickType(prop);

  const getPlayerImageUrl = (
    playerName: string,
    sport: string,
    team: string,
  ) => {
    const encodedName = encodeURIComponent(playerName);
    const sportColors = {
      NBA: { bg: "1f2937", color: "ffffff" },
      NFL: { bg: "059669", color: "ffffff" },
      MLB: { bg: "7c2d12", color: "ffffff" },
      NHL: { bg: "1e40af", color: "ffffff" },
      Soccer: { bg: "166534", color: "ffffff" },
      MMA: { bg: "dc2626", color: "ffffff" },
      PGA: { bg: "15803d", color: "ffffff" },
      WNBA: { bg: "ea580c", color: "ffffff" },
    };

    const colors = sportColors[sport] || { bg: "6366f1", color: "ffffff" };
    return `https://api.dicebear.com/7.x/initials/png?seed=${encodedName}&size=75&backgroundColor=${colors.bg}&color=${colors.color}&fontSize=24&fontWeight=600`;
  };

  return (
    <div
      className="w-full xl:w-80 xl:flex-shrink-0 xl:max-w-80"
      style={{
        backgroundColor: "rgb(5, 6, 20)",
        borderBottom: "1px solid rgb(57, 57, 69)",
        borderBottomLeftRadius: "8px",
        borderBottomRightRadius: "8px",
        display: "flex",
        flexDirection: "column",
        height: "450px", // Fixed height matching PrizePicks proportions
        position: "sticky",
        textAlign: "left",
        top: "70px",
        alignSelf: "flex-start",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "15px",
          textAlign: "center",
        }}
      >
        {/* Hidden PrizePicks logo button */}
        <button
          style={{
            alignItems: "center",
            appearance: "button",
            cursor: "pointer",
            display: "none",
            marginBottom: "15px",
            paddingBottom: "20px",
            paddingTop: "20px",
            textAlign: "center",
            width: "100%",
            backgroundColor: "rgba(0, 0, 0, 0)",
            border: "none",
          }}
        ></button>
      </div>

      {/* Main Content */}
      <div
        style={{
          marginTop: "5px",
          maxHeight: "477px",
          minHeight: "477px",
          overflowX: "auto",
          overflowY: "auto",
          textAlign: "left",
        }}
      >
        {/* Current Lineup Header */}
        <div
          style={{
            alignItems: "center",
            display: "flex",
            paddingBottom: "12px",
            paddingLeft: "12px",
            paddingRight: "12px",
            paddingTop: "12px",
            textAlign: "left",
          }}
        >
          <div
            style={{
              display: "flex",
              flexBasis: "0%",
              flexGrow: "1",
              gap: "12px",
              textAlign: "left",
            }}
          >
            <h3
              style={{
                color: "rgb(251, 249, 255)",
                lineHeight: "20px",
                textAlign: "left",
                fontSize: "16px",
                fontWeight: "600",
                margin: "0",
              }}
            >
              Current Lineup
            </h3>
            <span
              style={{
                color: "rgb(199, 198, 206)",
                textAlign: "left",
                fontSize: "14px",
              }}
            >
              <span>{selectedCount}</span>
              <span> Players Selected</span>
            </span>
          </div>
          <button
            onClick={clearAllProps}
            style={{
              appearance: "button",
              color: "rgb(251, 249, 255)",
              cursor: "pointer",
              lineHeight: "20px",
              textAlign: "center",
              backgroundColor: "rgba(0, 0, 0, 0)",
              border: "none",
              fontSize: "14px",
            }}
          >
            Clear
          </button>
        </div>

        {/* Selected Props List */}
        <ul
          aria-label="entry predictions list"
          style={{
            marginBottom: "16px",
            textAlign: "left",
            listStyle: "none",
            padding: "0",
            margin: "0 0 16px 0",
          }}
        >
          {selectedPropsArray.map((selectedProp, index) => {
            const prop = selectedProp.prop;
            const gameInfo = getGameTime(prop);
            const pickType = getPickType(prop);
            const playerImageUrl = getPlayerImageUrl(
              prop.playerName,
              prop.sport,
              prop.team,
            );

            return (
              <li
                key={index}
                aria-label={`${prop.playerName} - ${prop.team}`}
                style={{
                  alignItems: "center",
                  borderBottom: "1px solid rgb(44, 44, 57)",
                  cursor: "default",
                  display: "flex",
                  minHeight: "133px",
                  paddingBottom: "8px",
                  paddingLeft: "12px",
                  paddingRight: "12px",
                  paddingTop: "18px",
                  position: "relative",
                  textAlign: "left",
                }}
              >
                {/* Remove Button */}
                <button
                  onClick={() => removeSelectedPropByIndex(index)}
                  aria-label="remove lineup"
                  style={{
                    appearance: "button",
                    cursor: "pointer",
                    display: "flex",
                    height: "30px",
                    justifyContent: "flex-end",
                    position: "absolute",
                    right: "11px",
                    textAlign: "center",
                    top: "12px",
                    width: "50px",
                    backgroundColor: "rgba(0, 0, 0, 0)",
                    border: "none",
                  }}
                >
                  <X
                    style={{
                      color: "rgb(251, 249, 255)",
                      height: "24px",
                      width: "24px",
                    }}
                  />
                </button>

                {/* Player Image */}
                <button
                  style={{
                    alignSelf: "center",
                    appearance: "button",
                    cursor: "pointer",
                    marginBottom: "auto",
                    marginRight: "12px",
                    marginTop: "auto",
                    maxWidth: "75px",
                    overflowX: "hidden",
                    overflowY: "hidden",
                    textWrap: "nowrap",
                    whiteSpace: "nowrap",
                    width: "25%",
                    backgroundColor: "rgba(0, 0, 0, 0)",
                    border: "none",
                  }}
                >
                  <img
                    alt={prop.playerName}
                    src={playerImageUrl}
                    style={{
                      borderRadius: "50%",
                      cursor: "pointer",
                      display: "inline-block",
                      maxWidth: "100%",
                      textAlign: "center",
                      verticalAlign: "middle",
                      width: "75px",
                      height: "75px",
                    }}
                  />
                </button>

                {/* Player Info */}
                <div
                  style={{
                    alignSelf: "center",
                    cursor: "default",
                    flexBasis: "0%",
                    flexGrow: "3",
                    textAlign: "left",
                  }}
                >
                  <div style={{ cursor: "default", textAlign: "left" }}>
                    {/* Player Name */}
                    <h3
                      aria-label="name"
                      style={{
                        cursor: "default",
                        fontSize: "14px",
                        fontWeight: "500",
                        lineHeight: "16px",
                        marginBottom: "4px",
                        maxWidth: "280px",
                        textAlign: "left",
                        color: "rgb(251, 249, 255)",
                        margin: "0 0 4px 0",
                      }}
                    >
                      {prop.playerName}
                    </h3>

                    {/* Team and Position */}
                    <p
                      style={{
                        cursor: "default",
                        fontSize: "12px",
                        lineHeight: "16px",
                        textAlign: "left",
                        color: "rgb(199, 198, 206)",
                        margin: "0",
                      }}
                    >
                      <span
                        style={{
                          borderBottom: "1px solid rgb(57, 57, 69)",
                          borderRadius: "3px",
                          color: "rgb(170, 170, 170)",
                          cursor: "default",
                          display: "inline",
                          fontSize: "12px",
                          lineHeight: "16px",
                          marginRight: "5px",
                          paddingLeft: "2px",
                          paddingRight: "2px",
                          textAlign: "left",
                        }}
                      >
                        {prop.sport}
                      </span>
                      <span>{prop.team}</span>
                      <span> - </span>
                      <span>{prop.position}</span>
                    </p>

                    {/* Game Time */}
                    <p
                      aria-label="Start Time"
                      style={{
                        color: "rgb(199, 198, 206)",
                        cursor: "default",
                        fontSize: "12px",
                        lineHeight: "16px",
                        marginBottom: "4px",
                        marginTop: "8px",
                        textAlign: "left",
                        margin: "8px 0 4px 0",
                      }}
                    >
                      <span>
                        {gameInfo.day} {gameInfo.time}
                      </span>
                      <span> vs </span>
                      <span>{gameInfo.opponent}</span>
                    </p>

                    {/* Stat Line */}
                    <div style={{ cursor: "default", textAlign: "left" }}>
                      {/* Demon/Goblin Icon */}
                      {pickType !== "normal" && (
                        <button
                          aria-label="Open modal for Demons and Goblins"
                          style={{
                            appearance: "button",
                            cursor: "pointer",
                            display: "inline-block",
                            textAlign: "center",
                            backgroundColor: "rgba(0, 0, 0, 0)",
                            border: "none",
                            padding: "0",
                            marginRight: "8px",
                          }}
                        >
                          <img
                            alt={pickType === "demon" ? "Demon" : "Goblin"}
                            src={
                              pickType === "demon"
                                ? "https://app.prizepicks.com/7534b2e82fa0ac08ec43.png"
                                : "https://app.prizepicks.com/e00b98475351cdfd1c38.png"
                            }
                            style={{
                              cursor: "pointer",
                              display: "inline-block",
                              maxWidth: "100%",
                              textAlign: "center",
                              verticalAlign: "middle",
                              width: "20px",
                              height: "20px",
                            }}
                          />
                        </button>
                      )}

                      <span
                        style={{
                          cursor: "default",
                          display: "inline",
                          fontSize: "12px",
                          lineHeight: "16px",
                          textAlign: "left",
                          textDecoration: "line-through",
                          color: "rgb(199, 198, 206)",
                        }}
                      >
                        <div
                          style={{
                            color: "rgb(199, 198, 206)",
                            cursor: "default",
                            display: "none",
                            fontSize: "12px",
                            lineHeight: "16px",
                            textAlign: "left",
                          }}
                        >
                          {prop.line}
                        </div>
                      </span>

                      <div
                        style={{
                          cursor: "default",
                          display: "inline",
                          marginRight: "2px",
                          position: "relative",
                          textAlign: "left",
                          color: "rgb(251, 249, 255)",
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                      >
                        {prop.line}
                      </div>

                      <div
                        style={{
                          alignItems: "last baseline",
                          color: "rgb(199, 198, 206)",
                          cursor: "default",
                          display: "inline",
                          fontSize: "12px",
                          lineHeight: "16px",
                          textAlign: "left",
                        }}
                      >
                        <span
                          style={{
                            color: "rgb(199, 198, 206)",
                            cursor: "default",
                            display: "inline",
                            fontSize: "12px",
                            lineHeight: "16px",
                            overflowWrap: "break-word",
                            textAlign: "left",
                            wordWrap: "break-word",
                          }}
                        >
                          {prop.statType}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* More/Less Buttons */}
                <div
                  style={{
                    cursor: "default",
                    display: "flex",
                    justifyContent: "flex-end",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      borderRadius: "5px",
                      cursor: "default",
                      display: "flex",
                      flexDirection: "column",
                      height: "65px",
                      justifyContent: "flex-end",
                      marginTop: "30px",
                      paddingBottom: "1px",
                      textAlign: "left",
                      width: "96px",
                    }}
                  >
                    {/* Hidden radio inputs */}
                    <input
                      type="radio"
                      aria-labelledby="over-button"
                      name={`under-over-${index}`}
                      readOnly
                      value="more"
                      checked={selectedProp.choice === "over"}
                      style={{
                        appearance: "auto",
                        cursor: "default",
                        height: "0px",
                        opacity: "0",
                        width: "0px",
                      }}
                    />

                    {/* More Button */}
                    <button
                      style={{
                        alignItems: "center",
                        appearance: "button",
                        backgroundColor:
                          selectedProp.choice === "over"
                            ? "rgb(110, 255, 0)"
                            : "rgb(5, 6, 20)",
                        borderBottom: "1px solid rgb(44, 44, 57)",
                        borderLeft: "1px solid rgb(44, 44, 57)",
                        borderRight: "1px solid rgb(44, 44, 57)",
                        borderTop: "1px solid rgb(44, 44, 57)",
                        borderRadius:
                          selectedProp.choice === "over"
                            ? "4px 4px 0px 0px"
                            : "4px 4px 0px 0px",
                        color:
                          selectedProp.choice === "over"
                            ? "rgb(5, 6, 20)"
                            : "rgb(251, 249, 255)",
                        cursor: "pointer",
                        display: "flex",
                        fontSize: "14px",
                        height: "32px",
                        justifyContent: "center",
                        lineHeight: "16px",
                        textAlign: "center",
                      }}
                    >
                      More
                    </button>

                    <input
                      type="radio"
                      aria-labelledby="under-button"
                      name={`under-over-${index}`}
                      readOnly
                      value="less"
                      checked={selectedProp.choice === "under"}
                      style={{
                        appearance: "auto",
                        cursor: "default",
                        height: "0px",
                        opacity: "0",
                        width: "0px",
                      }}
                    />

                    {/* Less Button */}
                    <button
                      style={{
                        alignItems: "center",
                        appearance: "button",
                        backgroundColor:
                          selectedProp.choice === "under"
                            ? "rgb(110, 255, 0)"
                            : "rgb(5, 6, 20)",
                        borderBottom: "1px solid rgb(44, 44, 57)",
                        borderLeft: "1px solid rgb(44, 44, 57)",
                        borderRight: "1px solid rgb(44, 44, 57)",
                        borderTop: "1px solid rgb(44, 44, 57)",
                        borderRadius: "0px 0px 4px 4px",
                        color:
                          selectedProp.choice === "under"
                            ? "rgb(5, 6, 20)"
                            : "rgb(251, 249, 255)",
                        cursor: "pointer",
                        display: "flex",
                        fontSize: "14px",
                        height: "32px",
                        justifyContent: "center",
                        lineHeight: "16px",
                        textAlign: "center",
                      }}
                    >
                      Less
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Payout Information */}
        {selectedCount >= 2 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              paddingBottom: "16px",
              paddingLeft: "12px",
              paddingRight: "12px",
              paddingTop: "0px",
              textAlign: "left",
            }}
          >
            {/* Two Ways to Win Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingBottom: "16px",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    color: "rgb(251, 249, 255)",
                    textAlign: "left",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Two Ways to Win:
                </span>
                <span
                  style={{
                    color: "rgb(134, 134, 144)",
                    fontSize: "12px",
                    lineHeight: "18px",
                    textAlign: "left",
                  }}
                >
                  You will receive whichever payout is higher
                </span>
              </div>
              <button
                style={{
                  appearance: "button",
                  color: "rgb(255, 246, 0)",
                  cursor: "pointer",
                  display: "flex",
                  fontSize: "12px",
                  justifyContent: "flex-end",
                  lineHeight: "18px",
                  textAlign: "center",
                  backgroundColor: "rgba(0, 0, 0, 0)",
                  border: "none",
                }}
              >
                View FAQs
              </button>
            </div>

            {/* Payout Options */}
            <div style={{ textAlign: "left" }}>
              {/* First Place Option */}
              <div
                style={{
                  alignItems: "flex-start",
                  display: "flex",
                  gap: "16px",
                  justifyContent: "space-between",
                  paddingTop: "8px",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "left",
                  }}
                >
                  <p
                    style={{
                      color: "rgb(251, 249, 255)",
                      fontSize: "14px",
                      lineHeight: "18px",
                      paddingBottom: "2px",
                      textAlign: "left",
                      margin: "0",
                    }}
                  >
                    Get first place in your group to win
                  </p>
                  <p
                    style={{
                      color: "rgb(134, 134, 144)",
                      fontSize: "12px",
                      lineHeight: "18px",
                      textAlign: "left",
                      margin: "0",
                    }}
                  >
                    In the event of a tie, payout is adjusted
                  </p>
                </div>
                <div
                  style={{
                    alignItems: "center",
                    backgroundColor: "rgb(44, 44, 57)",
                    borderRadius: "4px",
                    display: "flex",
                    gap: "10px",
                    paddingBottom: "8px",
                    paddingLeft: "8px",
                    paddingRight: "8px",
                    paddingTop: "8px",
                    textAlign: "left",
                  }}
                >
                  <Users
                    style={{
                      color: "white",
                      height: "20px",
                      width: "20px",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "14px",
                      lineHeight: "20px",
                      textAlign: "left",
                      color: "white",
                    }}
                  >
                    <span>5</span>
                    <span>X</span>
                  </span>
                </div>
              </div>

              {/* OR Divider */}
              <div
                style={{
                  alignItems: "center",
                  display: "flex",
                  paddingBottom: "12px",
                  paddingTop: "12px",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    borderBottom: "1px solid rgb(44, 44, 57)",
                    flexGrow: "1",
                    paddingLeft: "8px",
                    paddingRight: "8px",
                    textAlign: "left",
                  }}
                />
                <span
                  style={{
                    color: "rgb(122, 121, 131)",
                    paddingLeft: "8px",
                    paddingRight: "8px",
                    textAlign: "left",
                  }}
                >
                  OR
                </span>
                <div
                  style={{
                    borderBottom: "1px solid rgb(44, 44, 57)",
                    flexGrow: "1",
                    paddingLeft: "8px",
                    paddingRight: "8px",
                    textAlign: "left",
                  }}
                />
              </div>

              {/* Perfect Lineup Option */}
              <div
                style={{
                  alignItems: "flex-start",
                  display: "flex",
                  gap: "16px",
                  justifyContent: "space-between",
                  paddingBottom: "16px",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "left",
                  }}
                >
                  <p
                    style={{
                      color: "rgb(251, 249, 255)",
                      fontSize: "14px",
                      lineHeight: "18px",
                      paddingBottom: "2px",
                      textAlign: "left",
                      margin: "0",
                    }}
                  >
                    Pick a perfect lineup
                  </p>
                  <p
                    style={{
                      color: "rgb(134, 134, 144)",
                      fontSize: "12px",
                      lineHeight: "18px",
                      textAlign: "left",
                      margin: "0",
                    }}
                  >
                    <span>Get </span>
                    <span>{selectedCount}</span>
                    <span> of </span>
                    <span>{selectedCount}</span>
                    <span> correct picks to win</span>
                  </p>
                </div>
                <div style={{ textAlign: "left" }}>
                  <div
                    style={{
                      backgroundColor: "rgb(128, 0, 255)",
                      borderRadius: "4px",
                      fontSize: "14px",
                      lineHeight: "20px",
                      paddingBottom: "8px",
                      paddingLeft: "8px",
                      paddingRight: "8px",
                      paddingTop: "8px",
                      textAlign: "left",
                      color: "white",
                    }}
                  >
                    <span>{payoutInfo.multiplier.toFixed(1)}</span>
                    <span>X</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payout Shift Warning */}
            <div
              style={{
                paddingBottom: "10px",
                paddingLeft: "0px",
                paddingRight: "0px",
                paddingTop: "0px",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  backgroundColor: "rgb(43, 43, 43)",
                  borderRadius: "10px",
                  display: "grid",
                  gap: "10px",
                  gridTemplate: "repeat(3, auto) / min-content auto",
                  paddingBottom: "20px",
                  paddingLeft: "16px",
                  paddingRight: "16px",
                  paddingTop: "16px",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    gridArea: "1 / 1 / 4 / 2",
                    textAlign: "left",
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      height: "24px",
                      width: "24px",
                    }}
                  >
                    <g fill="#8000FF" fillRule="evenodd">
                      <path d="M13.022 5.798 9.129 9.691l2.093 2.095-7.557.228.228-7.557L5.988 6.55 9.88 2.657l3.14 3.141ZM10.978 18.326l3.893-3.892-2.093-2.095 7.557-.229-.228 7.558-2.095-2.093-3.893 3.892-3.14-3.14Z" />
                    </g>
                  </svg>
                </div>
                <h3
                  style={{
                    color: "rgb(251, 249, 255)",
                    lineHeight: "20px",
                    marginBottom: "8px",
                    textAlign: "left",
                    margin: "0 0 8px 0",
                    fontSize: "16px",
                    fontWeight: "600",
                  }}
                >
                  Payout Shift
                </h3>
                <div
                  style={{
                    color: "rgb(199, 198, 206)",
                    fontSize: "14px",
                    lineHeight: "20px",
                    textAlign: "left",
                  }}
                >
                  Your payouts are different than the standard payouts as a
                  result of this combination of players.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Form Section */}
      <div
        style={{
          backgroundColor: "rgb(5, 6, 20)",
          borderBottom: "1px solid rgb(57, 57, 69)",
          borderRadius: "8px",
          marginBottom: "-10px",
          marginLeft: "-1px",
          marginRight: "-1px",
          marginTop: "20px",
          overflowX: "hidden",
          overflowY: "hidden",
          textAlign: "left",
        }}
      >
        <div
          style={{
            paddingBottom: "30px",
            paddingLeft: "10px",
            paddingRight: "10px",
            paddingTop: "20px",
            textAlign: "left",
          }}
        >
          <form
            aria-label="entry prediction form"
            style={{ textAlign: "left" }}
          >
            {/* Entry Fee and To Win Inputs */}
            <div
              style={{
                display: "grid",
                gap: "12px",
                gridTemplate: "none / repeat(2, 1fr)",
                marginBottom: "12px",
                textAlign: "left",
              }}
            >
              {/* Entry Fee */}
              <div style={{ textAlign: "left" }}>
                <div
                  style={{
                    backgroundColor: "rgb(18, 19, 32)",
                    borderBottom: "1px solid rgb(44, 44, 57)",
                    borderLeft: "1px solid rgb(44, 44, 57)",
                    borderRight: "1px solid rgb(44, 44, 57)",
                    borderTop: "1px solid rgb(44, 44, 57)",
                    borderRadius: "6px",
                    height: "100%",
                    paddingBottom: "8px",
                    paddingLeft: "12px",
                    paddingRight: "12px",
                    paddingTop: "8px",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      textAlign: "left",
                    }}
                  >
                    <label
                      htmlFor="entry-input"
                      style={{
                        color: "rgb(191, 191, 191)",
                        cursor: "default",
                        display: "grid",
                        fontSize: "12.8px",
                        lineHeight: "16px",
                        marginBottom: "2px",
                        textAlign: "left",
                        textTransform: "capitalize",
                      }}
                    >
                      Entry Fee
                    </label>
                  </div>
                  <div
                    style={{
                      alignItems: "center",
                      display: "inline-flex",
                      textAlign: "left",
                    }}
                  >
                    <div
                      style={{
                        alignItems: "center",
                        color: "rgb(251, 249, 255)",
                        display: "flex",
                        textAlign: "left",
                      }}
                    >
                      <span>$</span>
                      <input
                        aria-label="Lineup input"
                        placeholder="20"
                        max="10000"
                        type="number"
                        step=".01"
                        min="0"
                        value={entryAmount}
                        onChange={(e) =>
                          onEntryAmountChange(parseInt(e.target.value) || 0)
                        }
                        style={{
                          appearance: "auto",
                          backgroundColor: "rgb(18, 19, 32)",
                          borderRadius: "10px",
                          border: "none",
                          cursor: "text",
                          lineHeight: "normal",
                          overflowX: "clip",
                          overflowY: "clip",
                          paddingLeft: "3px",
                          paddingRight: "3px",
                          width: "100%",
                          color: "rgb(251, 249, 255)",
                          fontSize: "16px",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* To Win */}
              <div style={{ textAlign: "left" }}>
                <div
                  style={{
                    backgroundColor: "rgb(31, 32, 45)",
                    borderRadius: "6px",
                    cursor: "default",
                    height: "100%",
                    paddingBottom: "8px",
                    paddingLeft: "12px",
                    paddingRight: "12px",
                    paddingTop: "8px",
                    textAlign: "left",
                  }}
                >
                  <label
                    htmlFor="to-win-input"
                    style={{
                      cursor: "default",
                      display: "grid",
                      fontSize: "12.8px",
                      lineHeight: "16px",
                      marginBottom: "2px",
                      textAlign: "left",
                      textTransform: "capitalize",
                      color: "rgb(191, 191, 191)",
                    }}
                  >
                    To Win
                  </label>
                  <input
                    disabled
                    aria-label="to win"
                    placeholder="Enter amount"
                    type="text"
                    value={`$${payoutInfo.payout.toFixed(2)}`}
                    style={{
                      appearance: "auto",
                      borderRadius: "10px",
                      border: "none",
                      cursor: "default",
                      display: "inline-block",
                      lineHeight: "normal",
                      overflowX: "clip",
                      overflowY: "clip",
                      paddingLeft: "3px",
                      paddingRight: "3px",
                      width: "100%",
                      backgroundColor: "rgb(31, 32, 45)",
                      color: "rgb(251, 249, 255)",
                      fontSize: "16px",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Info Banner */}
            <button
              type="button"
              style={{
                alignItems: "center",
                appearance: "button",
                backgroundColor: "rgb(31, 32, 45)",
                borderRadius: "6px",
                cursor: "pointer",
                display: "flex",
                gap: "8px",
                marginBottom: "12px",
                minHeight: "54px",
                paddingBottom: "12px",
                paddingLeft: "12px",
                paddingRight: "12px",
                paddingTop: "12px",
                width: "100%",
                border: "none",
              }}
            >
              <div
                style={{
                  alignItems: "center",
                  alignSelf: "stretch",
                  cursor: "pointer",
                  display: "flex",
                  flexBasis: "0%",
                  flexGrow: "1",
                  textAlign: "left",
                }}
              >
                <p
                  style={{
                    color: "rgb(199, 198, 206)",
                    cursor: "pointer",
                    fontSize: "13px",
                    lineHeight: "19px",
                    textAlign: "left",
                    margin: "0",
                  }}
                >
                  <span>
                    Reversion lineup payouts are different than standard.
                  </span>
                  <span
                    style={{
                      color: "rgb(0, 191, 255)",
                      cursor: "pointer",
                      display: "inline",
                      fontSize: "13px",
                      lineHeight: "19px",
                      textAlign: "left",
                    }}
                  >
                    {" "}
                    Learn more
                  </span>
                </p>
              </div>
            </button>

            {/* Submit Button */}
            <div style={{ textAlign: "left" }}>
              <button
                type="button"
                onClick={onSubmitLineup}
                disabled={!validation.canSubmit}
                style={{
                  appearance: "button",
                  backgroundColor: validation.canSubmit
                    ? "rgb(128, 0, 255)"
                    : "rgb(60, 60, 60)",
                  borderRadius: "8px",
                  border: "none",
                  color: validation.canSubmit
                    ? "rgb(251, 249, 255)"
                    : "rgb(140, 140, 140)",
                  cursor: validation.canSubmit ? "pointer" : "not-allowed",
                  display: "inline-block",
                  fontWeight: "600",
                  height: "55px",
                  lineHeight: "20px",
                  textAlign: "center",
                  width: "100%",
                  fontSize: "16px",
                }}
              >
                {validation.canSubmit
                  ? "SUBMIT LINEUP"
                  : "FIX ERRORS TO SUBMIT"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
