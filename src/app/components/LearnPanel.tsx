import { useEffect, useState } from "react";
import { LEARN_CONTENT } from "../../data/learnContent";

interface LearnPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const C = {
  bg: "#0B1610",
  surface: "#121C14",
  surface2: "#1A2E1C",
  primary: "#D4E8D4",
  secondary: "#4A6B4A",
  mint: "#6EE09B",
  mintDim: "rgba(110,224,155,0.12)",
  amber: "#F5C518",
  amberDim: "rgba(245,197,24,0.12)",
  red: "#FF5F5F",
  redDim: "rgba(255,95,95,0.12)",
  border: "#243B27",
  divider: "#1A2E1C",
  font: "'Space Grotesk', system-ui, sans-serif",
  mono: "'JetBrains Mono', monospace",
};

function VerdictBadge({ verdict }: { verdict: string }) {
  let bg = C.surface2;
  let color = C.secondary;
  if (verdict === "FALSE") { bg = C.redDim; color = C.red; }
  if (verdict === "WASTEFUL") { bg = C.amberDim; color = C.amber; }
  return (
    <span style={{
      background: bg,
      color,
      padding: "2px 10px",
      borderRadius: "9999px",
      fontSize: "10px",
      fontWeight: 700,
      whiteSpace: "nowrap",
      flexShrink: 0,
      fontFamily: C.mono,
      letterSpacing: "0.04em",
    }}>
      {verdict}
    </span>
  );
}

function AnatomySection({ items }: { items: typeof LEARN_CONTENT.sections[0]["items"] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {(items as { label: string; color: string; description: string; example: string }[]).map((item) => (
        <div key={item.label} style={{ background: C.surface2, borderRadius: "10px", padding: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "9999px", background: C.mint, flexShrink: 0, display: "inline-block" }} />
            <span style={{ fontSize: "13px", fontWeight: 600, color: C.primary, fontFamily: C.font }}>{item.label}</span>
          </div>
          <p style={{ fontSize: "12px", color: C.secondary, margin: "0 0 8px", lineHeight: 1.6, fontFamily: C.font }}>{item.description}</p>
          <div style={{ background: C.mintDim, borderRadius: "6px", padding: "7px 10px", fontFamily: C.mono, fontSize: "11px", color: C.mint }}>
            {item.example}
          </div>
        </div>
      ))}
    </div>
  );
}

function MythsSection({ items }: { items: typeof LEARN_CONTENT.sections[1]["items"] }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const mythItems = items as { myth: string; reality: string; verdict: string }[];
  return (
    <div>
      {mythItems.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setExpanded(expanded === i ? null : i)}
            style={{
              width: "100%", background: "none", border: "none", padding: "12px 0",
              cursor: "pointer", display: "flex", alignItems: "flex-start",
              justifyContent: "space-between", gap: "12px", textAlign: "left",
            }}
          >
            <span style={{ fontSize: "12px", color: C.secondary, fontStyle: "italic", lineHeight: 1.6, flex: 1, fontFamily: C.font }}>
              "{item.myth}"
            </span>
            <VerdictBadge verdict={item.verdict} />
          </button>
          {expanded === i && (
            <div style={{ fontSize: "12px", color: C.secondary, lineHeight: 1.7, paddingBottom: "12px", paddingRight: "8px", fontFamily: C.font }}>
              {item.reality}
            </div>
          )}
          <div style={{ height: "1px", background: C.divider }} />
        </div>
      ))}
    </div>
  );
}

