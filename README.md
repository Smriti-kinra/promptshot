# PromptShot 🎯

PromptShot is a daily prompt engineering game. Built on a premium, game-focused **Forest Green system**, PromptShot teaches developers to write concise, structured, "one-shot" prompts that generate target outputs immediately—cutting API iterations and data center resource usage by 80%.

Most developers perform 4–6 iterative chat turns due to vague prompting, with each API call consuming ~10ml of water for cooling and generating carbon emissions. PromptShot turns prompt design into a game, proving that **better prompts = less AI usage = less resource consumption**.

---

## 🌟 Key Features

### 1. 5-State Game Machine with View Transitions
PromptShot enforces a strict, single-container state machine:
* `challenge` ➜ Target output and JetBrains Mono input editor.
* `loading` ➜ Spinning radar loader while the scorer processes.
* `results` ➜ Hero visual concentric scoring rings.
* `impact` ➜ Sliding environmental cost report with animated water glass.
* `already-played` ➜ Daily lock, countdown to midnight, and review resources.
Transitions between these states use the browser's native **View Transitions API** (`document.startViewTransition`) for fluid layout morphing.

### 2. SVG Scoring Bullseye & Interactive Breakdown
* Concentric SVG circles clockwise-fill to represent Accuracy (outer ring), Format (middle ring), and Brevity (inner ring) scores.
* Interactive breakdown rows feature custom hover tooltips explaining the scoring criteria.
* SVG rings support hover descriptions detailing exact sub-scores.

### 3. Dynamic Environmental Estimator
* Resource footprints are calculated dynamically on the backend based on Anthropic API token volume (`input_tokens` + `output_tokens`).
* Milliliter footprints are dynamically resolved to physical equivalents (e.g. `"roughly a teaspoon"`, `"roughly a tablespoon"`, `"a small shot glass"`, `"a quarter cup"`).

### 4. Lifetime & Community Savings Dashboard
* **Lifetime savings**: Aggregates the volume of water saved (ml/L) and CO₂ prevented (g/kg) by the user across all prompt shots compared to standard 5-iteration chat sessions.
* **Global Community Impact**: Queries and displays the collective environmental savings of the entire developer community in real-time.

### 5. Sandboxed Iframe Fallback (`figma.sit` compatibility)
* Incorporates a standard-compliant `MemoryStorage` backend in the client that intercepts restricted `localStorage` environments (like Figma's iframe preview sandbox).
* Guarantees that authentication and game sessions initialize gracefully without crashing.

### 6. Secure & Cheat-Resistant Backend
* Hono/Deno server hosted on Supabase Edge Functions.
* Verifies bearer JWT sessions via `supabase.auth.getUser()`.
* Challenge ideal prompts are hidden from initial payload fetches and returned only *after* score submission to prevent browser DevTools cheating.

---

## 📂 Project Architecture

```
├── README.md               # Core project documentation
├── agents.md               # AI Orchestration and Google Antigravity SDK guide
├── index.html              # HTML shell loading fonts and viewport config
├── package.json            # Node project configuration
├── src/
│   ├── app/
│   │   ├── App.tsx         # Main application coordinator & layout views
│   │   ├── challenges.ts   # Fallback list of daily challenges
│   │   └── components/     # App sub-components (Topbar, LearnPanel)
│   ├── hooks/
│   │   └── useGameState.ts # Game state storage, streak counters, local migrations
│   ├── lib/
│   │   ├── safeStorage.ts  # Iframe-safe localStorage memory fallback
│   │   ├── scorer.ts       # Unified API query client (scorePrompt, simulateScore)
│   │   ├── streak.ts       # Supabase client streak metrics calculator
│   │   └── supabase.ts     # Supabase DB client and type interfaces
│   └── styles/
│       ├── theme.css       # Color tokens, JetBrains Mono font-faces, animation keys
│       └── index.css       # Core styling entry point
└── supabase/
    └── functions/
        └── server/
            ├── index.tsx   # Dynamic Deno scorer route (Claude 3.5 Sonnet)
            └── kv_store.tsx# Database-backed key-value store interface
```

---

## 🛠️ Getting Started

### 1. Install Dependencies
Ensure you have Node.js 18+ installed. Run:
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Deploy/Serve Edge Functions
To serve the Deno scorer function locally:
```bash
supabase functions serve server
```
To deploy the function to production:
```bash
supabase functions deploy server
```

---

## 🤖 Autonomous Solver Agents

PromptShot supports play by autonomous AI solver agents. Developers can write scripts using the **Google Antigravity SDK** to fetch challenges, score prompts, parse feedback, and iteratively refine prompts in a feedback loop.

See [agents.md](file:///Users/smriti/Documents/GitHub/promptshot/agents.md) for full solver configurations, API contract details, and python solver examples.