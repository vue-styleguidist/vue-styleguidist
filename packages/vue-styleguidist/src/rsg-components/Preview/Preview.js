import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { transform } from 'buble'
import PlaygroundError from 'rsg-components/PlaygroundError'
import Vue from 'vue'
import styleScoper from '../../utils/styleScoper'
import separateScript from '../../utils/separateScript'

const compileCode = (code, config) => transform(code, config).code

const Fragment = React.Fragment ? React.Fragment : 'div'

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
		let exampleComponent
		if (!code) {
			return
		}

		let extendsComponent = {}
		let previewComponent = {}

		try {
			compuse = separateScript(code)
			if (compuse.script) {
				// When it's a full script or an SFC
				const compiledCode = this.compileCode(compuse.script)
				exampleComponent = this.evalInContext(compiledCode)
				previewComponent = exampleComponent()

				if (previewComponent.el) {
					delete previewComponent.el
				}
			} else {
				// When it's just a template
				const template = `<div>${compuse.html}</div>`
				previewComponent = {
					template
				}
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

	evalInContext(compiledCode) {
		// When it's a full script or a SFC
		const exampleComponentCode = `
				function getConfig() {
					eval(
						${JSON.stringify(compiledCode)}
					);
					return __component__;
				}

				// Ignore: Extract the configuration of the example component
				function Vue(params){ __component__ = params }
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
