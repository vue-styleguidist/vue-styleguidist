import * as path from 'path'
import { generate } from 'escodegen'
import toAst from 'to-ast'
import createLogger from 'glogg'
import { parse, Tag, PropDescriptor } from 'vue-docgen-api'
import defaultSortProps from 'react-styleguidist/lib/loaders/utils/sortProps'
import requireIt from 'react-styleguidist/lib/loaders/utils/requireIt'
import { StyleguidistContext } from '../types/StyleGuide'
import getExamples from './utils/getExamples'
import getComponentVueDoc from './utils/getComponentVueDoc'

const logger = createLogger('vsg')
const examplesLoader = path.resolve(__dirname, './examples-loader.js')

export default function(this: StyleguidistContext, source: string) {
	var callback = this.async()
	const file = this.request.split('!').pop()
	if (!file) return
	const config = this._styleguidist

	// Setup Webpack context dependencies to enable hot reload when adding new files or updating any of component dependencies
	if (config.contextDependencies) {
		config.contextDependencies.forEach(dir => this.addContextDependency(dir))
	}

	const webpackConfig = config.webpackConfig ? config.webpackConfig : {}
	let alias: { [key: string]: string } | undefined
	let modules: string[] | undefined
	if (webpackConfig.resolve) {
		alias = webpackConfig.resolve.alias
		modules = webpackConfig.resolve.modules
	}
	const defaultParser = async (file: string) =>
		await parse(file, { alias, modules, jsx: config.jsxInComponents })
	const propsParser = config.propsParser || defaultParser

	propsParser(file)
		.then(docs => {
			const componentVueDoc = getComponentVueDoc(source, file)
			const isComponentDocInVueFile = !!componentVueDoc
			if (componentVueDoc) {
				docs.example = requireIt(`!!${examplesLoader}?customLangs=vue|js|jsx!${file}`)
			} else if (docs.tags) {
				const examples = docs.tags.examples
				if (examples) {
					const examplePath = (examples[examples.length - 1] as Tag).content
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
					method.tags = method.tags || {}
					method.tags.public = [
						{
							title: 'public'
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

			const componentProps = docs.props
			if (componentProps) {
				// Transform the properties to an array. This will allow sorting
				// TODO: Extract to a module
				const propsAsArray = Object.keys(componentProps).reduce((acc: PropDescriptor[], name) => {
					componentProps[name].name = name
					acc.push(componentProps[name])
					return acc
				}, [])

				const sortProps = config.sortProps || defaultSortProps
				docs.props = sortProps(propsAsArray)
			}

			const examplesFile = config.getExampleFilename ? config.getExampleFilename(file) : false

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

			callback &&
				callback(
					null,
					`
		if (module.hot) {
			module.hot.accept([])
		}

		module.exports = ${generate(toAst(docs))}
	`
				)
		})
		.catch(err => {
			/* istanbul ignore next */
			const componentPath = path.relative(process.cwd(), file)
			const message = `vue-docgen-api cannot parse ${componentPath}: ${err}\n\n`
			logger.warn(message)
		})
}
