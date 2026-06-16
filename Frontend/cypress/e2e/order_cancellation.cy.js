// Cypress E2E: Order cancellation
const TEST_PASSWORD = 'Test@1234'

describe('Order Cancellation', () => {
  const TEST_EMAIL = `cypress_cancel_${Date.now()}@mailtest.com`

  before(() => {
    cy.task('deleteUserByEmail', TEST_EMAIL)
  })

  it('creates an order then cancels it from Orders page', () => {
    // Register + profile
    cy.visit('/register')
    cy.get("input[name='email']").type(TEST_EMAIL)
    cy.get("input[name='password']").type(TEST_PASSWORD)
    cy.get('#register-btn').click()
    cy.get('#profile-submit').click()

    // Ensure we're on home page and click Create Order (robust selector + wait)
    cy.visit('/home')
    cy.get('#hero-create-order', { timeout: 10000 }).should('be.visible').click()
    cy.get('#pickup-contact').type('9001110001')
    cy.get('#pickup-address').type('Cancel St 1')
    cy.get('#pickup-city').type('City')
    cy.get('#pickup-pincode').type('400001')
    cy.get('#pickup-state').type('State')
    cy.get('#pickup-next-btn').click()

    cy.get('#delivery-contact').type('9001110002')
    cy.get('#delivery-address').type('Cancel Ave 2')
    cy.get('#delivery-city').type('City')
    cy.get('#delivery-pincode').type('400002')
    cy.get('#delivery-state').type('State')
    cy.get('#delivery-next-btn').click()

    cy.get('#parcel-weight').type('1')
    cy.get('#parcel-next-btn').click()

    // On payment, submit to place order
    cy.get('#submit-payment-btn').click()
    cy.contains('Order Placed!').should('be.visible')

    // After order placement, obtain current user's userid from stored token
    cy.window().then((win) => {
      const token = win.localStorage.getItem('lp_token')
      expect(token).to.exist
      const payload = JSON.parse(atob(token.split('.')[1]))
      const userid = payload.userid

      // Query backend GraphQL to fetch the user's orders and get the latest orderId
      const query = `query GetOrders($userid: String!) { getOrdersByUser(userid: $userid) { orderId } }`
      cy.request({
        method: 'POST',
        url: 'http://localhost:8000/graphql',
        body: { query, variables: { userid } },
        headers: { 'Content-Type': 'application/json' }
      }).then((resp) => {
        const orders = resp.body.data.getOrdersByUser || []
        expect(orders.length).to.be.greaterThan(0)
        const orderId = orders[0].orderId

        // Open profile -> orders and click the specific order by its id
        cy.visit('/profile')
        cy.contains('button', 'Orders').should('be.visible').click()
        cy.contains(orderId).should('be.visible').click()

        // Stub confirm and click cancel button by visible text (handles CSS modules)
        cy.on('window:confirm', () => true)
        cy.contains('button', /Cancel Order|Cancelling\.{3}/, { timeout: 10000 }).should('be.visible').click()

        // Verify cancellation
        cy.contains(/cancelled|Cancelled/i).should('exist')
      })
    })
  })

  after(() => {
    cy.task('deleteUserByEmail', TEST_EMAIL)
  })
})