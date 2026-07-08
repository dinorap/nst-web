// Session management cho Google login trên landing
// Tách biệt hoàn toàn với đăng nhập trong app (Tauri) — chỉ dùng cho web landing.

export interface UserSession {
    id: number
    email: string
    name: string | null
    picture: string | null
    plan: string
    is_vip: boolean
    daily_launch_limit: number
    launches_today: number
    /** Tổng lượt launch của cả group (owner + linked accounts) trong ngày */
    total_group_usage?: number
    max_linked_accounts: number
    linked_accounts_count: number
    is_linked_account: boolean
    /** ISO string — ngày bắt đầu gói hiện tại */
    purchase_date?: string | null
    /** ISO string — ngày hết hạn gói hiện tại */
    subscription_expires_at?: string | null
    /** 'monthly' | 'yearly' */
    billing_cycle?: string | null
    /** Email thuộc ADMIN_EMAILS allowlist trong .env → có thể vào /admin */
    is_admin?: boolean
    /** Tỷ giá quy đổi live từ USD sang VND */
    usd_to_vnd_rate?: number | null
}

export interface StoredSession {
    user: UserSession
    access_token: string
    ts: number
    /** Epoch ms. Mặc định = ts + SESSION_TTL_MS lúc save */
    expiresAt?: number
}

// Session trên web landing tồn tại 7 ngày (sau đó phải đăng nhập lại).
// Server-side token có TTL riêng — nếu token hết hạn trước thì 401 sẽ bị reject sớm hơn.
export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000

const SESSION_KEY = 'fastst_web_session_v1'

export function loadSession(): StoredSession | null {
    try {
        const raw = localStorage.getItem(SESSION_KEY)
        if (!raw) return null
        const parsed = JSON.parse(raw) as StoredSession
        if (!parsed?.user?.email || !parsed?.access_token) {
            localStorage.removeItem(SESSION_KEY)
            return null
        }
        const now = Date.now()
        const expiresAt = parsed.expiresAt ?? (parsed.ts + SESSION_TTL_MS)
        if (now >= expiresAt) {
            // Hết hạn → xóa và yêu cầu đăng nhập lại
            localStorage.removeItem(SESSION_KEY)
            return null
        }
        // Đảm bảo lúc load cũng luôn có expiresAt để debug dễ
        parsed.expiresAt = expiresAt
        return parsed
    } catch {
        localStorage.removeItem(SESSION_KEY)
        return null
    }
}

export function saveSession(session: StoredSession): void {
    const now = Date.now()
    const persisted: StoredSession = {
        ...session,
        ts: session.ts || now,
        expiresAt: session.expiresAt ?? now + SESSION_TTL_MS,
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(persisted))
}

export function clearSession(): void {
    localStorage.removeItem(SESSION_KEY)
}

export function getApiBase(): string {
    // Cùng origin với landing (FastAPI serve cả React build lẫn API).
    return `${window.location.protocol}//${window.location.host}`
}

export async function fetchCurrentUser(accessToken: string): Promise<UserSession | null> {
    try {
        const res = await fetch(`${getApiBase()}/auth/me`, {
            headers: {
                'x-access-token': accessToken,
            },
        })
        if (!res.ok) return null
        const data = await res.json()
        if (!data?.ok || !data?.user) return null
        return data.user as UserSession
    } catch {
        return null
    }
}

export async function startGoogleLogin(frontendOrigin: string): Promise<void> {
    const url = `${getApiBase()}/auth/google/login?frontend_origin=${encodeURIComponent(frontendOrigin)}`
    const res = await fetch(url)
    if (!res.ok) throw new Error('Không thể lấy URL Google OAuth')
    const data = await res.json()
    if (!data?.ok || !data?.authorize_url) throw new Error('Phản hồi không hợp lệ')
    // Đưa cả tab vào Google. Khi xong, Google redirect về backend callback,
    // callback redirect lại về `<frontendOrigin>/?google_auth=<signed>`.
    window.location.href = data.authorize_url
}

export async function verifyGoogleAuthToken(signedToken: string): Promise<StoredSession | null> {
    try {
        const res = await fetch(`${getApiBase()}/auth/verify?token=${encodeURIComponent(signedToken)}`)
        if (!res.ok) return null
        const data = await res.json()
        if (!data?.ok || !data?.user || !data?.access_token) return null
        return {
            user: data.user as UserSession,
            access_token: data.access_token as string,
            ts: Date.now(),
        }
    } catch {
        return null
    }
}

/**
 * Redeem one-time login_token do app cấp. Tương tự verifyGoogleAuthToken nhưng
 * dùng POST body để tránh token lộ trong URL/log.
 */
export async function requestDesktopLogin(loginToken: string): Promise<StoredSession | null> {
    try {
        const res = await fetch(`${getApiBase()}/auth/desktop-token/redeem`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login_token: loginToken }),
        })
        if (!res.ok) return null
        const data = await res.json()
        if (!data?.ok || !data?.user || !data?.access_token) return null
        return {
            user: data.user as UserSession,
            access_token: data.access_token as string,
            ts: Date.now(),
        }
    } catch {
        return null
    }
}

/**
 * Sau khi user upgrade xong trên web, báo cho server set 1 pending flag
 * để app tự refresh plan khi user focus lại app.
 */
export async function notifyAppUpgrade(accessToken: string): Promise<void> {
    try {
        await fetch(`${getApiBase()}/auth/desktop-token/notify-upgrade`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ access_token: accessToken }),
        })
    } catch {
        // ignore
    }
}
