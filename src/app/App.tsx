import { useState, useEffect } from "react";
import {
  getTodaysChallenge,
  type Challenge,
} from "./challenges";
import { LearnPanel } from "./components/LearnPanel";

type GameState =
  | "challenge"
  | "loading"
  | "results"
  | "already-played";

interface ScoreResult {
  accuracy: number;
  format: number;
  brevity: number;
  total: number;
}

interface GameHistory {
  id: string;
  score: number;
  date: string;
}

function simulateScore(
  userPrompt: string,
  _targetLength: number,
): ScoreResult {
  const length = userPrompt.length;
  const brevity = length < 80 ? 85 : length < 150 ? 65 : 45;
  const hasStructure =
    /\b(write|create|generate|explain|list|describe)\b/i.test(
      userPrompt,
    );
  const hasDetails = userPrompt.split(/[.,;]/).length > 1;
  const accuracy =
    hasStructure && hasDetails
      ? 75 + Math.random() * 20
      : 55 + Math.random() * 20;
  const format = hasStructure
    ? 70 + Math.random() * 25
    : 50 + Math.random() * 20;
  return {
    accuracy: Math.round(accuracy),
    format: Math.round(format),
    brevity: Math.round(brevity),
    total: Math.round(accuracy + format + brevity),
  };
}

function getScoreLabel(score: number): string {
  if (score > 240) return "Bullseye 🎯";
  if (score >= 180) return "On target";
  if (score >= 120) return "Close range";
  return "Missed";
}

function getBrevityColor(length: number): string {
  if (length < 80) return "#14B8A6";
  if (length < 150) return "#F59E0B";
  return "#EF4444";
}

const pageStyle = {
  fontFamily: "Inter, sans-serif",
  background: "var(--ps-background)",
  color: "var(--ps-text-primary)",
  minHeight: "100vh",
  padding: "24px",
} as const;

function BookIcon() {
  return (
    <svg className="bg-[#00000000] bg-[#00000000] bg-[#04040400] bg-[#0b0b0b00] bg-[#1b191900] bg-[#28222200] bg-[#2e262600] bg-[#362a2a00] bg-[#52383800] bg-[#72404000] bg-[#80404000] bg-[#8d3f3f00] bg-[#953e3e00] bg-[#9a3d3d00] bg-[#a03b3b00] bg-[#ab3a3a00] bg-[#b3383800] bg-[#bd353500] bg-[#c8323200] bg-[#db2a2a00] bg-[#ea232300] bg-[#f0202000] bg-[#f61c1c00] bg-[#fd191900] bg-[#ff141400] bg-[#ff0e0e00] bg-[#ff020200] bg-[#ff000000] bg-[#ff000000] bg-[#ff000000] bg-[#ff000000] bg-[#ff000000] bg-[#ff000000] bg-[#ff000000] bg-[#ff000000] bg-[#ff000000] bg-[#ff000000] bg-[#ff000000] bg-[#ff000000] bg-[#ff000000] bg-[#ff000000] bg-[#ff000000] bg-[#ff000000] bg-[#ff000000] bg-[#ff000000] bg-[#ff000000] bg-[#ff000000] bg-[#ff000000] bg-[#ff000000] bg-[#ff000000] bg-[#ff000000] bg-[#ee151500] bg-[#9e313100] bg-[#341f1f00] bg-[#00000000] bg-[#00000000] bg-[#00000000] bg-[#00000000] bg-[#00000000] bg-[#00000000] bg-[#00000000] bg-[#00000000] bg-[#00000000] bg-[#00000000] bg-[#00000000] bg-[#00000000] bg-[#00000000] bg-[#00000000] bg-[#00000000] bg-[#00000000] bg-[#00000000] bg-[#00000000] bg-[#00000000] bg-[#00000000] bg-[#00000000] bg-[#00000000] bg-[#00000000]"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function Header({
  streak,
  onOpenLearn,
}: {
  streak: number;
  onOpenLearn: () => void;
}) {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "40px",
      }}
    >
      <h1
        style={{
          fontSize: "var(--ps-text-heading)",
          margin: 0,
          fontWeight: 600,
        }}
      >
        PromptShot
      </h1>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div style={{ fontSize: "var(--ps-text-body)" }}>
          🔥 {streak}
        </div>
        <button
          onClick={onOpenLearn}
          title="Reference"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            display: "flex",
            alignItems: "center",
            color: "#888880",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "#F0EFE8")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "#888880")
          }
        >
          <BookIcon />
        </button>
      </div>
    </header>
  );
}

