import React, { useEffect, useState } from 'react';
import styles from './CreateOrder.module.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Firebase.js';
import { useNavigate } from 'react-router-dom';

function CreateOrder() {
  const [orderID, setOrderID] = useState('');
  const [user, loading, error] = useAuthState(auth);
  const [userid, setUserID] = useState('');

  const [pickupAddressData, setPickupAddressData] = useState({
    orderID: '',
    address: '',
    contact: '',
    city: '',
    pincode: '',
    state: '',
    saveAddress: false,
    addressType: '',
  });

  useEffect(() => {
    if (user) {
      setUserID(user.uid);
    }
  }, [user]);

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
          if (data.data?.getOrder) {
            setOrderID(data.data.getOrder.orderID);
          }
        } catch (error) {
          console.error('Error fetching order ID:', error);
        }
      };

      fetchOrderID();
    }
  }, [userid]);

  useEffect(() => {
    if (orderID) {
      setPickupAddressData((prevData) => ({
        ...prevData,
        orderID,
      }));
    }
  }, [orderID]);

  const handlePickupAddressData = (e) => {
    setPickupAddressData({
      ...pickupAddressData,
      [e.target.name]: e.target.value,
    });
  };

  console.log(pickupAddressData);

  const submitPickupAddressData = async () => {
    try {
      const response = await fetch('http://localhost:8000/address/createPickupAddress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pickupAddressData),
      });
      if (response.status === 201) {
        const data = await response.json();
        console.log('Pickup address created:', data);
      } else {
        console.error('Error submitting pickup address');
      }
    } catch (error) {
      console.error('Error submitting pickup address:', error);
    }
  };

  const [deliveryAddressData, setDeliveryAddressData] = useState({
    orderID: '',
    address: '',
    contact: '',
    city: '',
    pincode: '',
    state: '',
    saveAddress: false,
    addressType: '',
  })

  useEffect(() => {
    if (orderID) {
      setDeliveryAddressData((prevData) => ({
        ...prevData,
        orderID,
      }));
    }
  } , [orderID]);

  const handleDeliveryAddressData = (e) => {
    setDeliveryAddressData({
      ...deliveryAddressData,
      [e.target.name]: e.target.value,
    });
  }

  console.log(deliveryAddressData);

  const navigate = useNavigate();

  const submitDeliveryAddressData = async () => {
    try {
      const response = await fetch('http://localhost:8000/address/createDeliveryAddress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deliveryAddressData),
      });
      if (response.status === 201) {
        const data = await response.json();
        console.log('Delivery address created:', data);
      } else {
        console.error('Error submitting delivery address');
      }
    } catch (error) {
      console.error('Error submitting delivery address:', error);
    }
  }

  const submitButton = async () => {
    await submitPickupAddressData();
    await submitDeliveryAddressData();
    navigate('/parcel');
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.address}>
          <div className={styles.pickupAddress}>
            <h2>Pickup Address</h2>
            <label className={styles.label}>
              Address:
              <input type="text" name='address' onChange={handlePickupAddressData} className={styles.input} />
            </label>
            <label className={styles.label}>
              Contact:
              <input type="text" name='contact' onChange={handlePickupAddressData} className={styles.input} />
            </label>
            <label className={styles.label}>
              City:
              <input type="text" name='city' onChange={handlePickupAddressData} className={styles.input} />
            </label>
            <label className={styles.label}>
              Pincode:
              <input type="text" name='pincode' onChange={handlePickupAddressData} className={styles.input} />
            </label>
            <label className={styles.label}>
              State:
              <input type="text" name='state' onChange={handlePickupAddressData} className={styles.input} />
            </label>
          </div>
          <div className={styles.deliveryAddress}>
            <h2>Delivery Address</h2>
            <label className={styles.label}>
              Address:
              <input type="text" name='address' onChange={handleDeliveryAddressData} className={styles.input} />
            </label>
            <label className={styles.label}>
              Contact:
              <input type="text" name='contact' onChange={handleDeliveryAddressData} className={styles.input} />
            </label>
            <label className={styles.label}>
              City:
              <input type="text" name='city' onChange={handleDeliveryAddressData} className={styles.input} />
            </label>
            <label className={styles.label}>
              Pincode:
              <input type="text" name='pincode' onChange={handleDeliveryAddressData} className={styles.input} />
            </label> 
            <label className={styles.label}>
              State:
              <input type="text" name='state' onChange={handleDeliveryAddressData} className={styles.input} />
            </label>
          </div>
        </div>
        <button className={styles.button} onClick={submitButton}>Next</button>
      </div>
    </>
  );
}

export default CreateOrder;