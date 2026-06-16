/**
 * LogisticPro — Cypress Auth E2E Tests
 * ======================================
 * Tests (mirrors the Selenium AuthTest.java):
 *   1. testSignupAndProfileSetup — Registers, completes ProfileSetup, verifies MongoDB
 *   2. testLogin                 — Logs in with same credentials, verifies redirect to /home
 *
 * Prerequisites:
 *   - Frontend running : npm run dev   (http://localhost:5173)
 *   - Backend  running : npm start     (http://localhost:8000)
 *   - MongoDB  running : localhost:27017
 *
 * Run:
 *   npx cypress run          (headless)
 *   npx cypress open         (interactive GUI)
 */

// ─── Shared credentials (unique per spec run) ─────────────────────────────────
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

// ─── Cleanup any leftover record before the suite ────────────────────────────
before(() => {
  cy.task('deleteUserByEmail', TEST_EMAIL)
})

// ─── Test suite ───────────────────────────────────────────────────────────────
describe('Auth Flow', () => {

  // ── Test 1: Register + ProfileSetup + MongoDB verify ─────────────────────
  it('registers a new user, completes ProfileSetup, and verifies MongoDB', () => {

    // 1. Open Register page
    cy.visit('/register')
    cy.contains('h2', 'Create account').should('be.visible')

    // 2. Fill email + password
    cy.get("input[name='email']").type(TEST_EMAIL)
    cy.get("input[name='password']").type(TEST_PASSWORD)

    // 3. Click Create Account (id=register-btn)
    cy.get('#register-btn').click()

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

    // 6. Submit (id=profile-submit, text='Save & Continue →')
    cy.get('#profile-submit').scrollIntoView().click()

    // 7. Wait for backend to write, then verify MongoDB
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

  // ── Test 2: Login ─────────────────────────────────────────────────────────
  it('logs in with email/password and redirects to /home', () => {

    // 1. Open Login page (now at /login — / is the public home page)
    cy.visit('/login')
    cy.contains('h2', 'Welcome back').should('be.visible')

    // 2. Fill credentials (same email/password from Test 1)
    cy.get("input[name='email']").type(TEST_EMAIL)
    cy.get("input[name='password']").type(TEST_PASSWORD)

    // 3. Click Sign In (id=login-btn)
    cy.get('#login-btn').click()

    // 4. Should redirect to /home
    cy.url().should('include', '/home')
    cy.log('✅ Logged in and redirected to /home')
  })

})
