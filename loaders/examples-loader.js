const rsgExamplesLoader = require('react-styleguidist/loaders/examples-loader');
const getComponentVueDoc = require('./utils/getComponentVueDoc');

function isVueFile(filepath) {
	return /.vue$/.test(filepath);
}

function examplesLoader(source) {
	const file = this.request.split('!').pop();
	if (isVueFile(file)) {
		source = getComponentVueDoc(source, file);
	}
	return rsgExamplesLoader.call(this, source);
}

module.exports = examplesLoader;
