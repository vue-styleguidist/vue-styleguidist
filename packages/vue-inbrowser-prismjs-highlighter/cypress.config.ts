import { defineConfig } from 'cypress'
import * as path from 'path'

export default defineConfig({
	projectId: '3pjqam',

	fixturesFolder: false,
	screenshotsFolder: '../../test/cypress/screenshots',
	videosFolder: '../../test/cypress/videos',

	component: {
		specPattern: path.resolve(__dirname,'src/**/*.cy.ts'),
		indexHtmlFile: path.resolve(__dirname,'../../test/cypress/support/component-index.html'),
    supportFile: false,
		devServer: {
			framework: 'vue',
			bundler: 'vite',
		}
	}
})
