const path = require('path');
const generate = require('escodegen').generate;
const toAst = require('to-ast');
const logger = require('glogg')('rsg');
const getExamples = require('./utils/getExamples');
const requireIt = require('react-styleguidist/loaders/utils/requireIt');
const getComponentVueDoc = require('./utils/getComponentVueDoc');
const vueDocs = require('vue-docgen-api');
const defaultSortProps = require('react-styleguidist/loaders/utils/sortProps');

const examplesLoader = path.resolve(__dirname, './examples-loader.js');

/* eslint-disable no-console */
module.exports = function(source) {
	const file = this.request.split('!').pop();
	const config = this._styleguidist;

	// Setup Webpack context dependencies to enable hot reload when adding new files or updating any of component dependencies
	if (config.contextDependencies) {
		config.contextDependencies.forEach(dir => this.addContextDependency(dir));
	}

	const webpackConfig = config.webpackConfig ? config.webpackConfig : {};
	let alias = {};
	let modules = null;
	if (webpackConfig.resolve) {
		alias = webpackConfig.resolve.alias;
		modules = webpackConfig.resolve.modules;
	}
	const defaultParser = file => vueDocs.parse(file, { alias, modules });
	const propsParser = config.propsParser || defaultParser;

	let docs = {};
	try {
		docs = propsParser(file, source);

		const componentVueDoc = getComponentVueDoc(source, file);
		if (componentVueDoc) {
			docs.example = requireIt(`!!${examplesLoader}?customLangs=vue|js|jsx!${file}`);
		} else if (docs.tags) {
			const examples = docs.tags.examples;
			if (examples) {
				const examplePath = examples[examples.length - 1].description;
				docs.example = requireIt(`!!${examplesLoader}?customLangs=vue|js|jsx!${examplePath}`);
			}
		}
		if (docs.props) {
			const props = docs.props;
			Object.keys(props).forEach(key => {
				if (props[key].tags && props[key].tags.ignore) {
					delete props[key];
				}
			});
		}

		if (docs.methods) {
			docs.methods.map(method => {
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
	} catch (err) {
		/* istanbul ignore next */
		const componentPath = path.relative(process.cwd(), file);
		const message =
			`Cannot parse ${componentPath}: ${err}\n\n` +
			'It usually means that vue-docgen-api does not understand your source code or when using third-party libraries, try to file an issue here:\n' +
			'https://github.com/vue-styleguidist/vue-docgen-api/issues';
		logger.warn(message);
	}

	const componentProps = docs.props;
	if (componentProps) {
		// Transform the properties to an array. This will allow sorting
		// TODO: Extract to a module
		const propsAsArray = Object.keys(componentProps).reduce((acc, name) => {
			componentProps[name].name = name;
			acc.push(componentProps[name]);
			return acc;
		}, []);

		const sortProps = config.sortProps || defaultSortProps;
		docs.props = sortProps(propsAsArray);
	}

	const examplesFile = config.getExampleFilename(file);
	docs.examples = getExamples(examplesFile, docs.displayName, config.defaultExample);

	if (config.updateDocs) {
		docs = config.updateDocs(docs, file);
	}

	return `
		if (module.hot) {
			module.hot.accept([])
		}

		module.exports = ${generate(toAst(docs))}
	`;
};
