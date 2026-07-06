import React, { useState, useEffect, ReactNode, useRef } from 'react'
import { translations } from './translations'
import { motion, AnimatePresence } from 'motion/react'
import LogoImg from './assets/logo/logo.png'

const DOWNLOAD_URL = 'https://github.com/dinorap/FastX_Release/releases/download/v0.1.11/FastX.Launcher_0.1.10_x64_en-US.msi';

const scrollToSection = (tab: string) => {
    const sectionMap: { [key: string]: string } = {
        'features': 'features',
        'use-cases': 'use-cases',
        'pricing': 'pricing',
        'faq': 'faq',
        'docs': 'docs',
    }
    const sectionId = sectionMap[tab]
    if (sectionId) {
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }
}

const getPlans = (lang: 'vi' | 'en') => Object.values(translations[lang].plans)

const getComparison = (lang: 'vi' | 'en') => translations[lang].comparison.groups

const getFaqs = (lang: 'vi' | 'en') => translations[lang].faqs

const TESTIMONIALS = [
    {
        name: 'Dmitry Medvedko',
        role: 'Owner CPA.LIVE',
        text: 'Tôi đã đồng hành cùng FastST với vai trò webmaster và quản lý truyền thông từ khi phiên bản beta ra mắt. Đội ngũ FastST thực sự chuyên nghiệp, và làm việc với họ cùng sản phẩm của họ là một trải nghiệm tuyệt vời. Rất đáng để thử!',
    },
    {
        name: 'Jack // PIRATE CPA',
        role: 'Tiếp thị liên kết',
        text: 'FastST hoạt động hoàn hảo trên tất cả các nền tảng phổ biến như Facebook, Instagram, Google, YouTube, Twitter, TikTok. Giao diện trực quan và dễ sử dụng là một trong những ưu điểm lớn nhất. Hầu hết nội dung của chúng tôi trên các phương tiện truyền thông đều được tạo ra trên trình duyệt này.',
    },
    {
        name: 'NoFomo',
        role: 'Người dùng',
        text: 'Trình duyệt ẩn danh tốt nhất. Với giao diện thân thiện, quyền truy cập không giới hạn lên đến 10 trình duyệt mà không cần đăng ký hoặc tốn phí, cùng với dịch vụ hỗ trợ kỹ thuật xuất sắc, đây là lựa chọn hoàn hảo cho cả người mới bắt đầu hay người dùng đã có kinh nghiệm.',
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

function Header({ tab, setTab, scrolled, lang, setLang }: { tab: string, setTab: (t: string) => void, scrolled: boolean, lang: 'vi' | 'en', setLang: (l: 'vi' | 'en') => void }) {
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
                    <button className="btn btn-ghost">{t.nav.login}</button>
                    <button className="btn btn-primary">{t.nav.register}</button>
                </div>
            </div>
        </header>
    )
}

function HeroSection({ title, subtitle, eyebrow, lang }: { title: ReactNode, subtitle: string, eyebrow: string, lang: 'vi' | 'en' }) {
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
                    <button className="btn btn-primary btn-lg">{t.hero.cta.register}</button>
                    <a href={DOWNLOAD_URL} className="btn btn-outline btn-lg" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                        {t.hero.cta.download}
                    </a>
                </motion.div>
            </div>
        </section>
    )
}

