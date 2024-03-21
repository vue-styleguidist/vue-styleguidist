import * as fs from 'fs'
import * as path from 'path'
import { promisify } from 'util'
import { generate } from 'escodegen'
import toAst from 'to-ast'
import createLogger from 'glogg'
import { ComponentDoc, Tag } from 'vue-docgen-api'
import defaultSortProps from 'react-styleguidist/lib/loaders/utils/sortProps'
import requireIt from 'react-styleguidist/lib/loaders/utils/requireIt'
import { LoaderComponentProps } from '../types/Component'
import { StyleguidistContext } from '../types/StyleGuide'
import getExamples from './utils/getExamples'
import getComponentVueDoc from './utils/getComponentVueDoc'
import findOrigins from './utils/findOrigins'
import stripOutOrigins from './utils/stripOutOrigins'
import getParser from './utils/getParser'
import consts from '../scripts/consts'
import alreadyLoadedExamplesCache from './utils/already-loaded-examples-cache'

const exists = promisify(fs.exists)

const logger = createLogger('rsg')
const examplesLoader = path.resolve(__dirname, './examples-loader.js')

export default function (this: StyleguidistContext, source: string) {
	const callback = this.async()
	vuedocLoader
		.call(this, source)
		.then(res => callback(undefined, res))
		.catch(e => {
			throw e
		})
}

function makeObject<T extends { name: string }>(set?: T[]): { [name: string]: T } | undefined {
	if (!set) {
		return undefined
	}
	return set.reduce((acc: { [name: string]: T }, item: T) => {
		acc[item.name] = item
		return acc
	}, {})
}

export async function vuedocLoader(this: StyleguidistContext, source: string): Promise<string> {
	const file = this.request.split('!').pop() as string
	const config = this._styleguidist

	const { noExample = false } = this.getOptions() || {}

	// Setup Webpack context dependencies to enable hot reload when adding new files or updating any of component dependencies
	if (config.contextDependencies) {
		config.contextDependencies.forEach(dir => this.addContextDependency(dir))
	}

	const propsParser = getParser(config)

	const getVsgDocs = async (internalFile: string): Promise<LoaderComponentProps> => {
		let docs: ComponentDoc = { displayName: '', exportName: '', tags: {} }
		try {
			docs = await propsParser(internalFile)
		} catch (e) {
			const componentPath = path.relative(process.cwd(), internalFile)
			logger.warn(`Error parsing ${componentPath}: ${e}`)
		}

		// set dependency tree for mixins and extends
		const originFiles = findOrigins(docs)
		const basedir = path.dirname(internalFile)
		originFiles.forEach(extensionFile => {
			this.addDependency(path.join(basedir, extensionFile))
		})

		// strip out origins if config is set to false to
		// keep origins from displaying
		if (!config.displayOrigins) {
			stripOutOrigins(docs)
		}

		const inSideVsgDocs = {
			...docs,
			events: makeObject(docs.events),
			slots: makeObject(docs.slots)
		}

		if (docs.props) {
			const filteredProps = docs.props.filter(prop => !prop.tags || !prop.tags.ignore)
			const sortProps = config.sortProps || defaultSortProps
			inSideVsgDocs.props = filteredProps ? (sortProps(filteredProps as any[]) as any[]) : undefined
		}

		return inSideVsgDocs
	}

	let vsgDocs = await getVsgDocs(file)

	// examples

	const componentVueDoc = getComponentVueDoc(source, file)
	const isComponentDocInVueFile = !!componentVueDoc

	let ignoreExamplesInFile = noExample
	if (componentVueDoc) {
		vsgDocs.example = requireIt(`!!${examplesLoader}?customLangs=vue|js|jsx!${file}`)
	} else if (vsgDocs.tags) {
		const examples = vsgDocs.tags.examples
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

	if (!ignoreExamplesInFile) {
		let examplesFile = config.getExampleFilename ? config.getExampleFilename(file) : false
		if (examplesFile && (await exists(examplesFile))) {
			if (process.env.NODE_ENV !== 'production' && examplesFile && global) {
				if (alreadyLoadedExamplesCache[examplesFile]) {
					const relativeFile = path.relative(process.cwd(), file)
					if (alreadyLoadedExamplesCache[examplesFile] !== relativeFile) {
						logger.warn(
							'\n\n' +
								`${path.relative(process.cwd(), examplesFile)}\n` +
								`this file is used by multiple components.\n` +
								` - ${alreadyLoadedExamplesCache[examplesFile]}\n` +
								` - ${relativeFile}\n` +
								'It will be displayed more than once in the styleguide\n' +
								'Check out this cookbook receipe to solve the issue\n' +
								`${consts.DOCS_COOKBOOK}#i-have-multiple-components-in-the-same-folder-what-can-i-do\n`
						)
					}
				} else {
					alreadyLoadedExamplesCache[examplesFile] = path.relative(process.cwd(), file)
				}
			}
		} else {
			examplesFile = false
		}
		vsgDocs.examples = getExamples(
			file,
			examplesFile,
			vsgDocs.displayName,
			config.defaultExample,
			isComponentDocInVueFile
		)
	} else {
		vsgDocs.examples = [
			{
				type: 'noexample'
			}
		] as any
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
