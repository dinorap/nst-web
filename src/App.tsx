import React, { useState, useEffect, ReactNode, useRef } from 'react'
import { translations } from './translations'
import { motion, AnimatePresence } from 'motion/react'

const DOWNLOAD_URL = 'https://github.com/dinorap/FastX_Release/releases/download/v0.1.11/FastX.Launcher_0.1.10_x64_en-US.msi';

const PLANS = [
    {
        id: 'free',
        name: 'Free',
        desc: 'Dành cho người dùng mới',
        monthly: 0,
        yearly: 0,
        cta: 'Bắt đầu miễn phí',
        ctaStyle: 'outline',
        features: [
            '10 hồ sơ trình duyệt',
            'Quản lý proxy cơ bản',
            '1 thành viên',
            'Hỗ trợ qua email',
        ],
    },
    {
        id: 'starter',
        name: 'Starter',
        desc: 'Dành cho người dùng cá nhân',
        monthly: 250000,
        yearly: 2610000,
        cta: 'Chọn Starter',
        ctaStyle: 'outline',
        features: [
            '20 hồ sơ trình duyệt',
            'Quản lý proxy nâng cao',
            '1 thành viên',
            'Thao tác hàng loạt',
            'Hỗ trợ ưu tiên',
        ],
    },
    {
        id: 'base',
        name: 'Base',
        desc: 'Dành cho cá nhân & nhóm nhỏ',
        monthly: 2225000,
        yearly: 23229000,
        cta: 'Chọn Base',
        ctaStyle: 'primary',
        featured: true,
        features: [
            '100 hồ sơ trình duyệt',
            'Quản lý proxy nâng cao',
            '5 thành viên',
            'Thao tác hàng loạt',
            'Tự động hóa & API',
            'Tạo kịch bản dạng khối',
            'Hỗ trợ ưu tiên 24/7',
        ],
    },
    {
        id: 'team',
        name: 'Team',
        desc: 'Dành cho những nhóm lớn',
        monthly: 3975000,
        yearly: 41499000,
        cta: 'Chọn Team',
        ctaStyle: 'outline',
        features: [
            '300 hồ sơ trình duyệt',
            'Quản lý proxy nâng cao',
            '20 thành viên',
            'Thao tác hàng loạt',
            'Tự động hóa & API',
            'Tạo kịch bản dạng khối',
            'Tích hợp bên thứ ba',
            'Hỗ trợ ưu tiên 24/7',
        ],
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        desc: 'Dành cho doanh nghiệp & công ty lớn',
        monthly: 7475000,
        yearly: 78039000,
        cta: 'Liên hệ bán hàng',
        ctaStyle: 'outline',
        features: [
            'Hồ sơ không giới hạn',
            'Quản lý proxy doanh nghiệp',
            'Thành viên không giới hạn',
            'Tất cả tính năng Team',
            'API & tự động hóa đầy đủ',
            'Quản lý dự án tích hợp',
            'Quản lý tài khoản chuyên trách',
            'SLA & hỗ trợ riêng',
        ],
    },
]

const COMPARISON = [
    {
        group: 'Quản lý hồ sơ',
        rows: [
            { label: 'Số hồ sơ trình duyệt', values: ['10', '20', '100', '300', 'Không giới hạn'] },
            { label: 'Hồ sơ di động', values: [false, false, true, true, true] },
            { label: 'Sao chép hồ sơ', values: [false, true, true, true, true] },
        ],
    },
    {
        group: 'Quản lý proxy',
        rows: [
            { label: 'Số proxy', values: ['5', '20', '100', '300', 'Không giới hạn'] },
            { label: 'Proxy tích hợp', values: [true, true, true, true, true] },
            { label: 'Kiểm tra proxy tự động', values: [false, true, true, true, true] },
        ],
    },
    {
        group: 'Làm việc nhóm',
        rows: [
            { label: 'Số thành viên', values: ['1', '1', '5', '20', 'Không giới hạn'] },
            { label: 'Chia sẻ hồ sơ', values: [false, false, true, true, true] },
            { label: 'Phân quyền vai trò', values: [false, false, true, true, true] },
        ],
    },
    {
        group: 'Tự động hóa & API',
        rows: [
            { label: 'Truy cập API', values: [false, false, true, true, true] },
            { label: 'Tạo kịch bản dạng khối', values: [false, false, true, true, true] },
            { label: 'Tích hợp bên thứ ba', values: [false, false, false, true, true] },
        ],
    },
    {
        group: 'Hỗ trợ',
        rows: [
            { label: 'Hỗ trợ email', values: [true, true, true, true, true] },
            { label: 'Hỗ trợ ưu tiên', values: [false, true, true, true, true] },
            { label: 'Quản lý tài khoản chuyên trách', values: [false, false, false, false, true] },
        ],
    },
]

