'use strict';

const path = require('path');
const generate = require('escodegen').generate;
const toAst = require('to-ast');
const getExamples = require('./utils/getExamples');
const requireIt = require('./utils/requireIt');
const vueDocs = require('vue-docgen-api');
const examplesLoader = path.resolve(__dirname, './examples-loader.js');

/* eslint-disable no-console */
module.exports = function(source) {
	/* istanbul ignore if */
	if (this.cacheable) {
		this.cacheable();
	}

	const file = this.request.split('!').pop();
	const config = this._styleguidist;
	let componentInfo = {};
	const defaultParser = file => vueDocs.parse(file);
	const propsParser = config.propsParser || defaultParser;

	try {
		componentInfo = propsParser(file, source);
	} catch (err) {
		/* istanbul ignore next */
		const componentPath = path.relative(process.cwd(), file);
		const message =
			`Error when parsing ${componentPath}: ${err}\n\n` +
			'It usually means that vue-docgen-api cannot parse your source code, try to file an issue here:\n' +
			'https://github.com/vue-styleguidist/vue-docgen-api/issues';
		console.log(`\n${message}\n`);
	}

	if (componentInfo.methods) {
		componentInfo.methods.map(method => {
			method.tags.public = [
				{
					title: 'public',
					description: null,
					type: null,
				},
			];
			const params = method.tags.params;
			if (params) {
				method.tags.param = params;
				delete method.tags.params;
			}
			return method;
		});
	}
	if (componentInfo.tags) {
		const examples = componentInfo.tags.examples;
		if (examples) {
			const examplePath = examples[examples.length - 1].description;
			componentInfo.example = requireIt(`!!${examplesLoader}!${examplePath}`);
		}
	}
	if (componentInfo.props) {
		const props = componentInfo.props;
		Object.keys(props).forEach(key => {
			if (props[key].tags && props[key].tags.ignore) {
				delete props[key];
			}
		});
	}
	const examplesFile = config.getExampleFilename(file);
	componentInfo.examples = getExamples(
		examplesFile,
		componentInfo.displayName,
		config.defaultExample
	);

	return `
		if (module.hot) {
			module.hot.accept([])
		}

		module.exports = ${generate(toAst(componentInfo))}
	`;
};
