import React, { Component } from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash/debounce'
import MonacoEditor from 'react-monaco-editor'
import Context from 'rsg-components/Context'

const UPDATE_DELAY = 10

export class Editor extends Component {
	static propTypes = {
		code: PropTypes.string.isRequired,
		onChange: PropTypes.func,
		editorConfig: PropTypes.object
	}
	static contextType = Context

	location = ''

	constructor() {
		super()
		this.handleChange = debounce(this.handleChange.bind(this), UPDATE_DELAY)
		this.location = document.location.href
	}

	shouldComponentUpdate(nextProps) {
		const differentLocation = this.location !== document.location.href
		if (
			(differentLocation || this.getEditorConfig(nextProps).readOnly) &&
			nextProps.code !== this.props.code
		) {
			this.location = document.location.href
			return true
		}
		return false
	}

	getEditorConfig(props) {
		return {
			...this.context.config.editorConfig,
			...props.editorConfig
		}
	}

	handleChange(editor, metadata, newCode) {
		const { onChange } = this.props
		if (onChange) {
			onChange(newCode)
		}
	}

	render() {
		const { code } = this.props
		return (
			<MonacoEditor
				height={200}
				theme="vs-dark"
				value={code}
				onChange={this.handleChange}
				options={{ ...this.getEditorConfig(this.props), lineNumbers: true }}
			/>
		)
	}
}

export default Editor
