/**
 * LogisticPro — Cypress Auth E2E Tests
 * ======================================
 * Tests:
 *   1. Signup (email/password) → ProfileSetup form → MongoDB verification
 *   2. Login  (email/password) → redirect to /home
 *
 * Prerequisites:
 *   - Frontend running : npm run dev          (http://localhost:5173)
 *   - Backend  running : npm start            (http://localhost:8000)
 *   - MongoDB  running : localhost:27017
 *
 * Run:
 *   npx cypress run          (headless)
 *   npx cypress open         (interactive GUI)
 */

// ─── Shared test credentials ──────────────────────────────────────────────────
// A unique email is generated once per spec file load.
const TEST_EMAIL    = `cypress_${Date.now()}@mailtest.com`
const TEST_PASSWORD = 'Test@1234'

const PROFILE = {
  name   : 'Cypress Tester',
  phone  : '9123456780',
  role   : 'user',
  address: '456 Cypress Avenue, E2E Nagar',
  city   : 'Pune',
  pincode: '411001',
  state  : 'Maharashtra',
}

// ─── Cleanup before the suite runs ───────────────────────────────────────────
before(() => {
  // Remove any leftover record from a previous run with the same email
  cy.task('deleteUserByEmail', TEST_EMAIL)
})

// ─── Test suite ───────────────────────────────────────────────────────────────
describe('Auth Flow — email/password (no Google)', () => {

  // ── Test 1: Signup + ProfileSetup ──────────────────────────────────────────
  it('registers a new user, completes ProfileSetup, and verifies MongoDB', () => {

    // 1. Open Register page
    cy.visit('/register')
    cy.contains('h2', 'Register').should('be.visible')

    // 2. Fill email + password
    cy.get("input[name='email']").type(TEST_EMAIL)
    cy.get("input[name='password']").type(TEST_PASSWORD)

    // 3. Click Sign Up (NOT the Google button)
    cy.contains('button', 'Sign Up').click()

    // 4. Should redirect to /profileSetup
    cy.url().should('include', '/profileSetup')
    cy.contains('h2', 'Profile').should('be.visible')

    // 5. Fill profile form
    cy.get("input[name='name']").type(PROFILE.name)
    cy.get("input[name='phone']").type(PROFILE.phone)
    cy.get("select[name='role']").select(PROFILE.role)
    cy.get("textarea[name='address']").type(PROFILE.address)
    cy.get("input[name='city']").type(PROFILE.city)
    cy.get("input[name='pincode']").type(PROFILE.pincode)
    cy.get("input[name='state']").type(PROFILE.state)

    // 6. Submit
    cy.contains('button', 'Submit').click()

    // 7. Wait for the backend to write to MongoDB, then verify
    cy.wait(2000)
    cy.task('findUserByEmail', TEST_EMAIL).then((user) => {
      expect(user, `User ${TEST_EMAIL} not found in MongoDB`).to.not.be.null
      expect(user.name).to.equal(PROFILE.name)
      expect(user.phone).to.equal(PROFILE.phone)
      expect(user.city).to.equal(PROFILE.city)
      expect(user.pincode).to.equal(PROFILE.pincode)
      expect(user.state).to.equal(PROFILE.state)
      cy.log(`✅ MongoDB record verified  _id=${user._id}`)
    })
  })

  // ── Test 2: Login ───────────────────────────────────────────────────────────
  it('logs in with email/password and redirects to /home', () => {

    // 1. Open Login page
    cy.visit('/')
    cy.contains('h2', 'Login').should('be.visible')

    // 2. Fill credentials
    cy.get("input[name='email']").type(TEST_EMAIL)
    cy.get("input[name='password']").type(TEST_PASSWORD)

    // 3. Click Login (NOT the Google button)
    cy.contains('button', 'Login').click()

    // 4. Should redirect to /home
    cy.url().should('include', '/home')
    cy.log('✅ Logged in and redirected to /home')
  })
})
