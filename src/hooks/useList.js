import { useEffect, useState } from 'react'

// Generic saved list, used for tasks and calendar events (localStorage for now).
export default function useList(key) {
  const [items, setItems] = useState(() => { try { return JSON.parse(localStorage.getItem(key)) || [] } catch { return [] } })
  useEffect(() => { localStorage.setItem(key, JSON.stringify(items)) }, [key, items])
  const add = item => setItems(p => [...p, { id: crypto.randomUUID(), ...item }])
  const update = (id, patch) => setItems(p => p.map(i => (i.id === id ? { ...i, ...patch } : i)))
  const remove = id => setItems(p => p.filter(i => i.id !== id))
  return { items, add, update, remove }
}
