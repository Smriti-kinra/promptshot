# Color System

PromptShot uses exactly 4 colors. Do not add any others.

| Role | Hex | Tailwind custom name | Used for |
|---|---|---|---|
| Background | #0A0A0A | bg-game-bg | Page canvas only |
| Surface | #141414 | bg-game-surface | Cards, inputs, panels |
| Text primary | #F0EFE8 | text-game-primary | All primary text |
| Text secondary | #888880 | text-game-secondary | Labels, captions, hints |
| Amber | #F59E0B | text-amber / bg-amber | ALL scoring/game elements |
| Teal | #14B8A6 | text-teal / bg-teal | ALL environmental elements |

Add these to tailwind.config.js extend.colors:
```js
colors: {
  'game-bg': '#0A0A0A',
  'game-surface': '#141414',
  'game-primary': '#F0EFE8',
  'game-secondary': '#888880',
  amber: { DEFAULT: '#F59E0B', dim: 'rgba(245,158,11,0.15)' },
  teal: { DEFAULT: '#14B8A6', dim: 'rgba(20,184,166,0.12)' }
}
```

## Decision tree
┌─ "What color should I use for this element?"
│
├─ GAME element (score, bullseye ring, streak, submit button, difficulty badge)?
│  └─ Amber (#F59E0B)
│
├─ ENVIRONMENTAL element (water, CO₂, impact card, eco stats)?
│  └─ Teal (#14B8A6)
│
├─ PRIMARY text (headings, body, values)?
│  └─ #F0EFE8 (game-primary)
│
├─ SECONDARY text (labels, captions, hints, counters)?
│  └─ #888880 (game-secondary)
│
├─ CARD or panel background?
│  └─ #141414 (game-surface)
│
└─ PAGE background (body, main canvas)?
└─ #0A0A0A (game-bg)

## Rules
- NEVER use amber for anything environmental
- NEVER use teal for anything game/scoring related  
- NEVER use white (#ffffff) — use #F0EFE8 for bright text
- NEVER use gray shades not in this system
- Amber at 15% opacity (amber-dim) is valid for badge backgrounds
- Teal at 12% opacity (teal-dim) is valid for impact card backgrounds
- Borders: always 1px solid rgba(255,255,255,0.08). Nothing brighter.
- Focus ring on inputs: 0 0 0 2px rgba(245,158,11,0.4) — amber at 40%