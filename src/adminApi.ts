// API client cho các endpoint admin (/admin/*).
// Tất cả request dùng access_token của user Google login - backend sẽ check user.is_admin.

import { getApiBase } from './auth'

export interface AdminUser {
    id: number
    google_id: string
    email: string
    name: string | null
    picture: string | null
    plan: string
    status: string
    daily_launch_limit: number
    max_linked_accounts: number
    linked_accounts_count: number
    linked_accounts: { id: number; email: string; added_at: string | null }[]
    last_login_at: string | null
    created_at: string | null
    today_usage: number
    today_limit: number
    purchase_date: string | null
    subscription_expires_at: string | null
    billing_cycle: string
    is_admin: boolean
}

export interface AdminUserDetail extends AdminUser {
    today_usage: any // { launch_count, daily_limit } from getUser
    recent_usage: { date: string; count: number }[]
}

export interface AdminUserStats {
    total: number
    active: number
    free: number
    base: number
    team: number
}

export interface AdminLicense {
    license_key: string
    product_id: string
    duration_type: string
    status: string
    max_uses: number | null
    current_uses: number
    expire_at: string | null
    purchase_date: string | null
    created_at: string | null
    user_email: string | null
    user_id: number | null
    last_ip: string | null
    last_device: string | null
    last_user_agent: string | null
    notes: string | null
    is_active: boolean
    is_expired: boolean
    is_locked: boolean
    days_remaining: number | null
}

export interface AdminActivationStats {
    total: number
    active: number
    expired: number
    locked: number
    by_product: Record<string, number>
    by_day: { date: string; count: number }[]
    activated_filtered: number | null
    from_date: string | null
    to_date: string | null
}

export interface AdminLinkedAccount {
    id: number
    email: string
    owner_id: number
    owner_email: string | null
    added_at: string | null
}

class AdminApiError extends Error {
    status: number
    constructor(message: string, status: number) {
        super(message)
        this.status = status
    }
}

