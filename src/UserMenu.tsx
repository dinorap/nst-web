import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { UserSession } from './auth'

interface UserMenuProps {
    user: UserSession
    onLogout: () => void
    onViewAccount: () => void
    onOpenAdmin?: () => void
    t: Record<string, string>
}

function ChevronIcon() {
    return (
        <svg className="chev" width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M5 8L10 13L15 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function LogoutIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M16 17l5-5-5-5M21 12H9M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function UserIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
            <path d="M4 21c0-4 4-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    )
}

function AdminIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 2L3 7v6c0 5 3.5 9 9 10 5.5-1 9-5 9-10V7l-9-5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export default function UserMenu({ user, onLogout, onViewAccount, onOpenAdmin, t }: UserMenuProps) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', onClick)
        return () => document.removeEventListener('mousedown', onClick)
    }, [])

    const initial = (user.name || user.email || 'U').trim().charAt(0).toUpperCase()
    const display = (user.name || user.email || 'Tài khoản').trim()
    const isAdmin = !!user.is_admin

    return (
        <div className="user-menu" ref={ref}>
            <button className="user-menu-trigger" onClick={() => setOpen(!open)}>
                {user.picture ? (
                    <img className="user-avatar" src={user.picture} alt={display} />
                ) : (
                    <span className="user-avatar user-avatar-fallback">{initial}</span>
                )}
                <span className="user-name-display">{display}</span>
                {isAdmin && <span className="user-admin-badge" title="Admin">★</span>}
                <ChevronIcon />
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        className="user-menu-dropdown"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                    >
                        <button
                            className="user-menu-item"
                            onClick={() => {
                                setOpen(false)
                                onViewAccount()
                            }}
                        >
                            <UserIcon />
                            <span>{t.viewAccount || 'Xem tài khoản'}</span>
                        </button>
                        {isAdmin && onOpenAdmin && (
                            <button
                                className="user-menu-item user-menu-item-admin"
                                onClick={() => {
                                    setOpen(false)
                                    onOpenAdmin()
                                }}
                            >
                                <AdminIcon />
                                <span>{t.adminPanel || 'Trang quản trị'}</span>
                            </button>
                        )}
                        <div className="user-menu-sep" />
                        <button
                            className="user-menu-item user-menu-item-danger"
                            onClick={() => {
                                setOpen(false)
                                onLogout()
                            }}
                        >
                            <LogoutIcon />
                            <span>{t.logout || 'Đăng xuất'}</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
