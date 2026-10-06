import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Notes from './pages/Notes'
import useNotes from './hooks/useNotes'

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [activeNote, setActiveNote] = useState(null)
  const noteData = useNotes()

  const openNote = id => { setActiveNote(id); setPage('notes') }

  return (
    <div className="app">
      <Sidebar page={page} onNavigate={setPage} />
      <main className="content">
        {page === 'dashboard' && <Dashboard notes={noteData.notes} onOpenNote={openNote} />}
        {page === 'notes' && <Notes {...noteData} activeId={activeNote} setActiveId={setActiveNote} />}
      </main>
    </div>
  )
}
