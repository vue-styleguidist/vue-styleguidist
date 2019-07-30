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

config.components = path.resolve(dir, 'src/components/**/[A-Z]*.{vue,jsx}')

delete config.ribbon
delete config.usageMode
delete config.exampleMode
delete config.codeSplit

styleguidist(config).server(() => {})
