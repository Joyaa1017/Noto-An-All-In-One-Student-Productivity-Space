import { useState } from 'react'
import Sidebar from './components/Sidebar'
import PomodoroTimer from './components/PomodoroTimer'
import Dashboard from './pages/Dashboard'
import Notes from './pages/Notes'
import Tasks from './pages/Tasks'
import Calendar from './pages/Calendar'
import useNotes from './hooks/useNotes'
import useList from './hooks/useList'
import usePomodoro from './hooks/usePomodoro'

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [activeNote, setActiveNote] = useState(null)
  const noteData = useNotes()
  const tasks = useList('tasks')
  const events = useList('events')
  const pomodoro = usePomodoro()

  const openNote = id => { setActiveNote(id); setPage('notes') }

  return (
    <div className="app">
      <Sidebar page={page} onNavigate={setPage} pomodoro={pomodoro} />
      <main className="content">
        {page === 'dashboard' && <Dashboard notes={noteData.notes} tasks={tasks} events={events} pomodoro={pomodoro} onOpenNote={openNote} onNavigate={setPage} />}
        {page === 'notes' && <Notes {...noteData} activeId={activeNote} setActiveId={setActiveNote} />}
        {page === 'tasks' && <Tasks tasks={tasks} />}
        {page === 'calendar' && <Calendar events={events} tasks={tasks} />}
        {page === 'pomodoro' && (<><h2>Pomodoro</h2><section className="card"><PomodoroTimer p={pomodoro} /></section></>)}
      </main>
    </div>
  )
}
