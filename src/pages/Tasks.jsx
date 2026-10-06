import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

export default function Tasks({ tasks }) {
  const { items, add, update, remove } = tasks
  const [title, setTitle] = useState('')
  const [due, setDue] = useState('')

  const submit = e => {
    e.preventDefault()
    if (!title.trim()) return
    add({ title: title.trim(), due, done: false })
    setTitle(''); setDue('')
  }
  const row = t => (
    <div key={t.id} className={'check' + (t.done ? ' done' : '')}>
      <input type="checkbox" checked={t.done} onChange={e => update(t.id, { done: e.target.checked })} />
      <input className="check-text" value={t.title} onChange={e => update(t.id, { title: e.target.value })} aria-label="Task title" />
      <input type="date" className="date" value={t.due} onChange={e => update(t.id, { due: e.target.value })} aria-label="Due date" />
      <button className="icon" onClick={() => remove(t.id)} aria-label="Delete task"><Trash2 size={16} /></button>
    </div>
  )
  const pending = items.filter(t => !t.done), completed = items.filter(t => t.done)

  return (
    <>
      <h2>Tasks</h2>
      <form className="card row" onSubmit={submit}>
        <input className="check-text" value={title} onChange={e => setTitle(e.target.value)} placeholder="New task" aria-label="New task" />
        <input type="date" className="date" value={due} onChange={e => setDue(e.target.value)} aria-label="Due date" />
        <button className="btn primary" type="submit"><Plus size={16} /> Add task</button>
      </form>
      <section className="card">
        <h3>Pending ({pending.length})</h3>
        {pending.length === 0 && <p className="muted">Nothing pending. Add a task above.</p>}
        {pending.map(row)}
      </section>
      <section className="card">
        <h3>Completed ({completed.length})</h3>
        {completed.length === 0 && <p className="muted">Completed tasks show up here.</p>}
        {completed.map(row)}
      </section>
    </>
  )
}
