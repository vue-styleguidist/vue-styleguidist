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
const { isCodeVueSfc, compile } = require('vue-inbrowser-compiler')
const chunkify = require('react-styleguidist/lib/loaders/utils/chunkify').default
const expandDefaultComponent = require('react-styleguidist/lib/loaders/utils/expandDefaultComponent')
const getImports = require('react-styleguidist/lib/loaders/utils/getImports').default
const requireIt = require('react-styleguidist/lib/loaders/utils/requireIt')
const getComponentVueDoc = require('./utils/getComponentVueDoc')
const cleanComponentName = require('./utils/cleanComponentName')
const importCodeExampleFile = require('./utils/importCodeExampleFile')

// Hack the react scaffolding to be able to load client
const absolutize = filepath =>
	path.resolve(
		path.dirname(require.resolve('vue-styleguidist')),
		'../loaders/utils/client',
		filepath
	)

const REQUIRE_IN_RUNTIME_PATH = absolutize('requireInRuntime')
const EVAL_IN_CONTEXT_PATH = absolutize('evalInContext')
const PRAGMA_JSX_PATH = require.resolve('vue-inbrowser-compiler/lib/adaptCreateElement')

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
	const { file, displayName, shouldShowDefaultExample, customLangs } =
		loaderUtils.getOptions(this) || {}

	const cleanDisplayName = displayName ? cleanComponentName(displayName) : undefined
	// Replace placeholders (__COMPONENT__) with the passed-in component name
	if (shouldShowDefaultExample) {
		source = expandDefaultComponent(source, cleanDisplayName)
	}

	const updateExample = props => {
		const p = importCodeExampleFile(props, this.resourcePath, this)
		return config.updateExample ? config.updateExample(p, this.resourcePath) : p
	}

	// Load examples
	const examples = chunkify(source, updateExample, customLangs)

	const getScript = code => {
		// if in JSX mode just parse code as is
		if (config.jsxInExamples) {
			return code
		}

		// script is at the beginning of a line after a return
		// In case we are loading a vue component as an example, extract script tag
		if (isCodeVueSfc(code)) {
			const parts = parseComponent(code)
			return parts && parts.script ? parts.script.content : ''
		}
		//else it could be the weird almost jsx of vue-styleguidist
		return code.split(/\n[\t ]*</)[0]
	}

	const getExampleLiveImports = source => getImports(getScript(source))

	// Find all import statements and require() calls in examples to make them
	// available in webpack context at runtime.
	// Note that we can't just use require() directly at runtime,
	// because webpack changes its name to something like __webpack__require__().
	const allCodeExamples = filter(examples, { type: 'code' })
	const requiresFromExamples = allCodeExamples.reduce((requires, example) => {
		const requiresLocal = getExampleLiveImports(example.content)
		const importPath = example.settings.importpath
		return requires.concat(
			importPath ? requiresLocal.map(path => ({ importPath, path })) : requiresLocal
		)
	}, [])

	// Auto imported modules.
	// We don't need to do anything here to support explicit imports: they will
	// work because both imports (generated below and by rewrite-imports) will
	// be eventually transpiled to `var x = require('x')`, so we'll just have two
	// of them in the same scope, which is fine in non-strict mode
	const fullContext = {
		// Modules, provied by the user
		...config.context,
		// Append the current component module to make it accessible in examples
		// without an explicit import
		...(displayName && config.jsxInExamples ? { [displayName]: file } : {})
	}

	// All required or imported modules
	const allModules = [...requiresFromExamples, ...values(fullContext)]

	// “Prerequire” modules required in Markdown examples and context so they
	// end up in a bundle and be available at runtime
	const allModulesCode = allModules.reduce((requires, requireRequest) => {
		// if we are looking at a remote example
		// resolve the requires from there

		if (requireRequest.importPath) {
			if (!requires[requireRequest.importPath]) {
				requires[requireRequest.importPath] = {}
			}
			const relativePath = /^\./.test(requireRequest.path)
				? path.join(requireRequest.importPath, requireRequest.path)
				: requireRequest.path
			requires[requireRequest.importPath][requireRequest.path] = requireIt(relativePath)
		} else {
			requires[requireRequest] = requireIt(requireRequest)
		}
		return requires
	}, {})

	// Require context modules so they are available in an example
	let marker = -1
	const requireContextCode = b.program(
		flatten(
			map(fullContext, (requireRequest, name) => [
				// const name$0 = require(path);
				b.variableDeclaration('const', [
					b.variableDeclarator(
						b.identifier(`${name}$${++marker}`),
						requireIt(requireRequest).toAST()
					)
				]),
				// const name = name$0.default || name$0;
				b.variableDeclaration('const', [
					b.variableDeclarator(
						b.identifier(name),
						b.logicalExpression(
							'||',
							b.identifier(`${name}$${marker}.default`),
							b.identifier(`${name}$${marker}`)
						)
					)
				])
			])
		)
	)

	// Stringify examples object except the evalInContext function
	const examplesWithEval = examples.map(example => {
		if (example.type === 'code') {
			const importPath = example.settings && example.settings.importpath
			example.evalInContext = {
				toAST: () =>
					b.callExpression(
						b.memberExpression(b.identifier('evalInContext'), b.identifier('bind')),
						[
							b.identifier('null'),
							b.callExpression(
								b.memberExpression(b.identifier('requireInRuntime'), b.identifier('bind')),
								[b.identifier('null'), importPath ? b.literal(importPath) : b.identifier('null')]
							)
						]
					)
			}
			if (config.codeSplit) {
				const compiledExample = compile(example.content, {
					...config.compilerConfig,
					...(config.jsxInExamples ? { jsx: '__pragma__(h)', objectAssign: 'concatenate' } : {})
				})
				example.compiled = {
					script: compiledExample.script,
					template: compiledExample.template,
					style: compiledExample.style
				}
			}
		}
		return example
	})

	return `
if (module.hot) {
	module.hot.accept([])
}
var requireMap = ${generate(toAst(allModulesCode))};
var requireInRuntimeBase = require(${JSON.stringify(REQUIRE_IN_RUNTIME_PATH)});
var requireInRuntime = requireInRuntimeBase.bind(null, requireMap);
var evalInContextBase = require(${JSON.stringify(EVAL_IN_CONTEXT_PATH)});${
		config.jsxInExamples
			? `
var pragma = require(${JSON.stringify(PRAGMA_JSX_PATH)});
var evalInContext = evalInContextBase.bind(null, 
	${JSON.stringify(generate(requireContextCode))}, 
	pragma.default, pragma.concatenate);`
			: `
var evalInContext = evalInContextBase.bind(null, 
	${JSON.stringify(generate(requireContextCode))}, 
	null, null)`
	}
module.exports = ${generate(toAst(examplesWithEval))}`
}
