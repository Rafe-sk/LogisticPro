import React, { useEffect, useState } from 'react';
import styles from './Pickup.module.css';
import { getUser, isLoggedIn } from '../auth.js';
import { useNavigate } from 'react-router-dom';
import StepProgress from '../components/StepProgress';
import { MapPin, Phone, Building2, Hash, Map, User, Landmark, Home, Briefcase, Warehouse } from 'lucide-react';

function Pickup() {
    const navigate = useNavigate();

    // Auth guard
    useEffect(() => {
        if (!isLoggedIn()) navigate('/login');
    }, [navigate]);

    const currentUser = getUser();
    const userid = currentUser?.userid || '';

    const [orderID, setOrderID] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        orderID: '',
        senderName: '',
        address: '',
        landmark: '',
        contact: '',
        city: '',
        pincode: '',
        state: '',
        addressType: 'home',
        saveAddress: false,
    });

    // Fetch the latest order for this user
    useEffect(() => {
        if (!userid) return;
        const fetchOrder = async () => {
            const query = `
                query Query($userid: String!) {
                    getOrder(userid: $userid) { userid orderID }
                }
            `;
            try {
                const res = await fetch('http://localhost:8000/graphql', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query, variables: { userid } }),
                });
                const data = await res.json();
                if (data.data?.getOrder) {
                    const oid = data.data.getOrder.orderID;
                    setOrderID(oid);
                    setForm(prev => ({ ...prev, orderID: oid }));
                }
            } catch (err) {
                console.error('Error fetching order:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [userid]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async () => {
        if (!form.address || !form.contact || !form.city || !form.pincode || !form.state) {
            setError('Please fill in all required fields');
            return;
        }
        setError('');
        setSubmitting(true);
        try {
            const res = await fetch('http://localhost:8000/address/createPickupAddress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (res.status !== 201) throw new Error('Failed to save pickup address');
            navigate('/delivery');
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const addressTypes = [
        { value: 'home', label: 'Home', icon: <Home size={16} /> },
        { value: 'office', label: 'Office', icon: <Briefcase size={16} /> },
        { value: 'warehouse', label: 'Warehouse', icon: <Warehouse size={16} /> },
    ];

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Loading your order…</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <StepProgress currentStep={1} />

            <div className={styles.pageHeader}>
                <div className={styles.stepBadge}>Step 1 of 4</div>
                <h1 className={styles.pageTitle}>Pickup Address</h1>
                <p className={styles.pageSubtitle}>Where should we collect the parcel from?</p>
                {orderID && <div className={styles.orderTag}>📋 Order: <strong>{orderID}</strong></div>}
            </div>

            {error && <div className={styles.errorBox}>⚠️ {error}</div>}

            <div className={styles.formCard}>
                {/* Sender Info */}
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Sender Details</h3>
                    <div className={styles.fieldGrid}>
                        <label className={styles.label}>
                            <span className={styles.labelText}><User size={13} /> Sender Name</span>
                            <input
                                type="text"
                                name="senderName"
                                value={form.senderName}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="John Doe"
                                id="pickup-sender-name"
                            />
                        </label>
                        <label className={styles.label}>
                            <span className={styles.labelText}><Phone size={13} /> Contact Number *</span>
                            <input
                                type="tel"
                                name="contact"
                                value={form.contact}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="+91 98765 43210"
                                id="pickup-contact"
                            />
                        </label>
                    </div>
                </div>

                {/* Address */}
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Address Details</h3>

                    <label className={styles.label}>
                        <span className={styles.labelText}><MapPin size={13} /> Street Address *</span>
                        <input
                            type="text"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="123 Main Street, Area/Colony"
                            id="pickup-address"
                        />
                    </label>

                    <label className={styles.label}>
                        <span className={styles.labelText}><Landmark size={13} /> Landmark</span>
                        <input
                            type="text"
                            name="landmark"
                            value={form.landmark}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="Near City Mall, Opposite Park…"
                            id="pickup-landmark"
                        />
                    </label>

                    <div className={styles.inlineGroup}>
                        <label className={styles.label}>
                            <span className={styles.labelText}><Building2 size={13} /> City *</span>
                            <input
                                type="text"
                                name="city"
                                value={form.city}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="Mumbai"
                                id="pickup-city"
                            />
                        </label>
                        <label className={styles.label}>
                            <span className={styles.labelText}><Hash size={13} /> Pincode *</span>
                            <input
                                type="text"
                                name="pincode"
                                value={form.pincode}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="400001"
                                maxLength={6}
                                id="pickup-pincode"
                            />
                        </label>
                    </div>

                    <label className={styles.label}>
                        <span className={styles.labelText}><Map size={13} /> State *</span>
                        <input
                            type="text"
                            name="state"
                            value={form.state}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="Maharashtra"
                            id="pickup-state"
                        />
                    </label>
                </div>

                {/* Address Type */}
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Address Type</h3>
                    <div className={styles.typeRow}>
                        {addressTypes.map(t => (
                            <button
                                key={t.value}
                                type="button"
                                className={`${styles.typeBtn} ${form.addressType === t.value ? styles.typeBtnActive : ''}`}
                                onClick={() => setForm(prev => ({ ...prev, addressType: t.value }))}
                                id={`pickup-type-${t.value}`}
                            >
                                {t.icon} {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Save Address */}
                <label className={styles.saveLabel}>
                    <input
                        type="checkbox"
                        name="saveAddress"
                        checked={form.saveAddress}
                        onChange={handleChange}
                        className={styles.checkbox}
                        id="pickup-save"
                    />
                    <span className={styles.saveText}>Save this address for future orders</span>
                </label>

                {/* Actions */}
                <div className={styles.actions}>
                    <button
                        className={styles.secondaryBtn}
                        onClick={() => navigate('/home')}
                        type="button"
                    >
                        ← Back
                    </button>
                    <button
                        className={styles.primaryBtn}
                        onClick={handleSubmit}
                        disabled={submitting}
                        id="pickup-next-btn"
                    >
                        {submitting ? 'Saving…' : 'Next: Delivery Address →'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Pickup;
