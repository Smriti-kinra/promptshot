# Component Catalog

All components live in src/components/. Do NOT write code using a component 
before reading its guidelines file.

| Component | File | Purpose | Guidelines |
|---|---|---|---|
| ChallengeCard | ChallengeCard.tsx | Shows today's target output | challenge-card.md |
| PromptInput | PromptInput.tsx | Textarea + character counter + submit | prompt-input.md |
| BullseyeRings | BullseyeRings.tsx | Animated scoring visualization | bullseye.md |
| ImpactCard | ImpactCard.tsx | Environmental cost display | impact-card.md |
| ScoreBreakdown | ScoreBreakdown.tsx | Three score rows with labels | bullseye.md |
| StreakBadge | StreakBadge.tsx | 🔥 streak counter in header | (simple, no guideline needed) |
| LoadingTarget | LoadingTarget.tsx | Rotating crosshair animation | (simple, no guideline needed) |
| ShareButton | ShareButton.tsx | Copies Wordle-style result to clipboard | (simple, no guideline needed) |

## Component decision tree
┌─ "What component shows the target output?"
│  └─ ChallengeCard — in both challenge state and collapsed in results state
┌─ "What component handles prompt writing and submission?"
│  └─ PromptInput — owns textarea, counter, and submit button
┌─ "What component shows the score?"
│  └─ BullseyeRings for the visual + ScoreBreakdown for the rows
┌─ "What component shows environmental impact?"
│  └─ ImpactCard — always teal-themed, never amber

## Rules
- All components are functional components with TypeScript props interfaces
- All components receive their data via props — no component fetches data itself
- App.tsx owns all state and passes it down
- Do NOT add context, Redux, or state management libraries