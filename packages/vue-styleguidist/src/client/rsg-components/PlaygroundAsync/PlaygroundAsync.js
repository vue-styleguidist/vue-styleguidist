import { Component } from 'react'
import { polyfill } from 'react-lifecycles-compat'
import PropTypes from 'prop-types'
import Context from 'rsg-components/Context'
import Playground from 'react-styleguidist/lib/client/rsg-components/Playground/Playground'

class PlaygroundAsync extends Component {
	static propTypes = {
		...Playground.propTypes,
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
		}).isRequired
	}

	static contextType = Context

	static getDerivedStateFromProps = Playground.getDerivedStateFromProps

	constructor(props, context) {
		super(props, context)
		Playground.call(this, props, context)
	}

	componentWillUnmount = Playground.prototype.componentWillUnmount

	handleChange = Playground.prototype.handleChange

	handleTabChange = Playground.prototype.handleTabChange

	getInitialActiveTab = Playground.prototype.getInitialActiveTab

	render() {
		return Playground.prototype.render.call(this)
	}
}

export default polyfill(PlaygroundAsync)
