// Cypress E2E: Tracking flow
const TEST_PASSWORD = 'Test@1234'

describe('Tracking Flow', () => {
  const TEST_EMAIL = `cypress_tracking_${Date.now()}@mailtest.com`
  const TEST_USER = { name: 'Tracker', phone: '9009009000' }

  before(() => {
    cy.task('deleteUserByEmail', TEST_EMAIL)
  })

  it('creates an order and verifies tracking results page', () => {
    // Register + profile
    cy.visit('/register')
    cy.get("input[name='email']").type(TEST_EMAIL)
    cy.get("input[name='password']").type(TEST_PASSWORD)
    cy.get('#register-btn').click()
    cy.get("input[name='name']").type(TEST_USER.name)
    cy.get("input[name='phone']").type(TEST_USER.phone)
    cy.get("select[name='role']").select('user')
    cy.get('#profile-submit').click()

    // Create order and go through wizard (fill minimal required fields)
    cy.get('#hero-create-order').click()
    cy.get('#pickup-contact').type('9000000001')
    cy.get('#pickup-address').type('1 Track Ln')
    cy.get('#pickup-city').type('City')
    cy.get('#pickup-pincode').type('400001')
    cy.get('#pickup-state').type('State')
    cy.get('#pickup-next-btn').click()

    cy.get('#delivery-contact').type('9000000002')
    cy.get('#delivery-address').type('2 Track Ave')
    cy.get('#delivery-city').type('City')
    cy.get('#delivery-pincode').type('400002')
    cy.get('#delivery-state').type('State')
    cy.get('#delivery-next-btn').click()

    cy.get('#parcel-weight').type('0.5')
    cy.get('#parcel-next-btn').click()

    // On payment page, capture Order ID from the Order Summary row labelled "Order ID"
    cy.contains('Order ID').parent().find('span').last().should('not.contain', '—').invoke('text').then((orderID) => {
      const id = orderID.trim()
      // Go home and use tracking form
      cy.visit('/home')
      cy.get('input[placeholder="Order ID"]').type(id)
      cy.contains('button', /^TRACK$/).click()
      cy.url().should('include', '/tracking')
      cy.contains(id).should('be.visible')
      cy.contains('Status').should('be.visible')
    })
  })

  after(() => {
    cy.task('deleteUserByEmail', TEST_EMAIL)
  })
})