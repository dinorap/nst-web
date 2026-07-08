export interface ApiDocEndpoint {
    method: 'GET' | 'POST' | 'DELETE' | 'PATCH';
    path: string;
    description: {
        vi: string;
        en: string;
    };
    headers?: Array<{ name: string; required: boolean; desc: { vi: string; en: string } }>;
    pathParams?: Array<{ name: string; required: boolean; type: string; desc: { vi: string; en: string } }>;
    queryParams?: Array<{ name: string; required: boolean; type: string; default?: string; desc: { vi: string; en: string } }>;
    bodyParams?: Array<{ name: string; required: boolean; type: string; desc: { vi: string; en: string } }>;
    codeExamples: {
        curl: string;
        javascript: string;
        python: string;
    };
    responseExample: string;
}

export interface ApiDocSection {
    id: string;
    title: {
        vi: string;
        en: string;
    };
    introduction?: {
        vi: string;
        en: string;
    };
    endpoints?: ApiDocEndpoint[];
}

export const API_DOCS_SECTIONS: ApiDocSection[] = [
    {
        id: 'binding-lifecycle',
        title: {
            vi: 'Kết nối & Vòng đời',
            en: 'Binding & Lifecycle'
        },
        introduction: {
            vi: `Server chạy cục bộ bên trong ứng dụng FastST Launcher, chỉ lắng nghe trên địa chỉ loopback \`127.0.0.1\`.
            
Cổng mặc định là \`40325\`, có thể tùy chỉnh trong 'Cài đặt → Automation API' của FastST Launcher. Cổng này không thể truy cập được từ các máy chủ khác hoặc mạng internet vì lý do bảo mật. Mọi thay đổi về cài đặt cổng chỉ có hiệu lực sau khi khởi động lại ứng dụng.`,
            en: `The server runs locally inside the FastST Launcher application, bound to the loopback address \`127.0.0.1\` only.

The default port is \`40325\`, which can be customized in 'Settings → Automation API'. It is not reachable from other hosts on the network for security reasons. Enabling or changing the port takes effect only after restarting the app.`
        }
    },
    {
        id: 'authentication',
        title: {
            vi: 'Xác thực',
            en: 'Authentication'
        },
        introduction: {
            vi: `Tất cả các API endpoint (ngoại trừ \`GET /health\`) đều yêu cầu xác thực bằng mã Bearer JWT ký thuật toán HS256 sử dụng khóa bí mật của Launcher.
            
Bạn cần đính kèm header sau vào mỗi request:
\`\`\`http
Authorization: Bearer <mã_token_xác_thực>
\`\`\`
Mã token vĩnh viễn này được hiển thị trong mục 'Cài đặt → Automation API' trong ứng dụng. Nhấp vào nút 'Tạo lại token (Regenerate token)' để xoay vòng khóa ký trực tiếp — mã token mới sẽ có hiệu lực ngay lập tức và toàn bộ các mã token được tạo trước đó sẽ bị vô hiệu hóa cùng một lúc. Không có cơ chế đăng nhập hay API cấp token riêng; chính mã token này là thông tin xác thực. Nếu thiếu hoặc token không hợp lệ, API sẽ trả về lỗi \`401 Unauthorized\` với phản hồi trống.`,
            en: `Every API endpoint (except \`GET /health\`) requires authentication using a Bearer JWT (HS256) signed with the launcher's stored secret.

You must include the following header in every request:
\`\`\`http
Authorization: Bearer <your_bearer_token>
\`\`\`
The permanent token is displayed under 'Settings → Automation API'. Pressing 'Regenerate token' rotates the signing secret live — the new token works immediately, and all previously issued tokens are invalidated at once. There is no separate login or token-minting endpoint; the token itself is the credential. Missing or invalid tokens result in a \`401 Unauthorized\` response with an empty body.`
        }
    },
    {
        id: 'typical-flow',
        title: {
            vi: 'Quy trình Chuẩn',
            en: 'Typical Flow'
        },
        introduction: {
            vi: `Để xây dựng kịch bản tự động hóa hoàn chỉnh với FastST Launcher, hãy tuân theo quy trình chuẩn sau:

1. Khởi tạo Vân tay sạch (Fingerprint): Gọi \`GET /fingerprint/new/{platform}\` để lấy cấu hình dấu vân tay hoàn toàn ngẫu nhiên và duy nhất (được tối ưu hóa tự động theo tài nguyên phần cứng thực tế của máy chủ).
2. Lưu hồ sơ (Create Profile): Gọi \`POST /profiles\` (hoặc \`POST /folders/{folder}/profiles\`) đính kèm đối tượng vân tay nhận được ở bước 1 để tạo hồ sơ lưu trữ lâu dài.
3. Khởi chạy hồ sơ (Launch Browser): Gọi \`POST /profiles/{id}/start\` để kích hoạt trình duyệt và nhận cổng điều khiển CDP (\`Chrome DevTools Protocol\`).
4. Kết nối Tự động hóa: Sử dụng thư viện Puppeteer hoặc Playwright để kết nối tới WebSocket debugger URL (\`cdp.web_socket_debugger_url\`) của trình duyệt để điều khiển chuột, bàn phím, tải trang, điền biểu mẫu.
5. Đóng trình duyệt (Stop Session): Gọi \`POST /profiles/{id}/stop\` để giải phóng tài nguyên. Đối với hồ sơ tạm thời (Temporary Profiles), toàn bộ thư mục dữ liệu người dùng (\`user-data-dir\`) sẽ được tự động dọn dẹp sạch sẽ khỏi ổ cứng.`,
            en: `To build an automation workflow with FastST Launcher, follow this typical flow:

1. Generate a Unique Fingerprint: Call \`GET /fingerprint/new/{platform}\` to get a fully uniquified fingerprint configuration (randomized but realistic, respecting the host's actual CPU, RAM, and screen limits).
2. Persist the Profile: Call \`POST /profiles\` (or \`POST /folders/{folder}/profiles\`) passing the fingerprint object verbatim to save the browser profile.
3. Start the Profile: Call \`POST /profiles/{id}/start\`. The launcher spawns the browser and returns a \`Chrome DevTools Protocol\` (CDP) endpoint.
4. Connect Automation Client: Connect Puppeteer, Playwright, or Selenium using the returned \`cdp.web_socket_debugger_url\`.
5. Stop the Profile: Call \`POST /profiles/{id}/stop\` when done. For temporary profiles, configuration and user data directories are automatically deleted.`
        }
    },
    {
        id: 'proxies-quic-webrtc',
        title: {
            vi: 'Proxy & QUIC/WebRTC',
            en: 'Proxies & QUIC/WebRTC'
        },
        introduction: {
            vi: `Mỗi lần khởi chạy một hồ sơ trình duyệt (qua UI hoặc API), hệ thống sẽ tiến hành kiểm tra kết nối trực tiếp của proxy được gán trước khi khởi động tiến trình Chromium:
            
- Kiểm tra UDP-Relay: Thử nghiệm kết nối SOCKS5 \`UDP_ASSOCIATE\`.
- Bật/Tắt QUIC & WebRTC: Nếu proxy hỗ trợ truyền tải dữ liệu qua giao thức UDP thành công, giao thức QUIC sẽ được bật và WebRTC sẽ được định cấu hình sử dụng proxy UDP relay để tối ưu hóa tốc độ. Ngược lại, nếu UDP bị chặn, QUIC sẽ tự động tắt và WebRTC sẽ bị ép buộc giới hạn chạy qua TCP-only để tránh việc rò rỉ địa chỉ IP thật của máy chủ.
- Tự động cấu hình Múi giờ/Ngôn ngữ/Địa điểm: Các trường dữ liệu tự động này sẽ được giải quyết trực tiếp thông qua việc định tuyến kiểm tra IP của proxy tại thời điểm khởi chạy.`,
            en: `On every launch (UI or API), before the browser process starts, the bound proxy is probed live:

- UDP-Relay Check: The proxy is probed for UDP-relay support (SOCKS5 \`UDP_ASSOCIATE\`).
- Gating QUIC & WebRTC: If UDP works, QUIC is enabled and WebRTC may use the proxied UDP relay. Otherwise, QUIC is disabled and WebRTC is clamped to TCP-only, ensuring your real IP address never leaks.
- Auto Fields Resolution: Timezone, locale, and geographic coordinates auto fields are resolved live through the proxy at launch time.`
        }
    },
    {
        id: 'system',
        title: {
            vi: 'Hệ thống (System)',
            en: 'System'
        },
        endpoints: [
            {
                method: 'GET',
                path: '/health',
                description: {
                    vi: 'Kiểm tra trạng thái hoạt động của server (Liveness probe). Đây là endpoint duy nhất KHÔNG yêu cầu Bearer token.',
                    en: 'Liveness probe. Returns basic server status and information. The only endpoint that does not require authorization.'
                },
                codeExamples: {
                    curl: `curl -X GET "http://127.0.0.1:40325/health"`,
                    javascript: `fetch('http://127.0.0.1:40325/health')\n  .then(res => res.json())\n  .then(data => console.log(data));`,
                    python: `import requests\n\nresp = requests.get("http://127.0.0.1:40325/health")\nprint(resp.json())`
                },
                responseExample: `{
  "ok": true,
  "name": "fastst-launcher",
  "version": "0.1.0"
}`
            }
        ]
    },
    {
        id: 'fingerprints',
        title: {
            vi: 'Dấu vân tay (Fingerprints)',
            en: 'Fingerprints'
        },
        endpoints: [
            {
                method: 'GET',
                path: '/fingerprint/new',
                description: {
                    vi: 'Tạo một cấu hình dấu vân tay mới khớp với hệ điều hành của máy chủ chạy Launcher (không lưu vào cơ sở dữ liệu).',
                    en: 'Generates a new, fully unique fingerprint matching the host operating system, without saving it.'
                },
                headers: [
                    { name: 'Authorization', required: true, desc: { vi: 'Bearer <token> lấy từ phần Cài đặt API', en: 'Bearer <token> copied from API Settings' } }
                ],
                codeExamples: {
                    curl: `curl -X GET "http://127.0.0.1:40325/fingerprint/new" \\\n  -H "Authorization: Bearer YOUR_SECRET_TOKEN"`,
                    javascript: `fetch('http://127.0.0.1:40325/fingerprint/new', {\n  headers: {\n    'Authorization': 'Bearer YOUR_SECRET_TOKEN'\n  }\n})\n.then(res => res.json())\n.then(data => console.log(data));`,
                    python: `import requests\n\nheaders = {"Authorization": "Bearer YOUR_SECRET_TOKEN"}\nresp = requests.get("http://127.0.0.1:40325/fingerprint/new", headers=headers)\nprint(resp.json())`
                },
                responseExample: `{
  "fingerprint": {
    "name": "Windows Profile",
    "seed": 2049281,
    "navigator": {
      "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "platform": "Win32",
      "hardware_concurrency": 16,
      "device_memory": 16,
      "language": "en-US",
      "do_not_track": true
    },
    "screen": {
      "width": 1920,
      "height": 1080,
      "avail_width": 1920,
      "avail_height": 1040,
      "color_depth": 24,
      "device_pixel_ratio": 1
    },
    "webgl": {
      "unmasked_vendor": "Google Inc. (NVIDIA)",
      "unmasked_renderer": "ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0, D3D11)"
    },
    "webrtc": "auto",
    "noise": {
      "canvas": { "enabled": true, "seed": 4212 },
      "webgl": { "intensity": 1, "enabled": true, "seed": 9182 },
      "audio": { "intensity": 1, "enabled": true, "seed": 3312 }
    },
    "timezone": "auto"
  }
}`
            },
            {
                method: 'GET',
                path: '/fingerprint/new/{platform}',
                description: {
                    vi: 'Tạo cấu hình dấu vân tay ngẫu nhiên khớp với hệ điều hành cụ thể được yêu cầu (win, osx, linux).',
                    en: 'Generates a new, fully unique fingerprint matching the specified operating system (win, osx, or linux).'
                },
                headers: [
                    { name: 'Authorization', required: true, desc: { vi: 'Bearer <token> lấy từ phần Cài đặt API', en: 'Bearer <token> copied from API Settings' } }
                ],
                pathParams: [
                    { name: 'platform', required: true, type: 'string', desc: { vi: 'Hệ điều hành cần tạo (Windows, macOS, Linux). Chấp nhận viết thường hoặc alias (win, osx, darwin).', en: 'Target OS platform (Windows, macOS, Linux). Case-insensitive; win/osx/darwin aliases accepted.' } }
                ],
                codeExamples: {
                    curl: `curl -X GET "http://127.0.0.1:40325/fingerprint/new/macos" \\\n  -H "Authorization: Bearer YOUR_SECRET_TOKEN"`,
                    javascript: `fetch('http://127.0.0.1:40325/fingerprint/new/macos', {\n  headers: {\n    'Authorization': 'Bearer YOUR_SECRET_TOKEN'\n  }\n})\n.then(res => res.json())\n.then(data => console.log(data));`,
                    python: `import requests\n\nheaders = {"Authorization": "Bearer YOUR_SECRET_TOKEN"}\nresp = requests.get("http://127.0.0.1:40325/fingerprint/new/macos", headers=headers)\nprint(resp.json())`
                },
                responseExample: `{
  "fingerprint": {
    "name": "macOS Profile",
    "seed": 9812421,
    "navigator": {
      "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "platform": "MacIntel",
      "hardware_concurrency": 8,
      "device_memory": 8,
      "language": "en-US",
      "do_not_track": false
    },
    "screen": {
      "width": 1440,
      "height": 900,
      "avail_width": 1440,
      "avail_height": 850,
      "color_depth": 24,
      "device_pixel_ratio": 2
    },
    "webgl": {
      "unmasked_vendor": " Apple Inc.",
      "unmasked_renderer": "Apple M1"
    },
    "webrtc": "auto",
    "noise": {
      "canvas": { "enabled": true, "seed": 1109 },
      "webgl": { "intensity": 1, "enabled": true, "seed": 4567 }
    },
    "timezone": "auto"
  }
}`
            },
            {
                method: 'GET',
                path: '/fingerprints',
                description: {
                    vi: 'Liệt kê danh sách các dấu vân tay phần cứng (GPU presets) có sẵn trong cơ sở dữ liệu thư viện cục bộ của FastST.',
                    en: 'Retrieves the list of hardware fingerprint presets (GPU presets) available in the local library on disk.'
                },
                headers: [
                    { name: 'Authorization', required: true, desc: { vi: 'Bearer <token>', en: 'Bearer <token>' } }
                ],
                codeExamples: {
                    curl: `curl -X GET "http://127.0.0.1:40325/fingerprints" \\\n  -H "Authorization: Bearer YOUR_SECRET_TOKEN"`,
                    javascript: `fetch('http://127.0.0.1:40325/fingerprints', {\n  headers: {\n    'Authorization': 'Bearer YOUR_SECRET_TOKEN'\n  }\n})\n.then(res => res.json())\n.then(data => console.log(data));`,
                    python: `import requests\n\nheaders = {"Authorization": "Bearer YOUR_SECRET_TOKEN"}\nresp = requests.get("http://127.0.0.1:40325/fingerprints", headers=headers)\nprint(resp.json())`
                },
                responseExample: `[
  {
    "id": "gpu-preset-nv-3060",
    "label": "NVIDIA GeForce RTX 3060",
    "platform": "Windows",
    "chrome": "120.0.0.0",
    "gpu": "ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11)",
    "builtin": true
  }
]`
            }
        ]
    },
    {
        id: 'profiles',
        title: {
            vi: 'Hồ sơ trình duyệt (Profiles)',
            en: 'Browser Profiles'
        },
        endpoints: [
            {
                method: 'GET',
                path: '/profiles',
                description: {
                    vi: 'Lấy danh sách tất cả các hồ sơ trình duyệt hiện có (không bao gồm hồ sơ tạm thời). Kết quả trả về sắp xếp theo hồ sơ mới nhất và các hồ sơ được ghim lên đầu.',
                    en: 'Lists all persistent profiles (temporary ones are hidden), newest first, with pinned profiles on top. Includes live execution states.'
                },
                headers: [
                    { name: 'Authorization', required: true, desc: { vi: 'Bearer <token>', en: 'Bearer <token>' } }
                ],
                codeExamples: {
                    curl: `curl -X GET "http://127.0.0.1:40325/profiles" \\\n  -H "Authorization: Bearer YOUR_SECRET_TOKEN"`,
                    javascript: `fetch('http://127.0.0.1:40325/profiles', {\n  headers: {\n    'Authorization': 'Bearer YOUR_SECRET_TOKEN'\n  }\n})\n.then(res => res.json())\n.then(data => console.log(data));`,
                    python: `import requests\n\nheaders = {"Authorization": "Bearer YOUR_SECRET_TOKEN"}\nresp = requests.get("http://127.0.0.1:40325/profiles", headers=headers)\nprint(resp.json())`
                },
                responseExample: `[
  {
    "id": "7bc71ed8-6b34-40cf-8e05-af4fa74457ad",
    "name": "Facebook Account 01",
    "notes": "Chạy quảng cáo",
    "proxy_id": "proxy-us-01",
    "last_launched_at": "2026-07-07T10:15:30Z",
    "created_at": "2026-07-01T08:00:00Z",
    "pinned": true,
    "folder": "Advertising",
    "running": true,
    "pid": 12844,
    "cdp": {
      "port": 53217,
      "http_url": "http://127.0.0.1:53217",
      "web_socket_debugger_url": "ws://127.0.0.1:53217/devtools/browser/7bc7..."
    }
  }
]`
            },
            {
                method: 'POST',
                path: '/profiles',
                description: {
                    vi: 'Tạo và lưu trữ một hồ sơ trình duyệt mới với cấu hình dấu vân tay được chỉ định.',
                    en: 'Creates and stores a persistent browser profile using the provided fingerprint configuration exactly as given.'
                },
                headers: [
                    { name: 'Authorization', required: true, desc: { vi: 'Bearer <token>', en: 'Bearer <token>' } }
                ],
                bodyParams: [
                    { name: 'name', required: false, type: 'string', desc: { vi: 'Tên hồ sơ hiển thị trên giao diện', en: 'Display name of the profile' } },
                    { name: 'notes', required: false, type: 'string', desc: { vi: 'Ghi chú thêm', en: 'Extra description or notes' } },
                    { name: 'proxy_id', required: false, type: 'string', desc: { vi: 'ID của proxy đã có sẵn trong kho lưu trữ', en: 'ID of an existing proxy in the store' } },
                    { name: 'proxy', required: false, type: 'string', desc: { vi: 'Proxy chuỗi gắn trực tiếp (socks5://user:pass@host:port). Proxy này sẽ được tự động lưu vào kho và đo kiểm thử kết nối.', en: 'Proxy URI string. Stored, tested, and bound automatically.' } },
                    { name: 'folder', required: false, type: 'string', desc: { vi: 'Tên thư mục phân nhóm', en: 'Folder tag to categorize the profile' } },
                    { name: 'fingerprint', required: true, type: 'object', desc: { vi: 'Đối tượng cấu hình dấu vân tay hoàn chỉnh nhận từ API /fingerprint/new', en: 'Complete FingerprintConfig object returned from /fingerprint/new' } }
                ],
                codeExamples: {
                    curl: `curl -X POST "http://127.0.0.1:40325/profiles" \\\n  -H "Authorization: Bearer YOUR_SECRET_TOKEN" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "name": "Profile Target 01",\n    "folder": "Scrapers",\n    "fingerprint": { ... }\n  }'`,
                    javascript: `fetch('http://127.0.0.1:40325/profiles', {\n  method: 'POST',\n  headers: {\n    'Authorization': 'Bearer YOUR_SECRET_TOKEN',\n    'Content-Type': 'application/json'\n  },\n  body: JSON.stringify({\n    name: 'Profile Target 01',\n    folder: 'Scrapers',\n    fingerprint: { /* fingerprint object */ }\n  })\n})\n.then(res => res.json())\n.then(data => console.log(data));`,
                    python: `import requests\n\nheaders = {\n    "Authorization": "Bearer YOUR_SECRET_TOKEN",\n    "Content-Type": "application/json"\n}\npayload = {\n    "name": "Profile Target 01",\n    "folder": "Scrapers",\n    "fingerprint": { # ... }\n}\nresp = requests.post("http://127.0.0.1:40325/profiles", headers=headers, json=payload)\nprint(resp.json())`
                },
                responseExample: `{
  "id": "36fb16b5-0d11-496b-8d20-81d320c90401",
  "name": "Profile Target 01",
  "notes": "",
  "proxy_id": null,
  "last_launched_at": null,
  "created_at": "2026-07-07T16:15:00Z",
  "pinned": false,
  "folder": "Scrapers"
}`
            },
            {
                method: 'POST',
                path: '/profiles/temporary',
                description: {
                    vi: 'Tạo nhanh hồ sơ ẩn tạm thời: Tự động tải dấu vân tay ngẫu nhiên và tự động xóa bỏ hoàn toàn dữ liệu profile khi đóng trình duyệt.',
                    en: 'Creates a temporary profile that is hidden from list endpoints and automatically deleted from disk once its browser session is stopped.'
                },
                headers: [
                    { name: 'Authorization', required: true, desc: { vi: 'Bearer <token>', en: 'Bearer <token>' } }
                ],
                bodyParams: [
                    { name: 'fingerprint_id', required: false, type: 'string', desc: { vi: 'ID của GPU preset cần dùng. Bỏ trống để dùng ngẫu nhiên.', en: 'Library entry GPU preset ID. Random if omitted.' } },
                    { name: 'platform', required: false, type: 'string', desc: { vi: 'Hệ điều hành mong muốn nếu chọn ngẫu nhiên.', en: 'OS Platform to pick when fingerprint_id is omitted.' } },
                    { name: 'proxy', required: false, type: 'string', desc: { vi: 'Proxy gắn nhanh cho phiên chạy (không lưu vào kho lưu trữ).', en: 'Inline proxy string (temporary, not saved to proxy store).' } }
                ],
                codeExamples: {
                    curl: `curl -X POST "http://127.0.0.1:40325/profiles/temporary" \\\n  -H "Authorization: Bearer YOUR_SECRET_TOKEN" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "platform": "macOS",\n    "proxy": "socks5://127.0.0.1:1080"\n  }'`,
                    javascript: `fetch('http://127.0.0.1:40325/profiles/temporary', {\n  method: 'POST',\n  headers: {\n    'Authorization': 'Bearer YOUR_SECRET_TOKEN',\n    'Content-Type': 'application/json'\n  },\n  body: JSON.stringify({\n    platform: 'macOS',\n    proxy: 'socks5://127.0.0.1:1080'\n  })\n})\n.then(res => res.json())\n.then(data => console.log(data));`,
                    python: `import requests\n\nheaders = {\n    "Authorization": "Bearer YOUR_SECRET_TOKEN",\n    "Content-Type": "application/json"\n}\npayload = {\n    "platform": "macOS",\n    "proxy": "socks5://127.0.0.1:1080"\n}\nresp = requests.post("http://127.0.0.1:40325/profiles/temporary", headers=headers, json=payload)\nprint(resp.json())`
                },
                responseExample: `{
  "id": "e3a74de8-9545-667a315c57b6-97c199ce",
  "name": "Temporary macOS Profile",
  "fingerprint_id": "gpu-preset-default-mac",
  "temporary": true,
  "proxy_inline": true
}`
            },
            {
                method: 'POST',
                path: '/profiles/{id}/start',
                description: {
                    vi: 'Kích hoạt trình duyệt của hồ sơ được chỉ định. Trả về cổng và luồng kết nối CDP để điều khiển.',
                    en: 'Launches the Chromium browser process for the profile. Resolves proxy rules and returns remote debugging CDP WebSocket urls.'
                },
                headers: [
                    { name: 'Authorization', required: true, desc: { vi: 'Bearer <token>', en: 'Bearer <token>' } }
                ],
                bodyParams: [
                    { name: 'headless', required: false, type: 'boolean', desc: { vi: 'Chế độ chạy ẩn giao diện đồ họa (headless). Mặc định là false.', en: 'Whether to launch in headless mode. Defaults to false.' } }
                ],
                codeExamples: {
                    curl: `curl -X POST "http://127.0.0.1:40325/profiles/7bc71ed8-6b34-40cf-8e05-af4fa74457ad/start" \\\n  -H "Authorization: Bearer YOUR_SECRET_TOKEN" \\\n  -H "Content-Type: application/json" \\\n  -d '{"headless": false}'`,
                    javascript: `fetch('http://127.0.0.1:40325/profiles/7bc71ed8-6b34-40cf-8e05-af4fa74457ad/start', {\n  method: 'POST',\n  headers: {\n    'Authorization': 'Bearer YOUR_SECRET_TOKEN',\n    'Content-Type': 'application/json'\n  },\n  body: JSON.stringify({ headless: false })\n})\n.then(res => res.json())\n.then(data => console.log(data));`,
                    python: `import requests\n\nheaders = {\n    "Authorization": "Bearer YOUR_SECRET_TOKEN",\n    "Content-Type": "application/json"\n}\nresp = requests.post(\n    "http://127.0.0.1:40325/profiles/7bc71ed8-6b34-40cf-8e05-af4fa74457ad/start",\n    headers=headers,\n    json={"headless": False}\n)\nprint(resp.json())`
                },
                responseExample: `{
  "profile_id": "7bc71ed8-6b34-40cf-8e05-af4fa74457ad",
  "pid": 14920,
  "headless": false,
  "cdp": {
    "port": 53217,
    "http_url": "http://127.0.0.1:53217",
    "web_socket_debugger_url": "ws://127.0.0.1:53217/devtools/browser/a49b2c..."
  }
}`
            },
            {
                method: 'POST',
                path: '/profiles/{id}/stop',
                description: {
                    vi: 'Yêu cầu đóng trình duyệt một cách an toàn và giải phóng tài nguyên. Với profile tạm thời, dữ liệu sẽ tự động được xóa bỏ sau bước này.',
                    en: 'Gracefully terminates the browser process (SIGTERM with a 5s grace period before SIGKILL). Triggers directory cleanup for temporary profiles.'
                },
                headers: [
                    { name: 'Authorization', required: true, desc: { vi: 'Bearer <token>', en: 'Bearer <token>' } }
                ],
                codeExamples: {
                    curl: `curl -X POST "http://127.0.0.1:40325/profiles/7bc71ed8-6b34-40cf-8e05-af4fa74457ad/stop" \\\n  -H "Authorization: Bearer YOUR_SECRET_TOKEN"`,
                    javascript: `fetch('http://127.0.0.1:40325/profiles/7bc71ed8-6b34-40cf-8e05-af4fa74457ad/stop', {\n  method: 'POST',\n  headers: {\n    'Authorization': 'Bearer YOUR_SECRET_TOKEN'\n  }\n})\n.then(res => res.json())\n.then(data => console.log(data));`,
                    python: `import requests\n\nheaders = {"Authorization": "Bearer YOUR_SECRET_TOKEN"}\nresp = requests.post("http://127.0.0.1:40325/profiles/7bc71ed8-6b34-40cf-8e05-af4fa74457ad/stop", headers=headers)\nprint(resp.json())`
                },
                responseExample: `{
  "profile_id": "7bc71ed8-6b34-40cf-8e05-af4fa74457ad",
  "stopped": true
}`
            },
            {
                method: 'GET',
                path: '/profiles/{id}/cookies',
                description: {
                    vi: 'Đọc và xuất toàn bộ cơ sở dữ liệu cookie đã được giải mã của hồ sơ Chromium (hoạt động ngay cả khi profile đang chạy hoặc đã dừng).',
                    en: 'Decrypts and exports the profile\'s Chromium cookie store. Works regardless of whether the browser is running or stopped.'
                },
                headers: [
                    { name: 'Authorization', required: true, desc: { vi: 'Bearer <token>', en: 'Bearer <token>' } }
                ],
                codeExamples: {
                    curl: `curl -X GET "http://127.0.0.1:40325/profiles/7bc71ed8-6b34-40cf-8e05-af4fa74457ad/cookies" \\\n  -H "Authorization: Bearer YOUR_SECRET_TOKEN"`,
                    javascript: `fetch('http://127.0.0.1:40325/profiles/7bc71ed8-6b34-40cf-8e05-af4fa74457ad/cookies', {\n  headers: {\n    'Authorization': 'Bearer YOUR_SECRET_TOKEN'\n  }\n})\n.then(res => res.json())\n.then(data => console.log(data));`,
                    python: `import requests\n\nheaders = {"Authorization": "Bearer YOUR_SECRET_TOKEN"}\nresp = requests.get("http://127.0.0.1:40325/profiles/7bc71ed8-6b34-40cf-8e05-af4fa74457ad/cookies", headers=headers)\nprint(resp.json())`
                },
                responseExample: `{
  "cookies": [
    {
      "domain": ".google.com",
      "name": "SID",
      "value": "AIzaSyD-...",
      "path": "/",
      "expires": 1824908000,
      "secure": true,
      "http_only": true,
      "same_site": "None"
    }
  ]
}`
            },
            {
                method: 'POST',
                path: '/profiles/{id}/cookies',
                description: {
                    vi: 'Ghi đè cookie vào hồ sơ người dùng (mã hóa lại theo chuẩn lưu trữ Chromium). Yêu cầu profile phải ở trạng thái ĐÃ DỪNG tránh xung đột.',
                    en: 'Imports and re-encrypts cookies into the profile\'s SQLite store. The browser must be stopped to avoid database lock errors.'
                },
                headers: [
                    { name: 'Authorization', required: true, desc: { vi: 'Bearer <token>', en: 'Bearer <token>' } }
                ],
                bodyParams: [
                    { name: 'cookies', required: true, type: 'array', desc: { vi: 'Mảng đối tượng cookies theo định dạng JSON tương thích Puppeteer/EditThisCookie', en: 'Array of cookie objects compatible with Puppeteer format.' } }
                ],
                codeExamples: {
                    curl: `curl -X POST "http://127.0.0.1:40325/profiles/7bc71ed8-6b34-40cf-8e05-af4fa74457ad/cookies" \\\n  -H "Authorization: Bearer YOUR_SECRET_TOKEN" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "cookies": [\n      { "domain": ".facebook.com", "name": "c_user", "value": "1000...", "path": "/" }\n    ]\n  }'`,
                    javascript: `fetch('http://127.0.0.1:40325/profiles/7bc71ed8-6b34-40cf-8e05-af4fa74457ad/cookies', {\n  method: 'POST',\n  headers: {\n    'Authorization': 'Bearer YOUR_SECRET_TOKEN',\n    'Content-Type': 'application/json'\n  },\n  body: JSON.stringify({\n    cookies: [{ domain: '.facebook.com', name: 'c_user', value: '1000...', path: '/' }]\n  })\n})\n.then(res => res.json())\n.then(data => console.log(data));`,
                    python: `import requests\n\nheaders = {\n    "Authorization": "Bearer YOUR_SECRET_TOKEN",\n    "Content-Type": "application/json"\n}\ncookies = [{"domain": ".facebook.com", "name": "c_user", "value": "1000...", "path": "/"}]\nresp = requests.post(\n    "http://127.0.0.1:40325/profiles/7bc71ed8-6b34-40cf-8e05-af4fa74457ad/cookies",\n    headers=headers,\n    json={"cookies": cookies}\n)\nprint(resp.json())`
                },
                responseExample: `{
  "imported": 1
}`
            }
        ]
    },
    {
        id: 'folders',
        title: {
            vi: 'Thư mục (Folders)',
            en: 'Folders & Tags'
        },
        endpoints: [
            {
                method: 'GET',
                path: '/folders',
                description: {
                    vi: 'Liệt kê danh sách tất cả các nhãn thư mục phân loại đang được áp dụng cho các hồ sơ.',
                    en: 'Retrieves all distinct, non-empty folder tags currently assigned to persistent profiles.'
                },
                headers: [
                    { name: 'Authorization', required: true, desc: { vi: 'Bearer <token>', en: 'Bearer <token>' } }
                ],
                codeExamples: {
                    curl: `curl -X GET "http://127.0.0.1:40325/folders" \\\n  -H "Authorization: Bearer YOUR_SECRET_TOKEN"`,
                    javascript: `fetch('http://127.0.0.1:40325/folders', {\n  headers: {\n    'Authorization': 'Bearer YOUR_SECRET_TOKEN'\n  }\n})\n.then(res => res.json())\n.then(data => console.log(data));`,
                    python: `import requests\n\nheaders = {"Authorization": "Bearer YOUR_SECRET_TOKEN"}\nresp = requests.get("http://127.0.0.1:40325/folders", headers=headers)\nprint(resp.json())`
                },
                responseExample: `[
  "work",
  "scrapers",
  "advertising"
]`
            },
            {
                method: 'DELETE',
                path: '/folders/{folder}',
                description: {
                    vi: 'Xóa nhãn thư mục được chỉ định. Tùy chọn xóa tất cả profile trong thư mục đó hoặc giữ lại và đưa về nhóm chung.',
                    en: 'Deletes a folder tag. Profiles inside are either deleted (if delete_profiles=true) or unfiled (default).'
                },
                headers: [
                    { name: 'Authorization', required: true, desc: { vi: 'Bearer <token>', en: 'Bearer <token>' } }
                ],
                queryParams: [
                    { name: 'delete_profiles', required: false, type: 'boolean', default: 'false', desc: { vi: 'Xóa vĩnh viễn các hồ sơ con bên trong thư mục. Nếu là false, các hồ sơ sẽ chỉ bị gỡ nhãn về thư mục chung.', en: 'Whether to delete the profiles inside or just unfile them.' } }
                ],
                codeExamples: {
                    curl: `curl -X DELETE "http://127.0.0.1:40325/folders/scrapers?delete_profiles=true" \\\n  -H "Authorization: Bearer YOUR_SECRET_TOKEN"`,
                    javascript: `fetch('http://127.0.0.1:40325/folders/scrapers?delete_profiles=true', {\n  method: 'DELETE',\n  headers: {\n    'Authorization': 'Bearer YOUR_SECRET_TOKEN'\n  }\n})\n.then(res => res.json())\n.then(data => console.log(data));`,
                    python: `import requests\n\nheaders = {"Authorization": "Bearer YOUR_SECRET_TOKEN"}\nresp = requests.delete("http://127.0.0.1:40325/folders/scrapers?delete_profiles=true", headers=headers)\nprint(resp.json())`
                },
                responseExample: `{
  "deleted_folder": "scrapers",
  "delete_profiles": true,
  "profiles": 12
}`
            }
        ]
    },
    {
        id: 'proxies',
        title: {
            vi: 'Quản lý Proxy',
            en: 'Proxies Management'
        },
        endpoints: [
            {
                method: 'GET',
                path: '/proxies',
                description: {
                    vi: 'Lấy danh sách các proxy đã được lưu trữ trong hệ thống (vì lý do bảo mật, thông tin tài khoản/mật khẩu đăng nhập proxy sẽ được ẩn khỏi kết quả).',
                    en: 'Lists all proxies saved in the launcher store. Security credentials (username and password) are omitted from response.'
                },
                headers: [
                    { name: 'Authorization', required: true, desc: { vi: 'Bearer <token>', en: 'Bearer <token>' } }
                ],
                codeExamples: {
                    curl: `curl -X GET "http://127.0.0.1:40325/proxies" \\\n  -H "Authorization: Bearer YOUR_SECRET_TOKEN"`,
                    javascript: `fetch('http://127.0.0.1:40325/proxies', {\n  headers: {\n    'Authorization': 'Bearer YOUR_SECRET_TOKEN'\n  }\n})\n.then(res => res.json())\n.then(data => console.log(data));`,
                    python: `import requests\n\nheaders = {"Authorization": "Bearer YOUR_SECRET_TOKEN"}\nresp = requests.get("http://127.0.0.1:40325/proxies", headers=headers)\nprint(resp.json())`
                },
                responseExample: `[
  {
    "id": "proxy-us-01",
    "name": "US Proxy High-Speed",
    "kind": "socks5",
    "host": "104.28.19.1",
    "port": 10080,
    "country": "US"
  }
]`
            },
            {
                method: 'POST',
                path: '/proxies',
                description: {
                    vi: 'Thêm proxy mới vào kho lưu trữ của Launcher. Hỗ trợ truyền chuỗi kết nối gộp hoặc điền các trường thông tin chi tiết.',
                    en: 'Adds a new proxy to the launcher\'s database. Expects a unified proxy connection string or detailed discrete fields.'
                },
                headers: [
                    { name: 'Authorization', required: true, desc: { vi: 'Bearer <token>', en: 'Bearer <token>' } }
                ],
                bodyParams: [
                    { name: 'proxy', required: false, type: 'string', desc: { vi: 'Chuỗi kết nối (socks5://user:pass@host:port hoặc host:port:user:pass). Nếu truyền trường này, các trường chi tiết khác bên dưới sẽ bị bỏ qua.', en: 'Unified proxy string. Overrides explicit fields if provided.' } },
                    { name: 'kind', required: false, type: 'string', desc: { vi: 'Loại giao thức: socks5, http, https', en: 'Protocol type (socks5, http, https).' } },
                    { name: 'host', required: false, type: 'string', desc: { vi: 'Địa chỉ IP hoặc tên miền proxy', en: 'IP address or domain name of the proxy.' } },
                    { name: 'port', required: false, type: 'integer', desc: { vi: 'Cổng kết nối', en: 'Connection port number.' } },
                    { name: 'username', required: false, type: 'string', desc: { vi: 'Tài khoản đăng nhập proxy', en: 'Proxy username.' } },
                    { name: 'password', required: false, type: 'string', desc: { vi: 'Mật khẩu đăng nhập proxy', en: 'Proxy password.' } },
                    { name: 'name', required: false, type: 'string', desc: { vi: 'Tên gợi nhớ của proxy', en: 'Custom label for the proxy.' } }
                ],
                codeExamples: {
                    curl: `curl -X POST "http://127.0.0.1:40325/proxies" \\\n  -H "Authorization: Bearer YOUR_SECRET_TOKEN" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "name": "Socks5 Proxy USA",\n    "proxy": "socks5://admin:pass123@1.2.3.4:1080"\n  }'`,
                    javascript: `fetch('http://127.0.0.1:40325/proxies', {\n  method: 'POST',\n  headers: {\n    'Authorization': 'Bearer YOUR_SECRET_TOKEN',\n    'Content-Type': 'application/json'\n  },\n  body: JSON.stringify({\n    name: 'Socks5 Proxy USA',\n    proxy: 'socks5://admin:pass123@1.2.3.4:1080'\n  })\n})\n.then(res => res.json())\n.then(data => console.log(data));`,
                    python: `import requests\n\nheaders = {\n    "Authorization": "Bearer YOUR_SECRET_TOKEN",\n    "Content-Type": "application/json"\n}\npayload = {\n    "name": "Socks5 Proxy USA",\n    "proxy": "socks5://admin:pass123@1.2.3.4:1080"\n}\nresp = requests.post("http://127.0.0.1:40325/proxies", headers=headers, json=payload)\nprint(resp.json())`
                },
                responseExample: `{
  "id": "proxy-us-02",
  "name": "Socks5 Proxy USA",
  "kind": "socks5",
  "host": "1.2.3.4",
  "port": 1080,
  "country": "US"
}`
            }
        ]
    }
];

