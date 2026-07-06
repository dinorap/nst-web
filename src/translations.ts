export interface Plan {
    id: string;
    name: string;
    desc: string;
    monthly: number;
    yearly: number;
    cta: string;
    ctaStyle: 'primary' | 'outline';
    featured?: boolean;
    users?: number;
    profilesPerDay?: number;
    overageMonthly?: number;
    overageYearly?: number;
    features: string[];
}

export interface Translations {
    vi: {
        nav: Record<string, string>;
        hero: Record<string, unknown>;
        pricing: Record<string, unknown>;
        cta: Record<string, string>;
        footer: Record<string, string>;
        docs: Record<string, unknown>;
        testimonials: Record<string, string>;
        useCases: Record<string, unknown>;
        featureBlocks: unknown[];
        security: Record<string, unknown>;
        faq: Record<string, string>;
        plans: Record<string, Plan>;
        comparison: { groups: Array<{ group: string; rows: Array<{ label: string; values: Array<string | boolean> }> }> };
        faqs: Array<{ q: string; a: string }>;
    };
    en: {
        nav: Record<string, string>;
        hero: Record<string, unknown>;
        pricing: Record<string, unknown>;
        cta: Record<string, string>;
        footer: Record<string, string>;
        docs: Record<string, unknown>;
        testimonials: Record<string, string>;
        useCases: Record<string, unknown>;
        featureBlocks: unknown[];
        security: Record<string, unknown>;
        faq: Record<string, string>;
        plans: Record<string, Plan>;
        comparison: { groups: Array<{ group: string; rows: Array<{ label: string; values: Array<string | boolean> }> }> };
        faqs: Array<{ q: string; a: string }>;
    };
}

