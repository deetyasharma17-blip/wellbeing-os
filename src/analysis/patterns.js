const average = values => values.reduce((sum, value) => sum + value, 0) / values.length

export function analyzePatterns(readings) {
  if (readings.length < 8) return { baseline: null, recent: null, insights: [], alerts: [] }
  const sorted = [...readings].sort((a, b) => a.date.localeCompare(b.date))
  const current = sorted.slice(-3)
  const history = sorted.slice(0, -3).slice(-14)
  const keys = ['sleep', 'heart', 'hrv', 'screen', 'activity']
  const baseline = Object.fromEntries(keys.map(key => [key, average(history.map(day => day[key]))]))
  const recent = Object.fromEntries(keys.map(key => [key, average(current.map(day => day[key]))]))
  const insights = []
  const alerts = []
  const add = (id, title, description, suggestion, tone = 'lavender') => {
    insights.push({ id, title, description, suggestion, tone })
    alerts.push({ id, title, description, suggestion })
  }
  if (recent.sleep < baseline.sleep - 0.5) add('sleep', 'A little less sleep lately', `Your last 3 days averaged ${recent.sleep.toFixed(1)} hours, compared with your personal baseline of ${baseline.sleep.toFixed(1)} hours.`, 'Consider making a little extra time to wind down tonight.', 'peach')
  if (recent.activity < baseline.activity * 0.8) add('activity', 'Movement has shifted', `Your recent activity averaged ${Math.round(recent.activity)} minutes a day, compared with your usual ${Math.round(baseline.activity)} minutes.`, 'A short walk or gentle stretch could be a nice reset.', 'mint')
  if (recent.screen > baseline.screen + 0.5) add('screen', 'More time on screen', `Your recent daily screen time is about ${(recent.screen - baseline.screen).toFixed(1)} hours above your personal baseline.`, 'Try taking a short screen-free break when it feels right.')
  if (recent.heart > baseline.heart + 3 || recent.hrv < baseline.hrv - 5) add('heart', 'A change in heart trends', 'Your recent heart rate or HRV differs from your own recent baseline. Everyday factors can influence these readings.', 'Notice how you feel and consider a restful moment.', 'peach')
  if (recent.sleep < baseline.sleep - 0.5 && recent.screen > baseline.screen + 0.5) insights.unshift({ id: 'combined', title: 'Your patterns, together', description: 'Less sleep and more screen time have appeared together recently. This is an observation, not a diagnosis or proof of a cause.', suggestion: 'You might explore a screen-free wind-down routine.', tone: 'lavender' })
  if (!insights.length) insights.push({ id: 'steady', title: 'Your routines look steady', description: 'Recent demonstration readings are close to your personal baseline.', suggestion: 'Keep checking in with what feels right for you.', tone: 'mint' })
  return { baseline, recent, insights, alerts }
}