const FAQS = [
    {
        q: 'Tôi có thể đổi gói bất cứ lúc nào không?',
        a: 'Có. Bạn có thể nâng cấp hoặc hạ cấp gói bất cứ lúc nào. Khi nâng cấp, chúng tôi sẽ tính phí theo tỷ lệ thời gian còn lại trong kỳ thanh toán hiện tại.',
    },
    {
        q: 'Có dùng thử miễn phí không?',
        a: 'Có. Gói Free cho phép bạn tạo 10 hồ sơ trình duyệt miễn phí vĩnh viễn, không cần thẻ tín dụng. Bạn cũng có thể dùng thử các tính năng cao cấp trong 7 ngày.',
    },
    {
        q: 'Phương thức thanh toán nào được chấp nhận?',
        a: 'Chúng tôi chấp nhận thẻ tín dụng (Visa, Mastercard, American Express), PayPal và chuyển khoản ngân hàng cho các gói Enterprise.',
    },
    {
        q: 'Chính sách hoàn tiền như thế nào?',
        a: 'Chúng tôi cung cấp chính sách hoàn tiền trong 14 ngày cho tất cả các gói trả phí. Nếu bạn không hài lòng, liên hệ với chúng tôi để được hoàn tiền đầy đủ.',
    },
    {
        q: 'Tôi có được giảm giá khi thanh toán theo năm không?',
        a: 'Có. Khi thanh toán theo năm, bạn tiết kiệm khoảng 17% so với thanh toán hàng tháng cho mọi gói trả phí.',
    },
]

const USE_CASES = [
    {
        title: 'Thương mại điện tử',
        desc: 'Quản lý hàng chục tài khoản Amazon, eBay, Shopee mà không lo bị liên kết hay khóa tài khoản.',
        gridSpan: 4
    },
    {
        title: 'Tiếp thị liên kết',
        desc: 'Tạo hàng loạt profile sạch để chạy quảng cáo Facebook, Google Ads, TikTok Ads hiệu quả cao. Nuôi tài khoản, cài đặt và khởi chạy dễ dàng với trình duyệt hàng đầu.',
        gridSpan: 8
    },
    {
        title: 'Thử nghiệm & QA',
        desc: 'Kiểm tra giao diện web trên nhiều cấu hình dấu vân tay khác nhau một cách nhanh chóng và chính xác nhất.',
        gridSpan: 7
    },
    {
        title: 'Quản lý đội ngũ',
        desc: 'Phân quyền linh hoạt cho thành viên, chia sẻ profile an toàn và đồng bộ hóa tức thì.',
        gridSpan: 5
    },
]

