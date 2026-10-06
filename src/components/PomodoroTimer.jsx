import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react'
import { fmt } from '../hooks/usePomodoro'

const MODES = [['work', 'Focus'], ['short', 'Short break'], ['long', 'Long break']]

export default function PomodoroTimer({ p, compact }) {
  const R = 54, C = 2 * Math.PI * R
  return (
    <div className="pomo">
      {!compact && (
        <div className="row tabs">
          {MODES.map(([m, label]) => (
            <button key={m} className={'btn' + (p.mode === m ? ' primary' : '')} onClick={() => p.choose(m)}>{label}</button>
          ))}
        </div>
      )}
      <div className="ring">
        <svg viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={R} className="ring-bg" />
          <circle cx="60" cy="60" r={R} className="ring-fg" strokeDasharray={C}
            strokeDashoffset={C * (1 - p.left / p.total)} transform="rotate(-90 60 60)" />
        </svg>
        <div className="ring-text"><strong>{fmt(p.left)}</strong><span>{p.label}</span></div>
      </div>
      <div className="row center">
        {p.running
          ? <button className="btn primary" onClick={p.pause}><Pause size={16} /> Pause</button>
          : <button className="btn primary" onClick={p.start}><Play size={16} /> {p.left < p.total ? 'Resume' : 'Start'}</button>}
        <button className="btn" onClick={p.reset}><RotateCcw size={16} /> Reset</button>
        <button className="btn" onClick={p.skip}><SkipForward size={16} /> Skip</button>
      </div>
      <p className="muted center">Pomodoros completed today: {p.today}</p>
    </div>
  )
}
