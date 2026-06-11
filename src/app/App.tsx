import { useState, useEffect } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import type { Challenge } from "../lib/supabase";
import { calculateAndUpdateStreak } from "../lib/streak";
import { LearnPanel } from "./components/LearnPanel";
import { Topbar } from "./components/Topbar";

// ─── localStorage keys ────────────────────────────────────────────────────────

const LS_DIFFICULTY = "promptshot_difficulty";
const LS_HISTORY = "promptshot_history";
const LS_STREAK = "promptshot_streak";
const LS_LAST_PLAYED = "promptshot_last_played";

interface LocalScore {
  played_at: string;
  accuracy: number;
  format: number;
  brevity: number;
  total: number;
  challenge_id?: string;
  user_prompt?: string;
}

function getLocalHistory(): LocalScore[] {
  try {
    return JSON.parse(localStorage.getItem(LS_HISTORY) ?? "[]");
  } catch {
    return [];
  }
}

function saveLocalScore(entry: LocalScore) {
  const history = getLocalHistory();
  history.push(entry);
  localStorage.setItem(LS_HISTORY, JSON.stringify(history));
}

function calculateLocalStreak(): number {
  const history = getLocalHistory();
  if (!history.length) return 1;

  const today = new Date().toISOString().split("T")[0];
  const dates = [...new Set(history.map((s) => s.played_at))].sort().reverse();

  let streak = 0;
  let expected = today;

  for (const date of dates) {
    if (date === expected) {
      streak++;
      const d = new Date(expected);
      d.setDate(d.getDate() - 1);
      expected = d.toISOString().split("T")[0];
    } else {
      break;
    }
  }

  localStorage.setItem(LS_STREAK, String(streak));
  localStorage.setItem(LS_LAST_PLAYED, today);
  return streak;
}

async function migrateLocalScoresToSupabase(userId: string) {
  const history = getLocalHistory();
  if (!history.length) return;

  const rows = history.map((s) => ({
    user_id: userId,
    challenge_id: s.challenge_id ?? null,
    accuracy: s.accuracy,
    format: s.format,
    brevity: s.brevity,
    total: s.total,
    user_prompt: s.user_prompt ?? "",
    played_at: s.played_at,
  }));

  await supabase.from("scores").upsert(rows, { onConflict: "user_id,played_at" });

  localStorage.removeItem(LS_HISTORY);
  localStorage.removeItem(LS_STREAK);
  localStorage.removeItem(LS_LAST_PLAYED);
}

// ─── helpers ──────────────────────────────────────────────────────────────────

const EDGE_URL =
  "https://fvtaoeunqeqnuotydrtv.supabase.co/functions/v1/make-server-488928a2/score";

function getDayOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d.getTime() - start.getTime()) / 86400000);
}

async function loadChallenge(difficulty: string): Promise<Challenge | null> {
  const dayOfYear = getDayOfYear(new Date());
  const { data } = await supabase
    .from("challenges")
    .select("*")
    .eq("difficulty", difficulty)
    .eq("active", true)
    .order("id");
  if (!data || data.length === 0) return null;
  return data[dayOfYear % data.length];
}

async function scorePrompt(
  userPrompt: string,
  challenge: Challenge,
  session: Session,
): Promise<ScoreResult> {
  const res = await fetch(EDGE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      userPrompt,
      targetOutput: challenge.target_output,
      idealPrompt: challenge.ideal_prompt,
    }),
  });
  if (!res.ok) throw new Error(`Score request failed: ${res.status}`);
  const data = await res.json();
  return { accuracy: data.accuracy, format: data.format, brevity: data.brevity, total: data.total };
}

function mockScore(userPrompt: string): ScoreResult {
  const len = userPrompt.length;
  const brevity = len < 80 ? 85 : len < 150 ? 65 : 45;
  const hasStructure = /\b(write|create|generate|explain|list|describe)\b/i.test(userPrompt);
  const hasDetails = userPrompt.split(/[.,;]/).length > 1;
  const accuracy = Math.round(
    hasStructure && hasDetails ? 75 + Math.random() * 20 : 55 + Math.random() * 20,
  );
  const format = Math.round(hasStructure ? 70 + Math.random() * 25 : 50 + Math.random() * 20);
  return { accuracy, format, brevity, total: accuracy + format + brevity };
}

