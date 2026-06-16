# LogisticPro — Logistics & Courier Management System

LogisticPro is a modern web application designed for booking parcel shipments, managing courier workflows, tracking deliveries, and processing payments. 

This repository contains the complete codebase for the Frontend, Backend, and all automated testing suites (Selenium, Cypress, JMeter, and Jenkins CI/CD configuration).

---

## 🏗️ Project Architecture

* **Frontend**: React (Vite, CSS Modules, React Router DOM, Firebase Auth)
* **Backend**: Node.js, Express, MongoDB (Mongoose), GraphQL (Apollo Server)
* **Database**: MongoDB (Local instance at `mongodb://localhost:27017/Logistics`)

---

## 🚀 Local Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally on port `27017`)

### 1. Run the Backend
```bash
cd Backend
npm install
npm start
```
*The server will start running on [http://localhost:8000](http://localhost:8000).*

### 2. Run the Frontend
```bash
cd Frontend
npm install
npm run dev
```
*The frontend will start running on [http://localhost:5173](http://localhost:5173).*

---

## 🧪 Testing Suites

This project contains end-to-end automation, regression, performance, and API load tests.

---

### 1. Selenium Java E2E Tests (`selenium-tests/`)
Written using **Java 17**, **Selenium WebDriver**, **WebDriverManager** (automatic Chrome driver configuration), and **TestNG**.

#### Run Commands (from `selenium-tests/` directory):
```bash
cd selenium-tests
```

* **Run All Tests**:
  ```bash
  mvn clean test
  ```
* **Run Auth (Signup/Login) Test Only**:
  ```bash
  mvn test -Dtest=AuthTest
  ```
* **Run Password Reset Test Only**:
  ```bash
  mvn test -Dtest=PasswordResetTest
  ```
* **Run Create Order Test Only**:
  ```bash
  mvn test -Dtest=CreateOrderTest
  ```
* **Run Order Cancellation Test Only**:
  ```bash
  mvn test -Dtest=OrderCancellationTest
  ```
* **Run Tracking Test Only**:
  ```bash
  mvn test -Dtest=TrackingTest
  ```

---

### 2. Cypress Frontend Tests (`Frontend/cypress/`)
Cypress is configured to run end-to-end user journeys directly in the browser environment.

#### Run Commands (from `Frontend/` directory):
```bash
cd Frontend
```

* **Open Cypress Test Runner (Interactive GUI)**:
  ```bash
  npm run cypress:open
  ```
* **Run All Cypress Tests (Headless)**:
  ```bash
  npm run cypress:run
  ```
* **Run Individual Specs (Headless)**:
  - Auth Flow: `npx cypress run --spec "cypress/e2e/auth.cy.js"`
  - Password Reset: `npx cypress run --spec "cypress/e2e/password_reset.cy.js"`
  - Create Order: `npx cypress run --spec "cypress/e2e/create_order.cy.js"`
  - Order Cancellation: `npx cypress run --spec "cypress/e2e/order_cancellation.cy.js"`
  - Tracking: `npx cypress run --spec "cypress/e2e/tracking.cy.js"`

---

### 3. JMeter Performance & Load Tests (`jmeter/`)
Used to load-test and stress-test the REST API endpoints.

* **Test Plan Location**: `jmeter/LogisticPro.jmx`
* **Endpoints Tested**:
  1. `POST /user/register` (Registration)
  2. `POST /user/login` (Authentication)
  3. `POST /user/create` (Profile Setup)
  4. `POST /order/createOrder` (Order Placement)
  5. `POST /address/createPickupAddress` (Address Registration)
  6. `POST /parcel/createParcel` (Package Metadata creation)

#### How to Run:
1. Open **Apache JMeter**.
2. Click **File -> Open** and load `jmeter/LogisticPro.jmx`.
3. Configure the `Server Name` as `localhost` and `Port` as `8000` (under the HTTP requests).
4. Run the thread group and monitor results using the **View Results Tree** listener.

---

## 🛠️ CI/CD Integration (Jenkins)

The project includes pre-configured automated testing pipeline configurations for Jenkins CI.

* **Jenkins URL**: `http://localhost:8090/logisticpro/`
* **Features**:
  - Automatically polls GitHub repository updates.
  - Automatically checks out changes.
  - Compiles the Selenium test suite and runs regression checks.
  - Generates detailed TestNG HTML Reports showing test pass/fail trend graphs.
