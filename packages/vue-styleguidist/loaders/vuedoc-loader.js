const path = require('path')
const generate = require('escodegen').generate
const toAst = require('to-ast')
const logger = require('glogg')('vsg')
const getExamples = require('./utils/getExamples')
const requireIt = require('react-styleguidist/lib/loaders/utils/requireIt')
const getComponentVueDoc = require('./utils/getComponentVueDoc')
// eslint-disable-next-line import/no-unresolved
const vueDocs = require('vue-docgen-api')
const defaultSortProps = require('react-styleguidist/lib/loaders/utils/sortProps')

const examplesLoader = path.resolve(__dirname, './examples-loader.js')

module.exports = function(source) {
	const file = this.request.split('!').pop()
	const config = this._styleguidist

	// Setup Webpack context dependencies to enable hot reload when adding new files or updating any of component dependencies
	if (config.contextDependencies) {
		config.contextDependencies.forEach(dir => this.addContextDependency(dir))
	}

	const webpackConfig = config.webpackConfig ? config.webpackConfig : {}
	let alias = {}
	let modules = null
	if (webpackConfig.resolve) {
		alias = webpackConfig.resolve.alias
		modules = webpackConfig.resolve.modules
	}
	const defaultParser = file => vueDocs.parse(file, { alias, modules, jsx: config.jsxInComponents })
	const propsParser = config.propsParser || defaultParser

	let docs = {}
	let isComponentDocInVueFile = false
	try {
		docs = propsParser(file, source)

		const componentVueDoc = getComponentVueDoc(source, file)
		if (componentVueDoc) {
			isComponentDocInVueFile = true
			docs.example = requireIt(`!!${examplesLoader}?customLangs=vue|js|jsx!${file}`)
		} else if (docs.tags) {
			const examples = docs.tags.examples
			if (examples) {
				const examplePath = examples[examples.length - 1].content
				if (examples.length > 1) {
					logger.warn(
						`More than one @example tags specified in component ${path.relative(
							process.cwd(),
							file
						)}\nUsing the last tag to build examples: '${examplePath}'`
					)
				}
				docs.example = requireIt(`!!${examplesLoader}?customLangs=vue|js|jsx!${examplePath}`)
			}
		}
		if (docs.props) {
			const props = docs.props
			Object.keys(props).forEach(key => {
				if (props[key].tags && props[key].tags.ignore) {
					delete props[key]
				}
			})
		}

		if (docs.methods) {
			docs.methods.map(method => {
				method.tags.public = [
					{
						title: 'public',
						description: null,
						type: null
					}
				]
				const params = method.tags.params
				if (params) {
					method.tags.param = params
					delete method.tags.params
				}
				return method
			})
		}
	} catch (err) {
		/* istanbul ignore next */
		const componentPath = path.relative(process.cwd(), file)
		const message = `vue-docgen-api cannot parse ${componentPath}: ${err}\n\n`
		logger.warn(message)
	}

	const componentProps = docs.props
	if (componentProps) {
		// Transform the properties to an array. This will allow sorting
		// TODO: Extract to a module
		const propsAsArray = Object.keys(componentProps).reduce((acc, name) => {
			componentProps[name].name = name
			acc.push(componentProps[name])
			return acc
		}, [])

		const sortProps = config.sortProps || defaultSortProps
		docs.props = sortProps(propsAsArray)
	}

	const examplesFile = config.getExampleFilename(file)
	docs.examples = getExamples(
		file,
		examplesFile,
		docs.displayName,
		config.defaultExample,
		isComponentDocInVueFile
	)

	if (config.updateDocs) {
		docs = config.updateDocs(docs, file)
	}

	return `
		if (module.hot) {
			module.hot.accept([])
		}

		module.exports = ${generate(toAst(docs))}
	`
}
