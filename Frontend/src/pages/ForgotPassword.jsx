import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ForgotPassword.module.css'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [showToken, setShowToken] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:8000/user/requestReset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await response.json()

      if (response.ok) {
        setResetToken(data.resetToken)
        setShowToken(true)
      } else {
        setError(data.message || 'Failed to send reset link')
      }
    } catch (err) {
      setError('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    if (resetToken) {
      navigate(`/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(resetToken)}`)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Forgot Password?</h1>
        <p className={styles.subtitle}>No worries! We'll help you reset it.</p>

        {!showToken ? (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={styles.input}
                required
              />
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button
              type="submit"
              disabled={loading || !email}
              className={styles.button}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <p className={styles.link}>
              Remember your password?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className={styles.navLink}
              >
                Sign In
              </button>
            </p>
          </form>
        ) : (
          <div className={styles.successBox}>
            <div className={styles.successIcon}>✓</div>
            <h2 className={styles.successTitle}>Reset Code Generated</h2>
            <p className={styles.tokenInfo}>
              Your reset code is: <strong>{resetToken}</strong>
            </p>
            <p className={styles.tokenSubtext}>This code will expire in 15 minutes</p>

            <button onClick={handleNext} className={styles.button}>
              Continue to Reset Password
            </button>

            <button
              type="button"
              onClick={() => {
                setShowToken(false)
                setResetToken('')
                setEmail('')
              }}
              className={styles.secondaryButton}
            >
              Try Another Email
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