const GUEST_SCORE_URL =
  "https://fvtaoeunqeqnuotydrtv.supabase.co/functions/v1/make-server-488928a2/score-guest";

async function simulateScore(
  userPrompt: string,
  targetOutput: string,
  idealPrompt: string,
): Promise<ScoreResult> {
  const [res] = await Promise.all([
    fetch(GUEST_SCORE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userPrompt, targetOutput, idealPrompt }),
    }).then((r) => r.json()).catch(() => null),
    new Promise((resolve) => setTimeout(resolve, 1400)),
  ]);

  if (res && typeof res.accuracy === "number") {
    return { accuracy: res.accuracy, format: res.format, brevity: res.brevity, total: res.total };
  }
  return mockScore(userPrompt);
}

// ─── types ────────────────────────────────────────────────────────────────────

type GameState = "loading-challenge" | "challenge" | "scoring" | "results" | "already-played";

interface ScoreResult {
  accuracy: number;
  format: number;
  brevity: number;
  total: number;
}

// ─── hooks ────────────────────────────────────────────────────────────────────

function useCountdownToMidnight() {
  const getTimeLeft = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const ms = midnight.getTime() - now.getTime();
    const totalMinutes = Math.floor(ms / 60000);
    return { h: Math.floor(totalMinutes / 60), m: totalMinutes % 60 };
  };

  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 60000);
    return () => clearInterval(id);
  }, []);

  return timeLeft;
}

// ─── ui helpers ───────────────────────────────────────────────────────────────

function getScoreLabel(total: number): string {
  if (total > 240) return "Bullseye 🎯";
  if (total >= 180) return "On target";
  if (total >= 120) return "Close range";
  return "Missed";
}

function getBrevityColor(length: number): string {
  if (length < 80) return "#14B8A6";
  if (length < 150) return "#F59E0B";
  return "#EF4444";
}

function LoadingSkeleton() {
  return (
    <>
      <style>{`@keyframes pulse { 0%,100% { opacity:.35 } 50% { opacity:.7 } }`}</style>
      {[{ h: 80 }, { h: 160 }, { h: 48 }].map((b, i) => (
        <div
          key={i}
          style={{
            height: `${b.h}px`,
            background: "#1a1a1a",
            borderRadius: "8px",
            marginBottom: "16px",
            animation: `pulse 1.4s ease-in-out ${i * 0.15}s infinite`,
          }}
        />
      ))}
    </>
  );
}

// ─── already-played screen ────────────────────────────────────────────────────