export interface DocItemGuide {
    title: { vi: string; en: string };
    steps: Array<{
        title: { vi: string; en: string };
        desc: { vi: string; en: string };
    }>;
}

export const DOC_ITEMS_GUIDES: Record<string, DocItemGuide> = {
    firstProfile: {
        title: {
            vi: 'Hướng dẫn: Tạo hồ sơ trình duyệt đầu tiên',
            en: 'Guide: Creating your first browser profile'
        },
        steps: [
            {
                title: { vi: 'Bước 1: Khởi chạy FastST Launcher', en: 'Step 1: Open FastST Launcher' },
                desc: {
                    vi: 'Mở phần mềm FastST Launcher đã cài đặt trên máy tính của bạn và đăng nhập vào tài khoản.',
                    en: 'Launch the FastST desktop client on your system and log into your account.'
                }
            },
            {
                title: { vi: 'Bước 2: Click nút Tạo Profile', en: 'Step 2: Click Create Profile' },
                desc: {
                    vi: 'Nhấp vào nút "Tạo Profile" (Create Profile) màu xanh ở thanh công cụ phía trên giao diện chính.',
                    en: 'Click the prominent blue "Create Profile" button on the top menu bar.'
                }
            },
            {
                title: { vi: 'Bước 3: Đặt cấu hình cơ bản', en: 'Step 3: Define basic settings' },
                desc: {
                    vi: 'Nhập tên hồ sơ, chọn hệ điều hành đích (Windows, macOS hoặc Linux) và chọn phiên bản trình duyệt Chromium tương ứng.',
                    en: 'Enter a profile name, select the target operating system (Windows, macOS, Linux), and pick your Chromium browser version.'
                }
            },
            {
                title: { vi: 'Bước 4: Tạo dấu vân tay ngẫu nhiên', en: 'Step 4: Generate a random fingerprint' },
                desc: {
                    vi: 'Nhấp vào nút "Random Fingerprint". Hệ thống sẽ tự động cấu hình các thông số WebGL, Canvas, Client Hints và Voices độc nhất khớp với cấu hình máy chủ của bạn.',
                    en: 'Click "Random Fingerprint". Our engine generates unique WebGL, Canvas, Client Hints, and Voices configurations aligned with your hardware limits.'
                }
            },
            {
                title: { vi: 'Bước 5: Lưu hồ sơ và Khởi chạy', en: 'Step 5: Save and launch' },
                desc: {
                    vi: 'Nhấp "Tạo mới". Hồ sơ của bạn sẽ hiển thị trong danh sách. Chỉ cần nhấn nút "Start" để mở trình duyệt antidetect sạch sẽ.',
                    en: 'Click "Save". The profile will appear in your workspace list. Click "Start" to open a clean antidetect browser window.'
                }
            }
        ]
    },
    proxies: {
        title: {
            vi: 'Hướng dẫn: Thiết lập & Quản lý Proxy',
            en: 'Guide: Setting up & Managing Proxies'
        },
        steps: [
            {
                title: { vi: 'Bước 1: Vào kho quản lý Proxy', en: 'Step 1: Open the Proxy store' },
                desc: {
                    vi: 'Trên menu bên trái của FastST Launcher, chọn tab "Proxy" để mở trình quản lý danh sách proxy.',
                    en: 'Select the "Proxy" tab on the left sidebar of FastST Launcher to open the proxy storage area.'
                }
            },
            {
                title: { vi: 'Bước 2: Thêm Proxy mới', en: 'Step 2: Add proxy connections' },
                desc: {
                    vi: 'Chọn "Thêm Proxy" (Add Proxy). Bạn có thể thêm đơn lẻ hoặc nhập nhanh hàng loạt theo định dạng dòng: `host:port:username:password`.',
                    en: 'Click "Add Proxy". You can configure a single connection or import multiple proxies in the format: `host:port:username:password`.'
                }
            },
            {
                title: { vi: 'Bước 3: Hỗ trợ đa giao thức', en: 'Step 3: Multi-protocol support' },
                desc: {
                    vi: 'Hệ thống hỗ trợ các giao thức SOCKS5, HTTP và HTTPS. Bạn có thể chọn giao thức phù hợp với nhà cung cấp proxy.',
                    en: 'FastST supports SOCKS5, HTTP, and HTTPS protocols. Choose the protocol matching your proxy vendor.'
                }
            },
            {
                title: { vi: 'Bước 4: Kiểm tra kết nối & rò rỉ UDP', en: 'Step 4: Run connectivity & UDP check' },
                desc: {
                    vi: 'Nhấp "Check Proxy". Hệ thống sẽ gửi yêu cầu đo lường tốc độ phản hồi (ping), múi giờ tương ứng và kiểm tra UDP-relay để bật WebRTC an toàn.',
                    en: 'Click "Check Proxy". The engine probes ping latency, timezone alignment, and checks UDP-relay capabilities to set up secure WebRTC routing.'
                }
            }
        ]
    },
    fingerprints: {
        title: {
            vi: 'Hướng dẫn: Sử dụng Dấu vân tay Antidetect',
            en: 'Guide: Operating Antidetect Fingerprints'
        },
        steps: [
            {
                title: { vi: '1. Khái niệm vân tay trình duyệt', en: '1. What is a browser fingerprint?' },
                desc: {
                    vi: 'Vân tay trình duyệt bao gồm thông tin về GPU, Canvas, phông chữ, ngôn ngữ, múi giờ, độ phân giải màn hình và cấu hình phần cứng CPU/RAM.',
                    en: 'Browser fingerprinting collects GPU details, Canvas, Fonts, system language, timezone, screen resolution, and hardware capacities (CPU/RAM).'
                }
            },
            {
                title: { vi: '2. Giả lập phần cứng thực tế', en: '2. Realistic hardware emulation' },
                desc: {
                    vi: 'FastST thay đổi các API JavaScript để giả lập một máy tính thật khác hoàn toàn mà không để lộ dấu vết giả lập (no antidetect detection).',
                    en: 'FastST mocks core JavaScript APIs to pretend you are on a different real computer, hiding any sign of emulation headers.'
                }
            },
            {
                title: { vi: '3. Bảo vệ chống rò rỉ WebGL/Canvas', en: '3. WebGL and Canvas protection' },
                desc: {
                    vi: 'Hệ thống tự động thêm noise (nhiễu kỹ thuật số) ngẫu nhiên vào phần vẽ đồ họa WebGL và hình ảnh Canvas để mỗi profile có vân tay ảnh độc nhất vô nhị.',
                    en: 'The app injects random digital noise into WebGL graphics rendering and Canvas assets, producing unique image hashes per profile.'
                }
            }
        ]
    },
    teamwork: {
        title: {
            vi: 'Hướng dẫn: Cộng tác & Làm việc nhóm',
            en: 'Guide: Teamwork & Collaboration'
        },
        steps: [
            {
                title: { vi: '1. Phân quyền theo thư mục (Folder permissions)', en: '1. Folder-based permissions' },
                desc: {
                    vi: 'Tạo thư mục dự án và gán quyền cho các thành viên. Các profile nằm trong thư mục sẽ tự động thừa kế quyền của thư mục đó.',
                    en: 'Create project folders and assign access privileges to members. Profiles inside folder inherit permissions automatically.'
                }
            },
            {
                title: { vi: '2. Cấp quyền tùy biến linh hoạt', en: '2. Granular role management' },
                desc: {
                    vi: 'Bạn có thể chỉ định quyền hạn cho từng người dùng: chỉ khởi chạy profile, sửa đổi cấu hình, thêm proxy, hoặc xóa bỏ dữ liệu.',
                    en: 'Assign specific member actions: start profile only, edit parameters, modify proxies, or permanently delete profiles.'
                }
            },
            {
                title: { vi: '3. Chuyển nhượng hồ sơ (Transfer Profile)', en: '3. Transferring profile ownership' },
                desc: {
                    vi: 'Chuyển quyền sở hữu profile sang một tài khoản FastST khác chỉ trong vài giây mà không làm thay đổi hay mất mát dữ liệu cookie và dấu vân tay trình duyệt.',
                    en: 'Transfer profile ownership to another FastST account in seconds without altering cookies or hardware fingerprints.'
                }
            }
        ]
    },
    sync: {
        title: {
            vi: 'Hướng dẫn: Đồng bộ dữ liệu FastST Cloud',
            en: 'Guide: FastST Cloud Data Sync'
        },
        steps: [
            {
                title: { vi: '1. Đồng bộ hóa đám mây mặc định', en: '1. Default Cloud Synchronization' },
                desc: {
                    vi: 'Khi bạn đóng trình duyệt, FastST tự động nén mã hóa và đồng bộ cookie, lịch sử, các tab đang mở và mật khẩu lên đám mây bảo mật.',
                    en: 'Upon closing the browser window, FastST encrypts and uploads cookies, history, tabs, and credentials to our secure cloud storage.'
                }
            },
            {
                title: { vi: '2. Tiếp tục làm việc đa thiết bị', en: '2. Resume work anywhere' },
                desc: {
                    vi: 'Bạn có thể mở profile này trên bất kỳ máy tính nào khác đã cài đặt FastST Launcher và tiếp tục phiên làm việc bình thường.',
                    en: 'Open the same profile on any computer running FastST Launcher and resume your browser session instantly.'
                }
            },
            {
                title: { vi: '3. Chế độ lưu trữ Cục bộ (Local Only)', en: '3. Local Only Mode' },
                desc: {
                    vi: 'Bạn có thể vào Cài đặt và tắt đồng bộ đám mây cho các profile đặc biệt để toàn bộ dữ liệu người dùng chỉ được lưu trên ổ cứng của bạn.',
                    en: 'Go to Settings and disable cloud sync for critical profiles, keeping all browser profiles and user data strictly on your local disk.'
                }
            }
        ]
    },
    extensions: {
        title: {
            vi: 'Hướng dẫn: Quản lý Tiện ích mở rộng (Extensions)',
            en: 'Guide: Extension Management'
        },
        steps: [
            {
                title: { vi: '1. Cài đặt trực tiếp trên trình duyệt', en: '1. Install directly on profiles' },
                desc: {
                    vi: 'Mở profile, truy cập Chrome Web Store và nhấp cài đặt tiện ích mở rộng như Metamask, các ví điện tử hoặc công cụ dịch thuật.',
                    en: 'Start your browser profile, visit the Chrome Web Store, and install extensions like Metamask, wallets, or translation utilities.'
                }
            },
            {
                title: { vi: '2. Tải lên file tự chọn (.crx)', en: '2. Upload custom extension files (.crx)' },
                desc: {
                    vi: 'FastST cho phép bạn tải lên file `.crx` hoặc thư mục tiện ích mở rộng đã được giải nén trực tiếp trong cấu hình profile.',
                    en: 'FastST supports uploading custom `.crx` packages or unpacked developer extension folders in the profile properties.'
                }
            },
            {
                title: { vi: '3. Quản lý tập trung toàn doanh nghiệp', en: '3. Centralized Team deployment' },
                desc: {
                    vi: 'Chủ nhóm (Admin) có thể thêm tiện ích mở rộng vào kho ứng dụng chung để tự động cài đặt và kích hoạt trên tất cả profile của nhân viên.',
                    en: 'Team owners (Admins) can add extensions to the central app store, deploying them automatically across all team members\' profiles.'
                }
            }
        ]
    },
    beginners: {
        title: {
            vi: 'Hướng dẫn: Bắt đầu cho người mới',
            en: 'Guide: Tutorial for beginners'
        },
        steps: [
            {
                title: { vi: '1. Xem Video Hướng dẫn 5 phút', en: '1. Watch 5-minute video tutorial' },
                desc: {
                    vi: 'Khám phá cách tải, cài đặt, đăng ký tài khoản FastST và tạo 10 profile miễn phí đầu tiên qua video hướng dẫn nhanh trên kênh chính thức.',
                    en: 'Learn how to download, install, register, and leverage your first 10 free browser profiles in our quick start video.'
                }
            },
            {
                title: { vi: '2. Tải tài liệu hướng dẫn PDF', en: '2. Download PDF handbook' },
                desc: {
                    vi: 'Tải cẩm nang PDF hướng dẫn chi tiết các mẹo tối ưu hóa thông số dấu vân tay để vượt qua các thuật toán AI chống quét của Facebook và Google.',
                    en: 'Download our comprehensive PDF guide on fine-tuning anti-detection parameters to bypass Facebook and Google bot-detecting AI.'
                }
            }
        ]
    },
    workflow: {
        title: {
            vi: 'Hướng dẫn: Tối ưu hóa Quy trình làm việc',
            en: 'Guide: Workflow Optimization'
        },
        steps: [
            {
                title: { vi: '1. Sử dụng tính năng Duplicate (Nhân bản nhanh)', en: '1. Duplicate profiles quickly' },
                desc: {
                    vi: 'Nhấp chuột phải vào profile → chọn Duplicate để tạo ra các cấu hình tương tự ngay lập tức mà không cần thiết lập lại từ đầu.',
                    en: 'Right-click any profile and select Duplicate to spin up matching configurations without starting from scratch.'
                }
            },
            {
                title: { vi: '2. Phân loại bằng nhãn thư mục và thẻ (Tags)', en: '2. Organize with folders & tags' },
                desc: {
                    vi: 'Tạo các thẻ tag màu để nhanh chóng lọc và quản lý hàng nghìn tài khoản theo dự án hoặc trạng thái tài khoản.',
                    en: 'Deploy color tags and folder groupings to filter and handle thousands of profiles by project, site, or account health status.'
                }
            },
            {
                title: { vi: '3. Nuôi tài khoản tự động qua API', en: '3. Programmatic profile farming' },
                desc: {
                    vi: 'Tận dụng Automation API kết hợp với Puppeteer/Playwright để tự động hóa đăng nhập, lướt bảng tin nuôi tài khoản ngầm hàng ngày.',
                    en: 'Combine the local Automation API with Puppeteer or Playwright to automate logging in, feed scrolling, and cookie warming.'
                }
            }
        ]
    },
    troubleshooting: {
        title: {
            vi: 'Hướng dẫn: Khắc phục sự cố thường gặp',
            en: 'Guide: Troubleshooting FAQs'
        },
        steps: [
            {
                title: { vi: '1. Trình duyệt không mở được (Crash hoặc lặp khởi chạy)', en: '1. Browser fails to open / crashes' },
                desc: {
                    vi: 'Hãy đảm bảo rằng máy tính của bạn còn đủ dung lượng trống ổ cứng và tắt các phần mềm diệt virus có thể ngăn cản tiến trình chạy.',
                    en: 'Ensure your system has enough free disk space and disable anti-virus suites that might mistakenly flag Tauri/Chromium processes.'
                }
            },
            {
                title: { vi: '2. Lỗi kết nối mạng proxy (Proxy connection timeout)', en: '2. Proxy connection timeout' },
                desc: {
                    vi: 'Nhấp nút Check Proxy để kiểm tra tốc độ ping. Hãy đảm bảo proxy đang hoạt động tốt và không bị nhà cung cấp chặn kết nối IP.',
                    en: 'Proactive test with "Check Proxy" to isolate connection issues. Ensure your proxy vendor subscription is valid.'
                }
            },
            {
                title: { vi: '3. Cookie bị mất sau khi đóng profile', en: '3. Cookies lost after closing profile' },
                desc: {
                    vi: 'Hãy đợi tiến trình đồng bộ dữ liệu của FastST chạy ngầm hoàn tất (thường mất 2-3 giây sau khi đóng cửa sổ trình duyệt) trước khi tắt máy tính.',
                    en: 'Wait for the cloud sync indicator to finish (takes 2-3s after browser exit) before logging off your computer.'
                }
            }
        ]
    }
};

