import React from 'react';
import styles from './Home.module.css';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn, getUser } from '../auth.js';
import TrackingForm from './TrackingForm';

function Home() {
    const navigate = useNavigate();
    const loggedIn = isLoggedIn();
    const user = loggedIn ? getUser() : null;

    // Create Order — guard for non-logged-in users
    const handleCreateOrder = async (e) => {
        e.preventDefault();
        if (!loggedIn) {
            navigate('/login?redirect=order');
            return;
        }
        try {
            const response = await fetch('http://localhost:8000/order/createOrder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userid: user?.userid }),
            });
            if (response.status !== 201) throw new Error('Failed to create order');
            navigate('/pickup');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className={styles.page}>

            {/* ── HERO ─────────────────────────────────────────────── */}
            <section className={styles.hero}>
                <div className={styles.heroContainer}>
                    <div className={styles.heroGrid}>
                        <div className={styles.heroText}>
                            <div className={styles.badge}>🚀 Fast &amp; Reliable Delivery</div>
                            <h1 className={styles.heroTitle}>
                                <span className={styles.highlight}>DISCOVER</span> WITH OUR
                                <br />
                                INTEGRATED <span className={styles.highlight}>LOGISTICS</span>
                            </h1>
                            <p className={styles.heroSubtitle}>
                                We Deliver, Track and Ship your parcels anywhere — fast, safe, and reliable. 
                                Book a pickup in under 2 minutes.
                            </p>
                            <div className={styles.heroCTAs}>
                                <button className={styles.ctaPrimary} onClick={handleCreateOrder} id="hero-create-order">
                                    {loggedIn ? 'Create Order →' : 'Ship Now →'}
                                </button>
                                <a href="#about" className={styles.ctaSecondary} onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }}>
                                    Learn More
                                </a>
                            </div>
                            <TrackingForm />
                        </div>

                        <div className={styles.heroImageContainer}>
                            <img
                                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
                                alt="Logistics truck on highway"
                                className={styles.heroImage}
                            />
                            <div className={styles.heroOverlay}></div>
                            <div className={styles.statCard}>
                                <span className={styles.statNumber}>50K+</span>
                                <span className={styles.statLabel}>Deliveries Made</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FEATURES ROW ─────────────────────────────────────── */}
            <div className={styles.featuresRow}>
                {[
                    { icon: '📦', text: 'Real-time Tracking' },
                    { icon: '🛡️', text: 'Insured Parcels' },
                    { icon: '⚡', text: 'Express Delivery' },
                    { icon: '🌍', text: 'Pan-India Coverage' },
                ].map((f, i) => (
                    <React.Fragment key={f.text}>
                        <div className={styles.featureItem}>
                            <span className={styles.featureIcon}>{f.icon}</span>
                            <span className={styles.featureText}>{f.text}</span>
                        </div>
                        {i < 3 && <div className={styles.featureDivider}></div>}
                    </React.Fragment>
                ))}
            </div>

            {/* ── HOW IT WORKS ─────────────────────────────────────── */}
            <section className={styles.howSection}>
                <div className={styles.sectionContainer}>
                    <span className={styles.sectionBadge}>Simple Process</span>
                    <h2 className={styles.sectionTitle}>How It Works</h2>
                    <p className={styles.sectionSubtitle}>Ship your parcel in 4 easy steps — no paperwork, no hassle.</p>

                    <div className={styles.stepsGrid}>
                        {[
                            { step: '01', icon: '📋', title: 'Create Account', desc: 'Sign up in seconds and set up your sender profile with your address and contact details.' },
                            { step: '02', icon: '📦', title: 'Enter Addresses', desc: 'Provide your pickup location and where the parcel needs to be delivered.' },
                            { step: '03', icon: '⚖️', title: 'Parcel Details', desc: 'Tell us the weight, dimensions, and type of parcel so we can calculate the best rate.' },
                            { step: '04', icon: '💳', title: 'Pay & Confirm', desc: 'Choose your payment method — Cash on Delivery or online — and book instantly.' },
                        ].map((s) => (
                            <div className={styles.stepCard} key={s.step}>
                                <div className={styles.stepNum}>{s.step}</div>
                                <div className={styles.stepIconBox}>{s.icon}</div>
                                <h3 className={styles.stepTitle}>{s.title}</h3>
                                <p className={styles.stepDesc}>{s.desc}</p>
                            </div>
                        ))}
                    </div>

                    <button className={styles.ctaPrimary} onClick={handleCreateOrder} id="how-create-order">
                        Get Started →
                    </button>
                </div>
            </section>

            {/* ── ABOUT US ─────────────────────────────────────────── */}
            <section className={styles.aboutSection} id="about">
                <div className={styles.sectionContainer}>
                    <div className={styles.aboutGrid}>
                        <div className={styles.aboutText}>
                            <span className={styles.sectionBadge}>Who We Are</span>
                            <h2 className={styles.sectionTitle}>About LogisticPro</h2>
                            <p className={styles.aboutPara}>
                                LogisticPro is India's fastest-growing digital logistics platform, connecting
                                businesses and individuals with a reliable nationwide delivery network. Founded
                                with a mission to make shipping <strong>simple, transparent, and affordable</strong>,
                                we have facilitated over 50,000 deliveries across 500+ cities.
                            </p>
                            <p className={styles.aboutPara}>
                                Our technology-first approach means real-time tracking, instant pricing,
                                and doorstep pickup — all from a single dashboard. Whether you're shipping
                                a document across town or a heavy cargo across the country, LogisticPro
                                has the right solution for you.
                            </p>

                            <div className={styles.statsRow}>
                                {[
                                    { num: '50K+', label: 'Orders Delivered' },
                                    { num: '500+', label: 'Cities Covered' },
                                    { num: '98%', label: 'On-Time Rate' },
                                    { num: '24/7', label: 'Support' },
                                ].map(s => (
                                    <div className={styles.statItem} key={s.label}>
                                        <span className={styles.statNum}>{s.num}</span>
                                        <span className={styles.statLbl}>{s.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.aboutImageWrap}>
                            <img
                                src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                alt="Logistics warehouse"
                                className={styles.aboutImage}
                            />
                            <div className={styles.aboutBadgeFloating}>
                                <span>🏆</span>
                                <div>
                                    <strong>Top Rated</strong>
                                    <span>Logistics Platform 2024</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── WHY CHOOSE US ────────────────────────────────────── */}
            <section className={styles.whySection}>
                <div className={styles.sectionContainer}>
                    <span className={styles.sectionBadge}>Our Advantage</span>
                    <h2 className={styles.sectionTitle}>Why Choose LogisticPro?</h2>

                    <div className={styles.whyGrid}>
                        {[
                            { icon: '🗺️', title: 'Pan-India Network', desc: 'We cover 500+ cities and towns across every state in India with our partner delivery agents.' },
                            { icon: '📡', title: 'Live Tracking', desc: 'Track your parcel in real-time from pickup to doorstep delivery with instant status updates.' },
                            { icon: '🔒', title: 'Parcel Insurance', desc: 'Every shipment is insured. In the rare case of damage or loss, we have you fully covered.' },
                            { icon: '💰', title: 'Best Pricing', desc: 'Transparent, weight-based pricing with no hidden fees. Compare rates instantly online.' },
                            { icon: '⚡', title: 'Express Options', desc: 'Need it there today? Our express slots guarantee same-day or next-day delivery.' },
                            { icon: '🤝', title: '24/7 Support', desc: 'Our support team is available around the clock via chat, phone, or email to assist you.' },
                        ].map(w => (
                            <div className={styles.whyCard} key={w.title}>
                                <div className={styles.whyIcon}>{w.icon}</div>
                                <h3 className={styles.whyTitle}>{w.title}</h3>
                                <p className={styles.whyDesc}>{w.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA BANNER ───────────────────────────────────────── */}
            <section className={styles.ctaBanner}>
                <div className={styles.sectionContainer}>
                    <h2 className={styles.ctaBannerTitle}>Ready to Ship?</h2>
                    <p className={styles.ctaBannerSubtitle}>Join thousands of customers who trust LogisticPro every day.</p>
                    <div className={styles.ctaBannerBtns}>
                        <button className={styles.ctaPrimary} onClick={handleCreateOrder} id="banner-create-order">
                            Create Order Now →
                        </button>
                        {!loggedIn && (
                            <button className={styles.ctaSecondary} onClick={() => navigate('/register')}>
                                Sign Up Free
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* ── FOOTER ───────────────────────────────────────────── */}
            <footer className={styles.footer}>
                <div className={styles.footerContainer}>
                    <div className={styles.footerBrand}>
                        <span className={styles.footerLogo}>LogisticPro</span>
                        <p className={styles.footerTagline}>Fast. Safe. Reliable.</p>
                    </div>
                    <div className={styles.footerLinks}>
                        <a href="#about" onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }} className={styles.footerLink}>About Us</a>
                        <a href="#how" onClick={(e) => { e.preventDefault(); document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' }); }} className={styles.footerLink}>How It Works</a>
                        {!loggedIn && <button className={styles.footerLinkBtn} onClick={() => navigate('/login')}>Sign In</button>}
                        {!loggedIn && <button className={styles.footerLinkBtn} onClick={() => navigate('/register')}>Create Account</button>}
                        {loggedIn && <button className={styles.footerLinkBtn} onClick={() => navigate('/profile')}>My Profile</button>}
                        {loggedIn && <button className={styles.footerLinkBtn} onClick={() => navigate('/orders')}>My Orders</button>}
                    </div>
                </div>
                <div className={styles.footerBottom}>
                    <p>© 2024 LogisticPro. All rights reserved.</p>
                </div>
            </footer>

        </div>
    );
}

export default Home;
