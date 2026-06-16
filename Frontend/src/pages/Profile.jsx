import styles from './Profile.module.css'
import { logOut, getUser } from '../auth.js';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Package, LogOut, CheckCircle2, Clock, XCircle, Home, Edit2, Save, X, Trash2 } from 'lucide-react';

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

    const [editedData, setEditedData] = useState({ ...userData });
    const [orders, setOrders] = useState([]);
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState(null);
    const [isCancelling, setIsCancelling] = useState(false);

    const currentUser = getUser();   // { userid, email } from JWT
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) { navigate('/'); return; }
        fetchUserData();
        fetchOrders();
    }, []);

    // Fetch user profile by email (GraphQL)
    const fetchUserData = async () => {
        const query = `
            query GetUser($email: String!) {
                getUserByEmail(email: $email) {
                    address city email name phone pincode state
                }
            }
        `;
        try {
            const response = await fetch('http://localhost:8000/graphql', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, variables: { email: currentUser.email } })
            });
            const data = await response.json();
            if (data.data?.getUserByEmail) {
                setUserData(data.data.getUserByEmail);
                setEditedData(data.data.getUserByEmail);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditToggle = () => {
        if (isEditMode) {
            setEditedData({ ...userData });
        }
        setIsEditMode(!isEditMode);
    };

    const handleFieldChange = (field, value) => {
        setEditedData({ ...editedData, [field]: value });
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            const response = await fetch('http://localhost:8000/user/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editedData)
            });
            const data = await response.json();

            if (response.ok) {
                setUserData(editedData);
                setIsEditMode(false);
                alert('Profile updated successfully');
            } else {
                alert(data.message || 'Failed to update profile');
            }
        } catch (err) {
            alert('Error: ' + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleViewOrderDetails = async (order) => {
        setSelectedOrder(order);
        try {
            const response = await fetch('http://localhost:8000/order/getByOrderID', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderID: order.orderId })
            });
            const data = await response.json();
            if (response.ok) {
                setOrderDetails(data);
            } else {
                setOrderDetails(order);
            }
        } catch (err) {
            setOrderDetails(order);
        }
    };

    const handleCancelOrder = async () => {
        if (!selectedOrder) return;
        if (!window.confirm('Are you sure you want to cancel this order?')) return;

        setIsCancelling(true);
        try {
            const response = await fetch('http://localhost:8000/order/cancelOrder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderID: selectedOrder.orderId })
            });
            const data = await response.json();

            if (response.ok) {
                // Update local orders list
                setOrders(orders.map(o =>
                    o.orderId === selectedOrder.orderId
                        ? { ...o, status: 'Cancelled' }
                        : o
                ));
                // Update order details
                setOrderDetails({ ...orderDetails, status: 'Cancelled' });
                setSelectedOrder({ ...selectedOrder, status: 'Cancelled' });
                alert('Order cancelled successfully');
            } else {
                alert(data.message || 'Failed to cancel order');
            }
        } catch (err) {
            alert('Error: ' + err.message);
        } finally {
            setIsCancelling(false);
        }
    };

    // Fixed: use userid (not email) for getOrdersByUser
    const fetchOrders = async () => {
        const query = `
            query GetOrders($userid: String!) {
                getOrdersByUser(userid: $userid) {
                    orderId date status totalAmount
                }
            }
        `;
        try {
            const response = await fetch('http://localhost:8000/graphql', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, variables: { userid: currentUser.userid } })
            });
            const data = await response.json();
            setOrders(data.data?.getOrdersByUser || []);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchPaymentDetails = async (orderId) => {
        const query = `
            query GetPayment($orderId: String!) {
                getPayment(orderID: $orderId) { date paymentMethod paymentStatus price }
            }
        `;
        try {
            const response = await fetch('http://localhost:8000/graphql', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, variables: { orderId } })
            });
            const data = await response.json();
            setPaymentDetails(data.data?.getPayment || null);
        } catch (error) {
            console.log(error);
        }
    };

    const handleLogout = () => {
        logOut();
        navigate('/');
    };

    const getStatusBadge = (status) => {
        const map = {
            Paid: { icon: <CheckCircle2 size={12} />, cls: styles.badgePaid },
            Pending: { icon: <Clock size={12} />, cls: styles.badgePending },
            Cancelled: { icon: <XCircle size={12} />, cls: styles.badgeCancelled },
        };
        const s = map[status] || map.Pending;
        return (
            <span className={`${styles.statusBadge} ${s.cls}`}>
                {s.icon}{status}
            </span>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.dashboardContainer}>

                {/* Sidebar */}
                <div className={styles.sidebar}>
                    <div className={styles.avatarSection}>
                        <div className={styles.avatar}>
                            {userData.name ? userData.name.charAt(0).toUpperCase() : currentUser?.email?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <h3 className={styles.avatarName}>{userData.name || 'User'}</h3>
                        <p className={styles.avatarEmail}>{currentUser?.email}</p>
                    </div>

                    <nav className={styles.sidebarNav}>
                        <button
                            className={`${styles.navItem} ${activeTab === 'profile' ? styles.navItemActive : ''}`}
                            onClick={() => setActiveTab('profile')}
                        >
                            <User size={18} /> Profile
                        </button>
                        <button
                            className={`${styles.navItem} ${activeTab === 'orders' ? styles.navItemActive : ''}`}
                            onClick={() => setActiveTab('orders')}
                        >
                            <Package size={18} /> Orders
                            {orders.length > 0 && <span className={styles.orderCount}>{orders.length}</span>}
                        </button>
                    </nav>

                    <button className={styles.homeBtn} onClick={() => navigate('/')}>
                        <Home size={16} /> Back to Home
                    </button>

                    <button className={styles.logoutBtn} onClick={handleLogout}>
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>

                {/* Main Content */}
                <div className={styles.mainContent}>
                    {activeTab === 'profile' && (
                        <div className={styles.profileTab}>
                            <div className={styles.profileHeader}>
                                <h2 className={styles.tabTitle}>Profile Information</h2>
                                {!isEditMode && (
                                    <button className={styles.editBtn} onClick={handleEditToggle}>
                                        <Edit2 size={16} /> Edit
                                    </button>
                                )}
                            </div>

                            {loading ? (
                                <div className={styles.loadingState}><div className={styles.spinner}></div></div>
                            ) : (
                                <>
                                    <div className={styles.profileGrid}>
                                        {[
                                            { label: 'Full Name', value: 'name', type: 'text' },
                                            { label: 'Email', value: 'email', type: 'email', disabled: true },
                                            { label: 'Phone', value: 'phone', type: 'tel' },
                                            { label: 'Address', value: 'address', type: 'text' },
                                            { label: 'City', value: 'city', type: 'text' },
                                            { label: 'Pincode', value: 'pincode', type: 'text' },
                                            { label: 'State', value: 'state', type: 'text' },
                                        ].map(({ label, value, type, disabled }) => (
                                            <div key={value} className={styles.profileField}>
                                                <span className={styles.fieldLabel}>{label}</span>
                                                {isEditMode && !disabled ? (
                                                    <input
                                                        type={type}
                                                        value={editedData[value] || ''}
                                                        onChange={(e) => handleFieldChange(value, e.target.value)}
                                                        className={styles.fieldInput}
                                                        placeholder={`Enter ${label.toLowerCase()}`}
                                                    />
                                                ) : (
                                                    <span className={styles.fieldValue}>{editedData[value] || '—'}</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {isEditMode && (
                                        <div className={styles.editActions}>
                                            <button
                                                onClick={handleSaveProfile}
                                                disabled={isSaving}
                                                className={styles.saveBtn}
                                            >
                                                <Save size={16} /> {isSaving ? 'Saving...' : 'Save Changes'}
                                            </button>
                                            <button
                                                onClick={handleEditToggle}
                                                disabled={isSaving}
                                                className={styles.cancelBtn}
                                            >
                                                <X size={16} /> Cancel
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className={styles.ordersTab}>
                            <h2 className={styles.tabTitle}>Your Orders</h2>

                            {orders.length === 0 ? (
                                <div className={styles.emptyOrders}>
                                    <Package size={40} className={styles.emptyIcon} />
                                    <p>No orders yet</p>
                                </div>
                            ) : (
                                <div className={styles.ordersList}>
                                    {orders.map(order => (
                                        <div
                                            key={order.orderId}
                                            className={styles.orderCard}
                                            onClick={() => handleViewOrderDetails(order)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className={styles.orderInfo}>
                                                <span className={styles.orderId}>{order.orderId}</span>
                                                <span className={styles.orderDate}>{order.date}</span>
                                            </div>
                                            <div className={styles.orderMeta}>
                                                {getStatusBadge(order.status)}
                                                <span className={styles.orderAmount}>
                                                    {order.totalAmount > 0 ? `₹${order.totalAmount}` : '—'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {selectedOrder && (
                                <div className={styles.orderDetailsModal}>
                                    <div className={styles.orderDetailsContent}>
                                        <div className={styles.orderDetailsHeader}>
                                            <h3 className={styles.orderDetailsTitle}>Order Details</h3>
                                            <button
                                                onClick={() => setSelectedOrder(null)}
                                                className={styles.closeBtn}
                                                title="Close"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>

                                        <div className={styles.orderDetailsBody}>
                                            <div className={styles.detailField}>
                                                <span className={styles.detailLabel}>Order ID</span>
                                                <span className={styles.detailValue}>{orderDetails?.orderID || selectedOrder.orderId}</span>
                                            </div>
                                            <div className={styles.detailField}>
                                                <span className={styles.detailLabel}>Status</span>
                                                <span className={styles.detailValue}>
                                                    {getStatusBadge(orderDetails?.status || selectedOrder.status)}
                                                </span>
                                            </div>
                                            <div className={styles.detailField}>
                                                <span className={styles.detailLabel}>Date</span>
                                                <span className={styles.detailValue}>{orderDetails?.createdAt || selectedOrder.date || '—'}</span>
                                            </div>
                                            <div className={styles.detailField}>
                                                <span className={styles.detailLabel}>Total Amount</span>
                                                <span className={styles.detailValue}>
                                                    ₹{orderDetails?.totalAmount || selectedOrder.totalAmount || 0}
                                                </span>
                                            </div>
                                        </div>

                                        {(orderDetails?.status !== 'Cancelled' && selectedOrder.status !== 'Cancelled' && 
                                          orderDetails?.status !== 'Paid' && selectedOrder.status !== 'Paid') && (
                                            <div className={styles.orderDetailsFooter}>
                                                <button
                                                    onClick={handleCancelOrder}
                                                    disabled={isCancelling}
                                                    className={styles.cancelOrderBtn}
                                                >
                                                    <Trash2 size={16} /> {isCancelling ? 'Cancelling...' : 'Cancel Order'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {paymentDetails && !selectedOrder && (
                                <div className={styles.paymentDetails}>
                                    <h4 className={styles.paymentTitle}>Payment Details</h4>
                                    <div className={styles.paymentGrid}>
                                        <div className={styles.paymentField}>
                                            <span className={styles.fieldLabel}>Date</span>
                                            <span className={styles.fieldValue}>{paymentDetails.date}</span>
                                        </div>
                                        <div className={styles.paymentField}>
                                            <span className={styles.fieldLabel}>Method</span>
                                            <span className={styles.fieldValue}>{paymentDetails.paymentMethod}</span>
                                        </div>
                                        <div className={styles.paymentField}>
                                            <span className={styles.fieldLabel}>Status</span>
                                            <span className={styles.fieldValue}>{paymentDetails.paymentStatus}</span>
                                        </div>
                                        <div className={styles.paymentField}>
                                            <span className={styles.fieldLabel}>Amount</span>
                                            <span className={`${styles.fieldValue} ${styles.price}`}>₹{paymentDetails.price}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Profile;
