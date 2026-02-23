import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function formatTime(ts) {
    return new Date(ts).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
    })
}

export default function NoteCard({ note, onDelete, onUpdate, onTogglePin, isLast }) {
    const [editing, setEditing] = useState(false)
    const [draft, setDraft] = useState(note.text)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const textareaRef = useRef(null)

    useEffect(() => {
        if (editing) {
            textareaRef.current?.focus()
            const len = textareaRef.current?.value.length
            textareaRef.current?.setSelectionRange(len, len)
        }
    }, [editing])

    useEffect(() => {
        if (!editing) setDraft(note.text)
    }, [note.text, editing])

    const saveEdit = () => {
        const trimmed = draft.trim()
        if (trimmed && trimmed !== note.text) {
            onUpdate(note.id, trimmed)
        } else {
            setDraft(note.text)
        }
        setEditing(false)
    }

    const handleEditKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            saveEdit()
        }
        if (e.key === 'Escape') {
            setDraft(note.text)
            setEditing(false)
        }
    }

    const handleDelete = () => {
        if (!confirmDelete) {
            setConfirmDelete(true)
            setTimeout(() => setConfirmDelete(false), 2500)
            return
        }
        onDelete(note.id)
    }

    return (
        <li className={`note-card group relative flex items-start gap-3 px-4 md:px-5 py-4 ${!isLast ? 'border-b border-zinc-100' : ''}`}>
            {/* Content */}
            <div className="flex-1 min-w-0">
                {editing ? (
                    <textarea
                        ref={textareaRef}
                        value={draft}
                        onChange={e => setDraft(e.target.value)}
                        onKeyDown={handleEditKeyDown}
                        onBlur={saveEdit}
                        rows={Math.max(3, draft.split('\n').length)}
                        className="w-full bg-transparent text-zinc-900 text-sm leading-relaxed resize-none border-b border-zinc-300 pb-0.5 focus:border-zinc-500 transition-colors outline-none font-[inherit]"
                    />
                ) : (
                    <div className="note-prose text-sm text-zinc-800 leading-relaxed">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {note.text}
                        </ReactMarkdown>
                    </div>
                )}
                <span className="mt-1.5 inline-block text-xs text-zinc-400 tabular-nums">
                    {note.updatedAt !== note.createdAt
                        ? `edited ${formatTime(note.updatedAt)}`
                        : formatTime(note.createdAt)}
                </span>
            </div>

            {/* Action buttons — revealed on group hover */}
            <div className="flex-shrink-0 flex items-center gap-0.5 pt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                {/* Pin */}
                <button
                    onClick={() => onTogglePin(note.id)}
                    className={`p-1.5 rounded-md transition-all duration-150 ${note.pinned
                        ? 'text-amber-500 bg-amber-50'
                        : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100'
                        }`}
                    title={note.pinned ? 'Unpin' : 'Pin to top'}
                >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill={note.pinned ? 'currentColor' : 'none'} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                </button>

                {/* Edit / Save */}
                {editing ? (
                    <button
                        onClick={saveEdit}
                        className="px-2 py-1 rounded-md bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-medium transition-colors duration-150"
                    >
                        Save
                    </button>
                ) : (
                    <button
                        onClick={() => setEditing(true)}
                        className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-all duration-150"
                        title="Edit"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>
                )}

                {/* Delete */}
                <button
                    onClick={handleDelete}
                    className={`p-1.5 rounded-md text-xs font-medium transition-all duration-150 ${confirmDelete
                        ? 'bg-red-50 text-red-500 border border-red-200 px-2 opacity-100'
                        : 'text-zinc-400 hover:text-red-500 hover:bg-red-50'
                        }`}
                    title="Delete"
                >
                    {confirmDelete ? 'Confirm?' : (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    )}
                </button>
            </div>
        </li>
    )
}
