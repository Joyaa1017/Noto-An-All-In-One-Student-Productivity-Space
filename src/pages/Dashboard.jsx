const greeting = () => {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}

export default function Dashboard({ notes, onOpenNote }) {
  return (
    <>
      <h2>{greeting()}! 👋</h2>
      <section className="card">
        <h3>Recent notes</h3>
        {notes.length === 0 && <p className="muted">No notes yet. Open Notes to create your first one.</p>}
        {[...notes].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 5).map(n => (
          <button key={n.id} className="note-link" onClick={() => onOpenNote(n.id)}>{n.title || 'Untitled'}</button>
        ))}
      </section>
    </>
  )
}
