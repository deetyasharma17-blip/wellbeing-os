import test from 'node:test'
import assert from 'node:assert/strict'
import { analyzePatterns } from './patterns.js'

test('requires enough history to establish a baseline', () => {
  assert.equal(analyzePatterns([]).baseline, null)
})

test('compares recent readings with historical baseline and combines patterns', () => {
  const readings = Array.from({ length: 10 }, (_, i) => ({ date: `2026-01-${String(i + 1).padStart(2, '0')}`, sleep: i < 7 ? 8 : 6, heart: 65, hrv: 55, screen: i < 7 ? 3 : 5, activity: 40 }))
  const result = analyzePatterns(readings)
  assert.equal(result.baseline.sleep, 8)
  assert.ok(result.insights.some(item => item.id === 'combined'))
  assert.ok(result.alerts.some(item => item.id === 'sleep'))
  assert.ok(result.alerts.some(item => item.id === 'screen'))
})

test('does not flag stable personal patterns', () => {
  const readings = Array.from({ length: 10 }, (_, i) => ({ date: `2026-01-${String(i + 1).padStart(2, '0')}`, sleep: 6, heart: 70, hrv: 40, screen: 5, activity: 20 }))
  const result = analyzePatterns(readings)
  assert.equal(result.alerts.length, 0)
  assert.equal(result.insights[0].id, 'steady')
})
