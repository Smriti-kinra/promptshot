export interface Challenge {
  id: string;
  category:
    | "PARAGRAPH"
    | "CODE"
    | "LIST"
    | "ROLE"
    | "TONE"
    | "CONSTRAINTS";
  difficulty: "BEGINNER" | "PRO" | "EXPERT";
  skill: string;
  impactLesson: string;
  targetOutput: string;
  idealPrompt: string;
  charCount: number;
}

export const DAILY_CHALLENGES: Challenge[] = [
  {
    id: "001",
    category: "PARAGRAPH",
    difficulty: "BEGINNER",
    skill: "Format + key concepts",
    impactLesson: "Naming the required concepts up front avoids follow-up prompts for missing details.",
    targetOutput: "The water cycle, also known as the hydrological cycle, describes the continuous movement of water through Earth's systems. Water evaporates from oceans and lakes, rises as vapor, condenses into clouds, and falls as precipitation. This process distributes fresh water across the planet and regulates global temperature.",
    idealPrompt: "Explain the water cycle in 3 sentences. Include: evaporation, condensation, and precipitation. Keep it factual and concise.",
    charCount: 312
  },
  {
    id: "002", 
    category: "CODE",
    difficulty: "PRO",
    skill: "Technical specification",
    impactLesson: "Precise implementation details reduce expensive regenerate-and-debug loops.",
    targetOutput: "function debounce(fn, delay) {\n  let timer;\n  return function(...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn.apply(this, args), delay);\n  };\n}",
    idealPrompt: "Write a JavaScript debounce function. It should accept a function and delay in ms, return a new function that clears and resets a timer on each call, and execute the original function after the delay.",
    charCount: 148
  },
  {
    id: "003",
    category: "LIST",
    difficulty: "EXPERT",
    skill: "Structured list constraints",
    impactLesson: "A clear list shape lets the model spend less work guessing structure.",
    targetOutput: "Principles of effective feedback:\n• Specific over general — cite the exact behavior\n• Timely — given close to the event\n• Actionable — the receiver can do something with it\n• Separates behavior from identity — 'this report was unclear' not 'you are unclear'\n• Two-way — invites response",
    idealPrompt: "List the principles of effective feedback as bullet points. Each should be a short label followed by a one-sentence explanation. Include: specificity, timing, actionability, behavior vs identity, and dialogue.",
    charCount: 328
  },
  {
    id: "004",
    category: "ROLE",
    difficulty: "PRO",
    skill: "Role assignment",
    impactLesson: "A role tells the model which expertise to simulate, so the first answer lands closer to the need.",
    targetOutput: "As your interview coach, focus on three things: tighten the opening story, quantify the project impact, and prepare one recovery answer for mistakes. Practice aloud twice, then trim anything that sounds memorized.",
    idealPrompt: "Act as an interview coach. Give concise advice for improving a software engineer's behavioral interview answer. Include exactly 3 focus areas plus one practice instruction. Sound direct and supportive.",
    charCount: 214
  },
  {
    id: "005",
    category: "TONE",
    difficulty: "BEGINNER",
    skill: "Tone control",
    impactLesson: "Tone instructions prevent rewrites caused by outputs that are technically right but socially wrong.",
    targetOutput: "Thanks for sending this over. I can review it by Friday afternoon. If you need a faster turnaround, please send the two sections you want prioritized and I will look at those first.",
    idealPrompt: "Write a polite but firm reply to a coworker asking for a document review. Say you can review it by Friday afternoon. If they need it sooner, ask them to send the two priority sections first.",
    charCount: 181
  },
  {
    id: "006",
    category: "CONSTRAINTS",
    difficulty: "EXPERT",
    skill: "Negative constraints",
    impactLesson: "Exclusions are efficiency tools: they stop the model from generating plausible but unwanted material.",
    targetOutput: "Urban balcony garden checklist:\n• 6+ hours of light\n• Containers with drainage\n• Lightweight potting mix\n• Herbs or compact greens\n• Watering plan for hot days\nAvoid: invasive plants, heavy soil, and pesticide sprays.",
    idealPrompt: "Create a balcony garden checklist for a city apartment. Use bullet points. Include light, containers, soil, plant choices, and watering. Add an Avoid line with invasive plants, heavy soil, and pesticide sprays.",
    charCount: 222
  },
  {
    id: "007",
    category: "PARAGRAPH",
    difficulty: "PRO",
    skill: "Audience context",
    impactLesson: "Audience context cuts wasted explanation by matching depth and vocabulary on the first pass.",
    targetOutput: "A transformer is an AI architecture that reads words in relation to one another instead of one at a time. That lets it notice which words matter most in a sentence, even when they are far apart. This is why modern chatbots can follow context across longer questions.",
    idealPrompt: "Explain what a transformer is in 3 sentences for a curious high school student. Avoid equations. Emphasize attention, relationships between words, and why it helps chatbots follow context.",
    charCount: 274
  }
];

export function getTodaysChallenge(): Challenge {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  const index = dayOfYear % DAILY_CHALLENGES.length;
  return DAILY_CHALLENGES[index];
}
