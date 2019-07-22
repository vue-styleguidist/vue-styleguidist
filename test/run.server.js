const path = require('path')
// eslint-disable-next-line import/no-unresolved
const cypress = require('cypress')
const styleguidist = require('../packages/vue-styleguidist/scripts')

/* eslint-disable no-console */

const exampleName = process.argv[2] || 'basic'

const dir = path.resolve(__dirname, '../examples', exampleName)
const config = require(path.join(dir, 'styleguide.config'))

config.logger = {
	info: console.log,
	warn: message => console.warn(`Warning: ${message}`)
}

config.components = path.resolve(dir, 'src/components/**/[A-Z]*.{vue,jsx}')

delete config.ribbon
delete config.usageMode
delete config.exampleMode

const { app } = styleguidist(config).server(err => {
	if (err) {
		throw err
	} else {
		cypress
			.run({
				spec: [path.join(__dirname, 'cypress/integration', exampleName, '*_spec.js')]
			})
			.then(() => {
				app.close()
			})
			.catch(err => {
				throw err
			})
	}
})
