import React, { useState, useEffect, ReactNode, useRef, useMemo } from 'react'
import { translations as translationsRaw } from './translations'
const translations = translationsRaw as any
import { motion, AnimatePresence } from 'motion/react'
// @ts-ignore
import LogoImg from './assets/logo/logo.png'
import { API_DOCS_SECTIONS, DOC_ITEMS_GUIDES, DocItemGuide } from './apiDocsData'
import {
    loadSession,
    saveSession,
    clearSession,
    verifyGoogleAuthToken,
    fetchCurrentUser,
    requestDesktopLogin,
    notifyAppUpgrade,
    type StoredSession,
    type UserSession,
} from './auth'
import LoginModal from './LoginModal'
import UserMenu from './UserMenu'
import AccountPage from './AccountPage'
import { getApiBase } from './auth'
import { DEFAULT_TAB, isValidPlan, isValidTab } from './config'

const DOWNLOAD_URL = 'https://github.com/dinorap/FastX_Release/releases/download/v0.1.11/FastX.Launcher_0.1.10_x64_en-US.msi';

const scrollToSection = (tab: string) => {
    const sectionMap: { [key: string]: string } = {
        'features': 'features',
        'use-cases': 'use-cases',
        'pricing': 'pricing',
        'faq': 'faq',
        'docs': 'docs',
        'download': 'download',
        'download-windows': 'download-windows',
        'download-macos': 'download-macos',
        'download-linux': 'download-linux',
        'usage': 'usage',
    }
    const sectionId = sectionMap[tab]
    if (sectionId) {
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }
}

const getPlans = (lang: 'vi' | 'en') => Object.values((translations as any)[lang].plans) as any[]

const getComparison = (lang: 'vi' | 'en') => (translations as any)[lang].comparison.groups as any

const getFaqs = (lang: 'vi' | 'en') => (translations as any)[lang].faqs as any

const TESTIMONIALS = [
    {
        name: 'Dmitry Medvedko',
        role: 'Owner CPA.LIVE',
        text: 'Tôi đã đồng hành cùng FastST với vai trò webmaster và quản lý truyền thông từ khi phiên bản beta ra mắt. Đội ngũ phát triển thực sự chuyên nghiệp, và làm việc với họ cùng sản phẩm của họ là một trải nghiệm tuyệt vời. Rất đáng để thử!',
    },
    {
        name: 'Jack // PIRATE CPA',
        role: 'Tiếp thị liên kết',
        text: 'FastST hoạt động hoàn hảo trên tất cả các nền tảng phổ biến như Facebook, Instagram, Google, YouTube, Twitter, TikTok. Giao diện trực quan và dễ sử dụng là một trong những ưu điểm lớn nhất. Hầu hết nội dung của chúng tôi trên các phương tiện truyền thông đều được tạo ra trên trình duyệt này.',
    },
    {
        name: 'NoFomo',
        role: 'Người dùng',
        text: 'Trình duyệt ẩn danh tốt nhất. Với giao diện thân thiện, quyền truy cập lên đến 10 lần trên ngày mà không cần đăng ký hoặc tốn phí, cùng với dịch vụ hỗ trợ kỹ thuật xuất sắc, đây là lựa chọn hoàn hảo cho cả người mới bắt đầu hay người dùng đã có kinh nghiệm.',
    },
]

function SectionHead({ title, subtitle, eyebrow }: { title: ReactNode, subtitle: string, eyebrow?: string }) {
    return (
        <div className="section-head">
            {eyebrow && (
                <div className="eyebrow" style={{ margin: '0 auto 24px' }}>
                    <div className="eyebrow-dot" />
                    {eyebrow}
                </div>
            )}
            <h2>{title}</h2>
            <p>{subtitle}</p>
        </div>
    )
}

function CheckIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6.5L5 9L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function ChevronIcon() {
    return (
        <svg className="chev" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 8L10 13L15 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

const Cell: React.FC<{ value: any }> = ({ value }) => {
    if (value === true)
        return (
            <div className="col">
                <span className="compare-cell-yes">
                    <CheckIcon />
                </span>
            </div>
        )
    if (value === false)
        return (
            <div className="col">
                <span className="compare-cell-no">—</span>
            </div>
        )
    return <div className="col"><span className="compare-cell-text">{value}</span></div>
}

function Header({ tab, setTab, scrolled, lang, setLang, user, onLoginClick, onLogout, onViewAccount, onOpenAdmin }: {
    tab: string,
    setTab: (t: string) => void,
    scrolled: boolean,
    lang: 'vi' | 'en',
    setLang: (l: 'vi' | 'en') => void,
    user: UserSession | null,
    onLoginClick: () => void,
    onLogout: () => void,
    onViewAccount: () => void,
    onOpenAdmin: () => void,
}) {
    const [showLang, setShowLang] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const t = translations[lang]

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowLang(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <header className={`header ${scrolled ? 'scrolled' : ''}`}>
            <div className="container header-inner">
                <a href="#" className="logo" onClick={(e) => { e.preventDefault(); setTab('features'); }}>
                    <img src={LogoImg} alt="FastST" className="logo-img" />
                </a>
                <nav className="nav">
                    <div className="nav-tabs">
                        <button
                            className={`nav-tab ${tab === 'features' ? 'active' : ''}`}
                            onClick={() => { setTab('features'); scrollToSection('features'); }}
                        >
                            {t.nav.features}
                        </button>
                        <button
                            className={`nav-tab ${tab === 'use-cases' ? 'active' : ''}`}
                            onClick={() => { setTab('use-cases'); scrollToSection('use-cases'); }}
                        >
                            {t.nav.useCases}
                        </button>
                        <button
                            className={`nav-tab ${tab === 'pricing' ? 'active' : ''}`}
                            onClick={() => { setTab('pricing'); scrollToSection('pricing'); }}
                        >
                            {t.nav.pricing}
                        </button>
                        <button
                            className={`nav-tab ${tab === 'faq' ? 'active' : ''}`}
                            onClick={() => { setTab('faq'); scrollToSection('faq'); }}
                        >
                            {t.nav.faq}
                        </button>
                        <button
                            className={`nav-tab ${tab === 'docs' ? 'active' : ''}`}
                            onClick={() => { setTab('docs'); scrollToSection('docs'); }}
                        >
                            {t.nav.docs}
                        </button>
                        <button
                            className={`nav-tab ${tab === 'download' ? 'active' : ''}`}
                            onClick={() => { setTab('download'); scrollToSection('download'); }}
                        >
                            {t.nav.download || (lang === 'vi' ? 'Tải xuống' : 'Download')}
                        </button>
                    </div>
                </nav>
                <div className="header-cta">
                    <div className="lang-selector" ref={dropdownRef}>
                        <button className="lang-btn" onClick={() => setShowLang(!showLang)}>
                            {lang.toUpperCase()}
                            <ChevronIcon />
                        </button>
                        <AnimatePresence>
                            {showLang && (
                                <motion.div
                                    className="lang-dropdown"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                >
                                    <button
                                        className={`lang-option ${lang === 'en' ? 'active' : ''}`}
                                        onClick={() => { setLang('en'); setShowLang(false); }}
                                    >
                                        EN
                                    </button>
                                    <button
                                        className={`lang-option ${lang === 'vi' ? 'active' : ''}`}
                                        onClick={() => { setLang('vi'); setShowLang(false); }}
                                    >
                                        VN
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    {user ? (
                        <UserMenu user={user} onLogout={onLogout} onViewAccount={onViewAccount} onOpenAdmin={onOpenAdmin} t={t.nav} />
                    ) : (
                        <>
                            <button className="btn btn-ghost" onClick={onLoginClick}>
                                {t.nav.login}
                            </button>
                            <button className="btn btn-primary" onClick={() => setTab('download')}>
                                {t.nav.download}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}

function HeroSection({ title, subtitle, eyebrow, lang, setTab }: { title: ReactNode, subtitle: string, eyebrow: string, lang: 'vi' | 'en', setTab: (tab: string) => void }) {
    const t = translations[lang]
    return (
        <section className="hero" id="features" style={{ textAlign: 'center' }}>
            <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <motion.span
                    className="eyebrow"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="eyebrow-dot" />
                    {eyebrow}
                </motion.span>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                >
                    {title}
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    {subtitle}
                </motion.p>
                <motion.div
                    className="cta-actions hero-cta"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    <button className="btn btn-primary btn-lg" onClick={() => setTab('pricing')}>{t.hero.cta.register}</button>
                    <button className="btn btn-outline btn-lg" onClick={() => setTab('download')} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                        {t.hero.cta.download}
                    </button>
                </motion.div>
            </div>
        </section>
    )
}

function FeaturesView({ lang, setTab }: { lang: 'vi' | 'en', setTab: (tab: string) => void }) {
    const t = translations[lang]
    return (
        <>
            <HeroSection
                lang={lang}
                setTab={setTab}
                eyebrow={t.hero.features.eyebrow}
                title={lang === 'vi' ? <><span>Trình duyệt chống phát hiện</span><span className="grad">tối ưu cho hiệu suất</span></> : <><span>Antidetect browser</span><span className="grad">optimized for performance</span></>}
                subtitle={t.hero.features.subtitle}
            />

            {t.featureBlocks.map((block, bi) => (
                <section key={bi} className={`feature-block ${bi % 2 ? 'alt' : ''}`}>
                    <div className="container">
                        <motion.div
                            className="feature-block-head"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="feature-eyebrow">{block.eyebrow}</span>
                            <h2>{block.title}</h2>
                            <p>{block.desc}</p>
                        </motion.div>
                        <div className="feature-points">
                            {block.points.map((p, pi) => (
                                <motion.div
                                    key={p.title}
                                    className="feature-point"
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: pi * 0.1 }}
                                >
                                    <span className="feature-point-check">
                                        <CheckIcon />
                                    </span>
                                    <div>
                                        <h4>{p.title}</h4>
                                        <p>{p.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            ))}

            <section className="security">
                <div className="container">
                    <SectionHead
                        title={t.security.title}
                        subtitle={t.security.subtitle}
                    />
                    <div className="security-grid">
                        {t.security.items.map((s, i) => (
                            <motion.div
                                key={s.title}
                                className="security-card"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className="security-icon"></div>
                                <h3>{s.title}</h3>
                                <p>{s.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

function UseCasesView({ lang }: { lang: 'vi' | 'en' }) {
    const t = translations[lang]
    return (
        <>
            <SectionHead
                eyebrow={t.hero.useCases.eyebrow}
                title={t.useCases.title}
                subtitle={t.hero.useCases.subtitle}
            />

            <section className="use-cases" style={{ background: 'transparent', padding: '80px 0' }}>
                <div className="container">
                    <div className="use-case-grid">
                        {t.useCases.items.map((u, i) => (
                            <motion.div
                                key={u.title}
                                className="use-case-card"
                                style={{ gridColumn: `span ${u.gridSpan}` }}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className="use-case-icon"></div>
                                <h3>{u.title}</h3>
                                <p>{u.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="testimonials">
                <div className="container">
                    <SectionHead
                        title={t.testimonials.title}
                        subtitle={t.testimonials.subtitle}
                    />
                    <div className="testimonial-grid">
                        {TESTIMONIALS.map((t, i) => (
                            <motion.div
                                key={t.name}
                                className="testimonial-card"
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <p className="testimonial-text">"{t.text}"</p>
                                <div className="testimonial-author">
                                    <div className="testimonial-avatar">{t.name.charAt(0)}</div>
                                    <div>
                                        <div className="testimonial-name">{t.name}</div>
                                        <div className="testimonial-role">{t.role}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

function PricingView({ yearly, setYearly, lang, highlightPlan, session, onRequireLogin, onSessionUpdate, t }: { yearly: boolean, setYearly: (y: boolean) => void, lang: 'vi' | 'en', highlightPlan?: string | null, session: StoredSession | null, onRequireLogin: () => void, onSessionUpdate: (next: StoredSession) => void, t: any }) {
    const formatPrice = (p: number) => p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

    // Sau khi upgrade thành công trên web -> thông báo cho app để refresh.
    const [upgradeResult, setUpgradeResult] = useState<{ plan: string; cycle: 'monthly' | 'yearly' } | null>(null)
    const [upgradeError, setUpgradeError] = useState<string | null>(null)
    const [upgrading, setUpgrading] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
    const [showDowngradeWarn, setShowDowngradeWarn] = useState(false)

    // Kiểm tra kết quả trả về khi redirect từ cổng thanh toán SePay
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        if (params.get('payment') === 'success') {
            const plan = params.get('plan') || 'free'
            const cycle = params.get('cycle') || 'monthly'

            if (session) {
                // Refresh session info từ server với plan/quota mới.
                fetchCurrentUser(session.access_token).then((fresh) => {
                    if (fresh) {
                        const next = { ...session, user: fresh, ts: Date.now() }
                        saveSession(next)
                        onSessionUpdate(next)
                    }
                }).catch((e) => console.warn('Refresh user error:', e))

                // Báo cho app (Tauri) biết user vừa thay đổi gói
                notifyAppUpgrade(session.access_token).catch(() => { })
            }

            // Hiện banner thành công
            setUpgradeResult({ plan, cycle: cycle as 'monthly' | 'yearly' })

            // Xóa query params để tránh lặp lại hành động khi reload
            window.history.replaceState({}, document.title, window.location.pathname)

            // Tự động mở deep link về app sau 2 giây.
            setTimeout(() => {
                const deep = `faststlauncher://upgrade-success?refresh=1&plan=${encodeURIComponent(plan)}&cycle=${encodeURIComponent(cycle)}`
                window.location.href = deep
            }, 2000)
        }
    }, [session])

    // Toast thành công/thất bại tự ẩn sau 10s
    useEffect(() => {
        if (!upgradeResult) return
        const t = setTimeout(() => setUpgradeResult(null), 10000)
        return () => clearTimeout(t)
    }, [upgradeResult])

    useEffect(() => {
        if (!upgradeError) return
        const t = setTimeout(() => setUpgradeError(null), 10000)
        return () => clearTimeout(t)
    }, [upgradeError])

    // Khi ?plan=base/team được truyền từ app, tự cuộn vào gói đó sau khi render.
    const highlightedRef = useRef<HTMLDivElement | null>(null)
    useEffect(() => {
        if (!highlightPlan) return
        const id = `plan-${highlightPlan}`
        requestAnimationFrame(() => {
            const el = document.getElementById(id)
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        })
    }, [highlightPlan])

    const PLAN_ORDER = ['free', 'base', 'team']
    const currentTier = session ? PLAN_ORDER.indexOf(session.user.plan) : 0
    const isDowngrade = (planId: string) => PLAN_ORDER.indexOf(planId) < currentTier

    const handlePlanSelect = (planId: string) => {
        setSelectedPlan(planId)
        setShowDowngradeWarn(isDowngrade(planId))
        setUpgradeResult(null)
        setUpgradeError(null)
    }

    const handleChoosePlan = async (planId: string) => {
        setUpgradeResult(null)
        setUpgradeError(null)

        if (!session) {
            onRequireLogin()
            return
        }

        if (session.user.is_linked_account) {
            setUpgradeError(t.pricing.linkedAccountWarn || 'Tài khoản Linked Account không thể tự nâng cấp. Vui lòng nâng cấp từ tài khoản chính.')
            return
        }

        if (isDowngrade(planId) && !showDowngradeWarn) {
            setShowDowngradeWarn(true)
            return
        }

        setUpgrading(true)
        try {
            const targetCycle = yearly ? 'yearly' : 'monthly'
            const res = await fetch(`${window.location.protocol}//${window.location.host}/auth/upgrade`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': session.access_token,
                },
                body: JSON.stringify({ plan: planId, billing_cycle: targetCycle }),
            })
            const data = await res.json()
            if (!res.ok || !data.ok) {
                setUpgradeError(data.detail || data.error || 'Không thể thay đổi gói. Vui lòng thử lại.')
                return
            }

            // Nếu server yêu cầu thanh toán (nâng cấp gói trả phí)
            if (data.requires_payment && data.checkout_url && data.checkout_fields) {
                // Tạo form ẩn và submit để chuyển hướng sang SePay
                const form = document.createElement('form')
                form.method = 'POST'
                form.action = data.checkout_url

                Object.keys(data.checkout_fields).forEach(key => {
                    const input = document.createElement('input')
                    input.type = 'hidden'
                    input.name = key
                    input.value = data.checkout_fields[key].toString()
                    form.appendChild(input)
                })

                document.body.appendChild(form)
                form.submit()
            } else {
                // Không yêu cầu thanh toán (ví dụ: hạ cấp về free)
                const fresh = await fetchCurrentUser(session.access_token)
                if (fresh) {
                    const next = { ...session, user: fresh, ts: Date.now() }
                    saveSession(next)
                    onSessionUpdate(next)
                }

                notifyAppUpgrade(session.access_token).catch(() => { })

                const cycle: 'monthly' | 'yearly' = yearly ? 'yearly' : 'monthly'
                setUpgradeResult({ plan: planId, cycle })
                setSelectedPlan(null)
                setShowDowngradeWarn(false)

                setTimeout(() => {
                    const deep = `faststlauncher://upgrade-success?refresh=1&plan=${encodeURIComponent(planId)}&cycle=${encodeURIComponent(cycle)}`
                    window.location.href = deep
                }, 2000)
            }
        } catch (e) {
            setUpgradeError('Lỗi kết nối: ' + String(e))
        } finally {
            setUpgrading(false)
        }
    }

    const getDisplayPrice = (plan: any) => {
        if (yearly) {
            return plan.yearly / 12
        }
        return plan.monthly
    }
    const billedNote = (plan: any) => {
        if (plan.monthly === 0) return t.pricing.freeAlways
        const priceStr = `${formatPrice(plan.yearly)}$`
        return yearly ? t.pricing.billedYearly(priceStr) : t.pricing.billedMonthly
    }

    return (
        <>
            <SectionHead
                eyebrow={t.hero.pricing.eyebrow}
                title={t.pricing.title}
                subtitle={t.hero.pricing.subtitle}
            />

            <section className="pricing" id="pricing">
                <div className="container">
                    <div className="billing-toggle">
                        <div className={`toggle-wrap ${yearly ? 'yearly' : ''}`}>
                            <div className="toggle-slider" />
                            <button
                                className={`toggle-option ${!yearly ? 'active' : ''}`}
                                onClick={() => setYearly(false)}
                            >
                                {t.pricing.monthly}
                            </button>
                            <button
                                className={`toggle-option ${yearly ? 'active' : ''}`}
                                onClick={() => setYearly(true)}
                            >
                                {t.pricing.yearly}
                            </button>
                        </div>
                        <span className="save-badge">{t.pricing.save}</span>
                    </div>

                    {/* Banner: chỉ cảnh báo khi là Linked Account */}
                    {session?.user.is_linked_account && (
                        <div className="pricing-current-banner">
                            {t.pricing.linkedAccountBanner || 'Bạn đang dùng tài khoản Linked. Vui lòng nâng cấp từ tài khoản chính.'}
                        </div>
                    )}



                    {/* Banner: cảnh báo downgrade */}
                    {showDowngradeWarn && selectedPlan && isDowngrade(selectedPlan) && (
                        <div className="pricing-warn-banner">
                            ⚠️ {t.pricing.downgradeWarn || 'Cảnh báo: Bạn đang chọn gói thấp hơn gói hiện tại. Một số tính năng sẽ bị giảm.'}
                        </div>
                    )}

                    {/* Banner: đã nâng cấp thành công — sẽ tự chuyển về App sau 2 giây */}
                    {upgradeResult && (
                        <div className="pricing-success-banner" role="status" aria-live="polite">
                            <span className="pricing-success-text">
                                ✅ {t.pricing.upgradeSuccess || 'Đã nâng cấp thành công!'} —{' '}
                                <strong>{upgradeResult.plan.toUpperCase()}</strong>{' '}
                                ({upgradeResult.cycle === 'yearly' ? (t.pricing.yearly || 'Hàng năm') : (t.pricing.monthly || 'Hàng tháng')})
                                {' '}<span style={{ opacity: 0.85 }}>· Đang tự chuyển về App…</span>
                            </span>
                            <button className="pricing-toast-close" onClick={() => setUpgradeResult(null)} aria-label="Close">×</button>
                        </div>
                    )}

                    {/* Toast: lỗi (góc trên bên phải, tự ẩn 10s) */}
                    {upgradeError && (
                        <div className="pricing-toast pricing-toast-error" role="alert" aria-live="assertive">
                            <div className="pricing-toast-icon">❌</div>
                            <div className="pricing-toast-body">
                                <div className="pricing-toast-title">{t.pricing.upgradeErrorTitle || 'Nâng cấp thất bại'}</div>
                                <div className="pricing-toast-sub">{upgradeError}</div>
                            </div>
                            <button className="pricing-toast-close" onClick={() => setUpgradeError(null)} aria-label="Close">×</button>
                        </div>
                    )}

                    <div className="pricing-grid">
                        {(Object.values(t.plans) as any[]).map((plan, i) => {
                            const isCurrent = session?.user.plan === plan.id && !session.user.is_linked_account
                            const isSelected = selectedPlan === plan.id
                            const downgrading = isDowngrade(plan.id)
                            return (
                                <motion.div
                                    key={plan.id}
                                    id={`plan-${plan.id}`}
                                    className={`plan ${plan.featured ? 'featured' : ''} ${highlightPlan === plan.id || isSelected ? 'highlighted' : ''} ${isCurrent ? 'current-plan' : ''} ${downgrading && isSelected ? 'downgrade-selected' : ''}`}
                                    ref={highlightPlan === plan.id ? highlightedRef : null}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    {isCurrent && (
                                        <div className="plan-badge-current">✓ {t.pricing.yourCurrentPlan || 'Gói hiện tại'}</div>
                                    )}
                                    <h3 className="plan-name">{plan.name}</h3>
                                    <p className="plan-desc">{plan.desc}</p>
                                    <div className="plan-price">
                                        <span className="amount">${formatPrice(getDisplayPrice(plan))}</span>
                                        <span className="currency">{t.pricing.perMonth}</span>
                                        <span className="original-price" style={{ visibility: (yearly && plan.monthly > 0) ? 'visible' : 'hidden' }}>
                                            {plan.monthly > 0 ? `$${formatPrice(plan.monthly)}/${t.pricing.perMonth}` : ''}
                                        </span>
                                        {plan.monthly === 0 && <span className="plan-price-spacer" />}
                                    </div>
                                    <div className="plan-billed">{plan.monthly === 0 ? t.pricing.freeAlways : billedNote(plan)}</div>
                                    {plan.users ? (
                                        <div className="plan-billed">
                                            {t.pricing.planUsers}: {plan.users}
                                        </div>
                                    ) : null}
                                    {plan.profilesPerDay ? (
                                        <div className="plan-billed">
                                            {t.pricing.planProfiles}: {plan.profilesPerDay.toLocaleString('en-US')}
                                        </div>
                                    ) : null}
                                    <div className="plan-cta">
                                        {(() => {
                                            // 1. Trường hợp đặc biệt cho gói FREE
                                            if (plan.id === 'free') {
                                                if (session && isCurrent) {
                                                    return (
                                                        <button className="btn btn-block btn-outline current" disabled>
                                                            {t.pricing.yourCurrentPlan || 'Gói hiện tại'}
                                                        </button>
                                                    )
                                                }
                                                // Nếu là tài khoản có phí muốn hạ cấp về free
                                                return (
                                                    <>
                                                        <button
                                                            className={`btn btn-block btn-outline`}
                                                            onClick={() => handlePlanSelect(plan.id)}
                                                            disabled={upgrading}
                                                        >
                                                            {t.pricing.chooseFree || 'Chọn Free'}
                                                        </button>
                                                        {selectedPlan === plan.id && (
                                                            <button
                                                                className={`btn btn-block btn-confirm btn-warning`}
                                                                onClick={() => handleChoosePlan(plan.id)}
                                                                disabled={upgrading}
                                                            >
                                                                {upgrading ? '⏳ Đang xử lý...' :
                                                                    `✓ ${t.pricing.confirmDowngrade || 'Xác nhận hạ cấp xuống'} ${plan.name}`}
                                                            </button>
                                                        )}
                                                    </>
                                                )
                                            }

                                            // 2. Các gói trả phí (base/team)
                                            return (
                                                <>
                                                    <button
                                                        className={`btn btn-block ${plan.ctaStyle === 'primary' ? 'btn-primary' : 'btn-outline'} ${isCurrent ? 'btn-renew-trigger' : ''}`}
                                                        onClick={() => handlePlanSelect(plan.id)}
                                                        disabled={upgrading}
                                                    >
                                                        {isCurrent
                                                            ? (t.pricing.renewPlanLabel || 'Gia hạn / Mua thêm')
                                                            : (downgrading
                                                                ? (t.pricing.choosePlanLabel(plan.name) || `Chọn ${plan.name}`)
                                                                : plan.cta)}
                                                    </button>
                                                    {selectedPlan === plan.id && (
                                                        <button
                                                            className={`btn btn-block btn-confirm ${isCurrent ? 'btn-success' : (downgrading ? 'btn-warning' : 'btn-primary')}`}
                                                            onClick={() => handleChoosePlan(plan.id)}
                                                            disabled={upgrading}
                                                        >
                                                            {upgrading ? '⏳ Đang xử lý...' :
                                                                isCurrent
                                                                    ? (t.pricing.confirmRenew ? t.pricing.confirmRenew(plan.name) : `✓ Xác nhận gia hạn gói ${plan.name}`)
                                                                    : (downgrading
                                                                        ? `✓ ${t.pricing.confirmDowngrade || 'Xác nhận hạ cấp xuống'} ${plan.name}`
                                                                        : `✓ ${t.pricing.confirmUpgrade || 'Xác nhận nâng cấp'} ${plan.name}`)}
                                                        </button>
                                                    )}
                                                </>
                                            )
                                        })()}
                                    </div>
                                    <ul className="plan-features">
                                        {plan.features.map((f, i) => (
                                            <li key={i}>
                                                <span className="check">
                                                    <CheckIcon />
                                                </span>
                                                <span>{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            <section className="comparison" id="compare">
                <div className="container">
                    <SectionHead
                        title={t.pricing.compare}
                        subtitle={t.pricing.compareSubtitle}
                    />
                    <div className="compare-table">
                        <div className="compare-row head">
                            <div className="col first">{t.pricing.features}</div>
                            {(Object.values(t.plans) as any[]).map((plan) => (
                                <div className="col" key={plan.id}>
                                    {plan.name}
                                    <span className="price-small">
                                        {plan.monthly === 0 ? t.pricing.freeAlways : `$${formatPrice(plan.monthly)}${t.pricing.perMonth}`}
                                    </span>
                                </div>
                            ))}
                        </div>
                        {t.comparison.groups.map((group: any) => (
                            <div key={group.group}>
                                <div className="compare-group">{group.group}</div>
                                {group.rows.map((row) => (
                                    <div className="compare-row" key={row.label}>
                                        <div className="col first">{row.label}</div>
                                        {row.values.map((v, i) => (
                                            <Cell key={i} value={v} />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

function FaqView({ openFaq, setOpenFaq, lang }: { openFaq: number, setOpenFaq: (i: number) => void, lang: 'vi' | 'en' }) {
    const t = translations[lang]
    return (
        <>
            <SectionHead
                eyebrow={t.hero.faq.eyebrow}
                title={t.faq.title}
                subtitle={t.hero.faq.subtitle}
            />

            <section className="faq" id="faq">
                <div className="container">
                    <div className="faq-list">
                        {getFaqs(lang).map((item, i) => (
                            <motion.div
                                key={i}
                                className={`faq-item ${openFaq === i ? 'open' : ''}`}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                                    {item.q}
                                    <ChevronIcon />
                                </button>
                                <div className="faq-a">
                                    <div className="faq-a-inner">{item.a}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

function DocumentationView({ lang }: { lang: 'vi' | 'en' }) {
    const t = translations[lang]
    const [selectedSubTab, setSelectedSubTab] = useState<'main' | 'automation'>('main')
    const [activeSectionId, setActiveSectionId] = useState(API_DOCS_SECTIONS[0].id)
    const [codeLang, setCodeLang] = useState<'curl' | 'javascript' | 'python'>('curl')
    const [searchTerm, setSearchTerm] = useState('')
    const [copiedIndex, setCopiedIndex] = useState<string | null>(null)
    const [activeGuideKey, setActiveGuideKey] = useState<string | null>(null)

    const activeSection = API_DOCS_SECTIONS.find(s => s.id === activeSectionId) || API_DOCS_SECTIONS[0]

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopiedIndex(id)
        setTimeout(() => setCopiedIndex(null), 2000)
    }

    const getItemKey = (item: string): string | null => {
        if (item === t.docs.getStartedItems.firstProfile) return 'firstProfile';
        if (item === t.docs.getStartedItems.proxies) return 'proxies';
        if (item === t.docs.getStartedItems.fingerprints) return 'fingerprints';
        if (item === t.docs.advancedItems.teamwork) return 'teamwork';
        if (item === t.docs.advancedItems.sync) return 'sync';
        if (item === t.docs.advancedItems.extensions) return 'extensions';
        if (item === t.docs.videoItems.beginners) return 'beginners';
        if (item === t.docs.videoItems.workflow) return 'workflow';
        if (item === t.docs.videoItems.troubleshooting) return 'troubleshooting';
        return null;
    }

    const filteredSections = useMemo(() => {
        if (!searchTerm) return API_DOCS_SECTIONS
        const term = searchTerm.toLowerCase()
        return API_DOCS_SECTIONS.filter(sec => {
            const titleMatch = sec.title[lang].toLowerCase().includes(term)
            const introMatch = sec.introduction?.[lang].toLowerCase().includes(term) || false
            const endpointsMatch = sec.endpoints?.some(ep =>
                ep.path.toLowerCase().includes(term) ||
                ep.description[lang].toLowerCase().includes(term)
            ) || false
            return titleMatch || introMatch || endpointsMatch
        })
    }, [searchTerm, lang])

    const docs = [
        {
            title: t.docs.getStarted,
            items: [
                t.docs.getStartedItems.install,
                t.docs.getStartedItems.firstProfile,
                t.docs.getStartedItems.proxies,
                t.docs.getStartedItems.fingerprints,
            ],
        },
        {
            title: t.docs.advanced,
            items: [
                t.docs.advancedItems.automation,
                t.docs.advancedItems.teamwork,
                t.docs.advancedItems.sync,
                t.docs.advancedItems.extensions,
            ],
        },
        {
            title: t.docs.video,
            items: [
                t.docs.videoItems.beginners,
                t.docs.videoItems.workflow,
                t.docs.videoItems.troubleshooting,
            ],
        },
    ]

    const activeGuide = activeGuideKey ? DOC_ITEMS_GUIDES[activeGuideKey] : null;

    if (selectedSubTab === 'automation') {
        return (
            <>
                <SectionHead
                    eyebrow={t.hero.docs.eyebrow}
                    title={lang === 'vi' ? 'Tài liệu FastST Launcher API' : 'FastST Launcher API Documentation'}
                    subtitle={lang === 'vi' ? 'Hướng dẫn kết nối, cấu hình vân tay và tự động hóa profile trình duyệt của bạn.' : 'Guidelines to connect, configure fingerprints, and automate your browser profiles.'}
                />

                <section className="docs" style={{ paddingBottom: '100px' }}>
                    <div className="container">
                        <div className="api-docs-back">
                            <button onClick={() => setSelectedSubTab('main')} className="btn btn-outline btn-sm">
                                ← {lang === 'vi' ? 'Quay lại tài liệu' : 'Back to Docs'}
                            </button>
                            <div className="api-docs-search">
                                <input
                                    type="text"
                                    placeholder={lang === 'vi' ? 'Tìm kiếm API...' : 'Search API...'}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="api-docs-layout">
                            {/* Left Sidebar */}
                            <div className="api-docs-sidebar">
                                <ul className="api-docs-nav">
                                    {filteredSections.map(sec => (
                                        <li key={sec.id}>
                                            <button
                                                className={`api-docs-nav-btn ${activeSectionId === sec.id ? 'active' : ''}`}
                                                onClick={() => setActiveSectionId(sec.id)}
                                            >
                                                {sec.title[lang]}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Main Workspace */}
                            <div className="api-docs-main-workspace">
                                <div className="api-docs-section-header">
                                    <h3>{activeSection.title[lang]}</h3>
                                    {activeSection.introduction && (
                                        <div className="api-docs-intro" style={{ whiteSpace: 'pre-line', marginBottom: '30px' }}>
                                            {activeSection.introduction[lang]}
                                        </div>
                                    )}
                                </div>

                                {activeSection.endpoints && activeSection.endpoints.length > 0 && (
                                    <div className="api-global-code-header">
                                        <span>{lang === 'vi' ? 'Ngôn ngữ yêu cầu:' : 'Request language:'}</span>
                                        <div className="code-lang-selector">
                                            <button
                                                className={codeLang === 'curl' ? 'active' : ''}
                                                onClick={() => setCodeLang('curl')}
                                            >
                                                cURL
                                            </button>
                                            <button
                                                className={codeLang === 'javascript' ? 'active' : ''}
                                                onClick={() => setCodeLang('javascript')}
                                            >
                                                JS
                                            </button>
                                            <button
                                                className={codeLang === 'python' ? 'active' : ''}
                                                onClick={() => setCodeLang('python')}
                                            >
                                                Python
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeSection.endpoints && activeSection.endpoints.map((ep, idx) => {
                                    const currentCode = ep.codeExamples[codeLang];
                                    const uniqueId = `${activeSection.id}-${idx}-${codeLang}`;
                                    return (
                                        <div key={idx} className="api-endpoint-row">
                                            {/* Left side: parameters & specs */}
                                            <div className="api-endpoint-specs">
                                                <div className="api-endpoint-header">
                                                    <span className={`method-badge method-${ep.method.toLowerCase()}`}>
                                                        {ep.method}
                                                    </span>
                                                    <span className="endpoint-path">{ep.path}</span>
                                                </div>
                                                <p className="endpoint-desc">{ep.description[lang]}</p>

                                                {ep.headers && (
                                                    <div className="api-params-block">
                                                        <h4>HTTP Headers</h4>
                                                        <div className="api-param-list">
                                                            {ep.headers.map((h, i) => (
                                                                <div key={i} className="api-param-item">
                                                                    <div className="api-param-meta">
                                                                        <span className="param-name">{h.name}</span>
                                                                        <span className={`param-badge ${h.required ? 'required' : 'optional'}`}>
                                                                            {h.required ? (lang === 'vi' ? 'bắt buộc' : 'required') : (lang === 'vi' ? 'tùy chọn' : 'optional')}
                                                                        </span>
                                                                    </div>
                                                                    <div className="param-desc">{h.desc[lang]}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {ep.pathParams && (
                                                    <div className="api-params-block">
                                                        <h4>Path Parameters</h4>
                                                        <div className="api-param-list">
                                                            {ep.pathParams.map((p, i) => (
                                                                <div key={i} className="api-param-item">
                                                                    <div className="api-param-meta">
                                                                        <span className="param-name">{p.name}</span>
                                                                        <span className="param-type">{p.type}</span>
                                                                        <span className="param-badge required">{lang === 'vi' ? 'bắt buộc' : 'required'}</span>
                                                                    </div>
                                                                    <div className="param-desc">{p.desc[lang]}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {ep.queryParams && (
                                                    <div className="api-params-block">
                                                        <h4>Query Parameters</h4>
                                                        <div className="api-param-list">
                                                            {ep.queryParams.map((q, i) => (
                                                                <div key={i} className="api-param-item">
                                                                    <div className="api-param-meta">
                                                                        <span className="param-name">{q.name}</span>
                                                                        <span className="param-type">{q.type}</span>
                                                                        {q.default && <span className="param-default">default: {q.default}</span>}
                                                                        <span className={`param-badge ${q.required ? 'required' : 'optional'}`}>
                                                                            {q.required ? (lang === 'vi' ? 'bắt buộc' : 'required') : (lang === 'vi' ? 'tùy chọn' : 'optional')}
                                                                        </span>
                                                                    </div>
                                                                    <div className="param-desc">{q.desc[lang]}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {ep.bodyParams && (
                                                    <div className="api-params-block">
                                                        <h4>Request Body Schema</h4>
                                                        <div className="api-param-list">
                                                            {ep.bodyParams.map((b, i) => (
                                                                <div key={i} className="api-param-item">
                                                                    <div className="api-param-meta">
                                                                        <span className="param-name">{b.name}</span>
                                                                        <span className="param-type">{b.type}</span>
                                                                        <span className={`param-badge ${b.required ? 'required' : 'optional'}`}>
                                                                            {b.required ? (lang === 'vi' ? 'bắt buộc' : 'required') : (lang === 'vi' ? 'tùy chọn' : 'optional')}
                                                                        </span>
                                                                    </div>
                                                                    <div className="param-desc">{b.desc[lang]}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Right side: Code blocks */}
                                            <div className="api-endpoint-code">
                                                <div className="code-block-wrapper">
                                                    <div className="code-header">
                                                        <span>Request Example ({ep.method})</span>
                                                        <button
                                                            onClick={() => handleCopy(currentCode, uniqueId)}
                                                            className="copy-btn"
                                                        >
                                                            {copiedIndex === uniqueId ? (lang === 'vi' ? 'Đã sao chép' : 'Copied') : (lang === 'vi' ? 'Sao chép' : 'Copy')}
                                                        </button>
                                                    </div>
                                                    <pre className="code-block">
                                                        <code>{currentCode}</code>
                                                    </pre>

                                                    <div className="code-header code-header-response">
                                                        <span>Response (200 OK)</span>
                                                        <button
                                                            onClick={() => handleCopy(ep.responseExample, `${uniqueId}-resp`)}
                                                            className="copy-btn"
                                                        >
                                                            {copiedIndex === `${uniqueId}-resp` ? (lang === 'vi' ? 'Đã sao chép' : 'Copied') : (lang === 'vi' ? 'Sao chép' : 'Copy')}
                                                        </button>
                                                    </div>
                                                    <pre className="code-block response-block">
                                                        <code>{ep.responseExample}</code>
                                                    </pre>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>
            </>
        )
    }

    return (
        <>
            <SectionHead
                eyebrow={t.hero.docs.eyebrow}
                title={t.docs.title}
                subtitle={t.hero.docs.subtitle}
            />

            <section className="docs" id="docs" style={{ paddingBottom: '100px' }}>
                <div className="container">
                    {/* Prominent API Documentation Banner */}
                    <motion.div
                        className="api-docs-promo-banner"
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ marginBottom: '40px' }}
                    >
                        <div className="promo-left">
                            <span className="promo-badge">API REF</span>
                            <h3>{lang === 'vi' ? 'Tài liệu Tự động hóa API FastST Launcher' : 'FastST Launcher Automation API'}</h3>
                            <p>
                                {lang === 'vi'
                                    ? 'Khám phá đầy đủ các API endpoint để tự động hóa tạo vân tay và điều khiển trình duyệt bằng cURL, JavaScript và Python.'
                                    : 'Explore complete API endpoints to automate fingerprinting and control browser profiles via cURL, JavaScript, and Python.'}
                            </p>
                        </div>
                        <button onClick={() => setSelectedSubTab('automation')} className="btn btn-primary">
                            {lang === 'vi' ? 'Khám phá API →' : 'Explore API →'}
                        </button>
                    </motion.div>

                    <div className="use-case-grid">
                        {docs.map((doc, i) => (
                            <motion.div
                                key={doc.title}
                                className="use-case-card"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className="use-case-icon"></div>
                                <h3>{doc.title}</h3>
                                <div className="docs-list">
                                    {doc.items.map((item) => {
                                        const isInstall = item === t.docs.getStartedItems.install;
                                        const isAutomation = item === t.docs.advancedItems.automation;
                                        return (
                                            <a
                                                key={item}
                                                href={isInstall ? DOWNLOAD_URL : "#"}
                                                onClick={(e) => {
                                                    if (isAutomation) {
                                                        e.preventDefault();
                                                        setSelectedSubTab('automation');
                                                    } else if (!isInstall) {
                                                        e.preventDefault();
                                                        const key = getItemKey(item);
                                                        if (key) {
                                                            setActiveGuideKey(key);
                                                        }
                                                    }
                                                }}
                                                className={`docs-item ${isAutomation ? 'docs-item-highlight' : ''}`}
                                            >
                                                <span className="icon">{isAutomation ? '⚡' : '→'}</span>
                                                <span style={{ flex: 1 }}>{item}</span>
                                                {isAutomation && (
                                                    <span className="interactive-badge">
                                                        API Docs
                                                    </span>
                                                )}
                                            </a>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <AnimatePresence>
                {activeGuide && (
                    <motion.div
                        className="login-modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setActiveGuideKey(null)}
                        style={{ zIndex: 1000 }}
                    >
                        <motion.div
                            className="guide-modal-card"
                            initial={{ scale: 0.95, y: 15 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 15 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button className="login-modal-close" onClick={() => setActiveGuideKey(null)} aria-label="Close">
                                ×
                            </button>
                            <div className="guide-modal-header">
                                <h3>{activeGuide.title[lang]}</h3>
                            </div>
                            <div className="guide-modal-content">
                                <div className="guide-steps-list">
                                    {activeGuide.steps.map((step, idx) => (
                                        <div key={idx} className="guide-step-card">
                                            <div className="guide-step-number">{idx + 1}</div>
                                            <div className="guide-step-details">
                                                <h4>{step.title[lang]}</h4>
                                                <p>{step.desc[lang]}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

function DownloadView({ lang }: { lang: 'vi' | 'en' }) {
    const t = translations[lang];
    const [links, setLinks] = useState({
        download_url_windows: 'https://github.com/dinorap/FastX_Release/releases/download/v0.1.11/FastX.Launcher_0.1.10_x64_en-US.msi',
        download_url_macos: 'https://github.com/dinorap/FastX_Release/releases/download/v0.1.11/FastX.Launcher_0.1.10_arm64.dmg',
        download_url_linux: 'https://github.com/dinorap/FastX_Release/releases/download/v0.1.11/FastX.Launcher_0.1.10.AppImage',
        download_version_windows: 'v1.21.1',
        download_version_macos: 'v1.21.1',
        download_version_linux: 'v1.21.1'
    });

    useEffect(() => {
        fetch(`${getApiBase()}/api/download-links`)
            .then(res => res.json())
            .then(data => {
                if (data && data.download_url_windows) {
                    setLinks({
                        download_url_windows: data.download_url_windows,
                        download_url_macos: data.download_url_macos || '',
                        download_url_linux: data.download_url_linux || '',
                        download_version_windows: data.download_version_windows || 'v1.21.1',
                        download_version_macos: data.download_version_macos || 'v1.21.1',
                        download_version_linux: data.download_version_linux || 'v1.21.1'
                    });
                }
            })
            .catch(err => {
                console.error("Failed to load download links, using defaults", err);
            });
    }, []);

    return (
        <>
            <SectionHead
                eyebrow={lang === 'vi' ? 'Tải xuống ứng dụng' : 'Download Application'}
                title={lang === 'vi' ? 'Tải xuống và sử dụng MIỄN PHÍ!' : 'Download and use for FREE!'}
                subtitle={
                    lang === 'vi'
                        ? 'FastST hoàn toàn mở và miễn phí sử dụng, cung cấp môi trường trình duyệt và số lượng nhóm không giới hạn. Tải xuống và sử dụng ngay!'
                        : 'FastST is completely open and free to use, offering browser environments and unlimited team collaboration. Download and start today!'
                }
            />

            <section className="download-section" style={{ paddingBottom: '100px', textAlign: 'center' }}>
                <div className="container">
                    <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '40px' }}>
                        
                        {/* Windows card */}
                        <motion.div 
                            id="download-windows"
                            className="download-card"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            style={{
                                background: 'var(--surface)',
                                border: '1px solid var(--border-soft)',
                                borderRadius: '16px',
                                padding: '32px 24px',
                                flex: '1',
                                minWidth: '280px',
                                maxWidth: '350px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '16px',
                                boxShadow: 'var(--shadow-premium)'
                            }}
                        >
                            <div className="os-icon-svg" style={{ color: '#0078d4', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '64px' }}>
                                <svg viewBox="0 0 88 88" width="48" height="48" fill="currentColor">
                                    <path d="M0 12.378L36.037 7.424V41.7H0V12.378z M0 45.3H36.037V79.576L0 74.622V45.3z M39.963 6.883L88 0V41.7H39.963V6.883z M39.963 45.3H88V88L39.963 81.117V45.3z"/>
                                </svg>
                            </div>
                            <h3 style={{ fontSize: '24px', margin: 0, color: 'var(--text)', fontWeight: 600 }}>Windows</h3>
                            <p style={{ color: 'var(--text-soft)', margin: 0, fontSize: '14px' }}>Windows 10 trở lên, 64-bit</p>
                            <a 
                                href={links.download_url_windows}
                                className="btn btn-primary"
                                style={{ width: '100%', textDecoration: 'none', marginTop: '12px' }}
                            >
                                {lang === 'vi' ? 'Tải về MIỄN PHÍ' : 'Download for FREE'}
                            </a>
                            <span style={{ fontSize: '12px', color: 'var(--text-soft)', opacity: 0.7 }}>{links.download_version_windows}</span>
                        </motion.div>

                        {/* MacOS card */}
                        <motion.div 
                            id="download-macos"
                            className="download-card"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            style={{
                                background: 'var(--surface)',
                                border: '1px solid var(--border-soft)',
                                borderRadius: '16px',
                                padding: '32px 24px',
                                flex: '1',
                                minWidth: '280px',
                                maxWidth: '350px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '16px',
                                boxShadow: 'var(--shadow-premium)'
                            }}
                        >
                            <div className="os-icon-svg" style={{ color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '64px' }}>
                                <svg viewBox="0 0 170 170" width="48" height="48" fill="currentColor">
                                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.35-6.15-2.89-2.38-6.69-6.84-11.41-13.38-7.39-10.23-13.06-21.65-17-34.25-3.95-12.6-5.92-24.4-5.92-35.39 0-15.11 3.75-27.42 11.26-36.94 7.51-9.52 16.99-14.28 28.42-14.28 5.66 0 11.66 1.52 18.01 4.58 6.35 3.06 10.63 4.58 12.84 4.58 1.98 0 6.06-1.46 12.24-4.38 6.18-2.92 12.01-4.3 17.5-4.13 14.59.52 25.86 5.86 33.8 16.03-12.74 7.74-19 17.92-18.77 30.55.22 10.15 4.09 18.5 11.6 25.04 7.52 6.54 16.48 10.02 26.89 10.45-2.22 6.55-5.06 13.1-8.54 19.67zM119.22 4.11c0 7.74-2.8 15.08-8.41 22.02-5.61 6.94-12.57 11.27-20.9 13-1.12-7.85 1.76-15.34 7.21-22.14 5.45-6.81 12.74-11.08 21.05-12.88.75 0 1.05.52 1.05 0z"/>
                                </svg>
                            </div>
                            <h3 style={{ fontSize: '24px', margin: 0, color: 'var(--text)', fontWeight: 600 }}>MacOS</h3>
                            <p style={{ color: 'var(--text-soft)', margin: 0, fontSize: '14px' }}>Intel & Apple Silicon</p>
                            <a 
                                href={links.download_url_macos}
                                className="btn btn-primary"
                                style={{ width: '100%', textDecoration: 'none', marginTop: '12px' }}
                            >
                                {lang === 'vi' ? 'Tải về MIỄN PHÍ' : 'Download for FREE'}
                            </a>
                            <span style={{ fontSize: '12px', color: 'var(--text-soft)', opacity: 0.7 }}>{links.download_version_macos}</span>
                        </motion.div>

                        {/* Linux card */}
                        <motion.div 
                            id="download-linux"
                            className="download-card"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            style={{
                                background: 'var(--surface)',
                                border: '1px solid var(--border-soft)',
                                borderRadius: '16px',
                                padding: '32px 24px',
                                flex: '1',
                                minWidth: '280px',
                                maxWidth: '350px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '16px',
                                boxShadow: 'var(--shadow-premium)'
                            }}
                        >
                            <div className="os-icon-svg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '64px' }}>
                                <img 
                                    src={`${getApiBase()}/img/icons8-linux-96.png`} 
                                    alt="Linux" 
                                    style={{ width: '56px', height: '56px', objectFit: 'contain' }} 
                                />
                            </div>
                            <h3 style={{ fontSize: '24px', margin: 0, color: 'var(--text)', fontWeight: 600 }}>Linux</h3>
                            <p style={{ color: 'var(--text-soft)', margin: 0, fontSize: '14px' }}>AppImage / Tarball / DEB</p>
                            <a 
                                href={links.download_url_linux}
                                className="btn btn-primary"
                                style={{ width: '100%', textDecoration: 'none', marginTop: '12px' }}
                            >
                                {lang === 'vi' ? 'Tải về MIỄN PHÍ' : 'Download for FREE'}
                            </a>
                            <span style={{ fontSize: '12px', color: 'var(--text-soft)', opacity: 0.7 }}>{links.download_version_linux}</span>
                        </motion.div>

                    </div>
                </div>
            </section>
        </>
    );
}

function GlowBackground() {
    return (
        <div className="glow-bg">
            <div className="glow-1" />
            <div className="glow-2" />
        </div>
    )
}

/**
 * Gọi backend set cookie `sb_access_token` từ access_token trong localStorage.
 * Cần thiết vì browser không tự gửi localStorage qua HTTP request — phải có cookie
 * thì GET /admin thuần mới được server nhận diện và cho serve admin.html.
 * Best-effort, không làm fail flow chính nếu lỗi.
 */
async function syncSessionCookie(accessToken: string): Promise<void> {
    try {
        await fetch(`${getApiBase()}/auth/session-cookie`, {
            method: 'POST',
            headers: { 'x-access-token': accessToken },
        })
    } catch (e) {
        console.warn('[SessionCookie] sync failed:', e)
    }
}

/**
 * Nếu user thuộc ADMIN_EMAILS allowlist, gọi backend để set cookie + lấy
 * internal-ui-token rồi redirect sang trang /admin.
 *
 * Trả về Promise<boolean> — true nếu đã redirect thành công.
 */
async function bootstrapAdminSession(accessToken: string): Promise<boolean> {
    try {
        const res = await fetch(`${getApiBase()}/auth/admin-bootstrap`, {
            method: 'POST',
            headers: { 'x-access-token': accessToken },
        })
        if (!res.ok) return false
        const data = await res.json()
        if (!data?.ok) return false
        if (data.internal_ui_token) {
            localStorage.setItem('sb_internal_ui_token', data.internal_ui_token)
        }
        // Cookie sb_admin_gate đã được server set qua Set-Cookie header.
        window.location.href = data.admin_url || '/admin'
        return true
    } catch (e) {
        console.warn('[Admin bootstrap] failed:', e)
        return false
    }
}

export default function App() {
    const [tab, setTab] = useState<string>('features')
    const [yearly, setYearly] = useState(false)
    const [highlightPlan, setHighlightPlan] = useState<string | null>(null)
    const [scrolled, setScrolled] = useState(false)
    const [openFaq, setOpenFaq] = useState(0)
    const [lang, setLang] = useState<'vi' | 'en'>('vi')
    const [plansConfig, setPlansConfig] = useState<any>(null)

    const t = useMemo(() => {
        const baseTranslations = JSON.parse(JSON.stringify(translations[lang]))
        
        // Restore functions lost during JSON deep clone
        if (translations[lang]?.pricing) {
            baseTranslations.pricing.choosePlanLabel = translations[lang].pricing.choosePlanLabel
            baseTranslations.pricing.confirmRenew = translations[lang].pricing.confirmRenew
            baseTranslations.pricing.billedYearly = translations[lang].pricing.billedYearly
        }

        if (plansConfig) {
            const free = plansConfig.free
            const base = plansConfig.base
            const team = plansConfig.team
            if (free) {
                baseTranslations.plans.free.profilesPerDay = free.daily_launch_limit
                baseTranslations.plans.free.users = free.max_linked_accounts || 1
                if (baseTranslations.plans.free.features) {
                    baseTranslations.plans.free.features[0] = lang === 'vi'
                        ? `${free.daily_launch_limit.toLocaleString('vi-VN')} Open profile/ngày`
                        : `${free.daily_launch_limit.toLocaleString('en-US')} open profiles/day`
                }
            }
            if (base) {
                baseTranslations.plans.base.monthly = base.price_usd_monthly
                baseTranslations.plans.base.yearly = base.price_usd_yearly
                baseTranslations.plans.base.users = base.max_linked_accounts
                baseTranslations.plans.base.profilesPerDay = base.daily_launch_limit
                if (baseTranslations.plans.base.features) {
                    baseTranslations.plans.base.features[0] = lang === 'vi'
                        ? `${base.max_linked_accounts} thành viên nhóm`
                        : `${base.max_linked_accounts} group members`
                    baseTranslations.plans.base.features[1] = lang === 'vi'
                        ? `${base.daily_launch_limit.toLocaleString('vi-VN')} Open profile/ngày`
                        : `${base.daily_launch_limit.toLocaleString('en-US')} open profiles/day`
                }
            }
            if (team) {
                baseTranslations.plans.team.monthly = team.price_usd_monthly
                baseTranslations.plans.team.yearly = team.price_usd_yearly
                baseTranslations.plans.team.users = team.max_linked_accounts
                baseTranslations.plans.team.profilesPerDay = team.daily_launch_limit
                if (baseTranslations.plans.team.features) {
                    baseTranslations.plans.team.features[0] = lang === 'vi'
                        ? `${team.max_linked_accounts} thành viên nhóm`
                        : `${team.max_linked_accounts} group members`
                    baseTranslations.plans.team.features[1] = lang === 'vi'
                        ? `${team.daily_launch_limit.toLocaleString('vi-VN')} Open profile/ngày`
                        : `${team.daily_launch_limit.toLocaleString('en-US')} open profiles/day`
                }
            }
            if (baseTranslations.comparison?.groups) {
                // Group 0: Quản lý hồ sơ -> Row 0: Số hồ sơ tiêu chuẩn/ngày
                const profileRow = baseTranslations.comparison.groups[0]?.rows[0]
                if (profileRow) {
                    profileRow.values = [
                        free ? (lang === 'vi' ? `${free.daily_launch_limit.toLocaleString('vi-VN')}/ngày` : `${free.daily_launch_limit.toLocaleString('en-US')}/day`) : profileRow.values[0],
                        base ? (lang === 'vi' ? `${base.daily_launch_limit.toLocaleString('vi-VN')}/ngày` : `${base.daily_launch_limit.toLocaleString('en-US')}/day`) : profileRow.values[1],
                        team ? (lang === 'vi' ? `${team.daily_launch_limit.toLocaleString('vi-VN')}/ngày` : `${team.daily_launch_limit.toLocaleString('en-US')}/day`) : profileRow.values[2]
                    ]
                }
                // Group 2: Làm việc nhóm -> Row 0: Số thành viên
                const memberRow = baseTranslations.comparison.groups[2]?.rows[0]
                if (memberRow) {
                    memberRow.values = [
                        free ? String(free.max_linked_accounts || 1) : memberRow.values[0],
                        base ? String(base.max_linked_accounts) : memberRow.values[1],
                        team ? String(team.max_linked_accounts) : memberRow.values[2]
                    ]
                }
            }
        }
        return baseTranslations
    }, [lang, plansConfig])

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await fetch(`${getApiBase()}/api/public/plans`)
                const data = await res.json()
                if (res.ok && data?.ok) {
                    setPlansConfig(data.plans)
                }
            } catch (e) {
                console.warn('[Fetch dynamic plans failed]', e)
            }
        }
        fetchPlans()
    }, [])

    const [session, setSession] = useState<StoredSession | null>(() => loadSession())
    const [loginOpen, setLoginOpen] = useState(false)
    const [accountPageOpen, setAccountPageOpen] = useState(false)

    // Đảm bảo cookie sb_access_token luôn được set khi landing có session.
    // (Vì reload tab sẽ mất cookie, cần re-sync mỗi lần mount.)
    useEffect(() => {
        if (session?.access_token) {
            syncSessionCookie(session.access_token)
        }
    }, [session?.access_token])

    const handleLogout = () => {
        clearSession()
        setSession(null)
    }

    const handleOpenAdmin = () => {
        if (!session) return
        bootstrapAdminSession(session.access_token)
    }

    // Đọc query params ngay khi mount để điều hướng:
    //   ?tab=pricing | features | use-cases | faq | docs
    //   ?plan=base | team | free  (highlight gói)
    //   ?cycle=monthly | yearly   (chọn chu kỳ)
    //   ?lang=vi | en             (chọn ngôn ngữ)
    // Sau khi xử lý, dọn sạch URL để F5/refresh không lặp lại.
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const tabParam = params.get('tab')
        const planParam = params.get('plan')
        const cycleParam = params.get('cycle')
        const langParam = params.get('lang')
        const hasOAuth = params.has('google_auth') || params.has('google_error')

        let nextTab: string | null = null
        if (isValidTab(tabParam)) {
            nextTab = tabParam
            setTab(tabParam)
        } else {
            nextTab = DEFAULT_TAB
        }

        if (isValidPlan(planParam)) {
            setHighlightPlan(planParam)
        }

        if (cycleParam === 'yearly') setYearly(true)
        else if (cycleParam === 'monthly') setYearly(false)

        if (langParam === 'vi' || langParam === 'en') setLang(langParam)

        // Xóa query params để tránh side-effect khi F5, nhưng giữ path.
        // Nếu đang có google_auth/google_error, để effect OAuth xử lý việc clear.
        if (!hasOAuth && params.toString()) {
            const cleanUrl = window.location.pathname + window.location.hash
            window.history.replaceState({}, '', cleanUrl)
        }

        // Scroll đến section tương ứng sau khi render xong.
        if (nextTab) {
            requestAnimationFrame(() => scrollToSection(nextTab!))
        }
    }, [])

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'auto' })
    }, [tab])

    // Xử lý callback Google OAuth: ?google_auth=<signed>
    // VÀ auto-login từ app: ?login_token=<one-time>
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const signed = params.get('google_auth')
        const error = params.get('google_error')
        const loginToken = params.get('login_token')

        const cleanUrl = window.location.pathname + window.location.hash
        const hasAnything = signed || error || loginToken

        if (signed) {
            window.history.replaceState({}, '', cleanUrl)
            if (error) {
                console.error('[OAuth] Google error:', error)
                alert('Đăng nhập Google thất bại: ' + error)
                return
            }
            verifyGoogleAuthToken(signed).then((result) => {
                if (result) {
                    saveSession(result)
                    setSession(result)
                    setLoginOpen(false)
                    // Set cookie sb_access_token để GET /admin thuần hoạt động.
                    syncSessionCookie(result.access_token)
                    // Nếu email thuộc ADMIN_EMAILS allowlist → tự chuyển sang /admin
                    if (result.user.is_admin) {
                        bootstrapAdminSession(result.access_token)
                    }
                } else {
                    alert('Phiên đăng nhập không hợp lệ hoặc đã hết hạn.')
                }
            })
            return
        }

        if (loginToken) {
            window.history.replaceState({}, '', cleanUrl)
            // One-time token từ app, redeem để lấy session.
            requestDesktopLogin(loginToken).then((result) => {
                if (result) {
                    saveSession(result)
                    setSession(result)
                    setLoginOpen(false)
                    console.log('[Auto-login] Đã đăng nhập từ app thành công:', result.user.email)
                    // Set cookie sb_access_token để GET /admin thuần hoạt động.
                    syncSessionCookie(result.access_token)
                    if (result.user.is_admin) {
                        bootstrapAdminSession(result.access_token)
                    }
                } else {
                    console.warn('[Auto-login] login_token không hợp lệ hoặc đã hết hạn')
                }
            })
            return
        }

        if (error && !hasAnything) {
            window.history.replaceState({}, '', cleanUrl)
            console.error('[OAuth] Google error:', error)
            alert('Đăng nhập Google thất bại: ' + error)
        }
    }, [])

    // Refresh user info từ server mỗi khi có session mới
    useEffect(() => {
        if (!session?.access_token) return
        let cancelled = false
        fetchCurrentUser(session.access_token).then((fresh) => {
            if (cancelled || !fresh) return
            const next: StoredSession = { ...session, user: fresh, ts: Date.now() }
            saveSession(next)
            setSession(next)
        })
        return () => { cancelled = true }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session?.access_token])

    const renderContent = () => {
        switch (tab) {
            case 'features': return <FeaturesView lang={lang} setTab={setTab} />;
            case 'use-cases': return <UseCasesView lang={lang} />;
            case 'pricing': return <PricingView yearly={yearly} setYearly={setYearly} lang={lang} highlightPlan={highlightPlan} session={session} onRequireLogin={() => setLoginOpen(true)} onSessionUpdate={setSession} t={t} />;
            case 'faq': return <FaqView openFaq={openFaq} setOpenFaq={setOpenFaq} lang={lang} />;
            case 'docs': return <DocumentationView lang={lang} />;
            case 'download': return <DownloadView lang={lang} />;
            default: return <FeaturesView lang={lang} setTab={setTab} />;
        }
    }

    return (
        <div style={{ position: 'relative' }}>
            <GlowBackground />
            <Header
                tab={tab}
                setTab={setTab}
                scrolled={scrolled}
                lang={lang}
                setLang={setLang}
                user={session?.user ?? null}
                onLoginClick={() => setLoginOpen(true)}
                onLogout={handleLogout}
                onViewAccount={() => setAccountPageOpen(true)}
                onOpenAdmin={handleOpenAdmin}
            />

            <main>
                {renderContent()}
            </main>

            <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

            {session && (
                <AccountPage
                    open={accountPageOpen}
                    onClose={() => setAccountPageOpen(false)}
                    lang={lang}
                    t={t.account}
                    user={session.user}
                    accessToken={session.access_token}
                    onUserUpdate={(next) => {
                        setSession({ ...session, user: next })
                        saveSession({ ...session, user: next })
                    }}
                    onSwitchToPricing={() => { setTab('pricing'); setTimeout(() => scrollToSection('pricing'), 50) }}
                />
            )}

            <section className="cta">
                <div className="container">
                    <motion.div
                        className="cta-card"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2>{t.cta.title}</h2>
                        <p>{t.cta.subtitle}</p>
                        <div className="cta-actions">
                            <button
                                className="btn btn-primary btn-lg"
                                onClick={() => { setTab('pricing'); scrollToSection('pricing'); }}
                            >
                                {t.cta.btn}
                            </button>
                            <a
                                href="https://www.facebook.com/messages/t/61586168253474"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline btn-lg"
                            >
                                {t.cta.contact}
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            <footer className="footer">
                <div className="container">
                    <div className="footer-top">
                        <div className="footer-brand">
                            <a href="#" className="logo" onClick={(e) => { e.preventDefault(); setTab('features'); }}>
                                <span className="logo-text">FastST</span>
                            </a>
                            <p>{t.footer.desc}</p>
                        </div>
                        <div className="footer-cols">
                            <div className="footer-col">
                                <h4>{t.footer.product}</h4>
                                <ul>
                                    <li><button className="footer-link-btn" onClick={() => { setTab('features'); scrollToSection('features'); }}>{t.footer.features}</button></li>
                                    <li><button className="footer-link-btn" onClick={() => { setTab('pricing'); scrollToSection('pricing'); }}>{t.footer.pricing}</button></li>
                                    <li><button className="footer-link-btn" onClick={() => { setTab('use-cases'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>{t.footer.usage}</button></li>
                                </ul>
                            </div>
                            <div className="footer-col">
                                <h4>{t.footer.resources}</h4>
                                <ul>
                                    <li><button className="footer-link-btn" onClick={() => { setTab('docs'); scrollToSection('docs'); }}>{t.footer.guides}</button></li>
                                    <li><button className="footer-link-btn" onClick={() => { setTab('faq'); scrollToSection('faq'); }}>{t.footer.faq}</button></li>
                                    <li><a href="https://www.facebook.com/messages/t/61586168253474" target="_blank" rel="noopener noreferrer">{t.footer.support}</a></li>
                                </ul>
                            </div>
                            <div className="footer-col">
                                <h4>{t.footer.downloads}</h4>
                                <ul>
                                    <li><button className="footer-link-btn" onClick={() => { setTab('download'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>{t.footer.windows}</button></li>
                                    <li><button className="footer-link-btn" onClick={() => { setTab('download'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>{t.footer.macos}</button></li>
                                    <li><button className="footer-link-btn" onClick={() => { setTab('download'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>{t.footer.linux}</button></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <span>{t.footer.rights}</span>
                        <span>{t.footer.address}</span>
                    </div>
                </div>
            </footer>

            {/* Floating Messenger Chat Button */}
            <a
                href="https://www.facebook.com/messages/t/61586168253474"
                target="_blank"
                rel="noopener noreferrer"
                className="floating-chat-btn"
                aria-label="Chat via Messenger"
            >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.36 2 1.76 6.36 1.76 11.73c0 2.93 1.39 5.56 3.58 7.3.18.15.29.38.29.62v2.4c0 .59.62 1 .13.78l2.67-1.17c.18-.08.38-.1.58-.07 1.07.28 2.2.43 3.35.43 5.64 0 10.24-4.36 10.24-9.73S17.64 2 12 2zm1.18 12.57l-2.45-2.61-4.78 2.61 5.25-5.59 2.45 2.61 4.77-2.61-5.24 5.59z"/>
                </svg>
            </a>
        </div>
    )
}

