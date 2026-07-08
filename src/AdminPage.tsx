import React, { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { UserSession } from './auth'
import * as api from './adminApi'
import type {
    AdminUser,
    AdminUserStats,
    AdminLicense,
    AdminActivationStats,
    AdminLinkedAccount,
    AdminTransaction,
} from './adminApi'

interface AdminPageProps {
    open: boolean
    onClose: () => void
    lang: 'vi' | 'en'
    t: Record<string, any>
    accessToken: string
    currentUser: UserSession
}

type TabKey = 'users' | 'licenses' | 'linked' | 'stats' | 'transactions'

// ==================== ICONS ====================

function BackIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function HistoryIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function CloseIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    )
}

function SearchIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    )
}

function RefreshIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function EditIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function TrashIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function PlusIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    )
}

function KeyIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="8" cy="15" r="4" stroke="currentColor" strokeWidth="2" />
            <path d="M10.85 12.15L19 4M18 5l3 3M15 8l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function UsersIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
        </svg>
    )
}

function LinkIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function ChartIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 3v18h18M7 14l4-4 4 4 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function LockIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    )
}

function UnlockIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M7 11V7a5 5 0 0 1 9.9-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    )
}

function ResetIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M21 12a9 9 0 1 1-9-9c2.5 0 4.8 1 6.5 2.7L21 8M21 3v5h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function ShieldIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 2L4 6v6c0 5 3.5 9.5 8 10 4.5-.5 8-5 8-10V6l-8-4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

// ==================== HELPERS ====================

function formatDate(iso: string | null | undefined, lang: 'vi' | 'en'): string {
    if (!iso) return '—'
    const d = new Date(iso)
    if (isNaN(d.getTime())) return '—'
    return d.toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })
}

