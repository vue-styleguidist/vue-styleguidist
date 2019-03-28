/**
 * this file is supposed to be run in node to test the examples
 * one can run `npm run start vuex` and get the vuex example
 * launch `npm run build vuetify` and there you have it, the built vuetify example
 */

var examplePath = process.argv[3] || 'basic'

if (examplePath.indexOf('examples/') !== 0) {
	examplePath = 'examples/' + examplePath
}

process.argv[3] = '--config'
process.argv[4] = `${examplePath}/styleguide.config.js`
if (examplePath === 'examples/vuecli3') {
	process.argv[2] = 'styleguidist:build'
	require('@vue/cli-service/bin/vue-cli-service')
} else {
	require('../packages/vue-styleguidist/bin/styleguidist')
}
