const path = require('path')

/**
 * this file is supposed to be run in node to test the examples
 * one can run `npm run start vuex` and get the vuex example
 * launch `npm run build vuetify` and there you have it, the built vuetify example
 */

var examplePath = process.argv[3] || 'basic'
if (/^--/.test(examplePath)) {
	examplePath = 'basic'
}

if (examplePath.indexOf('examples/') !== 0) {
	examplePath = 'examples/' + examplePath
}

if (/^examples[\\/]vuecli3/.test(examplePath) || examplePath === 'examples/svg-loader') {
	process.chdir(path.join(__dirname, `../${examplePath}`))
	const command = process.argv[2] === 'server' ? '' : `:${process.argv[2]}`
	process.argv[2] = `styleguidist${command}`
	require('@vue/cli-service/bin/vue-cli-service')
} else if (/^examples[\\/]docgen/.test(examplePath)) {
	const command = process.argv[2]
	process.argv[2] = process.argv[3]
	process.argv[3] = command === 'server' ? 'dev' : command
	require('./run.cli')
} else {
	process.chdir(path.join(__dirname, `../${examplePath}`))
	require('../packages/vue-styleguidist/lib/bin/styleguidist')
}
