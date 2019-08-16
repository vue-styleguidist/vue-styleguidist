const args = require('minimist')(process.argv.slice(2))

if (!/examples[\\/][^\\/]+$/.test(process.cwd())) {
	process.chdir(args._[0])
}

process.argv[2] = args.watch ? '--watch' : undefined

require('../packages/vue-docgen-cli/lib/bin.js')

if (args._.includes('build')) {
	process.argv[2] = 'build'
} else {
	process.argv[2] = 'dev'
}

if (args.watch) {
	process.argv[3] = 'docs'
	require('vuepress/cli')
}
