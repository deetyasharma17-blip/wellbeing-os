import React, { useState } from 'react'
import { ArrowRight, Check, LockKeyhole } from 'lucide-react'
import { hasRegisteredUser, loginUser, registerUser } from '../utils/auth.js'

export default function AuthModal({ mode, onClose, onSuccess }) {
  const [view, setView] = useState(mode === 'signup' ? 'signup' : mode === 'forgot' ? 'forgot' : 'login')
  const [form, setForm] = useState({ name: '', email: '', password: '', ageRange: '', country: '', timezone: Intl.DateTimeFormat().resolvedOptions().timeZone })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const update = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }))
  const submit = async event => {
    event.preventDefault()
    setError('')
    setMessage('')
    setBusy(true)
    try {
      if (view === 'forgot') {
        setMessage(hasRegisteredUser() ? 'For this local demo, reset access by clearing the saved account in Privacy & Settings.' : 'No demo account is registered on this browser.')
      } else {
        const session = view === 'signup' ? await registerUser(form) : await loginUser(form.email, form.password)
        onSuccess(session, view === 'signup' ? { name: form.name, ageRange: form.ageRange, country: form.country, timezone: form.timezone } : null)
      }
    } catch (submissionError) {
      setError(submissionError.message)
    } finally {
      setBusy(false)
    }
  }
  return <div className="auth-backdrop" onClick={onClose}><div className="modal auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title" onClick={event => event.stopPropagation()}><button className="modal-close" onClick={onClose} aria-label="Close">×</button><span className="modal-icon"><LockKeyhole size={21}/></span><span className="eyebrow">YOUR PERSONAL SPACE</span><h2 id="auth-title">{view === 'signup' ? 'Create your account' : view === 'forgot' ? 'Reset your access' : 'Welcome back'}</h2><p>{view === 'signup' ? 'Create a local development account to save your wellbeing space.' : view === 'forgot' ? 'Password reset is simulated locally until a secure backend is connected.' : 'Sign in to continue to your wellbeing space.'}</p>{error && <div className="form-error" role="alert">{error}</div>}{message && <div className="form-success" role="status"><Check size={15}/>{message}</div>}<form onSubmit={submit}>{view === 'signup' && <><label>Full name<input name="name" value={form.name} onChange={update} placeholder="Your name" maxLength="80" required /></label><div className="form-row"><label>Age range<select name="ageRange" value={form.ageRange} onChange={update} required><option value="">Select</option><option>Under 18</option><option>18–24</option><option>25–34</option><option>35–44</option><option>45+</option><option>Prefer not to say</option></select></label><label>Country<input name="country" value={form.country} onChange={update} placeholder="Optional" /></label></div></>}<label>Email<input name="email" type="email" value={form.email} onChange={update} placeholder="you@example.com" required /></label>{view !== 'forgot' && <label>Password<input name="password" type="password" value={form.password} onChange={update} minLength="8" placeholder="At least 8 characters" required /></label>}<button className="button primary full" type="submit" disabled={busy}>{busy ? 'Please wait…' : view === 'signup' ? 'Create account' : view === 'forgot' ? 'Request reset' : 'Log in'} {!busy && <ArrowRight size={16}/>}</button></form>{view === 'login' && <button className="auth-switch" onClick={() => setView('forgot')}>Forgot password?</button>}{view === 'forgot' && <button className="auth-switch" onClick={() => { setView('login'); setMessage('') }}>Back to login</button>}{view !== 'forgot' && <button className="auth-switch" onClick={() => { setView(view === 'signup' ? 'login' : 'signup'); setError('') }}>{view === 'signup' ? 'Already have an account? Log in' : 'New here? Create an account'}</button>}<div className="auth-note"><Check size={15}/> Development mode: passwords are hashed locally; no real backend account exists yet.</div></div></div>
}
