import React, { useState } from 'react'
import { Activity, BarChart3, Bell, Bot, ChevronDown, CircleHelp, Clock3, LayoutDashboard, LogOut, Menu, Settings, ShieldCheck, Smile, Smartphone, Sparkles, X, Zap } from 'lucide-react'
import { Logo } from './UI.jsx'

export const navigation = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'devices', label: 'Connected Devices', icon: Smartphone },
  { id: 'timeline', label: 'Activity Timeline', icon: Clock3 },
  { id: 'insights', label: 'AI Insights', icon: Sparkles },
  { id: 'alerts', label: 'Early Alerts', icon: Zap },
  { id: 'assistant', label: 'AI Assistant', icon: Bot },
  { id: 'mood', label: 'Mood Tracker', icon: Smile },
  { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
  { id: 'reminders', label: 'Smart Reminders', icon: Bell },
  { id: 'settings', label: 'Privacy & Settings', icon: Settings },
]

export default function Layout({ page, navigate, profile, children, alertCount, onExit }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const go = id => { navigate(id); setMenuOpen(false) }
  const current = navigation.find(item => item.id === page)
  return <div className="app-shell">
    {menuOpen && <button className="sidebar-backdrop" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}
    <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-brand"><Logo /><button className="mobile-close icon-button" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={20} /></button></div>
      <div className="side-label">YOUR WORKSPACE</div>
      <nav className="side-nav" aria-label="Main navigation">
        {navigation.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => go(id)} className={`nav-item ${page === id ? 'active' : ''}`}><Icon size={18} strokeWidth={1.8} /><span>{label}</span>{id === 'alerts' && alertCount > 0 && <span className="nav-count">{alertCount}</span>}</button>)}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-note"><div className="sidebar-note-icon"><ShieldCheck size={18} /></div><div><strong>Made for you, privately.</strong><p>Your wellbeing, your data.</p></div></div>
        <button className="side-help" onClick={() => go('settings')}><CircleHelp size={17} /> Privacy & support <ChevronDown size={14} /></button>
        <button className="profile-button" onClick={() => go('settings')}><span className="avatar">{profile.name.charAt(0).toUpperCase()}</span><span><strong>{profile.name}</strong><small>Personal space</small></span><ChevronDown size={15} /></button>
      </div>
    </aside>
    <main className="main-area">
      <header className="topbar"><button className="mobile-menu icon-button" aria-label="Open menu" onClick={() => setMenuOpen(true)}><Menu size={21} /></button><div className="breadcrumb"><span>My workspace</span><span>/</span><strong>{current?.label || 'Future module'}</strong></div><div className="top-actions"><span className="demo-pill"><span /> DEMO MODE</span><button className="icon-button notification-button" aria-label="View early alerts" onClick={() => go('alerts')}><Bell size={19} />{alertCount > 0 && <i />}</button><span className="top-divider" /><button className="top-profile" onClick={() => go('settings')}><span className="avatar small">{profile.name.charAt(0).toUpperCase()}</span><span>{profile.name}</span><ChevronDown size={14} /></button><button className="icon-button exit-button" aria-label="Return to landing page" onClick={onExit}><LogOut size={17} /></button></div></header>
      <div className="content">{children}</div>
      <footer className="app-footer"><span>© 2026 wellbeingOS · A little more in tune, every day.</span><span><Activity size={13} /> Fictional data · Not medical advice</span></footer>
    </main>
  </div>
}
