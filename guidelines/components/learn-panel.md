# LearnPanel Component

The reference overlay. Accessible at all times via the book icon in the header.
Does NOT interrupt game state — it overlays on top.

## When to use
Rendered when showLearnPanel is true. Can appear over any game state.

## Props
```typescript
interface LearnPanelProps {
  isOpen: boolean;
  onClose: () => void;
}
```

## Layout
- position: fixed, inset: 0 (full viewport)
- Backdrop: rgba(0,0,0,0.7), click to close
- Panel: right-anchored, full height, 100% width (max 480px)
- Panel bg: #141414
- Internal padding: 24px
- Overflow-y: auto (scrollable)

## Color rules for this component
- Section titles: amber (#F59E0B)
- Anatomy item labels: amber
- Category badges (examples section): teal
- Weak prompt cards: 0.5px border rgba(239,68,68,0.4) — muted red
- Strong prompt cards: 0.5px border rgba(20,184,166,0.4) — muted teal
- FAQ and myth body text: game-secondary (#888880)
- Verdict badges: 
    FALSE → rgba(239,68,68,0.12) bg, rgba(239,68,68,0.8) text
    WASTEFUL → amber-dim bg, amber text
    SOMETIMES → game-surface bg, game-secondary text

## Rules
- Backdrop click must close the panel (not just the × button)
- Escape key must also close the panel (add keydown listener)
- Myths start collapsed — only the myth text + verdict badge visible
- FAQs start collapsed — only the question visible
- Anatomy cards are always fully visible — no accordion
- Examples section is always fully visible — no accordion
- Do NOT add search, filtering, or navigation between sections
- The panel does not remember scroll position between opens
- No page/tab structure — it's one long scrollable list of sections