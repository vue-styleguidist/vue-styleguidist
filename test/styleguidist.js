/**
 * this file is supposed to be run in node to test the examples
 * one can run `npm run start vuex` and get the vuex example
 * launch `npm run build vuetify` and there you have it, the built vuetify example
 */

var examplePath = process.argv[3] || 'example/basic'

process.argv[3] = '--config'
process.argv[4] = `${examplePath}/styleguide.config.js`

require('../packages/vue-styleguidist/bin/styleguidist')
