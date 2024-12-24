import React, { useState } from 'react'
import styles from './TrackingForm.module.css'
import { useNavigate } from 'react-router-dom'

function TrackingForm() {

  const navigate = useNavigate();
  const [orderId, setOrderId] = useState('');

  const handleInputChange = (e) => {
    setOrderId(e.target.value)
  }

  console.log(orderId)

  const handleTrack = () => {
    navigate('/tracking')
  }


  return (
   <>
   <div className={styles.container}>
      <div className={styles.buttonGroup}>
        <button className={styles.trackingButton}>TRACKING</button>
      </div>
      
      <div className={styles.inputWrapper}>
        <input
          type="text"
          onChange={handleInputChange}
          placeholder="Order ID"
          className={styles.input}
        />
        <svg 
          className={styles.icon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <button onClick={handleTrack} className={styles.trackButton}>TRACK</button>
      </div>
      
      <p className={styles.helpText}>
        See the tracking id on shipping document.{' '}
        <a href="#help" className={styles.helpLink}>
          Help
          <svg 
            className={styles.arrowIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14m-7-7 7 7-7 7" />
          </svg>
        </a>
      </p>
    </div>
   </>
  )
}

export default TrackingForm