function FeaturesView({ lang }: { lang: 'vi' | 'en' }) {
    const t = translations[lang]
    return (
        <>
            <HeroSection
                lang={lang}
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

function PricingView({ yearly, setYearly, lang }: { yearly: boolean, setYearly: (y: boolean) => void, lang: 'vi' | 'en' }) {
    const t = translations[lang]
    const formatPrice = (p: number) => p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

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

                    <div className="pricing-grid">
                        {getPlans(lang).map((plan, i) => (
                            <motion.div 
                                key={plan.id} 
                                className={`plan ${plan.featured ? 'featured' : ''}`}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
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
                                {plan.overageMonthly ? (
                                    <div className="plan-billed">
                                        {t.pricing.overage.replace('{price}', `$${formatPrice(yearly ? plan.overageYearly : plan.overageMonthly)}`)}
                                    </div>
                                ) : null}
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
                                    <button
                                        className={`btn btn-block ${plan.ctaStyle === 'primary' ? 'btn-primary' : 'btn-outline'}`}
                                    >
                                        {plan.cta}
                                    </button>
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
                        ))}
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
                        {getPlans(lang).map((plan) => (
                            <div className="col" key={plan.id}>
                                {plan.name}
                                <span className="price-small">
                                    {plan.monthly === 0 ? t.pricing.freeAlways : `$${formatPrice(plan.monthly)}${t.pricing.perMonth}`}
                                </span>
                            </div>
                        ))}
                        </div>
                        {getComparison(lang).map((group) => (
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

    return (
        <>
            <SectionHead 
                eyebrow={t.hero.docs.eyebrow}
                title={t.docs.title}
                subtitle={t.hero.docs.subtitle}
            />

            <section className="docs" id="docs" style={{ paddingBottom: '100px' }}>
                <div className="container">
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
                                        return (
                                            <a 
                                                key={item} 
                                                href={isInstall ? DOWNLOAD_URL : "#"} 
                                                className="docs-item"
                                            >
                                                <span className="icon">→</span>
                                                {item}
                                            </a>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

function GlowBackground() {
    return (
        <div className="glow-bg">
            <div className="glow-1" />
            <div className="glow-2" />
        </div>
    )
}

export default function App() {
    const [tab, setTab] = useState('features')
    const [yearly, setYearly] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [openFaq, setOpenFaq] = useState(0)
    const [lang, setLang] = useState<'vi' | 'en'>('vi')
    const t = translations[lang]

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'auto' })
    }, [tab])

    const renderContent = () => {
        switch (tab) {
            case 'features': return <FeaturesView lang={lang} />;
            case 'use-cases': return <UseCasesView lang={lang} />;
            case 'pricing': return <PricingView yearly={yearly} setYearly={setYearly} lang={lang} />;
            case 'faq': return <FaqView openFaq={openFaq} setOpenFaq={setOpenFaq} lang={lang} />;
            case 'docs': return <DocumentationView lang={lang} />;
            default: return <FeaturesView lang={lang} />;
        }
    }

    return (
        <div style={{ position: 'relative' }}>
            <GlowBackground />
            <Header tab={tab} setTab={setTab} scrolled={scrolled} lang={lang} setLang={setLang} />

            <main>
                {renderContent()}
            </main>

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
                            <button className="btn btn-primary btn-lg">{t.cta.btn}</button>
                            <button className="btn btn-outline btn-lg">{t.cta.contact}</button>
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
                                    <li><button className="footer-link-btn" onClick={() => { setTab('features'); scrollToSection('features'); }}>{t.nav.features}</button></li>
                                    <li><button className="footer-link-btn" onClick={() => { setTab('pricing'); scrollToSection('pricing'); }}>{t.nav.pricing}</button></li>
                                    <li><button className="footer-link-btn" onClick={() => { setTab('features'); scrollToSection('features'); }}>{t.hero.cta.download}</button></li>
                                </ul>
                            </div>
                            <div className="footer-col">
                                <h4>{t.footer.resources}</h4>
                                <ul>
                                    <li><button className="footer-link-btn" onClick={() => { setTab('docs'); scrollToSection('docs'); }}>{t.nav.docs}</button></li>
                                    <li><button className="footer-link-btn" onClick={() => { setTab('faq'); scrollToSection('faq'); }}>{t.nav.faq}</button></li>
                                    <li><a href="#">{t.footer.blog}</a></li>
                                    <li><a href="#">{t.footer.support}</a></li>
                                </ul>
                            </div>
                            <div className="footer-col">
                                <h4>{t.footer.company}</h4>
                                <ul>
                                    <li><a href="#">{t.footer.about}</a></li>
                                    <li><a href="#">{t.footer.contact}</a></li>
                                    <li><a href="#">{t.footer.terms}</a></li>
                                    <li><a href="#">{t.footer.privacy}</a></li>
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
        </div>
    )
}

