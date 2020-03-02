import * as path from 'path'
import { generate } from 'escodegen'
import toAst from 'to-ast'
import createLogger from 'glogg'
import { parse, ComponentDoc, Tag } from 'vue-docgen-api'
import defaultSortProps from 'react-styleguidist/lib/loaders/utils/sortProps'
import requireIt from 'react-styleguidist/lib/loaders/utils/requireIt'
import { ComponentProps } from '../types/Component'
import { StyleguidistContext } from '../types/StyleGuide'
import getExamples from './utils/getExamples'
import getComponentVueDoc from './utils/getComponentVueDoc'
import findOrigins from './utils/findOrigins'
import stripOutOrigins from './utils/stripOutOrigins'
import consts from '../scripts/consts'

const logger = createLogger('rsg')
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

	// set dependency tree for mixins an extends
	const originFiles = findOrigins(docs)
	const basedir = path.dirname(file)
	originFiles.forEach(extensionFile => {
		this.addDependency(path.join(basedir, extensionFile))
	})

	// strip out origins if config is set to false to
	// keep origins from displaying
	if (!config.displayOrigins) {
		stripOutOrigins(docs)
	}

	let vsgDocs: ComponentProps = {
		...docs,
		events: makeObject(docs.events),
		slots: makeObject(docs.slots)
	}
	const componentVueDoc = getComponentVueDoc(source, file)
	const isComponentDocInVueFile = !!componentVueDoc
	let ignoreExamplesInFile = false
	if (componentVueDoc) {
		vsgDocs.example = requireIt(`!!${examplesLoader}?customLangs=vue|js|jsx!${file}`)
	} else if (docs.tags) {
		const examples = docs.tags.examples
		if (examples) {
			const examplePaths = examples.map((a: Tag) => a.content)
			if (examplePaths[0] === '[none]') {
				ignoreExamplesInFile = true
			} else {
				vsgDocs.example = examplePaths.map(p =>
					requireIt(`!!${examplesLoader}?customLangs=vue|js|jsx!${p}`)
				)
			}
		}
	}

	if (docs.props) {
		const filteredProps = docs.props.filter(prop => !prop.tags || !prop.tags.ignore)
		const sortProps = config.sortProps || defaultSortProps
		vsgDocs.props = filteredProps ? sortProps(filteredProps) : undefined
	}

	const examplesFile = config.getExampleFilename ? config.getExampleFilename(file) : false
	if (!ignoreExamplesInFile) {
		if (process.env.NODE_ENV !== 'production' && examplesFile && global) {
			global.VUE_STYLEGUIDIST = global.VUE_STYLEGUIDIST || {}
			if (global.VUE_STYLEGUIDIST[examplesFile]) {
				const relativeFile = path.relative(process.cwd(), file)
				if (global.VUE_STYLEGUIDIST[examplesFile] !== relativeFile) {
					logger.warn(
						'\n\n' +
							`${path.relative(process.cwd(), examplesFile)}\n` +
							`this file is used by multiple components.\n` +
							` - ${global.VUE_STYLEGUIDIST[examplesFile]}\n` +
							` - ${relativeFile}\n` +
							'It will be displayed more than once in the styleguide\n' +
							'Check out this cookbook receipe to solve the issue\n' +
							`${
								consts.DOCS_COOKBOOK
							}#i-have-multiple-components-in-the-same-folder-what-can-i-do\n`
					)
				}
			} else {
				global.VUE_STYLEGUIDIST[examplesFile] = path.relative(process.cwd(), file)
			}
		}
		vsgDocs.examples = getExamples(
			file,
			examplesFile,
			docs.displayName,
			config.defaultExample,
			isComponentDocInVueFile
		)
	}

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
