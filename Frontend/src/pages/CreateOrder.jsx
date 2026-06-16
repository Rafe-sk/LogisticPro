import React, { useEffect, useState } from 'react';
import styles from './CreateOrder.module.css';
import { getUser, isLoggedIn } from '../auth.js';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Building2, Hash, Map } from 'lucide-react';

function CreateOrder() {
  const navigate = useNavigate();

  // Auth guard
  useEffect(() => {
    if (!isLoggedIn()) navigate('/');
  }, [navigate]);

  // Get userid from JWT (replaces Firebase useAuthState)
  const currentUser = getUser();
  const userid = currentUser?.userid || '';

  const [orderID, setOrderID] = useState('');
  const [fetchingOrder, setFetchingOrder] = useState(true);

  const [pickupAddressData, setPickupAddressData] = useState({
    orderID: '',
    address: '',
    contact: '',
    city: '',
    pincode: '',
    state: '',
    saveAddress: false,
    addressType: 'pickup',
  });

  const [deliveryAddressData, setDeliveryAddressData] = useState({
    orderID: '',
    address: '',
    contact: '',
    city: '',
    pincode: '',
    state: '',
    saveAddress: false,
    addressType: 'delivery',
  });

  // Fetch the latest order ID for this user
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
          setPickupAddressData(prev => ({ ...prev, orderID: oid }));
          setDeliveryAddressData(prev => ({ ...prev, orderID: oid }));
        }
      } catch (error) {
        console.error('Error fetching order ID:', error);
      } finally {
        setFetchingOrder(false);
      }
    };
    fetchOrderID();
  }, [userid]);

  const handlePickupAddressData = (e) => {
    setPickupAddressData({ ...pickupAddressData, [e.target.name]: e.target.value });
  };

  const handleDeliveryAddressData = (e) => {
    setDeliveryAddressData({ ...deliveryAddressData, [e.target.name]: e.target.value });
  };

  const submitPickupAddressData = async () => {
    const response = await fetch('http://localhost:8000/address/createPickupAddress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pickupAddressData),
    });
    if (response.status !== 201) throw new Error('Error saving pickup address');
  };

  const submitDeliveryAddressData = async () => {
    const response = await fetch('http://localhost:8000/address/createDeliveryAddress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deliveryAddressData),
    });
    if (response.status !== 201) throw new Error('Error saving delivery address');
  };

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const submitButton = async () => {
    setError('');
    setSubmitting(true);
    try {
      await submitPickupAddressData();
      await submitDeliveryAddressData();
      navigate('/parcel');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const AddressForm = ({ title, icon, data, handler, color }) => (
    <div className={styles.addressCard}>
      <div className={styles.cardHeader} style={{ borderColor: color }}>
        <span className={styles.cardIcon}>{icon}</span>
        <h2 className={styles.cardTitle}>{title}</h2>
        {orderID && <span className={styles.orderBadge}>{orderID}</span>}
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          <MapPin size={14} /> Street Address
          <input type="text" name='address' onChange={handler} className={styles.input} placeholder="123 Main Street" />
        </label>
        <label className={styles.label}>
          <Phone size={14} /> Contact Number
          <input type="text" name='contact' onChange={handler} className={styles.input} placeholder="+91 98765 43210" />
        </label>
        <div className={styles.inlineGroup}>
          <label className={styles.label}>
            <Building2 size={14} /> City
            <input type="text" name='city' onChange={handler} className={styles.input} placeholder="Mumbai" />
          </label>
          <label className={styles.label}>
            <Hash size={14} /> Pincode
            <input type="text" name='pincode' onChange={handler} className={styles.input} placeholder="400001" />
          </label>
        </div>
        <label className={styles.label}>
          <Map size={14} /> State
          <input type="text" name='state' onChange={handler} className={styles.input} placeholder="Maharashtra" />
        </label>
      </div>
    </div>
  );

  if (fetchingOrder) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>Loading your order…</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Create Shipment</h1>
        <p className={styles.pageSubtitle}>Enter pickup and delivery addresses for your order</p>
        {orderID && <div className={styles.orderIdDisplay}>Order ID: <strong>{orderID}</strong></div>}
      </div>

      {error && <div className={styles.errorBox}>⚠️ {error}</div>}

      <div className={styles.address}>
        <AddressForm
          title="Pickup Address"
          icon="📦"
          data={pickupAddressData}
          handler={handlePickupAddressData}
          color="var(--accent)"
        />
        <div className={styles.arrowDivider}>→</div>
        <AddressForm
          title="Delivery Address"
          icon="🏠"
          data={deliveryAddressData}
          handler={handleDeliveryAddressData}
          color="#60a5fa"
        />
      </div>

      <div className={styles.actions}>
        <button className={styles.button} onClick={submitButton} disabled={submitting} id="create-order-next">
          {submitting ? 'Saving…' : 'Next: Parcel Details →'}
        </button>
      </div>
    </div>
  );
}

export default CreateOrder;