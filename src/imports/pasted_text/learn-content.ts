Add a reference panel to PromptShot. This is a slide-in overlay from the right 
side of the screen, triggered by a small book icon (📖) in the top-right of 
the header, next to the streak badge.

---

WHAT CHANGES
1. Header: add a BookIcon button (use a simple SVG book outline, 20px, game-secondary 
   color, becomes game-primary on hover) to the far right of the header row.

2. New state: add `showLearnPanel: boolean` to App.tsx state (default false). 
   This is NOT part of the gameState enum — it overlays on top of whatever 
   game state is currently active.

3. New component: LearnPanel.tsx — a full-height panel that slides in from 
   the right when showLearnPanel is true.

HOW IT CHANGES
- Panel width: 100% on mobile (390px), 480px max on larger screens
- Panel sits on top of the game via position:fixed, full screen, with a 
  backdrop (rgba(0,0,0,0.7)) behind it
- Entry animation: translateX(100%) → translateX(0), 350ms ease-out
- Exit animation: translateX(0) → translateX(100%), 280ms ease-in
- Panel background: #141414 (game-surface)
- Close button: top-right corner, "×" character, 24px, game-secondary
- Panel is scrollable internally — content is long

WHAT STAYS THE SAME
- All existing game states, components, and animations are unchanged
- Color system unchanged — amber for game elements, teal for eco, 
  no new colors introduced in this panel
- The book icon does not affect gameState enum

---

PANEL CONTENT STRUCTURE
Create a file src/data/learnContent.ts with this exact data structure 
(do not make up the content — use exactly what is provided below):

```typescript
export const LEARN_CONTENT = {
  sections: [
    {
      id: 'anatomy',
      title: 'Anatomy of a good prompt',
      subtitle: 'Every strong prompt has these four parts',
      items: [
        {
          label: 'Task',
          color: 'amber',
          description: 'What you want the AI to produce. Be a verb: write, explain, list, convert, summarise.',
          example: '→ "Write a function that..."'
        },
        {
          label: 'Format',
          color: 'amber',
          description: 'How the output should look. Paragraph, bullet list, code block, table, JSON. If you don\'t specify, you get whatever the AI defaults to.',
          example: '→ "...as a numbered list of 5 items"'
        },
        {
          label: 'Context',
          color: 'amber',
          description: 'Why you need it and who it\'s for. This changes tone, vocabulary, and depth dramatically.',
          example: '→ "...for a 12-year-old who has never coded"'
        },
        {
          label: 'Constraints',
          color: 'amber',
          description: 'What to include, exclude, or limit. Length, tone, what NOT to mention.',
          example: '→ "...in under 80 words, no jargon, no metaphors"'
        }
      ]
    },
    {
      id: 'myths',
      title: 'Prompt myths that waste your time',
      subtitle: 'Common assumptions that are just wrong',
      items: [
        {
          myth: 'Longer prompts produce better outputs',
          reality: 'Length adds noise. Extra words dilute the instruction. A 40-word precise prompt beats a 200-word rambling one every time.',
          verdict: 'FALSE'
        },
        {
          myth: 'Vague prompts give more creative results',
          reality: 'Vagueness produces generic defaults, not creativity. To get creative output, be specific about the creative direction — tone, style, constraints.',
          verdict: 'FALSE'
        },
        {
          myth: 'Just say "be more detailed" if it\'s too short',
          reality: '"More detail" is not a direction. Specify what dimension you want expanded: more examples, deeper explanation, more edge cases.',
          verdict: 'WASTEFUL'
        },
        {
          myth: 'Repeating the same prompt differently will fix it',
          reality: 'If an output was wrong, diagnosing WHY it was wrong and changing one specific thing is 3× more effective than a full rewrite.',
          verdict: 'WASTEFUL'
        },
        {
          myth: 'Saying "please" or "as an AI" affects the response',
          reality: 'Politeness has no effect on output quality. "As an AI" instructions are redundant. Neither costs you points here but both waste your character count.',
          verdict: 'FALSE'
        },
        {
          myth: 'You need to explain the whole background',
          reality: 'The AI knows general knowledge. Only explain what is specific to YOUR situation that it couldn\'t infer.',
          verdict: 'FALSE'
        },
        {
          myth: 'More examples in the prompt means better results',
          reality: 'One well-chosen example beats three mediocre ones. Examples should show the pattern, not pad the prompt.',
          verdict: 'SOMETIMES'
        }
      ]
    },
    {
      id: 'examples',
      title: 'Good vs bad — side by side',
      subtitle: 'The same request, two very different prompts',
      items: [
        {
          category: 'PARAGRAPH',
          bad: {
            label: 'Weak',
            prompt: 'Write about climate change',
            why: 'No format, no length, no audience, no angle. You\'ll get a generic essay.'
          },
          good: {
            label: 'Strong',
            prompt: 'In 3 sentences, explain how melting Arctic ice affects ocean currents. Audience: curious 14-year-old. No jargon.',
            why: 'Format (3 sentences), topic angle (ocean currents specifically), audience, constraint (no jargon).'
          }
        },
        {
          category: 'CODE',
          bad: {
            label: 'Weak',
            prompt: 'Make code for a toggle button',
            why: 'No language, no framework, no behaviour spec, no output format.'
          },
          good: {
            label: 'Strong',
            prompt: 'Write a React functional component: a button that toggles between "Start" and "Stop" text on click. Use useState. TypeScript. No styling.',
            why: 'Language (React + TS), component type, exact behaviour, explicit exclusion (no styling).'
          }
        },
        {
          category: 'LIST',
          bad: {
            label: 'Weak',
            prompt: 'Give me tips for better sleep',
            why: 'No format, no count, no depth per item, no angle.'
          },
          good: {
            label: 'Strong',
            prompt: 'List 5 science-backed sleep tips. Format: bullet points. Each has a bold 3-word label, then one sentence of explanation. No supplements.',
            why: 'Count (5), format (bullets with labels), source quality (science-backed), explicit exclusion.'
          }
        }
      ]
    },
    {
      id: 'faq',
      title: 'FAQ',
      subtitle: null,
      items: [
        {
          question: 'How is my score calculated?',
          answer: 'Three dimensions: Accuracy (did your output match the content of the target?), Format (did the structure and shape match?), and Brevity (was your prompt concise?). Each is scored 0–100 and summed to 300 max. Brevity rewards you for achieving the same output with fewer words.'
        },
        {
          question: 'Why does brevity matter if the output is accurate?',
          answer: 'Because in real usage, every token in your prompt costs compute time, energy, and water in a data centre. A prompt engineer who gets accurate output in 50 words is objectively more efficient than one who needs 200 words. Brevity is not a stylistic preference — it\'s a resource question.'
        },
        {
          question: 'How does AI actually use water?',
          answer: 'Data centres that run AI models require massive cooling systems. That cooling uses water — evaporated to remove heat from servers. A 2023 University of Massachusetts study estimated roughly 10ml of water per ChatGPT query. Multiply that by billions of daily interactions and it becomes a serious infrastructure concern.'
        },
        {
          question: 'Why show environmental impact in a game?',
          answer: 'Because the skill gap in prompting doesn\'t feel real until you see its cost. A person who needs 5 follow-up prompts to get the same output as someone who got it in one used 5× the resources. Prompt engineering is not just a productivity skill — it\'s a conservation behaviour.'
        },
        {
          question: 'What is a perfect prompt?',
          answer: 'The shortest sequence of words that produces the target output with no follow-ups needed. It specifies task, format, context, and constraints — but nothing extra. Perfect prompts are rarely discovered on the first try. That\'s why this is a skill, not a trick.'
        },
        {
          question: 'Can I replay today\'s challenge?',
          answer: 'No — the game is once-per-day by design, like Wordle. This creates the social moment: everyone is working from the same target. A new challenge unlocks at midnight.'
        }
      ]
    }
  ]
}
```

