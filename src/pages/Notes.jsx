import { useEffect, useState } from 'react'
import { Plus, Trash2, X, Save } from 'lucide-react'

export default function Notes({ notes, addNote, updateNote, deleteNote, activeId, setActiveId }) {
  const note = notes.find(n => n.id === activeId) || notes[0]
  const [draft, setDraft] = useState(note)
  const [dirty, setDirty] = useState(false)
  const d = draft && draft.id === note?.id ? draft : note

  useEffect(() => { setDraft(note); setDirty(false) }, [note?.id])

  const change = patch => { setDraft({ ...d, ...patch }); setDirty(true) }
  const save = () => { updateNote(d.id, { title: d.title, body: d.body, items: d.items }); setDirty(false) }

  // Auto-save 1 second after you stop typing; the Save button does it right away.
  useEffect(() => {
    if (!dirty) return
    const t = setTimeout(save, 1000)
    return () => clearTimeout(t)
  }, [draft, dirty])

  const switchTo = id => { if (dirty) save(); setActiveId(id) }
  const newNote = () => { if (dirty) save(); setActiveId(addNote()) }
  const removeNote = () => {
    const rest = notes.filter(n => n.id !== note.id)
    deleteNote(note.id); setDirty(false); setActiveId(rest[0]?.id ?? null)
  }
  const setItems = items => change({ items })
  const addItem = () => setItems([...d.items, { id: crypto.randomUUID(), text: '', done: false }])
  const editItem = (id, patch) => setItems(d.items.map(i => (i.id === id ? { ...i, ...patch } : i)))
  const removeItem = id => setItems(d.items.filter(i => i.id !== id))

  return (
    <div className="notes">
      <aside className="card note-list">
        <button className="btn primary" onClick={newNote}><Plus size={16} /> New note</button>
        {notes.map(n => (
          <button key={n.id} className={'note-link' + (n.id === note?.id ? ' active' : '')} onClick={() => switchTo(n.id)}>
            {n.title || 'Untitled'}
          </button>
        ))}
      </aside>

      <section className="card editor">
        {!d ? <p className="muted">Create your first note to get started.</p> : (
          <>
            <input className="title" value={d.title} placeholder="Untitled" onChange={e => change({ title: e.target.value })} aria-label="Note title" />
            <textarea className="body" rows={5} value={d.body} placeholder="Write something..." onChange={e => change({ body: e.target.value })} />
            {d.items.map(i => (
              <div key={i.id} className={'check' + (i.done ? ' done' : '')}>
                <input type="checkbox" checked={i.done} onChange={e => editItem(i.id, { done: e.target.checked })} />
                <input className="check-text" value={i.text} placeholder="Checklist item" onChange={e => editItem(i.id, { text: e.target.value })} />
                <button className="icon" onClick={() => removeItem(i.id)} aria-label="Remove item"><X size={16} /></button>
              </div>
            ))}
            <div className="row">
              <button className="btn" onClick={addItem}><Plus size={16} /> Add checklist item</button>
              <button className="btn primary" onClick={save} disabled={!dirty}><Save size={16} /> Save</button>
              <button className="btn danger" onClick={removeNote}><Trash2 size={16} /> Delete note</button>
              <span className="muted status">{dirty ? 'Unsaved changes...' : 'All changes saved'}</span>
            </div>
          </>
        )}
      </section>
    </div>
  )
}
