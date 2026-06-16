# LogisticPro API Load Testing with Apache JMeter

This directory contains the JMeter test plan (`LogisticPro.jmx`) to verify and load test the JWT-based authentication API endpoints of the LogisticPro application.

## Endpoints Under Test

The test suite interacts with the Express backend server running on `http://localhost:8000`.

### 1. User Registration (`POST /user/register`)
- **Purpose**: Creates a new user with an email and password, hashing the password using bcrypt.
- **Request Body (JSON)**:
  ```json
  {
    "email": "jmeter_test@mailtest.com",
    "password": "Test@1234"
  }
  ```
- **Response**: `201 Created` returning a signed JWT token.
  ```json
  {
    "token": "eyJ..."
  }
  ```

### 2. User Login (`POST /user/login`)
- **Purpose**: Authenticates a registered user and issues a JWT token.
- **Request Body (JSON)**:
  ```json
  {
    "email": "jmeter_test@mailtest.com",
    "password": "Test@1234"
  }
  ```
- **Response**: `200 OK` returning a signed JWT token.
  ```json
  {
    "token": "eyJ..."
  }
  ```

### 3. Profile Setup (`POST /user/create`)
- **Purpose**: Saves or updates the user profile details.
- **Request Body (JSON)**:
  ```json
  {
    "email": "jmeter_test@mailtest.com",
    "name": "JMeter Tester",
    "phone": "9123456780",
    "role": "user",
    "address": "456 Test Avenue",
    "city": "Pune",
    "pincode": 411001,
    "state": "Maharashtra"
  }
  ```
- **Response**: `201 Created` with a success message.

### 4. Create Order (`POST /order/createOrder`)
- **Purpose**: Creates a new parcel shipment order.
- **Request Body (JSON)**:
  ```json
  {
    "userid": "user_id_here",
    "orderID": "ORD123456789",
    "totalAmount": 250
  }
  ```
- **Response**: `201 Created` with a success message.

### 5. Create Pickup Address (`POST /address/createPickupAddress`)
- **Purpose**: Associates a pickup/origin address with the order.
- **Request Body (JSON)**:
  ```json
  {
    "orderID": "ORD123456789",
    "senderName": "JMeter Sender",
    "address": "123 Pickup lane, Sector 4",
    "landmark": "Near Main Gate",
    "contact": "9876543210",
    "city": "Pune",
    "pincode": 411001,
    "state": "Maharashtra",
    "addressType": "home",
    "saveAddress": true
  }
  ```
- **Response**: `201 Created` with a success message.

### 6. Create Parcel (`POST /parcel/createParcel`)
- **Purpose**: Attaches package details (type, dimensions, weight) to the order.
- **Request Body (JSON)**:
  ```json
  {
    "orderID": "ORD123456789",
    "parcelType": "Box",
    "weight": 5,
    "length": 10,
    "breadth": 10,
    "height": 10,
    "fragile": true,
    "description": "Fragile electronic items"
  }
  ```
- **Response**: `201 Created` with a success message.

---

## JMeter Configuration Requirements

To run these requests correctly or recreate them in JMeter:

1. **HTTP Header Manager**:
   - Both API routes require JSON bodies. You must define an **HTTP Header Manager** (usually added as a child of the Thread Group or individual HTTP Requests) with the following headers:
     - `Content-Type`: `application/json`

2. **HTTP Request Settings**:
   - **Protocol**: `http`
   - **Server Name or IP**: `localhost`
   - **Port Number**: `8000`
   - **Method**: `POST`
   - **Content Encoding**: `UTF-8`

3. **Body Data Input**:
   - Ensure the JSON request body is written under the **Body Data** tab (not the Parameters/Arguments tab).

---

## How to Run the Test Plan

1. Start your local Backend server:
   ```bash
   cd Backend
   npm start
   ```
2. Open Apache JMeter.
3. Click **File -> Open** and select `LogisticPro.jmx` from this directory.
4. Select the **View Results Tree** listener in the left sidebar to watch execution.
5. Click the green **Start** button to run the test plan.
