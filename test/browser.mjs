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
	await execa('http-server', ['-p', '8282', `./examples/${args[0]}/dist`]).stdout.pipe(
		process.stdout
	)

	await cypress
		.run({
			browser: 'chrome',
			spec: `test/cypress/integration/smoke_test.cy.js`,
			config: {
				e2e: {
					baseUrl: 'http://127.0.0.1:8282'
				}
			}
		})
		.then(results => {
			if (results.totalFailed > 0) {
				process.exit(1)
			}
			process.exit(0)
		})
}

run()
