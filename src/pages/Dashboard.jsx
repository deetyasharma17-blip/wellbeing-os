import React, { useState } from 'react'
import { Activity, ArrowRight, BarChart3, ChevronRight, Clock3, Footprints, Heart, Moon, Plus, Smile, Smartphone, Sparkles } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, IconBox, InsightCard, MetricCard, SectionTitle } from '../components/UI.jsx'
import { localDate, moods } from '../data/demo.js'

const dayLabel = date => new Date(`${date}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short' })

export default function Dashboard({ profile, readings, checkins, analysis, navigate, saveCheckin }) {
  const [selectedMood, setSelectedMood] = useState(checkins[localDate()]?.mood || '')
  const [chartMetric, setChartMetric] = useState('sleep')
  const today = readings.at(-1)
  const chartData = readings.slice(-7).map(day => ({ ...day, day: dayLabel(day.date) }))
  const metric = { sleep: { name: 'Sleep', unit: ' hrs', color: '#9273e6' }, activity: { name: 'Activity', unit: ' min', color: '#6ebaa6' }, screen: { name: 'Screen time', unit: ' hrs', color: '#e5a682' } }[chartMetric]
  const todayMood = checkins[localDate()]
  const saveMood = mood => { setSelectedMood(mood); saveCheckin({ ...(todayMood || {}), mood }) }
  return <>
    <div className="dashboard-welcome"><div><div className="greeting-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} <span>✦</span> YOUR PERSONAL SPACE</div><h1>Good to see you, {profile.name} <span>✳</span></h1><p>Here's a little look at how you've been doing.</p></div><button className="button outline" onClick={() => navigate('mood')}><Plus size={16}/> New check-in</button></div>
    <div className="dashboard-layout"><div className="dashboard-main">
      <div className="overview-banner"><div className="banner-copy"><span className="banner-eyebrow"><Sparkles size={14}/> YOUR WELLBEING, AT A GLANCE</span><h2>Every day is a chance<br/>to <em>check in with you.</em></h2><p>Small patterns can tell a bigger story. Let's take a look at yours, together.</p><button onClick={() => navigate('insights')}>Explore your insights <ArrowRight size={16}/></button></div><div className="banner-art"><div className="art-ring ring-a"/><div className="art-ring ring-b"/><div className="art-center"><Sparkles size={23}/><span>MADE FOR</span><strong>your rhythm</strong></div><span className="art-star one">✳</span><span className="art-star two">✦</span><span className="art-star three">✧</span></div></div>
      <div className="metrics-heading"><SectionTitle eyebrow="THE LITTLE THINGS ADD UP" title="Your daily overview"/><span>Latest fictional readings <span className="muted-dot">●</span></span></div>
      <div className="metrics-grid">
        <MetricCard title="Sleep duration" value={today.sleep} unit="hrs" detail="Last night's sleep" icon={Moon} tone="purple"/>
        <MetricCard title="Heart rate" value={today.heart} unit="bpm" detail="Daily resting trend" icon={Heart} tone="peach"/>
        <MetricCard title="HRV" value={today.hrv} unit="ms" detail="Daily average" icon={Activity} tone="pink"/>
        <MetricCard title="Screen time" value={today.screen} unit="hrs" detail="Today's screen time" icon={Smartphone} tone="blue"/>
        <MetricCard title="Activity" value={today.activity} unit="min" detail="Today's movement" icon={Footprints} tone="mint"/>
      </div>
      <div className="chart-section"><Card className="chart-card"><div className="chart-card-header"><div><span className="eyebrow">A CLOSER LOOK</span><h2>Your weekly rhythm</h2><p>A little perspective on the past 7 days.</p></div><label className="select-wrap"><span className="sr-only">Choose weekly chart metric</span><select value={chartMetric} onChange={event => setChartMetric(event.target.value)}><option value="sleep">Sleep</option><option value="activity">Activity</option><option value="screen">Screen time</option></select></label></div><div className="chart-legend"><span /> {metric.name} <small>· fictional demo data</small></div><div className="dashboard-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{ top: 10, right: 12, left: -25, bottom: 0 }}><defs><linearGradient id="dashGradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor={metric.color} stopOpacity={0.22}/><stop offset="100%" stopColor={metric.color} stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#f0eef5" strokeDasharray="3 4" vertical={false}/><XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#9b98a9' }} dy={10}/><YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#9b98a9' }} width={45}/><Tooltip formatter={value => [`${value}${metric.unit}`, metric.name]} contentStyle={{ borderRadius: 12, border: '1px solid #eeebf4', fontSize: 12 }}/><Area type="monotone" dataKey={chartMetric} stroke={metric.color} strokeWidth={2.5} fill="url(#dashGradient)" dot={{ r: 3, fill: '#fff', strokeWidth: 2 }} activeDot={{ r: 5 }}/></AreaChart></ResponsiveContainer></div></Card></div>
      <Card className="daily-note"><div className="daily-note-icon"><Heart size={20}/></div><div><span className="eyebrow">A LITTLE REMINDER</span><strong>Progress isn't about perfect days.</strong><p>It's about making space to notice how you're doing. You're doing great by being here.</p></div><span>✳</span></Card>
    </div><aside className="dashboard-aside">
      <Card className="mood-card"><div className="aside-card-top"><div><span className="eyebrow">A MOMENT FOR YOU</span><h2>How are you feeling?</h2><p>There's no wrong answer.</p></div><IconBox icon={Smile} tone="peach"/></div><div className="mood-row">{moods.map(mood => <button key={mood.value} onClick={() => saveMood(mood.value)} className={`mood-option ${selectedMood === mood.value ? 'selected' : ''}`} aria-pressed={selectedMood === mood.value}><span>{mood.emoji}</span><small>{mood.label}</small></button>)}</div><div className="mood-footer"><span>{todayMood?.mood ? 'Your check-in is saved locally.' : 'Take a moment to check in.'}</span><button onClick={() => navigate('mood')}>Add a note <ChevronRight size={15}/></button></div></Card>
      <Card className="insights-card"><div className="aside-card-top"><div><span className="eyebrow">THOUGHTFULLY, FOR YOU</span><h2>A little insight</h2><p>Based on your recent patterns.</p></div><IconBox icon={Sparkles} tone="purple"/></div><div className="insight-list">{analysis.insights.slice(0, 3).map(insight => <InsightCard key={insight.id} insight={insight} compact/>)}</div><button className="card-link" onClick={() => navigate('insights')}>See all insights <ArrowRight size={15}/></button></Card>
      <Card className="assistant-promo"><div><span className="eyebrow">HERE WHEN YOU NEED</span><h2>A little support<br/>goes a long way.</h2><p>Have something on your mind? Let's talk it through.</p><button onClick={() => navigate('assistant')}>Talk to your assistant <ArrowRight size={15}/></button></div><div className="promo-orb"><Sparkles size={24}/></div></Card>
      <button className="report-link" onClick={() => navigate('reports')}><span className="report-link-icon"><BarChart3 size={18}/></span><span><strong>Want the bigger picture?</strong><small>Explore your wellbeing reports</small></span><ChevronRight size={17}/></button>
    </aside></div>
    <div className="disclaimer"><Clock3 size={14}/> Demo data is fictional. Insights are informational and not medical advice or a diagnosis.</div>
  </>
}
