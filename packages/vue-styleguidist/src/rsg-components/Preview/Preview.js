import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { transform } from 'buble'
import PlaygroundError from 'rsg-components/PlaygroundError'
import Vue from 'vue'
import { DocumentedComponentContext } from '../VsgReactComponent/ReactComponent'
import { RenderJsxContext } from '../../utils/renderStyleguide'
import styleScoper from './utils/styleScoper'
import separateScript from './utils/separateScript'
import getVars from './utils/getVars'
import cleanComponentName from '../../utils/cleanComponentName'

const Fragment = React.Fragment ? React.Fragment : 'div'

class Preview extends Component {
	static propTypes = {
		code: PropTypes.string.isRequired,
		evalInContext: PropTypes.func.isRequired,
		vuex: PropTypes.object,
		component: PropTypes.object,
		renderRootJsx: PropTypes.object
	}
	static contextTypes = {
		config: PropTypes.object.isRequired,
		codeRevision: PropTypes.number.isRequired
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

		const { code, vuex, component, renderRootJsx } = this.props

		const documentedComponent = component.module.default || component.module
		component.displayName = cleanComponentName(this.props.component.name)
		if (!code) {
			return
		}

		let style
		let previewComponent = {}
		let listVars = []

		try {
			const compuse = separateScript(code)
			style = compuse.style
			if (compuse.html && compuse.script.length) {
				// When it's a template preceeded by a script (vsg format)
				// NOTA: if it is an SFC, the html template will be added in the script

				// extract all variable to set them up as data in the component
				// this way we can use in the template what is defined in the script
				listVars = getVars(compuse.script)
			}
			if (compuse.script) {
				// compile and execute the script
				// it can be:
				// - a script setting up variables => we set up the data function of previewComponent
				// - a `new Vue()` script that will return a full config object
				const compiledCode = this.compileCode(compuse.script)
				previewComponent = this.evalInContext(compiledCode, listVars)() || {}
			}
			if (compuse.html) {
				// if this is a pure template or if we are in hybrid vsg mode,
				// we need to set the template up.
				const template = `<div>${compuse.html}</div>`
				previewComponent.template = template
			}
		} catch (err) {
			this.handleError(err)
			previewComponent.template = ''
		}

		let el = this.mountNode.children[0]
		if (!el) {
			this.mountNode.innerHTML = ' '
			this.mountNode.appendChild(document.createElement('div'))
			el = this.mountNode.children[0]
		}

		let extendsComponent = {}
		if (vuex) {
			extendsComponent = { store: vuex.default }
		}
		const moduleId = 'data-v-' + Math.floor(Math.random() * 1000) + 1
		previewComponent._scopeId = moduleId

		if (
			this.context.config.locallyRegisterComponents &&
			documentedComponent &&
			!previewComponent.components
		) {
			// register component locally
			previewComponent.components = {
				[component.displayName]: documentedComponent
			}
		}

		// then we just have to render the setup previewComponent in the prepared slot
		const rootComponent = renderRootJsx
			? renderRootJsx.default(previewComponent)
			: { render: createElement => createElement(previewComponent) }

		const vueInstance = new Vue({
			...extendsComponent,
			...rootComponent,
			el
		})

		// Add the scoped style if there is any
		if (style) {
			const styleContainer = document.createElement('div')
			styleContainer.innerHTML = style
			styleContainer.firstChild.id = moduleId
			vueInstance.$el.appendChild(styleContainer.firstChild)
		}
		styleScoper()
	}

	compileCode(code) {
		try {
			return transform(code, this.context.config.compilerConfig).code
		} catch (err) {
			this.handleError(err)
		}
		return false
	}

	evalInContext(compiledCode, listVars) {
		const exampleComponentCode = `let __component__ = {}
	${
		// run script for SFC and full scripts
		// and set config object in __component__
		// if the structure is vsg mode, define local variables
		// to set them up in the next step
		compiledCode
	};__component__.data=__component__.data||function(){return {${
			// add local vars in data
			// this is done through an object like {varName: varName}
			// since each varName is defined in compiledCode, it can be used to init
			// the data object here
			listVars.map(varName => `${varName}:${varName}`).join(',')
		}};};
	// When wiriting "new Vue({name: 'MyComponent'})" the config object
	// is assigned to the variable __component__
	function Vue(params){ __component__ = params; }
	// Then we simply return the __component__ variable
	return __component__;`
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

export default function PreviewWithComponent(props) {
	return (
		<RenderJsxContext.Consumer>
			{renderRootJsx => (
				<DocumentedComponentContext.Consumer>
					{component => <Preview {...props} component={component} renderRootJsx={renderRootJsx} />}
				</DocumentedComponentContext.Consumer>
			)}
		</RenderJsxContext.Consumer>
	)
}
