// Cypress E2E: Password reset flow
const ORIGINAL_PASSWORD = 'Test@1234'
const NEW_PASSWORD = 'NewPass@1234'

describe('Password Reset Flow', () => {
  const TEST_EMAIL = `cypress_reset_${Date.now()}@mailtest.com`

  before(() => {
    cy.task('deleteUserByEmail', TEST_EMAIL)
  })

  it('requests a reset token and resets the password then logs in', () => {
    // Register user
    cy.visit('/register')
    cy.get("input[name='email']").type(TEST_EMAIL)
    cy.get("input[name='password']").type(ORIGINAL_PASSWORD)
    cy.get('#register-btn').click()
    cy.get('#profile-submit').click()

    // Go to Forgot Password
    cy.visit('/forgot-password')
    cy.get('input[type="email"]').type(TEST_EMAIL)
    cy.contains('button', 'Send Reset Link').click()

    // Wait for token to be shown on UI (development mode)
    cy.contains('Reset Code Generated').should('be.visible')
    cy.get('strong').first().invoke('text').then((token) => {
      // Navigate to reset-password with token param (app's flow)
      cy.visit(`/reset-password?email=${encodeURIComponent(TEST_EMAIL)}&token=${encodeURIComponent(token)}`)

      // Fill new password
      cy.get("input[type='password']").first().type(NEW_PASSWORD)
      cy.get("input[type='password']").last().type(NEW_PASSWORD)
      cy.contains('button', 'Reset Password').click()

      // Should show success and redirect to login
      cy.contains('Password Reset Successfully').should('exist')
      cy.visit('/login')

      // Login with new password
      cy.get("input[name='email']").type(TEST_EMAIL)
      cy.get("input[name='password']").type(NEW_PASSWORD)
      cy.get('#login-btn').click()
      cy.url().should('include', '/home')
    })
  })

  after(() => {
    cy.task('deleteUserByEmail', TEST_EMAIL)
  })
})