import { useState } from 'react'
import styles from './Register.module.css'
import { useNavigate, Link } from 'react-router-dom'
import { registerWithEmailAndPassword } from '../auth.js'

const Register = () => {

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleForm = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const register = async () => {
        if (formData.email === '' || formData.password === '') {
            setError('Please fill in all fields')
            return
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }
        setError('')
        setLoading(true)
        try {
            await registerWithEmailAndPassword(formData.email, formData.password)
            navigate('/profileSetup')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') register()
    }

    return (
        <div className={styles.container}>
            <form className={styles.form} onKeyDown={handleKeyDown}>
                <div className={styles.logoArea}>
                    <span className={styles.appName}>LogisticPro</span>
                </div>

                <h2 className={styles.title}>Create account</h2>
                <p className={styles.subtitle}>Start shipping smarter today</p>

                {error && (
                    <div className={styles.errorBox}>
                        ⚠️ {error}
                    </div>
                )}

                <label className={styles.label}>
                    Email Address
                    <input
                        type="email"
                        name='email'
                        onChange={handleForm}
                        className={styles.input}
                        placeholder="you@example.com"
                        id="register-email"
                    />
                </label>

                <label className={styles.label}>
                    Password
                    <input
                        type="password"
                        name="password"
                        onChange={handleForm}
                        className={styles.input}
                        placeholder="Min. 6 characters"
                        id="register-password"
                    />
                </label>

                <button
                    type="button"
                    onClick={register}
                    className={styles.button}
                    disabled={loading}
                    id="register-btn"
                >
                    {loading ? 'Creating account…' : 'Create Account'}
                </button>

                <p className={styles.para}>
                    Already have an account?
                    <Link to="/login" className={styles.href}>Sign in</Link>
                </p>
            </form>
        </div>
    )
}

export default Register