export default function App() {
  const [gameState, setGameState] =
    useState<GameState>("challenge");
  const [challenge] = useState<Challenge>(getTodaysChallenge());
  const [userPrompt, setUserPrompt] = useState("");
  const [score, setScore] = useState<ScoreResult | null>(null);
  const [streak, setStreak] = useState(0);
  const [showIdealPrompt, setShowIdealPrompt] = useState(false);
  const [showImpactCard, setShowImpactCard] = useState(false);
  const [targetExpanded, setTargetExpanded] = useState(true);
  const [animateScore, setAnimateScore] = useState(false);
  const [showLearnPanel, setShowLearnPanel] = useState(false);

  useEffect(() => {
    const savedStreak = localStorage.getItem(
      "promptshot_streak",
    );
    if (savedStreak) setStreak(parseInt(savedStreak, 10));

    const lastPlayed = localStorage.getItem(
      "promptshot_last_played",
    );
    const today = new Date().toISOString().split("T")[0];

    if (lastPlayed === today) {
      setGameState("already-played");
      const history: GameHistory[] = JSON.parse(
        localStorage.getItem("promptshot_history") || "[]",
      );
      const todaysGame = history.find(
        (h) => h.id === challenge.id,
      );
      if (todaysGame) {
        setScore({
          accuracy: 0,
          format: 0,
          brevity: 0,
          total: todaysGame.score,
        });
      }
    }
  }, [challenge.id]);

  const handleSubmit = () => {
    if (!userPrompt.trim()) return;
    setGameState("loading");
    setTimeout(() => {
      const result = simulateScore(
        userPrompt,
        challenge.charCount,
      );
      setScore(result);
      setGameState("results");
      setTargetExpanded(false);
      setTimeout(() => setAnimateScore(true), 100);
      setTimeout(() => setShowImpactCard(true), 1600);
      const today = new Date().toISOString().split("T")[0];
      localStorage.setItem("promptshot_last_played", today);
      const history: GameHistory[] = JSON.parse(
        localStorage.getItem("promptshot_history") || "[]",
      );
      history.push({
        id: challenge.id,
        score: result.total,
        date: today,
      });
      localStorage.setItem(
        "promptshot_history",
        JSON.stringify(history),
      );
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem(
        "promptshot_streak",
        newStreak.toString(),
      );
    }, 1400);
  };

  const handleShare = () => {
    if (!score) return;
    const dots = "●●●●●"
      .split("")
      .map((_, i) => {
        const threshold = (i + 1) * 60;
        if (score.total >= threshold) return "●";
        if (score.total >= threshold - 30) return "◐";
        return "○";
      })
      .join("");
    const text = `PromptShot #${challenge.id} 🎯\n${score.total}/300 ${dots}\n💧 ~10ml · ${score.brevity < 60 ? "Brevity needs work" : "Concise!"}`;
    const tryClipboard = async () => {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const el = document.createElement("textarea");
        el.value = text;
        el.style.position = "fixed";
        el.style.opacity = "0";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
    };
    tryClipboard().then(() => alert("Copied to clipboard!"));
  };

  if (gameState === "already-played") {
    return (
      <>
        <div style={pageStyle}>
          <div style={{ maxWidth: "500px", margin: "0 auto" }}>
            <Header
              streak={streak}
              onOpenLearn={() => setShowLearnPanel(true)}
            />
            <div
              style={{
                background: "var(--ps-surface)",
                borderRadius: "16px",
                padding: "32px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "var(--ps-text-display)",
                  marginBottom: "16px",
                }}
              >
                {score ? score.total : "—"}/300
              </div>
              <p
                style={{
                  color: "var(--ps-text-secondary)",
                  fontSize: "var(--ps-text-body)",
                  marginBottom: "24px",
                }}
              >
                You've already played today!
              </p>
              <p
                style={{
                  color: "var(--ps-text-secondary)",
                  fontSize: "var(--ps-text-secondary-size)",
                }}
              >
                Come back tomorrow for a new challenge
              </p>
            </div>
          </div>
        </div>
        <LearnPanel
          isOpen={showLearnPanel}
          onClose={() => setShowLearnPanel(false)}
        />
      </>
    );
  }

  return (
    <>
      <div style={pageStyle}>
        <div style={{ maxWidth: "500px", margin: "0 auto" }}>
          <Header
            streak={streak}
            onOpenLearn={() => setShowLearnPanel(true)}
          />

          {/* Challenge Card */}
          <div
            style={{
              background: "var(--ps-surface)",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "8px",
                marginBottom: "16px",
              }}
            >
              <span
                style={{
                  background: "var(--ps-teal)",
                  color: "#000",
                  padding: "4px 12px",
                  borderRadius: "9999px",
                  fontSize: "var(--ps-text-caption)",
                  fontWeight: 600,
                }}
              >
                {challenge.category}
              </span>
              <span
                style={{
                  background: "rgba(245, 158, 11, 0.15)",
                  color: "var(--ps-amber)",
                  padding: "4px 20px",
                  borderRadius: "9999px",
                  fontSize: "var(--ps-text-caption)",
                  fontWeight: 600,
                }}
              >
                {challenge.difficulty}
              </span>
            </div>
            <div
              style={{
                color: "var(--ps-text-secondary)",
                fontSize: "var(--ps-text-secondary-size)",
                marginBottom: "8px",
              }}
            >
              Today's target output
            </div>
            <div
              style={{
                maxHeight: targetExpanded ? "240px" : "60px",
                overflow: "auto",
                background: "#0A0A0A",
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "8px",
                fontFamily:
                  challenge.category === "CODE"
                    ? "monospace"
                    : "Inter",
                fontSize: "var(--ps-text-secondary-size)",
                lineHeight: "1.6",
                transition: "max-height 0.3s ease",
              }}
            >
              {challenge.targetOutput}
            </div>
            {gameState === "results" && !targetExpanded && (
              <button
                onClick={() => setTargetExpanded(true)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--ps-amber)",
                  fontSize: "var(--ps-text-caption)",
                  cursor: "pointer",
                  padding: 0,
                  marginBottom: "8px",
                }}
              >
                show more
              </button>
            )}
            <div
              style={{
                color: "var(--ps-text-secondary)",
                fontSize: "var(--ps-text-caption)",
              }}
            >
              {challenge.charCount} characters
            </div>
          </div>

          {/* Challenge input */}
          {gameState === "challenge" && (
            <>
              <div
                style={{
                  color: "var(--ps-text-secondary)",
                  fontSize: "var(--ps-text-secondary-size)",
                  marginBottom: "8px",
                }}
              >
                Write the prompt that generates this:
              </div>
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Describe exactly what you want the AI to produce..."
                style={{
                  width: "100%",
                  minHeight: "140px",
                  background: "#0A0A0A",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  padding: "16px",
                  color: "var(--ps-text-primary)",
                  fontSize: "var(--ps-text-body)",
                  fontFamily: "Inter, sans-serif",
                  resize: "vertical",
                  marginBottom: "8px",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <span
                  style={{
                    fontSize: "var(--ps-text-caption)",
                    color: getBrevityColor(userPrompt.length),
                  }}
                >
                  {userPrompt.length} characters
                </span>
                <span
                  style={{
                    fontSize: "var(--ps-text-caption)",
                    color: "var(--ps-text-secondary)",
                  }}
                >
                  Shorter prompts score higher on brevity
                </span>
              </div>
              <button
                onClick={handleSubmit}
                disabled={!userPrompt.trim()}
                style={{
                  width: "100%",
                  height: "48px",
                  background: userPrompt.trim()
                    ? "var(--ps-amber)"
                    : "#444",
                  color: "#000",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "var(--ps-text-body)",
                  fontWeight: 600,
                  cursor: userPrompt.trim()
                    ? "pointer"
                    : "not-allowed",
                  transition: "background 0.2s",
                }}
              >
                Shoot →
              </button>
            </>
          )}

          {/* Loading */}
          {gameState === "loading" && (
            <div
              style={{ textAlign: "center", padding: "40px 0" }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  margin: "0 auto 16px",
                  border: "3px solid var(--ps-amber)",
                  borderRadius: "50%",
                  borderTopColor: "transparent",
                  animation: "spin 1.2s linear infinite",
                }}
              />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <div
                style={{
                  color: "var(--ps-text-secondary)",
                  fontSize: "var(--ps-text-secondary-size)",
                }}
              >
                Analyzing your shot...
              </div>
            </div>
          )}

          {/* Results */}
          {gameState === "results" && score && (
            <>
              {/* Bullseye */}
              <div
                style={{
                  textAlign: "center",
                  marginBottom: "32px",
                }}
              >
                <svg
                  width="200"
                  height="200"
                  viewBox="0 0 200 200"
                  style={{ margin: "0 auto" }}
                >
                  <circle
                    cx="100"
                    cy="100"
                    r="85"
                    fill="none"
                    stroke="#222"
                    strokeWidth="12"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="85"
                    fill="none"
                    stroke="var(--ps-amber)"
                    strokeWidth="12"
                    strokeDasharray={`${2 * Math.PI * 85}`}
                    strokeDashoffset={`${2 * Math.PI * 85 * (1 - score.accuracy / 100)}`}
                    transform="rotate(-90 100 100)"
                    style={{
                      transition: animateScore
                        ? "stroke-dashoffset 0.8s ease-out 0s"
                        : "none",
                    }}
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="60"
                    fill="none"
                    stroke="#222"
                    strokeWidth="12"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="60"
                    fill="none"
                    stroke="var(--ps-amber)"
                    strokeWidth="12"
                    strokeDasharray={`${2 * Math.PI * 60}`}
                    strokeDashoffset={`${2 * Math.PI * 60 * (1 - score.format / 100)}`}
                    transform="rotate(-90 100 100)"
                    style={{
                      transition: animateScore
                        ? "stroke-dashoffset 0.8s ease-out 0.2s"
                        : "none",
                    }}
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="35"
                    fill="none"
                    stroke="#222"
                    strokeWidth="12"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="35"
                    fill="none"
                    stroke="var(--ps-amber)"
                    strokeWidth="12"
                    strokeDasharray={`${2 * Math.PI * 35}`}
                    strokeDashoffset={`${2 * Math.PI * 35 * (1 - score.brevity / 100)}`}
                    transform="rotate(-90 100 100)"
                    style={{
                      transition: animateScore
                        ? "stroke-dashoffset 0.8s ease-out 0.4s"
                        : "none",
                    }}
                  />
                  <text
                    x="100"
                    y="95"
                    textAnchor="middle"
                    fill="var(--ps-text-primary)"
                    fontSize="40"
                    fontWeight="600"
                  >
                    {score.total}
                  </text>
                  <text
                    x="100"
                    y="115"
                    textAnchor="middle"
                    fill="var(--ps-text-secondary)"
                    fontSize="20"
                  >
                    /300
                  </text>
                </svg>
                <div
                  style={{
                    fontSize: "var(--ps-text-subhead)",
                    color: "var(--ps-amber)",
                    marginTop: "16px",
                    fontWeight: 600,
                  }}
                >
                  {getScoreLabel(score.total)}
                </div>
              </div>

              {/* Score Breakdown */}
              <div style={{ marginBottom: "24px" }}>
                {[
                  { label: "Accuracy", value: score.accuracy },
                  { label: "Format", value: score.format },
                  { label: "Brevity", value: score.brevity },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{ marginBottom: "12px" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "4px",
                        fontSize:
                          "var(--ps-text-secondary-size)",
                      }}
                    >
                      <span
                        style={{
                          color: "var(--ps-text-secondary)",
                        }}
                      >
                        {item.label}
                      </span>
                      <span
                        style={{
                          color: "var(--ps-text-primary)",
                        }}
                      >
                        {item.value}/100
                      </span>
                    </div>
                    <div
                      style={{
                        height: "4px",
                        background: "#222",
                        borderRadius: "9999px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${item.value}%`,
                          height: "100%",
                          background: "var(--ps-amber)",
                          transition: animateScore
                            ? "width 0.6s ease-out"
                            : "none",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Impact Card */}
              {showImpactCard && (
                <div
                  style={{
                    background: "var(--ps-surface)",
                    borderLeft: "4px solid var(--ps-teal)",
                    padding: "24px",
                    borderRadius: "8px",
                    marginBottom: "24px",
                    animation: "slideUp 0.6s ease-out forwards",
                  }}
                >
                  <style>{`@keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }`}</style>
                  <div
                    style={{
                      marginBottom: "8px",
                      fontSize: "var(--ps-text-secondary-size)",
                    }}
                  >
                    This prompt used{" "}
                    <span
                      style={{
                        color: "var(--ps-teal)",
                        fontWeight: 600,
                      }}
                    >
                      1
                    </span>{" "}
                    API call
                  </div>
                  <div
                    style={{
                      marginBottom:
                        score.total < 180 ? "16px" : "0",
                      fontSize: "var(--ps-text-secondary-size)",
                      color: "var(--ps-text-secondary)",
                    }}
                  >
                    ≈{" "}
                    <span style={{ color: "var(--ps-teal)" }}>
                      10ml
                    </span>{" "}
                    water · ≈{" "}
                    <span style={{ color: "var(--ps-teal)" }}>
                      0.1g
                    </span>{" "}
                    CO₂
                  </div>
                  {score.total < 180 && (
                    <>
                      <div
                        style={{
                          marginBottom: "8px",
                          fontSize:
                            "var(--ps-text-secondary-size)",
                        }}
                      >
                        A score this low typically means 3+
                        follow-up prompts to reach this output
                      </div>
                      <div
                        style={{
                          marginBottom: "16px",
                          fontSize:
                            "var(--ps-text-secondary-size)",
                        }}
                      >
                        That adds ≈ 30ml water — about{" "}
                        <span
                          style={{
                            color: "var(--ps-amber)",
                            fontWeight: 600,
                          }}
                        >
                          a tablespoon
                        </span>
                      </div>
                    </>
                  )}
                  <div
                    style={{
                      fontSize: "var(--ps-text-caption)",
                      color: "var(--ps-text-secondary)",
                      fontStyle: "italic",
                    }}
                  >
                    Better prompts = less AI = less water. This
                    is the skill.
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "16px" }}>
                <button
                  onClick={() =>
                    setShowIdealPrompt(!showIdealPrompt)
                  }
                  style={{
                    flex: 1,
                    height: "48px",
                    background: "transparent",
                    border:
                      "1px solid var(--ps-text-secondary)",
                    color: "var(--ps-text-primary)",
                    borderRadius: "8px",
                    fontSize: "var(--ps-text-secondary-size)",
                    cursor: "pointer",
                  }}
                >
                  See ideal prompt →
                </button>
                <button
                  onClick={handleShare}
                  style={{
                    flex: 1,
                    height: "48px",
                    background: "var(--ps-amber)",
                    border: "none",
                    color: "#000",
                    borderRadius: "8px",
                    fontSize: "var(--ps-text-secondary-size)",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Share result
                </button>
              </div>

              {/* Ideal Prompt */}
              {showIdealPrompt && (
                <div
                  style={{
                    marginTop: "24px",
                    background: "var(--ps-surface)",
                    padding: "24px",
                    borderRadius: "8px",
                    animation: "slideUp 0.4s ease-out",
                  }}
                >
                  <div
                    style={{
                      color: "var(--ps-text-secondary)",
                      fontSize: "var(--ps-text-secondary-size)",
                      marginBottom: "12px",
                    }}
                  >
                    Ideal prompt:
                  </div>
                  <div
                    style={{
                      color: "var(--ps-text-primary)",
                      fontSize: "var(--ps-text-body)",
                      lineHeight: "1.6",
                    }}
                  >
                    "{challenge.idealPrompt}"
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <LearnPanel
        isOpen={showLearnPanel}
        onClose={() => setShowLearnPanel(false)}
      />
    </>
  );
}