import { useEffect, useState } from 'react'
import styles from './Register.module.css'
import { useNavigate } from 'react-router-dom'
import { auth, registerWithEmailAndPassword, signInWithGoogle } from '../Firebase.js'
import {useAuthState} from 'react-firebase-hooks/auth'

const Register = () => {

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const navigate = useNavigate()
    const [user, loading, error] = useAuthState(auth);

    useEffect(() => {
        if(loading) return;
        if(user){
            navigate('/home')
        }
    }, [user,loading])

    const handleForm = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const register = async () => {
        if (formData.email !== "" || formData.password !== ""){
            const { email, password } = formData
            await registerWithEmailAndPassword( email, password);
            navigate('/profileSetup')
        }
        else{
            alert("Please fill all the fields")
        }
    }

    return (
        <>
            <div className={styles.container}>

                <form className={styles.form}>
                    <h2 className={styles.title}>Register</h2>

                    <label className={styles.label} >
                        Email:
                        <input type="text" name='email' onChange={handleForm} className={styles.input} />
                    </label>

                    <label className={styles.label} >
                        Password:
                        <input type="password" name="password" onChange={handleForm} className={styles.input} />
                    </label>

                    <button type="button" onClick={register}  className={styles.button}>
                        Sign Up
                    </button>

                    <button type="button" onClick={()=>{
                        signInWithGoogle();
                        navigate('/profileSetup')
                    }} className={styles.button}> 
                        Sign Up with Google
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