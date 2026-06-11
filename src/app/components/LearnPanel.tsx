import { useEffect, useState } from "react";
import { LEARN_CONTENT } from "../../data/learnContent";

interface LearnPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const C = {
  bg: "#0A0A0A",
  surface: "#141414",
  primary: "#F0EFE8",
  secondary: "#888880",
  amber: "#F59E0B",
  amberDim: "rgba(245,158,11,0.15)",
  teal: "#14B8A6",
  tealDim: "rgba(20,184,166,0.12)",
  border: "rgba(255,255,255,0.08)",
  divider: "rgba(255,255,255,0.06)",
  falseBg: "rgba(239,68,68,0.12)",
  falseText: "rgba(239,68,68,0.8)",
  tealBorder: "rgba(20,184,166,0.4)",
  redBorder: "rgba(239,68,68,0.4)",
};

// Verdict badge
function VerdictBadge({ verdict }: { verdict: string }) {
  let bg = C.surface;
  let color = C.secondary;
  if (verdict === "FALSE") { bg = C.falseBg; color = C.falseText; }
  if (verdict === "WASTEFUL") { bg = C.amberDim; color = C.amber; }
  return (
    <span style={{
      background: bg,
      color,
      padding: "2px 10px",
      borderRadius: "9999px",
      fontSize: "11px",
      fontWeight: 600,
      whiteSpace: "nowrap",
      flexShrink: 0,
    }}>
      {verdict}
    </span>
  );
}

// Anatomy section
function AnatomySection({ items }: { items: typeof LEARN_CONTENT.sections[0]["items"] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {(items as { label: string; color: string; description: string; example: string }[]).map((item) => (
        <div key={item.label} style={{
          background: C.surface,
          borderRadius: "8px",
          padding: "16px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <span style={{
              width: "8px", height: "8px", borderRadius: "9999px",
              background: C.amber, flexShrink: 0
            }} />
            <span style={{ fontSize: "14px", fontWeight: 600, color: C.primary }}>
              {item.label}
            </span>
          </div>
          <p style={{ fontSize: "13px", color: C.secondary, margin: "0 0 10px", lineHeight: 1.5 }}>
            {item.description}
          </p>
          <div style={{
            background: C.amberDim,
            borderRadius: "8px",
            padding: "8px 12px",
            fontFamily: "monospace",
            fontSize: "12px",
            color: C.amber,
          }}>
            {item.example}
          </div>
        </div>
      ))}
    </div>
  );
}

// Myths section — accordion per myth
function MythsSection({ items }: { items: typeof LEARN_CONTENT.sections[1]["items"] }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const mythItems = items as { myth: string; reality: string; verdict: string }[];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
      {mythItems.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setExpanded(expanded === i ? null : i)}
            aria-expanded={expanded === i}
            style={{
              width: "100%",
              background: "none",
              border: "none",
              padding: "14px 0",
              cursor: "pointer",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "12px",
              textAlign: "left",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                color: C.secondary,
                display: "inline-block",
                fontSize: "12px",
                lineHeight: 1.5,
                transform:
                  expanded === i ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            >
              ▶
            </span>
            <span style={{
              fontSize: "13px",
              color: C.secondary,
              fontStyle: "italic",
              lineHeight: 1.5,
              flex: 1,
            }}>
              "{item.myth}"
            </span>
            <VerdictBadge verdict={item.verdict} />
          </button>
          {expanded === i && (
            <div style={{
              fontSize: "13px",
              color: C.secondary,
              lineHeight: 1.6,
              paddingBottom: "14px",
              paddingRight: "8px",
            }}>
              {item.reality}
            </div>
          )}
          <div style={{ height: "1px", background: C.divider }} />
        </div>
      ))}
    </div>
  );
}