function AlreadyPlayed({
  score,
  challenge,
  onOpenLearn,
}: {
  score: ScoreResult | null;
  challenge: Challenge | null;
  onOpenLearn: () => void;
}) {
  const { h, m } = useCountdownToMidnight();

  const bars = [
    { label: "Accuracy", value: score?.accuracy ?? 0 },
    { label: "Format", value: score?.format ?? 0 },
    { label: "Brevity", value: score?.brevity ?? 0 },
  ];

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        background: "var(--ps-background)",
        color: "var(--ps-text-primary)",
        minHeight: "calc(100vh - 56px)",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
        <div style={{ background: "var(--ps-surface)", borderRadius: "16px", padding: "32px" }}>

          {challenge && (
            <div style={{ display: "flex", gap: "8px", marginBottom: "24px", justifyContent: "center" }}>
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
                  background: "rgba(245,158,11,0.15)",
                  color: "var(--ps-amber)",
                  padding: "4px 12px",
                  borderRadius: "9999px",
                  fontSize: "var(--ps-text-caption)",
                  fontWeight: 600,
                }}
              >
                {challenge.difficulty}
              </span>
            </div>
          )}

          <div style={{ fontSize: "var(--ps-text-display)", textAlign: "center", marginBottom: "24px" }}>
            {score ? score.total : "—"}/300
          </div>

          {score && (
            <div style={{ marginBottom: "24px" }}>
              {bars.map((item) => (
                <div key={item.label} style={{ marginBottom: "12px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "4px",
                      fontSize: "var(--ps-text-secondary-size)",
                    }}
                  >
                    <span style={{ color: "var(--ps-text-secondary)" }}>{item.label}</span>
                    <span style={{ color: "var(--ps-text-primary)" }}>{item.value}/100</span>
                  </div>
                  <div style={{ height: "4px", background: "#222", borderRadius: "9999px", overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${item.value}%`,
                        height: "100%",
                        background: "var(--ps-amber)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ fontSize: "14px", color: "#888880", textAlign: "center", marginBottom: "24px" }}>
            Next challenge in {h}h {m}m
          </div>

          <div style={{ textAlign: "center" }}>
            <button
              onClick={onOpenLearn}
              style={{
                background: "none",
                border: "none",
                color: "#F59E0B",
                fontSize: "14px",
                cursor: "pointer",
                padding: 0,
                textDecoration: "none",
              }}
            >
              Review your prompting technique →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  const [gameState, setGameState] = useState<GameState>("loading-challenge");
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [difficulty, setDifficulty] = useState<string>(
    () => localStorage.getItem(LS_DIFFICULTY) ?? "BEGINNER",
  );

  const [userPrompt, setUserPrompt] = useState("");
  const [score, setScore] = useState<ScoreResult | null>(null);
  const [streak, setStreak] = useState(0);
  const [showAutoIdeal, setShowAutoIdeal] = useState(false);
  const [showImpactCard, setShowImpactCard] = useState(false);
  const [targetExpanded, setTargetExpanded] = useState(true);
  const [animateScore, setAnimateScore] = useState(false);
  const [showLearnPanel, setShowLearnPanel] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setSessionLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, s) => {
      if (event === "SIGNED_IN" && s) {
        await migrateLocalScoresToSupabase(s.user.id);
      }
      setSession(s);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_DIFFICULTY, difficulty);
  }, [difficulty]);

  useEffect(() => {
    if (sessionLoading) return;
    setGameState("loading-challenge");
    setScore(null);
    setShowAutoIdeal(false);
    setShowImpactCard(false);
    setAnimateScore(false);
    setTargetExpanded(true);
    setUserPrompt("");

    (async () => {
      const today = new Date().toISOString().split("T")[0];

      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("streak")
          .eq("id", session.user.id)
          .single();
        setStreak(profile?.streak ?? 0);
      } else {
        setStreak(parseInt(localStorage.getItem(LS_STREAK) ?? "0", 10));
      }

      const ch = await loadChallenge(difficulty);
      setChallenge(ch);

      if (!ch) {
        setGameState("challenge");
        return;
      }

      if (session) {
        const { data: existing } = await supabase
          .from("scores")
          .select("*")
          .eq("user_id", session.user.id)
          .eq("played_at", today)
          .single();

        if (existing) {
          setScore({
            accuracy: existing.accuracy,
            format: existing.format,
            brevity: existing.brevity,
            total: existing.total,
          });
          setGameState("already-played");
        } else {
          setGameState("challenge");
        }
      } else {
        const todayEntry = getLocalHistory().find((s) => s.played_at === today);
        if (todayEntry) {
          setScore({
            accuracy: todayEntry.accuracy,
            format: todayEntry.format,
            brevity: todayEntry.brevity,
            total: todayEntry.total,
          });
          setGameState("already-played");
        } else {
          setGameState("challenge");
        }
      }
    })();
  }, [session, difficulty, sessionLoading]);

  const handleDifficultyChange = (d: string) => {
    setDifficulty(d);
  };

  const handleSubmit = async () => {
    if (!userPrompt.trim() || !challenge) return;
    setGameState("scoring");

    let result: ScoreResult;

    if (session) {
      try {
        result = await scorePrompt(userPrompt, challenge, session);
      } catch (err) {
        console.error("Scoring error, using local fallback:", err);
        result = mockScore(userPrompt);
      }

      const today = new Date().toISOString().split("T")[0];
      await supabase.from("scores").insert({
        user_id: session.user.id,
        challenge_id: challenge.id,
        accuracy: result.accuracy,
        format: result.format,
        brevity: result.brevity,
        total: result.total,
        user_prompt: userPrompt,
        played_at: today,
      });

      const newStreak = await calculateAndUpdateStreak(session.user.id);
      setStreak(newStreak);
    } else {
      result = await simulateScore(userPrompt, challenge.target_output, challenge.ideal_prompt);

      const today = new Date().toISOString().split("T")[0];
      saveLocalScore({
        played_at: today,
        accuracy: result.accuracy,
        format: result.format,
        brevity: result.brevity,
        total: result.total,
        challenge_id: challenge.id,
        user_prompt: userPrompt,
      });

      const newStreak = calculateLocalStreak();
      setStreak(newStreak);
    }

    setScore(result);
    setGameState("results");
    setTargetExpanded(false);
    setTimeout(() => setAnimateScore(true), 100);
    setTimeout(() => setShowImpactCard(true), 1600);
    if (result.total < 210) {
      setTimeout(() => setShowAutoIdeal(true), 1500);
    }
  };

  const handleShare = () => {
    if (!score || !challenge) return;
    const dots = "●●●●●"
      .split("")
      .map((_, i) => {
        const threshold = (i + 1) * 60;
        if (score.total >= threshold) return "●";
        if (score.total >= threshold - 30) return "◐";
        return "○";
      })
      .join("");
    const text = `PromptShot — ${challenge.id}\n${score.total}/300 ${dots}\n💧 ~10ml · ${challenge.difficulty}`;
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

  const topbar = (
    <Topbar
      session={session}
      streak={streak}
      difficulty={difficulty}
      onDifficultyChange={handleDifficultyChange}
      onOpenLearn={() => setShowLearnPanel(true)}
      showHint={showHint}
      onToggleHint={() => setShowHint((v) => !v)}
    />
  );

  const contentStyle: React.CSSProperties = {
    fontFamily: "Inter, sans-serif",
    background: "var(--ps-background)",
    color: "var(--ps-text-primary)",
    minHeight: "calc(100vh - 56px)",
    padding: "24px",
  };

  if (gameState === "already-played") {
    return (
      <>
        {topbar}
        <AlreadyPlayed
          score={score}
          challenge={challenge}
          onOpenLearn={() => setShowLearnPanel(true)}
        />
        <LearnPanel isOpen={showLearnPanel} onClose={() => setShowLearnPanel(false)} />
      </>
    );
  }

  return (
    <>
      {topbar}
      <div style={contentStyle}>
        <div style={{ maxWidth: "500px", margin: "0 auto" }}>

          {gameState === "loading-challenge" && <LoadingSkeleton />}

          {challenge && gameState !== "loading-challenge" && (
            <div style={{ background: "var(--ps-surface)", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                <span style={{ background: "var(--ps-teal)", color: "#000", padding: "4px 12px", borderRadius: "9999px", fontSize: "var(--ps-text-caption)", fontWeight: 600 }}>
                  {challenge.category}
                </span>
                <span style={{ background: "rgba(245,158,11,0.15)", color: "var(--ps-amber)", padding: "4px 12px", borderRadius: "9999px", fontSize: "var(--ps-text-caption)", fontWeight: 600 }}>
                  {challenge.difficulty}
                </span>
              </div>
              <div style={{ color: "var(--ps-text-secondary)", fontSize: "var(--ps-text-secondary-size)", marginBottom: "8px" }}>
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
                  fontFamily: challenge.category === "CODE" ? "monospace" : "Inter",
                  fontSize: "var(--ps-text-secondary-size)",
                  lineHeight: "1.6",
                  transition: "max-height 0.3s ease",
                }}
              >
                {challenge.target_output}
              </div>
              {gameState === "results" && !targetExpanded && (
                <button
                  onClick={() => setTargetExpanded(true)}
                  style={{ background: "transparent", border: "none", color: "var(--ps-amber)", fontSize: "var(--ps-text-caption)", cursor: "pointer", padding: 0, marginBottom: "8px" }}
                >
                  show more
                </button>
              )}
              <div style={{ color: "var(--ps-text-secondary)", fontSize: "var(--ps-text-caption)" }}>
                {challenge.char_count} characters
              </div>
            </div>
          )}

          {gameState === "challenge" && (
            <>
              <div style={{ color: "var(--ps-text-secondary)", fontSize: "var(--ps-text-secondary-size)", marginBottom: "8px" }}>
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
                  boxSizing: "border-box",
                }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <span style={{ fontSize: "var(--ps-text-caption)", color: getBrevityColor(userPrompt.length) }}>
                  {userPrompt.length} characters
                </span>
                <span style={{ fontSize: "var(--ps-text-caption)", color: "var(--ps-text-secondary)" }}>
                  Shorter prompts score higher on brevity
                </span>
              </div>
              <button
                onClick={handleSubmit}
                disabled={!userPrompt.trim()}
                style={{
                  width: "100%",
                  height: "48px",
                  background: userPrompt.trim() ? "var(--ps-amber)" : "#444",
                  color: "#000",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "var(--ps-text-body)",
                  fontWeight: 600,
                  cursor: userPrompt.trim() ? "pointer" : "not-allowed",
                  transition: "background 0.2s",
                }}
              >
                Shoot →
              </button>
            </>
          )}

          {gameState === "scoring" && (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
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
              <div style={{ color: "var(--ps-text-secondary)", fontSize: "var(--ps-text-secondary-size)" }}>
                Analyzing your shot...
              </div>
            </div>
          )}

          {gameState === "results" && score && (
            <>
              <div style={{ textAlign: "center", marginBottom: "32px" }}>
                <svg width="200" height="200" viewBox="0 0 200 200" style={{ margin: "0 auto" }}>
                  <circle cx="100" cy="100" r="85" fill="none" stroke="#222" strokeWidth="12" />
                  <circle cx="100" cy="100" r="85" fill="none" stroke="var(--ps-amber)" strokeWidth="12"
                    strokeDasharray={`${2 * Math.PI * 85}`}
                    strokeDashoffset={`${2 * Math.PI * 85 * (1 - score.accuracy / 100)}`}
                    transform="rotate(-90 100 100)"
                    style={{ transition: animateScore ? "stroke-dashoffset 0.8s ease-out 0s" : "none" }}
                  />
                  <circle cx="100" cy="100" r="60" fill="none" stroke="#222" strokeWidth="12" />
                  <circle cx="100" cy="100" r="60" fill="none" stroke="var(--ps-amber)" strokeWidth="12"
                    strokeDasharray={`${2 * Math.PI * 60}`}
                    strokeDashoffset={`${2 * Math.PI * 60 * (1 - score.format / 100)}`}
                    transform="rotate(-90 100 100)"
                    style={{ transition: animateScore ? "stroke-dashoffset 0.8s ease-out 0.2s" : "none" }}
                  />
                  <circle cx="100" cy="100" r="35" fill="none" stroke="#222" strokeWidth="12" />
                  <circle cx="100" cy="100" r="35" fill="none" stroke="var(--ps-amber)" strokeWidth="12"
                    strokeDasharray={`${2 * Math.PI * 35}`}
                    strokeDashoffset={`${2 * Math.PI * 35 * (1 - score.brevity / 100)}`}
                    transform="rotate(-90 100 100)"
                    style={{ transition: animateScore ? "stroke-dashoffset 0.8s ease-out 0.4s" : "none" }}
                  />
                  <text x="100" y="95" textAnchor="middle" fill="var(--ps-text-primary)" fontSize="40" fontWeight="600">{score.total}</text>
                  <text x="100" y="115" textAnchor="middle" fill="var(--ps-text-secondary)" fontSize="20">/300</text>
                </svg>
                <div style={{ fontSize: "var(--ps-text-subhead)", color: "var(--ps-amber)", marginTop: "16px", fontWeight: 600 }}>
                  {getScoreLabel(score.total)}
                </div>
              </div>

              <div style={{ marginBottom: "24px" }}>
                {[
                  { label: "Accuracy", value: score.accuracy },
                  { label: "Format", value: score.format },
                  { label: "Brevity", value: score.brevity },
                ].map((item) => (
                  <div key={item.label} style={{ marginBottom: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", fontSize: "var(--ps-text-secondary-size)" }}>
                      <span style={{ color: "var(--ps-text-secondary)" }}>{item.label}</span>
                      <span style={{ color: "var(--ps-text-primary)" }}>{item.value}/100</span>
                    </div>
                    <div style={{ height: "4px", background: "#222", borderRadius: "9999px", overflow: "hidden" }}>
                      <div style={{ width: `${item.value}%`, height: "100%", background: "var(--ps-amber)", transition: animateScore ? "width 0.6s ease-out" : "none" }} />
                    </div>
                  </div>
                ))}
              </div>

              {showImpactCard && (
                <div style={{ background: "var(--ps-surface)", borderLeft: "4px solid var(--ps-teal)", padding: "24px", borderRadius: "8px", marginBottom: "24px", animation: "slideUp 0.6s ease-out forwards" }}>
                  <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }`}</style>
                  <div style={{ marginBottom: "8px", fontSize: "var(--ps-text-secondary-size)" }}>
                    This prompt used <span style={{ color: "var(--ps-teal)", fontWeight: 600 }}>1</span> API call
                  </div>
                  <div style={{ marginBottom: score.total < 180 ? "16px" : "0", fontSize: "var(--ps-text-secondary-size)", color: "var(--ps-text-secondary)" }}>
                    ≈ <span style={{ color: "var(--ps-teal)" }}>10ml</span> water · ≈ <span style={{ color: "var(--ps-teal)" }}>0.1g</span> CO₂
                  </div>
                  {score.total < 180 && (
                    <>
                      <div style={{ marginBottom: "8px", fontSize: "var(--ps-text-secondary-size)" }}>
                        A score this low typically means 3+ follow-up prompts to reach this output
                      </div>
                      <div style={{ marginBottom: "16px", fontSize: "var(--ps-text-secondary-size)" }}>
                        That adds ≈ 30ml water — about <span style={{ color: "var(--ps-amber)", fontWeight: 600 }}>a tablespoon</span>
                      </div>
                    </>
                  )}
                  <div style={{ fontSize: "var(--ps-text-caption)", color: "var(--ps-text-secondary)", fontStyle: "italic" }}>
                    Better prompts = less AI = less water. This is the skill.
                  </div>
                </div>
              )}

              {showAutoIdeal && challenge && (
                <div style={{ marginBottom: "24px", animation: "slideUp 0.4s ease-out" }}>
                  <div style={{ fontSize: "14px", color: "#888880", marginBottom: "12px" }}>
                    Here's what a strong prompt looks like
                  </div>
                  <div
                    style={{
                      background: "#141414",
                      borderLeft: "4px solid #14B8A6",
                      borderRadius: "8px",
                      padding: "16px",
                      fontFamily: "monospace",
                      fontSize: "14px",
                      color: "#F0EFE8",
                      lineHeight: "1.6",
                    }}
                  >
                    {challenge.ideal_prompt}
                  </div>
                </div>
              )}

              <button
                onClick={handleShare}
                style={{ width: "100%", height: "48px", background: "var(--ps-amber)", border: "none", color: "#000", borderRadius: "8px", fontSize: "var(--ps-text-secondary-size)", fontWeight: 600, cursor: "pointer" }}
              >
                Share result
              </button>
            </>
          )}
        </div>
      </div>
      <LearnPanel isOpen={showLearnPanel} onClose={() => setShowLearnPanel(false)} />
    </>
  );
}