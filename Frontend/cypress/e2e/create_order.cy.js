// Cypress E2E: Create Order (full 4-step wizard)
const TEST_PASSWORD = 'Test@1234'
const PROFILE = {
  name: 'Cypress Orderer',
  phone: '9012345678',
  role: 'user',
  address: '12 Test Lane',
  city: 'Mumbai',
  pincode: '400001',
  state: 'Maharashtra'
}

describe('Create Order Flow', () => {
  const TEST_EMAIL = `cypress_order_${Date.now()}@mailtest.com`

  before(() => {
    cy.task('deleteUserByEmail', TEST_EMAIL)
  })

  it('registers, completes profile, creates an order and places payment', () => {
    // Register
    cy.visit('/register')
    cy.contains('h2', 'Create account').should('be.visible')
    cy.get("input[name='email']").type(TEST_EMAIL)
    cy.get("input[name='password']").type(TEST_PASSWORD)
    cy.get('#register-btn').click()
    cy.url().should('include', '/profileSetup')

    // Profile setup
    cy.get("input[name='name']").type(PROFILE.name)
    cy.get("input[name='phone']").type(PROFILE.phone)
    cy.get("select[name='role']").select(PROFILE.role)
    cy.get("textarea[name='address']").type(PROFILE.address)
    cy.get("input[name='city']").type(PROFILE.city)
    cy.get("input[name='pincode']").type(PROFILE.pincode)
    cy.get("input[name='state']").type(PROFILE.state)
    cy.get('#profile-submit').click()

    // Should be redirected to home
    cy.url().should('include', '/home')

    // Create Order -> starts order and navigates to /pickup
    cy.get('#hero-create-order').click()
    cy.url().should('include', '/pickup')

    // Fill Pickup
    cy.get('#pickup-contact').type('9123456789')
    cy.get('#pickup-address').type('12 Cypress St')
    cy.get('#pickup-city').type('Mumbai')
    cy.get('#pickup-pincode').type('400001')
    cy.get('#pickup-state').type('Maharashtra')
    cy.get('#pickup-next-btn').click()
    cy.url().should('include', '/delivery')

    // Fill Delivery
    cy.get('#delivery-contact').type('9988776655')
    cy.get('#delivery-address').type('34 Delivery Rd')
    cy.get('#delivery-city').type('Delhi')
    cy.get('#delivery-pincode').type('110001')
    cy.get('#delivery-state').type('Delhi')
    cy.get('#delivery-next-btn').click()
    cy.url().should('include', '/parcel')

    // Parcel details
    cy.get('#parcel-weight').type('1.5')
    cy.get('#parcel-description').type('Test parcel')
    cy.get('#parcel-next-btn').click()
    cy.url().should('include', '/payment')

    // Payment - assert price displayed and submit
    cy.get('#submit-payment-btn').should('be.visible')
    cy.get('#submit-payment-btn').click()

    // Success page
    cy.contains('h2', 'Order Placed!').should('be.visible')
  })

  after(() => {
    cy.task('deleteUserByEmail', TEST_EMAIL)
  })
})