---

RENDERING RULES FOR THE PANEL

Header area (sticky top):
  - "Reference" in 20px primary color
  - "Tap anything to explore" in 12px secondary
  - "×" close button top-right

Section rendering:
- Each section has a header (section.title in 16px amber, section.subtitle in 13px secondary)
- Sections separated by a 1px rgba(255,255,255,0.06) divider + 24px spacing

For 'anatomy' section: render each item as a card with:
  - color pill on left (amber dot)
  - label in 14px primary weight 600
  - description in 13px secondary
  - example in 12px monospace, rgba(245,158,11,0.1) bg, amber text

For 'myths' section: render each item as a row with:
  - Left: myth text in 13px secondary, italic
  - Verdict badge (pill): "FALSE" = red text on red-dim bg, "WASTEFUL" = amber text on amber-dim bg, "SOMETIMES" = secondary text on surface bg
  - Reality text revealed below on tap/click — collapsed by default (tap to expand)
  - This is the ONLY place in the app where accordion/expand behavior is used

For 'examples' section: render each item as:
  - Category badge (teal, pill)
  - Two columns side by side (or stacked on narrow): weak prompt card (0.5px red border) + strong prompt card (0.5px teal border)
  - Each card shows the prompt text in 12px monospace + why text in 11px secondary below

For 'faq' section: accordion list, each question as a row with a "+" / "−" indicator.
  Answer text revealed on tap. 13px secondary color for answers.

---

ENTRY POINT IN HEADER
The existing header has: "PromptShot" wordmark left, streak badge right.
Add the book icon between streak badge and right edge with 12px gap.
The icon uses this SVG path (book outline):
<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" stroke-width="1.5"/>