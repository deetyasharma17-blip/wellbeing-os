import React, { useEffect, useMemo, useState } from 'react'
import Layout from './components/Layout.jsx'
import { analyzePatterns } from './analysis/patterns.js'
import { localDate, makeDemoReadings, reminderDefaults } from './data/demo.js'
import { clearState, loadState, saveState } from './utils/storage.js'
import { deleteUser, loadSession, logoutUser } from './utils/auth.js'
import Dashboard from './pages/Dashboard.jsx'
import ActivityTimeline from './pages/ActivityTimeline.jsx'
import Landing from './pages/Landing.jsx'
import Onboarding from './pages/Onboarding.jsx'
import { Alerts, Assistant, Devices, Insights, Institution, Mood, Reminders, Reports, Settings } from './pages/Features.jsx'

const initialState = () => ({ profile: { name: 'Alex', goals: [] }, readings: makeDemoReadings(), checkins: {}, devices: { phone: true, tablet: true, laptop: true }, reminders: reminderDefaults, onboardingComplete: false })

export default function App() {
  const [state, setState] = useState(() => {
    const saved = loadState()
    return saved ? { ...initialState(), ...saved } : initialState()
  })
  const [session, setSession] = useState(() => loadSession())
  const [page, setPage] = useState('landing')
  const [storageError, setStorageError] = useState(false)
  const analysis = useMemo(() => analyzePatterns(state.readings), [state.readings])
  useEffect(() => { setStorageError(!saveState(state)) }, [state])
  const update = (key, value) => setState(current => ({ ...current, [key]: typeof value === 'function' ? value(current[key]) : value }))
  const navigate = next => { setPage(next); window.scrollTo(0, 0) }
  const enter = (name, destination = 'dashboard') => { update('profile', { name }); navigate(destination) }
  const enterDemo = name => { update('profile', current => ({ ...current, name })); update('onboardingComplete', true); setSession({ email: 'demo@local', name, mode: 'demo' }); navigate('dashboard') }
  const handleAuthSuccess = (nextSession, profile) => { setSession(nextSession); if (profile) { update('profile', current => ({ ...current, ...profile })); update('onboardingComplete', false); navigate('onboarding') } else navigate(state.onboardingComplete ? 'dashboard' : 'onboarding') }
  const saveCheckin = entry => update('checkins', current => ({ ...current, [localDate()]: entry }))
  const updateReading = reading => update('readings', current => current.map(day => day.date === reading.date ? { ...reading, sleep: Number(reading.sleep), heart: Number(reading.heart), hrv: Number(reading.hrv), screen: Number(reading.screen), activity: Number(reading.activity) } : day))
  const deleteData = () => {
    if (!clearState()) { setStorageError(true); return }
    setState(initialState())
    deleteUser()
    setSession(null)
    navigate('landing')
  }
  const completeOnboarding = () => { update('onboardingComplete', true); navigate('dashboard') }
  const signOut = () => { logoutUser(); setSession(null); navigate('landing') }
  const props = { ...state, analysis, navigate, saveCheckin, updateReading, setDevices: value => update('devices', value), setReminders: value => update('reminders', value), setProfile: value => update('profile', value), onDelete: deleteData }
  const pages = { dashboard: Dashboard, devices: Devices, timeline: ActivityTimeline, insights: Insights, alerts: Alerts, assistant: Assistant, mood: Mood, reports: Reports, reminders: Reminders, settings: Settings, institution: Institution }
  const Page = pages[page]
  return <>{storageError && <div className="storage-error" role="alert">Your browser could not save demo data. Changes may not persist; check your browser storage settings.</div>}{!session ? <Landing onEnter={enterDemo} onAuthSuccess={handleAuthSuccess}/> : page === 'onboarding' || !state.onboardingComplete ? <Onboarding profile={state.profile} setProfile={value => update('profile', value)} setDevices={value => update('devices', value)} complete={completeOnboarding}/> : <Layout page={page} navigate={navigate} profile={state.profile} alertCount={analysis.alerts.length} onExit={signOut}><Page {...props}/></Layout>}</>
}
