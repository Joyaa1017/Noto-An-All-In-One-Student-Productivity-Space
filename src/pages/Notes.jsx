import { Plus, Trash2, X } from 'lucide-react'

export default function Notes({ notes, addNote, updateNote, deleteNote, activeId, setActiveId }) {
  const note = notes.find(n => n.id === activeId) || notes[0]

  const setItems = items => updateNote(note.id, { items })
  const addItem = () => setItems([...note.items, { id: crypto.randomUUID(), text: '', done: false }])
  const editItem = (id, patch) => setItems(note.items.map(i => (i.id === id ? { ...i, ...patch } : i)))
  const removeItem = id => setItems(note.items.filter(i => i.id !== id))
  const removeNote = () => {
    const rest = notes.filter(n => n.id !== note.id)
    deleteNote(note.id)
    setActiveId(rest[0]?.id ?? null)
  }

  return (
    <div className="notes">
      <aside className="card note-list">
        <button className="btn primary" onClick={() => setActiveId(addNote())}><Plus size={16} /> New note</button>
        {notes.map(n => (
          <button key={n.id} className={'note-link' + (n.id === note?.id ? ' active' : '')} onClick={() => setActiveId(n.id)}>
            {n.title || 'Untitled'}
          </button>
        ))}
      </aside>

      <section className="card editor">
        {!note ? (
          <p className="muted">Create your first note to get started.</p>
        ) : (
          <>
            <input className="title" value={note.title} placeholder="Untitled"
              onChange={e => updateNote(note.id, { title: e.target.value })} aria-label="Note title" />
            <textarea className="body" rows={5} value={note.body} placeholder="Write something..."
              onChange={e => updateNote(note.id, { body: e.target.value })} />
            {note.items.map(i => (
              <div key={i.id} className={'check' + (i.done ? ' done' : '')}>
                <input type="checkbox" checked={i.done} onChange={e => editItem(i.id, { done: e.target.checked })} />
                <input className="check-text" value={i.text} placeholder="Checklist item"
                  onChange={e => editItem(i.id, { text: e.target.value })} />
                <button className="icon" onClick={() => removeItem(i.id)} aria-label="Remove item"><X size={16} /></button>
              </div>
            ))}
            <div className="row">
              <button className="btn" onClick={addItem}><Plus size={16} /> Add checklist item</button>
              <button className="btn danger" onClick={removeNote}><Trash2 size={16} /> Delete note</button>
            </div>
          </>
        )}
      </section>
    </div>
  )
}
