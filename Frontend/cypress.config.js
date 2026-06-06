import { defineConfig } from 'cypress'
import { MongoClient } from 'mongodb'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    viewportWidth: 1280,
    viewportHeight: 900,
    defaultCommandTimeout: 10000,
    supportFile: 'cypress/support/e2e.js',
    allowCypressEnv: false,

    setupNodeEvents(on, config) {
      // ── Task: query MongoDB to verify a user record was saved ──────────
      on('task', {
        async findUserByEmail(email) {
          const client = new MongoClient('mongodb://localhost:27017')
          await client.connect()
          const user = await client
            .db('Logistics')
            .collection('users')
            .findOne({ email })
          await client.close()
          return user   // returns null if not found (Cypress handles null fine)
        },

        async deleteUserByEmail(email) {
          const client = new MongoClient('mongodb://localhost:27017')
          await client.connect()
          await client.db('Logistics').collection('users').deleteOne({ email })
          await client.close()
          return null
        },
      })
    },
  },
})

