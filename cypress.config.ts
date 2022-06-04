import { defineConfig } from 'cypress'

export default defineConfig({
  fixturesFolder: false,
  screenshotsFolder: 'test/cypress/screenshots',
  videosFolder: 'test/cypress/videos',
  video: false,
  e2e: {
    baseUrl: 'http://localhost:6060',
    specPattern: 'test/cypress/integration/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: false,
  },
})