export const translations: Translations = {
    vi: {
        nav: {
            features: 'Tính năng',
            useCases: 'Sử dụng',
            pricing: 'Giá cả',
            faq: 'FAQ',
            docs: 'Tài liệu',
            login: 'Đăng nhập',
            register: 'Đăng ký',
        },
        hero: {
            features: {
                eyebrow: 'Công nghệ Antidetect hàng đầu',
                title: 'Trình duyệt chống phát hiện tối ưu cho hiệu suất',
                subtitle: 'FastST cung cấp bộ công cụ mạnh mẽ nhất để quản lý vân tay trình duyệt và tự động hóa quy trình làm việc của bạn.',
            },
            useCases: {
                eyebrow: 'Đa dạng mục đích sử dụng',
                title: 'Giải pháp cho mọi nhu cầu kiếm tiền',
                subtitle: 'FastST phục vụ đa dạng lĩnh vực — từ cá nhân đến doanh nghiệp, từ Affiliate đến E-commerce.',
            },
            pricing: {
                eyebrow: 'Giá cả minh bạch — tiết kiệm khi thanh toán năm',
                title: 'Gói cước phù hợp với mọi quy mô',
                subtitle: 'Chọn gói phù hợp để tối ưu hóa chi phí cho cá nhân hoặc đội ngũ của bạn.',
            },
            faq: {
                eyebrow: 'Câu hỏi thường gặp',
                title: 'Giải đáp thắc mắc về FastST',
                subtitle: 'Tìm câu trả lời cho những câu hỏi phổ biến nhất về gói cước, tính năng và cách sử dụng.',
            },
            docs: {
                eyebrow: 'Trung tâm hỗ trợ',
                title: 'Tài liệu hướng dẫn chi tiết & đầy đủ',
                subtitle: 'Mọi thứ bạn cần biết để làm chủ FastST và tối ưu hóa hiệu suất công việc.',
            },
            cta: {
                register: 'Đăng ký miễn phí',
                download: 'Tải xuống',
            }
        },
        pricing: {
            monthly: 'Hàng tháng',
            yearly: 'Hàng năm',
            save: 'Tiết kiệm 25%',
            perMonth: '/tháng',
            perYear: '/năm',
            billedMonthly: 'Thanh toán hàng tháng',
            billedYearly: (price: string) => `Thanh toán ${price}/năm`,
            freeAlways: 'Miễn phí vĩnh viễn',
            popular: 'Phổ biến nhất',
            compare: 'So sánh chi tiết',
            compareSubtitle: 'Xem bảng so sánh để biết sự khác biệt giữa các gói',
            features: 'Tính năng',
            planUsers: 'Người dùng',
            planProfiles: 'Profile/ngày',
            overage: 'Vượt mức {price}/1 profile',
        },
        cta: {
            title: 'Bắt đầu hành trình của bạn ngay hôm nay',
            subtitle: 'Đăng ký và nhận 10 hồ sơ trình duyệt miễn phí — trải nghiệm đầy đủ sức mạnh của FastST.',
            btn: 'Đăng ký miễn phí',
            contact: 'Liên hệ bán hàng',
        },
        footer: {
            desc: 'Trình duyệt chống phát hiện hàng đầu cho quản lý nhiều hồ sơ và làm việc nhóm.',
            product: 'Sản phẩm',
            resources: 'Tài nguyên',
            company: 'Công ty',
            rights: '© 2026 ONX LLC - Opportunity Next Expansion. All rights reserved.',
            address: 'Địa chỉ: 1250 Innovation Avenue, Suite 408, Westbridge, CA 90210, United States',
            blog: 'Blog',
            support: 'Hỗ trợ',
            about: 'Về chúng tôi',
            contact: 'Liên hệ',
            terms: 'Điều khoản',
            privacy: 'Bảo mật',
        },
        docs: {
            title: 'Trung tâm hỗ trợ',
            getStarted: 'Bắt đầu',
            advanced: 'Tính năng nâng cao',
            video: 'Hướng dẫn video',
            getStartedItems: {
                install: 'Cài đặt FastST',
                firstProfile: 'Tạo hồ sơ đầu tiên',
                proxies: 'Quản lý proxy',
                fingerprints: 'Sử dụng dấu vân tay',
            },
            advancedItems: {
                automation: 'Tự động hóa & API',
                teamwork: 'Làm việc nhóm',
                sync: 'Đồng bộ hóa dữ liệu',
                extensions: 'Quản lý extension',
            },
            videoItems: {
                beginners: 'Video hướng dẫn cho người mới',
                workflow: 'Tối ưu hóa quy trình làm việc',
                troubleshooting: 'Khắc phục sự cố thường gặp',
            },
        },
        testimonials: {
            title: 'Khách hàng nói gì về chúng tôi',
            subtitle: 'Hàng trăm nghìn chuyên gia tin dùng mỗi ngày trên toàn thế giới',
        },
        useCases: {
            title: 'Ứng dụng đa dạng',
            items: [
                {
                    title: 'Thương mại điện tử',
                    desc: 'Quản lý hàng chục tài khoản Amazon, eBay, Shopee mà không lo bị liên kết hay khóa tài khoản.',
                    gridSpan: 4,
                },
                {
                    title: 'Tiếp thị liên kết',
                    desc: 'Tạo hàng loạt profile sạch để chạy quảng cáo Facebook, Google Ads, TikTok Ads hiệu quả cao. Nuôi tài khoản, cài đặt và khởi chạy dễ dàng với trình duyệt hàng đầu.',
                    gridSpan: 8,
                },
                {
                    title: 'Thử nghiệm & QA',
                    desc: 'Kiểm tra giao diện web trên nhiều cấu hình dấu vân tay khác nhau một cách nhanh chóng và chính xác nhất.',
                    gridSpan: 7,
                },
                {
                    title: 'Quản lý đội ngũ',
                    desc: 'Phân quyền linh hoạt cho thành viên, chia sẻ profile an toàn và đồng bộ hóa tức thì.',
                    gridSpan: 5,
                },
            ],
        },
        featureBlocks: [
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
        ],
        security: {
            title: 'Nhanh chóng, yên tâm, an toàn',
            subtitle: 'Đúng như bạn mong đợi từ một trình duyệt antidetect chuyên nghiệp',
            items: [
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
            ],
        },
        faq: {
            title: 'Câu hỏi thường gặp',
        },
        plans: {
            free: {
                id: 'free',
                name: 'Free',
                desc: 'Miễn phí',
                monthly: 0,
                yearly: 0,
                cta: 'Bắt đầu miễn phí',
                ctaStyle: 'outline',
                users: 1,
                profilesPerDay: 10,
                overageMonthly: 0.02,
                overageYearly: 0.01,
                features: [
                    '10 profile/ngày',
                    'Quản lý proxy cơ bản',
                    '1 thành viên',
                    'Hỗ trợ qua email',
                ],
            },
            base: {
                id: 'base',
                name: 'Base',
                desc: 'Nhóm 50 user',
                monthly: 39.9,
                yearly: 358.8,
                cta: 'Chọn Base',
                ctaStyle: 'primary',
                featured: true,
                users: 50,
                profilesPerDay: 3000,
                overageMonthly: 0.02,
                overageYearly: 0.01,
                features: [
                    '50 người dùng',
                    '3.000 profile/ngày',
                    'Quản lý proxy nâng cao',
                    'Thao tác hàng loạt',
                    'Tự động hóa & API',
                    'Tạo kịch bản dạng khối',
                    'Hỗ trợ ưu tiên 24/7',
                ],
            },
            team: {
                id: 'team',
                name: 'Team',
                desc: 'Nhóm 150 user',
                monthly: 79.9,
                yearly: 838.8,
                cta: 'Chọn Team',
                ctaStyle: 'outline',
                users: 150,
                profilesPerDay: 60000,
                overageMonthly: 0.02,
                overageYearly: 0.01,
                features: [
                    '150 người dùng',
                    '60.000 profile/ngày',
                    'Quản lý proxy nâng cao',
                    'Thao tác hàng loạt',
                    'Tự động hóa & API',
                    'Tạo kịch bản dạng khối',
                    'Tích hợp bên thứ ba',
                    'Hỗ trợ ưu tiên 24/7',
                ],
            },
        },
        comparison: {
            groups: [
                {
                    group: 'Quản lý hồ sơ',
                    rows: [
                        { label: 'Số hồ sơ trình duyệt', values: ['50', '50.000', '500.000'] },
                        { label: 'Số hồ sơ tiêu chuẩn/ngày', values: ['10/ngày', '3.000/ngày', '60.000/ngày'] },
                        { label: 'Hồ sơ di động', values: [false, true, true] },
                        { label: 'Sao chép hồ sơ', values: [false, true, true] },
                    ],
                },
                {
                    group: 'Quản lý proxy',
                    rows: [
                        { label: 'Proxy tích hợp', values: [true, true, true] },
                        { label: 'Kiểm tra proxy tự động', values: [false, true, true] },
                    ],
                },
                {
                    group: 'Làm việc nhóm',
                    rows: [
                        { label: 'Số thành viên', values: ['1', '50', '150'] },
                        { label: 'Chia sẻ hồ sơ', values: [false, true, true] },
                        { label: 'Phân quyền vai trò', values: [false, true, true] },
                    ],
                },
                {
                    group: 'Tự động hóa & API',
                    rows: [
                        { label: 'Truy cập API', values: [false, true, true] },
                        { label: 'Tạo kịch bản dạng khối', values: [false, true, true] },
                        { label: 'Tích hợp bên thứ ba', values: [false, true, true] },
                    ],
                },
                {
                    group: 'Hỗ trợ',
                    rows: [
                        { label: 'Hỗ trợ email', values: [true, true, true] },
                        { label: 'Hỗ trợ ưu tiên', values: [false, true, true] },
                        { label: 'Quản lý tài khoản chuyên trách', values: [false, false, true] },
                    ],
                },
            ],
        },
        faqs: [
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
        ],
    },
    en: {
        nav: {
            features: 'Features',
            useCases: 'Use Cases',
            pricing: 'Pricing',
            faq: 'FAQ',
            docs: 'Documentation',
            login: 'Login',
            register: 'Sign up',
        },
        hero: {
            features: {
                eyebrow: 'Leading Antidetect Technology',
                title: 'Antidetect browser optimized for performance',
                subtitle: 'FastST provides the most powerful toolkit for managing browser fingerprints and automating your workflow.',
            },
            useCases: {
                eyebrow: 'Diverse use cases',
                title: 'Solutions for every monetization need',
                subtitle: 'FastST serves various fields — from individuals to businesses, from Affiliate to E-commerce.',
            },
            pricing: {
                eyebrow: 'Transparent pricing — save with annual billing',
                title: 'Plans suitable for all sizes',
                subtitle: 'Choose the right plan to optimize costs for individuals or your team.',
            },
            faq: {
                eyebrow: 'Frequently Asked Questions',
                title: 'Answering questions about FastST',
                subtitle: 'Find answers to the most common questions about plans, features, and usage.',
            },
            docs: {
                eyebrow: 'Help Center',
                title: 'Detailed & complete documentation',
                subtitle: 'Everything you need to know to master FastST and optimize work performance.',
            },
            cta: {
                register: 'Sign up for free',
                download: 'Download',
            }
        },
        pricing: {
            monthly: 'Monthly',
            yearly: 'Yearly',
            save: 'Save 25%',
            perMonth: '/mo',
            perYear: '/yr',
            billedMonthly: 'Billed monthly',
            billedYearly: (price: string) => `Billed ${price}/year`,
            freeAlways: 'Free forever',
            popular: 'Most popular',
            compare: 'Detailed comparison',
            compareSubtitle: 'See the comparison table to know the difference between plans',
            features: 'Features',
            planUsers: 'Users',
            planProfiles: 'Profiles/day',
            overage: 'Overage {price}/1 profile',
        },
        cta: {
            title: 'Start your journey today',
            subtitle: 'Sign up and get 10 free browser profiles — experience the full power of FastST.',
            btn: 'Sign up for free',
            contact: 'Contact sales',
        },
        footer: {
            desc: 'Leading antidetect browser for multi-profile management and teamwork.',
            product: 'Product',
            resources: 'Resources',
            company: 'Company',
            rights: '© 2026 ONX LLC - Opportunity Next Expansion. All rights reserved.',
            address: 'Address: 1250 Innovation Avenue, Suite 408, Westbridge, CA 90210, United States',
            blog: 'Blog',
            support: 'Support',
            about: 'About us',
            contact: 'Contact',
            terms: 'Terms',
            privacy: 'Privacy',
        },
        docs: {
            title: 'Help Center',
            getStarted: 'Get Started',
            advanced: 'Advanced Features',
            video: 'Video Tutorials',
            getStartedItems: {
                install: 'Installing FastST',
                firstProfile: 'Creating your first profile',
                proxies: 'Managing proxies',
                fingerprints: 'Using fingerprints',
            },
            advancedItems: {
                automation: 'Automation & API',
                teamwork: 'Teamwork',
                sync: 'Data synchronization',
                extensions: 'Extension management',
            },
            videoItems: {
                beginners: 'Tutorial for beginners',
                workflow: 'Optimizing workflow',
                troubleshooting: 'Troubleshooting common issues',
            },
        },
        testimonials: {
            title: 'What our customers say',
            subtitle: 'Hundreds of thousands of professionals trust us every day worldwide',
        },
        useCases: {
            title: 'Versatile use cases',
            items: [
                {
                    title: 'E-commerce',
                    desc: 'Manage dozens of Amazon, eBay, and Shopee accounts without worrying about being linked or banned.',
                    gridSpan: 4,
                },
                {
                    title: 'Affiliate Marketing',
                    desc: 'Create bulk clean profiles to run Facebook, Google Ads, and TikTok Ads with high efficiency. Easy account farming, setup, and launch with a leading antidetect browser.',
                    gridSpan: 8,
                },
                {
                    title: 'Testing & QA',
                    desc: 'Test web interfaces across many different fingerprint configurations quickly and accurately.',
                    gridSpan: 7,
                },
                {
                    title: 'Team Management',
                    desc: 'Flexible permissions for members, secure profile sharing, and instant synchronization.',
                    gridSpan: 5,
                },
            ],
        },
        featureBlocks: [
            {
                eyebrow: 'Profile Management',
                title: 'Use synchronization to repeat your operations',
                desc: 'Group by niche, status, or any other criteria. Use layouts, icons, and color indicators to quickly find accounts in the browser.',
                points: [
                    {
                        title: 'Manage profile groups instantly through bulk tasks',
                        desc: 'Multi-threaded tasks: run scripts, export cookies, tag, share with colleagues, add proxies, sync...',
                    },
                    {
                        title: 'Update fingerprints for multiple profiles at once',
                        desc: 'No more manual, one-by-one updates! Select any profiles you want — even all of them — and update everything at once!',
                    },
                    {
                        title: 'Easily log in and switch between multiple accounts',
                        desc: 'Switch quickly between multiple accounts to make your workflow even faster!',
                    },
                ],
            },
            {
                eyebrow: 'Fingerprint',
                title: 'Use and customize real fingerprints',
                desc: 'When creating quick profiles, we will use real fingerprints. So you don\'t need to spend too much time setting up the profile again before launching.',
                points: [
                    {
                        title: 'Customize 20 fingerprint parameters',
                        desc: 'FastST can control 20 parameters and generate unique fingerprints for any operating system, including iOS and Android.',
                    },
                    {
                        title: 'Change device name',
                        desc: 'Systems, browsers, and websites will see a valid and reasonable name, without default or suspiciously matching values.',
                    },
                    {
                        title: 'Spoof WebGL, WebGPU, ClientHints, and Voices',
                        desc: 'We have taken spoofing to a whole new level, also adding the ability to hide any antidetect element in the visual display during verification.',
                    },
                ],
            },
            {
                eyebrow: 'Teamwork',
                title: 'Transfer and share browser profiles in your team',
                desc: 'No more worries when transferring data between users! Set up flexible permissions for each member and folder.',
                points: [
                    {
                        title: 'Share profiles, proxies, and cookies in your team',
                        desc: 'Transfer data between users quickly and securely.',
                    },
                    {
                        title: 'Grant access to each profile or entire folders',
                        desc: 'Set permissions to create, edit, delete, copy, and transfer profiles. Profiles in folders inherit permissions.',
                    },
                    {
                        title: 'Set profile quantity limits',
                        desc: 'Limit the number of profiles used by additional users and arrange tags in folders for each type of website.',
                    },
                ],
            },
            {
                eyebrow: 'Automation',
                title: 'Automate the browser for various scenarios',
                desc: 'Support account farming, data collection, or anything you want — double the speed and convenience. Supports Windows, Linux, and macOS.',
                points: [
                    {
                        title: 'Block-style scripting',
                        desc: 'Build automation workflows without programming — just drag and drop action blocks.',
                    },
                    {
                        title: 'Flexible API',
                        desc: 'Automate accounts and profile operations through our API.',
                    },
                    {
                        title: 'Transfer profiles to FastST{cloud}',
                        desc: 'Transfer profiles to FastST{cloud} with just a few clicks — runs in the background, no extension required.',
                    },
                ],
            },
        ],
        security: {
            title: 'Fast, secure, reliable',
            subtitle: 'Exactly what you expect from a professional antidetect browser',
            items: [
                {
                    title: 'Cloud synchronization',
                    desc: 'Store profiles, cookies, proxies, and extensions. Work on any Windows, Mac, or Linux device anytime, anywhere.',
                },
                {
                    title: 'Flexible API automation',
                    desc: 'Automate accounts and profile operations with our API.',
                },
                {
                    title: 'Your data is protected',
                    desc: 'Your information is always kept secure. Only you can access your own information.',
                },
                {
                    title: 'Local profile synchronization',
                    desc: 'Option to disable cloud sync and store profiles locally on your device.',
                },
            ],
        },
        faq: {
            title: 'Frequently Asked Questions',
        },
            plans: {
                free: {
                    id: 'free',
                    name: 'Free',
                    desc: 'For new users',
                    monthly: 0,
                    yearly: 0,
                    cta: 'Start for free',
                    ctaStyle: 'outline',
                    users: 1,
                    profilesPerDay: 10,
                    overageMonthly: 0.02,
                    overageYearly: 0.01,
                    features: [
                        '10 profiles/day',
                        'Basic proxy management',
                        '1 team member',
                        'Email support',
                    ],
                },
                base: {
                    id: 'base',
                    name: 'Base',
                    desc: '50 users',
                    monthly: 39.9,
                    yearly: 358.8,
                    cta: 'Choose Base',
                    ctaStyle: 'primary',
                    featured: true,
                    users: 50,
                    profilesPerDay: 3000,
                    overageMonthly: 0.02,
                    overageYearly: 0.01,
                    features: [
                        '50 users',
                        '3,000 profiles/day',
                        'Advanced proxy management',
                        'Bulk operations',
                        'Automation & API',
                        'Block-style scripting',
                        'Priority support 24/7',
                    ],
                },
                team: {
                    id: 'team',
                    name: 'Team',
                    desc: '150 users',
                    monthly: 79.9,
                    yearly: 838.8,
                    cta: 'Choose Team',
                    ctaStyle: 'outline',
                    users: 150,
                    profilesPerDay: 60000,
                    overageMonthly: 0.02,
                    overageYearly: 0.01,
                    features: [
                        '150 users',
                        '60,000 profiles/day',
                        'Advanced proxy management',
                        'Bulk operations',
                        'Automation & API',
                        'Block-style scripting',
                        'Third-party integrations',
                        'Priority support 24/7',
                    ],
                },
            },
        comparison: {
            groups: [
                {
                    group: 'Profile Management',
                    rows: [
                        { label: 'Number of browser profiles', values: ['50', '50,000', '500,000'] },
                        { label: 'Number of standard profiles/day', values: ['10/day', '3,000/day', '60,000/day'] },
                        { label: 'Mobile profiles', values: [false, true, true] },
                        { label: 'Profile copying', values: [false, true, true] },
                    ],
                },
                {
                    group: 'Proxy Management',
                    rows: [
                        { label: 'Built-in proxies', values: [true, true, true] },
                        { label: 'Automatic proxy checking', values: [false, true, true] },
                    ],
                },
                {
                    group: 'Teamwork',
                    rows: [
                        { label: 'Number of members', values: ['1', '50', '150'] },
                        { label: 'Profile sharing', values: [false, true, true] },
                        { label: 'Role-based permissions', values: [false, true, true] },
                    ],
                },
                {
                    group: 'Automation & API',
                    rows: [
                        { label: 'API access', values: [false, true, true] },
                        { label: 'Block-style scripting', values: [false, true, true] },
                        { label: 'Third-party integrations', values: [false, true, true] },
                    ],
                },
                {
                    group: 'Support',
                    rows: [
                        { label: 'Email support', values: [true, true, true] },
                        { label: 'Priority support', values: [false, true, true] },
                        { label: 'Dedicated account management', values: [false, false, true] },
                    ],
                },
            ],
        },
        faqs: [
            {
                q: 'Can I change my plan at any time?',
                a: 'Yes. You can upgrade or downgrade your plan at any time. When upgrading, we will prorate the remaining time in your current billing period.',
            },
            {
                q: 'Is there a free trial?',
                a: 'Yes. The Free plan lets you create 10 browser profiles forever, with no credit card required. You can also try premium features for 7 days.',
            },
            {
                q: 'What payment methods are accepted?',
                a: 'We accept credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for Enterprise plans.',
            },
            {
                q: 'What is the refund policy?',
                a: 'We offer a 14-day refund policy for all paid plans. If you are not satisfied, contact us for a full refund.',
            },
            {
                q: 'Do I get a discount for annual billing?',
                a: 'Yes. Annual billing saves you about 17% compared to monthly billing for all paid plans.',
            },
        ],
    }
};
