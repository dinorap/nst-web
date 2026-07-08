/**
 * ============================================================
 *  CENTRALIZED LANDING PAGE CONFIG
 * ============================================================
 *  Khi deploy license-server lên domain mới, không cần đổi gì ở
 *  đây vì landing page được serve cùng origin với API.
 *  File này chỉ để document các query params mà landing page
 *  hỗ trợ và các tab hợp lệ.
 *
 *  Hỗ trợ các query params:
 *  - tab      : 'features' | 'use-cases' | 'pricing' | 'faq' | 'docs'
 *               (mặc định: 'features')
 *  - plan     : 'free' | 'base' | 'team'  (highlight gói cụ thể trên trang pricing)
 *  - cycle    : 'monthly' | 'yearly'      (chọn chu kỳ thanh toán)
 *  - lang     : 'vi' | 'en'              (ngôn ngữ)
 *  - google_auth / google_error : do OAuth callback (xử lý tự động)
 * ============================================================
 */

export const VALID_TABS = ['features', 'use-cases', 'pricing', 'faq', 'docs'] as const;
export type ValidTab = typeof VALID_TABS[number];

export const VALID_PLANS = ['free', 'base', 'team'] as const;
export type ValidPlan = typeof VALID_PLANS[number];

export const DEFAULT_TAB: ValidTab = 'features';

export function isValidTab(value: string | null): value is ValidTab {
  return !!value && (VALID_TABS as readonly string[]).includes(value);
}

export function isValidPlan(value: string | null): value is ValidPlan {
  return !!value && (VALID_PLANS as readonly string[]).includes(value);
}