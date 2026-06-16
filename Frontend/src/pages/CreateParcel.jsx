import React, { useEffect, useState } from 'react';
import { getUser, isLoggedIn } from '../auth.js';
import styles from './CreateParcel.module.css';
import { useNavigate } from 'react-router-dom';
import { Package, Weight, Ruler, AlertTriangle, FileText } from 'lucide-react';
import StepProgress from '../components/StepProgress';

function CreateParcel() {

    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn()) navigate('/login');
    }, [navigate]);

    const currentUser = getUser();
    const userid = currentUser?.userid || '';
    const [orderID, setOrderID] = useState('');

    useEffect(() => {
        if (!userid) return;
        const fetchOrderID = async () => {
            const query = `
              query Query($userid: String!) {
                getOrder(userid: $userid) {
                  userid
                  orderID
                }
              }
            `;
            try {
                const response = await fetch('http://localhost:8000/graphql', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query, variables: { userid } }),
                });
                const data = await response.json();
                if (data.data?.getOrder) {
                    const oid = data.data.getOrder.orderID;
                    setOrderID(oid);
                    setParcelData(prev => ({ ...prev, orderID: oid }));
                }
            } catch (error) {
                console.error('Error fetching order ID:', error);
            }
        };
        fetchOrderID();
    }, [userid]);

    const [parcelData, setParcelData] = useState({
        orderID: '',
        parcelType: 'document',
        weight: '',
        length: '',
        breadth: '',
        height: '',
        fragile: false,
        description: '',
    });

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setParcelData({
            ...parcelData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const isDimensionRequired = ['Box', 'Suitcase', 'Backpack', 'Other'].includes(parcelData.parcelType);

    const submitParcelForm = async () => {
        const response = await fetch('http://localhost:8000/parcel/createParcel', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parcelData),
        });
        if (response.status !== 201) throw new Error('Failed to save parcel details');
        return response.json();
    };

    const submitButton = async () => {
        if (!parcelData.weight) { setError('Please enter the parcel weight'); return; }
        setError('');
        setSubmitting(true);
        try {
            await submitParcelForm();
            navigate('/payment');
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const parcelTypes = [
        { value: 'document', label: 'Document', icon: '📄' },
        { value: 'Box', label: 'Box', icon: '📦' },
        { value: 'Suitcase', label: 'Suitcase', icon: '🧳' },
        { value: 'Backpack', label: 'Backpack', icon: '🎒' },
        { value: 'Other', label: 'Other', icon: '🗃️' },
    ];

    return (
        <div className={styles.container}>
            <StepProgress currentStep={3} />
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Parcel Details</h1>
                <p className={styles.pageSubtitle}>Tell us about what you're shipping</p>
                {orderID && <div className={styles.orderBadge}>Order: {orderID}</div>}
            </div>

            {error && <div className={styles.errorBox}>⚠️ {error}</div>}

            <div className={styles.formCard}>
                {/* Parcel Type */}
                <div className={styles.section}>
                    <label className={styles.sectionLabel}>
                        <Package size={16} /> Parcel Type
                    </label>
                    <div className={styles.typeGrid}>
                        {parcelTypes.map(t => (
                            <button
                                key={t.value}
                                type="button"
                                className={`${styles.typeOption} ${parcelData.parcelType === t.value ? styles.typeSelected : ''}`}
                                onClick={() => setParcelData({ ...parcelData, parcelType: t.value })}
                            >
                                <span className={styles.typeIcon}>{t.icon}</span>
                                <span className={styles.typeLabel}>{t.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Weight */}
                <div className={styles.section}>
                    <label className={styles.sectionLabel}>
                        <Weight size={16} /> Weight (kg) *
                    </label>
                    <input
                        className={styles.input}
                        type="number"
                        name="weight"
                        value={parcelData.weight}
                        onChange={handleChange}
                        step="0.1"
                        min="0"
                        placeholder="e.g. 2.5"
                        id="parcel-weight"
                    />
                </div>

                {/* Dimensions (conditional) */}
                {isDimensionRequired && (
                    <div className={styles.section}>
                        <label className={styles.sectionLabel}>
                            <Ruler size={16} /> Dimensions (cm)
                        </label>
                        <div className={styles.dimensionsGrid}>
                            <div>
                                <label className={styles.dimLabel}>Length</label>
                                <input className={styles.input} type="number" name="length" value={parcelData.length} onChange={handleChange} step="0.1" placeholder="cm" id="parcel-length" />
                            </div>
                            <div>
                                <label className={styles.dimLabel}>Breadth</label>
                                <input className={styles.input} type="number" name="breadth" value={parcelData.breadth} onChange={handleChange} step="0.1" placeholder="cm" id="parcel-breadth" />
                            </div>
                            <div>
                                <label className={styles.dimLabel}>Height</label>
                                <input className={styles.input} type="number" name="height" value={parcelData.height} onChange={handleChange} step="0.1" placeholder="cm" id="parcel-height" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Fragile toggle */}
                <div className={styles.section}>
                    <label className={styles.fragileToggle}>
                        <input
                            type="checkbox"
                            name="fragile"
                            checked={parcelData.fragile}
                            onChange={handleChange}
                            className={styles.checkbox}
                            id="parcel-fragile"
                        />
                        <div className={styles.toggleTrack} data-checked={parcelData.fragile}>
                            <div className={styles.toggleThumb}></div>
                        </div>
                        <div>
                            <span className={styles.toggleLabel}>
                                <AlertTriangle size={14} style={{ color: parcelData.fragile ? '#f59e0b' : undefined }} /> Fragile Item
                            </span>
                            <span className={styles.toggleDesc}>Handle with extra care</span>
                        </div>
                    </label>
                </div>

                {/* Description */}
                <div className={styles.section}>
                    <label className={styles.sectionLabel}>
                        <FileText size={16} /> Description (optional)
                    </label>
                    <textarea
                        className={styles.textarea}
                        name="description"
                        value={parcelData.description}
                        onChange={handleChange}
                        placeholder="What's inside? Any special notes…"
                        rows={3}
                        id="parcel-description"
                    />
                </div>

                <div className={styles.actions}>
                    <button
                        type="button"
                        className={styles.secondaryBtn}
                        onClick={() => navigate('/delivery')}
                    >
                        ← Back
                    </button>
                    <button
                        className={styles.button}
                        onClick={submitButton}
                        disabled={submitting}
                        id="parcel-next-btn"
                    >
                        {submitting ? 'Saving…' : 'Next: Payment →'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateParcel;
