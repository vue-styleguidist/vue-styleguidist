import pick from 'lodash/pick'
import commonDir from 'common-dir'
import { generate } from 'escodegen'
import flatten from 'lodash/flatten'
import { namedTypes as t, builders as b } from 'ast-types'
import toAst from 'to-ast'
import createLogger from 'glogg'
import * as fileExistsCaseInsensitive from 'react-styleguidist/lib/scripts/utils/findFileCaseInsensitive'
import getAllContentPages from 'react-styleguidist/lib/loaders/utils/getAllContentPages'
import getComponentFilesFromSections from 'react-styleguidist/lib/loaders/utils/getComponentFilesFromSections'
import getComponentPatternsFromSections from 'react-styleguidist/lib/loaders/utils/getComponentPatternsFromSections'
import filterComponentsWithExample from 'react-styleguidist/lib/loaders/utils/filterComponentsWithExample'
import slugger from 'react-styleguidist/lib/loaders/utils/slugger'
import requireIt from 'react-styleguidist/lib/loaders/utils/requireIt'
import resolveESModule from 'react-styleguidist/lib/loaders/utils/resolveESModule'
import { StyleguidistContext } from '../types/StyleGuide'
import getSections from './utils/getSections'

const logger = createLogger('rsg')

const STYLE_VARIABLE_NAME = '__vsgStyles'
const THEME_VARIABLE_NAME = '__vsgTheme'

// Config options that should be passed to the client
const CLIENT_CONFIG_OPTIONS = [
	'title',
	'tocMode',
	'version',
	'showCode',
	'showUsage',
	'showSidebar',
	'previewDelay',
	'theme',
	'styles',
	'compilerConfig',
	'editorConfig',
	'ribbon',
	'pagePerSection',
	'mountPointId',
	'jsxInExamples',
	'jssThemedEditor'
]

export default function() {}
export function pitch(this: StyleguidistContext, source: string): string {
	// Clear cache so it would detect new or renamed files
	fileExistsCaseInsensitive.clearCache()

	// Reset slugger for each code reload to be deterministic
	slugger.reset()

	const config = this._styleguidist
	if (!config.sections) return ''

	let sections = getSections(config.sections, config)
	if (config.skipComponentsWithoutExample) {
		sections = filterComponentsWithExample(sections)
	}

	const allComponentFiles = getComponentFilesFromSections(
		config.sections,
		config.configDir,
		config.ignore
	)
	const allContentPages = getAllContentPages(sections)

	// Nothing to show in the style guide
	const welcomeScreen = allContentPages.length === 0 && allComponentFiles.length === 0
	const patterns = welcomeScreen ? getComponentPatternsFromSections(config.sections) : undefined
	const renderRootJsx = config.renderRootJsx ? requireIt(config.renderRootJsx) : undefined

	logger.debug('Loading components:\n' + allComponentFiles.join('\n'))

	// Setup Webpack context dependencies to enable hot reload when adding new files
	if (config.contextDependencies) {
		config.contextDependencies.forEach((dir: string) => this.addContextDependency(dir))
	} else if (allComponentFiles.length > 0) {
		// Use common parent directory of all components as a context
		this.addContextDependency(commonDir(allComponentFiles))
	}

	const configClone = { ...config }
	const styleContext: any[][] = []

	const setVariableValueToObjectInFile = (memberName: 'theme' | 'styles', varName: string) => {
		const configMember = config[memberName]
		if (typeof configMember === 'string') {
			// first attach the file as a dependency
			this.addDependency(configMember)

			// then create a variable to contain the value of the theme/style
			styleContext.push(resolveESModule(configMember, varName))

			// Finally assign the calculted value to the member of the clone
			// NOTE: if we are mutating the config object without cloning it,
			// it changes the value for all hmr iteration
			// until the process is stopped.
			const variableAst = {}

			// Then override the `toAST()` function, because we know
			// what the output of it should be, an identifier
			Object.defineProperty(variableAst, 'toAST', {
				enumerable: false,
				value(): t.ASTNode {
					return b.identifier(varName)
				}
			})
			configClone[memberName] = variableAst
		}
	}

	setVariableValueToObjectInFile('styles', STYLE_VARIABLE_NAME)
	setVariableValueToObjectInFile('theme', THEME_VARIABLE_NAME)

	const styleguide = {
		config: pick(configClone, CLIENT_CONFIG_OPTIONS),
		welcomeScreen,
		patterns,
		sections,
		renderRootJsx
	}

	return `${generate(b.program(flatten(styleContext)))}
if (module.hot) {
	module.hot.accept([])
}

module.exports = ${generate(toAst(styleguide))}
	`
}