async function adminFetch(
    accessToken: string,
    path: string,
    init: RequestInit = {}
): Promise<any> {
    const url = `${getApiBase()}${path}`
    const res = await fetch(url, {
        ...init,
        headers: {
            ...(init.body && !(init.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
            'x-access-token': accessToken,
            ...(init.headers || {}),
        },
    })
    let data: any = null
    try {
        data = await res.json()
    } catch {
        data = null
    }
    if (!res.ok) {
        const detail = data?.detail || res.statusText || 'Admin API error'
        throw new AdminApiError(detail, res.status)
    }
    return data
}

// ==================== USERS ====================

export async function adminGetUserStats(accessToken: string): Promise<AdminUserStats> {
    return adminFetch(accessToken, '/admin/users/stats')
}

export async function adminListUsers(
    accessToken: string,
    params: {
        search?: string
        plan?: string
        status?: string
        page?: number
        limit?: number
    } = {}
): Promise<{ ok: true; items: AdminUser[]; total: number; page: number; limit: number }> {
    const qs = new URLSearchParams()
    if (params.search) qs.set('search', params.search)
    if (params.plan) qs.set('plan', params.plan)
    if (params.status) qs.set('status', params.status)
    if (params.page) qs.set('page', String(params.page))
    if (params.limit) qs.set('limit', String(params.limit))
    const query = qs.toString()
    return adminFetch(accessToken, `/admin/users${query ? '?' + query : ''}`)
}

export async function adminGetUser(accessToken: string, userId: number): Promise<AdminUserDetail> {
    const data = await adminFetch(accessToken, `/admin/users/${userId}`)
    return data.user
}

export async function adminCreateUser(
    accessToken: string,
    payload: {
        email: string
        name?: string
        plan?: string
        daily_launch_limit?: number
        max_linked_accounts?: number
        billing_cycle?: string
        purchase_date?: string
        subscription_expires_at?: string
    }
): Promise<{ ok: true; id: number; email: string }> {
    return adminFetch(accessToken, '/admin/users', {
        method: 'POST',
        body: JSON.stringify(payload),
    })
}

export async function adminUpdateUser(
    accessToken: string,
    userId: number,
    payload: {
        name?: string
        plan?: string
        status?: string
        daily_launch_limit?: number
        max_linked_accounts?: number
        billing_cycle?: string
        purchase_date?: string | null
        subscription_expires_at?: string | null
    }
): Promise<{ ok: true }> {
    return adminFetch(accessToken, `/admin/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
    })
}

export async function adminDeleteUser(accessToken: string, userId: number): Promise<{ ok: true }> {
    return adminFetch(accessToken, `/admin/users/${userId}`, { method: 'DELETE' })
}

export async function adminResetUserUsage(accessToken: string, userId: number): Promise<{ ok: true }> {
    return adminFetch(accessToken, `/admin/users/${userId}/reset-usage`, { method: 'POST' })
}

export async function adminResetUserPassword(accessToken: string, userId: number): Promise<{ ok: true }> {
    return adminFetch(accessToken, `/admin/users/${userId}/reset-password`, { method: 'POST' })
}

export async function adminUpdateUserLimit(
    accessToken: string,
    userId: number,
    dailyLimit: number
): Promise<{ ok: true }> {
    return adminFetch(accessToken, `/admin/users/${userId}/limit`, {
        method: 'PUT',
        body: JSON.stringify({ daily_launch_limit: dailyLimit }),
    })
}

// ==================== LICENSES ====================

export async function adminListLicenses(
    accessToken: string,
    params: {
        search?: string
        product_id?: string
        status?: string
        page?: number
        limit?: number
    } = {}
): Promise<{ ok: true; items: AdminLicense[]; total: number; page: number; limit: number }> {
    const qs = new URLSearchParams()
    if (params.search) qs.set('search', params.search)
    if (params.product_id) qs.set('product_id', params.product_id)
    if (params.status) qs.set('status', params.status)
    if (params.page) qs.set('page', String(params.page))
    if (params.limit) qs.set('limit', String(params.limit))
    const query = qs.toString()
    return adminFetch(accessToken, `/admin/licenses${query ? '?' + query : ''}`)
}

export async function adminGetLicense(accessToken: string, licenseKey: string): Promise<AdminLicense> {
    const data = await adminFetch(accessToken, `/admin/licenses/${encodeURIComponent(licenseKey)}`)
    return data.license
}

export async function adminCreateLicense(
    accessToken: string,
    payload: {
        product_id: string
        duration_type: string
        max_uses?: number
        notes?: string
        purchase_date?: string
    }
): Promise<{ ok: true; license_key: string }> {
    return adminFetch(accessToken, '/admin/licenses', {
        method: 'POST',
        body: JSON.stringify(payload),
    })
}

export async function adminUpdateLicense(
    accessToken: string,
    licenseKey: string,
    payload: {
        product_id?: string
        duration_type?: string
        max_uses?: number | null
        notes?: string
        status?: string
    }
): Promise<{ ok: true }> {
    return adminFetch(accessToken, `/admin/licenses/${encodeURIComponent(licenseKey)}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
    })
}

export async function adminDeleteLicense(accessToken: string, licenseKey: string): Promise<{ ok: true }> {
    return adminFetch(accessToken, `/admin/licenses/${encodeURIComponent(licenseKey)}`, { method: 'DELETE' })
}

export async function adminExtendLicense(
    accessToken: string,
    licenseKey: string,
    days: number
): Promise<{ ok: true; new_expire_at: string }> {
    return adminFetch(accessToken, `/admin/licenses/${encodeURIComponent(licenseKey)}/extend`, {
        method: 'POST',
        body: JSON.stringify({ days }),
    })
}

export async function adminLockLicense(accessToken: string, licenseKey: string): Promise<{ ok: true }> {
    return adminFetch(accessToken, `/admin/licenses/${encodeURIComponent(licenseKey)}/lock`, { method: 'POST' })
}

export async function adminUnlockLicense(accessToken: string, licenseKey: string): Promise<{ ok: true }> {
    return adminFetch(accessToken, `/admin/licenses/${encodeURIComponent(licenseKey)}/unlock`, { method: 'POST' })
}

export async function adminResetLicenseClient(accessToken: string, licenseKey: string): Promise<{ ok: true }> {
    return adminFetch(accessToken, `/admin/licenses/${encodeURIComponent(licenseKey)}/reset-client`, { method: 'POST' })
}

export async function adminBulkCreateLicenses(
    accessToken: string,
    payload: {
        product_id: string
        duration_types: string[]
        count: number
        max_uses?: number
    }
): Promise<{ ok: true; keys: string[]; count: number }> {
    return adminFetch(accessToken, '/admin/licenses/bulk-create', {
        method: 'POST',
        body: JSON.stringify(payload),
    })
}

export async function adminBulkExtendActive(
    accessToken: string,
    payload: { product_id?: string; days: number }
): Promise<{ ok: true; affected: number }> {
    return adminFetch(accessToken, '/admin/licenses/bulk-extend-active', {
        method: 'POST',
        body: JSON.stringify(payload),
    })
}

export async function adminBulkShrinkActive(
    accessToken: string,
    payload: { product_id?: string; days: number }
): Promise<{ ok: true; affected: number }> {
    return adminFetch(accessToken, '/admin/licenses/bulk-shrink-active', {
        method: 'POST',
        body: JSON.stringify(payload),
    })
}

export async function adminGetActivationStats(
    accessToken: string,
    params: { activated_from?: string; activated_to?: string } = {}
): Promise<AdminActivationStats> {
    const qs = new URLSearchParams()
    if (params.activated_from) qs.set('activated_from', params.activated_from)
    if (params.activated_to) qs.set('activated_to', params.activated_to)
    const query = qs.toString()
    return adminFetch(accessToken, `/admin/licenses/activation-stats${query ? '?' + query : ''}`)
}

// ==================== LINKED ACCOUNTS ====================

export async function adminListLinkedAccounts(accessToken: string): Promise<{ ok: true; items: AdminLinkedAccount[] }> {
    return adminFetch(accessToken, '/admin/linked-accounts')
}

export async function adminAddLinkedAccount(
    accessToken: string,
    payload: { owner_email: string; email: string }
): Promise<{ ok: true }> {
    return adminFetch(accessToken, '/admin/linked-accounts', {
        method: 'POST',
        body: JSON.stringify(payload),
    })
}

export async function adminRemoveLinkedAccount(
    accessToken: string,
    email: string
): Promise<{ ok: true }> {
    return adminFetch(accessToken, `/admin/linked-accounts/${encodeURIComponent(email)}`, { method: 'DELETE' })
}

export interface AdminTransaction {
    id: number
    invoice_no: string
    user_id: number
    user_email: string
    user_name: string | null
    plan: string
    billing_cycle: string
    amount: number
    status: string
    created_at: string
}

// ==================== TRANSACTIONS ====================

export async function adminListTransactions(
    accessToken: string,
    params: {
        search?: string
        plan?: string
        status?: string
        page?: number
        limit?: number
    } = {}
): Promise<{ ok: true; items: AdminTransaction[]; total: number; page: number; limit: number }> {
    const qs = new URLSearchParams()
    if (params.search) qs.set('search', params.search)
    if (params.plan) qs.set('plan', params.plan)
    if (params.status) qs.set('status', params.status)
    if (params.page) qs.set('page', String(params.page))
    if (params.limit) qs.set('limit', String(params.limit))
    const query = qs.toString()
    return adminFetch(accessToken, `/admin/transactions${query ? '?' + query : ''}`)
}

export async function adminDeleteTransaction(
    accessToken: string,
    txId: number
): Promise<{ ok: true; message: string }> {
    return adminFetch(accessToken, `/admin/transactions/${txId}`, { method: 'DELETE' })
}

export { AdminApiError }
