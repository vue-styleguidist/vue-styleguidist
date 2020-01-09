import * as path from 'path'
import { generate } from 'escodegen'
import toAst from 'to-ast'
import createLogger from 'glogg'
import { parse, Tag, ComponentDoc } from 'vue-docgen-api'
import defaultSortProps from 'react-styleguidist/lib/loaders/utils/sortProps'
import requireIt from 'react-styleguidist/lib/loaders/utils/requireIt'
import { ComponentProps } from '../types/Component'
import { StyleguidistContext } from '../types/StyleGuide'
import getExamples from './utils/getExamples'
import getComponentVueDoc from './utils/getComponentVueDoc'

const logger = createLogger('vsg')
const examplesLoader = path.resolve(__dirname, './examples-loader.js')

export default function(this: StyleguidistContext, source: string) {
	const callback = this.async()
	const cb = callback ? callback : () => null
	vuedocLoader
		.call(this, source)
		.then(res => cb(undefined, res))
		.catch(e => {
			throw e
		})
}

function makeObject<T extends { name: string }>(set?: T[]): { [name: string]: T } | undefined {
	if (!set) return undefined
	return set.reduce((acc: { [name: string]: T }, item: T) => {
		acc[item.name] = item
		return acc
	}, {})
}

export async function vuedocLoader(
	this: StyleguidistContext,
	source: string
): Promise<string | undefined> {
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
		await parse(file, {
			alias,
			modules,
			jsx: config.jsxInComponents,
			validExtends: config.validExtends
		})
	const propsParser = config.propsParser || defaultParser

	let docs: ComponentDoc = { displayName: '', exportName: '' }
	try {
		docs = await propsParser(file)
	} catch (e) {
		const componentPath = path.relative(process.cwd(), file)
		logger.warn(`Error parsing ${componentPath}: ${e}`)
	}

	let vsgDocs: ComponentProps = {
		...docs,
		events: makeObject(docs.events),
		slots: makeObject(docs.slots)
	}
	const componentVueDoc = getComponentVueDoc(source, file)
	const isComponentDocInVueFile = !!componentVueDoc
	if (componentVueDoc) {
		vsgDocs.example = requireIt(`!!${examplesLoader}?customLangs=vue|js|jsx!${file}`)
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
			vsgDocs.example = requireIt(`!!${examplesLoader}?customLangs=vue|js|jsx!${examplePath}`)
		}
	}
	if (docs.props) {
		const filteredProps = docs.props.filter(prop => !prop.tags || !prop.tags.ignore)
		const sortProps = config.sortProps || defaultSortProps
		vsgDocs.props = filteredProps ? sortProps(filteredProps) : undefined
	}

	const examplesFile = config.getExampleFilename ? config.getExampleFilename(file) : false
	vsgDocs.examples = getExamples(
		file,
		examplesFile,
		docs.displayName,
		config.defaultExample,
		isComponentDocInVueFile
	)

	if (config.updateDocs) {
		vsgDocs = config.updateDocs(vsgDocs, file)
	}

	return `
		if (module.hot) {
			module.hot.accept([])
		}

		module.exports = ${generate(toAst(vsgDocs))}
	`
}