const FEATURE_BLOCKS = [
    {
        eyebrow: 'Quản lý hồ sơ',
        title: 'Sử dụng đồng bộ hóa để lặp lại các thao tác',
        desc: 'Nhóm theo ngách, trạng thái hay bất kỳ tiêu chí nào khác. Sử dụng bố cục, biểu tượng và chỉ báo màu để nhanh chóng tìm tài khoản trong trình duyệt.',
        points: [
            {
                title: 'Quản lý nhóm hồ sơ ngay lập tức thông qua tác vụ hàng loạt',
                desc: 'Đa luồng nhiều tác vụ: chạy tập lệnh, xuất cookie, gắn thẻ, chia sẻ với đồng nghiệp, thêm proxy, đồng bộ hóa...',
            },
            {
                title: 'Cập nhật dấu vân tay cho nhiều hồ sơ cùng một lúc',
                desc: 'Không còn những bản cập nhật thủ công, từng cái một! Chọn bất kỳ hồ sơ nào bạn muốn — thậm chí tất cả — và cập nhật mọi thứ ngay lập tức!',
            },
            {
                title: 'Đăng nhập và chuyển đổi thuận tiện giữa nhiều tài khoản',
                desc: 'Chuyển đổi nhanh chóng giữa nhiều tài khoản để quy trình làm việc trở nên nhanh hơn nữa!',
            },
        ],
    },
    {
        eyebrow: 'Dấu vân tay',
        title: 'Sử dụng và tùy chỉnh dấu vân tay thật',
        desc: 'Khi tạo hồ sơ nhanh, chúng tôi sẽ sử dụng dấu vân tay thật. Thế nên bạn không cần phải tốn quá nhiều thời gian để thiết lập lại hồ sơ trước khi khởi chạy.',
        points: [
            {
                title: 'Tùy chỉnh 20 thông số dấu vân tay',
                desc: 'FastST có thể kiểm soát 20 thông số và tạo dấu vân tay độc nhất cho bất kỳ hệ điều hành nào, bao gồm iOS và Android.',
            },
            {
                title: 'Thay đổi tên thiết bị',
                desc: 'Hệ thống, trình duyệt và các trang web sẽ thấy một tên hợp lệ và hợp lý, không có giá trị mặc định hoặc trùng khớp đáng ngờ.',
            },
            {
                title: 'Giả mạo WebGL, WebGPU, ClientHints và Voices',
                desc: 'Chúng tôi đã đưa việc giả mạo lên một cấp độ hoàn toàn mới, đồng thời bổ sung khả năng ẩn mọi yếu tố antidetect trong phần hiển thị trực quan khi xác minh.',
            },
        ],
    },
    {
        eyebrow: 'Làm việc nhóm',
        title: 'Chuyển và chia sẻ hồ sơ trình duyệt trong nhóm',
        desc: 'Không còn nỗi lo khi chuyển dữ liệu giữa các người dùng! Thiết lập quyền linh hoạt cho từng thành viên và thư mục.',
        points: [
            {
                title: 'Chia sẻ profile, proxy và cookies trong nhóm',
                desc: 'Chuyển dữ liệu giữa các người dùng nhanh chóng và an toàn.',
            },
            {
                title: 'Cấp quyền truy cập vào từng profile hoặc toàn bộ thư mục',
                desc: 'Thiết lập quyền tạo, chỉnh sửa, xóa, sao chép và chuyển profile. Các profile trong thư mục kế thừa quyền.',
            },
            {
                title: 'Thiết lập giới hạn số lượng profile',
                desc: 'Hạn chế số lượng profile được sử dụng bởi người dùng bổ sung và sắp xếp đánh dấu vào thư mục cho từng loại trang web.',
            },
        ],
    },
    {
        eyebrow: 'Tự động hóa',
        title: 'Tạo tự động trình duyệt các kịch bản khác nhau',
        desc: 'Hỗ trợ nuôi tài khoản, thu thập dữ liệu hay bất kỳ điều gì bạn muốn — gấp đôi sự nhanh chóng và tiện lợi. Hỗ trợ Windows, Linux và MacOS.',
        points: [
            {
                title: 'Kịch bản dạng khối',
                desc: 'Xây dựng quy trình tự động mà không cần lập trình, kéo thả các khối thao tác.',
            },
            {
                title: 'API linh hoạt',
                desc: 'Tự động hóa tài khoản và thao tác hồ sơ thông qua API của chúng tôi.',
            },
            {
                title: 'Chuyển profile sang FastST{cloud}',
                desc: 'Chuyển profile sang FastST{cloud} chỉ với vài cú nhấp chuột — hoạt động ngầm, không cần extension.',
            },
        ],
    },
]

