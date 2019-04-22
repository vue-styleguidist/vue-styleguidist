import { parse } from 'acorn'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { transform } from 'buble'
import PlaygroundError from 'rsg-components/PlaygroundError'
import Vue from 'vue'
import styleScoper from '../../utils/styleScoper'
import separateScript from '../../utils/separateScript'

const compileCode = (code, config) => transform(code, config).code

const Fragment = React.Fragment ? React.Fragment : 'div'

/**
 * extract variable and function declaration from an AST and returns their ids
 * @param {ast} syntaxTree
 */
const getVars = code => {
	const syntaxTree = parse(code)
	const arr = syntaxTree.body.filter(syntax => {
		return syntax.type === 'VariableDeclaration' || syntax.type === 'FunctionDeclaration'
	})
	arr.unshift([])
	return arr.reduce((total, next) => {
		function getId(syntax) {
			if (syntax.declarations) {
				return Array.prototype.concat.apply(
					[],
					syntax.declarations.map(declaration => declaration.id.name)
				)
			}
			return [syntax.id.name]
		}
		total = total.concat(getId(next))
		return total
	})
}

export default class Preview extends Component {
	static propTypes = {
		code: PropTypes.string.isRequired,
		evalInContext: PropTypes.func.isRequired,
		vuex: PropTypes.object
	}
	static contextTypes = {
		config: PropTypes.object.isRequired,
		codeRevision: PropTypes.number.isRequired,
		renderRootJsx: PropTypes.object
	}

	state = {
		error: null
	}

	componentDidMount() {
		// Clear console after hot reload, do not clear on the first load
		// to keep any warnings
		if (this.context.codeRevision > 0) {
			// eslint-disable-next-line no-console
			console.clear()
		}

		this.executeCode()
	}

	shouldComponentUpdate(nextProps, nextState) {
		return this.state.error !== nextState.error || this.props.code !== nextProps.code
	}

	componentDidUpdate(prevProps) {
		if (this.props.code !== prevProps.code) {
			this.executeCode()
		}
	}

	componentWillUnmount() {
		this.unmountPreview()
	}

	unmountPreview() {
		if (this.mountNode) {
			let el = this.mountNode.children[0]
			if (!el) {
				this.mountNode.innerHTML = ' '
				this.mountNode.appendChild(document.createElement('div'))
				el = this.mountNode.children[0]
			}
			el = new Vue({
				el,
				data: {},
				template: '<div></div> '
			})
		}
	}

	executeCode() {
		this.setState({
			error: null
		})

		const { code, vuex } = this.props
		const { renderRootJsx } = this.context
		let compuse = {}
		if (!code) {
			return
		}

		let extendsComponent = {}
		let previewComponent = {}
		let listVars = []

		try {
			compuse = separateScript(code)
			if (compuse.html && compuse.script.length) {
				// When it's a template preceeded by a script (vsg format)
				// extract all variable to set them up as data in the component
				// this way we can use what is defined in script in the template
				listVars = getVars(compuse.script)
			}
			if (compuse.html) {
				const template = `<div>${compuse.html}</div>`
				previewComponent.template = template
			}
			if (compuse.script) {
				const compiledCode = this.compileCode(compuse.script)
				const evalResult = this.evalInContext(compiledCode, listVars)()
				previewComponent = { ...previewComponent, ...evalResult }
			}
		} catch (err) {
			this.handleError(err)
			compuse.html = ''
		}

		let el = this.mountNode.children[0]
		if (!el) {
			this.mountNode.innerHTML = ' '
			this.mountNode.appendChild(document.createElement('div'))
			el = this.mountNode.children[0]
		}

		if (vuex) {
			extendsComponent = { store: vuex.default }
		}
		const moduleId = 'data-v-' + Math.floor(Math.random() * 1000) + 1
		previewComponent._scopeId = moduleId

		const rootComponent = renderRootJsx
			? renderRootJsx.default(previewComponent)
			: { render: createElement => createElement(previewComponent) }
		const vueInstance = new Vue({
			...extendsComponent,
			...rootComponent,
			el
		})

		if (compuse.style) {
			const styleContainer = document.createElement('div')
			styleContainer.innerHTML = compuse.style
			styleContainer.firstChild.id = moduleId
			vueInstance.$el.appendChild(styleContainer.firstChild)
		}
		styleScoper()
	}

	compileCode(code) {
		try {
			return compileCode(code, this.context.config.compilerConfig)
		} catch (err) {
			this.handleError(err)
		}
		return false
	}

	evalInContext(compiledCode, listVars) {
		// When it's a full script or a SFC
		const exampleComponentCode = `
				let __component__ = {}
				function getConfig() {
					eval(${JSON.stringify(
						`${
							// set config object in __component__
							compiledCode
						};__component__.data = __component__.data || function() {return {${
							// add local vars in data
							listVars.map(localVar => `${localVar}: ${localVar},`).join('\n')
						}};};`
					)});
					return __component__;
				}

				// Ignore: Extract the configuration of the example component
				function Vue(params){ __component__ = params; }
				return getConfig();
			`
		return this.props.evalInContext(exampleComponentCode)
	}

	handleError = err => {
		this.unmountPreview()

		this.setState({
			error: err.toString()
		})

		console.error(err) // eslint-disable-line no-console
	}

	render() {
		const { error } = this.state
		return (
			<Fragment>
				<div ref={ref => (this.mountNode = ref)}>
					<div />
				</div>
				{error && <PlaygroundError message={error} />}
			</Fragment>
		)
	}
}
