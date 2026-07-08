import React, { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { UserSession } from './auth'
import { getApiBase } from './auth'

export interface LinkedAccountItem {
    id: number
    email: string
    added_at: string | null
}

export interface LinkedAccountsPayload {
    ok: boolean
    is_linked?: boolean
    is_owner?: boolean
    is_vip?: boolean
    can_add_linked?: boolean
    owner?: {
        id: number
        email: string
        name: string | null
        plan: string
        daily_launch_limit: number
        max_linked_accounts: number
        linked_count: number
        can_add_linked: boolean
    } | null
    max_linked_accounts?: number
    linked_accounts: LinkedAccountItem[]
}

interface AccountPageProps {
    open: boolean
    onClose: () => void
    lang: 'vi' | 'en'
    t: Record<string, string>
    user: UserSession
    accessToken: string
    onUserUpdate?: (next: UserSession) => void
    onSwitchToPricing?: () => void
}

function BackIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function TrashIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function EditIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function PlusIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    )
}

function CalendarIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    )
}

function BoltIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function CrownIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M2 20h20M4 9l4 4 4-7 4 7 4-4-2 11H6L4 9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function LinkIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

function daysUntil(iso: string | null | undefined): number | null {
    if (!iso) return null
    const d = new Date(iso)
    if (isNaN(d.getTime())) return null
    const ms = d.getTime() - Date.now()
    return Math.ceil(ms / (24 * 60 * 60 * 1000))
}

function getPlanUsdPrice(plan: string | null | undefined, cycle: string | null | undefined): number {
    const p = (plan || '').toLowerCase()
    const c = (cycle || '').toLowerCase()
    if (p === 'base') {
        return c === 'yearly' ? 358.8 : 39.9
    }
    if (p === 'team') {
        return c === 'yearly' ? 838.8 : 79.9
    }
    return 0
}

function getPlanVndPrice(plan: string | null | undefined, cycle: string | null | undefined, rate: number | null | undefined): number {
    const usd = getPlanUsdPrice(plan, cycle)
    const r = rate || 25400
    // Làm tròn đến 1,000 VND gần nhất (khớp với công thức làm tròn của backend)
    return Math.round(usd * r / 1000) * 1000
}

