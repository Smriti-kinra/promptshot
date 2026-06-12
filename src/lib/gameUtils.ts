import { supabase } from "./supabase";
import type { Challenge } from "./supabase";
import { DAILY_CHALLENGES } from "../app/challenges";

// ─── score display helpers ─────────────────────────────────────────────────────

export function getScoreLabel(total: number): string {
  if (total > 240) return "Bullseye 🎯";
  if (total >= 180) return "On target";
  if (total >= 120) return "Close range";
  return "Missed";
}

export function getBrevityColor(length: number): string {
  if (length < 80) return "#14B8A6";
  if (length < 150) return "#F59E0B";
  return "#EF4444";
}

export function getWaterComparison(ml: number): string {
  if (ml <= 10) return "roughly a teaspoon";
  if (ml <= 30) return "roughly a tablespoon";
  if (ml <= 50) return "a small shot glass";
  return "a quarter cup";
}

// ─── challenge loading helpers ────────────────────────────────────────────────

export function getDayOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d.getTime() - start.getTime()) / 86400000);
}

export function getLocalFallbackChallenge(difficulty: string): Challenge {
  const filtered = DAILY_CHALLENGES.filter(
    (c) => c.difficulty.toUpperCase() === difficulty.toUpperCase()
  );
  const pool = filtered.length > 0 ? filtered : DAILY_CHALLENGES;
  const dayOfYear = getDayOfYear(new Date());
  const localCh = pool[dayOfYear % pool.length];

  return {
    id: localCh.id,
    category: localCh.category,
    difficulty: localCh.difficulty,
    target_output: localCh.targetOutput,
    ideal_prompt: localCh.idealPrompt,
    char_count: localCh.charCount,
    active: true,
  };
}

export async function loadChallenge(
  difficulty: string,
  selectFields: string
): Promise<Challenge | null> {
  const dayOfYear = getDayOfYear(new Date());
  try {
    const { data, error } = await supabase
      .from("challenges")
      .select(selectFields)
      .eq("difficulty", difficulty)
      .eq("active", true)
      .order("id");

    if (error || !data || data.length === 0) {
      console.warn("Challenges query empty/failed from database, falling back to local dataset.");
      return getLocalFallbackChallenge(difficulty);
    }
    return data[dayOfYear % data.length];
  } catch (err) {
    console.error("Error loading challenge from Supabase, falling back to local dataset:", err);
    return getLocalFallbackChallenge(difficulty);
  }
}
