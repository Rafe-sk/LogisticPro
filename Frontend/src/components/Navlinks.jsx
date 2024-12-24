import { CircleUserRound } from 'lucide-react';
import styles from './NavLinks.module.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Firebase';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NavLinks() {

    const [user, loading, error] = useAuthState(auth);
    const  userid = user.uid;

    useEffect(() => {
        if (loading) return;
        if (!user) {
            navigate('/home');
        }
    })

    const navigate = useNavigate();

    const createOrder = async () =>{
        fetch('http://localhost:8000/order/createOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userid: userid
            })
        })
        .then(response =>{
            if(response.status !== 201){
                console.log('There was an error')
            }
            return response.json()
        } )
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    const whenClicked = () => {
        navigate('/profile');
    }
    
    return (
        <div className={styles.navLinksContainer}>
            <div className={styles.navLinks}>

                <a href='/createOrder' onClick={createOrder} className={styles.navLink}>
                    Create Order
                </a>
                <a href="/about" className={styles.navLink}>
                    About Us
                </a>
                <button onClick={whenClicked} className={styles.contactButton}>
                    <CircleUserRound size={20} className={styles.contactIcon} />
                    My Account
                </button>
            </div>
        </div>
    );
}
