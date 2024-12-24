import styles from './ProfileSetup.module.css'
import { auth } from '../Firebase.js'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProfileSetup() {

  const [form, setForm] = useState({
    userid: '',
    name: '',
    email: '',
    phone: '',
    role: '',
    address: '',
    city: '',
    pincode: '',
    state: ''
  })

  const navigate = useNavigate();

  const [user, loading, error] = useAuthState(auth);
  console.log(user)

  console.log(form)

  useEffect(() => {
    if (user) {
      setForm(prevForm => ({
        ...prevForm,
        userid: user.uid,
        email: user.email
      }));
    }
  }, [user]);


  const handleForm = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  console.log(form)

  const submitForm = async () => {

    fetch('http://localhost:8000/user/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    })
      .then((response) => {

        if (response.status !== 201) {
          console.log('There was an error')
        }
        else {
          return response.json()
        }
      })
      .then((data) => {
        console.log(data)
      })
      .catch((error) => {
        console.log(error)
      })

  }

  return (

    <>
      <div className={styles.container}>

        <form className={styles.form}>
          <h2 className={styles.title}>Profile</h2>

          <label className={styles.label}>
            Name:
            <input type="text" name='name' onChange={handleForm} className={styles.input} />
          </label>

          <label className={styles.label}>
            Email:
            <input type="text" name='email' value={user.email} className={styles.input} />
          </label>

          <label className={styles.label}>
            Phone:
            <input type="text" name='phone' onChange={handleForm} className={styles.input} />
          </label>

          <label className={styles.label}>
            Role:
            <select name="role" onChange={handleForm} className={styles.input}>
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="delivery agent">Delivery Agent</option>
            </select>
          </label>

          <label className={styles.label}>
            Address:
            <textarea name="address" className={styles.input} onChange={handleForm} rows={2}placeholder="Enter your full address"/>
          </label>
          
          <div className={styles.inlineGroup}>
          <label className={styles.inlinelabel}>
            City:
            <input type="text" name="city" className={styles.input} onChange={handleForm} placeholder="Enter your city"/>
          </label>

          <label className={styles.inlinelabel}>
            Pincode:
            <input type="text" name="pincode" className={styles.input} onChange={handleForm} placeholder="Enter your pincode"/>
          </label>
          </div>

          <label className={styles.label}>
            State:
            <input type="text" name="state" className={styles.input} onChange={handleForm} placeholder="Enter your state"/>
          </label>

          <button type="submit" onClick={() => {
            submitForm(),
              navigate('/')
          }} className={styles.button}>Submit</button>

        </form>

      </div>
    </>
  )
}

export default ProfileSetup