import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { startGoogleLogin } from './auth'

interface LoginModalProps {
    open: boolean
    onClose: () => void
}

function GoogleIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
        </svg>
    )
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState<string | null>(null)

    const onGoogleClick = async () => {
        setErr(null)
        setLoading(true)
        try {
            await startGoogleLogin(window.location.origin)
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Có lỗi xảy ra'
            setErr(msg)
            setLoading(false)
        }
    }

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="login-modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="login-modal"
                        initial={{ opacity: 0, y: 20, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.96 }}
                        transition={{ type: 'spring', damping: 22, stiffness: 280 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className="login-modal-close" onClick={onClose} aria-label="Đóng">
                            ×
                        </button>
                        <div className="login-modal-head">
                            <h3>Đăng nhập / Đăng ký</h3>
                            <p>Sử dụng tài khoản Google để vào FastST</p>
                        </div>
                        <button
                            className="login-google-btn"
                            onClick={onGoogleClick}
                            disabled={loading}
                        >
                            <GoogleIcon />
                            <span>{loading ? 'Đang chuyển tới Google…' : 'Đăng nhập bằng Google'}</span>
                        </button>
                        {err && <div className="login-modal-error">{err}</div>}
                        <div className="login-modal-note">
                            Tài khoản sẽ được tạo tự động nếu chưa tồn tại.
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
