import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PlaygroundError from 'rsg-components/PlaygroundError'
import Context from 'rsg-components/Context'
import { addScopedStyle } from 'vue-inbrowser-compiler-utils'
import { DocumentedComponentContext } from '../VsgReactComponent/ReactComponent'
import { RenderJsxContext, EnhanceAppContext } from '../../utils/renderStyleguide'
import { getCompiledExampleComponent } from './getCompiledExampleComponent'
import { getVueAppFactory } from './getVueApp'

const getVueApp = getVueAppFactory()

class PreviewAsync extends Component {
	static propTypes = {
		code: PropTypes.shape({
			raw: PropTypes.string.isRequired,
			compiled: PropTypes.oneOfType([
				PropTypes.shape({
					script: PropTypes.string,
					template: PropTypes.string,
					style: PropTypes.string
				}),
				PropTypes.bool
			])
		}).isRequired,
		evalInContext: PropTypes.func.isRequired,
		vuex: PropTypes.object,
		component: PropTypes.object,
		renderRootJsx: PropTypes.object,
		enhancePreviewApp: PropTypes.func.isRequired
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

		if (this.props.code.compiled) {
			this.setCompiledPreview(this.props.code.compiled)
		} else {
			this.executeCode(this.props.code.raw)
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return this.state.error !== nextState.error || this.props.code !== nextProps.code
	}

	componentDidUpdate(prevProps) {
		if (this.props.code.raw !== prevProps.code.raw) {
			this.executeCode(this.props.code.raw)
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
				el,
				() => {}
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

	executeCode(newCode) {
		import(/* webpackChunkName: "compiler" */ 'vue-inbrowser-compiler')
			.then(opts => {
				this.setState({
					error: null
				})

				return opts
			})
			.then(opts => {
				const moduleId = 'v-' + Math.floor(Math.random() * 1000) + 1
				const { compile } = opts
				try {
					const example = compile(newCode, {
						...this.context.config.compilerConfig,
						...(this.context.config.jsxInExamples
							? { jsx: '__pragma__(h)', objectAssign: 'concatenate' }
							: {}),
						moduleId
					})
					this.setCompiledPreview(example, moduleId)
				} catch (err) {
					this.handleError(err)
				}
			})
	}

	setCompiledPreview(example, moduleId) {
		const { vuex, component, renderRootJsx, enhancePreviewApp } = this.props
		let el = this.mountNode.children[0]
		if (!el) {
			this.mountNode.innerHTML = ' '
			this.mountNode.appendChild(document.createElement('div'))
			el = this.mountNode.children[0]
		}

		const { app, style } = getCompiledExampleComponent({
			compiledExample: example,
			evalInContext: this.props.evalInContext,
			vuex,
			component,
			renderRootJsx,
			enhancePreviewApp,
			destroyVueInstance: () => this.destroyVueInstance(),
			handleError: e => {
				this.handleError(e)
			},
			el,
			locallyRegisterComponents: this.context.config.locallyRegisterComponents,
			moduleId
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
		<EnhanceAppContext.Consumer>
			{enhancePreviewApp => (
				<RenderJsxContext.Consumer>
					{renderRootJsx => (
						<DocumentedComponentContext.Consumer>
							{component => (
								<PreviewAsync
									{...props}
									component={component}
									renderRootJsx={renderRootJsx}
									enhancePreviewApp={enhancePreviewApp}
								/>
							)}
						</DocumentedComponentContext.Consumer>
					)}
				</RenderJsxContext.Consumer>
			)}
		</EnhanceAppContext.Consumer>
	)
}
