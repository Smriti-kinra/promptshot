import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";

const app = new Hono();
app.use('*', logger(console.log));
app.use("/*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "OPTIONS"],
}));

app.get("/make-server-488928a2/health", (c) => c.json({ status: "ok" }));

async function callClaudeScorer(userPrompt: string, targetOutput: string, idealPrompt: string) {
  const ANTHROPIC_KEY = Deno.env.get("ANTHROPIC_API_KEY");
  if (!ANTHROPIC_KEY) throw new Error("ANTHROPIC_API_KEY not set");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      system: "You are a precise scoring engine. Return only valid JSON.",
      messages: [
        {
          role: "user",
          content: `Score this prompt attempt. Return JSON only, no markdown.\n\nTARGET OUTPUT:\n${targetOutput}\n\nIDEAL PROMPT:\n${idealPrompt}\n\nUSER PROMPT:\n${userPrompt}\n\nScore each dimension 0-100:\n- accuracy: does the user prompt specify the right content and angle?\n- format: does it specify structure, length, and output type correctly?\n- brevity: is it concise? (100 if under 60 chars, scales down to 20 at 300+ chars)\n\nReturn: {"accuracy": N, "format": N, "brevity": N}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Anthropic API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text ?? "{}";
  const scores = JSON.parse(text.replace(/```json?|```/g, "").trim());

  const accuracy = Math.max(0, Math.min(100, Math.round(scores.accuracy ?? 50)));
  const format = Math.max(0, Math.min(100, Math.round(scores.format ?? 50)));
  const brevity = Math.max(0, Math.min(100, Math.round(scores.brevity ?? 50)));

  return { accuracy, format, brevity, total: accuracy + format + brevity, waterMl: 10, co2Grams: 0.1 };
}

function fallbackScore(userPrompt: string) {
  const brevity = userPrompt.length < 80 ? 80 : userPrompt.length < 150 ? 60 : 40;
  const accuracy = 55 + Math.floor(Math.random() * 20);
  const format = 60 + Math.floor(Math.random() * 20);
  return { accuracy, format, brevity, total: accuracy + format + brevity, waterMl: 10, co2Grams: 0.1 };
}

app.post("/make-server-488928a2/score", async (c) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const { userPrompt, targetOutput, idealPrompt } = await c.req.json();
  if (!userPrompt || !targetOutput || !idealPrompt) {
    return c.json({ error: "Missing fields" }, 400);
  }

  try {
    return c.json(await callClaudeScorer(userPrompt, targetOutput, idealPrompt));
  } catch (err) {
    console.error("Scoring error (auth route):", err);
    return c.json(fallbackScore(userPrompt));
  }
});

app.post("/make-server-488928a2/score-guest", async (c) => {
  const { userPrompt, targetOutput, idealPrompt } = await c.req.json();
  if (!userPrompt || !targetOutput || !idealPrompt) {
    return c.json({ error: "Missing fields" }, 400);
  }

  try {
    return c.json(await callClaudeScorer(userPrompt, targetOutput, idealPrompt));
  } catch (err) {
    console.error("Scoring error (guest route):", err);
    return c.json(fallbackScore(userPrompt));
  }
});

Deno.serve(app.fetch);
