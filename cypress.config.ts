import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: "3pjqam",

	fixturesFolder: false,
	screenshotsFolder: 'test/cypress/screenshots',
	videosFolder: 'test/cypress/videos',

	e2e: {
		baseUrl: 'http://localhost:6060',
		specPattern: 'test/cypress/integration/**/*.cy.{js,jsx,ts,tsx}',
		supportFile: false
	},
})
