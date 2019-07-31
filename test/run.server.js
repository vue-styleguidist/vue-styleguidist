const path = require('path')
const styleguidist = require('../packages/vue-styleguidist/scripts')

/* eslint-disable no-console */

const exampleName = process.env.CY_EXAMPLE_FOLDER || 'basic'

const dir = path.resolve(__dirname, '../examples', exampleName)
const config = require(path.join(dir, 'styleguide.config'))

config.logger = {
	info: console.log,
	warn: message => console.warn(`Warning: ${message}`)
}

config.components = path.resolve(dir, config.components)

delete config.ribbon
delete config.usageMode
delete config.exampleMode

styleguidist(config).server((err, config) => {
	if (err) {
		console.warn(err)
	} else {
		const url = `http://localhost:${config.serverPort}`
		console.log(`Listening at ${url}`)
	}
})
