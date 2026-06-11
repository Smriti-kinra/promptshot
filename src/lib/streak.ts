import { supabase } from './supabase'

export async function calculateAndUpdateStreak(userId: string): Promise<number> {
  const { data: scores } = await supabase
    .from('scores')
    .select('played_at')
    .eq('user_id', userId)
    .order('played_at', { ascending: false })
    .limit(60)

  if (!scores || scores.length === 0) return 1

  const today = new Date().toISOString().split('T')[0]
  const dates = [...new Set(scores.map((s) => s.played_at))].sort().reverse()

  let streak = 0
  let expected = today

  for (const date of dates) {
    if (date === expected) {
      streak++
      const d = new Date(expected)
      d.setDate(d.getDate() - 1)
      expected = d.toISOString().split('T')[0]
    } else {
      break
    }
  }

  await supabase
    .from('profiles')
    .update({ streak, last_played: today })
    .eq('id', userId)

  return streak
}