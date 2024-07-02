/* eslint-disable compat/compat */
/* eslint-disable no-console */
import { execa } from 'execa'
import cypress from 'cypress'

const args = process.argv.slice(2)

let browser

process.on('unhandledRejection', reason => {
	console.log('Unhandled Promise rejection:', reason)
	if (browser) {
		browser.close().then(() => process.exit(1))
	}
	process.exit(1)
})

async function run() {
	const [, results] = await Promise.all([
		execa('http-server', ['-p', '8282', `./examples/${args[0]}/dist`]).stdout.pipe(process.stdout),

		cypress.run({
			browser: 'chrome',
			config: {
				e2e: {
					specPattern: `test/cypress/browser/smoke_test.cy.js`,
					baseUrl: 'http://127.0.0.1:8282'
				}
			}
		})
	])

	if (results.totalFailed > 0) {
		process.exit(1)
	}

	process.exit(0)
}

run()
