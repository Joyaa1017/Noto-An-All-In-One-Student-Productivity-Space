import PomodoroTimer from '../components/PomodoroTimer'

const greeting = () => {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}

export default function Dashboard({ notes, tasks, events, pomodoro, onOpenNote, onNavigate }) {
  const today = new Date().toLocaleDateString('en-CA')
  const dueToday = tasks.items.filter(t => t.due === today)
  const upcoming = [
    ...events.items.map(e => ({ key: e.id, label: e.title, date: e.date, time: e.start || '' })),
    ...tasks.items.filter(t => !t.done && t.due).map(t => ({ key: 't' + t.id, label: '☐ ' + t.title, date: t.due, time: '' })),
  ].filter(x => x.date >= today).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)).slice(0, 5)

  return (
    <>
      <h2>{greeting()}! 👋</h2>
      <div className="grid2">
        <section className="card">
          <h3>Today's tasks</h3>
          {dueToday.length === 0 && <p className="muted">Nothing due today.</p>}
          {dueToday.map(t => (
            <div key={t.id} className={'check' + (t.done ? ' done' : '')}>
              <input type="checkbox" checked={t.done} onChange={e => tasks.update(t.id, { done: e.target.checked })} />
              <span className="check-text">{t.title}</span>
            </div>
          ))}
        </section>
        <section className="card"><h3>Pomodoro</h3><PomodoroTimer p={pomodoro} compact /></section>
      </div>
      <section className="card">
        <h3>Upcoming</h3>
        {upcoming.length === 0 && <p className="muted">No upcoming events or tasks.</p>}
        {upcoming.map(x => (
          <button key={x.key} className="note-link" onClick={() => onNavigate('calendar')}>{x.date} {x.time} · {x.label}</button>
        ))}
      </section>
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
