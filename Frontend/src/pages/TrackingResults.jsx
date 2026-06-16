import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import styles from './TrackingResults.module.css'
import { Package, MapPin, Calendar, Clock, CheckCircle2, AlertCircle, Truck } from 'lucide-react'

function TrackingResults() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const orderID = searchParams.get('id')

    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!orderID) {
            setError('No order ID provided')
            setLoading(false)
            return
        }
        fetchOrder()
    }, [orderID])

    const fetchOrder = async () => {
        try {
            const response = await fetch('http://localhost:8000/order/getByOrderID', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderID })
            })
            const data = await response.json()
            if (response.ok) {
                setOrder(data)
            } else {
                setError(data.message || 'Order not found')
            }
        } catch (err) {
            setError('Error fetching order: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    const getStatusBadge = (status) => {
        const statusMap = {
            created: { icon: <Clock size={16} />, color: '#f59e0b', label: 'Order Placed' },
            confirmed: { icon: <CheckCircle2 size={16} />, color: '#10b981', label: 'Confirmed' },
            picked: { icon: <Truck size={16} />, color: '#3b82f6', label: 'Picked Up' },
            intransit: { icon: <Truck size={16} />, color: '#8b5cf6', label: 'In Transit' },
            delivered: { icon: <CheckCircle2 size={16} />, color: '#059669', label: 'Delivered' },
            cancelled: { icon: <AlertCircle size={16} />, color: '#ef4444', label: 'Cancelled' },
        }
        const s = statusMap[status?.toLowerCase()] || statusMap.created
        return { ...s, rawStatus: status }
    }

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingState}>
                    <div className={styles.spinner}></div>
                    <p>Tracking your order…</p>
                </div>
            </div>
        )
    }

    if (error || !order) {
        return (
            <div className={styles.container}>
                <div className={styles.errorBox}>
                    <AlertCircle size={32} className={styles.errorIcon} />
                    <h2>Order Not Found</h2>
                    <p>{error || 'Unable to retrieve order details'}</p>
                    <button className={styles.backButton} onClick={() => navigate('/')}>
                        Back to Home
                    </button>
                </div>
            </div>
        )
    }

    const statusBadge = getStatusBadge(order.status)

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Order Tracking</h1>
                <p className={styles.subtitle}>Track your shipment in real-time</p>
            </div>

            <div className={styles.trackingCard}>
                {/* Order Header */}
                <div className={styles.orderHeader}>
                    <div className={styles.orderInfo}>
                        <span className={styles.orderLabel}>Order ID</span>
                        <span className={styles.orderID}>{order.orderID}</span>
                    </div>
                    <div
                        className={styles.statusBadge}
                        style={{ borderColor: statusBadge.color, color: statusBadge.color }}
                    >
                        {statusBadge.icon}
                        <span>{statusBadge.label}</span>
                    </div>
                </div>

                {/* Order Details Grid */}
                <div className={styles.detailsGrid}>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>
                            <Calendar size={14} /> Order Date
                        </span>
                        <span className={styles.detailValue}>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>
                            <Package size={14} /> Total Amount
                        </span>
                        <span className={styles.detailValue}>₹{order.totalAmount || '—'}</span>
                    </div>
                </div>

                {/* Timeline / Status History */}
                <div className={styles.timelineSection}>
                    <h3 className={styles.timelineTitle}>Shipment Timeline</h3>
                    <div className={styles.timeline}>
                        {[
                            { status: 'created', label: 'Order Placed', icon: '📋' },
                            { status: 'confirmed', label: 'Confirmed', icon: '✓' },
                            { status: 'picked', label: 'Picked Up', icon: '📦' },
                            { status: 'intransit', label: 'In Transit', icon: '🚚' },
                            { status: 'delivered', label: 'Delivered', icon: '🏠' }
                        ].map((step, idx) => {
                            const isCompleted = ['created', 'confirmed', 'picked', 'intransit', 'delivered'].indexOf(order.status?.toLowerCase() || 'created') >= idx
                            return (
                                <div key={idx} className={`${styles.timelineStep} ${isCompleted ? styles.completed : ''}`}>
                                    <div className={styles.stepIcon}>{step.icon}</div>
                                    <div className={styles.stepLabel}>{step.label}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Additional Info */}
                <div className={styles.infoSection}>
                    <h3 className={styles.infoTitle}>Additional Details</h3>
                    <div className={styles.infoGrid}>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Status</span>
                            <span className={styles.infoValue}>{order.status || 'N/A'}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>User ID</span>
                            <span className={styles.infoValue} style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>
                                {order.userid?.substring(0, 12)}...
                            </span>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <div className={styles.actions}>
                    <button className={styles.backBtn} onClick={() => navigate('/')}>
                        ← Back to Home
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TrackingResults
