import React from 'react'
import { Activity, ArrowDown, ArrowRight, ArrowUp, Check, ChevronRight, Heart, Moon, Smartphone, Sparkles, Watch, Footprints } from 'lucide-react'

export function Logo({ light = false }) {
  return <div className={`brand ${light ? 'brand-light' : ''}`}><span className="brand-mark"><span>✳</span></span><span>wellbeing<span className="brand-os">OS</span><small>YOUR SPACE TO FEEL BETTER</small></span></div>
}

export function SectionTitle({ eyebrow, title, action, onAction }) {
  return <div className="section-title"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2></div>{action && <button className="text-button" onClick={onAction}>{action} <ArrowRight size={15} /></button>}</div>
}

export function Card({ children, className = '' }) {
  return <div className={`card ${className}`}>{children}</div>
}

export function IconBox({ icon: Icon, tone = 'purple', size = 19 }) {
  return <span className={`icon-box ${tone}`}><Icon size={size} strokeWidth={1.8} /></span>
}

export function Toggle({ checked, onChange, label }) {
  return <button type="button" className={`toggle ${checked ? 'on' : ''}`} role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)}><span /></button>
}

export function MetricCard({ title, value, unit, detail, icon, tone, direction }) {
  return <Card className="metric-card"><div className="metric-top"><IconBox icon={icon} tone={tone} /><span className="metric-dots">···</span></div><div className="metric-label">{title}</div><div className="metric-value">{value}<span>{unit}</span></div><div className="metric-detail">{direction === 'up' ? <ArrowUp size={13} /> : direction === 'down' ? <ArrowDown size={13} /> : null}{detail}</div></Card>
}

export function InsightCard({ insight, compact = false }) {
  const icon = insight.id === 'sleep' ? Moon : insight.id === 'activity' ? Footprints : insight.id === 'screen' ? Smartphone : insight.id === 'heart' ? Heart : Sparkles
  return <div className={`insight-item ${compact ? 'compact' : ''}`}><IconBox icon={icon} tone={insight.tone === 'peach' ? 'peach' : insight.tone === 'mint' ? 'mint' : 'purple'} /><div><h3>{insight.title}</h3><p>{insight.description}</p>{!compact && <p className="insight-suggestion">{insight.suggestion}</p>}</div></div>
}

export function EmptyState({ title, text, icon: Icon = Sparkles }) {
  return <div className="empty-state"><Icon size={24} /><h3>{title}</h3><p>{text}</p></div>
}

export function DeviceIcon({ type }) {
  const Icon = type === 'watch' ? Watch : type === 'phone' || type === 'tablet' || type === 'laptop' ? Smartphone : type === 'heart' ? Heart : type === 'activity' ? Activity : Heart
  return <Icon size={21} />
}

export function PageHeader({ eyebrow, title, description, children }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{children}</div>
}

export function Step({ number, title, children }) {
  return <div className="landing-step"><span>0{number}</span><h3>{title}</h3><p>{children}</p><ChevronRight size={17} /></div>
}

export function SavedBadge() { return <span className="saved-badge"><Check size={13} /> Saved on this browser</span> }
