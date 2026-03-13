'use client'

import { useState, useRef, useEffect } from 'react'
import { MoreHorizontal, Pencil, Archive, Trash2, Clock, Check, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { authFetchClient } from '@/lib/api/authFetchClient'

interface ConversationItemProps {
    id: string
    title: string
}

export default function ConversationItem({ id, title: initialTitle }: ConversationItemProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [title, setTitle] = useState(initialTitle)
    const [editValue, setEditValue] = useState(initialTitle)
    const menuRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const params = useParams()
    const isActive = params?.id === id


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleEdit = async () => {
        if (editValue === title) {
            setIsEditing(false)
            return
        }

        try {
            const res = await authFetchClient(`/api/conversations/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: editValue }),
            })

            if (res.ok) {
                setTitle(editValue)
                setIsEditing(false)
                router.refresh()
            }
        } catch (error) {
            console.error('Failed to update title:', error)
        }
    }

    const handleArchive = async () => {
        try {
            const res = await authFetchClient(`/api/conversations/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_archived: true }),
            })

            if (res.ok) {
                setIsMenuOpen(false)
                router.refresh()
            }
        } catch (error) {
            console.error('Failed to archive conversation:', error)
        }
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this conversation?')) return

        try {
            const res = await authFetchClient(`/api/conversations/${id}`, {
                method: 'DELETE',
            })

            if (res.ok) {
                setIsMenuOpen(false)
                router.refresh()
            }
        } catch (error) {
            console.error('Failed to delete conversation:', error)
        }
    }

    return (
        <div className="group relative flex items-center w-full">
            {isEditing ? (
                <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-xl">
                    <input
                        autoFocus
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleEdit()
                            if (e.key === 'Escape') setIsEditing(false)
                        }}
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-0 h-6 outline-none"
                    />
                    <button onClick={handleEdit} className="text-green-600 hover:text-green-700">
                        <Check size={14} />
                    </button>
                    <button onClick={() => setIsEditing(false)} className="text-red-600 hover:text-red-700">
                        <X size={14} />
                    </button>
                </div>
            ) : (
                <>
                    <Link
                        href={`/ai-analyzer/${id}`}
                        className={`flex-1 flex items-center gap-3 px-3 py-2.5 text-sm transition-colors rounded-2xl text-left truncate ${
                            isActive 
                            ? "bg-blue-200 text-text-active" 
                            : "text-text-secondary hover:bg-blue-100 hover:text-blue-600"
                        }`}

                    >
                        <Clock size={16} className="shrink-0" />
                        <span className="truncate">{title}</span>
                    </Link>
                    
                    <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setIsMenuOpen(!isMenuOpen)
                            }}
                            className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-500"
                        >
                            <MoreHorizontal size={16} />
                        </button>
                    </div>

                    {isMenuOpen && (
                        <div
                            ref={menuRef}
                            className="absolute right-0 top-10 w-40 bg-white border border-gray-100 rounded-xl shadow-lg z-50 py-1 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200"
                        >
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    setIsEditing(true)
                                    setIsMenuOpen(false)
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <Pencil size={14} />
                                Edit Title
                            </button>
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    handleArchive()
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <Archive size={14} />
                                Archive
                            </button>
                            <div className="h-px bg-gray-100 my-1" />
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    handleDelete()
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <Trash2 size={14} />
                                Delete
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
