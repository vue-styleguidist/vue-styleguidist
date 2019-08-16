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

process.chdir(`./${examplePath}`)

if (examplePath === 'examples/vuecli3' || examplePath === 'examples/svg-loader') {
	const command = process.argv[2] === 'server' ? '' : `:${process.argv[2]}`
	process.argv[2] = `styleguidist${command}`
	require('@vue/cli-service/bin/vue-cli-service')
} else if (/examples\/docgen/.test(examplePath)) {
	process.argv[3] = process.argv[2]
	process.argv[2] = examplePath
	require('./run.cli')
} else {
	require('../packages/vue-styleguidist/bin/styleguidist')
}
