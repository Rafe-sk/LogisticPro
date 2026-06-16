import { useState } from 'react'
import styles from './Login.module.css'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { loginWithEmailAndPassword } from '../auth.js'

const Login = () => {

    const [formData, setFormData] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const location = useLocation()

    // If redirected from "Create Order" while not logged in, send them to /pickup after login
    const redirectTarget = new URLSearchParams(location.search).get('redirect') === 'order'
        ? '/pickup'
        : '/home'

    const handleForm = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const login = async () => {
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields')
            return
        }
        setError('')
        setLoading(true)
        try {
            await loginWithEmailAndPassword(formData.email, formData.password)
            // If coming from Create Order, we need to create an order first then go to /pickup
            if (redirectTarget === '/pickup') {
                navigate('/home')   // go home; user can click Create Order again
            } else {
                navigate('/home')
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') login()
    }

    return (
        <div className={styles.container}>
            <form className={styles.form} onKeyDown={handleKeyDown}>
                <div className={styles.logoArea}>
                    <Link to="/" className={styles.logoLink}>← Back to Home</Link>
                    <span className={styles.appName}>LogisticPro</span>
                </div>

                <h2 className={styles.title}>Welcome back</h2>
                <p className={styles.subtitle}>Sign in to your account to continue</p>

                {error && (
                    <div className={styles.errorBox}>⚠️ {error}</div>
                )}

                {location.search.includes('redirect=order') && (
                    <div className={styles.infoBox}>
                        🔒 Sign in first to create your order
                    </div>
                )}

                <label className={styles.label}>
                    Email Address
                    <input
                        type="email"
                        name="email"
                        onChange={handleForm}
                        className={styles.input}
                        placeholder="you@example.com"
                        id="login-email"
                        autoComplete="email"
                    />
                </label>

                <label className={styles.label}>
                    Password
                    <input
                        type="password"
                        name="password"
                        onChange={handleForm}
                        className={styles.input}
                        placeholder="••••••••"
                        id="login-password"
                        autoComplete="current-password"
                    />
                </label>

                <Link to="/forgot-password" className={styles.forgotPassword}>
                    Forgot password?
                </Link>

                <button
                    type="button"
                    onClick={login}
                    className={styles.button}
                    disabled={loading}
                    id="login-btn"
                >
                    {loading ? 'Signing in…' : 'Sign In'}
                </button>

                <p className={styles.para}>
                    New here?
                    <Link to="/register" className={styles.href}>Create an account</Link>
                </p>
            </form>
        </div>
    )
}

export default Login