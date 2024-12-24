import styles from './Profile.module.css'
import { auth, logOut } from '../Firebase';
import { useAuthState } from 'react-firebase-hooks/auth'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const [userData, setUserData] = useState({
        address: '',
        city: '',
        email: '',
        name: '',
        phone: '',
        pincode: '',
        state: ''
    });

    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [paymentDetails, setPaymentDetails] = useState(null);  // New state for payment details
    const [activeTab, setActiveTab] = useState('profile');  // State for active tab (profile or orders)

    const [user, loading, error] = useAuthState(auth);

    // Fetch user data based on email
    const fetchUserData = async () => {
        const query = `
            query GetUser($email: String!) {
                getUserByEmail(email: $email) {
                    address
                    city
                    email
                    name
                    phone
                    pincode
                    state
                }
            }
        `;

        const variables = { email: user.email }

        try {
            const response = await fetch('http://localhost:8000/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query,
                    variables
                })
            });
            const data = await response.json();
            setUserData(data.data.getUserByEmail);
        }
        catch (error) {
            console.log(error);
        }
    };

    // Fetch orders data based on email
    const fetchOrders = async () => {
        const query = `
            query GetOrders($email: String!) {
                getOrdersByUser(email: $email) {
                    orderId
                    date
                    status
                    totalAmount
                }
            }
        `;
        
        const variables = { email: user.email };

        try {
            const response = await fetch('http://localhost:8000/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query,
                    variables
                })
            });
            const data = await response.json();
            setOrders(data.data.getOrdersByUser);
        } catch (error) {
            console.log(error);
        }
    };

    // Fetch payment details based on selected order
    const fetchPaymentDetails = async (orderId) => {
        const query = `
            query GetPayment($orderId: String!) {
                getPayment(orderID: $orderId) {
                    date
                    paymentMethod
                    paymentStatus
                    price
                }
            }
        `;
        
        const variables = { orderId };

        try {
            const response = await fetch('http://localhost:8000/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query,
                    variables
                })
            });
            const data = await response.json();
            setPaymentDetails(data.data.getPayment);  // Set payment details state
        } catch (error) {
            console.log(error);
        }
    };

    // Fetch both user data and orders when user is authenticated
    useEffect(() => {
        if (user) {
            fetchUserData(user.email);
            fetchOrders(); // Call the fetchOrders function here
        }
    }, [user]);

    return (
        <>
            <div className={styles.container}>
                <div className={styles.dashboardContainer}>
                    <h2 className={styles.title}>Dashboard</h2>

                    {/* Tab navigation */}
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tab} ${activeTab === 'profile' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('profile')}
                        >
                            Profile
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'orders' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('orders')}
                        >
                            Orders
                        </button>
                    </div>

                    {/* Tab content */}
                    <div className={styles.tabContent}>
                        {activeTab === 'profile' && (
                            <div className={styles.profile}>
                                <div className={styles.profileDetails}>
                                    <p className={styles.label}>Name: {userData.name}</p>
                                    <p className={styles.label}>Email: {userData.email}</p>
                                    <p className={styles.label}>Phone: {userData.phone}</p>
                                    <p className={styles.label}>Address: {userData.address}</p>
                                    <p className={styles.label}>City: {userData.city}</p>
                                    <p className={styles.label}>Pincode: {userData.pincode}</p>
                                    <p className={styles.label}>State: {userData.state}</p>
                                </div>
                            </div>
                        )}
                        
                        {activeTab === 'orders' && (
                            <div className={styles.orders}>
                                <h3>Your Orders</h3>
                                {orders.length === 0 ? (
                                    <p>No orders found</p>
                                ) : (
                                    <ul>
                                        {orders.map(order => (
                                            <li key={order.orderId} onClick={() => fetchPaymentDetails(order.orderId)}>
                                                <p>Order ID: {order.orderId}</p>
                                                <p>Date: {order.date}</p>
                                                <p>Status: {order.status}</p>
                                                <p>Total Amount: ${order.totalAmount}</p>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {/* Payment details display */}
                                {paymentDetails && (
                                    <div className={styles.paymentDetails}>
                                        <h4>Payment Details</h4>
                                        <p>Date: {paymentDetails.date}</p>
                                        <p>Payment Method: {paymentDetails.paymentMethod}</p>
                                        <p>Status: {paymentDetails.paymentStatus}</p>
                                        <p>Price: ${paymentDetails.price}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <a href="/" className={styles.backLink}>Back</a>
                </div>
               <a href="/register" className={styles.logOut} onClick={logOut}>Logout</a>
            </div>
        </>
    )
}

export default Profile;
