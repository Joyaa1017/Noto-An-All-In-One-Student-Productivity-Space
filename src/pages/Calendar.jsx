import { useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Plus } from 'lucide-react'

const today = () => new Date().toLocaleDateString('en-CA')
const blank = date => ({ title: '', date, start: '', end: '', description: '' })

export default function Calendar({ events, tasks }) {
  const [form, setForm] = useState(null)  // event being added or edited
  const [task, setTask] = useState(null)  // task being viewed

  const calEvents = [
    ...events.items.map(e => ({
      id: e.id, title: e.title, allDay: !e.start,
      start: e.start ? `${e.date}T${e.start}` : e.date,
      end: e.start && e.end ? `${e.date}T${e.end}` : undefined,
    })),
    // Tasks with a due date appear in the accent color
    ...tasks.items.filter(t => t.due).map(t => ({
      id: 'task-' + t.id, title: (t.done ? '✓ ' : '☐ ') + t.title, start: t.due, allDay: true,
      color: '#F5A623', textColor: '#1D3461', extendedProps: { taskId: t.id },
    })),
  ]

  const onEventClick = ({ event }) => {
    const taskId = event.extendedProps.taskId
    if (taskId) setTask(tasks.items.find(t => t.id === taskId))
    else setForm(events.items.find(e => e.id === event.id))
  }
  const field = (k, v) => setForm({ ...form, [k]: v })
  const save = e => { e.preventDefault(); form.id ? events.update(form.id, form) : events.add(form); setForm(null) }

  return (
    <>
      <div className="row between"><h2>Calendar</h2>
        <button className="btn primary" onClick={() => setForm(blank(today()))}><Plus size={16} /> Add event</button></div>
      <section className="card">
        <FullCalendar plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} initialView="dayGridMonth"
          headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek' }}
          events={calEvents} eventClick={onEventClick} dateClick={i => setForm(blank(i.dateStr.slice(0, 10)))} height="auto" />
      </section>

      {form && (
        <div className="modal-bg" onClick={() => setForm(null)}>
          <form className="card modal" onClick={e => e.stopPropagation()} onSubmit={save}>
            <h3>{form.id ? 'Edit event' : 'New event'}</h3>
            <input className="field" required placeholder="Title" value={form.title} onChange={e => field('title', e.target.value)} />
            <label>Date <input className="field" type="date" required value={form.date} onChange={e => field('date', e.target.value)} /></label>
            <div className="row">
              <label>Start <input className="field" type="time" value={form.start} onChange={e => field('start', e.target.value)} /></label>
              <label>End <input className="field" type="time" min={form.start} value={form.end} onChange={e => field('end', e.target.value)} /></label>
            </div>
            <textarea className="field" rows={3} placeholder="Description (optional)" value={form.description} onChange={e => field('description', e.target.value)} />
            <div className="row">
              <button className="btn primary" type="submit">Save event</button>
              {form.id && <button type="button" className="btn danger" onClick={() => { events.remove(form.id); setForm(null) }}>Delete</button>}
              <button type="button" className="btn" onClick={() => setForm(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      {task && (
        <div className="modal-bg" onClick={() => setTask(null)}>
          <div className="card modal" onClick={e => e.stopPropagation()}>
            <h3>{task.title}</h3>
            <p className="muted">Task due {task.due} · {task.done ? 'Completed' : 'Pending'}. Edit it from the Tasks page.</p>
            <div className="row">
              <button className="btn primary" onClick={() => { tasks.update(task.id, { done: !task.done }); setTask(null) }}>
                {task.done ? 'Mark as pending' : 'Mark as completed'}</button>
              <button className="btn" onClick={() => setTask(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
