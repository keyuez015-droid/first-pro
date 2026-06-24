/** 情绪配置 · 手绘小动物映射 · MOODA 计分逻辑 */
const MOODS = [
  { id: 'tired', label: '心累', color: '#C4B5A8', score: -8, animal: 'cat', positive: false },
  { id: 'angry', label: '生气', color: '#D4A5A5', score: -12, animal: 'bear', positive: false },
  { id: 'excited', label: '兴奋', color: '#E8C98A', score: 10, animal: 'bird', positive: true },
  { id: 'irritated', label: '烦躁', color: '#B8A9C9', score: -6, animal: 'dog', positive: false },
  { id: 'heart', label: '心动', color: '#E8B4B8', score: 12, animal: 'bunny', positive: true },
  { id: 'calm', label: '平静', color: '#A8C4BC', score: 8, animal: 'fish', positive: true },
  { id: 'sad', label: '伤心', color: '#9BAFC4', score: -10, animal: 'puppy', positive: false },
  { id: 'happy', label: '开心', color: '#F0D5A8', score: 15, animal: 'elephant', positive: true }
]

const MOOD_MAP = MOODS.reduce((acc, m) => { acc[m.id] = m; return acc }, {})

const BASE_SCORE = 500

function getMood(id) {
  return MOOD_MAP[id] || null
}

function calcTotalScore(records) {
  let total = BASE_SCORE
  records.forEach(r => {
    const m = getMood(r.mood)
    if (m) total += m.score
  })
  return Math.max(0, Math.min(1000, total))
}

function aggregateMoods(records) {
  const counts = {}
  MOODS.forEach(m => { counts[m.id] = 0 })
  records.forEach(r => {
    if (r.mood && counts[r.mood] !== undefined) counts[r.mood]++
  })
  return counts
}

function getTopMoods(records, limit = 10) {
  const counts = aggregateMoods(records)
  return MOODS
    .map(m => ({ ...m, count: counts[m.id] }))
    .filter(m => m.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

function getTrendData(records) {
  const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date))
  return sorted.map(r => {
    const m = getMood(r.mood)
    return {
      date: r.date,
      label: r.date.slice(5),
      positive: m ? (m.positive ? m.score : 0) : 0,
      negative: m ? (!m.positive ? Math.abs(m.score) : 0) : 0,
      score: m ? m.score : 0
    }
  })
}

module.exports = { MOODS, MOOD_MAP, BASE_SCORE, getMood, calcTotalScore, aggregateMoods, getTopMoods, getTrendData }
