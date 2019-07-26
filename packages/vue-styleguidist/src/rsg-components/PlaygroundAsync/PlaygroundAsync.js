import { Component } from 'react'
import { polyfill } from 'react-lifecycles-compat'
import PropTypes from 'prop-types'
import Playground from 'react-styleguidist/lib/client/rsg-components/Playground/Playground'

class PlaygroundAsync extends Component {
	static propTypes = {
		...Playground.propTypes,
		code: PropTypes.object.isRequired
	}

	static contextTypes = Playground.contextTypes

	static getDerivedStateFromProps = Playground.getDerivedStateFromProps

	constructor(props, context) {
		super(props, context)
		Playground.call(this, props, context)
	}

	componentWillUnmount = Playground.prototype.componentWillUnmount

	handleChange = Playground.prototype.handleChange

	handleTabChange = Playground.prototype.handleTabChange

	render() {
		return Playground.prototype.render.call(this)
	}
}

export default polyfill(PlaygroundAsync)
