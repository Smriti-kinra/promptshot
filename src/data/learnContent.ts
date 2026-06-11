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
          description: "How the output should look. Paragraph, bullet list, code block, table, JSON. If you don't specify, you get whatever the AI defaults to.",
          example: '→ "...as a numbered list of 5 items"'
        },
        {
          label: 'Context',
          color: 'amber',
          description: "Why you need it and who it's for. This changes tone, vocabulary, and depth dramatically.",
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
          myth: "Vague prompts give more creative results",
          reality: "Vagueness produces generic defaults, not creativity. To get creative output, be specific about the creative direction — tone, style, constraints.",
          verdict: 'FALSE'
        },
        {
          myth: "Just say \"be more detailed\" if it's too short",
          reality: '"More detail" is not a direction. Specify what dimension you want expanded: more examples, deeper explanation, more edge cases.',
          verdict: 'WASTEFUL'
        },
        {
          myth: 'Repeating the same prompt differently will fix it',
          reality: 'If an output was wrong, diagnosing WHY it was wrong and changing one specific thing is 3× more effective than a full rewrite.',
          verdict: 'WASTEFUL'
        },
        {
          myth: '"Please" or "as an AI" affects the response',
          reality: 'Politeness has no effect on output quality. "As an AI" instructions are redundant. Neither costs you points here but both waste your character count.',
          verdict: 'FALSE'
        },
        {
          myth: 'You need to explain the whole background',
          reality: "The AI knows general knowledge. Only explain what is specific to YOUR situation that it couldn't infer.",
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
            why: "No format, no length, no audience, no angle. You'll get a generic essay."
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
          answer: "Because in real usage, every token in your prompt costs compute time, energy, and water in a data centre. A prompt engineer who gets accurate output in 50 words is objectively more efficient than one who needs 200 words. Brevity is not a stylistic preference — it's a resource question."
        },
        {
          question: 'How does AI actually use water?',
          answer: 'Data centres that run AI models require massive cooling systems. That cooling uses water — evaporated to remove heat from servers. A 2023 University of Massachusetts study estimated roughly 10ml of water per ChatGPT query. Multiply that by billions of daily interactions and it becomes a serious infrastructure concern.'
        },
        {
          question: 'Why show environmental impact in a game?',
          answer: "Because the skill gap in prompting doesn't feel real until you see its cost. A person who needs 5 follow-up prompts to get the same output as someone who got it in one used 5× the resources. Prompt engineering is not just a productivity skill — it's a conservation behaviour."
        },
        {
          question: 'What is a perfect prompt?',
          answer: "The shortest sequence of words that produces the target output with no follow-ups needed. It specifies task, format, context, and constraints — but nothing extra. Perfect prompts are rarely discovered on the first try. That's why this is a skill, not a trick."
        },
        {
          question: "Can I replay today's challenge?",
          answer: 'No — the game is once-per-day by design, like Wordle. This creates the social moment: everyone is working from the same target. A new challenge unlocks at midnight.'
        }
      ]
    }
  ]
};
