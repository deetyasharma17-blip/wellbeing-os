export const deviceOptions = [
  { id: 'phone', name: 'Primary phone', description: 'Screen time, app usage and activity timestamps', icon: 'phone' },
  { id: 'tablet', name: 'Study tablet', description: 'Screen time, app usage and night-time activity', icon: 'tablet' },
  { id: 'laptop', name: 'Personal laptop', description: 'Supported browser activity and usage duration', icon: 'laptop' },
  { id: 'apple', name: 'Apple Health', description: 'Sleep, heart rate and activity', icon: 'apple' },
  { id: 'health', name: 'Health Connect', description: 'Android health and activity data', icon: 'heart' },
  { id: 'fitbit', name: 'Fitbit', description: 'Activity, sleep and heart rate', icon: 'activity' },
  { id: 'watch', name: 'Compatible smartwatch', description: 'Wearable activity and heart trends', icon: 'watch' },
]

export const reminderDefaults = [
  { id: 'sleep', name: 'Wind down for sleep', description: 'Make space for a calming evening routine.', time: '21:30', enabled: false },
  { id: 'water', name: 'Hydration', description: 'A gentle reminder to drink some water.', time: '10:00', enabled: false },
  { id: 'screen', name: 'Screen break', description: 'Give your eyes and attention a little rest.', time: '14:00', enabled: false },
  { id: 'movement', name: 'A moment to move', description: 'Take a walk, stretch, or move your way.', time: '16:00', enabled: false },
  { id: 'study', name: 'Study & rest balance', description: 'Pause and make room for a proper break.', time: '15:00', enabled: false },
  { id: 'checkin', name: 'Daily check-in', description: 'Take a moment to notice how you feel.', time: '19:00', enabled: false },
]

export const moods = [
  { value: 'great', label: 'Great', emoji: '😄', score: 5 },
  { value: 'good', label: 'Good', emoji: '🙂', score: 4 },
  { value: 'okay', label: 'Okay', emoji: '😌', score: 3 },
  { value: 'low', label: 'Low', emoji: '😔', score: 2 },
  { value: 'rough', label: 'Rough', emoji: '😣', score: 1 },
]

export function localDate(offset = 0) {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function makeDemoReadings() {
  return Array.from({ length: 30 }, (_, index) => {
    const wave = Math.sin(index * 1.7)
    const recent = index >= 27
    return {
      date: localDate(index - 29),
      sleep: +(7.5 + wave * 0.45 - (recent ? 0.9 : 0)).toFixed(1),
      heart: Math.round(68 + Math.cos(index * 1.2) * 3 + (recent ? 3 : 0)),
      hrv: Math.round(56 + wave * 4 - (recent ? 6 : 0)),
      screen: +(4.1 + Math.cos(index * 0.9) * 0.5 + (recent ? 0.7 : 0)).toFixed(1),
      activity: Math.round(44 + Math.sin(index * 1.1) * 9 - (recent ? 10 : 0)),
    }
  })
}
