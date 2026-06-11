export interface Challenge {
  id: string;
  category: "PARAGRAPH" | "CODE" | "LIST";
  difficulty: "BEGINNER" | "PRO" | "EXPERT";
  targetOutput: string;
  idealPrompt: string;
  charCount: number;
}

export const DAILY_CHALLENGES: Challenge[] = [
  {
    id: "001",
    category: "PARAGRAPH",
    difficulty: "BEGINNER",
    targetOutput: "The water cycle, also known as the hydrological cycle, describes the continuous movement of water through Earth's systems. Water evaporates from oceans and lakes, rises as vapor, condenses into clouds, and falls as precipitation. This process distributes fresh water across the planet and regulates global temperature.",
    idealPrompt: "Explain the water cycle in 3 sentences. Include: evaporation, condensation, and precipitation. Keep it factual and concise.",
    charCount: 312
  },
  {
    id: "002", 
    category: "CODE",
    difficulty: "PRO",
    targetOutput: "function debounce(fn, delay) {\n  let timer;\n  return function(...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn.apply(this, args), delay);\n  };\n}",
    idealPrompt: "Write a JavaScript debounce function. It should accept a function and delay in ms, return a new function that clears and resets a timer on each call, and execute the original function after the delay.",
    charCount: 148
  },
  {
    id: "003",
    category: "LIST",
    difficulty: "EXPERT",
    targetOutput: "Principles of effective feedback:\n• Specific over general — cite the exact behavior\n• Timely — given close to the event\n• Actionable — the receiver can do something with it\n• Separates behavior from identity — 'this report was unclear' not 'you are unclear'\n• Two-way — invites response",
    idealPrompt: "List the principles of effective feedback as bullet points. Each should be a short label followed by a one-sentence explanation. Include: specificity, timing, actionability, behavior vs identity, and dialogue.",
    charCount: 328
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
