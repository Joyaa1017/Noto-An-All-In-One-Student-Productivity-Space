import { useEffect, useRef, useState } from 'react'

const LENGTHS = { work: 25 * 60, short: 5 * 60, long: 15 * 60 }
const LABELS = { work: 'Focus', short: 'Short break', long: 'Long break' }
export const fmt = s => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0')
const beep = () => {
  try { const a = new AudioContext(), o = a.createOscillator(); o.connect(a.destination); o.frequency.value = 660; o.start(); o.stop(a.currentTime + 0.4) } catch {}
}

// Lives in App so the timer keeps running while you move between pages.
export default function usePomodoro() {
  const [mode, setMode] = useState('work')
  const [left, setLeft] = useState(LENGTHS.work)
  const [running, setRunning] = useState(false)
  const [log, setLog] = useState(() => { try { return JSON.parse(localStorage.getItem('pomo-log')) || [] } catch { return [] } })
  const endAt = useRef(0), modeRef = useRef(mode), logRef = useRef(log)
  modeRef.current = mode; logRef.current = log

  const go = next => { setMode(next); setLeft(LENGTHS[next]); endAt.current = Date.now() + LENGTHS[next] * 1000 }

  // Move to the next session. counted = a focus session that was really finished.
  const advance = counted => {
    let next = 'work'
    if (modeRef.current === 'work') {
      let l = logRef.current
      if (counted) { l = [...l, new Date().toISOString()]; setLog(l); localStorage.setItem('pomo-log', JSON.stringify(l)) }
      next = counted && l.length % 4 === 0 ? 'long' : 'short'
    }
    go(next)
  }

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      const l = Math.round((endAt.current - Date.now()) / 1000)
      if (l <= 0) { beep(); advance(true) } else setLeft(l)
    }, 500)
    return () => clearInterval(id)
  }, [running])

  useEffect(() => { document.title = running ? `${fmt(left)} · ${LABELS[mode]}` : 'Student Workspace' }, [left, running, mode])

  return {
    mode, label: LABELS[mode], left, running, total: LENGTHS[mode],
    today: log.filter(t => new Date(t).toDateString() === new Date().toDateString()).length,
    start: () => { endAt.current = Date.now() + left * 1000; setRunning(true) },
    pause: () => setRunning(false),
    reset: () => { setRunning(false); setLeft(LENGTHS[mode]) },
    skip: () => advance(false),
    choose: m => { setRunning(false); setMode(m); setLeft(LENGTHS[m]) },
  }
}
