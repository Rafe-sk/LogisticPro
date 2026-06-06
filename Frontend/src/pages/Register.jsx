import { useState } from 'react'
import styles from './Register.module.css'
import { useNavigate } from 'react-router-dom'
import { registerWithEmailAndPassword } from '../auth.js'

const Register = () => {

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const [error, setError] = useState('')

    const navigate = useNavigate()

    const handleForm = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const register = async () => {
        if (formData.email === '' || formData.password === '') {
            alert('Please fill all the fields')
            return
        }
        try {
            await registerWithEmailAndPassword(formData.email, formData.password)
            navigate('/profileSetup')
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <>
            <div className={styles.container}>
                <form className={styles.form}>
                    <h2 className={styles.title}>Register</h2>

                    {error && <p style={{ color: 'red', marginBottom: '0.5rem' }}>{error}</p>}

                    <label className={styles.label}>
                        Email:
                        <input type="text" name='email' onChange={handleForm} className={styles.input} />
                    </label>

                    <label className={styles.label}>
                        Password:
                        <input type="password" name="password" onChange={handleForm} className={styles.input} />
                    </label>

                    <button type="button" onClick={register} className={styles.button}>
                        Sign Up
                    </button>

                    <p className={styles.para}>
                        Existing User?
                        <a href="/" className={styles.href}>Login Here</a>
                    </p>

                </form>
            </div>
        </>
    )
}

export default Register