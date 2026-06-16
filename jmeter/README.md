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