function formatDateTime(iso: string | null | undefined, lang: 'vi' | 'en'): string {
    if (!iso) return '—'
    const d = new Date(iso)
    if (isNaN(d.getTime())) return '—'
    return d.toLocaleString(lang === 'vi' ? 'vi-VN' : 'en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    })
}

function planLabel(plan: string, lang: 'vi' | 'en'): string {
    const p = (plan || 'free').toLowerCase()
    if (p === 'free') return lang === 'vi' ? 'Free' : 'Free'
    if (p === 'base') return lang === 'vi' ? 'Base' : 'Base'
    if (p === 'team') return lang === 'vi' ? 'Team' : 'Team'
    return plan
}

function statusLabel(status: string, lang: 'vi' | 'en'): string {
    const s = (status || '').toLowerCase()
    if (s === 'active') return lang === 'vi' ? 'Hoạt động' : 'Active'
    if (s === 'inactive') return lang === 'vi' ? 'Ngưng' : 'Inactive'
    if (s === 'banned') return lang === 'vi' ? 'Cấm' : 'Banned'
    return status
}

// ==================== MAIN COMPONENT ====================

export default function AdminPage({ open, onClose, lang, t, accessToken, currentUser }: AdminPageProps) {
    const [tab, setTab] = useState<TabKey>('users')
    const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    const tt = (key: string, fallback = ''): string => {
        return t?.[key] || fallback
    }

    const showToast = useCallback((type: 'success' | 'error', text: string) => {
        setToast({ type, text })
    }, [])

    useEffect(() => {
        if (!toast) return
        const id = setTimeout(() => setToast(null), 4000)
        return () => clearTimeout(id)
    }, [toast])

    // ESC đóng
    useEffect(() => {
        if (!open) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [open, onClose])

    // Lock scroll
    useEffect(() => {
        if (open) {
            const prev = document.body.style.overflow
            document.body.style.overflow = 'hidden'
            return () => { document.body.style.overflow = prev }
        }
    }, [open])

    if (!open) return null

    return (
        <div className="admin-page">
            <div className="admin-page-bg" />
            <div className="admin-page-container">
                <div className="admin-topbar">
                    <button className="admin-back-btn" onClick={onClose}>
                        <BackIcon />
                        <span>{lang === 'vi' ? 'Quay lại' : 'Back'}</span>
                    </button>
                    <div className="admin-title">
                        <ShieldIcon />
                        <span>{lang === 'vi' ? 'Quản trị viên' : 'Admin Panel'}</span>
                    </div>
                    <div className="admin-topbar-right">
                        <span className="admin-user-chip">
                            {currentUser.picture ? (
                                <img src={currentUser.picture} alt={currentUser.email} />
                            ) : (
                                <span className="admin-user-chip-fallback">
                                    {(currentUser.name || currentUser.email || 'A').charAt(0).toUpperCase()}
                                </span>
                            )}
                            <span>{currentUser.email}</span>
                        </span>
                        <button className="admin-close-btn" onClick={onClose} aria-label="Close">
                            <CloseIcon />
                        </button>
                    </div>
                </div>

                <div className="admin-tabs">
                    <button
                        className={`admin-tab ${tab === 'users' ? 'active' : ''}`}
                        onClick={() => setTab('users')}
                    >
                        <UsersIcon />
                        <span>{lang === 'vi' ? 'Người dùng' : 'Users'}</span>
                    </button>
                    <button
                        className={`admin-tab ${tab === 'licenses' ? 'active' : ''}`}
                        onClick={() => setTab('licenses')}
                    >
                        <KeyIcon />
                        <span>{lang === 'vi' ? 'License' : 'Licenses'}</span>
                    </button>
                    <button
                        className={`admin-tab ${tab === 'linked' ? 'active' : ''}`}
                        onClick={() => setTab('linked')}
                    >
                        <LinkIcon />
                        <span>{lang === 'vi' ? 'Linked Accounts' : 'Linked Accounts'}</span>
                    </button>
                    <button
                        className={`admin-tab ${tab === 'stats' ? 'active' : ''}`}
                        onClick={() => setTab('stats')}
                    >
                        <ChartIcon />
                        <span>{lang === 'vi' ? 'Thống kê' : 'Stats'}</span>
                    </button>
                    <button
                        className={`admin-tab ${tab === 'transactions' ? 'active' : ''}`}
                        onClick={() => setTab('transactions')}
                    >
                        <HistoryIcon />
                        <span>{lang === 'vi' ? 'Giao dịch' : 'Transactions'}</span>
                    </button>
                </div>

                <div className="admin-content">
                    {tab === 'users' && (
                        <UsersTab
                            lang={lang}
                            accessToken={accessToken}
                            showToast={showToast}
                        />
                    )}
                    {tab === 'licenses' && (
                        <LicensesTab
                            lang={lang}
                            accessToken={accessToken}
                            showToast={showToast}
                        />
                    )}
                    {tab === 'linked' && (
                        <LinkedTab
                            lang={lang}
                            accessToken={accessToken}
                            showToast={showToast}
                        />
                    )}
                    {tab === 'stats' && (
                        <StatsTab
                            lang={lang}
                            accessToken={accessToken}
                        />
                    )}
                    {tab === 'transactions' && (
                        <TransactionsTab
                            lang={lang}
                            accessToken={accessToken}
                            showToast={showToast}
                        />
                    )}
                </div>
            </div>

            {toast && (
                <div className={`admin-toast admin-toast-${toast.type}`}>
                    {toast.text}
                </div>
            )}
        </div>
    )
}

// ==================== USERS TAB ====================

interface UsersTabProps {
    lang: 'vi' | 'en'
    accessToken: string
    showToast: (type: 'success' | 'error', text: string) => void
}

function UsersTab({ lang, accessToken, showToast }: UsersTabProps) {
    const [stats, setStats] = useState<AdminUserStats | null>(null)
    const [items, setItems] = useState<AdminUser[]>([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [planFilter, setPlanFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [loading, setLoading] = useState(false)
    const [editing, setEditing] = useState<AdminUser | null>(null)
    const [creating, setCreating] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState<AdminUser | null>(null)

    const LIMIT = 20

    const load = useCallback(async () => {
        setLoading(true)
        try {
            const [s, list] = await Promise.all([
                api.adminGetUserStats(accessToken),
                api.adminListUsers(accessToken, {
                    search: search || undefined,
                    plan: planFilter || undefined,
                    status: statusFilter || undefined,
                    page,
                    limit: LIMIT,
                }),
            ])
            setStats(s)
            setItems(list.items)
            setTotal(list.total)
        } catch (e: any) {
            showToast('error', e.message || 'Lỗi tải dữ liệu')
        } finally {
            setLoading(false)
        }
    }, [accessToken, search, planFilter, statusFilter, page, showToast])

    useEffect(() => {
        load()
    }, [load])

    const totalPages = Math.max(1, Math.ceil(total / LIMIT))

    return (
        <div className="admin-tab-pane">
            <div className="admin-stats-grid">
                <StatCard
                    label={lang === 'vi' ? 'Tổng user' : 'Total users'}
                    value={stats?.total ?? '—'}
                    tone="neutral"
                />
                <StatCard
                    label={lang === 'vi' ? 'Hoạt động' : 'Active'}
                    value={stats?.active ?? '—'}
                    tone="green"
                />
                <StatCard label="Free" value={stats?.free ?? '—'} tone="gray" />
                <StatCard label="Base" value={stats?.base ?? '—'} tone="blue" />
                <StatCard label="Team" value={stats?.team ?? '—'} tone="purple" />
            </div>

            <div className="admin-toolbar">
                <div className="admin-search">
                    <SearchIcon />
                    <input
                        type="text"
                        placeholder={lang === 'vi' ? 'Tìm theo email hoặc tên...' : 'Search email or name...'}
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                    />
                </div>
                <select
                    className="admin-select"
                    value={planFilter}
                    onChange={(e) => { setPlanFilter(e.target.value); setPage(1) }}
                >
                    <option value="">{lang === 'vi' ? 'Tất cả plan' : 'All plans'}</option>
                    <option value="free">Free</option>
                    <option value="base">Base</option>
                    <option value="team">Team</option>
                </select>
                <select
                    className="admin-select"
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
                >
                    <option value="">{lang === 'vi' ? 'Tất cả trạng thái' : 'All status'}</option>
                    <option value="active">{lang === 'vi' ? 'Hoạt động' : 'Active'}</option>
                    <option value="inactive">{lang === 'vi' ? 'Ngưng' : 'Inactive'}</option>
                    <option value="banned">{lang === 'vi' ? 'Cấm' : 'Banned'}</option>
                </select>
                <button className="admin-btn admin-btn-ghost" onClick={load} disabled={loading}>
                    <RefreshIcon />
                </button>
                <button className="admin-btn admin-btn-primary" onClick={() => setCreating(true)}>
                    <PlusIcon />
                    <span>{lang === 'vi' ? 'Tạo user' : 'Create user'}</span>
                </button>
            </div>

            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>{lang === 'vi' ? 'Tên' : 'Name'}</th>
                            <th>Plan</th>
                            <th>{lang === 'vi' ? 'Trạng thái' : 'Status'}</th>
                            <th>{lang === 'vi' ? 'Hôm nay' : 'Today'}</th>
                            <th>{lang === 'vi' ? 'Linked' : 'Linked'}</th>
                            <th>{lang === 'vi' ? 'Đăng nhập cuối' : 'Last login'}</th>
                            <th>{lang === 'vi' ? 'Ngày tạo' : 'Created'}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && items.length === 0 ? (
                            <tr><td colSpan={10} className="admin-empty">{lang === 'vi' ? 'Đang tải...' : 'Loading...'}</td></tr>
                        ) : items.length === 0 ? (
                            <tr><td colSpan={10} className="admin-empty">{lang === 'vi' ? 'Không có user nào.' : 'No users.'}</td></tr>
                        ) : items.map((u) => (
                            <tr key={u.id}>
                                <td className="admin-mono">{u.id}</td>
                                <td>
                                    <div className="admin-cell-user">
                                        {u.picture ? (
                                            <img src={u.picture} alt="" className="admin-cell-avatar" />
                                        ) : (
                                            <span className="admin-cell-avatar admin-cell-avatar-fb">
                                                {(u.name || u.email).charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                        <div>
                                            <div className="admin-cell-email">
                                                {u.email}
                                                {u.is_admin && <span className="admin-badge admin-badge-purple">Admin</span>}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>{u.name || '—'}</td>
                                <td><span className={`admin-badge admin-badge-${u.plan}`}>{planLabel(u.plan, lang)}</span></td>
                                <td><span className={`admin-badge admin-badge-${u.status === 'active' ? 'green' : 'gray'}`}>{statusLabel(u.status, lang)}</span></td>
                                <td>
                                    <span className="admin-usage">
                                        {u.today_usage} / {u.today_limit}
                                    </span>
                                </td>
                                <td>{u.linked_accounts_count}</td>
                                <td className="admin-mono">{formatDateTime(u.last_login_at, lang)}</td>
                                <td className="admin-mono">{formatDate(u.created_at, lang)}</td>
                                <td>
                                    <div className="admin-row-actions">
                                        <button className="admin-icon-btn" title="Edit" onClick={() => setEditing(u)}>
                                            <EditIcon />
                                        </button>
                                        <button
                                            className="admin-icon-btn"
                                            title="Reset usage"
                                            onClick={async () => {
                                                if (!confirm(lang === 'vi' ? 'Reset usage hôm nay của user này?' : 'Reset today usage for this user?')) return
                                                try {
                                                    await api.adminResetUserUsage(accessToken, u.id)
                                                    showToast('success', lang === 'vi' ? 'Đã reset usage' : 'Usage reset')
                                                    load()
                                                } catch (e: any) {
                                                    showToast('error', e.message)
                                                }
                                            }}
                                        >
                                            <ResetIcon />
                                        </button>
                                        <button
                                            className="admin-icon-btn admin-icon-btn-danger"
                                            title="Delete"
                                            onClick={() => setConfirmDelete(u)}
                                        >
                                            <TrashIcon />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="admin-pagination">
                <button
                    className="admin-btn admin-btn-ghost"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                >
                    ←
                </button>
                <span className="admin-page-info">
                    {lang === 'vi' ? 'Trang' : 'Page'} {page} / {totalPages} ({total} {lang === 'vi' ? 'kết quả' : 'results'})
                </span>
                <button
                    className="admin-btn admin-btn-ghost"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                >
                    →
                </button>
            </div>

            {editing && (
                <EditUserModal
                    lang={lang}
                    accessToken={accessToken}
                    user={editing}
                    onClose={() => setEditing(null)}
                    onSaved={() => { setEditing(null); load() }}
                    showToast={showToast}
                />
            )}
            {creating && (
                <CreateUserModal
                    lang={lang}
                    accessToken={accessToken}
                    onClose={() => setCreating(false)}
                    onSaved={() => { setCreating(false); load() }}
                    showToast={showToast}
                />
            )}
            {confirmDelete && (
                <ConfirmModal
                    lang={lang}
                    title={lang === 'vi' ? 'Xóa user' : 'Delete user'}
                    message={`${lang === 'vi' ? 'Xóa vĩnh viễn user' : 'Permanently delete user'} "${confirmDelete.email}"?`}
                    danger
                    onCancel={() => setConfirmDelete(null)}
                    onConfirm={async () => {
                        try {
                            await api.adminDeleteUser(accessToken, confirmDelete.id)
                            showToast('success', lang === 'vi' ? 'Đã xóa user' : 'User deleted')
                            setConfirmDelete(null)
                            load()
                        } catch (e: any) {
                            showToast('error', e.message)
                        }
                    }}
                />
            )}
        </div>
    )
}

function StatCard({ label, value, tone }: { label: string; value: number | string; tone: string }) {
    return (
        <div className={`admin-stat-card admin-stat-${tone}`}>
            <div className="admin-stat-value">{value}</div>
            <div className="admin-stat-label">{label}</div>
        </div>
    )
}

function ConfirmModal({
    lang, title, message, danger, onCancel, onConfirm,
}: {
    lang: 'vi' | 'en'
    title: string
    message: string
    danger?: boolean
    onCancel: () => void
    onConfirm: () => void
}) {
    return (
        <div className="admin-modal-overlay" onClick={onCancel}>
            <div className="admin-modal admin-modal-sm" onClick={(e) => e.stopPropagation()}>
                <h3 className="admin-modal-title">{title}</h3>
                <p className="admin-modal-text">{message}</p>
                <div className="admin-modal-actions">
                    <button className="admin-btn admin-btn-ghost" onClick={onCancel}>
                        {lang === 'vi' ? 'Hủy' : 'Cancel'}
                    </button>
                    <button
                        className={`admin-btn ${danger ? 'admin-btn-danger' : 'admin-btn-primary'}`}
                        onClick={onConfirm}
                    >
                        {lang === 'vi' ? 'Xác nhận' : 'Confirm'}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ==================== EDIT USER MODAL ====================

function EditUserModal({ lang, accessToken, user, onClose, onSaved, showToast }: {
    lang: 'vi' | 'en'
    accessToken: string
    user: AdminUser
    onClose: () => void
    onSaved: () => void
    showToast: (type: 'success' | 'error', text: string) => void
}) {
    const [name, setName] = useState(user.name || '')
    const [plan, setPlan] = useState(user.plan)
    const [status, setStatus] = useState(user.status)
    const [dailyLimit, setDailyLimit] = useState(user.daily_launch_limit)
    const [maxLinked, setMaxLinked] = useState(user.max_linked_accounts)
    const [billingCycle, setBillingCycle] = useState(user.billing_cycle || 'monthly')
    const [purchaseDate, setPurchaseDate] = useState(user.purchase_date ? user.purchase_date.slice(0, 10) : '')
    const [expireDate, setExpireDate] = useState(user.subscription_expires_at ? user.subscription_expires_at.slice(0, 10) : '')
    const [saving, setSaving] = useState(false)

    const save = async () => {
        setSaving(true)
        try {
            await api.adminUpdateUser(accessToken, user.id, {
                name: name || undefined,
                plan,
                status,
                daily_launch_limit: dailyLimit,
                max_linked_accounts: maxLinked,
                billing_cycle: billingCycle,
                purchase_date: purchaseDate || null,
                subscription_expires_at: expireDate || null,
            })
            showToast('success', lang === 'vi' ? 'Đã cập nhật user' : 'User updated')
            onSaved()
        } catch (e: any) {
            showToast('error', e.message)
        } finally {
            setSaving(false)
        }
    }

    const resetPassword = async () => {
        if (!confirm(lang === 'vi' ? 'Reset google_id (user sẽ phải đăng nhập lại Google)?' : 'Reset google_id (user must login Google again)?')) return
        try {
            await api.adminResetUserPassword(accessToken, user.id)
            showToast('success', lang === 'vi' ? 'Đã reset google_id' : 'Google ID reset')
        } catch (e: any) {
            showToast('error', e.message)
        }
    }

    return (
        <div className="admin-modal-overlay" onClick={onClose}>
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                <div className="admin-modal-header">
                    <h3 className="admin-modal-title">
                        {lang === 'vi' ? 'Sửa user' : 'Edit user'} #{user.id}
                    </h3>
                    <button className="admin-icon-btn" onClick={onClose}><CloseIcon /></button>
                </div>
                <div className="admin-modal-body">
                    <div className="admin-form-row">
                        <label>Email</label>
                        <input type="text" value={user.email} disabled />
                    </div>
                    <div className="admin-form-row">
                        <label>{lang === 'vi' ? 'Tên' : 'Name'}</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="admin-form-grid-2">
                        <div className="admin-form-row">
                            <label>Plan</label>
                            <select value={plan} onChange={(e) => setPlan(e.target.value)}>
                                <option value="free">Free</option>
                                <option value="base">Base</option>
                                <option value="team">Team</option>
                            </select>
                        </div>
                        <div className="admin-form-row">
                            <label>{lang === 'vi' ? 'Trạng thái' : 'Status'}</label>
                            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="banned">Banned</option>
                            </select>
                        </div>
                    </div>
                    <div className="admin-form-grid-2">
                        <div className="admin-form-row">
                            <label>Daily limit</label>
                            <input
                                type="number"
                                value={dailyLimit}
                                onChange={(e) => setDailyLimit(parseInt(e.target.value) || 0)}
                            />
                        </div>
                        <div className="admin-form-row">
                            <label>Max linked</label>
                            <input
                                type="number"
                                value={maxLinked}
                                onChange={(e) => setMaxLinked(parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                    <div className="admin-form-row">
                        <label>{lang === 'vi' ? 'Chu kỳ' : 'Billing cycle'}</label>
                        <select value={billingCycle} onChange={(e) => setBillingCycle(e.target.value)}>
                            <option value="monthly">{lang === 'vi' ? 'Hàng tháng' : 'Monthly'}</option>
                            <option value="yearly">{lang === 'vi' ? 'Hàng năm' : 'Yearly'}</option>
                        </select>
                    </div>
                    <div className="admin-form-grid-2">
                        <div className="admin-form-row">
                            <label>{lang === 'vi' ? 'Ngày mua' : 'Purchase date'}</label>
                            <input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />
                        </div>
                        <div className="admin-form-row">
                            <label>{lang === 'vi' ? 'Ngày hết hạn' : 'Expires at'}</label>
                            <input type="date" value={expireDate} onChange={(e) => setExpireDate(e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className="admin-modal-footer">
                    <button className="admin-btn admin-btn-ghost" onClick={resetPassword}>
                        <ResetIcon />
                        <span>{lang === 'vi' ? 'Reset Google' : 'Reset Google'}</span>
                    </button>
                    <div className="admin-modal-actions">
                        <button className="admin-btn admin-btn-ghost" onClick={onClose} disabled={saving}>
                            {lang === 'vi' ? 'Hủy' : 'Cancel'}
                        </button>
                        <button className="admin-btn admin-btn-primary" onClick={save} disabled={saving}>
                            {saving ? '...' : (lang === 'vi' ? 'Lưu' : 'Save')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ==================== CREATE USER MODAL ====================

function CreateUserModal({ lang, accessToken, onClose, onSaved, showToast }: {
    lang: 'vi' | 'en'
    accessToken: string
    onClose: () => void
    onSaved: () => void
    showToast: (type: 'success' | 'error', text: string) => void
}) {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [plan, setPlan] = useState('free')
    const [dailyLimit, setDailyLimit] = useState(10)
    const [maxLinked, setMaxLinked] = useState(0)
    const [billingCycle, setBillingCycle] = useState('monthly')
    const [purchaseDate, setPurchaseDate] = useState('')
    const [expireDate, setExpireDate] = useState('')
    const [saving, setSaving] = useState(false)

    const submit = async () => {
        if (!email.trim()) {
            showToast('error', lang === 'vi' ? 'Email là bắt buộc' : 'Email is required')
            return
        }
        setSaving(true)
        try {
            await api.adminCreateUser(accessToken, {
                email: email.trim().toLowerCase(),
                name: name.trim() || undefined,
                plan,
                daily_launch_limit: dailyLimit,
                max_linked_accounts: maxLinked,
                billing_cycle: billingCycle,
                purchase_date: purchaseDate || undefined,
                subscription_expires_at: expireDate || undefined,
            })
            showToast('success', lang === 'vi' ? 'Đã tạo user' : 'User created')
            onSaved()
        } catch (e: any) {
            showToast('error', e.message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="admin-modal-overlay" onClick={onClose}>
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                <div className="admin-modal-header">
                    <h3 className="admin-modal-title">{lang === 'vi' ? 'Tạo user mới' : 'Create new user'}</h3>
                    <button className="admin-icon-btn" onClick={onClose}><CloseIcon /></button>
                </div>
                <div className="admin-modal-body">
                    <div className="admin-form-row">
                        <label>Email *</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" />
                    </div>
                    <div className="admin-form-row">
                        <label>{lang === 'vi' ? 'Tên' : 'Name'}</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="admin-form-grid-2">
                        <div className="admin-form-row">
                            <label>Plan</label>
                            <select value={plan} onChange={(e) => setPlan(e.target.value)}>
                                <option value="free">Free</option>
                                <option value="base">Base</option>
                                <option value="team">Team</option>
                            </select>
                        </div>
                        <div className="admin-form-row">
                            <label>Daily limit</label>
                            <input type="number" value={dailyLimit} onChange={(e) => setDailyLimit(parseInt(e.target.value) || 0)} />
                        </div>
                    </div>
                    <div className="admin-form-grid-2">
                        <div className="admin-form-row">
                            <label>Max linked</label>
                            <input type="number" value={maxLinked} onChange={(e) => setMaxLinked(parseInt(e.target.value) || 0)} />
                        </div>
                        <div className="admin-form-row">
                            <label>{lang === 'vi' ? 'Chu kỳ' : 'Billing'}</label>
                            <select value={billingCycle} onChange={(e) => setBillingCycle(e.target.value)}>
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </div>
                    </div>
                    <div className="admin-form-grid-2">
                        <div className="admin-form-row">
                            <label>{lang === 'vi' ? 'Ngày mua' : 'Purchase'}</label>
                            <input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />
                        </div>
                        <div className="admin-form-row">
                            <label>{lang === 'vi' ? 'Hết hạn' : 'Expires'}</label>
                            <input type="date" value={expireDate} onChange={(e) => setExpireDate(e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className="admin-modal-footer">
                    <div className="admin-modal-actions">
                        <button className="admin-btn admin-btn-ghost" onClick={onClose} disabled={saving}>
                            {lang === 'vi' ? 'Hủy' : 'Cancel'}
                        </button>
                        <button className="admin-btn admin-btn-primary" onClick={submit} disabled={saving}>
                            {saving ? '...' : (lang === 'vi' ? 'Tạo' : 'Create')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ==================== LICENSES TAB ====================

function LicensesTab({ lang, accessToken, showToast }: UsersTabProps) {
    const [items, setItems] = useState<AdminLicense[]>([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [productFilter, setProductFilter] = useState('')
    const [loading, setLoading] = useState(false)
    const [creating, setCreating] = useState(false)
    const [bulkOpen, setBulkOpen] = useState(false)
    const [editing, setEditing] = useState<AdminLicense | null>(null)
    const [confirmDelete, setConfirmDelete] = useState<AdminLicense | null>(null)

    const LIMIT = 20

    const load = useCallback(async () => {
        setLoading(true)
        try {
            const list = await api.adminListLicenses(accessToken, {
                search: search || undefined,
                status: statusFilter || undefined,
                product_id: productFilter || undefined,
                page,
                limit: LIMIT,
            })
            setItems(list.items)
            setTotal(list.total)
        } catch (e: any) {
            showToast('error', e.message)
        } finally {
            setLoading(false)
        }
    }, [accessToken, search, statusFilter, productFilter, page, showToast])

    useEffect(() => { load() }, [load])

    const totalPages = Math.max(1, Math.ceil(total / LIMIT))

    return (
        <div className="admin-tab-pane">
            <div className="admin-toolbar">
                <div className="admin-search">
                    <SearchIcon />
                    <input
                        type="text"
                        placeholder={lang === 'vi' ? 'Tìm license key...' : 'Search license key...'}
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                    />
                </div>
                <select className="admin-select" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}>
                    <option value="">{lang === 'vi' ? 'Tất cả trạng thái' : 'All status'}</option>
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="locked">Locked</option>
                </select>
                <select className="admin-select" value={productFilter} onChange={(e) => { setProductFilter(e.target.value); setPage(1) }}>
                    <option value="">{lang === 'vi' ? 'Tất cả sản phẩm' : 'All products'}</option>
                    <option value="fb_tool">Facebook Tool</option>
                    <option value="yt_tool">YouTube Tool</option>
                    <option value="video_creator">AI Video Creator</option>
                </select>
                <button className="admin-btn admin-btn-ghost" onClick={load} disabled={loading}>
                    <RefreshIcon />
                </button>
                <button className="admin-btn admin-btn-ghost" onClick={() => setBulkOpen(true)}>
                    {lang === 'vi' ? 'Bulk' : 'Bulk'}
                </button>
                <button className="admin-btn admin-btn-primary" onClick={() => setCreating(true)}>
                    <PlusIcon />
                    <span>{lang === 'vi' ? 'Tạo license' : 'Create license'}</span>
                </button>
            </div>

            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>{lang === 'vi' ? 'Mã' : 'Key'}</th>
                            <th>Product</th>
                            <th>{lang === 'vi' ? 'Thời hạn' : 'Duration'}</th>
                            <th>{lang === 'vi' ? 'Trạng thái' : 'Status'}</th>
                            <th>{lang === 'vi' ? 'Sử dụng' : 'Usage'}</th>
                            <th>{lang === 'vi' ? 'Hết hạn' : 'Expires'}</th>
                            <th>{lang === 'vi' ? 'Người dùng' : 'User'}</th>
                            <th>{lang === 'vi' ? 'Ngày tạo' : 'Created'}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && items.length === 0 ? (
                            <tr><td colSpan={9} className="admin-empty">{lang === 'vi' ? 'Đang tải...' : 'Loading...'}</td></tr>
                        ) : items.length === 0 ? (
                            <tr><td colSpan={9} className="admin-empty">{lang === 'vi' ? 'Không có license nào.' : 'No licenses.'}</td></tr>
                        ) : items.map((lic) => (
                            <tr key={lic.license_key}>
                                <td className="admin-mono admin-key-cell">{lic.license_key}</td>
                                <td>{lic.product_id}</td>
                                <td>{lic.duration_type}</td>
                                <td>
                                    <span className={`admin-badge ${lic.is_locked ? 'admin-badge-red' : lic.is_expired ? 'admin-badge-gray' : 'admin-badge-green'}`}>
                                        {lic.is_locked ? (lang === 'vi' ? 'Khóa' : 'Locked') : lic.is_expired ? (lang === 'vi' ? 'Hết hạn' : 'Expired') : (lang === 'vi' ? 'Hoạt động' : 'Active')}
                                    </span>
                                </td>
                                <td>{lic.current_uses} / {lic.max_uses ?? '∞'}</td>
                                <td className="admin-mono">
                                    {lic.expire_at ? (
                                        <>
                                            {formatDate(lic.expire_at, lang)}
                                            {lic.days_remaining != null && (
                                                <span className="admin-meta"> ({lic.days_remaining}d)</span>
                                            )}
                                        </>
                                    ) : '—'}
                                </td>
                                <td className="admin-mono">{lic.user_email || '—'}</td>
                                <td className="admin-mono">{formatDate(lic.created_at, lang)}</td>
                                <td>
                                    <div className="admin-row-actions">
                                        <button className="admin-icon-btn" title="Edit" onClick={() => setEditing(lic)}>
                                            <EditIcon />
                                        </button>
                                        {lic.is_locked ? (
                                            <button
                                                className="admin-icon-btn"
                                                title="Unlock"
                                                onClick={async () => {
                                                    try {
                                                        await api.adminUnlockLicense(accessToken, lic.license_key)
                                                        showToast('success', 'Unlocked')
                                                        load()
                                                    } catch (e: any) { showToast('error', e.message) }
                                                }}
                                            >
                                                <UnlockIcon />
                                            </button>
                                        ) : (
                                            <button
                                                className="admin-icon-btn"
                                                title="Lock"
                                                onClick={async () => {
                                                    if (!confirm('Lock this license?')) return
                                                    try {
                                                        await api.adminLockLicense(accessToken, lic.license_key)
                                                        showToast('success', 'Locked')
                                                        load()
                                                    } catch (e: any) { showToast('error', e.message) }
                                                }}
                                            >
                                                <LockIcon />
                                            </button>
                                        )}
                                        <button
                                            className="admin-icon-btn"
                                            title="Reset client"
                                            onClick={async () => {
                                                if (!confirm('Reset client HWID/IP for this license?')) return
                                                try {
                                                    await api.adminResetLicenseClient(accessToken, lic.license_key)
                                                    showToast('success', 'Client reset')
                                                } catch (e: any) { showToast('error', e.message) }
                                            }}
                                        >
                                            <ResetIcon />
                                        </button>
                                        <button
                                            className="admin-icon-btn admin-icon-btn-danger"
                                            title="Delete"
                                            onClick={() => setConfirmDelete(lic)}
                                        >
                                            <TrashIcon />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="admin-pagination">
                <button className="admin-btn admin-btn-ghost" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>←</button>
                <span className="admin-page-info">{lang === 'vi' ? 'Trang' : 'Page'} {page} / {totalPages} ({total})</span>
                <button className="admin-btn admin-btn-ghost" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>→</button>
            </div>

            {creating && (
                <CreateLicenseModal
                    lang={lang}
                    accessToken={accessToken}
                    onClose={() => setCreating(false)}
                    onSaved={() => { setCreating(false); load() }}
                    showToast={showToast}
                />
            )}
            {editing && (
                <EditLicenseModal
                    lang={lang}
                    accessToken={accessToken}
                    license={editing}
                    onClose={() => setEditing(null)}
                    onSaved={() => { setEditing(null); load() }}
                    showToast={showToast}
                />
            )}
            {bulkOpen && (
                <BulkLicenseModal
                    lang={lang}
                    accessToken={accessToken}
                    onClose={() => setBulkOpen(false)}
                    onSaved={() => { setBulkOpen(false); load() }}
                    showToast={showToast}
                />
            )}
            {confirmDelete && (
                <ConfirmModal
                    lang={lang}
                    title={lang === 'vi' ? 'Xóa license' : 'Delete license'}
                    message={`${lang === 'vi' ? 'Xóa vĩnh viễn license' : 'Delete license'} "${confirmDelete.license_key}"?`}
                    danger
                    onCancel={() => setConfirmDelete(null)}
                    onConfirm={async () => {
                        try {
                            await api.adminDeleteLicense(accessToken, confirmDelete.license_key)
                            showToast('success', 'Deleted')
                            setConfirmDelete(null)
                            load()
                        } catch (e: any) { showToast('error', e.message) }
                    }}
                />
            )}
        </div>
    )
}

function CreateLicenseModal({ lang, accessToken, onClose, onSaved, showToast }: {
    lang: 'vi' | 'en'
    accessToken: string
    onClose: () => void
    onSaved: () => void
    showToast: (type: 'success' | 'error', text: string) => void
}) {
    const [product, setProduct] = useState('fb_tool')
    const [duration, setDuration] = useState('30d')
    const [customDays, setCustomDays] = useState(7)
    const [maxUses, setMaxUses] = useState(1)
    const [notes, setNotes] = useState('')
    const [saving, setSaving] = useState(false)
    const [result, setResult] = useState<string[] | null>(null)

    const submit = async () => {
        setSaving(true)
        try {
            const dur = duration === 'custom' ? `${customDays}d` : duration
            const data = await api.adminCreateLicense(accessToken, {
                product_id: product,
                duration_type: dur,
                max_uses: maxUses,
                notes: notes || undefined,
            })
            showToast('success', `Created: ${data.license_key}`)
            onSaved()
        } catch (e: any) {
            showToast('error', e.message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="admin-modal-overlay" onClick={onClose}>
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                <div className="admin-modal-header">
                    <h3 className="admin-modal-title">{lang === 'vi' ? 'Tạo license' : 'Create license'}</h3>
                    <button className="admin-icon-btn" onClick={onClose}><CloseIcon /></button>
                </div>
                <div className="admin-modal-body">
                    <div className="admin-form-row">
                        <label>Product</label>
                        <select value={product} onChange={(e) => setProduct(e.target.value)}>
                            <option value="fb_tool">Facebook Tool</option>
                            <option value="yt_tool">YouTube Tool</option>
                            <option value="video_creator">AI Video Creator</option>
                        </select>
                    </div>
                    <div className="admin-form-row">
                        <label>{lang === 'vi' ? 'Thời hạn' : 'Duration'}</label>
                        <select value={duration} onChange={(e) => setDuration(e.target.value)}>
                            <option value="2h">2 hours</option>
                            <option value="12h">12 hours</option>
                            <option value="1d">1 day</option>
                            <option value="3d">3 days</option>
                            <option value="7d">7 days</option>
                            <option value="10d">10 days</option>
                            <option value="30d">30 days</option>
                            <option value="60d">60 days</option>
                            <option value="90d">90 days</option>
                            <option value="lifetime">Lifetime</option>
                            <option value="custom">{lang === 'vi' ? 'Tùy chỉnh (ngày)' : 'Custom (days)'}</option>
                        </select>
                    </div>
                    {duration === 'custom' && (
                        <div className="admin-form-row">
                            <label>{lang === 'vi' ? 'Số ngày' : 'Days'}</label>
                            <input type="number" min={1} max={365} value={customDays} onChange={(e) => setCustomDays(parseInt(e.target.value) || 1)} />
                        </div>
                    )}
                    <div className="admin-form-row">
                        <label>Max uses</label>
                        <input type="number" min={1} value={maxUses} onChange={(e) => setMaxUses(parseInt(e.target.value) || 1)} />
                    </div>
                    <div className="admin-form-row">
                        <label>Notes</label>
                        <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} />
                    </div>
                </div>
                <div className="admin-modal-footer">
                    <div className="admin-modal-actions">
                        <button className="admin-btn admin-btn-ghost" onClick={onClose} disabled={saving}>
                            {lang === 'vi' ? 'Hủy' : 'Cancel'}
                        </button>
                        <button className="admin-btn admin-btn-primary" onClick={submit} disabled={saving}>
                            {saving ? '...' : (lang === 'vi' ? 'Tạo' : 'Create')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function EditLicenseModal({ lang, accessToken, license, onClose, onSaved, showToast }: {
    lang: 'vi' | 'en'
    accessToken: string
    license: AdminLicense
    onClose: () => void
    onSaved: () => void
    showToast: (type: 'success' | 'error', text: string) => void
}) {
    const [notes, setNotes] = useState(license.notes || '')
    const [maxUses, setMaxUses] = useState(license.max_uses ?? 1)
    const [extendDays, setExtendDays] = useState(0)
    const [saving, setSaving] = useState(false)

    const save = async () => {
        setSaving(true)
        try {
            await api.adminUpdateLicense(accessToken, license.license_key, {
                notes,
                max_uses: maxUses,
            })
            if (extendDays !== 0) {
                await api.adminExtendLicense(accessToken, license.license_key, extendDays)
            }
            showToast('success', 'Saved')
            onSaved()
        } catch (e: any) {
            showToast('error', e.message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="admin-modal-overlay" onClick={onClose}>
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                <div className="admin-modal-header">
                    <h3 className="admin-modal-title">{lang === 'vi' ? 'Sửa license' : 'Edit license'}</h3>
                    <button className="admin-icon-btn" onClick={onClose}><CloseIcon /></button>
                </div>
                <div className="admin-modal-body">
                    <div className="admin-form-row">
                        <label>{lang === 'vi' ? 'Mã' : 'Key'}</label>
                        <input type="text" value={license.license_key} disabled />
                    </div>
                    <div className="admin-form-row">
                        <label>Product</label>
                        <input type="text" value={license.product_id} disabled />
                    </div>
                    <div className="admin-form-grid-2">
                        <div className="admin-form-row">
                            <label>Max uses</label>
                            <input type="number" min={1} value={maxUses} onChange={(e) => setMaxUses(parseInt(e.target.value) || 1)} />
                        </div>
                        <div className="admin-form-row">
                            <label>{lang === 'vi' ? 'Gia hạn (ngày, 0=không)' : 'Extend (days, 0=no)'}</label>
                            <input type="number" value={extendDays} onChange={(e) => setExtendDays(parseInt(e.target.value) || 0)} />
                        </div>
                    </div>
                    <div className="admin-form-row">
                        <label>Notes</label>
                        <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} />
                    </div>
                    {license.user_email && (
                        <div className="admin-form-row">
                            <label>{lang === 'vi' ? 'Người dùng' : 'User'}</label>
                            <input type="text" value={license.user_email} disabled />
                        </div>
                    )}
                </div>
                <div className="admin-modal-footer">
                    <div className="admin-modal-actions">
                        <button className="admin-btn admin-btn-ghost" onClick={onClose} disabled={saving}>
                            {lang === 'vi' ? 'Hủy' : 'Cancel'}
                        </button>
                        <button className="admin-btn admin-btn-primary" onClick={save} disabled={saving}>
                            {saving ? '...' : (lang === 'vi' ? 'Lưu' : 'Save')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function BulkLicenseModal({ lang, accessToken, onClose, onSaved, showToast }: {
    lang: 'vi' | 'en'
    accessToken: string
    onClose: () => void
    onSaved: () => void
    showToast: (type: 'success' | 'error', text: string) => void
}) {
    const [product, setProduct] = useState('fb_tool')
    const [count, setCount] = useState(5)
    const [durationTypes, setDurationTypes] = useState<string[]>(['30d'])
    const [maxUses, setMaxUses] = useState(1)
    const [saving, setSaving] = useState(false)
    const [result, setResult] = useState<string[] | null>(null)

    const toggleDur = (d: string) => {
        setDurationTypes((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d])
    }

    const submit = async () => {
        if (durationTypes.length === 0) {
            showToast('error', lang === 'vi' ? 'Chọn ít nhất 1 thời hạn' : 'Select at least 1 duration')
            return
        }
        setSaving(true)
        try {
            const data = await api.adminBulkCreateLicenses(accessToken, {
                product_id: product,
                duration_types: durationTypes,
                count,
                max_uses: maxUses,
            })
            setResult(data.keys)
            showToast('success', `${lang === 'vi' ? 'Đã tạo' : 'Created'} ${data.count} ${lang === 'vi' ? 'license' : 'licenses'}`)
        } catch (e: any) {
            showToast('error', e.message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="admin-modal-overlay" onClick={onClose}>
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                <div className="admin-modal-header">
                    <h3 className="admin-modal-title">{lang === 'vi' ? 'Tạo hàng loạt' : 'Bulk create'}</h3>
                    <button className="admin-icon-btn" onClick={onClose}><CloseIcon /></button>
                </div>
                <div className="admin-modal-body">
                    {result ? (
                        <>
                            <p className="admin-modal-text">{lang === 'vi' ? 'Đã tạo thành công:' : 'Created successfully:'}</p>
                            <textarea className="admin-textarea" readOnly value={result.join('\n')} rows={8} />
                        </>
                    ) : (
                        <>
                            <div className="admin-form-row">
                                <label>Product</label>
                                <select value={product} onChange={(e) => setProduct(e.target.value)}>
                                    <option value="fb_tool">Facebook Tool</option>
                                    <option value="yt_tool">YouTube Tool</option>
                                    <option value="video_creator">AI Video Creator</option>
                                </select>
                            </div>
                            <div className="admin-form-row">
                                <label>{lang === 'vi' ? 'Số lượng' : 'Count'}</label>
                                <input type="number" min={1} max={100} value={count} onChange={(e) => setCount(parseInt(e.target.value) || 1)} />
                            </div>
                            <div className="admin-form-row">
                                <label>{lang === 'vi' ? 'Thời hạn (chọn nhiều)' : 'Durations (multi)'}</label>
                                <div className="admin-chip-group">
                                    {['2h', '12h', '1d', '3d', '7d', '10d', '30d', '60d', '90d', 'lifetime'].map((d) => (
                                        <button
                                            key={d}
                                            type="button"
                                            className={`admin-chip ${durationTypes.includes(d) ? 'active' : ''}`}
                                            onClick={() => toggleDur(d)}
                                        >
                                            {d}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="admin-form-row">
                                <label>Max uses</label>
                                <input type="number" min={1} value={maxUses} onChange={(e) => setMaxUses(parseInt(e.target.value) || 1)} />
                            </div>
                        </>
                    )}
                </div>
                <div className="admin-modal-footer">
                    <div className="admin-modal-actions">
                        {result ? (
                            <button className="admin-btn admin-btn-primary" onClick={() => { onSaved() }}>
                                {lang === 'vi' ? 'Xong' : 'Done'}
                            </button>
                        ) : (
                            <>
                                <button className="admin-btn admin-btn-ghost" onClick={onClose} disabled={saving}>
                                    {lang === 'vi' ? 'Hủy' : 'Cancel'}
                                </button>
                                <button className="admin-btn admin-btn-primary" onClick={submit} disabled={saving}>
                                    {saving ? '...' : (lang === 'vi' ? 'Tạo' : 'Create')}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

// ==================== LINKED TAB ====================

function LinkedTab({ lang, accessToken, showToast }: UsersTabProps) {
    const [items, setItems] = useState<AdminLinkedAccount[]>([])
    const [loading, setLoading] = useState(false)
    const [newOwnerEmail, setNewOwnerEmail] = useState('')
    const [newChildEmail, setNewChildEmail] = useState('')
    const [adding, setAdding] = useState(false)
    const [confirmRemove, setConfirmRemove] = useState<AdminLinkedAccount | null>(null)

    const load = useCallback(async () => {
        setLoading(true)
        try {
            const data = await api.adminListLinkedAccounts(accessToken)
            setItems(data.items)
        } catch (e: any) {
            showToast('error', e.message)
        } finally {
            setLoading(false)
        }
    }, [accessToken, showToast])

    useEffect(() => { load() }, [load])

    const add = async () => {
        if (!newOwnerEmail || !newChildEmail) {
            showToast('error', lang === 'vi' ? 'Nhập đủ owner và child email' : 'Both emails required')
            return
        }
        setAdding(true)
        try {
            await api.adminAddLinkedAccount(accessToken, {
                owner_email: newOwnerEmail.trim().toLowerCase(),
                email: newChildEmail.trim().toLowerCase(),
            })
            showToast('success', 'Added')
            setNewOwnerEmail('')
            setNewChildEmail('')
            load()
        } catch (e: any) {
            showToast('error', e.message)
        } finally {
            setAdding(false)
        }
    }

    return (
        <div className="admin-tab-pane">
            <div className="admin-toolbar admin-toolbar-stack">
                <div className="admin-form-row">
                    <label>Owner email</label>
                    <input type="email" value={newOwnerEmail} onChange={(e) => setNewOwnerEmail(e.target.value)} placeholder="owner@example.com" />
                </div>
                <div className="admin-form-row">
                    <label>{lang === 'vi' ? 'Child email (linked)' : 'Child email'}</label>
                    <input type="email" value={newChildEmail} onChange={(e) => setNewChildEmail(e.target.value)} placeholder="child@example.com" />
                </div>
                <button className="admin-btn admin-btn-primary" onClick={add} disabled={adding}>
                    <PlusIcon />
                    <span>{lang === 'vi' ? 'Thêm' : 'Add'}</span>
                </button>
            </div>

            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Child email</th>
                            <th>Owner email</th>
                            <th>Owner ID</th>
                            <th>{lang === 'vi' ? 'Ngày thêm' : 'Added at'}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && items.length === 0 ? (
                            <tr><td colSpan={6} className="admin-empty">{lang === 'vi' ? 'Đang tải...' : 'Loading...'}</td></tr>
                        ) : items.length === 0 ? (
                            <tr><td colSpan={6} className="admin-empty">{lang === 'vi' ? 'Chưa có linked account nào.' : 'No linked accounts.'}</td></tr>
                        ) : items.map((la) => (
                            <tr key={la.id}>
                                <td className="admin-mono">{la.id}</td>
                                <td className="admin-mono">{la.email}</td>
                                <td className="admin-mono">{la.owner_email || `ID ${la.owner_id}`}</td>
                                <td className="admin-mono">{la.owner_id}</td>
                                <td className="admin-mono">{formatDateTime(la.added_at, lang)}</td>
                                <td>
                                    <button
                                        className="admin-icon-btn admin-icon-btn-danger"
                                        title="Remove"
                                        onClick={() => setConfirmRemove(la)}
                                    >
                                        <TrashIcon />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {confirmRemove && (
                <ConfirmModal
                    lang={lang}
                    title={lang === 'vi' ? 'Gỡ linked' : 'Remove linked'}
                    message={`${lang === 'vi' ? 'Gỡ' : 'Remove'} "${confirmRemove.email}" ${lang === 'vi' ? 'khỏi owner' : 'from owner'}?`}
                    danger
                    onCancel={() => setConfirmRemove(null)}
                    onConfirm={async () => {
                        try {
                            await api.adminRemoveLinkedAccount(accessToken, confirmRemove.email)
                            showToast('success', 'Removed')
                            setConfirmRemove(null)
                            load()
                        } catch (e: any) { showToast('error', e.message) }
                    }}
                />
            )}
        </div>
    )
}

// ==================== STATS TAB ====================

function StatsTab({ lang, accessToken }: { lang: 'vi' | 'en'; accessToken: string }) {
    const [stats, setStats] = useState<AdminActivationStats | null>(null)
    const [loading, setLoading] = useState(false)
    const [activatedFrom, setActivatedFrom] = useState('')
    const [activatedTo, setActivatedTo] = useState('')

    const load = useCallback(async () => {
        setLoading(true)
        try {
            const data = await api.adminGetActivationStats(accessToken, {
                activated_from: activatedFrom || undefined,
                activated_to: activatedTo || undefined,
            })
            setStats(data)
        } catch (e) {
            // ignore
        } finally {
            setLoading(false)
        }
    }, [accessToken, activatedFrom, activatedTo])

    useEffect(() => { load() }, [load])

    return (
        <div className="admin-tab-pane">
            <div className="admin-toolbar">
                <div className="admin-form-row admin-form-row-inline">
                    <label>{lang === 'vi' ? 'Từ ngày' : 'From'}</label>
                    <input type="date" value={activatedFrom} onChange={(e) => setActivatedFrom(e.target.value)} />
                </div>
                <div className="admin-form-row admin-form-row-inline">
                    <label>{lang === 'vi' ? 'Đến ngày' : 'To'}</label>
                    <input type="date" value={activatedTo} onChange={(e) => setActivatedTo(e.target.value)} />
                </div>
                <button className="admin-btn admin-btn-ghost" onClick={load} disabled={loading}>
                    <RefreshIcon />
                </button>
            </div>

            <div className="admin-stats-grid">
                <StatCard label={lang === 'vi' ? 'Tổng' : 'Total'} value={stats?.total ?? '—'} tone="neutral" />
                <StatCard label={lang === 'vi' ? 'Đang kích hoạt' : 'Active'} value={stats?.active ?? '—'} tone="green" />
                <StatCard label={lang === 'vi' ? 'Hết hạn' : 'Expired'} value={stats?.expired ?? '—'} tone="gray" />
                <StatCard label={lang === 'vi' ? 'Bị khóa' : 'Locked'} value={stats?.locked ?? '—'} tone="red" />
            </div>

            {stats?.by_product && Object.keys(stats.by_product).length > 0 && (
                <div className="admin-stats-section">
                    <h3 className="admin-section-title">{lang === 'vi' ? 'Theo sản phẩm' : 'By product'}</h3>
                    <div className="admin-stats-grid">
                        {Object.entries(stats.by_product).map(([prod, count]) => (
                            <StatCard key={prod} label={prod} value={count} tone="blue" />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}


// ==================== TRANSACTIONS TAB ====================

function TransactionsTab({
    lang,
    accessToken,
    showToast,
}: {
    lang: 'vi' | 'en'
    accessToken: string
    showToast: (type: 'success' | 'error', text: string) => void
}) {
    const [items, setItems] = useState<AdminTransaction[]>([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [planFilter, setPlanFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [loading, setLoading] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState<AdminTransaction | null>(null)
    const [deleting, setDeleting] = useState(false)

    const load = useCallback(async () => {
        setLoading(true)
        try {
            const data = await api.adminListTransactions(accessToken, {
                search: search || undefined,
                plan: planFilter || undefined,
                status: statusFilter || undefined,
                page,
                limit: 20,
            })
            setItems(data.items || [])
            setTotal(data.total || 0)
        } catch (e: any) {
            showToast('error', e.message || 'Error loading transactions')
        } finally {
            setLoading(false)
        }
    }, [accessToken, page, search, planFilter, statusFilter, showToast])

    useEffect(() => {
        load()
    }, [load])

    const handleDelete = async () => {
        if (!confirmDelete) return
        setDeleting(true)
        try {
            await api.adminDeleteTransaction(accessToken, confirmDelete.id)
            showToast('success', lang === 'vi' ? 'Đã xóa giao dịch thành công' : 'Transaction deleted successfully')
            setConfirmDelete(null)
            load()
        } catch (e: any) {
            showToast('error', e.message || 'Error deleting transaction')
        } finally {
            setDeleting(false)
        }
    }

    const totalPages = Math.ceil(total / 20) || 1

    return (
        <div className="admin-tab-pane">
            <div className="admin-toolbar">
                <div className="admin-search-box">
                    <SearchIcon />
                    <input
                        type="text"
                        placeholder={lang === 'vi' ? 'Tìm theo Mã đơn hàng, Email...' : 'Search by Invoice ID, Email...'}
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                            setPage(1)
                        }}
                    />
                </div>
                <div className="admin-filters">
                    <select
                        value={planFilter}
                        onChange={(e) => {
                            setPlanFilter(e.target.value)
                            setPage(1)
                        }}
                    >
                        <option value="">{lang === 'vi' ? 'Tất cả gói' : 'All plans'}</option>
                        <option value="base">Base</option>
                        <option value="team">Team</option>
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value)
                            setPage(1)
                        }}
                    >
                        <option value="">{lang === 'vi' ? 'Tất cả trạng thái' : 'All status'}</option>
                        <option value="completed">Completed</option>
                    </select>
                    <button className="admin-btn admin-btn-ghost" onClick={load} disabled={loading} title="Reload">
                        <RefreshIcon />
                    </button>
                </div>
            </div>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>{lang === 'vi' ? 'Mã đơn hàng' : 'Invoice ID'}</th>
                            <th>{lang === 'vi' ? 'Người mua' : 'Customer'}</th>
                            <th>{lang === 'vi' ? 'Gói cước' : 'Plan'}</th>
                            <th>{lang === 'vi' ? 'Chu kỳ' : 'Cycle'}</th>
                            <th>{lang === 'vi' ? 'Số tiền' : 'Amount'}</th>
                            <th>{lang === 'vi' ? 'Ngày mua' : 'Date'}</th>
                            <th>{lang === 'vi' ? 'Trạng thái' : 'Status'}</th>
                            <th>{lang === 'vi' ? 'Hành động' : 'Actions'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={8} className="text-center py-8">
                                    <div className="admin-spinner" style={{ margin: 'auto' }}></div>
                                </td>
                            </tr>
                        ) : items.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center py-8 text-muted">
                                    {lang === 'vi' ? 'Không tìm thấy giao dịch nào.' : 'No transactions found.'}
                                </td>
                            </tr>
                        ) : (
                            items.map((item) => (
                                <tr key={item.id}>
                                    <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{item.invoice_no}</td>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: 500, color: '#fff' }}>{item.user_email}</span>
                                            {item.user_name && <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{item.user_name}</span>}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`account-page-plan-badge account-plan-${item.plan.toLowerCase()}`} style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', border: 'none' }}>
                                            {item.plan}
                                        </span>
                                    </td>
                                    <td>
                                        {item.billing_cycle === 'yearly' ? (lang === 'vi' ? 'Hàng năm' : 'Yearly') : (lang === 'vi' ? 'Hàng tháng' : 'Monthly')}
                                    </td>
                                    <td style={{ color: '#22c55e', fontWeight: 600 }}>
                                        {item.amount.toLocaleString(lang === 'vi' ? 'vi-VN' : 'en-US')} VND
                                    </td>
                                    <td style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
                                        {formatDate(item.created_at, lang)}
                                    </td>
                                    <td>
                                        <span style={{ color: '#22c55e', background: 'rgba(34, 197, 94, 0.1)', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: 500 }}>
                                            {item.status === 'completed' ? (lang === 'vi' ? 'Thành công' : 'Success') : item.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="admin-icon-btn admin-icon-btn-danger"
                                            onClick={() => setConfirmDelete(item)}
                                            title={lang === 'vi' ? 'Xóa giao dịch' : 'Delete transaction'}
                                        >
                                            <TrashIcon />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="admin-pagination">
                    <button
                        className="admin-btn admin-btn-ghost"
                        disabled={page <= 1}
                        onClick={() => setPage(p => p - 1)}
                    >
                        {lang === 'vi' ? 'Trước' : 'Prev'}
                    </button>
                    <span>
                        {lang === 'vi' ? `Trang ${page} / ${totalPages}` : `Page ${page} of ${totalPages}`}
                    </span>
                    <button
                        className="admin-btn admin-btn-ghost"
                        disabled={page >= totalPages}
                        onClick={() => setPage(p => p + 1)}
                    >
                        {lang === 'vi' ? 'Sau' : 'Next'}
                    </button>
                </div>
            )}

            {/* Modal Confirm Delete */}
            <AnimatePresence>
                {confirmDelete && (
                    <div className="admin-modal-overlay">
                        <motion.div
                            className="admin-modal"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                        >
                            <h3 className="admin-modal-title" style={{ color: '#ef4444' }}>
                                {lang === 'vi' ? 'Xác nhận xóa giao dịch' : 'Confirm Delete Transaction'}
                            </h3>
                            <p className="admin-modal-desc">
                                {lang === 'vi'
                                    ? `Bạn có chắc chắn muốn xóa giao dịch ${confirmDelete.invoice_no} của user ${confirmDelete.user_email}? Hành động này chỉ xóa lịch sử hiển thị và không ảnh hưởng đến hạn sử dụng hiện tại.`
                                    : `Are you sure you want to delete transaction ${confirmDelete.invoice_no} for user ${confirmDelete.user_email}? This only deletes the transaction history log and does not impact their subscription duration.`}
                            </p>
                            <div className="admin-modal-actions">
                                <button
                                    className="admin-btn admin-btn-ghost"
                                    onClick={() => setConfirmDelete(null)}
                                    disabled={deleting}
                                >
                                    {lang === 'vi' ? 'Hủy' : 'Cancel'}
                                </button>
                                <button
                                    className="admin-btn admin-btn-danger"
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    style={{ background: '#ef4444' }}
                                >
                                    {deleting ? '...' : (lang === 'vi' ? 'Xóa' : 'Delete')}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
