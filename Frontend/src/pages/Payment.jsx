import React, { useCallback, useEffect, useState } from 'react';
import styles from './Payment.module.css';
import { getUser, isLoggedIn } from '../auth.js';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, Package, CheckCircle2 } from 'lucide-react';
import StepProgress from '../components/StepProgress';

function Payment() {
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn()) navigate('/login');
    }, [navigate]);

    const currentUser = getUser();
    const userid = currentUser?.userid || '';

    const [orderID, setOrderID] = useState('');
    const [parcelDetails, setParcelDetails] = useState({ orderID: '', breadth: '', height: '', length: '', weight: '' });
    const [paymentData, setPaymentData] = useState({ orderID: '', price: 0, paymentMethod: 'COD' });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (!userid) return;
        const fetchOrderID = async () => {
            const query = `query Query($userid: String!) { getOrder(userid: $userid) { userid orderID } }`;
            try {
                const response = await fetch('http://localhost:8000/graphql', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query, variables: { userid } })
                });
                const data = await response.json();
                if (data?.data?.getOrder) {
                    const oid = data.data.getOrder.orderID;
                    setOrderID(oid);
                    setPaymentData(prev => ({ ...prev, orderID: oid }));
                }
            } catch (error) {
                console.error('Error fetching order ID:', error);
            }
        };
        fetchOrderID();
    }, [userid]);

    useEffect(() => {
        if (!orderID) return;
        const fetchParcelDetails = async () => {
            const query = `query Query($orderId: String!) { getParcel(orderID: $orderId) { breadth height length weight } }`;
            try {
                const response = await fetch('http://localhost:8000/graphql', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query, variables: { orderId: orderID } })
                });
                const data = await response.json();
                if (data?.data?.getParcel) setParcelDetails(data.data.getParcel);
            } catch (error) {
                console.error('Error fetching parcel details:', error);
            }
        };
        fetchParcelDetails();
    }, [orderID]);

    // Fixed: recalculate whenever parcelDetails changes, not just orderID
    const calculatePrice = useCallback(() => {
        const { weight, length, breadth, height } = parcelDetails;
        if (weight && length && breadth && height) {
            return Math.round((Number(length) * Number(breadth) * Number(height) * Number(weight)) / 30);
        }
        return 0;
    }, [parcelDetails]);

    useEffect(() => {
        const price = calculatePrice();
        setPaymentData(prev => ({ ...prev, price }));
    }, [calculatePrice]);

    const handlePaymentChange = (e) => setPaymentData({ ...paymentData, [e.target.name]: e.target.value });

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await fetch('http://localhost:8000/payment/createPayment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentData)
            });
            const data = await response.json();
            setSubmitted(true);
            setTimeout(() => navigate('/home'), 2000);
        } catch (error) {
            console.error('Error submitting payment:', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className={styles.successContainer}>
                <div className={styles.successCard}>
                    <CheckCircle2 size={60} className={styles.successIcon} />
                    <h2 className={styles.successTitle}>Order Placed!</h2>
                    <p className={styles.successText}>Your shipment has been successfully booked. Redirecting to home…</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <StepProgress currentStep={4} />
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Payment</h1>
                <p className={styles.pageSubtitle}>Review your order and complete payment</p>
            </div>

            <div className={styles.paymentGrid}>
                {/* Order Summary Card */}
                <div className={styles.summaryCard}>
                    <h3 className={styles.cardTitle}>
                        <Package size={18} /> Order Summary
                    </h3>

                    <div className={styles.summaryRow}>
                        <span className={styles.summaryLabel}>Order ID</span>
                        <span className={styles.summaryValue}>{orderID || '—'}</span>
                    </div>

                    {parcelDetails.weight && (
                        <>
                            <div className={styles.summaryRow}>
                                <span className={styles.summaryLabel}>Weight</span>
                                <span className={styles.summaryValue}>{parcelDetails.weight} kg</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span className={styles.summaryLabel}>Dimensions</span>
                                <span className={styles.summaryValue}>
                                    {parcelDetails.length || '—'} × {parcelDetails.breadth || '—'} × {parcelDetails.height || '—'} cm
                                </span>
                            </div>
                        </>
                    )}

                    <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                        <span className={styles.totalLabel}>Total Amount</span>
                        <span className={styles.totalAmount}>₹{paymentData.price}</span>
                    </div>
                </div>

                {/* Payment Form */}
                {orderID && (
                    <div className={styles.formCard}>
                        <h3 className={styles.cardTitle}>
                            <CreditCard size={18} /> Payment Method
                        </h3>

                        <form className={styles.paymentForm} onSubmit={handlePaymentSubmit}>
                            <div className={styles.methodOptions}>
                                <label className={`${styles.methodOption} ${paymentData.paymentMethod === 'COD' ? styles.selected : ''}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="COD"
                                        checked={paymentData.paymentMethod === 'COD'}
                                        onChange={handlePaymentChange}
                                        className={styles.radioInput}
                                    />
                                    <Truck size={24} />
                                    <div>
                                        <span className={styles.methodName}>Cash on Delivery</span>
                                        <span className={styles.methodDesc}>Pay when delivered</span>
                                    </div>
                                </label>

                                <label className={`${styles.methodOption} ${paymentData.paymentMethod === 'Online' ? styles.selected : ''}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="Online"
                                        checked={paymentData.paymentMethod === 'Online'}
                                        onChange={handlePaymentChange}
                                        className={styles.radioInput}
                                    />
                                    <CreditCard size={24} />
                                    <div>
                                        <span className={styles.methodName}>UPI / Online</span>
                                        <span className={styles.methodDesc}>Pay securely online</span>
                                    </div>
                                </label>
                            </div>

                            <div className={styles.priceConfirm}>
                                <span>You will pay:</span>
                                <span className={styles.confirmPrice}>₹{paymentData.price}</span>
                            </div>

                            <div className={styles.formActions}>
                                <button
                                    type="button"
                                    className={styles.backBtn}
                                    onClick={() => navigate('/parcel')}
                                >
                                    ← Back
                                </button>
                                <button
                                    type="submit"
                                    className={styles.button}
                                    disabled={submitting}
                                    id="submit-payment-btn"
                                >
                                    {submitting ? 'Processing…' : `Confirm & Pay ₹${paymentData.price}`}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {!orderID && (
                    <div className={styles.formCard}>
                        <div className={styles.loadingState}>
                            <div className={styles.spinner}></div>
                            <p>Loading order details…</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Payment;
