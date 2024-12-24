import { useEffect, useState } from 'react'
import styles from './Login.module.css'
import { useNavigate } from 'react-router-dom'
import { auth, loginWithEmailAndPassword, signInWithGoogle } from '../Firebase.js'
import {useAuthState} from 'react-firebase-hooks/auth'

const Login=()=> {

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const navigate = useNavigate()
    const [user, loading, error] = useAuthState(auth);

    const handlForm = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    useEffect(() => {
        if(loading) return;
        if(user){
            navigate('/home')
        }
    }, [user,loading])
    

    const login = async () => {
        if(formData.email !== "" || formData.password !== ""){
            const { email, password } = formData
            await loginWithEmailAndPassword(email, password);
            navigate('/home')
        }
        else{
            alert("Please fill all the fields")
        }
    }

    return (
        <>
            <div className={styles.container}>
                <form className={styles.form}>
                <h2 className={styles.title}>Login</h2>
                    <label className={styles.label}>
                        Email:
                        <input type="text" name="email" onChange={handlForm}  className={styles.input} />
                    </label>

                    <label className={styles.label}>
                        Password:
                        <input type="password" name="password" onChange={handlForm}    className={styles.input} />
                    </label>

                    <button type="button" onClick={login}  className={styles.button}>
                        Login
                    </button>

                    <button type="button" onClick={signInWithGoogle}  className={styles.button}>
                        Log In With Google
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