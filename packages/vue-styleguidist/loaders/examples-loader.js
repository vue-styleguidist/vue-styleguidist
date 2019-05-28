const path = require('path')
const filter = require('lodash/filter')
const map = require('lodash/map')
const values = require('lodash/values')
const flatten = require('lodash/flatten')
const loaderUtils = require('loader-utils')
const generate = require('escodegen').generate
const toAst = require('to-ast')
const b = require('ast-types').builders
const { parseComponent } = require('vue-template-compiler')
const { isCodeVueSfc } = require('vue-inbrowser-compiler')
const chunkify = require('react-styleguidist/lib/loaders/utils/chunkify').default
const expandDefaultComponent = require('react-styleguidist/lib/loaders/utils/expandDefaultComponent')
const getImports = require('react-styleguidist/lib/loaders/utils/getImports').default
const requireIt = require('react-styleguidist/lib/loaders/utils/requireIt')
const getComponentVueDoc = require('./utils/getComponentVueDoc')
const cleanComponentName = require('./utils/cleanComponentName')

// Hack the react scaffolding to be able to load client
const absolutize = filepath =>
	path.resolve(
		path.dirname(require.resolve('react-styleguidist')),
		'../loaders/utils/client',
		filepath
	)

const REQUIRE_IN_RUNTIME_PATH = absolutize('requireInRuntime')
const EVAL_IN_CONTEXT_PATH = absolutize('evalInContext')

function isVueFile(filepath) {
	return /.vue$/.test(filepath)
}

module.exports = function examplesLoader(source) {
	const filePath = this.request.split('!').pop()
	if (isVueFile(filePath)) {
		// if it's a vue file, the examples are in a docs block
		source = getComponentVueDoc(source, filePath)
	}
	const config = this._styleguidist
	const { displayName, shouldShowDefaultExample, customLangs } = loaderUtils.getOptions(this) || {}

	const cleanDisplayName = displayName ? cleanComponentName(displayName) : undefined
	// Replace placeholders (__COMPONENT__) with the passed-in component name
	if (shouldShowDefaultExample) {
		source = expandDefaultComponent(source, cleanDisplayName)
	}

	const updateExample = config.updateExample
		? props => config.updateExample(props, this.resourcePath)
		: undefined

	// Load examples
	const examples = chunkify(source, updateExample, customLangs)

	const getScript = code => {
		// script is at the beginning of a line after a return
		// In case we are loading a vue component as an example, extract script tag
		if (isCodeVueSfc(code)) {
			const parts = parseComponent(code)
			return parts && parts.script ? parts.script.content : ''
		}
		//else it could be the weird almost jsx of vue-styleguidist
		return code.split(/\n[\t ]*</)[0]
	}

	const getExampleLiveImports = source => {
		return getImports(getScript(source))
	}

	// Find all import statements and require() calls in examples to make them
	// available in webpack context at runtime.
	// Note that we can't just use require() directly at runtime,
	// because webpack changes its name to something like __webpack__require__().
	const allCodeExamples = filter(examples, { type: 'code' })
	const requiresFromExamples = allCodeExamples.reduce((requires, example) => {
		return requires.concat(getExampleLiveImports(example.content))
	}, [])

	// All required or imported modules
	const allModules = [...requiresFromExamples, ...values(config.context)]

	// “Prerequire” modules required in Markdown examples and context so they
	// end up in a bundle and be available at runtime
	const allModulesCode = allModules.reduce((requires, requireRequest) => {
		requires[requireRequest] = requireIt(requireRequest)
		return requires
	}, {})

	// Require context modules so they are available in an example
	const requireContextCode = b.program(
		flatten(
			map(config.context, (requireRequest, name) => [
				// const name$0 = require(path);
				b.variableDeclaration('const', [
					b.variableDeclarator(b.identifier(`${name}$0`), requireIt(requireRequest).toAST())
				]),
				// const name = name$0.default || name$0;
				b.variableDeclaration('const', [
					b.variableDeclarator(
						b.identifier(name),
						b.logicalExpression('||', b.identifier(`${name}$0.default`), b.identifier(`${name}$0`))
					)
				])
			])
		)
	)

	// Stringify examples object except the evalInContext function
	const examplesWithEval = examples.map(example => {
		if (example.type === 'code') {
			example.evalInContext = { toAST: () => b.identifier('evalInContext') }
		}
		return example
	})

	return `
if (module.hot) {
	module.hot.accept([])
}
var requireMap = ${generate(toAst(allModulesCode))};
var requireInRuntimeBase = require(${JSON.stringify(REQUIRE_IN_RUNTIME_PATH)}).default;
var requireInRuntime = requireInRuntimeBase.bind(null, requireMap);
var evalInContextBase = require(${JSON.stringify(EVAL_IN_CONTEXT_PATH)}).default;
var evalInContext = evalInContextBase.bind(null, ${JSON.stringify(
		generate(requireContextCode)
	)}, requireInRuntime);
module.exports = ${generate(toAst(examplesWithEval))}
	`
}
