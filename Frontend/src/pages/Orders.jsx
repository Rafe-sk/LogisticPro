import React, { useEffect, useState } from 'react'
import { getUser, isLoggedIn } from '../auth.js'
import { useNavigate } from 'react-router-dom'
import styles from './Orders.module.css'
import { Package, Clock, CheckCircle2, XCircle, ChevronRight, Trash2 } from 'lucide-react'

function Orders() {
    const navigate = useNavigate()

    useEffect(() => {
        if (!isLoggedIn()) navigate('/')
    }, [navigate])

    const currentUser = getUser()
    const userid = currentUser?.userid || ''

    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [cancellingOrderId, setCancellingOrderId] = useState(null)

    useEffect(() => {
        if (!userid) return
        const fetchOrders = async () => {
            const query = `
                query GetOrders($userid: String!) {
                    getOrdersByUser(userid: $userid) {
                        orderId
                        date
                        status
                        totalAmount
                    }
                }
            `
            try {
                const response = await fetch('http://localhost:8000/graphql', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query, variables: { userid } })
                })
                const data = await response.json()
                setOrders(data.data?.getOrdersByUser || [])
            } catch (err) {
                console.error('Error fetching orders:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [userid])

    const handleCancelOrder = async (orderID) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return

        setCancellingOrderId(orderID)
        try {
            const response = await fetch('http://localhost:8000/order/cancelOrder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderID })
            })
            const data = await response.json()

            if (response.ok) {
                // Update the order status in the local state
                setOrders(orders.map(order =>
                    order.orderId === orderID ? { ...order, status: 'Cancelled' } : order
                ))
                alert('Order cancelled successfully')
            } else {
                alert(data.message || 'Failed to cancel order')
            }
        } catch (err) {
            alert('Error: ' + err.message)
        } finally {
            setCancellingOrderId(null)
        }
    }

    const getStatusIcon = (status) => {
        if (status === 'Paid') return <CheckCircle2 size={16} className={styles.statusPaid} />
        if (status === 'Cancelled') return <XCircle size={16} className={styles.statusCancelled} />
        return <Clock size={16} className={styles.statusPending} />
    }

    const getStatusClass = (status) => {
        if (status === 'Paid') return styles.badgePaid
        if (status === 'Cancelled') return styles.badgeCancelled
        return styles.badgePending
    }

    const canCancelOrder = (status) => {
        return status !== 'Paid' && status !== 'Cancelled'
    }

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Loading your orders…</p>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>My Orders</h1>
                <p className={styles.pageSubtitle}>Track and manage all your shipments</p>
            </div>

            {orders.length === 0 ? (
                <div className={styles.emptyState}>
                    <Package size={56} className={styles.emptyIcon} />
                    <h3 className={styles.emptyTitle}>No orders yet</h3>
                    <p className={styles.emptyText}>Create your first shipment to get started</p>
                    <button className={styles.ctaButton} onClick={() => navigate('/home')}>
                        Go to Dashboard
                    </button>
                </div>
            ) : (
                <div className={styles.ordersList}>
                    {orders.map((order) => (
                        <div key={order.orderId} className={styles.orderCard}>
                            <div className={styles.orderLeft}>
                                <div className={styles.orderIcon}>
                                    <Package size={22} />
                                </div>
                                <div className={styles.orderInfo}>
                                    <span className={styles.orderId}>{order.orderId}</span>
                                    <span className={styles.orderDate}>{order.date}</span>
                                </div>
                            </div>
                            <div className={styles.orderRight}>
                                <span className={`${styles.statusBadge} ${getStatusClass(order.status)}`}>
                                    {getStatusIcon(order.status)}
                                    {order.status}
                                </span>
                                <span className={styles.orderAmount}>
                                    {order.totalAmount > 0 ? `₹${order.totalAmount}` : '—'}
                                </span>
                                {canCancelOrder(order.status) && (
                                    <button
                                        onClick={() => handleCancelOrder(order.orderId)}
                                        disabled={cancellingOrderId === order.orderId}
                                        className={styles.cancelBtn}
                                        title="Cancel this order"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                                <ChevronRight size={16} className={styles.chevron} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Orders