export default function AccountPage({
    open,
    onClose,
    lang,
    t,
    user,
    accessToken,
    onUserUpdate,
    onSwitchToPricing,
}: AccountPageProps) {
    const [linked, setLinked] = useState<LinkedAccountsPayload | null>(null)
    const [loadingLinked, setLoadingLinked] = useState(false)
    const [addEmail, setAddEmail] = useState('')
    const [adding, setAdding] = useState(false)
    const [removing, setRemoving] = useState<string | null>(null)
    const [unlinking, setUnlinking] = useState(false)
    const [confirmRemove, setConfirmRemove] = useState<LinkedAccountItem | null>(null)
    const [confirmUnlink, setConfirmUnlink] = useState(false)
    const [editing, setEditing] = useState(false)
    const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    // State lưu danh sách giao dịch
    const [transactions, setTransactions] = useState<any[]>([])
    const [loadingTx, setLoadingTx] = useState(false)

    const showToast = useCallback((type: 'success' | 'error', text: string) => {
        setToast({ type, text })
    }, [])

    useEffect(() => {
        if (!toast) return
        const id = setTimeout(() => setToast(null), 4000)
        return () => clearTimeout(id)
    }, [toast])

    const fetchLinked = useCallback(async () => {
        setLoadingLinked(true)
        try {
            const res = await fetch(`${getApiBase()}/auth/linked-accounts`, {
                headers: { 'x-access-token': accessToken },
            })
            const data = await res.json()
            if (res.ok && data?.ok) {
                setLinked(data as LinkedAccountsPayload)
            } else {
                setLinked({ ok: false, linked_accounts: [] })
            }
        } catch {
            setLinked({ ok: false, linked_accounts: [] })
        } finally {
            setLoadingLinked(false)
        }
    }, [accessToken])

    const fetchTransactions = useCallback(async () => {
        setLoadingTx(true)
        try {
            const res = await fetch(`${getApiBase()}/auth/transactions`, {
                headers: { 'x-access-token': accessToken },
            })
            const data = await res.json()
            if (res.ok && data?.ok) {
                setTransactions(data.transactions || [])
            } else {
                setTransactions([])
            }
        } catch {
            setTransactions([])
        } finally {
            setLoadingTx(false)
        }
    }, [accessToken])

    useEffect(() => {
        if (!open) return
        fetchLinked()
        fetchTransactions()
    }, [open, fetchLinked, fetchTransactions])

    // ESC đóng trang
    useEffect(() => {
        if (!open) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (confirmRemove) setConfirmRemove(null)
                else if (confirmUnlink) setConfirmUnlink(false)
                else if (editing) setEditing(false)
                else onClose()
            }
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [open, confirmRemove, confirmUnlink, editing, onClose])

    // Lock scroll body khi mở
    useEffect(() => {
        if (open) {
            const prev = document.body.style.overflow
            document.body.style.overflow = 'hidden'
            return () => { document.body.style.overflow = prev }
        }
    }, [open])

    if (!open) return null

    const isLinkedChild = !!linked?.is_linked
    const isOwner = !!linked?.is_owner
    const canAdd = !!linked?.can_add_linked
    const ownerMax = linked?.max_linked_accounts ?? user.max_linked_accounts
    const ownerCurrent = linked?.linked_accounts?.length ?? user.linked_accounts_count
    const displayName = user.name || user.email
    const initial = displayName.trim().charAt(0).toUpperCase()

    const handleAdd = async () => {
        const email = addEmail.trim().toLowerCase()
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showToast('error', t.errorEmailInvalid || 'Email không hợp lệ.')
            return
        }
        if (email === user.email.toLowerCase()) {
            showToast('error', t.errorEmailSelf || 'Không thể thêm email của chính bạn.')
            return
        }
        setAdding(true)
        try {
            const res = await fetch(`${getApiBase()}/auth/linked-accounts/add`, {
                method: 'POST',
                headers: {
                    'x-access-token': accessToken,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            })
            const data = await res.json()
            if (res.ok && data?.ok) {
                showToast('success', (t.addSuccess || 'Đã thêm {email}.').replace('{email}', email))
                setAddEmail('')
                await fetchLinked()
            } else {
                const detail = String(data?.detail || '')
                let key = 'errorNetwork'
                if (detail.includes('giới hạn')) key = 'errorLimitReached'
                else if (detail.includes('chính bạn')) key = 'errorEmailSelf'
                else if (detail.includes('khác')) key = 'errorAlreadyLinked'
                else if (detail.includes('dịch vụ')) key = 'errorHasPlan'
                else if (detail.includes('Base, Team')) key = 'errorNotVip'
                showToast('error', t[key] || detail || t.errorNetwork)
            }
        } catch {
            showToast('error', t.errorNetwork || 'Lỗi kết nối.')
        } finally {
            setAdding(false)
        }
    }

    const handleRemove = async (email: string) => {
        setRemoving(email)
        try {
            const res = await fetch(`${getApiBase()}/auth/linked-accounts/${encodeURIComponent(email)}`, {
                method: 'DELETE',
                headers: { 'x-access-token': accessToken },
            })
            const data = await res.json()
            if (res.ok && data?.ok) {
                showToast('success', (t.removeSuccess || 'Đã xóa {email}.').replace('{email}', email))
                await fetchLinked()
            } else {
                showToast('error', data?.detail || t.errorNetwork)
            }
        } catch {
            showToast('error', t.errorNetwork || 'Lỗi kết nối.')
        } finally {
            setRemoving(null)
        }
    }

    const handleUnlink = async () => {
        setUnlinking(true)
        try {
            const res = await fetch(`${getApiBase()}/auth/linked-accounts/me/unlink`, {
                method: 'POST',
                headers: { 'x-access-token': accessToken },
            })
            const data = await res.json()
            if (res.ok && data?.ok) {
                showToast('success', t.unlinkSuccess || 'Đã hủy liên kết.')
                setConfirmUnlink(false)
                try {
                    const meRes = await fetch(`${getApiBase()}/auth/me`, {
                        headers: { 'x-access-token': accessToken },
                    })
                    const meData = await meRes.json()
                    if (meRes.ok && meData?.ok && onUserUpdate) {
                        onUserUpdate(meData.user as UserSession)
                    }
                } catch { /* ignore */ }
                await fetchLinked()
            } else {
                showToast('error', data?.detail || t.errorNetwork)
            }
        } catch {
            showToast('error', t.errorNetwork || 'Lỗi kết nối.')
        } finally {
            setUnlinking(false)
        }
    }

    const used = user.total_group_usage ?? user.launches_today ?? 0
    const limit = user.daily_launch_limit ?? 0
    const percent = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0
    const planUpper = (user.plan || 'free').toUpperCase()
    const billingCycle = user.billing_cycle === 'yearly' ? t.yearly : t.monthly
    const planClass = `account-page-plan-badge account-plan-${(user.plan || 'free').toLowerCase()}`
    const daysLeft = daysUntil(user.subscription_expires_at)
    const expiryWarning = user.is_vip && daysLeft !== null && daysLeft <= 7 && daysLeft > 0

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="account-page"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                >
                    {/* Background pattern */}
                    <div className="account-page-bg" />

                    {/* Sticky header */}
                    <div className="account-page-topbar">
                        <button className="account-page-back" onClick={onClose} aria-label={t.close || 'Đóng'}>
                            <BackIcon />
                            <span>{t.back || 'Quay lại'}</span>
                        </button>
                        <div className="account-page-topbar-title">
                            {t.title || 'Thông tin tài khoản'}
                        </div>
                        <div className="account-page-topbar-spacer" />
                    </div>

                    <div className="account-page-content">
                        {/* Hero card */}
                        <motion.section
                            className="account-hero"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 }}
                        >
                            <div className="account-hero-bg" />
                            <div className="account-hero-inner">
                                {user.picture ? (
                                    <img className="account-hero-avatar" src={user.picture} alt={displayName} />
                                ) : (
                                    <div className="account-hero-avatar account-hero-avatar-fallback">
                                        {initial}
                                    </div>
                                )}
                                <div className="account-hero-info">
                                    <h1 className="account-hero-name">{displayName}</h1>
                                    <div className="account-hero-email">{user.email}</div>
                                    <div className="account-hero-badges">
                                        <span className={planClass}>{planUpper}</span>
                                        {user.is_vip && (
                                            <span className="account-hero-vip">
                                                <CrownIcon /> VIP
                                            </span>
                                        )}
                                        {user.is_linked_account && (
                                            <span className="account-hero-linked-tag">
                                                <LinkIcon /> Linked
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {user.is_vip && daysLeft !== null && daysLeft > 0 && (
                                    <div className={`account-hero-expiry ${expiryWarning ? 'warn' : ''}`}>
                                        <CalendarIcon />
                                        <div>
                                            <div className="account-hero-expiry-value">{daysLeft}</div>
                                            <div className="account-hero-expiry-label">
                                                {lang === 'vi' ? 'ngày còn lại' : 'days left'}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.section>

                        {/* Grid 2 cột */}
                        <div className="account-grid">
                            {/* Cột trái: Subscription + Quota */}
                            <div className="account-col-left">
                                <motion.section
                                    className="account-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <div className="account-card-header">
                                        <div className="account-card-icon account-card-icon-blue">
                                            <CrownIcon />
                                        </div>
                                        <h2 className="account-card-title">{t.plan || 'Gói hiện tại'}</h2>
                                    </div>

                                    <div className="account-sub-grid">
                                        <div className="account-sub-item">
                                            <span className="account-sub-label">{t.plan}</span>
                                            <span className="account-sub-value"><strong>{planUpper}</strong></span>
                                        </div>
                                        {user.is_vip && (
                                            <div className="account-sub-item">
                                                <span className="account-sub-label">{t.billingCycle}</span>
                                                <span className="account-sub-value">{billingCycle}</span>
                                            </div>
                                        )}
                                        {user.is_vip && (
                                            <div className="account-sub-item">
                                                <span className="account-sub-label">{t.startedAt}</span>
                                                <span className="account-sub-value">
                                                    {formatDate(user.purchase_date, lang)}
                                                </span>
                                            </div>
                                        )}
                                        {user.is_vip && (
                                            <div className="account-sub-item">
                                                <span className="account-sub-label">{t.expiresAt}</span>
                                                <span className="account-sub-value">
                                                    {formatDate(user.subscription_expires_at, lang)}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {user.is_vip && (
                                        <div className="account-billing-details" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                                            <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.4)', marginBottom: '12px', fontWeight: 600 }}>
                                                {lang === 'vi' ? 'Chi tiết giao dịch & quy đổi' : 'Billing & Converted details'}
                                            </h4>
                                            <div className="account-sub-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '12px' }}>
                                                <div className="account-sub-item">
                                                    <span className="account-sub-label">{lang === 'vi' ? 'Giá gói gốc' : 'Original price'}</span>
                                                    <span className="account-sub-value" style={{ color: '#fff', fontWeight: 500 }}>
                                                        ${getPlanUsdPrice(user.plan, user.billing_cycle)} / {user.billing_cycle === 'yearly' ? (lang === 'vi' ? 'năm' : 'year') : (lang === 'vi' ? 'tháng' : 'month')}
                                                    </span>
                                                </div>
                                                {user.usd_to_vnd_rate && (
                                                    <div className="account-sub-item">
                                                        <span className="account-sub-label">{lang === 'vi' ? 'Tỷ giá hối đoái' : 'Exchange rate'}</span>
                                                        <span className="account-sub-value" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
                                                            {Math.round(user.usd_to_vnd_rate).toLocaleString(lang === 'vi' ? 'vi-VN' : 'en-US')} VND
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="account-sub-item">
                                                    <span className="account-sub-label">{lang === 'vi' ? 'Thành tiền (VND)' : 'Converted amount'}</span>
                                                    <span className="account-sub-value" style={{ color: '#22c55e', fontWeight: 600 }}>
                                                        {getPlanVndPrice(user.plan, user.billing_cycle, user.usd_to_vnd_rate).toLocaleString(lang === 'vi' ? 'vi-VN' : 'en-US')} VND
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {!user.is_vip && (
                                        <div className="account-upgrade-prompt">
                                            <span>ℹ️ {t.notVip}</span>
                                            {onSwitchToPricing && (
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => { onClose(); onSwitchToPricing() }}
                                                >
                                                    {t.upgradeNow || 'Nâng cấp ngay'}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </motion.section>

                                <motion.section
                                    className="account-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 }}
                                >
                                    <div className="account-card-header">
                                        <div className="account-card-icon account-card-icon-amber">
                                            <BoltIcon />
                                        </div>
                                        <h2 className="account-card-title">{t.quotaTitle}</h2>
                                    </div>

                                    <div className="account-quota">
                                        <div className="account-quota-stats">
                                            <span className="account-quota-used"><strong>{used}</strong> / {limit > 0 ? limit : '∞'}</span>
                                            <span className="account-quota-percent">{percent}%</span>
                                        </div>
                                        <div className="account-quota-bar">
                                            <div
                                                className={`account-quota-fill ${percent >= 90 ? 'danger' : percent >= 70 ? 'warn' : 'ok'}`}
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                        <div className="account-quota-hint">
                                            {limit > 0 ? t.quotaResetsAt : t.noExpiry}
                                            {isOwner && user.linked_accounts_count > 0 ? ` · ${t.quotaGroupNote}` : ''}
                                        </div>
                                    </div>
                                </motion.section>
                            </div>

                            {/* Cột phải: Linked accounts */}
                            <motion.section
                                className="account-card account-card-linked"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="account-card-header">
                                    <div className="account-card-icon account-card-icon-purple">
                                        <LinkIcon />
                                    </div>
                                    <h2 className="account-card-title">{t.linkedTitle || 'Tài khoản liên kết'}</h2>
                                    {!user.is_linked_account && ownerMax > 0 && (
                                        <span className="account-card-meta">
                                            {ownerCurrent}/{ownerMax}
                                        </span>
                                    )}
                                </div>

                                {isLinkedChild && linked?.owner ? (
                                    <div className="account-unlink-owner">
                                        <div className="account-unlink-owner-icon">
                                            <CrownIcon />
                                        </div>
                                        <div className="account-unlink-owner-text">
                                            <div className="account-unlink-owner-title">
                                                {(t.unlinkMyselfDesc || 'Bạn đang được {owner} chia sẻ quota.')
                                                    .replace('{owner}', linked.owner.email)}
                                            </div>
                                            <div className="account-unlink-owner-sub">
                                                {linked.owner.email}
                                            </div>
                                        </div>
                                        <button
                                            className="btn btn-outline btn-sm"
                                            onClick={() => setConfirmUnlink(true)}
                                            disabled={unlinking}
                                        >
                                            {t.unlinkMyself || 'Hủy liên kết'}
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <p className="account-card-desc">
                                            {(t.linkedDesc || 'Tối đa {max} mail.').replace('{max}', String(ownerMax))}
                                        </p>

                                        {canAdd && !editing && (
                                            <div className="account-add-form">
                                                <input
                                                    type="email"
                                                    className="account-add-input"
                                                    placeholder={t.addLinkedPlaceholder || 'vidu@gmail.com'}
                                                    value={addEmail}
                                                    onChange={(e) => setAddEmail(e.target.value)}
                                                    onKeyDown={(e) => { if (e.key === 'Enter') handleAdd() }}
                                                    disabled={adding}
                                                />
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={handleAdd}
                                                    disabled={adding || !addEmail.trim()}
                                                >
                                                    <PlusIcon />
                                                    <span>{adding ? '...' : (t.addLinked || 'Thêm')}</span>
                                                </button>
                                            </div>
                                        )}

                                        {!user.is_vip && !canAdd && (
                                            <div className="account-add-hint">
                                                {t.errorNotVip}
                                            </div>
                                        )}

                                        <div className="account-linked-list">
                                            {loadingLinked ? (
                                                <div className="account-linked-empty">...</div>
                                            ) : (linked?.linked_accounts?.length ?? 0) === 0 ? (
                                                <div className="account-linked-empty">
                                                    {t.noLinked || 'Chưa có email liên kết nào.'}
                                                </div>
                                            ) : (
                                                linked!.linked_accounts.map((la) => (
                                                    <div className="account-linked-item" key={la.id}>
                                                        <div className="account-linked-avatar">
                                                            {la.email.trim().charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="account-linked-info">
                                                            <div className="account-linked-email">{la.email}</div>
                                                            {la.added_at && (
                                                                <div className="account-linked-added">
                                                                    {t.addedAt || 'Thêm lúc'}: {formatDate(la.added_at, lang)}
                                                                </div>
                                                            )}
                                                        </div>
                                                        {canAdd && (
                                                            <div className="account-linked-actions">
                                                                <button
                                                                    className="account-icon-btn"
                                                                    title={t.edit}
                                                                    onClick={() => setConfirmRemove(la)}
                                                                >
                                                                    <EditIcon />
                                                                </button>
                                                                <button
                                                                    className="account-icon-btn account-icon-btn-danger"
                                                                    title={t.remove}
                                                                    disabled={removing === la.email}
                                                                    onClick={() => setConfirmRemove(la)}
                                                                >
                                                                    {removing === la.email ? '...' : <TrashIcon />}
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        {canAdd && (linked?.linked_accounts?.length ?? 0) > 0 && (
                                            <p className="account-section-hint">{t.addLinkedHint}</p>
                                        )}
                                    </>
                                )}
                            </motion.section>
                        </div>

                        {/* Lịch sử thanh toán */}
                        {user.is_vip && (
                            <motion.section
                                className="account-card"
                                style={{ marginTop: '24px', width: '100%' }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                            >
                                <div className="account-card-header">
                                    <div className="account-card-icon account-card-icon-blue">
                                        <HistoryIcon />
                                    </div>
                                    <h2 className="account-card-title">
                                        {lang === 'vi' ? 'Lịch sử giao dịch' : 'Transaction History'}
                                    </h2>
                                </div>

                                <div className="account-tx-table-wrapper" style={{ overflowX: 'auto', marginTop: '16px' }}>
                                    {loadingTx ? (
                                        <div style={{ textAlign: 'center', padding: '24px', color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
                                            {lang === 'vi' ? 'Đang tải lịch sử giao dịch...' : 'Loading transaction history...'}
                                        </div>
                                    ) : transactions.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '32px 16px', color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', fontSize: '14px' }}>
                                            {lang === 'vi' ? 'Chưa có giao dịch nào được ghi nhận.' : 'No transactions recorded yet.'}
                                        </div>
                                    ) : (
                                        <table className="account-tx-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                                            <thead>
                                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
                                                    <th style={{ padding: '12px 8px', fontWeight: 500 }}>{lang === 'vi' ? 'Mã đơn hàng' : 'Invoice ID'}</th>
                                                    <th style={{ padding: '12px 8px', fontWeight: 500 }}>{lang === 'vi' ? 'Gói cước' : 'Plan'}</th>
                                                    <th style={{ padding: '12px 8px', fontWeight: 500 }}>{lang === 'vi' ? 'Chu kỳ' : 'Billing Cycle'}</th>
                                                    <th style={{ padding: '12px 8px', fontWeight: 500 }}>{lang === 'vi' ? 'Số tiền' : 'Amount'}</th>
                                                    <th style={{ padding: '12px 8px', fontWeight: 500 }}>{lang === 'vi' ? 'Thời gian' : 'Date'}</th>
                                                    <th style={{ padding: '12px 8px', fontWeight: 500 }}>{lang === 'vi' ? 'Trạng thái' : 'Status'}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {transactions.map((tx) => (
                                                    <tr key={tx.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '14px', color: 'rgba(255,255,255,0.85)' }}>
                                                        <td style={{ padding: '14px 8px', fontFamily: 'monospace', color: '#fff', fontSize: '13px' }}>{tx.invoice_no}</td>
                                                        <td style={{ padding: '14px 8px' }}>
                                                            <span className={`account-page-plan-badge account-plan-${tx.plan.toLowerCase()}`} style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase', display: 'inline-block', border: 'none' }}>
                                                                {tx.plan}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '14px 8px' }}>
                                                            {tx.billing_cycle === 'yearly' ? (lang === 'vi' ? 'Hàng năm' : 'Yearly') : (lang === 'vi' ? 'Hàng tháng' : 'Monthly')}
                                                        </td>
                                                        <td style={{ padding: '14px 8px', color: '#22c55e', fontWeight: 600 }}>
                                                            {tx.amount.toLocaleString(lang === 'vi' ? 'vi-VN' : 'en-US')} VND
                                                        </td>
                                                        <td style={{ padding: '14px 8px', color: 'rgba(255,255,255,0.6)' }}>
                                                            {formatDate(tx.created_at, lang)}
                                                        </td>
                                                        <td style={{ padding: '14px 8px' }}>
                                                            {(() => {
                                                                if (tx.status === 'completed') {
                                                                    return (
                                                                        <span style={{ color: '#22c55e', background: 'rgba(34, 197, 94, 0.1)', padding: '3px 8px', borderRadius: '6px', fontSize: '12px', display: 'inline-block', fontWeight: 500 }}>
                                                                            {lang === 'vi' ? 'Thành công' : 'Success'}
                                                                        </span>
                                                                    )
                                                                } else if (tx.status === 'pending') {
                                                                    return (
                                                                        <span style={{ color: '#fb923c', background: 'rgba(251, 146, 60, 0.1)', padding: '3px 8px', borderRadius: '6px', fontSize: '12px', display: 'inline-block', fontWeight: 500 }}>
                                                                            {lang === 'vi' ? 'Chờ thanh toán' : 'Pending'}
                                                                        </span>
                                                                    )
                                                                } else if (tx.status === 'cancelled') {
                                                                    return (
                                                                        <span style={{ color: '#f87171', background: 'rgba(248, 113, 113, 0.1)', padding: '3px 8px', borderRadius: '6px', fontSize: '12px', display: 'inline-block', fontWeight: 500 }}>
                                                                            {lang === 'vi' ? 'Đã hủy' : 'Cancelled'}
                                                                        </span>
                                                                    )
                                                                } else {
                                                                    return (
                                                                        <span style={{ color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: '6px', fontSize: '12px', display: 'inline-block', fontWeight: 500, textTransform: 'uppercase' }}>
                                                                            {tx.status}
                                                                        </span>
                                                                    )
                                                                }
                                                            })()}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </motion.section>
                        )}
                    </div>

                    {/* Toast */}
                    <AnimatePresence>
                        {toast && (
                            <motion.div
                                className={`account-toast account-toast-${toast.type}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                            >
                                {toast.text}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Confirm remove */}
                    <AnimatePresence>
                        {confirmRemove && (
                            <motion.div
                                className="account-confirm-overlay"
                                onClick={() => setConfirmRemove(null)}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <motion.div
                                    className="account-confirm"
                                    onClick={(e) => e.stopPropagation()}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                >
                                    <h3>{t.editLinkedTitle || t.remove || 'Sửa/Xóa email liên kết'}</h3>
                                    <p>
                                        {(t.removeConfirm || 'Bạn chắc chắn muốn xóa {email}?').replace('{email}', confirmRemove.email)}
                                    </p>
                                    <div className="account-section-hint" style={{ marginTop: 0, marginBottom: 14 }}>
                                        {t.editLinkedDesc || 'Xóa email cũ rồi thêm lại email mới nếu cần đổi.'}
                                    </div>
                                    <div className="account-confirm-actions">
                                        <button
                                            className="btn btn-ghost btn-sm"
                                            onClick={() => setConfirmRemove(null)}
                                        >
                                            {t.cancel || 'Hủy'}
                                        </button>
                                        <button
                                            className="btn btn-primary btn-sm btn-danger"
                                            onClick={() => {
                                                const email = confirmRemove.email
                                                setConfirmRemove(null)
                                                handleRemove(email)
                                            }}
                                        >
                                            {t.confirm || 'Xác nhận'}
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Confirm unlink myself */}
                    <AnimatePresence>
                        {confirmUnlink && (
                            <motion.div
                                className="account-confirm-overlay"
                                onClick={() => setConfirmUnlink(false)}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <motion.div
                                    className="account-confirm"
                                    onClick={(e) => e.stopPropagation()}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                >
                                    <h3>{t.unlinkMyself}?</h3>
                                    <p>{t.unlinkConfirm}</p>
                                    <div className="account-confirm-actions">
                                        <button
                                            className="btn btn-ghost btn-sm"
                                            onClick={() => setConfirmUnlink(false)}
                                        >
                                            {t.cancel || 'Hủy'}
                                        </button>
                                        <button
                                            className="btn btn-primary btn-sm btn-danger"
                                            onClick={handleUnlink}
                                            disabled={unlinking}
                                        >
                                            {unlinking ? '...' : (t.confirm || 'Xác nhận')}
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
