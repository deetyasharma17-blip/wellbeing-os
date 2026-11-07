const MINUTES_PER_DAY = 24 * 60

export const deviceActivityDefaults = {
  phone: {
    name: 'Primary phone',
    type: 'Phone',
    status: 'simulated',
    lastSync: 'Just now',
    categories: ['Screen time', 'App usage', 'Activity timestamps'],
    firstActivity: '06:30',
    lastActivity: '22:30',
    dailyMinutes: 238,
  },
  tablet: {
    name: 'Study tablet',
    type: 'Tablet',
    status: 'simulated',
    lastSync: 'Just now',
    categories: ['Screen time', 'App usage', 'Night-time activity'],
    firstActivity: '07:15',
    lastActivity: '22:45',
    dailyMinutes: 126,
  },
  laptop: {
    name: 'Personal laptop',
    type: 'Laptop',
    status: 'simulated',
    lastSync: 'Just now',
    categories: ['Browser activity', 'Usage duration', 'Activity timestamps'],
    firstActivity: '08:05',
    lastActivity: '21:50',
    dailyMinutes: 184,
  },
}

const toMinutes = time => {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

export function getConnectedActivity(devices = {}) {
  return Object.entries(deviceActivityDefaults)
    .filter(([id]) => devices[id] === true)
    .map(([id, activity]) => ({ id, ...activity }))
}

export function estimateOvernightWindow(activities) {
  if (!activities.length) return null
  const lastActivity = Math.max(...activities.map(item => toMinutes(item.lastActivity)))
  const firstActivity = Math.min(...activities.map(item => toMinutes(item.firstActivity)))
  const duration = (MINUTES_PER_DAY - lastActivity + firstActivity) % MINUTES_PER_DAY
  return {
    firstActivity: activities.reduce((earliest, item) => toMinutes(item.firstActivity) < toMinutes(earliest) ? item.firstActivity : earliest, activities[0].firstActivity),
    lastActivity: activities.reduce((latest, item) => toMinutes(item.lastActivity) > toMinutes(latest) ? item.lastActivity : latest, activities[0].lastActivity),
    minutes: duration,
    label: `${Math.floor(duration / 60)}h ${duration % 60}m`,
  }
}

export function getActivityTimeline(activities) {
  return activities.flatMap(item => [
    { time: item.firstActivity, device: item.name, type: 'First recorded activity', detail: item.categories[0] },
    { time: item.lastActivity, device: item.name, type: 'Last recorded activity', detail: item.categories[0] },
  ]).sort((a, b) => toMinutes(a.time) - toMinutes(b.time))
}