// Examples section
function ExamplesSection({ items }: { items: typeof LEARN_CONTENT.sections[2]["items"] }) {
  const exampleItems = items as {
    category: string;
    bad: { label: string; prompt: string; why: string };
    good: { label: string; prompt: string; why: string };
  }[];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {exampleItems.map((item) => (
        <div key={item.category}>
          <span style={{
            background: C.tealDim,
            color: C.teal,
            padding: "3px 12px",
            borderRadius: "9999px",
            fontSize: "11px",
            fontWeight: 600,
            display: "inline-block",
            marginBottom: "12px",
          }}>
            {item.category}
          </span>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {/* Weak */}
            <div style={{
              border: `0.5px solid ${C.redBorder}`,
              borderRadius: "8px",
              padding: "12px",
            }}>
              <div style={{ fontSize: "11px", color: C.falseText, fontWeight: 600, marginBottom: "8px" }}>
                {item.bad.label}
              </div>
              <div style={{
                fontFamily: "monospace",
                fontSize: "12px",
                color: C.primary,
                marginBottom: "8px",
                lineHeight: 1.5,
              }}>
                {item.bad.prompt}
              </div>
              <div style={{ fontSize: "11px", color: C.secondary, lineHeight: 1.4 }}>
                {item.bad.why}
              </div>
            </div>
            {/* Strong */}
            <div style={{
              border: `0.5px solid ${C.tealBorder}`,
              borderRadius: "8px",
              padding: "12px",
            }}>
              <div style={{ fontSize: "11px", color: C.teal, fontWeight: 600, marginBottom: "8px" }}>
                {item.good.label}
              </div>
              <div style={{
                fontFamily: "monospace",
                fontSize: "12px",
                color: C.primary,
                marginBottom: "8px",
                lineHeight: 1.5,
              }}>
                {item.good.prompt}
              </div>
              <div style={{ fontSize: "11px", color: C.secondary, lineHeight: 1.4 }}>
                {item.good.why}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ImpactSection({ items }: { items: typeof LEARN_CONTENT.sections[3]["items"] }) {
  const impactItems = items as {
    metric: string;
    point: string;
    detail: string;
  }[];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {impactItems.map((item) => (
        <div
          key={item.metric}
          style={{
            border: `0.5px solid ${C.tealBorder}`,
            borderRadius: "8px",
            padding: "14px",
            background: C.tealDim,
          }}
        >
          <div
            style={{
              color: C.teal,
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.04em",
              marginBottom: "8px",
              textTransform: "uppercase",
            }}
          >
            {item.metric}
          </div>
          <div
            style={{
              color: C.primary,
              fontSize: "14px",
              fontWeight: 600,
              lineHeight: 1.45,
              marginBottom: "6px",
            }}
          >
            {item.point}
          </div>
          <div
            style={{
              color: C.secondary,
              fontSize: "13px",
              lineHeight: 1.55,
            }}
          >
            {item.detail}
          </div>
        </div>
      ))}
    </div>
  );
}

// FAQ section — accordion
function FAQSection({ items }: { items: typeof LEARN_CONTENT.sections[4]["items"] }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const faqItems = items as { question: string; answer: string }[];
  return (
    <div>
      {faqItems.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setExpanded(expanded === i ? null : i)}
            aria-expanded={expanded === i}
            style={{
              width: "100%",
              background: "none",
              border: "none",
              padding: "14px 0",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              textAlign: "left",
            }}
          >
            <span style={{ fontSize: "13px", color: C.primary, lineHeight: 1.5, flex: 1 }}>
              {item.question}
            </span>
            <span style={{ fontSize: "18px", color: C.secondary, flexShrink: 0, lineHeight: 1 }}>
              {expanded === i ? "−" : "+"}
            </span>
          </button>
          {expanded === i && (
            <div style={{
              fontSize: "13px",
              color: C.secondary,
              lineHeight: 1.6,
              paddingBottom: "14px",
            }}>
              {item.answer}
            </div>
          )}
          <div style={{ height: "1px", background: C.divider }} />
        </div>
      ))}
    </div>
  );
}

function SectionDivider() {
  return <div style={{ height: "1px", background: C.divider, margin: "24px 0" }} />;
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string | null }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ fontSize: "16px", fontWeight: 600, color: C.amber, marginBottom: subtitle ? "6px" : 0 }}>
        {title}
      </div>
      {subtitle && (
        <div style={{ fontSize: "13px", color: C.secondary }}>{subtitle}</div>
      )}
    </div>
  );
}

export function LearnPanel({ isOpen, onClose }: LearnPanelProps) {
  // Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
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

  const [anatomy, myths, examples, impact, faq] = LEARN_CONTENT.sections;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          opacity: visible ? 1 : 0,
          transition: "opacity 350ms ease-out",
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "480px",
          height: "100%",
          background: C.surface,
          overflowY: "auto",
          transform: visible ? "translateX(0)" : "translateX(100%)",
          transition: visible
            ? "transform 350ms ease-out"
            : "transform 280ms ease-in",
          padding: "24px",
          boxSizing: "border-box",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Sticky header */}
        <div style={{
          position: "sticky",
          top: 0,
          background: C.surface,
          paddingBottom: "16px",
          marginBottom: "8px",
          zIndex: 1,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: "20px", fontWeight: 600, color: C.primary, marginBottom: "4px" }}>
              Reference
            </div>
            <div style={{ fontSize: "12px", color: C.secondary }}>
              Tap anything to explore
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close reference"
            style={{
              background: "none",
              border: "none",
              color: C.secondary,
              fontSize: "24px",
              cursor: "pointer",
              lineHeight: 1,
              padding: "0 0 0 8px",
            }}
          >
            ×
          </button>
        </div>

        {/* Anatomy */}
        <SectionHeader title={anatomy.title} subtitle={anatomy.subtitle as string | null} />
        <AnatomySection items={anatomy.items} />

        <SectionDivider />

        {/* Myths */}
        <SectionHeader title={myths.title} subtitle={myths.subtitle as string | null} />
        <MythsSection items={myths.items} />

        <SectionDivider />

        {/* Examples */}
        <SectionHeader title={examples.title} subtitle={examples.subtitle as string | null} />
        <ExamplesSection items={examples.items} />

        <SectionDivider />

        {/* Impact */}
        <SectionHeader title={impact.title} subtitle={impact.subtitle as string | null} />
        <ImpactSection items={impact.items} />

        <SectionDivider />

        {/* FAQ */}
        <SectionHeader title={faq.title} subtitle={faq.subtitle as string | null} />
        <FAQSection items={faq.items} />

        <div style={{ height: "40px" }} />
      </div>
    </div>
  );
}
