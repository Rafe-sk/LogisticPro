import { useState } from 'react'
import styles from './Login.module.css'
import { useNavigate } from 'react-router-dom'
import { loginWithEmailAndPassword } from '../auth.js'

const Login = () => {

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState('')

    const navigate = useNavigate()

    const handlForm = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const login = async () => {
        if (formData.email === '' || formData.password === '') {
            alert('Please fill all the fields')
            return
        }
        try {
            await loginWithEmailAndPassword(formData.email, formData.password)
            navigate('/home')
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <>
            <div className={styles.container}>
                <form className={styles.form}>
                    <h2 className={styles.title}>Login</h2>

                    {error && <p style={{ color: 'red', marginBottom: '0.5rem' }}>{error}</p>}

                    <label className={styles.label}>
                        Email:
                        <input type="text" name="email" onChange={handlForm} className={styles.input} />
                    </label>

                    <label className={styles.label}>
                        Password:
                        <input type="password" name="password" onChange={handlForm} className={styles.input} />
                    </label>

                    <button type="button" onClick={login} className={styles.button}>
                        Login
                    </button>

                    <p className={styles.para}>
                        New Here?
                        <a href="/register" className={styles.href}>Sign Up</a>
                    </p>
                </form>
            </div>
        </>
    )
}

export default Login