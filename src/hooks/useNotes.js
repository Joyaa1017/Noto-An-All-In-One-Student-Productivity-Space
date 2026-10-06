import { useEffect, useState } from 'react'

// Step 1: notes live in localStorage. In the backend step, only this file changes
// (it will call the Express API instead), so the pages keep working as they are.
const KEY = 'notes'
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] } }

export default function useNotes() {
  const [notes, setNotes] = useState(load)

  // Auto-save whenever notes change
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(notes)) }, [notes])

  const addNote = () => {
    const note = { id: crypto.randomUUID(), title: 'Untitled', body: '', items: [], updatedAt: Date.now() }
    setNotes(prev => [note, ...prev])
    return note.id
  }
  const updateNote = (id, patch) =>
    setNotes(prev => prev.map(n => (n.id === id ? { ...n, ...patch, updatedAt: Date.now() } : n)))
  const deleteNote = id => setNotes(prev => prev.filter(n => n.id !== id))

  return { notes, addNote, updateNote, deleteNote }
}