const SECURITY = [
    {
        title: 'Đồng bộ hóa đám mây',
        desc: 'Lưu trữ hồ sơ, cookie, proxy và tiện ích mở rộng. Làm việc trên mọi thiết bị Windows, Mac hoặc Linux mọi lúc, mọi nơi.',
    },
    {
        title: 'Tự động hóa API linh hoạt',
        desc: 'Tự động hóa các tài khoản và thao tác của hồ sơ với API của chúng tôi.',
    },
    {
        title: 'Dữ liệu của bạn được bảo vệ',
        desc: 'Thông tin của bạn luôn được bảo mật. Chỉ bạn mới có quyền truy cập vào thông tin của chính mình.',
    },
    {
        title: 'Đồng bộ profile cục bộ',
        desc: 'Tùy chọn tắt đồng bộ đám mây và lưu trữ profile cục bộ trên thiết bị của bạn.',
    },
]

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
                    <span className="logo-mark">🐬</span>
                    <span className="logo-text">FastST</span>
                </a>
                <nav className="nav">
                    <div className="nav-tabs">
                        <button
                            className={`nav-tab ${tab === 'features' ? 'active' : ''}`}
                            onClick={() => setTab('features')}
                        >
                            {t.nav.features}
                        </button>
                        <button
                            className={`nav-tab ${tab === 'use-cases' ? 'active' : ''}`}
                            onClick={() => setTab('use-cases')}
                        >
                            {t.nav.useCases}
                        </button>
                        <button
                            className={`nav-tab ${tab === 'pricing' ? 'active' : ''}`}
                            onClick={() => setTab('pricing')}
                        >
                            {t.nav.pricing}
                        </button>
                        <button
                            className={`nav-tab ${tab === 'faq' ? 'active' : ''}`}
                            onClick={() => setTab('faq')}
                        >
                            {t.nav.faq}
                        </button>
                        <button
                            className={`nav-tab ${tab === 'docs' ? 'active' : ''}`}
                            onClick={() => setTab('docs')}
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
        <section className="hero" style={{ textAlign: 'center' }}>
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
                title={lang === 'vi' ? <>Trình duyệt chống phát hiện <br /><span className="grad">tối ưu cho hiệu suất</span></> : <>Antidetect browser <br /><span className="grad">optimized for performance</span></>}
                subtitle={t.hero.features.subtitle}
            />

            {FEATURE_BLOCKS.map((block, bi) => (
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
                title={lang === 'vi' ? 'Nhanh chóng, yên tâm, an toàn' : 'Fast, secure, reliable'}
                subtitle={lang === 'vi' ? 'Đúng như bạn mong đợi từ một trình duyệt antidetect chuyên nghiệp' : 'Exactly what you expect from a professional antidetect browser'}
            />
                    <div className="security-grid">
                        {SECURITY.map((s, i) => (
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
                eyebrow={t.hero.useCases.title}
                title="Ứng dụng đa dạng"
                subtitle={t.hero.useCases.subtitle}
            />

            <section className="use-cases" style={{ background: 'transparent', padding: '80px 0' }}>
                <div className="container">
                    <div className="use-case-grid">
                        {USE_CASES.map((u, i) => (
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
    const formatPrice = (p: number) => p.toLocaleString('vi-VN')

    const getDisplayPrice = (plan: any) => {
        if (yearly) {
            return Math.round(plan.yearly / 12)
        }
        return plan.monthly
    }
    const billedNote = (plan: any) => {
        if (plan.monthly === 0) return t.pricing.freeAlways
        const priceStr = `${formatPrice(plan.yearly)}₫`
        return yearly ? t.pricing.billedYearly(priceStr) : t.pricing.billedMonthly
    }

    return (
        <>
            <SectionHead 
                eyebrow={t.hero.pricing.eyebrow}
                title="Bảng giá linh hoạt"
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
                        {PLANS.map((plan, i) => (
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
                                    <span className="amount">{formatPrice(getDisplayPrice(plan))}</span>
                                    <span className="currency">₫ / {t.pricing.perMonth}</span>
                                    <span className="original-price" style={{ visibility: (yearly && plan.monthly > 0) ? 'visible' : 'hidden' }}>
                                        {plan.monthly > 0 ? `${formatPrice(plan.monthly)}₫/${t.pricing.perMonth}` : ''}
                                    </span>
                                    {plan.monthly === 0 && <span className="plan-price-spacer" />}
                                </div>
                                <div className="plan-billed">{plan.monthly === 0 ? t.pricing.freeAlways : billedNote(plan)}</div>
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
                            {PLANS.map((p) => (
                                <div className="col" key={p.id}>
                                    {p.name}
                                    <span className="price-small">
                                        {p.monthly === 0 ? (lang === 'vi' ? 'Miễn phí' : 'Free') : `${formatPrice(p.monthly)}₫${t.pricing.perMonth}`}
                                    </span>
                                </div>
                            ))}
                        </div>
                        {COMPARISON.map((group) => (
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
                title="Câu hỏi thường gặp"
                subtitle={t.hero.faq.subtitle}
            />

            <section className="faq" id="faq">
                <div className="container">
                    <div className="faq-list">
                        {FAQS.map((item, i) => (
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
            title: lang === 'vi' ? 'Bắt đầu' : 'Get Started',
            items: lang === 'vi' ? [
                'Cài đặt FastST',
                'Tạo hồ sơ đầu tiên',
                'Quản lý proxy',
                'Sử dụng dấu vân tay',
            ] : [
                'Installing FastST',
                'Creating your first profile',
                'Managing proxies',
                'Using fingerprints',
            ],
        },
        {
            title: lang === 'vi' ? 'Tính năng nâng cao' : 'Advanced Features',
            items: lang === 'vi' ? [
                'Tự động hóa & API',
                'Làm việc nhóm',
                'Đồng bộ hóa dữ liệu',
                'Quản lý extension',
            ] : [
                'Automation & API',
                'Teamwork',
                'Data synchronization',
                'Extension management',
            ],
        },
        {
            title: lang === 'vi' ? 'Hướng dẫn video' : 'Video Tutorials',
            items: lang === 'vi' ? [
                'Video hướng dẫn cho người mới',
                'Tối ưu hóa quy trình làm việc',
                'Khắc phục sự cố thường gặp',
            ] : [
                'Tutorial for beginners',
                'Optimizing workflow',
                'Troubleshooting common issues',
            ],
        },
    ]

    return (
        <>
            <SectionHead 
                eyebrow={t.hero.docs.eyebrow}
                title="Trung tâm hỗ trợ"
                subtitle={t.hero.docs.subtitle}
            />

            <section className="docs" style={{ paddingBottom: '100px' }}>
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
                                        const isInstall = item.includes('Cài đặt') || item.includes('Install');
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
                                    <li><button className="footer-link-btn" onClick={() => setTab('features')}>{t.nav.features}</button></li>
                                    <li><button className="footer-link-btn" onClick={() => setTab('pricing')}>{t.nav.pricing}</button></li>
                                    <li><a href={DOWNLOAD_URL}>{t.hero.cta.download}</a></li>
                                    <li><a href="#">{t.nav.docs}</a></li>
                                </ul>
                            </div>
                            <div className="footer-col">
                                <h4>{t.footer.resources}</h4>
                                <ul>
                                    <li><button className="footer-link-btn" onClick={() => setTab('docs')}>{t.nav.docs}</button></li>
                                    <li><button className="footer-link-btn" onClick={() => setTab('faq')}>{t.nav.faq}</button></li>
                                    <li><a href="#">Blog</a></li>
                                    <li><a href="#">{lang === 'vi' ? 'Hỗ trợ' : 'Support'}</a></li>
                                </ul>
                            </div>
                            <div className="footer-col">
                                <h4>{t.footer.company}</h4>
                                <ul>
                                    <li><a href="#">{lang === 'vi' ? 'Về chúng tôi' : 'About us'}</a></li>
                                    <li><a href="#">{lang === 'vi' ? 'Liên hệ' : 'Contact'}</a></li>
                                    <li><a href="#">{lang === 'vi' ? 'Điều khoản' : 'Terms'}</a></li>
                                    <li><a href="#">{lang === 'vi' ? 'Bảo mật' : 'Privacy'}</a></li>
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

