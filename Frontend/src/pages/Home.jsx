import React, { useEffect } from 'react';
import styles from './Home.module.css';
import Navigation from '../components/Navigation';
import { logOut, isLoggedIn } from '../auth.js';
import { useNavigate } from 'react-router-dom';
import TrackingForm from './TrackingForm';

function Home() {

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <>
      <Navigation />
      <div className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroGrid}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>
                <span className={styles.highlight}>DISCOVER</span> WITH OUR
                <br />
                INTEGRATED <span className={styles.highlight}>LOGISTICS</span>
              </h1>
              <p className={styles.heroSubtitle}>
                We Deliver, Track and Shipping
              </p>
              <TrackingForm />
            </div>

            <div className={styles.heroImageContainer}>
              <img
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
                alt="Logistics truck"
                className={styles.heroImage}
              />
              <div className={styles.heroOverlay}></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
