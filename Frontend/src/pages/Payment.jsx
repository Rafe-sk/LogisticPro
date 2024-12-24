import React, { useCallback, useEffect, useState } from 'react';
import styles from './Payment.module.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Firebase.js';
import { useNavigate } from 'react-router-dom';

function Payment() {
    const [user, loading, error] = useAuthState(auth);
    const [orderID, setOrderID] = useState('');
    const [userid, setUserID] = useState('');
    const [parcelDetails, setParcelDetails] = useState({
        orderID: '',
        breadth: '',
        height: '',
        length: '',
        weight: ''
    });

    const [paymentData, setPaymentData] = useState({
        orderID: '',
        price: 0,
        paymentMethod: 'COD',
    });

    // Effect to set the user ID when the user is logged in
    useEffect(() => {
        if (user) {
            setUserID(user.uid);
        }
    }, [user]);

    // Effect to fetch order ID based on user ID
    useEffect(() => {
        if (userid) {
            const fetchOrderID = async () => {
                const query = `
                  query Query($userid: String!) {
                    getOrder(userid: $userid) {
                      userid
                      orderID
                    }
                  }
                `;
                const variables = { userid };
                try {
                    const response = await fetch('http://localhost:8000/graphql', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ query, variables }),
                    });
                    const data = await response.json();
                    if (data?.data?.getOrder) {
                        setOrderID(data.data.getOrder.orderID);
                    } else {
                        console.error('No order found for the user');
                    }
                } catch (error) {
                    console.error('Error fetching order ID:', error);
                }
            };
            fetchOrderID();
        }
    }, [userid]);

    // Effect to fetch parcel details based on orderID
    useEffect(() => {
        if (orderID) {
            const fetchParcelDetails = async () => {
                const query = `
                    query Query($orderId: String!) {
                        getParcel(orderID: $orderId) {
                            breadth
                            height
                            length
                            weight
                        }
                    }
                `;
                const variables = { orderId: orderID };
                try {
                    const response = await fetch('http://localhost:8000/graphql', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ query, variables }),
                    });
                    const data = await response.json();
                    if (data?.data?.getParcel) {
                        setParcelDetails(data.data.getParcel);
                    } else {
                        console.error('No parcel details found');
                    }
                } catch (error) {
                    console.error('Error fetching parcel details:', error);
                }
            };
            fetchParcelDetails();
        }
    }, [orderID]);

    const calculatePrice = useCallback(() => {
        const { weight, length, breadth, height } = parcelDetails;
        if (weight && length && breadth && height) {
            const volume = Number(length) * Number(breadth) * Number(height);
            return volume * weight / 30;
        }
        return 0;
    }, [parcelDetails]);

    console.log(paymentData)

    // Set payment data when orderID is available
    useEffect(() => {
        if (orderID) {
            setPaymentData((prevPaymentData) => ({
                ...prevPaymentData,
                orderID: orderID,
                price: calculatePrice(),
            }));
        }
    }, [orderID]);

    // Handle payment data change
    const handlePaymentChange = (e) => {
        const { name, value } = e.target;
        setPaymentData({
            ...paymentData,
            [name]: value,
        });
    };

    

    // Submit payment data
    const handlePaymentSubmit = async () => {
        try {
            const response = await fetch('http://localhost:8000/payment/createPayment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData),
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error submitting payment:', error);
        }
    }

    const navigate = useNavigate();


    const submitPayment = async (e) => {
        e.preventDefault();
        handlePaymentSubmit();
        navigate('/home');
    }
    

    return (
        <div className={styles.container}>
            <h2>Payment Details</h2>
            {/* Display loading or error states */}
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}

            {/* Display order ID and parcel details */}
            <div className={styles.orderDetails}>
                <h3>Order ID: {orderID || 'No Order ID available'}</h3>
            </div>

            {/* Payment Form */}
            {orderID && (
                <form className={styles.paymentForm}>
                    <label className={styles.label}>
                        Price:
                        <input
                            type="number"
                            name="price"
                            readOnly
                            value={paymentData.price}
                            className={styles.input}
                            required
                        />
                    </label>

                    <label className={styles.label}>
                        Payment Method:
                        <select
                            name="paymentMethod"
                            value={paymentData.paymentMethod}
                            onChange={handlePaymentChange}
                            className={styles.select}
                            required
                        >
                            <option value="COD">COD</option>
                            <option value="Online">UPI</option>
                        </select>
                    </label>

                    <button onClick={submitPayment} className={styles.button}>
                        Submit Payment
                    </button>
                </form>
            )}
        </div>
    );
}

export default Payment;
