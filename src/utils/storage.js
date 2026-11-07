const KEY = 'wellbeing-os-demo-v1'

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch (error) {
    console.error('Unable to read local demo data:', error)
    return null
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
    return true
  } catch (error) {
    console.error('Unable to save local demo data:', error)
    return false
  }
}

export function clearState() {
  try {
    localStorage.removeItem(KEY)
    return true
  } catch (error) {
    console.error('Unable to delete local demo data:', error)
    return false
  }
}
