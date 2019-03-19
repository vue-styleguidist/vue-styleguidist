const examplesLoaderRsg = require('react-styleguidist/lib/loaders/examples-loader').default
const getComponentVueDoc = require('./utils/getComponentVueDoc')

function isVueFile(filepath) {
	return /.vue$/.test(filepath)
}

module.exports = function examplesLoader(source) {
	const file = this.request.split('!').pop()
	if (isVueFile(file)) {
		// if it's a vue file, the examples are in a docs block
		source = getComponentVueDoc(source, file)
	} else {
		// TODO: extract all <script> tags from vue examples
		// in each <script> tag, extract require and imports and start with it
		// acornJsx in https://github.com/styleguidist/react-styleguidist/blob/master/src/loaders/utils/getImports.js
		// does not understand vue syntax
	}
	return examplesLoaderRsg.call(this, source)
}
