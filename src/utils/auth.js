const USER_KEY = 'wellbeing-os-demo-user-v1'
const SESSION_KEY = 'wellbeing-os-demo-session-v1'

async function hashPassword(password) {
  if (!globalThis.crypto?.subtle) throw new Error('Secure browser cryptography is unavailable.')
  const bytes = new TextEncoder().encode(password)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest)).map(byte => byte.toString(16).padStart(2, '0')).join('')
}

function read(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch (error) {
    console.error(`Unable to read ${key}:`, error)
    return null
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error(`Unable to write ${key}:`, error)
    return false
  }
}

export async function registerUser(details) {
  const existing = read(USER_KEY)
  if (existing?.email === details.email.toLowerCase()) throw new Error('An account with this email already exists on this browser.')
  const user = { ...details, email: details.email.toLowerCase(), passwordHash: await hashPassword(details.password) }
  delete user.password
  if (!write(USER_KEY, user)) throw new Error('This browser could not save the demo account.')
  return createSession(user)
}

export async function loginUser(email, password) {
  const user = read(USER_KEY)
  if (!user || user.email !== email.trim().toLowerCase() || user.passwordHash !== await hashPassword(password)) throw new Error('Email or password is incorrect.')
  return createSession(user)
}

export function createSession(user) {
  const session = { email: user.email, name: user.name, createdAt: new Date().toISOString() }
  if (!write(SESSION_KEY, session)) throw new Error('This browser could not create a session.')
  return session
}

export function loadSession() {
  return read(SESSION_KEY)
}

export function logoutUser() {
  try {
    localStorage.removeItem(SESSION_KEY)
    return true
  } catch (error) {
    console.error('Unable to end demo session:', error)
    return false
  }
}

export function deleteUser() {
  try {
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(SESSION_KEY)
    return true
  } catch (error) {
    console.error('Unable to delete demo account:', error)
    return false
  }
}

export function hasRegisteredUser() {
  return Boolean(read(USER_KEY))
}
