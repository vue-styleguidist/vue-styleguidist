import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { addScopedStyle, compile } from 'vue-inbrowser-compiler'
import PlaygroundError from 'rsg-components/PlaygroundError'
import Context from 'rsg-components/Context'
import { DocumentedComponentContext } from '../VsgReactComponent/ReactComponent'
import { RenderJsxContext } from '../../utils/renderStyleguide'
import { getCompiledExampleComponent } from './getCompiledExampleComponent'
import { getVueApp } from './getVueApp'

class Preview extends Component {
	static propTypes = {
		code: PropTypes.string.isRequired,
		evalInContext: PropTypes.func.isRequired,
		vuex: PropTypes.object,
		component: PropTypes.object,
		renderRootJsx: PropTypes.object
	}
	static contextType = Context

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
		this.destroyVueInstance()
		if (this.mountNode) {
			let el = this.mountNode.children[0]
			if (!el) {
				this.mountNode.innerHTML = ' '
				this.mountNode.appendChild(document.createElement('div'))
				el = this.mountNode.children[0]
			}
			this.vueInstance?.unmount?.()
			el = getVueApp(
				{
					data: () => ({}),
					template: '<div></div>'
				},
				el
			)
		}
	}

	destroyVueInstance() {
		if (this.vueInstance) {
			try {
				this.vueInstance.unmount?.()
				this.vueInstance.$destroy?.()
			} catch (err) {
				// eat the error
			}
			this.vueInstance = null
		}
	}

	executeCode() {
		this.setState({
			error: null
		})

		const { code, vuex, component, renderRootJsx } = this.props
		if (!code) {
			return
		}

		let example
		try {
			example = compile(code, {
				...this.context.config.compilerConfig,
				...(this.context.config.jsxInExamples
					? { jsx: '__pragma__(h)', objectAssign: 'concatenate' }
					: {})
			})
		} catch (err) {
			this.handleError(err)
		}

		let el = this.mountNode.children[0]
		if (!el) {
			this.mountNode.innerHTML = ' '
			this.mountNode.appendChild(document.createElement('div'))
			el = this.mountNode.children[0]
		}

		const { app, style, moduleId } = getCompiledExampleComponent({
			compiledExample: example,
			evalInContext: this.props.evalInContext,
			vuex,
			component,
			renderRootJsx,
			destroyVueInstance: () => this.destroyVueInstance(),
			handleError: e => {
				this.handleError(e)
			},
			el,
			locallyRegisterComponents: this.context.config.locallyRegisterComponents
		})

		this.vueInstance = app
		if (style) {
			addScopedStyle(style, moduleId)
		}
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
			<>
				<div ref={ref => (this.mountNode = ref)}>
					<div />
				</div>
				{error && <PlaygroundError message={error} />}
			</>
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
