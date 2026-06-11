import { useState, useEffect } from "react";
import { Lightbulb, BarChart2, HelpCircle, Settings } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";

const C = {
  bg: "#0A0A0A",
  surface: "#141414",
  primary: "#F0EFE8",
  secondary: "#888880",
  amber: "#F59E0B",
  teal: "#14B8A6",
  border: "rgba(255,255,255,0.08)",
  divider: "rgba(255,255,255,0.06)",
};

function IconBtn({
  children,
  onClick,
  active = false,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  title?: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "11px 8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: active ? C.teal : hovered ? C.primary : C.secondary,
        transition: "color 0.15s",
        lineHeight: 0,
        minWidth: "44px",
        minHeight: "44px",
      }}
    >
      {children}
    </button>
  );
}

function SlidePanel({
  open,
  onClose,
  from,
  width,
  children,
}: {
  open: boolean;
  onClose: () => void;
  from: "left" | "right";
  width: number;
  children: React.ReactNode;
}) {
  const [rendered, setRendered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setRendered(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setVisible(false);
      const t = setTimeout(() => setRendered(false), 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!rendered) return null;

  const translateOut = from === "left" ? "-100%" : "100%";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        justifyContent: from === "left" ? "flex-start" : "flex-end",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          opacity: visible ? 1 : 0,
          transition: "opacity 300ms ease",
        }}
      />
      <div
        style={{
          position: "relative",
          width: `${width}px`,
          maxWidth: "100vw",
          height: "100%",
          background: C.surface,
          overflowY: "auto",
          transform: visible ? "translateX(0)" : `translateX(${translateOut})`,
          transition: visible ? "transform 300ms ease-out" : "transform 250ms ease-in",
          padding: "24px",
          boxSizing: "border-box",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function CenteredOverlay({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const [rendered, setRendered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setRendered(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setVisible(false);
      const t = setTimeout(() => setRendered(false), 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!rendered) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        opacity: visible ? 1 : 0,
        transition: "opacity 250ms ease",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.surface,
          borderRadius: "16px",
          padding: "32px",
          width: "100%",
          maxWidth: "400px",
          transform: visible ? "translateY(0)" : "translateY(16px)",
          transition: "transform 250ms ease",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function HamburgerSidebar({
  open,
  onClose,
  session,
  streak,
  onOpenLearn,
  onOpenSettings,
}: {
  open: boolean;
  onClose: () => void;
  session: Session | null;
  streak: number;
  onOpenLearn: () => void;
  onOpenSettings: () => void;
}) {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <SlidePanel open={open} onClose={onClose} from="left" width={280}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div style={{ fontSize: "18px", fontWeight: 600, color: C.primary }}>PromptShot</div>
        <button
          onClick={onClose}
          style={{ background: "none", border: "none", color: C.secondary, fontSize: "24px", cursor: "pointer", lineHeight: 1, padding: "4px" }}
        >
          ×
        </button>
      </div>

      <div style={{ fontSize: "13px", color: C.secondary, marginBottom: "8px" }}>
        {session ? session.user.email : "Guest"}
      </div>
      <div style={{ fontSize: "22px", fontWeight: 600, color: C.primary, marginBottom: "24px" }}>
        🔥 {streak}
      </div>

      {session ? (
        <button
          onClick={() => { supabase.auth.signOut(); onClose(); }}
          style={{ background: "none", border: "none", color: C.amber, fontSize: "14px", cursor: "pointer", padding: 0, marginBottom: "24px", display: "block" }}
        >
          Sign out
        </button>
      ) : (
        <button
          onClick={() => { onClose(); onOpenSettings(); }}
          style={{ background: "none", border: "none", color: C.amber, fontSize: "14px", cursor: "pointer", padding: 0, marginBottom: "24px", display: "block" }}
        >
          Sign in
        </button>
      )}

      <div style={{ height: "1px", background: C.divider, marginBottom: "24px" }} />

      <button
        onClick={() => { onClose(); onOpenLearn(); }}
        style={{ background: "none", border: "none", color: C.primary, fontSize: "14px", cursor: "pointer", padding: "8px 0", display: "block", width: "100%", textAlign: "left" }}
      >
        Reference ›
      </button>
      <button
        onClick={() => setShowAbout(true)}
        style={{ background: "none", border: "none", color: C.primary, fontSize: "14px", cursor: "pointer", padding: "8px 0", display: "block", width: "100%", textAlign: "left" }}
      >
        About PromptShot ›
      </button>

      {showAbout && (
        <div
          onClick={() => setShowAbout(false)}
          style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: C.surface, borderRadius: "16px", padding: "32px", maxWidth: "400px", width: "100%", fontFamily: "Inter, sans-serif" }}
          >
            <div style={{ fontSize: "18px", fontWeight: 600, color: C.amber, marginBottom: "16px" }}>
              About PromptShot
            </div>
            <p style={{ fontSize: "15px", color: C.primary, lineHeight: 1.7, margin: 0 }}>
              The daily game that makes you a better — and more responsible — AI user.
            </p>
            <button
              onClick={() => setShowAbout(false)}
              style={{ marginTop: "24px", width: "100%", height: "44px", background: "transparent", border: `1px solid ${C.secondary}`, color: C.primary, borderRadius: "8px", fontSize: "14px", cursor: "pointer" }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </SlidePanel>
  );
}

interface UserStats {
  gamesPlayed: number;
  avgScore: number | null;
  bestScore: number | null;
}

function StatsOverlay({
  open,
  onClose,
  session,
  streak,
}: {
  open: boolean;
  onClose: () => void;
  session: Session | null;
  streak: number;
}) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !session) { setStats(null); return; }
    setLoading(true);
    supabase
      .from("scores")
      .select("total")
      .eq("user_id", session.user.id)
      .then(({ data }) => {
        if (!data || data.length === 0) {
          setStats({ gamesPlayed: 0, avgScore: null, bestScore: null });
        } else {
          const totals = data.map((s) => s.total as number);
          setStats({
            gamesPlayed: totals.length,
            avgScore: Math.round(totals.reduce((a, b) => a + b, 0) / totals.length),
            bestScore: Math.max(...totals),
          });
        }
        setLoading(false);
      });
  }, [open, session]);

  return (
    <CenteredOverlay open={open} onClose={onClose}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div style={{ fontSize: "16px", fontWeight: 600, color: C.amber }}>Your stats</div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: C.secondary, fontSize: "24px", cursor: "pointer", lineHeight: 1, padding: "4px" }}>×</button>
      </div>

      {!session ? (
        <div style={{ color: C.secondary, fontSize: "14px", textAlign: "center", padding: "16px 0" }}>
          Sign in to track your stats
        </div>
      ) : loading ? (
        <div style={{ color: C.secondary, fontSize: "14px", textAlign: "center", padding: "16px 0" }}>Loading…</div>
      ) : stats ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {[
            { label: "Games played", value: String(stats.gamesPlayed) },
            { label: "Average score", value: stats.avgScore !== null ? `${stats.avgScore}/300` : "—" },
            { label: "Best score", value: stats.bestScore !== null ? `${stats.bestScore}/300` : "—" },
            { label: "Current streak", value: `🔥 ${streak}` },
          ].map((row) => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "14px", color: C.secondary }}>{row.label}</span>
              <span style={{ fontSize: "14px", color: C.primary, fontWeight: 600 }}>{row.value}</span>
            </div>
          ))}
        </div>
      ) : null}
    </CenteredOverlay>
  );
}

