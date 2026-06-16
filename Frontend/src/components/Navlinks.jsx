import { PackageOpen, CircleUserRound, Info, UserPlus, LogIn } from 'lucide-react';
import styles from './NavLinks.module.css';
import { getUser, isLoggedIn } from '../auth.js';
import { useNavigate } from 'react-router-dom';

export default function NavLinks() {

    const loggedIn = isLoggedIn();
    const currentUser = loggedIn ? getUser() : null;
    const navigate = useNavigate();

    // Scroll to #about on any page
    const handleAboutUs = (e) => {
        e.preventDefault();
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            // Not on home page — navigate to home then scroll
            navigate('/#about');
        }
    };

    // Create order: guard if not logged in, otherwise create order & go to /pickup
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
                body: JSON.stringify({ userid: currentUser?.userid }),
            });
            if (response.status !== 201) {
                console.error('Error creating order');
                return;
            }
            navigate('/pickup');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className={styles.navLinksContainer}>
            <div className={styles.navLinks}>
                <a
                    href="#create-order"
                    onClick={handleCreateOrder}
                    className={styles.navLink}
                    id="create-order-link"
                >
                    <PackageOpen size={16} />
                    Create Order
                </a>

                <a
                    href="#about"
                    onClick={handleAboutUs}
                    className={styles.navLink}
                    id="about-link"
                >
                    <Info size={16} />
                    About Us
                </a>

                {loggedIn ? (
                    <button
                        onClick={() => navigate('/profile')}
                        className={styles.contactButton}
                        id="my-profile-btn"
                    >
                        <CircleUserRound size={18} className={styles.contactIcon} />
                        My Profile
                    </button>
                ) : (
                    <button
                        onClick={() => navigate('/register')}
                        className={styles.contactButton}
                        id="create-account-btn"
                    >
                        <UserPlus size={18} className={styles.contactIcon} />
                        Create Account
                    </button>
                )}
            </div>
        </div>
    );
}
