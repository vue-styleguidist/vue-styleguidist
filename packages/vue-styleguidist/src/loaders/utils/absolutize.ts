import * as path from 'path'

// Hack the react scaffolding to be able to load client
export default (filepath: string) =>
	path.resolve(
		path.dirname(require.resolve('vue-styleguidist')),
		'../loaders/utils/client',
		filepath
	)