function SettingsSheet({
  open,
  onClose,
  session,
  difficulty,
  onDifficultyChange,
}: {
  open: boolean;
  onClose: () => void;
  session: Session | null;
  difficulty: string;
  onDifficultyChange: (d: string) => void;
}) {
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "#0A0A0A",
    border: "1px solid #333",
    borderRadius: "8px",
    padding: "12px 14px",
    color: C.primary,
    fontSize: "14px",
    fontFamily: "Inter, sans-serif",
    boxSizing: "border-box",
    outline: "none",
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    if (authMode === "signup" && password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setAuthLoading(true);
    if (authMode === "signin") {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) setError(err.message);
      else onClose();
    } else {
      const { error: err } = await supabase.auth.signUp({ email, password });
      if (err) setError(err.message);
      else setInfo("Check your email to confirm your account.");
    }
    setAuthLoading(false);
  };

  return (
    <SlidePanel open={open} onClose={onClose} from="right" width={320}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div style={{ fontSize: "18px", fontWeight: 600, color: C.primary }}>Settings</div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: C.secondary, fontSize: "24px", cursor: "pointer", lineHeight: 1, padding: "4px" }}>×</button>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <div style={{ fontSize: "11px", color: C.secondary, marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Difficulty
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {(["BEGINNER", "PRO", "EXPERT"] as const).map((d) => (
            <button
              key={d}
              onClick={() => onDifficultyChange(d)}
              style={{
                flex: 1,
                height: "36px",
                background: difficulty === d ? C.amber : "transparent",
                color: difficulty === d ? "#000" : C.secondary,
                border: `1px solid ${difficulty === d ? C.amber : "#333"}`,
                borderRadius: "9999px",
                fontSize: "11px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <div style={{ fontSize: "11px", color: C.secondary, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Theme
        </div>
        <div style={{ fontSize: "14px", color: C.secondary }}>Dark only</div>
      </div>

      <div style={{ height: "1px", background: C.divider, marginBottom: "24px" }} />

      {session ? (
        <button
          onClick={() => { supabase.auth.signOut(); onClose(); }}
          style={{ width: "100%", height: "44px", background: "transparent", border: `1px solid ${C.secondary}`, color: C.primary, borderRadius: "8px", fontSize: "14px", cursor: "pointer" }}
        >
          Sign out
        </button>
      ) : (
        <>
          <div style={{ fontSize: "14px", fontWeight: 600, color: C.primary, marginBottom: "16px" }}>
            {authMode === "signin" ? "Sign in" : "Create account"}
          </div>
          <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />
            {authMode === "signup" && (
              <input type="password" placeholder="Confirm password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required style={inputStyle} />
            )}
            <button
              type="submit"
              disabled={authLoading}
              style={{ width: "100%", height: "44px", background: C.amber, color: "#000", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: authLoading ? "not-allowed" : "pointer", marginTop: "4px" }}
            >
              {authLoading ? "…" : authMode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>
          {error && <div style={{ color: "#EF4444", fontSize: "13px", marginTop: "10px" }}>{error}</div>}
          {info && <div style={{ color: C.teal, fontSize: "13px", marginTop: "10px" }}>{info}</div>}
          <button
            onClick={() => { setAuthMode(authMode === "signin" ? "signup" : "signin"); setError(null); setInfo(null); }}
            style={{ background: "none", border: "none", color: C.amber, fontSize: "13px", cursor: "pointer", padding: 0, marginTop: "14px", display: "block" }}
          >
            {authMode === "signin" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </>
      )}
    </SlidePanel>
  );
}

export interface TopbarProps {
  session: Session | null;
  streak: number;
  difficulty: string;
  onDifficultyChange: (d: string) => void;
  onOpenLearn: () => void;
  showHint: boolean;
  onToggleHint: () => void;
}

export function Topbar({
  session,
  streak,
  difficulty,
  onDifficultyChange,
  onOpenLearn,
  showHint,
  onToggleHint,
}: TopbarProps) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <div style={{ position: "sticky", top: 0, zIndex: 50 }}>
        <div
          style={{
            height: "56px",
            background: C.bg,
            borderBottom: `1px solid ${C.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingLeft: "9px",
            paddingRight: "9px",
          }}
        >
          <button
            onClick={() => setShowSidebar(true)}
            aria-label="Menu"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "11px 11px",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              color: C.primary,
              minWidth: "44px",
              minHeight: "44px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ display: "block", width: "22px", height: "2px", background: "currentColor", borderRadius: "1px" }} />
            <span style={{ display: "block", width: "22px", height: "2px", background: "currentColor", borderRadius: "1px" }} />
            <span style={{ display: "block", width: "22px", height: "2px", background: "currentColor", borderRadius: "1px" }} />
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "0px" }}>
            <IconBtn onClick={onToggleHint} active={showHint} title="Hint">
              <Lightbulb size={22} />
            </IconBtn>
            <IconBtn onClick={() => setShowStats(true)} title="Stats">
              <BarChart2 size={22} />
            </IconBtn>
            <IconBtn onClick={onOpenLearn} title="Reference">
              <HelpCircle size={22} />
            </IconBtn>
            <IconBtn onClick={() => setShowSettings(true)} title="Settings">
              <Settings size={22} />
            </IconBtn>
          </div>
        </div>

        <div
          style={{
            height: showHint ? "40px" : "0",
            overflow: "hidden",
            transition: "height 0.25s ease",
            background: "#141414",
            borderLeft: "3px solid #14B8A6",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span style={{ padding: "0 20px", fontSize: "13px", color: "#888880", whiteSpace: "nowrap" }}>
            Hint: focus on format, length, and constraints
          </span>
        </div>
      </div>

      <HamburgerSidebar
        open={showSidebar}
        onClose={() => setShowSidebar(false)}
        session={session}
        streak={streak}
        onOpenLearn={onOpenLearn}
        onOpenSettings={() => setShowSettings(true)}
      />
      <StatsOverlay
        open={showStats}
        onClose={() => setShowStats(false)}
        session={session}
        streak={streak}
      />
      <SettingsSheet
        open={showSettings}
        onClose={() => setShowSettings(false)}
        session={session}
        difficulty={difficulty}
        onDifficultyChange={onDifficultyChange}
      />
    </>
  );
}