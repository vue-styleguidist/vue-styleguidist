var exampleName = process.argv[2] || 'basic'

if (/^--/.test(exampleName)) {
	exampleName = 'basic'
}

const examplePath = require('path').join('examples', exampleName)

process.chdir(examplePath)

process.argv[2] = require('minimist')(process.argv.slice(2)).watch ? '--watch' : undefined

require('../packages/vue-docgen-cli/lib/bin.js')
