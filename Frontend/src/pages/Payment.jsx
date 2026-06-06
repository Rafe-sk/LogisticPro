import React, { useCallback, useEffect, useState } from 'react';
import styles from './Payment.module.css';
import { getUser } from '../auth.js';
import { useNavigate } from 'react-router-dom';

function Payment() {
    const currentUser = getUser();
    const userid = currentUser?.userid || '';

    const [orderID, setOrderID] = useState('');
    const [parcelDetails, setParcelDetails] = useState({ orderID: '', breadth: '', height: '', length: '', weight: '' });
    const [paymentData, setPaymentData] = useState({ orderID: '', price: 0, paymentMethod: 'COD' });

    useEffect(() => {
        if (userid) {
            const fetchOrderID = async () => {
                const query = `query Query($userid: String!) { getOrder(userid: $userid) { userid orderID } }`;
                const variables = { userid };
                try {
                    const response = await fetch('http://localhost:8000/graphql', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query, variables }) });
                    const data = await response.json();
                    if (data?.data?.getOrder) setOrderID(data.data.getOrder.orderID);
                } catch (error) { console.error('Error fetching order ID:', error); }
            };
            fetchOrderID();
        }
    }, [userid]);

    useEffect(() => {
        if (orderID) {
            const fetchParcelDetails = async () => {
                const query = `query Query($orderId: String!) { getParcel(orderID: $orderId) { breadth height length weight } }`;
                const variables = { orderId: orderID };
                try {
                    const response = await fetch('http://localhost:8000/graphql', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query, variables }) });
                    const data = await response.json();
                    if (data?.data?.getParcel) setParcelDetails(data.data.getParcel);
                } catch (error) { console.error('Error fetching parcel details:', error); }
            };
            fetchParcelDetails();
        }
    }, [orderID]);

    const calculatePrice = useCallback(() => {
        const { weight, length, breadth, height } = parcelDetails;
        if (weight && length && breadth && height) return Number(length) * Number(breadth) * Number(height) * weight / 30;
        return 0;
    }, [parcelDetails]);

    useEffect(() => {
        if (orderID) setPaymentData((prev) => ({ ...prev, orderID, price: calculatePrice() }));
    }, [orderID]);

    const handlePaymentChange = (e) => setPaymentData({ ...paymentData, [e.target.name]: e.target.value });

    const handlePaymentSubmit = async () => {
        try {
            const response = await fetch('http://localhost:8000/payment/createPayment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(paymentData) });
            const data = await response.json();
            console.log(data);
        } catch (error) { console.error('Error submitting payment:', error); }
    };

    const navigate = useNavigate();
    const submitPayment = async (e) => { e.preventDefault(); handlePaymentSubmit(); navigate('/home'); };

    return (
        <div className={styles.container}>
            <h2>Payment Details</h2>
            <div className={styles.orderDetails}>
                <h3>Order ID: {orderID || 'No Order ID available'}</h3>
            </div>
            {orderID && (
                <form className={styles.paymentForm}>
                    <label className={styles.label}>
                        Price:
                        <input type="number" name="price" readOnly value={paymentData.price} className={styles.input} required />
                    </label>
                    <label className={styles.label}>
                        Payment Method:
                        <select name="paymentMethod" value={paymentData.paymentMethod} onChange={handlePaymentChange} className={styles.select} required>
                            <option value="COD">COD</option>
                            <option value="Online">UPI</option>
                        </select>
                    </label>
                    <button onClick={submitPayment} className={styles.button}>Submit Payment</button>
                </form>
            )}
        </div>
    );
}

export default Payment;