function ExamplesSection({ items }: { items: typeof LEARN_CONTENT.sections[2]["items"] }) {
  const exampleItems = items as {
    category: string;
    bad: { label: string; prompt: string; why: string };
    good: { label: string; prompt: string; why: string };
  }[];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {exampleItems.map((item) => (
        <div key={item.category}>
          <span style={{
            background: C.mintDim, color: C.mint, padding: "2px 10px", borderRadius: "9999px",
            fontSize: "10px", fontWeight: 700, display: "inline-block", marginBottom: "10px",
            fontFamily: C.mono, letterSpacing: "0.05em",
          }}>
            {item.category}
          </span>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
            <div style={{ border: `1px solid ${C.redDim}`, borderRadius: "8px", padding: "10px" }}>
              <div style={{ fontSize: "10px", color: C.red, fontWeight: 700, marginBottom: "6px", fontFamily: C.mono }}>{item.bad.label}</div>
              <div style={{ fontFamily: C.mono, fontSize: "11px", color: C.primary, marginBottom: "6px", lineHeight: 1.5 }}>{item.bad.prompt}</div>
              <div style={{ fontSize: "11px", color: C.secondary, lineHeight: 1.4, fontFamily: C.font }}>{item.bad.why}</div>
            </div>
            <div style={{ border: `1px solid ${C.mintDim}`, borderRadius: "8px", padding: "10px" }}>
              <div style={{ fontSize: "10px", color: C.mint, fontWeight: 700, marginBottom: "6px", fontFamily: C.mono }}>{item.good.label}</div>
              <div style={{ fontFamily: C.mono, fontSize: "11px", color: C.primary, marginBottom: "6px", lineHeight: 1.5 }}>{item.good.prompt}</div>
              <div style={{ fontSize: "11px", color: C.secondary, lineHeight: 1.4, fontFamily: C.font }}>{item.good.why}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function FAQSection({ items }: { items: typeof LEARN_CONTENT.sections[3]["items"] }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const faqItems = items as { question: string; answer: string }[];
  return (
    <div>
      {faqItems.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setExpanded(expanded === i ? null : i)}
            style={{
              width: "100%", background: "none", border: "none", padding: "12px 0",
              cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "space-between", gap: "12px", textAlign: "left",
            }}
          >
            <span style={{ fontSize: "13px", color: C.primary, lineHeight: 1.5, flex: 1, fontFamily: C.font }}>{item.question}</span>
            <span style={{ fontSize: "16px", color: C.secondary, flexShrink: 0, lineHeight: 1 }}>{expanded === i ? "−" : "+"}</span>
          </button>
          {expanded === i && (
            <div style={{ fontSize: "12px", color: C.secondary, lineHeight: 1.7, paddingBottom: "12px", fontFamily: C.font }}>
              {item.answer}
            </div>
          )}
          <div style={{ height: "1px", background: C.divider }} />
        </div>
      ))}
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string | null }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ fontSize: "11px", fontWeight: 700, color: C.mint, marginBottom: subtitle ? "4px" : 0, fontFamily: C.mono, textTransform: "uppercase", letterSpacing: "0.1em" }}>
        {title}
      </div>
      {subtitle && <div style={{ fontSize: "12px", color: C.secondary, fontFamily: C.font }}>{subtitle}</div>}
    </div>
  );
}

export function LearnPanel({ isOpen, onClose }: LearnPanelProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const [visible, setVisible] = useState(false);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRendered(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setVisible(false);
      const t = setTimeout(() => setRendered(false), 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!rendered) return null;

  const [anatomy, myths, examples, , faq] = LEARN_CONTENT.sections;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0,0,0,0.72)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        opacity: visible ? 1 : 0,
        transition: "opacity 280ms ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.surface,
          borderRadius: "16px",
          width: "100%",
          maxWidth: "460px",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "transform 280ms ease",
          overflow: "hidden",
        }}
      >
        <div style={{
          padding: "20px 24px 16px",
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: C.primary, fontFamily: C.font }}>
              Prompt Engineering 101
            </div>
            <div style={{ fontSize: "11px", color: C.secondary, fontFamily: C.mono, marginTop: "2px" }}>
              Tap any section to expand
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: C.secondary, fontSize: "22px", cursor: "pointer", lineHeight: 1, padding: "4px" }}
          >
            ×
          </button>
        </div>

        <div style={{ overflowY: "auto", padding: "20px 24px", flex: 1 }}>
          <SectionHeader title={anatomy.title} subtitle={anatomy.subtitle as string | null} />
          <AnatomySection items={anatomy.items} />
          <div style={{ height: "1px", background: C.border, margin: "20px 0" }} />
          <SectionHeader title={myths.title} subtitle={myths.subtitle as string | null} />
          <MythsSection items={myths.items} />
          <div style={{ height: "1px", background: C.border, margin: "20px 0" }} />
          <SectionHeader title={examples.title} subtitle={examples.subtitle as string | null} />
          <ExamplesSection items={examples.items} />
          <div style={{ height: "1px", background: C.border, margin: "20px 0" }} />
          <SectionHeader title={faq.title} subtitle={faq.subtitle as string | null} />
          <FAQSection items={faq.items} />
          <div style={{ height: "20px" }} />
        </div>

        <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
          <button
            onClick={onClose}
            style={{
              width: "100%", height: "42px", background: "transparent",
              border: `1px solid ${C.border}`, color: C.primary, borderRadius: "10px",
              fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: C.font,
              transition: "border-color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.mint)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
