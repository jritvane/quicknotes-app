import { useState, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import NoteCard from './NoteCard'

const STORAGE_KEY = 'quicknotes_v1'

function getStoredNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/** Format a timestamp into a date-only label, e.g. "Mon, 23 Feb 2026" */
function dateLabel(ts) {
  const d = new Date(ts)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  const sameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()

  if (sameDay(d, today)) return 'Today'
  if (sameDay(d, yesterday)) return 'Yesterday'
  return d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/** Group an array of notes by their creation date label */
function groupByDate(notes) {
  const groups = []
  const seen = new Map()
  for (const note of notes) {
    const label = dateLabel(note.createdAt)
    if (!seen.has(label)) {
      seen.set(label, [])
      groups.push({ label, notes: seen.get(label) })
    }
    seen.get(label).push(note)
  }
  return groups
}

export default function App() {
  const [notes, setNotes] = useState(getStoredNotes)
  const [input, setInput] = useState('')
  const [search, setSearch] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  }, [notes])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const addNote = () => {
    const text = input.trim()
    if (!text) return
    const newNote = {
      id: uuidv4(),
      text,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      pinned: false,
    }
    setNotes(prev => [newNote, ...prev])
    setInput('')
    inputRef.current?.focus()
  }

  const deleteNote = (id) => setNotes(prev => prev.filter(n => n.id !== id))

  const updateNote = (id, newText) => {
    setNotes(prev =>
      prev.map(n => n.id === id ? { ...n, text: newText, updatedAt: Date.now() } : n)
    )
  }

  const togglePin = (id) => {
    setNotes(prev =>
      prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n)
    )
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      addNote()
    }
  }

  // Apply search filter
  const filtered = notes.filter(n =>
    n.text.toLowerCase().includes(search.toLowerCase())
  )

  // Split into pinned vs unpinned
  const pinned = filtered.filter(n => n.pinned)
  const unpinned = filtered.filter(n => !n.pinned)

  // Group unpinned by date (already sorted newest-first from state)
  const dateGroups = groupByDate(unpinned)

  const isEmpty = notes.length === 0

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-50/90 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-2xl mx-auto px-4 md:px-5 py-3.5 flex items-center gap-3">
          <div className="flex items-center gap-2 select-none">
            <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <h1 className="text-sm font-semibold tracking-tight text-zinc-800">QuickNotes</h1>
          </div>
          <div className="ml-auto">
            <span className="text-xs text-zinc-400 tabular-nums">
              {notes.length} {notes.length === 1 ? 'note' : 'notes'}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-3 md:px-5 py-6 md:py-8 space-y-4 md:space-y-6">
        {/* Quick-add input */}
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm px-4 py-3.5 flex items-start gap-3 focus-within:border-zinc-300 focus-within:shadow-md transition-all duration-200">
          <textarea
            ref={inputRef}
            id="note-input"
            rows={2}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="New note… (Enter to save)"
            className="flex-1 bg-transparent text-zinc-900 placeholder-zinc-400 text-sm leading-relaxed resize-none"
          />
          <button
            id="add-note-btn"
            onClick={addNote}
            disabled={!input.trim()}
            className={`flex-shrink-0 mt-0.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95 ${input.trim()
                ? 'bg-zinc-900 hover:bg-zinc-700 text-white cursor-pointer'
                : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
              }`}
          >
            Save
          </button>
        </div>

        {/* Search */}
        {notes.length > 2 && (
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search notes…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm text-zinc-700 placeholder-zinc-400 bg-zinc-100 rounded-lg border-none focus:ring-2 focus:ring-zinc-200 transition-shadow duration-150"
            />
          </div>
        )}

        {/* Empty state */}
        {isEmpty && <EmptyState />}

        {/* No search results */}
        {!isEmpty && filtered.length === 0 && (
          <p className="text-sm text-zinc-400 text-center py-8">No notes match your search.</p>
        )}

        {/* Note list container — white card wrapping all sections */}
        {filtered.length > 0 && (
          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">

            {/* Pinned section */}
            {pinned.length > 0 && (
              <div>
                <div className="px-4 md:px-5 pt-4 md:pt-5 pb-2">
                  <SectionHeader label="Pinned" />
                </div>
                <ul>
                  {pinned.map((note, i) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onDelete={deleteNote}
                      onUpdate={updateNote}
                      onTogglePin={togglePin}
                      isLast={i === pinned.length - 1 && dateGroups.length === 0}
                    />
                  ))}
                </ul>
              </div>
            )}

            {/* Date-grouped sections */}
            {dateGroups.map((group, gi) => (
              <div key={group.label}>
                <div className={`px-4 md:px-5 pb-2 ${gi === 0 && pinned.length === 0 ? 'pt-4 md:pt-5' : 'pt-4 md:pt-5 border-t border-zinc-100'}`}>
                  <SectionHeader label={group.label} />
                </div>
                <ul>
                  {group.notes.map((note, i) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onDelete={deleteNote}
                      onUpdate={updateNote}
                      onTogglePin={togglePin}
                      isLast={i === group.notes.length - 1}
                    />
                  ))}
                </ul>
              </div>
            ))}

          </div>
        )}
      </main>
    </div>
  )
}

function SectionHeader({ label }) {
  return (
    <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest pt-2 mb-3">
      {label}
    </h2>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-16 select-none">
      <p className="text-sm text-zinc-400 mb-1">No notes yet.</p>
      <p className="text-xs text-zinc-300">
        Type above and press{' '}
        <kbd className="px-1.5 py-0.5 rounded border border-zinc-200 text-xs font-mono text-zinc-500">Enter</kbd>
        {' '}to save.
      </p>
    </div>
  )
}
