import { Home, FileText } from 'lucide-react'

// Add a line here when a new page is finished (Tasks, Calendar, Pomodoro, ...)
const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'notes', label: 'Notes', icon: FileText },
]

export default function Sidebar({ page, onNavigate }) {
  return (
    <nav className="sidebar">
      <h1 className="brand">Workspace</h1>
      {NAV.map(({ id, label, icon: Icon }) => (
        <button key={id} className={'nav-item' + (page === id ? ' active' : '')} onClick={() => onNavigate(id)}>
          <Icon size={18} /> <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}
