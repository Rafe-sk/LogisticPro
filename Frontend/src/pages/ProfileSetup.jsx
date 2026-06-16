import styles from './ProfileSetup.module.css'
import { getUser } from '../auth.js'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProfileSetup() {

  const currentUser = getUser();   // decoded JWT payload: { userid, email }

  const [form, setForm] = useState({
    userid: currentUser?.userid || '',
    name: '',
    email: currentUser?.email || '',
    phone: '',
    role: '',
    address: '',
    city: '',
    pincode: '',
    state: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate();

  const handleForm = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const submitForm = async () => {
    const response = await fetch('http://localhost:8000/user/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    if (response.status !== 201) {
      throw new Error('Failed to save profile')
    }
    return response.json()
  }

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.role) {
      setError('Please fill in all required fields')
      return
    }
    setError('')
    setLoading(true)
    try {
      await submitForm()   // await before navigating
      navigate('/home')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <div className={styles.header}>
          <div className={styles.avatar}>
            {form.name ? form.name.charAt(0).toUpperCase() : '?'}
          </div>
          <h2 className={styles.title}>Complete Your Profile</h2>
          <p className={styles.subtitle}>Help us personalize your experience</p>
        </div>

        {error && <div className={styles.errorBox}>⚠️ {error}</div>}

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Personal Info</h3>

          <label className={styles.label}>
            Full Name *
            <input type="text" name='name' onChange={handleForm} className={styles.input} placeholder="John Doe" id="profile-name" />
          </label>

          <label className={styles.label}>
            Email Address
            <input type="text" name='email' value={form.email} readOnly className={`${styles.input} ${styles.readOnly}`} />
          </label>

          <label className={styles.label}>
            Phone Number *
            <input type="tel" name='phone' onChange={handleForm} className={styles.input} placeholder="+91 98765 43210" id="profile-phone" />
          </label>

          <label className={styles.label}>
            Role *
            <select name="role" onChange={handleForm} className={styles.select} id="profile-role">
              <option value="">Select your role</option>
              <option value="user">User / Customer</option>
              <option value="delivery agent">Delivery Agent</option>
            </select>
          </label>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Address</h3>

          <label className={styles.label}>
            Street Address
            <textarea name="address" className={styles.textarea} onChange={handleForm} rows={2} placeholder="Enter your full street address" id="profile-address" />
          </label>

          <div className={styles.inlineGroup}>
            <label className={styles.inlinelabel}>
              City
              <input type="text" name="city" className={styles.input} onChange={handleForm} placeholder="Mumbai" id="profile-city" />
            </label>
            <label className={styles.inlinelabel}>
              Pincode
              <input type="text" name="pincode" className={styles.input} onChange={handleForm} placeholder="400001" id="profile-pincode" />
            </label>
          </div>

          <label className={styles.label}>
            State
            <input type="text" name="state" className={styles.input} onChange={handleForm} placeholder="Maharashtra" id="profile-state" />
          </label>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className={styles.button}
          disabled={loading}
          id="profile-submit"
        >
          {loading ? 'Saving…' : 'Save & Continue →'}
        </button>
      </form>
    </div>
  )
}

export default ProfileSetup