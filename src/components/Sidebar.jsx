import { Home, FileText, CheckSquare, CalendarDays, Timer, Play, Pause } from 'lucide-react'
import { fmt } from '../hooks/usePomodoro'

// Add a line here when a new page is finished (Spotify, Settings, ...)
const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'notes', label: 'Notes', icon: FileText },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'pomodoro', label: 'Pomodoro', icon: Timer },
]

export default function Sidebar({ page, onNavigate, pomodoro: p }) {
  return (
    <nav className="sidebar">
      <h1 className="brand">Workspace</h1>
      {NAV.map(({ id, label, icon: Icon }) => (
        <button key={id} className={'nav-item' + (page === id ? ' active' : '')} onClick={() => onNavigate(id)}>
          <Icon size={18} /> <span>{label}</span>
        </button>
      ))}
      <div className="mini">
        <span>🍅 {fmt(p.left)}</span>
        <button className="icon" onClick={p.running ? p.pause : p.start} aria-label={p.running ? 'Pause timer' : 'Start timer'}>
          {p.running ? <Pause size={16} /> : <Play size={16} />}
        </button>
      </div>
    </nav>
  )
}
