import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Firebase.js';
import styles from './CreateParcel.module.css';  // Import the CSS module
import { useNavigate } from 'react-router-dom';

function CreateParcel() {

    const [orderID, setOrderID] = useState('');
    const [user, loading, error] = useAuthState(auth);
    const [userid, setUserID] = useState('');

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

    useEffect(() => {
        if (orderID) {
            setParcelData((prevData) => ({
                ...prevData,
                orderID,
            }));
        }
    }, [orderID]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setParcelData({
            ...parcelData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Parcel Data Submitted:', parcelData);
        setParcelData({
            orderID: '',
            parcelType: 'document',
            weight: '',
            length: '',
            breadth: '',
            height: '',
            fragile: false,
            description: '',
        });
    };

    const isDimensionRequired = ['Box', 'Suitcase', 'Backpack', 'Other'].includes(parcelData.parcelType);

    const submitParcelForm = async () => {
        fetch('http://localhost:8000/parcel/createParcel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(parcelData),
        })
            .then((response) => {
                if (response.status !== 201) {
                    console.log('There was an error');
                } else {
                    return response.json();
                }
            })
            .then((data) => {
                console.log(data);
            });
    }

    console.log(parcelData);

    const navigate = useNavigate();

    const submitButton = async () => {
        await submitParcelForm();
        navigate('/payment')
    }

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h2>Create Parcel</h2>

                <label className={styles.label}>
                    Parcel Type:
                    <select
                        className={styles.select}
                        name="parcelType"
                        value={parcelData.parcelType}
                        onChange={handleChange}
                        required
                    >
                        <option value="document">Document</option>
                        <option value="Box">Box</option>
                        <option value="Suitcase">Suitcase</option>
                        <option value="Backpack">Backpack</option>
                        <option value="Other">Other</option>
                    </select>
                </label>

                <label className={styles.label}>
                    Weight (kg):
                    <input
                        className={styles.input}
                        type="number"
                        name="weight"
                        value={parcelData.weight}
                        onChange={handleChange}
                        step="0.1"
                        required
                    />
                </label>

                {isDimensionRequired && (
                    <>
                        <label className={styles.label}>
                            Length (cm):
                            <input
                                className={styles.input}
                                type="number"
                                name="length"
                                value={parcelData.length}
                                onChange={handleChange}
                                step="0.1"
                                required={isDimensionRequired}
                            />
                        </label>

                        <label className={styles.label}>
                            Breadth (cm):
                            <input
                                className={styles.input}
                                type="number"
                                name="breadth"
                                value={parcelData.breadth}
                                onChange={handleChange}
                                step="0.1"
                                required={isDimensionRequired}
                            />
                        </label>

                        <label className={styles.label}>
                            Height (cm):
                            <input
                                className={styles.input}
                                type="number"
                                name="height"
                                value={parcelData.height}
                                onChange={handleChange}
                                step="0.1"
                                required={isDimensionRequired}
                            />
                        </label>
                    </>
                )}

                <label className={styles.checkbox}>
                    Fragile:
                    <input
                        className={styles.input}
                        type="checkbox"
                        name="fragile"
                        checked={parcelData.fragile}
                        onChange={handleChange}
                    />
                </label>

                <label className={styles.label}>
                    Description:
                    <textarea
                        className={styles.textarea}
                        name="description"
                        value={parcelData.description}
                        onChange={handleChange}
                    />
                </label>
            </form>
            <button className={styles.button} onClick={submitButton}>
                Next
            </button>
        </div>
    );
}

export default CreateParcel;
