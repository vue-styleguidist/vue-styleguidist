import React, { Component } from 'react'
import PropTypes from 'prop-types'
import map from 'lodash/map'
import getDefaultExample from 'vue-docgen-api/dist/utils/getDefaultExample'
import Styled from 'rsg-components/Styled'
import Markdown from 'rsg-components/Markdown'
import { DOCS_DOCUMENTING } from '../../../scripts/consts'
import { DocumentedComponentContext } from '../VsgReactComponent/ReactComponent'

const styles = ({ fontFamily, fontSize, color }) => ({
	button: {
		padding: 0,
		fontSize: fontSize.base,
		fontFamily: fontFamily.base,
		textDecoration: 'underline',
		color: color.light,
		border: 0,
		cursor: 'pointer',
		background: 'transparent',
		'&:hover, &:active': {
			isolate: false,
			color: color.lightest
		}
	}
})

export function propsToArray(props) {
	return map(props, (prop, name) => ({ ...prop, name }))
}

export class ExamplePlaceholderRendererWithDoc extends Component {
	static propTypes = {
		classes: PropTypes.object.isRequired,
		name: PropTypes.string,
		component: PropTypes.object
	}

	constructor(props) {
		super()
		this.handleOpen = this.handleOpen.bind(this)
		const {
			component: {
				props: { tags }
			}
		} = props
		this.state = {
			shouldDisplay:
				!tags ||
				!tags.examples ||
				!tags.examples.length ||
				tags.examples[tags.examples.length - 1].content !== '[none]',
			isVisible: false
		}
	}

	handleOpen() {
		this.setState({ isVisible: true })
	}

	render() {
		const { isVisible, shouldDisplay } = this.state

		// in case we have an ignored example file
		// do not display the helper text
		if (!shouldDisplay) {
			return <div />
		}

		const {
			classes,
			name,
			component: { props }
		} = this.props

		if (isVisible) {
			return (
				<Markdown
					text={`
Create **Readme.md** or **${name}.md** file in the component’s folder like this:

    ${name} example:

    \`\`\`vue
    ${getDefaultExample({
			...props,
			props: propsToArray(props.props),
			slots: propsToArray(props.slots),
			events: propsToArray(props.events)
		})}
    \`\`\`

You can also add examples and documentation in the \`<docs>\` block of your \`.vue\` Single File Component.

You may need to **restart** the style guide server after adding an example file.

Read more in the [documenting components guide](${DOCS_DOCUMENTING}).
					`}
				/>
			)
		}

		return (
			<button className={classes.button} onClick={this.handleOpen}>
				Add examples to this component
			</button>
		)
	}
}

export function ExamplePlaceholderRenderer(props) {
	return (
		<DocumentedComponentContext.Consumer>
			{component => <ExamplePlaceholderRendererWithDoc {...props} component={component} />}
		</DocumentedComponentContext.Consumer>
	)
}

export default Styled(styles)(ExamplePlaceholderRenderer)
