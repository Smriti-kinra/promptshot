type GameState = "challenge" | "loading" | "results" | "impact" | "already-played";

interface LandingScreenProps {
  difficulty: string;
  hasPlayedToday: boolean;
  onDifficultyChange: (d: string) => void;
  onPlay: () => void;
}

export function LandingScreen({
  difficulty,
  hasPlayedToday,
  onDifficultyChange,
  onPlay,
}: LandingScreenProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 180px)",
        textAlign: "center",
        padding: "24px",
      }}
    >
      {/* Animated SVG Target & Arrow */}
      <div style={{ width: "160px", height: "160px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
        <svg width="160" height="160" viewBox="0 0 160 160" style={{ overflow: "visible" }}>
          <circle
            cx="80" cy="80" r="14"
            fill="none" stroke="var(--ps-amber)"
            style={{ animation: "ripple-expand 4.5s ease-out infinite", transformOrigin: "80px 80px" }}
          />
          <g style={{ animation: "target-wobble 4.5s ease-out infinite", transformOrigin: "80px 80px" }}>
            <circle cx="80" cy="80" r="56" fill="none" stroke="rgba(20, 184, 166, 0.15)" strokeWidth="1.5" strokeDasharray="6 4" />
            <circle cx="80" cy="80" r="42" fill="none" stroke="var(--ps-teal)" strokeWidth="3" />
            <circle cx="80" cy="80" r="28" fill="none" stroke="var(--ps-text-primary)" strokeWidth="1.5" strokeDasharray="4 3" />
            <circle cx="80" cy="80" r="14" fill="var(--ps-amber)" />
            <circle cx="80" cy="80" r="5" fill="#000" />
          </g>
          <g id="arrow-group" style={{ animation: "arrow-shoot 4.5s infinite", transformOrigin: "0px 0px" }}>
            <line x1="-32" y1="0" x2="-2" y2="0" stroke="var(--ps-text-primary)" strokeWidth="2" strokeLinecap="round" />
            <path d="M -32 -5 L -24 0 L -32 5 L -37 5 L -30 0 L -37 -5 Z" fill="var(--ps-teal)" />
            <polygon points="0,0 -8,-4 -6,0 -8,4" fill="var(--ps-amber)" />
          </g>
        </svg>
      </div>

      {/* Wordmark */}
      <div style={{ display: "flex", alignItems: "center", gap: "2px", justifyContent: "center", marginBottom: "12px" }}>
        <span style={{ fontFamily: "Space Grotesk", fontSize: "36px", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--ps-text-primary)" }}>Prompt</span>
        <span style={{ fontFamily: "Space Grotesk", fontSize: "36px", fontWeight: 400, fontStyle: "italic", letterSpacing: "-0.03em", color: "var(--ps-teal)", paddingRight: "6px" }}>Shot</span>
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--ps-amber)", alignSelf: "flex-end", marginBottom: "8px" }} />
      </div>

      <p style={{ fontSize: "var(--ps-text-body)", color: "var(--ps-text-secondary)", maxWidth: "320px", lineHeight: "1.6", marginBottom: "32px" }}>
        Can you shoot a perfect prompt??   Stop chatting with AI like it's your therapist and get the output in one clean shot. Thirsty data centers are counting on you.
      </p>

      {/* Difficulty selector */}
      <div style={{ marginBottom: "24px", width: "100%", maxWidth: "280px" }}>
        <div style={{ fontSize: "11px", color: "var(--ps-text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "var(--ps-font-mono)", marginBottom: "8px", textAlign: "center" }}>
          Select Level
        </div>
        <div style={{ display: "flex", background: "rgba(255, 255, 255, 0.03)", border: "1px solid var(--ps-border)", borderRadius: "24px", padding: "4px", gap: "4px" }}>
          {(["BEGINNER", "PRO", "EXPERT"] as const).map((d) => {
            const isSelected = difficulty === d;
            return (
              <button
                key={d}
                onClick={() => onDifficultyChange(d)}
                style={{
                  flex: 1,
                  height: "32px",
                  background: isSelected ? "var(--ps-amber)" : "transparent",
                  color: isSelected ? "#000" : "var(--ps-text-secondary)",
                  border: "none",
                  borderRadius: "20px",
                  fontSize: "10px",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "Space Grotesk",
                  letterSpacing: "0.05em",
                }}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>

      {/* CTA buttons */}
      {hasPlayedToday ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", alignItems: "center" }}>
          <button
            disabled
            style={{
              width: "100%",
              maxWidth: "280px",
              height: "52px",
              background: "rgba(255, 255, 255, 0.05)",
              color: "var(--ps-text-secondary)",
              border: "1px solid var(--ps-border)",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: 700,
              cursor: "not-allowed",
              fontFamily: "Space Grotesk"
            }}
          >
            Already Played Today
          </button>
        </div>
      ) : (
        <button
          onClick={onPlay}
          style={{ width: "100%", maxWidth: "280px", height: "52px", background: "var(--ps-amber)", color: "#000", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: 700, cursor: "pointer", transition: "transform 0.15s ease", fontFamily: "Space Grotesk" }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          Play Today's Challenge
        </button>
      )}

      <div style={{ marginTop: "40px", fontSize: "var(--ps-text-caption)", color: "var(--ps-text-secondary)", fontFamily: "var(--ps-font-mono)", lineHeight: "1.6" }}>
        💡 Fun Fact: Every sloppy, wordy prompt makes an AI server sweat and drink more water.<br />
        <span style={{ color: "var(--ps-teal)", fontWeight: 600 }}>Teal tracks Eco-savings</span> · <span style={{ color: "var(--ps-amber)", fontWeight: 600 }}>Amber tracks your Score</span>
      </div>
    </div>
  );
}
